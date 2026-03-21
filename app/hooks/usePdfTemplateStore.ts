import { useState } from 'react';
import { coffeApi } from '@/services';
import { useAlertStore, useErrorStore, usePermissionStore } from '.';
import { TypeAction, TypeSubject } from '@/models';
import type { PdfTemplateModel } from '@/models';
import type { PdfTemplateRequest, UpdatePdfTemplateRequest } from '@/models';

export const usePdfTemplateStore = () => {
  const [templates, setTemplates] = useState<PdfTemplateModel[]>([]);
  const [loading, setLoading] = useState(false);
  const { handleError } = useErrorStore();
  const { requirePermission } = usePermissionStore();
  const { showSuccess, showWarning, showError } = useAlertStore();

  const getTemplates = async (type?: string) => {
    try {
      requirePermission(TypeAction.read, TypeSubject.pdfTemplate);
      setLoading(true);
      const params = type ? `?type=${encodeURIComponent(type)}` : '';
      const { data } = await coffeApi.get(`/pdf-template${params}`);
      setTemplates(data);
    } catch (error) {
      throw handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const getTemplateById = async (id: string): Promise<PdfTemplateModel> => {
    requirePermission(TypeAction.read, TypeSubject.pdfTemplate);
    const { data } = await coffeApi.get(`/pdf-template/${id}`);
    return data;
  };

  const createTemplate = async (body: PdfTemplateRequest): Promise<PdfTemplateModel> => {
    requirePermission(TypeAction.create, TypeSubject.pdfTemplate);
    const { data } = await coffeApi.post('/pdf-template', body);
    showSuccess('Plantilla creada correctamente');
    await getTemplates();
    return data;
  };

  const updateTemplate = async (id: string, body: UpdatePdfTemplateRequest): Promise<PdfTemplateModel> => {
    requirePermission(TypeAction.update, TypeSubject.pdfTemplate);
    const { data } = await coffeApi.patch(`/pdf-template/${id}`, body);
    showSuccess('Plantilla actualizada correctamente');
    await getTemplates();
    return data;
  };

  const deleteTemplate = async (id: string) => {
    try {
      requirePermission(TypeAction.delete, TypeSubject.pdfTemplate);
      const result = await showWarning();
      if (result.isConfirmed) {
        await coffeApi.delete(`/pdf-template/${id}`);
        await getTemplates();
        showSuccess('Plantilla eliminada correctamente');
      } else {
        showError('Cancelado', 'La plantilla está a salvo :)');
      }
    } catch (error) {
      throw handleError(error);
    }
  };

  const previewTemplate = async (id: string): Promise<string> => {
    requirePermission(TypeAction.read, TypeSubject.pdfTemplate);
    const { data } = await coffeApi.get(`/pdf-template/${id}/preview`);
    return data.pdfBase64 as string;
  };

  return {
    templates,
    loading,
    getTemplates,
    getTemplateById,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    previewTemplate,
  };
};
