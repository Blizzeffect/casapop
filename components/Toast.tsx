import { Product } from '@/types';
import { useEffect } from 'react';

interface ToastProps {
    message: string;
    product?: Product;
    isVisible: boolean;
    onClose: () => void;
}

export default function Toast({ message, product, isVisible, onClose }: ToastProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
            <div
                className="bg-black/90 border-2 border-green-500 p-4 rounded-lg shadow-[0_0_20px_rgba(34,197,94,0.3)] flex items-center gap-4 max-w-sm"
                style={{ backdropFilter: 'blur(8px)' }}
            >
                {product && (
                    <div className="w-12 h-12 bg-white/10 rounded overflow-hidden flex-shrink-0">
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-contain"
                        />
                    </div>
                )}
                <div>
                    <h4 className="text-green-400 font-mono font-bold text-sm">
                        ✓ {message}
                    </h4>
                    {product && (
                        <p className="text-gray-300 text-xs truncate max-w-[200px]">
                            {product.name}
                        </p>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-white transition-colors ml-2"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
