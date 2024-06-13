// why? -__-
const TEXT = {
  score: [
    [0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,1,],
    [1,1,0,0,0,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,0,],
    [0,1,1,1,1,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,1,1,1,0,],
    [0,0,0,1,1,1,0,0,1,1,0,0,0,0,0,0,1,1,0,0,1,1,0,0,1,1,1,1,1,0,0,0,1,1,0,0,0,0,],
    [1,0,0,1,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,1,0,0,0,0,1,1,0,0,0,0,],
    [0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,1,1,0,0,1,1,0,0,1,1,1,1,1,1,],
  ],
  level: [
    [1,1,0,0,0,0,0,0,1,1,1,1,1,1,0,0,1,0,0,0,1,1,0,0,1,1,1,1,1,1,0,0,1,1,0,0,0,0],
    [1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,1,1,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0],
    [1,1,0,0,0,0,0,0,1,1,1,1,1,0,0,0,1,0,0,0,1,1,0,0,1,1,1,1,1,0,0,0,1,1,0,0,0,0],
    [1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,1,1,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0],
    [1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,0,1,1,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0],
    [1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,0,0,1,1,0,0,0,0,1,1,1,1,1,1,0,0,1,1,1,1,1,1],
  ],
  lines: [
    [1,1,0,0,0,0,0,0,0,1,1,1,1,0,0,0,1,0,0,0,1,1,0,0,1,1,1,1,1,1,0,0,0,1,1,1,1,0,],
    [1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,],
    [1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,1,1,0,1,1,0,0,1,1,1,1,1,0,0,0,0,1,1,1,1,0,],
    [1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,0,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,1,],
    [1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,0,0,1,1,1,0,0,1,1,0,0,0,0,0,0,1,0,0,1,1,1,],
    [1,1,1,1,1,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,1,1,0,0,1,1,1,1,1,1,0,0,0,1,1,1,1,0,],
  ],
  0: [
    [0,1,1,1,1,0],
    [1,1,0,0,1,1],
    [1,1,0,0,1,1],
    [1,1,0,0,1,1],
    [1,1,0,0,1,1],
    [0,1,1,1,1,0],
  ],
  1: [
    [0,0,1,1,0,0],
    [0,1,1,1,0,0],
    [0,0,1,1,0,0],
    [0,0,1,1,0,0],
    [0,0,1,1,0,0],
    [0,1,1,1,1,0],
  ],
  2: [
    [0,1,1,1,1,0],
    [1,0,0,1,1,1],
    [0,0,0,1,1,1],
    [0,1,1,1,1,0],
    [1,1,1,0,0,0],
    [1,1,1,1,1,1],
  ],
  3: [
    [1,1,1,1,1,0],
    [0,0,0,1,1,1],
    [0,1,1,1,1,0],
    [0,0,0,1,1,1],
    [0,0,0,1,1,1],
    [1,1,1,1,1,0],
  ],
  4: [
    [0,1,1,1,1,0],
    [1,1,0,1,1,0],
    [1,0,0,1,1,0],
    [1,0,0,1,1,1],
    [1,1,1,1,1,1],
    [0,0,0,1,1,0],
  ],
  5: [
    [1,1,1,1,1,0],
    [1,1,0,0,0,0],
    [1,1,1,1,1,0],
    [0,0,0,1,1,1],
    [1,0,0,1,1,1],
    [0,1,1,1,1,0],
  ],
  6: [
    [0,1,1,1,1,0],
    [1,1,0,0,0,0],
    [1,1,1,1,1,0],
    [1,1,0,0,1,1],
    [1,1,0,0,1,1],
    [0,1,1,1,1,0],
  ],
  7: [
    [1,1,1,1,1,1],
    [0,0,0,0,1,1],
    [0,0,0,1,1,0],
    [0,0,1,1,0,0],
    [0,1,1,1,0,0],
    [0,1,1,1,0,0],
  ],
  8: [
    [0,1,1,1,1,0],
    [1,0,0,1,1,1],
    [0,1,1,1,1,0],
    [1,0,0,1,1,1],
    [1,0,0,1,1,1],
    [0,1,1,1,1,0],
  ],
  9: [
    [0,1,1,1,1,0],
    [1,0,0,1,1,1],
    [1,0,0,1,1,1],
    [0,1,1,1,1,1],
    [0,0,0,1,1,1],
    [0,1,1,1,1,0],
  ],
};