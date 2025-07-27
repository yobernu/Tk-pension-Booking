import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import RoomGrid from "@/components/RoomGrid";
import BookingForm from "@/components/BookingForm";
import RoomGallery from "@/components/RoomGallery";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <section id="home">
          <HeroSection />
        </section>
        <section id="rooms">
          <RoomGrid />
        </section>
        <section id="gallery">
          <RoomGallery />
        </section>
        <section id="booking">
          <BookingForm />
        </section>
        <section id="about">
          <AboutSection />
        </section>
        <section id="contact">
          <ContactSection />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
