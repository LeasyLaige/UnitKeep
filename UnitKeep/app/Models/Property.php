<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'unit_number',
        'building_name',
        'floor',
        'monthly_rent',
        'deposit_amount',
        'status',
        'description',
    ];
}
