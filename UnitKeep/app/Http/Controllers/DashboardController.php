<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Redirect to the appropriate dashboard based on the user's role.
     */
    public function index(Request $request): \Illuminate\Http\RedirectResponse
    {
        return $request->user()->isAdmin()
            ? redirect()->route('admin.dashboard')
            : redirect()->route('tenant.dashboard');
    }

    /**
     * Show the admin dashboard.
     */
    public function admin(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        if (! $request->user()->isAdmin()) {
            abort(403, 'Unauthorized.');
        }

        return Inertia::render('admin/dashboard');
    }

    /**
     * Show the tenant dashboard.
     */
    public function tenant(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        if (! $request->user()->isTenant()) {
            abort(403, 'Unauthorized.');
        }

        return Inertia::render('tenant/dashboard');
    }
}
