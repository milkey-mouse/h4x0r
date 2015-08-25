var Haxor;
(function (Haxor) {
    var CookieHelper = (function () {
        function CookieHelper() {
        }
        CookieHelper.prototype.createCookie = function (name, value, days) {
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                var expires = "; expires=" + date.toUTCString();
            }
            else {
                var expires = "";
            }
            document.cookie = name + "=" + value + expires + "; path=/";
        };
        CookieHelper.prototype.readCookie = function (name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ')
                    c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0)
                    return c.substring(nameEQ.length, c.length);
            }
            return null;
        };
        CookieHelper.prototype.eraseCookie = function (name) {
            this.createCookie(name, "", -1);
        };
        return CookieHelper;
    })();
    Haxor.CookieHelper = CookieHelper;
})(Haxor || (Haxor = {}));
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
/// <reference path="CookieHelper.ts" />
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
                var ch = new Haxor.CookieHelper();
                if (ch.readCookie("warnmobile") != "yes") {
                    this.game.state.start("Mobile", true, false);
                }
            }
            this.vload.getVideo("intro", "assets/intro", this.load);
            this.load.spritesheet("skip", "assets/skip.png", 50, 25);
        };
        Boot.prototype.create = function () {
            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = true;
            this.scale.currentScaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.antialias = false;
            this.stage.smoothed = false;
            this.stage.setBackgroundColor(0x000000);
            this.scale.forceLandscape = true;
            window["WebFontConfig"] = {};
            window["WebFontConfig"].google = { families: ['Inconsolata:latin', 'Open Sans:latin'] };
            this.otherloader = new Phaser.Loader(this.game);
            this.otherloader.pack("main", "pack.json");
            this.otherloader.onLoadComplete.add(this.addSkipButton, this);
            this.otherloader.onLoadComplete.add(this.actionComplete, this);
            this.otherloader.start();
            this.loadvid = this.game.add.video("intro");
            this.loadvid.onComplete.add(this.actionComplete, this);
            this.loadvid.play(false);
            this.loadvid.addToWorld(this.game.world.centerX, this.game.world.centerY, 0.5, 0.5);
            console.log(this.loadvid.playing);
            if (!this.loadvid.playing) {
                this.loadvid.play(false);
            }
        };
        Boot.prototype.update = function () {
            if (this.skip != null) {
                this.skip.position = new Phaser.Point(this.game.world.width - 125, this.game.world.height - 75);
            }
        };
        Boot.prototype.addSkipButton = function () {
            this.skip = this.game.add.button(this.game.world.width - 125, this.game.world.height - 75, 'skip', this.actionComplete, this, 2, 1, 0);
            this.skip.scale.setTo(2, 2);
        };
        Boot.prototype.actionComplete = function () {
            this.complete += 1;
            if (this.complete == 2) {
                this.loadvid.stop();
                this.loadvid.destroy();
                this.game.state.start("MainMenu", true, false);
            }
        };
        return Boot;
    })(Phaser.State);
    Haxor.Boot = Boot;
})(Haxor || (Haxor = {}));
/// <reference path="../tsDefinitions/phaser.d.ts" />
/// <reference path="CookieHelper.ts" />
var Haxor;
(function (Haxor) {
    var Mobile = (function (_super) {
        __extends(Mobile, _super);
        function Mobile() {
            _super.apply(this, arguments);
        }
        Mobile.prototype.preload = function () {
            this.load.image("badtime", "assets/bad_time.jpg");
            this.load.spritesheet("whateva", "assets/whateva.png", 217, 25);
        };
        Mobile.prototype.create = function () {
            this.stage.setBackgroundColor(0xFFFFFF);
            this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "badtime").anchor = new Phaser.Point(0.5, 0.5);
            var skip = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 250, 'whateva', this.backToGame, this, 2, 1, 0);
            skip.anchor = new Phaser.Point(0.5, 0.5);
            skip.scale = new Phaser.Point(2, 2);
        };
        Mobile.prototype.backToGame = function () {
            var ch = new Haxor.CookieHelper();
            ch.createCookie("warnmobile", "yes", 365);
            this.game.state.start("Boot", true, true);
        };
        return Mobile;
    })(Phaser.State);
    Haxor.Mobile = Mobile;
})(Haxor || (Haxor = {}));
/// <reference path="../tsDefinitions/phaser.d.ts" />
var Haxor;
(function (Haxor) {
    var MainMenu = (function (_super) {
        __extends(MainMenu, _super);
        function MainMenu() {
            _super.apply(this, arguments);
        }
        MainMenu.prototype.create = function () {
            console.log("yo");
        };
        MainMenu.prototype.update = function () {
        };
        return MainMenu;
    })(Phaser.State);
    Haxor.MainMenu = MainMenu;
})(Haxor || (Haxor = {}));
/// <reference path="../tsDefinitions/phaser.d.ts" />
/// <reference path="Boot.ts" />
/// <reference path="Mobile.ts" />
/// <reference path="MainMenu.ts" />
var Haxor;
(function (Haxor) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, window.innerWidth, window.innerHeight, Phaser.AUTO, 'content', null, false, false);
            this.state.add('Boot', Haxor.Boot, false);
            this.state.add('Mobile', Haxor.Mobile, false);
            this.state.add('MainMenu', Haxor.MainMenu, false);
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