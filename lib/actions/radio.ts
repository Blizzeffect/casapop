'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function uploadTrack(formData: FormData) {
    const supabase = await createClient();

    const title = formData.get('title') as string;
    const artist = formData.get('artist') as string || 'Unknown Artist';
    const image = formData.get('image') as File | null;
    const file = formData.get('file') as File;

    if (!file || !title) {
        return { error: 'Falta el archivo de audio o el título' };
    }

    // Verify auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { error: 'Unauthorized' };
    }

    // Upload Audio to Music Folder
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `tracks/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('radio_music')
        .upload(filePath, file);

    if (uploadError) {
        console.error('Upload Error:', uploadError);
        return { error: 'Error subiendo el archivo de audio' };
    }

    // Upload Image if provided
    let imageUrl = null;
    if (image && image.size > 0) {
        const imgExt = image.name.split('.').pop();
        const imgName = `art_${Date.now()}_${Math.random().toString(36).substring(7)}.${imgExt}`;
        const imgPath = `art/${imgName}`;

        const { error: imgUploadError } = await supabase.storage
            .from('radio_music')
            .upload(imgPath, image);

        if (!imgUploadError) {
            const { data: imgUrlData } = supabase.storage
                .from('radio_music')
                .getPublicUrl(imgPath);
            imageUrl = imgUrlData.publicUrl;
        }
    }

    // Get Public URL for Audio
    const { data: publicUrlData } = supabase.storage
        .from('radio_music')
        .getPublicUrl(filePath);

    const fileUrl = publicUrlData.publicUrl;

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
    return { success: 'Pista añadida correctamente' };
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
