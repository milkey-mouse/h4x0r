/// <reference path="../tsDefinitions/phaser.d.ts" />
/// <reference path="TerminalTextHelper.ts" />

module Haxor
{
	export class MainMenu extends Phaser.State
	{	
		tth: TerminalTextHelper;
		
		create()
		{
			this.tth = new TerminalTextHelper(this.game);
            this.tth.createMapAsync(this.reafy, this, TermColor.RED, Brightness.BRIGHT, TermColor.BLUE, Brightness.NORMAL);
		}
        
        reafy()
        {
            var consoleFont: Phaser.RetroFont = this.game.make.retroFont(this.tth.lastRequestedName, 8, 12, this.game.cache.getText("charmap"), 1);
			consoleFont.autoUpperCase = false;
            consoleFont.multiLine = true;
			consoleFont.text = "Hello World!";
			console.log(consoleFont);
		    this.game.add.image(this.game.world.centerX, this.game.world.centerY, consoleFont);
        }
		
		update()
		{
		}
	}
}