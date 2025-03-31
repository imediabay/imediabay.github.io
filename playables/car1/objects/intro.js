import config from "../config.js";

export class Intro extends Phaser.GameObjects.Container {
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
        this.done = false;

        this.bg = this.scene.add.sprite(0, 0, 'intro_bg');
        this.bg.setOrigin(0.5);
        this.add(this.bg);

        this.cloudL = this.scene.add.sprite(0, 0, "sheet", "cta_cloud2");
        this.cloudL.setOrigin(0.5);
        this.cloudL.setScale(1);
        this.add(this.cloudL)

        this.cloudR = this.scene.add.sprite(0, 0, "sheet", "cta_cloud3");
        this.cloudR.setOrigin(0.5);
        this.cloudR.setScale(1);
        this.add(this.cloudR)

        this.logo = this.scene.add.sprite(0, 0, "intro_logo");
        this.logo.setOrigin(0.5);
        this.logo.setScale(0.5);
        this.add(this.logo)

        this.txtGrp = this.scene.add.container(0, 55);
        this.add(this.txtGrp);

        this.textArr = [];
        let xPos = [0, 0];
        let yPos = [10, 194];
        let size = [25, 25];
        let lineSpace = [1, 2];
        let font = ["FuturaPTBook", "FuturaPTBook"]
        let path = [this.scene.text.texts[0].introText, this.scene.text.texts[0].introText1]
        for (let i = 0; i < xPos.length; i++) {
            let introTxt = this.scene.add.text(xPos[i], yPos[i], path[i], {
                fontFamily: font[i],
                align: "center",
                fontSize: size[i],
                fill: "#ffffff",
                stroke: "#000000",
                strokeThickness: 5,
            });
            introTxt.setOrigin(0.5);
            introTxt.setLineSpacing(lineSpace[i]);
            this.txtGrp.add(introTxt);
            this.textArr.push(introTxt)
        }

        this.btnGrp = this.scene.add.container(0, 352);
        this.add(this.btnGrp);

        this.btn = this.scene.add.sprite(0, 0, 'Button');
        this.btn.setOrigin(0.5);
        this.btn.setScale(.5);
        this.btnGrp.add(this.btn);

        this.btnTxt = this.scene.add.text(0, 0, this.scene.text.texts[0].introbtnText, {
            fontFamily: "FuturaPTBook",
            align: "center",
            fontSize: 27,
            fill: "#ffffff",
            fontStyle: "bold",
            stroke: "#000000",
            strokeThickness: 5,

        });
        this.btnTxt.setOrigin(0.5);
        this.btnGrp.add(this.btnTxt);

        this.btn.setInteractive();
        this.btn.on("pointerdown", () => {
            this.onDown(this.btn)
        });


        var tags = {

            marker: {
                underline: {
                    color: '#ffffff',
                    thickness: 3,
                    offset: 4
                }
            }
        };
        var s1 = `<class='marker'>` + this.gameScene.text.texts[0].btmTxt + `</class>`;

        var btmTxt = this.scene.add.rexTagText(0, 420, s1, {
            fontFamily: "UberMoveMedium",
            align: "center",
            fontSize: 17,
            fill: "#ffffff",
            tags: tags,

        });
        btmTxt.setOrigin(0.5);
        this.add(btmTxt);
        this.btmTxt = btmTxt;

        this.btn.setInteractive();
        this.btn.on("pointerup", () => {
            this.onDown(this.btn)
        })

        this.btmTxt.setInteractive();
        this.btmTxt.on("pointerdown", () => {
            this.uberClick()
        });

        this.visible = false;
        if (!window.restart) {
            setTimeout(() => {
                this.show();
            }, 100);
        }
    }

    uberClick() {
        if (this.done) return;
        this.btmTxt.disableInteractive();
        onPromoClick();
        this.done = true;
        this.scene.time.addEvent({
            delay: 10000,
            callback: () => {
                this.done = false;
                this.btmTxt.setInteractive();
            }
        })
    }

    onDown() {
        if (this.buttonTween) this.buttonTween.stop();
        this.scene.carStart.play();

        this.btnGrp.setScale(1);
        this.btn.disableInteractive();
        onStartClick();
        this.scene.tweens.add({
            targets: this.btnGrp,
            scale: "-0.2",
            ease: "Linear",
            duration: 100,
            yoyo: true,
            onComplete: () => {
                this.hide()
            }
        })
    }
    show() {

        if (this.visible) return;
        this.visible = true;

        this.alpha = 0;
        this.cloudL.alpha = 0;
        this.cloudR.alpha = 0;
        this.logo.alpha = 0;
        this.btn.alpha = 0;
        this.btnTxt.alpha = 0;
        for (let i = 0; i < this.textArr.length; i++) {
            this.textArr[i].alpha = 0;
        }
      
        this.scene.tweens.add({
            targets: this,
            alpha: {
                from: 0,
                to: 1
            },
            ease: "Linear",
            duration: 200,
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this.cloudL,
                    x: {
                        from: this.cloudL.x - 500,
                        to: this.cloudL.x
                    },
                    alpha: {
                        from: 0,
                        to: 1
                    },
                    ease: "Linear",
                    duration: 350,
                    onComplete: () => {
                        this.scene.tweens.add({
                            targets: this.cloudL,
                            y: {
                                from: this.cloudL.y,
                                to: this.cloudL.y + 10
                            },
                            ease: "Linear",
                            duration: 2500,
                            yoyo: true,
                            repeat: -1,
                        })
                    }
                })
                this.scene.tweens.add({
                    targets: this.cloudR,
                    x: {
                        from: this.cloudR.x + 500,
                        to: this.cloudR.x
                    },
                    alpha: {
                        from: 0,
                        to: 1
                    },
                    ease: "Linear",
                    duration: 350,
                    onComplete: () => {
                        this.scene.tweens.add({
                            targets: this.cloudR,
                            y: {
                                from: this.cloudR.y,
                                to: this.cloudR.y + 10
                            },
                            ease: "Linear",
                            duration: 2500,
                            yoyo: true,
                            repeat: -1,
                        })
                        this.scene.tweens.add({
                            targets: this.logo,
                            y: {
                                from: this.logo.y - 500,
                                to: this.logo.y
                            },
                            alpha: {
                                from: 0,
                                to: 1
                            },
                            ease: "Sine.easeOut",
                            duration: 200,
                            onComplete: () => {
                                for (let i = 0; i < this.textArr.length; i++) {
                                    setTimeout(() => {
                                        this.scene.tweens.add({
                                            targets: this.textArr[i],
                                            alpha: {
                                                from: 0,
                                                to: 1
                                            },
                                            scaleX: {
                                                from: 0,
                                                to: this.textArr[i].scaleX
                                            },
                                            ease: "Back.easeOut",
                                            duration: 200,
                                            onComplete: () => {
                                                if (i == this.textArr.length - 1) {
                                                    this.scene.tweens.add({
                                                        targets: this.btnTxt,
                                                        alpha: {
                                                            from: 0,
                                                            to: 1
                                                        },
                                                        ease: "Linear",
                                                        duration: 200,
                                                    })
                                                    this.scene.tweens.add({
                                                        targets: this.btn,
                                                        alpha: {
                                                            from: 0,
                                                            to: 1
                                                        },
                                                        ease: "Linear",
                                                        duration: 200,
                                                        onComplete: () => {
                                                            this.buttonTween = this.scene.tweens.add({
                                                                targets: this.btnGrp,
                                                                scale: "-0.1",
                                                                ease: "Linear",
                                                                duration: 600,
                                                                yoyo: true,
                                                                repeat: -1
                                                            })
                                                        }
                                                    })
                                                }
                                            }
                                        })
                                    }, i * 100);
                                }
                            }
                        })
                    }

                })
            }
        })
    }

    hide() {
        if (!this.visible) return;

        this.scene.startGameplay();
        this.scene.tweens.add({
            targets: this,
            alpha: {
                from: 1,
                to: 0,
            },
            ease: "Linear",
            duration: 200,
            onComplete: () => {
                this.visible = false;
            }
        })
    }
}