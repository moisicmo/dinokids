import { useEffect, useState } from 'react';
import { evaluationCatalog } from './evaluations/catalog';
import EvaluationForm from './evaluation.form';
import { useCorrespondenceStore, usePermissionStore, useAuthStore, useStudentStore } from '@/hooks';
import { CorrespondenceTable } from './correspondence.table';
import type { Question } from '.';
import { TypeAction, TypeSubject, type AdminSentTransmissionModel, type DocumentTransmissionModel, type StudentModel, type SentTransmissionModel } from '@/models';
import { Button } from '@/components';
import { SessionTrackingModal, WeeklyPlanningModal, EvaluationPlanningModal, DocumentEditor } from '@/routes/admin/student';

const ChildInfoPanel = ({ childInfo }: { childInfo: Question[] }) => (
  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
    <h4 className="text-sm font-semibold text-blue-700 mb-3">Datos del estudiante</h4>
    <div className="grid grid-cols-2 gap-x-6 gap-y-1">
      {childInfo.filter((q) => !['Celular del Tutor', 'CI Tutor', 'CI Estudiante', 'Email del Tutor'].includes(q.question)).map((q) => (
        <div key={q.question} className="text-sm">
          <span className="text-gray-500">{q.question}: </span>
          <span className="font-medium text-gray-800">{q.answer ?? '—'}</span>
        </div>
      ))}
    </div>
  </div>
);

const EvaluationView = () => {
  const { dataCorrespondence, dataSent, dataAllSent, getCorrespondencees, getSentCorrespondences, getAllSentCorrespondences } = useCorrespondenceStore();
  const { hasPermission } = usePermissionStore();
  const { getStudentById, updateStudent } = useStudentStore();

  const [selectedEvaluation, setSelectedEvaluation] = useState<null | typeof evaluationCatalog[0]>(null);
  const [viewEvaluation, setViewEvaluation] = useState<DocumentTransmissionModel | null>(null);
  const [selectedContinuation, setSelectedContinuation] = useState<null | typeof evaluationCatalog[0]>(null);
  const { roleUser } = useAuthStore();

  const [sessionTracking, setSessionTracking] = useState<StudentModel | null>(null);
  const [weeklyPlanning, setWeeklyPlanning] = useState<StudentModel | null>(null);
  const [evaluationPlanning, setEvaluationPlanning] = useState<StudentModel | null>(null);
  const [reportStudent, setReportStudent] = useState<StudentModel | null>(null);

  const openTrackingModal = async (
    item: DocumentTransmissionModel,
    setter: (s: StudentModel) => void,
  ) => {
    const studentUserId = item.document.studentUserId;
    if (!studentUserId) return;
    try {
      const student = await getStudentById(studentUserId);
      setter(student);
    } catch {
      // no student linked yet
    }
  };

  // ✅ HOOK SIEMPRE ARRIBA
  useEffect(() => {
    getCorrespondencees();
    if (hasPermission(TypeAction.create, TypeSubject.correspondence)) {
      getSentCorrespondences();
    }
    if (hasPermission(TypeAction.read, TypeSubject.sentCorrespondenceAll)) {
      getAllSentCorrespondences();
    }
  }, []);

  // ✅ Filtrar solo las evaluaciones con permiso usando el hook dentro del componente
  const filteredEvaluations = evaluationCatalog.filter(ev =>
    hasPermission(ev.action, ev.subject)
  );

  // ✅ retorno condicional DESPUÉS de hooks
  if (selectedEvaluation) {
    return (
      <EvaluationForm
        evaluationInit={selectedEvaluation.schema}
        onBack={() => { setSelectedEvaluation(null); getSentCorrespondences(); }}
        title={selectedEvaluation.title}
        sendToRole={selectedEvaluation.sendToRole}
      />
    );
  }

  return (
    <>
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Evaluaciones</h2>
        {
          hasPermission(TypeAction.create, TypeSubject.evaluationInit) &&
          <Button
            onClick={() => setSelectedEvaluation(filteredEvaluations[0])}
          >Nueva Evaluación</Button>
        }
      </div>
      {hasPermission(TypeAction.read, TypeSubject.correspondence) && (
        <CorrespondenceTable
          dataCorrespondence={dataCorrespondence}
          onRefresh={getCorrespondencees}
          onView={(data) => setViewEvaluation(data)}
          onEvaluate={(item, catalogId) => {
            setViewEvaluation(item);
            const found = evaluationCatalog.find((e) => e.id === catalogId);
            if (found) setSelectedContinuation(found);
          }}
          onSessionTracking={(item) => openTrackingModal(item, setSessionTracking)}
          onWeeklyPlanning={(item) => openTrackingModal(item, setWeeklyPlanning)}
          onEvaluationPlanning={(item) => openTrackingModal(item, setEvaluationPlanning)}
          onReport={(item) => openTrackingModal(item, setReportStudent)}
        />
      )}

      {hasPermission(TypeAction.create, TypeSubject.correspondence) && dataSent.data.length > 0 && (() => {
        // Agrupar por estudiante (studentUserId como clave, fallback a nombre)
        const groups = dataSent.data.reduce<Record<string, { name: string; lastName: string; items: SentTransmissionModel[] }>>((acc, item) => {
          const name = item.document.childInfo?.find((q) => q.question === 'Nombre')?.answer ?? '—';
          const lastName = item.document.childInfo?.find((q) => q.question === 'Apellido')?.answer ?? '';
          const key = item.document.studentUserId ?? `${name}_${lastName}`;
          if (!acc[key]) acc[key] = { name, lastName, items: [] };
          acc[key].items.push(item);
          return acc;
        }, {});

        return (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">Historial de envíos</h3>
            <div className="flex flex-col gap-3">
              {Object.entries(groups).map(([key, group]) => (
                <div key={key} className="border border-gray-200 rounded-xl overflow-hidden">
                  {/* Header del estudiante */}
                  <div className="bg-blue-50 px-4 py-2 flex items-center gap-2">
                    <span className="text-sm font-semibold text-blue-700">
                      {group.name} {group.lastName}
                    </span>
                    <span className="text-xs text-blue-400">· {group.items.length} evaluación{group.items.length !== 1 ? 'es' : ''}</span>
                  </div>
                  {/* Flujo de evaluaciones (cronológico) */}
                  {[...group.items].reverse().map((item, idx) => (
                    <div key={item.id} className="flex items-center gap-3 px-4 py-2 border-t border-gray-100 bg-white text-sm">
                      {/* Indicador de paso */}
                      <div className="flex flex-col items-center shrink-0">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-semibold">
                          {idx + 1}
                        </span>
                      </div>
                      <div className="flex-1 flex justify-between items-start">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-gray-700">{item.document.type}</span>
                          <span className="text-gray-400 text-xs">
                            Para: {item.receiver.role?.name} — {item.receiver.name} {item.receiver.lastName}
                          </span>
                        </div>
                        <span className="text-gray-400 text-xs shrink-0 ml-4">
                          {new Date(item.createdAt).toLocaleString('es-PE', {
                            day: '2-digit', month: '2-digit', year: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {hasPermission(TypeAction.read, TypeSubject.sentCorrespondenceAll) && dataAllSent.data.length > 0 && (() => {
        const groups = dataAllSent.data.reduce<Record<string, { name: string; lastName: string; items: AdminSentTransmissionModel[] }>>((acc, item) => {
          const name = item.document.childInfo?.find((q) => q.question === 'Nombre')?.answer ?? '—';
          const lastName = item.document.childInfo?.find((q) => q.question === 'Apellido')?.answer ?? '';
          const key = item.document.studentUserId ?? `${name}_${lastName}`;
          if (!acc[key]) acc[key] = { name, lastName, items: [] };
          acc[key].items.push(item);
          return acc;
        }, {});

        return (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">Historial global de envíos</h3>
            <div className="flex flex-col gap-3">
              {Object.entries(groups).map(([key, group]) => (
                <div key={key} className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="bg-purple-50 px-4 py-2 flex items-center gap-2">
                    <span className="text-sm font-semibold text-purple-700">
                      {group.name} {group.lastName}
                    </span>
                    <span className="text-xs text-purple-400">· {group.items.length} evaluación{group.items.length !== 1 ? 'es' : ''}</span>
                  </div>
                  {[...group.items].reverse().map((item, idx) => (
                    <div key={item.id} className="flex items-center gap-3 px-4 py-2 border-t border-gray-100 bg-white text-sm">
                      <div className="flex flex-col items-center shrink-0">
                        <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 text-xs flex items-center justify-center font-semibold">
                          {idx + 1}
                        </span>
                      </div>
                      <div className="flex-1 flex justify-between items-start">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-gray-700">{item.document.type}</span>
                          <span className="text-gray-400 text-xs">
                            De: {item.sender.role?.name} — {item.sender.name} {item.sender.lastName}
                            {' · '}
                            Para: {item.receiver.role?.name} — {item.receiver.name} {item.receiver.lastName}
                          </span>
                        </div>
                        <span className="text-gray-400 text-xs shrink-0 ml-4">
                          {new Date(item.createdAt).toLocaleString('es-PE', {
                            day: '2-digit', month: '2-digit', year: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {viewEvaluation && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-2">
            {(viewEvaluation.document.data as any[])[0]?.type === 'html' ? (
              <div className="px-10 py-8" style={{ fontFamily: 'Arial, sans-serif', fontSize: '12pt', lineHeight: '1.5' }}>
                <div
                  dangerouslySetInnerHTML={{ __html: (viewEvaluation.document.data as any[])[0].content }}
                />
              </div>
            ) : (
              (() => {
                const docChildInfo = viewEvaluation.document.childInfo;

                // evaluator flow
                if (roleUser?.name === 'Evaluador') {
                  // Botón 👁 → solo ver la evaluación recibida (readonly)
                  if (!selectedContinuation) {
                    return (
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">Evaluación recibida</h3>
                        {docChildInfo && <ChildInfoPanel childInfo={docChildInfo} />}
                        <EvaluationForm
                          evaluationInit={viewEvaluation.document.data}
                          readOnly
                          onBack={() => setViewEvaluation(null)}
                          title={viewEvaluation.document.type}
                        />
                      </div>
                    );
                  }

                  // Botón de protocolo → solo ChildInfoPanel + formulario nuevo (sin ver la anterior)
                  return (
                    <div className="p-4">
                      {docChildInfo && <ChildInfoPanel childInfo={docChildInfo} />}
                      <h3 className="text-lg font-semibold mb-2">{selectedContinuation.title}</h3>
                      <EvaluationForm
                        evaluationInit={selectedContinuation.schema}
                        onBack={() => {
                          setSelectedContinuation(null);
                          setViewEvaluation(null);
                          getSentCorrespondences();
                        }}
                        title={selectedContinuation.title}
                        childInfo={docChildInfo}
                        sendToRole={selectedContinuation.sendToRole}
                        studentUserId={viewEvaluation.document.studentUserId}
                        sourceDocumentId={viewEvaluation.document.id}
                      />
                    </div>
                  );
                }

                // Profesor (u otro rol): muestra datos del niño + evaluación en readonly
                return (
                  <div className="p-4 space-y-4">
                    {docChildInfo && <ChildInfoPanel childInfo={docChildInfo} />}
                    <EvaluationForm
                      evaluationInit={viewEvaluation.document.data}
                      readOnly
                      onBack={() => setViewEvaluation(null)}
                      title={viewEvaluation.document.type}
                    />
                  </div>
                );
              })()
            )}
          </div>
        </div>
      )}
      {reportStudent && (
        <DocumentEditor
          student={reportStudent}
          onClose={() => setReportStudent(null)}
          onSessionTracking={setSessionTracking}
          onWeeklyPlanning={setWeeklyPlanning}
          onEvaluationPlanning={setEvaluationPlanning}
        />
      )}
      {sessionTracking && (
        <SessionTrackingModal
          onClose={() => setSessionTracking(null)}
          student={sessionTracking}
          onUpdate={updateStudent}
        />
      )}
      {weeklyPlanning && (
        <WeeklyPlanningModal
          onClose={() => setWeeklyPlanning(null)}
          student={weeklyPlanning}
          onUpdate={updateStudent}
        />
      )}
      {evaluationPlanning && (
        <EvaluationPlanningModal
          onClose={() => setEvaluationPlanning(null)}
          student={evaluationPlanning}
          onUpdate={updateStudent}
        />
      )}
    </>
  );
};

export default EvaluationView;