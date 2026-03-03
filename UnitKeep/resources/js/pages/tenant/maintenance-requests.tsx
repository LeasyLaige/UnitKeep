import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tenant Dashboard', href: '/tenant/dashboard' },
    { title: 'Maintenance Requests', href: '/tenant/maintenance-requests' },
];

interface MaintenanceRequest {
    id: number;
    title: string;
    description: string;
    category: string;
    priority: string;
    status: string;
    unit: string;
    created_at: string;
    resolved_at: string | null;
    admin_remarks: string | null;
}

interface Props {
    requests: MaintenanceRequest[];
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

export default function TenantMaintenanceRequests({ requests }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Maintenance Requests" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl bg-background p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            My Maintenance Requests
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Track the progress of all your submitted requests.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/tenant/maintenance-request">New Request</Link>
                    </Button>
                </div>

                {requests.length === 0 ? (
                    <div className="rounded-xl border border-sidebar-border/70 p-12 text-center text-muted-foreground dark:border-sidebar-border">
                        You haven't submitted any maintenance requests yet.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {requests.map((req) => (
                            <div
                                key={req.id}
                                className="rounded-xl border border-sidebar-border/70 bg-card p-5 shadow-sm dark:border-sidebar-border"
                            >
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-medium">{req.title}</h3>
                                            <Badge variant={priorityColor[req.priority] ?? 'secondary'}>
                                                {statusLabel(req.priority)}
                                            </Badge>
                                            <Badge variant={statusColor[req.status] ?? 'secondary'}>
                                                {statusLabel(req.status)}
                                            </Badge>
                                        </div>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {req.unit} · Submitted {req.created_at}
                                        </p>
                                        <p className="mt-2 text-sm">{req.description}</p>
                                        {req.resolved_at && (
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Resolved: {req.resolved_at}
                                            </p>
                                        )}
                                        {req.admin_remarks && (
                                            <div className="mt-2 rounded-lg bg-muted/40 px-3 py-2 text-sm">
                                                <span className="text-xs font-medium text-muted-foreground">Admin remarks: </span>
                                                {req.admin_remarks}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
