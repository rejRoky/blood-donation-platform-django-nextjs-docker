import "@/app/globals.css";

export const metadata = {
    title: "Dial For Blood-Login",
    description: "Donate your red love to save one's life",
};

export default function RootLayout({ children }) {
    return (
        <div>
            {children}
        </div>
    );
}
