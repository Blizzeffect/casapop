import { createClient } from '@/utils/supabase/server';
import ChatForm from '@/components/ChatForm';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export const metadata = {
    title: 'Comunidad',
    description: 'Únete a la conversación con otros coleccionistas.',
};

export default async function CommunityPage() {
    const supabase = await createClient();
    const { data: messages } = await supabase
        .from('community_messages')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

    return (
        <div className="min-h-screen bg-dark pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-magenta to-cyan mb-4">
                        Comunidad CasaPop
                    </h1>
                    <p className="text-xl text-gray-400">
                        Conecta con otros coleccionistas y comparte tu pasión.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Sidebar Form */}
                    <div className="md:col-span-1">
                        <div className="sticky top-24">
                            <ChatForm />
                        </div>
                    </div>

                    {/* Message Feed */}
                    <div className="md:col-span-2 space-y-6">
                        <h2 className="text-2xl font-bold text-white mb-4">Últimos Mensajes</h2>

                        {messages && messages.length > 0 ? (
                            messages.map((msg) => (
                                <div key={msg.id} className="bg-dark-2/50 border border-gray-800 p-6 rounded-xl animate-fade-in">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-cyan text-lg">{msg.nickname}</span>
                                        <span className="text-xs text-gray-600">
                                            {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true, locale: es })}
                                        </span>
                                    </div>
                                    <p className="text-gray-300 whitespace-pre-wrap">{msg.message}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-dark-2 rounded-xl border border-gray-800 border-dashed">
                                <p className="text-gray-500">Aún no hay mensajes. ¡Sé el primero en escribir!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
