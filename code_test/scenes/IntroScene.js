let dimensions = {}
export default class IntroScene extends Phaser.Scene {
    constructor() {
        super('IntroScene');
    }
    preload() {
        let ratio = window.devicePixelRatio;
        dimensions.fullWidth = window.innerWidth * ratio;
        dimensions.fullHeight = window.innerHeight * ratio;
        if (window.innerWidth <= 768) {
            this.scale.displaySize.setAspectRatio(dimensions.fullWidth / dimensions.fullHeight);
            this.scale.refresh();
        } else {
            console.log("Device is in Landscape")
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
        // console.log(gameWidth)     

        // volume button function 
        const volOn = this.add.image(gameWidth - 60, 10, 'vol-on')
            .setOrigin(0, 0)
            .setScale(0.08)
            .setInteractive();

        const volOff = this.add.image(gameWidth - 60, 10, 'vol-off')
            .setOrigin(0, 0)
            .setScale(0.07)
            .setInteractive();

        if (this.bgMusic && this.bgMusic.mute) {
            volOn.setVisible(false);
            volOff.setVisible(true);
        } else {
            volOn.setVisible(true);
            volOff.setVisible(false);
        }

        volOn.on('pointerdown', () => {
            if (this.bgMusic) this.bgMusic.setMute(true);
            volOn.setVisible(false);
            volOff.setVisible(true);
        });

        volOff.on('pointerdown', () => {
            if (this.bgMusic) this.bgMusic.setMute(false);
            volOn.setVisible(true);
            volOff.setVisible(false);
        });

        const TitleText = this.add.text(this.scale.width / 2, this.scale.height / 2 + 80, 'CATCH THE FRUIT', {
            fontSize: '50px',
            color: '#feff00',
            stroke: '#000',
            strokeThickness: 5
        }).setOrigin(0.5)
        this.tweens.add({
            targets: TitleText,
            y: TitleText.y - 200,
            duration: 500,
            ease: 'easeOut',
            yoyo: false,
            repeat: 0
        });
        this.time.delayedCall(500, () => {
            const buttonBg = this.add.rectangle(this.scale.width / 2, this.scale.height / 2 + 100, 150, 50, 0xff0000)
                .setStrokeStyle(2, 0xffffff)
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true });

            const playText = this.add.text(this.scale.width / 2, this.scale.height / 2 + 100, 'Play Now', {
                fontSize: '22px',
                color: '#fff',
                fontFamily: 'Arial',
            }).setOrigin(0.5);

            this.tweens.add({
                targets: [buttonBg, playText],
                y: playText.y - 10,
                duration: 800,
                ease: 'Bounce.easeOut',
                yoyo: true,
                repeat: -1
            });
            buttonBg.on('pointerdown', () => {
                console.log("Button clicked!");
                this.cameras.main.fadeOut(500);
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                    this.scene.start('GameScene', {
                        bgMusic: this.bgMusic
                    });
                });
            });
            playText.setInteractive({ useHandCursor: true });
            playText.on('pointerdown', () => {
                this.cameras.main.fadeOut(500);
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                    this.scene.start('GameScene', {
                        bgMusic: this.bgMusic
                    });
                });

            });
        })

        if (window.innerWidth <= 768) {
            this.bgMusic = this.sound.add('bg-music', {
                loop: true,
                volume: 0.2
            });
            this.bgMusic.play();
        }
        // this.time.delayedCall(1000, () => {
        //     const handleStart = (pointer) => {
        //         const volBoundsOn = volOn.getBounds();
        //         const volBoundsOff = volOff.getBounds();

        //         const clickedVolume =
        //             (volOn.visible && Phaser.Geom.Rectangle.Contains(volBoundsOn, pointer.x, pointer.y)) ||
        //             (volOff.visible && Phaser.Geom.Rectangle.Contains(volBoundsOff, pointer.x, pointer.y));

        //         if (pointer.y >= 30 && !clickedVolume) {
        //             this.input.off('pointerdown', handleStart);
        //           
        //         }
        //     };
        //     this.input.on('pointerdown', handleStart);
        // });


        this.cameras.main.fadeIn(500);

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

}