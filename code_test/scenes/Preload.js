
export default class Preload extends Phaser.Scene {
    constructor() {
        super("Preload");
    }
    preload() {
        //load images
        this.load.image('basket', '../assets/images/basket.png');
        this.load.image('bg', '../assets/images/bg.jpg');
        this.load.image('vol-on', '../assets/images/vol-on.png');
        this.load.image('vol-off', '../assets/images/vol-off.png');
        this.load.image('heart', "../assets/images/heart.png")
        //load spreadsheet
        this.load.atlas('fruits', '../assets/spritesheets/fruits_spritesheet.png', '../assets/spritesheets/fruits_spritesheet.json')
        this.load.atlas('nature', '../assets/spritesheets/nature_spritesheet.png', '../assets/spritesheets/nature_spritesheet.json')
        //load audios
        this.load.audio('pop', '../assets/audio/pop.mp3')
        this.load.audio('bg-music', '../assets/audio/bg.mp3')


    }
    create() {
        this.scene.stop('preload');
        this.scene.start("IntroScene")

    }

}
