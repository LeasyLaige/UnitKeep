<?php

namespace App\Http\Controllers;

use App\Models\BillingRecord;
use App\Models\CondominiumUnit;
use App\Models\LeaseContract;
use App\Models\MaintenanceRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Redirect to the appropriate dashboard based on the user's role.
     */
    public function index(Request $request): \Illuminate\Http\RedirectResponse
    {
        return $request->user()->isAdmin()
            ? redirect()->route('admin.dashboard')
            : redirect()->route('tenant.dashboard');
    }

    /**
     * Show the admin dashboard.
     */
    public function admin(Request $request): Response
    {
        if (! $request->user()->isAdmin()) {
            abort(403, 'Unauthorized.');
        }

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalUnits' => CondominiumUnit::count(),
                'activeLeases' => LeaseContract::where('status', 'active')->count(),
                'pendingRequests' => MaintenanceRequest::where('status', 'pending')->count(),
                'occupiedUnits' => CondominiumUnit::where('status', 'occupied')->count(),
                'totalTenants' => \App\Models\TenantProfile::count(),
                'overduePayments' => BillingRecord::whereIn('status', ['unpaid', 'overdue'])
                    ->where('due_date', '<', now())
                    ->count(),
            ],
            'recentRequests' => MaintenanceRequest::with(['tenantProfile.user', 'condominiumUnit'])
                ->latest()
                ->take(5)
                ->get()
                ->map(fn ($r) => [
                    'id' => $r->id,
                    'title' => $r->title,
                    'category' => $r->category,
                    'priority' => $r->priority,
                    'status' => $r->status,
                    'tenant' => $r->tenantProfile->user->full_name,
                    'unit' => $r->condominiumUnit->unit_number,
                    'created_at' => $r->created_at->format('M d, Y'),
                ]),
        ]);
    }

    /**
     * Show the tenant's profile page.
     */
    public function profile(Request $request): Response
    {
        if (! $request->user()->isTenant()) {
            abort(403, 'Unauthorized.');
        }

        $user = $request->user();
        $tenant = $user->tenantProfile;
        $lease = $tenant
            ? $tenant->leaseContracts()->where('status', 'active')->with('condominiumUnit')->latest()->first()
            : null;
        $unit = $lease?->condominiumUnit;

        return Inertia::render('tenant/profile', [
            'profile' => $tenant ? [
                'phone' => $tenant->phone,
                'date_of_birth' => $tenant->date_of_birth?->format('M d, Y'),
                'address' => $tenant->address,
                'emergency_contact_name' => $tenant->emergency_contact_name,
                'emergency_contact_phone' => $tenant->emergency_contact_phone,
            ] : null,
            'user' => [
                'full_name' => $user->full_name,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
            ],
            'unit' => $unit ? [
                'unit_number' => $unit->unit_number,
                'building' => $unit->building,
                'floor' => $unit->floor,
                'type' => $unit->type,
                'area_sqm' => $unit->area_sqm,
                'status' => $unit->status,
            ] : null,
            'lease' => $lease ? [
                'monthly_rent' => number_format((float) $lease->monthly_rent, 2),
                'security_deposit' => number_format((float) $lease->security_deposit, 2),
                'start_date' => $lease->start_date->format('M d, Y'),
                'end_date' => $lease->end_date->format('M d, Y'),
                'status' => $lease->status,
                'terms' => $lease->terms,
            ] : null,
        ]);
    }

    /**
     * Show the tenant dashboard.
     */
    public function tenant(Request $request): Response
    {
        if (! $request->user()->isTenant()) {
            abort(403, 'Unauthorized.');
        }

        $user = $request->user();
        $tenant = $user->tenantProfile;
        $lease = $tenant
            ? $tenant->leaseContracts()->where('status', 'active')->with('condominiumUnit')->latest()->first()
            : null;
        $unit = $lease?->condominiumUnit;

        // Next unpaid billing
        $nextBilling = $tenant
            ? BillingRecord::where('tenant_profile_id', $tenant->id)
                ->whereIn('status', ['unpaid', 'partial', 'overdue'])
                ->orderBy('due_date')
                ->first()
            : null;

        // Latest billing record (any status)
        $latestBilling = $tenant
            ? BillingRecord::where('tenant_profile_id', $tenant->id)->latest('due_date')->first()
            : null;

        // Maintenance requests
        $maintenanceRequests = $tenant
            ? $tenant->maintenanceRequests()
                ->with('condominiumUnit')
                ->latest()
                ->take(5)
                ->get()
                ->map(fn ($r) => [
                    'id' => $r->id,
                    'title' => $r->title,
                    'category' => $r->category,
                    'status' => $r->status,
                    'created_at' => $r->created_at->format('M d, Y'),
                ])
            : collect();

        $openRequestCount = $tenant
            ? $tenant->maintenanceRequests()->whereIn('status', ['pending', 'in_progress'])->count()
            : 0;

        return Inertia::render('tenant/dashboard', [
            'tenantName' => $user->first_name,
            'unit' => $unit ? [
                'unit_number' => $unit->unit_number,
                'building' => $unit->building,
                'floor' => $unit->floor,
                'type' => $unit->type,
                'area_sqm' => $unit->area_sqm,
            ] : null,
            'lease' => $lease ? [
                'monthly_rent' => $lease->monthly_rent,
                'start_date' => $lease->start_date->format('M d, Y'),
                'end_date' => $lease->end_date->format('M d, Y'),
                'status' => $lease->status,
            ] : null,
            'billing' => [
                'monthlyPayment' => $lease ? number_format((float) $lease->monthly_rent, 2) : '0.00',
                'nextDue' => $nextBilling ? $nextBilling->due_date->format('M d, Y') : '—',
                'nextDueMonth' => $nextBilling?->billing_month ?? '—',
                'amountDue' => $nextBilling ? number_format((float) $nextBilling->amount_due, 2) : '0.00',
                'paymentStatus' => $nextBilling?->status ?? ($latestBilling?->status ?? 'none'),
            ],
            'maintenanceRequests' => $maintenanceRequests,
            'openRequestCount' => $openRequestCount,
        ]);
    }
}
