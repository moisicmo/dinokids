export interface PdfTemplateRequest {
  name: string;
  type: string;
  htmlContent: string;
  isDefault?: boolean;
}

export interface UpdatePdfTemplateRequest extends Partial<PdfTemplateRequest> {
  active?: boolean;
}
