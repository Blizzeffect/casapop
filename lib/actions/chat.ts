'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

const PROFANITY_LIST = [
    'badword', 'spam', 'viagra', 'casino', 'xxx', 'porn', 'sex', 'idiot', 'stupid', 'hate'
    // Add real profanity list here. This is a basic example.
];

function containsProfanity(text: string): boolean {
    const lowerText = text.toLowerCase();
    return PROFANITY_LIST.some(word => lowerText.includes(word));
}

export async function postMessage(formData: FormData) {
    const supabase = await createClient(); // Await client creation

    const nickname = formData.get('nickname') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;
    const marketingConsent = formData.get('marketing_consent') === 'on';

    if (!nickname || !email || !message) {
        return { error: 'Todos los campos son obligatorios' };
    }

    const isSuspicious = containsProfanity(message) || containsProfanity(nickname);
    const isApproved = !isSuspicious; // Auto-approve if clean

    const { error } = await supabase.from('community_messages').insert({
        nickname,
        email,
        message,
        marketing_consent: marketingConsent,
        is_approved: isApproved,
    });

    if (error) {
        console.error('Error posting message:', error);
        return { error: 'Error enviando el mensaje. Por favor intenta de nuevo.' };
    }

    if (isApproved) {
        revalidatePath('/community');
        return { success: 'Mensaje enviado!' };
    } else {
        return { success: 'Mensaje recibido. Está pendiente de moderación.' };
    }
}

export async function approveMessage(id: string) {
    const supabase = await createClient();

    // Verify auth - assuming middleware/utils handle basic auth context, 
    // but explicitly checking user for admin actions is safer.
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { error: 'Unauthorized' };
    }

    const { error } = await supabase
        .from('community_messages')
        .update({ is_approved: true })
        .eq('id', id);

    if (error) {
        console.error('Error approving message:', error);
        return { error: 'Error aprobando mensaje' };
    }

    revalidatePath('/community');
    revalidatePath('/admin/chat');
    return { success: true };
}

export async function deleteMessage(id: string) {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { error: 'Unauthorized' };
    }

    const { error } = await supabase
        .from('community_messages')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting message:', error);
        return { error: 'Error eliminando mensaje' };
    }

    revalidatePath('/community');
    revalidatePath('/admin/chat');
    return { success: true };
}
