import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { BreadcrumbItem } from '@/types';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin/dashboard' },
    { title: 'Leases', href: '/admin/leases' },
    { title: 'Edit Lease', href: '#' },
];

interface TenantOption {
    tenant_profile_id: number;
    name: string;
}

interface UnitOption {
    id: number;
    label: string;
    monthly_rate: string;
}

interface LeaseData {
    id: number;
    tenant_profile_id: number;
    condominium_unit_id: number;
    start_date: string;
    end_date: string;
    monthly_rent: string;
    security_deposit: string;
    status: string;
    terms: string | null;
    tenant_name: string;
    unit_label: string;
}

interface Props {
    lease: LeaseData;
    tenants: TenantOption[];
    units: UnitOption[];
}

export default function LeaseEdit({ lease, tenants, units }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        tenant_profile_id: String(lease.tenant_profile_id),
        condominium_unit_id: String(lease.condominium_unit_id),
        start_date: lease.start_date,
        end_date: lease.end_date,
        monthly_rent: lease.monthly_rent,
        security_deposit: lease.security_deposit,
        status: lease.status,
        terms: lease.terms ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/admin/leases/${lease.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Lease: ${lease.tenant_name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl bg-background p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Edit Lease</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {lease.tenant_name} · {lease.unit_label}
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/admin/leases">Cancel</Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <h2 className="text-lg font-semibold">Lease Details</h2>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="tenant">Tenant *</Label>
                                <select
                                    id="tenant"
                                    value={data.tenant_profile_id}
                                    onChange={(e) => setData('tenant_profile_id', e.target.value)}
                                    className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                                >
                                    {tenants.map((t) => (
                                        <option key={t.tenant_profile_id} value={t.tenant_profile_id}>
                                            {t.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.tenant_profile_id && <p className="text-sm text-destructive">{errors.tenant_profile_id}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="unit">Unit *</Label>
                                <select
                                    id="unit"
                                    value={data.condominium_unit_id}
                                    onChange={(e) => setData('condominium_unit_id', e.target.value)}
                                    className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                                >
                                    {units.map((u) => (
                                        <option key={u.id} value={u.id}>
                                            {u.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.condominium_unit_id && <p className="text-sm text-destructive">{errors.condominium_unit_id}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="start_date">Start Date *</Label>
                                <Input id="start_date" type="date" value={data.start_date} onChange={(e) => setData('start_date', e.target.value)} />
                                {errors.start_date && <p className="text-sm text-destructive">{errors.start_date}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="end_date">End Date *</Label>
                                <Input id="end_date" type="date" value={data.end_date} onChange={(e) => setData('end_date', e.target.value)} />
                                {errors.end_date && <p className="text-sm text-destructive">{errors.end_date}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="monthly_rent">Monthly Rent (₱) *</Label>
                                <Input id="monthly_rent" type="number" step="0.01" min="0" value={data.monthly_rent} onChange={(e) => setData('monthly_rent', e.target.value)} />
                                {errors.monthly_rent && <p className="text-sm text-destructive">{errors.monthly_rent}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="security_deposit">Security Deposit (₱)</Label>
                                <Input id="security_deposit" type="number" step="0.01" min="0" value={data.security_deposit} onChange={(e) => setData('security_deposit', e.target.value)} />
                                {errors.security_deposit && <p className="text-sm text-destructive">{errors.security_deposit}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status *</Label>
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                                >
                                    <option value="active">Active</option>
                                    <option value="expired">Expired</option>
                                    <option value="terminated">Terminated</option>
                                    <option value="pending_renewal">Pending Renewal</option>
                                </select>
                                {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="terms">Terms & Conditions</Label>
                                <textarea
                                    id="terms"
                                    value={data.terms}
                                    onChange={(e) => setData('terms', e.target.value)}
                                    rows={4}
                                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                {errors.terms && <p className="text-sm text-destructive">{errors.terms}</p>}
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
