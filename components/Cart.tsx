'use client';

import { supabase } from '@/lib/supabase';
import { CartItem, Product } from '@/types';

interface CartProps {
  items: CartItem[];
  onRemoveItem: (cartId: string) => void;
  onAddItem: (product: Product) => void;
}

export default function Cart({ items, onRemoveItem, onAddItem }: CartProps) {
  const total = items.reduce((sum: number, item: CartItem) => sum + item.price, 0);

  // Agrupar items por ID de producto
  const groupedItems = items.reduce((acc: Record<number, CartItem[]>, item: CartItem) => {
    if (!acc[item.id]) {
      acc[item.id] = [];
    }
    acc[item.id].push(item);
    return acc;
  }, {});

  const uniqueItemIds = Object.keys(groupedItems).map(Number);

  const hasOverStock = uniqueItemIds.some((id) => {
    const quantity = groupedItems[id].length;
    const stock = groupedItems[id][0].stock;
    return quantity > stock;
  });

  async function createOrderAndPay() {
    if (items.length === 0) return;
    if (hasOverStock) return;

    const reference = `casafunko-${crypto.randomUUID()}`;

    // Para la orden, enviamos items agrupados o individuales?
    // MercadoPago prefiere items individuales o agrupados con qty.
    // Vamos a agruparlos para MP también.
    const orderItems = uniqueItemIds.map((id) => {
      const group = groupedItems[id];
      const item = group[0];
      return {
        product_id: item.id,
        name: item.name,
        price: item.price,
        qty: group.length,
      };
    });

    const { error } = await supabase.from('orders').insert([
      {
        reference,
        total_amount: total,
        items: orderItems,
        status: 'pending',
      },
    ]);

    if (error) {
      console.error('Error creating order:', error);
      return;
    }

    const resp = await fetch('/api/mercadopago', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reference,
        items: orderItems,
      }),
    });

    if (!resp.ok) {
      console.error('Error creating Mercado Pago preference');
      return;
    }

    const data = await resp.json();
    if (!data.init_point) {
      console.error('No init_point from Mercado Pago');
      return;
    }

    window.location.assign(data.init_point);
  }

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
          uniqueItemIds.map((id) => {
            const group = groupedItems[id];
            const item = group[0];
            const qty = group.length;
            const outOfStock = qty > item.stock;

            return (
              <div
                key={item.id}
                className="p-2 border-l-2 border-cyan-500 pl-3 bg-black/50 text-sm font-mono"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-cyan-300 truncate">{item.name}</p>
                    <p className="text-yellow-400">
                      ${(item.price * qty).toLocaleString('es-CO')}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => onRemoveItem(group[0].cartId)}
                        className="w-6 h-6 flex items-center justify-center border border-cyan-500 text-cyan-500 hover:bg-cyan-500/20"
                      >
                        -
                      </button>
                      <span className="text-white w-4 text-center">{qty}</span>
                      <button
                        onClick={() => onAddItem(item)}
                        disabled={qty >= item.stock}
                        className="w-6 h-6 flex items-center justify-center border border-cyan-500 text-cyan-500 hover:bg-cyan-500/20 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                      <span className="text-xs text-cyan-400/70 ml-2">
                        Stock: {item.stock}
                      </span>
                    </div>

                    {outOfStock && (
                      <p className="text-[10px] text-red-400 mt-1">
                        Stock insuficiente (Max: {item.stock})
                      </p>
                    )}
                  </div>
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
              onClick={createOrderAndPay}
              disabled={hasOverStock}
              className={`w-full py-3 font-mono font-bold transition-all
                ${hasOverStock
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-yellow-400 text-black hover:from-cyan-600 hover:to-yellow-500'
                }
              `}
              style={
                !hasOverStock
                  ? { boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)' }
                  : {}
              }
            >
              {hasOverStock
                ? 'AJUSTA CANTIDADES'
                : '>> CHECKOUT CON MERCADO PAGO'}
            </button>
          </div>

          <p className="text-xs text-cyan-400/50 text-center font-mono">
            Serás redirigido al Checkout Pro seguro de Mercado Pago.
          </p>
        </>
      )}
    </div>
  );
}
