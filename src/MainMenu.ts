/// <reference path="../tsDefinitions/phaser.d.ts" />
/// <reference path="text/TerminalTextHelper.ts" />

module Haxor
{
	declare var window: Haxor.GameWindow;
	
	export class MainMenu extends Phaser.State
	{
		create()
		{
            window.tth.createMapAsync(this.reafy, this, TermColor.CYAN, Brightness.BRIGHT);
		}
        
        reafy(consoleFont: Phaser.RetroFont)
        {
			consoleFont.text = window.charmap;
			consoleFont.smoothed = "false";
		    this.game.add.image(this.game.world.centerX, this.game.world.centerY, consoleFont).smoothed = false;
        }
		
		update()
		{
		}
	}
}