import "@/app/globals.css";
import AuthProvider from "@/components/SessionProvider";

export const metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard layout",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
