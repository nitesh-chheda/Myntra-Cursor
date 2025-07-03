import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService, User, LoginCredentials, RegisterData } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user'
  };

  const mockUsersResponse = {
    users: [
      {
        id: 1,
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user'
      },
      {
        id: 2,
        email: 'admin@example.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initialization', () => {
    it('should load user from localStorage on initialization', () => {
      const storedUser = JSON.stringify(mockUser);
      localStorage.setItem('auth_token', storedUser);
      
      const newService = new AuthService(TestBed.inject(HttpTestingController) as any);
      
      newService.getCurrentUser().subscribe(user => {
        expect(user).toEqual(mockUser);
      });
    });

    it('should not load user if no token in localStorage', () => {
      service.getCurrentUser().subscribe(user => {
        expect(user).toBeNull();
      });
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user observable', () => {
      const observable = service.getCurrentUser();
      expect(observable).toBeTruthy();
      
      observable.subscribe(user => {
        expect(user).toBeNull();
      });
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when no user is logged in', () => {
      service.isAuthenticated().subscribe(isAuth => {
        expect(isAuth).toBeFalsy();
      });
    });

    it('should return true when user is logged in', () => {
      localStorage.setItem('auth_token', JSON.stringify(mockUser));
      const newService = new AuthService(TestBed.inject(HttpTestingController) as any);
      
      newService.isAuthenticated().subscribe(isAuth => {
        expect(isAuth).toBeTruthy();
      });
    });
  });

  describe('login', () => {
    it('should login user with valid credentials', () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      service.login(credentials).subscribe(user => {
        expect(user).toEqual(mockUser);
        expect(localStorage.getItem('auth_token')).toBe(JSON.stringify(mockUser));
      });

      const req = httpMock.expectOne('assets/data/users.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockUsersResponse);
    });

    it('should throw error with invalid credentials', () => {
      const credentials: LoginCredentials = {
        email: 'invalid@example.com',
        password: 'wrongpassword'
      };

      service.login(credentials).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Invalid credentials');
        }
      });

      const req = httpMock.expectOne('assets/data/users.json');
      req.flush(mockUsersResponse);
    });

    it('should throw error with wrong password', () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      service.login(credentials).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Invalid credentials');
        }
      });

      const req = httpMock.expectOne('assets/data/users.json');
      req.flush(mockUsersResponse);
    });

    it('should handle HTTP error', () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      service.login(credentials).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne('assets/data/users.json');
      req.error(new ErrorEvent('Network error'));
    });

    it('should update currentUser subject on successful login', () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      service.login(credentials).subscribe();

      const req = httpMock.expectOne('assets/data/users.json');
      req.flush(mockUsersResponse);

      service.getCurrentUser().subscribe(user => {
        expect(user).toEqual(mockUser);
      });
    });
  });

  describe('register', () => {
    it('should register new user successfully', () => {
      const registerData: RegisterData = {
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User'
      };

      const expectedUser = {
        id: 3,
        email: 'newuser@example.com',
        firstName: 'New',
        lastName: 'User',
        role: 'user'
      };

      service.register(registerData).subscribe(user => {
        expect(user).toEqual(expectedUser);
        expect(localStorage.getItem('auth_token')).toBe(JSON.stringify(expectedUser));
      });

      const req = httpMock.expectOne('assets/data/users.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockUsersResponse);
    });

    it('should throw error if email already exists', () => {
      const registerData: RegisterData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };

      service.register(registerData).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Email already exists');
        }
      });

      const req = httpMock.expectOne('assets/data/users.json');
      req.flush(mockUsersResponse);
    });

    it('should handle HTTP error during registration', () => {
      const registerData: RegisterData = {
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User'
      };

      service.register(registerData).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne('assets/data/users.json');
      req.error(new ErrorEvent('Network error'));
    });

    it('should update currentUser subject on successful registration', () => {
      const registerData: RegisterData = {
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User'
      };

      service.register(registerData).subscribe();

      const req = httpMock.expectOne('assets/data/users.json');
      req.flush(mockUsersResponse);

      service.getCurrentUser().subscribe(user => {
        expect(user).toBeTruthy();
        expect(user?.email).toBe('newuser@example.com');
      });
    });
  });

  describe('logout', () => {
    it('should logout user and clear storage', () => {
      // First login a user
      localStorage.setItem('auth_token', JSON.stringify(mockUser));
      const newService = new AuthService(TestBed.inject(HttpTestingController) as any);
      
      // Then logout
      newService.logout();
      
      expect(localStorage.getItem('auth_token')).toBeNull();
      
      newService.getCurrentUser().subscribe(user => {
        expect(user).toBeNull();
      });
    });

    it('should handle logout when no user is logged in', () => {
      service.logout();
      
      expect(localStorage.getItem('auth_token')).toBeNull();
      
      service.getCurrentUser().subscribe(user => {
        expect(user).toBeNull();
      });
    });
  });

  describe('isAdmin', () => {
    it('should return true for admin user', () => {
      const adminUser = { ...mockUser, role: 'admin' };
      localStorage.setItem('auth_token', JSON.stringify(adminUser));
      const newService = new AuthService(TestBed.inject(HttpTestingController) as any);
      
      newService.isAdmin().subscribe(isAdmin => {
        expect(isAdmin).toBeTruthy();
      });
    });

    it('should return false for regular user', () => {
      localStorage.setItem('auth_token', JSON.stringify(mockUser));
      const newService = new AuthService(TestBed.inject(HttpTestingController) as any);
      
      newService.isAdmin().subscribe(isAdmin => {
        expect(isAdmin).toBeFalsy();
      });
    });

    it('should return false when no user is logged in', () => {
      service.isAdmin().subscribe(isAdmin => {
        expect(isAdmin).toBeFalsy();
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty users response', () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      service.login(credentials).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Invalid credentials');
        }
      });

      const req = httpMock.expectOne('assets/data/users.json');
      req.flush({ users: [] });
    });

    it('should handle malformed users response', () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      service.login(credentials).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne('assets/data/users.json');
      req.flush({ invalid: 'response' });
    });

    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage to throw error
      spyOn(localStorage, 'getItem').and.throwError('Storage error');
      spyOn(console, 'error');
      
      const newService = new AuthService(TestBed.inject(HttpTestingController) as any);
      
      newService.getCurrentUser().subscribe(user => {
        expect(user).toBeNull();
        expect(console.error).toHaveBeenCalled();
      });
    });

    it('should handle localStorage setItem errors gracefully', () => {
      spyOn(localStorage, 'setItem').and.throwError('Storage error');
      spyOn(console, 'error');
      
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      service.login(credentials).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          expect(console.error).toHaveBeenCalled();
        }
      });

      const req = httpMock.expectOne('assets/data/users.json');
      req.flush(mockUsersResponse);
    });
  });
});