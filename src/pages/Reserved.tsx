
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, ExternalLink, X, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Reserved = () => {
  const { user } = useAuth();
  const { reservations, cancelReservation, items } = useWishlist();
  const { toast } = useToast();

  const userReservations = reservations.filter(res => res.reservedBy === user?.id);

  const handleCancelReservation = (itemId: string, itemName: string) => {
    cancelReservation(itemId);
    toast({
      title: "Reservation cancelled",
      description: `You've cancelled your reservation for "${itemName}".`,
    });
  };

  const getItemDetails = (itemId: string) => {
    return items.find(item => item.id === itemId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reserved Gifts</h1>
        <p className="text-gray-600">
          {userReservations.length} {userReservations.length === 1 ? 'gift' : 'gifts'} reserved
        </p>
      </div>

      {/* Reservations List */}
      {userReservations.length > 0 ? (
        <div className="space-y-4">
          {userReservations.map((reservation) => {
            const itemDetails = getItemDetails(reservation.itemId);
            
            return (
              <Card key={reservation.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Item Image */}
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {reservation.itemImage ? (
                        <img 
                          src={reservation.itemImage} 
                          alt={reservation.itemName}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Gift className="h-8 w-8 text-blue-600" />
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 mb-1">
                            {reservation.itemName}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            For {reservation.ownerName}
                          </p>
                          
                          {itemDetails?.description && (
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {itemDetails.description}
                            </p>
                          )}

                          <div className="flex items-center text-sm text-gray-500 mb-4">
                            <Calendar className="h-4 w-4 mr-1" />
                            Reserved on {new Date(reservation.reservedAt).toLocaleDateString()}
                          </div>

                          {itemDetails?.price && (
                            <p className="text-lg font-bold text-green-600 mb-3">
                              ${itemDetails.price.toFixed(2)}
                            </p>
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelReservation(reservation.itemId, reservation.itemName)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        {itemDetails?.storeUrl && (
                          <Button asChild className="flex-1">
                            <a href={itemDetails.storeUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Buy Now
                            </a>
                          </Button>
                        )}
                        
                        <Button 
                          variant="outline"
                          onClick={() => handleCancelReservation(reservation.itemId, reservation.itemName)}
                          className="flex-1 sm:flex-none"
                        >
                          Cancel Reservation
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="max-w-sm mx-auto">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Gift className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Reserved Gifts
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't reserved any gifts yet. Browse your friends' wishlists to find perfect gifts to reserve.
            </p>
            <Button asChild>
              <a href="/friends">
                <Gift className="h-4 w-4 mr-2" />
                Browse Friends' Lists
              </a>
            </Button>
          </div>
        </div>
      )}

      {/* Info Card */}
      {userReservations.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Gift className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">Remember to Purchase</h3>
                <p className="text-green-700">
                  Don't forget to buy the gifts you've reserved. Use the "Buy Now" button to go directly to the store.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Reserved;
