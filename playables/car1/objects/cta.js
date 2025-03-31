import config from "../config.js";

export class CTA extends Phaser.GameObjects.Container {
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
        this.userWon = false;

        this.textArr = []

        this.bg = this.scene.add.sprite(0, 0, 'cta_bg');
        this.bg.setOrigin(0.5);
        this.add(this.bg);

        this.cloudT = this.scene.add.sprite(0, 0, "sheet", "cta_cloud1");
        this.cloudT.setOrigin(0.5);
        this.cloudT.setScale(0.55);
        this.add(this.cloudT)

        this.leftElement = this.scene.add.sprite(0, 0, "sheet", "cta_leftObject");
        this.leftElement.setOrigin(0.5);
        this.leftElement.setScale(0.5);
        this.add(this.leftElement)

        this.cloudL = this.scene.add.sprite(0, 0, "sheet", "cta_cloud2");
        this.cloudL.setOrigin(0.5);
        this.cloudL.setScale(0.6);
        this.add(this.cloudL)

        this.cloudR = this.scene.add.sprite(0, 0, "sheet", "cta_cloud3");
        this.cloudR.setOrigin(0.5);
        this.cloudR.setScale(0.55);
        this.add(this.cloudR)

        this.btmElement = this.scene.add.sprite(0, 0, "sheet", "cta_leftObject");
        this.btmElement.setOrigin(0.5);
        this.btmElement.setScale(0.7);
        this.btmElement.angle = 195;
        this.add(this.btmElement)

        this.text1 = this.scene.add.text(0, -150, this.scene.text.texts[0].ctaTxt1, {
            fontFamily: "FuturaPTBold",
            align: "center",
            fontSize: 50,
            fill: "#f8751c",
            stroke: "#000000",
            strokeThickness: 7,
        });
        this.text1.setOrigin(0.5);
        this.add(this.text1);

        this.logo = this.scene.add.sprite(0, 0, "sheet", "logo");
        this.logo.setOrigin(0.5);
        this.logo.setScale(0.65);
        this.add(this.logo)

        this.winGrp = this.scene.add.container(0, -100);
        this.add(this.winGrp);

        this.winBatch = this.scene.add.sprite(0, -59, "sheet", "win_batch");
        this.winBatch.setOrigin(0.5);
        this.winBatch.setScale(0.5);
        this.add(this.winBatch)

        this.scoreTxt = this.scene.add.text(this.winBatch.x, this.winBatch.y - 22, this.scene.text.texts[0].score, {
            fontFamily: "FuturaPTBold",
            align: "center",
            fontSize: 43,
            fill: "#ffffff",
            stroke: "#000000",
            strokeThickness: 5,
        });
        this.scoreTxt.setOrigin(0.5);
        this.add(this.scoreTxt);

        let xPos = [0, 0];
        let yPos = [40, 192];
        let size = [28, 27];
        let lineSpace = [-4, -3];
        let fill = ["#ffffff", "#ffffff"]
        let font = ["FuturaPTBook", "FuturaPTBook"]
        let path = [this.scene.text.texts[0].ctaTxt2, this.scene.text.texts[0].ctaTxt3]
        for (let i = 0; i < xPos.length; i++) {
            let winTxt = this.scene.add.text(xPos[i], yPos[i], path[i], {
                fontFamily: font[i],
                align: "center",
                fontSize: size[i],
                fill: fill[i],
                stroke: "#000000",
                strokeThickness: 6,
            });
            winTxt.setOrigin(0.5);
            winTxt.setLineSpacing(lineSpace[i]);
            this.winGrp.add(winTxt);

            this.textArr.push(winTxt)
        }


        this.btnGrp = this.scene.add.container(0, 0);
        this.add(this.btnGrp);

        this.btn = this.scene.add.sprite(0, 0, "cta_btn");
        this.btn.setOrigin(0.5);
        this.btn.setScale(.5);
        this.btnGrp.add(this.btn);

        this.btnTxt = this.scene.add.text(0, 0, this.scene.text.texts[0].ctaBtnText, {
            fontFamily: "FuturaPTBold",
            align: "center",
            fontSize: 26,
            fill: "#ffffff",
            stroke: "#000000",
            strokeThickness: 5,
        });
        this.btnTxt.setOrigin(0.5);
        this.btnGrp.add(this.btnTxt);

        this.btn.setInteractive();
        this.btn.on("pointerdown", () => {
            this.ctaClick()
        });
        var tags = {

            marker: {
                underline: {
                    color: '#ffffff',
                    thickness: 3,
                    offset: 5
                }
            }
        };
        var s1 = `<class='marker'>` + this.gameScene.text.texts[0].playagiainText + `</class>`;

        var btmTxt = this.scene.add.rexTagText(0, 0, s1, {
            fontFamily: "UberMoveMedium",
            align: "center",
            fontSize: 17,
            fill: "#ffffff",
            tags: tags
        });
        btmTxt.setOrigin(0.5);
        this.add(btmTxt)
        this.btmTxt = btmTxt

        this.btmTxt.setInteractive();
        this.btmTxt.on("pointerdown", () => {
            if (this.userWon) {
                onWinPlayAgainClick();
            } else {
                onFailedPlayAgainClick();
            }
            this.scene.tweens.add({
                targets: this,
                alpha: { from: 1, to: 0 },
                ease: "Linear",
                duration: 100,
                onComplete: () => {
                    this.visible = false;
                }
            })
            this.scene.restart(this.btmTxt)
        });

        this.visible = false;
        // setTimeout(() => {
        //     this.userWon = false
        //     this.show()
        // }, 500);
    }

    ctaClick() {
        if (this.done) return;
        this.btn.disableInteractive();
        console.log(this.userWon);

        if (this.userWon) {
            onWinPromoCTAClick();
        } else {
            onFailedPromoCTAClick();
        }
        this.done = true;
        this.scene.time.addEvent({
            delay: 10000,
            callback: () => {
                this.done = false;
                this.btn.setInteractive();
            }
        })
    }

    showBtn() {
        this.scene.tweens.add({
            targets: this.btnTxt,
            alpha: { from: 0, to: 1 },
            ease: "Linear",
            duration: 200,
        })
        this.scene.tweens.add({
            targets: this.btn,
            alpha: { from: 0, to: 1 },
            ease: "Linear",
            duration: 200,
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this.btn,
                    scale: { from: this.btn.scale, to: this.btn.scale - 0.05 },
                    ease: "Linear",
                    duration: 700,
                    yoyo: true,
                    repeat: -1,
                })
                this.scene.tweens.add({
                    targets: this.btnTxt,
                    scale: { from: this.btnTxt.scale, to: this.btnTxt.scale - 0.05 },
                    ease: "Linear",
                    duration: 700,
                    yoyo: true,
                    repeat: -1,
                })
            }
        })
    }

    show() {
        if (this.visible) return;
        this.visible = true;
        this.scene.hideUI();
        this.scene.setPositions()

        this.alpha = 0;
        if (this.userWon) {
            onCompleteClick();
        } else {
            onGameFailedClick();
        }
        this.scoreTxt.text = this.scene.count.txt.text;
        this.winGrp.alpha = 0;
        this.text1.alpha = 0;
        this.winBatch.alpha = 0;
        this.scoreTxt.alpha = 0;
        this.logo.alpha = 0;
        for (let i = 0; i < this.textArr.length; i++) {
            this.textArr[i].alpha = 0;
        }
        this.btn.alpha = 0;
        this.btnTxt.alpha = 0;

        if (this.userWon) {
            this.textArr[0].text = this.scene.text.texts[0].ctaTxt2;
            this.textArr[1].text = this.scene.text.texts[0].ctaTxt3;
            this.text1.text = this.scene.text.texts[0].ctaTxt1;
            this.textArr[0].y = 40;
            this.textArr[1].y = 192;
            this.text1.y = -150;
            this.winBatch.visible = true;
            this.scoreTxt.visible = true;
            this.logo.setScale(0.65);
            this.btmTxt.setFontSize(17);
        } else {
            this.textArr[0].text = this.scene.text.texts[0].failctaTxt2;
            this.textArr[1].text = this.scene.text.texts[0].failctaTxt3;
            this.text1.text = this.scene.text.texts[0].failctaTxt1;
            this.text1.y = -127;
            this.textArr[0].y = -35;
            this.textArr[1].y = 100;
            this.winBatch.visible = false;
            this.scoreTxt.visible = false;
            this.logo.setScale(0.5);
            this.btmTxt.setFontSize(22);
        }

        this.scene.tweens.add({
            targets: this,
            alpha: { from: 0, to: 1 },
            ease: "Linear",
            duration: 200,
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this.logo,
                    alpha: { from: 0, to: 1 },
                    y: { from: this.logo.y - 500, to: this.logo.y },
                    ease: "Back.easeOut",
                    duration: 200,
                    onComplete: () => {
                        this.winGrp.alpha = 1;
                        this.scene.tweens.add({
                            targets: this.cloudL,
                            x: { from: this.cloudL.x, to: this.cloudL.x - 10 },
                            y: { from: this.cloudL.y, to: this.cloudL.y - 10 },
                            ease: "Linear",
                            duration: 2500,
                            yoyo: true,
                            repeat: -1,
                        })
                        this.scene.tweens.add({
                            targets: this.cloudR,
                            x: { from: this.cloudR.x, to: this.cloudR.x + 10 },
                            y: { from: this.cloudR.y, to: this.cloudR.y + 10 },
                            ease: "Linear",
                            duration: 2500,
                            yoyo: true,
                            repeat: -1,
                        })
                        this.scene.tweens.add({
                            targets: this.text1,
                            scale: { from: 2, to: this.text1.scale },
                            alpha: { from: 0, to: 1 },
                            ease: "Back.easeOut",
                            duration: 200,
                            onComplete: () => {
                                this.scene.tweens.add({
                                    targets: this.winBatch,
                                    scaleX: { from: 0, to: this.winBatch.scaleX },
                                    alpha: { from: 0, to: 1 },
                                    ease: "Back.easeOut",
                                    duration: 200,
                                    onComplete: () => {
                                        this.scene.tweens.add({
                                            targets: this.scoreTxt,
                                            scale: { from: 0, to: this.scoreTxt.scale },
                                            alpha: { from: 0, to: 1 },
                                            ease: "Back.easeOut",
                                            duration: 200,
                                            onComplete: () => {
                                                for (let i = 0; i < this.textArr.length; i++) {
                                                    setTimeout(() => {
                                                        this.textArr[i].alpha = 1
                                                        this.scene.tweens.add({
                                                            targets: this.textArr[i],
                                                            x: { from: this.textArr[i].x - 500, to: this.textArr[i].x },
                                                            ease: "Cubic.easeOut",
                                                            duration: 200,
                                                            onComplete: () => {
                                                                if (i == this.textArr.length - 1) {
                                                                    this.showBtn()
                                                                }
                                                            }
                                                        })
                                                    }, i * 50);
                                                }
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }

    hide() {
        this.scene.tweens.add({
            targets: this,
            alpha: {
                from: 1,
                to: 0
            },
            ease: "Linear",
            duration: 100,
            onComplete: () => {
                this.alpha = 1;
                this.visible = false;
            }
        });
    }
}