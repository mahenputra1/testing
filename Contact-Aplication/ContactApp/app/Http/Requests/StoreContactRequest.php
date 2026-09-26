<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama' => 'required|string|max:255',
            'alamat' => 'required|string',
            'tanggal_lahir' => 'required|date',
            'phones' => 'nullable|array',
            'phones.*.jenis' => 'required|in:Rumah,HP,Kantor',
            'phones.*.nomor_telepon' => 'required|string',
        ];
    }
}
