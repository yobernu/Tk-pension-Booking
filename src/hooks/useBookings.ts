import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Booking {
  id?: string;
  room_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  total_amount: number;
  booking_status?: string;
}

export function useBookings() {
  const [loading, setLoading] = useState(false);

  const createBooking = async (booking: Booking) => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('bookings')
        .insert([booking])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Booking Created",
        description: "Your booking has been created successfully!",
      });

      return data;
    } catch (err) {
      console.error('Error creating booking:', err);
      toast({
        title: "Booking Failed",
        description: err instanceof Error ? err.message : "Failed to create booking. Please try again.",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async (roomId: string, checkIn: string, checkOut: string) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('id')
        .eq('room_id', roomId)
        .eq('booking_status', 'confirmed')
        .or(`and(check_in_date.lte.${checkOut},check_out_date.gte.${checkIn})`);

      if (error) throw error;

      return data.length === 0; // Available if no overlapping bookings
    } catch (err) {
      console.error('Error checking availability:', err);
      return false;
    }
  };

  return { createBooking, checkAvailability, loading };
}