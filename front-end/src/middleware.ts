import { NextRequest, NextResponse } from "next/server";
import { UnAuthenticatedRoutes, AgentRoutes } from "./app/common/constants/routes";
import { AUTHENTICATION_COOKIE } from "@/app/(auth)/auth-cookie";
import { decodeToken } from "./utils/decodeToken";

function checkRoleAccess(pathname: string, role: string): boolean {
  if (role === 'ADMIN') {
    return true;
  } else if (role === 'AGENT') {
    return AgentRoutes.some(route => pathname.startsWith(route));
  }
  return false;
}

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get(AUTHENTICATION_COOKIE)?.value;
  return !!token;
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Allow access to the unauthorized page
  if (path === '/unauthorized') {
    return NextResponse.next();
  }

  // Check if the route is unauthenticated
  const isUnauthenticatedRoute = UnAuthenticatedRoutes.some((route: { path: string }) => path.startsWith(route.path));
  
  // Handle unauthenticated users
  if (!isAuthenticated(request)) {
    if (!isUnauthenticatedRoute && path !== '/signin') {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
    return NextResponse.next();
  }

  // Get and validate token
  const token = request.cookies.get(AUTHENTICATION_COOKIE)?.value;
  const decoded = decodeToken(token) as { role?: string } | null;
  
  // Handle invalid token
  if (!decoded) {
    if (!isUnauthenticatedRoute && path !== '/signin') {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
    return NextResponse.next();
  }

  // Check role-based access
  const role = decoded.role;
  if (role && !checkRoleAccess(path, role)) {
    console.log(`Unauthorized access attempt by role: ${role} to path: ${path}`);
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/:path((?!api|_next/static|_next/image|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)"
  ],
};
