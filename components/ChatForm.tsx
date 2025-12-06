'use client';

import { useState } from 'react';
import { postMessage } from '@/lib/actions/chat';

export default function ChatForm() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [feedback, setFeedback] = useState('');

    async function handleSubmit(formData: FormData) {
        setStatus('loading');
        const res = await postMessage(formData);

        if (res?.error) {
            setStatus('error');
            setFeedback(res.error);
        } else if (res?.success) {
            setStatus('success');
            setFeedback(res.success as string);
            // Reset form if needed, but native form reset happens on refresh or via ref.
            // Easiest is to just show success message.
            const form = document.querySelector('form') as HTMLFormElement;
            if (form) form.reset();
        }
    }

    return (
        <div className="bg-dark-2 p-6 rounded-xl border border-cyan/20">
            <h3 className="text-xl font-heading font-bold text-white mb-4">Deja tu huella</h3>
            <form action={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Nickname</label>
                    <input
                        type="text"
                        name="nickname"
                        required
                        className="w-full bg-dark border border-gray-700 rounded px-4 py-2 text-white focus:border-cyan outline-none"
                        placeholder="FunkoFan99"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Email (Privado)</label>
                    <input
                        type="email"
                        name="email"
                        required
                        className="w-full bg-dark border border-gray-700 rounded px-4 py-2 text-white focus:border-cyan outline-none"
                        placeholder="tu@email.com"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Mensaje</label>
                    <textarea
                        name="message"
                        required
                        rows={3}
                        className="w-full bg-dark border border-gray-700 rounded px-4 py-2 text-white focus:border-cyan outline-none"
                        placeholder="¡Hola a todos!"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="marketing_consent"
                        id="marketing"
                        className="rounded bg-dark border-gray-700 text-cyan focus:ring-cyan"
                    />
                    <label htmlFor="marketing" className="text-sm text-gray-400">
                        Acepto recibir noticias y ofertas mágicas ✨
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full py-2 bg-gradient-to-r from-magenta to-cyan text-white font-bold rounded hover:opacity-90 transition disabled:opacity-50"
                >
                    {status === 'loading' ? 'Enviando...' : 'Enviar Mensaje'}
                </button>

                {feedback && (
                    <p className={`text-sm text-center ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                        {feedback}
                    </p>
                )}
            </form>
        </div>
    );
}
