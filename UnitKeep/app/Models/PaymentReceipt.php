<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentReceipt extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'path',
        'original_name',
    ];

    /**
     * Get the user that uploaded the receipt.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

