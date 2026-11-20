<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class CaseDocument extends Model
{
    //
     protected $fillable = [
        'medical_case_id',
        'doc_type',
        'file_path',
        'original_name',
        'mime_type',
        'is_confidential',
        'created_at',
        'updated_at'
     ];

     protected $casts = [
        'is_confidential' => 'boolean',
    ];

}
