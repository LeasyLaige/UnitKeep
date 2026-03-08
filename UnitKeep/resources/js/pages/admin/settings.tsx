import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin/dashboard' },
    { title: 'Settings', href: '/admin/settings' },
];

interface Props {
    user: {
        first_name: string;
        last_name: string;
        email: string;
    };
}

export default function AdminSettings({ user }: Props) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;

    const profileForm = useForm({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleProfileSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        profileForm.patch('/admin/settings/profile');
    };

    const handlePasswordSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        passwordForm.put('/admin/settings/password', {
            onSuccess: () => passwordForm.reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Settings" />
            <div className="flex h-full flex-1 flex-col gap-8 overflow-y-auto rounded-xl bg-background p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Account Settings</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage your profile information and password.
                    </p>
                </div>

                {flash?.success && (
                    <div className="rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
                        {flash.success}
                    </div>
                )}

                {/* Profile Information */}
                <form
                    onSubmit={handleProfileSubmit}
                    className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border"
                >
                    <h2 className="text-lg font-semibold">Profile Information</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Update your name and email address.
                    </p>

                    <div className="mt-6 grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="first_name">First Name</Label>
                            <Input
                                id="first_name"
                                value={profileForm.data.first_name}
                                onChange={(e) => profileForm.setData('first_name', e.target.value)}
                            />
                            {profileForm.errors.first_name && (
                                <p className="text-sm text-destructive">{profileForm.errors.first_name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="last_name">Last Name</Label>
                            <Input
                                id="last_name"
                                value={profileForm.data.last_name}
                                onChange={(e) => profileForm.setData('last_name', e.target.value)}
                            />
                            {profileForm.errors.last_name && (
                                <p className="text-sm text-destructive">{profileForm.errors.last_name}</p>
                            )}
                        </div>

                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={profileForm.data.email}
                                onChange={(e) => profileForm.setData('email', e.target.value)}
                            />
                            {profileForm.errors.email && (
                                <p className="text-sm text-destructive">{profileForm.errors.email}</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Button type="submit" disabled={profileForm.processing}>
                            {profileForm.processing ? 'Saving…' : 'Save Profile'}
                        </Button>
                    </div>
                </form>

                {/* Password Change */}
                <form
                    onSubmit={handlePasswordSubmit}
                    className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border"
                >
                    <h2 className="text-lg font-semibold">Change Password</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Ensure your account uses a strong, unique password.
                    </p>

                    <div className="mt-6 grid gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="current_password">Current Password</Label>
                            <Input
                                id="current_password"
                                type="password"
                                value={passwordForm.data.current_password}
                                onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                            />
                            {passwordForm.errors.current_password && (
                                <p className="text-sm text-destructive">{passwordForm.errors.current_password}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={passwordForm.data.password}
                                onChange={(e) => passwordForm.setData('password', e.target.value)}
                            />
                            {passwordForm.errors.password && (
                                <p className="text-sm text-destructive">{passwordForm.errors.password}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation">Confirm New Password</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                value={passwordForm.data.password_confirmation}
                                onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Button type="submit" disabled={passwordForm.processing}>
                            {passwordForm.processing ? 'Updating…' : 'Change Password'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
