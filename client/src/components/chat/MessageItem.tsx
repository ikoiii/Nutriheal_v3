import React from 'react';
import { Message } from '@/hooks/useChat';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const { sender, text } = message;
  const isUser = sender === 'user';

  return (
    <div
      className={`flex items-start mb-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 mr-3 flex-shrink-0">
          <AvatarImage src="/path/to/ai-avatar.png" alt="AI" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}
      <div
        className={`max-w-[70%] p-3 rounded-xl ${isUser
            ? "bg-green-500 text-white rounded-br-none"
            : "bg-gray-200 text-gray-800 rounded-bl-none"
          }`}
      >
        {text}
      </div>
      {isUser && (
        <Avatar className="h-8 w-8 ml-3 flex-shrink-0">
          {/* Note: User avatar path is a placeholder */}
          <AvatarImage src="/path/to/user-avatar.png" alt="User" />
          <AvatarFallback>ME</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default MessageItem;
