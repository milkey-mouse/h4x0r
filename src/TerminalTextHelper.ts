/// <reference path="../tsDefinitions/phaser.d.ts" />

module Haxor
{
	export class TerminalTextHelper
	{
		//https://en.wikipedia.org/wiki/ANSI_escape_code#Colors
		codeto: Object = {
			"\x1b[39;49m":"gray", //default color
			"\x1b[0m":"gray", //default everything, but only color is supported
			
		}
		
		original: Phaser.BitmapData;
		game: Phaser.Game;
		
		
		constructor(game: Phaser.Game, bdata: Phaser.BitmapData)
		{
			this.game = game;
			this.original = this.game.make.bitmapData().load("terminal");
		}
		
		addFont()
		{
			this.game.add.retroFont("console", 8, 12, Phaser.RetroFont.TEXT_SET1, 1);
		}
		
		createColoredMap(r: number, g: number, b: number) : RetroFont
		{
            this.original.replaceRGB(255,255,255,255,r,g,b,255);
		}
	}
}