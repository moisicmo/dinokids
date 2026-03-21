import { useState } from 'react';
import { Button } from '@/components';
import { usePdfTemplateStore } from '@/hooks';
import type { PdfTemplateModel } from '@/models';

const INSCRIPTION_DEFAULT_HTML = `<div style="font-family:Arial,sans-serif;">
<h2 style="text-align:center;">CONTRATO PRIVADO DE PRESTACIÓN DE SERVICIOS EDUCATIVOS DEL PROGRAMA DINO CONDUCTUAL DE DINO KIDS</h2>

<p><strong>PRIMERA: PARTES CONTRATANTES.-</strong> El presente contrato se celebra entre <strong>DINO KIDS</strong>, centro psicopedagógico legalmente constituido en Bolivia, ubicado en <strong>Calle Batallón Colorados, Edificio Batallón Colorados, Planta Baja Oficina 4</strong>, en adelante <strong>"EL CENTRO"</strong>, y el padre/madre/tutor del niño(a) identificado en la cláusula tercera, en adelante <strong>"EL REPRESENTANTE"</strong>, quien suscribe el presente contrato en su calidad de responsable legal del menor.</p>

<p><strong>SEGUNDA: OBJETO DEL CONTRATO.-</strong> Mediante el presente, <strong>EL CENTRO</strong> se obliga a prestar servicios especializados dentro del programa <strong>DINO CONDUCTUAL</strong>, un programa anual integral diseñado para niños y adolescentes con trastornos del neurodesarrollo.</p>

<p><strong>TERCERA: IDENTIFICACIÓN DEL BENEFICIARIO</strong></p>
<table style="width:100%;border-collapse:collapse;" border="1">
  <tr>
    <td style="padding:6px;background:#f5f5f5;width:40%;"><strong>Nombre del niño(a)</strong></td>
    <td style="padding:6px;">{{nombre_completo_estudiante}}</td>
  </tr>
  <tr>
    <td style="padding:6px;background:#f5f5f5;"><strong>Fecha de nacimiento</strong></td>
    <td style="padding:6px;">{{fecha_nacimiento}}</td>
  </tr>
  <tr>
    <td style="padding:6px;background:#f5f5f5;"><strong>Nombre del padre/madre/tutor</strong></td>
    <td style="padding:6px;">{{nombre_tutor}}</td>
  </tr>
  <tr>
    <td style="padding:6px;background:#f5f5f5;"><strong>Cédula de identidad</strong></td>
    <td style="padding:6px;">{{ci_estudiante}}</td>
  </tr>
  <tr>
    <td style="padding:6px;background:#f5f5f5;"><strong>Domicilio</strong></td>
    <td style="padding:6px;">{{direccion_tutor}}</td>
  </tr>
  <tr>
    <td style="padding:6px;background:#f5f5f5;"><strong>Teléfono de contacto</strong></td>
    <td style="padding:6px;">{{telefono_tutor}}</td>
  </tr>
</table>

<p><strong>CUARTA: DURACIÓN DEL CONTRATO.-</strong> El presente contrato tiene la vigencia de <strong>un (1) año</strong> renovable automáticamente previo cumplimiento de las condiciones establecidas en este documento.</p>

<p><strong>OCTAVA: CONDICIONES DE PAGO</strong></p>
<ol>
  <li>El costo del programa se cancela <strong>por adelantado.</strong></li>
  <li>Se concede una prórroga máxima de cinco (5) días hábiles para pagos.</li>
  <li>No se realizan devoluciones, ya que EL CENTRO informa previamente a los padres sobre el funcionamiento del programa antes de adquirir el servicio.</li>
</ol>

<p><strong>DÉCIMA SEGUNDA: ACEPTACIÓN.-</strong> Las partes declaran haber leído, comprendido y aceptado en su totalidad las condiciones establecidas en el presente contrato. EL REPRESENTANTE suscribe este documento con pleno conocimiento del contenido y alcance de cada una de sus cláusulas, en {{fecha_contrato}}.</p>

<br/><br/>
<table style="width:100%;border-collapse:collapse;">
  <tr>
    <td style="padding:8px;width:50%;text-align:center;">
      <p>________________________</p>
      <p><strong>EL CENTRO</strong></p>
      <p>DINO KIDS</p>
    </td>
    <td style="padding:8px;width:50%;text-align:center;">
      <p>________________________</p>
      <p><strong>EL REPRESENTANTE</strong></p>
      <p>{{nombre_tutor}}</p>
      <p>CI: {{ci_tutor}}</p>
    </td>
  </tr>
</table>
</div>`;

const TEMPLATE_TYPES = [
  { value: 'inscription', label: 'Contrato de inscripción' },
  { value: 'invoice', label: 'Recibo/Factura' },
  { value: 'other', label: 'Otro' },
];

interface Props {
  onClose: () => void;
  onCreated: (template: PdfTemplateModel) => void;
}

export const PdfTemplateCreate = ({ onClose, onCreated }: Props) => {
  const { createTemplate } = usePdfTemplateStore();
  const [name, setName] = useState('');
  const [type, setType] = useState('inscription');
  const [isDefault, setIsDefault] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const initialHtml = type === 'inscription' ? INSCRIPTION_DEFAULT_HTML : '<p>Escriba el contenido de la plantilla aquí...</p>';
      const created = await createTemplate({ name: name.trim(), type, htmlContent: initialHtml, isDefault });
      onCreated(created);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-4">Nueva plantilla PDF</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ej: Contrato estándar 2026"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de documento</label>
            <select
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={type}
              onChange={e => setType(e.target.value)}
            >
              {TEMPLATE_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={isDefault}
              onChange={e => setIsDefault(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="isDefault" className="text-sm text-gray-700">
              Establecer como plantilla predeterminada
            </label>
          </div>
          <p className="text-xs text-gray-400">
            {type === 'inscription'
              ? 'Se cargará el contrato de inscripción actual como punto de partida.'
              : 'Se iniciará con una plantilla en blanco.'}
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={saving || !name.trim()}>
              {saving ? 'Creando...' : 'Crear y editar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
