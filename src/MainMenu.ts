/// <reference path="../tsDefinitions/phaser.d.ts" />
/// <reference path="text/TerminalTextHelper.ts" />

module Haxor
{
	declare var window: Haxor.GameWindow;
	
	export class MainMenu extends Phaser.State
	{
        logo: Phaser.Image;
        
		create()
		{
            window.tth.createMapAsync(this.reafy, this, TermColor.WHITE, Brightness.BRIGHT);
		}
        
        reafy(consoleFont: Phaser.RetroFont)
        {
            consoleFont.text = "H4X0R";
		    this.logo = this.game.add.image(this.game.world.centerX, this.game.world.centerY, consoleFont);
            this.logo.smoothed = false;
            this.logo.scale = new Phaser.Point(6.5,6.5);
            var bounds: PIXI.Rectangle = this.logo.getBounds();
            this.logo.position = new Phaser.Point(this.game.world.centerX-(bounds.width*3.25),this.game.world.centerY-(bounds.height*3.25));
            this.game.sound.play("complab", 0.5, true);
            this.game.sound.play("typing", 1, true);
        }
		
		update()
		{
		}
	}
}