// Device Capabilities Detection
export const deviceCapabilities = {
  // Check if device supports vibration
  canVibrate: () => 'vibrate' in navigator,
  
  // Check if device supports geolocation
  canGeolocate: () => 'geolocation' in navigator,
  
  // Check if device supports camera
  canUseCamera: () => 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
  
  // Check if device supports notifications
  canNotify: () => 'Notification' in window,
  
  // Check if device supports file system access
  canAccessFiles: () => 'showOpenFilePicker' in window,
  
  // Check if device is online
  isOnline: () => navigator.onLine,
  
  // Check if app is in standalone mode (installed PWA)
  isStandalone: () => 
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true,
};

// Vibration API
export const vibration = {
  // Single vibration
  vibrate: (duration: number = 200) => {
    if (deviceCapabilities.canVibrate()) {
      navigator.vibrate(duration);
    }
  },
  
  // Pattern vibration
  vibratePattern: (pattern: number[]) => {
    if (deviceCapabilities.canVibrate()) {
      navigator.vibrate(pattern);
    }
  },
  
  // Stop vibration
  stop: () => {
    if (deviceCapabilities.canVibrate()) {
      navigator.vibrate(0);
    }
  },
};

// Geolocation API
export const geolocation = {
  getCurrentPosition: (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!deviceCapabilities.canGeolocate()) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      });
    });
  },
  
  watchPosition: (callback: (position: GeolocationPosition) => void) => {
    if (!deviceCapabilities.canGeolocate()) {
      throw new Error('Geolocation not supported');
    }
    
    return navigator.geolocation.watchPosition(callback, undefined, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000,
    });
  },
  
  clearWatch: (watchId: number) => {
    if (deviceCapabilities.canGeolocate()) {
      navigator.geolocation.clearWatch(watchId);
    }
  },
};

// Camera API
export const camera = {
  // Get camera stream
  getStream: async (constraints: MediaStreamConstraints = { video: true }): Promise<MediaStream> => {
    if (!deviceCapabilities.canUseCamera()) {
      throw new Error('Camera not supported');
    }
    
    return await navigator.mediaDevices.getUserMedia(constraints);
  },
  
  // Take photo and return as blob
  takePhoto: async (stream: MediaStream): Promise<Blob> => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    video.srcObject = stream;
    video.play();
    
    return new Promise((resolve) => {
      video.addEventListener('loadedmetadata', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
          resolve(blob!);
        }, 'image/jpeg', 0.8);
      });
    });
  },
  
  // Stop camera stream
  stopStream: (stream: MediaStream) => {
    stream.getTracks().forEach(track => track.stop());
  },
};

// Notifications API
export const notifications = {
  // Request notification permission
  requestPermission: async (): Promise<NotificationPermission> => {
    if (!deviceCapabilities.canNotify()) {
      throw new Error('Notifications not supported');
    }
    
    return await Notification.requestPermission();
  },
  
  // Show notification
  show: (title: string, options: NotificationOptions = {}) => {
    if (!deviceCapabilities.canNotify()) {
      throw new Error('Notifications not supported');
    }
    
    if (Notification.permission === 'granted') {
      return new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        ...options,
      });
    }
  },
  
  // Check permission status
  getPermission: (): NotificationPermission => {
    return deviceCapabilities.canNotify() ? Notification.permission : 'denied';
  },
};

// File System Access API
export const fileSystem = {
  // Open file picker
  openFile: async (options: any = {}): Promise<FileSystemFileHandle[]> => {
    if (!deviceCapabilities.canAccessFiles()) {
      throw new Error('File System Access not supported');
    }
    
    return await (window as any).showOpenFilePicker(options);
  },
  
  // Save file
  saveFile: async (content: string, filename: string = 'file.txt') => {
    if (deviceCapabilities.canAccessFiles()) {
      const fileHandle = await (window as any).showSaveFilePicker({
        suggestedName: filename,
      });
      
      const writable = await fileHandle.createWritable();
      await writable.write(content);
      await writable.close();
    } else {
      // Fallback to download
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  },
};

// Network Information API
export const network = {
  // Get connection info
  getConnectionInfo: () => {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (connection) {
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      };
    }
    
    return null;
  },
  
  // Listen to online/offline events
  onNetworkChange: (callback: (isOnline: boolean) => void) => {
    const handleOnline = () => callback(true);
    const handleOffline = () => callback(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  },
};

// Screen Wake Lock API
export const wakeLock = {
  request: async (): Promise<WakeLockSentinel | null> => {
    if ('wakeLock' in navigator) {
      try {
        return await navigator.wakeLock.request('screen');
      } catch (err) {
        console.error('Wake lock request failed:', err);
      }
    }
    return null;
  },
  
  release: (wakeLockSentinel: WakeLockSentinel) => {
    wakeLockSentinel.release();
  },
};

// Share API
export const share = {
  canShare: () => 'share' in navigator,
  
  share: async (data: ShareData) => {
    if (share.canShare()) {
      try {
        await navigator.share(data);
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      // Fallback to clipboard
      if (data.url && 'clipboard' in navigator) {
        await navigator.clipboard.writeText(data.url);
      }
    }
  },
};