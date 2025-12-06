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
            setNickname('');
            setMessage('');
        }
    }

    const [nickname, setNickname] = useState('');
    const [message, setMessage] = useState('');

    const randomNicknames = [
        'FunkoMaster', 'PopHunter', 'NeonVibes', 'RetroGamer', 'PixelHero',
        'VinylAddict', 'BoxCollector', 'MintCondition', 'ChaseHunter', 'GeekSquad'
    ];

    const thematicEmojis = ['✨', '📦', '🤖', '🦸', '🦄', '💜', '💙', '🎲', '👾', '🕹️', '🎸', '⚡'];

    const handleRandomNickname = () => {
        const random = randomNicknames[Math.floor(Math.random() * randomNicknames.length)];
        const randomSuffix = Math.floor(Math.random() * 100);
        setNickname(`${random}${randomSuffix}`);
    };

    const handleAddEmoji = (emoji: string) => {
        setMessage((prev) => prev + emoji);
    };

    return (
        <div className="bg-dark-2/80 backdrop-blur-sm p-6 rounded-xl border border-cyan/20 shadow-[0_0_15px_rgba(0,245,255,0.1)]">
            <h3 className="text-xl font-heading font-bold text-white mb-4 flex items-center gap-2">
                <span>💬</span> Deja tu huella
            </h3>
            <form action={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Nickname</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            name="nickname"
                            required
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            className="flex-1 bg-dark border border-gray-700 rounded px-4 py-2 text-white focus:border-cyan outline-none transition-colors placeholder:text-gray-600"
                            placeholder="FunkoFan99"
                        />
                        <button
                            type="button"
                            onClick={handleRandomNickname}
                            className="bg-dark border border-gray-700 hover:border-magenta hover:text-magenta text-gray-400 px-3 rounded transition-all active:scale-95"
                            title="Generar nombre aleatorio"
                        >
                            🎲
                        </button>
                    </div>
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Email (Privado)</label>
                    <input
                        type="email"
                        name="email"
                        required
                        className="w-full bg-dark border border-gray-700 rounded px-4 py-2 text-white focus:border-cyan outline-none transition-colors placeholder:text-gray-600"
                        placeholder="tu@email.com"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Mensaje</label>
                    <textarea
                        name="message"
                        required
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-dark border border-gray-700 rounded px-4 py-2 text-white focus:border-cyan outline-none transition-colors placeholder:text-gray-600 mb-2"
                        placeholder="¡Hola a todos!"
                    />
                    <div className="flex flex-wrap gap-2">
                        {thematicEmojis.map((emoji) => (
                            <button
                                key={emoji}
                                type="button"
                                onClick={() => handleAddEmoji(emoji)}
                                className="text-lg hover:scale-125 transition-transform p-1"
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
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
