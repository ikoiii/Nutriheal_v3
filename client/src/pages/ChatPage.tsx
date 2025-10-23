import React from "react";
import { useChat } from "@/hooks/useChat";
import MessageList from "@/components/chat/MessageList";
import ChatInputForm from "@/components/chat/ChatInputForm";
import { Card, CardContent } from "@/components/ui/card";

const ChatPage: React.FC = () => {
  const {
    messages,
    currentQuestion,
    setCurrentQuestion,
    handleSubmit,
    isPending,
    messagesEndRef,
  } = useChat();

  return (
    <div className="container mx-auto p-4 flex flex-col h-[calc(100vh-100px)]">
      <h1 className="text-3xl font-bold mb-6">Asisten Kesehatan AI</h1>

      <Card className="flex-grow flex flex-col">
        <CardContent className="flex-grow p-4 overflow-y-auto">
          <MessageList
            messages={messages}
            isPending={isPending}
            messagesEndRef={messagesEndRef}
          />
        </CardContent>
        <ChatInputForm
          currentQuestion={currentQuestion}
          setCurrentQuestion={setCurrentQuestion}
          handleSubmit={handleSubmit}
          isPending={isPending}
        />
      </Card>
    </div>
  );
};

export default ChatPage;
