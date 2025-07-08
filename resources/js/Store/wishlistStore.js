import { defineStore } from "pinia";
import { ref, watch } from "vue";
import axiosInstance from "@/services/axiosInstance";
import { toast } from "@steveyuowo/vue-hot-toast";
import { useAuthStore } from "@/store/authStore";

export const useWishlistStore = defineStore("wishlistStore", () => {
  const wishlist = ref([]);
  const loading = ref(true);
  const error = ref(null);
  const whishlistCount = ref(0);

  const authStore = useAuthStore();

  // Fetch Wishlist Items
  const fetchWishlist = async () => {
    loading.value = true;
    try {
      const response = await axiosInstance.get("/wishlist");
      wishlist.value = response.data;
      whishlistCount.value = response.data.length;
    } catch (err) {
      error.value = "Failed to load wishlist items.";
      toast.error(error.value);
    } finally {
      loading.value = false;
    }
  };

  // Add to Wishlist
  const addToWishlist = async (productId) => {
    try {
      await axiosInstance.post("/wishlist", {
        product_id: productId,
      });
      toast.success("Added to wishlist");
      await fetchWishlist();
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error("Already in wishlist");
      } else {
        toast.error("Failed to add to wishlist");
      }
    }
  };

  // Remove from Wishlist
  const removeFromWishlist = async (productId) => {
    try {
      await axiosInstance.delete(`/wishlist/${productId}`);
      toast.success("Removed from wishlist");
      await fetchWishlist();
    } catch (err) {
      toast.error("Failed to remove from wishlist");
    }
  };

  // Watch for user login and fetch wishlist
  watch(
    () => authStore.user,
    (newUser) => {
      if (newUser) {
        fetchWishlist();
      } else {
        // User logged out – clear wishlist
        wishlist.value = [];
        whishlistCount.value = 0;
      }
    },
    { immediate: true }
  );

  return {
    wishlist,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    whishlistCount,
    loading,
    error,
  };
});
