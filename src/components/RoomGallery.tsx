import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Star, Users, MapPin, Info, Image as ImageIcon, Video as VideoIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type RoomMedia = {
  id: string;
  room_id: string;
  media_type: string;
  media_url: string;
  caption: string;
  is_primary: boolean;
};

type Room = {
  id: string;
  room_number: string;
  room_type: string;
  capacity: number;
  price_per_night: number;
  description: string;
  size_sqm: number;
};

type RoomReview = {
  id: string;
  room_id: string;
  guest_name: string;
  rating: number;
  review_text: string;
  is_featured: boolean;
};

// Service Gallery Types
type ServiceGalleryItem = {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  media_url: string;
  media_type: "image" | "video";
};

const RoomGallery = () => {
  const { toast } = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomMedia, setRoomMedia] = useState<RoomMedia[]>([]);
  const [featuredReviews, setFeaturedReviews] = useState<RoomReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMediaType, setSelectedMediaType] = useState<'all' | 'image' | 'video'>('all');
  const [services, setServices] = useState<ServiceGalleryItem[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [selectedServiceType, setSelectedServiceType] = useState<'all' | 'image' | 'video'>('all');

  useEffect(() => {
    fetchGalleryData();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await (supabase as any)
        .from("services_gallery")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setServices(data || []);
      setServicesLoading(false);
    };
    fetchServices();
  }, []);

  const fetchGalleryData = async () => {
    try {
      // Fetch rooms
      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select('*')
        .order('room_number');

      if (roomsError) throw roomsError;

      // Fetch room media
      const { data: mediaData, error: mediaError } = await supabase
        .from('room_media')
        .select('*')
        .order('is_primary', { ascending: false });

      if (mediaError) throw mediaError;

      // Fetch featured reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('room_reviews')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (reviewsError) throw reviewsError;

      setRooms(roomsData || []);
      setRoomMedia(mediaData || []);
      setFeaturedReviews(reviewsData || []);
    } catch (error) {
      console.error('Error fetching gallery data:', error);
      toast({
        title: "Error",
        description: "Failed to load gallery data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredMedia = roomMedia.filter(media =>
    selectedMediaType === 'all' || media.media_type === selectedMediaType
  );

  // Filter services by type
  const filteredServices = services.filter(service =>
    selectedServiceType === 'all' || service.media_type === selectedServiceType
  );

  const getRoomForMedia = (roomId: string) => {
    return rooms.find(room => room.id === roomId);
  };

  if (loading) {
    return (
      <section className="py-20 bg-warm-cream">
        <div className="container mx-auto px-6">
          {/* Header Skeleton */}
          <div className="text-center mb-12">
            <div className="h-12 w-96 bg-gray-200 rounded mx-auto mb-6 animate-pulse"></div>
            <div className="h-6 w-80 bg-gray-200 rounded mx-auto animate-pulse"></div>
          </div>

          {/* Service Media Filter Skeleton */}
          <div className="flex justify-center gap-4 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>

          {/* Service Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-soft overflow-hidden">
                <div className="h-64 bg-gray-200 animate-pulse"></div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Gallery Header Skeleton */}
          <div className="text-center mb-12">
            <div className="h-12 w-80 bg-gray-200 rounded mx-auto mb-6 animate-pulse"></div>
            <div className="h-6 w-96 bg-gray-200 rounded mx-auto animate-pulse"></div>
          </div>

          {/* Gallery Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-soft overflow-hidden">
                <div className="relative h-64">
                  <div className="h-full bg-gray-200 animate-pulse"></div>
                  <div className="absolute top-3 left-3">
                    <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="h-6 w-24 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-6 w-32 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Reviews Skeleton */}
          <div className="text-center mb-8">
            <div className="h-8 w-64 bg-gray-200 rounded mx-auto animate-pulse"></div>
          </div>
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-soft min-w-[320px] p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <div key={j} className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
                <div className="h-4 w-full bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-4 animate-pulse"></div>
                <div className="border-t pt-4">
                  <div className="h-4 w-24 bg-gray-200 rounded mb-1 animate-pulse"></div>
                  <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-warm-cream">
      <div className="container mx-auto px-6">
        {/* Services/Equipment Gallery */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-luxury-navy mb-6">
            Our Rooms Features & Equipment
          </h2>
          <p className="text-xl text-rich-charcoal/80 max-w-3xl mx-auto">
            Explore the amenities, services, and equipment available in our rooms.
          </p>
        </div>
        {/* Service Media Filter */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            variant={selectedServiceType === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedServiceType('all')}
            className={
              selectedServiceType === 'all'
                ? 'bg-gradient-to-r from-luxury-navy to-luxury-navy/90 text-white shadow-lg ring-2 ring-luxury-navy border-none'
                : 'border border-luxury-navy text-luxury-navy bg-white hover:bg-luxury-navy/10'
            }
          >
            All
          </Button>
          <Button
            variant={selectedServiceType === 'image' ? 'default' : 'outline'}
            onClick={() => setSelectedServiceType('image')}
            className={
              selectedServiceType === 'image'
                ? 'bg-gradient-to-r from-luxury-navy to-luxury-navy/90 text-white shadow-lg ring-2 ring-luxury-navy border-none'
                : 'border border-luxury-navy text-luxury-navy bg-white hover:bg-luxury-navy/10'
            }
          >
            Photos
          </Button>
          <Button
            variant={selectedServiceType === 'video' ? 'default' : 'outline'}
            onClick={() => setSelectedServiceType('video')}
            className={
              selectedServiceType === 'video'
                ? 'bg-gradient-to-r from-luxury-navy to-luxury-navy/90 text-white shadow-lg ring-2 ring-luxury-navy border-none'
                : 'border border-luxury-navy text-luxury-navy bg-white hover:bg-luxury-navy/10'
            }
          >
            Videos
          </Button>
        </div>
        {servicesLoading ? (
          <div className="text-center py-12">Loading features...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredServices.map(service => (
              <Card key={service.id} className="shadow-soft hover:shadow-luxury transition-luxury overflow-hidden">
                <div className="relative h-64">
                  {service.media_type === "image" ? (
                    <img
                      src={service.media_url}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="relative h-full">
                      <video
                        src={service.media_url}
                        className="w-full h-full object-cover"
                        controls
                        poster="/placeholder.svg"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Play className="w-12 h-12 text-white" />
                      </div>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-5 h-5 text-luxury-navy" />
                    <h3 className="text-xl font-bold text-luxury-navy tracking-tight">{service.title}</h3>
                  </div>
                  {service.subtitle && (
                    <div className="flex items-center gap-2 mb-2">
                      <ImageIcon className="w-4 h-4 text-luxury-navy" />
                      <span className="text-luxury-navy font-semibold">{service.subtitle}</span>
                    </div>
                  )}
                  <div className="border-b border-luxury-navy/20 my-2"></div>
                  <div className="flex items-center gap-2 mb-2">
                    <VideoIcon className="w-4 h-4 text-luxury-navy" />
                    <span className="text-rich-charcoal/80 text-sm">{service.description}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-luxury-navy mb-6">
            Room Gallery & Reviews
          </h2>
          <p className="text-xl text-rich-charcoal/80 max-w-3xl mx-auto">
            Explore our beautifully designed rooms and see what our guests have to say
          </p>
        </div>

        {/* Media Gallery */}
        {filteredMedia.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredMedia.map(media => {
              const room = getRoomForMedia(media.room_id);
              return (
                <Card key={media.id} className="shadow-soft hover:shadow-luxury transition-luxury overflow-hidden">
                  <div className="relative h-64">
                    {media.media_type === 'image' ? (
                      <img
                        src={media.media_url}
                        alt={media.caption || `Room ${room?.room_number}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="relative">
                        <video
                          src={media.media_url}
                          className="w-full h-full object-cover"
                          poster="/placeholder.svg"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                      </div>
                    )}

                    {media.is_primary && (
                      <Badge className="absolute top-3 left-3 bg-luxury-gold text-luxury-navy">
                        Featured
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-6">
                    {room && (
                      <>
                        <h3 className="text-xl font-bold text-luxury-navy mb-2 tracking-tight">
                          Room {room.room_number}
                        </h3>
                        <p className="text-luxury-navy font-semibold mb-2 text-lg">
                          {room.room_type} - <span className="text-luxury-navy">{room.price_per_night} Birr/night</span>
                        </p>
                        <div className="flex items-center gap-4 text-sm text-rich-charcoal/60 mb-2">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-luxury-navy" />
                            <span>{room.capacity} guests</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-luxury-navy" />
                            <span>{room.size_sqm}m²</span>
                          </div>
                        </div>
                      </>
                    )}
                    {media.caption && (
                      <p className="text-rich-charcoal/80 text-sm mt-3 italic">
                        {media.caption}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-rich-charcoal/60">No media found for the selected filter.</p>
          </div>
        )}

        {/* Featured Reviews */}
        {featuredReviews.length > 0 && (
          <div>
            <h3 className="text-3xl font-bold text-luxury-navy mb-8 text-center">
              Guest Recommendations
            </h3>
            <div className="relative overflow-hidden w-full">
              <div
                className="flex w-max animate-marquee gap-6"
              >
                {/* Duplicate reviews for infinite loop effect */}
                {featuredReviews.concat(featuredReviews).map((review, idx) => {
                  const room = rooms.find(r => r.id === review.room_id);
                  return (
                    <Card key={review.id + '-' + idx} className="shadow-soft min-w-[320px] max-w-xs">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? "text-luxury-gold fill-current" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <p className="text-rich-charcoal/80 mb-4 italic">
                          "{review.review_text}"
                        </p>
                        <div className="border-t pt-4">
                          <p className="font-semibold text-luxury-navy">
                            {review.guest_name}
                          </p>
                          {room && (
                            <p className="text-sm text-rich-charcoal/60">
                              Room {room.room_number} - {room.room_type}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default RoomGallery;