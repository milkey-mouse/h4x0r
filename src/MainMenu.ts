/// <reference path="../tsDefinitions/phaser.d.ts" />

module Haxor
{
	export class MainMenu extends Phaser.State
	{	
		create()
		{
			console.log("yo");
			console.log(this.game.make.bitmapData().replaceRGB(255,255,255,255,255,0,0,255));
		}
		
		update()
		{
		}
	}
}