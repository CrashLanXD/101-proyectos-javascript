const COLOR_PALLETES = {
  original: {
    text:       [33 , 66 , 49 ],
    background: [140, 173, 40 ],
    primary:    [108, 148, 36 ],
    secondary:  [66 , 107, 41 ],
  },
  
  pocket: {
    text:       [48 , 56 , 32 ],
    background: [181, 198, 156],
    primary:    [141, 156, 123],
    secondary:  [99 , 114, 81 ],
  },

  color: {
    text:       [37 , 39 , 38 ],
    background: [255, 255, 251],
    primary:    [255, 207, 138],
    secondary:  [223, 61 , 69 ],
  },

  debug: {
    text:       [255,  0 ,  0 ],
    background: [ 0 , 255,  0 ],
    primary:    [ 0 ,  0 , 255],
    secondary:  [255,  0 , 255],
    },
    
  a: {
    text:       [250, 212 , 0 ],
    background: [ 0 ,  0  , 0 ],
    primary:    [255, 255 ,255],
    secondary:  [255,  0  ,194],
  },

  og: {
    text:       [33 , 33 , 33 ],
    background: [239, 239, 239],
    primary:    [ 0 , 128, 255],
    secondary:  [255, 165,  0 ]
  },
  
  retro: {
    text:       [59 , 82 , 103],
    background: [253, 247, 187],
    primary:    [148, 199, 223],
    secondary:  [254, 119, 60 ],
  },

  red: {
    text:       [ 0 ,  0  , 0 ],
    background: [232, 186, 77 ],
    primary:    [217, 96 , 62 ],
    secondary:  [136,  0 , 31 ],
  },

  blue: {
    text:       [ 0 , 22 , 39 ],
    background: [253, 255, 252],
    primary:    [46 , 196, 182],
    secondary:  [231, 29 , 54 ],
  },

  sepia: {
    text:       [112, 66 , 20 ],
    background: [245, 222, 179],
    primary:    [210, 180, 140],
    secondary:  [192, 160, 128],
  },

  grayscale: {
    text:       [50 , 50 , 50 ],
    background: [200, 200, 200],
    primary:    [150, 150, 150],
    secondary:  [100, 100, 100],
  },

  random: {
    text:       [~~(Math.random() * 256), ~~(Math.random() * 256), ~~(Math.random() * 256)],
    background: [~~(Math.random() * 256), ~~(Math.random() * 256), ~~(Math.random() * 256)],
    primary:    [~~(Math.random() * 256), ~~(Math.random() * 256), ~~(Math.random() * 256)],
    secondary:  [~~(Math.random() * 256), ~~(Math.random() * 256), ~~(Math.random() * 256)],
  },
};
