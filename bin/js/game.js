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
var Haxor;
(function (Haxor) {
    var VideoLoad = (function () {
        function VideoLoad() {
            var testEl = document.createElement("video");
            this.mp4 = this.canPlay("mp4", testEl);
            this.webm = this.canPlay("webm", testEl);
            this.ogg = this.canPlay("ogg", testEl);
            try {
                testEl.remove();
            }
            catch (e) {
                console.warn("failed to remove video test element");
            }
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
/// <reference path="helpers/CookieHelper.ts" />
/// <reference path="helpers/VideoLoad.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Haxor;
(function (Haxor) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
            this.vload = new Haxor.VideoLoad();
            this.aload = new Haxor.AudioLoad();
            this.complete = 0;
        }
        Boot.prototype.preload = function () {
            console.log("V293LCB5b3UgcmVhbGx5IGFyZSBhbiAzMTMzNyBoNHgwciEKCmh0dHA6Ly9iaXQubHkvMWRKTFNvVwoK");
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
            window.WebFontConfig = {};
            window.WebFontConfig.google = { families: ['Inconsolata:latin', 'Open Sans:latin'] };
            var aloader = new Phaser.Loader(this.game);
            aloader.text("audiolist", "audio.txt");
            aloader.onLoadComplete.add(this.loadAudio, this);
            aloader.start();
            this.otherloader = new Phaser.Loader(this.game);
            this.otherloader.pack("main", "pack.json");
            this.otherloader.onLoadComplete.add(this.addSkipButton, this);
            this.otherloader.onLoadComplete.add(this.actionComplete, this);
            this.loadvid = this.game.add.video("intro");
            this.loadvid.onComplete.add(this.actionComplete, this);
            this.loadvid.play(false);
            this.loadvid.addToWorld(this.game.world.centerX, this.game.world.centerY, 0.5, 0.5);
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
        Boot.prototype.loadAudio = function () {
            this.aload.getAudioPack(this.otherloader, this.game.cache.getText("audiolist"));
            this.otherloader.start();
        };
        Boot.prototype.createCRCLookup = function () {
            window.crc32 = new Array(256);
            for (var i = 0; i < 256; i++) {
                var c = i;
                for (var j = 0; j < 8; j++) {
                    if (c & 1) {
                        c = -306674912 ^ ((c >> 1) & 0x7fffffff);
                    }
                    else {
                        c = (c >> 1) & 0x7fffffff;
                    }
                }
                window.crc32[i] = c;
            }
        };
        Boot.prototype.actionComplete = function () {
            this.complete += 1;
            if (this.complete === 2) {
                window.charmap = this.game.cache.getText("charmap");
                window.tth = new Haxor.TerminalTextHelper(this.game);
                this.createCRCLookup();
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
/// <reference path="helpers/CookieHelper.ts" />
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
/// <reference path="../../tsDefinitions/phaser.d.ts" />
var Haxor;
(function (Haxor) {
    (function (TermColor) {
        TermColor[TermColor["BLACK"] = 0] = "BLACK";
        TermColor[TermColor["RED"] = 1] = "RED";
        TermColor[TermColor["GREEN"] = 2] = "GREEN";
        TermColor[TermColor["YELLOW"] = 3] = "YELLOW";
        TermColor[TermColor["BLUE"] = 4] = "BLUE";
        TermColor[TermColor["MAGENTA"] = 5] = "MAGENTA";
        TermColor[TermColor["CYAN"] = 6] = "CYAN";
        TermColor[TermColor["WHITE"] = 7] = "WHITE";
        TermColor[TermColor["GRAY"] = 8] = "GRAY";
    })(Haxor.TermColor || (Haxor.TermColor = {}));
    var TermColor = Haxor.TermColor;
    var TerminalTextHelper = (function () {
        function TerminalTextHelper(game) {
            this.colors = [
                [0, 0, 0],
                [0, 0, 1],
                [0, 1, 0],
                [0, 1, 1],
                [1, 0, 0],
                [1, 0, 1],
                [1, 0.5, 0],
                [1.5, 1.5, 1.5],
                [0.5, 0.5, 0.5],
            ];
            this.lastRequestedName = null;
            this.lastCallback = null;
            this.lastContext = null;
            this.game = game;
            this.original = this.game.make.bitmapData().load("terminal");
        }
        TerminalTextHelper.prototype.brightenize = function (color, brightness) {
            var newcolor = new Array(color.length);
            if (brightness === 0) {
                for (var i = 0; i < color.length; i++) {
                    newcolor[i] = (color[i] != 0) ? 255 : 85;
                }
            }
            else {
                for (var i = 0; i < color.length; i++) {
                    newcolor[i] = color[i] * 170;
                }
            }
            return newcolor;
        };
        TerminalTextHelper.prototype.colorizeMap = function (foreground, foreBrightness, background, backBrightness) {
            if (background === void 0) { background = null; }
            if (backBrightness === void 0) { backBrightness = 1; }
            var forecolor = this.brightenize(this.colors[foreground], foreBrightness);
            if (background === null) {
                return this.createColoredMap(forecolor[0], forecolor[1], forecolor[2]);
            }
            var backcolor = this.brightenize(this.colors[background], backBrightness);
            return this.createColoredMap(forecolor[0], forecolor[1], forecolor[2], backcolor[0], backcolor[1], backcolor[2]);
        };
        TerminalTextHelper.prototype.callback = function () {
            var consoleFont = this.game.make.retroFont(this.lastRequestedName, 8, 12, window.charmap, 1);
            consoleFont.autoUpperCase = false;
            consoleFont.multiLine = true;
            consoleFont.align = Phaser.RetroFont.ALIGN_LEFT;
            consoleFont.removeUnsupportedCharacters = function (s) { return s; };
            this.lastCallback.call(this.lastContext, consoleFont);
        };
        TerminalTextHelper.prototype.createMapAsync = function (callback, callbackContext, foreground, foreBrightness, background, backBrightness) {
            if (background === void 0) { background = null; }
            if (backBrightness === void 0) { backBrightness = 1; }
            this.lastRequestedName = "term_" + foreground.toString() + foreBrightness.toString() + (background === null ? "" : background.toString()) + (backBrightness === null ? "" : backBrightness.toString());
            this.lastCallback = callback;
            this.lastContext = callbackContext;
            if (this.game.cache.checkImageKey(this.lastRequestedName)) {
                if (callback !== null) {
                    this.callback();
                }
                return true;
            }
            this.game.load.image(this.lastRequestedName, this.colorizeMap(foreground, foreBrightness, background, backBrightness));
            if (callback !== null) {
                this.game.load.onFileComplete.addOnce(this.callback, this);
            }
            ;
            this.game.load.start();
        };
        TerminalTextHelper.prototype.createColoredMap = function (r, g, b, br, bg, bb) {
            if (br === void 0) { br = null; }
            if (bg === void 0) { bg = null; }
            if (bb === void 0) { bb = null; }
            var benc = new window.PNGlib(this.original.width, this.original.height, 256);
            var back = null;
            if (br !== null && bg !== null && bb !== null) {
                back = benc.color(br, bg, bb, 255);
            }
            else {
                back = benc.color(0, 0, 0, 0);
            }
            var front = benc.color(r, g, b, 255);
            var j = 0;
            for (var i = 0; i < this.original.imageData.data.length; i += 4) {
                if (this.original.imageData.data[i] === 255) {
                    benc.buffer[benc.index(j % this.original.width, Math.floor(j / this.original.width))] = front;
                }
                else {
                    benc.buffer[benc.index(j % this.original.width, Math.floor(j / this.original.width))] = back;
                }
                j++;
            }
            return benc.getBase64();
        };
        return TerminalTextHelper;
    })();
    Haxor.TerminalTextHelper = TerminalTextHelper;
})(Haxor || (Haxor = {}));
/// <reference path="../tsDefinitions/phaser.d.ts" />
/// <reference path="text/TerminalTextHelper.ts" />
var Haxor;
(function (Haxor) {
    var MainMenu = (function (_super) {
        __extends(MainMenu, _super);
        function MainMenu() {
            _super.apply(this, arguments);
            this.wackyEffects = new Array();
        }
        MainMenu.prototype.create = function () {
            this.game.sound.play("complab", 0.6, true);
            this.game.sound.play("typing", 1, true);
            window.tth.createColoredMap(255, 0, 0, 0, 0, 255);
            window.tth.createMapAsync(this.destroyOld, this, Haxor.TermColor.WHITE, 0);
        };
        MainMenu.prototype.destroyOld = function (consoleFont) {
            consoleFont.text = "H4X0R";
            var logo = this.game.add.image(0, 0, consoleFont);
            logo.smoothed = false;
            logo.scale = new Phaser.Point(6.5, 6.5);
            var bounds = logo.getBounds();
            logo.position = new Phaser.Point(this.game.world.centerX - (bounds.width * 3.25), this.game.world.centerY - (bounds.height * 3.25));
            this.wackyEffects.push(new Haxor.DecryptorEffect(this.game, consoleFont, "     "));
            window.tth.createMapAsync(this.addNew, this, Haxor.TermColor.WHITE, 0);
        };
        MainMenu.prototype.addNew = function (consoleFont) {
            consoleFont.text = "     ";
            var logo = this.game.add.image(0, 0, consoleFont);
            logo.smoothed = false;
            logo.scale = new Phaser.Point(3, 3);
            logo.position = new Phaser.Point(this.game.world.centerX - (logo.getBounds().width * 1.5), this.game.world.centerY);
            this.wackyEffects.push(new Haxor.DecryptorEffect(this.game, consoleFont, "H4X0R"));
        };
        MainMenu.prototype.update = function () {
            for (var i = 0; i < this.wackyEffects.length; i++) {
                if (this.wackyEffects[i].decoded) {
                    this.wackyEffects[i] = null;
                    continue;
                }
                this.wackyEffects[i].update();
            }
            for (var i = 0; i < this.wackyEffects.length; i++) {
                if (this.wackyEffects[i] === null) {
                    this.wackyEffects.splice(i, 1);
                }
            }
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
            this.state.start('Boot');
        }
        Game.prototype.fixSize = function (event) {
            var oldX = window.game.world.centerX;
            var oldY = window.game.world.centerY;
            window.game.scale.setGameSize(window.innerWidth, window.innerHeight);
            var offX = window.game.world.centerX - oldX;
            var offY = window.game.world.centerY - oldY;
            window.game.world.forEach(function (obj) {
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
    try {
        window.addEventListener("resize", game.fixSize, false);
    }
    catch (e) {
        window.onload = game.fixSize;
        console.warn("overriding window.onload instead of addEventListener");
    }
    window.game = game;
};
var Haxor;
(function (Haxor) {
    var AudioLoad = (function () {
        function AudioLoad() {
            this.bestExtension = null;
            this.loader = null;
            var testEl = document.createElement("audio");
            if (testEl.canPlayType('audio/mpeg;') != "") {
                this.bestExtension = ".mp3";
            }
            else if (testEl.canPlayType('audio/ogg; codecs="vorbis"') != "") {
                this.bestExtension = ".ogg";
            }
            else if (testEl.canPlayType('audio/wav; codecs="1"') != "") {
                this.bestExtension = ".wav";
            }
            else {
                console.warn("no audio formats working");
            }
            try {
                testEl.remove();
            }
            catch (e) {
                console.warn("failed to remove audio test element");
            }
        }
        AudioLoad.prototype.getAudioPack = function (loader, text) {
            this.loader = loader;
            var keys = text.split(",");
            for (var key in keys) {
                this.getAudio(keys[key]);
            }
        };
        AudioLoad.prototype.getAudio = function (key) {
            this.loader.audio(key, "assets/audio/" + key + this.bestExtension, true);
        };
        return AudioLoad;
    })();
    Haxor.AudioLoad = AudioLoad;
})(Haxor || (Haxor = {}));
/// <reference path="../../tsDefinitions/phaser.d.ts" />
var Haxor;
(function (Haxor) {
    var DecryptorEffect = (function () {
        function DecryptorEffect(game, text, target, randomize, onDecoded, decodedCallback) {
            if (target === void 0) { target = null; }
            if (randomize === void 0) { randomize = true; }
            if (onDecoded === void 0) { onDecoded = null; }
            if (decodedCallback === void 0) { decodedCallback = null; }
            this.decoded = false;
            this.decEvent = null;
            this.decCallback = null;
            this.game = game;
            this.dectext = text;
            this.charmap = this.game.cache.getText("charmap");
            this.target = new Array(text.text.length);
            for (var i = 0; i < text.text.length; i++) {
                if (target === null) {
                    this.target[i] = null;
                }
                else {
                    var chr = target.charAt(i);
                    if (chr === "") {
                        this.target[i] = null;
                    }
                    else {
                        this.target[i] = this.charmap.indexOf(chr);
                    }
                }
            }
            if (randomize) {
                var chars = new Array(this.dectext.text.length);
                for (var i = 0; i < this.dectext.text.length; i++) {
                    chars[i] = this.charmap.charAt(Math.floor(Math.random() * (this.charmap.length - 1) + 1));
                }
                this.dectext.text = chars.join("");
            }
            if (onDecoded !== null) {
                this.decEvent = onDecoded;
                this.decCallback = decodedCallback;
            }
        }
        DecryptorEffect.prototype.update = function () {
            var justDecoded = true;
            var chars = new Array(this.dectext.text.length);
            for (var i = 0; i < this.dectext.text.length; i++) {
                var val = this.charmap.indexOf(this.dectext.text.charAt(i));
                if (val !== this.target[i]) {
                    justDecoded = false;
                    if (val === this.charmap.length) {
                        val = 0;
                    }
                    val++;
                }
                chars[i] = this.charmap.charAt(val);
            }
            this.dectext.text = chars.join("");
            if (justDecoded) {
                if (!this.decoded) {
                    if (this.decEvent !== null) {
                        this.decEvent.call(this.decCallback);
                    }
                    this.decoded = true;
                }
            }
        };
        return DecryptorEffect;
    })();
    Haxor.DecryptorEffect = DecryptorEffect;
})(Haxor || (Haxor = {}));
