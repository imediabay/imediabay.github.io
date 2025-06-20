export default class Timer extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene);

        this.scene = scene;

        // Top-left corner
        this.x = 20;
        this.y = 20;


        this.text = this.scene.make.text({
            x: 0,
            y: 0,
            text: `Time: ${this.timeLeft}`,
            style: {
                fontSize: '28px',
                color: '#000',
                stroke: '#ffffff',
                strokeThickness: 4
            },
            add: false
        });
        this.text.setOrigin(0, 0);
        this.add(this.text);

        this.scene.add.existing(this);
        this.setAlpha(1);
    }

    updateTime(newTime) {
        this.timeLeft = newTime;
        this.text.setText(`Time: ${this.timeLeft}`);
    }
}