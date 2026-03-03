import React from 'react';
import { Link, router } from '@inertiajs/react';

export default function Index({ tenants }) {

    const deleteTenant = (id) => {
        if (confirm('Are you sure you want to delete this tenant?')) {
            router.delete(route('admin.tenants.destroy', id));
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Tenant Management</h1>

            <Link
                href={route('admin.tenants.create')}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Create Tenant
            </Link>

            <table className="w-full mt-6 border">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 border">First Name</th>
                        <th className="p-2 border">Last Name</th>
                        <th className="p-2 border">Email</th>
                        <th className="p-2 border">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {tenants.map((tenant) => (
                        <tr key={tenant.id}>
                            <td className="p-2 border">{tenant.first_name}</td>
                            <td className="p-2 border">{tenant.last_name}</td>
                            <td className="p-2 border">{tenant.email}</td>
                            <td className="p-2 border space-x-2">
                                <Link
                                    href={route('admin.tenants.edit', tenant.id)}
                                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                                >
                                    Edit
                                </Link>

                                <button
                                    onClick={() => deleteTenant(tenant.id)}
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
