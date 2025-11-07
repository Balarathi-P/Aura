// This file is now mostly deprecated since we're using Supabase directly
// Keeping it for backwards compatibility if needed

import { supabase } from '../lib/supabase';

export async function fetchWardrobe() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('wardrobe')
    .select('*')
    .eq('user_id', user.id);

  if (error) throw error;
  return data;
}

export async function addWardrobeItem(item: {
  imageData: string;
  mimeType: string;
  category?: string;
  color?: string;
  pattern?: string | null;
  style?: string;
  season?: string;
  description?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('wardrobe')
    .insert({
      user_id: user.id,
      image_data: item.imageData,
      mime_type: item.mimeType,
      category: item.category,
      color: item.color,
      pattern: item.pattern,
      style: item.style,
      season: item.season,
      description: item.description,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteWardrobeItem(id: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('wardrobe')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
  return { message: 'Item deleted successfully' };
}

// Image analysis is still done client-side with Gemini
export async function analyzeImage(imageBase64: string, mimeType: string) {
  // This would require server-side implementation
  // For now, use the client-side analyzeClothingImage from geminiService
  throw new Error('Use analyzeClothingImage from geminiService instead');
}