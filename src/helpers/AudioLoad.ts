module Haxor
{
	export class AudioLoad
	{
		canPlay(type: string, testEl: HTMLAudioElement) : boolean
		{
			var result: boolean = false;
			switch(type)
			{
				case "mp3":
					result = (testEl.canPlayType('audio/mpeg;') != "");
				case "ogg":
					result = (testEl.canPlayType('audio/ogg; codecs="vorbis"') != "");
                case "wav":
					result = (testEl.canPlayType('audio/wav; codecs="1"') != "");
			}
			return result;
		}
		
		public mp3: boolean;
		public ogg: boolean;
        public wav: boolean;
		
		getAudioPack(loader: Phaser.Loader) : boolean
		{
			if(this.mp3) 
			{
				loader.pack("audio", "assets/mp3/pack.json");
				return true;
			}
			else if(this.ogg)
			{
				loader.pack("audio", "assets/ogg/pack.json");
				return true;
			}
            else if(this.wav) //last resort
            {
                loader.pack("audio", "assets/wav/pack.json");
            }
			else
			{
				return false;
			}
		}
		
		
		constructor()
		{
			var testEl: HTMLAudioElement = document.createElement("audio");
			this.mp3 = this.canPlay("mp3", testEl);
			this.ogg = this.canPlay("ogg", testEl);
            this.wav = this.canPlay("wav", testEl);
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