<?php

namespace App\Http\Controllers;

use App\Models\BillingRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentsController extends Controller
{
    /**
     * Display the tenant's payment / billing history.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $tenant = $user->tenantProfile;

        $billingRecords = $tenant
            ? BillingRecord::where('tenant_profile_id', $tenant->id)
                ->orderByDesc('due_date')
                ->get()
                ->map(fn ($b) => [
                    'id' => $b->id,
                    'billing_month' => $b->billing_month,
                    'amount_due' => number_format((float) $b->amount_due, 2),
                    'amount_paid' => number_format((float) $b->amount_paid, 2),
                    'due_date' => $b->due_date->format('M d, Y'),
                    'status' => $b->status,
                    'paid_date' => $b->paid_date?->format('M d, Y'),
                    'remarks' => $b->remarks,
                    'isOverdue' => $b->isOverdue(),
                ])
            : collect();

        $lease = $tenant
            ? $tenant->leaseContracts()->where('status', 'active')->latest()->first()
            : null;

        return Inertia::render('tenant/payments', [
            'billingRecords' => $billingRecords,
            'monthlyRent' => $lease?->monthly_rent ?? '0.00',
        ]);
    }
}
