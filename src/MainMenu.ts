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
			console.log(this.game.cache.addImage("trem", null, this.game.make.image(0,0,this.tth.colorizeMap(TermColor.RED, Brightness.BRIGHT, TermColor.BLUE))));
			var consoleFont: Phaser.RetroFont = this.game.add.retroFont("trem", 8, 12, " !\"#$%&'()*+,-.\/0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{ | }~", 1, 0, 0);
			consoleFont.autoUpperCase = false;
			consoleFont.text = "Hello World!";
			consoleFont.buildRetroFontText();
		    this.game.add.image(this.game.world.centerX, this.game.world.centerY, "trem");
		}
		
		update()
		{
		}
	}
}