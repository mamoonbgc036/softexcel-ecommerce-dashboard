import { defineStore } from "pinia";
import { ref, computed, watch, onMounted } from "vue";
import { useAuthStore } from "@/store/authStore";
import axiosInstance from "@/services/axiosInstance";
import { toast } from "@steveyuowo/vue-hot-toast";
import { usePage, router } from "@inertiajs/vue3";

export const useCartStore = defineStore("cartStore", () => {
  const cartItems = ref([]);
  const isCartOpen = ref(false);
  const page = usePage();
  const authStore = useAuthStore();
  const is_direct_order = ref(false);

  const currencysymbol = ref("৳"); // Default currency

  const golobalLoading = ref(false);

  // Handle Local Storage safely
  if (typeof window !== "undefined") {
    is_direct_order.value = localStorage.getItem("is_direct_order") === "true";
  }

  // Toggle Direct Order
  const setOrderType = (direct) => {
    is_direct_order.value = direct;
    if (typeof window !== "undefined") {
      localStorage.setItem("is_direct_order", direct.toString());
    }
  };

  // Toggle Cart Sidebar
  const toggleCart = () => {
    isCartOpen.value = !isCartOpen.value;
  };

  // Redirect to Checkout Page
  const goToCheckout = () => {
    setOrderType(false);
    isCartOpen.value = false;
    router.get("/checkout");
  };

  const cartOrder = () => {
    is_direct_order.value = false;
    if(typeof window !== "undefined") {
      localStorage.setItem("is_direct_order", "false");
    }
  }

  const directOrder = () => {
    is_direct_order.value = true;
    if(typeof window !== "undefined") {
      localStorage.setItem("is_direct_order", "true");
    }
  }

  // Fetch Cart Items from API
  const fetchCartItems = async () => {
    let userId = authStore.user?.id || getGuestId();

    try {
      const response = await axiosInstance.get("/get-cart-items", {
        params: { user_id: userId },
      });

      cartItems.value = (response.data || []).map((item) => ({
        ...item,
        price: parseFloat(item.price) || 0,
        quantity: parseInt(item.quantity) || 0,
      }));
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  // Ensure Guest ID Exists
  const getGuestId = () => {
    if (typeof window === "undefined") return null;

    let guestId = localStorage.getItem("guest_id");
    if (!guestId) {
      guestId = `guest_${Date.now()}`;
      localStorage.setItem("guest_id", guestId);
    }
    return guestId;
  };

  // Watch Cart Items and Persist to Local Storage
  watch(
    cartItems,
    (newCart) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("cartItems", JSON.stringify(newCart));
      }
    },
    { deep: true }
  );

  // Watch Authentication Changes and Refresh Cart
  watch(
    () => authStore.user,
    (user) => {
      if (user) {
        fetchCartItems();
      }
    },
    { immediate: true }
  );
  

  // Close Cart on Route Change
  watch(
    () => page.url,
    () => {
      isCartOpen.value = false;
    }
  );

  // Compute Total Cart Count
  const cartCount = computed(() =>
    cartItems.value.reduce((total, item) => total + item.quantity, 0)
  );

  // Compute Total Cart Price
  const cartTotalPrice = computed(() => {
    //console.log('Cart items:', cartItems.value);
    
    return cartItems.value.reduce((sum, item) => {
      const cleanPrice = item.final_price.replace(/,/g, '');
      const parsedPrice = parseFloat(cleanPrice);
      //console.log(`Item: ${item.product.product_name}, Price: ${item.final_price}, Parsed: ${parsedPrice}`);
      return sum + parsedPrice;
    }, 0).toFixed(2);
  });

  // const totalPrice = computed(() => {
  //   return cartItems.value.reduce((sum, item) => sum + parseFloat(item.final_price), 0).toFixed(2);
  // });
  


  const syncCartIncrement = async (cartId, productId) => {
    const userId = authStore.user?.id || getGuestId();
  
    try {
      golobalLoading.value = true;
      const response = await axiosInstance.post(`/cart/sync`, {
        cart_id: cartId,
        product_id: productId,
        user_id: userId,
        quantity: 1
      });
  
      if (response.data.success) {
        if (response.data.data?.status) {
          toast.success(response.data.data.message || "Item added to cart successfully!");
          await fetchCartItems();
        } else {
          toast.error("Not enough stock available.");
        }
      } else {
        toast.error("Something went wrong, please try again.");
      }
    } catch (error) {
      console.error("Error syncing cart:", error);
      toast.error("An error occurred while syncing the cart.");
    } finally {
      golobalLoading.value = false;
    }
  };
  

  const syncCartDecrement = async (cartId, productId, currentQuantity) => {
    if (currentQuantity <= 1) {
      toast.error("Quantity cannot be less than 1");
      return;
    }
  
    const userId = authStore.user?.id || getGuestId();
  
    try {
      golobalLoading.value = true;
      const response = await axiosInstance.post(`/cart/sync`, {
        cart_id: cartId,
        product_id: productId,
        user_id: userId,
        quantity: -1
      });
  
      if (response.data.success) {
        if (response.data.data?.status) {
          toast.success(response.data.data.message || "Cart updated successfully!");
          await fetchCartItems();
        } else {
          toast.error("Not enough stock available.");
        }
      } else {
        toast.error("Something went wrong, please try again.");
      }
    } catch (error) {
      console.error("Error syncing cart:", error);
      toast.error("An error occurred while updating the cart.");
    } finally {
      golobalLoading.value = false;
    }
  };
  
  

  // Remove Item from Cart
  const removeItem = async (cartId) => {
    const userId = authStore.user?.id || getGuestId();

    try {
      golobalLoading.value = true;
      await axiosInstance.delete(`/cart/remove`, {
        params: { cart_id: cartId, user_id: userId },
      });

      toast.success("Removed Cart");
      await fetchCartItems();
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
    finally {
      golobalLoading.value = false;
    }
  };

  // Fetch Cart Items on Component Mount
  onMounted(fetchCartItems);

  return {
    cartItems,
    fetchCartItems,
    cartCount,
    cartTotalPrice,
    syncCartIncrement,
    syncCartDecrement,
    removeItem,
    isCartOpen,
    toggleCart,
    setOrderType,
    is_direct_order,
    goToCheckout,
    cartOrder,
    directOrder,
    golobalLoading,
    currencysymbol,
  };
});
