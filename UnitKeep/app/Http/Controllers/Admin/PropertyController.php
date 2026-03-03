<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PropertyController extends Controller
{
    public function index()
    {
        $properties = Property::all();

        return Inertia::render('Admin/Properties/Index', [
            'properties' => $properties
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Properties/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'unit_number'    => 'required|string|max:255',
            'building_name'  => 'nullable|string|max:255',
            'floor'          => 'nullable|integer',
            'monthly_rent'   => 'required|numeric',
            'deposit_amount' => 'nullable|numeric',
            'status'         => 'required|in:available,occupied,maintenance',
            'description'    => 'nullable|string',
        ]);

        Property::create($request->all());

        return redirect()->route('admin.properties.index')
            ->with('success', 'Property created successfully.');
    }

    public function edit(Property $property)
    {
        return Inertia::render('Admin/Properties/Edit', [
            'property' => $property
        ]);
    }

    public function update(Request $request, Property $property)
    {
        $request->validate([
            'unit_number'    => 'required|string|max:255',
            'building_name'  => 'nullable|string|max:255',
            'floor'          => 'nullable|integer',
            'monthly_rent'   => 'required|numeric',
            'deposit_amount' => 'nullable|numeric',
            'status'         => 'required|in:available,occupied,maintenance',
            'description'    => 'nullable|string',
        ]);

        $property->update($request->all());

        return redirect()->route('admin.properties.index')
            ->with('success', 'Property updated successfully.');
    }

    public function destroy(Property $property)
    {
        $property->delete();

        return redirect()->route('admin.properties.index')
            ->with('success', 'Property deleted successfully.');
    }
}
