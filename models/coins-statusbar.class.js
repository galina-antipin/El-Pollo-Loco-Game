/**
 * Represents the status bar that displays the number of coins collected in the game.
 * Inherits from the DrawableObject class.
 */
class CoinsStatusbar extends DrawableObject {
  IMAGES = [
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png ",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png ",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png ",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png ",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png ",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png ",
  ];

  percentage = 0;
  /**
   * Creates an instance of the CoinsStatusbar.
   * Initializes the status bar by loading images and setting initial position and size.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 40;
    this.y = 45;
    this.width = 200;
    this.height = 60;
    this.setPercentage(0);
  }
}
