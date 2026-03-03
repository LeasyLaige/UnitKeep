import React from 'react';
import { Link, router } from '@inertiajs/react';

export default function Index({ contracts }) {

    const deleteContract = (id) => {
        if (confirm('Are you sure you want to delete this contract?')) {
            router.delete(route('admin.contracts.destroy', id));
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Contract Management</h1>

            <Link
                href={route('admin.contracts.create')}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Create Contract
            </Link>

            <table className="w-full mt-6 border">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 border">Tenant</th>
                        <th className="p-2 border">Property</th>
                        <th className="p-2 border">Duration</th>
                        <th className="p-2 border">Start Date</th>
                        <th className="p-2 border">End Date</th>
                        <th className="p-2 border">Status</th>
                        <th className="p-2 border">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {contracts.map((contract) => (
                        <tr key={contract.id}>
                            <td className="p-2 border">
                                {contract.tenant?.first_name} {contract.tenant?.last_name}
                            </td>
                            <td className="p-2 border">
                                {contract.property?.unit_number}
                            </td>
                            <td className="p-2 border">
                                {contract.duration.replace('_', ' ')}
                            </td>
                            <td className="p-2 border">{contract.start_date}</td>
                            <td className="p-2 border">{contract.end_date}</td>
                            <td className="p-2 border">{contract.status}</td>
                            <td className="p-2 border space-x-2">
                                <Link
                                    href={route('admin.contracts.edit', contract.id)}
                                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                                >
                                    Edit
                                </Link>

                                <button
                                    onClick={() => deleteContract(contract.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
