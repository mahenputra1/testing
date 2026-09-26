<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContactResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nama' => $this->name,
            'alamat' => $this->alamat,
            'tanggal_lahir' => $this->tanggal_lahir,
            'telepon' => ContactPhoneResource::collection($this->whenLoaded('phones')),
        ];
    }
}
