/// <reference path="../tsDefinitions/phaser.d.ts" />

module Haxor
{
	export class VideoLoad
	{
		canPlay(type: string, testEl: HTMLVideoElement) : boolean
		{
			var result : boolean = false;
			switch(type)
			{
				case "mp4":
					result = (testEl.canPlayType('video/mp4; codecs="avc1.F4001E"') != "") ||
					(testEl.canPlayType('video/mp4; codecs="avc1.F4001E, mp4a.40.2"') != "");
				case "webm":
					result = (testEl.canPlayType('video/webm; codecs="vp8, vorbis"') != "");
				case "ogg":
					result = (testEl.canPlayType('video/ogg; codecs="theora"') != "");
			}
			return result;
		}
		
		public mp4: boolean;
		public webm: boolean;
		public ogg: boolean;
		
		getVideo(vidname: string, urlNoExtension: string, loader: Phaser.Loader) : boolean
		{
			//WebM is for people with principles, MP4 is for people who want results
			if(this.mp4) 
			{
				loader.video(vidname, urlNoExtension + ".mp4");
				return true;
			}
			else if(this.webm)
			{
				loader.video(vidname, urlNoExtension + ".webm");
				return true;
			}
			else if(this.ogg)
			{
				loader.video(vidname, urlNoExtension + ".ogv");
				return true;
			}
			else
			{
				return false;
			}
		}
		
		
		constructor()
		{
			var testEl : HTMLVideoElement = document.createElement("video");
			this.mp4 = this.canPlay("mp4", testEl);
			this.webm = this.canPlay("webm", testEl);
			this.ogg = this.canPlay("ogg", testEl);
			try
			{
				testEl.remove();
			}
			catch(e)
			{
				console.warn("failed to remove video test element");
			}
		}
	}
}