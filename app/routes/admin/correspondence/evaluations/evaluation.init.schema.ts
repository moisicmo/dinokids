import type { Evaluation } from "../model";


export const evaluationInit: Evaluation[] = [
  {
    title: "Datos Personales",
    questions: [
      { question: "Nombre del Tutor", typeAnswer: "text" },
      { question: "Celular del Tutor", typeAnswer: "text" },
      { question: "Nombre del niño", typeAnswer: "text" },
      { question: "Edad", typeAnswer: "text" },
      { question: "Fecha de nacimiento", typeAnswer: "text" },
      { question: "Unidad educativa", typeAnswer: "text" },
      { question: "Grado escolar", typeAnswer: "text" },
      { question: "Fecha y hora de evaluación", typeAnswer: "datetime" },
    ],
  },
  {
    title: "Información General del Niño",
    questions: [
      { question: "¿Cuál es el motivo de consulta?", typeAnswer: 'longtext' },
      { question: "¿Cómo describiría el desempeño en matemáticas, lectura y escritura?", typeAnswer: 'longtext' },
      { question: "¿Cuánto tiempo al día pasa con su hijo/a y qué actividades realizan?", typeAnswer: 'longtext' },
      { question: "¿Cómo juega su hijo/a? ¿Prefiere jugar solo o con otros niños?", typeAnswer: 'longtext' },
    ],
  },
  {
    title: "Psicopedagogía (5 - 13 años)",
    questions: [
      { question: "¿Se distrae con facilidad en clases?", typeAnswer: 'scale_3_comment' },
      { question: "¿Tiene dificultades para hacer amigos?", typeAnswer: 'yes_no' },
      { question: "¿Le resulta difícil seguir instrucciones?", typeAnswer: 'yes_no' },
      { question: "¿Cuando lee lo hace muy despacio o se equivoca seguido?", typeAnswer: 'yes_no' },
      { question: "¿Puede leer pero tiene dificultad para entender lo leído?", typeAnswer: 'yes_no' },
      { question: "¿Comete muchos errores de ortografía?", typeAnswer: 'yes_no' },
      { question: "¿Se le dificulta realizar cálculos matemáticos sencillos?", typeAnswer: 'yes_no' },
      { question: "¿Le cuesta resolver problemas lógicos?", typeAnswer: 'yes_no' },
      { question: "¿Le cuesta ubicarse en derecha-izquierda o conceptos espaciales?", typeAnswer: 'yes_no' },
    ],
  },
  {
    title: "Déficit de Atención e Hiperactividad (TDAH)",
    questions: [
      { question: "¿Se distrae con ruidos u otros estímulos?", typeAnswer: 'yes_no' },
      { question: "¿Le cuesta seguir instrucciones y completar tareas?", typeAnswer: 'yes_no' },
      { question: "¿Tiene dificultad para mantener la atención?", typeAnswer: 'yes_no' },
      { question: "¿Pierde materiales escolares con frecuencia?", typeAnswer: 'yes_no' },
      { question: "¿Evita tareas que requieren concentración prolongada?", typeAnswer: 'yes_no' },
      { question: "¿Se muestra inquieto o mueve manos/pies constantemente?", typeAnswer: 'yes_no' },
      { question: "¿Interrumpe o responde antes de tiempo?", typeAnswer: 'yes_no' },
      { question: "¿Se levanta cuando debería permanecer sentado?", typeAnswer: 'yes_no' },
      { question: "¿Estas conductas se presentan desde hace más de seis meses?", typeAnswer: 'yes_no' },
    ],
  },
  {
    title: "Trastorno del Espectro Autista (TEA) - 2 a 13 años",
    questions: [
      { question: "¿Mantiene contacto visual adecuado?", typeAnswer: 'yes_no' },
      { question: "¿Responde cuando lo llaman por su nombre?", typeAnswer: 'yes_no' },
      { question: "¿Expresa sus necesidades con palabras o gestos?", typeAnswer: 'yes_no' },
      { question: "¿Muestra interés en relacionarse con otros?", typeAnswer: 'yes_no' },
      { question: "¿Acepta cambios en su rutina fácilmente?", typeAnswer: 'yes_no' },
      { question: "¿Se irrita con facilidad?", typeAnswer: 'yes_no' },
      { question: "¿Realiza movimientos repetitivos?", typeAnswer: 'yes_no' },
      { question: "¿Tiene dificultad con habilidades motoras finas?", typeAnswer: 'yes_no' },
      { question: "¿Es sensible a ruidos, texturas, olores o sabores?", typeAnswer: 'yes_no' },
      { question: "¿Se lastima a sí mismo en ocasiones?", typeAnswer: 'yes_no' },
    ],
  },
  {
    title: "Estimulación Temprana (2 - 4 años)",
    questions: [
      { question: "¿Cómo se comunica cuando quiere algo?", typeAnswer: 'longtext' },
      { question: "¿Se frustra al usar las manos para tareas simples?", typeAnswer: 'yes_no' },
      { question: "¿Prefiere jugar solo?", typeAnswer: 'yes_no' },
      { question: "¿Entiende órdenes simples?", typeAnswer: 'yes_no' },
      { question: "¿Intenta comer por sí mismo?", typeAnswer: 'yes_no' },
      { question: "¿Avisa cuando necesita ir al baño?", typeAnswer: 'yes_no' },
      { question: "¿Responde cuando lo llaman por su nombre?", typeAnswer: 'yes_no' },
      { question: "¿Le cuesta compartir o esperar turnos?", typeAnswer: 'yes_no' },
    ],
  },
  {
    title: "Estimulación del Lenguaje (2 - 6 años)",
    questions: [
      { question: "¿Se comunica usando gestos, sonidos o palabras?", typeAnswer: 'yes_no' },
      { question: "¿Habla usando frases?", typeAnswer: 'yes_no' },
      { question: "¿Personas fuera de la familia lo entienden al hablar?", typeAnswer: 'yes_no' },
      { question: "¿Nombra objetos de su entorno?", typeAnswer: 'yes_no' },
      { question: "¿Pronuncia claramente la mayoría de palabras?", typeAnswer: 'yes_no' },
      { question: "¿Su conversación fluye de manera natural?", typeAnswer: 'yes_no' },
      { question: "¿Puede relatar lo que hizo en el día?", typeAnswer: 'yes_no' },
      { question: "¿Parece escuchar bien?", typeAnswer: 'yes_no' },
      { question: "¿Muestra interés por comunicarse y jugar?", typeAnswer: 'yes_no' },
      { question: "¿Se frustra cuando no logra hacerse entender?", typeAnswer: 'yes_no' },
    ],
  },
  {
    title: "Psicomotricidad (0 - 4 años)",
    questions: [
      { question: "¿Se irrita ante sonidos, olores o texturas?", typeAnswer: 'yes_no' },
      { question: "¿Juega con otros niños de su edad?", typeAnswer: 'yes_no' },
      { question: "¿Reconoce partes de su cuerpo?", typeAnswer: 'yes_no' },
      { question: "¿Expresa emociones con gestos o movimientos?", typeAnswer: 'yes_no' },
      { question: "¿Pide ayuda cuando lo necesita?", typeAnswer: 'yes_no' },
      { question: "¿Obedece órdenes simples como 'ven' o 'siéntate'?", typeAnswer: 'yes_no' },
      { question: "¿Reconoce conceptos como arriba-abajo o derecha-izquierda?", typeAnswer: 'yes_no' },
      { question: "¿Tiene dificultad para coordinar movimientos?", typeAnswer: 'yes_no' },
      { question: "¿Hay alteraciones en su postura o forma de moverse?", typeAnswer: 'yes_no' },
    ],
  },
  {
    title: "Comentario Adicional",
    questions: [
      { question: "Comentario adicional del tutor", typeAnswer: 'longtext' },
    ],
  },
];