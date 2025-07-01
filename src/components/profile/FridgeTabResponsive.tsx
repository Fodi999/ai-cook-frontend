'use client';

import { useState, useEffect } from 'react';
import FridgeTab from './FridgeTab';
import FridgeTabMobile from './FridgeTabMobile';

export default function FridgeTabResponsive() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Return mobile component for screens smaller than 768px
  if (isMobile) {
    return <FridgeTabMobile />;
  }

  // Return desktop component for larger screens
  return <FridgeTab />;
}
