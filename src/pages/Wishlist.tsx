
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Filter } from 'lucide-react';
import WishlistItem from '@/components/WishlistItem';
import AddItemDialog from '@/components/AddItemDialog';
import ShareWishlistDialog from '@/components/ShareWishlistDialog';

const Wishlist = () => {
  const { user } = useAuth();
  const { items, searchItems } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const userItems = items.filter(item => item.userId === user?.id);
  const displayedItems = searchQuery ? searchItems(searchQuery) : userItems;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600">
            {userItems.length} {userItems.length === 1 ? 'item' : 'items'} in your wishlist
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => setIsShareDialogOpen(true)}
            variant="outline"
            disabled={userItems.length === 0}
          >
            Share List
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search your wishlist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Items Grid */}
      {displayedItems.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedItems.map((item) => (
            <WishlistItem key={item.id} item={item} isOwner={true} />
          ))}
        </div>
      ) : userItems.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-sm mx-auto">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Start Your Wishlist
            </h3>
            <p className="text-gray-600 mb-6">
              Add items you'd love to receive as gifts. Include photos, descriptions, and links to make it easy for friends and family.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Item
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500">No items match your search.</p>
          <Button 
            variant="outline" 
            onClick={() => setSearchQuery('')}
            className="mt-4"
          >
            Clear Search
          </Button>
        </div>
      )}

      {/* Dialogs */}
      <AddItemDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
      />
      <ShareWishlistDialog 
        open={isShareDialogOpen} 
        onOpenChange={setIsShareDialogOpen} 
      />
    </div>
  );
};

export default Wishlist;
