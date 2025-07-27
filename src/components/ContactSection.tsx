import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Clock, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const iconMap: Record<string, any> = {
  Phone,
  Mail,
  MapPin,
  Clock,
  Info, // add this line
};

type ContactInfo = {
  id: string;
  icon: string;
  title: string;
  details: string[];
  sort_order: number;
};

const ContactSection = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Extract phone number from contactInfo
  const phoneInfo = contactInfo.find((info) => info.title === "Phone");
  const phoneNumber = phoneInfo && phoneInfo.details.length > 0 ? phoneInfo.details[0] : "+251111234567";
  // Clean up phone number for tel: link (remove spaces, dashes, etc)
  const phoneHref = `tel:${phoneNumber.replace(/[^\d+]/g, "")}`;

  // Fetch contact info from Supabase
  useEffect(() => {
    const fetchContactInfo = async () => {
      const { data, error } = await (supabase as any)
        .from("contact_info")
        .select("*")
        .order("sort_order", { ascending: true });
      if (!error) setContactInfo(data || []);
      setLoading(false);
    };
    fetchContactInfo();
  }, []);

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await (supabase as any)
      .from("contact_messages")
      .insert([{
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        phone: form.phone,
        check_in: form.checkIn || null,
        check_out: form.checkOut || null,
        message: form.message,
      }]);
    setSubmitting(false);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Message Sent",
        description: "Thank you for contacting us! We'll get back to you soon.",
      });
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        checkIn: "",
        checkOut: "",
        message: "",
      });
    }
  };

  return (
    <section className="py-20 bg-luxury-navy text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Contact Us
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Ready to experience Ethiopian hospitality? Get in touch with us for reservations 
            or any inquiries about your stay.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-bold mb-8 text-luxury-gold">
              Get in Touch
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {loading ? (
                <div className="col-span-2 text-center">Loading...</div>
              ) : (
                contactInfo.map(({ id, icon, title, details }) => {
                  const Icon = iconMap[icon] || Info;
                  return (
                    <Card key={id} className="bg-white/10 border-white/20 text-white">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-luxury-gold flex items-center justify-center">
                            <Icon className="w-5 h-5 text-luxury-navy" />
                          </div>
                          <h4 className="font-semibold text-luxury-gold">{title}</h4>
                        </div>
                        {details.map((detail, index) => (
                          <p key={index} className="text-white/80 text-sm">
                            {detail}
                          </p>
                        ))}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
            {/* Quick Booking Info (optional, can be made dynamic too) */}
            <Card className="bg-luxury-gold text-luxury-navy shadow-gold">
              <CardContent className="p-6">
                <h4 className="font-bold text-xl mb-4">Quick Booking</h4>
                <p className="mb-4">
                  Call us directly for immediate reservations and special requests.
                </p>
                <Button 
                  variant="outline" 
                  className="border-luxury-navy text-luxury-navy hover:bg-luxury-navy hover:text-white"
                  asChild
                >
                  <a href={phoneHref}>Call Now: {phoneNumber}</a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="bg-white text-luxury-navy shadow-luxury">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" value={form.firstName} onChange={handleChange} placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={form.lastName} onChange={handleChange} placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={form.email} onChange={handleChange} placeholder="john.doe@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+251 9XX XXX XXX" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="checkIn">Preferred Check-in</Label>
                    <Input id="checkIn" type="date" value={form.checkIn} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checkOut">Preferred Check-out</Label>
                    <Input id="checkOut" type="date" value={form.checkOut} onChange={handleChange} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Please let us know about any special requirements or questions..."
                    className="min-h-[120px]"
                  />
                </div>
                <Button className="w-full bg-luxury-navy hover:bg-luxury-navy/90 text-white shadow-soft" disabled={submitting}>
                  {submitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;