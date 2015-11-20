/// <reference path="../../tsDefinitions/phaser.d.ts" />
/// <reference path="BitmapEncoder.ts" />

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
        
        colorizeMap(foreground: TermColor, foreBrightness: Brightness, background: TermColor = null, backBrightness: Brightness = Brightness.NORMAL)
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
            var cmap: Phaser.BitmapData = this.colorizeMap(foreground, foreBrightness, background, backBrightness);
            this.game.load.image(this.lastRequestedName, new BitmapEncoder().encodeBitmap(cmap.data, cmap.width, cmap.height));
            if(callback!==null){this.game.load.onFileComplete.addOnce(this.callback, this)};
            this.game.load.start();
        }
            
        
        original: Phaser.BitmapData;
        game: Phaser.Game;
        
        
        constructor(game: Phaser.Game)
        {
            this.game = game;
            this.original = this.game.make.bitmapData().load("terminal");
            this.original.smoothed = false;
        }
        
        createColoredMap(r: number, g: number, b: number, br: number = null, bg:number = null, bb:number = null): Phaser.BitmapData
        {
            if(br === null || bg === null || bb === null)
            {
                return this.original.replaceRGB(255,255,255,255,r,g,b,255);
            }
            else
            {
                return this.original.replaceRGB(255,255,255,255,r,g,b,255).replaceRGB(0,0,0,0,br,bg,bb,255);
            }
        }
    }
}