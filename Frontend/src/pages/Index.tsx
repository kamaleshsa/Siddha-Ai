import { AnimatePresence } from "framer-motion";
import { AnimatedBackground } from "@/components/background/AnimatedBackground";
import { Header } from "@/components/layout/Header";
import { DisclaimerBanner } from "@/components/layout/DisclaimerBanner";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { HeroSection } from "@/components/hero/HeroSection";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat/ChatInput";
import { useSiddhaChat } from "@/hooks/useSiddhaChat";

const Index = () => {
  const { messages, isLoading, sendMessage, sessions, currentsessionId, selectChat, createNewChat } = useSiddhaChat();
  const hasMessages = messages.length > 0;

  const handleSend = (message: string) => {
    sendMessage(message);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedBackground />
      <AppSidebar 
        sessions={sessions}
        currentSessionId={currentsessionId}
        onSelectChat={selectChat}
        onNewChat={createNewChat}
      />
      <Header />

      <main className="flex-1 flex flex-col pt-16 pb-24">
        <div className="flex-1 flex flex-col max-w-3xl w-full mx-auto">
          <AnimatePresence mode="wait">
            {!hasMessages ? (
              <HeroSection key="hero" onPromptClick={handleSend} />
            ) : (
              <ChatMessages key="messages" messages={messages} />
            )}
          </AnimatePresence>
        </div>

        <div className="fixed bottom-10 left-0 right-0 px-4">
          <div className="max-w-3xl mx-auto">
            <ChatInput onSend={handleSend} disabled={isLoading} />
          </div>
        </div>
      </main>

      <DisclaimerBanner />
    </div>
  );
};

export default Index;
