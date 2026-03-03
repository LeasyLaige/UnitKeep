<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\User;
use App\Models\Property;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContractController extends Controller
{
    public function index()
    {
        $contracts = Contract::with(['tenant', 'property'])->get();

        return Inertia::render('Admin/Contracts/Index', [
            'contracts' => $contracts
        ]);
    }

    public function create()
    {
        $tenants = User::where('role', 'tenant')->get();
        $properties = Property::where('status', 'available')->get();

        return Inertia::render('Admin/Contracts/Create', [
            'tenants' => $tenants,
            'properties' => $properties
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'tenant_id' => 'required|exists:users,id',
            'property_id' => 'required|exists:properties,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'duration' => 'required|in:6_months,12_months',
            'monthly_rent' => 'required|numeric',
            'deposit_amount' => 'nullable|numeric',
        ]);

        Contract::create($request->all());

        // Automatically mark property as occupied
        Property::where('id', $request->property_id)
            ->update(['status' => 'occupied']);

        return redirect()->route('admin.contracts.index')
            ->with('success', 'Contract created successfully.');
    }

    public function edit(Contract $contract)
    {
        $tenants = User::where('role', 'tenant')->get();
        $properties = Property::all();

        return Inertia::render('Admin/Contracts/Edit', [
            'contract' => $contract,
            'tenants' => $tenants,
            'properties' => $properties
        ]);
    }

    public function update(Request $request, Contract $contract)
    {
        $request->validate([
            'tenant_id' => 'required|exists:users,id',
            'property_id' => 'required|exists:properties,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'duration' => 'required|in:6_months,12_months',
            'monthly_rent' => 'required|numeric',
            'deposit_amount' => 'nullable|numeric',
            'status' => 'required|in:active,expired,terminated',
        ]);

        $contract->update($request->all());

        return redirect()->route('admin.contracts.index')
            ->with('success', 'Contract updated successfully.');
    }

    public function destroy(Contract $contract)
    {
        // When deleting contract, make property available again
        $contract->property->update(['status' => 'available']);

        $contract->delete();

        return redirect()->route('admin.contracts.index')
            ->with('success', 'Contract deleted successfully.');
    }
}
