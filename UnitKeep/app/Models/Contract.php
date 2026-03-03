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
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();

            // Relationships
            $table->foreignId('tenant_id')
                ->constrained('users')
                ->onDelete('cascade');

            $table->foreignId('property_id')
                ->constrained('properties')
                ->onDelete('cascade');

            // Lease Details
            $table->date('start_date');
            $table->date('end_date');

            $table->enum('duration', ['6_months', '12_months']);

            // Financial Terms
            $table->decimal('monthly_rent', 10, 2);
            $table->decimal('deposit_amount', 10, 2)->nullable();

            // Status
            $table->enum('status', ['active', 'expired', 'terminated'])
                  ->default('active');

            $table->boolean('is_renewable')->default(true);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};
