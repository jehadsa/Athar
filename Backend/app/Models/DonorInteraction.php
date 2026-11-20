<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DonorInteraction extends Model
{
    protected $fillable = [
        'donor_id',
       'case_category_id',
        'interaction_type',
        'created_at',
    ];
    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];
    }
}
