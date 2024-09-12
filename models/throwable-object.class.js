/**
 * Represents an object that can be thrown in the game, such as a bottle.
 * Inherits from the MovableObject class and simulates throwing behavior with rotation animation.
 */
class ThrowableObject extends MovableObject {
  /**
   * Creates an instance of a ThrowableObject at a specified position.
   *
   * @param {number} x - The initial x-coordinate of the throwable object.
   * @param {number} y - The initial y-coordinate of the throwable object.
   */
  constructor(x, y) {
    super().loadImage("img/6_salsa_bottle/salsa_bottle.png");
    this.x = x;
    this.y = y;
    this.height = 60;
    this.width = 50;

    this.rotationImages = [
      "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
      "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
      "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
      "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
    ];

    this.loadImages(this.rotationImages);
    this.currentFrame = 0;
    this.throw();
    this.startAnimation();
  }

  /**
   * Checks for a collision between this throwable object and another movable object.
   *
   * @param {MovableObject} mo - The movable object to check collision against.
   * @returns {boolean} True if a collision is detected, false otherwise.
   */
  isColliding(mo) {
    return (
      this.x + this.width > mo.x &&
      this.x < mo.x + mo.width &&
      this.y + this.height > mo.y &&
      this.y < mo.y + mo.height
    );
  }

  /**
   * Applies movement and gravity to the throwable object, simulating a throw.
   */
  throw() {
    this.speedY = 30;
    this.applyGravity();
    setInterval(() => {
      this.x += 10;
    }, 25);
  }

  /**
   * Starts the animation for the rotation of the throwable object.
   */
  startAnimation() {
    setInterval(() => {
      this.updateImage();
    }, 100);
  }

  /**
   * Updates the image of the throwable object for animation based on the current frame.
   */
  updateImage() {
    this.currentImage = this.rotationImages[this.currentFrame];
    this.img = this.imageCache[this.currentImage];
    this.currentFrame = (this.currentFrame + 1) % this.rotationImages.length;
  }
}
