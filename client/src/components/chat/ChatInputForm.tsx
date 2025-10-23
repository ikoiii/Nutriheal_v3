import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface ChatInputFormProps {
  currentQuestion: string;
  setCurrentQuestion: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
}

const ChatInputForm: React.FC<ChatInputFormProps> = ({
  currentQuestion,
  setCurrentQuestion,
  handleSubmit,
  isPending,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentQuestion(e.target.value);
    // Auto-resize textarea
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  return (
    <form onSubmit={handleSubmit} className="flex p-4 border-t bg-gray-50 rounded-b-lg shadow-inner items-end">
      <Textarea
        value={currentQuestion}
        onChange={handleInputChange}
        placeholder="Tanyakan sesuatu tentang kesehatan Anda..."
        className="flex-grow mr-2 min-h-[40px] max-h-[120px] resize-none overflow-y-auto"
        disabled={isPending}
        rows={1}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as any); // handleSubmit expects a FormEvent
          }
        }}
      />
      <Button type="submit" disabled={isPending} className="h-10 w-10 p-0 flex-shrink-0">
        Kirim
      </Button>
    </form>
  );
};

export default ChatInputForm;
