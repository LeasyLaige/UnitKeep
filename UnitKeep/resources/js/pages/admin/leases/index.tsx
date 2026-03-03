import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin/dashboard' },
    { title: 'Leases', href: '/admin/leases' },
];

interface Lease {
    id: number;
    tenant_name: string;
    unit: string;
    start_date: string;
    end_date: string;
    monthly_rent: string;
    security_deposit: string;
    status: string;
}

interface Props {
    leases: Lease[];
}

const statusColor: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    active: 'default',
    expired: 'secondary',
    terminated: 'destructive',
    pending_renewal: 'outline',
};

function statusLabel(status: string): string {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function LeasesIndex({ leases }: Props) {
    function deleteLease(id: number) {
        if (confirm('Are you sure you want to delete this lease? The unit will be freed.')) {
            router.delete(`/admin/leases/${id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lease Contracts" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl bg-background p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Lease Contracts</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage all lease contracts between tenants and units.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/leases/create">New Lease</Link>
                    </Button>
                </div>

                {leases.length === 0 ? (
                    <div className="rounded-xl border border-sidebar-border/70 p-12 text-center text-muted-foreground dark:border-sidebar-border">
                        No lease contracts found.
                    </div>
                ) : (
                    <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-sidebar-border/70 text-left dark:border-sidebar-border">
                                    <th className="px-4 py-3 font-medium text-muted-foreground">Tenant</th>
                                    <th className="px-4 py-3 font-medium text-muted-foreground">Unit</th>
                                    <th className="px-4 py-3 font-medium text-muted-foreground">Start</th>
                                    <th className="px-4 py-3 font-medium text-muted-foreground">End</th>
                                    <th className="px-4 py-3 font-medium text-muted-foreground">Rent/mo</th>
                                    <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                                    <th className="px-4 py-3 font-medium text-muted-foreground text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leases.map((l) => (
                                    <tr key={l.id} className="border-b border-sidebar-border/70 last:border-0 dark:border-sidebar-border">
                                        <td className="px-4 py-3 font-medium">{l.tenant_name}</td>
                                        <td className="px-4 py-3">{l.unit}</td>
                                        <td className="px-4 py-3">{l.start_date}</td>
                                        <td className="px-4 py-3">{l.end_date}</td>
                                        <td className="px-4 py-3">₱{l.monthly_rent}</td>
                                        <td className="px-4 py-3">
                                            <Badge variant={statusColor[l.status] ?? 'secondary'}>
                                                {statusLabel(l.status)}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/admin/leases/${l.id}/edit`}>Edit</Link>
                                                </Button>
                                                <Button variant="destructive" size="sm" onClick={() => deleteLease(l.id)}>
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
