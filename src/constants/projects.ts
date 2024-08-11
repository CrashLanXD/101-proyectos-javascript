import { type Project } from "@/types/Project";

export const PROJECTS: Array<Project> = [
  {
    slug: "01-falling-sand",
    title: "Falling Sand",
    description:
      "Experimenta la interacción entre arena, agua, fuego y más en este entorno dinámico.",
    compatibility: { pc: true, mobile: true },
    theme: "dark",
  },
  {
    slug: "02-elementary-cellular-automata",
    title: "Cellular Automata",
    description:
      "Una implementación de Elementary Cellular Automata, donde cada celda evoluciona según reglas simples basadas en el estado de sus vecinos.",
    compatibility: { pc: true, mobile: true },
    theme: "dark",
  },
  {
    slug: "03-game-of-life",
    title: "Game of Life",
    description:
      "Simulación de la evolución y la supervivencia en el clásico Juego de la Vida. ¡Observa cómo las formas de vida se desarrollan y evolucionan!",
    compatibility: { pc: true, mobile: true },
    theme: "dark",
  },
  {
    slug: "04-breakout",
    title: "Breakout",
    description:
      "¡Llega el nuevo juego de Breakout, Desafía tus habilidades y reflejos mientras rompes ladrillos con tu paleta. ¡Prepárate para horas de diversión con este emocionante desafío de habilidad!",
    compatibility: { pc: true, mobile: true },
    theme: "dark",
  },
  {
    slug: "05-space-invaders",
    title: "Space Invaders",
    description:
      "¡Prepárate para la batalla del siglo con Space Invaders!. ¡Destruye a los invasores antes de que sea demasiado tarde y conviértete en el héroe de la humanidad! ¿Tienes lo necesario para salvar el planeta?",
    compatibility: { pc: true, mobile: false },
    theme: "dark",
  },
  {
    slug: "06-tetris",
    title: "Tetris",
    description:
      "¡Domina la velocidad y la estrategia en este electrizante desafío de bloques en caída! Tetris: ¡el fenómeno de puzzle que te mantendrá pegado a la pantalla por horas de diversión sin parar!",
    compatibility: { pc: true, mobile: true },
    theme: "both",
  },
  {
    slug: "07-snake",
    title: "Snake",
    description:
      "Dirige a la serpiente a través del campo de juego mientras se alimenta. Pero ten cuidado, Evita chocar contra las paredes o contra tu propia cola.",
    compatibility: { pc: true, mobile: false },
    theme: "dark",
  },
  {
    slug: "08-pewpew",
    title: "Pew Pew",
    description:
      "Juego inspirado en Pew Pew Live. Donde controlas una nave que debe enfrentarse a hordas de enemigos mientras esquivas una gran cantidad de proyectiles.",
    compatibility: { pc: true, mobile: false },
    theme: "dark",
  },
];
