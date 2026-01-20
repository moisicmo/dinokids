import type { Evaluation } from "../model";

export const evaluationKinder: Evaluation[] = [
  {
    title: 'Conducta',
    questions: [
      { question: '¿Sigue instrucciones?', typeAnswer: 'scale_3_comment' },
      { question: '¿Se mantiene en su sitio más de 10 minutos?', typeAnswer: 'scale_3_comment' },
      { question: '¿Pide permiso para realizar alguna actividad?', typeAnswer: 'scale_3_comment' },
      { question: '¿Se mostró retraído durante la evaluación?', typeAnswer: 'scale_3_comment' },
      { question: '¿Tiene poca tolerancia a la frustración?', typeAnswer: 'scale_3_comment' },
      { question: '¿Es interactivo con otros niños?', typeAnswer: 'scale_3_comment' },
      { question: '¿Tiene respuesta verbal ante preguntas de otros niños?', typeAnswer: 'scale_3_comment' },
    ],
  },
  {
    title: 'Lectoescritura',
    questions: [
      { question: 'Escribe su nombre', typeAnswer: 'scale_3_comment' },
      { question: 'Tiene reconocimiento del esquema corporal', typeAnswer: 'scale_3_comment' },
      { question: 'Tiene manejo de pinza fina', typeAnswer: 'scale_3_comment' },
      { question: 'Sigue los trazos correctamente', typeAnswer: 'scale_3_comment' },
      { question: 'Pinta dentro del dibujo', typeAnswer: 'scale_3_comment' },
      { question: 'Puede realizar dibujos', typeAnswer: 'scale_3_comment' },
      { question: 'Tiene reconocimiento visual de las vocales', typeAnswer: 'scale_3_comment' },
      { question: 'Tiene reconocimiento visual del abecedario', typeAnswer: 'scale_3_comment' },
      { question: 'Mantiene una dirección lineal en su escritura', typeAnswer: 'scale_3_comment' },
      { question: 'Lateralidad', typeAnswer: 'scale_3_comment' },
    ],
  },
  {
    title: 'Matemáticas',
    questions: [
      { question: 'Realiza un conteo secuencial', typeAnswer: 'scale_3_comment' },
      { question: 'Reconoce los números', typeAnswer: 'scale_3_comment' },
      { question: 'Tiene nociones de cantidad', typeAnswer: 'scale_3_comment' },
      { question: 'Tiene nociones de tamaño', typeAnswer: 'scale_3_comment' },
      { question: 'Tiene nociones de espacio', typeAnswer: 'scale_3_comment' },
      { question: 'Tiene nociones de tiempo', typeAnswer: 'scale_3_comment' },
      { question: 'Realiza secuencias', typeAnswer: 'scale_3_comment' },
    ],
  },
  {
    title: 'Plan de Apoyo Educativo',
    questions: [
      { question: '¿Cuenta con diagnóstico?', typeAnswer: 'yes_no' },
      { question: 'Condición', typeAnswer: 'text' },
      { question: 'Tipo de evaluación', typeAnswer: 'text' },
      { question: 'Programa de apoyo', typeAnswer: 'longtext' },
    ],
  },
  {
    title: 'Comentario Adicional',
    questions: [
      { question: 'Comentario adicional del evaluador', typeAnswer: 'longtext' },
    ],
  },
];