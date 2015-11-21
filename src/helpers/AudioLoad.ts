module Haxor
{
	export class AudioLoad
	{
        public bestExtension: string = null;
        
        private loader: Phaser.Loader = null;
		
		getAudioPack(loader: Phaser.Loader, text)
		{
            this.loader = loader;
            //forEach() doesn't work because of contexts or something
            var keys: Array<string> = text.split(",");
            for(var key in keys)
            {
                this.getAudio(keys[key]);
            }
		}
        
        getAudio(key: string)
        {
            this.loader.audio(key, "assets/audio/" + key + this.bestExtension, true);
        }
		
		constructor()
		{
			var testEl: HTMLAudioElement = document.createElement("audio");
            if(testEl.canPlayType('audio/mpeg;') != "") 
			{
				this.bestExtension = ".mp3";
			}
			else if(testEl.canPlayType('audio/ogg; codecs="vorbis"') != "")
			{
				this.bestExtension = ".ogg";
			}
            else if(testEl.canPlayType('audio/wav; codecs="1"') != "") //last resort
            {
                this.bestExtension = ".wav";
            }
			else
			{
                console.warn("no audio formats working");
			}
			try
			{
				testEl.remove();
			}
			catch(e)
			{
				console.warn("failed to remove audio test element");
			}
		}
	}
}