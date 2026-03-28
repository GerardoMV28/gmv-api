export type UserMe = {
  id: number;
  name: string;
  lastname: string;
  username: string;
  email: string | null;
  lastLogin: string | null;
  created_dt: string;
  isActive: boolean | null;
  rolId: number | null;
  role: string;
};

export type PublicUser = {
  id: number;
  name: string;
  lastname: string;
  username: string;
  created_dt: string;
  isActive: boolean | null;
  rolId: number | null;
  role: string;
};

export type Task = {
  id: number;
  name: string;
  description: string;
  priority: boolean;
  created_dt: string;
  user_id: number;
  completed: boolean | null;
  dueDate: string | null;
  updatedAt: string | null;
};

export type AuditLog = {
  id: number;
  statusCode: number;
  timeStamp: string;
  path: string;
  error: string;
  errorCode: string;
  sesion_id: number | null;
  eventType: string | null;
  severity: string | null;
  ipAddress: string | null;
  userAgent: string | null;
};

export type RolOption = { id: number; description: string };
