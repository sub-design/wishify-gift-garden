
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface WishlistItem {
  id: string;
  userId: string;
  name: string;
  description: string;
  price?: number;
  storeUrl?: string;
  imageUrl?: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  isReserved: boolean;
  reservedBy?: string;
  reservedAt?: string;
  createdAt: string;
}

export interface Reservation {
  id: string;
  itemId: string;
  itemName: string;
  itemImage?: string;
  ownerName: string;
  reservedBy: string;
  reservedAt: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  reservations: Reservation[];
  addItem: (item: Omit<WishlistItem, 'id' | 'userId' | 'isReserved' | 'createdAt'>) => void;
  updateItem: (id: string, updates: Partial<WishlistItem>) => void;
  deleteItem: (id: string) => void;
  reserveItem: (item: WishlistItem, reservedBy: string) => void;
  cancelReservation: (itemId: string) => void;
  getItemsByUser: (userId: string) => WishlistItem[];
  searchItems: (query: string) => WishlistItem[];
  filterItems: (category?: string, priority?: string) => WishlistItem[];
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
    // Load data from localStorage
    const savedItems = localStorage.getItem('wishlistItems');
    const savedReservations = localStorage.getItem('reservations');
    
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
    if (savedReservations) {
      setReservations(JSON.parse(savedReservations));
    }
  }, []);

  const saveItems = (newItems: WishlistItem[]) => {
    setItems(newItems);
    localStorage.setItem('wishlistItems', JSON.stringify(newItems));
  };

  const saveReservations = (newReservations: Reservation[]) => {
    setReservations(newReservations);
    localStorage.setItem('reservations', JSON.stringify(newReservations));
  };

  const addItem = (itemData: Omit<WishlistItem, 'id' | 'userId' | 'isReserved' | 'createdAt'>) => {
    if (!user) return;
    
    const newItem: WishlistItem = {
      ...itemData,
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      isReserved: false,
      createdAt: new Date().toISOString(),
    };
    
    saveItems([...items, newItem]);
  };

  const updateItem = (id: string, updates: Partial<WishlistItem>) => {
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    saveItems(updatedItems);
  };

  const deleteItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    saveItems(updatedItems);
    
    // Remove any reservations for this item
    const updatedReservations = reservations.filter(res => res.itemId !== id);
    saveReservations(updatedReservations);
  };

  const reserveItem = (item: WishlistItem, reservedBy: string) => {
    // Update item as reserved
    updateItem(item.id, {
      isReserved: true,
      reservedBy,
      reservedAt: new Date().toISOString(),
    });

    // Add to reservations
    const newReservation: Reservation = {
      id: Math.random().toString(36).substr(2, 9),
      itemId: item.id,
      itemName: item.name,
      itemImage: item.imageUrl,
      ownerName: 'Item Owner', // In real app, get from user data
      reservedBy,
      reservedAt: new Date().toISOString(),
    };

    saveReservations([...reservations, newReservation]);
  };

  const cancelReservation = (itemId: string) => {
    // Update item as not reserved
    updateItem(itemId, {
      isReserved: false,
      reservedBy: undefined,
      reservedAt: undefined,
    });

    // Remove from reservations
    const updatedReservations = reservations.filter(res => res.itemId !== itemId);
    saveReservations(updatedReservations);
  };

  const getItemsByUser = (userId: string) => {
    return items.filter(item => item.userId === userId);
  };

  const searchItems = (query: string) => {
    if (!user) return [];
    const userItems = items.filter(item => item.userId === user.id);
    return userItems.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    );
  };

  const filterItems = (category?: string, priority?: string) => {
    if (!user) return [];
    let userItems = items.filter(item => item.userId === user.id);
    
    if (category) {
      userItems = userItems.filter(item => item.category === category);
    }
    if (priority) {
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
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
