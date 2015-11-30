/// <reference path="../../tsDefinitions/phaser.d.ts" />
/// <reference path="Effect.ts" />

module Haxor
{
    export class DecryptorEffect extends Effect
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
                    chars[i] = this.charmap.charAt(val);
                }
                else
                {
                    chars[i] = this.targetText.charAt(i);
                }
                
            }
            this._text = chars.join("");
            if(justDecoded)
            {
                if(!this.decoded)
                {
                    if(this.decEvent !== null)
                    {
                        this._text = this.targetText;
                        this.decEvent.call(this.decContext);
                    }
                    this.decoded = true;
                }
            }
            super.update();
        }

        target: Array<number>;
        
        constructor(game: Phaser.Game, text: Phaser.RetroFont, target: string = null, randomize: boolean = true, onDecoded: Function = null, decodedCallback: any = null)
        {
            super(game,text,target,randomize,onDecoded,decodedCallback);
            this.target = new Array<number>(text.text.length);
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
            
        }
    }
}