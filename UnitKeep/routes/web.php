<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('admin/dashboard', [DashboardController::class, 'admin'])->name('admin.dashboard');
    Route::get('tenant/dashboard', [DashboardController::class, 'tenant'])->name('tenant.dashboard');
});

require __DIR__.'/settings.php';
