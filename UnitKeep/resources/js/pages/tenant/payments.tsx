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

export default function TenantPayments({ billingRecords, monthlyRent }: Props) {
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const { data, setData, post, processing, reset, errors } = useForm<{
        receipt: File | null;
    }>({
        receipt: null,
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            setReceiptFile(null);
            setPreviewUrl(null);
            setData('receipt', null);
            return;
        }
        setReceiptFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setData('receipt', file);
    };

    const handleSubmitReceipt = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.receipt) {
            return;
        }

        post('/tenant/payments/receipt', {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setReceiptFile(null);
                setPreviewUrl(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

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
                                </tr>
                            </thead>
                            <tbody>
                                {billingRecords.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
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
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Receipt upload area */}
                <form
                    onSubmit={handleSubmitReceipt}
                    className="mx-auto w-full max-w-6xl rounded-xl border border-sidebar-border/70 bg-card px-8 py-12 text-center shadow-sm dark:border-sidebar-border"
                >
                    <h2 className="text-lg font-medium">Upload Receipt</h2>
                    <p className="mt-3 text-sm text-muted-foreground">
                        Upload a snapshot of your latest payment receipt (PNG or JPG, up to 5 MB).
                    </p>

                    <label className="mt-8 flex h-72 w-full max-w-2xl cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-muted-foreground/40 bg-muted/40 text-sm text-muted-foreground transition hover:bg-muted/60 mx-auto md:h-80">
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt="Selected receipt"
                                className="h-full w-full rounded-md object-contain bg-background"
                            />
                        ) : (
                            <>
                                <span className="font-medium">Click to browse</span>
                                <span className="mt-1 text-xs">or drag and drop an image here</span>
                            </>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </label>

                    <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-center">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Choose image
                        </Button>
                        <Button type="submit" disabled={processing || !receiptFile}>
                            {processing ? 'Submitting...' : 'Submit receipt'}
                        </Button>
                    </div>

                    {receiptFile && (
                        <p className="mt-4 text-xs text-muted-foreground">
                            Selected file: <span className="font-medium">{receiptFile.name}</span>
                        </p>
                    )}

                    {errors.receipt && (
                        <p className="mt-2 text-xs text-destructive">{errors.receipt}</p>
                    )}
                </form>
            </div>
        </AppLayout>
    );
}

