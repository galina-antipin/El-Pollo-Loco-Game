/**
 * Represents a coin in the game.
 * Inherits from the MovableObject class.
 */
class Coin extends MovableObject {
  width = 100;
  height = 100;

  /**
   * Creates an instance of a Coin.
   * The coin is initialized with a specific image and a random position within the game area.
   */
  constructor() {
    super().loadImage("img/8_coin/coin_1.png");
    this.x = 300 + Math.random() * 6000;
    this.y = 155 + Math.random() * 200;
  }
}
