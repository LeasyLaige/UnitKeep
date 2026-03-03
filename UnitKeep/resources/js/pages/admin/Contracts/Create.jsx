import React from 'react';
import { useForm, Link } from '@inertiajs/react';

export default function Create({ tenants, properties }) {

    const { data, setData, post, processing, errors } = useForm({
        tenant_id: '',
        property_id: '',
        start_date: '',
        end_date: '',
        duration: '6_months',
        monthly_rent: '',
        deposit_amount: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.contracts.store'));
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Create Contract</h1>

            <form onSubmit={submit} className="space-y-4">

                {/* Tenant Dropdown */}
                <div>
                    <label>Tenant</label>
                    <select
                        value={data.tenant_id}
                        onChange={e => setData('tenant_id', e.target.value)}
                        className="border p-2 w-full"
                    >
                        <option value="">Select Tenant</option>
                        {tenants.map((tenant) => (
                            <option key={tenant.id} value={tenant.id}>
                                {tenant.first_name} {tenant.last_name}
                            </option>
                        ))}
                    </select>
                    {errors.tenant_id && <div className="text-red-500">{errors.tenant_id}</div>}
                </div>

                {/* Property Dropdown */}
                <div>
                    <label>Property</label>
                    <select
                        value={data.property_id}
                        onChange={e => setData('property_id', e.target.value)}
                        className="border p-2 w-full"
                    >
                        <option value="">Select Property</option>
                        {properties.map((property) => (
                            <option key={property.id} value={property.id}>
                                Unit {property.unit_number} - ₱{property.monthly_rent}
                            </option>
                        ))}
                    </select>
                    {errors.property_id && <div className="text-red-500">{errors.property_id}</div>}
                </div>

                <div>
                    <label>Start Date</label>
                    <input
                        type="date"
                        value={data.start_date}
                        onChange={e => setData('start_date', e.target.value)}
                        className="border p-2 w-full"
                    />
                </div>

                <div>
                    <label>End Date</label>
                    <input
                        type="date"
                        value={data.end_date}
                        onChange={e => setData('end_date', e.target.value)}
                        className="border p-2 w-full"
                    />
                    {errors.end_date && <div className="text-red-500">{errors.end_date}</div>}
                </div>

                <div>
                    <label>Duration</label>
                    <select
                        value={data.duration}
                        onChange={e => setData('duration', e.target.value)}
                        className="border p-2 w-full"
                    >
                        <option value="6_months">6 Months</option>
                        <option value="12_months">12 Months</option>
                    </select>
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

                <div className="space-x-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        Save Contract
                    </button>

                    <Link
                        href={route('admin.contracts.index')}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Cancel
                    </Link>
                </div>

            </form>
        </div>
    );
}
