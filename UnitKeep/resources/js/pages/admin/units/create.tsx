import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { BreadcrumbItem } from '@/types';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin/dashboard' },
    { title: 'Units', href: '/admin/units' },
    { title: 'Add Unit', href: '#' },
];

export default function UnitCreate() {
    const { data, setData, post, processing, errors } = useForm({
        unit_number: '',
        floor: '',
        building: '',
        type: '',
        area_sqm: '',
        monthly_rate: '',
        status: 'available',
        description: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/units');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Unit" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl bg-background p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Add Unit</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Create a new condominium unit.</p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/admin/units">Cancel</Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <h2 className="text-lg font-semibold">Unit Details</h2>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="unit_number">Unit Number *</Label>
                                <Input id="unit_number" value={data.unit_number} onChange={(e) => setData('unit_number', e.target.value)} placeholder="e.g. A-101" />
                                {errors.unit_number && <p className="text-sm text-destructive">{errors.unit_number}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="building">Building *</Label>
                                <Input id="building" value={data.building} onChange={(e) => setData('building', e.target.value)} placeholder="e.g. Tower A" />
                                {errors.building && <p className="text-sm text-destructive">{errors.building}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="floor">Floor *</Label>
                                <Input id="floor" type="number" min="1" value={data.floor} onChange={(e) => setData('floor', e.target.value)} />
                                {errors.floor && <p className="text-sm text-destructive">{errors.floor}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Type *</Label>
                                <select
                                    id="type"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                                >
                                    <option value="">Select type</option>
                                    <option value="studio">Studio</option>
                                    <option value="1BR">1 Bedroom</option>
                                    <option value="2BR">2 Bedrooms</option>
                                    <option value="3BR">3 Bedrooms</option>
                                    <option value="penthouse">Penthouse</option>
                                </select>
                                {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="area_sqm">Area (sqm) *</Label>
                                <Input id="area_sqm" type="number" step="0.01" min="1" value={data.area_sqm} onChange={(e) => setData('area_sqm', e.target.value)} />
                                {errors.area_sqm && <p className="text-sm text-destructive">{errors.area_sqm}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="monthly_rate">Monthly Rate (₱) *</Label>
                                <Input id="monthly_rate" type="number" step="0.01" min="0" value={data.monthly_rate} onChange={(e) => setData('monthly_rate', e.target.value)} />
                                {errors.monthly_rate && <p className="text-sm text-destructive">{errors.monthly_rate}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status *</Label>
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                                >
                                    <option value="available">Available</option>
                                    <option value="occupied">Occupied</option>
                                    <option value="maintenance">Maintenance</option>
                                </select>
                                {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                            </div>
                            <div className="space-y-2 sm:col-span-2 lg:col-span-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating…' : 'Create Unit'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
