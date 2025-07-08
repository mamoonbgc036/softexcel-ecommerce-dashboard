<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;

class PageController extends Controller
{
    // public function singleProduct($slug)
    // {

    //     $apiUrl= env('API_URL');

    //     $productResponse = Http::get($apiUrl.'/product/'.$slug);

    //     if ($productResponse->successful()) {
    //          $productData = $productResponse->json();
    //         return Inertia::render('Product/Show', [
    //             'product' => $productData
    //         ]);
    //     } else {
    //         return Inertia::render('Error/NotFound');
    //     }
    // }

    public function singleProduct($slug)
    {
        return Inertia::render('Product/Show', [
            'slug' => $slug
        ]);
    }

    public function categoryByProductPage($slug)
    {
        return Inertia::render('Product/CategoryByProduct', [
            'slug' => $slug
        ]);
    }

    // public function home()
    // {
    //     $apiUrl = env('API_URL');

    //     // Fetch home data
    //     $homeResponse = Http::get("$apiUrl/home");
    //     $homeData = $homeResponse->successful() ? $homeResponse->json() : [];

    //     // Fetch category groups
    //     // $categoryGroupsResponse = Http::get("$apiUrl/category-groups");
    //     // $categoryGroups = $categoryGroupsResponse->successful() ? $categoryGroupsResponse->json() : [];

    //     // Filter only active categories and fetch products
    //     $activeCategoriesWithProducts = collect($homeData['categories'] ?? [])
    //         ->filter(fn($category) => $category['status'] === 'Active')
    //         ->map(function ($category) use ($apiUrl) {
    //             // Fetch products for the active category
    //             $categoryProductsResponse = Http::get("$apiUrl/product-category/{$category['slug']}");
    //             $products = $categoryProductsResponse->successful() ? $categoryProductsResponse->json()['data'] : [];

    //             // Exclude categories with no products
    //             if (empty($products)) {
    //                 return null;
    //             }

    //             return [
    //                 'id' => $category['id'],
    //                 'name' => $category['name'],
    //                 'slug' => $category['slug'],
    //                 'productCount' => count($products),
    //                 'products' => array_slice($products, 0, 5) // Show only 5 products by default
    //             ];
    //         })
    //         ->filter() // Remove null values (categories with no products)
    //         ->toArray();

    //     return Inertia::render('Home', [
    //         'products' => $homeData['products'] ?? [],
    //         'categories' => $homeData['categories'] ?? [],
    //         'sliders' => $homeData['sliders'] ?? [],
    //         'compaigns' => $homeData['compaigns'] ?? [],
    //         'videoProducts' => $homeData['videoProducts'] ?? [],
    //         'featureProducts' => array_slice($homeData['featureProducts'] ?? [], 0, 10), // Limit feature products to 10
    //         'categoriesWithProducts' => $activeCategoriesWithProducts,
    //         // 'categoryGroups' => $categoryGroups,
    //     ]);
    // }


    public function home()
    {

        return Inertia::render('Home');
    }




    public function compaignsProducts()
    {
        return Inertia::render('Product/CompaignsProducts');
    }
    public function hotDeals()
    {
        return Inertia::render('Product/hotDeals');
    }

    public function orderTracking()
    {
        return Inertia::render('Order/OrderTrack');
    }




    public function register()
    {
        return Inertia::render('Auth/Registration');
    }

    public function login()
    {
        return Inertia::render('Auth/Login');
    }

    public function shop(Request $request)
    {
        return Inertia::render('Product/Shop', [
            'initialCategorySlug' => $request->query('category', null),
            'initialSubCategorySlug' => $request->query('subcategory', null),
        ]);
    }

    public function cart()
    {
        return Inertia::render('Cart/Index');
    }

    public function checkout()
    {
        return Inertia::render('Checkout/Index');
    }
    // public function thankYou()
    // {
    //     return Inertia::render('Checkout/ThankYou');
    // }


    // public function orderSuccess($invoiceNumber)
    // {

    //     $apiUrl = env('API_URL');

    //     $response = Http::get($apiUrl . '/order/data/' . $invoiceNumber);

    //     // Ensure the request was successful
    //     if (!$response->successful()) {
    //         abort(500, 'Failed to fetch order data');
    //     }

    //     $orderData = $response->json();

    //     if (!$orderData['success']) {
    //         abort(404, 'Order not found');
    //     }

    //     return Inertia::render('Checkout/Success', [
    //         'order' => $orderData['data']['order'],
    //         'checkoutMessage' => $orderData['data']['checkoutMessage'] ?? '',
    //     ]);
    // }

    public function orderSuccess($invoiceNumber)
    {
        return Inertia::render('Checkout/Success', [
            'invoiceNumber' => $invoiceNumber,
        ]);
    }


    // after login
    public function account()
    {
        return Inertia::render('Account/Index');
    }
    public function userOrders()
    {
        return Inertia::render('Account/OrderList');
    }
    public function userAddress()
    {
        return Inertia::render('Account/Address');
    }

    public function privacyPolicy()
    {
        return Inertia::render('Policy/PrivacyPolicy');
    }
    public function termsAndConditions()
    {
        return Inertia::render('Policy/TermsConditions');
    }

    public function refundAndReturnsPolicy()
    {
        return Inertia::render('Policy/RefundPolicy');
    }
    public function aboutUs()
    {
        return Inertia::render('Policy/AboutUs');
    }
    public function shippingAndDelivery()
    {
        return Inertia::render('Policy/ShippingAndDelivery');
    }


    public function userWishlist()
    {
        return Inertia::render('Wishlist/Index');
    }
}
