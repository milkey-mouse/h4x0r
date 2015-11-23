/// <reference path="../../tsDefinitions/phaser.d.ts" />

module Haxor
{
    export class DecryptorEffect
    {
        update()
        {
            var justDecoded = true;
            var chars: Array<string> = new Array<string>(this._text.length);
            for(var i=0;i<this._text.length;i++)
            {
                var val: number = this.charmap.indexOf(this._text.charAt(i));
                if(val !== this.target[i])
                {
                    justDecoded = false;
                    if(val === this.charmap.length)
                    {
                        val = 0;
                    }
                    val++;
                }
                chars[i] = this.charmap.charAt(val);
            }
            this._text = chars.join("");
            if(justDecoded)
            {
                if(!this.decoded)
                {
                    if(this.decEvent !== null)
                    {
                        this.decEvent.call(this.decCallback);
                    }
                    this.decoded = true;
                }
            }
            this.dectext.text = this._text;
        }
        
        _text: string;
        dectext: Phaser.RetroFont;
        game: Phaser.Game;
        charmap: string;
        target: Array<number>;
        targetText: string;
        decoded: boolean = false;
        decEvent: Function = null;
        decCallback: any = null;
        
        constructor(game: Phaser.Game, text: Phaser.RetroFont, target: string = null, randomize: boolean = true, onDecoded: Function = null, decodedCallback: any = null)
        {
            this.game = game;
            this.dectext = text;
            this._text = this.dectext.text;
            this.charmap = this.game.cache.getText("charmap");
            this.target = new Array<number>(text.text.length);
            this.targetText = target;
            for(var i=0;i<text.text.length;i++)
            {
                if(target === null)
                {
                    this.target[i] = null;
                }
                else
                {
                    var chr: string = target.charAt(i);
                    if(chr === "")
                    {
                        this.target[i] = null;
                    }
                    else
                    {
                        this.target[i] = this.charmap.indexOf(chr);
                    }
                }
            }
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
                this.decCallback = decodedCallback;
            }
        }
    }
}