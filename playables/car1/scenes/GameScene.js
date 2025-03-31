import {
    fullScreen
} from '../utils/screen.js'
import {
    pointerUp
} from '../utils/buttons.js'
import {
    CTA
} from '../objects/cta.js'
import string from "../string.js";
import portrait from '../data/portrait.js';
import landscape from '../data/landscape.js';
import config from '../config.js';
import {
    GamePlay
} from '../objects/game-play.js';
import {
    Control
} from '../objects/control.js';
import {
    Timer
} from '../objects/timer.js';
import {
    Intro
} from '../objects/intro.js';
import {
    Count
} from '../objects/count.js';
import { Life } from '../objects/life.js';

let dimensions = {}
export default class GameScene extends Phaser.Scene {

    // Vars

    constructor() {
        super('GameScene')
    }

    preload() {

        this.levelIndex = 0;

        if (dimensions.isPortrait != dimensions.fullWidth < dimensions.fullHeight) {
            this.switchMode(!dimensions.isPortrait);
        } else {
            this.switchMode(dimensions.isPortrait);
        }

        let ratio = window.devicePixelRatio;
        dimensions.fullWidth = window.innerWidth * ratio;
        dimensions.fullHeight = window.innerHeight * ratio;

        this.scale.displaySize.setAspectRatio(dimensions.fullWidth / dimensions.fullHeight);
        this.scale.refresh();

        this.scale.lockOrientation(this.game.orientation);
    }

    create() {

        this.setGameScale();

        document.getElementById("loader").style.visibility = 'hidden'

        this.text = string;
        // window.restart = true;
        this.carStart = this.sound.add('start');
        this.alarm = this.sound.add('CarAlarm');
        this.disk = this.sound.add('disk');

        this.superGroup = this.add.container();
        this.gameGroup = this.add.container();
        this.superGroup.add(this.gameGroup);

        this.gamePlay = new GamePlay(this, 0, 0, this, dimensions);
        this.gameGroup.add(this.gamePlay);

        this.control = new Control(this, 0, 0, this);
        this.gameGroup.add(this.control);

        this.timer = new Timer(this, 0, 0, this);
        this.gameGroup.add(this.timer);

        this.count = new Count(this, 0, 0, this);
        this.gameGroup.add(this.count);

        this.life = new Life(this, 0, 0, this);
        this.gameGroup.add(this.life);

        this.logo = this.add.sprite(0, 0, "sheet", "logo");
        this.logo.setOrigin(0.5);
        this.logo.setScale(0.5);
        this.gameGroup.add(this.logo);
        this.logo.visible = false;

        this.btmTxt = this.add.text(0, 0, this.text.texts[0].tutorialTxt, {
            fontFamily: "Proxima_Nova_Font",
            align: "center",
            fontSize: 20,
            fill: "#ffffff",
        });
        this.btmTxt.setOrigin(0.5);
        this.gameGroup.add(this.btmTxt);

        this.intro = new Intro(this, 0, 0, this);
        this.gameGroup.add(this.intro);

        this.cta = new CTA(this, 0, 0, this);
        this.gameGroup.add(this.cta);

        this.graphicsGrp = this.add.container(0, 0);
        this.gameGroup.add(this.graphicsGrp);

        this.graphics = this.make.graphics().fillStyle(0x000000, 1).fillRect(dimensions.leftOffset, dimensions.topOffset, dimensions.actualWidth, dimensions.actualHeight);
        this.graphicsGrp.add(this.graphics);

        this.txt = this.add.text(0, 0, this.text.texts[0].portraitTxtt, {
            fontFamily: "FuturaPTBold",
            align: "center",
            fontSize: 75,
            fill: "#ffffff",
        });
        this.txt.setOrigin(0.5);
        this.gameGroup.add(this.txt);

        this.gameOver = false;
        this.setPositions();
        try {
            dapi.addEventListener("adResized", this.gameResized.bind(this));
        } catch (error) {
            this.scale.on('resize', this.gameResized, this)
        }
        this.gameResized();

        if (window.restart) {
            this.startGameplay()
        }

    }

    hideUI() {
        this.alarm.stop();
        this.disk.stop();
        this.disk.setVolume(0)
        this.alarm.setVolume(0)
        this.tweens.add({
            targets: [this.intro, this.count, this.timer, this.gamePlay, this.control, this.logo, this.btmTxt, this.life],
            alpha: 0,
            ease: "Linear",
            duration: 200,
        })
    }
    getAngle(obj1, obj2) {
        // angle in radians
        var angleRadians = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
        // angle in degrees
        var angleDeg = (Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x) * 90 / Math.PI);
        return angleDeg;
    }

    startGameplay() {
        this.gamePlay.show();
        // this.gameGroup.bringToTop(this.timer)
        // this.gameGroup.bringToTop(this.count)
        this.control.show();
        this.logo.visible = true;

        this.count.show();
        this.life.show();
        this.timer.show();
    }

    hide() {

    }

    restart(val) {
        window.restart = true;
        this.scene.restart()
        this.control.hand.visible = false;

    }

    destroySounds() {

        this.sound.mute = !this.sound.mute;
    }


    update(time, deltaTime) {
        super.update();
        this.gamePlay.update();
        this.control.update(time, deltaTime);

    }

    setGameScale() {
        let scaleX = dimensions.fullWidth / dimensions.gameWidth;
        let scaleY = dimensions.fullHeight / dimensions.gameHeight;

        this.gameScale = (scaleX < scaleY) ? scaleX : scaleY;

        dimensions.actualWidth = this.game.canvas.width / this.gameScale;
        dimensions.actualHeight = this.game.canvas.height / this.gameScale;

        dimensions.leftOffset = -(dimensions.actualWidth - dimensions.gameWidth) / 2;
        dimensions.rightOffset = dimensions.gameWidth - dimensions.leftOffset;
        dimensions.topOffset = -(dimensions.actualHeight - dimensions.gameHeight) / 2;
        dimensions.bottomOffset = dimensions.gameHeight - dimensions.topOffset;
    }

    switchMode(isPortrait) {

        dimensions.isPortrait = isPortrait;
        dimensions.isLandscape = !isPortrait;

        let mode = portrait;

        if (dimensions.isLandscape)
            mode = landscape;

        dimensions.gameWidth = mode.gameWidth;
        dimensions.gameHeight = mode.gameHeight;
    }

    gameResized() {
        let ratio = 1;

        try {
            if (`${PLATFORM}` !== "tiktok") {
                try {
                    if (mraid) {
                        var screenSize = mraid.getScreenSize();
                        mraid.setResizeProperties({
                            "width": screenSize.width,
                            "height": screenSize.height,
                            "offsetX": 0,
                            "offsetY": 0
                        });
                        mraid.expand();
                    }
                } catch (e) {

                }
            }
        } catch (e) {

        }


        if (window.screen.systemXDPI !== undefined && window.screen.logicalXDPI !== undefined && window.screen.systemXDPI > window.screen.logicalXDPI)
            ratio = window.screen.systemXDPI / window.screen.logicalXDPI;
        else if (window.devicePixelRatio !== undefined)
            ratio = window.devicePixelRatio;

        try {
            let size = dapi.getScreenSize();

            dimensions.fullWidth = size.width;
            dimensions.fullHeight = size.height;
        } catch (e) {
            dimensions.fullWidth = Math.ceil(window.innerWidth * ratio);
            dimensions.fullHeight = Math.ceil(window.innerHeight * ratio);
        }

        dimensions.ratio = ratio;

        if (this.game.canvas.width === dimensions.fullWidth && this.game.canvas.height === dimensions.fullHeight) {
            return;
        }

        if (dimensions.isPortrait != dimensions.fullWidth < dimensions.fullHeight) {
            this.switchMode(!dimensions.isPortrait);
        } else {
            this.switchMode(dimensions.isPortrait);
        }

        this.game.scale.setGameSize(dimensions.fullWidth, dimensions.fullHeight);

        this.game.canvas.style.width = dimensions.fullWidth + 'px';
        this.game.canvas.style.height = dimensions.fullHeight + 'px';
        this.game.scale.updateBounds();
        this.game.scale.refresh()

        this.setGameScale();
        this.setPositions();
    }

    checkWinFail(isWin = false) {
        if (isWin) {
            this.cta.userWon = true;
        } else {
            this.cta.userWon = false;
        }
    }

    setPositions() {

        this.superGroup.scale = (this.gameScale);
        this.gameGroup.x = (this.game.canvas.width / this.gameScale - dimensions.gameWidth) / 2;
        this.gameGroup.y = (this.game.canvas.height / this.gameScale - dimensions.gameHeight) / 2;

        this.graphics.clear();
        this.graphics = this.make.graphics().fillStyle(0x000000, 1).fillRect(dimensions.leftOffset, dimensions.topOffset, dimensions.actualWidth, dimensions.actualHeight);
        this.graphicsGrp.add(this.graphics);

        this.txt.x = dimensions.gameWidth / 2;
        this.txt.y = dimensions.gameHeight / 2;

        if (dimensions.isLandscape) {
            this.graphicsGrp.visible = true;
            this.txt.visible = true;
        } else {
            this.graphicsGrp.visible = false;
            this.txt.visible = false;
        }
        this.gamePlay.x = dimensions.gameWidth / 2;
        this.gamePlay.y = dimensions.bottomOffset - 250;

        this.gamePlay.cloudL.x = dimensions.leftOffset + 120 - this.gamePlay.x;
        this.gamePlay.cloudL.y = dimensions.topOffset + 120 - (dimensions.topOffset / 2) - this.gamePlay.y;

        this.gamePlay.cloudR.x = dimensions.rightOffset - 130 - this.gamePlay.x;
        this.gamePlay.cloudR.y = dimensions.topOffset + 120 - (dimensions.topOffset / 2) - this.gamePlay.y;

        if (dimensions.topOffset < -50) {
            this.gamePlay.speakerR.x = dimensions.rightOffset - 40 - this.gamePlay.x;
            this.gamePlay.speakerR.y = dimensions.bottomOffset - 560 + (dimensions.topOffset / 2) - this.gamePlay.y;

            this.gamePlay.speakerL.x = dimensions.leftOffset + 30 - this.gamePlay.x;
            this.gamePlay.speakerL.y = dimensions.bottomOffset - 275 + (dimensions.topOffset / 2) - this.gamePlay.y;
        } else if (dimensions.leftOffset < -50) {
            this.gamePlay.speakerR.x = dimensions.rightOffset - 40 - this.gamePlay.x;
            this.gamePlay.speakerR.y = dimensions.bottomOffset - 500 + (dimensions.topOffset / 2) - this.gamePlay.y;

            this.gamePlay.speakerL.x = dimensions.leftOffset + 30 - this.gamePlay.x;
            this.gamePlay.speakerL.y = dimensions.bottomOffset - 200 + (dimensions.topOffset / 2) - this.gamePlay.y;
        } else {
            this.gamePlay.speakerR.x = dimensions.rightOffset - 40 - this.gamePlay.x;
            this.gamePlay.speakerR.y = dimensions.bottomOffset - 515 + (dimensions.topOffset / 2) - this.gamePlay.y;

            this.gamePlay.speakerL.x = dimensions.leftOffset + 30 - this.gamePlay.x;
            this.gamePlay.speakerL.y = dimensions.bottomOffset - 295 + (dimensions.topOffset / 2) - this.gamePlay.y;
        }

        this.logo.x = dimensions.gameWidth / 2;
        this.logo.y = dimensions.topOffset + 115 - (dimensions.topOffset / 2);

        this.btmTxt.x = dimensions.gameWidth / 2;
        this.btmTxt.y = dimensions.bottomOffset - 40;

        this.control.x = dimensions.gameWidth / 2;
        this.control.y = dimensions.bottomOffset - 110;

        this.timer.x = dimensions.leftOffset + 90;
        this.timer.y = dimensions.topOffset + 90 - (dimensions.topOffset / 2)

        this.count.x = dimensions.leftOffset + 90;
        this.count.y = dimensions.topOffset + 158 - (dimensions.topOffset / 2)

        this.life.x = dimensions.rightOffset - 90;
        this.life.y = dimensions.topOffset + 122 - (dimensions.topOffset / 2)

        this.intro.x = dimensions.gameWidth / 2;
        this.intro.y = dimensions.gameHeight / 2;

        this.intro.bg.setScale(1);

        let scaleX = dimensions.actualWidth / this.intro.bg.displayWidth;
        let scaleY = dimensions.actualHeight / this.intro.bg.displayHeight;
        let scale = Math.max(scaleX, scaleY);

        this.intro.bg.setScale(scale);

        this.intro.bg.x = dimensions.gameWidth / 2 - this.intro.x;
        this.intro.bg.y = dimensions.gameHeight / 2 - this.intro.y;

        this.intro.logo.x = dimensions.gameWidth / 2 - this.intro.x;
        this.intro.logo.y = dimensions.topOffset + 252 - (dimensions.topOffset / 2) - this.intro.y;

        this.intro.cloudL.x = dimensions.leftOffset + 175 - this.intro.x;
        this.intro.cloudL.y = dimensions.topOffset + 350 - (dimensions.topOffset / 2) - this.intro.y;

        this.intro.cloudR.x = dimensions.rightOffset - 100 - this.intro.x;
        this.intro.cloudR.y = dimensions.topOffset + 100 - (dimensions.topOffset / 2) - this.intro.y;

        this.cta.x = dimensions.gameWidth / 2;
        this.cta.y = dimensions.gameHeight / 2;

        this.cta.bg.setScale(1);

        scaleX = dimensions.actualWidth / this.cta.bg.displayWidth;
        scaleY = dimensions.actualHeight / this.cta.bg.displayHeight;
        scale = Math.max(scaleX, scaleY);

        this.cta.bg.setScale(scale);

        this.cta.bg.x = dimensions.gameWidth / 2 - this.cta.x;
        this.cta.bg.y = dimensions.gameHeight / 2 - this.cta.y;

        this.cta.leftElement.x = dimensions.leftOffset + 40 - this.cta.x;
        this.cta.leftElement.y = dimensions.topOffset + 300 - (dimensions.topOffset / 2) - this.cta.y;

        this.cta.btmElement.x = dimensions.rightOffset - 20 - this.cta.x;
        this.cta.btmElement.y = dimensions.bottomOffset - 120 + (dimensions.topOffset / 2) - this.cta.y;

        this.cta.cloudL.x = dimensions.leftOffset + 110 - this.cta.x;
        this.cta.cloudL.y = dimensions.topOffset + 130 - (dimensions.topOffset / 2) - this.cta.y;

        this.cta.cloudR.x = dimensions.rightOffset - 120 - this.cta.x;
        this.cta.cloudR.y = dimensions.topOffset + 175 - (dimensions.topOffset / 2) - this.cta.y;

        this.cta.cloudT.x = dimensions.rightOffset - 110 - this.cta.x;
        this.cta.cloudT.y = dimensions.topOffset + 22 - this.cta.y;

        if (this.cta.userWon) {
            this.cta.logo.x = dimensions.gameWidth / 2 - this.cta.x;
            this.cta.logo.y = dimensions.topOffset + 155 - (dimensions.topOffset / 2) - this.cta.y;
        } else {
            this.cta.logo.x = dimensions.gameWidth / 2 - this.cta.x;
            this.cta.logo.y = dimensions.topOffset + 135 - (dimensions.topOffset / 2) - this.cta.y;
        }

        this.cta.winGrp.x = dimensions.gameWidth / 2 - this.cta.x;
        this.cta.winGrp.y = dimensions.gameHeight / 2 + 30 - this.cta.y;

        this.cta.btnGrp.x = dimensions.gameWidth / 2 - this.cta.x;
        this.cta.btnGrp.y = dimensions.bottomOffset - 127 - this.cta.y;

        if (this.cta.userWon) {
            this.cta.btmTxt.x = dimensions.gameWidth / 2 - this.cta.x
            this.cta.btmTxt.y = dimensions.bottomOffset - 53 - this.cta.y
        } else {
            this.cta.btmTxt.x = dimensions.gameWidth / 2 - this.cta.x
            this.cta.btmTxt.y = dimensions.bottomOffset - 245 - this.cta.y
        }

        this.gamePlay.bg.setScale(1);

        scaleX = dimensions.actualWidth / this.gamePlay.bg.displayWidth;
        scaleY = dimensions.actualHeight / this.gamePlay.bg.displayHeight;
        scale = Math.max(scaleX, scaleY);

        this.gamePlay.bg.setScale(scale);

        this.gamePlay.bg.x = dimensions.gameWidth / 2 - this.gamePlay.x
        this.gamePlay.bg.y = dimensions.gameHeight / 2 - this.gamePlay.y
    }

    offsetMouse() {

        return {
            x: (this.game.input.activePointer.worldX * dimensions.actualWidth / dimensions.fullWidth) + ((dimensions.gameWidth - dimensions.actualWidth) / 2),
            y: (this.game.input.activePointer.worldY * dimensions.actualHeight / dimensions.fullHeight) + ((dimensions.gameHeight - dimensions.actualHeight) / 2)
        };
    }

    offsetWorld(point) {
        return {
            x: (point.x * dimensions.actualWidth / this.game.width),
            y: (point.y * dimensions.actualHeight / this.game.height)
        };
    }
}