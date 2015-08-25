/// <reference path="../tsDefinitions/phaser.d.ts" />
/// <reference path="CookieHelper.ts" />

module Haxor
{
	export class Mobile extends Phaser.State
	{	
		preload()
		{
			this.load.image("badtime", "assets/bad_time.jpg");
			this.load.spritesheet("whateva", "assets/whateva.png", 217, 25);
		}
		
		create()
		{
			this.stage.setBackgroundColor(0xFFFFFF);
			this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "badtime").anchor = new Phaser.Point(0.5, 0.5);
			var skip = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 250, 'skip', this.backToGame, this, 2, 1, 0);
			skip.anchor = new Phaser.Point(0.5, 0.5);
			skip.scale = new Phaser.Point(2, 2);
		}
		
		backToGame()
		{
			var ch = new CookieHelper();
			ch.createCookie("warnmobile", "yes", 365);
			this.game.state.start("Boot", true, true);
		}
	}
}