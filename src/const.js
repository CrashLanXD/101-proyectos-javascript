export const PROJECTS = [
  {
    slug: "01-falling-sand",
    title: "Falling Sand",
    description:
      "Una simulación de arena que cae y se acumula en una cuadrícula, permitiendo a los usuarios experimentar con diferentes efectos.",
    learnings: ["Eventos de mouse y touch", "DOM", "Simulación de partículas"],
    theme: { isDark: true },
  },
  {
    slug: "02-elementary-cellular-automata",
    title: "Elementary Cellular Automata",
    description:
      "Una implementación de autómatas celulares elementales, donde cada celda evoluciona según reglas simples basadas en el estado de sus vecinos.",
    learnings: [
      "Concepto de autómatas celulares",
      "Reglas de evolución",
      "Manipulación del DOM",
    ],
    theme: { isDark: false },
  },
  {
    slug: "03-game-of-life",
    title: "Game of Life",
    description:
      "El famoso juego de simulación de vida de John Conway, donde las células evolucionan según reglas predefinidas y forman patrones complejos.",
    learnings: [
      "Reglas del juego de la vida",
      "Implementación de algoritmos de evolución",
      "Optimización del rendimiento",
    ],
    theme: { isDark: false },
  },
  {
    slug: "04-breakout",
    title: "Breakout",
    description:
      "Juego mítico y clásico, Breakout del Atari para controlar con teclado",
    learnings: [
      "Ángulos",
      "Movimiento con teclado",
      "uso de canvas sin un grid",
    ],
    theme: { isDark: false },
  },
];
