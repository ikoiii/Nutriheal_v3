import React from 'react';
import { Message } from '@/hooks/useChat';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MessageItem from './MessageItem';

interface MessageListProps {
  messages: Message[];
  isPending: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isPending, messagesEndRef }) => {
  return (
    <ScrollArea className="h-full pr-4">
      {messages.map((msg, index) => (
        <MessageItem key={index} message={msg} />
      ))}
      {isPending && (
        <div className="flex items-start mb-4 justify-start">
          <Avatar className="h-8 w-8 mr-3 flex-shrink-0">
            <AvatarImage src="/path/to/ai-avatar.png" alt="AI" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div className="max-w-[70%] p-3 rounded-xl bg-gray-200 text-gray-800 animate-pulse rounded-bl-none">
            Mengetik...
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </ScrollArea>
  );
};

export default MessageList;
