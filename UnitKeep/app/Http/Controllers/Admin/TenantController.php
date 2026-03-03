<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TenantProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class TenantController extends Controller
{
    public function index()
    {
        $tenants = User::where('role', 'tenant')
            ->with('tenantProfile')
            ->get()
            ->map(fn ($u) => [
                'id' => $u->id,
                'full_name' => $u->full_name,
                'first_name' => $u->first_name,
                'last_name' => $u->last_name,
                'email' => $u->email,
                'phone' => $u->tenantProfile?->phone,
                'address' => $u->tenantProfile?->address,
                'created_at' => $u->created_at->format('M d, Y'),
            ]);

        return Inertia::render('admin/tenants/index', [
            'tenants' => $tenants,
        ]);
    }

    public function show(User $tenant)
    {
        $tenant->load(['tenantProfile.leaseContracts.condominiumUnit', 'tenantProfile.maintenanceRequests']);

        $profile = $tenant->tenantProfile;

        return Inertia::render('admin/tenants/show', [
            'tenant' => [
                'id' => $tenant->id,
                'full_name' => $tenant->full_name,
                'first_name' => $tenant->first_name,
                'last_name' => $tenant->last_name,
                'email' => $tenant->email,
                'created_at' => $tenant->created_at->format('M d, Y'),
                'profile' => $profile ? [
                    'phone' => $profile->phone,
                    'date_of_birth' => $profile->date_of_birth?->format('Y-m-d'),
                    'address' => $profile->address,
                    'emergency_contact_name' => $profile->emergency_contact_name,
                    'emergency_contact_phone' => $profile->emergency_contact_phone,
                    'notes' => $profile->notes,
                ] : null,
                'leases' => $profile ? $profile->leaseContracts->map(fn ($l) => [
                    'id' => $l->id,
                    'unit' => $l->condominiumUnit->unit_number . ' · ' . $l->condominiumUnit->building,
                    'start_date' => $l->start_date->format('M d, Y'),
                    'end_date' => $l->end_date->format('M d, Y'),
                    'monthly_rent' => number_format((float) $l->monthly_rent, 2),
                    'status' => $l->status,
                ]) : [],
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/tenants/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'phone' => 'nullable|string|max:50',
            'date_of_birth' => 'nullable|date',
            'address' => 'nullable|string|max:500',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:50',
            'notes' => 'nullable|string|max:2000',
        ]);

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'tenant',
            'email_verified_at' => now(),
        ]);

        TenantProfile::create([
            'user_id' => $user->id,
            'phone' => $request->phone,
            'date_of_birth' => $request->date_of_birth,
            'address' => $request->address,
            'emergency_contact_name' => $request->emergency_contact_name,
            'emergency_contact_phone' => $request->emergency_contact_phone,
            'notes' => $request->notes,
        ]);

        return redirect()->route('admin.tenants.index')
            ->with('success', 'Tenant created successfully.');
    }

    public function edit(User $tenant)
    {
        $profile = $tenant->tenantProfile;

        return Inertia::render('admin/tenants/edit', [
            'tenant' => [
                'id' => $tenant->id,
                'first_name' => $tenant->first_name,
                'last_name' => $tenant->last_name,
                'email' => $tenant->email,
                'phone' => $profile?->phone,
                'date_of_birth' => $profile?->date_of_birth?->format('Y-m-d'),
                'address' => $profile?->address,
                'emergency_contact_name' => $profile?->emergency_contact_name,
                'emergency_contact_phone' => $profile?->emergency_contact_phone,
                'notes' => $profile?->notes,
            ],
        ]);
    }

    public function update(Request $request, User $tenant)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $tenant->id,
            'phone' => 'nullable|string|max:50',
            'date_of_birth' => 'nullable|date',
            'address' => 'nullable|string|max:500',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:50',
            'notes' => 'nullable|string|max:2000',
        ]);

        $tenant->update([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
        ]);

        $tenant->tenantProfile()->updateOrCreate(
            ['user_id' => $tenant->id],
            [
                'phone' => $request->phone,
                'date_of_birth' => $request->date_of_birth,
                'address' => $request->address,
                'emergency_contact_name' => $request->emergency_contact_name,
                'emergency_contact_phone' => $request->emergency_contact_phone,
                'notes' => $request->notes,
            ]
        );

        return redirect()->route('admin.tenants.index')
            ->with('success', 'Tenant updated successfully.');
    }

    public function destroy(User $tenant)
    {
        $tenant->tenantProfile?->delete();
        $tenant->delete();

        return redirect()->route('admin.tenants.index')
            ->with('success', 'Tenant deleted successfully.');
    }
}
