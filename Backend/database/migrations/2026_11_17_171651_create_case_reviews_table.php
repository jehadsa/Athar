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
       Schema::create('case_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('case_id')->constrained('medical_cases')->cascadeOnDelete();
            $table->foreignId('case_category_id')->constrained('case_categories')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('review_type', 20);
            $table->string('decision', 20);
            $table->integer('severity_score')->nullable();
            $table->integer('urgency_score')->nullable();
            $table->boolean('cost_verified')->default(false);
            $table->text('comment')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('case_reviews');
    }
};
