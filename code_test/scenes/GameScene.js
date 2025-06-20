import Timer from "../objects/timer.js"
import Score from "../objects/score.js"
let dimensions = {}
export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }
    init(data) {
        this.bgMusic = data.bgMusic
    }
    preload() {
        let ratio = window.devicePixelRatio;
        dimensions.fullWidth = window.innerWidth * ratio;
        dimensions.fullHeight = window.innerHeight * ratio;
        if (window.innerWidth <= 768) {

            this.scale.displaySize.setAspectRatio(dimensions.fullWidth / dimensions.fullHeight);
            this.scale.refresh();
        }
    }
    create() {

        this.setScreenScale();
        //background image 
        const gameWidth = this.sys.game.config.width;
        const gameHeight = this.sys.game.config.height;
        const bg = this.add.image(0, 0, 'bg').setOrigin(0, 0)
        const texture = this.textures.get('bg');
        const source = texture.getSourceImage();
        const originalWidth = source.width;
        const originalHeight = source.height;

        const scaleX = gameWidth / originalWidth;
        const scaleY = gameHeight / originalHeight;
        bg.setScale(scaleX, scaleY);

        //clouds
        this.nature = this.textures.get('nature').getFrameNames();
        const cloud1 = this.add.image(this.scale.width / 2 - 100, 50, 'nature', 'cloud1.png')
            .setOrigin(0.5, 0)
            .setScale(0.2);

        const cloud2 = this.add.image(this.scale.width / 2 + 100, 80, 'nature', 'cloud2.png')
            .setOrigin(0.5, 0)
            .setScale(0.2);

        const floatCloud = (cloud, maxOffset = 50) => {
            const offsetX = Phaser.Math.Between(30, maxOffset);
            this.tweens.add({
                targets: cloud,
                x: cloud.x + offsetX,
                duration: Phaser.Math.Between(3000, 5000),
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });
        };
        floatCloud.call(this, cloud1);
        floatCloud.call(this, cloud2);

        //gameover initial state
        this.gameOver = false
        //fruit fall sppeed
        this.fruitFallSpeed = 250;
        this.spawnDelay = 700;

        //score
        this.score = new Score(this);

        //timer 
        this.timeLeft = 60
        this.timer = new Timer(this);
        //fruit missed
        this.missedFruits = 0;

        //hearts 
        this.hearts = [];

        for (let i = 0; i < 3; i++) {
            const heart = this.add.image(30 + i * 40, 60, 'heart')
                .setOrigin(0, 0)
                .setScale(0.1);
            this.hearts.push(heart);
        }


        // basket
        this.basket = this.physics.add.image(this.scale.width / 2, gameHeight - 180, "basket").setScale(0.8)
        this.basket.body.setAllowGravity(false).setCollideWorldBounds(true);
        this.basketGlow = this.basket.postFX.addGlow(0xffffff, 3, 0);
        //input 
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        //basket drag movement 
        this.basket.setInteractive({ draggable: true });
        this.input.setDraggable(this.basket);
        this.input.on('drag', (pointer, gameObject, dragX) => {
            const halfWidth = gameObject.displayWidth / 2 || 0;
            const clampedX = Phaser.Math.Clamp(dragX, halfWidth, gameWidth - halfWidth);
            gameObject.x = clampedX;
        });
        //fruits
        this.fruitsFrames = this.textures.get('fruits').getFrameNames();
        this.fruitGroup = this.physics.add.group([])
        //red border for missed fruit
        this.flashBorder = this.add.rectangle(
            this.scale.width / 2,
            this.scale.height / 2,
            this.scale.width,
            this.scale.height,
            0xff0000,
            0.3
        ).setDepth(100).setVisible(false);

        //timer event 
        this.spawnTimer = this.time.addEvent({
            delay: this.spawnDelay,
            loop: true,
            callback: this.spawnRandomFruits,
            callbackScope: this,
        });

        // this.time.addEvent({
        //     delay: 30000,
        //     loop: false,
        //     callback: () => {
        //         this.fruitFallSpeed = this.fruitFallSpeed + 250;
        //     }
        // });
        //collider funciton 
        this.physics.add.overlap(this.basket, this.fruitGroup, this.handleBasketFruitCollide, null, this)

        //End Game function
        this.timedEvent = this.time.delayedCall(this.timeLeft * 1000, this.handleEndGame, [], this)

        this.cameras.main.fadeIn(500)

    }
    setScreenScale() {
        if (window.innerWidth <= 768) {

            let scaleX = dimensions.fullWidth / dimensions.gameWidth;
            let scaleY = dimensions.fullHeight / dimensions.gameHeight;

            this.gameScale = (scaleX < scaleY) ? scaleX : scaleY;

            dimensions.actualWidth = this.game.canvas.width / this.gameScale;
            dimensions.actualHeight = this.game.canvas.height / this.gameScale;

            dimensions.leftOffset = -(dimensions.actualWidth - dimensions.gameWidth) / 2;
            dimensions.rightOffset = dimensions.gameWidth - dimensions.leftOffset;
            dimensions.topOffset = -(dimensions.actualHeight - dimensions.gameHeight) / 2;
            dimensions.bottomOffset = dimensions.gameHeight - dimensions.topOffset;
        } else {
            console.log("Device is in landscape")
        }
    }
    update() {
        if (this.gameOver) {
            this.basket.setVelocityX(0)
            return;
        }
        this.timer.updateTime(Math.round(this.timedEvent.getRemainingSeconds()).toString(10))
        if (this.cursorKeys.left.isDown) {
            this.basket.setVelocityX(-350)
        } else if (this.cursorKeys.right.isDown) {
            this.basket.setVelocityX(350)
        } else {
            this.basket.setVelocityX(0)
        }

        this.fruitGroup.getChildren().forEach((child) => {
            if (!child.active) {
                return;
            }
            if (child.y > this.scale.height + 10) {
                child.setActive(false).setVisible(false);
                this.missedFruits += 1;
                if (this.missedFruits <= this.hearts.length) {
                    const heartIndex = this.hearts.length - this.missedFruits;
                    this.hearts[heartIndex].setVisible(false);
                }
                this.flashMissedFruit();
                this.flashMissedFruit();
                if (this.missedFruits >= 3) {
                    this.handleEndGame();
                }
            }


        })

    }

    spawnRandomFruits() {
        const fruit = this.fruitGroup.getFirstDead(true, Phaser.Math.RND.between(50, this.scale.width - 50), -20, 'fruits')
        fruit.setScale(0.2).setActive(true).setVisible(true).setVelocity(0, this.fruitFallSpeed).setFrame(Phaser.Utils.Array.GetRandom(this.fruitsFrames)).enableBody()
    }
    handleBasketFruitCollide(basket, fruit) {
        if (this.gameOver) {
            return;
        }
        const basketBounds = basket.getBounds();
        const fruitBounds = fruit.getBounds();
        const basketHalfY = basketBounds.top + basketBounds.height / 2;
        if (fruitBounds.bottom > basketHalfY) {
            return;
        }
        fruit.disableBody(true, false);


        const currentScore = this.score.score;
        this.score.updateScore(currentScore + 10);
        // const popSound = this.sound.get('pop');
        // if (!popSound || !popSound.isPlaying) {
        this.sound.play('pop', { volume: 0.2 });
        // }
        this.tweens.add({
            targets: fruit,
            x: basket.x,
            y: basket.y - 20,
            scale: 0,
            duration: 300,
            ease: 'easeIn',
            onComplete: () => {
                fruit.setVisible(false);
            }
        });
        const scoreText = this.add.text(fruit.x, fruit.y, '+10', {
            font: '28px Arial',
            fill: '#008000',
            stroke: '#fff',
            strokeThickness: 4
        }).setDepth(100).setOrigin(0.5);

        this.tweens.add({
            targets: scoreText,
            x: basket.x,
            y: basket.y - 80,
            alpha: 0,
            scale: 0.8,
            duration: 800,
            ease: 'Power2',
            onComplete: () => {
                scoreText.destroy();
            }
        });
    }
    flashMissedFruit() {
        this.flashBorder.setVisible(true).setAlpha(0.4);

        this.tweens.add({
            targets: this.flashBorder,
            alpha: 0,
            duration: 300,
            ease: 'Power1',
            onComplete: () => {
                this.flashBorder.setVisible(false);
            }
        });
        this.cameras.main.shake(200, 0.002);
    }
    handleEndGame() {
        console.log('game is over')
        this.gameOver = true
        // this.scene.restart()
        this.cameras.main.fadeOut(500)
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start('GameOverScene', { score: this.score.score, bgMusic: this.bgMusic })

        })
    }

}