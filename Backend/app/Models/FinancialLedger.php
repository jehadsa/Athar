<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FinancialLedger extends Model
{
    protected $fillable = [
        'medical_case_id',
        'donation_id',
        'entry_type',
        'amount',
        'balance_after',
        'description',
        'created_at',
    ];
    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'balance_after' => 'decimal:2',
            'created_at' => 'datetime',
        ];
    }
}
