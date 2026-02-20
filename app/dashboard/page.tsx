// 'use client';

// import DashboardContent from "./components/dashboardContent/DashboardContent";

// export default function DashboardPage() {
//   return (
//     <div>
//       <DashboardContent />
//     </div>
//   );
// }
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const user = session!.user;

  // Fetch user-specific data here, not in layout
  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    take: 10,
  });

  return (
    <div className="p-6">
      <h1>Welcome back, {user.name}</h1>
      {/* render projects */}
    </div>
  );
}