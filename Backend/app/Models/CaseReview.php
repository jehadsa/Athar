<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class CaseReview extends Model
{
    //
    protected $fillable = [
        'case_id',
        'medical_case_id',
        'user_id',
        'review_type',
        'decision',
        'severity_score',
        'urgency_score',
        'cost_verified',
        'comment',
        'reviewed_at',
    ];

    protected $casts = [
        'cost_verified' => 'boolean',
        'reviewed_at' => 'datetime',
    ];

   
}
