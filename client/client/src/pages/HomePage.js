import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Brain, 
  Search, 
  FileText, 
  Users, 
  Zap, 
  Shield, 
  MessageCircle,
  Bot,
  Sparkles,
  Database,
  Lock,
  CheckCircle,
  Play,
  Star,
  TrendingUp
} from 'lucide-react';

const HomePage = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description: "Leverage Google Gemini AI for automatic document summarization, intelligent tagging, and semantic search capabilities that understand context and meaning.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Search,
      title: "Advanced Semantic Search",
      description: "Find documents instantly with both traditional text search and advanced semantic search powered by AI embeddings for precise results.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: MessageCircle,
      title: "Intelligent Q&A System",
      description: "Ask questions about your knowledge base and get intelligent answers from AI using your team's documents as comprehensive context.",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: Users,
      title: "Team Collaboration Hub",
      description: "Work together seamlessly with role-based access control, document versioning, and real-time team activity feeds.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Enterprise-grade security with JWT authentication, role-based permissions, and secure document management protocols.",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: Zap,
      title: "Smart Automation",
      description: "Automatically generate summaries and tags for your documents, saving time and improving organization across your knowledge base.",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const stats = [
    { number: "99.9%", label: "Uptime", icon: TrendingUp },
    { number: "<2s", label: "Search Speed", icon: Zap },
    { number: "∞", label: "Documents", icon: Database },
    { number: "24/7", label: "AI Assistant", icon: Bot }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Manager",
      company: "TechCorp",
      content: "Transformed our knowledge management. The AI search finds exactly what we need in seconds.",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "Engineering Lead",
      company: "InnovateLab",
      content: "The Q&A feature is incredible. It's like having an expert who knows all our documentation.",
      rating: 5
    },
    {
      name: "Emma Thompson",
      role: "Operations Director",
      company: "ScaleUp Inc",
      content: "Cut our documentation time by 60%. The auto-summarization is a game-changer.",
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50" style={{ fontFamily: "'Inter', 'SF Pro Display', -apple-system, system-ui, sans-serif" }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative w-11 h-11">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-lg"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg animate-pulse opacity-75"></div>
                <div className="relative w-full h-full flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  KnowledgeHub
                </span>
                <span className="text-xs font-semibold text-gray-500 block -mt-1 tracking-wider">
                  AI POWERED
                </span>
              </div>
            </Link>
            
            <div className="flex items-center space-x-6">
              <Link 
                to="/login"
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 text-sm"
              >
                Sign In
              </Link>
              <button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold text-sm shadow-md"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative overflow-hidden pt-24 pb-32">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className={`inline-flex items-center px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-full text-sm font-semibold mb-8 shadow-sm transform transition-all duration-1000 ${isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <Sparkles className="w-4 h-4 mr-2 text-indigo-600" />
              Powered by Google Gemini AI
              <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            
            <h1 className={`text-6xl md:text-8xl font-black text-gray-900 mb-8 leading-tight tracking-tight transform transition-all duration-1000 delay-200 ${isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              Your Team's
              <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mt-2">
                AI Brain
              </span>
            </h1>
            
            <p className={`text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed font-medium transform transition-all duration-1000 delay-400 ${isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              Transform knowledge into intelligence. Create, search, and discover insights 
              with AI that understands your team's collective wisdom.
            </p>
            
            <div className={`flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 transform transition-all duration-1000 delay-600 ${isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <button 
                onClick={handleGetStarted}
                className="group bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-10 py-4 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg font-bold flex items-center shadow-lg"
              >
                Start Your Knowledge Journey
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              
              <button className="group text-gray-700 hover:text-indigo-600 px-10 py-4 rounded-2xl border-2 border-gray-200 hover:border-indigo-300 transition-all duration-300 text-lg font-semibold bg-white/80 backdrop-blur-sm flex items-center">
                <Play className="mr-3 h-5 w-5" />
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto transform transition-all duration-1000 delay-800 ${isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              {stats.map((stat, index) => (
                <div key={index} className="text-center group cursor-pointer">
                  <div className="flex items-center justify-center mb-2">
                    <stat.icon className="h-6 w-6 text-indigo-600 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 text-sm font-semibold tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Features Showcase */}
      <section id="features" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">
              Intelligence at Every Level
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium leading-relaxed">
              Every feature is designed to amplify your team's cognitive capabilities, 
              making knowledge work feel effortless and intuitive.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`group p-8 bg-gradient-to-br from-white to-gray-50/50 rounded-3xl border border-gray-100/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer backdrop-blur-sm ${currentFeature === index ? 'ring-2 ring-indigo-500 shadow-xl scale-105' : ''}`}
                onMouseEnter={() => setCurrentFeature(index)}
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                  {feature.description}
                </p>
                <div className="mt-6 flex items-center text-indigo-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-32 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">
              Loved by Teams Worldwide
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-gray-100/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 font-medium leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-black text-white mb-6 tracking-tight">
            Ready to Amplify Your Team's Intelligence?
          </h2>
          <p className="text-xl text-indigo-100 mb-12 font-medium leading-relaxed">
            Join thousands of teams who've transformed their knowledge management with AI.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={handleGetStarted}
              className="group bg-white text-indigo-600 px-10 py-4 rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-3xl text-lg font-bold flex items-center hover:scale-105"
            >
              Start Your Free Trial
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
          
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-12 text-indigo-100">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-3 text-green-300" />
              <span className="font-medium">No credit card required</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-3 text-green-300" />
              <span className="font-medium">14-day free trial</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-3 text-green-300" />
              <span className="font-medium">Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-black">KnowledgeHub</span>
                <span className="text-xs font-semibold text-gray-400 block -mt-1">AI POWERED</span>
              </div>
            </div>
            
            <div className="text-gray-400 text-center md:text-right font-medium">
              <p>© 2025 KnowledgeHub AI. Powered by Google Gemini.</p>
              <p className="mt-1 text-sm">Built for the future of collaborative intelligence.</p>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default HomePage;