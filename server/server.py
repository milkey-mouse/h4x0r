import asyncio
from aiohttp import web, web_exceptions
import time
from collections import defaultdict

async def handle(request):
    name = request.match_info.get('name', "Anonymous")
    text = "Hello, " + name
    return web.Response(body=text.encode('utf-8'))


async def ratelimit_factory(app, handler):
    async def ratelimit(request):
        ip = request.transport.get_extra_info("peername")[0]
        if (time.time() - app["last_requests"][ip]) < app["TIME_BETWEEN_REQUESTS"]:
            raise web_exceptions.HTTPTooManyRequests()
        app["last_requests"][ip] = time.time()
        return await handler(request)
    return ratelimit

async def init(loop):
    app = web.Application(loop=loop, middlewares=[ratelimit_factory])
    app["last_requests"] = defaultdict(int)
    app["TIME_BETWEEN_REQUESTS"] = 5
    app.router.add_route('GET', '/{name}', handle)

    srv = await loop.create_server(app.make_handler(), '0.0.0.0', 80)
    print("Server started at http://localhost")
    return srv

loop = asyncio.get_event_loop()
loop.run_until_complete(init(loop))
try:
    loop.run_forever()
except KeyboardInterrupt:
    pass