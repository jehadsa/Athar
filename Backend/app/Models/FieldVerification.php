<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class FieldVerification extends Model
{
    //
    protected $fillable = [
        'case_category_id',
        'charity_id',
        'social_score',
        'financial_status_score',
        'decision',
        'notes',
        'verified_at',
    ];


    protected $casts = [
        'verified_at' => 'datetime',
    ];

}

