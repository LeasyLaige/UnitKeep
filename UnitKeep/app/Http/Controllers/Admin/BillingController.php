<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BillingRecord;
use App\Models\LeaseContract;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BillingController extends Controller
{
    public function index(Request $request)
    {
        $query = BillingRecord::with(['tenantProfile.user', 'condominiumUnit', 'leaseContract']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('month')) {
            $query->where('billing_month', $request->month);
        }

        $records = $query->latest('due_date')
            ->get()
            ->map(fn ($r) => [
                'id' => $r->id,
                'tenant_name' => $r->tenantProfile->user->full_name ?? 'N/A',
                'unit' => $r->condominiumUnit->unit_number . ' · ' . $r->condominiumUnit->building,
                'billing_month' => $r->billing_month,
                'amount_due' => number_format((float) $r->amount_due, 2),
                'amount_paid' => number_format((float) $r->amount_paid, 2),
                'status' => $r->status,
                'due_date' => $r->due_date?->format('M d, Y'),
                'paid_date' => $r->paid_date?->format('M d, Y'),
                'remarks' => $r->remarks,
            ]);

        // Available months for filter
        $months = BillingRecord::select('billing_month')
            ->distinct()
            ->orderBy('billing_month', 'desc')
            ->pluck('billing_month');

        return Inertia::render('admin/billing/index', [
            'records' => $records,
            'months' => $months,
            'filters' => [
                'status' => $request->status,
                'month' => $request->month,
            ],
        ]);
    }

    /**
     * Generate billing records for a given month.
     */
    public function generate(Request $request)
    {
        $request->validate([
            'month' => 'required|date_format:Y-m',
        ]);

        $month = $request->month;
        $dueDate = Carbon::createFromFormat('Y-m', $month)->endOfMonth();

        $activeLeases = LeaseContract::where('status', 'active')
            ->where('start_date', '<=', $dueDate)
            ->where('end_date', '>=', Carbon::createFromFormat('Y-m', $month)->startOfMonth())
            ->get();

        $generated = 0;

        foreach ($activeLeases as $lease) {
            $exists = BillingRecord::where('lease_contract_id', $lease->id)
                ->where('billing_month', $month)
                ->exists();

            if (! $exists) {
                BillingRecord::create([
                    'lease_contract_id' => $lease->id,
                    'tenant_profile_id' => $lease->tenant_profile_id,
                    'condominium_unit_id' => $lease->condominium_unit_id,
                    'billing_month' => $month,
                    'amount_due' => $lease->monthly_rent,
                    'amount_paid' => 0,
                    'status' => 'unpaid',
                    'due_date' => $dueDate,
                ]);
                $generated++;
            }
        }

        return redirect()->route('admin.billing.index')
            ->with('success', "Generated {$generated} billing records for {$month}.");
    }

    /**
     * Mark a billing record as paid.
     */
    public function markPaid(BillingRecord $billing)
    {
        $billing->update([
            'amount_paid' => $billing->amount_due,
            'status' => 'paid',
            'paid_date' => now(),
        ]);

        return redirect()->route('admin.billing.index')
            ->with('success', 'Billing record marked as paid.');
    }

    /**
     * Record a partial payment.
     */
    public function recordPayment(Request $request, BillingRecord $billing)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0.01|max:' . ($billing->amount_due - $billing->amount_paid),
        ]);

        $newPaid = (float) $billing->amount_paid + (float) $request->amount;
        $status = $newPaid >= (float) $billing->amount_due ? 'paid' : 'partial';

        $billing->update([
            'amount_paid' => $newPaid,
            'status' => $status,
            'paid_date' => $status === 'paid' ? now() : null,
        ]);

        return redirect()->route('admin.billing.index')
            ->with('success', 'Payment recorded successfully.');
    }
}
