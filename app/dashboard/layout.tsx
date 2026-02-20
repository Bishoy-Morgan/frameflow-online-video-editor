export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  const user = session!.user;

  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header user={user} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}