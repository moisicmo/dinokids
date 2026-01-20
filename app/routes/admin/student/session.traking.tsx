interface Props {
  onClose: () => void;
}

export const SessionTrackingModal = ({ onClose }: Props) => {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose} // 👈 click fuera
    >
      
      <div
        className="bg-white rounded-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // 👈 evita cerrar al hacer click dentro
      >
        
        {/* CONTENIDO DEL MODAL */}
        <h2 className="text-xl font-bold mb-4">
          Seguimiento de Sesiones
        </h2>

        <p className="text-sm text-gray-600">
          Aquí va el contenido del seguimiento…
        </p>
      </div>
    </div>
  );
};
