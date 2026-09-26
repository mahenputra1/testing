<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Registrasi Berhasil',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                'token' => $token,
            ]
        ], 201);
    }

    public function login(Request $request)
    {
        // 1. Validasi Input Kritis
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        // 2. Cari User Berdasarkan Email
        $user = User::where('email', $credentials['email'])->first();

        // 3. Verifikasi Kredensial dan Password secara Eksplisit
        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Kredensial yang Anda masukkan salah.',
            ], 401);
        }

        // 4. Terbitkan Bearer Token
        $token = $user->createToken('auth_token')->plainTextToken;

        // 5. Kembalikan Respons JSON
        return response()->json([
            'success' => true,
            'message' => 'Login berhasil.',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                'token' => $token,
            ]
        ]);
    }

    /**
     * Pencabutan Token (Logout)
     */
    public function logout(Request $request)
    {
        // Cabut token yang SEDANG DIGUNAKAN untuk request ini
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil. Token telah dicabut.'
        ]);
    }
}
