import { User } from '../core/models/user.model';

export const users: User[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date('2024-03-16'),
    address: {
      street: '789 Admin St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94101',
      country: 'USA'
    },
    phone: '555-0101'
  },
  {
    id: 2,
    name: 'Regular User',
    email: 'user@example.com',
    role: 'user',
    status: 'active',
    createdAt: new Date('2024-02-01'),
    lastLogin: new Date('2024-03-15'),
    address: {
      street: '321 User Ave',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    phone: '555-0102'
  },
  {
    id: 3,
    name: 'Inactive User',
    email: 'inactive@example.com',
    role: 'user',
    status: 'inactive',
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date('2024-02-28'),
    address: {
      street: '654 Inactive Blvd',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      country: 'USA'
    },
    phone: '555-0103'
  }
]; 