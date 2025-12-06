'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function saveTrack(title: string, artist: string, fileUrl: string, imageUrl: string | null) {
    const supabase = await createClient();

    // Verify auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { error: 'Unauthorized' };
    }

    if (!title || !fileUrl) {
        return { error: 'Falta título o archivo de audio' };
    }

    // Insert into DB
    const { error: dbError } = await supabase
        .from('radio_tracks')
        .insert({
            title,
            artist,
            file_url: fileUrl,
            image_url: imageUrl,
            is_active: true
        });

    if (dbError) {
        console.error('DB Insert Error:', dbError);
        return { error: 'Error guardando información de la pista' };
    }

    revalidatePath('/admin/radio');
    return { success: 'Pista guardada correctamente' };
}

export async function deleteTrack(id: string, fileUrl: string) {
    const supabase = await createClient();

    // Verify auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { error: 'Unauthorized' };
    }

    // Delete from DB
    const { error: dbError } = await supabase
        .from('radio_tracks')
        .delete()
        .eq('id', id);

    if (dbError) {
        return { error: 'Error eliminando de la base de datos' };
    }

    // Attempt to delete from storage (cleanup)
    // Extract path from URL: .../radio_music/tracks/filename.mp3
    try {
        const urlParts = fileUrl.split('/radio_music/');
        if (urlParts.length > 1) {
            const storagePath = urlParts[1];
            await supabase.storage.from('radio_music').remove([storagePath]);
        }
    } catch (e) {
        console.error('Error cleaning up storage:', e);
        // Don't fail the action just because cleanup failed, DB is primary
    }

    revalidatePath('/admin/radio');
    revalidatePath('/community');
    return { success: 'Pista eliminada' };
}
