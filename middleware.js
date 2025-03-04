import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/auth", // Redirect to login if not authenticated
  },
});

export const config = {
  matcher: ["/admin/:path*"], // Protect all admin routes
};
