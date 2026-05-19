import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, HelpCircle, ChevronRight, Zap, ShieldCheck, Truck, User } from 'lucide-react';
import { useLang } from '../LangContext';

interface Message {
  id: number;
  text: string;
  sender: 'assistant' | 'user';
  time: string;
}

export default function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { lang } = useLang();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);

  // Initialize with greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: Date.now(),
          text: lang === 'ru' ? 'Здравствуйте! Я ваш индустриальный ассистент Деметра. Чем могу помочь?' : lang === 'kk' ? 'Сәлем! Мен сіздің Деметра индустриалды көмекшіңізбін. Қалай көмектесе аламын?' : 'Hello! I am your Demetra industrial assistant. How can I help you?',
          sender: 'assistant',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [lang]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Auto-responder logic
    setTimeout(() => {
      const assistantMsg: Message = {
        id: Date.now() + 1,
        text: lang === 'ru' 
          ? 'Ваш запрос принят в обработку. Наши специалисты свяжутся с вами в ближайшее время или вы можете позвонить нам по номеру +7 (700) 920-70-12 для срочной консультации.' 
          : lang === 'kk' 
          ? 'Сіздің сұранысыңыз өңдеуге қабылданды. Біздің мамандар жақын арада сізбен байланысады немесе шұғыл кеңес алу үшін +7 (700) 920-70-12 нөміріне қоңырау шала аласыз.' 
          : 'Your request has been received. Our specialists will contact you shortly, or you can call us at +7 (700) 920-70-12 for urgent consultation.',
        sender: 'assistant',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    }, 1500);
  };

  const faqs = [
    { 
      q: lang === 'ru' ? 'Как заказать аудит?' : lang === 'kk' ? 'Аудитке қалай тапсырыс беруге болады?' : 'How to order an audit?', 
      a: lang === 'ru' ? 'Оставьте заявку в разделе контакты или позвоните нам.' : lang === 'kk' ? 'Байланыс бөлімінде өтінім қалдырыңыз немесе бізге қоңырау шалыңыз.' : 'Leave a request in the contact section or call us.' 
    },
    { 
      q: lang === 'ru' ? 'Сроки доставки комплектующих?' : lang === 'kk' ? 'Жеткізу мерзімі қандай?' : 'Delivery times?', 
      a: lang === 'ru' ? 'От 3 до 14 рабочих дней в зависимости от региона.' : lang === 'kk' ? 'Аймаққа байланысты 3-тен 14 жұмыс күніне дейін.' : 'From 3 to 14 business days depending on the region.' 
    }
  ];

  return (
    <div className="floating-assistant-container" style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999 }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            style={{
              position: 'absolute',
              bottom: '5.5rem',
              right: 0,
              width: '400px',
              background: 'var(--surface)',
              border: '1px solid var(--primary)',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 30px var(--primary-glow)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Header */}
            <div style={{ background: 'var(--primary)', padding: '1.5rem', color: '#000', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: '#000', padding: '0.5rem', borderRadius: '12px' }}>
                  <Zap size={20} color="var(--primary)" />
                </div>
                <div>
                  <div style={{ fontWeight: '900', fontSize: '0.9rem', letterSpacing: '0.05em' }}>DEMETRA_ASSISTANT</div>
                  <div style={{ fontSize: '0.6rem', fontWeight: '700', opacity: 0.7 }}>SYSTEM_ONLINE // AI_CORE</div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#000' }}>
                <X size={24} />
              </button>
            </div>

            {/* Chat Messages */}
            <div style={{ padding: '1.5rem', height: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.sender === 'assistant' ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{
                    alignSelf: msg.sender === 'assistant' ? 'flex-start' : 'flex-end',
                    maxWidth: '85%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.sender === 'assistant' ? 'flex-start' : 'flex-end',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.6rem', fontWeight: '800' }}>
                    {msg.sender === 'assistant' && <Zap size={10} color="var(--primary)" />}
                    {msg.sender.toUpperCase()} • {msg.time}
                  </div>
                  <div style={{
                    padding: '1rem',
                    borderRadius: msg.sender === 'assistant' ? '0 16px 16px 16px' : '16px 0 16px 16px',
                    background: msg.sender === 'assistant' ? 'rgba(255,255,255,0.03)' : 'var(--primary)',
                    color: msg.sender === 'assistant' ? 'var(--foreground)' : '#000',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    border: msg.sender === 'assistant' ? '1px solid var(--border)' : 'none',
                    fontWeight: msg.sender === 'user' ? '700' : '400'
                  }}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div style={{ padding: '0 1.5rem 1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {faqs.map((faq, i) => (
                <button 
                  key={i}
                  onClick={() => {
                    setInputValue(faq.q);
                    // handleSend() would need to be called, but we'll let the user click send or just auto-fill
                  }}
                  style={{ padding: '0.5rem 1rem', background: 'rgba(0,255,65,0.05)', border: '1px solid var(--border)', borderRadius: '20px', color: 'var(--primary)', fontSize: '0.7rem', fontWeight: '800', cursor: 'pointer' }}
                >
                  {faq.q}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.75rem', background: 'rgba(0,0,0,0.2)' }}>
              <input 
                type="text" 
                placeholder={lang === 'ru' ? 'Введите ваш вопрос...' : lang === 'kk' ? 'Сұрағыңызды енгізіңіз...' : 'Type your question...'} 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '1rem', borderRadius: '12px', color: '#fff', fontSize: '0.9rem' }} 
              />
              <button 
                onClick={handleSend}
                style={{ background: 'var(--primary)', color: '#000', border: 'none', padding: '1rem', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Send size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1, boxShadow: '0 0 40px var(--primary-glow)' }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '4.5rem',
          height: '4.5rem',
          borderRadius: '50%',
          background: 'var(--primary)',
          color: '#000',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 30px var(--primary-glow)',
          position: 'relative'
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={36} />
            </motion.div>
          ) : (
            <motion.div key="msg" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageSquare size={36} />
              <motion.div 
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{ position: 'absolute', top: 0, right: 0, width: '14px', height: '14px', background: '#fff', borderRadius: '50%', border: '3px solid var(--primary)' }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
