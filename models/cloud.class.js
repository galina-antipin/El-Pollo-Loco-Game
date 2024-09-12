/**
 * Represents a cloud in the game.
 * Inherits from the MovableObject class.
 */
class Cloud extends MovableObject {
  y = 20;
  width = 500;
  height = 250;

  /**
   * Creates an instance of a Cloud.
   * The cloud is initialized with a specific image and a random x-coordinate.
   */
  constructor() {
    super().loadImage("img/5_background/layers/4_clouds/1.png");
    this.x = Math.random() * 6000;
    this.animate();
  }

  /**
   * Animates the cloud by moving it left.
   */
  animate() {
    this.moveLeft();
  }
}
