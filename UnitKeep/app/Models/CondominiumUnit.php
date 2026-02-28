<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CondominiumUnit extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'unit_number',
        'floor',
        'building',
        'type',
        'area_sqm',
        'monthly_rate',
        'status',
        'description',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'area_sqm' => 'decimal:2',
            'monthly_rate' => 'decimal:2',
        ];
    }

    /**
     * Get the lease contracts for the unit.
     */
    public function leaseContracts(): HasMany
    {
        return $this->hasMany(LeaseContract::class);
    }

    /**
     * Get the billing records for the unit.
     */
    public function billingRecords(): HasMany
    {
        return $this->hasMany(BillingRecord::class);
    }

    /**
     * Get the maintenance requests for the unit.
     */
    public function maintenanceRequests(): HasMany
    {
        return $this->hasMany(MaintenanceRequest::class);
    }

    /**
     * Get the active lease contract for the unit.
     */
    public function activeLease(): HasMany
    {
        return $this->leaseContracts()->where('status', 'active');
    }
}
