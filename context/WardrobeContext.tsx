import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { ClothingItem, WardrobeContextType } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const WardrobeContext = createContext<WardrobeContextType | undefined>(undefined);

export const WardrobeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wardrobe, setWardrobe] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();

  // Load wardrobe from Supabase when user is authenticated
  useEffect(() => {
    if (user) {
      fetchWardrobe();
    } else {
      setWardrobe([]);
    }
  }, [user]);

  const fetchWardrobe = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('wardrobe')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convert database format to ClothingItem format
      const items: ClothingItem[] = (data || []).map(item => ({
        id: item.id,
        imageData: item.image_data,
        mimeType: item.mime_type,
        category: item.category,
        color: item.color || '',
        pattern: item.pattern,
        style: item.style || 'casual',
        season: item.season || 'all-season',
        description: item.description || '',
      }));

      setWardrobe(items);
    } catch (error) {
      console.error('Error fetching wardrobe:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item: ClothingItem) => {
    if (!user) return;

    try {
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

      // Add to local state with the new ID from database
      const newItem: ClothingItem = {
        id: data.id,
        imageData: data.image_data,
        mimeType: data.mime_type,
        category: data.category,
        color: data.color || '',
        pattern: data.pattern,
        style: data.style || 'casual',
        season: data.season || 'all-season',
        description: data.description || '',
      };

      setWardrobe((prev) => [newItem, ...prev]);
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  };

  const deleteItem = async (id: string) => {
    if (!user) return;

    // Optimistically update UI
    setWardrobe((prev) => prev.filter(item => item.id !== id));

    try {
      const { error } = await supabase
        .from('wardrobe')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting item:', error);
      // Refetch to restore state if delete failed
      fetchWardrobe();
    }
  };

  const getItemById = (id: string | number): ClothingItem | undefined => {
    return wardrobe.find(item => String(item.id) === String(id));
  };

  const contextValue = {
    wardrobe,
    addItem,
    deleteItem,
    getItemById,
    loading,
    setLoading,
  };

  return (
    <WardrobeContext.Provider value={contextValue}>
      {children}
    </WardrobeContext.Provider>
  );
};

export const useWardrobe = (): WardrobeContextType => {
  const context = useContext(WardrobeContext);
  if (context === undefined) {
    throw new Error('useWardrobe must be used within a WardrobeProvider');
  }
  return context;
};