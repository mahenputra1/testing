<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() !== 'sqlite' || !Schema::hasTable('contact_phones')) {
            return;
        }

        DB::statement('PRAGMA foreign_keys = OFF');
        Schema::rename('contact_phones', 'contact_phones_old');

        Schema::create('contact_phones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contact_id')->constrained('contacts')->onDelete('cascade');
            $table->enum('jenis', ['Rumah', 'HP', 'Kantor'])->default('HP');
            $table->string('nomor_telpon');
            $table->timestamps();
        });

        DB::statement(
            'INSERT INTO contact_phones (id, contact_id, jenis, nomor_telpon, created_at, updated_at)
             SELECT id, contact_id, jenis, nomor_telpon, created_at, updated_at
             FROM contact_phones_old'
        );

        Schema::drop('contact_phones_old');
        DB::statement('PRAGMA foreign_keys = ON');
    }

    public function down(): void
    {
        // The previous foreign key pointed to a non-existent table.
    }
};
