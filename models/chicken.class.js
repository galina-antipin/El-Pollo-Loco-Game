/**
 * Represents a chicken enemy in the game that can move and animate.
 * @extends {MovableObject}
 */
class Chicken extends MovableObject {
    y = 370;
    height = 60;
    width = 60;

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];

    chickenIsDead = false;

    /**
    * Constructs a new Chicken instance.
    * Initializes the chicken's image, random position, speed, and starts the animation.
    */
    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.x = 500 + Math.random() * 6000;
        this.speed = 0.15 + Math.random() * 0.5;
        this.animate();
    }

    /**
  * Handles movement and animation of the chicken.
  * The chicken moves left continuously while alive,
  * and plays the walking animation at defined intervals.
  */
    animate() {
        setInterval(() => {
            if (!this.chickenIsDead) {
                this.moveLeft();
            }
        }, 1000 / 60);

        setInterval(() => {
            if (!this.chickenIsDead) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }

    /**
   * Changes the chicken's state to dead and updates its image to a dead image.
   */
    changeToDeadImage() {
        this.loadImage('img/3_enemies_chicken/chicken_normal/2_dead/dead.png');
        this.chickenIsDead = true;
    }
}