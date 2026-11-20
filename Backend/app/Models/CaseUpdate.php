<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class CaseUpdate extends Model
{
    //
    protected $fillable = [
        'medical_case_id',
        'user_id',
        'update_type',
        'title',
        'description',
        'attachment_path',
    ];


    
}
