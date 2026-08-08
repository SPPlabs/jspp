'use client';

import { useState, useEffect, useRef } from 'react';
import { Bot, MessageSquare, Send, X, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { sendChatMessage } from '../lib/api';
import { getVisitorAndSessionIds } from '../lib/analytics';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '¡Hola! Soy el asistente virtual de JSPP.es. ¿En qué te puedo ayudar hoy?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const chatContainerRef = useRef(null);

  // Restore chat history from sessionStorage (Spec 03 requirement)
  useEffect(() => {
    try {
      const savedChat = sessionStorage.getItem('spp_chatbot_conversation_session');
      if (savedChat) {
        const parsed = JSON.parse(savedChat);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch (e) {
      // Ignore JSON parse errors
    }
  }, []);

  // Save chat history to sessionStorage on update
  useEffect(() => {
    try {
      sessionStorage.setItem('spp_chatbot_conversation_session', JSON.stringify(messages));
    } catch (e) {}
  }, [messages]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setErrorMessage('');

    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setLoading(true);

    const { visitorId } = getVisitorAndSessionIds();

    const result = await sendChatMessage({
      userMessage: userText,
      messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
      visitorId: visitorId || 'anonymous-visitor',
    });

    setLoading(false);

    if (result.success && result.reply) {
      setMessages((prev) => [...prev, { role: 'assistant', content: result.reply }]);
    } else {
      // Handle rate limit (429) or other API errors gracefully
      const errorMsg = result.message || 'Lo sentimos, la solicitud no pudo procesarse en este momento.';
      setErrorMessage(errorMsg);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ Error: ${errorMsg}`,
          isError: true,
        },
      ]);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[90vw] sm:w-96 h-[500px] max-h-[80vh] rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl flex flex-col overflow-hidden transition-all duration-300">
          {/* Chat Header */}
          <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                  Asistente IA <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                </h4>
                <p className="text-[11px] text-zinc-400">JSPP.es Support System</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-3 bg-zinc-900/50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/10'
                      : msg.isError
                      ? 'bg-red-950/60 border border-red-800/60 text-red-200 rounded-bl-none'
                      : 'bg-zinc-800 border border-zinc-700/60 text-zinc-200 rounded-bl-none'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-zinc-800 border border-zinc-700/60 px-3.5 py-2.5 rounded-2xl rounded-bl-none text-xs text-zinc-400 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  <span>Procesando respuesta...</span>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSend} className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu consulta..."
              disabled={loading}
              className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all shadow-md shadow-indigo-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <>
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs">Chat Asistente</span>
          </>
        )}
      </button>
    </div>
  );
}
