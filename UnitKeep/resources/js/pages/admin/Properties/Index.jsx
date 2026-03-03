import React from 'react';
import { Link, router } from '@inertiajs/react';

export default function Index({ properties }) {

    const deleteProperty = (id) => {
        if (confirm('Are you sure you want to delete this property?')) {
            router.delete(route('admin.properties.destroy', id));
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Property Management</h1>

            <Link
                href={route('admin.properties.create')}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Create Property
            </Link>

            <table className="w-full mt-6 border">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 border">Unit</th>
                        <th className="p-2 border">Building</th>
                        <th className="p-2 border">Floor</th>
                        <th className="p-2 border">Rent</th>
                        <th className="p-2 border">Status</th>
                        <th className="p-2 border">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {properties.map((property) => (
                        <tr key={property.id}>
                            <td className="p-2 border">{property.unit_number}</td>
                            <td className="p-2 border">{property.building_name}</td>
                            <td className="p-2 border">{property.floor}</td>
                            <td className="p-2 border">₱{property.monthly_rent}</td>
                            <td className="p-2 border">{property.status}</td>
                            <td className="p-2 border space-x-2">
                                <Link
                                    href={route('admin.properties.edit', property.id)}
                                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                                >
                                    Edit
                                </Link>

                                <button
                                    onClick={() => deleteProperty(property.id)}
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
