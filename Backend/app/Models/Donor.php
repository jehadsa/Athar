<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Donor extends Model
{
    protected $fillable = [
        'user_id',
        'default_budget',
        'is_anonymous_default',
    ];
    protected function casts(): array
    {
        return [
            'default_budget' => 'decimal:2',
            'is_anonymous_default' => 'boolean',
        ];
    }
}
