import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'Maintenance Requests',
        href: '/admin/maintenance-requests',
    },
];

interface MaintenanceRequest {
    id: number;
    title: string;
    description: string;
    category: string;
    priority: string;
    status: string;
    tenant: string;
    unit: string;
    created_at: string;
    resolved_at: string | null;
}

interface Props {
    requests: MaintenanceRequest[];
    currentFilter: string;
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

const filters = ['all', 'pending', 'in_progress', 'resolved', 'cancelled'];
const statusTransitions: Record<string, string[]> = {
    pending: ['in_progress', 'cancelled'],
    in_progress: ['resolved', 'cancelled'],
    resolved: [],
    cancelled: ['pending'],
};

function updateStatus(id: number, status: string) {
    router.patch(`/admin/maintenance-requests/${id}`, { status }, {
        preserveScroll: true,
    });
}

export default function AdminMaintenanceRequests({ requests, currentFilter }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Maintenance Requests" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl bg-background p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Maintenance Requests
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Review and manage all tenant maintenance requests.
                    </p>
                </div>

                {/* Filter tabs */}
                <div className="flex flex-wrap gap-2">
                    {filters.map((f) => (
                        <Button
                            key={f}
                            variant={currentFilter === f ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => router.get('/admin/maintenance-requests', f === 'all' ? {} : { status: f }, { preserveState: true })}
                        >
                            {statusLabel(f)}
                        </Button>
                    ))}
                </div>

                {/* Requests list */}
                {requests.length === 0 ? (
                    <div className="rounded-xl border border-sidebar-border/70 p-12 text-center text-muted-foreground dark:border-sidebar-border">
                        No maintenance requests found.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {requests.map((req) => (
                            <div
                                key={req.id}
                                className="rounded-xl border border-sidebar-border/70 bg-card p-5 shadow-sm dark:border-sidebar-border"
                            >
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-medium">{req.title}</h3>
                                            <Badge variant={priorityColor[req.priority] ?? 'secondary'}>
                                                {statusLabel(req.priority)}
                                            </Badge>
                                            <Badge variant={statusColor[req.status] ?? 'secondary'}>
                                                {statusLabel(req.status)}
                                            </Badge>
                                        </div>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {req.tenant} · {req.unit} · {req.created_at}
                                        </p>
                                        <p className="mt-2 text-sm">{req.description}</p>
                                        {req.resolved_at && (
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Resolved: {req.resolved_at}
                                            </p>
                                        )}
                                    </div>

                                    {/* Status actions */}
                                    {(statusTransitions[req.status] ?? []).length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {statusTransitions[req.status].map((nextStatus) => (
                                                <Button
                                                    key={nextStatus}
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => updateStatus(req.id, nextStatus)}
                                                >
                                                    {nextStatus === 'in_progress' && 'Start Work'}
                                                    {nextStatus === 'resolved' && 'Mark Resolved'}
                                                    {nextStatus === 'cancelled' && 'Cancel'}
                                                    {nextStatus === 'pending' && 'Reopen'}
                                                </Button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
