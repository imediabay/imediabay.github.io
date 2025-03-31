export class Count extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.scene.add.existing(this);

        this.init();
    }

    init() {
        this.value = 0;

        this.bg = this.scene.add.sprite(0, 0, "sheet", "counter");
        this.bg.setScale(0.48)
        this.add(this.bg);

        this.txt1 = this.scene.add.text(-20, 0, this.scene.text.texts[0].scoreTxt, {
            fontFamily: "FuturaPTBold",
            align: "right",
            fontSize: 13,
            fill: "#ffffff",
            stroke: "#000000",
            strokeThickness: 4,
        });
        this.txt1.setOrigin(0.5);
        this.txt1.setLineSpacing(-3);
        this.add(this.txt1);

        this.txt = this.scene.add.text(28, 0, "0" + this.value, {
            fontFamily: "FuturaPTBold",
            align: "center",
            fontSize: 30,
            fill: "#ffffff",
            stroke: "#000000",
            strokeThickness: 4,
        });
        this.txt.setOrigin(0.5);
        this.add(this.txt);
        this.txt.setPadding(10, 10, 10, 10);

        this.visible = false;
        // this.show()
    }
    restart() {
        this.value = 0;
        this.txt.text = "0" + this.value;
    }

    updateCount(amount) {

        this.value += amount;
        if (this.value <= 0) this.value = 0;

        if (this.value < 10) {
            this.txt.text = "0" + this.value;
        } else {
            this.txt.text = this.value;
        }

    }
    show() {
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