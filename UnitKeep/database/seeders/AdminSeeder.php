<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Seed the Master Admin account.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@unitkeep.com'],
            [
                'first_name' => 'Master',
                'last_name' => 'Admin',
                'password' => 'password',
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );
    }
}
