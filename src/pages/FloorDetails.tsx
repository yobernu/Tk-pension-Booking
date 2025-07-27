import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Star, MapPin, Wifi, Tv, Coffee, Bath, Snowflake, ShowerHead, Building2, Toilet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";

type Room = {
  id: string;
  room_number: string;
  floor: number;
  room_type: string;
  capacity: number;
  price_per_night: number;
  amenities: string[];
  is_available: boolean;
  description: string;
  size_sqm: number;
  image_url?: string; // Added image_url to the Room type
};

type RoomMedia = {
  id: string;
  room_id: string;
  media_type: string;
  media_url: string;
  caption: string;
  is_primary: boolean;
};

type RoomReview = {
  id: string;
  guest_name: string;
  rating: number;
  review_text: string;
  is_featured: boolean;
  created_at: string;
};

const FloorDetails = () => {
  const { floor } = useParams<{ floor: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomMedia, setRoomMedia] = useState<RoomMedia[]>([]);
  const [roomReviews, setRoomReviews] = useState<RoomReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);

  useEffect(() => {
    console.log('FloorDetails: floor parameter =', floor);
    if (floor) {
      console.log('FloorDetails: fetching data for floor', parseInt(floor));
      fetchFloorData(parseInt(floor));
    } else {
      console.log('FloorDetails: no floor parameter provided');
    }
  }, [floor]);

  const fetchFloorData = async (floorNumber: number) => {
    try {
      console.log('FloorDetails: fetching rooms for floor', floorNumber);
      // Fetch rooms for this floor
      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select('*')
        .eq('floor', floorNumber)
        .order('room_number');

      if (roomsError) throw roomsError;
      console.log('FloorDetails: rooms data received', roomsData?.length, 'rooms');

      // Fetch media for these rooms
      const roomIds = roomsData?.map(room => room.id) || [];
      const { data: mediaData, error: mediaError } = await supabase
        .from('room_media')
        .select('*')
        .in('room_id', roomIds);

      if (mediaError) throw mediaError;

      // Fetch reviews for these rooms
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('room_reviews')
        .select('*')
        .in('room_id', roomIds)
        .eq('is_featured', true)
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;

      setRooms(roomsData || []);
      setRoomMedia(mediaData || []);
      setRoomReviews(reviewsData || []);
      
      // Debug: Log the amenities from the first room
      if (roomsData && roomsData.length > 0) {
        console.log('First room amenities:', roomsData[0].amenities);
      }
    } catch (error) {
      console.error('Error fetching floor data:', error);
      toast({
        title: "Error",
        description: "Failed to load floor data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const amenityIcons = {
    'Wi-Fi': Wifi,
    'TV': Tv,
    'Air Conditioning': Snowflake,
    'Mini Bar': Coffee,
    'City View': Building2,
    'City-View': Building2, // Added for the actual database value
    'Balcony': Bath,
    'Living Area': Users,
    'Kitchenette': Coffee,
    'Private Shower': ShowerHead,
    'private shower': ShowerHead, // Added for the actual database value
    'En suite washroom with toilet and sink': Toilet,
    'Coffee Machine': Coffee,
    'Work Desk': Users,
    'Premium Toiletries': Bath,
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="py-20">
          <div className="container mx-auto px-6">
            {/* Header Skeleton */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Title Skeleton */}
            <div className="text-center mb-12">
              <div className="h-12 w-64 bg-gray-200 rounded mx-auto mb-4 animate-pulse"></div>
              <div className="h-6 w-48 bg-gray-200 rounded mx-auto animate-pulse"></div>
            </div>

            {/* Room Summary Skeleton */}
            <div className="flex justify-center mb-16">
              <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center border">
                <div className="h-8 w-48 bg-gray-200 rounded mb-4 animate-pulse"></div>
                <div className="flex flex-wrap justify-center gap-8 mb-6 w-full">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="h-12 w-20 bg-gray-200 rounded mb-2 animate-pulse"></div>
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Room Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-soft overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="h-6 w-32 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="h-4 w-full bg-gray-200 rounded mb-4 animate-pulse"></div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {[1, 2, 3, 4].map((j) => (
                        <div key={j} className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!floor || rooms.length === 0) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="py-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-3xl font-bold text-luxury-navy mb-4">Floor Not Found</h1>
            <Button onClick={() => navigate('/')} className="bg-luxury-navy hover:bg-luxury-navy/90">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const availableRooms = rooms.filter(room => room.is_available);
  const roomTypes = [...new Set(rooms.map(room => room.room_type))];

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="py-20">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              onClick={() => navigate('/')} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Rooms
            </Button>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-luxury-navy mb-4">
              Floor {floor} Rooms
            </h1>
            <p className="text-xl text-rich-charcoal/80">
              {availableRooms.length} of {rooms.length} rooms available
            </p>
          </div>

          {/* Room Summary - Modern Design */}
          <div className="mb-16">
            {rooms.length > 0 && (
              <div className="bg-gradient-to-r from-luxury-navy via-luxury-navy/95 to-luxury-navy/90 rounded-3xl p-8 text-white shadow-2xl">
                <div className="text-center mb-8">
                  <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-luxury-gold to-yellow-400 bg-clip-text text-transparent">
                    Floor {floor} Overview
                  </h2>
                  <p className="text-xl text-white/80">
                    Discover our premium accommodations on this floor
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                    <div className="text-3xl font-bold text-luxury-gold mb-2">{Math.min(...rooms.map(room => room.price_per_night))}</div>
                    <div className="text-sm text-white/70">Birr per night</div>
                  </div>
                  <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                    <div className="text-3xl font-bold text-luxury-gold mb-2">{rooms[0].size_sqm}</div>
                    <div className="text-sm text-white/70">m² average</div>
                  </div>
                  <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                    <div className="text-3xl font-bold text-luxury-gold mb-2">{rooms[0].room_type}</div>
                    <div className="text-sm text-white/70">Room type</div>
                  </div>
                  <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                    <div className="text-3xl font-bold text-luxury-gold mb-2">{availableRooms.length}</div>
                    <div className="text-sm text-white/70">Available</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-luxury-gold rounded-full animate-pulse"></div>
                    <span className="text-white/90 font-medium">
                      {availableRooms.length} of {rooms.length} rooms available
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Room Details Grid - Modern Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {rooms.map(room => {
              const primaryMedia = roomMedia.find(media => media.room_id === room.id && media.is_primary);
              const mainImage = room.image_url || (primaryMedia && primaryMedia.media_type === 'image' ? primaryMedia.media_url : "");
              
              return (
                <div key={room.id} className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
                  {/* Room Image */}
                  <div className="relative h-56 overflow-hidden">
                    {mainImage ? (
                      <img 
                        src={mainImage} 
                        alt={`Room ${room.room_number}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <div className="text-gray-500 text-center">
                          <div className="w-16 h-16 mx-auto mb-2 bg-gray-400 rounded-full flex items-center justify-center">
                            <span className="text-2xl">🏨</span>
                          </div>
                          <p className="text-sm">No Image</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        room.is_available 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {room.is_available ? "Available" : "Booked"}
                      </div>
                    </div>
                    
                    {/* Price Tag */}
                    <div className="absolute bottom-4 left-4">
                      <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
                        <div className="text-lg font-bold text-luxury-navy">{room.price_per_night}</div>
                        <div className="text-xs text-gray-600">Birr/night</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    {/* Room Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-luxury-navy">
                        Room {room.room_number}
                      </h3>
                      <div className="text-sm text-gray-500">{room.room_type}</div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {room.description}
                    </p>
                    
                    {/* Room Stats */}
                    <div className="flex items-center gap-6 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-luxury-gold" />
                        <span>{room.capacity} guests</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-luxury-gold" />
                        <span>{room.size_sqm}m²</span>
                      </div>
                    </div>
                    
                    {/* Amenities */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Amenities</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {room.amenities.slice(0, 4).map(amenity => {
                          const Icon = amenityIcons[amenity as keyof typeof amenityIcons] || Coffee;
                          return (
                            <div key={amenity} className="flex items-center gap-2 text-xs">
                              <Icon className="w-3 h-3 text-luxury-gold" />
                              <span className="text-gray-600 truncate">{amenity}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Book Button */}
                    <Button 
                      className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                        room.is_available 
                          ? 'bg-gradient-to-r from-luxury-navy to-luxury-navy/90 hover:from-luxury-navy/90 hover:to-luxury-navy text-white shadow-lg hover:shadow-xl' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!room.is_available}
                      onClick={() => {
                        if (!room.is_available) return;
                        setSelectedRoom({
                          id: room.id,
                          name: `Room ${room.room_number}`,
                          type: room.room_type,
                          price: room.price_per_night,
                          currency: "ETB",
                          max_guests: room.capacity,
                          image_url: mainImage,
                          amenities: room.amenities || [],
                          rating: 0,
                          description: room.description,
                          available: room.is_available,
                        });
                        setModalOpen(true);
                      }}
                    >
                      {room.is_available ? "Book This Room" : "Not Available"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reviews Section */}
          {roomReviews.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-luxury-navy mb-8 text-center">
                Guest Reviews
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roomReviews.map(review => (
                  <Card key={review.id} className="shadow-soft">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${
                              i < review.rating ? "text-luxury-gold fill-current" : "text-gray-300"
                            }`} 
                          />
                        ))}
                      </div>
                      <p className="text-rich-charcoal/80 mb-4 italic">
                        "{review.review_text}"
                      </p>
                      <p className="font-semibold text-luxury-navy">
                        {review.guest_name}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          {/* Only render BookingModal if selectedRoom is not null */}
          {selectedRoom && (
            <BookingModal
              isOpen={modalOpen}
              onClose={() => {
                setModalOpen(false);
                setSelectedRoom(null);
              }}
              room={selectedRoom}
              checkIn={undefined}
              checkOut={undefined}
              guests={1}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FloorDetails;