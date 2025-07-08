<template>
    <div class="container">
        <div class="wrapper absolute">
            <div id="main-div">
                <div
                    id="main-button"
                    :class="isOpen ? 'wave open' : 'wave'"
                    @click="openbox"
                >
                    <svg
                        data-v-59435867=""
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="30"
                    >
                        <path
                            fill="#fff"
                            data-v-59435867=""
                            d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"
                        ></path>
                        <path
                            fill="#fff"
                            data-v-59435867=""
                            d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"
                        ></path>
                    </svg>
                </div>

                <a
                    :href="'https://wa.me/' + whatsappNumber"
                    class="whatsapp-color wp"
                    style="bottom: 180px"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        width="30"
                    >
                        <path
                            fill="#fff"
                            d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"
                        />
                    </svg>
                </a>
                <a href="https://m.me/nutrifyfoodbd" class="messenger-color">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        width="30"
                    >
                        <path
                            fill="#fff"
                            d="M256.6 8C116.5 8 8 110.3 8 248.6c0 72.3 29.7 134.8 78.1 177.9 8.4 7.5 6.6 11.9 8.1 58.2A19.9 19.9 0 0 0 122 502.3c52.9-23.3 53.6-25.1 62.6-22.7C337.9 521.8 504 423.7 504 248.6 504 110.3 396.6 8 256.6 8zm149.2 185.1l-73 115.6a37.4 37.4 0 0 1 -53.9 9.9l-58.1-43.5a15 15 0 0 0 -18 0l-78.4 59.4c-10.5 7.9-24.2-4.6-17.1-15.7l73-115.6a37.4 37.4 0 0 1 53.9-9.9l58.1 43.5a15 15 0 0 0 18 0l78.4-59.4c10.4-8 24.1 4.5 17.1 15.6z"
                        />
                    </svg>
                </a>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useHomeStore } from "@/Store/homeStore";
import { computed, ref } from "vue";

const isOpen = ref(false);
const openbox = computed(() => {
    isOpen.value = !isOpen.value;
});

// const closebot = computed(() => {
//     isOpen.value = false;
// });
const homeStore = useHomeStore();
console.log("shu", homeStore.siteinfos);
const whatsappNumber = computed(
    () => homeStore.siteinfos?.[0]?.whatsapp_number || null
);

console.log("show", whatsappNumber);
</script>

<style scoped>
#main-div {
    position: fixed;
    right: 20px;
    bottom: 20px;
    z-index: 5000;
}

#main-button {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 0;
    bottom: 62px;
    height: 50px;
    width: 50px;
    font-size: 20px;
    color: #0064f3;
    cursor: pointer;
    background-color: #4caf50;
    box-shadow: 0 0 10px 0 rgba(21, 151, 54, 0.5);
    border-radius: 50%;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    -ms-border-radius: 50%;
    -o-border-radius: 50%;
    z-index: 9999999999999999;
}

#main-button ~ button {
    visibility: hidden;
    font-weight: 600;
    height: 50px;
    padding: 0 20px;
    color: #fff;
    background: linear-gradient(90deg, #00a1f5, #0064f3);
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
    border: 0;
    position: absolute;
    z-index: -1;
    right: 0;
    bottom: 0;
    opacity: 0;
    white-space: nowrap;
    cursor: pointer;
    transition: 0.2s all linear;
    -webkit-transition: 0.2s all linear;
    -moz-transition: 0.2s all linear;
    -ms-transition: 0.2s all linear;
    -o-transition: 0.2s all linear;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    -ms-border-radius: 5px;
    -o-border-radius: 5px;
}

#main-button.open ~ button {
    visibility: visible;
    right: 70px;
    opacity: 1;
    transition: 0.4s all cubic-bezier(0, 0.01, 0, 1.27);
    -webkit-transition: 0.4s all cubic-bezier(0, 0.01, 0, 1.27);
    -moz-transition: 0.4s all cubic-bezier(0, 0.01, 0, 1.27);
    -ms-transition: 0.4s all cubic-bezier(0, 0.01, 0, 1.27);
    -o-transition: 0.4s all cubic-bezier(0, 0.01, 0, 1.27);
}

#main-button ~ a {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: -1;
    height: 50px;
    width: 50px;
    font-size: 20px;
    opacity: 0;
    text-decoration: none;
    color: #fff;
    background-color: #fff;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    -ms-border-radius: 50%;
    -o-border-radius: 50%;
    transition: 0.2s all linear;
    -webkit-transition: 0.2s all linear;
    -moz-transition: 0.2s all linear;
    -ms-transition: 0.2s all linear;
    -o-transition: 0.2s all linear;
}

#main-button ~ .telegram-color {
    background: linear-gradient(0deg, #017ab1, #01abe6);
}

#main-button ~ .whatsapp-color {
    bottom: 60px !important;
    background: linear-gradient(0deg, #00b100, #09db09);
}

#main-button ~ .messenger-color {
    bottom: 60px;
    background: linear-gradient(0deg, #0078ff, #00c6ff);
}
#main-button ~ .close {
    background-color: transparent;
    box-shadow: none;
}

#main-button.open ~ a {
    opacity: 1;
    transition: 0.4s all cubic-bezier(0, 0.01, 0, 1.27);
    -webkit-transition: 0.4s all cubic-bezier(0, 0.01, 0, 1.27);
    -moz-transition: 0.4s all cubic-bezier(0, 0.01, 0, 1.27);
    -ms-transition: 0.4s all cubic-bezier(0, 0.01, 0, 1.27);
    -o-transition: 0.4s all cubic-bezier(0, 0.01, 0, 1.27);
}
#main-button.open ~ a:nth-of-type(1) {
    bottom: 180px !important;
}
#main-button.open ~ a:nth-of-type(2) {
    bottom: 120px;
}
#main-button.open ~ a:nth-of-type(3) {
    bottom: 60px;
}

.wave {
    animation-name: wave;
    animation-duration: 1s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
}

@keyframes wave {
    0% {
        box-shadow: 0 0 0px 0px rgba(255, 255, 255, 0.5);
    }
    100% {
        box-shadow: 0 0 0px 10px rgba(236, 171, 31, 0.61);
    }
}

.open {
    animation-iteration-count: 1;
}
.whatsapp svg {
    width: 50px;
    height: 50px;
    padding: 5px;
    border-radius: 50%;
    background-color: #29a71a;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    transition: all 0.3s ease;
}

@media (min-width: 768px) {
    #main-div {
        position: fixed;
        right: 85px;
        bottom: 59px;
        z-index: 5000;
    }
}
</style>
