/// <reference path="../tsDefinitions/phaser.d.ts" />

class SplashScreen
{
	game:Phaser.Game;
	
	constructor()
	{
		this.game = new Phaser.Game( 1600, 900, Phaser.AUTO, 'content', { preload:this.preload, create:this.create} );
	}
	
	preload()
	{
		this.game.load.image( 'logo', "assets/logo.png" );
		this.game.stage.backgroundColor = 0x000000;
	}
	
	create()
	{
		var logo = this.game.add.sprite( this.game.world.centerX, this.game.world.centerY, 'logo' );
		logo.anchor.setTo( 0.5, 0.5 );
	}
}

// when the page has finished loading, create our game
window.onload = () => {
	var game = new SplashScreen();
}