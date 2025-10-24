import { Shield, Users, Award, Heart } from 'lucide-react';
import aboutBg from '@/assets/about-bg.jpg';
import { useTheme } from 'next-themes';

const About = () => {
  const { theme } = useTheme();
  const values = [
    {
      icon: Shield,
      title: 'Trust & Safety',
      description: 'We prioritize your safety with thoroughly inspected and maintained vehicles.',
    },
    {
      icon: Users,
      title: 'Customer First',
      description: 'Your satisfaction is our top priority. We go the extra mile for you.',
    },
    {
      icon: Award,
      title: 'Quality Service',
      description: 'Award-winning service with a track record of excellence since 2010.',
    },
    {
      icon: Heart,
      title: 'Passion for Cars',
      description: 'We love what we do and it shows in every interaction.',
    },
  ];

  const stats = [
    { number: '50K+', label: 'Happy Customers' },
    { number: '500+', label: 'Premium Vehicles' },
    { number: '100+', label: 'Locations' },
    { number: '15+', label: 'Years of Excellence' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div
        className="relative py-32 overflow-hidden"
        style={{
          backgroundImage: theme === 'light' 
            ? `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(${aboutBg})`
            : `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.5)), url(${aboutBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className={`text-5xl md:text-6xl font-bold mb-6 animate-fade-in ${
            theme === 'light' ? 'text-foreground' : 'text-white'
          }`}>About LuxeDrive</h1>
          <p className={`text-xl max-w-3xl mx-auto animate-fade-in-up ${
            theme === 'light' ? 'text-muted-foreground' : 'text-white/90'
          }`}>
            Your trusted partner in premium car rentals since 2010. We make car rental simple, affordable, and enjoyable.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            At DriveNow, we're committed to providing exceptional car rental experiences that exceed expectations. 
            We believe that renting a car should be as exciting as the journey itself. Our mission is to make 
            premium vehicles accessible to everyone while maintaining the highest standards of service, safety, and reliability.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-secondary/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The principles that guide everything we do
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="text-center p-6 bg-card rounded-xl border border-border hover:shadow-lg transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <value.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-secondary/50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Our Story</h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                Founded in 2010, DriveNow started with a simple vision: to revolutionize the car rental industry 
                by putting customers first. What began as a small operation with just 10 vehicles has grown into 
                a trusted name with over 500 premium vehicles across 100+ locations.
              </p>
              <p>
                Our journey has been driven by innovation, dedication, and an unwavering commitment to excellence. 
                We've invested heavily in technology to make booking seamless, expanded our fleet to include the 
                latest models, and built a team of passionate professionals who share our vision.
              </p>
              <p>
                Today, we're proud to serve over 50,000 satisfied customers annually, but we're not stopping there. 
                We continue to evolve, embracing sustainable practices and cutting-edge technology to provide you 
                with the best car rental experience possible.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
