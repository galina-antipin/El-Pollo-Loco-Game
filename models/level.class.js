/**
 * Represents a level in the game containing various game objects and enemies.
 */
class Level {
  enemies;
  clouds;
  bottles;
  backgroundObjects;
  level_end_x = 8000;
  coins;

  /**
   * Creates an instance of the Level.
   *
   * @param {Array} enemies - Array of enemy objects in the level.
   * @param {Array} clouds - Array of cloud objects in the level.
   * @param {Array} bottles - Array of bottle objects in the level.
   * @param {Array} coins - Array of coin objects in the level.
   * @param {Array} backgroundObjects - Array of background object instances in the level.
   */
  constructor(enemies, clouds, bottles, coins, backgroundObjects) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.bottles = bottles;
    (this.coins = coins), (this.backgroundObjects = backgroundObjects);
  }
}
