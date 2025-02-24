import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

type JwtPayload = {
    exp: number;
};

function isTokenExpired(token: string): boolean {
    try {
        const decoded: JwtPayload = jwtDecode(token);
        return decoded.exp * 1000 < Date.now(); // Convert `exp` to milliseconds
    } catch (error) {
        return true; // If decoding fails, assume expired
    }
}

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    const accessToken = request.cookies.get('accessToken')?.value; // Get access token using the utility function

    // Check if the token exists and if it's expired
    if (!accessToken) {
        console.log("No token, redirecting to login...");
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    if (isTokenExpired(accessToken)) {
        console.log("token expired, redirecting to login...");
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // Check if the route starts with /admin
    if (url.pathname.startsWith('/admin')) {
        const userCookie = request.cookies.get('user'); // Retrieve the user cookie
        const user = userCookie?.value ? JSON.parse(userCookie.value) : null;

        // If no user or role is not 'staff', redirect to login
        if (!user || user.role !== 'staff') {
            console.log("not staff, redirecting to login...");
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