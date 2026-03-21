import { useRef, useState, useEffect, useCallback } from 'react';
import {
  Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered,
  Link2,
  Table2,
  Undo2, Redo2,
  ZoomIn, ZoomOut,
  Save, Eye,
  X, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components';
import { usePdfTemplateStore, usePrintStore } from '@/hooks';
import type { PdfTemplateModel } from '@/models';

// ─── Available template variables ────────────────────────────────────────────

const TEMPLATE_VARIABLES = [
  { label: 'Nombre estudiante', key: 'nombre_estudiante' },
  { label: 'Apellido estudiante', key: 'apellido_estudiante' },
  { label: 'Nombre completo estudiante', key: 'nombre_completo_estudiante' },
  { label: 'CI estudiante', key: 'ci_estudiante' },
  { label: 'Fecha de nacimiento', key: 'fecha_nacimiento' },
  { label: 'Nombre tutor', key: 'nombre_tutor' },
  { label: 'Apellido tutor', key: 'apellido_tutor' },
  { label: 'CI tutor', key: 'ci_tutor' },
  { label: 'Teléfono tutor', key: 'telefono_tutor' },
  { label: 'Dirección tutor', key: 'direccion_tutor' },
  { label: 'Fecha del contrato', key: 'fecha_contrato' },
  { label: 'Nombre sucursal', key: 'sucursal_nombre' },
];

interface Props {
  template: PdfTemplateModel;
  onClose: () => void;
  onSaved?: (t: PdfTemplateModel) => void;
}

export const PdfTemplateEditor = ({ template, onClose, onSaved }: Props) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(100);
  const [showVars, setShowVars] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [activeFormats, setActiveFormats] = useState({
    bold: false, italic: false, underline: false, strikeThrough: false,
  });

  const { updateTemplate, previewTemplate } = usePdfTemplateStore();
  const { handlePdf } = usePrintStore();

  // Load content into editor
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = template.htmlContent;
    }
  }, [template.id]);

  // Track active formats on selection change
  useEffect(() => {
    const update = () => {
      setActiveFormats({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strikeThrough: document.queryCommandState('strikeThrough'),
      });
    };
    document.addEventListener('selectionchange', update);
    return () => document.removeEventListener('selectionchange', update);
  }, []);

  const cmd = (command: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, undefined);
  };

  const cmdArg = (command: string, value: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
  };

  /** Insert a {{variable}} placeholder at cursor position */
  const insertVariable = useCallback((key: string) => {
    editorRef.current?.focus();
    document.execCommand('insertText', false, `{{${key}}}`);
  }, []);

  const handleInsertTable = () => {
    const rowsStr = prompt('Número de filas:', '2');
    const colsStr = prompt('Número de columnas:', '2');
    const rows = parseInt(rowsStr ?? '2', 10);
    const cols = parseInt(colsStr ?? '2', 10);
    if (rows > 0 && cols > 0) {
      const cell = `<td style="padding:6px;border:1px solid #ccc;">&nbsp;</td>`;
      const row = `<tr>${cell.repeat(cols)}</tr>`;
      const table = `<table style="width:100%;border-collapse:collapse;" border="1">${row.repeat(rows)}</table><p></p>`;
      editorRef.current?.focus();
      document.execCommand('insertHTML', false, table);
    }
  };

  const handleInsertLink = () => {
    const url = prompt('URL del enlace:');
    if (!url) return;
    try { new URL(url); cmdArg('createLink', url); }
    catch { alert('URL inválida.'); }
  };

  const handleSave = async () => {
    if (!editorRef.current) return;
    setSaving(true);
    try {
      const saved = await updateTemplate(template.id, { htmlContent: editorRef.current.innerHTML });
      onSaved?.(saved);
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = async () => {
    setPreviewing(true);
    try {
      const pdfBase64 = await previewTemplate(template.id);
      // Save first, then preview
      if (editorRef.current) {
        await updateTemplate(template.id, { htmlContent: editorRef.current.innerHTML });
      }
      handlePdf(pdfBase64);
    } finally {
      setPreviewing(false);
    }
  };

  const btnBase = 'p-1.5 rounded hover:bg-gray-200 transition-colors';
  const btnActive = 'bg-gray-300';

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-100">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between bg-white border-b px-4 py-2 shadow-sm gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={onClose} className={btnBase} title="Cerrar">
            <X size={16} />
          </button>
          <span className="font-semibold text-sm text-gray-700 truncate">{template.name}</span>
          <span className="text-xs text-gray-400 hidden md:block">— Tipo: {template.type}</span>
        </div>

        <div className="flex items-center gap-1 flex-wrap">
          {/* Format */}
          <button className={`${btnBase} ${activeFormats.bold ? btnActive : ''}`} onMouseDown={e => { e.preventDefault(); cmd('bold'); }} title="Negrita"><Bold size={15} /></button>
          <button className={`${btnBase} ${activeFormats.italic ? btnActive : ''}`} onMouseDown={e => { e.preventDefault(); cmd('italic'); }} title="Cursiva"><Italic size={15} /></button>
          <button className={`${btnBase} ${activeFormats.underline ? btnActive : ''}`} onMouseDown={e => { e.preventDefault(); cmd('underline'); }} title="Subrayado"><Underline size={15} /></button>
          <button className={`${btnBase} ${activeFormats.strikeThrough ? btnActive : ''}`} onMouseDown={e => { e.preventDefault(); cmd('strikeThrough'); }} title="Tachado"><Strikethrough size={15} /></button>

          <div className="w-px h-5 bg-gray-300 mx-1" />

          {/* Alignment */}
          <button className={btnBase} onMouseDown={e => { e.preventDefault(); cmd('justifyLeft'); }} title="Izquierda"><AlignLeft size={15} /></button>
          <button className={btnBase} onMouseDown={e => { e.preventDefault(); cmd('justifyCenter'); }} title="Centro"><AlignCenter size={15} /></button>
          <button className={btnBase} onMouseDown={e => { e.preventDefault(); cmd('justifyRight'); }} title="Derecha"><AlignRight size={15} /></button>
          <button className={btnBase} onMouseDown={e => { e.preventDefault(); cmd('justifyFull'); }} title="Justificado"><AlignJustify size={15} /></button>

          <div className="w-px h-5 bg-gray-300 mx-1" />

          {/* Lists */}
          <button className={btnBase} onMouseDown={e => { e.preventDefault(); cmd('insertUnorderedList'); }} title="Lista"><List size={15} /></button>
          <button className={btnBase} onMouseDown={e => { e.preventDefault(); cmd('insertOrderedList'); }} title="Lista numerada"><ListOrdered size={15} /></button>

          <div className="w-px h-5 bg-gray-300 mx-1" />

          {/* Insert */}
          <button className={btnBase} onMouseDown={e => { e.preventDefault(); handleInsertTable(); }} title="Tabla"><Table2 size={15} /></button>
          <button className={btnBase} onMouseDown={e => { e.preventDefault(); handleInsertLink(); }} title="Enlace"><Link2 size={15} /></button>

          <div className="w-px h-5 bg-gray-300 mx-1" />

          {/* History */}
          <button className={btnBase} onMouseDown={e => { e.preventDefault(); cmd('undo'); }} title="Deshacer"><Undo2 size={15} /></button>
          <button className={btnBase} onMouseDown={e => { e.preventDefault(); cmd('redo'); }} title="Rehacer"><Redo2 size={15} /></button>

          <div className="w-px h-5 bg-gray-300 mx-1" />

          {/* Zoom */}
          <button className={btnBase} onClick={() => setZoom(z => Math.max(50, z - 10))} title="Alejar"><ZoomOut size={15} /></button>
          <span className="text-xs w-10 text-center">{zoom}%</span>
          <button className={btnBase} onClick={() => setZoom(z => Math.min(200, z + 10))} title="Acercar"><ZoomIn size={15} /></button>

          <div className="w-px h-5 bg-gray-300 mx-1" />

          {/* Variables panel toggle */}
          <button
            className={`${btnBase} flex items-center gap-1 text-xs px-2`}
            onClick={() => setShowVars(v => !v)}
            title="Variables"
          >
            {showVars ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            Variables
          </button>

          {/* Preview */}
          <button
            className={`${btnBase} flex items-center gap-1 text-xs px-2 text-blue-600`}
            onClick={handlePreview}
            disabled={previewing}
            title="Vista previa PDF"
          >
            <Eye size={15} />
            {previewing ? 'Generando...' : 'Vista previa'}
          </button>

          {/* Save */}
          <Button onClick={handleSave} disabled={saving} className="text-sm py-1 px-3 h-8">
            <Save size={14} className="mr-1" />
            {saving ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor area */}
        <div className="flex-1 overflow-auto bg-gray-200 flex justify-center py-6 px-4">
          <div
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
              width: '816px',        // Letter width in px at 96dpi
              minHeight: '1056px',   // Letter height
              background: 'white',
              boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
              padding: '72px',
              boxSizing: 'border-box',
              fontFamily: 'Arial, sans-serif',
              fontSize: '12pt',
              lineHeight: '1.5',
            }}
          >
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              style={{ outline: 'none', minHeight: '100%' }}
              spellCheck={false}
            />
          </div>
        </div>

        {/* Variables panel */}
        {showVars && (
          <div className="w-56 bg-white border-l overflow-y-auto flex-shrink-0">
            <div className="px-3 py-3 border-b">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Variables disponibles</p>
              <p className="text-xs text-gray-400 mt-1">Haz clic para insertar en el cursor</p>
            </div>
            <div className="p-2 space-y-1">
              {TEMPLATE_VARIABLES.map(v => (
                <button
                  key={v.key}
                  onClick={() => insertVariable(v.key)}
                  className="w-full text-left px-2 py-1.5 text-xs rounded hover:bg-blue-50 hover:text-blue-700 border border-transparent hover:border-blue-200 transition-colors"
                  title={`Insertar {{${v.key}}}`}
                >
                  <span className="font-medium">{v.label}</span>
                  <span className="block text-gray-400 font-mono text-[10px]">{`{{${v.key}}}`}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
