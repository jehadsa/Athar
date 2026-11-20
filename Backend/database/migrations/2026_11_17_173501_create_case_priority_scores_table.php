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
        Schema::create('case_priority_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('medical_case_id')->constrained('medical_cases')->cascadeOnDelete();
            $table->unsignedTinyInteger('severity_score');
            $table->unsignedTinyInteger('urgency_score');
            $table->unsignedTinyInteger('social_score')->nullable();
            $table->decimal('total_score', 6, 2);
            $table->string('algorithm_version', 20)->default('v1');
            $table->timestamp('calculated_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('case_priority_scores');
    }
};
