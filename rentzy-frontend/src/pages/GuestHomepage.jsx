import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/lavi.svg';

const GuestHomepage = () => {
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    budget: '',
    gender: '',
    type: ''
  });

  const handleSearchChange = (field, value) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const featuredProperties = [
    {
      id: 1,
      name: "Green Valley PG",
      location: "Civil Lines, Kanpur",
      price: "₹8,000",
      period: "month",
      amenities: ["WiFi", "Meals", "AC", "Laundry"],
      rating: 4.5,
      image: "/api/placeholder/400/250"
    },
    {
      id: 2,
      name: "Students Paradise Hostel",
      location: "Kakadeo, Kanpur",
      price: "₹6,500",
      period: "month",
      amenities: ["WiFi", "Meals", "Study Room", "Security"],
      rating: 4.8,
      image: "/api/placeholder/400/250"
    },
    {
      id: 3,
      name: "Professional Stay PG",
      location: "Swaroop Nagar, Kanpur",
      price: "₹12,000",
      period: "month",
      amenities: ["WiFi", "AC", "Gym", "Parking"],
      rating: 4.6,
      image: "/api/placeholder/400/250"
    }
  ];

  const testimonials = [
    {
      name: "Ananya Singh",
      role: "MBA Student, IIM Lucknow",
      text: "Rentzy made finding a safe PG in Kanpur so easy! The verification process gave me confidence.",
      rating: 5,
      avatar: "/api/placeholder/60/60"
    },
    {
      name: "Vikash Kumar",
      role: "Software Engineer",
      text: "Professional accommodations with all amenities. Great platform for working professionals!",
      rating: 5,
      avatar: "/api/placeholder/60/60"
    },
    {
      name: "Shreya Gupta",
      role: "Medical Student",
      text: "Found the perfect girls PG near my college. Highly recommend Rentzy for students!",
      rating: 5,
      avatar: "/api/placeholder/60/60"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      
      {/* Hero Section with Curved Design */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-90"></div>
        <div className="absolute inset-0 bg-black opacity-20"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white opacity-10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-yellow-300 opacity-20 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 px-6 py-20 lg:py-32">
          <div className="max-w-7xl mx-auto text-center">
            {/* Logo Section */}
            <div className="flex justify-center items-center mb-8">
              <img 
                src={Logo} 
                alt="Rentzy Logo" 
                className="h-16 w-16 filter brightness-0 invert"
              />
              <div className="ml-4">
                <h1 className="text-4xl lg:text-5xl font-black text-white">
                  Rent<span className="text-yellow-300">zy</span>
                </h1>
                <p className="text-purple-200 text-sm font-medium tracking-wider">KANPUR</p>
              </div>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              Your Dream PG & Hostel
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                Awaits in Kanpur
              </span>
            </h2>
            
            <p className="text-xl lg:text-2xl text-purple-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover premium accommodations tailored for students and professionals. 
              Safe, comfortable, and affordable living spaces in the heart of Kanpur.
            </p>

            {/* Enhanced Search Card */}
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl max-w-5xl mx-auto border border-white/20">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-1">
                  <label className="block text-sm font-bold text-gray-700 mb-3">📍 Location</label>
                  <select 
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-700 font-medium"
                    value={searchFilters.location}
                    onChange={(e) => handleSearchChange('location', e.target.value)}
                  >
                    <option value="">Choose Area</option>
                    <option value="civil-lines">Civil Lines</option>
                    <option value="kakadeo">Kakadeo</option>
                    <option value="swaroop-nagar">Swaroop Nagar</option>
                    <option value="govind-nagar">Govind Nagar</option>
                    <option value="kalyanpur">Kalyanpur</option>
                  </select>
                </div>
                
                <div className="lg:col-span-1">
                  <label className="block text-sm font-bold text-gray-700 mb-3">💰 Budget</label>
                  <select 
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-700 font-medium"
                    value={searchFilters.budget}
                    onChange={(e) => handleSearchChange('budget', e.target.value)}
                  >
                    <option value="">Select Range</option>
                    <option value="3000-6000">₹3,000 - ₹6,000</option>
                    <option value="6000-10000">₹6,000 - ₹10,000</option>
                    <option value="10000-15000">₹10,000 - ₹15,000</option>
                    <option value="15000+">₹15,000+</option>
                  </select>
                </div>
                
                <div className="lg:col-span-1">
                  <label className="block text-sm font-bold text-gray-700 mb-3">👥 Gender</label>
                  <select 
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-700 font-medium"
                    value={searchFilters.gender}
                    onChange={(e) => handleSearchChange('gender', e.target.value)}
                  >
                    <option value="">Select Type</option>
                    <option value="boys">Boys Only</option>
                    <option value="girls">Girls Only</option>
                    <option value="co-ed">Co-ed</option>
                  </select>
                </div>
                
                <div className="lg:col-span-1">
                  <label className="block text-sm font-bold text-gray-700 mb-3">🏠 Type</label>
                  <select 
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-700 font-medium"
                    value={searchFilters.type}
                    onChange={(e) => handleSearchChange('type', e.target.value)}
                  >
                    <option value="">Choose Type</option>
                    <option value="pg">PG</option>
                    <option value="hostel">Hostel</option>
                    <option value="flat">Shared Flat</option>
                  </select>
                </div>
                
                <div className="lg:col-span-1 flex items-end">
                  <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    🔍 Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Curved Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-20 fill-white">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section with Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Rentzy?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the difference with Kanpur's most trusted accommodation platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "🛡️",
                title: "100% Verified",
                description: "Every property is personally inspected and verified for safety and quality standards."
              },
              {
                icon: "💸",
                title: "Zero Brokerage",
                description: "Connect directly with property owners. No hidden fees or commission charges."
              },
              {
                icon: "⚡",
                title: "Instant Booking",
                description: "Book your perfect accommodation in minutes with our streamlined process."
              },
              {
                icon: "🎧",
                title: "24/7 Support",
                description: "Round-the-clock customer support to assist you with any queries or issues."
              }
            ].map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 transform hover:-translate-y-2">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties with Modern Cards */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Properties</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked premium accommodations just for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <div key={property.id} className="group">
                <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-purple-200 transform hover:-translate-y-3">
                  <div className="relative overflow-hidden">
                    <img 
                      src={property.image} 
                      alt={property.name}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-sm font-bold text-gray-700">{property.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{property.name}</h3>
                    <p className="text-gray-600 mb-4 flex items-center">
                      <span className="mr-2">📍</span>
                      {property.location}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-3xl font-bold text-purple-600">{property.price}</span>
                        <span className="text-gray-500">/{property.period}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {property.amenities.map((amenity, index) => (
                        <span key={index} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium border border-purple-200">
                          {amenity}
                        </span>
                      ))}
                    </div>
                    
                    <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-10 py-4 rounded-xl hover:from-gray-900 hover:to-black transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Explore All Properties →
            </button>
          </div>
        </div>
      </section>

      {/* How It Works - Creative Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get your perfect accommodation in just 3 simple steps
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-400 to-pink-400 rounded-full hidden lg:block"></div>
            
            <div className="space-y-16">
              {[
                {
                  step: "01",
                  title: "Search & Filter",
                  description: "Use our advanced filters to find PGs and hostels that match your preferences, budget, and location in Kanpur.",
                  icon: "🔍",
                  position: "left"
                },
                {
                  step: "02",
                  title: "Compare & Review",
                  description: "Compare different properties, check amenities, read reviews from other residents, and view detailed photos.",
                  icon: "⚖️",
                  position: "right"
                },
                {
                  step: "03",
                  title: "Book Instantly",
                  description: "Secure your accommodation with our instant booking system. Move in hassle-free with verified properties.",
                  icon: "🎯",
                  position: "left"
                }
              ].map((item, index) => (
                <div key={index} className={`flex items-center ${item.position === 'right' ? 'lg:flex-row-reverse' : ''}`}>
                  <div className={`w-full lg:w-5/12 ${item.position === 'right' ? 'lg:text-right' : ''}`}>
                    <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <div className="text-4xl mr-4">{item.icon}</div>
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                          STEP {item.step}
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className="hidden lg:flex w-2/12 justify-center">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                  
                  <div className="hidden lg:block w-5/12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials with Modern Design */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Users Say</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied students and professionals who found their perfect home
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group">
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 transform hover:-translate-y-2">
                  <div className="flex items-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">⭐</span>
                    ))}
                  </div>
                  
                  <p className="text-gray-700 mb-6 italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  
                  <div className="flex items-center">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <p className="font-bold text-gray-900">{testimonial.name}</p>
                      <p className="text-purple-600 text-sm font-medium">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white opacity-10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-yellow-300 opacity-20 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Find Your Perfect Home?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students and professionals who have found their ideal accommodation through Rentzy
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            
            
          </div>
        </div>
      </section>
    </div>
  );
};

export default GuestHomepage;
