import React from 'react';
import { useForm, Link } from '@inertiajs/react';

export default function Edit({ property }) {

    const { data, setData, put, processing, errors } = useForm({
        unit_number: property.unit_number || '',
        building_name: property.building_name || '',
        floor: property.floor || '',
        monthly_rent: property.monthly_rent || '',
        deposit_amount: property.deposit_amount || '',
        status: property.status || 'available',
        description: property.description || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.properties.update', property.id));
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Edit Property</h1>

            <form onSubmit={submit} className="space-y-4">

                <div>
                    <label>Unit Number</label>
                    <input
                        type="text"
                        value={data.unit_number}
                        onChange={e => setData('unit_number', e.target.value)}
                        className="border p-2 w-full"
                    />
                    {errors.unit_number && <div className="text-red-500">{errors.unit_number}</div>}
                </div>

                <div>
                    <label>Building Name</label>
                    <input
                        type="text"
                        value={data.building_name}
                        onChange={e => setData('building_name', e.target.value)}
                        className="border p-2 w-full"
                    />
                </div>

                <div>
                    <label>Floor</label>
                    <input
                        type="number"
                        value={data.floor}
                        onChange={e => setData('floor', e.target.value)}
                        className="border p-2 w-full"
                    />
                </div>

                <div>
                    <label>Monthly Rent</label>
                    <input
                        type="number"
                        value={data.monthly_rent}
                        onChange={e => setData('monthly_rent', e.target.value)}
                        className="border p-2 w-full"
                    />
                    {errors.monthly_rent && <div className="text-red-500">{errors.monthly_rent}</div>}
                </div>

                <div>
                    <label>Deposit Amount</label>
                    <input
                        type="number"
                        value={data.deposit_amount}
                        onChange={e => setData('deposit_amount', e.target.value)}
                        className="border p-2 w-full"
                    />
                </div>

                <div>
                    <label>Status</label>
                    <select
                        value={data.status}
                        onChange={e => setData('status', e.target.value)}
                        className="border p-2 w-full"
                    >
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                        <option value="maintenance">Maintenance</option>
                    </select>
                </div>

                <div>
                    <label>Description</label>
                    <textarea
                        value={data.description}
                        onChange={e => setData('description', e.target.value)}
                        className="border p-2 w-full"
                    />
                </div>

                <div className="space-x-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Update
                    </button>

                    <Link
                        href={route('admin.properties.index')}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Cancel
                    </Link>
                </div>

            </form>
        </div>
    );
}
