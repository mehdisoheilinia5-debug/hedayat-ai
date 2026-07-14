import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ChatWindow from "@/components/ChatWindow";

export default async function ChatPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <ChatWindow />;
}