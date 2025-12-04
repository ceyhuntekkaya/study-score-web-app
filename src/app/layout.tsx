import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Study Score App - Modern University",
  description: "Online Courses & Education Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="rbt-header-sticky" suppressHydrationWarning>
      <head>
        {/* Template CSS Files */}
        <link rel="stylesheet" href="/assets/css/vendor/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/vendor/slick.css" />
        <link rel="stylesheet" href="/assets/css/vendor/slick-theme.css" />
        <link rel="stylesheet" href="/assets/css/plugins/sal.css" />
        <link rel="stylesheet" href="/assets/css/plugins/feather.css" />
        <link rel="stylesheet" href="/assets/css/plugins/fontawesome.min.css" />
        <link rel="stylesheet" href="/assets/css/plugins/euclid-circulara.css" />
        <link rel="stylesheet" href="/assets/css/plugins/swiper.css" />
        <link rel="stylesheet" href="/assets/css/plugins/odometer.css" />
        <link rel="stylesheet" href="/assets/css/plugins/animation.css" />
        <link rel="stylesheet" href="/assets/css/plugins/bootstrap-select.min.css" />
        <link rel="stylesheet" href="/assets/css/plugins/jquery-ui.css" />
        <link rel="stylesheet" href="/assets/css/plugins/magnigy-popup.min.css" />
        <link rel="stylesheet" href="/assets/css/plugins/plyr.css" />
        <link rel="stylesheet" href="/assets/css/plugins/jodit.min.css" />
        <link rel="stylesheet" href="/assets/css/styles.css" />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
        
        {/* Template Scripts - jQuery alternatives will be added as React components */}
        {/* Note: jQuery scripts will be replaced with React/vanilla JS alternatives */}
        <Script src="/assets/js/vendor/modernizr.min.js" strategy="beforeInteractive" />
        {/* Bootstrap JS - using npm package instead */}
        {/* Swiper JS - using npm package instead */}
        {/* Other scripts will be converted to React hooks/components */}
      </body>
    </html>
  );
}
