<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CharityUser extends Model
{
    //
    protected $table = 'charity_user';

    public $timestamps = false;

    protected $fillable = [
        'charity_id',
        'user_id',
        'position',
    ];
}
