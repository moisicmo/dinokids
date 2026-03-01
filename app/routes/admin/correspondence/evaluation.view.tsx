import { useEffect, useState } from 'react';
import { evaluationCatalog } from './evaluations/catalog';
import EvaluationForm from './evaluation.form';
import { useCorrespondenceStore, usePermissionStore, useAuthStore, useStudentStore } from '@/hooks';
import { CorrespondenceTable } from './correspondence.table';
import type { Question } from '.';
import { TypeAction, TypeSubject, type DocumentTransmissionModel, type StudentModel, type SentTransmissionModel } from '@/models';
import { Button } from '@/components';
import { SessionTrackingModal, WeeklyPlanningModal, EvaluationPlanningModal, DocumentEditor } from '@/routes/admin/student';

const ChildInfoPanel = ({ childInfo }: { childInfo: Question[] }) => (
  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
    <h4 className="text-sm font-semibold text-blue-700 mb-3">Datos del niño</h4>
    <div className="grid grid-cols-2 gap-x-6 gap-y-1">
      {childInfo.filter((q) => q.question !== 'Celular del Tutor').map((q) => (
        <div key={q.question} className="text-sm">
          <span className="text-gray-500">{q.question}: </span>
          <span className="font-medium text-gray-800">{q.answer ?? '—'}</span>
        </div>
      ))}
    </div>
  </div>
);

const EvaluationView = () => {
  const { dataCorrespondence, getCorrespondencees } = useCorrespondenceStore();
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
        onBack={() => setSelectedEvaluation(null)}
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
                        }}
                        title={selectedContinuation.title}
                        childInfo={docChildInfo}
                        sendToRole={selectedContinuation.sendToRole}
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