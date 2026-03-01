import { useRef, useState, useEffect, useCallback } from 'react';
import {
  Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered,
  Link2, Image,
  Table2,
  Undo2, Redo2,
  Eraser,
  ZoomIn, ZoomOut,
  Printer, Save,
  X,
  Scissors, Copy,
  FileText,
  Activity, CalendarRange, ClipboardCheck,
  ChevronLeft, ChevronRight,
  Send,
  Cloud,
  CloudOff,
} from 'lucide-react';
import { io, type Socket } from 'socket.io-client';
import { useCorrespondenceStore, useStaffStore } from '@/hooks';
import { Button, SelectCustom } from '@/components';
import type { StudentModel } from '@/models';

interface DocumentEditorProps {
  student: StudentModel;
  onClose: () => void;
  onSessionTracking?: (student: StudentModel) => void;
  onWeeklyPlanning?: (student: StudentModel) => void;
  onEvaluationPlanning?: (student: StudentModel) => void;
}

const BACKEND_URL = import.meta.env.VITE_HOST_BACKEND ?? 'http://127.0.0.1:3000';

const generateTemplate = (student: StudentModel): string => {
  const date = new Date().toLocaleDateString('es-PE', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const name = `${student.user.name} ${student.user.lastName}`;
  return `<div style="font-family:Arial,sans-serif;">
  <h2 style="text-align:center;margin-bottom:4px;">INFORME DE ESTUDIANTE</h2>
  <p style="text-align:center;color:#555;margin-top:0;">${date}</p>
  <hr style="margin:16px 0;"/>
  <h3>Datos del Estudiante</h3>
  <table style="width:100%;border-collapse:collapse;" border="1">
    <tr>
      <td style="padding:6px;background:#f5f5f5;width:40%;"><strong>Nombre completo</strong></td>
      <td style="padding:6px;">${name}</td>
    </tr>
    <tr>
      <td style="padding:6px;background:#f5f5f5;"><strong>Código</strong></td>
      <td style="padding:6px;">${student.code}</td>
    </tr>
    <tr>
      <td style="padding:6px;background:#f5f5f5;"><strong>N° Documento</strong></td>
      <td style="padding:6px;">${student.user.numberDocument}</td>
    </tr>
    <tr>
      <td style="padding:6px;background:#f5f5f5;"><strong>Correo</strong></td>
      <td style="padding:6px;">${student.user.email}</td>
    </tr>
    <tr>
      <td style="padding:6px;background:#f5f5f5;"><strong>Colegio</strong></td>
      <td style="padding:6px;">${student.school?.name ?? '—'}</td>
    </tr>
    <tr>
      <td style="padding:6px;background:#f5f5f5;"><strong>Grado</strong></td>
      <td style="padding:6px;">${student.grade}° ${student.educationLevel}</td>
    </tr>
  </table>
  <br/>
  <h3>Informe</h3>
  <p>Escriba el contenido del informe aquí...</p>
</div>`;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const MenuDropdown = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <li className="relative group">
    <button className="px-3 py-1.5 text-sm hover:bg-gray-200 rounded-sm select-none">
      {label}
    </button>
    <ul className="absolute hidden group-hover:block bg-white border border-gray-200 shadow-lg z-50 min-w-[200px] py-1 left-0 top-full">
      {children}
    </ul>
  </li>
);

const MenuItem = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) => (
  <li>
    <button
      className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-gray-100 text-left"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
    >
      {icon}
      <span>{label}</span>
    </button>
  </li>
);

// ─── Main component ───────────────────────────────────────────────────────────

export const DocumentEditor = ({
  student,
  onClose,
  onSessionTracking,
  onWeeklyPlanning,
  onEvaluationPlanning,
}: DocumentEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [zoom, setZoom] = useState(100);
  const [showSidebar, setShowSidebar] = useState(false);
  const [docTitle, setDocTitle] = useState(
    `Informe - ${student.user.name} ${student.user.lastName}`
  );
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'offline'>('idle');
  const [showPageSettings, setShowPageSettings] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendReceiver, setSendReceiver] = useState<{ id: string; name: string } | null>(null);

  const { createCorrespondence } = useCorrespondenceStore();
  const { dataStaff, getStaffs } = useStaffStore();
  const [pageSize, setPageSize] = useState<'A4' | 'Carta' | 'Legal'>('A4');
  const [pageOrientation, setPageOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [margins, setMargins] = useState({ top: 2, bottom: 2, left: 2, right: 2 });

  // ── Socket.io setup ────────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('token');
    const socket = io(`${BACKEND_URL}/documents`, {
      auth: { token },
      transports: ['websocket'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('doc:join', { studentId: student.userId });
    });

    socket.on('doc:loaded', ({ content }: { content: string | null }) => {
      if (editorRef.current) {
        editorRef.current.innerHTML = content ?? generateTemplate(student);
      }
    });

    socket.on('doc:saved', () => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2500);
    });

    // Sync content from another tab/device
    socket.on('doc:synced', ({ content }: { content: string }) => {
      if (editorRef.current && document.activeElement !== editorRef.current) {
        editorRef.current.innerHTML = content;
      }
    });

    socket.on('doc:cleared', () => {
      if (editorRef.current) {
        editorRef.current.innerHTML = generateTemplate(student);
      }
      setSaveStatus('idle');
    });

    socket.on('connect_error', () => setSaveStatus('offline'));
    socket.on('disconnect', () => setSaveStatus('offline'));

    return () => {
      socket.disconnect();
    };
  }, [student.userId]);

  // ── Debounced auto-save on every input ────────────────────────────────────
  const handleInput = useCallback(() => {
    if (!socketRef.current?.connected || !editorRef.current) return;
    setSaveStatus('saving');
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      socketRef.current?.emit('doc:update', {
        studentId: student.userId,
        content: editorRef.current!.innerHTML,
      });
    }, 1500);
  }, [student.userId]);

  // Track active format states on selection change
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

  const handleSave = () => {
    if (!socketRef.current?.connected || !editorRef.current) return;
    socketRef.current.emit('doc:update', {
      studentId: student.userId,
      content: editorRef.current.innerHTML,
    });
  };

  const handlePrint = () => {
    if (!editorRef.current) return;
    const printWin = window.open('', '_blank');
    if (!printWin) return;
    printWin.document.write(
      `<html><head><title>${docTitle}</title><style>
        body{padding:2cm;font-family:Arial;font-size:12pt;line-height:1.5;}
        table{border-collapse:collapse;width:100%;}
        td,th{border:1px solid #ccc;padding:6px;}
      </style></head><body>${editorRef.current.innerHTML}</body></html>`
    );
    printWin.document.close();
    printWin.print();
    printWin.close();
  };

  const handleInsertImage = () => {
    const url = prompt('URL de la imagen:');
    if (!url) return;
    try { new URL(url); cmdArg('insertImage', url); }
    catch { alert('URL inválida.'); }
  };

  const handleInsertLink = () => {
    const url = prompt('URL del enlace:');
    if (!url) return;
    try { new URL(url); cmdArg('createLink', url); }
    catch { alert('URL inválida.'); }
  };

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

  useEffect(() => {
    if (showSendModal) getStaffs();
  }, [showSendModal]);

  const handleSend = async () => {
    if (!sendReceiver || !editorRef.current) return;
    await createCorrespondence({
      type: docTitle,
      data: [{ type: 'html', content: editorRef.current.innerHTML }] as any,
      receiverId: sendReceiver.id,
    });
    // Clear draft on server and reset editor
    socketRef.current?.emit('doc:clear', { studentId: student.userId });
    setShowSendModal(false);
    setSendReceiver(null);
  };

  const applyPageSettings = () => {
    if (!editorRef.current) return;
    const sizes = {
      A4: { w: 21.0, h: 29.7 },
      Carta: { w: 21.59, h: 27.94 },
      Legal: { w: 21.59, h: 35.56 },
    };
    const { w, h } = sizes[pageSize];
    const width = pageOrientation === 'portrait' ? w : h;
    const height = pageOrientation === 'portrait' ? h : w;
    editorRef.current.style.width = `${width}cm`;
    editorRef.current.style.minHeight = `${height}cm`;
    editorRef.current.style.paddingTop = `${margins.top}cm`;
    editorRef.current.style.paddingBottom = `${margins.bottom}cm`;
    editorRef.current.style.paddingLeft = `${margins.left}cm`;
    editorRef.current.style.paddingRight = `${margins.right}cm`;
    setShowPageSettings(false);
  };

  const tbtn = (active = false) =>
    `p-1.5 rounded transition-colors cursor-pointer ${
      active
        ? 'bg-blue-100 text-blue-700'
        : 'hover:bg-gray-100 text-gray-700'
    }`;

  const initials = `${student.user.name?.[0] ?? ''}${student.user.lastName?.[0] ?? ''}`.toUpperCase();

  const SaveIndicator = () => {
    if (saveStatus === 'saving') return <span className="text-xs text-gray-400 flex items-center gap-1"><Cloud className="w-3.5 h-3.5 animate-pulse" /> Guardando...</span>;
    if (saveStatus === 'saved') return <span className="text-xs text-green-600 flex items-center gap-1"><Cloud className="w-3.5 h-3.5" /> Guardado</span>;
    if (saveStatus === 'offline') return <span className="text-xs text-red-500 flex items-center gap-1"><CloudOff className="w-3.5 h-3.5" /> Sin conexión</span>;
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">

      {/* ── Title bar ── */}
      <div className="bg-white border-b border-gray-300 px-4 py-2 flex items-center gap-3 shadow-sm">
        <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
        <input
          className="flex-1 text-sm font-medium border-none outline-none focus:bg-gray-50 rounded px-1 py-0.5"
          value={docTitle}
          onChange={(e) => setDocTitle(e.target.value)}
          placeholder="Título del documento"
        />
        <SaveIndicator />
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-800"
          title="Cerrar editor"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* ── Menu bar ── */}
      <nav className="bg-[#f1f3f4] border-b border-gray-300">
        <ul className="flex text-sm px-2">

          <MenuDropdown label="Archivo">
            <MenuItem icon={<Save className="w-4 h-4 text-gray-500" />} label="Guardar" onClick={handleSave} />
            <MenuItem icon={<Printer className="w-4 h-4 text-gray-500" />} label="Imprimir" onClick={handlePrint} />
            <MenuItem icon={<FileText className="w-4 h-4 text-gray-500" />} label="Configuración de página" onClick={() => setShowPageSettings(v => !v)} />
            <MenuItem icon={<X className="w-4 h-4 text-gray-500" />} label="Cerrar" onClick={onClose} />
          </MenuDropdown>

          <MenuDropdown label="Editar">
            <MenuItem icon={<Undo2 className="w-4 h-4 text-gray-500" />} label="Deshacer" onClick={() => cmd('undo')} />
            <MenuItem icon={<Redo2 className="w-4 h-4 text-gray-500" />} label="Rehacer" onClick={() => cmd('redo')} />
            <MenuItem icon={<Scissors className="w-4 h-4 text-gray-500" />} label="Cortar" onClick={() => cmd('cut')} />
            <MenuItem icon={<Copy className="w-4 h-4 text-gray-500" />} label="Copiar" onClick={() => cmd('copy')} />
            <MenuItem icon={<Eraser className="w-4 h-4 text-gray-500" />} label="Quitar formato" onClick={() => cmd('removeFormat')} />
          </MenuDropdown>

          <MenuDropdown label="Insertar">
            <MenuItem icon={<Image className="w-4 h-4 text-gray-500" />} label="Imagen" onClick={handleInsertImage} />
            <MenuItem icon={<Link2 className="w-4 h-4 text-gray-500" />} label="Enlace" onClick={handleInsertLink} />
            <MenuItem icon={<Table2 className="w-4 h-4 text-gray-500" />} label="Tabla" onClick={handleInsertTable} />
          </MenuDropdown>

          <MenuDropdown label="Formato">
            <MenuItem icon={<Bold className="w-4 h-4 text-gray-500" />} label="Negrita" onClick={() => cmd('bold')} />
            <MenuItem icon={<Italic className="w-4 h-4 text-gray-500" />} label="Cursiva" onClick={() => cmd('italic')} />
            <MenuItem icon={<Underline className="w-4 h-4 text-gray-500" />} label="Subrayado" onClick={() => cmd('underline')} />
            <MenuItem icon={<Strikethrough className="w-4 h-4 text-gray-500" />} label="Tachado" onClick={() => cmd('strikeThrough')} />
          </MenuDropdown>

        </ul>
      </nav>

      {/* ── Toolbar ── */}
      <div className="bg-white border-b border-gray-200 px-3 py-1 flex items-center gap-1 flex-wrap shadow-sm">

        {/* Zoom group */}
        <div className="flex items-center gap-1 pr-2 mr-1 border-r border-gray-200">
          <button
            className={tbtn()}
            onMouseDown={(e) => { e.preventDefault(); setZoom(z => Math.max(50, z - 10)); }}
            title="Alejar"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <select
            className="text-xs border border-gray-200 rounded px-1 py-0.5 bg-white"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          >
            {[50, 75, 100, 125, 150, 175, 200].map(v => (
              <option key={v} value={v}>{v}%</option>
            ))}
          </select>
          <button
            className={tbtn()}
            onMouseDown={(e) => { e.preventDefault(); setZoom(z => Math.min(200, z + 10)); }}
            title="Acercar"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button className={tbtn()} onMouseDown={(e) => { e.preventDefault(); handlePrint(); }} title="Imprimir">
            <Printer className="w-4 h-4" />
          </button>
          <button className={tbtn()} onMouseDown={(e) => { e.preventDefault(); handleSave(); }} title="Guardar ahora">
            <Save className="w-4 h-4" />
          </button>
        </div>

        {/* Text style selects */}
        <div className="flex items-center gap-1 pr-2 mr-1 border-r border-gray-200">
          <select
            className="text-xs border border-gray-200 rounded px-1 py-0.5 bg-white"
            defaultValue="p"
            onChange={(e) => cmdArg('formatBlock', e.target.value)}
          >
            <option value="p">Texto normal</option>
            <option value="h1">Encabezado 1</option>
            <option value="h2">Encabezado 2</option>
            <option value="h3">Encabezado 3</option>
          </select>
          <select
            className="text-xs border border-gray-200 rounded px-1 py-0.5 bg-white"
            defaultValue="Arial"
            onChange={(e) => cmdArg('fontName', e.target.value)}
          >
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="Verdana">Verdana</option>
            <option value="Times New Roman">Times New Roman</option>
          </select>
          <select
            className="text-xs border border-gray-200 rounded px-1 py-0.5 bg-white"
            defaultValue="3"
            onChange={(e) => cmdArg('fontSize', e.target.value)}
          >
            <option value="1">8pt</option>
            <option value="2">10pt</option>
            <option value="3">12pt</option>
            <option value="4">14pt</option>
            <option value="5">18pt</option>
            <option value="6">24pt</option>
            <option value="7">36pt</option>
          </select>
        </div>

        {/* Format toggles */}
        <div className="flex items-center gap-1 pr-2 mr-1 border-r border-gray-200">
          <button className={tbtn(activeFormats.bold)} onMouseDown={(e) => { e.preventDefault(); cmd('bold'); }} title="Negrita (Ctrl+B)">
            <Bold className="w-4 h-4" />
          </button>
          <button className={tbtn(activeFormats.italic)} onMouseDown={(e) => { e.preventDefault(); cmd('italic'); }} title="Cursiva (Ctrl+I)">
            <Italic className="w-4 h-4" />
          </button>
          <button className={tbtn(activeFormats.underline)} onMouseDown={(e) => { e.preventDefault(); cmd('underline'); }} title="Subrayado (Ctrl+U)">
            <Underline className="w-4 h-4" />
          </button>
          <button className={tbtn(activeFormats.strikeThrough)} onMouseDown={(e) => { e.preventDefault(); cmd('strikeThrough'); }} title="Tachado">
            <Strikethrough className="w-4 h-4" />
          </button>
          <input
            type="color"
            title="Color de texto"
            className="w-6 h-6 rounded border border-gray-200 cursor-pointer"
            defaultValue="#000000"
            onChange={(e) => cmdArg('foreColor', e.target.value)}
          />
          <input
            type="color"
            title="Color de resaltado"
            className="w-6 h-6 rounded border border-gray-200 cursor-pointer"
            defaultValue="#ffff00"
            onChange={(e) => cmdArg('hiliteColor', e.target.value)}
          />
        </div>

        {/* Insert elements */}
        <div className="flex items-center gap-1 pr-2 mr-1 border-r border-gray-200">
          <button className={tbtn()} onMouseDown={(e) => { e.preventDefault(); handleInsertLink(); }} title="Insertar enlace">
            <Link2 className="w-4 h-4" />
          </button>
          <button className={tbtn()} onMouseDown={(e) => { e.preventDefault(); handleInsertImage(); }} title="Insertar imagen">
            <Image className="w-4 h-4" />
          </button>
          <button className={tbtn()} onMouseDown={(e) => { e.preventDefault(); handleInsertTable(); }} title="Insertar tabla">
            <Table2 className="w-4 h-4" />
          </button>
        </div>

        {/* Alignment & lists */}
        <div className="flex items-center gap-1 pr-2 mr-1 border-r border-gray-200">
          <button className={tbtn()} onMouseDown={(e) => { e.preventDefault(); cmd('justifyLeft'); }} title="Alinear izquierda">
            <AlignLeft className="w-4 h-4" />
          </button>
          <button className={tbtn()} onMouseDown={(e) => { e.preventDefault(); cmd('justifyCenter'); }} title="Centrar">
            <AlignCenter className="w-4 h-4" />
          </button>
          <button className={tbtn()} onMouseDown={(e) => { e.preventDefault(); cmd('justifyRight'); }} title="Alinear derecha">
            <AlignRight className="w-4 h-4" />
          </button>
          <button className={tbtn()} onMouseDown={(e) => { e.preventDefault(); cmd('justifyFull'); }} title="Justificar">
            <AlignJustify className="w-4 h-4" />
          </button>
          <button className={tbtn()} onMouseDown={(e) => { e.preventDefault(); cmd('insertUnorderedList'); }} title="Lista con viñetas">
            <List className="w-4 h-4" />
          </button>
          <button className={tbtn()} onMouseDown={(e) => { e.preventDefault(); cmd('insertOrderedList'); }} title="Lista numerada">
            <ListOrdered className="w-4 h-4" />
          </button>
        </div>

        {/* Advanced */}
        <div className="flex items-center gap-1">
          <button className={tbtn()} onMouseDown={(e) => { e.preventDefault(); cmd('removeFormat'); }} title="Borrar formato">
            <Eraser className="w-4 h-4" />
          </button>
          <button className={tbtn()} onMouseDown={(e) => { e.preventDefault(); cmd('undo'); }} title="Deshacer (Ctrl+Z)">
            <Undo2 className="w-4 h-4" />
          </button>
          <button className={tbtn()} onMouseDown={(e) => { e.preventDefault(); cmd('redo'); }} title="Rehacer (Ctrl+Y)">
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* ── Page settings panel ── */}
      {showPageSettings && (
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-end gap-4 flex-wrap">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Tamaño</label>
              <select
                className="text-sm border border-gray-200 rounded px-2 py-1"
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value as 'A4' | 'Carta' | 'Legal')}
              >
                <option value="A4">A4</option>
                <option value="Carta">Carta</option>
                <option value="Legal">Legal</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Orientación</label>
              <select
                className="text-sm border border-gray-200 rounded px-2 py-1"
                value={pageOrientation}
                onChange={(e) => setPageOrientation(e.target.value as 'portrait' | 'landscape')}
              >
                <option value="portrait">Vertical</option>
                <option value="landscape">Horizontal</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Márgenes (cm)</label>
              <div className="flex gap-1">
                {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
                  <input
                    key={side}
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder={side === 'top' ? 'Sup' : side === 'bottom' ? 'Inf' : side === 'left' ? 'Izq' : 'Der'}
                    className="w-16 text-xs border border-gray-200 rounded px-2 py-1"
                    value={margins[side]}
                    onChange={(e) =>
                      setMargins(m => ({ ...m, [side]: parseFloat(e.target.value) || 0 }))
                    }
                  />
                ))}
              </div>
            </div>
            <button
              className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded hover:bg-blue-700"
              onClick={applyPageSettings}
            >
              Aplicar
            </button>
            <button
              className="text-sm text-gray-500 px-3 py-1.5 rounded hover:bg-gray-100"
              onClick={() => setShowPageSettings(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* ── Body: editor + right sidebar ── */}
      <div className="relative flex flex-1 overflow-hidden">

        {/* Editor scroll area */}
        <div className="flex-1 overflow-auto py-8" style={{ background: '#e8eaed' }}>
          <div className="flex justify-center">
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              className="bg-white shadow-lg outline-none"
              style={{
                zoom: `${zoom}%`,
                width: '21.59cm',
                minHeight: '27.94cm',
                padding: '2cm',
                fontFamily: 'Arial, sans-serif',
                fontSize: '12pt',
                lineHeight: '1.5',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* ── Floating send button ── */}
        <button
          onClick={() => setShowSendModal(true)}
          className="absolute bottom-6 right-6 z-10 flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-full shadow-xl transition-colors"
          title="Enviar como correspondencia"
        >
          <Send className="w-4 h-4" />
          <span className="text-sm font-semibold">Enviar</span>
        </button>

        {/* ── Send modal ── */}
        {showSendModal && (
          <div
            className="absolute inset-0 bg-black/40 z-20 flex items-center justify-center"
            onClick={() => setShowSendModal(false)}
          >
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-6 p-6 flex flex-col gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <h3 className="text-base font-semibold text-gray-800">Enviar como correspondencia</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  El documento se enviará a la bandeja del destinatario. El borrador se limpiará al enviar.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-600 border border-gray-100">
                <span className="font-medium text-gray-400 text-xs uppercase tracking-wide">Documento</span>
                <p className="mt-0.5 truncate">{docTitle}</p>
              </div>

              <SelectCustom
                label="Destinatario"
                options={
                  dataStaff.data?.map((s) => ({
                    id: s.userId,
                    value: `${s.user.name} ${s.user.lastName}`,
                  })) ?? []
                }
                selected={sendReceiver ? { id: sendReceiver.id, value: sendReceiver.name } : null}
                onSelect={(v) =>
                  v && !Array.isArray(v) && setSendReceiver({ id: v.id, name: v.value })
                }
              />

              <div className="flex gap-3 justify-end pt-1">
                <Button variant="outline" onClick={() => setShowSendModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSend} disabled={!sendReceiver} className="gap-2">
                  <Send className="w-4 h-4" />
                  Enviar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ── Right sidebar ── */}
        <div className="flex flex-shrink-0 bg-white border-l border-gray-200">
          {/* Toggle tab */}
          <button
            onClick={() => setShowSidebar(v => !v)}
            className="self-start mt-4 p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            title={showSidebar ? 'Ocultar panel' : 'Mostrar panel'}
          >
            {showSidebar
              ? <ChevronRight className="w-4 h-4" />
              : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Sidebar content */}
          {showSidebar && (
            <div className="w-64 overflow-y-auto py-5 pr-4 flex flex-col gap-5">

              {/* Student info card */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-700 font-semibold text-sm">{initials}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 leading-tight truncate">
                      {student.user.name} {student.user.lastName}
                    </p>
                    <p className="text-xs text-gray-400">Código: {student.code}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 text-xs">
                  <div className="flex gap-2">
                    <span className="text-gray-400 w-20 flex-shrink-0">Documento</span>
                    <span className="text-gray-700 font-medium">{student.user.numberDocument}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-400 w-20 flex-shrink-0">Correo</span>
                    <span className="text-gray-700 font-medium truncate">{student.user.email}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-400 w-20 flex-shrink-0">Colegio</span>
                    <span className="text-gray-700 font-medium">{student.school?.name ?? '—'}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-400 w-20 flex-shrink-0">Grado</span>
                    <span className="text-gray-700 font-medium">{student.grade}° {student.educationLevel}</span>
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Tool buttons */}
              {(onSessionTracking || onWeeklyPlanning || onEvaluationPlanning) && (
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                    Herramientas
                  </p>

                  {onSessionTracking && (
                    <button
                      onClick={() => onSessionTracking(student)}
                      className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-green-50 text-left group transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                        <Activity className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Seguimiento</p>
                        <p className="text-xs text-gray-400">Sesiones del estudiante</p>
                      </div>
                    </button>
                  )}

                  {onWeeklyPlanning && (
                    <button
                      onClick={() => onWeeklyPlanning(student)}
                      className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-blue-50 text-left group transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                        <CalendarRange className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Plan. Semanal</p>
                        <p className="text-xs text-gray-400">Planificación semanal</p>
                      </div>
                    </button>
                  )}

                  {onEvaluationPlanning && (
                    <button
                      onClick={() => onEvaluationPlanning(student)}
                      className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-orange-50 text-left group transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-200 transition-colors">
                        <ClipboardCheck className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Evaluación</p>
                        <p className="text-xs text-gray-400">Plan. de evaluación</p>
                      </div>
                    </button>
                  )}
                </div>
              )}

            </div>
          )}
        </div>

      </div>

    </div>
  );
};
