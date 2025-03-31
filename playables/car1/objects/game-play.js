import config from "../config.js";

export class GamePlay extends Phaser.GameObjects.Container {
    constructor(scene, x, y, gameScene, dimensions) {

        super(scene);
        this.scene = scene;
        this.dimensions = dimensions;
        this.x = x;
        this.y = y;
        this.gameScene = gameScene;
        this.scene.add.existing(this);

        this.init();
    }

    init() {
        this.gameStarted = false;
        this.gameEnded = false;
        this.placedArr = [];
        this.clickDone = false;
        this.pathArr = ['ball', 'card', 'Feather', 'yellow_element', 'fill_life'];
        this.fixedArr = [...this.pathArr];
        this.xPos = [-180, 0, 80, 180, 50];
        this.fixedPos = [...this.xPos];

        this.bg = this.scene.add.sprite(0, 0, 'bg');
        this.bg.setOrigin(0.5);
        this.add(this.bg);

        this.cloudL = this.scene.add.sprite(0, 0, "game_cloud1");
        this.cloudL.setOrigin(0.5);
        this.cloudL.setScale(0.5);
        this.add(this.cloudL)

        this.cloudR = this.scene.add.sprite(0, 0, "game_cloud2");
        this.cloudR.setOrigin(0.5);
        this.cloudR.setScale(0.5);
        this.add(this.cloudR)

        this.speakerL = this.scene.add.sprite(0, 0, "bg_object2");
        this.speakerL.setOrigin(0.5);
        this.speakerL.setScale(0.5);
        this.add(this.speakerL)

        this.speakerR = this.scene.add.sprite(0, 0, "bg_object1");
        this.speakerR.setOrigin(0.5);
        this.speakerR.setScale(0.5);
        this.add(this.speakerR)

        this.bottle = this.scene.add.container(0, 0, this);
        this.add(this.bottle);

        this.bag1 = this.scene.add.sprite(0, 0, "sheet", 'pick_items/bag');
        this.bag1.setOrigin(0.5);
        this.bag1.setScale(0.5);
        this.bottle.add(this.bag1);

        let posX = [-40, -20, 28, 50, 40, ]
        let posY = [-50, -50, -50, -50, -50]
        let itemName = ['ball', 'card', 'Feather', 'yellow_element', 'fill_life']

        for (let i = 0; i < 4; i++) {

            let item = this.scene.add.sprite(posX[i], posY[i], "sheet", 'pick_items/' + itemName[i]);
            item.setOrigin(0.5);
            item.setScale(0.35);

            this.bottle.add(item);

            item.visible = false;
            item.name = itemName[i]
            this.placedArr.push(item);
        }

        this.frontBag = this.scene.add.sprite(0, 0, "sheet", 'pick_items/bag');
        this.frontBag.setOrigin(0.5);
        this.frontBag.setScale(0.5);
        this.bottle.add(this.frontBag);

        this.bag = this.scene.add.sprite(0, -20, "sheet", 'pick_items/bag');
        this.bag.setOrigin(0.5);
        this.bag.setScale(0.5);
        this.bottle.add(this.bag);
        this.bag.alpha = 0;

        this.bagL = this.scene.add.rectangle(-120, -18, 20, 70, 0xff0000); // A red rectangle
        this.bagL.setOrigin(0.5);
        this.bottle.add(this.bagL);
        this.bagL.alpha = 0;

        this.bagR = this.scene.add.rectangle(120, -18, 20, 70, 0xff0000); // A red rectangle
        this.bagR.setOrigin(0.5);
        this.bottle.add(this.bagR);
        this.bagR.alpha = 0;

        this.visible = false;
        // this.show();

    }

    removeItems() {

        this.scene.time.removeEvent(this.itemTimer);
        for (let i = 0; i < this.itemArr.length; i++) {
            this.itemArr[i].destroy();
        }
    }

    restart() {
        this.bottle.x = 0;
        for (let i = 0; i < this.itemArr.length; i++) {
            this.itemArr[i].destroy();
        }
        this.gameStarted = false;
        this.addItems();
    }

    addItems() {
        this.gameStarted = true;
        this.itemArr = [];
        this.itemTimer = this.scene.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                if (!this.gameEnded)
                    this.addItem();
            }
        })
    }

    addItem() {
        if (!this.pathArr || this.pathArr.length <= 0) {
            this.pathArr = [...this.fixedArr];
        }
        if (!this.xPos || this.xPos.length <= 0) {
            this.xPos = [...this.fixedPos];
        }
        // this.gameEnded = true
        Phaser.Utils.Array.Shuffle(this.pathArr);
        Phaser.Utils.Array.Shuffle(this.xPos);
        let rndNum = Phaser.Math.Between(0, this.pathArr.length - 1);
        if (this.itemArr[this.itemArr.length - 1]) {
            if (this.itemArr[this.itemArr.length - 1].name == this.pathArr[rndNum]) {
                if (rndNum == this.pathArr.length - 1) rndNum -= 1;
                else rndNum += 1;
            }
        }

        let xp = Phaser.Math.Between(0, this.xPos.length - 1)
        let item = this.scene.add.sprite(this.xPos[xp], -900, "sheet", "pick_items/" + this.pathArr[rndNum]);
        item.setOrigin(0.5);
        item.setScale(0.45);
        this.add(item);
        this.itemArr.push(item);
        item.isCollected = false;
        item.name = this.pathArr[rndNum];

        item.tween = this.scene.tweens.add({
            targets: item,
            y: {
                from: item.y,
                to: item.y + 1200
            },
            ease: "Power0",
            duration: 2000,
            onComplete: () => {
                let cleanArr = this.itemArr.filter((item1) => item1 != item);
                this.itemArr = [...cleanArr];

                item.destroy();
            }
        });

        for (let i = 0; i < this.placedArr.length; i++) {
            if (this.placedArr[i].name == item.name && !this.placedArr[i].visible) {
                this.placedArr[i].visible = true;
                this.scene.tweens.add({
                    targets: this.placedArr[i],
                    alpha: {
                        from: 0,
                        to: 0
                    },
                    ease: "Linear",
                    duration: 200,
                });
            }
        }
        this.pathArr.splice(this.pathArr.indexOf(this.pathArr[rndNum]), 1);
        this.xPos.splice(this.xPos.indexOf(this.xPos[xp]), 1);
    }

    checkOverlap(spriteA, spriteB) {
        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();
        return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
    }

    show() {
        if (this.visible) return;
        this.visible = true;

    }

    fallingItems() {
        if (this.gameStarted) return;
        this.addItems();
    }

    collectCandy(item) {
        if (item.tween) item.tween.stop();

        if (item.name == "fill_life") {
            this.scene.disk.play();

            this.scene.count.updateCount(0);
        } else {
            this.scene.alarm.play();

            this.scene.count.updateCount(1);

        }

        let cleanArr = this.itemArr.filter((item1) => item1 != item);
        this.itemArr = [...cleanArr];

        for (let i = 0; i < this.placedArr.length; i++) {
            if (this.placedArr[i].name == item.name && !this.placedArr[i].checked) {
                this.placedArr[i].checked = true;
                if (this.gameEnded) {
                    for (let i = 0; i < this.itemArr.length; i++) {
                        this.itemArr[i].visible = false;
                    }
                }
                item.visible = true
            }
        }

        item.isCollected = true;

        if (item.name == "fill_life") {
            this.scene.life.heartBroke();
        }
        let xPos = this.bag.x + this.bottle.x;
        let yPos = this.bag.y + this.bottle.y - 70;
        this.scene.tweens.add({
            targets: item,
            x: {
                from: item.x,
                to: xPos
            },
            y: {
                from: item.y,
                to: yPos
            },
            alpha: {
                from: 1,
                to: 0
            },
            ease: "Power0",
            duration: 150,
            onComplete: () => {
                item.visible = false;
                item.destroy();
            }
        })

    }

    update() {
        if (this.scene.gameOver) return;
        if (!this.gameStarted) return;
        super.update();

        for (let i = 0; i < this.itemArr.length; i++) {
            if (!this.itemArr[i].isCollected) {
                if (this.checkOverlap(this.itemArr[i], this.bagL)) {
                    this.removeCandyTween(this.itemArr[i], "left")
                } else if (this.checkOverlap(this.itemArr[i], this.bagR)) {
                    this.removeCandyTween(this.itemArr[i], "right")
                } else if (this.checkOverlap(this.itemArr[i], this.bag) && this.itemArr[i].y < 10) {
                    this.collectCandy(this.itemArr[i]);
                }
            }
        }
    }

    removeCandyTween(item, side) {
        if (item.tween) item.tween.stop();
        item.isCollected = true;

        let cleanArr = this.itemArr.filter((item1) => item1 != item);
        this.itemArr = [...cleanArr];

        let xPos = 150;
        let yPos = 50;
        let angle = 200;
        if (side == "left") {
            xPos = -150;
            angle = -200;
        }
        this.scene.tweens.add({
            targets: item,
            x: {
                from: item.x,
                to: item.x + xPos
            },
            y: {
                from: item.y,
                to: item.y + yPos
            },
            angle: angle,
            ease: "Power0",
            duration: 250,
        })

        this.scene.tweens.add({
            targets: item,
            alpha: 0,
            ease: "Power0",
            duration: 250,
            delay: 100,
            onComplete: () => {
                item.visible = false;
                item.destroy();
            }
        })
    }

}