
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Search, ExternalLink, Gift } from 'lucide-react';

const Friends = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for demonstration
  const mockFriends = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      itemCount: 12,
      avatar: '',
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike@example.com',
      itemCount: 8,
      avatar: '',
    },
    {
      id: '3',
      name: 'Emma Wilson',
      email: 'emma@example.com',
      itemCount: 15,
      avatar: '',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Friends' Wishlists</h1>
          <p className="text-gray-600">
            Browse your friends' wishlists and reserve gifts
          </p>
        </div>
        <Button>
          <Users className="h-4 w-4 mr-2" />
          Invite Friends
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search friends..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Demo Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-900">Demo Mode</h3>
              <p className="text-blue-700">
                This is a demo of the friends feature. In the full version, you would be able to connect with real friends and view their wishlists.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Friends List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockFriends.map((friend) => (
          <Card key={friend.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">
                  {friend.name.charAt(0)}
                </span>
              </div>
              <CardTitle className="text-lg">{friend.name}</CardTitle>
              <p className="text-sm text-gray-600">{friend.email}</p>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <Gift className="h-4 w-4" />
                <span>{friend.itemCount} items in wishlist</span>
              </div>
              
              <Button className="w-full" variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Wishlist
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {mockFriends.length === 0 && (
        <div className="text-center py-16">
          <div className="max-w-sm mx-auto">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Friends Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Invite friends to start sharing wishlists and coordinating gifts.
            </p>
            <Button>
              <Users className="h-4 w-4 mr-2" />
              Invite Friends
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Friends;
