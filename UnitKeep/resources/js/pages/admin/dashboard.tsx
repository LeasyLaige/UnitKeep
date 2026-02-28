import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
];

export default function AdminDashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    <h2 className="text-xl font-semibold">
                        Welcome, Administrator
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                        Manage tenants, units, leases, billing, and
                        maintenance requests from here.
                    </p>
                </div>

                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <h3 className="text-sm font-medium text-muted-foreground">
                            Total Units
                        </h3>
                        <p className="mt-1 text-2xl font-bold">—</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <h3 className="text-sm font-medium text-muted-foreground">
                            Active Leases
                        </h3>
                        <p className="mt-1 text-2xl font-bold">—</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <h3 className="text-sm font-medium text-muted-foreground">
                            Pending Requests
                        </h3>
                        <p className="mt-1 text-2xl font-bold">—</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
