import type { Evaluation } from "../model";
import { evaluationInit } from "./evaluation.init.schema";
import { evaluationKinder } from "./evaluation.kinder.schema";
import { evaluation123Primaria } from "./evaluation.123primaria.schema";
import { evaluation456Primaria } from "./evaluation.456primaria.schema";
import { evaluation123Secundaria } from "./evaluation.123secundaria.schema";
import { evaluationCondoctual } from "./evaluation.conductual.schema";


export interface EvaluationCatalogItem {
  id: string;
  title: string;
  description: string;
  schema: Evaluation[];
}

export const evaluationCatalog: EvaluationCatalogItem[] = [
  {
    id: 'init',
    title: 'Protocolo de Evaluación',
    description: 'Asignación de Evaluación',
    schema: evaluationInit,
  },
  {
    id: 'conductual',
    title: 'Protocolo de Evaluación - Kinder (v2)',
    description: 'Protocolo de Evaluación del Desarrollo',
    schema: evaluationCondoctual,
  },
  {
    id: 'kinder',
    title: 'Protocolo de Evaluación Psicopedagógica',
    description: 'Nivel Inicial (Kinder)',
    schema: evaluationKinder,
  },
  {
    id: 'primaria-1-3',
    title: 'Protocolo de Evaluación - 1ro, 2do y 3ro de Primaria',
    description: 'Protocolo de Evaluación Psicopedagógica',
    schema: evaluation123Primaria,
  },
  {
    id: 'primaria-4-6',
    title: 'Protocolo de Evaluación - 4to, 5to y 6to de Primaria',
    description: 'Protocolo de Evaluación Psicopedagógica',
    schema: evaluation456Primaria,
  },
  {
    id: 'secundaria-1-3',
    title: 'Protocolo de Evaluación - 1ro, 2do y 3ro de Secundaria',
    description: 'Protocolo de Evaluación Psicopedagógica',
    schema: evaluation123Secundaria,
  },
];
