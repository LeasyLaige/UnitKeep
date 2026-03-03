import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { BreadcrumbItem } from '@/types';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin/dashboard' },
    { title: 'Tenants', href: '/admin/tenants' },
    { title: 'Edit Tenant', href: '#' },
];

interface TenantData {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    date_of_birth: string | null;
    address: string | null;
    emergency_contact_name: string | null;
    emergency_contact_phone: string | null;
    notes: string | null;
}

interface Props {
    tenant: TenantData;
}

export default function TenantEdit({ tenant }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        first_name: tenant.first_name,
        last_name: tenant.last_name,
        email: tenant.email,
        phone: tenant.phone ?? '',
        date_of_birth: tenant.date_of_birth ?? '',
        address: tenant.address ?? '',
        emergency_contact_name: tenant.emergency_contact_name ?? '',
        emergency_contact_phone: tenant.emergency_contact_phone ?? '',
        notes: tenant.notes ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/admin/tenants/${tenant.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit: ${tenant.first_name} ${tenant.last_name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl bg-background p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Edit Tenant</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Update {tenant.first_name} {tenant.last_name}'s account and profile.
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/admin/tenants">Cancel</Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Account Information */}
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <h2 className="text-lg font-semibold">Account Information</h2>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="first_name">First Name *</Label>
                                <Input id="first_name" value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} />
                                {errors.first_name && <p className="text-sm text-destructive">{errors.first_name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last_name">Last Name *</Label>
                                <Input id="last_name" value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} />
                                {errors.last_name && <p className="text-sm text-destructive">{errors.last_name}</p>}
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Profile Information */}
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <h2 className="text-lg font-semibold">Profile Information</h2>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                                {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date_of_birth">Date of Birth</Label>
                                <Input id="date_of_birth" type="date" value={data.date_of_birth} onChange={(e) => setData('date_of_birth', e.target.value)} />
                                {errors.date_of_birth && <p className="text-sm text-destructive">{errors.date_of_birth}</p>}
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" value={data.address} onChange={(e) => setData('address', e.target.value)} />
                                {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
                                <Input id="emergency_contact_name" value={data.emergency_contact_name} onChange={(e) => setData('emergency_contact_name', e.target.value)} />
                                {errors.emergency_contact_name && <p className="text-sm text-destructive">{errors.emergency_contact_name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
                                <Input id="emergency_contact_phone" value={data.emergency_contact_phone} onChange={(e) => setData('emergency_contact_phone', e.target.value)} />
                                {errors.emergency_contact_phone && <p className="text-sm text-destructive">{errors.emergency_contact_phone}</p>}
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="notes">Notes</Label>
                                <textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows={3}
                                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                {errors.notes && <p className="text-sm text-destructive">{errors.notes}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving…' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
