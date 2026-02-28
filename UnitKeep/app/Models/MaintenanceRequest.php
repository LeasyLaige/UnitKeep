<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MaintenanceRequest extends Model
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
        'title',
        'description',
        'category',
        'priority',
        'status',
        'admin_remarks',
        'resolved_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'resolved_at' => 'datetime',
        ];
    }

    /**
     * Get the tenant profile that submitted the request.
     */
    public function tenantProfile(): BelongsTo
    {
        return $this->belongsTo(TenantProfile::class);
    }

    /**
     * Get the condominium unit for the request.
     */
    public function condominiumUnit(): BelongsTo
    {
        return $this->belongsTo(CondominiumUnit::class);
    }

    /**
     * Determine if the request is resolved.
     */
    public function isResolved(): bool
    {
        return $this->status === 'resolved';
    }
}
