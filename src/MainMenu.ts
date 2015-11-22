/// <reference path="../tsDefinitions/phaser.d.ts" />
/// <reference path="text/TerminalTextHelper.ts" />

module Haxor
{
	declare var window: Haxor.GameWindow;
	
	export class MainMenu extends Phaser.State
	{
        wackyEffects: Array<DecryptorEffect> = new Array<DecryptorEffect>();
        
		create()
		{
            this.game.sound.play("complab", 0.6, true);
            this.game.sound.play("typing", 1, true);
            window.tth.createMapAsync(this.destroyOld, this, TermColor.WHITE, Brightness.BRIGHT);
		}
        
        destroyOld(consoleFont: Phaser.RetroFont)
        {
            consoleFont.text = "H4X0R";
		    var logo: Phaser.Image = this.game.add.image(0, 0, consoleFont);
            logo.smoothed = false;
            logo.scale = new Phaser.Point(6.5,6.5);
            var bounds: PIXI.Rectangle = logo.getBounds();
            logo.position = new Phaser.Point(this.game.world.centerX-(bounds.width*3.25),this.game.world.centerY-(bounds.height*3.25));
            this.wackyEffects.push(new DecryptorEffect(this.game, consoleFont, "     ");
            window.tth.createMapAsync(this.addNew, this, TermColor.WHITE, Brightness.BRIGHT);
        }
        
        addNew(consoleFont: Phaser.RetroFont)
        {
            consoleFont.text = "     ";
            var logo: Phaser.Image = this.game.add.image(0, 0, consoleFont);
            logo.smoothed = false;
            logo.scale = new Phaser.Point(3,3);
            logo.position = new Phaser.Point(this.game.world.centerX-(logo.getBounds().width*1.5),this.game.world.centerY);
            this.wackyEffects.push(new DecryptorEffect(this.game, consoleFont, "H4X0R"));
        }
		
		update()
		{
            for(var i=0;i<this.wackyEffects.length;i++)
            {
                if(this.wackyEffects[i].decoded)
                {
                    this.wackyEffects[i] = null;
                    continue;
                }
                this.wackyEffects[i].update();
            }
            for(var i=0;i<this.wackyEffects.length;i++)
            {
                if(this.wackyEffects[i] === null)
                {
                    this.wackyEffects.splice(i,1); //delete item at index
                }
            }
		}
	}
}