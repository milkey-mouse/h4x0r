from numpy import dtype, array
import random
import colorama
import itertools
import pygame
import os, sys

class spritesheet(object):
    def __init__(self, filename):
        try:
            self.sheet = pygame.image.load(filename).convert()
        except pygame.error, message:
            print 'Unable to load spritesheet image:', filename
            raise SystemExit, message
    def image_at(self, rect):
        image = pygame.Surface(rect.size).convert()
        image.blit(self.sheet, (0, 0), rect)
        return image

class renderfile(object):
    '''Loads the actual text files with the ASCII characters to use'''
    def __init__(self, mapstr):
        self.mapstr = mapstr
        self.charray = []
        self.width = 0
        self.height = 0
        self.cmdmap = {
                   "tan" : colorama.Fore.YELLOW,
                   "blue" : colorama.Fore.BLUE,
                   "white" : colorama.Fore.WHITE,
                   "red" : colorama.Fore.RED,
                   "standard" : colorama.Fore.RESET,
                   }

    def dimensions_from_array(self, dimarray):
        x = 0
        for line in dimarray:
            if len(line) > x:
                x = len(line)
        y = len(dimarray)
        return (x,y)

    def merge(self, layer1, layer2):
        result_array = []
        for x in xrange(self.height):
            result_array.append([])
            for y in xrange(self.width):
                try:
                    l1 = layer1[x][y]
                except:
                    l1 = None
                try:
                    l2 = layer2[x][y]
                except:
                    l2 = None
                result_array[-1].append(l2 if l2 != None else l1)
        return result_array

    def pad(self, layer): #just merge with all None's
        result_array = []
        for x in xrange(self.height):
            result_array.append([])
            for y in xrange(self.width):
                try:
                    l2 = layer[x][y]
                except:
                    l2 = None
                result_array[-1].append(l2 if l2 != None else None)
        return result_array

    def lower_is_empty(self, charray):
        for item in charray[-1]:
            if item != None:
                return False
        return True

    def right_is_empty(self, charray):
        for line in charray:
            if line[-1] != None:
                return False
        return True

    def upper_is_empty(self, charray):
        for item in charray[0]:
            if item != None:
                return False
        return True

    def left_is_empty(self, charray):
        for line in charray:
            if line[0] != None:
                return False
        return True

    def trim(self):
        #trim only when done to avoid color mask issues
        while self.lower_is_empty(self.charray):
            self.charray.pop()
        while self.right_is_empty(self.charray):
            for line in self.charray:
                line.pop()
        while self.upper_is_empty(self.charray):
            self.charray.pop(0)
        while self.left_is_empty(self.charray):
            for line in self.charray:
                line.pop(0)
        dimensions = self.dimensions_from_array(self.charray)
        self.width = dimensions[0]
        self.height = dimensions[1]

    def color_from_path(self, path):
        if path.endswith("\\"):
            path = path[:-1]
        return path.split("\\")[-1]

    def add_directory(self, dirname):
        for path, _, files in os.walk(dirname):
            for file in files:
                print file
                self.add_file(os.path.join(path, file), self.color_from_path(path))

    def add_file(self, filename, color):
        charray = []
        with open(filename, "r") as rendertxt:
            for line in rendertxt:
                charray.append([])
                for char in line:
                    if char == "\r" or char == "\n": #strip these out without even leaving None's in their places
                        continue
                    achar = (char, color) if (char in self.mapstr and char != " ") else None
                    charray[-1].append(achar)
        dimensions = self.dimensions_from_array(charray)
        self.width = max(dimensions[0], self.width)
        self.height = max(dimensions[1], self.height)
        charray = self.pad(charray)
        self.charray = self.merge(self.charray, charray)

    def __str__(self):
        result = []
        result.append(colorama.Style.BRIGHT)
        for line in self.charray:
            try:
                result.append("\n")
                for char in line:
                    try:
                        if char[1] == "tan":
                            result.append(colorama.Style.RESET_ALL)
                        if char[1] in self.cmdmap:
                            result.append(self.cmdmap[char[1]])
                        else:
                            result.append(self.cmdmap["standard"])
                        result.append(char[0])
                        if char[1] == "tan":
                            result.append(colorama.Style.BRIGHT)
                    except:
                        result.append(" ")
            except:
                pass
        result.append(colorama.Fore.RESET)
        result.append(colorama.Style.RESET_ALL)
        return "".join(result)

class charmanager(object):
    '''Actually does the "decrypt" animation from a list of chars'''
    def __init__(self, mapstr, target_chars):
        self.mapstr = list(mapstr)
        self.inttargets = self.lookup_to_ints(target_chars)
        self.intchars = self.randomize_ints(target_chars)
        self.colors = self.strip_colors(target_chars)
        self.destroying = False

    def destroy(self):
        self.destroying = True
        self.intchars = self.randomize_ints(self.inttargets)
        self.inttargets = self.randomize_ints(self.inttargets)

    def step(self):
        steppedarray = []
        for tline, line in itertools.izip(self.inttargets, self.intchars):
            steppedarray.append([])
            for tchar, ichar in itertools.izip(tline, line):
                #ichar = tchar
                if not ichar == tchar:
                    if not (self.destroying and ichar == mapstr.index(" ")):
                        ichar += 1
                else:
                    if self.destroying:
                        ichar = mapstr.index(" ")
                if ichar > 130:
                    ichar = 0
                steppedarray[-1].append(ichar)
        self.intchars = steppedarray
        return self.lookup_to_chars(steppedarray)

    def strip_colors(self, targetarray):
        colors = []
        for line in targetarray:
            colors.append([])
            for char in line:
                if char == None:
                    colors[-1].append(None)
                else:
                    colors[-1].append(char[1])
        return colors

    def lookup_to_chars(self, intarray):
        textarray = []
        for cline, line in itertools.izip(self.colors, intarray):
            textarray.append([])
            for cstr, char in itertools.izip(cline, line):
                if char == None:
                    textarray[-1].append(None)
                else:
                    textarray[-1].append((self.mapstr[char], cstr))
        return textarray

    def lookup_to_ints(self, charray):
        intarray = []
        for line in charray:
            intarray.append([])
            for char in line:
                if char == None:
                    intarray[-1].append(None)
                else:
                    intarray[-1].append(self.mapstr.index(char[0]))
        return intarray

    def randomize_ints(self, targets):
        randarray = []
        for x in targets:
            randarray.append([])
            for y in x:
                randarray[-1].append(random.randint(1,101))
        return randarray

    def dimensions_from_array(self, dimarray):
        x = 0
        for line in dimarray:
            if len(line) > x:
                x = len(line)
        y = len(dimarray)
        return (x,y)

colorama.init()

pygame.init()

screen = pygame.display.set_mode([800,450])

screen.fill((128,128,128))

pygame.display.flip()

mastermap = {}

print "Loading font..."

sheet = spritesheet("Terminal_Hex.png")

mapstr = ""

with open("Terminal_Hex.map", "r") as map:
    mapstr = map.read()

sizex = sheet.sheet.get_size()[0] #since it's vertical division would be by 1

sizey = sheet.sheet.get_size()[1] / len(mapstr)

idx = 0

for char in mapstr:
    mastermap[char] = sheet.image_at(pygame.Rect((0,sizey*idx), (sizex,sizey)))
    idx += 1

coloredmaps = {}

def color_to_int(r,g,b):
    return int('%02x%02x%02x' % (r, g, b), 16)

colors = {
    "tan" : (209,165,115),
    "blue" : (0,0,255),
    "white" : (255,255,255),
    "red" : (255,0,0),
    "green" : (0,255,0),
    "limegreen" : (125,255,0),
    "leafgreen" : (0,170,0),
    "silver" : (203,203,203),
    "brown" : (170,85,0),
    "butterscotch" : (255,219,182),
    "cyan" : (125,255,255),
    "gold" : (232,190,96),
    "standard" : (192,192,192),
    }

intcolors = {}

for name, color in colors.iteritems():
    intcolors[name] = color_to_int(color[0],color[1],color[2])

colorkey = 0

colormaps = {}

for name, color in intcolors.iteritems():
    colormaps[name] = {}
    for char, original_image in mastermap.iteritems():
        image = original_image.copy()
        pixels = pygame.surfarray.pixels2d(image)
        pixels[pixels!=colorkey] = color
        del pixels
        colormaps[name][char] = image

print "Loading text files..."

render = renderfile(mapstr)

render.add_directory("render\\teamivan")

render.trim()

#print render #it can render to stdout! with color!

cmanager = charmanager(mapstr, render.charray)

startx = (800 - (render.width*8)) / 2
 
starty = (450 - (render.height*12)) / 2

frame = 264

mult = 5.19

ridx = 0

pygame.display.flip()

#cmanager.destroy()

running = True
ending = cmanager.destroying
lastpixels = None
while running: 
    screen.fill((0,0,0))
    for event in pygame.event.get(): 
        if event.type == pygame.QUIT: 
            running = False
    ridx += mult
    while ridx >= 1.0:
        ridx -= 1.0
        cmanager.step()
    for y, line in enumerate(cmanager.step()):
        for x, char in enumerate(line):
            if char == None or char[0] == None or char[1] == None:
                continue
            screen.blit(colormaps[char[1]][char[0]], pygame.Rect((startx+(x*8),starty+(y*12)),(8,12)))
    pygame.display.flip()
    pixels = pygame.surfarray.pixels2d(screen)
    lp = array(pixels)
    del pixels
    lp.flags.writeable = False
    np = hash(lp.data)
    if lastpixels == np:
        if ending:
            running = False
        else:
            ending = True
            cmanager.destroy()
    lastpixels = np
    del lp
    pygame.image.save(screen,"output/" + str(frame) + ".png")
    frame += 1
pygame.quit()
