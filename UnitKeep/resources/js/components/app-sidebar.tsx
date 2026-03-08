import { Link, usePage } from '@inertiajs/react';
import {
    Building2,
    ClipboardList,
    CreditCard,
    FileText,
    Folder,
    LayoutGrid,
    Receipt,
    Settings,
    Users,
    Wrench,
} from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';

const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Tenants',
        href: '/admin/tenants',
        icon: Users,
    },
    {
        title: 'Units',
        href: '/admin/units',
        icon: Building2,
    },
    {
        title: 'Leases',
        href: '/admin/leases',
        icon: ClipboardList,
    },
    {
        title: 'Billing',
        href: '/admin/billing',
        icon: Receipt,
    },
    {
        title: 'Maintenance',
        href: '/admin/maintenance-requests',
        icon: Wrench,
    },
    {
        title: 'Settings',
        href: '/admin/settings',
        icon: Settings,
    },
];

const tenantNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/tenant/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Profile',
        href: '/tenant/profile',
        icon: Users,
    },
    {
        title: 'Payments',
        href: '/tenant/payments',
        icon: CreditCard,
    },
    {
        title: 'Request History',
        href: '/tenant/maintenance-requests',
        icon: FileText,
    },
    {
        title: 'New Request',
        href: '/tenant/maintenance-request',
        icon: Wrench,
    },
    {
        title: 'Documents',
        href: '/tenant/documents',
        icon: Folder,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { auth } = usePage().props;
    const user = auth.user;
    const navItems = user.role === 'admin' ? adminNavItems : tenantNavItems;
    const dashboardHref = user.role === 'admin' ? '/admin/dashboard' : '/tenant/dashboard';

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardHref} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
