/// <reference path="../tsDefinitions/phaser.d.ts" />
var Haxor;
(function (Haxor) {
    var VideoLoad = (function () {
        function VideoLoad() {
            var testEl = document.createElement("video");
            this.mp4 = this.canPlay("mp4", testEl);
            this.webm = this.canPlay("webm", testEl);
            this.ogg = this.canPlay("ogg", testEl);
            testEl.remove();
        }
        VideoLoad.prototype.canPlay = function (type, testEl) {
            var result = false;
            switch (type) {
                case "mp4":
                    result = (testEl.canPlayType('video/mp4; codecs="avc1.F4001E"') != "") ||
                        (testEl.canPlayType('video/mp4; codecs="avc1.F4001E, mp4a.40.2"') != "");
                case "webm":
                    result = (testEl.canPlayType('video/webm; codecs="vp8, vorbis"') != "");
                case "ogg":
                    result = (testEl.canPlayType('video/ogg; codecs="theora"') != "");
            }
            return result;
        };
        VideoLoad.prototype.getVideo = function (vidname, urlNoExtension, loader) {
            if (this.mp4) {
                loader.video(vidname, urlNoExtension + ".mp4");
                return true;
            }
            else if (this.webm) {
                loader.video(vidname, urlNoExtension + ".webm");
                return true;
            }
            else if (this.ogg) {
                loader.video(vidname, urlNoExtension + ".ogv");
                return true;
            }
            else {
                return false;
            }
        };
        return VideoLoad;
    })();
    Haxor.VideoLoad = VideoLoad;
})(Haxor || (Haxor = {}));
/// <reference path="../tsDefinitions/phaser.d.ts" />
/// <reference path="VideoLoad.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Haxor;
(function (Haxor) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
            this.vload = new Haxor.VideoLoad();
            this.complete = 0;
        }
        Boot.prototype.preload = function () {
            if (!this.game.device.desktop) {
                window.location.replace("/mobile.html");
            }
            this.vload.getVideo("intro", "assets/intro", this.load);
        };
        Boot.prototype.create = function () {
            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = true;
            this.scale.currentScaleMode = Phaser.ScaleManager.SHOW_ALL;
            if (this.game.renderType == Phaser.CANVAS) {
                Phaser.Canvas.setSmoothingEnabled(this.game.context, false);
            }
            else {
                this.game.antialias = false;
            }
            this.stage.setBackgroundColor(0x000000);
            this.scale.forceLandscape = true;
            window["WebFontConfig"] = {};
            window["WebFontConfig"].google = { families: ['Inconsolata:latin', 'Open Sans:latin'] };
            this.otherloader = new Phaser.Loader(this.game);
            this.otherloader.pack("main", "pack.json");
            this.otherloader.onLoadComplete.add(this.actionComplete, this);
            this.otherloader.start();
            this.loadvid = this.game.add.video("intro");
            this.loadvid.onComplete.add(this.actionComplete, this);
            this.loadvid.play(false);
            this.loadvid.addToWorld(this.game.world.centerX, this.game.world.centerY, 0.5, 0.5);
        };
        Boot.prototype.actionComplete = function () {
            this.complete += 1;
            if (this.complete == 2) {
                console.log("done");
            }
        };
        return Boot;
    })(Phaser.State);
    Haxor.Boot = Boot;
})(Haxor || (Haxor = {}));
/// <reference path="../tsDefinitions/phaser.d.ts" />
/// <reference path="Boot.ts" />
/// <reference path="VideoLoad.ts" />
var Haxor;
(function (Haxor) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, window.innerWidth, window.innerHeight, Phaser.AUTO, 'content', null, false, false);
            this.state.add('Boot', Haxor.Boot, false);
            console.log("V293LCB5b3UgcmVhbGx5IGFyZSBhbiAzMTMzNyBoNHgwciEKCmh0dHA6Ly9iaXQubHkvMWRKTFNvVwoK");
            this.state.start('Boot');
        }
        Game.prototype.fixSize = function (event) {
            var hgw = window;
            var oldX = hgw.game.world.centerX;
            var oldY = hgw.game.world.centerY;
            hgw.game.scale.setGameSize(window.innerWidth, window.innerHeight);
            var offX = hgw.game.world.centerX - oldX;
            var offY = hgw.game.world.centerY - oldY;
            hgw.game.world.forEach(function (obj) {
                obj.x += offX;
                obj.y += offY;
            }, this);
        };
        return Game;
    })(Phaser.Game);
    Haxor.Game = Game;
})(Haxor || (Haxor = {}));
window.onload = function () {
    var game = new Haxor.Game();
    window.addEventListener("resize", game.fixSize, false);
    window.game = game;
};
