<script setup>
import { watch, computed, onMounted } from "vue";
import Header from "@/components/Header/Header.vue";
import Footer from "@/components/Footer.vue";
import Preloader from "@/components/Preloader/Preloader.vue";
import HomePreloder from "@/components/Preloader/HomePreloder.vue";
import { Toaster } from "@steveyuowo/vue-hot-toast";
import WhatsApp from "@/components/Icons/WhatsApp.vue";
import { useCartStore } from "../Store/cartStore";
import { useHomeStore } from "@/Store/homeStore";

const cartStore = useCartStore();
const homeStore = useHomeStore();

const media = computed(() => homeStore.siteinfos?.media || {});

// Function to inject marketing scripts dynamically
const injectMarketingScripts = () => {
    document
        .querySelectorAll(".marketing-script")
        .forEach((script) => script.remove());
    homeStore.marketing.forEach((scriptObj) => {
        if (!scriptObj.script) return;
        const script = document.createElement("script");
        script.classList.add("marketing-script");
        script.async = true;
        script.innerHTML = scriptObj.script
            .replace(/<script.*?>|<\/script>/gi, "")
            .trim();
        document.head.appendChild(script);
    });
};

// Watch for changes in marketing scripts
watch(
    () => homeStore.marketing,
    () => {
        injectMarketingScripts();
    },
    { deep: true, immediate: true }
);

onMounted(() => {
    if (media.value?.[0]?.favicon) {
        const faviconUrl = media.value[0].favicon;

        // Remove existing favicon(s)
        const existingFavicons = document.querySelectorAll('link[rel="icon"]');
        existingFavicons.forEach((favicon) => favicon.remove());

        // Create new favicon element
        const link = document.createElement("link");
        link.rel = "icon";
        link.type = "image/png";
        link.href = faviconUrl;

        // Append to <head>
        document.head.appendChild(link);
    }
});

watch(
    media,
    (newVal) => {
        if (newVal?.[0]?.favicon) {
            const faviconUrl = newVal[0].favicon;

            // Remove existing favicon(s)
            const existingFavicons =
                document.querySelectorAll('link[rel="icon"]');
            existingFavicons.forEach((favicon) => favicon.remove());

            // Create new favicon
            const link = document.createElement("link");
            link.rel = "icon";
            link.type = "image/png";
            link.href = faviconUrl;

            document.head.appendChild(link);
        }
    },
    { immediate: true }
);
</script>

<template>
    <HomePreloder v-if="homeStore.homePreloader" />
    <div v-else class="app-layout">
        <Toaster />

        <!-- Preloader -->
        <div v-if="cartStore.golobalLoading" class="global-preloader">
            <Preloader />
        </div>

        <!-- WhatsApp Icon -->
        <WhatsApp />
        <Header />
        <slot />
        <Footer :categories="homeStore.categories" />
    </div>
</template>

<style>
.global-preloader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}
</style>
