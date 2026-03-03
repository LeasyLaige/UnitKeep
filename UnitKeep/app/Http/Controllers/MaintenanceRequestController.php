<?php

namespace App\Http\Controllers;

use App\Models\MaintenanceRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MaintenanceRequestController extends Controller
{
    /**
     * Tenant: List all of their own maintenance requests.
     */
    public function index(Request $request): Response
    {
        if (! $request->user()->isTenant()) {
            abort(403, 'Unauthorized.');
        }

        $tenant = $request->user()->tenantProfile;

        $requests = $tenant
            ? $tenant->maintenanceRequests()
                ->with('condominiumUnit')
                ->latest()
                ->get()
                ->map(fn ($r) => [
                    'id' => $r->id,
                    'title' => $r->title,
                    'description' => $r->description,
                    'category' => $r->category,
                    'priority' => $r->priority,
                    'status' => $r->status,
                    'unit' => $r->condominiumUnit->unit_number . ' · ' . $r->condominiumUnit->building,
                    'created_at' => $r->created_at->format('M d, Y'),
                    'resolved_at' => $r->resolved_at?->format('M d, Y'),
                    'admin_remarks' => $r->admin_remarks,
                ])
            : collect();

        return Inertia::render('tenant/maintenance-requests', [
            'requests' => $requests,
        ]);
    }

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

    /**
     * Admin: List all maintenance requests.
     */
    public function adminIndex(Request $request): Response
    {
        if (! $request->user()->isAdmin()) {
            abort(403, 'Unauthorized.');
        }

        $statusFilter = $request->query('status', 'all');

        $query = MaintenanceRequest::with(['tenantProfile.user', 'condominiumUnit'])
            ->latest();

        if ($statusFilter !== 'all') {
            $query->where('status', $statusFilter);
        }

        $requests = $query->get()->map(fn ($r) => [
            'id' => $r->id,
            'title' => $r->title,
            'description' => $r->description,
            'category' => $r->category,
            'priority' => $r->priority,
            'status' => $r->status,
            'tenant' => $r->tenantProfile->user->full_name,
            'unit' => $r->condominiumUnit->unit_number . ' · ' . $r->condominiumUnit->building,
            'created_at' => $r->created_at->format('M d, Y'),
            'resolved_at' => $r->resolved_at?->format('M d, Y'),
        ]);

        return Inertia::render('admin/maintenance-requests', [
            'requests' => $requests,
            'currentFilter' => $statusFilter,
        ]);
    }

    /**
     * Admin: Update a maintenance request status.
     */
    public function adminUpdate(Request $request, MaintenanceRequest $maintenanceRequest): \Illuminate\Http\RedirectResponse
    {
        if (! $request->user()->isAdmin()) {
            abort(403, 'Unauthorized.');
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,in_progress,resolved,cancelled',
        ]);

        $maintenanceRequest->update([
            'status' => $validated['status'],
            'resolved_at' => $validated['status'] === 'resolved' ? now() : $maintenanceRequest->resolved_at,
        ]);

        return back()->with('success', 'Maintenance request updated.');
    }
}
