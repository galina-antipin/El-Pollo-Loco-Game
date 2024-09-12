/**
 * Represents the game world, including the main character, objects, sounds, and status bars.
 * Handles the game loop, collision detection, and interaction between game objects.
 */
class World {
  character = new Character();
  canvas;
  ctx;
  keyboard;
  camera_x = 0;

  throwableObject = [];
  coins = [];
  collectedCoins = 0;
  bottles = [];
  collectedBottles = 0;

  lastThrowTime = 0;

  game_sound = new Audio("audio/taratata.mp3");
  collect_sound = new Audio("audio/collect-coin.mp3");
  chicken_dead_sound = new Audio("audio/chicken-sound.mp3");
  win_sound = new Audio("audio/win-sound.mp3");
  bottle_sound = new Audio("audio/bottle.mp3");
  small_chicken_dead = new Audio("audio/chicken-dead.mp3");
  dead_sound = new Audio("audio/dead.mp3");

  bottlesStatusBar = new BottlesStatusBar();
  coinsStatusBar = new CoinsStatusbar();
  endbossStatusBar = new EndbossStatusBar();
  statusBar = new Statusbar();

  isGameOver = false;

  /**
   * Initializes a new instance of the World class.
   *
   * @param {HTMLCanvasElement} canvas - The canvas element where the game is rendered.
   * @param {Keyboard} keyboard - The keyboard input manager for controlling the game.
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.level = level1;
    this.draw();
    this.setWorld();
    this.run();
  }

  /**
   * Sets up the game world by linking the character to the world
   * and populating the bottles and coins from the current level.
   */
  setWorld() {
    this.character.world = this;
    this.bottles = this.level.bottles;
    this.coins = this.level.coins;
  }

  /**
   * Starts the game loop, running specified checks at regular intervals.
   * This includes checking for collisions and handling object interactions.
   */
  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowObjects();
      this.checkCoinCollisions();
      this.checkBottleCollisions();
    }, 100);
  }

  /**
   * Checks whether the character has thrown an object based on keyboard input.
   * If the 'D' key is pressed and there are collected bottles available,
   * a new throwable object is created, and the collected bottle count is adjusted.
   */
  checkThrowObjects() {
    const currentTime = Date.now();
    if (
      this.keyboard.D &&
      this.collectedBottles > 0 &&
      currentTime - this.lastThrowTime >= 1500 &&
      !this.character.otherDirection
    ) {
      let bottle = new ThrowableObject(
        this.character.x + 100,
        this.character.y + 100
      );
      this.throwableObject.push(bottle);
      this.collectedBottles--;
      this.bottlesStatusBar.setPercentage((this.collectedBottles / 5) * 100);
      this.lastThrowTime = currentTime;
      this.character.isSleeping = false;
    }
  }

  /**
   * Checks for collisions between the character and enemies in the level.
   * If a collision is detected, it handles the interaction accordingly.
   */
  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (enemy.chickenIsDead) return;

      if (this.character.isColliding(enemy)) {
        this.handleCharacterEnemyCollision(enemy);
      }
    });

    this.checkThrowableCollisions();
  }

  /**
   * Checks for collisions between throwable objects and enemies.
   */
  checkThrowableCollisions() {
    this.throwableObject.forEach((bottle, bottleIndex) => {
      this.level.enemies.forEach((enemy) => {
        if (bottle.isColliding(enemy)) {
          if (enemy instanceof Endboss) {
            enemy.hit();
            this.throwableObject.splice(bottleIndex, 1);
            this.bottle_sound.play();
            this.endbossStatusBar.setPercentage(enemy.energy);
          } else {
            this.handleBottleEnemyCollision(bottleIndex, enemy);
          }
        }
      });
    });
  }

  /**
   * Handles the collision between the character and an enemy.
   *
   * @param {MovableObject} enemy - The enemy the character collided with.
   */
  handleCharacterEnemyCollision(enemy) {
    if (enemy instanceof Endboss) {
      this.character.hit();
      this.statusBar.setPercentage(this.character.energy);
    } else {
      if (this.character.isColliding(enemy) && this.character.isAboveGround() && this.character.speedY < 0){
        this.small_chicken_dead.play();
        enemy.changeToDeadImage();
        this.character.jump();
      } else {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
      }
    }
  }

  /**
   * Handles the collision between a bottle and an enemy.
   *
   * @param {number} bottleIndex - The index of the throwable object in the array.
   * @param {MovableObject} enemy - The enemy that the bottle collides with.
   */
  handleBottleEnemyCollision(bottleIndex, enemy) {
    this.bottle_sound.play();
    this.throwableObject.splice(bottleIndex, 1);
    if (enemy instanceof Chicken || enemy instanceof SmallChicken) {
      enemy.changeToDeadImage();
      this.small_chicken_dead.play();
    }
    if (enemy instanceof Endboss) {
      enemy.playAnimation(enemy.IMAGES_HURT);
      this.chicken_dead_sound.play();
    }
  }

  /**
   * Collects a coin if the total collected coins is less than 5.
   * Updates the coins status bar to reflect the current percentage of collected coins,
   * and plays the collection sound.
   */
  collectCoin() {
    if (this.collectedCoins < 5) {
      this.collectedCoins += 1;
      this.coinsStatusBar.setPercentage((this.collectedCoins / 5) * 100);
      this.collect_sound.play();
    } else {
      this.collect_sound.play();
    }
  }

  /**
   * Checks for collisions between the character and the coins in the level.
   * If a collision is detected, it collects the coin and removes it from the level.
   */
  checkCoinCollisions() {
    this.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        this.collectCoin();
        this.coins.splice(index, 1);
      }
    });
  }

  /**
   * Collects a bottle if the total collected bottles is less than 5.
   * Updates the bottles status bar to reflect the current percentage of collected bottles.
   */
  collectBottle() {
    if (this.collectedBottles < 5) {
      this.collectedBottles += 1;
      this.bottlesStatusBar.setPercentage((this.collectedBottles / 5) * 100);
    }
  }

  /**
   * Checks for collisions between the character and the bottles in the level.
   * If a collision is detected and the total collected bottles is less than 5,
   * it collects the bottle and removes it from the level.
   */
  checkBottleCollisions() {
    this.bottles.forEach((bottle, index) => {
      if (this.character.isColliding(bottle)) {
        if (this.collectedBottles < 5) {
          this.collectBottle();
          this.bottles.splice(index, 1);
        }
      }
    });
  }

  /**
   * Draws the game scene on the canvas, displaying all objects in the game.
   */
  draw() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.ctx.translate(-this.camera_x, 0);
    this.addObjectsToMap(this.level.clouds);
    this.addToMap(this.statusBar);
    this.addToMap(this.coinsStatusBar);
    this.addToMap(this.bottlesStatusBar);
    this.addToMap(this.endbossStatusBar);
    this.ctx.translate(this.camera_x, 0);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.throwableObject);
    this.ctx.translate(-this.camera_x, 0);
    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  /**
   * Adds an array of objects to the map by calling addToMap on each object.
   *
   * @param {Array} objects - The array of objects to be added to the map.
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  /**
   * Draws a movable object on the canvas.
   * If the object is facing the other direction, the image is flipped before drawing.
   *
   * @param {MovableObject} mo - The movable object to be drawn on the canvas.
   */
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  /**
   * Flips the image of the movable object horizontally for rendering.
   * This is typically done for objects facing the opposite direction.
   *
   * @param {MovableObject} mo - The movable object whose image is to be flipped.
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Restores the canvas to its previous state and resets the object's x position.
   * This is called after rendering the flipped image.
   *
   * @param {MovableObject} mo - The movable object whose position is to be restored.
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  /**
   * Clears all game objects from the current level, including enemies, coins, bottles, and throwable objects.
   * This is useful for resetting the game state or transitioning between levels.
   */
  clearGameObjects() {
    this.level.enemies = [];
    this.coins = [];
    this.bottles = [];
    this.throwableObject = [];
    this.level.character = [];
  }

  /**
   * Mutes all audio based on the current sound mute state.
   */
  muteAllSounds() {
    this.game_sound.volume = 0;
    this.collect_sound.volume = 0;
    this.bottle_sound.volume = 0;
    this.small_chicken_dead.volume = 0;
    this.chicken_dead_sound.volume = 0;
    this.character.walking_sound.volume = 0;
    this.character.jumping_sound.volume = 0;
    this.character.hurt_sound.volume = 0;
    this.character.dead_sound.volume = 0;
    this.character.collect_sound.volume = 0;
    this.character.snoring_sound.volume = 0;
    this.win_sound.volume = 0;
    this.dead_sound.volume = 0;
  }

  /**
   * Unmutes all audio to restore original sound settings.
   */
  unmuteAllSounds() {
    this.game_sound.volume = 1;
    this.collect_sound.volume = 1;
    this.bottle_sound.volume = 1;
    this.small_chicken_dead.volume = 1;
    this.chicken_dead_sound.volume = 1;
    this.character.walking_sound.volume = 1;
    this.character.jumping_sound.volume = 1;
    this.character.hurt_sound.volume = 1;
    this.character.dead_sound.volume = 1;
    this.character.collect_sound.volume = 1;
    this.character.snoring_sound.volume = 1;
    this.win_sound.volume = 1;
    this.dead_sound.volume = 1;
  }
}
