<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CondominiumUnit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UnitController extends Controller
{
    public function index()
    {
        $units = CondominiumUnit::all()->map(fn ($u) => [
            'id' => $u->id,
            'unit_number' => $u->unit_number,
            'floor' => $u->floor,
            'building' => $u->building,
            'type' => $u->type,
            'area_sqm' => $u->area_sqm,
            'monthly_rate' => number_format((float) $u->monthly_rate, 2),
            'status' => $u->status,
        ]);

        return Inertia::render('admin/units/index', [
            'units' => $units,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/units/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'unit_number' => 'required|string|max:50|unique:condominium_units,unit_number',
            'floor' => 'required|integer|min:1',
            'building' => 'required|string|max:255',
            'type' => 'required|string|max:100',
            'area_sqm' => 'required|numeric|min:1',
            'monthly_rate' => 'required|numeric|min:0',
            'status' => 'required|in:available,occupied,maintenance',
            'description' => 'nullable|string|max:2000',
        ]);

        CondominiumUnit::create($request->only([
            'unit_number', 'floor', 'building', 'type',
            'area_sqm', 'monthly_rate', 'status', 'description',
        ]));

        return redirect()->route('admin.units.index')
            ->with('success', 'Unit created successfully.');
    }

    public function edit(CondominiumUnit $unit)
    {
        return Inertia::render('admin/units/edit', [
            'unit' => [
                'id' => $unit->id,
                'unit_number' => $unit->unit_number,
                'floor' => $unit->floor,
                'building' => $unit->building,
                'type' => $unit->type,
                'area_sqm' => $unit->area_sqm,
                'monthly_rate' => $unit->monthly_rate,
                'status' => $unit->status,
                'description' => $unit->description,
            ],
        ]);
    }

    public function update(Request $request, CondominiumUnit $unit)
    {
        $request->validate([
            'unit_number' => 'required|string|max:50|unique:condominium_units,unit_number,' . $unit->id,
            'floor' => 'required|integer|min:1',
            'building' => 'required|string|max:255',
            'type' => 'required|string|max:100',
            'area_sqm' => 'required|numeric|min:1',
            'monthly_rate' => 'required|numeric|min:0',
            'status' => 'required|in:available,occupied,maintenance',
            'description' => 'nullable|string|max:2000',
        ]);

        $unit->update($request->only([
            'unit_number', 'floor', 'building', 'type',
            'area_sqm', 'monthly_rate', 'status', 'description',
        ]));

        return redirect()->route('admin.units.index')
            ->with('success', 'Unit updated successfully.');
    }

    public function destroy(CondominiumUnit $unit)
    {
        $unit->delete();

        return redirect()->route('admin.units.index')
            ->with('success', 'Unit deleted successfully.');
    }
}
