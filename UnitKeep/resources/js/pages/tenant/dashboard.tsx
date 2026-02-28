import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
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
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    <h2 className="text-xl font-semibold">
                        Welcome, Tenant
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                        View your unit details, billing statements, and
                        submit maintenance requests from here.
                    </p>
                </div>

                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <h3 className="text-sm font-medium text-muted-foreground">
                            My Unit
                        </h3>
                        <p className="mt-1 text-2xl font-bold">—</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <h3 className="text-sm font-medium text-muted-foreground">
                            Outstanding Balance
                        </h3>
                        <p className="mt-1 text-2xl font-bold">—</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <h3 className="text-sm font-medium text-muted-foreground">
                            Open Requests
                        </h3>
                        <p className="mt-1 text-2xl font-bold">—</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
