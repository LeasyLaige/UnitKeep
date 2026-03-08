import { Head, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';

interface BillingRecord {
    id: number;
    billing_month: string;
    amount_due: string;
    amount_paid: string;
    due_date: string;
    status: string;
    paid_date: string | null;
    remarks: string | null;
    isOverdue: boolean;
    receipt: { url: string; name: string } | null;
}

interface Props {
    billingRecords: BillingRecord[];
    monthlyRent: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tenant Dashboard',
        href: '/tenant/dashboard',
    },
    {
        title: 'Payments',
        href: '/tenant/payments',
    },
];

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    paid: 'default',
    unpaid: 'destructive',
    overdue: 'destructive',
    partial: 'secondary',
};

function statusLabel(status: string): string {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

const formatCurrency = (amount: string | number) =>
    new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
    }).format(typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : amount);

function UploadReceiptButton({ billingRecordId }: { billingRecordId: number }) {
    const [preview, setPreview] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { data, setData, post, processing, errors, reset } = useForm<{
        receipt: File | null;
        billing_record_id: number;
    }>({
        receipt: null,
        billing_record_id: billingRecordId,
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setPreview(URL.createObjectURL(file));
        setData('receipt', file);
        setShowPreview(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.receipt) return;
        post('/tenant/payments/receipt', {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setPreview(null);
                setShowPreview(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
        });
    };

    const handleCancel = () => {
        reset();
        setPreview(null);
        setShowPreview(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
                {preview ? (
                    <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => setShowPreview(true)}>
                            Preview
                        </Button>
                        <Button type="submit" size="sm" disabled={processing}>
                            {processing ? 'Uploading…' : 'Submit'}
                        </Button>
                        <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
                            ✕
                        </Button>
                    </div>
                ) : (
                    <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                        Upload Proof
                    </Button>
                )}
                {errors.receipt && <span className="text-xs text-destructive">{errors.receipt}</span>}
            </form>

            {/* Full-size preview modal */}
            {showPreview && preview && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                    onClick={() => setShowPreview(false)}
                >
                    <div
                        className="relative max-h-[90vh] max-w-3xl overflow-auto rounded-xl bg-background p-4 shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-sm font-medium">Receipt Preview</h3>
                            <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
                                ✕
                            </Button>
                        </div>
                        <img
                            src={preview}
                            alt="Receipt preview"
                            className="max-h-[75vh] w-full rounded-lg object-contain"
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={handleCancel}>
                                Remove & choose another
                            </Button>
                            <Button size="sm" disabled={processing} onClick={handleSubmit}>
                                {processing ? 'Uploading…' : 'Submit Receipt'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default function TenantPayments({ billingRecords, monthlyRent }: Props) {
    const [viewingReceipt, setViewingReceipt] = useState<{ url: string; name: string } | null>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payments" />

            <div className="flex h-full flex-1 flex-col gap-8 overflow-x-auto rounded-xl bg-background p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Payment History
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Monthly rent: {formatCurrency(monthlyRent)}
                    </p>
                </div>

                <div className="mx-auto w-full max-w-6xl rounded-xl border border-sidebar-border/70 bg-card shadow-sm dark:border-sidebar-border">
                    <div className="overflow-x-auto rounded-xl">
                        <table className="min-w-full border-separate border-spacing-0 text-sm">
                            <thead>
                                <tr className="bg-[#7FAF5B] text-left text-white">
                                    <th className="px-6 py-3 font-medium">Billing Month</th>
                                    <th className="px-6 py-3 font-medium">Due Date</th>
                                    <th className="px-6 py-3 text-right font-medium">Amount Due</th>
                                    <th className="px-6 py-3 text-right font-medium">Amount Paid</th>
                                    <th className="px-6 py-3 font-medium">Paid Date</th>
                                    <th className="px-6 py-3 text-center font-medium">Status</th>
                                    <th className="px-6 py-3 text-center font-medium">Payment Proof</th>
                                </tr>
                            </thead>
                            <tbody>
                                {billingRecords.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                                            No billing records yet.
                                        </td>
                                    </tr>
                                ) : (
                                    billingRecords.map((record) => (
                                        <tr
                                            key={record.id}
                                            className="border-b border-border last:border-0"
                                        >
                                            <td className="px-6 py-3 font-medium">{record.billing_month}</td>
                                            <td className="px-6 py-3">{record.due_date}</td>
                                            <td className="px-6 py-3 text-right">{formatCurrency(record.amount_due)}</td>
                                            <td className="px-6 py-3 text-right">{formatCurrency(record.amount_paid)}</td>
                                            <td className="px-6 py-3">{record.paid_date ?? '—'}</td>
                                            <td className="px-6 py-3 text-center">
                                                <Badge variant={record.isOverdue ? 'destructive' : (statusVariant[record.status] ?? 'secondary')}>
                                                    {record.isOverdue ? 'Overdue' : statusLabel(record.status)}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-3 text-center">
                                                {record.receipt ? (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setViewingReceipt(record.receipt)}
                                                    >
                                                        View Proof
                                                    </Button>
                                                ) : (
                                                    <UploadReceiptButton billingRecordId={record.id} />
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Receipt image modal */}
            {viewingReceipt && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                    onClick={() => setViewingReceipt(null)}
                >
                    <div
                        className="relative max-h-[90vh] max-w-3xl overflow-auto rounded-xl bg-background p-4 shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-sm font-medium">{viewingReceipt.name}</h3>
                            <Button variant="ghost" size="sm" onClick={() => setViewingReceipt(null)}>
                                ✕
                            </Button>
                        </div>
                        <img
                            src={viewingReceipt.url}
                            alt={viewingReceipt.name}
                            className="max-h-[75vh] w-full rounded-lg object-contain"
                        />
                    </div>
                </div>
            )}
        </AppLayout>
    );
}

