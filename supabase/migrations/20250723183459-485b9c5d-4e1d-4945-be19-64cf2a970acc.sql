-- First, clear existing room data
DELETE FROM public.room_reviews;
DELETE FROM public.room_media;
DELETE FROM public.rooms;

-- Insert the 33 single-bed rooms as specified
-- Floor 3: Rooms 300-310 (11 rooms)
INSERT INTO public.rooms (room_number, floor, room_type, capacity, price_per_night, amenities, description, size_sqm) VALUES
('300', 3, 'Single Bed', 1, 150.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Work Desk"}', 'Comfortable single-bed room with modern amenities and work space', 25),
('301', 3, 'Single Bed', 1, 150.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Work Desk"}', 'Comfortable single-bed room with modern amenities and work space', 25),
('302', 3, 'Single Bed', 1, 150.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Work Desk"}', 'Comfortable single-bed room with modern amenities and work space', 25),
('303', 3, 'Single Bed', 1, 150.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Work Desk"}', 'Comfortable single-bed room with modern amenities and work space', 25),
('304', 3, 'Single Bed', 1, 150.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Work Desk"}', 'Comfortable single-bed room with modern amenities and work space', 25),
('305', 3, 'Single Bed', 1, 150.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Work Desk"}', 'Comfortable single-bed room with modern amenities and work space', 25),
('306', 3, 'Single Bed', 1, 150.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Work Desk"}', 'Comfortable single-bed room with modern amenities and work space', 25),
('307', 3, 'Single Bed', 1, 150.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Work Desk"}', 'Comfortable single-bed room with modern amenities and work space', 25),
('308', 3, 'Single Bed', 1, 150.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Work Desk"}', 'Comfortable single-bed room with modern amenities and work space', 25),
('309', 3, 'Single Bed', 1, 150.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Work Desk"}', 'Comfortable single-bed room with modern amenities and work space', 25),
('310', 3, 'Single Bed', 1, 150.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Work Desk"}', 'Comfortable single-bed room with modern amenities and work space', 25),

-- Floor 4: Rooms 400-410 (11 rooms) - Enhanced amenities
('400', 4, 'Single Bed', 1, 150.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Work Desk", "City View", "Coffee Machine"}', 'Single-bed room with city views and premium amenities', 25),
('401', 4, 'Single Bed', 1, 150.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Work Desk", "City View", "Coffee Machine"}', 'Single-bed room with city views and premium amenities', 25),
('402', 4, 'Single Bed', 1, 150.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Work Desk", "City View", "Coffee Machine"}', 'Single-bed room with city views and premium amenities', 25),
('403', 4, 'Single Bed', 1, 150.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Work Desk", "City View", "Coffee Machine"}', 'Single-bed room with city views and premium amenities', 25),
('404', 4, 'Single Bed', 1, 150.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Work Desk", "City View", "Coffee Machine"}', 'Single-bed room with city views and premium amenities', 25),
('405', 4, 'Single Bed', 1, 150.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Work Desk", "City View", "Coffee Machine"}', 'Single-bed room with city views and premium amenities', 25),
('406', 4, 'Single Bed', 1, 150.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Work Desk", "City View", "Coffee Machine"}', 'Single-bed room with city views and premium amenities', 25),
('407', 4, 'Single Bed', 1, 150.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Work Desk", "City View", "Coffee Machine"}', 'Single-bed room with city views and premium amenities', 25),
('408', 4, 'Single Bed', 1, 150.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Work Desk", "City View", "Coffee Machine"}', 'Single-bed room with city views and premium amenities', 25),
('409', 4, 'Single Bed', 1, 150.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Work Desk", "City View", "Coffee Machine"}', 'Single-bed room with city views and premium amenities', 25),
('410', 4, 'Single Bed', 1, 150.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Work Desk", "City View", "Coffee Machine"}', 'Single-bed room with city views and premium amenities', 25),

-- Floor 5: Rooms 500-510 (11 rooms) - Premium amenities
('500', 5, 'Single Bed', 1, 150.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Work Desk", "City View", "Coffee Machine", "Balcony", "Premium Toiletries"}', 'Premium single-bed room with balcony and luxury amenities', 25),
('501', 5, 'Single Bed', 1, 150.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Work Desk", "City View", "Coffee Machine", "Balcony", "Premium Toiletries"}', 'Premium single-bed room with balcony and luxury amenities', 25),
('502', 5, 'Single Bed', 1, 150.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Work Desk", "City View", "Coffee Machine", "Balcony", "Premium Toiletries"}', 'Premium single-bed room with balcony and luxury amenities', 25),
('503', 5, 'Single Bed', 1, 150.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Work Desk", "City View", "Coffee Machine", "Balcony", "Premium Toiletries"}', 'Premium single-bed room with balcony and luxury amenities', 25),
('504', 5, 'Single Bed', 1, 150.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Work Desk", "City View", "Coffee Machine", "Balcony", "Premium Toiletries"}', 'Premium single-bed room with balcony and luxury amenities', 25),
('505', 5, 'Single Bed', 1, 150.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Work Desk", "City View", "Coffee Machine", "Balcony", "Premium Toiletries"}', 'Premium single-bed room with balcony and luxury amenities', 25),
('506', 5, 'Single Bed', 1, 150.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Work Desk", "City View", "Coffee Machine", "Balcony", "Premium Toiletries"}', 'Premium single-bed room with balcony and luxury amenities', 25),
('507', 5, 'Single Bed', 1, 150.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Work Desk", "City View", "Coffee Machine", "Balcony", "Premium Toiletries"}', 'Premium single-bed room with balcony and luxury amenities', 25),
('508', 5, 'Single Bed', 1, 150.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Work Desk", "City View", "Coffee Machine", "Balcony", "Premium Toiletries"}', 'Premium single-bed room with balcony and luxury amenities', 25),
('509', 5, 'Single Bed', 1, 150.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Work Desk", "City View", "Coffee Machine", "Balcony", "Premium Toiletries"}', 'Premium single-bed room with balcony and luxury amenities', 25),
('510', 5, 'Single Bed', 1, 150.00, '{"Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Work Desk", "City View", "Coffee Machine", "Balcony", "Premium Toiletries"}', 'Premium single-bed room with balcony and luxury amenities', 25);

-- Insert sample room media for some rooms
INSERT INTO public.room_media (room_id, media_type, media_url, caption, is_primary) VALUES
((SELECT id FROM public.rooms WHERE room_number = '305'), 'image', '/assets/hero-room.jpg', 'Modern single-bed room with work desk', true),
((SELECT id FROM public.rooms WHERE room_number = '405'), 'image', '/assets/hotel-exterior.jpg', 'City view from fourth floor', true),
((SELECT id FROM public.rooms WHERE room_number = '505'), 'image', '/assets/hero-room.jpg', 'Premium room with balcony', true);

-- Insert sample reviews
INSERT INTO public.room_reviews (room_id, guest_name, rating, review_text, is_featured) VALUES
((SELECT id FROM public.rooms WHERE room_number = '305'), 'Sarah Johnson', 5, 'Perfect single room for business trips. Clean, comfortable, and well-equipped work space.', true),
((SELECT id FROM public.rooms WHERE room_number = '405'), 'Michael Chen', 4, 'Great city views and excellent amenities. The coffee machine was a nice touch.', true),
((SELECT id FROM public.rooms WHERE room_number = '505'), 'Emma Williams', 5, 'Beautiful room with balcony. Premium toiletries and service exceeded expectations.', true),
((SELECT id FROM public.rooms WHERE room_number = '302'), 'David Brown', 4, 'Good value for money. Room was clean and comfortable for my stay.', false),
((SELECT id FROM public.rooms WHERE room_number = '408'), 'Lisa Anderson', 5, 'Loved the city view and modern amenities. Will definitely book again.', true);