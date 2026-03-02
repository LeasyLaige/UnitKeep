<?php

namespace Database\Seeders;

use App\Models\BillingRecord;
use App\Models\CondominiumUnit;
use App\Models\LeaseContract;
use App\Models\MaintenanceRequest;
use App\Models\TenantProfile;
use App\Models\User;
use Illuminate\Database\Seeder;

class TenantSeeder extends Seeder
{
    /**
     * Seed a sample Tenant account with full data chain.
     */
    public function run(): void
    {
        // 1. Create the tenant user
        $user = User::updateOrCreate(
            ['email' => 'tenant@unitkeep.com'],
            [
                'first_name' => 'Sarah',
                'last_name' => 'Cruz',
                'password' => 'tenantpassword',
                'role' => 'tenant',
                'email_verified_at' => now(),
            ]
        );

        // 2. Create tenant profile
        $profile = TenantProfile::updateOrCreate(
            ['user_id' => $user->id],
            [
                'phone' => '+63 912 345 6789',
                'date_of_birth' => '1995-06-15',
                'address' => '123 Makati Ave, Makati City',
                'emergency_contact_name' => 'Juan Cruz',
                'emergency_contact_phone' => '+63 917 654 3210',
            ]
        );

        // 3. Create condominium units
        $unit304 = CondominiumUnit::updateOrCreate(
            ['unit_number' => '304'],
            [
                'floor' => 3,
                'building' => 'Tower A',
                'type' => '1BR',
                'area_sqm' => 45.00,
                'monthly_rate' => 15000.00,
                'status' => 'occupied',
            ]
        );

        $unit507 = CondominiumUnit::updateOrCreate(
            ['unit_number' => '507'],
            [
                'floor' => 5,
                'building' => 'Tower A',
                'type' => '2BR',
                'area_sqm' => 65.00,
                'monthly_rate' => 22000.00,
                'status' => 'available',
            ]
        );

        $unit102 = CondominiumUnit::updateOrCreate(
            ['unit_number' => '102'],
            [
                'floor' => 1,
                'building' => 'Tower B',
                'type' => 'Studio',
                'area_sqm' => 28.00,
                'monthly_rate' => 10000.00,
                'status' => 'available',
            ]
        );

        // 4. Create an active lease contract
        $lease = LeaseContract::updateOrCreate(
            [
                'tenant_profile_id' => $profile->id,
                'condominium_unit_id' => $unit304->id,
                'status' => 'active',
            ],
            [
                'start_date' => now()->subMonths(4)->startOfMonth(),
                'end_date' => now()->addMonths(8)->endOfMonth(),
                'monthly_rent' => 15000.00,
                'security_deposit' => 30000.00,
                'terms' => '12-month lease. Rent due on the 5th of every month.',
            ]
        );

        // 5. Create billing records (past months paid, current month unpaid)
        $months = [
            ['offset' => -4, 'status' => 'paid', 'paid_date' => now()->subMonths(4)->day(3)],
            ['offset' => -3, 'status' => 'paid', 'paid_date' => now()->subMonths(3)->day(5)],
            ['offset' => -2, 'status' => 'paid', 'paid_date' => now()->subMonths(2)->day(4)],
            ['offset' => -1, 'status' => 'paid', 'paid_date' => now()->subMonths(1)->day(2)],
            ['offset' => 0,  'status' => 'unpaid', 'paid_date' => null],
        ];

        foreach ($months as $m) {
            $billingDate = now()->addMonths($m['offset'])->startOfMonth();
            BillingRecord::updateOrCreate(
                [
                    'tenant_profile_id' => $profile->id,
                    'billing_month' => $billingDate->format('Y-m'),
                ],
                [
                    'lease_contract_id' => $lease->id,
                    'condominium_unit_id' => $unit304->id,
                    'amount_due' => 15000.00,
                    'amount_paid' => $m['status'] === 'paid' ? 15000.00 : 0,
                    'status' => $m['status'],
                    'due_date' => $billingDate->copy()->addDays(4), // 5th of month
                    'paid_date' => $m['paid_date'],
                ]
            );
        }

        // 6. Create sample maintenance requests
        MaintenanceRequest::updateOrCreate(
            [
                'tenant_profile_id' => $profile->id,
                'title' => 'Leaking faucet in kitchen',
            ],
            [
                'condominium_unit_id' => $unit304->id,
                'description' => 'The kitchen faucet has been dripping constantly for the past three days. Water pressure seems fine but the leak persists.',
                'category' => 'plumbing',
                'priority' => 'medium',
                'status' => 'in_progress',
            ]
        );

        MaintenanceRequest::updateOrCreate(
            [
                'tenant_profile_id' => $profile->id,
                'title' => 'Broken light switch in bedroom',
            ],
            [
                'condominium_unit_id' => $unit304->id,
                'description' => 'The main light switch in the master bedroom stopped working entirely. Replacement needed.',
                'category' => 'electrical',
                'priority' => 'low',
                'status' => 'resolved',
                'resolved_at' => now()->subDays(5),
            ]
        );

        MaintenanceRequest::updateOrCreate(
            [
                'tenant_profile_id' => $profile->id,
                'title' => 'AC not cooling properly',
            ],
            [
                'condominium_unit_id' => $unit304->id,
                'description' => 'The air conditioning unit in the living room is running but not producing cold air. Possibly needs refrigerant top-up.',
                'category' => 'hvac',
                'priority' => 'high',
                'status' => 'pending',
            ]
        );
    }
}

