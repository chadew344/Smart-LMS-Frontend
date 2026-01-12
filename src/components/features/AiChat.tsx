import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { useAppSelector, useAppDispatch } from "../../store/hook";
import { cn } from "../../lib/utils";
import {
  toggleChat,
  closeChat,
  addUserMessage,
  clearError,
  sendChatMessage,
} from "../../store/slices/aiChatSlice";
import type { Message } from "../../types";

const FloatingChatButton = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { messages, isOpen, isTyping, error } = useAppSelector(
    (state) => state.chat
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isAuthenticated) return null;

  const handleSendMessage = async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: trimmedInput,
      role: "user",
      timestamp: new Date().toISOString(),
    };

    dispatch(addUserMessage(userMessage));
    setInputValue("");

    dispatch(
      sendChatMessage({
        text: trimmedInput,
        maxTokens: 1000,
      })
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCloseChat = () => {
    dispatch(closeChat());
    if (error) {
      dispatch(clearError());
    }
  };

  return (
    <>
      <div
        className={cn(
          "fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] rounded-2xl border bg-background shadow-2xl transition-all duration-300 ease-out",
          isOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-95 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-linear-to-r from-primary/10 to-accent/10 p-4 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-primary to-accent">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Edumate Assistant
              </h3>
              <p className="text-xs text-muted-foreground">
                {isTyping ? "Typing..." : "Always here to help"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={handleCloseChat}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {error && (
          <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
            <p className="text-xs text-destructive flex-1">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => dispatch(clearError())}
            >
              Dismiss
            </Button>
          </div>
        )}

        <ScrollArea className="h-[350px] p-4">
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm wrap-break-word",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span
                      className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              placeholder="Ask anything..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isTyping}
              className="flex-1 rounded-full border-muted-foreground/20 bg-muted/50 focus-visible:ring-primary"
            />
            <Button
              size="icon"
              className="h-10 w-10 rounded-full bg-linear-to-br from-primary to-accent hover:opacity-90"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>

      <button
        onClick={() => dispatch(toggleChat())}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95",
          "bg-linear-to-br from-primary to-accent",
          isOpen && "rotate-90"
        )}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-primary-foreground transition-transform" />
        ) : (
          <MessageCircle className="h-6 w-6 text-primary-foreground" />
        )}
        {!isOpen && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-accent" />
          </span>
        )}
      </button>
    </>
  );
};

export default FloatingChatButton;
