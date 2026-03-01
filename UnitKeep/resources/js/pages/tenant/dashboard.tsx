import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tenant Dashboard',
        href: '/tenant/dashboard',
    },
];

export default function TenantDashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tenant Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl bg-background p-6">
                {/* Welcome + basic info */}
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Welcome Back, Sarah
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Unit 304 · Tower
                    </p>
                </div>

                {/* Top stats row */}
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="flex flex-col justify-between rounded-xl border border-sidebar-border/70 bg-card p-4 text-sm shadow-sm dark:border-sidebar-border">
                        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Monthly Payment
                        </div>
                        <div className="mt-3 text-2xl font-semibold">
                            ₱10,000
                        </div>
                    </div>

                    <div className="flex flex-col justify-between rounded-xl border border-sidebar-border/70 bg-card p-4 text-sm shadow-sm dark:border-sidebar-border">
                        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Next Payment
                        </div>
                        <div className="mt-3 text-2xl font-semibold">
                            March
                        </div>
                    </div>

                    <div className="flex flex-col justify-between rounded-xl border border-sidebar-border/70 bg-card p-4 text-sm shadow-sm dark:border-sidebar-border">
                        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Payment Status
                        </div>
                        <div className="mt-3">
                            <Badge variant="secondary">Paid</Badge>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between rounded-xl border border-sidebar-border/70 bg-card p-4 text-sm shadow-sm dark:border-sidebar-border">
                        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Request Status
                        </div>
                        <div className="mt-3 text-2xl font-semibold">2</div>
                    </div>
                </div>

                {/* Property information block */}
                <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border">
                    <h2 className="text-sm font-medium text-muted-foreground">
                        Property Information
                    </h2>
                    <div className="mt-4 h-32 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/40" />
                </div>

                {/* Bottom row: maintenance + quick actions */}
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="md:col-span-2 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border">
                        <h2 className="text-sm font-medium text-muted-foreground">
                            Request Maintenance
                        </h2>

                        <div className="mt-4 space-y-3 text-sm">
                            <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
                                <div>
                                    <div className="font-medium">Plumbing</div>
                                    <div className="text-xs text-muted-foreground">
                                        Feb 08, 2026
                                    </div>
                                </div>
                                <Badge variant="secondary">In Progress</Badge>
                            </div>

                            <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
                                <div>
                                    <div className="font-medium">AC Repair</div>
                                    <div className="text-xs text-muted-foreground">
                                        Feb 02, 2026
                                    </div>
                                </div>
                                <Badge>Completed</Badge>
                            </div>

                            <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
                                <div>
                                    <div className="font-medium">AC Repair</div>
                                    <div className="text-xs text-muted-foreground">
                                        Feb 02, 2026
                                    </div>
                                </div>
                                <Badge>Completed</Badge>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border">
                        <h2 className="text-sm font-medium text-muted-foreground">
                            Quick Actions
                        </h2>
                        <div className="mt-4 h-24 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/40" />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
