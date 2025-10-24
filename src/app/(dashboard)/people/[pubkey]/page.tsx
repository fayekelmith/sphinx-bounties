"use client";

import { use } from "react";
import { redirect } from "next/navigation";

export default function ProfilePage({ params }: { params: Promise<{ pubkey: string }> }) {
  const { pubkey } = use(params);
  redirect(`/people/${pubkey}`);
}
