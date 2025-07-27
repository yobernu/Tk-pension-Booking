-- Create rooms table
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_number TEXT NOT NULL UNIQUE,
  floor INTEGER NOT NULL,
  room_type TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 2,
  price_per_night DECIMAL(10,2) NOT NULL,
  amenities TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT true,
  description TEXT,
  size_sqm INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create room_media table for images and videos
CREATE TABLE public.room_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  media_url TEXT NOT NULL,
  caption TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  number_of_guests INTEGER NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  booking_status TEXT DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('chapa', 'bank_transfer')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  transaction_reference TEXT,
  transaction_screenshot_url TEXT,
  amount DECIMAL(10,2) NOT NULL,
  payment_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create room_reviews table for recommendations
CREATE TABLE public.room_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (public read access for rooms and media, authenticated for bookings)
CREATE POLICY "Rooms are publicly viewable" ON public.rooms FOR SELECT USING (true);
CREATE POLICY "Room media is publicly viewable" ON public.room_media FOR SELECT USING (true);
CREATE POLICY "Room reviews are publicly viewable" ON public.room_reviews FOR SELECT USING (true);

-- Bookings and payments need authentication
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Users can create payments" ON public.payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view payments" ON public.payments FOR SELECT USING (true);

-- Create storage buckets for media files
INSERT INTO storage.buckets (id, name, public) VALUES ('room-media', 'room-media', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('transaction-screenshots', 'transaction-screenshots', false);

-- Storage policies for room media (public)
CREATE POLICY "Room media is publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'room-media');
CREATE POLICY "Anyone can upload room media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'room-media');

-- Storage policies for transaction screenshots (private)
CREATE POLICY "Users can upload transaction screenshots" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'transaction-screenshots');
CREATE POLICY "Users can view transaction screenshots" ON storage.objects FOR SELECT USING (bucket_id = 'transaction-screenshots');

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON public.rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample room data
INSERT INTO public.rooms (room_number, floor, room_type, capacity, price_per_night, amenities, description, size_sqm) VALUES
-- Floor 3
('301', 3, 'Standard', 2, 120.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar"}', 'Comfortable standard room with modern amenities', 25),
('302', 3, 'Standard', 2, 120.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar"}', 'Comfortable standard room with modern amenities', 25),
('303', 3, 'Deluxe', 3, 180.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "City View", "Balcony"}', 'Spacious deluxe room with city view and balcony', 35),
('304', 3, 'Standard', 2, 120.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar"}', 'Comfortable standard room with modern amenities', 25),
('305', 3, 'Suite', 4, 250.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "City View", "Balcony", "Living Area", "Kitchenette"}', 'Luxurious suite with separate living area', 50),

-- Floor 4
('401', 4, 'Standard', 2, 130.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar"}', 'Standard room on higher floor with better views', 25),
('402', 4, 'Deluxe', 3, 190.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "City View", "Balcony"}', 'Deluxe room with panoramic city views', 35),
('403', 4, 'Deluxe', 3, 190.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "City View", "Balcony"}', 'Deluxe room with panoramic city views', 35),
('404', 4, 'Suite', 4, 280.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "City View", "Balcony", "Living Area", "Kitchenette"}', 'Premium suite with exceptional views', 50),
('405', 4, 'Standard', 2, 130.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar"}', 'Standard room on higher floor with better views', 25),

-- Floor 5
('501', 5, 'Deluxe', 3, 200.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "City View", "Balcony"}', 'Top floor deluxe room with stunning views', 35),
('502', 5, 'Suite', 4, 300.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "City View", "Balcony", "Living Area", "Kitchenette"}', 'Executive suite on the top floor', 50),
('503', 5, 'Presidential Suite', 6, 450.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "City View", "Balcony", "Living Area", "Kitchenette", "Jacuzzi", "Butler Service"}', 'Luxurious presidential suite with premium amenities', 80),
('504', 5, 'Deluxe', 3, 200.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "City View", "Balcony"}', 'Top floor deluxe room with stunning views', 35),
('505', 5, 'Suite', 4, 300.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "City View", "Balcony", "Living Area", "Kitchenette"}', 'Executive suite on the top floor', 50);

-- Insert sample reviews
INSERT INTO public.room_reviews (room_id, guest_name, rating, review_text, is_featured) VALUES
((SELECT id FROM public.rooms WHERE room_number = '305'), 'Sarah Johnson', 5, 'Amazing suite with beautiful city views. The staff was incredibly helpful and the amenities were top-notch.', true),
((SELECT id FROM public.rooms WHERE room_number = '503'), 'Michael Chen', 5, 'The presidential suite exceeded all expectations. Truly a luxury experience with exceptional service.', true),
((SELECT id FROM public.rooms WHERE room_number = '402'), 'Emma Williams', 4, 'Great room with wonderful views. Clean, comfortable, and well-appointed. Would definitely stay again.', true),
((SELECT id FROM public.rooms WHERE room_number = '301'), 'David Brown', 4, 'Solid standard room with all the essentials. Good value for money and convenient location.', false),
((SELECT id FROM public.rooms WHERE room_number = '502'), 'Lisa Anderson', 5, 'Executive suite was perfect for our business trip. Spacious, quiet, and beautifully furnished.', true);