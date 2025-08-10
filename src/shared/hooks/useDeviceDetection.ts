import { useState, useEffect } from 'react';
import { deviceDetection } from '../utils/deviceDetection';

export const useDeviceDetection = () => {
  const [isMobile, setIsMobile] = useState(deviceDetection.isMobile());

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMobile,
    isTablet: window.innerWidth > 768 && window.innerWidth <= 1024,
    isIOS: deviceDetection.isIOS(),
    isAndroid: deviceDetection.isAndroid(),
    isMobileDevice: deviceDetection.isMobileDevice(),
    isDesktop: deviceDetection.isDesktop(),
    getPlatform: deviceDetection.getPlatform(),
    getBrowser: deviceDetection.getBrowser(),
    getViewportInfo: deviceDetection.getViewportInfo(),
    isPWAMode: deviceDetection.isPWAMode(),
    supportsPWAInstall: deviceDetection.supportsPWAInstall(),
  };
};