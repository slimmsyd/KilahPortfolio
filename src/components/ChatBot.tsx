import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import OpenAI from 'openai';

interface PortfolioItem {
  id: number;
  title: string;
  date: string;
  description: string;
  videoUrl: string;
  
  category: string;
}

interface ChatBotProps {
  currentItem: PortfolioItem;
}

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Inline OpenAI service to avoid module resolution issues
class OpenAIService {
  private openai: OpenAI | null = null;
  private isInitialized = false;

  constructor() {
    this.initializeOpenAI();
  }

  private initializeOpenAI() {
    const apiKey = (import.meta as any).env?.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      console.warn('⚠️ OpenAI API key not found. Using fallback responses.');
      return;
    }

    try {
      this.openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true
      });
      this.isInitialized = true;
      console.log('🚀 OpenAI API initialized successfully!');
    } catch (error) {
      console.error('❌ Failed to initialize OpenAI:', error);
    }
  }

  async getChatResponse(
    userMessage: string,
    currentItem: PortfolioItem,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
  ): Promise<string> {
    if (!this.isInitialized || !this.openai) {
      return this.getFallbackResponse(userMessage, currentItem);
    }

    try {
      const systemPrompt = `You are Kilah Oliver's AI assistant. Current project: "${currentItem.title}" - ${currentItem.category}. ${currentItem.description}. Contact: LinkedIn - https://www.linkedin.com/in/kilah-oliver-b4023a249/. Keep responses concise (2-3 sentences).`;

      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.map(msg => ({ role: msg.role, content: msg.content })),
        { role: 'user', content: userMessage }
      ];

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 200,
        temperature: 0.7,
      });

      return completion.choices[0]?.message?.content || this.getFallbackResponse(userMessage, currentItem);
      
    } catch (error) {
      console.error('❌ OpenAI API error:', error);
      return this.getFallbackResponse(userMessage, currentItem);
    }
  }

  private getFallbackResponse(userMessage: string, currentItem: PortfolioItem): string {
    const message = userMessage.toLowerCase();
    
    if (message.includes('contact') || message.includes('hire')) {
      return "Interested in working with Kilah? You can reach out to her on LinkedIn: <a href='https://www.linkedin.com/in/kilah-oliver-b4023a249/' target='_blank' rel='noopener noreferrer' class='text-purple-400 hover:text-purple-300 underline'>Kilah Oliver - LinkedIn</a>";
    }
    
    if (message.includes('this project') || message.includes(currentItem.title.toLowerCase())) {
      return `"${currentItem.title}" is a ${currentItem.category} project that demonstrates Kilah's expertise in ${currentItem.category.toLowerCase()} and visual storytelling.`;
    }
    
    const defaultResponses = [
      "That's a great question about Kilah's work! Her portfolio demonstrates incredible range across different industries.",
      "Kilah's creative process combines technical skill with authentic storytelling. What specific aspect interests you most?",
      "I love discussing Kilah's projects! Each one showcases her talent for making brands feel authentic and engaging."
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  isAvailable(): boolean {
    return this.isInitialized && this.openai !== null;
  }
}

const ChatBot: React.FC<ChatBotProps> = ({ currentItem }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openaiService] = useState(() => new OpenAIService());
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Hi! I'm Kilah's AI assistant. I can tell you about "${currentItem.title}" or any of her creative work. What would you like to know?`,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  console.log('Current item:', currentItem);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Update welcome message when portfolio item changes
  useEffect(() => {
    if (messages.length > 0) {
      const apiStatus = openaiService.isAvailable() ? '🤖 Real AI responses enabled' : '💡 Smart fallback responses (add API key for real AI)';
      
      const newWelcomeMessage = {
        id: Date.now(),
        text: `Now viewing "${currentItem.title}" - ${currentItem.category}. Ask me anything about this ${currentItem.category.toLowerCase()} project or Kilah's creative process! ${apiStatus}`,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [newWelcomeMessage, ...prev.slice(1)]);
      // Reset conversation history when switching projects
      setConversationHistory([]);
    }
  }, [currentItem.id]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      const aiResponseText = await openaiService.getChatResponse(
        currentInput,
        currentItem,
        conversationHistory
      );
      
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: aiResponseText,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
      // Update conversation history for context
      setConversationHistory(prev => [
        ...prev,
        { role: 'user' as const, content: currentInput },
        { role: 'assistant' as const, content: aiResponseText }
      ].slice(-10)); // Keep last 10 messages for context
      
    } catch (error) {
      console.error('Chat error:', error);
      const errorResponse: Message = {
        id: Date.now() + 1,
        text: "I'm having trouble connecting right now. Let me try a different approach to answer your question about Kilah's work!",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        >
          <MessageCircle className="w-6 h-6 text-white" />
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-pink-400 rounded-full animate-ping"></div>
          
          {/* Enhanced Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-black/90 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap border border-purple-500/30">
            <div className="font-semibold">Ask about this project</div>
            <div className="text-xs text-purple-300">Powered by AI</div>
          </div>
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-black/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-500/30 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Kilah's AI Assistant</h3>
                <p className="text-white/80 text-xs flex items-center gap-1">
                  Creative Portfolio Guide
                  {openaiService.isAvailable() && (
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[360px]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.isUser
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-gray-800 text-gray-100 border border-gray-700'
                  }`}
                >
                  {message.text.includes('<a href') ? (
                    <div 
                      className="text-sm leading-relaxed [&>a]:text-purple-400 [&>a]:hover:text-purple-300 [&>a]:underline [&>a]:transition-colors [&>a]:duration-200"
                      dangerouslySetInnerHTML={{ __html: message.text }}
                    />
                  ) : (
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  )}
                  <p className={`text-xs mt-1 ${message.isUser ? 'text-purple-100' : 'text-gray-400'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-800 border border-gray-700 p-3 rounded-2xl">
                  <div className="flex space-x-1 items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                    <span className="text-xs text-gray-400 ml-2">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Ask about "${currentItem.title}"...`}
                className="flex-1 bg-gray-800 border border-gray-600 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors duration-200"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform duration-200"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-500 text-center">
              {openaiService.isAvailable() ? 'Powered by OpenAI GPT-4' : 'Using smart fallback responses'}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot; 