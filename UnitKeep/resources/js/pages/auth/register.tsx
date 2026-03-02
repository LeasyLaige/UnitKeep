import { Head } from '@inertiajs/react';
import AuthLayout from '@/layouts/auth-layout';

/**
 * Registration is disabled in UnitKeep.
 * This page exists only to prevent build errors if referenced.
 */
export default function Register() {
    return (
        <AuthLayout title="Registration Disabled" description="Account registration is not available.">
            <Head title="Register" />
            <p className="text-center text-sm text-muted-foreground">
                Registration is disabled. Please contact your administrator for an account.
            </p>
        </AuthLayout>
    );
}
