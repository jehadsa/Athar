<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PartnerUser extends Model
{
    //
    protected $table = 'partner_user';

    public $timestamps = false;

    protected $fillable = [
        'partner_id',
        'user_id',
        'position',
    ];
}
