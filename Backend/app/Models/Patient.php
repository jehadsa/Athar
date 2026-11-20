<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $fillable = [
        'user_id',
        'date_of_birth',
        'gender',
        'city',
        'address',
        'guardian_relation',
        'family_members_count',
        'monthly_income_range',
        'social_status',
        'is_anonymized',
    ];
    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'family_members_count' => 'integer',
            'is_anonymized' => 'boolean',
        ];
    }
}
