import { useCallback, useEffect, useState } from 'react';
import { TypeAction, TypeSubject, type PdfTemplateModel } from '@/models';
import { Button } from '@/components';
import { usePermissionStore, usePdfTemplateStore, usePrintStore } from '@/hooks';
import { PdfTemplateTable } from './pdf-template.table';
import { PdfTemplateEditor } from './pdf-template.editor';
import { PdfTemplateCreate } from './pdf-template.create';

const PdfTemplateView = () => {
  const { templates, loading, getTemplates, deleteTemplate, updateTemplate, previewTemplate } = usePdfTemplateStore();
  const { hasPermission } = usePermissionStore();
  const { handlePdf } = usePrintStore();

  const [editingTemplate, setEditingTemplate] = useState<PdfTemplateModel | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    getTemplates();
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    await deleteTemplate(id);
  }, [deleteTemplate]);

  const handleSetDefault = useCallback(async (id: string) => {
    const template = templates.find(t => t.id === id);
    if (!template) return;
    await updateTemplate(id, { isDefault: true, type: template.type });
    await getTemplates();
  }, [templates, updateTemplate, getTemplates]);

  const handlePreview = useCallback(async (id: string) => {
    const pdfBase64 = await previewTemplate(id);
    handlePdf(pdfBase64);
  }, [previewTemplate, handlePdf]);

  if (editingTemplate) {
    return (
      <PdfTemplateEditor
        template={editingTemplate}
        onClose={() => setEditingTemplate(null)}
        onSaved={async (saved) => {
          setEditingTemplate(saved);
          await getTemplates();
        }}
      />
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Plantillas PDF</h2>
        {hasPermission(TypeAction.create, TypeSubject.pdfTemplate) && (
          <Button onClick={() => setShowCreate(true)}>
            Nueva plantilla
          </Button>
        )}
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Crea y edita las plantillas para los documentos PDF que se generan automáticamente
        (contratos de inscripción, recibos, etc.). Marca una plantilla como <strong>predeterminada</strong> para
        que se use en la generación automática.
      </p>

      {loading ? (
        <div className="flex justify-center py-12 text-gray-400">Cargando plantillas...</div>
      ) : (
        <PdfTemplateTable
          templates={templates}
          onEdit={setEditingTemplate}
          onDelete={handleDelete}
          onSetDefault={handleSetDefault}
          onPreview={handlePreview}
        />
      )}

      {showCreate && (
        <PdfTemplateCreate
          onClose={() => setShowCreate(false)}
          onCreated={async (t) => {
            setShowCreate(false);
            await getTemplates();
            setEditingTemplate(t);
          }}
        />
      )}
    </>
  );
};

export default PdfTemplateView;
