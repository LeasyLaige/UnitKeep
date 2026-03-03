import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tenant Dashboard', href: '/tenant/dashboard' },
    { title: 'My Profile', href: '/tenant/profile' },
];

interface ProfileInfo {
    phone: string | null;
    date_of_birth: string | null;
    address: string | null;
    emergency_contact_name: string | null;
    emergency_contact_phone: string | null;
}

interface UserInfo {
    full_name: string;
    first_name: string;
    last_name: string;
    email: string;
}

interface UnitInfo {
    unit_number: string;
    building: string;
    floor: number;
    type: string | null;
    area_sqm: string | null;
    status: string;
}

interface LeaseInfo {
    monthly_rent: string;
    security_deposit: string;
    start_date: string;
    end_date: string;
    status: string;
    terms: string | null;
}

interface Props {
    profile: ProfileInfo | null;
    user: UserInfo;
    unit: UnitInfo | null;
    lease: LeaseInfo | null;
}

function statusLabel(status: string): string {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
    return (
        <div>
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="mt-1 font-medium">{value ?? '—'}</dd>
        </div>
    );
}

export default function TenantProfile({ profile, user, unit, lease }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Profile" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl bg-background p-6">
                <h1 className="text-2xl font-semibold tracking-tight">My Profile</h1>

                {/* Personal Information */}
                <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border">
                    <h2 className="text-sm font-medium text-muted-foreground">Personal Information</h2>
                    <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
                        <InfoRow label="Full Name" value={user.full_name} />
                        <InfoRow label="Email" value={user.email} />
                        <InfoRow label="Phone" value={profile?.phone} />
                        <InfoRow label="Date of Birth" value={profile?.date_of_birth} />
                        <InfoRow label="Address" value={profile?.address} />
                    </dl>
                </div>

                {/* Emergency Contact */}
                <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border">
                    <h2 className="text-sm font-medium text-muted-foreground">Emergency Contact</h2>
                    <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                        <InfoRow label="Name" value={profile?.emergency_contact_name} />
                        <InfoRow label="Phone" value={profile?.emergency_contact_phone} />
                    </dl>
                </div>

                {/* Assigned Unit */}
                <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border">
                    <div className="flex items-center gap-3">
                        <h2 className="text-sm font-medium text-muted-foreground">Assigned Unit</h2>
                        {unit && (
                            <Badge variant="outline">{statusLabel(unit.status)}</Badge>
                        )}
                    </div>
                    {unit ? (
                        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                            <InfoRow label="Unit Number" value={unit.unit_number} />
                            <InfoRow label="Building" value={unit.building} />
                            <InfoRow label="Floor" value={String(unit.floor)} />
                            <InfoRow label="Type" value={unit.type} />
                            <InfoRow label="Area" value={unit.area_sqm ? `${unit.area_sqm} sqm` : null} />
                        </dl>
                    ) : (
                        <p className="mt-4 text-sm text-muted-foreground">No unit currently assigned.</p>
                    )}
                </div>

                {/* Lease Contract */}
                <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border">
                    <div className="flex items-center gap-3">
                        <h2 className="text-sm font-medium text-muted-foreground">Lease Contract</h2>
                        {lease && (
                            <Badge variant={lease.status === 'active' ? 'default' : 'secondary'}>
                                {statusLabel(lease.status)}
                            </Badge>
                        )}
                    </div>
                    {lease ? (
                        <>
                            <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                                <InfoRow label="Monthly Rent" value={`₱${lease.monthly_rent}`} />
                                <InfoRow label="Security Deposit" value={`₱${lease.security_deposit}`} />
                                <InfoRow label="Start Date" value={lease.start_date} />
                                <InfoRow label="End Date" value={lease.end_date} />
                            </dl>
                            {lease.terms && (
                                <div className="mt-4 text-sm">
                                    <div className="text-xs text-muted-foreground">Terms</div>
                                    <p className="mt-1">{lease.terms}</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="mt-4 text-sm text-muted-foreground">No active lease contract.</p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
