/// <reference path="../../tsDefinitions/phaser.d.ts" />
/// <reference path="Effect.ts" />

module Haxor
{
    export class TypingEffect extends Effect
    {
        update()
        {
            if(this.charIndex >= this.targetText.length && !this.decoded)
            {
                if(this.decEvent !== null)
                {
                    this.decEvent.call(this.decContext);
                }
                this.decoded = true;
                return;
            }
            if(this.decoded) {return;}
            this._text += this.targetText.charAt(this.charIndex);
            this.charIndex++;
            super.update();
        }
        
        charIndex = 0;
        
        constructor(game: Phaser.Game, text: Phaser.RetroFont, target: string, onDecoded: Function = null, decodedCallback: any = null)
        {
            super(game,text,target,false,onDecoded,decodedCallback);
            text.text = "";
        }
    }
}