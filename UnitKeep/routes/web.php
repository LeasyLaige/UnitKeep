<?php

use App\Http\Controllers\Admin\BillingController;
use App\Http\Controllers\Admin\LeaseController;
use App\Http\Controllers\Admin\TenantController;
use App\Http\Controllers\Admin\UnitController;
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
    Route::middleware(['auth', 'admin'])
        ->prefix('admin')
        ->name('admin.')
        ->group(function () {

            Route::get('dashboard', [DashboardController::class, 'admin'])
                ->name('dashboard');

            Route::get('maintenance-requests', [MaintenanceRequestController::class, 'adminIndex'])
                ->name('maintenance-requests');

            Route::patch('maintenance-requests/{maintenanceRequest}',
                [MaintenanceRequestController::class, 'adminUpdate'])
                ->name('maintenance-requests.update');

            Route::resource('tenants', TenantController::class);
            Route::resource('units', UnitController::class)->except(['show']);
            Route::resource('leases', LeaseController::class)->except(['show']);

            // Billing management
            Route::get('billing', [BillingController::class, 'index'])->name('billing.index');
            Route::post('billing/generate', [BillingController::class, 'generate'])->name('billing.generate');
            Route::patch('billing/{billing}/mark-paid', [BillingController::class, 'markPaid'])->name('billing.mark-paid');
            Route::patch('billing/{billing}/record-payment', [BillingController::class, 'recordPayment'])->name('billing.record-payment');
        });

    // Tenant routes
    Route::middleware('tenant')->prefix('tenant')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'tenant'])->name('tenant.dashboard');
        Route::get('profile', [DashboardController::class, 'profile'])->name('tenant.profile');

        Route::get('payments', [PaymentsController::class, 'index'])->name('tenant.payments');
        Route::post('payments/receipt', [PaymentsController::class, 'uploadReceipt'])->name('tenant.payments.upload-receipt');

        Route::get('documents', function () {
            return Inertia::render('tenant/documents');
        })->name('tenant.documents');

        Route::get('maintenance-requests', [MaintenanceRequestController::class, 'index'])->name('tenant.maintenance-requests');
        Route::get('maintenance-request', [MaintenanceRequestController::class, 'create'])->name('tenant.maintenance-request.create');
        Route::post('maintenance-request', [MaintenanceRequestController::class, 'store'])->name('tenant.maintenance-request.store');
    });
});

require __DIR__.'/settings.php';
