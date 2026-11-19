<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class CaseUpdate extends Model
{
    //
    protected $fillable = [
        'case_category_id',
        'user_id',
        'update_type',
        'title',
        'description',
        'attachment_path',
    ];


    public function medicalCase(): BelongsTo
    {
        return $this->belongsTo(MedicalCase::class, 'case_id');
    }


    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
