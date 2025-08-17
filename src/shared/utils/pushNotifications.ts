export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface NotificationPermissionState {
  permission: NotificationPermission;
  isSupported: boolean;
  isPushSupported: boolean;
  isServiceWorkerSupported: boolean;
}

export class PushNotificationManager {
  private static instance: PushNotificationManager;
  private registration: ServiceWorkerRegistration | null = null;
  private vapidPublicKey: string;

  private constructor() {
    this.vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';
  }

  static getInstance(): PushNotificationManager {
    if (!PushNotificationManager.instance) {
      PushNotificationManager.instance = new PushNotificationManager();
    }
    return PushNotificationManager.instance;
  }

  async initialize(): Promise<boolean> {
    if (!this.isSupported()) {
      console.warn('Push notifications are not supported');
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('Service Worker registered successfully:', this.registration);

      await navigator.serviceWorker.ready;
      console.log('Service Worker is ready');

      return true;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return false;
    }
  }

  isSupported(): boolean {
    return (
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    );
  }

  getPermissionState(): NotificationPermissionState {
    return {
      permission: Notification.permission,
      isSupported: 'Notification' in window,
      isPushSupported: 'PushManager' in window,
      isServiceWorkerSupported: 'serviceWorker' in navigator,
    };
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('This browser does not support notifications');
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      throw new Error('Notification permission is denied');
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  async subscribe(): Promise<PushSubscriptionData | null> {
    if (!this.registration) {
      throw new Error('Service Worker not registered');
    }

    if (!this.vapidPublicKey) {
      throw new Error('VAPID public key not configured');
    }

    try {
      const existingSubscription = await this.registration.pushManager.getSubscription();
      if (existingSubscription) {
        await existingSubscription.unsubscribe();
      }

      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey),
      });

      return this.subscriptionToData(subscription);
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      throw error;
    }
  }

  async unsubscribe(): Promise<boolean> {
    if (!this.registration) {
      return false;
    }

    try {
      const subscription = await this.registration.pushManager.getSubscription();
      if (subscription) {
        const result = await subscription.unsubscribe();
        console.log('Unsubscribed from push notifications:', result);
        return result;
      }
      return true;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      return false;
    }
  }

  async getSubscription(): Promise<PushSubscriptionData | null> {
    if (!this.registration) {
      return null;
    }

    try {
      const subscription = await this.registration.pushManager.getSubscription();
      return subscription ? this.subscriptionToData(subscription) : null;
    } catch (error) {
      console.error('Failed to get subscription:', error);
      return null;
    }
  }

  async showLocalNotification(
    title: string,
    options: NotificationOptions = {}
  ): Promise<void> {
    if (Notification.permission !== 'granted') {
      throw new Error('Notification permission not granted');
    }

    if (!this.registration) {
      throw new Error('Service Worker not registered');
    }

    const defaultOptions: NotificationOptions = {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      requireInteraction: false,
      ...options,
    };

    await this.registration.showNotification(title, defaultOptions);
  }

  private subscriptionToData(subscription: PushSubscription): PushSubscriptionData {
    const key = subscription.getKey('p256dh');
    const token = subscription.getKey('auth');

    return {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: key ? this.arrayBufferToBase64(key) : '',
        auth: token ? this.arrayBufferToBase64(token) : '',
      },
    };
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  onMessage(callback: (data: any) => void): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        callback(event.data);
      });
    }
  }

  async updateServiceWorker(): Promise<boolean> {
    if (!this.registration) {
      return false;
    }

    try {
      await this.registration.update();
      return true;
    } catch (error) {
      console.error('Failed to update service worker:', error);
      return false;
    }
  }
}