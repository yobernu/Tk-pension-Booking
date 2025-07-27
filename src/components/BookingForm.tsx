import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, CreditCard, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Room = {
  id: string;
  room_number: string;
  room_type: string;
  capacity: number;
  price_per_night: number;
  is_available: boolean;
};

const BookingForm = () => {
  const { toast } = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [transactionFile, setTransactionFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    checkInDate: "",
    checkOutDate: "",
    numberOfGuests: 1,
    selectedRoomId: "",
    paymentMethod: "",
    specialRequests: "",
    transactionReference: ""
  });

  useEffect(() => {
    fetchAvailableRooms();
  }, []);

  const fetchAvailableRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('id, room_number, room_type, capacity, price_per_night, is_available')
        .eq('is_available', true)
        .order('room_number');

      if (error) throw error;
      setRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast({
        title: "Error",
        description: "Failed to load available rooms",
        variant: "destructive",
      });
    }
  };

  const calculateTotal = () => {
    if (!formData.checkInDate || !formData.checkOutDate || !formData.selectedRoomId) return 0;
    
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    const selectedRoom = rooms.find(room => room.id === formData.selectedRoomId);
    if (!selectedRoom || nights <= 0) return 0;
    
    return nights * selectedRoom.price_per_night;
  };

  const validateGuestLimit = () => {
    const selectedRoom = rooms.find(room => room.id === formData.selectedRoomId);
    if (!selectedRoom) return true;
    
    // Check if number of guests exceeds room capacity
    return formData.numberOfGuests <= selectedRoom.capacity;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type (only images)
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: "Please upload an image file for the transaction screenshot",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setTransactionFile(file);
    }
  };

  const uploadTransactionScreenshot = async (bookingId: string) => {
    if (!transactionFile) return null;

    const fileExt = transactionFile.name.split('.').pop();
    const fileName = `${bookingId}_${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('transaction-screenshots')
      .upload(fileName, transactionFile);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('transaction-screenshots')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateGuestLimit()) {
      toast({
        title: "Too Many Guests",
        description: "Number of guests exceeds room capacity",
        variant: "destructive",
      });
      return;
    }

    if (formData.paymentMethod === 'bank_transfer' && !transactionFile) {
      toast({
        title: "Missing Screenshot",
        description: "Please upload transaction screenshot for bank transfer",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Create booking
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          room_id: formData.selectedRoomId,
          guest_name: formData.guestName,
          guest_email: formData.guestEmail,
          guest_phone: formData.guestPhone,
          check_in_date: formData.checkInDate,
          check_out_date: formData.checkOutDate,
          number_of_guests: formData.numberOfGuests,
          total_amount: calculateTotal(),
          special_requests: formData.specialRequests
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Upload transaction screenshot if provided
      let screenshotUrl = null;
      if (transactionFile) {
        screenshotUrl = await uploadTransactionScreenshot(bookingData.id);
      }

      // Create payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          booking_id: bookingData.id,
          payment_method: formData.paymentMethod,
          transaction_reference: formData.transactionReference,
          transaction_screenshot_url: screenshotUrl,
          amount: calculateTotal()
        });

      if (paymentError) throw paymentError;

      toast({
        title: "Booking Confirmed!",
        description: `Your booking for room ${rooms.find(r => r.id === formData.selectedRoomId)?.room_number} has been submitted. We'll contact you shortly.`,
      });

      // Reset form
      setFormData({
        guestName: "",
        guestEmail: "",
        guestPhone: "",
        checkInDate: "",
        checkOutDate: "",
        numberOfGuests: 1,
        selectedRoomId: "",
        paymentMethod: "",
        specialRequests: "",
        transactionReference: ""
      });
      setTransactionFile(null);

    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Booking Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedRoom = rooms.find(room => room.id === formData.selectedRoomId);
  const total = calculateTotal();

  return (
    <section className="py-20 bg-warm-cream">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-luxury-navy mb-6">
            Book Your Stay
          </h2>
          <p className="text-xl text-rich-charcoal/80 max-w-3xl mx-auto">
            Complete your reservation with our secure booking system
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Booking Form */}
          <Card className="shadow-2xl bg-gradient-to-br from-luxury-navy/95 to-luxury-navy/80 border-none rounded-3xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white tracking-tight">Booking Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Guest Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Guest Information</h3>
                  
                  <div>
                    <Label htmlFor="guestName" className="text-white">Full Name *</Label>
                    <Input
                      id="guestName"
                      value={formData.guestName}
                      onChange={(e) => setFormData({...formData, guestName: e.target.value})}
                      required
                      className="rounded-xl bg-white/90 border-none focus:ring-2 focus:ring-luxury-navy shadow-sm"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="guestEmail" className="text-white">Email *</Label>
                    <Input
                      id="guestEmail"
                      type="email"
                      value={formData.guestEmail}
                      onChange={(e) => setFormData({...formData, guestEmail: e.target.value})}
                      required
                      className="rounded-xl bg-white/90 border-none focus:ring-2 focus:ring-luxury-navy shadow-sm"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="guestPhone" className="text-white">Phone Number</Label>
                    <Input
                      id="guestPhone"
                      value={formData.guestPhone}
                      onChange={(e) => setFormData({...formData, guestPhone: e.target.value})}
                      className="rounded-xl bg-white/90 border-none focus:ring-2 focus:ring-luxury-navy shadow-sm"
                    />
                  </div>
                </div>

                {/* Stay Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Stay Details</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="checkIn" className="text-white">Check-in Date *</Label>
                      <Input
                        id="checkIn"
                        type="date"
                        value={formData.checkInDate}
                        onChange={(e) => setFormData({...formData, checkInDate: e.target.value})}
                        min={new Date().toISOString().split('T')[0]}
                        required
                        className="rounded-xl bg-white/90 border-none focus:ring-2 focus:ring-luxury-navy shadow-sm"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="checkOut" className="text-white">Check-out Date *</Label>
                      <Input
                        id="checkOut"
                        type="date"
                        value={formData.checkOutDate}
                        onChange={(e) => setFormData({...formData, checkOutDate: e.target.value})}
                        min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                        required
                        className="rounded-xl bg-white/90 border-none focus:ring-2 focus:ring-luxury-navy shadow-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="guests" className="text-white">Number of Guests *</Label>
                    <Select 
                      value={formData.numberOfGuests.toString()} 
                      onValueChange={(value) => setFormData({...formData, numberOfGuests: parseInt(value)})}
                    >
                      <SelectTrigger className="rounded-xl bg-white/90 border-none focus:ring-2 focus:ring-luxury-navy shadow-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5,6].map(num => (
                          <SelectItem key={num} value={num.toString()}>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-luxury-navy" />
                              {num} {num === 1 ? 'Guest' : 'Guests'}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {!validateGuestLimit() && (
                      <p className="text-sm text-red-300 mt-1">
                        Room capacity exceeded. Max {selectedRoom?.capacity} guests.
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="room" className="text-white">Select Room *</Label>
                    <Select value={formData.selectedRoomId} onValueChange={(value) => setFormData({...formData, selectedRoomId: value})}>
                      <SelectTrigger className="rounded-xl bg-white/90 border-none focus:ring-2 focus:ring-luxury-navy shadow-sm">
                        <SelectValue placeholder="Choose a room" />
                      </SelectTrigger>
                      <SelectContent>
                        {rooms.map(room => (
                          <SelectItem key={room.id} value={room.id}>
                            Room {room.room_number} - {room.room_type} ({room.price_per_night} Birr/night, max {room.capacity} guests)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Payment Method</h3>
                  
                  <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({...formData, paymentMethod: value})}>
                    <SelectTrigger className="rounded-xl bg-white/90 border-none focus:ring-2 focus:ring-luxury-navy shadow-sm">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chapa">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-luxury-navy" />
                          Chapa Payment
                        </div>
                      </SelectItem>
                      <SelectItem value="bank_transfer">
                        <div className="flex items-center gap-2">
                          <Upload className="w-4 h-4 text-luxury-navy" />
                          Bank Transfer
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {formData.paymentMethod === 'bank_transfer' && (
                    <div className="space-y-4 p-4 bg-luxury-navy/10 rounded-xl">
                      <p className="text-sm text-luxury-navy">
                        <strong>Bank Transfer Instructions:</strong><br />
                        Account Name: Hotel Booking Ltd<br />
                        Account Number: 1234567890<br />
                        Bank: Commercial Bank of Ethiopia<br />
                        Reference: Your booking reference
                      </p>
                      
                      <div>
                        <Label htmlFor="transactionRef" className="text-luxury-navy">Transaction Reference</Label>
                        <Input
                          id="transactionRef"
                          value={formData.transactionReference}
                          onChange={(e) => setFormData({...formData, transactionReference: e.target.value})}
                          placeholder="Enter transaction reference number"
                          className="rounded-xl bg-white/90 border-none focus:ring-2 focus:ring-luxury-navy shadow-sm"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="screenshot" className="text-luxury-navy">Upload Transaction Screenshot *</Label>
                        <Input
                          id="screenshot"
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="cursor-pointer rounded-xl bg-white/90 border-none focus:ring-2 focus:ring-luxury-navy shadow-sm"
                        />
                        {transactionFile && (
                          <p className="text-sm text-green-600 mt-1">
                            File selected: {transactionFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Special Requests */}
                <div>
                  <Label htmlFor="requests" className="text-white">Special Requests</Label>
                  <Textarea
                    id="requests"
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                    placeholder="Any special requests or requirements?"
                    rows={3}
                    className="rounded-xl bg-white/90 border-none focus:ring-2 focus:ring-luxury-navy shadow-sm"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-luxury-navy to-luxury-navy/90 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:from-luxury-navy/90 hover:to-luxury-navy"
                  disabled={loading || !validateGuestLimit()}
                >
                  {loading ? "Processing..." : `Confirm Booking - ${total} Birr`}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Booking Summary */}
          <Card className="shadow-2xl bg-gradient-to-br from-luxury-navy/95 to-luxury-navy/80 border-none rounded-3xl text-white h-fit">
            <CardHeader>
              <CardTitle className="text-2xl text-white tracking-tight">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedRoom ? (
                <>
                  <div className="p-4 bg-white/10 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">
                      Room {selectedRoom.room_number}
                    </h4>
                    <p className="text-white/80">{selectedRoom.room_type}</p>
                    <p className="text-luxury-navy font-semibold">
                      {selectedRoom.price_per_night} Birr/night
                    </p>
                    <Badge className="mt-2 bg-luxury-navy text-white">
                      Max {selectedRoom.capacity} guests
                    </Badge>
                  </div>
                  
                  {formData.checkInDate && formData.checkOutDate && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Check-in:</span>
                        <span className="font-semibold">{formData.checkInDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Check-out:</span>
                        <span className="font-semibold">{formData.checkOutDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Nights:</span>
                        <span className="font-semibold">
                          {Math.ceil((new Date(formData.checkOutDate).getTime() - new Date(formData.checkInDate).getTime()) / (1000 * 60 * 60 * 24))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Guests:</span>
                        <span className="font-semibold">{formData.numberOfGuests}</span>
                      </div>
                      <hr className="my-4 border-luxury-navy/30" />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-luxury-gold">{total} Birr</span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-white/70">Select a room to see booking summary</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;