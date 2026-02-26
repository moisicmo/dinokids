import { useEffect, useState } from 'react';
import { evaluationCatalog } from './evaluations/catalog';
import EvaluationForm from './evaluation.form';
import { useCorrespondenceStore, usePermissionStore } from '@/hooks';
import { CorrespondenceTable } from './correspondence.table';
import type { Evaluation } from '.';
import type { DocumentTransmissionModel } from '@/models';

const EvaluationView = () => {
  const { dataCorrespondence, getCorrespondencees } = useCorrespondenceStore();
  const { hasPermission } = usePermissionStore();

  const [selectedEvaluation, setSelectedEvaluation] = useState<null | typeof evaluationCatalog[0]>(null);
  const [viewEvaluation, setViewEvaluation] = useState<DocumentTransmissionModel | null>(null);

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
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b">
                  <h2 className="text-lg font-semibold text-gray-800">{viewEvaluation.document.type}</h2>
                  <button
                    onClick={() => setViewEvaluation(null)}
                    className="text-sm text-gray-500 hover:text-gray-800 px-3 py-1.5 rounded hover:bg-gray-100"
                  >
                    ← Volver
                  </button>
                </div>
                <div
                  className="px-10 py-8"
                  style={{ fontFamily: 'Arial, sans-serif', fontSize: '12pt', lineHeight: '1.5' }}
                  dangerouslySetInnerHTML={{ __html: (viewEvaluation.document.data as any[])[0].content }}
                />
              </div>
            ) : (
              <EvaluationForm
                evaluationInit={viewEvaluation.document.data}
                readOnly
                onBack={() => setViewEvaluation(null)}
                title={viewEvaluation.document.type}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default EvaluationView;