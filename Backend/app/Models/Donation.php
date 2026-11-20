<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    protected $fillable = [
        'donor_id',
        'case_category_id',
        'amount',
        'currency',
        'payment_method',
        'transaction_reference',
        'status',
        'isanonymous',
        'donated_at',
    ];
    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'isanonymous' => 'boolean',
            'donated_at' => 'datetime',
        ];
    }
}
