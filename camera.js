class Camera {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.zoom = 60;
  }

  // Transforms the view port to isometric
  transform(tilePosition) {
    push(); // Save the current transformation state
    scale(2, 1);
    
    // Translate to origin and center of tile (x is half the size due to isometric)
    const x = -this.position.x - tilePosition.x / 2 + width / 4;
    const y = -this.position.y - tilePosition.y + height / 2;
    translate(x, y);
    rotate(radians(45));
  }

  // Converts window position to level position
  windowToLevel(tilePosition, x, y) {
    const pos = createVector(
      (x - 0.5 * width + (this.position.x + tilePosition.x / 2) * 2),
      (y - 0.5 * height + this.position.y + tilePosition.y)
    );
    const c = sqrt(2) / this.zoom;
    return createVector(
      round(c * (0.5 * pos.y + 0.25 * pos.x)),
      round(c * (0.5 * pos.y - 0.25 * pos.x))
    );
  }

  addZoom(value) {
    this.zoom += value;
  }
  
  // Restore the transformation state to what it was before
  endTransform() {
    pop();
  }
}