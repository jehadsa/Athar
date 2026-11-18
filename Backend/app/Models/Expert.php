<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expert extends Model
{
    protected $fillable = [
        'user_id',
        'expert_type',
        'specialty',
        'license_number',
        'years_of_experience',
        'verification_status',
        'can_publish_directly',
    ];
    protected function casts(): array
    {
        return [
            'years_of_experience' => 'integer',
            'can_publish_directly' => 'boolean',
        ];
    }
}
