import { defineStore } from "pinia";
import { ref, inject, onMounted } from "vue";

export const useHomeStore = defineStore("homeStore", () => {
    const products = ref([]);
    const categories = ref([]);
    const sliders = ref([]);
    const featureProducts = ref([]);
    const compaigns = ref([]);
    const siteinfos = ref([]);
    const categoryName = ref("");
    const logo = ref("");
    const isFetched = ref(false);
    const isFetchedGetAllProducts = ref(false);
    // const isFetchedCategoryGroups = ref(false);
    // const isLoadingCategoryGroups = ref(false);
    const homePreloader = ref(false);

    const marketing = ref([]);
    const relatedProducts = ref([]);
    // const categoryGroups = ref([]);
    const videoProducts = ref([]);
    const categoriesWithProducts = ref({}); // New reactive property for the desired format

    const isFetchedCategoriesWithProducts = ref(false); // New flag for categoriesWithProducts

    const $axios = inject("$axios");

    const fetchData = async () => {
        if (isFetched.value) return;

        try {
            homePreloader.value = true;

            const response = await $axios.get("/home");

            if (response.data.siteinfos?.media?.length > 0) {
                logo.value = response.data.siteinfos.media[0].logo;
            }

            // Assign basic data
            // products.value = response.data.products || [];
            categories.value = response.data.categories || [];
            sliders.value = response.data.sliders || [];
            featureProducts.value =
                response.data.featureProducts?.slice(0, 10) || []; // Limit to 10
            videoProducts.value = response.data.videoProducts || [];
            compaigns.value = response.data.compaigns || [];
            siteinfos.value = response.data.siteinfos || [];

            if (response.data.siteinfos?.marketing?.length > 0) {
                marketing.value = response.data.siteinfos.marketing;
            }

            // Process categoriesWithProducts
            // categoriesWithProducts.value = await processCategoriesWithProducts(
            //     response.data.categories || []
            // );

            isFetched.value = true;
        } catch (error) {
            console.error("Error fetching home data:", error);
        } finally {
            homePreloader.value = false;
        }
    };
    const fetchGetAllProducts = async () => {
        if (isFetchedGetAllProducts.value) return;

        try {
            const response = await $axios.get("/get-all-products");
            //console.log("Response from get-all-products:", response.data);
            // Assign basic data
            products.value = response.data || [];

            isFetchedGetAllProducts.value = true;
        } catch (error) {
            console.error("Error fetching home data:", error);
        }
    };

    // Helper function to process categories and fetch their products

    const fetchCategoriesWithProducts = async (forceRefresh = false) => {
        if (isFetchedCategoriesWithProducts.value && !forceRefresh) return;

        try {
            const response = await $axios.get("/category-with-products");
            // Backend returns array of categories with products in the desired format
            categoriesWithProducts.value = response.data || [];
            isFetchedCategoriesWithProducts.value = true;

        } catch (error) {
            console.error("Error fetching categories with products:", error);
            isFetchedCategoriesWithProducts.value = false;
        }
    };

    // const fetchCategoryGroupData = async (forceRefresh = false) => {
    //     if (isFetchedCategoryGroups.value && !forceRefresh) return;

    //     isLoadingCategoryGroups.value = true;
    //     try {
    //         const response = await $axios.get("/category-groups");
    //         categoryGroups.value = response.data || [];
    //         isFetchedCategoryGroups.value = true;
    //     } catch (error) {
    //         isFetchedCategoryGroups.value = false;
    //     } finally {
    //         isLoadingCategoryGroups.value = false;
    //     }
    // };

    const fetchRelatedProducts = async (category) => {
        try {
            const response = await $axios.get(`/product-category/${category}`);
            relatedProducts.value = response.data.data || [];
        } catch (error) {
            console.error("Error fetching related products:", error);
        }
    };

    onMounted(() => {
        if (!isFetched.value) {
            fetchData();
        }
        // if (!isFetchedCategoryGroups.value) {
        //     fetchCategoryGroupData();
        // }
        if (!isFetchedCategoriesWithProducts.value) {
            fetchCategoriesWithProducts();
        }

        if (!isFetchedGetAllProducts.value) {
            fetchGetAllProducts();
        }
    });

    return {
        products,
        categories,
        sliders,
        featureProducts,
        compaigns,
        categoryName,
        fetchData,
        siteinfos,
        isFetched,
        homePreloader,
        logo,
        marketing,
        fetchRelatedProducts,
        videoProducts,
        relatedProducts,
        // categoryGroups,
        // fetchCategoryGroupData,
        // isLoadingCategoryGroups,
        categoriesWithProducts, // Expose the new property
        fetchCategoriesWithProducts, // Expose the fetch function
        isFetchedCategoriesWithProducts, // Expose the fetched flag
    };
});
