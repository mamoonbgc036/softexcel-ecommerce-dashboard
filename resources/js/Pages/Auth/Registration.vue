<script setup>
import AppLayout from '@/Layouts/AppLayout.vue'
import RegistrationForm from '@/components/Auth/RegistrationForm.vue';
import { Head } from '@inertiajs/vue3';
</script>

<template>
  <Head> 
    <title>Registration</title>
  </Head>
  <AppLayout>
    <div class="registrationPage">
      <RegistrationForm />
    </div>
  </AppLayout>
</template>