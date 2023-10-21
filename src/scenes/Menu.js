class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion1', './assets/Artillery+2.wav');    //additional sound effects mod
        this.load.audio('sfx_explosion2', './assets/Cannon+1.wav');
        this.load.audio('sfx_explosion3', './assets/Explosion+8.wav');
        this.load.audio('sfx_explosion4', './assets/Missile+1.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
    }

    create() {
        // menu text configuration
      this.cameras.main.setBackgroundColor('#0000FF'); // Set to blue color

      let menuConfig = {
          fontFamily: 'Impact',     //customized title mode
          fontSize: '28px',
          backgroundColor: 'orange',
          color: 'black',
          align: 'right',
          padding: {
              top: 5,
              bottom: 5,
          },
          fixedWidth: 0
      }
        let highScoreConfig = {
          fontFamily: 'Meslo',
          fontSize: '28px',
          backgroundColor: '#F3B141',
          color: '#843605',
          align: 'left',
          padding: {
              top: 5,
              bottom: 5,
          },
          fixedWidth: 200
      }
        
        // show menu text
        this.add.text(game.config.width/2, 120, 'ROCKET PATROL', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, 'Use ←→ arrows to move & (F) to fire', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = 'red';
        menuConfig.color = 'pink';
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press ← for Beginners or → for Experienced', menuConfig).setOrigin(0.5);
        

        this.highScoreLeft = this.add.text((game.config.width/2) - 100, 400, highScoreTracker, highScoreConfig);
        this.highScoreLeft.text = 'High Score: ' + highScoreTracker;    //display high score on menu



        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
          // Novice mode
          game.settings = {
            spaceshipSpeed: 3,
            gameTimer: 60000    
          }
          this.sound.play('sfx_select');
          this.scene.start("playScene");    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
          // Expert mode
          game.settings = {
            spaceshipSpeed: 4,
            gameTimer: 45000    
          }
          this.sound.play('sfx_select');
          this.scene.start("playScene");    
        }
      }
}