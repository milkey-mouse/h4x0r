/// <reference path="../tsDefinitions/phaser.d.ts" />
/// <reference path="BitmapEncoder.ts" />

module Haxor
{
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
                [0,  0,   0],
                [0,  0,   1],
                [0,  1,   0],
                [0,  1,   1],
                [1,  0,   0],
                [1,  0,   1],
                [1,  0.5, 0],
                [1,  1,   1],
        ];
        
        brightenize(color: Array<number>, brightness: Brightness) //"brightenize" is perfectly cromulent if you ask me
        {
            var newcolor : Array<number> = new Array<number>(color.length)
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
            var forecolor : Array<number> = this.brightenize(this.colors[foreground], foreBrightness);
            if(background === null)
            {
                return this.createColoredMap(forecolor[0],forecolor[1],forecolor[2]);
            }
            var backcolor : Array<number> = this.brightenize(this.colors[background], backBrightness);
            return this.createColoredMap(forecolor[0],forecolor[1],forecolor[2],backcolor[0],backcolor[1],backcolor[2]);
        }
        
        lastRequestedName: string = null;
        
        createMapAsync(callback: Function, callbackContext: any, foreground: TermColor, foreBrightness: Brightness, background: TermColor = null, backBrightness: Brightness = Brightness.NORMAL)
        {
            this.lastRequestedName = "term_" + foreground.toString() + foreBrightness.toString() + (background === null ? "" : background.toString()) + (backBrightness === null ? "" : backBrightness.toString());
            if(this.game.cache.checkImageKey(this.lastRequestedName))
            {
                callback();
                return true;
            }
            var cmap: Phaser.BitmapData = this.colorizeMap(TermColor.BLUE, Brightness.BRIGHT);
            this.game.load.image(this.lastRequestedName, new BitmapEncoder().encodeBitmap(cmap.data, cmap.width, cmap.height));
            if(callback === null) //dunno why, but whatever
            {
                this.game.load.onFileComplete.addOnce(callback, callbackContext);
            }
            this.game.load.start();
            while(this.game.load.isLoading);
            callbackContext.callback();
            console.log(this.game.load);
            console.log(this.lastRequestedName);
            console.log(new BitmapEncoder().encodeBitmap(cmap.data, cmap.width, cmap.height));
        }
            
        
        original: Phaser.BitmapData;
        game: Phaser.Game;
        
        
        constructor(game: Phaser.Game)
        {
            this.game = game;
            this.original = this.game.make.bitmapData().load("terminal");
        }
        
        createColoredMap(r: number, g: number, b: number, br: number = null, bg:number = null, bb:number = null) : Phaser.BitmapData
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