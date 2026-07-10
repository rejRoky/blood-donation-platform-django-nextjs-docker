import "@/app/globals.css";
import StoreProvider from "@/lib/StoreProvider";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next"

export default function NotFoundLayout({ children }) {
    return (
        <StoreProvider>
            <html lang="en">
                <body cz-shortcut-listen="true">
                    <Toaster
                        position="top-right"
                        reverseOrder={false}
                    />
                    {children}
                    <Analytics />
                </body>
            </html>
        </StoreProvider>
    );
};