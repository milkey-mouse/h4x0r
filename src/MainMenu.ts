/// <reference path="../tsDefinitions/phaser.d.ts" />
/// <reference path="TerminalTextHelper.ts" />

module Haxor
{
	declare var window: Haxor.GameWindow;
	
	export class MainMenu extends Phaser.State
	{
		create()
		{
            window.tth.createMapAsync(this.reafy, this, TermColor.BLUE, Brightness.NORMAL);
		}
        
        reafy(consoleFont: Phaser.RetroFont)
        {
			consoleFont.text = "Hello World!";
		    this.game.add.image(this.game.world.centerX, this.game.world.centerY, consoleFont).smoothed = false;
        }
		
		update()
		{
		}
	}
}