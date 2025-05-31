import { useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";

interface NotificationToastProps {
  notification: {
    title: string;
    message: string;
    type: 'success' | 'error';
  } | null;
  onClose: () => void;
}

export default function NotificationToast({ notification, onClose }: NotificationToastProps) {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  const { title, message, type } = notification;

  return (
    <div className={`
      fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg min-w-80 max-w-md
      transform transition-all duration-300
      ${type === 'success' ? 'bg-accent-green' : 'bg-red-500'}
      text-white animate-fade-in
    `}>
      <div className="flex items-center space-x-3">
        {type === 'success' ? 
          <CheckCircle className="w-6 h-6 flex-shrink-0" /> : 
          <XCircle className="w-6 h-6 flex-shrink-0" />
        }
        <div>
          <div className="font-semibold">{title}</div>
          <div className="text-sm opacity-90">{message}</div>
        </div>
      </div>
    </div>
  );
}
