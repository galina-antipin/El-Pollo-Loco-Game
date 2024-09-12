/**
 * Represents a background object in the game.
 * Inherits from the MovableObject class.
 */
class BackgroundObject extends MovableObject {
  width = 720;
  height = 480;

  /**
   * Creates an instance of a BackgroundObject.
   *
   * @param {string} imagePath - The path to the image to be used as the background object.
   * @param {number} x - The x-coordinate for positioning the background object.
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }
}
