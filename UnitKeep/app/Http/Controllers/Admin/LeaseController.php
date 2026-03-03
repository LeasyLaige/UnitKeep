<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CondominiumUnit;
use App\Models\LeaseContract;
use App\Models\TenantProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeaseController extends Controller
{
    public function index()
    {
        $leases = LeaseContract::with(['tenantProfile.user', 'condominiumUnit'])
            ->latest()
            ->get()
            ->map(fn ($l) => [
                'id' => $l->id,
                'tenant_name' => $l->tenantProfile->user->full_name,
                'unit' => $l->condominiumUnit->unit_number . ' · ' . $l->condominiumUnit->building,
                'start_date' => $l->start_date->format('M d, Y'),
                'end_date' => $l->end_date->format('M d, Y'),
                'monthly_rent' => number_format((float) $l->monthly_rent, 2),
                'security_deposit' => number_format((float) $l->security_deposit, 2),
                'status' => $l->status,
            ]);

        return Inertia::render('admin/leases/index', [
            'leases' => $leases,
        ]);
    }

    public function create()
    {
        $tenants = User::where('role', 'tenant')
            ->whereHas('tenantProfile')
            ->with('tenantProfile')
            ->get()
            ->map(fn ($u) => [
                'tenant_profile_id' => $u->tenantProfile->id,
                'name' => $u->full_name,
            ]);

        $units = CondominiumUnit::where('status', 'available')
            ->get()
            ->map(fn ($u) => [
                'id' => $u->id,
                'label' => $u->unit_number . ' · ' . $u->building . ' (₱' . number_format((float) $u->monthly_rate, 2) . '/mo)',
                'monthly_rate' => $u->monthly_rate,
            ]);

        return Inertia::render('admin/leases/create', [
            'tenants' => $tenants,
            'units' => $units,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'tenant_profile_id' => 'required|exists:tenant_profiles,id',
            'condominium_unit_id' => 'required|exists:condominium_units,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'monthly_rent' => 'required|numeric|min:0',
            'security_deposit' => 'nullable|numeric|min:0',
            'terms' => 'nullable|string|max:5000',
        ]);

        LeaseContract::create([
            'tenant_profile_id' => $request->tenant_profile_id,
            'condominium_unit_id' => $request->condominium_unit_id,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'monthly_rent' => $request->monthly_rent,
            'security_deposit' => $request->security_deposit ?? 0,
            'status' => 'active',
            'terms' => $request->terms,
        ]);

        // Mark unit as occupied
        CondominiumUnit::where('id', $request->condominium_unit_id)
            ->update(['status' => 'occupied']);

        return redirect()->route('admin.leases.index')
            ->with('success', 'Lease contract created successfully.');
    }

    public function edit(LeaseContract $lease)
    {
        $lease->load(['tenantProfile.user', 'condominiumUnit']);

        $tenants = User::where('role', 'tenant')
            ->whereHas('tenantProfile')
            ->with('tenantProfile')
            ->get()
            ->map(fn ($u) => [
                'tenant_profile_id' => $u->tenantProfile->id,
                'name' => $u->full_name,
            ]);

        $units = CondominiumUnit::whereIn('status', ['available', 'occupied'])
            ->get()
            ->map(fn ($u) => [
                'id' => $u->id,
                'label' => $u->unit_number . ' · ' . $u->building,
                'monthly_rate' => $u->monthly_rate,
            ]);

        return Inertia::render('admin/leases/edit', [
            'lease' => [
                'id' => $lease->id,
                'tenant_profile_id' => $lease->tenant_profile_id,
                'condominium_unit_id' => $lease->condominium_unit_id,
                'start_date' => $lease->start_date->format('Y-m-d'),
                'end_date' => $lease->end_date->format('Y-m-d'),
                'monthly_rent' => $lease->monthly_rent,
                'security_deposit' => $lease->security_deposit,
                'status' => $lease->status,
                'terms' => $lease->terms,
                'tenant_name' => $lease->tenantProfile->user->full_name,
                'unit_label' => $lease->condominiumUnit->unit_number . ' · ' . $lease->condominiumUnit->building,
            ],
            'tenants' => $tenants,
            'units' => $units,
        ]);
    }

    public function update(Request $request, LeaseContract $lease)
    {
        $request->validate([
            'tenant_profile_id' => 'required|exists:tenant_profiles,id',
            'condominium_unit_id' => 'required|exists:condominium_units,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'monthly_rent' => 'required|numeric|min:0',
            'security_deposit' => 'nullable|numeric|min:0',
            'status' => 'required|in:active,expired,terminated,pending_renewal',
            'terms' => 'nullable|string|max:5000',
        ]);

        // If unit changed, free up old unit
        if ($lease->condominium_unit_id != $request->condominium_unit_id) {
            CondominiumUnit::where('id', $lease->condominium_unit_id)
                ->update(['status' => 'available']);
            CondominiumUnit::where('id', $request->condominium_unit_id)
                ->update(['status' => 'occupied']);
        }

        // If status changed to terminated/expired, free the unit
        if (in_array($request->status, ['terminated', 'expired']) && $lease->status === 'active') {
            CondominiumUnit::where('id', $request->condominium_unit_id)
                ->update(['status' => 'available']);
        }

        $lease->update($request->only([
            'tenant_profile_id', 'condominium_unit_id',
            'start_date', 'end_date', 'monthly_rent',
            'security_deposit', 'status', 'terms',
        ]));

        return redirect()->route('admin.leases.index')
            ->with('success', 'Lease contract updated successfully.');
    }

    public function destroy(LeaseContract $lease)
    {
        // Free up the unit
        CondominiumUnit::where('id', $lease->condominium_unit_id)
            ->update(['status' => 'available']);

        $lease->delete();

        return redirect()->route('admin.leases.index')
            ->with('success', 'Lease contract deleted successfully.');
    }
}
