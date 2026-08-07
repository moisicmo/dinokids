import { TypeAction, TypeSubject, type PdfTemplateModel } from '@/models';
import { usePermissionStore } from '@/hooks';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, Circle, Eye, Pencil, Trash2 } from 'lucide-react';

interface Props {
  templates: PdfTemplateModel[];
  onEdit: (template: PdfTemplateModel) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
  onPreview: (id: string) => void;
}

const TYPE_LABELS: Record<string, string> = {
  inscription: 'Contrato de inscripción',
  invoice: 'Recibo/Factura',
};

export const PdfTemplateTable = ({ templates, onEdit, onDelete, onSetDefault, onPreview }: Props) => {
  const { hasPermission } = usePermissionStore();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Por defecto</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="sticky right-0 z-10 bg-card">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {templates.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
              No hay plantillas. Crea la primera plantilla para empezar.
            </TableCell>
          </TableRow>
        )}
        {templates.map(t => (
          <TableRow key={t.id}>
            <TableCell className="font-medium">{t.name}</TableCell>
            <TableCell>{TYPE_LABELS[t.type] ?? t.type}</TableCell>
            <TableCell>
              <button
                onClick={() => onSetDefault(t.id)}
                className="flex items-center gap-1 text-sm"
                title={t.isDefault ? 'Plantilla por defecto' : 'Establecer como predeterminada'}
                disabled={!hasPermission(TypeAction.update, TypeSubject.pdfTemplate)}
              >
                {t.isDefault
                  ? <CheckCircle size={16} className="text-secondary-500" />
                  : <Circle size={16} className="text-muted-foreground hover:text-muted-foreground" />}
              </button>
            </TableCell>
            <TableCell>
              <span className={`text-xs px-2 py-0.5 rounded-full ${t.active ? 'bg-secondary-100 text-secondary-700' : 'bg-error-100 text-error-700'}`}>
                {t.active ? 'Activa' : 'Inactiva'}
              </span>
            </TableCell>
            <TableCell className="sticky right-0 z-10 bg-card">
              <div className="flex items-center gap-3 justify-center">
                <button onClick={() => onPreview(t.id)} title="Vista previa PDF" className="cursor-pointer">
                  <Eye size={18} className="text-purple-500" />
                </button>
                {hasPermission(TypeAction.update, TypeSubject.pdfTemplate) && (
                  <button onClick={() => onEdit(t)} title="Editar plantilla" className="cursor-pointer">
                    <Pencil size={18} className="text-info-500" />
                  </button>
                )}
                {hasPermission(TypeAction.delete, TypeSubject.pdfTemplate) && (
                  <button onClick={() => onDelete(t.id)} title="Eliminar" className="cursor-pointer">
                    <Trash2 size={18} className="text-error-500" />
                  </button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
