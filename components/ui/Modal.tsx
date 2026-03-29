'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Button from './Button';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'default';
}

export default function Modal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'default',
}: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-2xl p-6 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-bold text-zinc-100 mb-2 pr-8">{title}</h3>
            {description && (
              <p className="text-sm text-zinc-400 mb-6">{description}</p>
            )}

            <div className="flex gap-3">
              <Button variant="ghost" onClick={onClose} fullWidth size="sm">
                {cancelText}
              </Button>
              <Button
                variant={variant === 'danger' ? 'danger' : 'primary'}
                onClick={onConfirm}
                fullWidth
                size="sm"
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
