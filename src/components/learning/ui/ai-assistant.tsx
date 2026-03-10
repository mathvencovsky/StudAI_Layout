import { useState } from "react";
import { Bot, Send, Lightbulb, BookOpen, HelpCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { AIAssistantMessage, AIAssistantSuggestion } from "@/types/learning";

interface AIAssistantProps {
  lessonId?: string;
  moduleId?: string;
  trackId?: string;
  currentTopic?: string;
  suggestions?: AIAssistantSuggestion[];
  onSendMessage?: (message: string) => void;
  className?: string;
}

export function AIAssistant({
  lessonId,
  moduleId,
  trackId,
  currentTopic,
  suggestions = [],
  onSendMessage,
  className
}: AIAssistantProps) {
  const [messages, setMessages] = useState<AIAssistantMessage[]>([
    {
      id: "welcome",
      type: "assistant",
      content: "Olá! Sou seu assistente de IA. Posso ajudar com dúvidas sobre o conteúdo, explicar conceitos de forma mais simples ou sugerir exercícios extras. Como posso ajudar?",
      timestamp: new Date(),
      context: { lessonId, moduleId, trackId, currentTopic }
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const quickSuggestions = [
    {
      icon: BookOpen,
      text: "Explique de forma mais simples",
      action: `Explique ${currentTopic || 'este conceito'} de forma mais simples e com exemplos práticos`
    },
    {
      icon: Lightbulb,
      text: "Mostre mais exemplos",
      action: `Mostre mais exemplos práticos de ${currentTopic || 'este conceito'}`
    },
    {
      icon: HelpCircle,
      text: "Tire uma dúvida específica",
      action: "Tenho uma dúvida específica sobre"
    }
  ];

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: AIAssistantMessage = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date(),
      context: { lessonId, moduleId, trackId, currentTopic }
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);
    onSendMessage?.(message);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: AIAssistantMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: `Entendi sua pergunta sobre "${message}". Baseado no contexto da aula atual sobre ${currentTopic}, posso explicar que... [Esta seria uma resposta contextual da IA baseada no conteúdo da aula]`,
        timestamp: new Date(),
        context: { lessonId, moduleId, trackId, currentTopic }
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleQuickSuggestion = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-sm">
          <Bot className="h-5 w-5 text-blue-600" />
          <span>Assistente IA</span>
          <Sparkles className="h-4 w-4 text-yellow-500" />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-4 p-4 pt-0">
        {/* Quick Suggestions */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Precisa de ajuda?</p>
          <div className="space-y-1">
            {quickSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleQuickSuggestion(suggestion.action)}
                className="w-full text-left p-2 text-xs rounded-md bg-muted/50 hover:bg-muted transition-colors flex items-center space-x-2"
              >
                <suggestion.icon className="h-3 w-3 text-muted-foreground" />
                <span>"{suggestion.text}"</span>
              </button>
            ))}
          </div>
        </div>

        {/* AI Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Sugestões personalizadas:</p>
            <div className="space-y-1">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className={cn(
                    "p-2 rounded-md text-xs border",
                    suggestion.priority === 'high' && "border-orange-200 bg-orange-50 dark:bg-orange-950/20",
                    suggestion.priority === 'medium' && "border-blue-200 bg-blue-50 dark:bg-blue-950/20",
                    suggestion.priority === 'low' && "border-gray-200 bg-gray-50 dark:bg-gray-950/20"
                  )}
                >
                  <p className="font-medium">{suggestion.title}</p>
                  <p className="text-muted-foreground">{suggestion.description}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-1 h-6 px-2 text-xs"
                    onClick={() => handleQuickSuggestion(suggestion.action)}
                  >
                    {suggestion.action}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="space-y-3 pr-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.type === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] p-2 rounded-lg text-xs",
                      message.type === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <p>{message.content}</p>
                    <p className={cn(
                      "text-xs mt-1 opacity-70",
                      message.type === "user" ? "text-primary-foreground" : "text-muted-foreground"
                    )}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted p-2 rounded-lg text-xs">
                    <div className="flex items-center space-x-1">
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.1s]" />
                        <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                      </div>
                      <span className="text-muted-foreground">IA está digitando...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Message Input */}
        <div className="flex items-center space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Digite sua dúvida..."
            className="text-xs"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage(inputMessage);
              }
            }}
          />
          <Button
            size="sm"
            onClick={() => handleSendMessage(inputMessage)}
            disabled={!inputMessage.trim() || isTyping}
          >
            <Send className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}