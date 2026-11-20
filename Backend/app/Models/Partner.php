<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Partner extends Model
{
    //
    protected $fillable = [
        'name',
        'type',
        'specialty',
        'license_number',
        'city',
        'address',
        'phone',
        'is_trusted',
        'verification_status',
    ];


    protected function casts(): array
    {
        return [
            'is_trusted' => 'boolean',
        ];
    }
}
