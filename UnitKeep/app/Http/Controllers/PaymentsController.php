<?php

namespace App\Http\Controllers;

use App\Models\BillingRecord;
use App\Models\PaymentReceipt;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
                ->with('paymentReceipts')
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
                    'receipt' => ($receipt = $b->paymentReceipts->last()) ? [
                        'url' => route('payments.receipt', $receipt->id),
                        'name' => $receipt->original_name,
                    ] : null,
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

    /**
     * Store an uploaded payment receipt image for a specific billing record.
     */
    public function uploadReceipt(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'receipt' => ['required', 'image', 'max:5120'],
            'billing_record_id' => ['required', 'exists:billing_records,id'],
        ]);

        $user = $request->user();
        $tenant = $user->tenantProfile;

        // Verify the billing record belongs to this tenant
        $billingRecord = BillingRecord::where('id', $validated['billing_record_id'])
            ->where('tenant_profile_id', $tenant->id)
            ->firstOrFail();

        /** @var \Illuminate\Http\UploadedFile $file */
        $file = $validated['receipt'];

        $path = $file->store('payment-receipts', 'public');

        PaymentReceipt::create([
            'user_id' => $user->id,
            'billing_record_id' => $billingRecord->id,
            'path' => $path,
            'original_name' => $file->getClientOriginalName(),
        ]);

        return back()->with('success', 'Receipt uploaded successfully.');
    }

    /**
     * Display a stored payment receipt image.
     */
    public function showReceipt(Request $request, PaymentReceipt $receipt)
    {
        $user = $request->user();

        // Admins can view any receipt; tenants can only view their own.
        if (! $user->isAdmin()) {
            $tenant = $user->tenantProfile;
            abort_unless($tenant && $receipt->billingRecord?->tenant_profile_id === $tenant->id, 403);
        }

        if (! Storage::disk('public')->exists($receipt->path)) {
            abort(404);
        }

        return Storage::disk('public')->response($receipt->path, $receipt->original_name);
    }
}

