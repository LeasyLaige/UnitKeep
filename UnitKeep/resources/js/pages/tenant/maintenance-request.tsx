import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useInitials } from '@/hooks/use-initials';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tenant Dashboard', href: '/tenant/dashboard' },
    { title: 'Maintenance Request', href: '/tenant/maintenance-request' },
];

const PRIORITY_OPTIONS = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
] as const;

const CATEGORY_OPTIONS = [
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'hvac', label: 'HVAC' },
    { value: 'structural', label: 'Structural' },
    { value: 'pest_control', label: 'Pest Control' },
    { value: 'other', label: 'Other' },
] as const;

type TenantData = {
    name: string;
    address: string;
    unit: string;
    country: string;
    email: string;
    phone: string;
};

export default function MaintenanceRequestPage({
    tenant,
}: {
    tenant: TenantData;
}) {
    const { auth } = usePage().props;
    const getInitials = useInitials();
    const { data, setData, post, processing, errors } = useForm({
        priority: '',
        category: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/tenant/maintenance-request');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Maintenance Request" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl bg-background p-6">
                {/* Header: title + avatar */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Maintenance Request
                    </h1>
                    <Avatar className="h-10 w-10 overflow-hidden rounded-full border border-border">
                        <AvatarImage
                            src={auth.user.avatar}
                            alt={auth.user.full_name}
                        />
                        <AvatarFallback className="rounded-full bg-muted text-sm font-medium text-muted-foreground">
                            {getInitials(auth.user.full_name)}
                        </AvatarFallback>
                    </Avatar>
                </div>

                {/* White card container */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    {/* Two columns: Tenant info + Contact */}
                    <div className="grid gap-8 sm:grid-cols-2">
                        <div>
                            <h2 className="text-sm font-bold text-foreground">
                                Tenant Name
                            </h2>
                            <div className="mt-2 flex flex-col gap-0.5 pl-0 text-sm text-muted-foreground">
                                <span>{tenant.address}</span>
                                <span>{tenant.unit}</span>
                                <span>{tenant.country}</span>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-foreground">
                                Contact
                            </h2>
                            <div className="mt-2 flex flex-col gap-0.5 pl-0 text-sm text-muted-foreground">
                                <span>{tenant.email}</span>
                                <span>{tenant.phone}</span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        {/* Priority + Type of Problem row */}
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="priority"
                                    className="text-sm font-bold text-foreground"
                                >
                                    Priority Level
                                </Label>
                                <Select
                                    value={data.priority}
                                    onValueChange={(value) =>
                                        setData('priority', value)
                                    }
                                    required
                                >
                                    <SelectTrigger
                                        id="priority"
                                        className="h-10 w-full rounded-lg border border-input bg-transparent"
                                    >
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PRIORITY_OPTIONS.map((opt) => (
                                            <SelectItem
                                                key={opt.value}
                                                value={opt.value}
                                            >
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.priority && (
                                    <p className="text-xs text-destructive">
                                        {errors.priority}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="category"
                                    className="text-sm font-bold text-foreground"
                                >
                                    Type of Problem
                                </Label>
                                <Select
                                    value={data.category}
                                    onValueChange={(value) =>
                                        setData('category', value)
                                    }
                                    required
                                >
                                    <SelectTrigger
                                        id="category"
                                        className="h-10 w-full rounded-lg border border-input bg-transparent"
                                    >
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORY_OPTIONS.map((opt) => (
                                            <SelectItem
                                                key={opt.value}
                                                value={opt.value}
                                            >
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category && (
                                    <p className="text-xs text-destructive">
                                        {errors.category}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Describe the Problem */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="description"
                                className="text-sm font-bold text-foreground"
                            >
                                Describe the Problem
                            </Label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                required
                                rows={5}
                                placeholder="Describe the issue..."
                                className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            {errors.description && (
                                <p className="text-xs text-destructive">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Submitting...' : 'Submit Request'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
