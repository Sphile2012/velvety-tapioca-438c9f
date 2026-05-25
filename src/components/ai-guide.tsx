import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Sparkles, Minimize2, Maximize2 } from "lucide-react";
import { serverSendChatMessage, type ChatMessage } from "@/lib/api";
import { cn } from "@/lib/utils";

export function AIGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: messageText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSuggestions([]);
    setIsLoading(true);

    try {
      const response = await serverSendChatMessage(messageText, messages);
      setMessages((prev) => [...prev, response.message]);
      setSuggestions(response.suggestions || []);
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "I apologize, but I'm having trouble responding right now. Please try again.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(input);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 inline-flex items-center gap-2 rounded-full bg-shield px-4 py-2.5 sm:px-5 sm:py-3 text-sm font-medium text-primary-foreground shadow-glow transition-all hover:scale-105 hover:opacity-90"
        aria-label="Open AI Guide"
      >
        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="hidden sm:inline">AI Guide</span>
        <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    );
  }

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100%-2rem)] sm:w-full sm:max-w-sm rounded-2xl border border-border bg-card/95 backdrop-blur-sm shadow-card transition-all",
        isMinimized ? "h-14" : "h-[60vh] sm:h-[500px]"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-shield">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Aegis AI Guide</h3>
            <p className="text-xs text-muted-foreground">Your wellness assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex flex-[1] flex-col overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center px-4">
                <div className="grid h-12 w-12 sm:h-16 sm:w-16 place-items-center rounded-full bg-shield/20 mb-3 sm:mb-4">
                  <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <h4 className="text-base sm:text-lg font-semibold text-foreground">
                  Welcome to Aegis AI Guide
                </h4>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-[250px] sm:max-w-[280px]">
                  I'm here to help you with your health and wellness journey. Ask me anything!
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex w-max max-w-[85%] sm:max-w-[85%] rounded-2xl px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm",
                    message.role === "user"
                      ? "ml-auto bg-shield text-primary-foreground"
                      : "mr-auto bg-secondary text-foreground"
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              ))
            )}
            {isLoading && (
              <div className="mr-auto flex w-max max-w-[85%] rounded-2xl bg-secondary px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-foreground">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-primary delay-100" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-primary delay-200" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && !isLoading && (
            <div className="px-3 sm:px-4 pb-2">
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="rounded-full border border-border bg-card px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs text-foreground transition-colors hover:bg-accent hover:border-primary/50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-border p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 rounded-xl border border-border bg-background px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                disabled={isLoading}
              />
              <button
                onClick={() => handleSendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-shield text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
