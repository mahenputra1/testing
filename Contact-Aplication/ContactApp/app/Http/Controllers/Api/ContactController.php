<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactRequest;
use App\Http\Resources\ContactResource;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index(Request $request)
    {
        $contacts = $request->user()->contacts()->with('phones')->get();
        return ContactResource::collection($contacts);
    }

    public function store(StoreContactRequest $request)
    {
        $validated = $request->validated();
        $contact = $request->user()->contacts()->create([
            'name' => $validated['nama'],
            'alamat' => $validated['alamat'],
            'tanggal_lahir' => $validated['tanggal_lahir'],
        ]);

        if ($request->has('phones')) {
            $contact->phones()->createMany(array_map(
                fn (array $phone) => [
                    'jenis' => $phone['jenis'],
                    'nomor_telpon' => $phone['nomor_telepon'],
                ],
                $validated['phones']
            ));
        }

        return new ContactResource($contact->load('phones'));
    
    }

    public function show(Request $request, $id) {
        $contact = $request->user()->contacts()->with('phones')->findOrFail($id);
        return new ContactResource($contact);
    }

    public function update(StoreContactRequest $request, $id)
    {
        $validated = $request->validated();
        $contact = $request->user()->contacts()->findOrFail($id);

        $contact->update([
            'name' => $validated['nama'],
            'alamat' => $validated['alamat'],
            'tanggal_lahir' => $validated['tanggal_lahir'],
        ]);

        if (array_key_exists('phones', $validated)) {
            $contact->phones()->delete();
            $contact->phones()->createMany(array_map(
                fn (array $phone) => [
                    'jenis' => $phone['jenis'],
                    'nomor_telpon' => $phone['nomor_telepon'],
                ],
                $validated['phones'] ?? []
            ));
        }

        return new ContactResource($contact->load('phones'));
    }

    public function destroy(Request $request, $id) {
        $contact = $request->user()->contacts()->findOrFail($id);
        $contact->delete();

        return response()->json(['message' => 'Kontak Sudah Dihapus']);
    }
}
