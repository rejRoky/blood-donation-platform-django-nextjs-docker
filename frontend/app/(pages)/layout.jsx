import "../globals.css";
import NavBar from "@/components/nav_bar/NavBar";
import Footer from "@/components/footer/Footer";
import ScrollTop from "@/components/scroll_top/ScrollTop";

export const metadata = {
  title: "Dial For Blood-Home",
  description: "Donate your red love to save one's life",
};

export default function RootLayout({ children }) {
  return (
    <div>
      <NavBar />

      <main className="min-h-[calc(100vh-50px)]">
        {children}
      </main>

      <ScrollTop />
      <Footer />
    </div>
  );
}
