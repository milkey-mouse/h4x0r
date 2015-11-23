/// <reference path="../tsDefinitions/phaser.d.ts" />
/// <reference path="text/TerminalTextHelper.ts" />

module Haxor
{
	declare var window: Haxor.GameWindow;
	
	export class MainMenu extends Phaser.State
	{
        wackyEffects: Array<DecryptorEffect> = new Array<DecryptorEffect>();
        
        logo: Phaser.Image = null;
        
        console: Phaser.Image = null;
        
        offset: number = null;
        
		create()
		{
            this.game.sound.play("complab", 0.6, true);
            this.game.sound.play("typing", 1, true);
            window.tth.createMapAsync(this.destroyOld, this, TermColor.WHITE, Brightness.BRIGHT);
		}
        
        destroyOld(consoleFont: Phaser.RetroFont)
        {
            consoleFont.text = "H4X0R";
		    var logo: Phaser.Image = this.game.add.image(0, 0, consoleFont);
            logo.smoothed = false;
            logo.scale = new Phaser.Point(6.5,6.5);
            var bounds: PIXI.Rectangle = logo.getBounds();
            logo.position = new Phaser.Point(this.game.world.centerX-(bounds.width*3.25),this.game.world.centerY-(bounds.height*3.25));
            this.wackyEffects.push(new DecryptorEffect(this.game, consoleFont, "     ", false));
            window.tth.createMapAsync(this.addNew, this, TermColor.WHITE, Brightness.BRIGHT);
        }
        
        addNew(consoleFont: Phaser.RetroFont)
        {
            consoleFont.text = "     ";
            this.logo = this.game.add.image(0, 20, consoleFont);
            this.logo.scale = new Phaser.Point(3,3);
            this.logo.smoothed = false;
            this.logo.position = new Phaser.Point(this.game.world.centerX-(this.logo.getBounds().width*1.5), 20);
            this.wackyEffects.push(new DecryptorEffect(this.game, consoleFont, "H4X0R"));
        }
        
        makeConsole(consoleFont: Phaser.RetroFont)
        {
            consoleFont.text = "Username: " + window.charmap;
            this.console = this.game.add.image(20, this.logo.getBounds().y+this.logo.getBounds().height+15, consoleFont);
            this.console.position = new Phaser.Point(20, this.logo.getBounds().y+this.logo.getBounds().height+15);
            this.offset = this.console.position.y - this.logo.position.y;
            this.console.smoothed = false;
        }
		
		update()
		{
            for(var i=0;i<this.wackyEffects.length;i++)
            {
                if(this.wackyEffects[i] === undefined) {continue;}
                if(this.wackyEffects[i].decoded)
                {
                    if(this.wackyEffects[i].targetText === "H4X0R")
                    {
                        window.tth.createMapAsync(this.makeConsole, this, TermColor.GRAY, Brightness.NORMAL);
                    }
                    this.wackyEffects[i] = null;
                    continue;
                }
                this.wackyEffects[i].update();
            }
            for(var i=0;i<this.wackyEffects.length;i++)
            {
                if(this.wackyEffects[i] === null)
                {
                    delete this.wackyEffects[i]; //delete item at index
                }
            }
            if(this.logo !== null)
            {
                this.logo.position = new Phaser.Point(this.game.world.centerX-(this.logo.getBounds().width/2), 20);
            }
            if(this.console !== null)
            {
                this.console.position = new Phaser.Point(20, this.logo.position.y + this.offset);
            }
        }
	}
}