<?php

namespace App\Http\Controllers;

use App\Models\MaintenanceRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MaintenanceRequestController extends Controller
{
    /**
     * Show the maintenance request form for the authenticated tenant.
     */
    public function create(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        if (! $request->user()->isTenant()) {
            abort(403, 'Unauthorized.');
        }

        $user = $request->user();
        $tenant = $user->tenantProfile;
        $lease = $tenant
            ? $tenant->leaseContracts()->where('status', 'active')->latest()->first()
            : null;
        $unit = $lease?->condominiumUnit;

        $tenantData = [
            'name' => $user->full_name,
            'address' => $tenant?->address ?? '—',
            'unit' => $unit ? "{$unit->unit_number} · {$unit->building}" : '—',
            'country' => 'Philippines',
            'email' => $user->email,
            'phone' => $tenant?->phone ?? '—',
        ];

        return Inertia::render('tenant/maintenance-request', [
            'tenant' => $tenantData,
        ]);
    }

    /**
     * Store a new maintenance request.
     */
    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        if (! $request->user()->isTenant()) {
            abort(403, 'Unauthorized.');
        }

        $tenant = $request->user()->tenantProfile;
        if (! $tenant) {
            return back()->withErrors(['tenant' => 'Tenant profile not found.']);
        }

        $lease = $tenant->leaseContracts()->where('status', 'active')->latest()->first();
        if (! $lease) {
            return back()->withErrors(['unit' => 'No active lease found.']);
        }

        $validated = $request->validate([
            'priority' => 'required|in:low,medium,high,urgent',
            'category' => 'required|in:plumbing,electrical,hvac,structural,pest_control,other',
            'description' => 'required|string|max:2000',
        ]);

        MaintenanceRequest::create([
            'tenant_profile_id' => $tenant->id,
            'condominium_unit_id' => $lease->condominium_unit_id,
            'title' => $validated['category'],
            'description' => $validated['description'],
            'category' => $validated['category'],
            'priority' => $validated['priority'],
            'status' => 'pending',
        ]);

        return redirect()->route('tenant.dashboard')->with('success', 'Maintenance request submitted.');
    }
}
