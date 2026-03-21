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
          <TableHead className="sticky right-0 z-10 bg-white">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {templates.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-gray-400 py-8">
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
                  ? <CheckCircle size={16} className="text-green-500" />
                  : <Circle size={16} className="text-gray-300 hover:text-gray-500" />}
              </button>
            </TableCell>
            <TableCell>
              <span className={`text-xs px-2 py-0.5 rounded-full ${t.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {t.active ? 'Activa' : 'Inactiva'}
              </span>
            </TableCell>
            <TableCell className="sticky right-0 z-10 bg-white">
              <div className="flex items-center gap-3 justify-center">
                <button onClick={() => onPreview(t.id)} title="Vista previa PDF" className="cursor-pointer">
                  <Eye size={18} className="text-purple-500" />
                </button>
                {hasPermission(TypeAction.update, TypeSubject.pdfTemplate) && (
                  <button onClick={() => onEdit(t)} title="Editar plantilla" className="cursor-pointer">
                    <Pencil size={18} className="text-blue-500" />
                  </button>
                )}
                {hasPermission(TypeAction.delete, TypeSubject.pdfTemplate) && (
                  <button onClick={() => onDelete(t.id)} title="Eliminar" className="cursor-pointer">
                    <Trash2 size={18} className="text-red-500" />
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
