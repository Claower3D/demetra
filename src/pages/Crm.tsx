import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, BarChart3, MessageSquare, Shield, 
  Search, Plus, Trash2, Edit3, CheckCircle2, 
  X, LogOut, ArrowRight, Download, DollarSign, 
  TrendingUp, RefreshCw, Send, User, ShieldAlert,
  Phone, Mail, Calendar, FileText, Check, AlertCircle, Play,
  LayoutDashboard, Package, Truck, Globe, Settings, Image as ImageIcon, Menu
} from 'lucide-react';
import Admin from './Admin';

// CRM Lead interface matching Go backend
interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  status: 'new' | 'processing' | 'dozhim' | 'manager_op' | 'rop' | 'financier' | 'completed' | 'rejected';
  created_at: string;
  amount: number;
  source: string;
  assigned_to: string;
  comments: string;
  city?: string;
  category?: string;
  product?: string;
  address?: string;
  cost_price?: number;
  extra_expense?: number;
  master_commission?: number;
  bank_commission?: number;
  installment_commission?: number;
  prepayment?: number;
  intermediate_payment?: number;
  is_shift_ended?: boolean;
}

const catalogCategories = [
  'Конвейерные ленты',
  'Стыковка и ремонт',
  'Футеровка барабанов',
  'Запасные части конвейера',
  'Очистители лент'
];

const catalogProducts: Record<string, string[]> = {
  'Конвейерные ленты': [
    'Лента резинотканевая многопрокладочная ГОСТ 20-85',
    'Лента шевронная рифленая (Chevron)',
    'Лента шахтная трудногорючая (1.2Ш / 2Ш)',
    'Лента теплостойкая (до 200°С)',
    'Лента морозостойкая (до -60°С)'
  ],
  'Сстыковка и ремонт': [
    'Метод горячей вулканизации',
    'Метод холодной вулканизации (клей TRS-2002)',
    'Механические соединители (заклепочные / болтовые)',
    'Ремонт продольных порезов полотна'
  ],
  'Стыковка и ремонт': [
    'Метод горячей вулканизации',
    'Метод холодной вулканизации (клей TRS-2002)',
    'Механические соединители (заклепочные / болтовые)',
    'Ремонт продольных порезов полотна'
  ],
  'Футеровка барабанов': [
    'Резиновая футеровка с ромбовидным профилем',
    'Резинокерамическая футеровка (повышенный износ)',
    'Футеровка полиуретановыми пластинами',
    'Напыляемая футеровка барабанов'
  ],
  'Запасные части конвейера': [
    'Ролики конвейерные (демпфирующие / амортизирующие)',
    'Роликоопоры (желобчатые / плоские / центрирующие)',
    'Барабаны приводные и натяжные',
    'Муфты соединительные и мотор-редукторы'
  ],
  'Очистители лент': [
    'Первичный грубый очиститель ленты (скребок H-типа)',
    'Вторичный тонкий очиститель ленты (полиуретановый)',
    'Плужковый очиститель внутренней ветви',
    'Скребки полиуретановые запасные'
  ]
};


// CRM User interface matching Go backend
interface CRMUser {
  id: string;
  name: string;
  role: 'admin' | 'manager' | 'specialist' | 'auditor';
  status: 'active' | 'inactive';
  email: string;
  avatar: string;
}

// CRM Chat interface
interface ChatMessage {
  sender: 'client' | 'operator';
  text: string;
  timestamp: string;
}

interface CRMChat {
  id: string;
  client_phone: string;
  client_name: string;
  messages: ChatMessage[];
}

export interface CRMRolePermission {
  role: 'admin' | 'manager' | 'specialist' | 'auditor';
  allowed_tabs: ('dashboard' | 'analytics' | 'leads' | 'clients' | 'chats' | 'users' | 'accounting' | 'products' | 'services' | 'builder' | 'content' | 'pages' | 'settings' | 'assistant')[];
}

export default function Crm() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('demetra_crm_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeSection, setActiveSection] = useState<'dashboard' | 'analytics' | 'leads' | 'clients' | 'chats' | 'users' | 'accounting' | 'products' | 'services' | 'builder' | 'content' | 'pages' | 'settings' | 'assistant'>(() => {
    const saved = localStorage.getItem('demetra_crm_current_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        return u.role === 'admin' ? 'dashboard' : 'analytics';
      } catch (e) {}
    }
    return 'dashboard';
  });
  
  // Data States
  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<CRMUser[]>([]);
  const [chats, setChats] = useState<CRMChat[]>([]);
  const [permissions, setPermissions] = useState<CRMRolePermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // View States
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban');
  const [usersSubTab, setUsersSubTab] = useState<'employees' | 'permissions'>('employees');

  // Accounting State
  const [accOrderNumber, setAccOrderNumber] = useState('001');
  const [accDate, setAccDate] = useState(new Date().toISOString().split('T')[0]);
  const [accClientName, setAccClientName] = useState('');
  const [accClientBin, setAccClientBin] = useState('');
  const [accService, setAccService] = useState('');
  const [accQuantity, setAccQuantity] = useState(1);
  const [accPriceWithoutVat, setAccPriceWithoutVat] = useState(50000);
  const [accPaymentMethod, setAccPaymentMethod] = useState('безналичные');
  const [accResult, setAccResult] = useState<{ pdf: string; csv: string } | null>(null);
  const [accLoading, setAccLoading] = useState(false);
  const [accError, setAccError] = useState('');

  // Responsive States
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setIsSidebarOpen(windowWidth >= 1024);
  }, [windowWidth]);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [analyticsPeriod, setAnalyticsPeriod] = useState<'today' | 'week' | 'month' | 'all'>('all');

  // Modal / Form States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Local edit states for the extended lead edit modal
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCity, setEditCity] = useState('Астана');
  const [editCategory, setEditCategory] = useState('');
  const [editProduct, setEditProduct] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editComments, setEditComments] = useState('');
  const [editPrice, setEditPrice] = useState(0);
  const [editCostPrice, setEditCostPrice] = useState(0);
  const [editExtraExpense, setEditExtraExpense] = useState(0);
  const [editMasterCommission, setEditMasterCommission] = useState(0);
  const [editBankCommission, setEditBankCommission] = useState(0);
  const [editInstallmentCommission, setEditInstallmentCommission] = useState(0);
  const [editPrepayment, setEditPrepayment] = useState(0);
  const [editIntermediatePayment, setEditIntermediatePayment] = useState(0);
  const [isShiftEnded, setIsShiftEnded] = useState(false);
  const [newChatComment, setNewChatComment] = useState('');
  const [editStatus, setEditStatus] = useState<Lead['status']>('new');
  const [editAssignedTo, setEditAssignedTo] = useState('');

  useEffect(() => {
    if (selectedLead) {
      setEditName(selectedLead.name || '');
      setEditPhone(selectedLead.phone || '');
      setEditCity(selectedLead.city || 'Астана');
      const cat = selectedLead.category || catalogCategories[0];
      setEditCategory(cat);
      setEditProduct(selectedLead.product || (catalogProducts[cat] && catalogProducts[cat][0]) || '');
      setEditAddress(selectedLead.address || '');
      setEditComments(selectedLead.comments || '');
      setEditPrice(selectedLead.amount || 0);
      setEditCostPrice(selectedLead.cost_price || 0);
      setEditExtraExpense(selectedLead.extra_expense || 0);
      setEditMasterCommission(selectedLead.master_commission || 0);
      setEditBankCommission(selectedLead.bank_commission || 0);
      setEditInstallmentCommission(selectedLead.installment_commission || 0);
      setEditPrepayment(selectedLead.prepayment || 0);
      setEditIntermediatePayment(selectedLead.intermediate_payment || 0);
      setIsShiftEnded(selectedLead.is_shift_ended || false);
      setNewChatComment('');
      setEditStatus(selectedLead.status || 'new');
      setEditAssignedTo(selectedLead.assigned_to || '');
    }
  }, [selectedLead]);
  
  // Chat Active State
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatMessageInput, setChatMessageInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Current logged in user
  const [currentUser, setCurrentUser] = useState<CRMUser>(() => {
    const saved = localStorage.getItem('demetra_crm_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      id: 'user_1',
      name: 'Администратор',
      role: 'admin',
      status: 'active',
      email: 'admin@demetra.kz',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    };
  });

  // Password validation
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'admin' || passwordInput === 'demetra2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem('demetra_crm_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Неверный пароль. Попробуйте еще раз.');
      setPasswordInput('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('demetra_crm_auth');
    setPasswordInput('');
  };

  // Fetch all CRM data
  const fetchData = async () => {
    setLoading(true);
    try {
      const leadsRes = await fetch('/api/crm/leads');
      if (leadsRes.ok) {
        const leadsData = await leadsRes.json();
        setLeads(leadsData || []);
      }

      const usersRes = await fetch('/api/crm/users');
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData || []);
      }

      const chatsRes = await fetch('/api/crm/chats');
      if (chatsRes.ok) {
        const chatsData = await chatsRes.json();
        setChats(chatsData || []);
        if (chatsData && chatsData.length > 0 && !activeChatId) {
          setActiveChatId(chatsData[0].id);
        }
      }

      const permissionsRes = await fetch('/api/crm/permissions');
      if (permissionsRes.ok) {
        const permissionsData = await permissionsRes.json();
        setPermissions(permissionsData || []);
      }
    } catch (err) {
      console.warn('Backend API not responding, using localStorage or mock data', err);
      loadMockData();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Mock data fallbacks if backend fails
  const loadMockData = () => {
    const savedLeads = localStorage.getItem('demetra_mock_leads');
    if (savedLeads) {
      setLeads(JSON.parse(savedLeads));
    } else {
      const mockLeads: Lead[] = [
        {
          id: 'lead_1',
          name: 'Илья Соколов',
          phone: '+7 (701) 555-01-23',
          email: 's_ilya@mail.ru',
          message: 'Нужен расчет стоимости конвейерной ленты 1200мм для шахты им. Костенко. Длина 300 метров.',
          status: 'new',
          created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
          amount: 0,
          source: 'Форма контактов',
          assigned_to: 'Светлана Иванова',
          comments: 'Связаться в течение дня, подготовить предварительный опросный лист.',
        },
        {
          id: 'lead_2',
          name: 'Арман Сабитов',
          phone: '+7 (777) 123-45-67',
          email: 'arman@demetra.kz',
          message: 'Заказ на стыковку резинотканевой ленты методом горячей вулканизации. Срочно!',
          status: 'processing',
          created_at: new Date(Date.now() - 26 * 3600000).toISOString(),
          amount: 450000,
          source: 'Баннер обратной связи',
          assigned_to: 'Ербол Маратов',
          comments: 'Бригада выехала на замеры. Договор на стадии подписания.',
        },
        {
          id: 'lead_3',
          name: 'Алина Рахимова',
          phone: '+7 (705) 987-65-43',
          email: 'alina.r@gmail.com',
          message: 'Интересует резинокерамическая футеровка приводных барабанов для предотвращения проскальзывания ленты.',
          status: 'completed',
          created_at: new Date(Date.now() - 74 * 3600000).toISOString(),
          amount: 820000,
          source: 'Заявка из каталога',
          assigned_to: 'Ербол Маратов',
          comments: 'Работы успешно завершены. Акт выполненных работ подписан заказчиком.',
        },
        {
          id: 'lead_4',
          name: 'Дмитрий Воронов',
          phone: '+7 (700) 111-22-33',
          email: 'voronov@promtech.kz',
          message: 'Поставка конвейерных роликов HDPE 250 шт по чертежам заказчика.',
          status: 'completed',
          created_at: new Date(Date.now() - 120 * 3600000).toISOString(),
          amount: 1250000,
          source: 'Форма контактов',
          assigned_to: 'Светлана Иванова',
          comments: 'Оплата получена 100%. Ролики отгружены со склада, доставка завершена.',
        },
        {
          id: 'lead_5',
          name: 'Сакен Нуртаев',
          phone: '+7 (707) 333-44-55',
          email: 'saken@nurtas.kz',
          message: 'Запрос прайс-листа на полимерные ролики и амортизирующие станции.',
          status: 'rejected',
          created_at: new Date(Date.now() - 140 * 3600000).toISOString(),
          amount: 0,
          source: 'Форма контактов',
          assigned_to: 'Светлана Иванова',
          comments: 'Не устраивают сроки поставки. Ушли к конкурентам.',
        }
      ];
      setLeads(mockLeads);
      localStorage.setItem('demetra_mock_leads', JSON.stringify(mockLeads));
    }

    const savedUsers = localStorage.getItem('demetra_mock_users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      const mockUsers: CRMUser[] = [
        { id: 'user_1', name: 'Администратор', role: 'admin', status: 'active', email: 'admin@demetra.kz', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
        { id: 'user_2', name: 'Светлана Иванова', role: 'manager', status: 'active', email: 'ivanova@demetra.kz', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80' },
        { id: 'user_3', name: 'Ербол Маратов', role: 'specialist', status: 'active', email: 'maratov@demetra.kz', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
        { id: 'user_4', name: 'Виктор Ким', role: 'auditor', status: 'inactive', email: 'kim@demetra.kz', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' }
      ];
      setUsers(mockUsers);
      localStorage.setItem('demetra_mock_users', JSON.stringify(mockUsers));
    }

    const savedChats = localStorage.getItem('demetra_mock_chats');
    if (savedChats) {
      setChats(JSON.parse(savedChats));
      const parsed = JSON.parse(savedChats);
      if (parsed.length > 0 && !activeChatId) {
        setActiveChatId(parsed[0].id);
      }
    } else {
      const mockChats: CRMChat[] = [
        {
          id: 'chat_1',
          client_phone: '+7 (701) 555-01-23',
          client_name: 'Илья Соколов',
          messages: [
            { sender: 'client', text: 'Здравствуйте! Скажите, пожалуйста, сколько времени займет изготовление ленты шириной 1200 мм?', timestamp: new Date(Date.now() - 7200000).toISOString() },
            { sender: 'operator', text: 'Добрый день, Илья! Обычно изготовление и нарезка занимают от 3 до 5 рабочих дней.', timestamp: new Date(Date.now() - 6300000).toISOString() },
            { sender: 'client', text: 'Отлично, а доставка до Балхаша возможна?', timestamp: new Date(Date.now() - 5400000).toISOString() },
            { sender: 'operator', text: 'Да, конечно. Мы отправляем продукцию по всему Казахстану. Можем включить доставку в общий счет.', timestamp: new Date(Date.now() - 4500000).toISOString() },
            { sender: 'client', text: 'Тогда жду коммерческое предложение на почту.', timestamp: new Date(Date.now() - 3600000).toISOString() }
          ]
        },
        {
          id: 'chat_2',
          client_phone: '+7 (777) 123-45-67',
          client_name: 'Арман Сабитов',
          messages: [
            { sender: 'client', text: 'Приветствую! Нам нужен срочный ремонт ленты. Порвалась на стыке.', timestamp: new Date(Date.now() - 93600000).toISOString() },
            { sender: 'operator', text: 'Здравствуйте, Арман! Заявку принял. Выслал бригаду вулканизаторщиков Ербола Маратова. Будут у вас через 2 часа.', timestamp: new Date(Date.now() - 92400000).toISOString() },
            { sender: 'client', text: 'Спасибо за оперативность! Ждем.', timestamp: new Date(Date.now() - 92000000).toISOString() }
          ]
        }
      ];
      setChats(mockChats);
      localStorage.setItem('demetra_mock_chats', JSON.stringify(mockChats));
      if (mockChats.length > 0) {
        setActiveChatId(mockChats[0].id);
      }
    }

    const savedPermissions = localStorage.getItem('demetra_mock_permissions');
    if (savedPermissions) {
      try {
        const parsed = JSON.parse(savedPermissions);
        const updated = parsed.map((p: any) => {
          if (!p.allowed_tabs.includes('accounting')) {
            if (p.role === 'admin' || p.role === 'manager' || p.role === 'auditor') {
              return { ...p, allowed_tabs: [...p.allowed_tabs, 'accounting'] };
            }
          }
          return p;
        });
        setPermissions(updated);
        localStorage.setItem('demetra_mock_permissions', JSON.stringify(updated));
      } catch (e) {
        localStorage.removeItem('demetra_mock_permissions');
      }
    } else {
      const mockPermissions: CRMRolePermission[] = [
        { role: 'admin', allowed_tabs: ['analytics', 'leads', 'clients', 'chats', 'users', 'accounting'] },
        { role: 'manager', allowed_tabs: ['analytics', 'leads', 'clients', 'chats', 'accounting'] },
        { role: 'specialist', allowed_tabs: ['leads', 'chats'] },
        { role: 'auditor', allowed_tabs: ['analytics', 'leads', 'accounting'] }
      ];
      setPermissions(mockPermissions);
      localStorage.setItem('demetra_mock_permissions', JSON.stringify(mockPermissions));
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chats, activeChatId, activeSection]);

  // Save changes to backend or fallback localStorage
  const saveLeadsData = async (updatedLeads: Lead[]) => {
    setLeads(updatedLeads);
    localStorage.setItem('demetra_mock_leads', JSON.stringify(updatedLeads));
    try {
      await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedLeads)
      });
    } catch (e) {
      console.warn("Backend save failed, saved to local state only.");
    }
  };

  const saveUsersData = async (updatedUsers: CRMUser[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('demetra_mock_users', JSON.stringify(updatedUsers));
    try {
      await fetch('/api/crm/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUsers)
      });
    } catch (e) {
      console.warn("Backend save failed, saved to local state only.");
    }
  };

  const saveChatsData = async (updatedChats: CRMChat[]) => {
    setChats(updatedChats);
    localStorage.setItem('demetra_mock_chats', JSON.stringify(updatedChats));
    try {
      await fetch('/api/crm/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedChats)
      });
    } catch (e) {
      console.warn("Backend save failed, saved to local state only.");
    }
  };

  const savePermissionsData = async (updatedPermissions: CRMRolePermission[]) => {
    setPermissions(updatedPermissions);
    localStorage.setItem('demetra_mock_permissions', JSON.stringify(updatedPermissions));
    try {
      await fetch('/api/crm/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPermissions)
      });
    } catch (e) {
      console.warn("Backend save failed, saved to local state only.");
    }
  };

  // Lead status updates
  const handleUpdateLeadStatus = (
    leadId: string, 
    status: 'new' | 'processing' | 'dozhim' | 'manager_op' | 'rop' | 'financier' | 'completed' | 'rejected', 
    amount?: number, 
    comments?: string, 
    assignedTo?: string
  ) => {
    const updated = leads.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          status,
          amount: amount !== undefined ? amount : l.amount,
          comments: comments !== undefined ? comments : l.comments,
          assigned_to: assignedTo !== undefined ? assignedTo : l.assigned_to
        };
      }
      return l;
    });
    saveLeadsData(updated);
    setIsEditModalOpen(false);
  };

  const handleUpdateLead = (leadId: string, updatedLeadData: Partial<Lead>) => {
    const updated = leads.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          ...updatedLeadData
        };
      }
      return l;
    });
    saveLeadsData(updated);
    setIsEditModalOpen(false);
  };

  const handleDeleteLead = (leadId: string) => {
    if (window.confirm('Вы действительно хотите удалить эту заявку?')) {
      const updated = leads.filter(l => l.id !== leadId);
      saveLeadsData(updated);
    }
  };

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('text/plain', leadId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, stageId: any) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('text/plain');
    if (leadId) {
      const targetLead = leads.find(l => l.id === leadId);
      if (targetLead) {
        handleUpdateLeadStatus(leadId, stageId, targetLead.amount, targetLead.comments, targetLead.assigned_to);
      }
    }
  };

  const handleAddLeadSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newLead: Lead = {
      id: `lead_${Date.now()}`,
      name: formData.get('name') as string || 'Новый клиент',
      phone: formData.get('phone') as string || '',
      email: formData.get('email') as string || '',
      message: formData.get('message') as string || '',
      status: 'new',
      created_at: new Date().toISOString(),
      amount: parseFloat(formData.get('amount') as string) || 0,
      source: formData.get('source') as string || 'Ручной ввод',
      assigned_to: formData.get('assigned_to') as string || 'Светлана Иванова',
      comments: formData.get('comments') as string || '',
    };

    const updated = [newLead, ...leads];
    saveLeadsData(updated);
    setIsAddModalOpen(false);

    // Also auto-add a chat thread for this client if phone is provided
    if (newLead.phone) {
      const phoneExists = chats.some(c => c.client_phone === newLead.phone);
      if (!phoneExists) {
        const newChat: CRMChat = {
          id: `chat_${Date.now()}`,
          client_phone: newLead.phone,
          client_name: newLead.name,
          messages: [
            { sender: 'client', text: `Создана заявка вручную: ${newLead.source}`, timestamp: new Date().toISOString() }
          ]
        };
        saveChatsData([newChat, ...chats]);
      }
    }
  };

  // Client list helper
  const getClientsList = () => {
    const clientsMap: Record<string, { name: string, phone: string, email: string, totalOrders: number, totalSpent: number, status: string, notes: string }> = {};

    leads.forEach(l => {
      const key = l.phone || l.email || l.name;
      if (!clientsMap[key]) {
        clientsMap[key] = {
          name: l.name,
          phone: l.phone,
          email: l.email,
          totalOrders: 0,
          totalSpent: 0,
          status: 'Новый',
          notes: l.comments
        };
      }
      clientsMap[key].totalOrders += 1;
      if (l.status === 'completed') {
        clientsMap[key].totalSpent += l.amount;
      }
    });

    return Object.values(clientsMap).map(c => {
      let status = 'Новый';
      if (c.totalSpent > 1000000) status = 'V.I.P.';
      else if (c.totalSpent > 0) status = 'Постоянный';
      else if (c.totalOrders > 1) status = 'Потенциальный';
      return { ...c, status };
    });
  };

  // Message Send in Chat
  const handleSendMessage = () => {
    if (!chatMessageInput.trim() || !activeChatId) return;

    const updatedChats = chats.map(c => {
      if (c.id === activeChatId) {
        const userMsg: ChatMessage = {
          sender: 'operator',
          text: chatMessageInput,
          timestamp: new Date().toISOString()
        };

        const replyTrigger = setTimeout(() => {
          simulateClientReply(c.id, c.client_name);
        }, 1500);

        return {
          ...c,
          messages: [...c.messages, userMsg]
        };
      }
      return c;
    });

    saveChatsData(updatedChats);
    setChatMessageInput('');
  };

  // Simulate client replies for immersive UI
  const simulateClientReply = (chatId: string, clientName: string) => {
    const replies = [
      "Хорошо, спасибо большое! Жду коммерческое предложение на почту.",
      "Понял вас, сейчас отправлю чертежи и размеры на ваш email.",
      "Отличная новость! Согласуем договор и готовы оплатить счет.",
      "Спасибо, Ербол связывался со мной. Мы уже обсуждаем детали монтажа конвейерной ленты.",
      "Подскажите, а возможна оплата в рассрочку для юрлиц?",
      "Принято. Мы подготовим площадку к приезду вашей бригады вулканизаторщиков."
    ];
    const randomReply = replies[Math.floor(Math.random() * replies.length)];

    setChats(prevChats => {
      const updated = prevChats.map(c => {
        if (c.id === chatId) {
          return {
            ...c,
            messages: [
              ...c.messages,
              {
                sender: 'client' as const,
                text: randomReply,
                timestamp: new Date().toISOString()
              }
            ]
          };
        }
        return c;
      });
      localStorage.setItem('demetra_mock_chats', JSON.stringify(updated));
      return updated;
    });
  };

  // User Role Management
  const handleUpdateUserRole = (userId: string, role: 'admin' | 'manager' | 'specialist' | 'auditor') => {
    if (currentUser.role !== 'admin') {
      alert('Ошибка: Выдавать роли может только Администратор.');
      return;
    }
    const updated = users.map(u => {
      if (u.id === userId) {
        return { ...u, role };
      }
      return u;
    });
    saveUsersData(updated);
  };

  const handleToggleUserStatus = (userId: string) => {
    if (currentUser.role !== 'admin') {
      alert('Ошибка: Управлять статусом пользователей может только Администратор.');
      return;
    }
    const updated = users.map(u => {
      if (u.id === userId) {
        return { ...u, status: (u.status === 'active' ? 'inactive' : 'active') as 'active' | 'inactive' };
      }
      return u;
    });
    saveUsersData(updated);
  };

  const handleAddCrmUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentUser.role !== 'admin') {
      alert('Ошибка: Добавлять сотрудников может только Администратор.');
      return;
    }
    const formData = new FormData(e.currentTarget);
    const newUser: CRMUser = {
      id: `user_${Date.now()}`,
      name: formData.get('name') as string || 'Сотрудник',
      role: formData.get('role') as any || 'specialist',
      status: 'active',
      email: formData.get('email') as string || '',
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000000)}?auto=format&fit=crop&w=150&q=80`
    };

    saveUsersData([...users, newUser]);
    e.currentTarget.reset();
  };

  // CSV Export utility
  const exportToCSV = () => {
    const headers = ['ID', 'Клиент', 'Телефон', 'Email', 'Источник', 'Сумма', 'Статус', 'Создано', 'Назначен', 'Сообщение', 'Комментарии'];
    const rows = leads.map(l => [
      l.id,
      l.name,
      l.phone,
      l.email,
      l.source,
      l.amount.toString(),
      l.status,
      new Date(l.created_at).toLocaleDateString('ru-RU'),
      l.assigned_to,
      l.message.replace(/\n/g, ' '),
      l.comments.replace(/\n/g, ' ')
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `demetra_crm_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Statistics calculation
  const getStatistics = () => {
    const totalCount = leads.length;
    const completedLeads = leads.filter(l => l.status === 'completed');
    const totalRevenue = completedLeads.reduce((acc, curr) => acc + curr.amount, 0);
    const conversion = totalCount > 0 ? Math.round((completedLeads.length / totalCount) * 100) : 0;
    
    const newCount = leads.filter(l => l.status === 'new').length;
    const processingCount = leads.filter(l => l.status === 'processing').length;
    const activeCount = newCount + processingCount;

    return {
      totalCount,
      totalRevenue,
      conversion,
      activeCount,
      completedCount: completedLeads.length
    };
  };

  const stats = getStatistics();

  // Custom visual components for styling
  if (!isAuthenticated) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'radial-gradient(circle at center, #0a0a0f 0%, #030305 100%)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#ffffff',
        padding: '2rem'
      }}>
        {/* Sleek industrial background grid lines */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0, 255, 65, 0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 255, 65, 0.02) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            background: 'rgba(18, 18, 26, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 255, 65, 0.15)',
            boxShadow: '0 30px 100px rgba(0, 255, 65, 0.05), 0 0 1px 1px rgba(0, 255, 65, 0.1) inset',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '460px',
            padding: '3rem',
            position: 'relative',
            zIndex: 1
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ 
              width: '70px', 
              height: '70px', 
              borderRadius: '20px', 
              background: 'rgba(0, 255, 65, 0.07)', 
              border: '1px solid rgba(0, 255, 65, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: '#00ff41',
              boxShadow: '0 0 20px rgba(0, 255, 65, 0.1)'
            }}>
              <Shield size={32} />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '-0.02em', margin: '0 0 0.5rem' }}>
              DEMETRA <span style={{ color: '#00ff41' }}>CRM</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
              Защищенная панель управления заявками и сотрудниками
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#00ff41' }}>
                Пароль администратора
              </label>
              <input 
                type="password"
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: '0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#00ff41'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                required
              />
            </div>

            {authError && (
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', color: '#ff4b4b', fontSize: '0.85rem', background: 'rgba(255, 75, 75, 0.07)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255, 75, 75, 0.2)' }}>
                <AlertCircle size={18} />
                <span>{authError}</span>
              </div>
            )}

            <button 
              type="submit"
              style={{
                background: '#00ff41',
                color: '#000',
                border: 'none',
                padding: '1.25rem',
                borderRadius: '12px',
                fontWeight: '900',
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: '0.2s',
                boxShadow: '0 10px 30px rgba(0, 255, 65, 0.2)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 255, 65, 0.35)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 255, 65, 0.2)'; }}
            >
              Войти в CRM <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
            Пароль по умолчанию: <code style={{ color: '#00ff41', background: 'rgba(0,0,0,0.5)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>demetra2026</code>
          </div>
        </motion.div>
      </div>
    );
  }

  // Active leads helper filters
  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          l.phone.includes(searchQuery) ||
                          l.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : l.status === statusFilter;
    const matchesSource = sourceFilter === 'all' ? true : l.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  const uniqueSources = Array.from(new Set(leads.map(l => l.source)));

  // Counts for Admin Hub dashboard
  const productCount = (() => {
    try {
      const saved = localStorage.getItem('demetra_products');
      if (saved) return JSON.parse(saved).length;
    } catch {}
    return 5;
  })();

  const serviceCount = (() => {
    try {
      const saved = localStorage.getItem('demetra_services');
      if (saved) return JSON.parse(saved).length;
    } catch {}
    return 4;
  })();

  const pageCount = (() => {
    try {
      const saved = localStorage.getItem('demetra_pages_list');
      if (saved) return JSON.parse(saved).length;
    } catch {}
    return 7;
  })();

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#070709', 
      color: '#ffffff',
      display: 'flex',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Mobile Sidebar Backdrop */}
      {windowWidth < 1024 && isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 999
          }}
        />
      )}

      {/* Mobile Top Header */}
      {windowWidth < 1024 && (
        <header style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: '#0f0f15',
          borderBottom: '1px solid #1f1f2e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          zIndex: 900
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setIsSidebarOpen(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.25rem'
              }}
            >
              <Menu size={24} />
            </button>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '900', letterSpacing: '-0.02em' }}>
              DEMETRA <span style={{ color: '#00ff41' }}>CRM</span>
            </h4>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img src={currentUser.avatar} alt="avatar" style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1.5px solid #00ff41', objectFit: 'cover' }} />
          </div>
        </header>
      )}

      {/* Sidebar Navigation */}
      <aside style={{ 
        width: '280px', 
        background: '#0f0f15', 
        borderRight: '1px solid #1f1f2e',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 1000,
        left: isSidebarOpen ? 0 : '-280px',
        transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {/* Brand */}
        <div style={{ padding: '2rem', borderBottom: '1px solid #1f1f2e', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '12px', 
              background: 'rgba(0, 255, 65, 0.05)',
              border: '1px solid #00ff41',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#00ff41'
            }}>
              <Shield size={20} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900', letterSpacing: '-0.02em' }}>
                DEMETRA <span style={{ color: '#00ff41' }}>CRM</span>
              </h4>
              <div style={{ fontSize: '0.6rem', color: '#00ff41', fontWeight: '800', letterSpacing: '0.15em' }}>PRO EDITION</div>
            </div>
          </div>
          {windowWidth < 1024 && (
            <button 
              onClick={() => setIsSidebarOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Current user summary */}
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #1f1f2e', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(0,0,0,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img src={currentUser.avatar} alt="avatar" style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #00ff41' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#fff' }}>{currentUser.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#00ff41', fontWeight: '900', textTransform: 'uppercase' }}>{currentUser.role}</div>
            </div>
          </div>
          
          {/* Quick role switcher */}
          <div style={{ display: 'grid', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Тестирование роли:</label>
            <select
              value={currentUser.id}
              onChange={(e) => {
                const selected = users.find(u => u.id === e.target.value);
                if (selected) {
                  setCurrentUser(selected);
                  localStorage.setItem('demetra_crm_current_user', JSON.stringify(selected));
                  // switch to first allowed tab
                  const rolePerm = permissions.find(p => p.role === selected.role);
                  if (rolePerm && rolePerm.allowed_tabs.length > 0) {
                    if (!rolePerm.allowed_tabs.includes(activeSection as any)) {
                      setActiveSection(rolePerm.allowed_tabs[0] as any);
                    }
                  }
                }
              }}
              style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#fff',
                fontSize: '0.75rem',
                padding: '0.4rem',
                borderRadius: '6px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {users.map(u => (
                <option key={u.id} value={u.id} style={{ background: '#0f0f15', color: '#fff' }}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Menu Items */}
        <nav style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, overflowY: 'auto' }}>
          {[
            { id: 'dashboard', label: 'Главная панель', icon: <LayoutDashboard size={18} /> },
            { id: 'analytics', label: 'Аналитика и статистика', icon: <BarChart3 size={18} /> },
            { id: 'leads', label: 'Список заявок / заказов', icon: <FileText size={18} />, badge: leads.filter(l => l.status === 'new').length },
            { id: 'clients', label: 'Управление клиентами', icon: <Users size={18} /> },
            { id: 'chats', label: 'История переписки', icon: <MessageSquare size={18} />, badge: chats.length },
            { id: 'users', label: 'Настройка пользователей', icon: <Shield size={18} /> },
            { id: 'accounting', label: 'Чеки и бухгалтерия', icon: <DollarSign size={18} /> }
          ].filter(item => {
            const allowedTabs = permissions.find(p => p.role === currentUser.role)?.allowed_tabs || [];
            if (item.id === 'dashboard') {
              return currentUser.role === 'admin';
            }
            return allowedTabs.includes(item.id as any);
          }).map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                borderRadius: '12px',
                border: 'none',
                background: activeSection === item.id ? 'rgba(0, 255, 65, 0.06)' : 'transparent',
                color: activeSection === item.id ? '#00ff41' : 'rgba(255,255,255,0.6)',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: '700',
                fontSize: '0.9rem',
                transition: '0.2s'
              }}
              onMouseEnter={(e) => { if (activeSection !== item.id) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; } }}
              onMouseLeave={(e) => { if (activeSection !== item.id) { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.background = 'transparent'; } }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && item.badge > 0 ? (
                <span style={{ 
                  background: item.id === 'leads' ? '#ff4b4b' : '#00ff41',
                  color: item.id === 'leads' ? '#fff' : '#000',
                  fontSize: '0.7rem',
                  fontWeight: '900',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '10px'
                }}>
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        {/* Footer controls */}
        <div style={{ padding: '2rem 1.5rem', borderTop: '1px solid #1f1f2e', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => { setRefreshing(true); fetchData(); }} 
              style={{ 
                flex: 1, 
                background: 'rgba(255,255,255,0.03)', 
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '8px', 
                color: '#fff', 
                padding: '0.75rem', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} /> Обновить
            </button>
            <button 
              onClick={handleLogout}
              style={{ 
                background: 'rgba(255, 75, 75, 0.08)', 
                border: '1px solid rgba(255, 75, 75, 0.2)',
                borderRadius: '8px', 
                color: '#ff4b4b', 
                padding: '0.75rem 1rem', 
                cursor: 'pointer'
              }}
              title="Выйти"
            >
              <LogOut size={16} />
            </button>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
            Demetra CRM System v2.6.4
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ 
        flex: 1, 
        marginLeft: windowWidth >= 1024 ? '280px' : 0,
        padding: windowWidth >= 1024 ? '3rem 4rem' : '1.5rem 1rem',
        paddingTop: windowWidth >= 1024 ? '3rem' : '5rem',
        minHeight: '100vh',
        boxSizing: 'border-box',
        minWidth: 0
      }}>
        {loading ? (
          <div style={{ height: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', color: '#00ff41' }}>
            <RefreshCw size={40} className="animate-spin" />
            <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>Загрузка данных CRM...</span>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {/* DASHBOARD SECTION */}
              {activeSection === 'dashboard' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                  {/* Header */}
                  <div style={{ borderBottom: '1px solid #1f1f2e', paddingBottom: '2rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#00ff41', fontWeight: '900', letterSpacing: '0.3em', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                      Главная панель
                    </div>
                    <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: '900', color: '#fff', lineHeight: 1.1, margin: 0 }}>
                      УПРАВЛЕНИЕ РАЗДЕЛАМИ CRM
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.75rem', fontSize: '1rem', margin: 0 }}>
                      Нажмите на плитку, чтобы перейти в соответствующий рабочий раздел системы.
                    </p>
                  </div>

                  {/* Tile Grid */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                    gap: '1.5rem' 
                  }}>
                    {[
                      {
                        id: 'leads',
                        icon: <FileText size={36} />,
                        accent: '#ff4b4b',
                        label: 'Список заявок / заказов',
                        sublabel: 'Канбан-воронка',
                        count: leads.length,
                        countLabel: 'заявок',
                        desc: 'Управление поступающими обращениями клиентов, этапами сделок и бюджетами.',
                        action: 'Открыть воронку →'
                      },
                      {
                        id: 'clients',
                        icon: <Users size={36} />,
                        accent: '#00bfff',
                        label: 'Управление клиентами',
                        sublabel: 'База контактов',
                        count: getClientsList().length,
                        countLabel: 'клиентов',
                        desc: 'Единый реестр клиентов, детальные карточки, история сделок и статусы лояльности.',
                        action: 'Открыть базу →'
                      },
                      {
                        id: 'analytics',
                        icon: <BarChart3 size={36} />,
                        accent: '#00ff41',
                        label: 'Аналитика и статистика',
                        sublabel: 'Финансовые показатели',
                        count: Math.round(stats.totalRevenue).toLocaleString('ru-RU'),
                        countLabel: '₸ оборот',
                        desc: 'Контроль доходов, конверсии, среднего чека и графики динамики продаж.',
                        action: 'Смотреть графики →'
                      },
                      {
                        id: 'chats',
                        icon: <MessageSquare size={36} />,
                        accent: '#a855f7',
                        label: 'История переписки',
                        sublabel: 'Диалоги с клиентами',
                        count: chats.length,
                        countLabel: 'диалогов',
                        desc: 'Онлайн-чат, интеграции с мессенджерами и история переписок.',
                        action: 'Открыть чаты →'
                      },
                      {
                        id: 'users',
                        icon: <Shield size={36} />,
                        accent: '#f59e0b',
                        label: 'Аккаунты сотрудников',
                        sublabel: 'Настройка ролей',
                        count: users.length,
                        countLabel: 'аккаунтов',
                        desc: 'Редактирование прав доступа менеджеров, создание видимости определенных вкладок.',
                        action: 'Настроить роли →'
                      },
                      {
                        id: 'accounting',
                        icon: <DollarSign size={36} />,
                        accent: '#ec4899',
                        label: 'Чеки и бухгалтерия',
                        sublabel: 'Antygravity ТОО (НДС 12%)',
                        count: null,
                        countLabel: '',
                        desc: 'Генерация профессиональных PDF-чеков, Актов выполненных работ и CSV для 1С.',
                        action: 'Открыть генератор →'
                      }
                    ].map((tile) => (
                      <div
                        key={tile.id}
                        onClick={() => setActiveSection(tile.id as any)}
                        style={{
                          background: '#0f0f15',
                          border: '1px solid #1f1f2e',
                          borderRadius: '24px',
                          padding: '2.5rem 2rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1.25rem',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                          position: 'relative',
                          overflow: 'hidden',
                          color: '#fff'
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget;
                          el.style.borderColor = tile.accent;
                          el.style.transform = 'translateY(-4px)';
                          el.style.boxShadow = `0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px ${tile.accent}22`;
                          el.style.background = '#13131c';
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget;
                          el.style.borderColor = '#1f1f2e';
                          el.style.transform = 'translateY(0)';
                          el.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
                          el.style.background = '#0f0f15';
                        }}
                      >
                        {/* Glow accent top bar */}
                        <div style={{
                          position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                          background: `linear-gradient(90deg, transparent, ${tile.accent}, transparent)`,
                          opacity: 0.6
                        }} />

                        {/* Icon + Count row */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                          <div style={{
                            padding: '1rem',
                            background: `${tile.accent}18`,
                            borderRadius: '16px',
                            color: tile.accent,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `1px solid ${tile.accent}22`
                          }}>
                            {tile.icon}
                          </div>
                          {tile.count !== null && (
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', lineHeight: 1 }}>
                                {tile.count}
                              </div>
                              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700', letterSpacing: '0.05em', marginTop: '0.15rem' }}>
                                {tile.countLabel.toUpperCase()}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Label */}
                        <div>
                          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: '800', letterSpacing: '0.15em', marginBottom: '0.35rem' }}>
                            {tile.sublabel.toUpperCase()}
                          </div>
                          <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fff' }}>
                            {tile.label}
                          </div>
                        </div>

                        {/* Description */}
                        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.5 }}>
                          {tile.desc}
                        </p>

                        {/* Action Link */}
                        <div style={{ 
                          marginTop: 'auto', 
                          fontSize: '0.85rem', 
                          fontWeight: '800', 
                          color: tile.accent, 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.25rem' 
                        }}>
                          {tile.action}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ANALYTICS SECTION */}
              {activeSection === 'analytics' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                      <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.02em', margin: '0 0 0.5rem' }}>Аналитическая панель</h1>
                      <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>Сводка ключевых показателей эффективности, доходности и конверсии компании Деметра</p>
                    </div>

                    <div style={{ display: 'flex', background: '#12121a', border: '1px solid #1f1f2e', borderRadius: '12px', padding: '0.3rem' }}>
                      {['today', 'week', 'month', 'all'].map(p => (
                        <button
                          key={p}
                          onClick={() => setAnalyticsPeriod(p as any)}
                          style={{
                            background: analyticsPeriod === p ? '#00ff41' : 'transparent',
                            color: analyticsPeriod === p ? '#000' : 'rgba(255,255,255,0.5)',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            fontWeight: '800',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            transition: '0.2s'
                          }}
                        >
                          {p === 'today' ? 'Сегодня' : p === 'week' ? 'Неделя' : p === 'month' ? 'Месяц' : 'Все время'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* STATS CARDS */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', marginBottom: '3.5rem' }}>
                    <div style={{ background: '#0f0f15', border: '1px solid #1f1f2e', borderRadius: '16px', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Доход (Выполненные)</span>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(0, 255, 65, 0.05)', border: '1px solid rgba(0, 255, 65, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00ff41' }}>
                          <DollarSign size={18} />
                        </div>
                      </div>
                      <h2 style={{ fontSize: '2rem', fontWeight: '900', margin: '0 0 0.5rem', color: '#fff' }}>
                        {stats.totalRevenue.toLocaleString('ru-RU')} ₸
                      </h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00ff41', fontSize: '0.8rem' }}>
                        <TrendingUp size={14} /> <span>+14.8% с прошлого периода</span>
                      </div>
                    </div>

                    <div style={{ background: '#0f0f15', border: '1px solid #1f1f2e', borderRadius: '16px', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Конверсия заявок</span>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(0, 191, 255, 0.05)', border: '1px solid rgba(0, 191, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00bfff' }}>
                          <TrendingUp size={18} />
                        </div>
                      </div>
                      <h2 style={{ fontSize: '2rem', fontWeight: '900', margin: '0 0 0.5rem', color: '#fff' }}>
                        {stats.conversion}%
                      </h2>
                      {/* Premium progress bar */}
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden', marginTop: '1rem' }}>
                        <div style={{ width: `${stats.conversion}%`, height: '100%', background: 'linear-gradient(to right, #00bfff, #00ff41)', borderRadius: '3px' }}></div>
                      </div>
                    </div>

                    <div style={{ background: '#0f0f15', border: '1px solid #1f1f2e', borderRadius: '16px', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Всего обращений</span>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                          <FileText size={18} />
                        </div>
                      </div>
                      <h2 style={{ fontSize: '2rem', fontWeight: '900', margin: '0 0 0.5rem', color: '#fff' }}>
                        {stats.totalCount}
                      </h2>
                      <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                        <span>Активных в работе: {stats.activeCount} заявок</span>
                      </div>
                    </div>

                    <div style={{ background: '#0f0f15', border: '1px solid #1f1f2e', borderRadius: '16px', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Средний чек</span>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.05)', border: '1px solid rgba(168, 85, 247, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a855f7' }}>
                          <DollarSign size={18} />
                        </div>
                      </div>
                      <h2 style={{ fontSize: '2rem', fontWeight: '900', margin: '0 0 0.5rem', color: '#fff' }}>
                        {stats.completedCount > 0 ? Math.round(stats.totalRevenue / stats.completedCount).toLocaleString('ru-RU') : 0} ₸
                      </h2>
                      <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                        <span>На основе успешных сделок</span>
                      </div>
                    </div>
                  </div>

                  {/* VISUAL CHARTS (PREMIUM SVG) */}
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                    {/* SVG Line Chart */}
                    <div style={{ background: '#0f0f15', border: '1px solid #1f1f2e', borderRadius: '20px', padding: '2.5rem' }}>
                      <h4 style={{ margin: '0 0 2rem', fontSize: '1.2rem', fontWeight: '800' }}>Динамика доходов (за последние 6 месяцев)</h4>
                      <div style={{ position: 'relative', width: '100%', height: '220px' }}>
                        <svg viewBox="0 0 600 200" width="100%" height="100%">
                          <defs>
                            <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#00ff41" stopOpacity="0.35" />
                              <stop offset="100%" stopColor="#00ff41" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          {/* Grid Lines */}
                          <line x1="0" y1="40" x2="600" y2="40" stroke="#1f1f2e" strokeWidth="1" strokeDasharray="5,5" />
                          <line x1="0" y1="90" x2="600" y2="90" stroke="#1f1f2e" strokeWidth="1" strokeDasharray="5,5" />
                          <line x1="0" y1="140" x2="600" y2="140" stroke="#1f1f2e" strokeWidth="1" strokeDasharray="5,5" />
                          
                          {/* Fill Area */}
                          <path d="M 0 170 C 60 160, 120 120, 180 140 C 240 100, 300 80, 360 95 C 420 50, 480 30, 600 25 L 600 200 L 0 200 Z" fill="url(#chartGlow)" />
                          
                          {/* Line */}
                          <path d="M 0 170 C 60 160, 120 120, 180 140 C 240 100, 300 80, 360 95 C 420 50, 480 30, 600 25" fill="none" stroke="#00ff41" strokeWidth="4" />
                          
                          {/* Data points */}
                          <circle cx="180" cy="140" r="6" fill="#00ff41" stroke="#0f0f15" strokeWidth="2" />
                          <circle cx="360" cy="95" r="6" fill="#00ff41" stroke="#0f0f15" strokeWidth="2" />
                          <circle cx="600" cy="25" r="6" fill="#00ff41" stroke="#0f0f15" strokeWidth="2" />
                        </svg>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontWeight: '800', marginTop: '1rem', textTransform: 'uppercase' }}>
                          <span>Январь</span>
                          <span>Февраль</span>
                          <span>Март</span>
                          <span>Апрель</span>
                          <span>Май</span>
                          <span>Июнь (Текущий)</span>
                        </div>
                      </div>
                    </div>

                    {/* Sources / Conversion Pie-style Breakdown */}
                    <div style={{ background: '#0f0f15', border: '1px solid #1f1f2e', borderRadius: '20px', padding: '2.5rem', display: 'flex', flexDirection: 'column' }}>
                      <h4 style={{ margin: '0 0 2rem', fontSize: '1.2rem', fontWeight: '800' }}>Каналы обращений</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1, justifyContent: 'center' }}>
                        {[
                          { name: 'Форма контактов', count: leads.filter(l => l.source === 'Форма контактов').length, color: '#00ff41' },
                          { name: 'Баннер обратной связи', count: leads.filter(l => l.source === 'Баннер обратной связи').length, color: '#00bfff' },
                          { name: 'Заявка из каталога', count: leads.filter(l => l.source === 'Заявка из каталога').length, color: '#a855f7' },
                          { name: 'Ручной ввод', count: leads.filter(l => l.source === 'Ручной ввод').length, color: '#f59e0b' }
                        ].map((source, i) => {
                          const percentage = stats.totalCount > 0 ? Math.round((source.count / stats.totalCount) * 100) : 0;
                          return (
                            <div key={i}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: '700' }}>{source.name}</span>
                                <span style={{ fontWeight: '800', color: source.color }}>{source.count} ({percentage}%)</span>
                              </div>
                              <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                                <div style={{ width: `${percentage}%`, height: '100%', background: source.color, borderRadius: '3px' }}></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* RECENT LEADS SUMMARY LIST */}
                  <div style={{ background: '#0f0f15', border: '1px solid #1f1f2e', borderRadius: '20px', padding: '2.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                      <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>Последние необработанные заявки</h4>
                      <button 
                        onClick={() => setActiveSection('leads')}
                        style={{ background: 'none', border: 'none', color: '#00ff41', fontWeight: '800', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        Все заявки <ArrowRight size={14} />
                      </button>
                    </div>
                    {leads.filter(l => l.status === 'new').slice(0, 3).length === 0 ? (
                      <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}>
                        Нет новых необработанных заявок. Отличная работа!
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gap: '1rem' }}>
                        {leads.filter(l => l.status === 'new').slice(0, 3).map(lead => (
                          <div 
                            key={lead.id} 
                            style={{ 
                              background: 'rgba(0,0,0,0.2)', 
                              border: '1px solid rgba(255,255,255,0.03)', 
                              borderRadius: '12px', 
                              padding: '1.5rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: '800', fontSize: '1rem' }}>{lead.name}</span>
                                <span style={{ background: 'rgba(0, 255, 65, 0.08)', color: '#00ff41', fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '4px', textTransform: 'uppercase', fontWeight: '900' }}>{lead.source}</span>
                              </div>
                              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>{lead.message}</div>
                              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', display: 'flex', gap: '1rem' }}>
                                <span>📞 {lead.phone}</span>
                                <span>🕒 {new Date(lead.created_at).toLocaleString('ru-RU')}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => { setSelectedLead(lead); setIsEditModalOpen(true); }}
                              style={{
                                background: 'rgba(0, 255, 65, 0.05)',
                                border: '1px solid rgba(0, 255, 65, 0.2)',
                                borderRadius: '8px',
                                color: '#00ff41',
                                padding: '0.6rem 1rem',
                                cursor: 'pointer',
                                fontWeight: '700',
                                fontSize: '0.8rem'
                              }}
                            >
                              Обработать
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* LEADS LIST SECTION */}
              {activeSection === 'leads' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '3rem' }}>
                    <div>
                      <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.02em', margin: '0 0 0.5rem' }}>Заявки и заказы</h1>
                      <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>Управление поступающими обращениями клиентов, распределение задач и бюджетирование</p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button 
                        onClick={exportToCSV}
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '12px',
                          color: '#fff',
                          padding: '1rem 1.5rem',
                          fontWeight: '800',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <Download size={16} /> Экспорт CSV
                      </button>
                      <button 
                        onClick={() => setIsAddModalOpen(true)}
                        style={{
                          background: '#00ff41',
                          color: '#000',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '1rem 1.5rem',
                          fontWeight: '900',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <Plus size={18} /> Добавить заявку
                      </button>
                    </div>
                  </div>

                  {/* FILTERS TOOLBAR */}
                  <div style={{ 
                    background: '#0f0f15', 
                    border: '1px solid #1f1f2e', 
                    borderRadius: '16px', 
                    padding: '1.5rem', 
                    display: 'flex', 
                    flexWrap: 'wrap',
                    gap: '1.5rem',
                    alignItems: 'center',
                    marginBottom: '2rem'
                  }}>
                    {/* Search */}
                    <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
                      <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                      <input 
                        type="text" 
                        placeholder="Поиск по имени, телефону, тексту..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                          width: '100%',
                          background: 'rgba(0,0,0,0.3)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '10px',
                          padding: '0.85rem 1rem 0.85rem 2.8rem',
                          color: '#fff',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    {/* Status filter */}
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Статус:</span>
                      <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{
                          background: 'rgba(0,0,0,0.3)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '10px',
                          padding: '0.85rem 1.5rem',
                          color: '#fff',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="all">Все статусы</option>
                        <option value="new">Новые</option>
                        <option value="processing">В работе</option>
                        <option value="dozhim">Дожим</option>
                        <option value="manager_op">У менеджера ОП</option>
                        <option value="rop">РОП</option>
                        <option value="financier">Финансист</option>
                        <option value="completed">Успешно</option>
                        <option value="rejected">Отказ / Завершено</option>
                      </select>
                    </div>

                    {/* Source filter */}
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Источник:</span>
                      <select 
                        value={sourceFilter}
                        onChange={(e) => setSourceFilter(e.target.value)}
                        style={{
                          background: 'rgba(0,0,0,0.3)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '10px',
                          padding: '0.85rem 1.5rem',
                          color: '#fff',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="all">Все источники</option>
                        {uniqueSources.map(src => (
                          <option key={src} value={src}>{src}</option>
                        ))}
                      </select>
                    </div>

                    {/* View Switcher */}
                    <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0.2rem', marginLeft: 'auto' }}>
                      <button
                        onClick={() => setViewMode('kanban')}
                        style={{
                          background: viewMode === 'kanban' ? 'rgba(0, 255, 65, 0.08)' : 'transparent',
                          color: viewMode === 'kanban' ? '#00ff41' : 'rgba(255,255,255,0.5)',
                          border: 'none',
                          padding: '0.65rem 1rem',
                          borderRadius: '8px',
                          fontWeight: '800',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        <Play size={14} style={{ transform: 'rotate(-90deg)' }} /> Канбан
                      </button>
                      <button
                        onClick={() => setViewMode('table')}
                        style={{
                          background: viewMode === 'table' ? 'rgba(0, 255, 65, 0.08)' : 'transparent',
                          color: viewMode === 'table' ? '#00ff41' : 'rgba(255,255,255,0.5)',
                          border: 'none',
                          padding: '0.65rem 1rem',
                          borderRadius: '8px',
                          fontWeight: '800',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        <FileText size={14} /> Таблица
                      </button>
                    </div>
                  </div>

                  {/* LEADS LIST / KANBAN */}
                  {viewMode === 'table' ? (
                    <div style={{ background: '#0f0f15', border: '1px solid #1f1f2e', borderRadius: '20px', overflow: 'hidden' }}>
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid #1f1f2e', color: 'rgba(255,255,255,0.4)', fontWeight: '800' }}>
                              <th style={{ padding: '1.25rem 2rem' }}>Клиент</th>
                              <th style={{ padding: '1.25rem 1rem' }}>Дата обращения</th>
                              <th style={{ padding: '1.25rem 1rem' }}>Источник</th>
                              <th style={{ padding: '1.25rem 1rem' }}>Сумма сделки</th>
                              <th style={{ padding: '1.25rem 1rem' }}>Ответственный</th>
                              <th style={{ padding: '1.25rem 1rem' }}>Статус</th>
                              <th style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>Действия</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredLeads.length === 0 ? (
                              <tr>
                                <td colSpan={7} style={{ padding: '4rem 2rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                                  Заявки, соответствующие критериям поиска, не найдены.
                                </td>
                              </tr>
                            ) : (
                              filteredLeads.map(lead => (
                                <tr key={lead.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', background: 'transparent', transition: '0.2s' }}>
                                  <td style={{ padding: '1.5rem 2rem' }}>
                                    <div style={{ fontWeight: '800', color: '#fff', fontSize: '1rem', marginBottom: '0.25rem' }}>{lead.name}</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                                      <span>📞 {lead.phone || 'Не указан'}</span>
                                      <span>✉️ {lead.email || 'Не указана'}</span>
                                    </div>
                                  </td>
                                  <td style={{ padding: '1.5rem 1rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
                                    {new Date(lead.created_at).toLocaleString('ru-RU')}
                                  </td>
                                  <td style={{ padding: '1.5rem 1rem' }}>
                                    <span style={{ 
                                      background: 'rgba(255,255,255,0.05)', 
                                      border: '1px solid rgba(255,255,255,0.08)',
                                      color: 'rgba(255,255,255,0.8)', 
                                      fontSize: '0.7rem', 
                                      padding: '0.2rem 0.5rem', 
                                      borderRadius: '6px',
                                      fontWeight: '800'
                                    }}>
                                      {lead.source}
                                    </span>
                                  </td>
                                  <td style={{ padding: '1.5rem 1rem', fontWeight: '900', color: lead.amount > 0 ? '#00ff41' : 'rgba(255,255,255,0.4)', fontSize: '1rem' }}>
                                    {lead.amount > 0 ? `${lead.amount.toLocaleString('ru-RU')} ₸` : '—'}
                                  </td>
                                  <td style={{ padding: '1.5rem 1rem', color: 'rgba(255,255,255,0.8)', fontWeight: '700' }}>
                                    {lead.assigned_to}
                                  </td>
                                  <td style={{ padding: '1.5rem 1rem' }}>
                                    <span style={{ 
                                      background: lead.status === 'new' ? 'rgba(255, 75, 75, 0.08)' : 
                                                  lead.status === 'processing' ? 'rgba(0, 191, 255, 0.08)' : 
                                                  lead.status === 'dozhim' ? 'rgba(245, 158, 11, 0.08)' : 
                                                  lead.status === 'manager_op' ? 'rgba(99, 102, 241, 0.08)' : 
                                                  lead.status === 'rop' ? 'rgba(139, 92, 246, 0.08)' : 
                                                  lead.status === 'financier' ? 'rgba(6, 182, 212, 0.08)' : 
                                                  lead.status === 'completed' ? 'rgba(0, 255, 65, 0.08)' : 'rgba(255, 75, 75, 0.08)',
                                      border: `1px solid ${
                                        lead.status === 'new' ? 'rgba(255, 75, 75, 0.3)' : 
                                        lead.status === 'processing' ? 'rgba(0, 191, 255, 0.3)' : 
                                        lead.status === 'dozhim' ? 'rgba(245, 158, 11, 0.3)' : 
                                        lead.status === 'manager_op' ? 'rgba(99, 102, 241, 0.3)' : 
                                        lead.status === 'rop' ? 'rgba(139, 92, 246, 0.3)' : 
                                        lead.status === 'financier' ? 'rgba(6, 182, 212, 0.3)' : 
                                        lead.status === 'completed' ? 'rgba(0, 255, 65, 0.3)' : 'rgba(255, 75, 75, 0.3)'
                                      }`,
                                      color: lead.status === 'new' ? '#ff4b4b' : 
                                             lead.status === 'processing' ? '#00bfff' : 
                                             lead.status === 'dozhim' ? '#f59e0b' : 
                                             lead.status === 'manager_op' ? '#6366f1' : 
                                             lead.status === 'rop' ? '#8b5cf6' : 
                                             lead.status === 'financier' ? '#06b6d4' : 
                                             lead.status === 'completed' ? '#00ff41' : '#ff4b4b',
                                      fontSize: '0.75rem', 
                                      padding: '0.25rem 0.6rem', 
                                      borderRadius: '6px',
                                      fontWeight: '900',
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.05em'
                                    }}>
                                      {lead.status === 'new' ? 'Новая' : 
                                       lead.status === 'processing' ? 'В работе' : 
                                       lead.status === 'dozhim' ? 'Дожим' : 
                                       lead.status === 'manager_op' ? 'Менеджер ОП' : 
                                       lead.status === 'rop' ? 'РОП' : 
                                       lead.status === 'financier' ? 'Финансист' : 
                                       lead.status === 'completed' ? 'Выполнена' : 'Отклонена'}
                                    </span>
                                  </td>
                                  <td style={{ padding: '1.5rem 2rem', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                      <button 
                                        onClick={() => { setSelectedLead(lead); setIsEditModalOpen(true); }}
                                        style={{ 
                                          background: 'rgba(255,255,255,0.03)', 
                                          border: '1px solid rgba(255,255,255,0.05)',
                                          color: '#fff', 
                                          padding: '0.5rem', 
                                          borderRadius: '8px', 
                                          cursor: 'pointer' 
                                        }}
                                        title="Редактировать статус"
                                      >
                                        <Edit3 size={15} />
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteLead(lead.id)}
                                        style={{ 
                                          background: 'rgba(255, 75, 75, 0.05)', 
                                          border: '1px solid rgba(255, 75, 75, 0.15)',
                                          color: '#ff4b4b', 
                                          padding: '0.5rem', 
                                          borderRadius: '8px', 
                                          cursor: 'pointer' 
                                        }}
                                        title="Удалить"
                                      >
                                        <Trash2 size={15} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    /* KANBAN BOARD VIEW */
                    <div 
                      className="kanban-board-container"
                      style={{ 
                        display: 'flex', 
                        gap: '1rem', 
                        overflowX: 'auto', 
                        paddingBottom: '1.5rem',
                        minHeight: '650px',
                        scrollbarWidth: 'thin',
                        width: '100%',
                        maxWidth: '100%',
                        boxSizing: 'border-box'
                      }}
                    >
                      {[
                        { id: 'new', title: 'Новые', color: '#ff4b4b', bg: 'rgba(255, 75, 75, 0.08)', border: 'rgba(255, 75, 75, 0.2)' },
                        { id: 'processing', title: 'В работе', color: '#00bfff', bg: 'rgba(0, 191, 255, 0.08)', border: 'rgba(0, 191, 255, 0.2)' },
                        { id: 'dozhim', title: 'Дожим', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)', border: 'rgba(245, 158, 11, 0.2)' },
                        { id: 'manager_op', title: 'Менеджер ОП', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.08)', border: 'rgba(99, 102, 241, 0.2)' },
                        { id: 'rop', title: 'РОП', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.08)', border: 'rgba(139, 92, 246, 0.2)' },
                        { id: 'financier', title: 'Финансист', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.08)', border: 'rgba(6, 182, 212, 0.2)' },
                        { id: 'completed', title: 'Успешно', color: '#00ff41', bg: 'rgba(0, 255, 65, 0.08)', border: 'rgba(0, 255, 65, 0.2)' },
                        { id: 'rejected', title: 'Отказ', color: '#ff4b4b', bg: 'rgba(255, 75, 75, 0.08)', border: 'rgba(255, 75, 75, 0.2)' }
                      ].map(stage => {
                        const stageLeads = filteredLeads.filter(l => l.status === stage.id);
                        return (
                          <div 
                            key={stage.id}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, stage.id as any)}
                            style={{
                              flex: '0 0 290px',
                              background: '#0f0f15',
                              border: '1px solid #1f1f2e',
                              borderRadius: '16px',
                              display: 'flex',
                              flexDirection: 'column',
                              padding: '1.25rem 1rem',
                              boxSizing: 'border-box'
                            }}
                          >
                            {/* Column Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                              <span style={{ fontSize: '0.85rem', fontWeight: '900', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: stage.color }} />
                                {stage.title}
                              </span>
                              <span style={{ 
                                background: stage.bg, 
                                border: `1px solid ${stage.border}`, 
                                color: stage.color, 
                                fontSize: '0.7rem', 
                                padding: '0.15rem 0.4rem', 
                                borderRadius: '6px', 
                                fontWeight: '900' 
                              }}>
                                {stageLeads.length}
                              </span>
                            </div>

                            {/* Column Body */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, minHeight: '450px' }}>
                              {stageLeads.length === 0 ? (
                                <div style={{ 
                                  height: '100%', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center', 
                                  border: '2px dashed rgba(255,255,255,0.02)', 
                                  borderRadius: '12px', 
                                  color: 'rgba(255,255,255,0.15)',
                                  fontSize: '0.75rem',
                                  textAlign: 'center',
                                  padding: '2rem 1rem'
                                }}>
                                  Перетащите заявку сюда
                                </div>
                              ) : (
                                stageLeads.map(lead => (
                                  <div
                                    key={lead.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, lead.id)}
                                    style={{
                                      background: '#14141f',
                                      border: '1px solid rgba(255,255,255,0.03)',
                                      borderRadius: '12px',
                                      padding: '1rem',
                                      cursor: 'grab',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      gap: '0.65rem',
                                      transition: 'border-color 0.2s',
                                      position: 'relative'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = stage.color}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.03)'}
                                  >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                      <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>
                                        #{lead.id.split('_')[1] || lead.id.slice(-4)}
                                      </span>
                                      <span style={{ 
                                        background: 'rgba(255,255,255,0.03)', 
                                        color: 'rgba(255,255,255,0.5)', 
                                        fontSize: '0.6rem', 
                                        padding: '0.1rem 0.35rem', 
                                        borderRadius: '4px',
                                        fontWeight: '700'
                                      }}>
                                        {lead.source}
                                      </span>
                                    </div>

                                    <div style={{ fontWeight: '800', fontSize: '0.85rem', color: '#fff' }}>
                                      {lead.name}
                                    </div>

                                    {lead.message && (
                                      <div style={{ 
                                        fontSize: '0.75rem', 
                                        color: 'rgba(255,255,255,0.4)', 
                                        lineHeight: '1.3',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                      }}>
                                        {lead.message}
                                      </div>
                                    )}

                                    <div style={{ display: 'grid', gap: '0.15rem', fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>
                                      <span>📞 {lead.phone}</span>
                                      <span>👤 {lead.assigned_to}</span>
                                    </div>

                                    <div style={{ 
                                      display: 'flex', 
                                      justifyContent: 'space-between', 
                                      alignItems: 'center', 
                                      borderTop: '1px solid rgba(255,255,255,0.03)', 
                                      paddingTop: '0.5rem',
                                      marginTop: '0.25rem'
                                    }}>
                                      <span style={{ 
                                        fontWeight: '900', 
                                        color: lead.amount > 0 ? '#00ff41' : 'rgba(255,255,255,0.2)', 
                                        fontSize: '0.85rem' 
                                      }}>
                                        {lead.amount > 0 ? `${lead.amount.toLocaleString('ru-RU')} ₸` : '—'}
                                      </span>

                                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                                        <button 
                                          onClick={() => { setSelectedLead(lead); setIsEditModalOpen(true); }}
                                          style={{ 
                                            background: 'rgba(255,255,255,0.03)', 
                                            border: 'none',
                                            color: 'rgba(255,255,255,0.6)', 
                                            padding: '0.35rem', 
                                            borderRadius: '6px', 
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center'
                                          }}
                                        >
                                          <Edit3 size={12} />
                                        </button>
                                        <button 
                                          onClick={() => handleDeleteLead(lead.id)}
                                          style={{ 
                                            background: 'rgba(255,75,75,0.05)', 
                                            border: 'none',
                                            color: '#ff4b4b', 
                                            padding: '0.35rem', 
                                            borderRadius: '6px', 
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center'
                                          }}
                                        >
                                          <Trash2 size={12} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* CLIENTS LIST SECTION */}
              {activeSection === 'clients' && (
                <div>
                  <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.02em', margin: '0 0 0.5rem' }}>Управление клиентами</h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>Полная база контрагентов и заказчиков, сформированная автоматически на основе истории сделок</p>
                  </div>

                  <div style={{ background: '#0f0f15', border: '1px solid #1f1f2e', borderRadius: '20px', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid #1f1f2e', color: 'rgba(255,255,255,0.4)', fontWeight: '800' }}>
                            <th style={{ padding: '1.25rem 2rem' }}>Имя клиента</th>
                            <th style={{ padding: '1.25rem 1rem' }}>Телефон</th>
                            <th style={{ padding: '1.25rem 1rem' }}>Email</th>
                            <th style={{ padding: '1.25rem 1rem' }}>Количество заказов</th>
                            <th style={{ padding: '1.25rem 1rem' }}>Общая сумма оплат</th>
                            <th style={{ padding: '1.25rem 1rem' }}>Категория</th>
                            <th style={{ padding: '1.25rem 2rem' }}>Заметки / Описание</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getClientsList().length === 0 ? (
                            <tr>
                              <td colSpan={7} style={{ padding: '4rem 2rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                                Клиенты не зарегистрированы.
                              </td>
                            </tr>
                          ) : (
                            getClientsList().map((client, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                <td style={{ padding: '1.5rem 2rem', fontWeight: '800', color: '#fff', fontSize: '1rem' }}>{client.name}</td>
                                <td style={{ padding: '1.5rem 1rem', color: 'rgba(255,255,255,0.8)' }}>{client.phone || '—'}</td>
                                <td style={{ padding: '1.5rem 1rem', color: 'rgba(255,255,255,0.6)' }}>{client.email || '—'}</td>
                                <td style={{ padding: '1.5rem 1rem', textAlign: 'center', fontWeight: '800', color: '#00ff41' }}>{client.totalOrders}</td>
                                <td style={{ padding: '1.5rem 1rem', fontWeight: '900', color: '#fff' }}>{client.totalSpent.toLocaleString('ru-RU')} ₸</td>
                                <td style={{ padding: '1.5rem 1rem' }}>
                                  <span style={{ 
                                    background: client.status === 'V.I.P.' ? 'rgba(168, 85, 247, 0.08)' : 
                                                client.status === 'Постоянный' ? 'rgba(0, 255, 65, 0.08)' : 'rgba(255,255,255,0.04)',
                                    border: `1px solid ${
                                      client.status === 'V.I.P.' ? 'rgba(168, 85, 247, 0.3)' : 
                                      client.status === 'Постоянный' ? 'rgba(0, 255, 65, 0.3)' : 'rgba(255,255,255,0.1)'
                                    }`,
                                    color: client.status === 'V.I.P.' ? '#a855f7' : 
                                           client.status === 'Постоянный' ? '#00ff41' : 'rgba(255,255,255,0.6)',
                                    fontSize: '0.7rem', 
                                    padding: '0.2rem 0.5rem', 
                                    borderRadius: '4px',
                                    fontWeight: '900',
                                    textTransform: 'uppercase'
                                  }}>
                                    {client.status}
                                  </span>
                                </td>
                                <td style={{ padding: '1.5rem 2rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {client.notes || '—'}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* CHATS SECTION */}
              {activeSection === 'chats' && (
                <div>
                  <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.02em', margin: '0 0 0.5rem' }}>История переписки</h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>Интерактивный центр поддержки клиентов. Ответы дублируются клиенту в чат на сайте.</p>
                  </div>

                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '320px 1fr', 
                    height: '600px', 
                    background: '#0f0f15', 
                    border: '1px solid #1f1f2e', 
                    borderRadius: '24px',
                    overflow: 'hidden'
                  }}>
                    {/* Chat Sidebar (Threads) */}
                    <div style={{ borderRight: '1px solid #1f1f2e', display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.15)' }}>
                      <div style={{ padding: '1.5rem', borderBottom: '1px solid #1f1f2e' }}>
                        <h4 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: '800' }}>Диалоги ({chats.length})</h4>
                        <div style={{ position: 'relative' }}>
                          <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                          <input 
                            type="text" 
                            placeholder="Поиск диалога..." 
                            style={{ 
                              width: '100%', 
                              background: 'rgba(0,0,0,0.25)', 
                              border: '1px solid rgba(255,255,255,0.05)', 
                              borderRadius: '8px', 
                              padding: '0.5rem 0.5rem 0.5rem 2rem', 
                              color: '#fff', 
                              fontSize: '0.8rem',
                              outline: 'none' 
                            }} 
                          />
                        </div>
                      </div>

                      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                        {chats.length === 0 ? (
                          <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
                            Нет активных переписок.
                          </div>
                        ) : (
                          chats.map(chat => {
                            const lastMsg = chat.messages[chat.messages.length - 1];
                            const isSelected = activeChatId === chat.id;
                            return (
                              <button
                                key={chat.id}
                                onClick={() => setActiveChatId(chat.id)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  gap: '1rem',
                                  padding: '1.25rem 1.5rem',
                                  border: 'none',
                                  borderBottom: '1px solid rgba(255,255,255,0.01)',
                                  background: isSelected ? 'rgba(0, 255, 65, 0.05)' : 'transparent',
                                  color: '#fff',
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  transition: '0.2s'
                                }}
                                onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.01)'; }}
                                onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                              >
                                <div style={{ 
                                  width: '38px', 
                                  height: '38px', 
                                  borderRadius: '50%', 
                                  background: 'rgba(0,255,65,0.05)', 
                                  border: `1px solid ${isSelected ? '#00ff41' : 'rgba(255,255,255,0.1)'}`,
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  color: '#00ff41',
                                  fontWeight: '900',
                                  fontSize: '0.9rem',
                                  flexShrink: 0
                                }}>
                                  {chat.client_name.charAt(0)}
                                </div>
                                <div style={{ flex: 1, overflow: 'hidden' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                                    <span style={{ fontWeight: '800', fontSize: '0.85rem' }}>{chat.client_name}</span>
                                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>
                                      {lastMsg ? new Date(lastMsg.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : ''}
                                    </span>
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                    {lastMsg ? lastMsg.text : 'Диалог пуст'}
                                  </div>
                                </div>
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Chat Messages Log */}
                    <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.05)' }}>
                      {activeChatId ? (
                        <>
                          {/* Chat Window Header */}
                          {chats.filter(c => c.id === activeChatId).map(chat => (
                            <div key={chat.id} style={{ padding: '1.25rem 2rem', borderBottom: '1px solid #1f1f2e', background: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <h4 style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: '800' }}>{chat.client_name}</h4>
                                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                                  📞 {chat.client_phone} | Статус: <span style={{ color: '#00ff41', fontWeight: '800' }}>онлайн</span>
                                </div>
                              </div>
                            </div>
                          ))}

                          {/* Message List */}
                          <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {chats.filter(c => c.id === activeChatId)[0]?.messages.map((msg, i) => {
                              const isClient = msg.sender === 'client';
                              return (
                                <div 
                                  key={i} 
                                  style={{ 
                                    display: 'flex', 
                                    justifyContent: isClient ? 'flex-start' : 'flex-end' 
                                  }}
                                >
                                  <div style={{ 
                                    maxWidth: '65%',
                                    background: isClient ? '#181822' : 'rgba(0, 255, 65, 0.08)',
                                    border: isClient ? '1px solid rgba(255,255,255,0.03)' : '1px solid rgba(0, 255, 65, 0.2)',
                                    padding: '1rem 1.25rem',
                                    borderRadius: isClient ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                                    color: '#fff',
                                    fontSize: '0.85rem',
                                    lineHeight: '1.5',
                                    position: 'relative'
                                  }}>
                                    <div style={{ marginBottom: '0.25rem' }}>{msg.text}</div>
                                    <div style={{ 
                                      fontSize: '0.65rem', 
                                      color: 'rgba(255,255,255,0.3)', 
                                      textAlign: 'right',
                                      marginTop: '0.25rem'
                                    }}>
                                      {new Date(msg.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                            <div ref={chatEndRef} />
                          </div>

                          {/* Message Input Box */}
                          <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid #1f1f2e', background: 'rgba(0,0,0,0.25)', display: 'flex', gap: '1rem' }}>
                            <input 
                              type="text" 
                              placeholder="Напишите ответ..."
                              value={chatMessageInput}
                              onChange={(e) => setChatMessageInput(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                              style={{
                                flex: 1,
                                background: 'rgba(0,0,0,0.4)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '12px',
                                padding: '1rem',
                                color: '#fff',
                                outline: 'none'
                              }}
                            />
                            <button 
                              onClick={handleSendMessage}
                              style={{
                                background: '#00ff41',
                                color: '#000',
                                border: 'none',
                                borderRadius: '12px',
                                width: '50px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: '0.2s'
                              }}
                            >
                              <Send size={18} />
                            </button>
                          </div>
                        </>
                      ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)' }}>
                          Выберите диалог для просмотра истории переписки
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* USERS & ROLES SECTION */}
              {activeSection === 'users' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                      <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.02em', margin: '0 0 0.5rem' }}>Пользователи и роли</h1>
                      <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>Регулирование прав доступа сотрудников к CRM, выдача ролей администратором и отслеживание статуса</p>
                    </div>

                    {currentUser.role !== 'admin' && (
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '0.75rem 1.25rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700' }}>
                        <ShieldAlert size={16} />
                        <span>Только Администратор может менять роли и пользователей</span>
                      </div>
                    )}
                  </div>

                  {/* Users Section Navigation */}
                  <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #1f1f2e', marginBottom: '2rem', paddingBottom: '0.2rem' }}>
                    <button
                      onClick={() => setUsersSubTab('employees')}
                      style={{
                        background: 'none',
                        border: 'none',
                        borderBottom: usersSubTab === 'employees' ? '2px solid #00ff41' : '2px solid transparent',
                        color: usersSubTab === 'employees' ? '#00ff41' : 'rgba(255,255,255,0.4)',
                        padding: '0.75rem 1rem',
                        fontWeight: '800',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        transition: '0.2s'
                      }}
                    >
                      Сотрудники
                    </button>
                    <button
                      onClick={() => setUsersSubTab('permissions')}
                      style={{
                        background: 'none',
                        border: 'none',
                        borderBottom: usersSubTab === 'permissions' ? '2px solid #00ff41' : '2px solid transparent',
                        color: usersSubTab === 'permissions' ? '#00ff41' : 'rgba(255,255,255,0.4)',
                        padding: '0.75rem 1rem',
                        fontWeight: '800',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        transition: '0.2s'
                      }}
                    >
                      Настройка прав и вкладок
                    </button>
                  </div>

                  {usersSubTab === 'employees' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
                      {/* Users List */}
                      <div style={{ background: '#0f0f15', border: '1px solid #1f1f2e', borderRadius: '20px', overflow: 'hidden' }}>
                        <div style={{ padding: '2rem', borderBottom: '1px solid #1f1f2e' }}>
                          <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>Сотрудники компании ({users.length})</h4>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          {users.map(u => (
                            <div 
                              key={u.id}
                              style={{ 
                                padding: '1.5rem 2rem', 
                                borderBottom: '1px solid rgba(255,255,255,0.02)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <img src={u.avatar} alt="avatar" style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover' }} />
                                <div>
                                  <div style={{ fontWeight: '800', fontSize: '1rem', color: '#fff' }}>{u.name}</div>
                                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{u.email}</div>
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                {/* Role Selector */}
                                <div>
                                  <select
                                    value={u.role}
                                    disabled={currentUser.role !== 'admin' || u.id === currentUser.id}
                                    onChange={(e) => handleUpdateUserRole(u.id, e.target.value as any)}
                                    style={{
                                      background: 'rgba(0,0,0,0.3)',
                                      border: '1px solid rgba(255,255,255,0.08)',
                                      borderRadius: '8px',
                                      padding: '0.5rem 1rem',
                                      color: '#fff',
                                      fontWeight: '700',
                                      fontSize: '0.8rem',
                                      outline: 'none',
                                      cursor: currentUser.role === 'admin' && u.id !== currentUser.id ? 'pointer' : 'not-allowed'
                                    }}
                                  >
                                    <option value="admin">Администратор</option>
                                    <option value="manager">Менеджер</option>
                                    <option value="specialist">Специалист</option>
                                    <option value="auditor">Аудитор</option>
                                  </select>
                                </div>

                                {/* Status indicator */}
                                <button
                                  onClick={() => handleToggleUserStatus(u.id)}
                                  disabled={currentUser.role !== 'admin' || u.id === currentUser.id}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    cursor: currentUser.role === 'admin' && u.id !== currentUser.id ? 'pointer' : 'not-allowed',
                                    color: u.status === 'active' ? '#00ff41' : 'rgba(255,255,255,0.3)',
                                    fontWeight: '800',
                                    fontSize: '0.8rem'
                                  }}
                                >
                                  <span style={{ 
                                    width: '8px', 
                                    height: '8px', 
                                    borderRadius: '50%', 
                                    background: u.status === 'active' ? '#00ff41' : 'rgba(255,255,255,0.3)',
                                    boxShadow: u.status === 'active' ? '0 0 10px #00ff41' : 'none'
                                  }} />
                                  {u.status === 'active' ? 'Активен' : 'Заблокирован'}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Add User form card */}
                      <div style={{ background: '#0f0f15', border: '1px solid #1f1f2e', borderRadius: '20px', padding: '2rem' }}>
                        <h4 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', fontWeight: '800' }}>Зарегистрировать сотрудника</h4>
                        
                        <form onSubmit={handleAddCrmUser} style={{ display: 'grid', gap: '1.25rem' }}>
                          <div style={{ display: 'grid', gap: '0.4rem' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>ФИО сотрудника</label>
                            <input 
                              type="text" 
                              name="name" 
                              placeholder="Иван Петров" 
                              required
                              disabled={currentUser.role !== 'admin'}
                              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.75rem', borderRadius: '8px', color: '#fff', outline: 'none' }} 
                            />
                          </div>
                          <div style={{ display: 'grid', gap: '0.4rem' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Email адрес</label>
                            <input 
                              type="email" 
                              name="email" 
                              placeholder="petrov@demetra.kz" 
                              required
                              disabled={currentUser.role !== 'admin'}
                              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.75rem', borderRadius: '8px', color: '#fff', outline: 'none' }} 
                            />
                          </div>
                          <div style={{ display: 'grid', gap: '0.4rem' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Должность / Роль</label>
                            <select 
                              name="role" 
                              disabled={currentUser.role !== 'admin'}
                              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.75rem', borderRadius: '8px', color: '#fff', outline: 'none', cursor: 'pointer' }}
                            >
                              <option value="specialist">Специалист</option>
                              <option value="manager">Менеджер</option>
                              <option value="admin">Администратор</option>
                              <option value="auditor">Аудитор</option>
                            </select>
                          </div>

                          <button 
                            type="submit" 
                            disabled={currentUser.role !== 'admin'}
                            style={{ 
                              background: currentUser.role === 'admin' ? '#00ff41' : 'rgba(255,255,255,0.05)', 
                              color: currentUser.role === 'admin' ? '#000' : 'rgba(255,255,255,0.3)', 
                              border: 'none', 
                              padding: '1rem', 
                              borderRadius: '8px', 
                              fontWeight: '900', 
                              cursor: currentUser.role === 'admin' ? 'pointer' : 'not-allowed',
                              marginTop: '0.5rem',
                              transition: '0.2s'
                            }}
                          >
                            Создать аккаунт
                          </button>
                        </form>
                      </div>
                    </div>
                  ) : (
                    /* Role permissions matrix */
                    <div style={{ background: '#0f0f15', border: '1px solid #1f1f2e', borderRadius: '20px', padding: '2rem' }}>
                      <h4 style={{ margin: '0 0 1rem', fontSize: '1.2rem', fontWeight: '800' }}>Матрица доступа к разделам CRM</h4>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '2rem' }}>
                        Отметьте разделы, которые должны отображаться в боковом меню для каждой роли. Изменения сохраняются автоматически.
                      </p>
                      
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid #1f1f2e', color: 'rgba(255,255,255,0.4)', fontWeight: '800' }}>
                              <th style={{ padding: '1.25rem 2rem' }}>Раздел меню</th>
                              {['admin', 'manager', 'specialist', 'auditor'].map(r => (
                                <th key={r} style={{ padding: '1.25rem 1rem', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                                  {r === 'admin' ? 'Администратор' :
                                   r === 'manager' ? 'Менеджер' :
                                   r === 'specialist' ? 'Специалист' : 'Аудитор'}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { id: 'analytics', label: '📊 Аналитика и статистика' },
                              { id: 'leads', label: '📋 Список заявок / заказов' },
                              { id: 'clients', label: '👤 Управление клиентами' },
                              { id: 'chats', label: '💬 История переписки' },
                              { id: 'users', label: '🔐 Настройка пользователей (права)' }
                            ].map(tab => (
                              <tr key={tab.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                <td style={{ padding: '1.5rem 2rem', fontWeight: '800', color: '#fff' }}>{tab.label}</td>
                                {['admin', 'manager', 'specialist', 'auditor'].map(role => {
                                  const rolePerm = permissions.find(p => p.role === role);
                                  const isChecked = rolePerm ? rolePerm.allowed_tabs.includes(tab.id as any) : false;
                                  const isDisabled = currentUser.role !== 'admin'; // only admins can change permissions
                                  
                                  return (
                                    <td key={role} style={{ padding: '1.5rem 1rem' }}>
                                      <input 
                                        type="checkbox"
                                        checked={isChecked}
                                        disabled={isDisabled}
                                        onChange={(e) => {
                                          if (currentUser.role !== 'admin') return;
                                          // Update permissions
                                          const updatedPerms = permissions.map(p => {
                                            if (p.role === role) {
                                              let newTabs = [...p.allowed_tabs];
                                              if (e.target.checked) {
                                                if (!newTabs.includes(tab.id as any)) {
                                                  newTabs.push(tab.id as any);
                                                }
                                              } else {
                                                newTabs = newTabs.filter(t => t !== tab.id);
                                              }
                                              return { ...p, allowed_tabs: newTabs };
                                            }
                                            return p;
                                          });
                                          savePermissionsData(updatedPerms);
                                        }}
                                        style={{ 
                                          width: '18px', 
                                          height: '18px', 
                                          cursor: isDisabled ? 'not-allowed' : 'pointer',
                                          accentColor: '#00ff41'
                                        }}
                                      />
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ACCOUNTING SECTION */}
              {activeSection === 'accounting' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                      <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.02em', margin: '0 0 0.5rem' }}>Чеки и бухгалтерия</h1>
                      <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>Автоматизация учета для ТОО "Antygravity" (Общий режим налогообложения, НДС 12%)</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: windowWidth >= 1150 ? '1.2fr 1fr' : '1fr', gap: '2rem' }}>
                    {/* Left Column: Form */}
                    <div style={{ background: '#0f0f15', border: '1px solid #1f1f2e', borderRadius: '24px', padding: '2rem' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.5rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <DollarSign size={20} style={{ color: '#ec4899' }} /> Параметры заказа
                      </h3>

                      {(() => {
                        const completedLeads = leads.filter(l => l.status === 'completed' || l.status === 'processing');
                        if (completedLeads.length === 0) return null;
                        return (
                          <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(236, 72, 153, 0.04)', border: '1px solid rgba(236, 72, 153, 0.15)', borderRadius: '12px' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem', fontWeight: '700' }}>
                              Заполнить на основе завершенной сделки CRM:
                            </label>
                            <select 
                              onChange={(e) => {
                                const lead = leads.find(l => l.id === e.target.value);
                                if (!lead) return;
                                setAccClientName(lead.name);
                                setAccService(lead.message ? lead.message.slice(0, 80) : 'Услуги и поставка оборудования');
                                
                                const totalAmount = lead.amount || 0;
                                const priceWithoutVat = Math.round(totalAmount / 1.12);
                                setAccPriceWithoutVat(priceWithoutVat);
                                setAccQuantity(1);
                                
                                try {
                                  const dateStr = new Date(lead.created_at).toISOString().split('T')[0];
                                  setAccDate(dateStr);
                                } catch (err) {
                                  setAccDate(new Date().toISOString().split('T')[0]);
                                }
                              }}
                              defaultValue=""
                              style={{ width: '100%', background: '#070709', border: '1px solid #1f1f2e', borderRadius: '8px', color: '#fff', padding: '0.6rem 0.8rem', outline: 'none', fontSize: '0.85rem' }}
                            >
                              <option value="" disabled>-- Выберите сделку --</option>
                              {completedLeads.map(l => (
                                <option key={l.id} value={l.id}>
                                  {l.name} — {l.amount.toLocaleString('ru-RU')} ₸ ({l.message ? l.message.slice(0, 30) + '...' : 'Без описания'})
                                </option>
                              ))}
                            </select>
                          </div>
                        );
                      })()}

                      <form 
                        onSubmit={async (e) => {
                          e.preventDefault();
                          setAccLoading(true);
                          setAccError('');
                          setAccResult(null);
                          try {
                            const payload = {
                              order_number: accOrderNumber,
                              date: accDate,
                              client_name: accClientName,
                              client_bin: accClientBin,
                              service: accService,
                              quantity: accQuantity,
                              price_without_vat: accPriceWithoutVat,
                              payment_method: accPaymentMethod
                            };
                            
                            const res = await fetch('/api/crm/accounting/generate', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json'
                              },
                              body: JSON.stringify(payload)
                            });
                            
                            if (!res.ok) {
                              const txt = await res.text();
                              throw new Error(txt || 'Ошибка при генерации файлов');
                            }
                            
                            const data = await res.json();
                            if (data.success) {
                              setAccResult({ pdf: data.pdf, csv: data.csv });
                            } else {
                              throw new Error('Не удалось сгенерировать документы.');
                            }
                          } catch (err: any) {
                            setAccError(err.message || 'Произошла непредвиденная ошибка');
                          } finally {
                            setAccLoading(false);
                          }
                        }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                      >
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1rem' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.35rem', fontWeight: '700' }}>Номер заказа (№)</label>
                            <input 
                              type="text" 
                              value={accOrderNumber} 
                              onChange={(e) => setAccOrderNumber(e.target.value)}
                              required
                              style={{ width: '100%', background: '#070709', border: '1px solid #1f1f2e', borderRadius: '8px', color: '#fff', padding: '0.75rem', boxSizing: 'border-box' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.35rem', fontWeight: '700' }}>Дата совершения оборота</label>
                            <input 
                              type="date" 
                              value={accDate} 
                              onChange={(e) => setAccDate(e.target.value)}
                              required
                              style={{ width: '100%', background: '#070709', border: '1px solid #1f1f2e', borderRadius: '8px', color: '#fff', padding: '0.75rem', boxSizing: 'border-box' }}
                            />
                          </div>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.35rem', fontWeight: '700' }}>Наименование клиента (ФИО / ТОО)</label>
                          <input 
                            type="text" 
                            value={accClientName} 
                            onChange={(e) => setAccClientName(e.target.value)}
                            placeholder="ТОО Компания"
                            required
                            style={{ width: '100%', background: '#070709', border: '1px solid #1f1f2e', borderRadius: '8px', color: '#fff', padding: '0.75rem', boxSizing: 'border-box' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.35rem', fontWeight: '700' }}>БИН / ИИН клиента (12 цифр)</label>
                          <input 
                            type="text" 
                            value={accClientBin} 
                            onChange={(e) => setAccClientBin(e.target.value)}
                            placeholder="123456789012"
                            required
                            maxLength={12}
                            style={{ width: '100%', background: '#070709', border: '1px solid #1f1f2e', borderRadius: '8px', color: '#fff', padding: '0.75rem', boxSizing: 'border-box' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.35rem', fontWeight: '700' }}>Описание услуги или товара</label>
                          <input 
                            type="text" 
                            value={accService} 
                            onChange={(e) => setAccService(e.target.value)}
                            placeholder="Услуги стыковки резинотканевой ленты"
                            required
                            style={{ width: '100%', background: '#070709', border: '1px solid #1f1f2e', borderRadius: '8px', color: '#fff', padding: '0.75rem', boxSizing: 'border-box' }}
                          />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.35rem', fontWeight: '700' }}>Количество</label>
                            <input 
                              type="number" 
                              value={accQuantity} 
                              onChange={(e) => setAccQuantity(parseInt(e.target.value) || 1)}
                              min={1}
                              required
                              style={{ width: '100%', background: '#070709', border: '1px solid #1f1f2e', borderRadius: '8px', color: '#fff', padding: '0.75rem', boxSizing: 'border-box' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.35rem', fontWeight: '700' }}>Цена без НДС (₸)</label>
                            <input 
                              type="number" 
                              value={accPriceWithoutVat} 
                              onChange={(e) => setAccPriceWithoutVat(parseInt(e.target.value) || 0)}
                              min={0}
                              required
                              style={{ width: '100%', background: '#070709', border: '1px solid #1f1f2e', borderRadius: '8px', color: '#fff', padding: '0.75rem', boxSizing: 'border-box' }}
                            />
                          </div>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.35rem', fontWeight: '700' }}>Способ оплаты</label>
                          <select 
                            value={accPaymentMethod} 
                            onChange={(e) => setAccPaymentMethod(e.target.value)}
                            style={{ width: '100%', background: '#070709', border: '1px solid #1f1f2e', borderRadius: '8px', color: '#fff', padding: '0.75rem', outline: 'none' }}
                          >
                            <option value="безналичные">Безналичный расчет (банк)</option>
                            <option value="наличные">Наличные средства</option>
                            <option value="карта">Банковская карта</option>
                          </select>
                        </div>

                        <button 
                          type="submit" 
                          disabled={accLoading}
                          style={{
                            background: '#ec4899',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '1rem',
                            fontWeight: '800',
                            fontSize: '1rem',
                            cursor: accLoading ? 'not-allowed' : 'pointer',
                            marginTop: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            transition: '0.2s'
                          }}
                          onMouseEnter={(e) => { if (!accLoading) e.currentTarget.style.background = '#d946ef'; }}
                          onMouseLeave={(e) => { if (!accLoading) e.currentTarget.style.background = '#ec4899'; }}
                        >
                          {accLoading ? (
                            <>
                              <RefreshCw size={18} className="animate-spin" />
                              <span>Генерация документов...</span>
                            </>
                          ) : (
                            <>
                              <FileText size={18} />
                              <span>Сгенерировать PDF + CSV</span>
                            </>
                          )}
                        </button>

                        {accError && (
                          <div style={{ color: '#ff4b4b', background: 'rgba(255,75,75,0.08)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', border: '1px solid rgba(255,75,75,0.2)' }}>
                            {accError}
                          </div>
                        )}
                      </form>
                    </div>

                    {/* Right Column: Calculations Preview & Download Panel */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      {/* Calculations Panel */}
                      <div style={{ background: '#0f0f15', border: '1px solid #1f1f2e', borderRadius: '24px', padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.5rem', color: '#fff' }}>
                          Расчет налогов и регламентов (РК)
                        </h3>

                        {(() => {
                          try {
                            const dt = new Date(accDate);
                            if (isNaN(dt.getTime())) return <p style={{ color: 'rgba(255,255,255,0.3)' }}>Введите корректную дату и цену для расчета.</p>;
                            const year = dt.getFullYear();
                            const month = dt.getMonth() + 1;
                            const quarter = Math.floor((month - 1) / 3) + 1;
                            
                            let vatDeadline = '';
                            if (quarter === 1) vatDeadline = `15.05.${year}`;
                            else if (quarter === 2) vatDeadline = `15.08.${year}`;
                            else if (quarter === 3) vatDeadline = `15.11.${year}`;
                            else vatDeadline = `15.02.${year + 1}`;
                            
                            const esfDate = new Date(dt.getTime() + 15 * 24 * 60 * 60 * 1000);
                            const esfDeadline = `${String(esfDate.getDate()).padStart(2, '0')}.${String(esfDate.getMonth() + 1).padStart(2, '0')}.${esfDate.getFullYear()}`;
                            
                            const amountWithoutVat = accQuantity * accPriceWithoutVat;
                            const vatAmount = amountWithoutVat * 0.12;
                            const totalWithVat = amountWithoutVat + vatAmount;
                            const estimatedKpn = amountWithoutVat * 0.20;

                            return (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.75rem' }}>
                                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Облагаемый оборот (без НДС):</span>
                                  <span style={{ fontWeight: '800', color: '#fff' }}>{amountWithoutVat.toLocaleString('ru-RU')} ₸</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.75rem' }}>
                                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>НДС (12%):</span>
                                  <span style={{ fontWeight: '800', color: '#ec4899' }}>{vatAmount.toLocaleString('ru-RU')} ₸</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.75rem' }}>
                                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Всего к оплате (с НДС):</span>
                                  <span style={{ fontWeight: '900', color: '#00ff41', fontSize: '1.1rem' }}>{totalWithVat.toLocaleString('ru-RU')} ₸</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.75rem' }}>
                                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Ориентировочный КПН (20%):</span>
                                  <span style={{ fontWeight: '800', color: '#3b82f6' }}>{estimatedKpn.toLocaleString('ru-RU')} ₸</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.75rem' }}>
                                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Налоговый период (Квартал):</span>
                                  <span style={{ fontWeight: '800', color: '#f59e0b' }}>{quarter}-й квартал</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.75rem' }}>
                                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Срок сдачи Декларации (Ф.300.00):</span>
                                  <span style={{ fontWeight: '800', color: '#fff' }}>до {vatDeadline}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Срок выписки ЭСФ (esf.gov.kz):</span>
                                  <span style={{ fontWeight: '800', color: '#fff' }}>до {esfDeadline}</span>
                                </div>
                              </div>
                            );
                          } catch (err) {
                            return <p style={{ color: 'rgba(255,255,255,0.3)' }}>Введите корректную дату и цену для расчета.</p>;
                          }
                        })()}
                      </div>

                      {/* Download Section */}
                      <div style={{ background: '#0f0f15', border: '1px solid #1f1f2e', borderRadius: '24px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff', margin: 0 }}>
                          Выгрузка документов
                        </h3>

                        {accResult ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ color: '#00ff41', background: 'rgba(0,255,65,0.06)', border: '1px solid rgba(0,255,65,0.2)', padding: '1rem', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '700' }}>
                              ✓ Документы успешно сформированы!
                            </div>

                            <a 
                              href={`/api/crm/accounting/download?file=${encodeURIComponent(accResult.pdf)}`}
                              download
                              style={{
                                background: 'rgba(0, 255, 65, 0.08)',
                                border: '1px solid rgba(0, 255, 65, 0.3)',
                                borderRadius: '12px',
                                color: '#00ff41',
                                padding: '1rem',
                                fontWeight: '800',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                transition: '0.2s'
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0, 255, 65, 0.15)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0, 255, 65, 0.08)'; }}
                            >
                              <Download size={18} />
                              Скачать Чек и Акт (PDF)
                            </a>

                            <a 
                              href={`/api/crm/accounting/download?file=${encodeURIComponent(accResult.csv)}`}
                              download
                              style={{
                                background: 'rgba(255, 255, 255, 0.04)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                color: '#fff',
                                padding: '1rem',
                                fontWeight: '800',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                transition: '0.2s'
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; }}
                            >
                              <Download size={18} />
                              Экспорт в 1С (CSV)
                            </a>
                          </div>
                        ) : (
                          <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)', border: '1px dashed #1f1f2e', borderRadius: '16px' }}>
                            Заполните форму слева и нажмите «Сгенерировать», чтобы подготовить файлы для скачивания.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ADMIN SUB-SECTIONS (INLINE MODE) */}
              {['products', 'services', 'builder', 'content', 'pages', 'settings', 'assistant'].includes(activeSection) && (
                <Admin inlineMode={true} activeTab={activeSection} onBack={() => setActiveSection('dashboard')} />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {isEditModalOpen && selectedLead && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(5, 5, 8, 0.85)',
              backdropFilter: 'blur(10px)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem'
            }}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 15 }} 
              style={{
                background: '#0f0f15',
                border: '1px solid rgba(0, 255, 65, 0.15)',
                borderRadius: '24px',
                width: '95vw',
                maxWidth: '1200px',
                height: '90vh',
                maxHeight: '850px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
                overflow: 'hidden'
              }}
            >
              {/* Modal Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.5rem 2rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                background: 'rgba(255, 255, 255, 0.01)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: '900', letterSpacing: '-0.02em', color: '#fff' }}>
                    Карточка сделки № {selectedLead.id.split('_')[1] || selectedLead.id}
                  </h3>
                  {/* Shift Mode Toggle */}
                  <button 
                    onClick={() => setIsShiftEnded(!isShiftEnded)}
                    style={{
                      background: isShiftEnded ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0, 255, 65, 0.1)',
                      border: `1px solid ${isShiftEnded ? 'rgba(239, 68, 68, 0.3)' : 'rgba(0, 255, 65, 0.3)'}`,
                      borderRadius: '30px',
                      color: isShiftEnded ? '#ef4444' : '#00ff41',
                      padding: '0.4rem 1rem',
                      fontSize: '0.8rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: '0.2s'
                    }}
                  >
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: isShiftEnded ? '#ef4444' : '#00ff41',
                      display: 'inline-block'
                    }} />
                    {isShiftEnded ? 'Смена окончена' : 'Смена активна'}
                  </button>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                  <X size={24} />
                </button>
              </div>

              {/* WORKFLOW PROGRESS & ACTIONS BAR */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                padding: '1.25rem 2rem',
                display: 'flex',
                flexDirection: windowWidth >= 1024 ? 'row' : 'column',
                justifyContent: 'space-between',
                alignItems: windowWidth >= 1024 ? 'center' : 'stretch',
                gap: '1.5rem'
              }}>
                {/* 1. Progress Steps Tracker */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {(() => {
                    const stages: { key: Lead['status'] | 'finished'; label: string }[] = [
                      { key: 'new', label: 'Новая' },
                      { key: 'processing', label: 'В работе' },
                      { key: 'dozhim', label: 'Дожим' },
                      { key: 'manager_op', label: 'Менеджер ОП' },
                      { key: 'rop', label: 'РОП' },
                      { key: 'financier', label: 'Финансист' },
                      { key: 'finished', label: 'Завершено' }
                    ];

                    const currentIdx = stages.findIndex(s => {
                      if (s.key === 'finished') {
                        return editStatus === 'completed' || editStatus === 'rejected';
                      }
                      return s.key === editStatus;
                    });

                    return stages.map((stage, idx) => {
                      const isActive = idx === currentIdx;
                      const isPast = idx < currentIdx;
                      let color = 'rgba(255, 255, 255, 0.3)';
                      let border = '1px solid rgba(255, 255, 255, 0.1)';
                      let bg = 'transparent';

                      if (isActive) {
                        if (editStatus === 'completed') {
                          color = '#00ff41';
                          border = '1px solid #00ff41';
                          bg = 'rgba(0, 255, 65, 0.1)';
                        } else if (editStatus === 'rejected') {
                          color = '#ef4444';
                          border = '1px solid #ef4444';
                          bg = 'rgba(239, 68, 68, 0.1)';
                        } else {
                          color = '#3b82f6';
                          border = '1px solid #3b82f6';
                          bg = 'rgba(59, 130, 246, 0.15)';
                        }
                      } else if (isPast) {
                        color = 'rgba(0, 255, 65, 0.8)';
                      }

                      return (
                        <React.Fragment key={stage.key}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '30px',
                            background: bg,
                            border: border,
                            color: color,
                            fontSize: '0.75rem',
                            fontWeight: '800',
                            transition: '0.2s'
                          }}>
                            {isPast && <Check size={12} />}
                            {stage.label}
                          </div>
                          {idx < stages.length - 1 && (
                            <div style={{
                              width: '15px',
                              height: '1px',
                              background: idx < currentIdx ? 'rgba(0, 255, 65, 0.4)' : 'rgba(255, 255, 255, 0.1)'
                            }} />
                          )}
                        </React.Fragment>
                      );
                    });
                  })()}
                </div>

                {/* 2. Action Controls */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                  opacity: isShiftEnded ? 0.4 : 1,
                  pointerEvents: isShiftEnded ? 'none' : 'auto'
                }}>
                  {/* Transition actions */}
                  {editStatus === 'new' && (
                    <button
                      onClick={() => {
                        setEditStatus('processing');
                        setEditAssignedTo(currentUser.name);
                        setEditComments(editComments + (editComments ? '\n' : '') + `[${new Date().toLocaleTimeString().slice(0,5)}] ${currentUser.name} принял заявку в работу.`);
                      }}
                      style={{
                        background: '#00ff41',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#000',
                        padding: '0.5rem 1rem',
                        fontWeight: '900',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <CheckCircle2 size={14} /> Принять в работу
                    </button>
                  )}

                  {editStatus !== 'completed' && editStatus !== 'rejected' && (
                    <>
                      <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase' }}>
                        Передать:
                      </span>

                      {editStatus !== 'manager_op' && (
                        <button
                          onClick={() => {
                            setEditStatus('manager_op');
                            setEditComments(editComments + (editComments ? '\n' : '') + `[${new Date().toLocaleTimeString().slice(0,5)}] Заявка передана в отдел Менеджера ОП.`);
                          }}
                          style={{
                            background: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            borderRadius: '8px',
                            color: '#3b82f6',
                            padding: '0.4rem 0.8rem',
                            fontWeight: '800',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                          }}
                        >
                          Менеджеру ОП
                        </button>
                      )}

                      {editStatus !== 'rop' && (
                        <button
                          onClick={() => {
                            setEditStatus('rop');
                            setEditComments(editComments + (editComments ? '\n' : '') + `[${new Date().toLocaleTimeString().slice(0,5)}] Заявка передана РОПу.`);
                          }}
                          style={{
                            background: 'rgba(139, 92, 246, 0.1)',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                            borderRadius: '8px',
                            color: '#8b5cf6',
                            padding: '0.4rem 0.8rem',
                            fontWeight: '800',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                          }}
                        >
                          РОПу
                        </button>
                      )}

                      {editStatus !== 'financier' && (
                        <button
                          onClick={() => {
                            setEditStatus('financier');
                            setEditComments(editComments + (editComments ? '\n' : '') + `[${new Date().toLocaleTimeString().slice(0,5)}] Заявка передана Финансисту.`);
                          }}
                          style={{
                            background: 'rgba(245, 158, 11, 0.1)',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            borderRadius: '8px',
                            color: '#f59e0b',
                            padding: '0.4rem 0.8rem',
                            fontWeight: '800',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                          }}
                        >
                          Финансисту
                        </button>
                      )}

                      {editStatus !== 'dozhim' && (
                        <button
                          onClick={() => {
                            setEditStatus('dozhim');
                            setEditComments(editComments + (editComments ? '\n' : '') + `[${new Date().toLocaleTimeString().slice(0,5)}] Заявка отправлена в Дожим.`);
                          }}
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            color: '#fff',
                            padding: '0.4rem 0.8rem',
                            fontWeight: '800',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                          }}
                        >
                          В Дожим
                        </button>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '0.2rem 0.5rem' }}>
                        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: '800' }}>ОТВ:</span>
                        <select
                          value={editAssignedTo}
                          onChange={(e) => {
                            const prev = editAssignedTo;
                            const next = e.target.value;
                            setEditAssignedTo(next);
                            setEditComments(editComments + (editComments ? '\n' : '') + `[${new Date().toLocaleTimeString().slice(0,5)}] Ответственный изменен с ${prev || 'нет'} на ${next}.`);
                          }}
                          style={{ background: 'none', border: 'none', color: '#fff', fontSize: '0.75rem', fontWeight: '800', outline: 'none', cursor: 'pointer', padding: '0.2rem' }}
                        >
                          <option value="">Не назначен</option>
                          {users.map(u => (
                            <option key={u.id} value={u.name}>{u.name}</option>
                          ))}
                        </select>
                      </div>

                      <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' }} />

                      <button
                        onClick={() => {
                          setEditStatus('completed');
                          setEditComments(editComments + (editComments ? '\n' : '') + `[${new Date().toLocaleTimeString().slice(0,5)}] Сделка успешно завершена!`);
                        }}
                        style={{
                          background: 'rgba(0, 255, 65, 0.1)',
                          border: '1px solid rgba(0, 255, 65, 0.3)',
                          borderRadius: '8px',
                          color: '#00ff41',
                          padding: '0.4rem 0.8rem',
                          fontWeight: '800',
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        Успешно
                      </button>

                      <button
                        onClick={() => {
                          setEditStatus('rejected');
                          setEditComments(editComments + (editComments ? '\n' : '') + `[${new Date().toLocaleTimeString().slice(0,5)}] Отказ по сделке.`);
                        }}
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '8px',
                          color: '#ef4444',
                          padding: '0.4rem 0.8rem',
                          fontWeight: '800',
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        Отказ
                      </button>
                    </>
                  )}

                  {(editStatus === 'completed' || editStatus === 'rejected') && (
                    <button
                      onClick={() => {
                        setEditStatus('processing');
                        setEditComments(editComments + (editComments ? '\n' : '') + `[${new Date().toLocaleTimeString().slice(0,5)}] Сделка возвращена в работу.`);
                      }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#fff',
                        padding: '0.4rem 0.8rem',
                        fontWeight: '800',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      Вернуть в работу
                    </button>
                  )}
                </div>
              </div>

              {/* Scrollable Layout Body */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: windowWidth >= 968 ? '1.1fr 1.3fr' : '1fr',
                gap: '2rem',
                padding: '2rem',
                overflowY: 'auto',
                flex: 1
              }}>
                {/* Left Column: Form Parameters */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontWeight: '800', textTransform: 'uppercase' }}>
                      Имя клиента
                    </label>
                    <input 
                      type="text" 
                      value={editName}
                      disabled={isShiftEnded}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                      style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', padding: '0.75rem', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontWeight: '800', textTransform: 'uppercase' }}>
                        Телефон
                      </label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input 
                          type="text" 
                          value={editPhone}
                          disabled={isShiftEnded}
                          onChange={(e) => setEditPhone(e.target.value)}
                          required
                          style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', padding: '0.75rem', boxSizing: 'border-box' }}
                        />
                        <button 
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(editPhone);
                            alert('Телефон скопирован: ' + editPhone);
                          }}
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: '#fff',
                            padding: '0 1rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          копировать
                        </button>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontWeight: '800', textTransform: 'uppercase' }}>
                        Город
                      </label>
                      <select 
                        value={editCity}
                        disabled={isShiftEnded}
                        onChange={(e) => setEditCity(e.target.value)}
                        style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', padding: '0.75rem', outline: 'none' }}
                      >
                        <option value="Астана">Астана</option>
                        <option value="Алматы">Алматы</option>
                        <option value="Караганда">Караганда</option>
                        <option value="Шымкент">Шымкент</option>
                        <option value="Атырау">Атырау</option>
                        <option value="Усть-Каменогорск">Усть-Каменогорск</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontWeight: '800', textTransform: 'uppercase' }}>
                        Направление (Категория)
                      </label>
                      <select 
                        value={editCategory}
                        disabled={isShiftEnded}
                        onChange={(e) => {
                          const cat = e.target.value;
                          setEditCategory(cat);
                          const products = catalogProducts[cat] || [];
                          if (products.length > 0) {
                            setEditProduct(products[0]);
                          }
                        }}
                        style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', padding: '0.75rem', outline: 'none' }}
                      >
                        {catalogCategories.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontWeight: '800', textTransform: 'uppercase' }}>
                        Услуга / Товар
                      </label>
                      <select 
                        value={editProduct}
                        disabled={isShiftEnded}
                        onChange={(e) => setEditProduct(e.target.value)}
                        style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', padding: '0.75rem', outline: 'none' }}
                      >
                        {(catalogProducts[editCategory] || []).map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontWeight: '800', textTransform: 'uppercase' }}>
                      Точный адрес (Улица, Дом, Квартира)
                    </label>
                    <input 
                      type="text" 
                      value={editAddress}
                      disabled={isShiftEnded}
                      onChange={(e) => setEditAddress(e.target.value)}
                      placeholder="Улица Ленина, д. 15, кв. 42"
                      style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', padding: '0.75rem', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontWeight: '800', textTransform: 'uppercase' }}>
                      Особые комментарии (Причина обращения)
                    </label>
                    <textarea 
                      value={editComments}
                      disabled={isShiftEnded}
                      onChange={(e) => setEditComments(e.target.value)}
                      rows={3}
                      style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', padding: '0.75rem', boxSizing: 'border-box', resize: 'none' }}
                    />
                  </div>

                  {/* Attached files block */}
                  <div style={{ marginTop: '0.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontWeight: '800', textTransform: 'uppercase' }}>
                      Прикрепленные файлы
                    </label>
                    <div style={{ padding: '1.25rem', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '0.5rem' }}>Нет прикрепленных файлов</span>
                      <button 
                        type="button"
                        disabled={isShiftEnded}
                        onClick={() => alert('Функция загрузки файлов доступна в полной версии.')}
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          color: '#fff',
                          padding: '0.5rem 1rem',
                          fontSize: '0.8rem',
                          cursor: isShiftEnded ? 'not-allowed' : 'pointer'
                        }}
                      >
                        + Прикрепить файл (фото, чертеж)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column: Financial Data Cards & Chat */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Warning Block if Shift is Ended */}
                  {isShiftEnded && (
                    <div style={{
                      background: 'rgba(239, 68, 68, 0.08)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      borderRadius: '16px',
                      padding: '1.25rem',
                      display: 'flex',
                      gap: '0.75rem',
                      alignItems: 'flex-start',
                      color: '#ef4444',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      lineHeight: '1.4'
                    }}>
                      <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        ВАША СМЕНА ОКОНЧЕНА (ИЛИ ВЫХОДНОЙ)<br />
                        <span style={{ fontWeight: '400', color: 'rgba(239,68,68,0.8)' }}>
                          Все рабочие действия, калькуляторы и кнопки в карточке заблокированы до начала вашей следующей смены по графику.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Financial Data Card Title */}
                  <div style={{ background: '#07070a', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '20px', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                      <span style={{ fontSize: '1rem', fontWeight: '900', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <DollarSign size={18} style={{ color: '#00ff41' }} /> Финансовые данные карточки
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                        Удержания всего: <strong style={{ color: '#ef4444' }}>0 ₸</strong>
                      </span>
                    </div>

                    {/* calculations variables */}
                    {(() => {
                      const vat = Math.round(editPrice * 0.12);
                      const netAmount = editPrice - vat;
                      const totalCost = editCostPrice + editExtraExpense;
                      const netProfit = netAmount - totalCost - editMasterCommission - editBankCommission - editInstallmentCommission;
                      const rest = editPrice - editPrepayment - editIntermediatePayment;

                      const renderFinancialCard = (title: string, value: number, isEditable: boolean, bgColor: string, borderColor: string, textColor: string, setter?: (v: number) => void, subtext?: string) => {
                        return (
                          <div style={{
                            background: bgColor,
                            border: `1px solid ${borderColor}`,
                            borderRadius: '16px',
                            padding: '1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            minHeight: '85px',
                            boxSizing: 'border-box'
                          }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{title}</div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                              {isEditable && setter ? (
                                <input 
                                  type="number"
                                  value={value || 0}
                                  disabled={isShiftEnded}
                                  onChange={(e) => setter(parseInt(e.target.value) || 0)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: textColor,
                                    fontSize: '1.25rem',
                                    fontWeight: '900',
                                    width: '100%',
                                    outline: 'none',
                                    padding: 0,
                                    margin: 0
                                  }}
                                />
                              ) : (
                                <span style={{ fontSize: '1.25rem', fontWeight: '900', color: textColor }}>
                                  {value.toLocaleString('ru-RU')}
                                </span>
                              )}
                              <span style={{ fontSize: '0.9rem', color: textColor, fontWeight: '700' }}>₸</span>
                            </div>
                            {subtext && <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.2rem' }}>{subtext}</div>}
                          </div>
                        );
                      };

                      return (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                          {renderFinancialCard('Цена продажи', editPrice, true, 'rgba(0, 255, 65, 0.04)', 'rgba(0, 255, 65, 0.2)', '#00ff41', setEditPrice, 'итого клиенту')}
                          {renderFinancialCard('Очищенная сумма', netAmount, false, 'rgba(59, 130, 246, 0.04)', 'rgba(59, 130, 246, 0.2)', '#3b82f6', undefined, 'после налогов/комиссий')}
                          {renderFinancialCard('Себестоимость', editCostPrice, true, 'rgba(255, 255, 255, 0.02)', 'rgba(255, 255, 255, 0.1)', '#fff', setEditCostPrice, 'базовая себестоимость')}
                          
                          {renderFinancialCard('Доп. расход', editExtraExpense, true, 'rgba(245, 158, 11, 0.04)', 'rgba(245, 158, 11, 0.2)', '#f59e0b', setEditExtraExpense, 'в себестоимости, без наценки')}
                          {renderFinancialCard('Комиссия мастеру', editMasterCommission, true, 'rgba(245, 158, 11, 0.04)', 'rgba(245, 158, 11, 0.2)', '#f59e0b', setEditMasterCommission, 'доля/выплата мастеру')}
                          {renderFinancialCard('Прибыль очищенная', netProfit, false, 'rgba(0, 255, 65, 0.04)', 'rgba(0, 255, 65, 0.2)', '#00ff41', undefined, 'после С/С, мастера и банка')}
                          
                          {renderFinancialCard('Налоги всего', vat, false, 'rgba(239, 68, 68, 0.04)', 'rgba(239, 68, 68, 0.2)', '#ef4444', undefined, 'налог + налог с НДС')}
                          {renderFinancialCard('НДС (12%)', vat, false, 'rgba(139, 92, 246, 0.04)', 'rgba(139, 92, 246, 0.2)', '#8b5cf6', undefined, '12% при оплате с НДС')}
                          {renderFinancialCard('Комиссия банка', editBankCommission, true, 'rgba(255, 255, 255, 0.02)', 'rgba(255, 255, 255, 0.1)', '#fff', setEditBankCommission, 'если есть комиссии')}
                          
                          {renderFinancialCard('Комиссия рассрочки', editInstallmentCommission, true, 'rgba(255, 255, 255, 0.02)', 'rgba(255, 255, 255, 0.1)', '#fff', setEditInstallmentCommission, 'процент рассрочки')}
                          {renderFinancialCard('Предоплата', editPrepayment, true, 'rgba(59, 130, 246, 0.04)', 'rgba(59, 130, 246, 0.2)', '#3b82f6', setEditPrepayment, 'первый платеж')}
                          {renderFinancialCard('Промежуточная', editIntermediatePayment, true, 'rgba(59, 130, 246, 0.04)', 'rgba(59, 130, 246, 0.2)', '#3b82f6', setEditIntermediatePayment, 'средний платеж')}
                          
                          {renderFinancialCard('Остаток', rest, false, 'rgba(59, 130, 246, 0.04)', 'rgba(59, 130, 246, 0.2)', '#3b82f6', undefined, 'к оплате позже')}
                        </div>
                      );
                    })()}
                  </div>

                  {/* ЧАТ ПО ЗАЯВКЕ */}
                  <div style={{ background: '#07070a', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '20px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, minHeight: '220px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '900', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
                        Чат по заявке
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                        События и лог
                      </span>
                    </div>

                    <div style={{
                      flex: 1,
                      overflowY: 'auto',
                      maxHeight: '200px',
                      background: 'rgba(0,0,0,0.2)',
                      borderRadius: '12px',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}>
                      <div style={{ fontSize: '0.8rem', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderLeft: '3px solid #3b82f6', borderRadius: '4px', color: 'rgba(255,255,255,0.7)' }}>
                        <div style={{ color: '#3b82f6', fontWeight: '800', marginBottom: '0.25rem', fontSize: '0.75rem' }}>⇄ Система • 00:27</div>
                        Система: Автоматическая передача менеджеру ОП не выполнена. В сети нет Менеджеров ОП для города «{editCity}» по услуге «{editProduct}»! Проверьте графики или настройки профилей в админке. (bot_webhook_new_lead)
                      </div>
                      <div style={{ fontSize: '0.8rem', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderLeft: '3px solid #00ff41', borderRadius: '4px', color: 'rgba(255,255,255,0.7)' }}>
                        <div style={{ color: '#00ff41', fontWeight: '800', marginBottom: '0.25rem', fontSize: '0.75rem' }}>✓ Система • 00:28</div>
                        Система: Заявка успешно импортирована из источника {selectedLead.source}.
                      </div>
                      {editComments && (
                        <div style={{ fontSize: '0.8rem', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderLeft: '3px solid #f59e0b', borderRadius: '4px', color: 'rgba(255,255,255,0.7)' }}>
                          <div style={{ color: '#f59e0b', fontWeight: '800', marginBottom: '0.25rem', fontSize: '0.75rem' }}>✎ Комментарий • {new Date(selectedLead.created_at).toLocaleDateString()}</div>
                          {editComments}
                        </div>
                      )}
                    </div>

                    {/* Chat input box */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                      <input 
                        type="text" 
                        placeholder={isShiftEnded ? 'Комментарии заблокированы (Смена окончена)' : 'Напишите комментарий к заявке...'}
                        disabled={isShiftEnded}
                        value={newChatComment}
                        onChange={(e) => setNewChatComment(e.target.value)}
                        style={{
                          flex: 1,
                          background: 'rgba(0,0,0,0.3)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '8px',
                          color: '#fff',
                          padding: '0.75rem',
                          outline: 'none',
                          fontSize: '0.85rem'
                        }}
                      />
                      <button 
                        type="button"
                        disabled={isShiftEnded || !newChatComment}
                        onClick={() => {
                          setEditComments(editComments + (editComments ? '\n' : '') + newChatComment);
                          setNewChatComment('');
                        }}
                        style={{
                          background: '#00ff41',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#000',
                          padding: '0 1.25rem',
                          fontWeight: '800',
                          cursor: (isShiftEnded || !newChatComment) ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '1rem',
                padding: '1.5rem 2rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                background: 'rgba(255, 255, 255, 0.01)'
              }}>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  style={{
                    background: 'none',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                    padding: '0.75rem 1.5rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Отмена
                </button>
                <button 
                  disabled={isShiftEnded}
                  onClick={() => {
                    handleUpdateLead(selectedLead.id, {
                      name: editName,
                      phone: editPhone,
                      city: editCity,
                      category: editCategory,
                      product: editProduct,
                      address: editAddress,
                      comments: editComments,
                      amount: editPrice,
                      cost_price: editCostPrice,
                      extra_expense: editExtraExpense,
                      master_commission: editMasterCommission,
                      bank_commission: editBankCommission,
                      installment_commission: editInstallmentCommission,
                      prepayment: editPrepayment,
                      intermediate_payment: editIntermediatePayment,
                      is_shift_ended: isShiftEnded,
                      status: editStatus,
                      assigned_to: editAssignedTo
                    });
                  }}
                  style={{
                    background: '#00ff41',
                    color: '#000',
                    border: 'none',
                    padding: '0.75rem 2rem',
                    borderRadius: '12px',
                    fontWeight: '900',
                    cursor: isShiftEnded ? 'not-allowed' : 'pointer',
                    opacity: isShiftEnded ? 0.5 : 1
                  }}
                >
                  Сохранить изменения
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ADD LEAD MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(5, 5, 8, 0.85)',
              backdropFilter: 'blur(10px)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem'
            }}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 15 }} 
              style={{
                background: '#0f0f15',
                border: '1px solid rgba(0, 255, 65, 0.15)',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '550px',
                padding: '2.5rem',
                boxShadow: '0 20px 60px rgba(0,0,0,0.8)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '900' }}>Регистрация нового обращения</h3>
                <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <form onSubmit={handleAddLeadSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>ФИО или Организация</label>
                  <input type="text" name="name" required style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.75rem', borderRadius: '8px', color: '#fff', outline: 'none' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ display: 'grid', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Телефон</label>
                    <input type="text" name="phone" required placeholder="+7" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.75rem', borderRadius: '8px', color: '#fff', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'grid', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Email</label>
                    <input type="email" name="email" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.75rem', borderRadius: '8px', color: '#fff', outline: 'none' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ display: 'grid', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Канал / Источник</label>
                    <select name="source" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.75rem', borderRadius: '8px', color: '#fff', outline: 'none', cursor: 'pointer' }}>
                      <option value="Ручной ввод">Ручной ввод</option>
                      <option value="Форма контактов">Форма контактов</option>
                      <option value="Телефонный звонок">Телефонный звонок</option>
                      <option value="Прямой запрос">Прямой запрос</option>
                    </select>
                  </div>
                  <div style={{ display: 'grid', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Сумма сделки (₸)</label>
                    <input type="number" name="amount" defaultValue={0} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.75rem', borderRadius: '8px', color: '#fff', outline: 'none' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Назначить менеджера</label>
                  <select name="assigned_to" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.75rem', borderRadius: '8px', color: '#fff', outline: 'none', cursor: 'pointer' }}>
                    {users.map(u => (
                      <option key={u.id} value={u.name}>{u.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Описание обращения</label>
                  <textarea name="message" rows={2} required placeholder="Что заказывает клиент..." style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.75rem', borderRadius: '8px', color: '#fff', outline: 'none', resize: 'none' }} />
                </div>

                <div style={{ display: 'grid', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Заметки / Комментарии</label>
                  <textarea name="comments" rows={2} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.75rem', borderRadius: '8px', color: '#fff', outline: 'none', resize: 'none' }} />
                </div>

                <button 
                  type="submit" 
                  style={{ 
                    background: '#00ff41', 
                    color: '#000', 
                    border: 'none', 
                    padding: '1rem', 
                    borderRadius: '12px', 
                    fontWeight: '900', 
                    cursor: 'pointer',
                    marginTop: '0.5rem'
                  }}
                >
                  Создать заявку
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
