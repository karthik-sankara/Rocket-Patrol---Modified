//Karthik Sankara 10/22/23
//Rocket Patrol: High Intensity
//Took about 11 hours total to implement all of the mods
        //High Score Mod(1) ~ 2 hours (Even though they were 1 point I had to play around with the code and try out different stuff in correlation to the structure) 1 POINT
                    //Created a global variable and UI addition to the Menu and Play Scene that constantly updates
        //Background Music(1) ~ 30 Minutes 
                    //loaded in looping copyright free background music in Play.js 
                    //when gameOver is true and back to main menu, stops the audio
        //4 new explosion sounds(3) ~ 30 minutes
                    //used Ceil and Math.random to generate any random number from 1-4
                    //based on num, play a specific explosion sound
        //Added Timer(3) ~ 2 hours (learning the nuances of updating UI etc)
                    //had to create seperate timer variable that persists across UI
                    //had to set equal to the game.settings configuration
                    //consistently update to decrease by 1. 
                    //did game.setting.gameTimer / 1000 to get the actual seconds of the game, not milliseconds
        //Additions to the title screen(3) ~ 1 hour (Trying out different values, colors, etc, (positions))
                    //played around with configuration code for Menu.js
        //New Enemy Spaceship(5) ~ 3 hours, created separate class but collision system, explosion sprite, spaceship dimensions had to be adjusted/played around with for new spaceship to coexist bug free
                    //created a new spaceship class with preset speed to 5, which is faster than the other spaceships
                    //loaded in a spaceship asset and adjusted its size to be very small
                    //created a smaller explosion sprite for that spaceship, and loaded that in as well. 
                    //Created separate checkCollision function for that spaceship since its dimensions are different
                    //Used specific offsets of y and x on ship x y width and height for the smaller ship
                    //created a seperate animation for the smaller explosion sprite
        //New Timing/Scoring Mechanism(5) ~ 2 hours, Had trouble configuring the game clock to the updated UI clock as time gets added, (completely removed this.clock system and came up with my own)
                    //in Play.js, remove the original this.clock implementation and make it synonymous with the UI timer in seconds
                    //Create a series of conditionals that check for collision and add a specific amount of time on the clock to this.timer
                    //this.timer is now relating to both in game time passed as well as the actual display on the UI
        // Total: 21/20
//Analyzed Nathan's structure to revise my implementations
//Used mostly chat gpt to come up with a template for my approach to the mod. After that just played around with Nathan's code in relation to my implementation
//Would ask chat gpt for explanations of some stuff used by Nathan as well as some tips to solve issues




let highScoreTracker = 0    //high score mod


let config = { 
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard variables
let keyF, keyR, keyLEFT, keyRIGHT;




