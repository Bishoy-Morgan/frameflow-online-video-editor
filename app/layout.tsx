import type { Metadata } from "next";
import { DM_Serif_Display, Quicksand } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import SessionProvider from "@/components/SessionProvider";
import UserProvider from "@/components/providers/UserProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-dm-serif-display",
  weight: ["400"],
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Frameflow | Online Video Editor for Fast, Professional Content",
  description:
    "Frameflow is an online video editor that lets you edit videos directly in your browser. Create social media reels, promo videos, and marketing content with fast tools, ready-made templates, and smooth performance—no downloads required.",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions)

  const user = session?.user?.email
    ? await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
          id:        true,
          name:      true,
          email:     true,
          image:     true,
          role:      true,
          password:  true,
          createdAt: true,
          _count: {
            select: {
              projects: {
                where: { deletedAt: null },
              },
            },
          },
          projects: {
            orderBy: { updatedAt: 'desc' },
            take: 1,
            select: { updatedAt: true },
          },
        },
      })
    : null

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${dmSerifDisplay.variable} ${quicksand.variable} antialiased`}
        suppressHydrationWarning
      >
        <SessionProvider>
          {user ? (
            <UserProvider user={user}>
              {children}
            </UserProvider>
          ) : (
            children
          )}
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}