<template>
  <div class=" text-gray-800 ">
    <ul>
      <!-- <li class="mb-2">
        <Link
        href="/account"
        class="block p-4 rounded w-full text-left text-gray-900  hover:bg-gray-100"
          :class="$page.url === '/account' ? 'bg-theme text-white hover:text-white hover:bg-theme' : ''"
      >
        Dashboard
      </Link>
      </li> -->
      <li class="mb-2">
        <Link
          href="/account/orders"
          class="block p-4 rounded w-full text-left text-gray-900  hover:bg-gray-100"
          :class="$page.url === '/account/orders' ? 'bg-theme text-white hover:text-white hover:bg-theme' : ''"
        >
          My Orders
        </Link>
      </li>
      <li class="mb-2">
        <Link
          href="/account/address"
          class="block p-4 rounded w-full text-left text-gray-900  hover:bg-gray-100"
          :class="$page.url === '/account/address' ? 'bg-theme text-white hover:text-white hover:bg-theme' : ''"
        >
          Address
        </Link>
      </li>
      <li class="">
        <button class="block p-4 rounded hover:bg-gray-100 w-full text-left" v-if="authStore.isAuthenticated" @click="authStore.logout">Logout</button>
      </li>
    </ul>
    
  </div>
</template>

<script setup>

import { useAuthStore } from '@/Store/authStore';
import { Link, usePage } from '@inertiajs/vue3';

const authStore = useAuthStore();
const $page = usePage();


</script>

