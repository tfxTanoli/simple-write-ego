
import { User, HistoryItem, PlanType, Invoice, Feedback, SystemLog, SystemConfig, Ticket } from "../types";

const STORAGE_KEYS = {
  USER: 'humanize_ai_user',
  HISTORY: 'humanize_ai_history',
  USERS_DB: 'humanize_ai_users_db',
  INVOICES_DB: 'humanize_ai_invoices_db',
  LOGS_DB: 'humanize_ai_logs_db',
  SYSTEM_CONFIG: 'humanize_ai_system_config',
  TICKETS_DB: 'humanize_ai_tickets_db',
};

// --- Mock Data Seeds ---

const DEFAULT_USER: User = {
  id: 'user_123',
  name: 'Demo User',
  email: 'user@example.com',
  plan: PlanType.FREE,
  wordsUsedToday: 0,
  wordLimit: 500,
  writingStyles: [],
  role: 'user',
  status: 'active',
  joinedDate: new Date().toISOString()
};

const SEED_USERS: User[] = [
  { ...DEFAULT_USER, id: 'u1', name: 'Alice Johnson', email: 'alice@example.com', plan: PlanType.PRO, wordLimit: 15000, wordsUsedToday: 4500, joinedDate: '2023-11-15T10:00:00Z' },
  { ...DEFAULT_USER, id: 'u2', name: 'Bob Smith', email: 'bob@example.com', plan: PlanType.FREE, wordLimit: 500, wordsUsedToday: 500, status: 'suspended', joinedDate: '2023-12-01T14:30:00Z' },
  { ...DEFAULT_USER, id: 'u3', name: 'Charlie Davis', email: 'charlie@biz.com', plan: PlanType.UNLIMITED, wordLimit: 1000000, wordsUsedToday: 120500, joinedDate: '2023-10-20T09:15:00Z' },
  { ...DEFAULT_USER, id: 'u4', name: 'Dana Lee', email: 'dana@edu.org', plan: PlanType.ULTRA, wordLimit: 30000, wordsUsedToday: 200, joinedDate: '2024-01-05T11:45:00Z' },
  { ...DEFAULT_USER, id: 'admin1', name: 'Admin User', email: 'admin@simplewritego.com', role: 'admin', plan: PlanType.UNLIMITED, wordLimit: 1000000, wordsUsedToday: 0, joinedDate: '2023-01-01T00:00:00Z' }
];

const SEED_INVOICES: Invoice[] = [
  { id: 'inv_001', userId: 'u1', userName: 'Alice Johnson', amount: 7.99, date: '2024-02-15', status: 'paid', plan: PlanType.PRO },
  { id: 'inv_002', userId: 'u3', userName: 'Charlie Davis', amount: 79.99, date: '2024-02-14', status: 'paid', plan: PlanType.UNLIMITED },
  { id: 'inv_003', userId: 'u4', userName: 'Dana Lee', amount: 39.99, date: '2024-02-10', status: 'paid', plan: PlanType.ULTRA },
  { id: 'inv_004', userId: 'u2', userName: 'Bob Smith', amount: 7.99, date: '2024-01-15', status: 'refunded', plan: PlanType.PRO },
];

const SEED_LOGS: SystemLog[] = [
  { id: 'log_01', action: 'User Suspended', adminId: 'admin1', details: 'Suspended user Bob Smith for TOS violation', date: '2024-02-19T10:00:00Z', severity: 'warning' },
  { id: 'log_02', action: 'System Update', adminId: 'system', details: 'Deployed version 1.2.0', date: '2024-02-15T02:00:00Z', severity: 'info' },
  { id: 'log_03', action: 'Login Failed', adminId: 'unknown', details: 'Multiple failed login attempts from IP 192.168.1.1', date: '2024-02-21T08:30:00Z', severity: 'error' },
];

const SEED_TICKETS: Ticket[] = [
  { id: 't1', userId: 'u1', userName: 'Alice Johnson', subject: 'Billing Issue', lastMessage: 'I was charged twice for my subscription.', date: '2024-02-20', priority: 'high', status: 'open' },
  { id: 't2', userId: 'u2', userName: 'Bob Smith', subject: 'Account Access', lastMessage: 'I cannot log in to my account.', date: '2024-02-18', priority: 'medium', status: 'closed' },
];

const DEFAULT_CONFIG: SystemConfig = {
  maintenanceMode: false,
  allowSignups: true,
  featureFlags: { betaFeatures: false, newUI: true },
  emailSettings: { welcomeEmail: true, marketingEmails: false }
};

// --- Helpers ---

const getFromStorage = <T>(key: string, seed: T): T => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(data);
};

// --- Exported Functions ---

export const getAllUsers = (): User[] => getFromStorage(STORAGE_KEYS.USERS_DB, SEED_USERS);
export const getAllInvoices = (): Invoice[] => getFromStorage(STORAGE_KEYS.INVOICES_DB, SEED_INVOICES);
export const getSystemLogs = (): SystemLog[] => getFromStorage(STORAGE_KEYS.LOGS_DB, SEED_LOGS);
export const getSystemConfig = (): SystemConfig => getFromStorage(STORAGE_KEYS.SYSTEM_CONFIG, DEFAULT_CONFIG);
// Added getAllTickets to resolve dependencies in admin pages
export const getAllTickets = (): Ticket[] => getFromStorage(STORAGE_KEYS.TICKETS_DB, SEED_TICKETS);

export const saveSystemConfig = (config: SystemConfig) => {
  localStorage.setItem(STORAGE_KEYS.SYSTEM_CONFIG, JSON.stringify(config));
  // Log the change
  addSystemLog({
    action: 'Config Update',
    details: 'System configuration updated by admin',
    severity: 'info'
  });
};

export const addSystemLog = (log: Partial<SystemLog>) => {
  const logs = getSystemLogs();
  const newLog: SystemLog = {
    id: Date.now().toString(),
    action: log.action || 'Unknown',
    adminId: 'admin1', // Mock current admin
    details: log.details || '',
    date: new Date().toISOString(),
    severity: log.severity || 'info',
    ...log
  };
  localStorage.setItem(STORAGE_KEYS.LOGS_DB, JSON.stringify([newLog, ...logs]));
};

export const updateInvoiceStatus = (id: string, status: 'paid' | 'refunded') => {
  const invoices = getAllInvoices();
  const idx = invoices.findIndex(i => i.id === id);
  if (idx !== -1) {
    invoices[idx].status = status;
    localStorage.setItem(STORAGE_KEYS.INVOICES_DB, JSON.stringify(invoices));

    // Log refund
    if (status === 'refunded') {
      addSystemLog({ action: 'Refund Processed', details: `Refunded invoice ${id} for $${invoices[idx].amount}`, severity: 'warning' });
    }
  }
};

export const getUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEYS.USER);
  if (!data) return null;
  const user = JSON.parse(data);
  // Ensure backward compatibility
  if (!user.writingStyles) user.writingStyles = [];
  if (!user.role) user.role = 'user';
  if (!user.status) user.status = 'active';
  return user;
};

export const loginUser = (email: string, displayName?: string): User => {
  const allUsers = getAllUsers();

  // Check if exists in DB
  const foundUser = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (foundUser) {
    // If Firebase has a displayName and it's different from stored name, update it
    if (displayName && foundUser.name !== displayName) {
      foundUser.name = displayName;
      localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(allUsers));
    }
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(foundUser));
    return foundUser;
  }

  // Create new user if not found
  const newUser: User = {
    ...DEFAULT_USER,
    id: Date.now().toString(),
    email,
    name: displayName || email.split('@')[0], // Use displayName if available, otherwise fallback to email
    joinedDate: new Date().toISOString()
  };

  // Add to DB
  allUsers.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(allUsers));

  // Set Session
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
  return newUser;
};

export const signupUser = (email: string, name: string): User => {
  const allUsers = getAllUsers();

  const existing = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(existing));
    return existing;
  }

  const newUser: User = {
    id: Date.now().toString(),
    name: name,
    email: email,
    plan: PlanType.FREE,
    wordsUsedToday: 0,
    wordLimit: 500,
    writingStyles: [],
    role: 'user',
    status: 'active',
    joinedDate: new Date().toISOString()
  };

  allUsers.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(allUsers));
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
  return newUser;
};

export const updateUserInDb = (updatedUser: User) => {
  const allUsers = getAllUsers();
  const index = allUsers.findIndex(u => u.id === updatedUser.id);

  if (index !== -1) {
    allUsers[index] = updatedUser;
    localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(allUsers));

    const currentUser = getUser();
    if (currentUser && currentUser.id === updatedUser.id) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    }

    // Log user update
    addSystemLog({ action: 'User Updated', details: `Updated profile for user ${updatedUser.email}`, severity: 'info' });

    return true;
  }
  return false;
};

export const logoutUser = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

export const updateUserPlan = (plan: PlanType) => {
  const user = getUser();
  if (!user) return;

  let limit = 500;
  if (plan === PlanType.PRO) limit = 15000;
  if (plan === PlanType.ULTRA) limit = 30000;
  if (plan === PlanType.UNLIMITED) limit = 1000000;

  const updated = { ...user, plan, wordLimit: limit };
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
  updateUserInDb(updated);
  return updated;
};

export const addOneTimeCredits = (amount: number) => {
  const user = getUser();
  if (!user) return;

  const updated = {
    ...user,
    wordLimit: user.wordLimit + amount
  };

  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
  updateUserInDb(updated);
  return updated;
};

export const cancelSubscription = () => {
  const user = getUser();
  if (!user) return null;

  const updated = {
    ...user,
    plan: PlanType.FREE,
    wordLimit: 500
  };

  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
  updateUserInDb(updated);
  return updated;
};

export const updateUserProfile = (updates: Partial<User>) => {
  const user = getUser();
  if (!user) return null;

  const updated = { ...user, ...updates };
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
  updateUserInDb(updated);
  return updated;
};

export const incrementUsage = (wordCount: number): User => {
  const user = getUser();
  if (!user) throw new Error("No user found");

  const updated = { ...user, wordsUsedToday: user.wordsUsedToday + wordCount };
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
  updateUserInDb(updated);
  return updated;
};

export const getHistory = (userId: string): HistoryItem[] => {
  const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
  const allHistory: HistoryItem[] = data ? JSON.parse(data) : [];
  return allHistory.filter(item => item.userId === userId);
};

export const addToHistory = (userId: string, item: Omit<HistoryItem, 'id' | 'date' | 'userId'>) => {
  const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
  const allHistory: HistoryItem[] = data ? JSON.parse(data) : [];

  const newItem: HistoryItem = {
    ...item,
    id: Date.now().toString(),
    userId: userId,
    date: new Date().toISOString(),
  };

  const updated = [newItem, ...allHistory];
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
  return newItem;
};

export const clearHistory = (userId: string) => {
  const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
  if (!data) return;
  const allHistory: HistoryItem[] = JSON.parse(data);
  const retainedHistory = allHistory.filter(item => item.userId !== userId);
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(retainedHistory));
}
