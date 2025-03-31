export class Life extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.scene.add.existing(this);
        this.totalLife = 3;

        this.init();
    }

    init() {
        this.lifeArr = [];
        let startX;
        startX = -31;
        this.totalLife = 3

        this.back = this.scene.add.sprite(0, 0, "sheet", "life_back");
        this.back.setScale(0.42)
        this.add(this.back);

        for (let i = 0; i < 3; i++) {

            let emptyHeart = this.scene.add.sprite(startX, 0, 'sheet', "empty_life")
            emptyHeart.setOrigin(0.5);
            emptyHeart.setScale(0.47);
            this.add(emptyHeart);

            let heart = this.scene.add.sprite(startX, 0, 'sheet', "fill_life")
            heart.setOrigin(0.5);
            heart.setScale(0.44);
            this.add(heart);
            this.lifeArr.push(heart);

            startX += 31;
        }
        this.visible = false;

        // this.show();

    }

    heartBroke() {
        if (this.scene.gameStopped) return;
        if (this.totalLife <= 0) return;
        this.totalLife--;
        if (this.lifeArr[this.totalLife])
            this.lifeArr[this.totalLife].visible = false;
        if (this.totalLife <= 0) {
            if (this.scene.count.value <= 0) this.scene.checkWinFail()
            else this.scene.checkWinFail(true)
            this.scene.time.addEvent({
                delay: 1000,
                callback: () => {
                    this.scene.cta.show();
                }
            })
        }
    }

    show() {
        if (this.visible) return
        this.visible = true;
        this.scene.add.tween({
            targets: this,
            alpha: {
                from: 0,
                to: 1,
            },
            ease: "Power0",
            duration: 100
        })
    }
}