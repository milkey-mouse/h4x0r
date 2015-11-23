/// <reference path="../../tsDefinitions/phaser.d.ts" />

module Haxor
{
    declare var window: Haxor.GameWindow;
    
    //thanks @atdt https://github.com/atdt/escapes.js
    
    export enum TermColor
    {
        BLACK   = 0,
        RED     = 1,
        GREEN   = 2,
        YELLOW  = 3,
        BLUE    = 4,
        MAGENTA = 5,
        CYAN    = 6,
        WHITE   = 7,
        GRAY    = 8
    }
    
    export const enum Escapes
    {
        NONE      = 0x0,
        BRIGHT    = 0x1,
        UNDERLINE = 0x4,
        BLINK     = 0x5,
        REVERSE   = 0x7,
        INVISIBLE = 0x9,
    }
    
    export const enum Brightness
    {
        BRIGHT,
        NORMAL
    }
    
    export class TerminalTextHelper
    {
        colors: Array<Array<number>> = [
                [0,   0,   0],
                [0,   0,   1],
                [0,   1,   0],
                [0,   1,   1],
                [1,   0,   0],
                [1,   0,   1],
                [1,   0.5, 0],
                [1.5,   1.5,   1.5],
                [0.5, 0.5, 0.5],
        ];
        
        brightenize(color: Array<number>, brightness: Brightness) //"brightenize" is perfectly cromulent if you ask me
        {
            var newcolor: Array<number> = new Array<number>(color.length)
            if(brightness === Brightness.BRIGHT)
            {
                for(var i=0; i<color.length; i++)
                {
                    newcolor[i] = (color[i] != 0) ? 255 : 85;
                }
            }
            else
            {
                for(var i=0; i<color.length; i++)
                {
                    newcolor[i] = color[i] * 170;
                }
            }
            return newcolor;
        }
        
        colorizeMap(foreground: TermColor, foreBrightness: Brightness, background: TermColor = null, backBrightness: Brightness = Brightness.NORMAL): string
        {
            var forecolor: Array<number> = this.brightenize(this.colors[foreground], foreBrightness);
            if(background === null)
            {
                return this.createColoredMap(forecolor[0],forecolor[1],forecolor[2]);
            }
            var backcolor: Array<number> = this.brightenize(this.colors[background], backBrightness);
            return this.createColoredMap(forecolor[0],forecolor[1],forecolor[2],backcolor[0],backcolor[1],backcolor[2]);
        }
        
        lastRequestedName: string = null;
        
        private lastCallback: Function = null;
        
        private lastContext: any = null;
        
        callback()
        {
            var consoleFont: Phaser.RetroFont = this.game.make.retroFont(this.lastRequestedName, 8, 12, window.charmap, 1);
			consoleFont.autoUpperCase = false;
            consoleFont.multiLine = true;
            consoleFont.align = Phaser.RetroFont.ALIGN_LEFT;
            consoleFont.removeUnsupportedCharacters = function(s: any){return s};
            this.lastCallback.call(this.lastContext, consoleFont);
        }
        
        createMapAsync(callback: Function, callbackContext: any, foreground: TermColor, foreBrightness: Brightness, background: TermColor = null, backBrightness: Brightness = Brightness.NORMAL)
        {
            this.lastRequestedName = "term_" + foreground.toString() + foreBrightness.toString() + (background === null ? "" : background.toString()) + (backBrightness === null ? "" : backBrightness.toString());
            this.lastCallback = callback;
            this.lastContext = callbackContext;
            if(this.game.cache.checkImageKey(this.lastRequestedName))
            {
                if(callback!==null){this.callback();}
                return true;
            }
            this.game.load.image(this.lastRequestedName, this.colorizeMap(foreground, foreBrightness, background, backBrightness));
            if(callback!==null){this.game.load.onFileComplete.addOnce(this.callback, this)};
            this.game.load.start();
        }
        
        original: Phaser.BitmapData;
        game: Phaser.Game;
        
        
        constructor(game: Phaser.Game)
        {
            this.game = game;
            this.original = this.game.make.bitmapData().load("terminal");
        }
        
        createColoredMap(r: number, g: number, b: number, br: number = null, bg:number = null, bb:number = null): string
        {
            var benc = new window.PNGlib(this.original.width, this.original.height, 256);
            var back: string = null;
            if(br !== null && bg !== null && bb !== null)
            {
                back = benc.color(br, bg, bb, 255);
            }
            else
            {
                back = benc.color(0, 0, 0, 0); //black alpha
            }
            var front: string = benc.color(r, g, b, 255);
            var j = 0;
            for(var i=0;i<this.original.imageData.data.length;i+=4)
            {
                if(this.original.imageData.data[i] === 255)
                {
                    benc.buffer[benc.index(j % this.original.width,Math.floor(j/this.original.width))] = front;
                }
                else
                {
                    benc.buffer[benc.index(j%this.original.width,Math.floor(j/this.original.width))] = back;
                }
                j++;
            }
            return benc.getBase64();
        }
    }
}