import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StructuredData } from "@/components/StructuredData";
import {
  baseMetadata,
  getOrganizationSchema,
  getLocalBusinessSchema,
  getWebsiteSchema,
} from "@/config/metadata";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = baseMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Generate structured data schemas
  const organizationSchema = getOrganizationSchema();
  const localBusinessSchema = getLocalBusinessSchema();
  const websiteSchema = getWebsiteSchema();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=ac_unit,bolt,calendar_month,chat_bubble,close,construction,directions_boat,facebook,grid_view,language,local_shipping,location_on,mail,menu,phone,schedule,search,settings,speed,verified_user,view_list,water_drop&display=swap"
          rel="stylesheet"
        />
        <StructuredData
          data={[organizationSchema, localBusinessSchema, websiteSchema]}
        />
      </head>
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
