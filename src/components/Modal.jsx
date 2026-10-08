import { useEffect } from 'react';
import { Button } from './ui/Button';
import { X, AlertTriangle, Info, CheckCircle } from 'lucide-react';

export default function Modal({ isOpen, type = 'confirm', title, message, onConfirm, onCancel, variant = 'danger' }) {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape' && isOpen) onCancel(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onCancel]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const getIcon = () => {
    if (type === 'alert') {
      if (variant === 'success') return <CheckCircle className="h-10 w-10 text-green-500" />;
      if (variant === 'info') return <Info className="h-10 w-10 text-blue-500" />;
      return <AlertTriangle className="h-10 w-10 text-destructive" />;
    }
    return <AlertTriangle className="h-10 w-10 text-destructive" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="relative w-full max-w-md rounded-lg border bg-background p-6 shadow-lg animate-in fade-in zoom-in-95 duration-200">
        <button className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" onClick={onCancel} aria-label="Закрыть">
          <X className="h-4 w-4" />
        </button>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">{getIcon()}</div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{message}</p>
          <div className={`flex w-full gap-3 ${type === 'alert' ? 'justify-center' : 'justify-end'}`}>
            {type === 'confirm' && <Button variant="outline" onClick={onCancel} className="flex-1 sm:flex-none">Отмена</Button>}
            <Button variant={variant === 'danger' ? 'destructive' : 'default'} onClick={type === 'alert' ? onCancel : onConfirm} className="flex-1 sm:flex-none">
              {type === 'alert' ? 'ОК' : 'Удалить'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}