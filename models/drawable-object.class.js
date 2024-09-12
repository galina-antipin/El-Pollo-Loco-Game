/** 
 * Represents an object that can be drawn on the canvas.
 * Provides functionality for loading and rendering images.
 */
class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    x = 120;
    y = 320;
    height = 150;
    width = 100;

    /**
    * Loads an image from the specified path.
    * 
    * @param {string} path - The path to the image to load.
    */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
   * Draws the image on the canvas at the object's position.
   * 
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context to draw on.
   */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
   * Draws a frame around the object for debugging purposes.
   * The frame is only drawn for instances of Character or Chicken.
   * 
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context to draw on.
   */
    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof Endboss || this instanceof Coin || this instanceof Bottle) {
            ctx.beginPath();
            ctx.lineWidth = '5';
            ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }

    /**
   * Loads multiple images from an array of paths and caches them.
   * 
   * @param {Array<string>} arr - An array containing paths to images to load.
   */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

       /**
   * Sets the percentage of coins collected and updates the corresponding image.
   * 
   * @param {number} percentage - The percentage of coins collected (0 to 100).
   */
       setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
   * Resolves the image index in the IMAGES array based on the current percentage.
   * 
   * @returns {number} The index of the image corresponding to the current percentage.
   */
    resolveImageIndex() {
        if (this.percentage === 100) {
            return 5;
        } else if (this.percentage >= 80) {
            return 4;
        } else if (this.percentage >= 60) {
            return 3;
        } else if (this.percentage >= 40) {
            return 2;
        } else if (this.percentage >= 20) {
            return 1;
        } else {
            return 0;
        }
    }
}