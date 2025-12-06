import { createClient } from '@/utils/supabase/server';
import { approveMessage, deleteMessage } from '@/lib/actions/chat';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export const metadata = {
    title: 'Moderación de Chat',
};

export default async function AdminChatPage() {
    const supabase = await createClient();
    const { data: messages } = await supabase
        .from('community_messages')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div className="p-8">
            <h1 className="text-3xl font-heading font-bold text-white mb-8">Moderación de Comunidad</h1>

            <div className="bg-dark-2 rounded-xl border border-gray-800 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-black/40 text-gray-400 border-b border-gray-800 text-sm uppercas">
                            <th className="p-4">Fecha</th>
                            <th className="p-4">Usuario</th>
                            <th className="p-4">Mensaje</th>
                            <th className="p-4">Marketing</th>
                            <th className="p-4">Estado</th>
                            <th className="p-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {messages?.map((msg) => (
                            <tr key={msg.id} className="hover:bg-white/5 transition">
                                <td className="p-4 text-gray-500 text-sm whitespace-nowrap">
                                    {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true, locale: es })}
                                </td>
                                <td className="p-4">
                                    <div className="font-bold text-white">{msg.nickname}</div>
                                    <div className="text-xs text-gray-500">{msg.email}</div>
                                </td>
                                <td className="p-4 text-gray-300 max-w-md break-words">
                                    {msg.message}
                                </td>
                                <td className="p-4 text-center">
                                    {msg.marketing_consent ? '✅' : '❌'}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${msg.is_approved ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                        {msg.is_approved ? 'Aprobado' : 'Pendiente'}
                                    </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    {!msg.is_approved && (
                                        <form action={approveMessage.bind(null, msg.id)} className="inline-block">
                                            <button className="text-green-400 hover:text-green-300 font-bold text-sm px-3 py-1 border border-green-500/30 rounded hover:bg-green-500/10 transition">
                                                Aprobar
                                            </button>
                                        </form>
                                    )}
                                    <form action={deleteMessage.bind(null, msg.id)} className="inline-block">
                                        <button className="text-red-400 hover:text-red-300 font-bold text-sm px-3 py-1 border border-red-500/30 rounded hover:bg-red-500/10 transition">
                                            Eliminar
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                        {(!messages || messages.length === 0) && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">
                                    No hay mensajes.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
