<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Charity extends Model
{
    protected $fillable = [
        'name',
        'registration_number',
        'phone',
        'email',
        'address',
        'license_file',
        'verification_status',
        'verified_at',
    ];
    protected function casts(): array
    {
        return [
            'verified_at' => 'datetime',
        ];
    }
}
