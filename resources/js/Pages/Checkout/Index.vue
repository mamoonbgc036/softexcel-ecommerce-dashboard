<script setup>
import AppLayout from "@/Layouts/AppLayout.vue";
import CheckoutForm from "@/components/Checkout/CheckoutForm.vue";
import { Head } from "@inertiajs/vue3";
</script>

<template>
    <Head>
        <title>Checkout</title>
    </Head>
    <AppLayout>
        <div class="cartPage">
            <CheckoutForm />
        </div>
    </AppLayout>
</template>
