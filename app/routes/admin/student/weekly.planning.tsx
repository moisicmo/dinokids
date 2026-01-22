import { useState, useMemo, type FormEvent } from 'react';
import { Button, InputCustom, SelectCustom, DateTimePickerCustom } from '@/components';
import { useForm } from '@/hooks';
import {
  formWeeklyPlanningInit,
  formWeeklyPlanningValidations,
  type WeeklyPlanningForm,
  type WeeklyPlanningObjective,
  type StudentModel,
  type StudentRequest,
  type TutorModel,
  type WeeklyPlanningWeek,
} from '@/models';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ChevronUp, ChevronDown, PlusCircle, Trash2 } from 'lucide-react';

interface Props {
  student: StudentModel;
  onClose: () => void;
  onUpdate: (id: string, body: StudentRequest) => void;
}

export const WeeklyPlanningModal = ({
  student,
  onClose,
  onUpdate,
}: Props) => {
  // Estado para semanas expandidas/colapsadas
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set());

  // Memoizar initialForm
  const initialForm = useMemo<WeeklyPlanningForm>(() => {
    return student.weeklyPlannings && Array.isArray(student.weeklyPlannings)
      ? { weeks: student.weeklyPlannings }
      : formWeeklyPlanningInit;
  }, [student.weeklyPlannings]);

  const {
    weeks,
    formState,
    onValueChange,
    onResetForm,
    isFormValid,
    weeksValid,
  } = useForm(initialForm, formWeeklyPlanningValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);

  // Alternar expansión de semana
  const toggleWeekExpansion = (weekIndex: number) => {
    setExpandedWeeks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(weekIndex)) {
        newSet.delete(weekIndex);
      } else {
        newSet.add(weekIndex);
      }
      return newSet;
    });
  };

  // Agregar nueva semana
  const addNewWeek = () => {
    const newWeekNumber = weeks.length + 1;
    const newWeek: WeeklyPlanningWeek = {
      weekNumber: newWeekNumber,
      workArea: '',
      objectives: [{
        smartObjective: '',
        materials: '',
        achievementStatus: '',
        acquisitionDate: '',
        observations: '',
      }],
      completed: false,
    };

    const updatedWeeks = [...weeks, newWeek];
    onValueChange('weeks', updatedWeeks);

    // La nueva semana se crea expandida para facilitar edición
    setExpandedWeeks(prev => {
      const newSet = new Set(prev);
      newSet.add(weeks.length); // Índice de la nueva semana
      return newSet;
    });
  };

  // Agregar nuevo objetivo a una semana
  const addObjectiveToWeek = (weekIndex: number) => {
    const updatedWeeks = [...weeks];
    const newObjective: WeeklyPlanningObjective = {
      smartObjective: '',
      materials: '',
      achievementStatus: '',
      acquisitionDate: '',
      observations: '',
    };

    updatedWeeks[weekIndex].objectives.push(newObjective);
    onValueChange('weeks', updatedWeeks);
  };

  // Eliminar objetivo de una semana
  const removeObjectiveFromWeek = (weekIndex: number, objectiveIndex: number) => {
    const updatedWeeks = [...weeks];
    if (updatedWeeks[weekIndex].objectives.length > 1) {
      updatedWeeks[weekIndex].objectives.splice(objectiveIndex, 1);
      onValueChange('weeks', updatedWeeks);
    }
  };

  // Actualizar campo de una semana
  const updateWeekField = (weekIndex: number, field: keyof WeeklyPlanningWeek, value: any) => {
    const updatedWeeks = [...weeks];
    updatedWeeks[weekIndex] = { ...updatedWeeks[weekIndex], [field]: value };
    onValueChange('weeks', updatedWeeks);
  };

  // Actualizar campo de un objetivo
  const updateObjectiveField = (
    weekIndex: number,
    objectiveIndex: number,
    field: keyof WeeklyPlanningObjective,
    value: any
  ) => {
    const updatedWeeks = [...weeks];
    const updatedObjectives = [...updatedWeeks[weekIndex].objectives];

    if (field === 'acquisitionDate' && value instanceof Date) {
      // Convertir Date a string ISO
      value = value.toISOString();
    }

    updatedObjectives[objectiveIndex] = {
      ...updatedObjectives[objectiveIndex],
      [field]: value
    };

    updatedWeeks[weekIndex] = {
      ...updatedWeeks[weekIndex],
      objectives: updatedObjectives
    };

    onValueChange('weeks', updatedWeeks);
  };

  // Manejar cambio de estado "completado" de la semana
  const handleWeekCompletedChange = (weekIndex: number, completed: boolean) => {
    const updatedWeeks = [...weeks];

    if (completed) {
      // Marcar todos los objetivos como "adquirido" y fecha actual
      const today = new Date().toISOString();
      updatedWeeks[weekIndex].objectives = updatedWeeks[weekIndex].objectives.map((obj: any) => ({
        ...obj,
        achievementStatus: 'adquirido',
        acquisitionDate: today,
      }));
    } else {
      // Si se desmarca, limpiar campos de objetivos que estaban como "adquirido"
      updatedWeeks[weekIndex].objectives = updatedWeeks[weekIndex].objectives.map((obj: any) => ({
        ...obj,
        achievementStatus: obj.achievementStatus === 'adquirido' ? '' : obj.achievementStatus,
        acquisitionDate: obj.achievementStatus === 'adquirido' ? '' : obj.acquisitionDate,
      }));
    }

    updatedWeeks[weekIndex].completed = completed;
    onValueChange('weeks', updatedWeeks);
  };

  // Memoizar fechas convertidas a Date
  const objectiveDates = useMemo(() => {
    return weeks.map((week: any) =>
      week.objectives.map((obj: any) => {
        if (typeof obj.acquisitionDate === 'string' && obj.acquisitionDate) {
          return new Date(obj.acquisitionDate);
        }
        return null;
      })
    );
  }, [weeks]);

  // Enviar formulario
  const sendSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    console.log('Weekly planning data:', weeks);
    console.log('Is form valid:', isFormValid);

    if (!isFormValid) return;

    await onUpdate(student.userId, {
      numberDocument: student.user?.numberDocument,
      typeDocument: 'DNI',
      name: student.user.name,
      lastName: `${student.user?.lastName}`,
      email: student.user.email,
      phone: [],
      birthdate: student.birthdate,
      gender: student.gender,
      school: student.school?.name,
      grade: student.grade,
      educationLevel: student.educationLevel,
      tutorIds: student.tutors.map((tutor: TutorModel) => tutor.userId),
      numberCard: student.user.numberCard,
      sessionTrackings: student.sessionTrackings,
      weeklyPlannings: formState.weeks,
      evaluationPlannings: student.evaluationPlannings,
    });

    onResetForm();
    onClose();
  };

  const hasWeekError = !!weeksValid && formSubmitted;

  const achievementStatusOptions = [
    { id: '', value: 'Seleccione' },
    { id: 'no-adquirido', value: 'No Adquirido' },
    { id: 'en-proceso', value: 'En Proceso' },
    { id: 'adquirido', value: 'Adquirido' },
  ];

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'adquirido': return 'bg-green-100 text-green-800';
      case 'en-proceso': return 'bg-yellow-100 text-yellow-800';
      case 'no-adquirido': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-7xl max-h-[90vh] overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Planificación Semanal</CardTitle>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={sendSubmit} className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <Button
                  type="button"
                  onClick={addNewWeek}
                  variant="outline"
                  className="gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Agregar Nueva Semana
                </Button>
              </div>

              {hasWeekError && (
                <Badge variant="destructive">
                  {weeksValid}
                </Badge>
              )}
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-24 font-semibold">N° SEM.</TableHead>
                    <TableHead className="font-semibold">ÁREA DE TRABAJO</TableHead>
                    <TableHead className="w-2/5 font-semibold">DETALLE DE OBJETIVOS Y SEGUIMIENTO</TableHead>
                    <TableHead className="w-32 font-semibold">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {weeks.map((week: any, weekIndex: number) => {
                    const isExpanded = expandedWeeks.has(weekIndex);
                    const summaryText = week.objectives[0]?.smartObjective?.trim() || 'Añadir objetivo...';

                    return (
                      <TableRow
                        key={weekIndex}
                        className={week.completed ? 'bg-green-50/30' : ''}
                      >
                        {/* Número de semana */}
                        <TableCell className="align-top">
                          <div className="flex flex-col items-center gap-2">
                            <Badge variant={week.completed ? "default" : "outline"}
                              className={`${week.completed ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}`}>
                              Semana {week.weekNumber}
                            </Badge>
                          </div>
                        </TableCell>

                        {/* Área de trabajo */}
                        <TableCell className="align-top">
                          <div className="space-y-2">
                            <InputCustom
                              multiline
                              value={week.workArea}
                              name={`workArea_${weekIndex}`}
                              onChange={(e) => updateWeekField(weekIndex, 'workArea', e.target.value)}
                              placeholder="Ej: Lenguaje, Motricidad fina..."
                              disabled={week.completed}
                              error={hasWeekError && !week.workArea.trim()}
                              className="min-h-[80px]"
                            />
                            {week.completed && (
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                Completada
                              </Badge>
                            )}
                          </div>
                        </TableCell>

                        {/* Detalle de objetivos */}
                        <TableCell className="align-top">
                          {!isExpanded ? (
                            <Card className="bg-muted/30">
                              <CardContent className="p-4">
                                <p className="text-sm text-muted-foreground italic">
                                  {summaryText}
                                </p>
                              </CardContent>
                            </Card>
                          ) : (
                            <Card>
                              <CardContent className="p-4 space-y-4">
                                {week.objectives.map((objective: any, objIndex: number) => (
                                  <Card
                                    key={objIndex}
                                    className={`${objIndex > 0 ? 'mt-4 border-t' : ''}`}
                                  >
                                    <CardContent className="p-4 space-y-4">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Objetivo SMART */}
                                        <div className="md:col-span-2">
                                          <Label htmlFor={`smartObjective_${weekIndex}_${objIndex}`}>
                                            Objetivo Específico (SMART):
                                          </Label>
                                          <InputCustom
                                            multiline
                                            name={`smartObjective_${weekIndex}_${objIndex}`}
                                            id={`smartObjective_${weekIndex}_${objIndex}`}
                                            value={objective.smartObjective}
                                            onChange={(e) =>
                                              updateObjectiveField(weekIndex, objIndex, 'smartObjective', e.target.value)
                                            }
                                            placeholder="Ej: Reconoce 5 colores..."
                                            disabled={week.completed}
                                            error={hasWeekError && !objective.smartObjective.trim()}
                                            className="min-h-[80px]"
                                          />
                                        </div>

                                        {/* Materiales */}
                                        <div>
                                          <Label htmlFor={`materials_${weekIndex}_${objIndex}`}>
                                            Material / Recursos:
                                          </Label>
                                          <InputCustom
                                            multiline
                                            name={`materials_${weekIndex}_${objIndex}`}
                                            id={`materials_${weekIndex}_${objIndex}`}
                                            value={objective.materials}
                                            onChange={(e) =>
                                              updateObjectiveField(weekIndex, objIndex, 'materials', e.target.value)
                                            }
                                            placeholder="Ej: Cuentos, bloques, lápices..."
                                            disabled={week.completed}
                                            className="min-h-[80px]"
                                          />
                                        </div>

                                        {/* Estado del logro */}
                                        {/* Estado del logro */}
                                        <div>
                                          <Label htmlFor={`achievementStatus_${weekIndex}_${objIndex}`}>
                                            Estado del Logro:
                                          </Label>
                                          <SelectCustom
                                            label="Estado"
                                            options={achievementStatusOptions}
                                            selected={achievementStatusOptions.find(
                                              opt => opt.id === objective.achievementStatus
                                            ) || null}  // <-- Aquí el cambio importante
                                            onSelect={(value) => {
                                              if (value && !Array.isArray(value)) {
                                                updateObjectiveField(
                                                  weekIndex,
                                                  objIndex,
                                                  'achievementStatus',
                                                  value.id
                                                );
                                              }
                                            }}
                                            disabled={week.completed}
                                          />
                                          {objective.achievementStatus && (
                                            <Badge
                                              className={`mt-2 ${getStatusBadgeColor(objective.achievementStatus)}`}
                                            >
                                              {achievementStatusOptions.find(opt => opt.id === objective.achievementStatus)?.value}
                                            </Badge>
                                          )}
                                        </div>

                                        {/* Fecha de adquisición */}
                                        <div>
                                          <Label htmlFor={`acquisitionDate_${weekIndex}_${objIndex}`}>
                                            Fecha de Adquisición:
                                          </Label>
                                          <DateTimePickerCustom
                                            mode="date"
                                            name={`acquisitionDate_${weekIndex}_${objIndex}`}
                                            id={`acquisitionDate_${weekIndex}_${objIndex}`}
                                            value={objectiveDates[weekIndex]?.[objIndex]}
                                            onChange={(val) =>
                                              updateObjectiveField(
                                                weekIndex,
                                                objIndex,
                                                'acquisitionDate',
                                                val
                                              )
                                            }
                                            disabled={week.completed}
                                          />
                                        </div>

                                        {/* Observaciones */}
                                        <div className="md:col-span-2">
                                          <Label htmlFor={`observations_${weekIndex}_${objIndex}`}>
                                            Observaciones / Evidencias Clave:
                                          </Label>
                                          <InputCustom
                                            multiline
                                            name={`observations_${weekIndex}_${objIndex}`}
                                            id={`observations_${weekIndex}_${objIndex}`}
                                            value={objective.observations}
                                            onChange={(e) =>
                                              updateObjectiveField(weekIndex, objIndex, 'observations', e.target.value)
                                            }
                                            placeholder="Ej: Participó activamente..."
                                            disabled={week.completed}
                                            className="min-h-[80px]"
                                          />
                                        </div>
                                      </div>

                                      {/* Botón para eliminar objetivo */}
                                      {week.objectives.length > 1 && !week.completed && (
                                        <div className="mt-3 text-right">
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeObjectiveFromWeek(weekIndex, objIndex)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                          >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            Eliminar Objetivo
                                          </Button>
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>
                                ))}

                              </CardContent>
                            </Card>
                          )}
                        </TableCell>

                        {/* Acciones */}
                        <TableCell className="align-top">
                          <div className="flex flex-col items-center space-y-4">
                            {/* Botón expandir/contraer */}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => toggleWeekExpansion(weekIndex)}
                              className="gap-2"
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="h-4 w-4" />
                                  <span className="hidden sm:inline">Contraer</span>
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="h-4 w-4" />
                                  <span className="hidden sm:inline">Expandir</span>
                                </>
                              )}
                            </Button>

                            {/* Botón agregar objetivo */}
                            {!week.completed && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addObjectiveToWeek(weekIndex)}
                                className="gap-2"
                              >
                                <PlusCircle className="h-4 w-4" />
                                <span className="hidden sm:inline">Objetivo</span>
                              </Button>
                            )}

                            {/* Switch semana completada */}
                            <div className="flex flex-col items-center gap-2">
                              <Label htmlFor={`weekCompleted_${weekIndex}`} className="text-sm">
                                {week.completed ? 'Completada' : 'Pendiente'}
                              </Label>
                              <Switch
                                id={`weekCompleted_${weekIndex}`}
                                checked={week.completed}
                                onCheckedChange={(checked: any) => handleWeekCompletedChange(weekIndex, checked)}
                              />
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onResetForm();
                  onClose();
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid}
              >
                Guardar Planificación
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};