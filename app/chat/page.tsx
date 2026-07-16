import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import VoiceInterface from "@/components/VoiceInterface";

export default async function ChatPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <VoiceInterface />;
}