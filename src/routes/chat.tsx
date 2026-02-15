import { ChatPage } from "@/components/chat/chat-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/chat")({
  component: RouteComponent,
  loader: () => ({ crumb: "Chat" }),
});

function RouteComponent() {
  return <ChatPage />;
}
