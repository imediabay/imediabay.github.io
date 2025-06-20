export default class Score extends Phaser.GameObjects.Container {

    constructor(scene, x, y) {
        super(scene);
        this.scene = scene;
        const gameWidth = this.scene.sys.game.config.width;
        this.x = gameWidth - 20;
        this.y = 20;

        this.scene.add.existing(this);
        this.init();
    }

    init() {
        this.score = 0;

        this.text = this.scene.add.text(0, 0, 'Score: 0', {
            fontSize: '28px',
            color: '#000',
            stroke: '#ffffff',
            strokeThickness: 4
        });

        this.text.setOrigin(1, 0);
        this.add(this.text);

        this.visible = true;
        this.show();
    }

    updateScore(newScore) {
        this.score = newScore;
        this.text.setText(`Score: ${this.score}`);
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
        });
    }

}
