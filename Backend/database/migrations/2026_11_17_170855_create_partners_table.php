<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {Schema::create('partners', function (Blueprint $table) {
            $table->id();
            $table->string('name', 200);
            $table->string('type', 30);
            $table->string('specialty', 150)->nullable();
            $table->string('license_number', 100)->unique()->nullable();
            $table->string('city', 100);
            $table->string('address', 255);
            $table->string('phone', 30);
            $table->boolean('is_trusted')->default(false);
            $table->string('verification_status', 20);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partners');
    }
};
