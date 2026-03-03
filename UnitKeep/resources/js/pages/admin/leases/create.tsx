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
    { title: 'New Lease', href: '#' },
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

interface Props {
    tenants: TenantOption[];
    units: UnitOption[];
}

export default function LeaseCreate({ tenants, units }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        tenant_profile_id: '',
        condominium_unit_id: '',
        start_date: '',
        end_date: '',
        monthly_rent: '',
        security_deposit: '',
        terms: '',
    });

    function handleUnitChange(unitId: string) {
        setData('condominium_unit_id', unitId);
        const unit = units.find((u) => u.id === Number(unitId));
        if (unit) {
            setData((prev) => ({
                ...prev,
                condominium_unit_id: unitId,
                monthly_rent: unit.monthly_rate,
            }));
        }
    }

    function setDuration(months: number) {
        if (!data.start_date) return;
        const start = new Date(data.start_date);
        start.setMonth(start.getMonth() + months);
        const endDate = start.toISOString().split('T')[0];
        setData('end_date', endDate);
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/leases');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New Lease" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl bg-background p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">New Lease Contract</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Create a new lease between a tenant and a unit.</p>
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
                                    <option value="">Select tenant</option>
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
                                    onChange={(e) => handleUnitChange(e.target.value)}
                                    className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                                >
                                    <option value="">Select available unit</option>
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
                                <div className="flex items-end justify-between">
                                    <Label htmlFor="end_date">End Date *</Label>
                                    <div className="flex gap-1">
                                        <Button type="button" variant="outline" size="sm" onClick={() => setDuration(6)}>6 mo</Button>
                                        <Button type="button" variant="outline" size="sm" onClick={() => setDuration(12)}>12 mo</Button>
                                    </div>
                                </div>
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
                            {processing ? 'Creating…' : 'Create Lease'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
