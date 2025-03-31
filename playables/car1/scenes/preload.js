export default class Preload extends Phaser.Scene {

    width = null
    height = null
    handlerScene = null
    sceneStopped = false

    constructor() {
        super({ key: 'preload' })
    }

    init() {

        //  Inject our CSS
        var element = document.createElement('style');

        document.head.appendChild(element);

        var sheet = element.sheet;

        var styles1 = '@font-face { font-family: "FuturaPTBook"; src: url("fonts/FuturaPTBook.otf") format("opentype"); }\n';
        var styles2 = '@font-face { font-family: "FuturaPTBold"; src: url("fonts/FuturaPTBold.otf") format("opentype"); }\n';
        var styles3 = '@font-face { font-family: "UberMoveMedium"; src: url("fonts/UberMoveMedium.otf") format("opentype"); }\n';

        sheet.insertRule(styles1, 0);
        sheet.insertRule(styles2, 0);
        sheet.insertRule(styles3, 0);

    }

    preload() {
        // Images
        this.load.image('bg', 'assets/bg.png');
        this.load.image('hand', 'assets/hand.png');
        this.load.image('line', 'assets/line.png');
        this.load.image('Button', 'assets/Button.png');
        this.load.image('bg_object1', 'assets/bg_object1.png');
        this.load.image('bg_object2', 'assets/bg_object2.png');
        this.load.image('cta_btn', 'assets/cta_btn.png');
        this.load.image('game_cloud1', 'assets/game_cloud1.png');
        this.load.image('game_cloud2', 'assets/game_cloud2.png');
        this.load.image('intro_bg', 'assets/intro_bg.png');
        this.load.image('cta_bg', 'assets/cta_bg.png');
        this.load.image('intro_logo', 'assets/intro_logo.png');
        this.load.atlas('sheet', 'assets/sheet.png', 'assets/sheet.json');

        this.load.script('webfont', 'lib/webfont.js');
        this.load.plugin('rextagtextplugin', 'lib/rextagtextplugin.min.js', true);
        this.load.audio('start','sounds/start.mp3');
        this.load.audio('CarAlarm','sounds/CarAlarm.mp3');
        this.load.audio('disk','sounds/disk.mp3');
        // this.load.audio('loss','sounds/loss.mp3');

        //---------------------------------------------------------------------->

        this.canvasWidth = this.sys.game.canvas.width
        this.canvasHeight = this.sys.game.canvas.height

        this.width = this.game.screenBaseSize.width
        this.height = this.game.screenBaseSize.height

        this.sceneStopped = false


        this.load.on('progress', (value) => {

        })

        this.load.on('complete', () => {

        })
    }

    create() {

        this.firstTime = false;
        let _this = this;
        WebFont.load({

            custom: {
                families: ['FuturaPTBook', 'FuturaPTBold', 'UberMoveMedium']

            },
            active: function() {

                _this.scene.stop('preload');
                _this.scene.launch('GameScene');
            }
        });
    }
}