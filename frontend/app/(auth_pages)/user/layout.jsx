import "@/app/globals.css";
import UserDashboardLayout from "@/components/user/layout/UserDashboardLayout";

export const metadata = {
  title: "Dial For Blood-User Dashboard",
  description: "Donate your red love to save one's life",
};

export default function RootLayout({ children }) {
  return (
    <div>
      <UserDashboardLayout>{children}</UserDashboardLayout>
    </div>
  );
}
