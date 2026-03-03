import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin/dashboard' },
    { title: 'Units', href: '/admin/units' },
];

interface Unit {
    id: number;
    unit_number: string;
    floor: number;
    building: string;
    type: string;
    area_sqm: string;
    monthly_rate: string;
    status: string;
}

interface Props {
    units: Unit[];
}

const statusColor: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    available: 'default',
    occupied: 'outline',
    maintenance: 'destructive',
};

export default function UnitsIndex({ units }: Props) {
    function deleteUnit(id: number) {
        if (confirm('Are you sure you want to delete this unit?')) {
            router.delete(`/admin/units/${id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Units" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl bg-background p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Condominium Units</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage all condominium units.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/units/create">Add Unit</Link>
                    </Button>
                </div>

                {units.length === 0 ? (
                    <div className="rounded-xl border border-sidebar-border/70 p-12 text-center text-muted-foreground dark:border-sidebar-border">
                        No units found.
                    </div>
                ) : (
                    <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-sidebar-border/70 text-left dark:border-sidebar-border">
                                    <th className="px-4 py-3 font-medium text-muted-foreground">Unit #</th>
                                    <th className="px-4 py-3 font-medium text-muted-foreground">Building</th>
                                    <th className="px-4 py-3 font-medium text-muted-foreground">Floor</th>
                                    <th className="px-4 py-3 font-medium text-muted-foreground">Type</th>
                                    <th className="px-4 py-3 font-medium text-muted-foreground">Area (sqm)</th>
                                    <th className="px-4 py-3 font-medium text-muted-foreground">Rate/mo</th>
                                    <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                                    <th className="px-4 py-3 font-medium text-muted-foreground text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {units.map((u) => (
                                    <tr key={u.id} className="border-b border-sidebar-border/70 last:border-0 dark:border-sidebar-border">
                                        <td className="px-4 py-3 font-medium">{u.unit_number}</td>
                                        <td className="px-4 py-3">{u.building}</td>
                                        <td className="px-4 py-3">{u.floor}</td>
                                        <td className="px-4 py-3">{u.type}</td>
                                        <td className="px-4 py-3">{u.area_sqm}</td>
                                        <td className="px-4 py-3">₱{u.monthly_rate}</td>
                                        <td className="px-4 py-3">
                                            <Badge variant={statusColor[u.status] ?? 'secondary'}>
                                                {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/admin/units/${u.id}/edit`}>Edit</Link>
                                                </Button>
                                                <Button variant="destructive" size="sm" onClick={() => deleteUnit(u.id)}>
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
