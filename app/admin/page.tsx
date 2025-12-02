import Link from 'next/link';

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-magenta to-cyan">
                Panel de Control
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Products Card */}
                <Link
                    href="/admin/products"
                    className="group p-8 bg-dark-2 border border-gray-800 rounded-2xl hover:border-magenta/50 transition shadow-lg hover:shadow-[0_0_30px_rgba(255,0,110,0.1)]"
                >
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-4xl bg-magenta/10 p-3 rounded-xl border border-magenta/20">📦</span>
                        <span className="text-gray-500 group-hover:text-magenta transition">Ver todo →</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Productos</h2>
                    <p className="text-gray-400">Administra el inventario, precios y stock de tus Funkos.</p>
                </Link>

                {/* Blog Card */}
                <Link
                    href="/admin/blog"
                    className="group p-8 bg-dark-2 border border-gray-800 rounded-2xl hover:border-cyan/50 transition shadow-lg hover:shadow-[0_0_30px_rgba(0,243,255,0.1)]"
                >
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-4xl bg-cyan/10 p-3 rounded-xl border border-cyan/20">📝</span>
                        <span className="text-gray-500 group-hover:text-cyan transition">Ver todo →</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Blog</h2>
                    <p className="text-gray-400">Crea y edita artículos para mantener a tu comunidad informada.</p>
                </Link>
            </div>
        </div>
    );
}
