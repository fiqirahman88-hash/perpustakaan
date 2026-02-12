
export enum UserRole {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT'
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
}

export interface Category {
  id: string;
  name: string;
}

export interface Book {
  id: string;
  title: string;
  categoryId: string;
  shelf: string;
  driveLink: string;
  status: 'available' | 'archived';
  description?: string;
  viewCount: number;
  coverImage?: string; // Base64 or URL
}

export interface Student {
  id: string;
  name: string;
  username: string; // 001-919
}

export interface ActivityLog {
  id: string;
  studentId: string;
  studentName: string;
  bookId: string;
  bookTitle: string;
  timestamp: string;
}

export interface AppState {
  books: Book[];
  students: Student[];
  categories: Category[];
  activityLogs: ActivityLog[];
}
