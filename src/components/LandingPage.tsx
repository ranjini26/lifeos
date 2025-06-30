import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Brain, 
  Target, 
  Calendar, 
  FileText, 
  TrendingUp,
  CheckCircle,
  Star,
  ArrowRight,
  Play,
  Users,
  Zap,
  Shield,
  Smartphone,
  Globe,
  ChevronDown,
  Award,
  Clock,
  Heart,
  Lightbulb
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Get personalized productivity suggestions and smart task improvements powered by advanced AI that learns from your patterns.',
      color: 'from-purple-400 to-pink-500',
      delay: 0
    },
    {
      icon: Target,
      title: 'Smart Habit Tracking',
      description: 'Build lasting habits with visual progress tracking, streak monitoring, and intelligent reminders that adapt to your lifestyle.',
      color: 'from-green-400 to-emerald-500',
      delay: 0.1
    },
    {
      icon: Calendar,
      title: 'Intelligent Calendar',
      description: 'Seamlessly manage your schedule with AI-powered event planning, smart reminders, and optimal time slot suggestions.',
      color: 'from-blue-400 to-cyan-500',
      delay: 0.2
    },
    {
      icon: FileText,
      title: 'Voice-Powered Notes',
      description: 'Capture ideas instantly with voice-to-text notes, AI summarization, and text-to-speech playback for hands-free productivity.',
      color: 'from-orange-400 to-red-500',
      delay: 0.3
    },
    {
      icon: TrendingUp,
      title: 'Advanced Analytics',
      description: 'Track your productivity trends with beautiful visualizations and get actionable insights to optimize your workflow.',
      color: 'from-indigo-400 to-purple-500',
      delay: 0.4
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Streamline your workflow with one-click actions, keyboard shortcuts, and instant sync across all your devices.',
      color: 'from-yellow-400 to-orange-500',
      delay: 0.5
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Product Manager at TechCorp',
      avatar: '👩‍💼',
      content: 'LifeOS completely transformed how I manage my daily tasks. The AI suggestions are incredibly helpful and the interface is absolutely beautiful!',
      rating: 5,
      company: 'TechCorp'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Entrepreneur & Founder',
      avatar: '👨‍💻',
      content: 'The habit tracking feature helped me build a consistent morning routine that increased my productivity by 300%. This app is a game changer!',
      rating: 5,
      company: 'StartupXYZ'
    },
    {
      name: 'Emily Watson',
      role: 'Creative Director',
      avatar: '👩‍🎨',
      content: 'Beautiful interface, powerful features, and everything I need in one place. The voice notes feature is absolutely revolutionary for my creative process.',
      rating: 5,
      company: 'Design Studio'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Active Users', icon: Users },
    { number: '98%', label: 'Satisfaction Rate', icon: Heart },
    { number: '3.5x', label: 'Productivity Boost', icon: TrendingUp },
    { number: '24/7', label: 'AI Support', icon: Brain }
  ];

  const benefits = [
    { icon: Clock, title: 'Save 2+ Hours Daily', description: 'Streamlined workflows and AI automation' },
    { icon: Target, title: 'Achieve 90% More Goals', description: 'Smart tracking and habit formation' },
    { icon: Brain, title: 'Reduce Mental Load', description: 'AI handles planning and optimization' },
    { icon: Award, title: 'Build Better Habits', description: 'Science-backed habit formation system' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5Q0EzQUYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc=')] opacity-40"></div>
        
        {/* Floating Orbs */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-r from-pink-400/20 to-purple-400/20 blur-xl"
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-40 h-40 rounded-full bg-gradient-to-r from-blue-400/20 to-cyan-400/20 blur-xl"
          animate={{
            y: [0, 40, 0],
            x: [0, -25, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-28 h-28 rounded-full bg-gradient-to-r from-emerald-400/20 to-teal-400/20 blur-xl"
          animate={{
            y: [0, -20, 0],
            x: [0, 30, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/3 w-24 h-24 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-400/20 blur-xl"
          animate={{
            y: [0, 25, 0],
            x: [0, -15, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 p-6"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 flex items-center justify-center shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">LifeOS</h1>
              <p className="text-xs text-slate-600 font-medium">Personal Productivity Revolution</p>
            </div>
          </motion.div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-700 hover:text-slate-900 transition-colors font-medium">Features</a>
            <a href="#testimonials" className="text-slate-700 hover:text-slate-900 transition-colors font-medium">Reviews</a>
            <a href="#pricing" className="text-slate-700 hover:text-slate-900 transition-colors font-medium">Pricing</a>
            <a href="#about" className="text-slate-700 hover:text-slate-900 transition-colors font-medium">About</a>
          </div>

          <motion.button
            onClick={onGetStarted}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white font-semibold hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 transition-all duration-200 shadow-lg"
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(244, 114, 182, 0.3)" }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Free
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full glassmorphism border border-white/50 mb-8"
            >
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-slate-700 font-medium">Trusted by 50,000+ productivity enthusiasts worldwide</span>
              <Sparkles className="w-4 h-4 text-purple-500" />
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl font-bold text-slate-900 mb-8 leading-tight">
              Your Life,
              <motion.span 
                className="gradient-text block"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Organized
              </motion.span>
              <motion.span 
                className="gradient-text block"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Beautifully
              </motion.span>
            </h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-slate-700 mb-12 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Transform your productivity with AI-powered insights, smart habit tracking, and seamless organization. 
              Everything you need to live your best life, wrapped in a stunning interface that makes productivity feel effortless.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16"
          >
            <motion.button
              onClick={onGetStarted}
              className="px-10 py-5 rounded-2xl bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white font-bold text-lg hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 transition-all duration-200 shadow-2xl flex items-center space-x-3"
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 25px 50px rgba(244, 114, 182, 0.4)",
                y: -2
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Start Your Journey</span>
              <ArrowRight className="w-6 h-6" />
            </motion.button>
            
            <motion.button
              className="px-10 py-5 rounded-2xl glassmorphism border border-white/50 text-slate-700 font-bold text-lg hover:bg-white/90 transition-all duration-200 flex items-center space-x-3 shadow-xl"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(148, 163, 184, 0.3)",
                y: -2
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-6 h-6" />
              <span>Watch Demo</span>
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                  className="text-center glassmorphism p-6 rounded-2xl border border-white/50"
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <Icon className="w-8 h-8 mx-auto mb-3 text-purple-500" />
                  <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.number}</div>
                  <div className="text-slate-600 font-medium">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6 text-slate-500" />
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 px-6 py-20 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Why Choose
              <span className="gradient-text block">LifeOS?</span>
            </h2>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto">
              Join thousands who have transformed their productivity and achieved their goals with our revolutionary platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center glassmorphism p-8 rounded-3xl border border-white/50 hover:bg-white/90 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center mb-6 mx-auto">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{benefit.title}</h3>
                  <p className="text-slate-700">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Powerful Features
              <span className="gradient-text block">Built for You</span>
            </h2>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto">
              Every feature is carefully crafted to help you organize your life, build better habits, and achieve your goals with ease.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: feature.delay }}
                  className="glassmorphism p-8 rounded-3xl border border-white/50 hover:bg-white/90 transition-all duration-300 group"
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-700 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative z-10 px-6 py-20 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Loved by
              <span className="gradient-text"> Thousands</span>
            </h2>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto">
              See what our users are saying about their productivity transformation with LifeOS.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glassmorphism p-8 rounded-3xl border border-white/50 hover:bg-white/90 transition-all duration-300"
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="flex items-center space-x-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 leading-relaxed text-lg">"{testimonial.content}"</p>
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{testimonial.name}</div>
                    <div className="text-slate-600">{testimonial.role}</div>
                    <div className="text-sm text-slate-500">{testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glassmorphism p-12 rounded-3xl border border-white/50"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Ready to Transform
              <span className="gradient-text block">Your Life?</span>
            </h2>
            <p className="text-xl text-slate-700 mb-8 max-w-3xl mx-auto">
              Join over 50,000 users who have already revolutionized their daily workflow and achieved their goals with LifeOS.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
              <motion.button
                onClick={onGetStarted}
                className="px-10 py-5 rounded-2xl bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white font-bold text-lg hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 transition-all duration-200 shadow-2xl flex items-center space-x-3"
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 25px 50px rgba(244, 114, 182, 0.4)",
                  y: -2
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Start Free Today</span>
                <ArrowRight className="w-6 h-6" />
              </motion.button>
            </div>

            <div className="flex items-center justify-center space-x-8 text-sm text-slate-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-500" />
                <span>Secure & private</span>
              </div>
              <div className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5 text-purple-500" />
                <span>Works everywhere</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3 mb-6 md:mb-0"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold gradient-text">LifeOS</div>
                <div className="text-sm text-slate-600">Personal Productivity Revolution</div>
              </div>
            </motion.div>
            
            <div className="flex items-center space-x-8 text-sm text-slate-600">
              <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Support</a>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>Built with Bolt.new</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/30 text-center text-slate-600">
            <p>&copy; 2025 LifeOS. All rights reserved. Made with ❤️ for productivity enthusiasts worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;