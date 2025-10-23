import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, BellOff } from 'lucide-react';
import { useAuth, apiClient } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Utility function to convert VAPID public key to Uint8Array
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const NotificationToggle: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [vapidPublicKey, setVapidPublicKey] = useState<string | null>(null);

  // Fetch VAPID Public Key from backend
  useEffect(() => {
    const fetchVapidKey = async () => {
      try {
        // Assuming an endpoint to get the VAPID public key
        const response = await apiClient.get('/notifications/vapid-public-key');
        setVapidPublicKey(response.data.publicKey);
      } catch (error) {
        console.error('Failed to fetch VAPID public key:', error);
        toast.error('Gagal memuat kunci notifikasi.');
      }
    };
    if (isAuthenticated) {
      fetchVapidKey();
    }
  }, [isAuthenticated]);

  // Check current subscription status
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window && isAuthenticated && vapidPublicKey) {
      navigator.serviceWorker.ready.then(registration => {
        registration.pushManager.getSubscription().then(subscription => {
          setIsSubscribed(!!subscription);
        });
      });
    }
  }, [isAuthenticated, vapidPublicKey]);

  const subscribeUser = useCallback(async () => {
    if (!('serviceWorker' in navigator && 'PushManager' in window && vapidPublicKey)) {
      toast.error('Notifikasi push tidak didukung oleh browser Anda.');
      return;
    }

    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey!),
      });

      // Send subscription to your backend
      await apiClient.post('/notifications/subscribe', subscription);
      setIsSubscribed(true);
      toast.success('Berhasil berlangganan notifikasi!');
    } catch (error) {
      console.error('Failed to subscribe the user:', error);
      toast.error('Gagal berlangganan notifikasi.');
    } finally {
      setIsLoading(false);
    }
  }, [vapidPublicKey]);

  const unsubscribeUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        // Optionally, inform your backend to remove the subscription
        // await apiClient.post('/notifications/unsubscribe', { endpoint: subscription.endpoint });
      }
      setIsSubscribed(false);
      toast.info('Berhenti berlangganan notifikasi.');
    } catch (error) {
      console.error('Failed to unsubscribe the user:', error);
      toast.error('Gagal berhenti berlangganan notifikasi.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (!isAuthenticated) {
    return null; // Don't render if not authenticated
  }

  return (
    <Button
      onClick={isSubscribed ? unsubscribeUser : subscribeUser}
      disabled={isLoading || !vapidPublicKey}
      variant={isSubscribed ? 'secondary' : 'default'}
      className="flex items-center space-x-2"
    >
      {isLoading ? (
        'Loading...'
      ) : isSubscribed ? (
        <><BellOff className="h-4 w-4" /><span>Berhenti Notifikasi</span></>
      ) : (
        <><Bell className="h-4 w-4" /><span>Aktifkan Notifikasi</span></>
      )}
    </Button>
  );
};

export default NotificationToggle;
