import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CalendarIcon, MapPin, Users, Star } from "lucide-react";
import { format } from "date-fns";
import heroImage from "/assets/hero-room.png";
import BookingModal from "./BookingModal";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { addDays, isAfter, isSameDay, startOfDay } from "date-fns";

const HeroSection = () => {
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [guests, setGuests] = useState("1");
  const [numRooms, setNumRooms] = useState("1");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleBooking = async () => {
    if (!checkIn || !checkOut) return;

    const n = parseInt(numRooms) || 1;
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('is_available', true)
      .limit(n);
    if (error || !data || data.length < n) {
      console.log(error || 'Not enough rooms available');
      return;
    }
    setSelectedRoom(
      data.map((room) => ({
        id: room.id,
        name: `Room ${room.room_number}`,
        type: room.room_type,
        price: room.price_per_night,
        currency: "ETB",
        max_guests: room.capacity,
        image_url: "", // or room.image_url if available
        amenities: room.amenities || [],
        rating: 0,
        description: room.description,
        available: room.is_available,
      }))
    );
    setModalOpen(true);
  };

  const formatDate = (date?: Date) =>
    date ? format(date, "yyyy-MM-dd") : "YYYY-MM-DD";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-overlay"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="text-center text-white mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            T-K Pension
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-white/90 max-w-2xl mx-auto">
            Experience comfort and hospitality in a vibrant heart of Hosanna.
          </p>
          <div className="flex items-center justify-center gap-2 text-luxury-gold mb-8">
            <div className="flex items-center gap-1">
              {[...Array(3)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <span className="text-white/80">3-Star Luxury Pension</span>
          </div>
        </div>

        {/* Booking Form */}
        <Card className="max-w-4xl mx-auto p-8 bg-white/80 backdrop-blur-md shadow-lg rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
            {/* Check-In Date Picker */}
            <div className="space-y-2">
              <Label className="text-luxury-navy font-medium">Check-in</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className="w-full justify-start text-left font-normal bg-white/80 text-luxury-navy hover:bg-luxury-gold/10 focus:ring-2 focus:ring-luxury-gold rounded-xl shadow-sm border-0"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-luxury-gold" />
                    {formatDate(checkIn)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkIn}
                    onSelect={setCheckIn}
                    initialFocus
                    disabled={{ before: startOfDay(new Date()) }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Check-Out Date Picker */}
            <div className="space-y-2">
              <Label className="text-luxury-navy font-medium">Check-out</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className="w-full justify-start text-left font-normal bg-white/80 text-luxury-navy hover:bg-luxury-gold/10 focus:ring-2 focus:ring-luxury-gold rounded-xl shadow-sm border-0"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-luxury-gold" />
                    {formatDate(checkOut)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkOut}
                    onSelect={setCheckOut}
                    initialFocus
                    disabled={checkIn ? { before: addDays(startOfDay(checkIn), 1) } : { before: startOfDay(new Date()) }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Guests Input */}
            <div className="space-y-2">
              <Label htmlFor="guests" className="text-luxury-navy font-medium">
                Guests
              </Label>
              <div className="relative">
                <input
                  id="guests"
                  type="number"
                  min="1"
                  max="2"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="pl-10 py-2 w-full bg-white/80 rounded-xl shadow-sm focus:ring-2 focus:ring-luxury-gold text-luxury-navy border-0 outline-none"
                />
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-navy w-4 h-4" />
              </div>
            </div>

            {/* Number of Rooms */}
            <div className="space-y-2">
              <Label htmlFor="numRooms" className="text-luxury-navy font-medium">
                Rooms
              </Label>
              <div className="relative">
                <input
                  id="numRooms"
                  type="number"
                  min="1"
                  max="10"
                  value={numRooms}
                  onChange={(e) => setNumRooms(e.target.value)}
                  className="pl-10 py-2 w-full bg-white/80 rounded-xl shadow-sm focus:ring-2 focus:ring-luxury-gold text-luxury-navy border-0 outline-none"
                />
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-navy w-4 h-4" />
              </div>
            </div>

            {/* Book Button */}
            <Button
              onClick={handleBooking}
              className="mt-6 bg-gradient-gold hover:bg-luxury-gold/90 text-luxury-navy font-semibold h-12 shadow-gold transition-luxury rounded-xl w-full"
            >
              Book Now
            </Button>
          </div>

          {/* Info */}
          <div className="flex items-center justify-center gap-8 mt-8 pt-6 text-sm text-luxury-navy">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-luxury-gold" />
              <span>In-Front of Bezabih-Petros Square</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-luxury-gold flex items-center justify-center text-white text-xs font-bold">1</span>
              <span>Single Bed Rooms</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-luxury-gold font-semibold">24</span>
              <span>Available Rooms</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Booking Modal */}
      {selectedRoom && (
        <BookingModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedRoom(null);
          }}
          rooms={selectedRoom}
          checkIn={checkIn}
          checkOut={checkOut}
          guests={parseInt(guests) || 1}
        />
      )}
    </section>
  );
};

export default HeroSection;
