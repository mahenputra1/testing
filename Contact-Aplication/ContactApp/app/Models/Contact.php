<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    protected $table = 'contacts';
    protected $fillable = ['name', 'alamat', 'tanggal_lahir'];

    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function phones() {
        return $this->hasMany(ContactPhone::class, 'contact_id');
    }
}
