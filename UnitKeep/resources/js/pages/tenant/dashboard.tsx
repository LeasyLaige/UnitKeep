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
    const cardClass =
        'rounded-xl border border-sidebar-border/70 bg-card p-5 shadow-sm transition hover:shadow-md hover:-translate-y-[1px] dark:border-sidebar-border';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tenant Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl bg-background p-6">
                <div className="mx-auto w-full max-w-6xl space-y-6">
                    {/* Welcome + quick summary */}
                    <div className="flex flex-col gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Welcome back, {tenantName}
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {unit ? `Unit ${unit.unit_number} · ${unit.building}` : 'No unit assigned'}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                                Lease status:
                                <span className="ml-2 font-semibold text-foreground">
                                    {lease?.status ? statusLabel(lease.status) : 'Unknown'}
                                </span>
                            </span>
                            <Button asChild size="sm" className="min-w-[11rem]" variant="secondary">
                                <Link href="/tenant/maintenance-request">Report an issue</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Top stats row */}
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        <div className={cardClass}>
                            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Monthly payment
                            </div>
                            <div className="mt-3 text-2xl font-semibold">
                                ₱{billing.monthlyPayment}
                            </div>
                        </div>

                        <div className={cardClass}>
                            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Next due date
                            </div>
                            <div className="mt-3 text-lg font-semibold">
                                {billing.nextDue}
                            </div>
                        </div>

                        <div className={cardClass}>
                            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Payment status
                            </div>
                            <div className="mt-3">
                                <Badge variant={statusColor[billing.paymentStatus] ?? 'secondary'}>
                                    {statusLabel(billing.paymentStatus)}
                                </Badge>
                            </div>
                        </div>

                        <div className={cardClass}>
                            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Open requests
                            </div>
                            <div className="mt-3 text-2xl font-semibold">
                                {openRequestCount}
                            </div>
                        </div>
                    </div>

                    {/* Property information */}
                    {unit && lease && (
                        <div className={cardClass}>
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-medium text-muted-foreground">
                                    Property information
                                </h2>
                                <span className="text-xs text-muted-foreground">
                                    Last updated: {lease.end_date}
                                </span>
                            </div>
                            <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                                <div className="space-y-1">
                                    <dt className="text-xs text-muted-foreground">Unit type</dt>
                                    <dd className="font-medium">{unit.type ?? '—'}</dd>
                                </div>
                                <div className="space-y-1">
                                    <dt className="text-xs text-muted-foreground">Floor</dt>
                                    <dd className="font-medium">{unit.floor}</dd>
                                </div>
                                <div className="space-y-1">
                                    <dt className="text-xs text-muted-foreground">Area</dt>
                                    <dd className="font-medium">
                                        {unit.area_sqm ? `${unit.area_sqm} sqm` : '—'}
                                    </dd>
                                </div>
                                <div className="space-y-1">
                                    <dt className="text-xs text-muted-foreground">Lease period</dt>
                                    <dd className="font-medium">{lease.start_date} – {lease.end_date}</dd>
                                </div>
                            </dl>
                        </div>
                    )}

                    {/* Bottom row: maintenance + quick actions */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className={`${cardClass} md:col-span-2`}>
                            <div className="flex items-start justify-between">
                                <h2 className="text-sm font-medium text-muted-foreground">
                                    Maintenance requests
                                </h2>
                                <Link
                                    href="/tenant/maintenance-requests"
                                    className="text-sm font-medium text-primary hover:text-primary/80"
                                >
                                    View all
                                </Link>
                            </div>

                            {maintenanceRequests.length === 0 ? (
                                <p className="mt-4 text-sm text-muted-foreground">
                                    You have no maintenance requests right now.
                                </p>
                            ) : (
                                <ul className="mt-4 space-y-3 text-sm">
                                    {maintenanceRequests.map((req) => (
                                        <li
                                            key={req.id}
                                            className="flex items-center justify-between rounded-lg border border-sidebar-border/60 bg-muted/40 px-4 py-3"
                                        >
                                            <div>
                                                <div className="font-medium">{req.title}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {req.created_at}
                                                </div>
                                            </div>
                                            <Badge variant={statusColor[req.status] ?? 'secondary'}>
                                                {statusLabel(req.status)}
                                            </Badge>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className={cardClass}>
                            <h2 className="text-sm font-medium text-muted-foreground">
                                Quick actions
                            </h2>
                            <div className="mt-4 flex flex-col gap-3">
                                <Button variant="secondary" asChild>
                                    <Link href="/tenant/maintenance-request">Log a new request</Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/tenant/maintenance-requests">Open requests</Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/tenant/payments">View payments</Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/tenant/profile">Edit profile</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
