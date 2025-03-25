import type { Metadata } from "next";
import './globals.css';
// import MainHeader from "@/components/header/header";
import Navbar from "@/components/header/apple-header";
import Footer from "@/components/footer/footer";
import ScrollToTopButton from "@/components/landingComponent/scrollLink/scrollToTop";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import Hydrations from "@/components/auth/hydration";
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body id="top">
        {children}
        <Footer />
        {/* Include the client-side ScrollToTopButton */}
        <ScrollToTopButton />
        <ToastContainer />
      </body>
    </html>
  );
}
