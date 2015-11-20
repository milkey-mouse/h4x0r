/// <reference path="../tsDefinitions/phaser.d.ts" />
/// <reference path="helpers/CookieHelper.ts" />
/// <reference path="helpers/VideoLoad.ts" />

module Haxor
{	
	declare var window: Haxor.GameWindow;
	
	export class Boot extends Phaser.State
	{
		vload : VideoLoad = new VideoLoad();
		
		loadvid : Phaser.Video;
		
		preload()
		{
			console.log("V293LCB5b3UgcmVhbGx5IGFyZSBhbiAzMTMzNyBoNHgwciEKCmh0dHA6Ly9iaXQubHkvMWRKTFNvVwoK");
			if(!this.game.device.desktop) //first thing to prevent eating bandwidth
			{
				var ch = new CookieHelper();
				if(ch.readCookie("warnmobile") != "yes")
				{
					this.game.state.start("Mobile", true, false);
				}
			}
			this.vload.getVideo("intro", "assets/intro", this.load);
			this.load.spritesheet("skip", "assets/skip.png", 50, 25);
		}
		
		complete = 0;
		
		otherloader : Phaser.Loader;
		
		skip : Phaser.Button;
		
		create()
		{
			//no multitouch here
			this.input.maxPointers = 1;
			//dont pause an online game
			this.stage.disableVisibilityChange = true;
			//scale like a desktop
			this.scale.currentScaleMode = Phaser.ScaleManager.SHOW_ALL;
			//seems to work on 90 percent of desktops
			this.game.antialias = false;
			this.stage.smoothed = false;
			this.stage.setBackgroundColor(0x000000);
			
			this.scale.forceLandscape = true;
			
			//google webfonts stuff
			window.WebFontConfig = {};
            window.WebFontConfig.google = { families: ['Inconsolata:latin','Open Sans:latin'] };
			
			this.otherloader = new Phaser.Loader(this.game);
			this.otherloader.pack("main", "pack.json");
			this.otherloader.onLoadComplete.add(this.addSkipButton, this);
			this.otherloader.onLoadComplete.add(this.actionComplete, this);
			this.otherloader.start();
			
			this.loadvid = this.game.add.video("intro");
			this.loadvid.onComplete.add(this.actionComplete, this);
			
			this.loadvid.play(false);
			this.loadvid.addToWorld(this.game.world.centerX, this.game.world.centerY, 0.5, 0.5);
		}
		
		update()
		{
			if(this.skip != null)
			{
				this.skip.position = new Phaser.Point(this.game.world.width - 125, this.game.world.height - 75);
			}
		}
		
		addSkipButton()
		{
			this.skip = this.game.add.button(this.game.world.width - 125, this.game.world.height - 75, 'skip', this.actionComplete, this, 2, 1, 0);
			this.skip.scale.setTo(2,2);
		}
		
		actionComplete()
		{
			this.complete += 1;
			if(this.complete == 2)
			{
				window.charmap = this.game.cache.getText("charmap");
				window.tth = new TerminalTextHelper(this.game);
				this.loadvid.stop();
				this.loadvid.destroy();
				this.game.state.start("MainMenu", true, false);
			}
		}
	}
}