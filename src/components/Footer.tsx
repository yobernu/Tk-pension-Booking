import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Network } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTiktok } from '@fortawesome/free-brands-svg-icons';

const iconMap: Record<string, any> = {
  Facebook,
  Instagram,
  Twitter,
  Network,
  TikTok: (props: any) => <FontAwesomeIcon icon={faTiktok} {...props} />, // TikTok icon
  Mail,
  Phone,
  MapPin,
};

const defaultSocialLinks = [
  { icon: "Facebook", href: "#", label: "Facebook" },
  { icon: "Instagram", href: "#", label: "Instagram" },
  { icon: "Twitter", href: "#", label: "Twitter" },
];

const defaultContactInfo = [
  {
    icon: "MapPin",
    title: "Address",
    details: ["123 Bole Road", "Addis Ababa, Ethiopia"],
  },
  {
    icon: "Phone",
    title: "Phone",
    details: ["+251 11 123 4567"],
  },
  {
    icon: "Mail",
    title: "Email",
    details: ["info@habeshahotel.com"],
  },
];

const Footer = () => {
  const [socialLinks, setSocialLinks] = useState(defaultSocialLinks);
  const [contactInfo, setContactInfo] = useState(defaultContactInfo);

  useEffect(() => {
    // Fetch social links
    const fetchSocialLinks = async () => {
      const { data, error } = await (supabase as any)
        .from("social_links")
        .select("icon, href, label");
      if (!error && Array.isArray(data) && data.length > 0) {
        setSocialLinks(data);
      }
    };
    // Fetch contact info
    const fetchContactInfo = async () => {
      const { data, error } = await (supabase as any)
        .from("contact_info")
        .select("icon, title, details");
      if (!error && Array.isArray(data) && data.length > 0) {
        setContactInfo(data);
      }
    };
    fetchSocialLinks();
    fetchContactInfo();
  }, []);

  const quickLinks = [
    { label: "Rooms & Suites", href: "#rooms" },
    { label: "About Us", href: "#about" },
    { label: "Contact", href: "#contact" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ];

  return (
    <footer className="bg-luxury-navy text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Hotel Info */}
          <div>
            <h3 className="text-2xl font-bold text-luxury-gold mb-4">
              T-K Pension
            </h3>
            <p className="text-white/80 mb-6 leading-relaxed">
              Experience hospitality with modern luxury. 
              Your comfort is our priority.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map(({ icon, href, label }) => {
                const Icon = iconMap[icon] || Facebook;
                return (
                  <a
                    key={label}
                    href={href}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-luxury-gold hover:text-luxury-navy transition-luxury"
                    aria-label={label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-luxury-gold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/80 hover:text-luxury-gold transition-smooth"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-luxury-gold mb-4">
              Contact Info
            </h4>
            <div className="space-y-3">
              {contactInfo.map(({ icon, title, details }, idx) => {
                const Icon = iconMap[icon] || MapPin; // Changed from Info to MapPin for consistency
                return (
                  <div key={title + idx} className="flex items-center gap-3 text-white/80">
                    <Icon className="w-5 h-5 text-luxury-gold flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-white">{title}</p>
                      {details.map((detail, i) => (
                        <p key={i}>{detail}</p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hotel Stats */}
          <div>
            <h4 className="text-lg font-semibold text-luxury-gold mb-4">
              Hotel Features
            </h4>
            <div className="space-y-4">
              <Card className="bg-white/10 border-white/20 p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-luxury-gold mb-1">33</div>
                  <div className="text-sm text-white/80">Premium Rooms</div>
                </div>
              </Card>
              <Card className="bg-white/10 border-white/20 p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-luxury-gold mb-1">3★</div>
                  <div className="text-sm text-white/80">Luxury Service</div>
                </div>
              </Card>
              <Card className="bg-white/10 border-white/20 p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-luxury-gold mb-1">24/7</div>
                  <div className="text-sm text-white/80">Room Service</div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-white/20" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-white/60 text-sm">
            © 2024 TK-Pension. All rights reserved.
          </div>
          <div className="flex items-center gap-3 text-white/60 text-sm">
            <span>Wanna find the Programmer?</span>
            <a
              href="https://www.linkedin.com/in/your-linkedin-profile" // <-- Replace with your LinkedIn URL
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-luxury-gold transition-colors"
            >
              <svg className="w-5 h-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/>
              </svg>
            </a>
            <a
              href="mailto:info@habeshahotel.com" // <-- Replace with your email
              aria-label="Email"
              className="hover:text-luxury-gold transition-colors"
            >
              <Mail className="w-5 h-5 inline-block" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

