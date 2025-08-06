// Device detection utilities
export const deviceDetection = {
  // Check if device is mobile
  isMobile: (): boolean => {
    return window.innerWidth <= 1024;
  },

  // Check if device is iOS
  isIOS: (): boolean => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  },

  // Check if device is Android
  isAndroid: (): boolean => {
    return /Android/.test(navigator.userAgent);
  },

  // Check if device is mobile (iOS or Android)
  isMobileDevice: (): boolean => {
    return deviceDetection.isIOS() || deviceDetection.isAndroid();
  },

  // Get iPhone model based on screen dimensions
  getIOSDevice: (): string => {
    const { width, height } = window.screen;
    const devicePixelRatio = window.devicePixelRatio || 1;
    
    const logicalWidth = width / devicePixelRatio;
    const logicalHeight = height / devicePixelRatio;
    
    // iPhone dimensions (logical pixels)
    if (logicalWidth === 390 && logicalHeight === 844) return 'iPhone 12/13/14';
    if (logicalWidth === 393 && logicalHeight === 852) return 'iPhone 14 Pro';
    if (logicalWidth === 428 && logicalHeight === 926) return 'iPhone 12/13/14 Pro Max';
    if (logicalWidth === 430 && logicalHeight === 932) return 'iPhone 14/15 Pro Max';
    if (logicalWidth === 375 && logicalHeight === 812) return 'iPhone X/XS/11 Pro';
    if (logicalWidth === 414 && logicalHeight === 896) return 'iPhone XR/11/XS Max/11 Pro Max';
    
    return 'Unknown iOS Device';
  },

  // Get current viewport info
  getViewportInfo: () => {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio || 1,
      isLandscape: window.innerWidth > window.innerHeight,
      isMobile: deviceDetection.isMobile(),
      isTouch: 'ontouchstart' in window,
    };
  },

  // iPhone specific breakpoints
  iphoneBreakpoints: {
    // iPhone 13 mini
    mini: '375px',
    // iPhone 13, 14
    standard: '390px', 
    // iPhone 13 Pro, 14 Pro
    pro: '393px',
    // iPhone 13 Pro Max, 14 Pro Max, 15 Pro Max
    proMax: '430px',
  },

  // Check if current device matches iPhone size range
  isIPhoneSize: (): boolean => {
    const width = window.innerWidth;
    return width >= 375 && width <= 430;
  },
};