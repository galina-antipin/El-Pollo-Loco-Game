/**
 * Represents an object that can be moved within the game world.
 * Inherits properties and methods from DrawableObject.
 * @extends {DrawableObject}
 */
class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;

  lastHit = 0;

  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  /**
   * Applies gravity to the object, updating its vertical position.
   */
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  /**
   * Checks if the object is above the ground.
   * This method overrides any behavior for throwable objects.
   *
   * @returns {boolean} - True if above ground, otherwise false.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 180;
    }
  }

  /**
   * Checks for a collision with another movable object.
   *
   * @param {MovableObject} mo - The other object to check for a collision with.
   * @returns {boolean} - True if colliding, otherwise false.
   */
  isColliding(mo) {
    return (
      this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    );
  }

  /**
   * Handles a hit taken by the object.
   * Reduces energy and checks for death.
   */
  hit() {
    this.hurt_sound.play();
    this.energy -= 5;

    if (this.energy <= 0) {
      this.energy = 0;
      this.dead_sound.play();

      setTimeout(() => {
        this.world.isGameOver = true;
        this.world.clearGameObjects();
        this.gameOverScreen();
      }, 1000);
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Checks if the object is currently hurt (within 1 second of being hit).
   *
   * @returns {boolean} - True if the object is hurt, otherwise false.
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  /**
   * Checks if the object is dead (energy is 0).
   *
   * @returns {boolean} - True if dead, otherwise false.
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Plays an animation based on the provided image array.
   * Updates the current image index to display the next image.
   *
   * @param {Array<string>} images - Array of image paths for the animation.
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Moves the object to the right.
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves the object to the left.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Makes the object jump by setting its vertical speed.
   */
  jump() {
    this.speedY = 30;
  }

  /**
   * Displays the game over screen and clears all intervals.
   */
  gameOverScreen() {
    document.getElementById("gameOverMenu").classList.remove("d-none");
    this.clearAllIntervals();
  }

  /**
   * Clears all intervals to pause the game.
   */
  clearAllIntervals() {
    for (let i = 1; i < 9999; i++) window.clearInterval(i);
  }

  /**
   * Displays the win screen and clears all intervals.
   */
  winScreen() {
    document.getElementById("win-screen").classList.remove("d-none");
    this.clearAllIntervals();
  }
}
