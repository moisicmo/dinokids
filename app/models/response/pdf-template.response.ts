export interface PdfTemplateModel {
  id: string;
  name: string;
  type: string;
  htmlContent: string;
  isDefault: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string | null;
}
