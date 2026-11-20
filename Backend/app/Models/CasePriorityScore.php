<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo; 

class CasePriorityScore extends Model
{
    //
    protected $fillable = [
        'case_id',
        'severity_score',
        'urgency_score',
        'social_score',
        'total_score',
        'algorithm_version',
        'calculated_at',
    ];

    protected $casts = [
        'total_score'   => 'decimal:2',
        'calculated_at' => 'datetime',
    ];


    public function medicalCase(): BelongsTo
    {
        return $this->belongsTo(MedicalCase::class, 'case_id');
    }

}
