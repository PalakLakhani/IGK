'use client';

import { useEffect, useState, useRef } from 'react';
import { siteConfig } from '@/config/site';

// Animated counter hook with smooth easing
function useCountUp(end, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!startOnView) {
      setHasStarted(true);
      return;
    }
    
    // Start immediately for better UX, or use intersection observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, [startOnView, hasStarted]);

  useEffect(() => {
    if (!hasStarted || end === 0) return;

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Ease out cubic for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(easeOut * end);
      setCount(currentValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        // Ensure we hit the exact end value
        setCount(end);
        setIsComplete(true);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [end, duration, hasStarted]);

  return { count: isComplete ? end : count, ref, isComplete };
}

export default function StatsBar({ 
  variant = 'gradient', // 'gradient' | 'amber' | 'minimal'
  showReviewCount = true,
  className = ''
}) {
  const [ratingData, setRatingData] = useState({ averageRating: 5.0, totalRatings: 0 });
  const [siteStats, setSiteStats] = useState({
    eventsOrganized: siteConfig.stats.eventsOrganized,
    happyAttendees: siteConfig.stats.happyAttendees,
    citiesCovered: siteConfig.stats.citiesCovered
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Animated counters - values from settings or defaults
  const eventsCounter = useCountUp(siteStats.eventsOrganized, 2000);
  const attendeesCounter = useCountUp(Math.round(siteStats.happyAttendees / 1000), 2500);
  const citiesCounter = useCountUp(siteStats.citiesCovered, 1500);
  const ratingCounter = useCountUp(Math.round(ratingData.averageRating * 10), 2000);

  // Fetch site settings and rating from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch site settings
        const settingsRes = await fetch('/api/settings');
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          if (settingsData.settings) {
            setSiteStats({
              eventsOrganized: settingsData.settings.eventsOrganized ?? siteConfig.stats.eventsOrganized,
              happyAttendees: settingsData.settings.happyAttendees ?? siteConfig.stats.happyAttendees,
              citiesCovered: settingsData.settings.citiesCovered ?? siteConfig.stats.citiesCovered
            });
          }
        }

        // Fetch rating
        const ratingRes = await fetch('/api/testimonials?limit=1');
        const ratingData = await ratingRes.json();
        if (ratingData.averageRating !== undefined) {
          setRatingData({
            averageRating: ratingData.averageRating || 5.0,
            totalRatings: ratingData.totalRatings || 0
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchData();
  }, []);

  // Variant styles
  const variantStyles = {
    gradient: 'py-16 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500',
    amber: 'py-20 bg-gradient-to-br from-amber-500 to-orange-600',
    minimal: 'py-12 bg-gradient-to-r from-indigo-600 to-purple-600'
  };

  return (
    <section className={`${variantStyles[variant]} ${className}`}>
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {/* Events Organized */}
          <div className="space-y-2" ref={eventsCounter.ref}>
            <div className="text-5xl md:text-6xl font-black">
              {eventsCounter.count}+
            </div>
            <div className="text-lg md:text-xl font-semibold opacity-90">
              Events Organized
            </div>
          </div>

          {/* Happy Attendees */}
          <div className="space-y-2" ref={attendeesCounter.ref}>
            <div className="text-5xl md:text-6xl font-black">
              {attendeesCounter.count}K+
            </div>
            <div className="text-lg md:text-xl font-semibold opacity-90">
              Happy Attendees
            </div>
          </div>

          {/* Cities Covered */}
          <div className="space-y-2" ref={citiesCounter.ref}>
            <div className="text-5xl md:text-6xl font-black">
              {citiesCounter.count}
            </div>
            <div className="text-lg md:text-xl font-semibold opacity-90">
              Cities Covered
            </div>
          </div>

          {/* Average Rating - Dynamic */}
          <div className="space-y-2" ref={ratingCounter.ref}>
            <div className="text-5xl md:text-6xl font-black">
              {(ratingCounter.count / 10).toFixed(1)}★
            </div>
            <div className="text-lg md:text-xl font-semibold opacity-90">
              Average Rating
            </div>
            {showReviewCount && isLoaded && ratingData.totalRatings > 0 && (
              <div className="text-sm opacity-75">
                based on {ratingData.totalRatings} review{ratingData.totalRatings !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
