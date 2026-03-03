import React from 'react';
import { useForm, Link } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.tenants.store'));
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Create Tenant</h1>

            <form onSubmit={submit} className="space-y-4 max-w-md">

                <div>
                    <label>First Name</label>
                    <input
                        type="text"
                        value={data.first_name}
                        onChange={e => setData('first_name', e.target.value)}
                        className="w-full border p-2"
                    />
                    {errors.first_name && <div className="text-red-500">{errors.first_name}</div>}
                </div>

                <div>
                    <label>Last Name</label>
                    <input
                        type="text"
                        value={data.last_name}
                        onChange={e => setData('last_name', e.target.value)}
                        className="w-full border p-2"
                    />
                    {errors.last_name && <div className="text-red-500">{errors.last_name}</div>}
                </div>

                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        className="w-full border p-2"
                    />
                    {errors.email && <div className="text-red-500">{errors.email}</div>}
                </div>

                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                        className="w-full border p-2"
                    />
                    {errors.password && <div className="text-red-500">{errors.password}</div>}
                </div>

                <div className="flex space-x-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Create
                    </button>

                    <Link
                        href={route('admin.tenants.index')}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
