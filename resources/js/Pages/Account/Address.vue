<template>
  <Head>
    <title>Address</title>
  </Head>
  <AccountLayout>
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-semibold">Address</h2>
      <button @click="openPopup()" class="bg-theme text-white px-4 py-2 rounded hover:bg-secondary">
        Create Address
      </button>
    </div>

    <!-- Address Cards -->
    <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="address in addresses" :key="address.id" class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 class="text-lg font-semibold">{{ address.name }}</h3>
        <p class="text-sm text-gray-600 mt-2">{{ address.address }}</p>
        <p class="text-sm text-gray-600">{{ address.city }}</p>
        <p class="text-sm text-gray-600">{{ address.phone }}</p>
        <p class="text-sm text-gray-600 capitalize">{{ address.type }}</p>
        <p v-if="address.is_default === 1" class="text-sm text-green-600 font-medium mt-2">Default Address</p>
        
        <!-- Actions -->
        <div class="mt-4 flex space-x-4">
          <button @click="editAddress(address)" class="text-sm text-blue-600 hover:text-blue-800">Edit</button>
          <button @click="deleteAddress(address.id)" class="text-sm text-red-600 hover:text-red-800">Delete</button>
        </div>
      </div>
    </div>

    <!-- Address Popup -->
    <div v-if="isPopupOpen" class="fixed inset-0 bg-black bg-opacity-50 z-[99] flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">{{ isEditing ? "Edit Address" : "Create New Address" }}</h2>

        <!-- Form -->
        <form @submit.prevent="isEditing ? updateAddress() : submitAddress()">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" v-model="form.name" class="input-field" placeholder="Enter your name" />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Address</label>
            <input type="text" v-model="form.address" class="input-field" placeholder="Enter your address" />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">City</label>
            <input type="text" v-model="form.city" class="input-field" placeholder="Enter your city" />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Phone</label>
            <input type="text" v-model="form.phone" class="input-field" placeholder="Enter your phone number" />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Address Type</label>
            <select v-model="form.type" class="input-field">
              <option value="office">Office</option>
              <option value="home">Home</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div class="mb-4">
            <label class="flex items-center">
              <input type="checkbox" v-model="form.is_default" class="mr-2" />
              <span class="text-sm text-gray-700">Set as Default</span>
            </label>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-4">
            <button type="button" @click="closePopup()" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              Cancel
            </button>
            <button type="submit" class="bg-theme text-white px-4 py-2 rounded hover:bg-secondary">
              {{ isEditing ? "Update Address" : "Save Address" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </AccountLayout>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import { toast } from "@steveyuowo/vue-hot-toast";
import AccountLayout from "@/Layouts/AccountLayout.vue";
import { Head } from "@inertiajs/vue3";

const $axios = inject("$axios");

// State variables
const isPopupOpen = ref(false);
const isEditing = ref(false);
const editingId = ref(null);
const addresses = ref([]);

const form = ref({
  name: "",
  address: "",
  city: "",
  phone: "",
  type: "home",
  is_default: false,
});

// Fetch addresses when the component mounts
onMounted(fetchAddresses);

async function fetchAddresses() {
  try {
    const response = await $axios.get("/get-addresses");
    if (response.data.success) {
      addresses.value = response.data.address;
    } else {
      toast.error("Failed to fetch addresses.");
    }
  } catch (error) {
    console.error("Error fetching addresses:", error);
    toast.error("Failed to fetch addresses.");
  }
}

// Open popup for new address
const openPopup = () => {
  isEditing.value = false;
  isPopupOpen.value = true;
  resetForm();
};

// Close the popup
const closePopup = () => {
  isPopupOpen.value = false;
};

// Submit a new address
async function submitAddress() {
  try {
    const response = await $axios.post("/create-address", form.value);
    if (response.data.success) {
      toast.success("Address added successfully!");
      closePopup();
      fetchAddresses();
    } else {
      toast.error("Error submitting address.");
    }
  } catch (error) {
    console.error("Error submitting address:", error.response?.data);
    toast.error("Error submitting address.");
  }
}

// Populate form with existing address data for editing
const editAddress = (address) => {
  isEditing.value = true;
  editingId.value = address.id;
  form.value = { ...address, is_default: Boolean(address.is_default) };
  isPopupOpen.value = true;
};

// Update existing address
async function updateAddress() {
  try {
    const response = await $axios.post("/update-address", {
      id: editingId.value,
      data: {
        name: form.value.name,
        address: form.value.address,
        city: form.value.city,
        phone: form.value.phone,
        type: form.value.type,
        is_default: form.value.is_default
      }
    });

    if (response.data.success) {
      toast.success("Address updated successfully!");
      closePopup();
      fetchAddresses();
    } else {
      toast.error("Failed to update address.");
    }
  } catch (error) {
    console.error("Error updating address:", error);
    toast.error("Error updating address.");
  }
}

// Delete an address
async function deleteAddress(id) {
  try {
    const response = await $axios.post("/delete-address", { id });
    if (response.data.success) {
      toast.success("Address deleted successfully!");
      fetchAddresses();
    } else {
      toast.error("Failed to delete address.");
    }
  } catch (error) {
    console.error("Error deleting address:", error);
    toast.error("Failed to delete address.");
  }
}

// Reset form
const resetForm = () => {
  form.value = {
    name: "",
    address: "",
    city: "",
    phone: "",
    type: "home",
    is_default: false,
  };
};
</script>

<style scoped>
.input-field {
  @apply mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-theme focus:border-theme;
}
</style>
