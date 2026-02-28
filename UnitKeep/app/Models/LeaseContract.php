<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LeaseContract extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'tenant_profile_id',
        'condominium_unit_id',
        'start_date',
        'end_date',
        'monthly_rent',
        'security_deposit',
        'status',
        'terms',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'monthly_rent' => 'decimal:2',
            'security_deposit' => 'decimal:2',
        ];
    }

    /**
     * Get the tenant profile that owns the lease.
     */
    public function tenantProfile(): BelongsTo
    {
        return $this->belongsTo(TenantProfile::class);
    }

    /**
     * Get the condominium unit for the lease.
     */
    public function condominiumUnit(): BelongsTo
    {
        return $this->belongsTo(CondominiumUnit::class);
    }

    /**
     * Get the billing records for the lease.
     */
    public function billingRecords(): HasMany
    {
        return $this->hasMany(BillingRecord::class);
    }

    /**
     * Determine if the lease is currently active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active' && $this->end_date->isFuture();
    }
}
