/// <reference path="../tsDefinitions/phaser.d.ts" />
/// <reference path="Boot.ts" />
/// <reference path="VideoLoad.ts" />

module Haxor
{
    export interface GameWindow extends Window
    {
        game: Haxor.Game;
    }
    
	export class Game extends Phaser.Game
	{   
	    constructor()
	    {
            super(window.innerWidth, window.innerHeight, Phaser.AUTO, 'content', null, false, false);
            
            this.state.add('Boot', Boot, false);
            //this.state.add('Preloader', Preloader, false);
            //this.state.add('MainMenu', MainMenu, false);
            //this.state.add('Level1', Level1, false);
            
            console.log("V293LCB5b3UgcmVhbGx5IGFyZSBhbiAzMTMzNyBoNHgwciEKCmh0dHA6Ly9iaXQubHkvMWRKTFNvVwoK");
            this.state.start('Boot');
        }
        
        fixSize(event)
        {
            var hgw = (<Haxor.GameWindow>window);
            var oldX = hgw.game.world.centerX;
            var oldY = hgw.game.world.centerY;
            hgw.game.scale.setGameSize(window.innerWidth, window.innerHeight);
            var offX = hgw.game.world.centerX - oldX;
            var offY = hgw.game.world.centerY - oldY;
            hgw.game.world.forEach(function(obj)
                {
                    obj.x += offX;
                    obj.y += offY;
                }, this);
        }
	}
}

window.onload = () => {
    var game = new Haxor.Game();
    
    window.addEventListener("resize", game.fixSize, false);
    
    (<Haxor.GameWindow>window).game = game;
};