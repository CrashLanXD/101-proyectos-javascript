import { type Project } from "@/types/Project";
import { CATEGORIES } from "./categories";

export const PROJECTS: Array<Project> = [
  {
    slug: "01-falling-sand",
    title: "Falling Sand",
    description:
      "Experimenta la interacción entre arena, agua, fuego y más en este entorno dinámico.",
    compatibility: { pc: true, mobile: true },
    theme: "dark",
    labels: [...CATEGORIES.mathematics.english, "canvas", "ctx 2d", "oop", "physics", "simulation"],
    thumbnailSrc: "/projects/thumbnails/01.webp",
  },
  {
    slug: "02-elementary-cellular-automata",
    title: "Cellular Automata",
    description:
      "Una implementación de Elementary Cellular Automata, donde cada celda evoluciona según reglas simples basadas en el estado de sus vecinos.",
    compatibility: { pc: true, mobile: true },
    theme: "dark",
    labels: [...CATEGORIES.mathematics.english, "canvas", "ctx 2d", "automata"],
    thumbnailSrc: "/projects/thumbnails/02.webp",
  },
  {
    slug: "03-game-of-life",
    title: "Game of Life",
    description:
      "Simulación de la evolución y la supervivencia en el clásico Juego de la Vida. ¡Observa cómo las formas de vida se desarrollan y evolucionan!",
    compatibility: { pc: true, mobile: true },
    theme: "dark",
    labels: [...CATEGORIES.mathematics.english, "canvas", "ctx 2d", "automata"],
    thumbnailSrc: "/projects/thumbnails/03.webp",
  },
  {
    slug: "04-breakout",
    title: "Breakout",
    description:
      "¡Llega el nuevo juego de Breakout, Desafía tus habilidades y reflejos mientras rompes ladrillos con tu paleta. ¡Prepárate para horas de diversión con este emocionante desafío de habilidad!",
    compatibility: { pc: true, mobile: true },
    theme: "dark",
    labels: [...CATEGORIES.videoGames.english, "canvas", "ctx 2d", "sonido", "Atari 2600"],
    thumbnailSrc: "/projects/thumbnails/04.webp",
  },
  {
    slug: "05-space-invaders",
    title: "Space Invaders",
    description:
      "¡Prepárate para la batalla del siglo con Space Invaders!. ¡Destruye a los invasores antes de que sea demasiado tarde y conviértete en el héroe de la humanidad! ¿Tienes lo necesario para salvar el planeta?",
    compatibility: { pc: true, mobile: false },
    theme: "dark",
    labels: [...CATEGORIES.videoGames.english, "canvas", "ctx 2d", "sonido", "Atari 2600", "external assets"],
    thumbnailSrc: "/projects/thumbnails/05.webp",
  },
  {
    slug: "06-tetris",
    title: "Tetris",
    description:
      "¡Domina la velocidad y la estrategia en este electrizante desafío de bloques en caída! Tetris: ¡el fenómeno de puzzle que te mantendrá pegado a la pantalla por horas de diversión sin parar!",
    compatibility: { pc: true, mobile: true },
    theme: "both",
    labels: [...CATEGORIES.videoGames.english, "canvas", "ctx 2d", "game boy", "oop", "ui"],
    thumbnailSrc: "/projects/thumbnails/06.webp",
  },
  {
    slug: "07-snake",
    title: "Snake",
    description:
      "Dirige a la serpiente a través del campo de juego mientras se alimenta. Pero ten cuidado, Evita chocar contra las paredes o contra tu propia cola.",
    compatibility: { pc: true, mobile: false },
    theme: "dark",
    labels: [...CATEGORIES.videoGames.english, "canvas", "ctx 2d", "classic", "google"],
    thumbnailSrc: "/projects/thumbnails/07.webp",
  },
  {
    slug: "08-pewpew",
    title: "Pew Pew",
    description:
      "Juego inspirado en Pew Pew Live. Donde controlas una nave que debe enfrentarse a hordas de enemigos mientras esquivas una gran cantidad de proyectiles.",
    compatibility: { pc: true, mobile: false },
    theme: "dark",
    labels: [...CATEGORIES.videoGames.english, "webgl", "canvas", "oop", "touchpad", "long"],
    thumbnailSrc: "/projects/thumbnails/08.webp",
  },
  {
    slug: "09-color-picker",
    title: "Color Picker",
    description:
      "Una herramienta para seleccionar colores de cualquier imagen. Puedes cargar imágenes, explorar píxeles con una lupa y obtener los valores de color en diferentes formatos.",
    compatibility: { pc: true, mobile: true },
    theme: "both",
    labels: [...CATEGORIES.utility.spanish, "utility", "canvas", "ctx 2d", "ui", "tool", "color conversion", "accessibility", "offline", "API", "conversion de colores"],
    thumbnailSrc: "/projects/thumbnails/colorPicker.webp",
  },
  {
    slug: "10-minesweeper",
    title: "Minesweeper",
    description:
    "Es un Minesweeper... Despeja el tablero sin activar las minas, ¡y demuestra tu destreza y estrategia!",
    compatibility: { pc: true, mobile: false },
    theme: "dark",
    labels: [...CATEGORIES.videoGames.english, "microsoft classic", "retro"],
    thumbnailSrc: "/projects/thumbnails/minesweeper.webp",
  }
];
