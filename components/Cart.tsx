'use client';

import { goToWompiCheckout } from '@/lib/wompi';

interface CartProps {
  items: any[];
  onRemoveItem: (cartId: number) => void;
}

export default function Cart({ items, onRemoveItem }: CartProps) {
  // Total y cantidades por producto
  const total = items.reduce((sum: number, item: any) => sum + item.price, 0);

  const quantities: Record<number, number> = items.reduce(
    (acc: Record<number, number>, item: any) => {
      acc[item.id] = (acc[item.id] || 0) + 1;
      return acc;
    },
    {}
  );

  return (
    <div
      className="border-2 border-yellow-400 bg-black p-4"
      style={{
        boxShadow:
          '0 0 20px rgba(255, 255, 0, 0.3), inset 0 0 10px rgba(255, 255, 0, 0.1)',
      }}
    >
      <h2 className="text-lg font-mono font-bold text-yellow-400 mb-4 border-b-2 border-yellow-400/30 pb-2">
        {`🛒 CARRITO (${items.length})`}
      </h2>

      <div className="space-y-2 max-h-96 overflow-y-auto mb-4">
        {items.length === 0 ? (
          <p className="text-cyan-400/50 text-sm font-mono text-center py-4">
            Carrito vacío
          </p>
        ) : (
          items.map((item: any) => {
            const qty = quantities[item.id] || 1;
            const outOfStock = qty >= item.stock;

            return (
              <div
                key={item.cartId}
                className="p-2 border-l-2 border-cyan-500 pl-3 bg-black/50 text-sm font-mono"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-cyan-300 truncate">{item.name}</p>
                    <p className="text-yellow-400">
                      ${item.price.toLocaleString('es-CO')}
                    </p>
                    <p className="text-xs text-cyan-400/70">
                      Cantidad: {qty} / Stock: {item.stock}
                    </p>
                    {outOfStock && (
                      <p className="text-[10px] text-red-400 mt-1">
                        Alcanzaste el stock máximo de este Funko.
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.cartId)}
                    className="text-red-500 hover:text-red-400 text-xs"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {items.length > 0 && (
        <>
          <div className="border-t-2 border-yellow-400/30 pt-4 mb-4">
            <div className="flex justify-between text-lg font-mono font-bold mb-4">
              <span className="text-cyan-400">TOTAL:</span>
              <span className="text-yellow-400">
                ${total.toLocaleString('es-CO')}
              </span>
            </div>

            <button
              onClick={() => goToWompiCheckout(total)}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-yellow-400 text-black font-mono font-bold hover:from-cyan-600 hover:to-yellow-500 transition-all"
              style={{
                boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)',
              }}
            >
              {`>>`} CHECKOUT CON WOMPI
            </button>
          </div>

          <p className="text-xs text-cyan-400/50 text-center font-mono">
            Serás redirigido al WebCheckout seguro de Wompi.
          </p>
        </>
      )}
    </div>
  );
}
