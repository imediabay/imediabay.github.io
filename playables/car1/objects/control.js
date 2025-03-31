import config from "../config.js";

export class Control extends Phaser.GameObjects.Container {
    constructor(scene, x, y, gameScene) {

        super(scene);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.gameScene = gameScene;
        this.scene.add.existing(this);

        this.init();
    }

    init() {
        this.moveSpeed = config.moveSpeed;

        this.controlFrame = this.scene.add.sprite(0, 45, 'line');
        this.controlFrame.setOrigin(0.5);
        this.controlFrame.setScale(.5);
        this.add(this.controlFrame);

        this.controlLogo = this.scene.add.sprite(0, 45, "sheet", "control_logo");
        this.controlLogo.setOrigin(0.5);
        this.controlLogo.setScale(.5);
        this.add(this.controlLogo);

        this.hand = this.scene.add.sprite(0, 70, 'hand');
        this.hand.setOrigin(0.5);
        this.hand.setScale(0.4);
        this.hand.angle = -30;
        this.add(this.hand);
        this.hand.visible = false;

        this.visible = false;

        setTimeout(() => {
            this.show();

        }, 500);
    }

    restart() {
        this.controlFrame = 0
    }

    showHint() {
        this.hand.visible = true;
        this.scene.tweens.add({
            targets: this.hand,
            x: { from: this.hand.x + 100, to: this.hand.x },
            ease: "Linear",
            duration: 1000,
            yoyo: true,
            repeat: -1,

        })
    }

    startGame() {
        this.controlLogo.setInteractive();
        this.scene.input.setDraggable(this.controlLogo);
        this.controlLogo.on('dragstart', function(pointer) {
            this.onArrowDown(pointer, this.startGame);
        }.bind(this));
        this.controlLogo.on('dragend', function(pointer) {
            this.onArrowUp(pointer, this.controlLogo);
        }.bind(this));
    }

    show() {
        if (this.visible) return;

        this.visible = true;
        if (!window.restart) {
            this.showHint()
        }

        this.scene.tweens.add({
            targets: this,
            y: { from: this.y + 200, to: this.y },
            alpha: { from: 0, to: 1 },
            ease: "Linear",
            duration: 200,
            onComplete: () => {
                this.startGame();
            }
        });
    }

    onArrowDown(pointer, sprite) {
        if (this.scene.gameOver) return;
        this.hand.visible = false;
        this.scene.gamePlay.fallingItems();
        this.scene.timer.start();
        this.gameStarted = true;
        this.prevPos = sprite.x;
        this.clicking = true;
    }

    onArrowUp() {

        this.clicking = false;
    }

    update(time, deltaTime) {

        if (this.scene.gameOver) return;
        if (!this.gameStarted) return;

        super.update();
        deltaTime = (0.1 * deltaTime)
        if (this.clicking) {
            let mouse = this.scene.offsetMouse();
            let xp = mouse.x - this.x;

            if (this.prevPos > xp) {

                if (this.controlLogo.x > -158) {
                    this.controlLogo.x -= this.moveSpeed * deltaTime;
                    this.scene.gamePlay.bottle.x -= this.moveSpeed * deltaTime;
                }
            } else if (this.prevPos < xp) {
                if (this.controlLogo.x < 158) {
                    this.controlLogo.x += this.moveSpeed * deltaTime;
                    this.scene.gamePlay.bottle.x += this.moveSpeed * deltaTime;
                }
            }
            this.prevPos = xp;
        }
    }

}