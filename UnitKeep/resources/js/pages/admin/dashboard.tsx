import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
];

interface Stats {
    totalUnits: number;
    activeLeases: number;
    pendingRequests: number;
    occupiedUnits: number;
    totalTenants: number;
    overduePayments: number;
}

interface RecentRequest {
    id: number;
    title: string;
    category: string;
    priority: string;
    status: string;
    tenant: string;
    unit: string;
    created_at: string;
}

interface Props {
    stats: Stats;
    recentRequests: RecentRequest[];
}

const statusColor: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pending: 'secondary',
    in_progress: 'outline',
    resolved: 'default',
    cancelled: 'secondary',
};

const priorityColor: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    low: 'secondary',
    medium: 'outline',
    high: 'destructive',
    urgent: 'destructive',
};

function statusLabel(status: string): string {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AdminDashboard({ stats, recentRequests }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    <h2 className="text-xl font-semibold">
                        Welcome, Administrator
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                        Manage tenants, units, leases, billing, and maintenance requests from here.
                    </p>
                </div>

                {/* Stats cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3 lg:grid-cols-6">
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <h3 className="text-sm font-medium text-muted-foreground">Total Units</h3>
                        <p className="mt-1 text-2xl font-bold">{stats.totalUnits}</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <h3 className="text-sm font-medium text-muted-foreground">Occupied</h3>
                        <p className="mt-1 text-2xl font-bold">{stats.occupiedUnits}</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <h3 className="text-sm font-medium text-muted-foreground">Active Leases</h3>
                        <p className="mt-1 text-2xl font-bold">{stats.activeLeases}</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <h3 className="text-sm font-medium text-muted-foreground">Tenants</h3>
                        <p className="mt-1 text-2xl font-bold">{stats.totalTenants}</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <h3 className="text-sm font-medium text-muted-foreground">Pending Requests</h3>
                        <p className="mt-1 text-2xl font-bold">{stats.pendingRequests}</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <h3 className="text-sm font-medium text-muted-foreground">Overdue Payments</h3>
                        <p className="mt-1 text-2xl font-bold text-destructive">{stats.overduePayments}</p>
                    </div>
                </div>

                {/* Recent maintenance requests */}
                <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-muted-foreground">Recent Maintenance Requests</h3>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/admin/maintenance-requests">View All</Link>
                        </Button>
                    </div>

                    {recentRequests.length === 0 ? (
                        <p className="mt-4 text-sm text-muted-foreground">No maintenance requests yet.</p>
                    ) : (
                        <div className="mt-4 space-y-3 text-sm">
                            {recentRequests.map((req) => (
                                <div key={req.id} className="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3">
                                    <div className="flex-1">
                                        <div className="font-medium">{req.title}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {req.tenant} · {req.unit} · {req.created_at}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={priorityColor[req.priority] ?? 'secondary'}>
                                            {statusLabel(req.priority)}
                                        </Badge>
                                        <Badge variant={statusColor[req.status] ?? 'secondary'}>
                                            {statusLabel(req.status)}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
