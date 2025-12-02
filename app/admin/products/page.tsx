'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductsAdminPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        setLoading(true);
        const { data } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setProducts(data);
        setLoading(false);
    }

    async function handleDelete(id: number) {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;

        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) {
            alert('Error al eliminar: ' + error.message);
        } else {
            fetchProducts();
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-magenta to-cyan">
                    Administrar Productos
                </h1>
                <Link
                    href="/admin/products/new"
                    className="px-6 py-3 bg-magenta text-white font-bold rounded-lg hover:bg-magenta/80 transition shadow-[0_0_15px_rgba(255,0,110,0.4)]"
                >
                    + Nuevo Producto
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-12 animate-pulse text-cyan">Cargando productos...</div>
            ) : (
                <div className="bg-dark-2 rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
                    <table className="w-full text-left">
                        <thead className="bg-black/40 text-cyan uppercase text-sm font-bold">
                            <tr>
                                <th className="p-4">Imagen</th>
                                <th className="p-4">Nombre</th>
                                <th className="p-4">Precio</th>
                                <th className="p-4">Stock</th>
                                <th className="p-4">Categoría</th>
                                <th className="p-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-white/5 transition">
                                    <td className="p-4 w-24">
                                        <div className="relative w-16 h-16 rounded overflow-hidden bg-dark">
                                            {product.image_url ? (
                                                <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium text-white">
                                        {product.name}
                                    </td>
                                    <td className="p-4 text-gray-300">
                                        ${product.price.toLocaleString('es-CO')}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs border ${product.stock > 0
                                                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                : 'bg-red-500/10 text-red-500 border-red-500/20'
                                            }`}>
                                            {product.stock} un.
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-400 text-sm">
                                        {product.description}
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        {/* 
                                        <Link
                                            href={`/admin/products/edit/${product.id}`}
                                            className="text-gray-300 hover:text-white transition"
                                        >
                                            ✏️ Editar
                                        </Link>
                                        */}
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="text-red-500 hover:text-red-400 transition ml-4"
                                        >
                                            🗑️ Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-gray-500">
                                        No hay productos registrados aún.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
