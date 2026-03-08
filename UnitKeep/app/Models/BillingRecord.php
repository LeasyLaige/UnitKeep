<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BillingRecord extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'lease_contract_id',
        'tenant_profile_id',
        'condominium_unit_id',
        'billing_month',
        'amount_due',
        'amount_paid',
        'status',
        'due_date',
        'paid_date',
        'remarks',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount_due' => 'decimal:2',
            'amount_paid' => 'decimal:2',
            'due_date' => 'date',
            'paid_date' => 'date',
        ];
    }

    /**
     * Get the lease contract for the billing record.
     */
    public function leaseContract(): BelongsTo
    {
        return $this->belongsTo(LeaseContract::class);
    }

    /**
     * Get the tenant profile for the billing record.
     */
    public function tenantProfile(): BelongsTo
    {
        return $this->belongsTo(TenantProfile::class);
    }

    /**
     * Get the condominium unit for the billing record.
     */
    public function condominiumUnit(): BelongsTo
    {
        return $this->belongsTo(CondominiumUnit::class);
    }

    /**
     * Determine if the billing record is overdue.
     */
    /**
     * Get the payment receipts for this billing record.
     */
    public function paymentReceipts(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(PaymentReceipt::class);
    }

    public function isOverdue(): bool
    {
        return $this->status !== 'paid' && $this->due_date->isPast();
    }
}
