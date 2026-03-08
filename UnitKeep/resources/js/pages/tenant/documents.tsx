import { Head } from '@inertiajs/react';
import { Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tenant Dashboard',
        href: '/tenant/dashboard',
    },
    {
        title: 'Documents',
        href: '/tenant/documents',
    },
];

type TenantDocument = {
    id: string;
    title: string;
    description: string;
    href: string;
};

const documents: TenantDocument[] = [
    {
        id: 'lease-agreement',
        title: 'Lease Agreement Form',
        description:
            'Standard lease agreement between tenant and property management. Review and keep a signed copy for your records.',
        href: '/tenant/documents/lease-agreement-form',
    },
    {
        id: 'move-in-inspection',
        title: 'Move-In Inspection Form',
        description:
            'Use this form during move-in to document the condition of your unit and note any existing issues.',
        href: '/tenant/documents/move-in-inspection-form',
    },
    {
        id: 'tenant-info-update',
        title: 'Tenant Information Update Form',
        description:
            'Update your contact details, emergency contact, or other personal information on file.',
        href: '/tenant/documents/tenant-information-update-form',
    },
];

export default function TenantDocumentsPage() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Documents" />

            <div className="flex h-full flex-1 flex-col gap-8 overflow-x-auto rounded-xl bg-background p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Documents
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Download important tenant documents anytime. Save a copy for your
                        personal records.
                    </p>
                </div>

                <div className="mx-auto grid w-full max-w-5xl gap-5">
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className="flex items-center justify-between gap-6 rounded-xl border border-sidebar-border/70 bg-card px-6 py-5 text-sm shadow-sm transition hover:bg-accent/40"
                        >
                            <div className="flex flex-1 items-start gap-3">
                                <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-medium text-foreground">
                                        {doc.title}
                                    </h2>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {doc.description}
                                    </p>
                                </div>
                            </div>

                            <Button asChild size="sm" className="shrink-0" variant="outline">
                                <a href={doc.href} download>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                </a>
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}

