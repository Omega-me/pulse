import axios from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

const useSubscription = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const onSubscribe = async () => {
    setIsProcessing(true);

    try {
      const res = await axios.get('/api/payment');

      if (res?.data?.status === 200 && res.data.session_url) {
        window.location.href = res.data.session_url;
      } else {
        toast.error('Unexpected response from server');
      }
    } catch (err) {
      console.error('Subscription error:', err);
      toast.error(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return { onSubscribe, isProcessing };
};

export default useSubscription;
