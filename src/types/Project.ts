export interface Project {
  slug: string;                      // Identificador único del proyecto (URL-friendly)
  title: string;                     // Título del proyecto
  description: string;               // Descripción breve del proyecto
  compatibility: {
    pc: boolean | string;            // Compatibilidad con PC, puede ser true/false o un string con detalles
    mobile: boolean | string;        // Compatibilidad con dispositivos móviles, puede ser true/false o un string con detalles
  };
  theme?: 'light' | 'dark' | 'both'; // Opciones de tema: claro, oscuro o ambos
  labels?: string[];                 // Etiquetas de categorías como 'DOM', 'WebGL', 'canvas', etc.
  thumbnailSrc?: string;             // Ruta de la miniatura para la card del proyecto
}
