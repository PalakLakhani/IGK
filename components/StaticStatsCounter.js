'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Star, Heart, Sparkles, MapPin } from 'lucide-react';

/**
 * Static Stats Counter Component
 * Displays impressive stats from database + static values
 * No external API required
 */
export default function StaticStatsCounter({ className = '' }) {
  const [stats, setStats] = useState({
    attendees: 35000,
    events: 50,
    cities: 8,
    reviews: 100,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We use static impressive numbers
    // These can be updated manually as your events grow
    setLoading(false);
  }, []);

  // Animated number counter
  const AnimatedNumber = ({ value, duration = 2000 }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
      let startTime;
      let animationFrame;

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setDisplayValue(Math.floor(progress * value));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }, [value, duration]);

    return <span>{displayValue.toLocaleString()}</span>;
  };

  if (loading) {
    return (
      <div className={`flex justify-center ${className}`}>
        <div className="animate-pulse flex gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 w-32 bg-pink-100 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const statItems = [
    {
      icon: Users,
      value: stats.attendees,
      label: 'Happy Attendees',
      suffix: '+',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      icon: Calendar,
      value: stats.events,
      label: 'Events Hosted',
      suffix: '+',
      gradient: 'from-purple-500 to-indigo-500',
    },
    {
      icon: MapPin,
      value: stats.cities,
      label: 'Cities',
      suffix: '',
      gradient: 'from-orange-500 to-amber-500',
    },
    {
      icon: Star,
      value: stats.reviews,
      label: '5-Star Reviews',
      suffix: '+',
      gradient: 'from-yellow-500 to-orange-500',
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`${className}`}
    >
      <div className="flex flex-wrap justify-center gap-4 md:gap-6">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className={`flex items-center gap-3 bg-gradient-to-r ${item.gradient} text-white px-5 py-3 rounded-2xl shadow-lg cursor-default`}
          >
            <div className="p-2 bg-white/20 rounded-xl">
              <item.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-black">
                <AnimatedNumber value={item.value} />
                {item.suffix}
              </div>
              <div className="text-xs opacity-90">{item.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Decorative sparkle */}
      <motion.div 
        className="flex justify-center mt-4"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex items-center gap-2 text-pink-500">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">Join the celebration!</span>
          <Sparkles className="h-4 w-4" />
        </div>
      </motion.div>
    </motion.div>
  );
}
