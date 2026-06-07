import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Zap } from 'lucide-react';
import { useLang } from '../LangContext';

interface Message {
  id: number;
  text: string;
  sender: 'assistant' | 'user';
  time: string;
}

const DEFAULT_CONFIG = {
  enabled: true,
  name: 'DEMETRA_ASSISTANT',
  subtitle: 'SYSTEM_ONLINE // AI_CORE',
  phone: '+7 (700) 920-70-12',
  greeting: {
    ru: 'Здравствуйте! Я ваш индустриальный ассистент Деметра. Чем могу помочь?',
    kk: 'Сәлем! Мен сіздің Деметра индустриалды көмекшіңізбін. Қалай көмектесе аламын?',
    en: 'Hello! I am your Demetra industrial assistant. How can I help you?'
  },
  autoReply: {
    ru: 'Ваш запрос принят в обработку. Наши специалисты свяжутся с вами в ближайшее время или вы можете позвонить нам по номеру {{phone}} для срочной консультации.',
    kk: 'Сіздің сұранысыңыз өңдеуге қабылданды. Біздің мамандар жақын арада сізбен байланысады немесе шұғыл кеңес алу үшін {{phone}} нөміріне қоңырау шала аласыз.',
    en: 'Your request has been received. Our specialists will contact you shortly, or you can call us at {{phone}} for urgent consultation.'
  },
  faqs: [
    {
      q_ru: 'Как заказать аудит?', a_ru: 'Оставьте заявку в разделе контакты или позвоните нам.',
      q_kk: 'Аудитке қалай тапсырыс беруге болады?', a_kk: 'Байланыс бөлімінде өтінім қалдырыңыз немесе бізге қоңырау шалыңыз.',
      q_en: 'How to order an audit?', a_en: 'Leave a request in the contact section or call us.'
    },
    {
      q_ru: 'Сроки доставки комплектующих?', a_ru: 'От 3 до 14 рабочих дней в зависимости от региона.',
      q_kk: 'Жеткізу мерзімі қандай?', a_kk: 'Аймаққа байланысты 3-тен 14 жұмыс күніне дейін.',
      q_en: 'Delivery times?', a_en: 'From 3 to 14 business days depending on the region.'
    }
  ]
};

const getConfig = () => {
  try {
    const saved = localStorage.getItem('demetra_assistant_config');
    if (saved) return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
  } catch {}
  return DEFAULT_CONFIG;
};

export default function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { lang } = useLang();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [config, setConfig] = useState(getConfig);
  const [messages, setMessages] = useState<Message[]>([]);

  // Sync config from storage events (when admin saves)
  useEffect(() => {
    const sync = () => setConfig(getConfig());
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  // Initialize with greeting from config
  useEffect(() => {
    const greeting = config.greeting?.[lang as 'ru' | 'kk' | 'en'] || config.greeting?.ru || '';
    setMessages([
      {
        id: Date.now(),
        text: greeting,
        sender: 'assistant',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [lang, config.greeting?.ru]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (overrideText?: string) => {
    const text = overrideText ?? inputValue;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      text,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Check if text matches a FAQ question — return its answer
    const l = lang as 'ru' | 'kk' | 'en';
    const matchedFaq = config.faqs?.find((f: any) => {
      const q = f[`q_${l}`] || f.q_ru || '';
      return q.toLowerCase() === text.toLowerCase();
    });

    const rawReply = matchedFaq
      ? (matchedFaq[`a_${l}`] || matchedFaq.a_ru || '')
      : (config.autoReply?.[l] || config.autoReply?.ru || '');

    const replyText = rawReply.replace('{{phone}}', config.phone || '');

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          text: replyText,
          sender: 'assistant',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 900);
  };

  const faqs = (config.faqs || []).map((f: any) => ({
    q: f[`q_${lang}`] || f.q_ru || '',
    a: f[`a_${lang}`] || f.a_ru || ''
  }));

  // Don't render if disabled
  if (!config.enabled) return null;

  return (
    <div className="floating-assistant-container" style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999 }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 16, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 16 }}
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
                  <div style={{ fontWeight: '900', fontSize: '0.9rem', letterSpacing: '0.05em' }}>
                    {config.name || 'DEMETRA_ASSISTANT'}
                  </div>
                  <div style={{ fontSize: '0.6rem', fontWeight: '700', opacity: 0.7 }}>
                    {config.subtitle || 'SYSTEM_ONLINE // AI_CORE'}
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#000' }}>
                <X size={24} />
              </button>
            </div>

            {/* Chat Messages */}
            <div style={{ padding: '1.5rem', height: '360px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                    gap: '0.4rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.6rem', fontWeight: '800' }}>
                    {msg.sender === 'assistant' && <Zap size={9} color="var(--primary)" />}
                    {msg.sender.toUpperCase()} • {msg.time}
                  </div>
                  <div style={{
                    padding: '0.9rem 1rem',
                    borderRadius: msg.sender === 'assistant' ? '0 16px 16px 16px' : '16px 0 16px 16px',
                    background: msg.sender === 'assistant' ? 'rgba(255,255,255,0.03)' : 'var(--primary)',
                    color: msg.sender === 'assistant' ? 'var(--foreground)' : '#000',
                    fontSize: '0.875rem',
                    lineHeight: '1.55',
                    border: msg.sender === 'assistant' ? '1px solid var(--border)' : 'none',
                    fontWeight: msg.sender === 'user' ? '700' : '400'
                  }}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick FAQ Actions */}
            {faqs.length > 0 && (
              <div style={{ padding: '0 1.25rem 0.75rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {faqs.map((faq: { q: string; a: string }, i: number) => (
                  <button
                    key={i}
                    onClick={() => handleSend(faq.q)}
                    style={{ padding: '0.4rem 0.9rem', background: 'rgba(0,255,65,0.05)', border: '1px solid var(--border)', borderRadius: '20px', color: 'var(--primary)', fontSize: '0.68rem', fontWeight: '800', cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,255,65,0.12)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,255,65,0.05)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                  >
                    {faq.q}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.75rem', background: 'rgba(0,0,0,0.2)' }}>
              <input
                type="text"
                placeholder={lang === 'ru' ? 'Введите ваш вопрос...' : lang === 'kk' ? 'Сұрағыңызды енгізіңіз...' : 'Type your question...'}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '0.85rem 1rem', borderRadius: '12px', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
              />
              <button
                onClick={() => handleSend()}
                style={{ background: 'var(--primary)', color: '#000', border: 'none', padding: '0.85rem 1rem', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
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
              <X size={32} />
            </motion.div>
          ) : (
            <motion.div key="msg" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageSquare size={30} />
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
