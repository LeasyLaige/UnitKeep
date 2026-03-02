<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MaintenanceRequestController;
use App\Http\Controllers\PaymentsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Admin routes
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'admin'])->name('admin.dashboard');
        Route::get('maintenance-requests', [MaintenanceRequestController::class, 'adminIndex'])->name('admin.maintenance-requests');
        Route::patch('maintenance-requests/{maintenanceRequest}', [MaintenanceRequestController::class, 'adminUpdate'])->name('admin.maintenance-requests.update');
    });

    // Tenant routes
    Route::middleware('tenant')->prefix('tenant')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'tenant'])->name('tenant.dashboard');
        Route::get('payments', [PaymentsController::class, 'index'])->name('tenant.payments');
        Route::get('maintenance-request', [MaintenanceRequestController::class, 'create'])->name('tenant.maintenance-request.create');
        Route::post('maintenance-request', [MaintenanceRequestController::class, 'store'])->name('tenant.maintenance-request.store');
    });
});

require __DIR__.'/settings.php';
