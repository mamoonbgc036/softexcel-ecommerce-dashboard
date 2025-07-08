<?php

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;
use App\Http\Controllers\PageController;
use App\Http\Middleware\AuthenticateWithToken;

Route::get('/', [PageController::class, 'home'])->name('home');


Route::get('/product/{slug}', [PageController::class, 'singleProduct'])->name('product.detail');


Route::get('/product-category/{slug}', [PageController::class, 'categoryByProductPage'])->name('categoryByProductPage');
Route::get('/register', [PageController::class, 'register'])->name('register');
Route::get('/login', [PageController::class, 'login'])->name('login');


Route::get('/shop', [PageController::class, 'shop'])->name('product.shop');
Route::get('/compaigns-products', [PageController::class, 'compaignsProducts']);
Route::get('/hot-deals', [PageController::class, 'hotDeals']);

Route::get('/cart', [PageController::class, 'cart'])->name('cart.index');

Route::get('/checkout', [PageController::class, 'checkout'])->name('checkout.index');
Route::get('/checkout/success', [PageController::class, 'thankYou'])->name('checkout.success');

Route::get('/success/{invoiceNumber}', [PageController::class, 'orderSuccess'])->name('order.success');

Route::get('/order/data/{invoiceNumber}', [PageController::class, 'orderData']);

Route::get('/order-tracking', [PageController::class, 'orderTracking'])->name('order.tracking');



// police pages

Route::get('/privacy-policy', [PageController::class, 'privacyPolicy'])->name('page.privacy-policy');
Route::get('/terms-and-conditions', [PageController::class, 'termsAndConditions'])->name('page.terms-and-conditions');
Route::get('/refund-and-returns-policy', [PageController::class, 'refundAndReturnsPolicy'])->name('page.refund-and-returns-policy');
Route::get('/about-us', [PageController::class, 'aboutUs'])->name('page.about-us');
Route::get('/shipping', [PageController::class, 'shippingAndDelivery'])->name('page.shipping-and-delivery');
// Route::get('/about-us', [PageController::class, 'aboutUs'])->name('page.about-us');


Route::get('/clear', function () {
    Artisan::call('cache:clear');
    Artisan::call('config:clear');
    Artisan::call('route:clear');
    Artisan::call('view:clear');
    Artisan::call('optimize:clear');
    return redirect('/')->with('success', 'Cache cleared successfully');
});




Route::middleware([AuthenticateWithToken::class])->group(function () {

    Route::get('/account', [PageController::class, 'account'])->name('account');
    Route::get('/account/orders', [PageController::class, 'userOrders'])->name('account.orders');
    Route::get('/account/address', [PageController::class, 'userAddress'])->name('account.address');
    Route::get('/wishlist', [PageController::class, 'userWishlist'])->name('wishlist');
});
