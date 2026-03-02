import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tenant Dashboard',
        href: '/tenant/dashboard',
    },
];

interface UnitInfo {
    unit_number: string;
    building: string;
    floor: number;
    type: string | null;
    area_sqm: string | null;
}

interface LeaseInfo {
    monthly_rent: string;
    start_date: string;
    end_date: string;
    status: string;
}

interface BillingInfo {
    monthlyPayment: string;
    nextDue: string;
    nextDueMonth: string;
    amountDue: string;
    paymentStatus: string;
}

interface MaintenanceItem {
    id: number;
    title: string;
    category: string;
    status: string;
    created_at: string;
}

interface Props {
    tenantName: string;
    unit: UnitInfo | null;
    lease: LeaseInfo | null;
    billing: BillingInfo;
    maintenanceRequests: MaintenanceItem[];
    openRequestCount: number;
}

const statusColor: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    paid: 'default',
    unpaid: 'destructive',
    overdue: 'destructive',
    partial: 'secondary',
    pending: 'secondary',
    in_progress: 'outline',
    resolved: 'default',
    cancelled: 'secondary',
    none: 'secondary',
};

function statusLabel(status: string): string {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function TenantDashboard({ tenantName, unit, lease, billing, maintenanceRequests, openRequestCount }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tenant Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl bg-background p-6">
                {/* Welcome + basic info */}
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Welcome Back, {tenantName}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {unit ? `Unit ${unit.unit_number} · ${unit.building}` : 'No unit assigned'}
                    </p>
                </div>

                {/* Top stats row */}
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="flex flex-col justify-between rounded-xl border border-sidebar-border/70 bg-card p-4 text-sm shadow-sm dark:border-sidebar-border">
                        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Monthly Payment
                        </div>
                        <div className="mt-3 text-2xl font-semibold">
                            ₱{billing.monthlyPayment}
                        </div>
                    </div>

                    <div className="flex flex-col justify-between rounded-xl border border-sidebar-border/70 bg-card p-4 text-sm shadow-sm dark:border-sidebar-border">
                        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Next Due Date
                        </div>
                        <div className="mt-3 text-lg font-semibold">
                            {billing.nextDue}
                        </div>
                    </div>

                    <div className="flex flex-col justify-between rounded-xl border border-sidebar-border/70 bg-card p-4 text-sm shadow-sm dark:border-sidebar-border">
                        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Payment Status
                        </div>
                        <div className="mt-3">
                            <Badge variant={statusColor[billing.paymentStatus] ?? 'secondary'}>
                                {statusLabel(billing.paymentStatus)}
                            </Badge>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between rounded-xl border border-sidebar-border/70 bg-card p-4 text-sm shadow-sm dark:border-sidebar-border">
                        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Open Requests
                        </div>
                        <div className="mt-3 text-2xl font-semibold">{openRequestCount}</div>
                    </div>
                </div>

                {/* Property information block */}
                {unit && lease && (
                    <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border">
                        <h2 className="text-sm font-medium text-muted-foreground">
                            Property Information
                        </h2>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                            <div>
                                <div className="text-xs text-muted-foreground">Unit Type</div>
                                <div className="mt-1 font-medium">{unit.type ?? '—'}</div>
                            </div>
                            <div>
                                <div className="text-xs text-muted-foreground">Floor</div>
                                <div className="mt-1 font-medium">{unit.floor}</div>
                            </div>
                            <div>
                                <div className="text-xs text-muted-foreground">Area</div>
                                <div className="mt-1 font-medium">{unit.area_sqm ? `${unit.area_sqm} sqm` : '—'}</div>
                            </div>
                            <div>
                                <div className="text-xs text-muted-foreground">Lease Period</div>
                                <div className="mt-1 font-medium">{lease.start_date} – {lease.end_date}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bottom row: maintenance + quick actions */}
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="md:col-span-2 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border">
                        <h2 className="text-sm font-medium text-muted-foreground">
                            Recent Maintenance Requests
                        </h2>

                        {maintenanceRequests.length === 0 ? (
                            <p className="mt-4 text-sm text-muted-foreground">No maintenance requests yet.</p>
                        ) : (
                            <div className="mt-4 space-y-3 text-sm">
                                {maintenanceRequests.map((req) => (
                                    <div key={req.id} className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
                                        <div>
                                            <div className="font-medium">{req.title}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {req.created_at}
                                            </div>
                                        </div>
                                        <Badge variant={statusColor[req.status] ?? 'secondary'}>
                                            {statusLabel(req.status)}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border">
                        <h2 className="text-sm font-medium text-muted-foreground">
                            Quick Actions
                        </h2>
                        <div className="mt-4 flex flex-col gap-3">
                            <Button variant="outline" asChild>
                                <Link href="/tenant/maintenance-request">New Maintenance Request</Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/tenant/payments">View Payments</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
