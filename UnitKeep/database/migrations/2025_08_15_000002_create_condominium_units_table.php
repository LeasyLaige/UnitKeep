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
        Schema::create('condominium_units', function (Blueprint $table) {
            $table->id();
            $table->string('unit_number')->unique();
            $table->integer('floor');
            $table->string('building')->nullable();
            $table->string('type')->nullable(); // e.g. Studio, 1BR, 2BR, etc.
            $table->decimal('area_sqm', 8, 2)->nullable();
            $table->decimal('monthly_rate', 10, 2)->default(0);
            $table->enum('status', ['available', 'occupied', 'maintenance'])->default('available');
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('condominium_units');
    }
};
