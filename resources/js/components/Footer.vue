<script setup>
import { Phone, Mail, MapPin } from "lucide-vue-next";
import FeatureSection from "./Footer/FeatureSection.vue";
import { Link } from "@inertiajs/vue3";
import { useHomeStore } from "@/Store/homeStore";
import { computed, inject } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";
import WhatsApp from "./Icons/WhatsApp.vue";

const homeStore = useHomeStore();

// Compute site information dynamically
const siteinfos = computed(() => homeStore.siteinfos?.[0] || {});
//console.log("hello", siteinfos);
const media = computed(() => homeStore.siteinfos?.media || {});

const storePhone = computed(() => siteinfos.value.store_phone_number || "N/A");
const storeEmail = computed(() => siteinfos.value.store_email || "N/A");
const storeAddress = computed(() => siteinfos.value.address || "N/A");
const facebookUrl = computed(() => siteinfos.value.facebook_url || "#");
const instagramUrl = computed(() => siteinfos.value.instagram_url || "#");
const youtubeUrl = computed(() => siteinfos.value.youtube_url || "#");
const xurl = computed(() => siteinfos.value.x_url || "#");
//console.log(siteinfos);

const props = defineProps({
    categories: {
        type: Array,
        required: true,
    },
});

</script>

<template>
    <!-- <FeatureSection /> -->

    <footer class="bg-[#DD9933] text-gray-300 py-10 relative">
        <div class="container mx-auto px-4 allcolor">
            <div
                class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 relative"
            >
                <!-- Logo and Contact -->
                <div class="text-left">
                    <h3 class="outlet text-base text-white">Outlet Location</h3>
                    <div class="outletb"></div>
                    <div class="w-[300px] text-[17.6px] text-black mt-6">
                        {{ storeAddress }}
                    </div>
                    <div class="text-[17.6px] text-black mt-6">
                        Call Now: {{ storePhone }}
                    </div>
                    <div class="text-[17.6px] text-black mt-6">
                        Email: <br />
                        <span class="hover:text-white">{{ storeEmail }}</span>
                    </div>
                    <!-- <img
                        :src="media[0]?.footer_image"
                        alt="Footer Logo"
                        class="md:mx-0 w-40"
                    /> -->

                    <div class="flex justify-start gap-4 mt-4 social-link-svg">
                        <a
                            :href="facebookUrl"
                            class="tooltip w-[30px] h-[30px] rounded-full bg-[#4064AC] flex justify-center items-center text-white"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 320 512"
                                width="12px"
                                height="12px"
                            >
                                <path
                                    fill="#fff"
                                    d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z"
                                />
                            </svg>
                            <div class="tooltiptext">facebook</div>
                        </a>
                        <a
                            :href="youtubeUrl"
                            class="tooltip w-[30px] h-[30px] rounded-full bg-[#F73B00] flex justify-center items-center text-white"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 576 512"
                                width="18px"
                                height="18px"
                            >
                                <path
                                    fill="#fff"
                                    d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z"
                                />
                            </svg>
                            <div class="tooltiptext">youtube</div>
                        </a>
                        <a
                            :href="instagramUrl"
                            class="tooltip w-[30px] h-[30px] rounded-full gradient flex justify-center items-center text-white"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 448 512"
                                width="20px"
                            >
                                <path
                                    fill="#fff"
                                    d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
                                />
                            </svg>
                            <div class="tooltiptext">Instagram</div>
                        </a>
                        <a
                            :href="xurl"
                            class="tooltip w-[30px] h-[30px] rounded-full bg-black flex justify-center items-center text-white"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                                width="18px"
                                height="18px"
                            >
                                <path
                                    fill="#fff"
                                    d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
                                />
                            </svg>
                            <div class="tooltiptext">twitter x</div>
                        </a>
                    </div>
                </div>
                <!-- for customer -->
                <div class="forcustomer">
                    <h3 class="outlet text-base text-white">INFORMATION</h3>
                    <div class="outletb"></div>
                    <ul class="mt-3 list-none">
                        <li>
                            <a
                                class="block py-3 text-white text-base border-b"
                                href="/privacy-policy"
                                >Privacy Policy</a
                            >
                        </li>
                        <li>
                            <a
                                class="block py-3 text-white text-base border-b"
                                href="/terms-and-conditions"
                                >Terms & Conditions</a
                            >
                        </li>
                        <li>
                            <a
                                class="block py-3 text-white text-base border-b"
                                href="/refund-and-returns-policy"
                                >Return & Exchange
                            </a>
                        </li>
                    </ul>
                </div>
                <!-- top Category -->
                <div class="forcustomer">
                    <h3 class="outlet text-base text-white">Usefull Links</h3>
                    <div class="outletb"></div>
                    <ul class="mt-3 list-none">
                        <!-- <li v-for="category in categories" :key="category.id">
                            <a
                                class="block py-3 text-white text-base border-b"
                                :href="'/shop?category=' + category.slug"
                                >{{ category.name }}
                            </a>
                        </li> -->

                        <li>
                            <a
                                class="block py-3 text-white text-base border-b"
                                href="/about-us"
                                >About Us</a
                            >
                        </li>
                        <li>
                            <a
                                class="block py-3 text-white text-base border-b"
                                href="/shipping"
                                >Shipping and delivery</a
                            >
                        </li>
                    </ul>
                </div>
                <!-- Nutrifu Food Facebook Page -->

                <div>
                    <div v-html="siteinfos?.facebook_iframe"></div>
                </div>

                <!-- <WhatsApp /> -->
                <!-- Information -->
                <!-- <div>
                    <h3 class="text-white font-bold text-lg mb-4">
                        INFORMATION
                    </h3>
                    <ul class="space-y-2">
                        <li>
                            <Link
                                href="/privacy-policy"
                                class="hover:text-yellow-400"
                                >Privacy Policy</Link
                            >
                        </li>
                        <li>
                            <Link
                                href="/terms-and-conditions"
                                class="hover:text-yellow-400"
                                >Terms & Conditions</Link
                            >
                        </li>
                        <li>
                            <Link
                                href="/refund-and-returns-policy"
                                class="hover:text-yellow-400"
                                >Return & Exchange Policy</Link
                            >
                        </li>
                    </ul>
                </div> -->

                <!-- Contact Info -->
                <!-- <div>
                    <h3 class="text-white font-bold text-lg mb-4">
                        CONTACT INFO
                    </h3>
                    <div class="flex flex-col gap-3">
                        <p class="text-sm flex gap-2">
                            <MapPin /> {{ storeAddress }}
                        </p>
                        <p class="text-sm flex gap-2">
                            <Mail /> {{ storeEmail }}
                        </p>
                        <p class="text-sm flex gap-2">
                            <Phone /> {{ storePhone }}
                        </p>
                    </div>
                </div> -->
                <!-- <div class="forcompany">
                    <h3 class="outlet text-base text-white">Company</h3>
                    <div class="outletb"></div>
                    <ul class="mt-3 list-none">
                        <li>
                            <a
                                class="block py-3 text-white text-base border-b"
                                href="#"
                                >About</a
                            >
                        </li>
                        <li>
                            <a
                                class="block py-3 text-white text-base border-b"
                                href="#"
                                >Terms & Conditions</a
                            >
                        </li>
                        <li>
                            <a
                                class="block py-3 text-white text-base border-b"
                                href="#"
                                >Privacy Policy</a
                            >
                        </li>
                        <li>
                            <a
                                class="block py-3 text-white text-base border-b"
                                href="#"
                                >Career</a
                            >
                        </li>
                        <li>
                            <a
                                class="block py-3 text-white text-base border-b"
                                href="#"
                                >Corporate Deal</a
                            >
                        </li>
                    </ul>
                </div> -->
                <!-- Facebook Widget -->

                <!-- <div class="mt-4">
                    <div v-html="siteinfos?.facebook_iframe"></div>
                </div> -->
            </div>

            <!-- Copyright -->
        </div>
    </footer>
    <div class="my-4 text-center bg-white">
        <p class="text-sm text-black">
            © {{ siteinfos?.app_name }} 2025. Developed by
            <a href="https://softexel.com/" target="_blank" class="text-black"
                >Softexel</a
            >
        </p>
    </div>
</template>

<style scoped>
.forcustomer ul li a {
    border-color: rgba(255, 255, 255, 0.08);
}

.forcustomer ul li:last-child a {
    border-color: transparent;
}
.forcompany ul li a {
    border-color: rgba(255, 255, 255, 0.08) !important;
}

.forcompany ul li:last-child a {
    border-color: transparent !important;
}
a {
    transition: color 0.3s;
}

.outlet {
    position: relative;
    display: inline-block;
    font-size: 1em;
    font-weight: 600;
}

.outletb {
    width: 30px;
    height: 4px;
    background: hsl(0deg 0% 100% / 30%);
    border-radius: 50px;
}

.allcolor * {
    color: #000 !important;
}

.tooltip {
    position: relative;
    display: inline-block;
    z-index: 999999999999999;
}

/* Tooltip text */

.tooltip .tooltiptext {
    visibility: hidden;
    width: 120px;
    background-color: #000 !important;
    color: #fff !important;
    text-align: center;
    padding: 5px 0;
    border-radius: 6px;

    /* Position the tooltip text - see examples below! */
    position: absolute;
    top: 25px;
    left: -50px;
    font-size: 12px;
    z-index: 999999999999999999999999;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
    visibility: visible;
}

.social-link-svg a {
    position: relative;
    z-index: 0 !important;
}

.social-link-svg a svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.gradient {
    background: #833ab4;
    background: linear-gradient(to right, #833ab4, #fd1d1d, #fcb045);
}
</style>
