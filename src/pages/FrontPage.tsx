import React, { useEffect, useState } from "react";
import { 
  ChevronLeft, ChevronRight, Shield, Lock, Users, Eye, CheckCircle, 
  Zap, Globe, BarChart3, FileText, Award, Star
} from "lucide-react";
import FrontNavbar from "@/components/FrontNavbar";

type AttackDataPoint = { label: string; count: number };

const mockAttackData: AttackDataPoint[] = [
  { label: "Phishing", count: 42 },
  { label: "Malware", count: 31 },
  { label: "DDoS", count: 18 },
  { label: "Ransomware", count: 12 },
  { label: "Insider", count: 6 },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$29",
    period: "per user/month",
    description: "Perfect for small teams",
    features: ["Up to 5 users", "5GB storage per user", "Basic encryption", "Email support"],
    cta: "Start Free Trial",
    featured: false,
  },
  {
    name: "Professional",
    price: "$79",
    period: "per user/month",
    description: "For growing businesses",
    features: ["Unlimited users", "Unlimited storage", "Military-grade encryption", "Priority support", "Advanced audit logs"],
    cta: "Start Free Trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact sales",
    description: "For large organizations",
    features: ["Everything in Professional", "Custom integrations", "Dedicated support", "SLA guarantee", "On-premises option"],
    cta: "Contact Sales",
    featured: false,
  },
];

const trustedPartners = [
  "Microsoft", "Google Cloud", "AWS", "Adobe", "Salesforce", "Slack"
];

const FrontPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDarkMode] = useState(true);

  const carouselItems = [
    {
      title: "Secure File Sharing",
      description: "Share files with end-to-end encryption and access control",
      icon: Shield,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Military-Grade Encryption",
      description: "256-bit encryption ensuring your data is always protected",
      icon: Lock,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Granular Access Control",
      description: "Control who can access your files with detailed permissions",
      icon: Users,
      color: "from-pink-500 to-pink-600",
    },
    {
      title: "Audit Trails",
      description: "Track every action taken on your sensitive documents",
      icon: Eye,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Compliance Ready",
      description: "Meet regulatory requirements with our secure platform",
      icon: CheckCircle,
      color: "from-orange-500 to-orange-600",
    },
  ];

  const testimonials = [
    {
      name: "John Smith",
      company: "Tech Corp",
      content: "SecureShare revolutionized how we handle sensitive documents. Highly recommended!",
      rating: 5,
    },
    {
      name: "Sarah Johnson",
      company: "Finance Inc",
      content: "The security features are exceptional. Our compliance audits became much easier.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      company: "Legal Associates",
      content: "Best document sharing solution for law firms. The audit trails are invaluable.",
      rating: 5,
    },
    {
      name: "Emily Davis",
      company: "Healthcare Plus",
      content: "HIPAA compliant and user-friendly. Our patients trust us more now.",
      rating: 5,
    },
    {
      name: "Robert Wilson",
      company: "Enterprise Solutions",
      content: "Seamless integration with our workflows. Outstanding customer support too!",
      rating: 5,
    },
  ];

  const features = [
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "All files are encrypted before being sent to our servers",
    },
    {
      icon: Users,
      title: "Access Control",
      description: "Granular permissions for individual files and folders",
    },
    {
      icon: Eye,
      title: "Audit Logs",
      description: "Complete visibility into who accessed what and when",
    },
  ];

  // Auto-advance carousel every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);

  const CurrentIcon = carouselItems[currentSlide].icon;
  const bgClass = isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900";
  const cardBgClass = isDarkMode ? "bg-gray-800" : "bg-white";

  return (
    <div className={`${bgClass} transition-colors duration-300`}>
      <FrontNavbar isDarkMode={isDarkMode} />

      {/* Hero Section with CTA */}
      <section className={`relative w-full py-20 px-6 ${isDarkMode ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" : "bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700"} text-white overflow-hidden`}>
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-8 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Secure File Sharing for Modern Businesses
              </h1>
              <p className="text-xl opacity-90 mb-8 animate-fade-in">
                Protect your sensitive data with military-grade encryption, granular access controls, and complete audit visibility.
              </p>
        
            </div>
            <div className="hidden md:block animate-scale-in">
              <div className={`${isDarkMode ? "bg-gray-700/50 border-gray-600" : "bg-white/10 border-white/30"} backdrop-blur-md rounded-2xl p-8 border shadow-2xl transition-all duration-300 hover:shadow-3xl hover:scale-105`}>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span className="text-lg">256-bit AES encryption</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span className="text-lg">Real-time access control</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span className="text-lg">Complete audit trails</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span className="text-lg">GDPR & HIPAA compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Carousel Section */}
      <section className={`relative w-full h-96 overflow-hidden ${isDarkMode ? "bg-gray-800" : "bg-gradient-to-r from-blue-50 to-purple-50"}`}>
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Carousel Content with Animation */}
          <div className="text-center text-white z-10 px-6 animate-scale-in" key={`carousel-${currentSlide}`}>
            <div className={`bg-gradient-to-r ${carouselItems[currentSlide].color} rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg transform transition-transform duration-500 hover:scale-110`}>
              <CurrentIcon className="w-10 h-10" />
            </div>
            <h2 className="text-4xl font-bold mb-4 transition-all duration-500">{carouselItems[currentSlide].title}</h2>
            <p className="text-xl opacity-90 transition-all duration-500">{carouselItems[currentSlide].description}</p>
          </div>

          {/* Carousel Background with smooth transition */}
          <div className={`absolute inset-0 bg-gradient-to-r ${carouselItems[currentSlide].color} -z-10 transition-all duration-700`}></div>

          {/* Navigation Buttons with enhanced styling */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 text-white rounded-full p-3 transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 text-white rounded-full p-3 transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots with enhanced styling */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
            {carouselItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`rounded-full transition-all duration-300 transform hover:scale-150 ${
                  idx === currentSlide ? "bg-white w-8 h-2 shadow-lg" : "bg-white/50 w-2 h-2 hover:bg-white/75"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="stats" className={`py-16 px-6 ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-3xl font-bold mb-12 text-center animate-fade-in ${isDarkMode ? "text-white" : "text-gray-900"}`}>Current Cyber Threats</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {mockAttackData.map((attack, idx) => (
              <a
                key={attack.label}
                href="https://www.cybersecuritydive.com/" 
                target="_blank"
                rel="noopener noreferrer"
                className={`${cardBgClass} p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-2 border ${
                  isDarkMode ? "border-gray-700 hover:border-blue-500" : "border-gray-200 hover:border-blue-400"
                }`}
                style={{animationDelay: `${idx * 0.1}s`}}
              >
                <h3 className={`text-3xl font-bold mb-2 group-hover:text-blue-600 transition-colors duration-300 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{attack.count}</h3>
                <p className={`text-sm font-medium mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{attack.label} Attacks</p>
                <p className={`text-xs flex items-center gap-1 opacity-75 group-hover:opacity-100 transition-opacity ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>Read latest articles <span className="group-hover:translate-x-1 transition-transform">→</span></p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - Enhanced */}
      <section id="services" className={`py-20 px-6 ${bgClass}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Comprehensive Security Solutions</h2>
            <p className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Everything you need to share files securely and stay compliant
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const FeatureIcon = feature.icon;
              return (
                <div 
                  key={idx} 
                  className={`${cardBgClass} p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border group animate-fade-in ${
                    isDarkMode ? "border-gray-700 hover:border-blue-500 hover:bg-gray-700/50" : "border-gray-200 hover:border-blue-400 hover:bg-blue-50/30"
                  }`}
                  style={{animationDelay: `${idx * 0.1}s`}}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <FeatureIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{feature.title}</h3>
                  <p className={isDarkMode ? "text-gray-400 mb-4" : "text-gray-600 mb-4"}>{feature.description}</p>
                  <div className={`pt-4 border-t ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}>
                    <a href="#" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm group/link">
                      Learn more 
                      <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Laptop Mockup Section */}
      <section id="features" className={`py-16 px-6 ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-3xl font-bold mb-12 text-center animate-fade-in ${isDarkMode ? "text-white" : "text-gray-900"}`}>Experience SecureShare</h2>
          <div className={`${cardBgClass} rounded-2xl shadow-2xl overflow-hidden border-8 border-gray-400 hover:shadow-3xl transition-all duration-300`}>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-96 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-20 w-40 h-40 bg-white rounded-full mix-blend-multiply filter blur-2xl"></div>
              </div>
              <div className="text-center text-white px-8 relative z-10">
                <Shield className="w-16 h-16 mx-auto mb-4 animate-bounce" />
                <h3 className="text-2xl font-bold mb-2">Secure Document Management</h3>
                <p className="text-lg opacity-90">View all your shared documents in one secure dashboard</p>
              </div>
            </div>
            <div className={`p-8 ${isDarkMode ? "bg-gray-700" : "bg-white"}`}>
              <h4 className={`text-lg font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Key Features:</h4>
              <ul className="space-y-3">
                {["Real-time encryption", "Instant access revocation", "Detailed audit logs", "Team collaboration"].map((feature, idx) => (
                  <li key={idx} className={`flex items-center gap-3 transition-all duration-300 hover:translate-x-2 ${isDarkMode ? "text-gray-300 hover:text-blue-400" : "text-gray-900 hover:text-blue-600"}`}>
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Enhanced */}
      <section id="testimonials" className={`py-20 px-6 ${bgClass}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Trusted by Industry Leaders</h2>
            <p className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              See what our customers have to say about SecureShare
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {testimonials.map((testimonial, idx) => (
              <div 
                key={idx} 
                className={`${cardBgClass} p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border group animate-fade-in ${
                  isDarkMode ? "border-gray-700 hover:border-blue-500" : "border-gray-200 hover:border-blue-400"
                }`}
                style={{animationDelay: `${idx * 0.1}s`}}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400 transition-transform group-hover:scale-110" />
                  ))}
                </div>
                <p className={`mb-4 italic leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>"{testimonial.content}"</p>
                <div className="border-t" style={{borderColor: isDarkMode ? '#374151' : '#e5e7eb'}}></div>
                <p className={`font-bold text-sm mt-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{testimonial.name}</p>
                <p className={`text-xs group-hover:text-blue-500 transition-colors ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{testimonial.company}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - Enhanced */}
      <footer className={`${isDarkMode ? "bg-gray-900 border-t border-gray-800" : "bg-gray-900 border-t border-gray-800"} text-white py-16 px-6`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand / About */}
          <div className="animate-fade-in" id="about">
            <div className="flex items-center gap-2 mb-4 group cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold group-hover:text-blue-400 transition-colors">SecureShare</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">Enterprise-grade file sharing with military-grade encryption and complete compliance.</p>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Resources</h3>
            <ul className="space-y-3">
              {["Blog & Articles", "Security Reports", "Documentation", "API Reference", "Find a Partner"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group">
                    <span className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Solutions */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Support</h3>
            <ul className="space-y-3">
              {["Help Center", "Contact Support", "System Status", "Community Forum", "Send Feedback"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group">
                    <span className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Company</h3>
            <ul className="space-y-3">
              {["About Us", "Careers", "Press Kit", "Awards", "Trust Center"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group">
                    <span className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            {/* Social Links */}
            <div className="flex gap-3">
              {[
                { icon: "f", label: "Facebook" },
                { icon: "in", label: "LinkedIn" },
                { icon: "𝕏", label: "Twitter" },
                { icon: "📷", label: "Instagram" }
              ].map((social) => (
                <a 
                  key={social.label} 
                  href="#" 
                  title={social.label}
                  className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:border-blue-400 hover:text-blue-400 hover:bg-blue-400/10 transition-all duration-300 text-gray-400 hover:scale-110 active:scale-95"
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Removed footer language selector (navbar translate handles this) */}
          </div>

          {/* Bottom Links */}
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-6">
            <div className="flex gap-6 text-center md:text-left flex-wrap justify-center md:justify-start">
              {["Privacy Policy", "Terms of Service", "Security", "Compliance", "Accessibility"].map((link) => (
                <a key={link} href="#" className="hover:text-blue-400 transition-colors duration-300">
                  {link}
                </a>
              ))}
            </div>
            <p className="flex items-center gap-2">
              <span className="text-blue-400">©</span> 2025 SecureShare. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FrontPage;
