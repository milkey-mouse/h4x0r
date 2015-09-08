#fontrenderer: generates the BitmapFont sheets for H4X0R
#Most of this shamelessly stolen from a Stackoverflow post
#http://bit.ly/stackoverflow-python-render-ttf
#Everything else is terrible but it works

import ctypes
import struct
import win32con
import win32gui
import win32ui
import string
import sys

from PIL import Image
from numpy import array


def RGB(r, g, b):    
    return r | (g << 8) | (b << 16)

def native_bmp_to_pil(hdc, bitmap_handle, width, height):
    bmpheader = struct.pack("LHHHH", struct.calcsize("LHHHH"),
                            width, height, 1, 24) #w,h, planes=1, bitcount)
    c_bmpheader = ctypes.c_buffer(bmpheader)

    #3 bytes per pixel, pad lines to 4 bytes    
    c_bits = ctypes.c_buffer(" " * (height * ((width*3 + 3) & -4)))

    res = ctypes.windll.gdi32.GetDIBits(
        hdc, bitmap_handle, 0, height,
        c_bits, c_bmpheader,
        win32con.DIB_RGB_COLORS)
    if not res:
        raise IOError("native_bmp_to_pil failed: GetDIBits")

    im = Image.frombuffer(
        "RGB", (width, height), c_bits,
        "raw", "BGR", (width*3 + 3) & -4, -1)
    return im    


class Win32Font:
    def __init__(self, name, height, color, weight=win32con.FW_NORMAL,
                 italic=False, underline=False):
        self.color = color
        self.font = win32ui.CreateFont({
            'name': name, 'height': height,
            'weight': weight, 'italic': italic, 'underline': underline})

        #create a compatible DC we can use to draw:
        self.desktopHwnd = win32gui.GetDesktopWindow()
        self.desktopDC = win32gui.GetWindowDC(self.desktopHwnd)
        self.mfcDC = win32ui.CreateDCFromHandle(self.desktopDC)         
        self.drawDC = self.mfcDC.CreateCompatibleDC()

        #initialize it
        self.drawDC.SelectObject(self.font)

    def renderText(self, text):
        """render text to a PIL image using the windows API."""
        self.drawDC.SetTextColor(RGB(self.color[0],self.color[1],self.color[2]))

        #create the compatible bitmap:
        w,h = self.drawDC.GetTextExtent(text)

        saveBitMap = win32ui.CreateBitmap()
        saveBitMap.CreateCompatibleBitmap(self.mfcDC, w, h)        
        self.drawDC.SelectObject(saveBitMap)

        #draw it
        self.drawDC.DrawText(text, (0, 0, w, h), win32con.DT_LEFT)

        #convert to PIL image
        im = native_bmp_to_pil(self.drawDC.GetSafeHdc(), saveBitMap.GetHandle(), w, h)

        #clean-up
        win32gui.DeleteObject(saveBitMap.GetHandle())

        return im        

    def __del__(self):
        self.mfcDC.DeleteDC()
        self.drawDC.DeleteDC()
        win32gui.ReleaseDC(self.desktopHwnd, self.desktopDC)
        win32gui.DeleteObject(self.font.GetSafeHandle())

    def __del__(self):
        win32gui.DeleteObject(self.font.GetSafeHandle())

font = raw_input("Input font: (Terminal for Windows terminal): ")

size = int(raw_input("Font size: (12 as default): "))

color = (0,0,0)

print "Generating FSS sheet..."

f = Win32Font(font, size, color)

imgs = []

chars = []

maxwidth = 0

fullheight = 0

mapchars = []

with open("map.txt", "r") as maptxt:
    mapchars = list(maptxt.read())

for message in mapchars:
    try:
        nimg = f.renderText(message)
        if nimg.size[0] > maxwidth:
            maxwidth = nimg.size[0]
        fullheight += nimg.size[1]
        imgs.append(nimg)
        chars.append(message)
        sys.stdout.write(message)
    except:
        pass

lengths = []

print "\nStitching FSS sheet..."
sim = Image.new("RGBA", (maxwidth, fullheight))
lyo = 0
yoffset = 0
for im in imgs:
    lengths.append(str(im.size[0]))
    sim.paste(im,(0,yoffset))
    yoffset += im.size[1]
    lyo = im.size[1]

source = sim.split()

if size != 12:
    font += ("_" + str(size))

npas = array(sim)
qn = npas
for x in range(npas.shape[0]):
    for y in range(npas.shape[1]):
        pxl = list(npas[x][y])
        if pxl == [255,255,255,255]:
            npas[x][y] = [0,0,0,0]
        else:
            npas[x][y] = [255,255,255,255]
sim = Image.fromarray(npas)

sim.save(font + ".png")
