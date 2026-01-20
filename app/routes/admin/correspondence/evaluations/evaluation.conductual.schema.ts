import type { Evaluation } from "../model";


export const evaluationCondoctual: Evaluation[] = [
  {
    title: 'Conducta y Habilidades Socio-Emocionales',
    questions: [
      {
        question: 'Juego simbólico compartido (ej. "Juguemos a la casita")',
        typeAnswer: 'scale_3_comment',
      },
      {
        question: 'Espera turnos en juegos',
        typeAnswer: 'scale_3_comment',
      },
      {
        question: 'Pide ayuda para resolver un problema (ej. alcanzar algo)',
        typeAnswer: 'scale_3_comment',
      },
      {
        question: 'Sigue instrucciones (simples o complejas)',
        typeAnswer: 'scale_3_comment',
      },
      {
        question: 'Se mantiene en su sitio más de 10 minutos (atención sostenida)',
        typeAnswer: 'scale_3_comment',
      },
    ],
  },
  {
    title: 'Lenguaje y Expresión Verbal',
    questions: [
      {
        question: 'Relata un evento secuenciado (ej. "Fui al parque y jugué")',
        typeAnswer: 'scale_3_comment',
      },
      {
        question: 'Explica el "por qué" de sus acciones',
        typeAnswer: 'scale_3_comment',
      },
      {
        question: 'Tiene reconocimiento visual de las vocales',
        typeAnswer: 'scale_3_comment',
      },
    ],
  },
  {
    title: 'Pensamiento y Razonamiento Matemático',
    questions: [
      {
        question: 'Clasifica por atributos (color / tamaño)',
        typeAnswer: 'scale_3_comment',
      },
      {
        question: 'Realiza un conteo secuencial (ej. hasta 10)',
        typeAnswer: 'scale_3_comment',
      },
      {
        question: 'Tiene nociones de cantidad (asocia número con cantidad)',
        typeAnswer: 'scale_3_comment',
      },
    ],
  },
  {
    title: 'Motricidad Fina y Gruesa',
    questions: [
      {
        question: 'Domina el agarre palmar / pinza fina',
        typeAnswer: 'scale_3_comment',
      },
      {
        question: 'Encaja piezas o figuras (puzzles básicos)',
        typeAnswer: 'scale_3_comment',
      },
      {
        question: 'Ensarta cuentas en un hilo (coordinación ojo-mano)',
        typeAnswer: 'scale_3_comment',
      },
      {
        question: 'Sigue los trazos correctamente',
        typeAnswer: 'scale_3_comment',
      },
    ],
  },
  {
    title: 'Plan de Apoyo Educativo',
    questions: [
      {
        question: '¿Cuenta con diagnóstico?',
        typeAnswer: 'yes_no',
      },
      {
        question: 'Condición',
        typeAnswer: 'text',
      },
      {
        question: 'Tipo de evaluación (Exploratoria / Completa)',
        typeAnswer: 'text',
      },
      {
        question: 'Programas de apoyo educativo',
        typeAnswer: 'table',
      },
    ],
  },
  {
    title: 'Comentario Adicional y Finalización',
    questions: [
      {
        question: 'Comentario adicional del evaluador',
        typeAnswer: 'longtext',
      },
    ],
  },
];
