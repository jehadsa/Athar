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
       Schema::create('field_verifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('medical_case_id')->constrained('medical_cases');
            $table->foreignId('charity_id')->constrained('charities');
            $table->integer('social_score');
            $table->integer('financial_status_score');
            $table->string('decision', 20);
            $table->text('notes')->nullable();
            $table->timestamp('verified_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('field_verifications');
    }
};
