class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('specialShip', './assets/new_spaceship.png');
        // load spritesheet
        this.load.spritesheet('explosion1', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        
        this.load.spritesheet('explosion2', './assets/explosion2.png', {frameWidth: 36, frameHeight: 15, startFrame: 0, endFrame: 9}); //smaller sprite explosion for smaller ship
        
        this.load.audio('background_music', './assets/my-universe-147152.mp3'); //background music 
    }

    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);

        // add Rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);

        // add Spaceships (x4) New spaceship mod
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);
        
        this.ship04 = new SpecialSpaceship(this, 100, 100, 'specialShip', 0, 50).setOrigin(0,0);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation config
        this.anims.create({
            key: 'explode1',
            frames: this.anims.generateFrameNumbers('explosion1', { 
                start: 0, 
                end: 9, 
                first: 0
            }),
            frameRate: 30
        });

        this.anims.create({
            key: 'explode2',                //had to create another animation for the smaller explosion sprite for smaller spaceship
            frames: this.anims.generateFrameNumbers('explosion2', { 
                start: 0, 
                end: 9, 
                first: 0
            }),
            frameRate: 30
        });




        // initialize score
        this.p1Score = 0;

        // display score
        let scoreConfig = {         
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 70
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);

        //display high score mod
        let highScoreConfig = {         //setting up high score display style
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 270
        }
        this.highScoreLeft = this.add.text(150, 50, 'High Score: ' + highScoreTracker, highScoreConfig);


        //game timer mod                //creates display for time
        this.game_Timer = game.settings.gameTimer / 1000;
        this.timerEvent = this.time.addEvent({
            delay: 1000,  // Delay in milliseconds (1000ms = 1 second)
            callback: this.updateTimer,
            callbackScope: this,
            loop: true      // Set to true to make the event repeat
        });
        this.timeDisplay = this.add.text(440, 50, 'Time: ' + this.game_Timer, { fontSize: '32px', fill: '#fff' });




        // GAME OVER flag
        this.gameOver = false;

        // play clock based on difficulty and current state 
        scoreConfig.fixedWidth = 0;
        

        this.background_music = this.sound.add('background_music', {volume: 0.2, loop: true});

        this.background_music.play();           //initialize music

    }

    updateTimer() {             //helper function for create so it could accurately decrease time
        if (this.game_Timer > 0) {
            this.game_Timer -= 1;
        }
    
        // Update the time remaining text
        this.timeDisplay.setText('Time: ' + this.game_Timer);
    }



    update() {
        let scoreConfig = {                 //had to remove clock config as it was difficult to add time to the display bc ut was ending prematurely 
            fontFamily: 'Courier',          
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'left',
            padding: {                  //instead I have a copy of the score config here for End Game options
                top: 5,                 
                bottom: 5,
            },
            fixedWidth: 70
        }
        scoreConfig.fixedWidth = 0              //originally clock was not synced with time display for time to the clock mod
        if(this.game_Timer == 0) {              //instead relying on clock, ill rely on the time display I created
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← to Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }


        // check key input for restart / menu
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
            this.background_music.stop();
            const SavedHighscore = localStorage.getItem('highScoreTracker'); //retrieves high score global var
            if(SavedHighscore || SavedHighscore == 0) {
                highScoreTracker = parseInt(SavedHighscore); //converts the string number from getItem to an Int
            }
        }


        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
            this.background_music.stop();
        }

        this.starfield.tilePositionX -= 4;  // update tile sprite

        if(!this.gameOver) {
            this.p1Rocket.update();             // update p1
            this.ship01.update();               // update spaceship (x3)
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();       //update new spaceship 
        }


        if (this.checkCollisionSpecial(this.p1Rocket, this.ship04)) {       //uses special collision special function for smaller, faster spaceship
            this.game_Timer += 3;        //special 2 second increase if you hit smaller faster spaceship
            this.p1Rocket.reset();
            this.shipExplode(this.ship04);
        }

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.game_Timer += 2;      // 1 second increase in time if you hit ship3
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.game_Timer += 2;      //1 second increase in time if you hit ship2
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.game_Timer += 2;      //1 second increase in time if you hit ship2
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }

    }


    checkCollisionSpecial(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width - 40 &&        //create certain offset for x,y values for smaller spaceship
            rocket.x + rocket.width > ship.x + 40 &&        //accounts for collision detection for smaller things
            rocket.y < ship.y + ship.height - 45 &&
            rocket.height + rocket.y > ship.y + 45) {
                return true;
        } else {
            return false;
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking                 //originak collision detecton for normal space ships 
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }



    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;                         
        // create explosion sprite at ship's position
        if(ship instanceof Spaceship) {                     //checking object type so program knows what sprite to use
            let boom = this.add.sprite(ship.x, ship.y, 'explosion1').setOrigin(0, 0);
            boom.anims.play('explode1');             // play explode animation
            boom.on('animationcomplete', () => {    // callback after anim completes
                ship.reset();                         // reset ship position
                ship.alpha = 1;                       // make ship visible again
                boom.destroy();                       // remove explosion sprite
            });
        }
        else if(ship instanceof SpecialSpaceship) {     //created separate animation for smaller explosions
            let boom = this.add.sprite(ship.x, ship.y, 'explosion2').setOrigin(0, 0);
            boom.anims.play('explode2');             // play explode animation
            boom.on('animationcomplete', () => {    // callback after anim completes
                ship.reset();                         // reset ship position
                ship.alpha = 1;                       // make ship visible again
                boom.destroy();                       // remove explosion sprite
            });
        }

        // score add and repaint
        this.p1Score += ship.points;

        if(this.p1Score > highScoreTracker) {
            highScoreTracker = this.p1Score  //update high score
            localStorage.setItem('highScoreTracker', highScoreTracker); //save it to the local stack
        }


        this.scoreLeft.text = this.p1Score; 

        this.highScoreLeft.text = "High Score: " + highScoreTracker;        //high score mod


        const randomNumber = Math.ceil(Math.random()*4);  //generates random number from 1-4, based on rand number: plays a specific sound

        if(randomNumber == 1) {
            this.sound.play('sfx_explosion1');
        }
        if(randomNumber == 2) {
            this.sound.play('sfx_explosion2');
        }
        if(randomNumber == 3) {
            this.sound.play('sfx_explosion3');
        }
        if(randomNumber == 4) {
            this.sound.play('sfx_explosion4');
        }
    

      }
}