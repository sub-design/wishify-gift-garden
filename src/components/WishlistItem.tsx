
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useWishlist, WishlistItem as WishlistItemType } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { MoreVertical, Edit, Trash2, ExternalLink, Gift, Share, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EditItemDialog from './EditItemDialog';

interface WishlistItemProps {
  item: WishlistItemType;
  isOwner: boolean;
}

const WishlistItem: React.FC<WishlistItemProps> = ({ item, isOwner }) => {
  const { user } = useAuth();
  const { deleteItem, reserveItem, cancelReservation } = useWishlist();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleDelete = () => {
    deleteItem(item.id);
    toast({
      title: "Item deleted",
      description: "The item has been removed from your wishlist.",
    });
  };

  const handleReserve = () => {
    if (!user) return;
    reserveItem(item, user.id);
    toast({
      title: "Item reserved",
      description: "You've reserved this item. Don't forget to buy it!",
    });
  };

  const handleCancelReservation = () => {
    cancelReservation(item.id);
    toast({
      title: "Reservation cancelled",
      description: "You've cancelled your reservation for this item.",
    });
  };

  const handleShare = () => {
    const url = `${window.location.origin}/item/${item.id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied",
      description: "Share this link to let others see this item.",
    });
  };

  const isReservedByCurrentUser = item.reservedBy === user?.id;

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        <div className="aspect-video bg-gradient-to-br from-blue-100 to-green-100 relative overflow-hidden">
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Gift className="h-12 w-12 text-blue-400" />
            </div>
          )}
          
          {/* Reservation Status */}
          {item.isReserved && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-green-600 hover:bg-green-600">
                <Check className="h-3 w-3 mr-1" />
                Reserved
              </Badge>
            </div>
          )}

          {/* Priority Badge */}
          {item.priority && (
            <div className="absolute top-3 right-3">
              <Badge 
                variant={item.priority === 'high' ? 'destructive' : 
                        item.priority === 'medium' ? 'default' : 'secondary'}
              >
                {item.priority}
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
              {item.name}
            </h3>
            
            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShare}>
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {item.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {item.description}
            </p>
          )}

          {item.price && (
            <p className="text-lg font-bold text-green-600 mb-4">
              ${item.price.toFixed(2)}
            </p>
          )}

          <div className="flex flex-col space-y-3">
            {item.storeUrl && (
              <Button 
                asChild 
                variant="outline" 
                size="sm"
                className="w-full"
              >
                <a href={item.storeUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View in Store
                </a>
              </Button>
            )}

            {!isOwner && !item.isReserved && (
              <Button 
                onClick={handleReserve}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                <Gift className="h-4 w-4 mr-2" />
                Reserve This Gift
              </Button>
            )}

            {!isOwner && isReservedByCurrentUser && (
              <Button 
                onClick={handleCancelReservation}
                variant="outline"
                className="w-full"
              >
                Cancel Reservation
              </Button>
            )}
          </div>

          {item.category && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Badge variant="secondary">{item.category}</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      <EditItemDialog 
        item={item}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </>
  );
};

export default WishlistItem;
