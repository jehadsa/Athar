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
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date_of_birth');
            $table->string('gender');
            $table->string('city');
            $table->text('address');
            $table->string('guardian_relation')->nullable();
            $table->integer('family_members_count')->default(0);
            $table->string('monthly_income_range')->nullable();
            $table->string('social_status')->nullable();
            $table->boolean('is_anonymized')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
