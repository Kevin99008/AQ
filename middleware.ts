import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    const userCookie = request.cookies.get('user'); // Retrieves the user cookie

    // Check if the user cookie exists and parse it
    const user = userCookie?.value ? JSON.parse(userCookie.value) : null;

    console.log('Middleware triggered for path:', url.pathname);
    console.log('User cookie:', user);

    // Check if the route starts with /admin
    if (url.pathname.startsWith('/admin')) {
        // Redirect to login if no user or if the user role is not admin
        if (!user || user.role !== 'admin') {
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }
    }

    // Allow access to the route
    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'], // Apply the middleware to /admin and its subpaths
};