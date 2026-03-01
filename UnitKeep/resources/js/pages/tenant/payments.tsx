import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type PaymentRecord = {
    orNumber: string;
    description: string;
    paymentDate: string;
    amount: number;
};

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

const paymentHistory: PaymentRecord[] = [
    {
        orNumber: 'OR-2026-0012',
        description: 'Monthly Rent - February 2026',
        paymentDate: 'Feb 05, 2026',
        amount: 10000,
    },
    {
        orNumber: 'OR-2026-0009',
        description: 'Monthly Rent - January 2026',
        paymentDate: 'Jan 05, 2026',
        amount: 10000,
    },
    {
        orNumber: 'OR-2025-0124',
        description: 'Security Deposit',
        paymentDate: 'Dec 15, 2025',
        amount: 10000,
    },
    {
        orNumber: 'OR-2025-0101',
        description: 'Move-in Fees',
        paymentDate: 'Dec 01, 2025',
        amount: 2500,
    },
];

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
    }).format(amount);

export default function TenantPayments() {
    const total = paymentHistory.reduce((sum, payment) => sum + payment.amount, 0);

    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            setReceiptFile(null);
            setPreviewUrl(null);
            return;
        }

        setReceiptFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payments" />

            <div className="flex h-full flex-1 flex-col gap-8 overflow-x-auto rounded-xl bg-background p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Payment History
                    </h1>
                </div>

                <div className="mx-auto w-full max-w-6xl rounded-xl border border-sidebar-border/70 bg-card shadow-sm dark:border-sidebar-border">
                    <div className="overflow-x-auto rounded-xl">
                        <table className="min-w-full border-separate border-spacing-0 text-sm">
                            <thead>
                                <tr className="bg-[#7FAF5B] text-left text-white">
                                    <th className="px-6 py-3 font-medium">
                                        OR Number
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Payment Date
                                    </th>
                                    <th className="px-6 py-3 text-right font-medium">
                                        Amount
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {paymentHistory.map((payment) => (
                                    <tr
                                        key={payment.orNumber}
                                        className="border-b border-border last:border-0"
                                    >
                                        <td className="px-6 py-3">
                                            {payment.orNumber}
                                        </td>
                                        <td className="px-6 py-3 pr-10">
                                            {payment.description}
                                        </td>
                                        <td className="px-6 py-3">
                                            {payment.paymentDate}
                                        </td>
                                        <td className="px-6 py-3 text-right font-medium">
                                            {formatCurrency(payment.amount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="px-6 py-4 text-sm font-medium text-muted-foreground"
                                    >
                                        Total
                                    </td>
                                    <td className="px-6 py-4 text-right text-base font-semibold">
                                        {formatCurrency(total)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                <div className="mx-auto w-full max-w-6xl rounded-xl border border-sidebar-border/70 bg-card px-8 py-12 text-center shadow-sm dark:border-sidebar-border">
                    <h2 className="text-lg font-medium">Upload Receipt</h2>
                    <p className="mt-3 text-sm text-muted-foreground">
                        Upload a snapshot of your latest payment receipt (PNG or JPG, up
                        to 5MB).
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
                                <span className="font-medium">
                                    Click to browse
                                </span>
                                <span className="mt-1 text-xs">
                                    or drag and drop an image here
                                </span>
                            </>
                        )}

                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </label>

                    {receiptFile && (
                        <p className="mt-4 text-xs text-muted-foreground">
                            Selected file: <span className="font-medium">{receiptFile.name}</span>
                        </p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

