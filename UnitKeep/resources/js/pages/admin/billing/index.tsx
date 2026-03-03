import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { BreadcrumbItem } from '@/types';
import { FormEventHandler, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin/dashboard' },
    { title: 'Billing', href: '/admin/billing' },
];

interface BillingRecord {
    id: number;
    tenant_name: string;
    unit: string;
    billing_month: string;
    amount_due: string;
    amount_paid: string;
    status: string;
    due_date: string | null;
    paid_date: string | null;
    remarks: string | null;
}

interface Props {
    records: BillingRecord[];
    months: string[];
    filters: {
        status: string | null;
        month: string | null;
    };
}

const statusColor: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    unpaid: 'secondary',
    partial: 'outline',
    paid: 'default',
    overdue: 'destructive',
};

function statusLabel(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function BillingIndex({ records, months, filters }: Props) {
    const [showGenerate, setShowGenerate] = useState(false);
    const generateForm = useForm({ month: '' });

    const handleGenerate: FormEventHandler = (e) => {
        e.preventDefault();
        generateForm.post('/admin/billing/generate', {
            onSuccess: () => {
                setShowGenerate(false);
                generateForm.reset();
            },
        });
    };

    function markPaid(id: number) {
        router.patch(`/admin/billing/${id}/mark-paid`, {}, { preserveScroll: true });
    }

    function applyFilter(key: string, value: string | null) {
        const params: Record<string, string> = {};
        if (key === 'status' && value) params.status = value;
        else if (filters.status) params.status = filters.status;
        if (key === 'month' && value) params.month = value;
        else if (filters.month) params.month = filters.month;

        // If the same filter is clicked, remove it
        if (key === 'status' && value === filters.status) delete params.status;
        if (key === 'month' && value === filters.month) delete params.month;

        router.get('/admin/billing', params, { preserveState: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Billing" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl bg-background p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Billing Management</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Generate and manage monthly billing records.
                        </p>
                    </div>
                    <Button onClick={() => setShowGenerate(!showGenerate)}>
                        {showGenerate ? 'Cancel' : 'Generate Billing'}
                    </Button>
                </div>

                {/* Generate billing form */}
                {showGenerate && (
                    <form onSubmit={handleGenerate} className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <h2 className="text-lg font-semibold">Generate Monthly Billing</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Creates billing records for all active leases in the selected month.
                        </p>
                        <div className="mt-4 flex items-end gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="gen-month">Month</Label>
                                <Input
                                    id="gen-month"
                                    type="month"
                                    value={generateForm.data.month}
                                    onChange={(e) => generateForm.setData('month', e.target.value)}
                                />
                                {generateForm.errors.month && <p className="text-sm text-destructive">{generateForm.errors.month}</p>}
                            </div>
                            <Button type="submit" disabled={generateForm.processing}>
                                {generateForm.processing ? 'Generating…' : 'Generate'}
                            </Button>
                        </div>
                    </form>
                )}

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex flex-wrap gap-2">
                        {['unpaid', 'partial', 'paid', 'overdue'].map((s) => (
                            <Button
                                key={s}
                                variant={filters.status === s ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => applyFilter('status', s)}
                            >
                                {statusLabel(s)}
                            </Button>
                        ))}
                        {filters.status && (
                            <Button variant="ghost" size="sm" onClick={() => applyFilter('status', null)}>
                                Clear
                            </Button>
                        )}
                    </div>
                    {months.length > 0 && (
                        <select
                            value={filters.month ?? ''}
                            onChange={(e) => applyFilter('month', e.target.value || null)}
                            className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-9 rounded-md border px-3 py-1 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                        >
                            <option value="">All months</option>
                            {months.map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Records */}
                {records.length === 0 ? (
                    <div className="rounded-xl border border-sidebar-border/70 p-12 text-center text-muted-foreground dark:border-sidebar-border">
                        No billing records found.
                    </div>
                ) : (
                    <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-sidebar-border/70 text-left dark:border-sidebar-border">
                                    <th className="px-4 py-3 font-medium text-muted-foreground">Tenant</th>
                                    <th className="px-4 py-3 font-medium text-muted-foreground">Unit</th>
                                    <th className="px-4 py-3 font-medium text-muted-foreground">Month</th>
                                    <th className="px-4 py-3 font-medium text-muted-foreground">Due</th>
                                    <th className="px-4 py-3 font-medium text-muted-foreground">Paid</th>
                                    <th className="px-4 py-3 font-medium text-muted-foreground">Due Date</th>
                                    <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                                    <th className="px-4 py-3 font-medium text-muted-foreground text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((r) => (
                                    <tr key={r.id} className="border-b border-sidebar-border/70 last:border-0 dark:border-sidebar-border">
                                        <td className="px-4 py-3 font-medium">{r.tenant_name}</td>
                                        <td className="px-4 py-3">{r.unit}</td>
                                        <td className="px-4 py-3">{r.billing_month}</td>
                                        <td className="px-4 py-3">₱{r.amount_due}</td>
                                        <td className="px-4 py-3">₱{r.amount_paid}</td>
                                        <td className="px-4 py-3">{r.due_date ?? '—'}</td>
                                        <td className="px-4 py-3">
                                            <Badge variant={statusColor[r.status] ?? 'secondary'}>
                                                {statusLabel(r.status)}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {r.status !== 'paid' && (
                                                <Button variant="outline" size="sm" onClick={() => markPaid(r.id)}>
                                                    Mark Paid
                                                </Button>
                                            )}
                                            {r.status === 'paid' && r.paid_date && (
                                                <span className="text-xs text-muted-foreground">Paid {r.paid_date}</span>
                                            )}
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
