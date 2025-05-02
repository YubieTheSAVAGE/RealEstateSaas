import { NextRequest, NextResponse } from "next/server";
import { UnAuthenticatedRoutes } from "./app/common/constants/routes";
import { AUTHENTICATION_COOKIE } from "@/app/(auth)/auth-cookie";
import { decodeToken } from "./utils/decodeToken";

// function checkRoleAccess(pathname: string, role: string): boolean {
//   // console.log('role : ', role, '\n\n');
//   if (role === 'Admin') {
//     return true;
//   } else if (role === 'User') {
//     return UserRoutes.some(route => pathname.startsWith(route));
//   } else if (role === 'CallCenter') {
//     return CallCenterRoutes.some(route => pathname.startsWith(route));
//   } else if (role === 'DeliveryMan') {
//     return DeliveryManRoutes.some(route => pathname.startsWith(route));
//   }
//   return false;
// }

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get(AUTHENTICATION_COOKIE)?.value;
  // console.log('middleware token : ', token, '\n\n');
  return !!token;
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isUnauthenticatedRoute = UnAuthenticatedRoutes.some((route: { path: string }) => path.startsWith(route.path));

  if (!isAuthenticated(request)) {
    if (!isUnauthenticatedRoute && path !== '/signin'
    ) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
    return NextResponse.next();
  }

  const token:any = request.cookies.get(AUTHENTICATION_COOKIE)?.value;
  const decoded = decodeToken(token);
  if (!decoded && path !== '/signin'
  ) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // if (decoded  && path !== '/signin'
  // ) {
  //   return NextResponse.redirect(new URL('/unauthorized', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/:path((?!api|_next/static|_next/image|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)"
  ],
};
