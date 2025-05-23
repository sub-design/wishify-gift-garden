
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface WishlistItem {
  id: string;
  user_id: string;
  name: string;
  description: string;
  price?: number;
  store_url?: string;
  image_url?: string;
  category?: string;
  priority?: number;
  is_reserved: boolean;
  reserved_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Reservation {
  id: string;
  item_id: string;
  reserved_by: string;
  reserved_at: string;
  wishlist_items?: {
    name: string;
    image_url?: string;
    user_id: string;
  };
}

interface WishlistContextType {
  items: WishlistItem[];
  reservations: Reservation[];
  addItem: (item: Omit<WishlistItem, 'id' | 'user_id' | 'is_reserved' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateItem: (id: string, updates: Partial<WishlistItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  reserveItem: (item: WishlistItem, reservedBy: string) => Promise<void>;
  cancelReservation: (itemId: string) => Promise<void>;
  getItemsByUser: (userId: string) => WishlistItem[];
  searchItems: (query: string) => WishlistItem[];
  filterItems: (category?: string, priority?: number) => WishlistItem[];
  loadItems: () => Promise<void>;
  loadReservations: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    if (user) {
      loadItems();
      loadReservations();
    } else {
      setItems([]);
      setReservations([]);
    }
  }, [user]);

  const loadItems = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  const loadReservations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          wishlist_items (
            name,
            image_url,
            user_id
          )
        `)
        .eq('reserved_by', user.id);

      if (error) throw error;
      setReservations(data || []);
    } catch (error) {
      console.error('Error loading reservations:', error);
    }
  };

  const addItem = async (itemData: Omit<WishlistItem, 'id' | 'user_id' | 'is_reserved' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .insert({
          ...itemData,
          user_id: user.id,
          is_reserved: false,
        })
        .select()
        .single();

      if (error) throw error;
      setItems(prev => [data, ...prev]);
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  };

  const updateItem = async (id: string, updates: Partial<WishlistItem>) => {
    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, ...data } : item
      ));
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setItems(prev => prev.filter(item => item.id !== id));
      setReservations(prev => prev.filter(res => res.item_id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  };

  const reserveItem = async (item: WishlistItem, reservedBy: string) => {
    try {
      // Start transaction-like operation
      const { error: updateError } = await supabase
        .from('wishlist_items')
        .update({
          is_reserved: true,
          reserved_by: reservedBy,
        })
        .eq('id', item.id);

      if (updateError) throw updateError;

      const { data: reservationData, error: reservationError } = await supabase
        .from('reservations')
        .insert({
          item_id: item.id,
          reserved_by: reservedBy,
        })
        .select()
        .single();

      if (reservationError) throw reservationError;

      // Update local state
      setItems(prev => prev.map(i => 
        i.id === item.id 
          ? { ...i, is_reserved: true, reserved_by: reservedBy }
          : i
      ));

      if (reservedBy === user?.id) {
        setReservations(prev => [...prev, {
          ...reservationData,
          wishlist_items: {
            name: item.name,
            image_url: item.image_url,
            user_id: item.user_id,
          }
        }]);
      }
    } catch (error) {
      console.error('Error reserving item:', error);
      throw error;
    }
  };

  const cancelReservation = async (itemId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('wishlist_items')
        .update({
          is_reserved: false,
          reserved_by: null,
        })
        .eq('id', itemId);

      if (updateError) throw updateError;

      const { error: deleteError } = await supabase
        .from('reservations')
        .delete()
        .eq('item_id', itemId);

      if (deleteError) throw deleteError;

      // Update local state
      setItems(prev => prev.map(item => 
        item.id === itemId 
          ? { ...item, is_reserved: false, reserved_by: undefined }
          : item
      ));

      setReservations(prev => prev.filter(res => res.item_id !== itemId));
    } catch (error) {
      console.error('Error canceling reservation:', error);
      throw error;
    }
  };

  const getItemsByUser = (userId: string) => {
    return items.filter(item => item.user_id === userId);
  };

  const searchItems = (query: string) => {
    if (!user) return [];
    const userItems = items.filter(item => item.user_id === user.id);
    return userItems.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    );
  };

  const filterItems = (category?: string, priority?: number) => {
    if (!user) return [];
    let userItems = items.filter(item => item.user_id === user.id);
    
    if (category) {
      userItems = userItems.filter(item => item.category === category);
    }
    if (priority !== undefined) {
      userItems = userItems.filter(item => item.priority === priority);
    }
    
    return userItems;
  };

  return (
    <WishlistContext.Provider value={{
      items,
      reservations,
      addItem,
      updateItem,
      deleteItem,
      reserveItem,
      cancelReservation,
      getItemsByUser,
      searchItems,
      filterItems,
      loadItems,
      loadReservations,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
