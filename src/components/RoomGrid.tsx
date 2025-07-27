import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bed, Wifi, Car, Coffee, Tv, Bath, Star, MapPin, Snowflake, ShowerHead, Building2, Toilet, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
};

const RoomGrid = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('floor', { ascending: true })
        .order('room_number', { ascending: true });

      if (error) throw error;
      setRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast({
        title: "Error",
        description: "Failed to load room data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewFloorRooms = (floor: number) => {
    navigate(`/floor/${floor}`);
  };

  const availableRooms = rooms.filter(room => room.is_available);
  const roomTypes = [...new Set(rooms.map(room => room.room_type))];
  const avgPrice = rooms.length > 0 ? Math.round(rooms.reduce((sum, room) => sum + room.price_per_night, 0) / rooms.length) : 0;

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
      <section className="py-20 bg-warm-cream">
        <div className="container mx-auto px-6">
          {/* Header Skeleton */}
          <div className="text-center mb-16">
            <div className="h-12 w-48 bg-gray-200 rounded mx-auto mb-6 animate-pulse"></div>
            <div className="h-6 w-96 bg-gray-200 rounded mx-auto animate-pulse"></div>
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

          {/* Floor Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((floor) => (
              <div key={floor} className="bg-white rounded-lg shadow-soft p-6">
                <div className="text-center mb-6">
                  <div className="h-6 w-24 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded mx-auto animate-pulse"></div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((room) => (
                    <div key={room} className="h-8 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="h-8 w-48 bg-gray-200 rounded mx-auto animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-warm-cream">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-luxury-navy mb-6">
            Our Rooms
          </h2>
          <p className="text-xl text-rich-charcoal/80 max-w-3xl mx-auto">
            Experience luxury and comfort in our well-appointed rooms on floors 3, 4, and 5. 
            Each room features modern amenities and beautiful city views.
          </p>
        </div>

        {/* Room Summary (centered, visually appealing) */}
        <div className="flex justify-center mb-16">
          {rooms.length > 0 && (
            <div className="w-full max-w-2xl bg-gradient-to-br from-white via-warm-cream to-luxury-gold/10 rounded-2xl shadow-xl p-8 flex flex-col items-center border border-luxury-gold/20">
              <h2 className="text-3xl md:text-4xl font-extrabold text-luxury-navy mb-4 tracking-tight">Room Highlights</h2>
              <div className="flex flex-wrap justify-center gap-8 mb-6 w-full">
                <div className="flex flex-col items-center">
                  <span className="text-luxury-gold text-5xl font-bold mb-1">{rooms[0].price_per_night} Birr</span>
                  <span className="text-rich-charcoal/70 text-base">per night</span>
                </div>
                <div className="flex flex-col items-center">
                  <svg className="w-8 h-8 text-luxury-gold mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4M8 3v4"/></svg>
                  <span className="text-rich-charcoal/80 text-base">{rooms[0].size_sqm} m²</span>
                </div>
                <div className="flex flex-col items-center">
                  <svg className="w-8 h-8 text-luxury-gold mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 10h18M7 10V7a5 5 0 0 1 10 0v3"/><rect x="3" y="10" width="18" height="7" rx="2"/></svg>
                  <span className="text-rich-charcoal/80 text-base">{rooms[0].room_type} Bed</span>
                </div>
                <div className="flex flex-col items-center">
                  <svg className="w-8 h-8 text-luxury-gold mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="8" cy="12" r="4"/><circle cx="16" cy="12" r="4"/></svg>
                  <span className="text-rich-charcoal/80 text-base">Max {rooms[0].capacity} guests</span>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span className="inline-block w-3 h-3 rounded-full bg-luxury-gold animate-pulse"></span>
                <span className="text-lg font-semibold text-luxury-navy">
                  {rooms.filter(room => room.is_available).length} of {rooms.length} rooms available
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Room Availability Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[3, 4, 5].map(floor => {
            const floorRooms = rooms.filter(room => room.floor === floor);
            const availableOnFloor = floorRooms.filter(room => room.is_available).length;
            
            return (
              <div key={floor} className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
                {/* Floor Header */}
                <div className="bg-gradient-to-r from-luxury-navy to-luxury-navy/90 p-6 text-white">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">
                      Floor {floor}
                    </h3>
                    <p className="text-white/80 text-sm">
                      {floorRooms.length} rooms • {availableOnFloor} available
                    </p>
                  </div>
                </div>
                
                <div className="p-6">
                  {/* Room Grid */}
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {floorRooms.map(room => (
                      <div
                        key={room.id}
                        className={`p-2 rounded-lg text-center text-xs font-medium transition-all duration-200 ${
                          room.is_available
                            ? 'bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer'
                            : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        }`}
                        title={`Room ${room.room_number} - ${room.room_type} - ${room.price_per_night} Birr/night`}
                      >
                        {room.room_number}
                      </div>
                    ))}
                  </div>
                  
                  {/* Legend */}
                  <div className="flex items-center justify-between text-xs mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-green-100 border border-green-300"></div>
                      <span className="text-gray-600">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-gray-100 border border-gray-300"></div>
                      <span className="text-gray-600">Booked</span>
                    </div>
                  </div>
                  
                  {/* View Button */}
                  <Button 
                    onClick={() => handleViewFloorRooms(floor)}
                    className="w-full bg-gradient-to-r from-luxury-navy to-luxury-navy/90 hover:from-luxury-navy/90 hover:to-luxury-navy text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Explore Floor {floor}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Badge variant="secondary" className="px-6 py-2 text-lg bg-luxury-gold text-luxury-navy">
            {availableRooms.length} of {rooms.length} rooms available
          </Badge>
        </div>
      </div>
    </section>
  );
};

export default RoomGrid;