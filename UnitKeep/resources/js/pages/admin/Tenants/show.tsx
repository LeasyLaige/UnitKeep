import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin/dashboard' },
    { title: 'Tenants', href: '/admin/tenants' },
    { title: 'Tenant Details', href: '#' },
];

interface Lease {
    id: number;
    unit: string;
    start_date: string;
    end_date: string;
    monthly_rent: string;
    status: string;
}

interface TenantDetail {
    id: number;
    full_name: string;
    first_name: string;
    last_name: string;
    email: string;
    created_at: string;
    profile: {
        phone: string | null;
        date_of_birth: string | null;
        address: string | null;
        emergency_contact_name: string | null;
        emergency_contact_phone: string | null;
        notes: string | null;
    } | null;
    leases: Lease[];
}

interface Props {
    tenant: TenantDetail;
}

const statusColor: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    active: 'default',
    expired: 'secondary',
    terminated: 'destructive',
    pending_renewal: 'outline',
};

export default function TenantShow({ tenant }: Props) {
    const profile = tenant.profile;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Tenant: ${tenant.full_name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl bg-background p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">{tenant.full_name}</h1>
                        <p className="mt-1 text-sm text-muted-foreground">{tenant.email} · Joined {tenant.created_at}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/admin/tenants/${tenant.id}/edit`}>Edit</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/tenants">Back to List</Link>
                        </Button>
                    </div>
                </div>

                {/* Profile Information */}
                <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    <h2 className="text-lg font-semibold">Profile Information</h2>
                    {profile ? (
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                                <p className="mt-1">{profile.phone ?? '—'}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Date of Birth</h3>
                                <p className="mt-1">{profile.date_of_birth ?? '—'}</p>
                            </div>
                            <div className="sm:col-span-2">
                                <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                                <p className="mt-1">{profile.address ?? '—'}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Emergency Contact</h3>
                                <p className="mt-1">{profile.emergency_contact_name ?? '—'}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Emergency Phone</h3>
                                <p className="mt-1">{profile.emergency_contact_phone ?? '—'}</p>
                            </div>
                            {profile.notes && (
                                <div className="sm:col-span-2">
                                    <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
                                    <p className="mt-1">{profile.notes}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="mt-4 text-sm text-muted-foreground">No profile information available.</p>
                    )}
                </div>

                {/* Lease Contracts */}
                <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    <h2 className="text-lg font-semibold">Lease Contracts</h2>
                    {tenant.leases.length === 0 ? (
                        <p className="mt-4 text-sm text-muted-foreground">No lease contracts found.</p>
                    ) : (
                        <div className="mt-4 space-y-3">
                            {tenant.leases.map((l) => (
                                <div key={l.id} className="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3 text-sm">
                                    <div>
                                        <div className="font-medium">{l.unit}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {l.start_date} — {l.end_date} · ₱{l.monthly_rent}/mo
                                        </div>
                                    </div>
                                    <Badge variant={statusColor[l.status] ?? 'secondary'}>
                                        {l.status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
