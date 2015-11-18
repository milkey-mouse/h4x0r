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
			this.game.make.image(0,0,"trem",0).loadTexture(this.tth.colorizeMap(TermColor.BLUE, Brightness.BRIGHT));
			console.log(this.tth.colorizeMap(TermColor.BLUE, Brightness.BRIGHT).data);
			var consoleFont: Phaser.RetroFont = this.game.add.retroFont("terminal", 8, 12, " !\"#$%&'()*+,-.\/0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{ | }~", 1, 0, 0);
			consoleFont.autoUpperCase = false;
			consoleFont.text = "Hello World!";
			console.log(consoleFont);
			consoleFont.buildRetroFontText();
		    this.game.add.image(this.game.world.centerX, this.game.world.centerY, "trem");
		}
		
		update()
		{
		}
	}
}