let canvas;
let world;
let keyboard = new Keyboard();
let character;

/**
 * Initializes the game by hiding the start screen, displaying the canvas,
 * playing background sound, and setting up the game level and world.
 */
function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('canvas').style.display = 'block';
    document.getElementById('nav-bar').classList.remove('d-none');
    document.getElementById('footer').style.display = 'none';

    const gameSound = document.getElementById('game-sound');
    gameSound.play();
    setTimeout(() => {
        gameSound.pause();
        gameSound.currentTime = 0;
    }, 7001);
    initLevel();
    init();
}

/**
 * Initializes the game world, creating a new instance of World 
 * and assigning the character.
 */
function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    character = world.character;
}

/**
 * Handles keyboard down events, setting the appropriate keys in the keyboard object,
 * and starting the game when the Enter key is pressed.
 * 
 * @param {KeyboardEvent} e - The keyboard event that triggered this function.
 */
window.addEventListener('keydown', (e) => {
    if (character.isDead()) return;
    if (e.keyCode == 39) {
        keyboard.RIGHT = true;
    }
    if (e.keyCode == 37) {
        keyboard.LEFT = true;
    }
    if (e.keyCode == 38) {
        keyboard.UP = true;
    }
    if (e.keyCode == 40) {
        keyboard.DOWN = true;
    }
    if (e.keyCode == 32) {
        keyboard.SPACE = true;
    }
    if (e.keyCode == 68) {
        keyboard.D = true;
    }

    if (e.keyCode == 13) {
        keyboard.ENTER = true;
        startGame();
    }
});

/**
 * Handles keyboard up events, releasing the appropriate keys in the keyboard object.
 * 
 * @param {KeyboardEvent} e - The keyboard event that triggered this function.
 */
window.addEventListener('keyup', (e) => {
    if (character.isDead()) return;
    if (e.keyCode == 39) {
        keyboard.RIGHT = false;
    }
    if (e.keyCode == 37) {
        keyboard.LEFT = false;
    }
    if (e.keyCode == 38) {
        keyboard.UP = false;
    }
    if (e.keyCode == 40) {
        keyboard.DOWN = false;
    }
    if (e.keyCode == 32) {
        keyboard.SPACE = false;
    }
    if (e.keyCode == 68) {
        keyboard.D = false;
    }

    if (e.keyCode == 13) {
        keyboard.ENTER = false;
    }
});

/**
 * Initializes touch event listeners for the game control elements.
 * These listeners enable users to control the game using touch buttons 
 * on mobile devices.
 * 
 * @event
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', (event) => {
    const leftArrow = document.getElementById('left-arrow');
    const rightArrow = document.getElementById('right-arrow');
    const jumpButton = document.getElementById('jump-button');
    const throwButton = document.getElementById('throw-button');

    /**
 * Starts moving left when the left arrow button is touched.
 * 
 * @param {TouchEvent} event - The touch event triggered by the touch interaction.
 */
    leftArrow.addEventListener('touchstart', (event) => {
        event.preventDefault();
        keyboard.LEFT = true;
    }, { passive: false });

    /**
  * Stops moving left when the left arrow button is released.
  * 
  * @param {TouchEvent} event - The touch event triggered by the touch interaction.
  */
    leftArrow.addEventListener('touchend', (event) => {
        keyboard.LEFT = false;
    });

    /**
      * Starts moving right when the right arrow button is touched.
      * 
      * @param {TouchEvent} event - The touch event triggered by the touch interaction.
      */
    rightArrow.addEventListener('touchstart', (event) => {
        event.preventDefault();
        keyboard.RIGHT = true;
    }, { passive: false });

    /**
    * Stops moving right when the right arrow button is released.
    * 
    * @param {TouchEvent} event - The touch event triggered by the touch interaction.
    */
    rightArrow.addEventListener('touchend', (event) => {
        keyboard.RIGHT = false;
    });

    /**
      * Executes the jump function when the jump button is touched.
      * 
      * @param {TouchEvent} event - The touch event triggered by the touch interaction.
      */
    jumpButton.addEventListener('touchstart', (event) => {
        event.preventDefault();
        keyboard.SPACE = true;
    }, { passive: false });

    /**
     * (Currently empty) Handles the end of the jump when the jump button is released.
     * 
     * @param {TouchEvent} event - The touch event triggered by the touch interaction.
     */
    jumpButton.addEventListener('touchend', (event) => {
        event.preventDefault();
        keyboard.SPACE = false;
    });

    /**
     * Executes the throw function when the throw button is touched.
     * 
     * @param {TouchEvent} event - The touch event triggered by the touch interaction.
     */
    throwButton.addEventListener('touchstart', (event) => {
        event.preventDefault();
        keyboard.D = true;
    }, { passive: false });

    /**
     * (Currently empty) Handles the end of the throw when the throw button is released.
     * 
     * @param {TouchEvent} event - The touch event triggered by the touch interaction.
     */
    throwButton.addEventListener('touchend', (event) => {
        keyboard.D = false;
    });

    // Maus-Events
    leftArrow.addEventListener('mousedown', (event) => {
        event.preventDefault();
        keyboard.LEFT = true;
    });
    leftArrow.addEventListener('mouseup', (event) => {
        keyboard.LEFT = false;
    });

    rightArrow.addEventListener('mousedown', (event) => {
        event.preventDefault();
        keyboard.RIGHT = true;
    });
    rightArrow.addEventListener('mouseup', (event) => {
        keyboard.RIGHT = false;
    });

    jumpButton.addEventListener('mousedown', (event) => {
        event.preventDefault();
        keyboard.SPACE = true;
    });
    jumpButton.addEventListener('mouseup', (event) => {
        keyboard.SPACE = false;
    });

    throwButton.addEventListener('mousedown', (event) => {
        event.preventDefault();
        keyboard.D = true;
    });
    throwButton.addEventListener('mouseup', (event) => {
        keyboard.D = false;
    });
});

/**
 * Stops the character from moving left or right by setting the corresponding keys to false.
 */
function stopMoving(event) {
    if (character.isDead()) return;
    keyboard.RIGHT = false;
    keyboard.LEFT = false;
}

let soundsMuted = false;

/**
 * Toggles the sound mute status for all audio elements on the page 
 * and updates the mute button image accordingly.
 */
function muteSound() {
    soundsMuted = !soundsMuted;
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
        audio.muted = soundsMuted;
        world.muteAllSounds();
    });

    const muteButton = document.getElementById('mute-btn');
    if (soundsMuted) {
        muteButton.src = './img/sound-off.png';
    } else {
        muteButton.src = './img/sound-on.png';
        world.unmuteAllSounds();
    }
}

/**
 * Checks the orientation of the window and displays a warning if the
 * window is in portrait mode on a mobile device.
 */
function checkOrientation() {
    const rotateWarning = document.getElementById('rotate-warning');
    const startScreen = document.getElementById('start-screen');
    if (window.innerWidth < 720 && window.innerHeight > window.innerWidth) {
        rotateWarning.style.opacity = 1;
        startScreen.classList.add('d-none');
    } else {
        rotateWarning.style.opacity = 0;
        startScreen.classList.remove('d-none');
    }}

window.addEventListener('resize', checkOrientation);
window.addEventListener('load', checkOrientation);     

/**
 * Toggles the button to show a fullscreen 
 */
function toggleFullScreen() {
    if (!document.fullscreenElement &&    
        !document.webkitFullscreenElement && // Safari
        !document.mozFullScreenElement &&    // Firefox
        !document.msFullscreenElement) {     // IE/Edge
  
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) { // Safari
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) { // Firefox
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
        document.documentElement.msRequestFullscreen();
      }
  
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { // Safari
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
      }
    }
}  