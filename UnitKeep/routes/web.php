<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MaintenanceRequestController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('admin/dashboard', [DashboardController::class, 'admin'])->name('admin.dashboard');
    Route::get('tenant/dashboard', [DashboardController::class, 'tenant'])->name('tenant.dashboard');

    Route::get('tenant/payments', function (Request $request) {
        if (! $request->user()->isTenant()) {
            abort(403, 'Unauthorized.');
        }

        return Inertia::render('tenant/payments');
    })->name('tenant.payments');

    Route::get('tenant/maintenance-request', [MaintenanceRequestController::class, 'create'])->name('tenant.maintenance-request.create');
    Route::post('tenant/maintenance-request', [MaintenanceRequestController::class, 'store'])->name('tenant.maintenance-request.store');
});

require __DIR__.'/settings.php';
