import React from 'react';
import { X, Smartphone, Download, CheckCircle2, ArrowRight } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[#0e0c10] border border-zinc-800 rounded-2xl shadow-2xl p-5 overflow-hidden z-10 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-5 h-5 text-red-500" />
            <h3
              className="text-lg font-bold text-white uppercase tracking-wider"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              Instalar en tu Celular Android
            </h3>
          </div>
          <button
            onClick={onClose}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            aria-label="Cerrar ventana de instalación"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Station Logo & Info */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <img
            src="/assets/aistudio/logo_rock___metal_701d5405.jpeg"
            alt="Rock & Metal"
            className="w-14 h-14 rounded-full object-cover border-2 border-red-500/80 shadow-glow-red-sm"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-white">Rock & Metal Radio Online</h4>
            <p className="text-xs text-zinc-400">App oficial sin anuncios y con controles en pantalla de bloqueo.</p>
          </div>
        </div>

        {isInstalled ? (
          <div className="p-4 rounded-xl bg-green-950/30 border border-green-800/50 flex items-center gap-3 text-green-300">
            <CheckCircle2 className="w-6 h-6 shrink-0 text-green-400" />
            <div className="text-xs leading-relaxed">
              <strong>¡La app ya está instalada!</strong> Puedes abrirla directamente desde tu pantalla de inicio o cajón de aplicaciones.
            </div>
          </div>
        ) : (
          <>
            {/* If direct browser prompt is available */}
            {isInstallable && (
              <button
                onClick={install}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm uppercase tracking-wider shadow-glow-red-sm transition-all active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                <span>Instalar Aplicación Ahora</span>
              </button>
            )}

            {/* Step by step guide */}
            <div className="space-y-3 pt-1">
              <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Pasos para instalar desde Google Chrome:
              </div>

              <div className="space-y-2 text-xs text-zinc-300">
                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-zinc-900/40 border border-zinc-800/60">
                  <span className="w-5 h-5 rounded-full bg-red-600/30 text-red-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    1
                  </span>
                  <span>Abre el enlace de la radio en el navegador <strong>Google Chrome</strong> de tu Android.</span>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-zinc-900/40 border border-zinc-800/60">
                  <span className="w-5 h-5 rounded-full bg-red-600/30 text-red-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    2
                  </span>
                  <span>
                    Toca el menú de los <strong>tres puntos verticales (⋮)</strong> en la esquina superior derecha del navegador.
                  </span>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-zinc-900/40 border border-zinc-800/60">
                  <span className="w-5 h-5 rounded-full bg-red-600/30 text-red-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    3
                  </span>
                  <span>
                    Selecciona <strong>"Instalar aplicación"</strong> o <strong>"Agregar a la pantalla principal"</strong>.
                  </span>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-zinc-900/40 border border-zinc-800/60">
                  <span className="w-5 h-5 rounded-full bg-red-600/30 text-red-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    4
                  </span>
                  <span>
                    ¡Listo! Se añadirá el icono de <strong>ROCK & METAL</strong> a tu pantalla como cualquier aplicación nativa de Android.
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Benefits list */}
        <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-400 flex flex-wrap justify-between gap-y-1">
          <span>⚡ Carga instantánea</span>
          <span>🎧 Segundo plano</span>
          <span>🔒 Pantalla de bloqueo</span>
        </div>
      </div>
    </div>
  );
};
