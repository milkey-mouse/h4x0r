import asyncio
from aiohttp import web, web_exceptions
import time
from collections import defaultdict
import subprocess
import asyncssh
import sys

try:
    import simplejson as json
except ImportError:
    import json

MAIN_SITE = "http://google.com/"
TIME_BETWEEN_REQUESTS = 5
MAX_VM_MEMORY = "256M"
WAIT_FOR_VM_KILL = 99999 #25
print("REMEMBER TO REENABLE VM KILLS", file=sys.stderr)
BASE_IMAGE = "cloud-chamber_FINAL_v2.qcow2"
VMS_PER_IP = 8
USE_KVM = True
DRY_RUN = False

vms = set()
vms_per_ip = defaultdict(set)
last_requests = defaultdict(int)
unconnected_vms = set()
connected_vms = set()

import asyncio, asyncssh, sys

class MySSHClientSession(asyncssh.SSHClientSession):
    def data_received(self, data, datatype):
        print(data, end='')

    def connection_lost(self, exc):
        if exc:
            print('SSH session error: ' + str(exc), file=sys.stderr)

@asyncio.coroutine
def run_client():
    with (yield from asyncssh.connect('localhost')) as conn:
        chan, session = yield from conn.create_session(MySSHClientSession,
                                                       'echo $TERM; stty size',
                                                       term_type='xterm-color',
                                                       term_size=(80, 24))
        yield from chan.wait_closed()

try:
    asyncio.get_event_loop().run_until_complete(run_client())
except (OSError, asyncssh.Error) as exc:
    sys.exit('SSH connection failed: ' + str(exc))

def save_data():
    with open("server-state.json", "w") as statefile:
         json.dump({"vms": list(vms), "vms_per_ip": vms_per_ip}, statefile, sort_keys=True, indent=4, separators=(',', ': '))

def load_data():
    try:
        with open("server-state.json") as statefile:
            state = json.load(statefile)
            vms = set(state["vms"])
            vms_per_ip.update(state["vms_per_ip"])
    except OSError:
        pass

def killall():
    for vm in unconnected_vms:
        if vm[2] is not None:
            vm[2].kill()
    for vm in connected_vms:
        if vm[2] is not None:
            vm[2].kill()

async def is_online(vm_id, vm_set):
    for vm in vm_set:
        if vm[1] == vm_id:
            return True
    return False

async def start_vm_request(request):
    vm_id = request.match_info.get("vm_id", None)
    try:
        if (not int(vm_id) in vms) or await is_online(vm_id, unconnected_vms) or await is_online(vm_id, connected_vms):
            return web_exceptions.HTTPBadRequest()
        else:
            await start_vm(vm_id)
            return web_exceptions.HTTPOk()
    except:
        return web_exceptions.HTTPBadRequest()

async def start_vm(vm_id):
    if DRY_RUN:
        unconnected_vms.add((time.time(), vm_id, None))
    else:
        unconnected_vms.add((time.time(), vm_id, subprocess.Popen(["kvm" if USE_KVM else "qemu", "-hda", vm_id + ".qcow2", "-m", MAX_VM_MEMORY, "-redir", "tcp:" + str(5555+int(vm_id)) + "::22", "-nographic"])))
    print("Started VM " + vm_id)
    asyncio.ensure_future(kill_unused_vm(vm_id), loop=loop)

async def connect_to_vm(vm_id):
    to_remove = None
    for vm in unconnected_vms:
        if vm[1] == vm_id:
            connected_vms.add(vm)
            to_remove = vm
            break
    if to_remove:
        unconnected_vms.remove(to_remove)


async def kill_unused_vm(vm_id):
    await asyncio.sleep(WAIT_FOR_VM_KILL)
    to_remove = None
    for vm in unconnected_vms:
        if vm[1] == vm_id:
            print("Killing unconnected VM " + vm_id)
            if vm[2] is not None:
                vm[2].kill()
            to_remove = vm
            break
    if to_remove is not None:
        unconnected_vms.remove(to_remove)

async def vms_for_ip(request):
    ip = request.transport.get_extra_info("peername")[0]
    return web.Response(body=",".join(vms_per_ip[ip]).encode("utf-8"))

async def create_vm(request):
    ip = request.transport.get_extra_info("peername")[0]
    if len(vms_per_ip[ip]) >= VMS_PER_IP:
        print("ERROR: IP " + ip + " already has the max (" + str(VMS_PER_IP) + ") VMs!", file=sys.stderr)
        return web_exceptions.HTTPTooManyRequests(text="You have exceeded the maximum of " + str(VMS_PER_IP) + " VMs per IP address.", reason="Too many VMs")
    vm_id = 1
    if vms:
        vm_id = max(vms) + 1
    vms.add(vm_id)
    vm_id = str(vm_id)
    if not DRY_RUN:
        try:
            subprocess.check_call(["qemu-img", "create", "-f", "qcow2", "-b", BASE_IMAGE, vm_id + ".qcow2"], timeout=10, stdout=sys.stdout, stderr=sys.stderr)
        except subprocess.CalledProcessError:
            print("ERROR: Could not create VM image!", file=sys.stderr)
            return web_exceptions.HTTPInternalvmError()
    vms_per_ip[ip].add(vm_id)
    print("Created VM with ID " + vm_id)
    return web.Response(body=vm_id.encode("utf-8"), status=201)

async def redirect_to_main(request):
    return web_exceptions.HTTPTemporaryRedirect(MAIN_SITE)

async def ratelimit_factory(app, handler):
    async def ratelimit(request):
        for path in RATELIMIT_PATHS:
            if request.path[1:].startswith(path):
                ip = request.transport.get_extra_info("peername")[0]
                time_since_last_request = (time.time() - last_requests[ip])
                if time_since_last_request < TIME_BETWEEN_REQUESTS:
                    #raise web_exceptions.HTTPTooManyRequests()
                    await asyncio.sleep(5 - time_since_last_request)
                last_requests[ip] = time.time()
                break
        return await handler(request)
    return ratelimit

RATELIMIT_PATHS = ["ip_vms", "vm_start"]

async def init(loop):
    app = web.Application(loop=loop, middlewares=[ratelimit_factory])
    app.router.add_route("GET", "/", redirect_to_main)
    app.router.add_route("POST", "/create_vm", create_vm)
    app.router.add_route("GET", "/start_vm/{vm_id}", start_vm_request)
    app.router.add_route("GET", "/ip_vms", vms_for_ip)

    srv = await loop.create_server(app.make_handler(), '0.0.0.0', 80)
    print("Server started at http://localhost")
    return srv

load_data()
loop = asyncio.get_event_loop()
loop.run_until_complete(init(loop))
try:
    loop.run_forever()
except KeyboardInterrupt:
    killall()
    save_data()
    sys.exit()