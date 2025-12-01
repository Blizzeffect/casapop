import { env } from '@/lib/env';
import { Product, CartItem } from '@/types';

const TEMPLATE_BACKGROUND_URLS: Record<string, string> = {
  default: env.NEXT_PUBLIC_SUPABASE_STORAGE_URL,
};

interface ProductGridProps {
  products: Product[];
  cartItems: CartItem[];
  onAddToCart: (product: Product) => void;
  onRemoveItem: (cartId: string) => void;
}

export default function ProductGrid({ products, cartItems, onAddToCart, onRemoveItem }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
      {products.map((product: Product) => {
        const templateKey = product.template || 'default';
        const bgUrl =
          TEMPLATE_BACKGROUND_URLS[templateKey] ||
          TEMPLATE_BACKGROUND_URLS.default;

        // Calcular cantidad en carrito
        const productInCart = cartItems.filter((item) => item.id === product.id);
        const qtyInCart = productInCart.length;
        const isMaxStock = qtyInCart >= product.stock;

        return (
          <div
            key={product.id}
            className="relative border-2 border-cyan-500 bg-black/80 backdrop-blur overflow-hidden group hover:border-yellow-400 transition-all"
            style={{
              boxShadow:
                'inset 0 0 20px rgba(0, 212, 255, 0.1), 0 0 20px rgba(0, 212, 255, 0.3)',
            }}
          >
            {/* Imagen + plantilla */}
            <div className="relative h-64 overflow-hidden border-b-2 border-cyan-500/30">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${bgUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'brightness(0.95)',
                }}
              />
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {product.stock <= 1 && product.stock > 0 && (
                <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs font-mono">
                  ÚLTIMO
                </div>
              )}

              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                  <div className="bg-red-600 text-white px-4 py-2 font-mono font-bold border-2 border-white transform -rotate-12">
                    AGOTADO
                  </div>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="text-lg font-mono font-bold text-cyan-400 mb-2 truncate">
                {product.name}
              </h3>
              <p className="text-xs text-cyan-300/70 mb-3 line-clamp-2">
                {product.description}
              </p>

              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-yellow-400 font-mono font-bold text-lg">
                    ${product.price.toLocaleString('es-CO')}
                  </p>
                  <p className="text-xs text-cyan-500/50">
                    Stock: {product.stock}
                  </p>
                </div>
              </div>

              {qtyInCart > 0 ? (
                <div className="flex items-center justify-between border-2 border-cyan-500 bg-black/50 p-1">
                  <button
                    onClick={() => onRemoveItem(productInCart[0].cartId)}
                    className="w-8 h-8 flex items-center justify-center text-cyan-500 hover:bg-cyan-500/20 font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="text-yellow-400 font-mono font-bold">
                    {qtyInCart}
                  </span>
                  <button
                    onClick={() => onAddToCart(product)}
                    disabled={isMaxStock}
                    className="w-8 h-8 flex items-center justify-center text-cyan-500 hover:bg-cyan-500/20 font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onAddToCart(product)}
                  disabled={product.stock === 0}
                  className="w-full py-2 border-2 border-yellow-400 bg-black text-yellow-400 font-mono hover:bg-yellow-400/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  style={{
                    boxShadow:
                      product.stock > 0
                        ? '0 0 10px rgba(255, 255, 0, 0.3)'
                        : 'none',
                  }}
                >
                  {product.stock > 0 ? '>> COMPRAR' : 'AGOTADO'}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
