import { defineStore } from 'pinia';
import axiosInstance from '@/services/axiosInstance';
import Cookies from 'js-cookie';
import { ref, onMounted } from 'vue';
import { toast } from '@steveyuowo/vue-hot-toast';
import { router } from '@inertiajs/vue3';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const isAuthenticated = ref(!!Cookies.get('authToken'));
  const guestId = ref(null);

  // Function to initialize guest ID safely
  const initGuestId = () => {
    if (typeof window !== "undefined") { // ✅ Ensure it's running on the client
      const storedId = localStorage.getItem('guest_id');
      if (storedId) {
        guestId.value = storedId;
      } else {
        const newId = `guest_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
        localStorage.setItem('guest_id', newId);
        guestId.value = newId;
      }
    }
  };

  // Fetch user details only on the client side
  const fetchUserDetails = async () => {
    try {
      const response = await axiosInstance.get('/user'); // Replace with your endpoint
      user.value = response.data;
      console.log('Fetched user details:', user.value);
      isAuthenticated.value = true;
    } catch (error) {
      console.error('Failed to fetch user details:', error.message);
      user.value = null;
      isAuthenticated.value = false;
    }
  };

  // Initialize authentication on the client side
  const initAuth = async () => {
    if (typeof window !== "undefined") { // ✅ Ensure it's running in the browser
      initGuestId(); // Set guest ID safely
      if (isAuthenticated.value) {
        await fetchUserDetails(); // Fetch user details if authenticated
      }
    }
  };

  onMounted(() => {
    initAuth(); // Initialize authentication on mount
  });

  // Handle logout
  const logout = () => {
    Cookies.remove('authToken');
    user.value = null;
    isAuthenticated.value = false;
    router.get('/'); // Redirect to home
    toast.success('Logged out successfully');
  };

  return {
    user,
    isAuthenticated,
    guestId,
    fetchUserDetails,
    logout,
    initAuth, // Expose the init function to be called in App.vue
  };
});
