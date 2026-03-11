import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login } from '@/routes';

interface WelcomeProps {
    [key: string]: unknown;
    auth: {
        user: {
            id: number;
        } | null;
    };
}

const highlights = [
    'Track tenants, units, and lease contracts in one place.',
    'Monitor monthly billing, payment receipts, and payment status.',
    'Handle maintenance requests without relying on scattered messages and spreadsheets.',
];

export default function Welcome() {
    const { auth } = usePage<WelcomeProps>().props;

    return (
        <>
            <Head title="UnitKeep">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#edf4ff_100%)] text-slate-950 dark:bg-[linear-gradient(180deg,#0b1220_0%,#0f1b33_100%)] dark:text-slate-50">
                <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 lg:px-10 lg:py-10">
                    <header className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-700 dark:text-blue-300">
                                UnitKeep
                            </p>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                Condominium management portal for admins and tenants.
                            </p>
                        </div>

                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                            >
                                Open dashboard
                            </Link>
                        ) : (
                            <Link
                                href={login()}
                                className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-900 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:hover:border-slate-500 dark:hover:bg-slate-800"
                            >
                                Log in
                            </Link>
                        )}
                    </header>

                    <main className="grid flex-1 items-center gap-8 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
                        <section>
                            <div className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800 dark:border-blue-900/70 dark:bg-blue-950/50 dark:text-blue-300">
                                Built for property operations
                            </div>

                            <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 lg:text-6xl dark:text-white">
                                Manage condo operations without losing track of people, payments, and requests.
                            </h1>

                            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 lg:text-lg dark:text-slate-300">
                                UnitKeep centralizes tenant records, unit occupancy, lease details, billing, payment receipts,
                                and maintenance concerns in a single web portal.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                                    >
                                        Go to dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href={login()}
                                        className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                                    >
                                        Sign in to UnitKeep
                                    </Link>
                                )}
                            </div>
                        </section>

                        <section className="rounded-4xl border border-slate-200/80 bg-white/80 p-6 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/75">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-2xl bg-slate-100 p-5 dark:bg-slate-800">
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Core modules</p>
                                    <p className="mt-3 text-3xl font-semibold">5</p>
                                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                        Tenants, units, leases, billing, and maintenance.
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-blue-600 p-5 text-white">
                                    <p className="text-sm font-medium text-blue-100">Role-based access</p>
                                    <p className="mt-3 text-3xl font-semibold">2</p>
                                    <p className="mt-2 text-sm text-blue-100/90">
                                        Separate admin and tenant experiences.
                                    </p>
                                </div>
                            </div>

                            <div id="features" className="mt-6 rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">What UnitKeep helps with</p>
                                <ul className="mt-4 space-y-3">
                                    {highlights.map((highlight) => (
                                        <li key={highlight} className="flex gap-3 text-sm leading-6 text-slate-700 dark:text-slate-200">
                                            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-500" />
                                            <span>{highlight}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </>
    );
}
