<?php

namespace App\Console\Commands;

use App\Models\BillingRecord;
use App\Models\LeaseContract;
use Illuminate\Console\Command;

class GenerateMonthlyBilling extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'billing:generate {--month= : The billing month in YYYY-MM format (defaults to current month)}';

    /**
     * The console command description.
     */
    protected $description = 'Generate monthly billing records for all active lease contracts';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $month = $this->option('month') ?? now()->format('Y-m');

        $this->info("Generating billing records for {$month}...");

        $activeLeases = LeaseContract::where('status', 'active')
            ->with('tenantProfile')
            ->get();

        if ($activeLeases->isEmpty()) {
            $this->warn('No active lease contracts found.');
            return Command::SUCCESS;
        }

        $created = 0;
        $skipped = 0;

        foreach ($activeLeases as $lease) {
            // Check if billing already exists for this tenant + month
            $exists = BillingRecord::where('tenant_profile_id', $lease->tenant_profile_id)
                ->where('billing_month', $month)
                ->exists();

            if ($exists) {
                $skipped++;
                continue;
            }

            // Due date is the 5th of the billing month
            $dueDate = \Carbon\Carbon::createFromFormat('Y-m', $month)->startOfMonth()->addDays(4);

            BillingRecord::create([
                'lease_contract_id' => $lease->id,
                'tenant_profile_id' => $lease->tenant_profile_id,
                'condominium_unit_id' => $lease->condominium_unit_id,
                'billing_month' => $month,
                'amount_due' => $lease->monthly_rent,
                'amount_paid' => 0,
                'due_date' => $dueDate,
                'status' => 'unpaid',
            ]);

            $created++;
        }

        $this->info("Done. Created: {$created}, Skipped (already exists): {$skipped}");

        return Command::SUCCESS;
    }
}
