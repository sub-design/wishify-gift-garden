
import { useParams } from 'react-router-dom';
import { useWishlist } from '@/contexts/WishlistContext';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Gift } from 'lucide-react';
import WishlistItem from '@/components/WishlistItem';

const PublicWishlist = () => {
  const { userId } = useParams();
  const { getItemsByUser } = useWishlist();

  const userItems = userId ? getItemsByUser(userId) : [];
  const visibleItems = userItems.filter(item => !item.is_reserved);

  // Mock user data - in real app, fetch from API
  const ownerName = "Friend's Name";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-green-600 rounded-full">
              <Heart className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {ownerName}'s Wishlist
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose a gift to reserve for {ownerName}. Reserved items are hidden from others to avoid duplicates.
          </p>
        </div>

        {/* Items Grid */}
        {visibleItems.length > 0 ? (
          <>
            <div className="mb-8">
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <Gift className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-blue-900">How it works</h3>
                      <p className="text-blue-700">
                        Click "Reserve This Gift" on any item to reserve it. This ensures no one else will buy the same gift. You can cancel your reservation anytime.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleItems.map((item) => (
                <WishlistItem key={item.id} item={item} isOwner={false} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-sm mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Available Items
              </h3>
              <p className="text-gray-600">
                {userItems.length === 0 
                  ? "This wishlist is empty or doesn't exist."
                  : "All items in this wishlist have been reserved by others."
                }
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center">
          <Card className="border-green-200 bg-green-50 max-w-md mx-auto">
            <CardContent className="p-6">
              <Heart className="h-8 w-8 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-green-900 mb-2">
                Create Your Own Wishlist
              </h3>
              <p className="text-green-700 text-sm">
                Sign up for WishList to create your own wishlist and share it with friends and family.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PublicWishlist;
