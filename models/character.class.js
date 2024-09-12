/**
 * Represents a character in the game that can move, jump, and interact with the world.
 * @extends {MovableObject}
 */
class Character extends MovableObject {
    height = 250;
    y = 70;
    speed = 10;
    isWalking = false;
    energy = 100;
    inactivityDuration = 0;
    isSleeping = false;

    offset = {
        top: 110,
        left: 5,
        right: 5,
        bottom: 0,
    };

    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png',
    ];

    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png',
    ];

    IMAGES_LONG_IDLE = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png',
    ];

    IMAGES_JUMPING_UP = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
    ];

    IMAGES_JUMPING_DOWN = [
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
    ];

    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png',
    ];

    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png',
    ];

    world;

    walking_sound = new Audio('audio/running.mp3');
    jumping_sound = new Audio('audio/jump.mp3');
    hurt_sound = new Audio('audio/hurt.mp3');
    dead_sound = new Audio('audio/dead.mp3');
    collect_sound = new Audio('audio/collect-coin.mp3');
    snoring_sound = new Audio('audio/snoring.mp3');

/**
* Constructs a new Character instance.
*/
    constructor() {
        super().loadImage('img/2_character_pepe/1_idle/idle/I-1.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING_UP);
        this.loadImages(this.IMAGES_JUMPING_DOWN);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.applyGravity();
        this.animate();
        this.startInactivityTimer();
    }

/**
* Handles character animation and movement at a fixed interval.
*/
    animate() {
        setInterval(() => {
            this.updateMovement();
            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);

        setInterval(() => {
            this.updateAnimation();
        }, 100);
    }

/**
* Updates the character's movement based on keyboard input.
* Pauses the walking sound when not moving.
*/
    updateMovement() {
        this.walking_sound.pause();
        if (!this.isSleeping) {
            const currentTime = Date.now();
            this.handleHorizontalMovement();
            this.handleJump();
        }
    }

/**
* Handles the horizontal movement of the character based on keyboard input.
*/
    handleHorizontalMovement() {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.otherDirection = false;
            this.startWalking();
        } else if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
            this.startWalking();
        } else {
            this.isWalking = false;
        }
    }
    
/**
 * Starts the walking animation and sound.
 */
    startWalking() {
        this.walking_sound.play();
        this.snoring_sound.pause();
        this.isWalking = true;
        this.isSleeping = false;
    }

/**
 * Handles the jump action of the character.
 * Initiates a jump if the SPACE key is pressed and the character is not above ground.
 */
    handleJump() {
        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
            this.isWalking = true;
        }
    }

/**
 * Updates the character's animation based on its state (dead, hurt, or in the air/ground).
 */
    updateAnimation() {
        if (this.isDead()) {
            this.playAnimation(this.IMAGES_DEAD);
            this.isSleeping = false;
        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
            this.snoring_sound.pause();
        } else if (this.isAboveGround()) {
            this.handleJumpAnimation();
        } else {
            this.handleGroundAnimation();
        }
    }

/**
 * Handles the animation for the jump based on the vertical speed.
 */
    handleJumpAnimation() {
        if (this.speedY > 0) {
            this.playAnimation(this.IMAGES_JUMPING_UP);
        } else {
            this.playAnimation(this.IMAGES_JUMPING_DOWN);
        }
    }

/**
 * Handles the animation of the character when on the ground.
 * Plays different animations based on the character's state (walking, sleeping, idle).
 */
    handleGroundAnimation() {
        if (this.isWalking) {
            this.playAnimation(this.IMAGES_WALKING);
        } else if (this.isSleeping) {
            this.playAnimation(this.IMAGES_LONG_IDLE);
            this.snoring_sound.play();
        } else {
            this.playAnimation(this.IMAGES_IDLE);
            this.snoring_sound.pause();
        }
    }

/**
* Monitors inactivity and changes the character's state to sleeping when inactive.
*/
    startInactivityTimer() {
        setInterval(() => {
            if (!this.isWalking) {
                this.inactivityDuration++;

                if (this.inactivityDuration >= 50) {
                    this.isSleeping = true;
                }
            } else {
                this.inactivityDuration = 0;
                this.isSleeping = false;
            }

            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT || this.world.keyboard.SPACE) {
                this.isSleeping = false;
                this.inactivityDuration = 0;
            }
        }, 100);
    }

/**
* Makes the character jump and plays the jump sound.
*/
    jump() {
        this.speedY = 27;
        this.jumping_sound.play();
        this.isSleeping = false;
        this.inactivityDuration = 0;
    }
}
