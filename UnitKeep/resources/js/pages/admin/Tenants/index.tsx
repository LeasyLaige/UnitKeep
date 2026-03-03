import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin/dashboard' },
    { title: 'Tenants', href: '/admin/tenants' },
];

interface Tenant {
    id: number;
    full_name: string;
    email: string;
    phone: string | null;
    address: string | null;
    created_at: string;
}

interface Props {
    tenants: Tenant[];
}

export default function TenantsIndex({ tenants }: Props) {
    function deleteTenant(id: number) {
        if (confirm('Are you sure you want to delete this tenant?')) {
            router.delete(`/admin/tenants/${id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tenants" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl bg-background p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Tenants</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage tenant accounts and profiles.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/tenants/create">Add Tenant</Link>
                    </Button>
                </div>

                {tenants.length === 0 ? (
                    <div className="rounded-xl border border-sidebar-border/70 p-12 text-center text-muted-foreground dark:border-sidebar-border">
                        No tenants found.
                    </div>
                ) : (
                    <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-sidebar-border/70 text-left dark:border-sidebar-border">
                                    <th className="px-4 py-3 font-medium text-muted-foreground">Name</th>
                                    <th className="px-4 py-3 font-medium text-muted-foreground">Email</th>
                                    <th className="px-4 py-3 font-medium text-muted-foreground">Phone</th>
                                    <th className="px-4 py-3 font-medium text-muted-foreground">Joined</th>
                                    <th className="px-4 py-3 font-medium text-muted-foreground text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tenants.map((t) => (
                                    <tr key={t.id} className="border-b border-sidebar-border/70 last:border-0 dark:border-sidebar-border">
                                        <td className="px-4 py-3 font-medium">
                                            <Link href={`/admin/tenants/${t.id}`} className="hover:underline">
                                                {t.full_name}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3">{t.email}</td>
                                        <td className="px-4 py-3">{t.phone ?? '—'}</td>
                                        <td className="px-4 py-3">{t.created_at}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/admin/tenants/${t.id}/edit`}>Edit</Link>
                                                </Button>
                                                <Button variant="destructive" size="sm" onClick={() => deleteTenant(t.id)}>
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
