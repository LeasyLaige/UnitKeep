<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class TenantSeeder extends Seeder
{
    /**
     * Seed a sample Tenant account.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'tenant@unitkeep.com'],
            [
                'first_name' => 'Sample',
                'last_name' => 'Tenant',
                'password' => 'tenantpassword',
                'role' => 'tenant',
                'email_verified_at' => now(),
            ]
        );
    }
}

