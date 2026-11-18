<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedicalCase extends Model
{
    protected $fillable = [
        'case_number',
        'title',
        'description',
        'treatment_type',
        'case_category_id',
        'patient_id',
        'user_id',
        'source_type',
        'charity_id',
        'partner_id',
        'required_amount',
        'collected_amount',
        'verification_status',
        'funding_status',
        'rejection_reason',
        'deadline',
        'published_at',
        'created_at',
        'updated_at',
    ];
}
