"use client";

import { LawyerProfileCard } from "@/components/lawyer";
import { LawyerRequestsList } from "@/components/lawyer/LawyerRequestsList";


export default function LawyerDashboardPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <LawyerProfileCard />
      <LawyerRequestsList />
    </div>
  );
}
