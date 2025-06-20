import Preload from "./scenes/Preload.js";
import IntroScene from "./scenes/IntroScene.js";
import GameScene from "./scenes/GameScene.js";
import GameOverScene from "./scenes/GameOverScene.js";

const config = {
    type: Phaser.AUTO,
    title: 'Catch Fruits',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'game',
        width: 540,
        height: 960,
        antialias: false,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 200 },
            debug: false
        }
    },

    dom: {
        createContainer: true
    },
    backgroundColor: '#4cb5ca',
    scene: [
        Preload,
        IntroScene,
        GameScene,
        GameOverScene
    ]
}
const game = new Phaser.Game(config)
game.orientation = "portrait"

