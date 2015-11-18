/// <reference path="../tsDefinitions/phaser.d.ts" />
/// <reference path="TerminalTextHelper.ts" />
/// <reference path="BitmapEncoder.ts" />

module Haxor
{
	export class MainMenu extends Phaser.State
	{	
		tth: TerminalTextHelper;
		
		create()
		{
			this.tth = new TerminalTextHelper(this.game);
			var cmap: Phaser.BitmapData = this.tth.colorizeMap(TermColor.BLUE, Brightness.BRIGHT);
			this.game.cache.addImage("trem", new BitmapEncoder().encodeBitmap(cmap.data, cmap.width, cmap.height), new Phaser.Image(this.game, 0,0,cmap,0));
			console.log(this.game.cache.getImage("trem"));
			this.game.load.start();
			var consoleFont: Phaser.RetroFont = new Phaser.RetroFont(this.game, "trem", 8, 12, " !\"#$%&'()*+,-.\/0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{ | }~");
			consoleFont.autoUpperCase = false;
			consoleFont.key = "trem";
			consoleFont.text = "Hello World!";
			console.log(consoleFont);
			consoleFont.buildRetroFontText();
		    this.game.add.image(this.game.world.centerX, this.game.world.centerY, consoleFont);
		}
		
		update()
		{
		}
	}
}