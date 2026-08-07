import type { Evaluation } from "../model";
import { evaluationInit } from "./evaluation.init.schema";
import { evaluationKinder } from "./evaluation.kinder.schema";
import { evaluation123Primaria } from "./evaluation.123primaria.schema";
import { evaluation456Primaria } from "./evaluation.456primaria.schema";
import { evaluation123Secundaria } from "./evaluation.123secundaria.schema";
import { evaluationCondoctual } from "./evaluation.conductual.schema";
import { TypeAction, TypeSubject } from "@/models";

export interface EvaluationCatalogItem {
  id: string;
  title: string;
  description: string;
  schema: Evaluation[];
  action: TypeAction;
  subject: TypeSubject;
  /**
   * A quién se envía este documento: se resuelve por CAPACIDAD (permiso
   * action+subject), no por nombre de rol. Cualquier rol que tenga ese
   * permiso (p.ej. si el superadmin crea "Evaluador Senior" con los mismos
   * permisos que "Evaluador") aparece como destinatario válido, sin tocar
   * este catálogo.
   */
  sendToAction: TypeAction;
  sendToSubject: TypeSubject;
}

export const evaluationCatalog: EvaluationCatalogItem[] = [
  {
    id: 'init',
    title: 'Asignación de Evaluación',
    description: 'Asignación de Evaluación',
    schema: evaluationInit,
    action: TypeAction.create,
    subject: TypeSubject.evaluationInit,
    // Marcador de "capacidad de evaluador": solo el rol Evaluador (seed) tiene
    // create sobre evaluationKinder — igual que sobre los otros 4 protocolos.
    sendToAction: TypeAction.create,
    sendToSubject: TypeSubject.evaluationKinder,
  },
  {
    id: 'conductual',
    title: 'Protocolo de Evaluación - Kinder (v2)',
    description: 'Protocolo de Evaluación del Desarrollo',
    schema: evaluationCondoctual,
    action: TypeAction.create,
    subject: TypeSubject.evaluationCondoctual,
    // Marcador de "capacidad de profesor": solo el rol Profesor (seed) tiene
    // create sobre weeklyPlanning.
    sendToAction: TypeAction.create,
    sendToSubject: TypeSubject.weeklyPlanning,
  },
  {
    id: 'kinder',
    title: 'Protocolo de Evaluación Psicopedagógica',
    description: 'Nivel Inicial (Kinder)',
    schema: evaluationKinder,
    action: TypeAction.create,
    subject: TypeSubject.evaluationKinder,
    sendToAction: TypeAction.create,
    sendToSubject: TypeSubject.weeklyPlanning,
  },
  {
    id: 'primaria-1-3',
    title: 'Protocolo de Evaluación - 1ro, 2do y 3ro de Primaria',
    description: 'Protocolo de Evaluación Psicopedagógica',
    schema: evaluation123Primaria,
    action: TypeAction.create,
    subject: TypeSubject.evaluation123Primaria,
    sendToAction: TypeAction.create,
    sendToSubject: TypeSubject.weeklyPlanning,
  },
  {
    id: 'primaria-4-6',
    title: 'Protocolo de Evaluación - 4to, 5to y 6to de Primaria',
    description: 'Protocolo de Evaluación Psicopedagógica',
    schema: evaluation456Primaria,
    action: TypeAction.create,
    subject: TypeSubject.evaluation456Primaria,
    sendToAction: TypeAction.create,
    sendToSubject: TypeSubject.weeklyPlanning,
  },
  {
    id: 'secundaria-1-3',
    title: 'Protocolo de Evaluación - 1ro, 2do y 3ro de Secundaria',
    description: 'Protocolo de Evaluación Psicopedagógica',
    schema: evaluation123Secundaria,
    action: TypeAction.create,
    subject: TypeSubject.evaluation123Secundaria,
    sendToAction: TypeAction.create,
    sendToSubject: TypeSubject.weeklyPlanning,
  },
];
