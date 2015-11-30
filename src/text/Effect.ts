/// <reference path="../../tsDefinitions/phaser.d.ts" />

module Haxor
{
    declare var window: Haxor.GameWindow;
    
    export class Effect
    {
        public game: Phaser.Game;
        public dectext: Phaser.RetroFont;
        public _text: string;
        public targetText: string;
        public charmap: string = window.charmap;
        public decoded: boolean = false;
        public decEvent: Function = null;
        public decContext: any = null;
        
        update()
        {
            this.dectext.text = this._text;
        }
        
        constructor(game: Phaser.Game, text: Phaser.RetroFont, target: string = null, randomize: boolean = true, onDecoded: Function = null, decodedCallback: any = null)
        {
            this.game = game;
            this.dectext = text;
            this._text = this.dectext.text;
            this.targetText = target;
            if(randomize)
            {
                var chars: Array<string> = new Array<string>(this._text.length);
                for(var i=0;i<this._text.length;i++)
                {
                    chars[i] = this.charmap.charAt(Math.floor(Math.random()*(this.charmap.length-1)+1));
                }
                this._text = chars.join("");
            }
            if(onDecoded !== null)
            {
                this.decEvent = onDecoded;
                this.decContext = decodedCallback;
            }
        }
    }
}