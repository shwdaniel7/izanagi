import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isLoading?: boolean;
}

export function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  isLoading 
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col items-center text-center space-y-4">
        
        {/* Ícone de Alerta com fundo suave */}
        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mb-2 animate-pulse">
          <AlertTriangle className="text-error w-8 h-8" />
        </div>

        {/* Descrição com suporte a Dark Mode */}
        <p className="text-charcoal-light dark:text-gray-300 leading-relaxed">
          {description}
        </p>

        {/* Botões de Ação */}
        <div className="flex gap-3 w-full pt-4">
          <Button 
            variant="ghost" 
            fullWidth 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          
          <Button 
            variant="danger" 
            fullWidth 
            onClick={onConfirm}
            isLoading={isLoading}
          >
            Sim, Excluir
          </Button>
        </div>
      </div>
    </Modal>
  );
}