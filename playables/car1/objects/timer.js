export class Timer extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.scene.add.existing(this);

        this.init();
    }

    init() {

        this.timerCount = 30;

        if (this.timerCount < 10) this.timeStart = "00:0";
        else this.timeStart = "00:";
        this.timedOutVale = false

        this.back = this.scene.add.sprite(0, 0, "sheet", "timer_back");
        this.back.setScale(0.5)
        this.add(this.back);

        this.txt = this.scene.add.text(0, 0, this.timeStart + this.timerCount, {
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

    start() {
        if (this.timer) return;
        this.timer = this.scene.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                this.updateTimer();
            }
        })
    }

    restart() {
        this.timerCount = 30;
        this.txt.text = "00:" + (this.timerCount);
        this.timer = "";
    }

    stop() {
        if (this.timer) {
            this.scene.time.removeEvent(this.timer);
            this.timer = "";

        }
    }

    updateTimer() {
        if (this.scene.gameStopped) return;
        if (this.timedOutVale) return;
        this.timerCount--;
        if (this.timerCount < 0) this.timerCount = 0;
        this.txt.text = "0:" + (this.timerCount);
        if (this.timerCount < 10) {
            this.txt.text = "0:0" + (this.timerCount);
        }

        if (this.timerCount < 1) {
            this.scene.canClick = false;
            this.scene.gameStopped = true
            this.scene.time.removeEvent(this.timer);
            this.failTimer = this.scene.time.addEvent({
                delay: 1000,
                callback: () => {
                    this.scene.gamePlay.removeItems();
                    if (this.scene.count.value <= 0) this.scene.checkWinFail()
                    else this.scene.checkWinFail(true)
                    this.scene.cta.show();
                }
            })
        }
    }

}