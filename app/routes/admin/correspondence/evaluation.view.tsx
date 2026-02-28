import { useEffect, useState } from 'react';
import { evaluationCatalog } from './evaluations/catalog';
import EvaluationForm from './evaluation.form';
import { useCorrespondenceStore, usePermissionStore, useAuthStore } from '@/hooks';
import { CorrespondenceTable } from './correspondence.table';
import type { Evaluation } from '.';
import type { DocumentTransmissionModel } from '@/models';

const EvaluationView = () => {
  const { dataCorrespondence, getCorrespondencees } = useCorrespondenceStore();
  const { hasPermission } = usePermissionStore();

  const [selectedEvaluation, setSelectedEvaluation] = useState<null | typeof evaluationCatalog[0]>(null);
  const [viewEvaluation, setViewEvaluation] = useState<DocumentTransmissionModel | null>(null);
  const [selectedContinuation, setSelectedContinuation] = useState<null | typeof evaluationCatalog[0]>(null);
  const { roleUser } = useAuthStore();

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
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {filteredEvaluations.map((ev: any) => (
          <div
            key={ev.id}
            className="bg-white rounded-xl shadow p-5 flex flex-col justify-between hover:shadow-lg transition"
          >
            <div>
              <h3 className="text-lg font-semibold">{ev.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{ev.description}</p>
            </div>

            <button
              className="mt-4 bg-primary text-white py-2 rounded-lg hover:bg-primary-400 transition"
              onClick={() => setSelectedEvaluation(ev)}
            >
              Iniciar evaluación
            </button>
          </div>
        ))}
      </div>
      <CorrespondenceTable
        dataCorrespondence={dataCorrespondence}
        onRefresh={getCorrespondencees}
        onView={(data) => setViewEvaluation(data)}
      />

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
                // evaluator flow: show initial and then allow continuation
                if (roleUser?.name === 'Evaluador') {
                  if (!selectedContinuation) {
                    const allowed = filteredEvaluations.filter(ev => ev.id !== 'init');
                    return (
                      <div className="space-y-8 p-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Evaluación recibida</h3>
                          <EvaluationForm
                            evaluationInit={viewEvaluation.document.data}
                            readOnly
                            onBack={() => {
                              setViewEvaluation(null);
                            }}
                            title={viewEvaluation.document.type}
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-4">
                            Continúe con otra evaluación
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {allowed.map((ev) => (
                              <div
                                key={ev.id}
                                className="bg-white rounded-xl shadow p-5 flex flex-col justify-between hover:shadow-lg transition"
                              >
                                <div>
                                  <h4 className="text-base font-semibold">{ev.title}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{ev.description}</p>
                                </div>
                                <button
                                  className="mt-4 bg-primary text-white py-2 rounded-lg hover:bg-primary-400 transition"
                                  onClick={() => setSelectedContinuation(ev)}
                                >
                                  Seleccionar
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Evaluación recibida</h3>
                        <EvaluationForm
                          evaluationInit={viewEvaluation.document.data}
                          readOnly
                          onBack={() => {
                            setViewEvaluation(null);
                          }}
                          title={viewEvaluation.document.type}
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          {`Responder: ${selectedContinuation.title}`}
                        </h3>
                        <EvaluationForm
                          evaluationInit={selectedContinuation.schema}
                          onBack={() => setSelectedContinuation(null)}
                          title={selectedContinuation.title}
                        />
                      </div>
                    </div>
                  );
                }

                return (
                  <EvaluationForm
                    evaluationInit={viewEvaluation.document.data}
                    readOnly
                    onBack={() => setViewEvaluation(null)}
                    title={viewEvaluation.document.type}
                  />
                );
              })()
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default EvaluationView;