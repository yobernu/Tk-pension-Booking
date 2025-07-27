import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, CreditCard, Phone, Mail, User } from "lucide-react";
import { format } from "date-fns";
import { useBookings } from "@/hooks/useBookings";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Room {
  id: string;
  name: string;
  type: string;
  price: number;
  currency: string;
  max_guests: number;
  image_url: string;
  amenities: string[];
  rating: number;
  description: string;
  available: boolean;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  room?: Room | null; // for single room (FloorDetails)
  rooms?: Room[]; // for multiple rooms (HeroSection)
  checkIn?: Date;
  checkOut?: Date;
  guests: number;
}

export default function BookingModal({ 
  isOpen, 
  onClose, 
  room, // single room (FloorDetails)
  rooms, // array of rooms (HeroSection)
  checkIn: propCheckIn, 
  checkOut: propCheckOut, 
  guests 
}: BookingModalProps) {
  const { createBooking, loading } = useBookings();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  // Local state for check-in/out if not provided
  const [localCheckIn, setLocalCheckIn] = useState<Date | undefined>(undefined);
  const [localCheckOut, setLocalCheckOut] = useState<Date | undefined>(undefined);
  const [paymentMethod, setPaymentMethod] = useState<'chapa' | 'bank_transfer'>('chapa');
  const [transactionId, setTransactionId] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Determine if multi-room or single-room flow
  const isMultiRoom = Array.isArray(rooms) && rooms.length > 0;
  const usedRooms = isMultiRoom ? rooms : room ? [room] : [];
  if (usedRooms.length === 0) {
    return (
      <div className="p-8 text-center text-red-600">
        Room data is not available. Please try again.
      </div>
    );
  }
  // Use first room for display (all rooms are same type)
  const displayRoom = usedRooms[0];

  // Use prop dates if provided, else local state
  const checkIn = propCheckIn || localCheckIn;
  const checkOut = propCheckOut || localCheckOut;

  // Guard against NaN for price
  const price = typeof displayRoom.price === 'number' && !isNaN(displayRoom.price) ? displayRoom.price : 0;
  const nights = checkIn && checkOut ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const numRooms = usedRooms.length;
  const subtotal = price * nights * numRooms;
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setScreenshotFile(file);
  };

  const uploadScreenshot = async (bookingId: string) => {
    if (!screenshotFile) return null;
    setUploading(true);
    const fileExt = screenshotFile.name.split('.').pop();
    const fileName = `${bookingId}_${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from('transaction-screenshots')
      .upload(fileName, screenshotFile);
    setUploading(false);
    if (error) throw error;
    const { data: urlData } = supabase.storage
      .from('transaction-screenshots')
      .getPublicUrl(fileName);
    return urlData?.publicUrl || null;
  };

  const handleChapaPayment = async () => {
    if (usedRooms.length === 0 || !checkIn || !checkOut) return;
    try {
      const guestName = `${formData.firstName} ${formData.lastName}`;
      let screenshot_url = null;
      let transaction_id = null;
      if (paymentMethod === 'bank_transfer') {
        if (!transactionId || !screenshotFile) {
          toast({ title: 'Missing Info', description: 'Please provide transaction ID and screenshot.', variant: 'destructive' });
          return;
        }
        // For each room, create booking, upload screenshot, update room, insert payment
        for (const r of usedRooms) {
          const tempBooking = {
            room_id: r.id,
            guest_name: guestName,
            guest_email: formData.email, 
            guest_phone: formData.phone,
            check_in_date: format(checkIn, 'yyyy-MM-dd'),
            check_out_date: format(checkOut, 'yyyy-MM-dd'),
            number_of_guests: Number(guests),
            total_amount: Number(total) / numRooms,
            booking_status: 'pending',
            transaction_id: transactionId,
          };
          const { data: bookingData, error: bookingError } = await supabase
            .from('bookings')
            .insert([tempBooking])
            .select()
            .single();
          if (bookingError) throw bookingError;
          screenshot_url = await uploadScreenshot(bookingData.id);
          await supabase
            .from('bookings')
            .update({ screenshot_url } as any)
            .eq('id', bookingData.id);
          await supabase
            .from('rooms')
            .update({ is_available: false })
            .eq('id', r.id);
          const { error: paymentError } = await supabase
            .from('payments')
            .insert([
              {
                booking_id: bookingData.id,
                payment_method: 'bank_transfer',
                payment_status: 'pending',
                transaction_reference: transactionId,
                transaction_screenshot_url: screenshot_url,
                amount: Number(total) / numRooms,
                payment_date: new Date().toISOString(),
              },
            ]);
          if (paymentError) {
            console.error("Payment insert failed:", paymentError);
            return;
          }
        }
        toast({ title: 'Booking Created', description: 'Your booking(s) have been created! We will verify your payment soon.' });
        setFormData({ firstName: "", lastName: "", email: "", phone: "" });
        setTransactionId("");
        setScreenshotFile(null);
        onClose();
        return;
      }
      // Chapa payment (default)
      for (const r of usedRooms) {
        const bookingData = await createBooking({
          room_id: r.id,
          guest_name: guestName,
          guest_email: formData.email,
          guest_phone: formData.phone,
          check_in_date: format(checkIn, 'yyyy-MM-dd'),
          check_out_date: format(checkOut, 'yyyy-MM-dd'),
          number_of_guests: Number(guests),
          total_amount: Number(total) / numRooms,
          booking_status: 'pending',
        });
        await supabase
          .from('rooms')
          .update({ is_available: false })
          .eq('id', r.id);
        const { error: paymentError } = await supabase
          .from('payments')
          .insert([
            {
              booking_id: bookingData.id,
              payment_method: 'chapa',
              payment_status: 'pending',
              transaction_reference: null,
              transaction_screenshot_url: null,
              amount: Number(total) / numRooms,
              payment_date: new Date().toISOString(),
            },
          ]);
        if (paymentError) {
          console.error("Payment insert failed:", paymentError);
          return;
        }
      }
      setFormData({ firstName: "", lastName: "", email: "", phone: "" });
      onClose();
      toast({
        title: "Booking Created",
        description: "Your booking(s) have been created! Payment integration will be available soon.",
      });
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: "Error",
        description: "Something went wrong while creating your booking.",
        variant: "destructive",
      });
    }
  };
  

  const isFormValid = formData.firstName && formData.lastName && formData.email && formData.phone && checkIn && checkOut && nights > 0 && (paymentMethod === 'chapa' || (transactionId && screenshotFile));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Complete Your Booking</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Booking Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Booking Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <img 
                    src={displayRoom.image_url} 
                    alt={displayRoom.name}
                    className="w-20 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold">{displayRoom.name}</h3>
                    <Badge variant="secondary">{displayRoom.type}</Badge>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Check-in</div>
                    <div className="font-medium">
                      {checkIn ? format(checkIn, "MMM dd, yyyy") : (
                        <input
                          type="date"
                          className="border rounded px-2 py-1 w-full"
                          value={localCheckIn ? format(localCheckIn, 'yyyy-MM-dd') : ''}
                          onChange={e => setLocalCheckIn(e.target.value ? new Date(e.target.value) : undefined)}
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Check-out</div>
                    <div className="font-medium">
                      {checkOut ? format(checkOut, "MMM dd, yyyy") : (
                        <input
                          type="date"
                          className="border rounded px-2 py-1 w-full"
                          value={localCheckOut ? format(localCheckOut, 'yyyy-MM-dd') : ''}
                          min={localCheckIn ? format(localCheckIn, 'yyyy-MM-dd') : ''}
                          onChange={e => setLocalCheckOut(e.target.value ? new Date(e.target.value) : undefined)}
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Nights</div>
                    <div className="font-medium">{nights}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Guests</div>
                    <div className="font-medium flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {guests}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guest Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Guest Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter email address"
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+251 9XX XXX XXX"
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Room rate ({nights} nights × {numRooms} room{numRooms > 1 ? 's' : ''})</span>
                    <span>{isNaN(subtotal) ? '—' : subtotal.toFixed(2)} {displayRoom.currency}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Taxes & fees</span>
                    <span>{isNaN(tax) ? '—' : tax.toFixed(2)} {displayRoom.currency}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-primary">{isNaN(total) ? '—' : total.toFixed(2)} {displayRoom.currency}</span>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-6 bg-primary rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-primary-foreground">{paymentMethod === 'chapa' ? 'C' : 'B'}</span>
                    </div>
                    <span className="font-medium">{paymentMethod === 'chapa' ? 'Chapa Payment' : 'Bank Transfer'}</span>
                  </div>
                  <div className="flex gap-2 mb-2">
                    <button
                      className={`px-3 py-1 rounded ${paymentMethod === 'chapa' ? 'bg-primary text-white' : 'bg-muted-foreground/10'}`}
                      onClick={() => setPaymentMethod('chapa')}
                      type="button"
                    >Chapa</button>
                    <button
                      className={`px-3 py-1 rounded ${paymentMethod === 'bank_transfer' ? 'bg-primary text-white' : 'bg-muted-foreground/10'}`}
                      onClick={() => setPaymentMethod('bank_transfer')}
                      type="button"
                    >Bank Transfer</button>
                  </div>
                  {paymentMethod === 'bank_transfer' && (
                    <div className="space-y-2 mt-2">
                      <div className="text-sm text-muted-foreground mb-2">
                        <strong>Bank Transfer Instructions:</strong><br />
                        Account Name: Hotel Booking Ltd<br />
                        Account Number: 1234567890<br />
                        Bank: Commercial Bank of Ethiopia<br />
                        Reference: Your booking reference
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Transaction ID</label>
                        <input
                          type="text"
                          className="w-full border rounded px-2 py-1"
                          value={transactionId}
                          onChange={e => setTransactionId(e.target.value)}
                          placeholder="Enter transaction ID"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Upload Screenshot</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleScreenshotChange}
                          className="w-full"
                        />
                        {screenshotFile && (
                          <span className="text-green-600 text-xs mt-1 block">{screenshotFile.name}</span>
                        )}
                      </div>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground mt-2">
                    Secure payment processing for Ethiopian customers
                  </p>
                </div>

                <Button 
                  onClick={handleChapaPayment}
                  disabled={!isFormValid || loading || uploading}
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  {loading || uploading ? "Processing..." : paymentMethod === 'chapa' ? `Pay ${isNaN(total) ? '—' : total.toFixed(2)} ${displayRoom.currency} with Chapa` : 'Submit Bank Transfer Payment'}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By booking, you agree to our terms and conditions. 
                  Your payment is secured by Chapa.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}