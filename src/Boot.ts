/// <reference path="../tsDefinitions/phaser.d.ts" />
/// <reference path="VideoLoad.ts" />

module Haxor
{
	export class Boot extends Phaser.State
	{
		vload : VideoLoad = new VideoLoad();
		
		loadvid : Phaser.Video;
		
		preload()
		{
			if(!this.game.device.desktop) //first thing to prevent eating bandwidth
			{
				window.location.replace("/mobile.html");
			}
			this.vload.getVideo("intro", "assets/intro", this.load);
		}
		
		complete = 0;
		
		otherloader : Phaser.Loader;
		
		create()
		{
			//no multitouch here
			this.input.maxPointers = 1;
			//dont pause an online game
			this.stage.disableVisibilityChange = true;
			//scale like a desktop
			this.scale.currentScaleMode = Phaser.ScaleManager.SHOW_ALL;
			//seems to work on 90 percent of desktops
			if(this.game.renderType == Phaser.CANVAS)
			{
				Phaser.Canvas.setSmoothingEnabled(this.game.context, false);
			}
			else
			{
				this.game.antialias = false;
			}
			this.stage.setBackgroundColor(0x000000);
			
			this.scale.forceLandscape = true;
			
			//google webfonts stuff
			window["WebFontConfig"] = {};
            window["WebFontConfig"].google = { families: ['Inconsolata:latin','Open Sans:latin'] };
			
			this.otherloader = new Phaser.Loader(this.game);
			this.otherloader.pack("main", "pack.json");
			this.otherloader.onLoadComplete.add(this.actionComplete, this);
			this.otherloader.start();
			
			this.loadvid = this.game.add.video("intro");
			this.loadvid.onComplete.add(this.actionComplete, this);
			
			this.loadvid.play(false);
			this.loadvid.addToWorld(this.game.world.centerX, this.game.world.centerY, 0.5, 0.5);
		}
		
		actionComplete()
		{
			this.complete += 1;
			if(this.complete == 2)
			{
				console.log("done");
			}
		}
	}
}