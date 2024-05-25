class Element {
  constructor(color, behave) {
    this.color = color;
    this.behave = behave;
  }
}

class EmptyElement extends Element {
  constructor() {
    super([0, 0, 0, 0], null);
  }
}

class GasElement extends Element {
  constructor(color) {
    super(color, (origin) => {
      if (Math.random() < 0.003) setSpace(origin, ELEMENT_EMPTY);
      const above = origin.above;
      const slide =
        Math.random() < 0.5 ? origin.slideTRight : origin.slideTLeft;
      if (isElementAtPosition(above, ELEMENT_EMPTY)) {
        setSpace(above, this);
        setSpace(origin, ELEMENT_EMPTY);
      } else if (isElementAtPosition(above, ELEMENT_WATER)) {
        setSpace(origin, ELEMENT_WATER);
        setSpace(above, this);
      } else if (isElementAtPosition(slide, ELEMENT_EMPTY)) {
        setSpace(slide, this);
        setSpace(origin, ELEMENT_EMPTY);
      } else if (isElementAtPosition(slide, ELEMENT_WATER)) {
        setSpace(origin, ELEMENT_WATER);
        setSpace(slide, this);
      } else {
        const slideSide =
          Math.random() < 0.5 ? origin.slideRight : origin.slideLeft;
        if (isElementAtPosition(slideSide, ELEMENT_EMPTY)) {
          setSpace(slideSide, this);
          setSpace(origin, ELEMENT_EMPTY);
        }
      }
    });
  }
}

class LiquidElement extends Element {
  constructor(color) {
    super(color, (origin) => {
      for (let i = 0; i < origin.velocity; i++) {
        const below = origin.below;
        const slideBLeft = origin.slideBLeft;
        const slideBRight = origin.slideBRight;
        const slideLeft = origin.slideLeft;
        const slideRight = origin.slideRight;

        if (isElementAtPosition(below, ELEMENT_EMPTY)) {
          setSpace(below, this, origin.velocity + 0.05);
          setSpace(origin, ELEMENT_EMPTY);
          origin = below;
        } else if (isElementAtPosition(slideBLeft, ELEMENT_EMPTY)) {
          setSpace(slideBLeft, this, origin.velocity);
          setSpace(origin, ELEMENT_EMPTY);
          origin = slideBLeft;
        } else if (isElementAtPosition(slideBRight, ELEMENT_EMPTY)) {
          setSpace(slideBRight, this, origin.velocity);
          setSpace(origin, ELEMENT_EMPTY);
          origin = slideBRight;
        } else if (isElementAtPosition(slideLeft, ELEMENT_EMPTY)) {
          setSpace(slideLeft, this, origin.velocity);
          setSpace(origin, ELEMENT_EMPTY);
          origin = slideLeft;
        } else if (isElementAtPosition(slideRight, ELEMENT_EMPTY)) {
          setSpace(slideRight, this, origin.velocity);
          setSpace(origin, ELEMENT_EMPTY);
          origin = slideRight;
        } else {
          origin.velocity = Math.max(1, origin.velocity - 1);
        }
      }
    });
  }
}

class SolidElement extends Element {
  constructor(color, movable) {
    super(color, (origin) => {
      for (let i = 0; i < origin.velocity; i++) {
        const below = origin.below;
        if (movable) {
          if (isElementAtPosition(below, ELEMENT_EMPTY)) {
            setSpace(below, this, origin.velocity + 0.05);
            setSpace(origin, ELEMENT_EMPTY);
            origin = below;
          } else if (isElementAtPosition(below, ELEMENT_WATER)) {
            setSpace(below, this, origin.velocity + 0.05);
            setSpace(origin, ELEMENT_WATER);
            origin = below;
          } else {
            const direction = Math.random() < 0.5;
            const slide = direction ? origin.slideBRight : origin.slideBLeft;
            if (isElementAtPosition(slide, ELEMENT_EMPTY)) {
              setSpace(slide, this);
              setSpace(origin, ELEMENT_EMPTY);
            } else if (isElementAtPosition(slide, ELEMENT_WATER)) {
              setSpace(slide, this);
              setSpace(origin, ELEMENT_WATER);
            }
            origin.velocity = Math.max(1, origin.velocity - 1);
          }
        }
      }
    });
  }
}

class SandElement extends SolidElement {
  constructor() {
    super([209, 163, 71, 255], true);
  }
}

class WaterElement extends LiquidElement {
  constructor() {
    super([80, 129, 201, 255]);
  }
}

class IceElement extends SolidElement {
  constructor() {
    super([160, 233, 253, 255], false);
    this.behave = (origin) => {
      const below = origin.below;
      const slideLeft = origin.slideLeft;
      const slideRight = origin.slideRight;
      const slideTRight = origin.slideTRight;
      const slideTLeft = origin.slideTLeft;
      const slideBRight = origin.slideBRight;
      const slideBLeft = origin.slideBLeft;

      if (Math.random() < 0.00001) setSpace(origin, ELEMENT_WATER);

      const firePositions = [
        below,
        slideLeft,
        slideRight,
        origin.above,
        slideTRight,
        slideTLeft,
        slideBRight,
        slideBLeft,
      ];

      if (
        firePositions.some((position) =>
          isElementAtPosition(position, ELEMENT_FIRE)
        )
      ) {
        setSpace(origin, ELEMENT_WATER);
      }

      if (Math.random() < 0.007) {
        firePositions.forEach((position) => {
          if (isElementAtPosition(position, ELEMENT_WATER)) {
            setSpace(origin, ELEMENT_WATER);
          }
        });
      }
    };
  }
}

class WallElement extends SolidElement {
  constructor() {
    super(null, false);
  }
}

class WoodElement extends SolidElement {
  constructor() {
    super(null, false);
  }
}

class FireElement extends Element {
  constructor() {
    super([255, 0, 0, 255], (origin) => {
      if (Math.random() < 0.1) setSpace(origin, ELEMENT_EMPTY);
      const below = origin.below;
      const above = origin.above;
      const slideLeft = origin.slideLeft;
      const slideRight = origin.slideRight;

      if (Math.random() < 0.1) {
        if (isElementAtPosition(below, ELEMENT_WATER))
          setSpace(below, ELEMENT_SMOKE);
        if (isElementAtPosition(slideLeft, ELEMENT_WATER))
          setSpace(slideLeft, ELEMENT_SMOKE);
        if (isElementAtPosition(slideRight, ELEMENT_WATER))
          setSpace(slideRight, ELEMENT_SMOKE);
        if (isElementAtPosition(above, ELEMENT_WATER))
          setSpace(above, ELEMENT_SMOKE);
      }

      if (Math.random() < 0.2) {
        const element = Math.random() < 0.5 ? ELEMENT_FIRE : ELEMENT_SMOKE;
        if (isElementAtPosition(below, ELEMENT_WOOD)) {
          setSpace(below, ELEMENT_FIRE);
          setSpace(origin, element);
        }
        if (isElementAtPosition(slideLeft, ELEMENT_WOOD)) {
          setSpace(slideLeft, ELEMENT_FIRE);
          setSpace(origin, element);
        }
        if (isElementAtPosition(slideRight, ELEMENT_WOOD)) {
          setSpace(slideRight, ELEMENT_FIRE);
          setSpace(origin, element);
        }
        if (isElementAtPosition(above, ELEMENT_WOOD)) {
          setSpace(above, ELEMENT_FIRE);
          setSpace(origin, element);
        }
      }
    });
  }
}

class SmokeElement extends GasElement {
  constructor() {
    super(null);
  }
}

const ELEMENT_EMPTY = new EmptyElement();
const ELEMENT_SAND = new SandElement();
const ELEMENT_WATER = new WaterElement();
const ELEMENT_ICE = new IceElement();
const ELEMENT_WALL = new WallElement();
const ELEMENT_WOOD = new WoodElement();
const ELEMENT_FIRE = new FireElement();
const ELEMENT_SMOKE = new SmokeElement();
