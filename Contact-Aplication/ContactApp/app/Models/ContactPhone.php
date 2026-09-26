<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactPhone extends Model
{
    protected $table = 'contact_phones';
    protected $fillable = ['contact_id', 'jenis', 'nomor_telpon'];
    
    public function contact () {
        return $this->belongsTo(Contact::class, 'contact_id');
    }
}
