/**
 * Represents a bottle in the game.
 * Inherits from the MovableObject class.
 */
class Bottle extends MovableObject {
  width = 80;
  height = 80;

  IMAGES_BOTTLE = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  /**
   * Creates an instance of a Bottle.
   * The bottle is initialized with a random image and random x-coordinate.
   */
  constructor() {
    super().loadImage(this.IMAGES_BOTTLE[this.randomImage()]);
    this.x = 200 + Math.random() * 8000;
    this.y = 360;
  }

  /**
   * Returns a random index for selecting an image from the IMAGES_BOTTLE array.
   *
   * @returns {number} A random index of an image from the IMAGES_BOTTLE array.
   */
  randomImage() {
    return Math.floor(Math.random() * this.IMAGES_BOTTLE.length);
  }
}
