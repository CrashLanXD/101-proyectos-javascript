const BLOCK_TYPES =  {
  wall: [
    [2,0,1,2,2,0,1,2],
    [2,0,2,2,2,0,2,2],
    [0,0,0,0,0,0,0,0],
    [1,2,2,0,1,2,2,0],
    [2,2,2,0,2,2,2,0],
    [0,0,0,0,0,0,0,0],
    // - - - - - - - ,
    // - - - - - - - ,
  ],

  death: [
    [0,0,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,0],
    [0,1,2,2,2,2,3,0],
    [0,1,2,2,2,2,3,0],
    [0,1,2,2,2,2,3,0],
    [0,1,2,2,2,2,3,0],
    [0,3,3,3,3,3,3,0],
    [0,0,0,0,0,0,0,0],
  ],

  i: [
    [0,0,0,0,0,0,0,0],
    [0,2,3,2,2,3,2,0],
    [0,2,2,2,2,2,2,0],
    [0,3,2,2,3,2,3,0],
    [0,2,2,2,2,2,2,0],
    [0,2,3,2,2,2,3,0],
    [0,2,2,2,3,2,2,0],
    [0,0,0,0,0,0,0,0],
  ],

  j: [
    [0,0,0,0,0,0,0,0],
    [0,2,2,2,2,2,2,0],
    [0,2,0,0,0,0,2,0],
    [0,2,0,1,1,0,2,0],
    [0,2,0,1,1,0,2,0],
    [0,2,0,0,0,0,2,0],
    [0,2,2,2,2,2,2,0],
    [0,0,0,0,0,0,0,0],
  ],

  l: [
    [0,0,0,0,0,0,0,0],
    [0,3,3,3,3,3,3,0],
    [0,3,3,3,3,3,3,0],
    [0,3,3,3,3,3,3,0],
    [0,3,3,3,3,3,3,0],
    [0,3,3,3,3,3,3,0],
    [0,3,3,3,3,3,3,0],
    [0,0,0,0,0,0,0,0],
  ],

  o: [
    [0,0,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,0],
    [0,1,0,0,0,0,1,0],
    [0,1,0,0,0,0,1,0],
    [0,1,0,0,0,0,1,0],
    [0,1,0,0,0,0,1,0],
    [0,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,0],
  ],
  s: [
    [0,0,0,0,0,0,0,0],
    [0,3,3,3,3,3,3,0],
    [0,3,0,0,0,0,3,0],
    [0,3,0,1,1,0,3,0],
    [0,3,0,1,1,0,3,0],
    [0,3,0,0,0,0,3,0],
    [0,3,3,3,3,3,3,0],
    [0,0,0,0,0,0,0,0],
  ],
  t: [
    [0,0,0,0,0,0,0,0],
    [0,2,2,2,2,2,2,0],
    [0,2,1,1,1,1,2,0],
    [0,2,1,2,2,0,2,0],
    [0,2,1,2,2,0,2,0],
    [0,2,0,0,0,0,2,0],
    [0,2,2,2,2,2,2,0],
    [0,0,0,0,0,0,0,0],
  ],
  z: [
    [0,0,0,0,0,0,0,0],
    [0,2,2,2,2,2,2,0],
    [0,2,2,2,2,2,2,0],
    [0,2,2,0,0,2,2,0],
    [0,2,2,0,0,2,2,0],
    [0,2,2,2,2,2,2,0],
    [0,2,2,2,2,2,2,0],
    [0,0,0,0,0,0,0,0],
  ],
};