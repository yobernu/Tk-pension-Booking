import { Card, CardContent } from "@/components/ui/card";
import { Award, MapPin, Clock, Phone } from "lucide-react";
import hotelExterior from "/assets/hero-room.png";

const AboutSection = () => {
  const features = [
    {
      icon: Award,
      title: "Best - Service",
      description: "Exceptional hospitality with warm Standards"
    },
    {
      icon: MapPin,
      title: "Prime Location",
      description: "Located in the heart of the city with easy access to major attractions and infront of Bezabih-Petros Square"
    },
    {
      icon: Clock,
      title: "24/7 Service",
      description: "Round-the-clock front desk, room service, and guest assistance"
    },
    {
      icon: Phone,
      title: "Concierge",
      description: "Personalized recommendations and booking assistance for local experiences"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-luxury-navy mb-6">
              Welcome to T-K Pension
            </h2>
            <p className="text-xl text-rich-charcoal/80 mb-8 leading-relaxed">
              Experience the perfect blend of hospitality and modern luxury. 
              Our Pension features 24 beautifully appointed single-bed rooms across three floors, 
              each designed to provide comfort and tranquility for Your stay.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {features.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-luxury-gold/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-luxury-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-luxury-navy mb-2">{title}</h3>
                    <p className="text-rich-charcoal/70 text-sm">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Card className="bg-luxury-navy text-white shadow-luxury">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Hotel Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-luxury-gold font-medium">Total Rooms:</span>
                    <p>24 Single Bed Rooms</p>
                  </div>
                  <div>
                    <span className="text-luxury-gold font-medium">Floors:</span>
                    <p>3rd, 4th & 5th Floor</p>
                  </div>
                  <div>
                    <span className="text-luxury-gold font-medium">Room Size:</span>
                    <p>25 sqm each</p>
                  </div>
                  <div>
                    <span className="text-luxury-gold font-medium">Price:</span>
                    <p>600 Birr per night</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-luxury">
              <img 
                src={hotelExterior} 
                alt="T-K Pension Exterior"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-navy/20 to-transparent"></div>
            </div>
            
            {/* Floating Stats */}
            <Card className="absolute -bottom-8 -left-8 bg-white shadow-gold">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-luxury-gold mb-2">3★</div>
                <div className="text-sm text-luxury-navy font-medium">Luxury Rating</div>
              </CardContent>
            </Card>
            
            <Card className="absolute -top-8 -right-8 bg-luxury-gold shadow-luxury">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-luxury-navy mb-2">24</div>
                <div className="text-sm text-luxury-navy font-medium">Premium Rooms</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;