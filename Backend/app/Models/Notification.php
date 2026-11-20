<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'user_id',
        'medical_case_id',
        'type',
        'title',
        'message',
        'channel',
        'is_read',
        'read_at',
        'created_at',
    ];
    protected function casts(): array
    {
        return [
            'is_read' => 'boolean',
            'read_at' => 'datetime',
            'created_at' => 'datetime',
        ];
    }
}
