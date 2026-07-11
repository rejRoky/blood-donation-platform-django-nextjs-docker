import { withAuth } from "next-auth/middleware";

/**
 * Routes requiring an authenticated session.
 * The donor directory is intentionally protected: donor contact details
 * are only visible to signed-in members.
 */
export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/dashboard/:path*", "/donors/:path*"],
};
