
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenAI, Chat } from "@google/genai";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: 'مرحباً بك في شباب فور إرشاد! 🌟\nأنا مرشدك الذكي، كيف يمكنني مساعدتك اليوم؟ يمكننا التحدث عن الجمعية، العمل التطوعي، أو أي موضوع يهمك.',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<Chat | null>(null);

  // Initialize Gemini Chat Session
  // Fix: Strictly following the @google/genai SDK guidelines for initialization
  useEffect(() => {
    const initChat = async () => {
      try {
        // As per guidelines: Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
        // and assume the variable is pre-configured and accessible.
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        chatSessionRef.current = ai.chats.create({
          model: 'gemini-3-flash-preview',
          config: {
            systemInstruction: `أنت مساعد ذكي ومحفز للشباب تابع لجمعية "شباب فور إرشاد".
            شخصيتك: ودود، حكيم، محفز، وتتحدث بأسلوب شبابي راقٍ ومحترم.
            مهامك:
            1. الإجابة عن أسئلة حول الجمعية (التسجيل، الأهداف، الرؤية) بناءً على المعلومات العامة للجمعيات الشبانية.
            2. تقديم نصائح عامة للشباب في مجالات: تطوير الذات، أهمية التطوع، القيادة، والمهارات الحياتية.
            3. لا تقتصر إجاباتك على محتوى الموقع فقط، بل كن موسوعة معرفية مفيدة للشباب.
            4. تحدث دائماً باللغة العربية.`,
          },
        });
      } catch (error) {
        console.error("Error initializing AI:", error);
      }
    };
    
    initChat();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      if (!chatSessionRef.current) {
        // Fix: Ensure we use process.env.API_KEY as per guidelines if re-initialization is needed
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        chatSessionRef.current = ai.chats.create({
          model: 'gemini-3-flash-preview',
          config: {
            systemInstruction: 'أنت مساعد ذكي ومحفز للشباب تابع لجمعية "شباب فور إرشاد". تحدث دائماً باللغة العربية.',
          },
        });
      }

      // As per guidelines: Accessing the .text property directly from the response (not calling it as a method)
      const result = await chatSessionRef.current.sendMessage({ message: userMsg.text });
      const responseText = result.text;

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText || "عذراً، لم أتمكن من الرد حالياً.",
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: "حدث خطأ في الاتصال، يرجى المحاولة لاحقاً.",
        sender: 'ai',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {/* Chat Window */}
      <div 
        className={`absolute bottom-20 right-0 w-[350px] max-w-[calc(100vw-48px)] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 origin-bottom-right transform ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7e1d51] to-[#b92b72] p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
              <Bot size={20} className="text-[#fcd34d]" />
            </div>
            <div>
              <h3 className="font-bold text-sm">مساعد الإرشاد</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#fcd34d] rounded-full animate-pulse"></span>
                <span className="text-[10px] opacity-80">متصل (Online)</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="h-[400px] overflow-y-auto p-4 bg-[#f8f9fa] space-y-4 scrollbar-thin">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex items-start gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === 'user' ? 'bg-[#7e1d51] text-white' : 'bg-white border border-gray-200 text-[#7e1d51]'
              }`}>
                {msg.sender === 'user' ? <User size={14} /> : <Sparkles size={14} />}
              </div>
              <div 
                className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-[#7e1d51] text-white rounded-tr-none' 
                    : 'bg-white border border-gray-100 text-gray-700 shadow-sm rounded-tl-none'
                }`}
              >
                {msg.text.split('\n').map((line, i) => (
                  <p key={i} className="mb-1 last:mb-0">{line}</p>
                ))}
                <span className={`text-[9px] block mt-1 ${msg.sender === 'user' ? 'text-white/60' : 'text-gray-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center">
                 <Bot size={14} className="text-[#7e1d51]" />
              </div>
              <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white border-t border-gray-100">
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 focus-within:border-[#7e1d51] focus-within:ring-1 focus-within:ring-[#7e1d51]/20 transition-all">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="اكتب رسالتك هنا..."
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
              disabled={isTyping}
            />
            <button 
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className={`p-2 rounded-lg transition-all ${
                inputValue.trim() && !isTyping
                  ? 'bg-[#7e1d51] text-white shadow-md hover:bg-[#5e153b]' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isTyping ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className={document.dir === 'rtl' ? 'rotate-180' : ''} />}
            </button>
          </div>
          <div className="text-center mt-2">
             <p className="text-[9px] text-gray-400">الذكاء الاصطناعي قد يخطئ أحياناً. تأكد من المعلومات.</p>
          </div>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 ${
          isOpen 
            ? 'bg-gray-200 text-gray-600 rotate-90' 
            : 'bg-gradient-to-r from-[#7e1d51] to-[#fcd34d] text-white animate-pulse-glow'
        }`}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} fill="currentColor" className="text-white" />}
      </button>
    </div>
  );
};

export default AIChatBot;
