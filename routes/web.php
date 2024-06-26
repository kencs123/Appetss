<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HomepagesController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\TransactionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get('/dashboard', function () {
    return Inertia::render('Homepages');
})->middleware(['auth', 'verified'])->name('dashboard');




Route::get('/', function () {
    return redirect('/login');
});

Route::get('/homepages', [HomepagesController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('homepages.search');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    //Route::get('/items/{item}', [ItemController::class, 'show'])->name('items.show');

    Route::resource('/item', ItemController::class);
    Route::post('/cart/store', [CartController::class, 'store'])->name('cart.store');


  //  Route::resource('/wishlist', WishlistController::class);
    Route::post('/wishlist/store', [WishlistController::class, 'store']);

    Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist.index');

    Route::delete('/wishlist/{itemId}', [WishlistController::class, 'destroy']);
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::delete('/cart/{itemId}', [CartController::class, 'destroy']);
    Route::post('/cart/store', [CartController::class,'store']);
   

// Route to show the payment page

Route::get('/payment', [TransactionController::class, 'showPaymentPage'])->name('payment.get');
Route::post('/payment', [TransactionController::class, 'showPaymentPage'])->name('payment.post');
//Route::post('/process-payment', [TransactionController::class, 'processPayment']);
Route::post('/process-payment', [TransactionController::class, 'processPayment'])->name('processPayment');


Route::get('/myorder', [TransactionController::class, 'showMyOrder'])->name('myorder');
Route::put('/transactions/{id}', [TransactionController::class, 'updateStatus']);



});

require __DIR__.'/auth.php';
