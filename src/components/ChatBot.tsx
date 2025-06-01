import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

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

const ChatBot: React.FC<ChatBotProps> = ({ currentItem }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Hi! I'm Kilah's AI assistant. I can tell you about "${currentItem.title}" or any of her creative work. What would you like to know?`,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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
      setMessages(prev => [
        {
          id: Date.now(),
          text: `Now viewing "${currentItem.title}" - ${currentItem.category}. Ask me anything about this ${currentItem.category.toLowerCase()} project or Kilah's creative process!`,
          isUser: false,
          timestamp: new Date()
        },
        ...prev.slice(1)
      ]);
    }
  }, [currentItem.id]);

  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Context-aware responses about current portfolio item
    if (message.includes('this project') || message.includes('this video') || message.includes(currentItem.title.toLowerCase())) {
      const responses = {
        'tgi intro': "The TGI Intro showcases Kilah's mastery of brand storytelling. She uses dynamic transitions and bold visual elements to create an immediately engaging introduction that captures attention within the first few seconds.",
        'raleigh event': "This live event coverage demonstrates Kilah's ability to capture authentic moments and energy. She focuses on candid interactions and atmospheric shots that make viewers feel like they're part of the experience.",
        'open butterfly jewelry': "Kilah's approach to jewelry videography emphasizes intimate close-ups and elegant lighting. She creates a sense of luxury and craftsmanship through careful attention to reflections and textures.",
        'lucy lu\'s boutique': "For fashion retail, Kilah combines lifestyle storytelling with product showcase. She captures both the aspirational aspects of fashion and the authentic shopping experience.",
        'juicy vybz': "This lifestyle brand video shows Kilah's ability to capture authentic culture and energy. She uses vibrant colors and dynamic movement to reflect the brand's personality.",
        'calming candles aromatherapy': "Kilah creates a meditative viewing experience here, using soft lighting and slow, deliberate movements that mirror the calming nature of aromatherapy.",
        'a great day candle company': "This artisan showcase highlights Kilah's skill in documenting craftsmanship. She focuses on the hands-on process and attention to detail that goes into handmade products."
      };
      
      return responses[currentItem.title.toLowerCase()] || 
        `"${currentItem.title}" is a ${currentItem.category} project that ${currentItem.description.toLowerCase()}. Kilah's approach here emphasizes authentic storytelling and visual excellence.`;
    }
    
    // General portfolio questions
    if (message.includes('style') || message.includes('approach')) {
      return "Kilah's signature style combines cinematic storytelling with authentic brand representation. She focuses on capturing genuine moments while maintaining high production value and visual aesthetics.";
    }
    
    if (message.includes('technique') || message.includes('how')) {
      return "Kilah uses a combination of dynamic camera movements, thoughtful composition, and strategic lighting to create engaging visual narratives. She's particularly skilled at capturing both product details and lifestyle contexts.";
    }
    
    if (message.includes('experience') || message.includes('background')) {
      return "Kilah Oliver is a creative professional specializing in brand storytelling through video. Her portfolio spans commercial work, event coverage, lifestyle brands, and artisan showcases, demonstrating versatility across industries.";
    }
    
    if (message.includes('contact') || message.includes('hire') || message.includes('work')) {
      return "Interested in working with Kilah? Her diverse portfolio shows expertise in brand videos, event coverage, product showcases, and lifestyle content. Each project is approached with creativity and professional excellence.";
    }
    
    // Default responses
    const defaultResponses = [
      "That's a great question! Kilah's work really shines in how she combines technical skill with creative storytelling. What specific aspect interests you most?",
      "Kilah's portfolio demonstrates incredible range across different industries. Each project has its own unique approach while maintaining her signature style.",
      "I love discussing Kilah's creative process! She has a talent for making every brand feel authentic and engaging. What would you like to explore?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI typing delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: getAIResponse(inputText),
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
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
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-black/80 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Ask about this project
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
                <p className="text-white/80 text-xs">Creative Portfolio Guide</p>
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
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.isUser ? 'text-purple-100' : 'text-gray-400'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-800 border border-gray-700 p-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
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
                placeholder="Ask about this project..."
                className="flex-1 bg-gray-800 border border-gray-600 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform duration-200"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot; 