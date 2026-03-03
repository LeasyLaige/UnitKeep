<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Property;

class Contract extends Model
{
    protected $fillable = [
        'tenant_id',
        'property_id',
        'start_date',
        'end_date',
        'duration',
        'monthly_rent',
        'deposit_amount',
        'status',
        'is_renewable',
    ];

    /**
     * A contract belongs to a tenant (User)
     */
    public function tenant()
    {
        return $this->belongsTo(User::class, 'tenant_id');
    }

    /**
     * A contract belongs to a property
     */
    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
