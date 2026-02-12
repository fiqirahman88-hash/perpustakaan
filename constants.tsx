
import { Book, Category, Student } from './types.ts';

export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Mata Pelajaran' },
  { id: '2', name: 'Komik' },
  { id: '3', name: 'Dongeng' },
  { id: '4', name: 'Buku Cerita' },
  { id: '5', name: 'Novel' },
  { id: '6', name: 'Lain-lain' },
];

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'b1',
    title: 'Matematika Kelas X',
    categoryId: '1',
    shelf: 'A1',
    driveLink: '1_L-YmYx7_Pq1L-YmYx7_Pq',
    status: 'available',
    viewCount: 124,
    description: 'Buku panduan matematika kurikulum merdeka untuk siswa kelas X SMA.'
  },
  {
    id: 'b2',
    title: 'Laskar Pelangi',
    categoryId: '5',
    shelf: 'B2',
    driveLink: '2_L-YmYx7_Pq2L-YmYx7_Pq',
    status: 'available',
    viewCount: 450,
    description: 'Kisah inspiratif tentang perjuangan sepuluh anak Belitong dalam mengejar cita-cita.'
  },
  {
    id: 'b3',
    title: 'Kancil dan Buaya',
    categoryId: '3',
    shelf: 'C1',
    driveLink: '3_L-YmYx7_Pq3L-YmYx7_Pq',
    status: 'available',
    viewCount: 89,
    description: 'Dongeng klasik anak Indonesia tentang kecerdikan si kancil.'
  }
];

export const INITIAL_STUDENTS: Student[] = [];
