import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';
import { Component } from '@angular/core';

import { HeaderComponent } from './header.component';
import { AuthService, User } from '../../services/auth.service';
import { CartService, CartItem } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { Product } from '../../models/product.model';

// Mock components for routing tests
@Component({ template: '' })
class MockComponent { }

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let cartService: jasmine.SpyObj<CartService>;
  let wishlistService: jasmine.SpyObj<WishlistService>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user'
  };

  const mockAdminUser: User = {
    id: 2,
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin'
  };

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    price: 999,
    category: 'men',
    subCategory: 'topwear',
    brand: 'TestBrand',
    sizes: ['S', 'M', 'L'],
    colors: ['Red', 'Blue'],
    images: ['image1.jpg'],
    rating: 4.5,
    reviews: 100,
    inStock: true
  };

  const mockCartItem: CartItem = {
    product: mockProduct,
    quantity: 2,
    size: 'M',
    color: 'Red'
  };

  beforeEach(async () => {
    // Create spy objects for dependencies
    const authSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'isAdmin', 'logout']);
    const cartSpy = jasmine.createSpyObj('CartService', ['getCartItems']);
    const wishlistSpy = jasmine.createSpyObj('WishlistService', ['getWishlistCount']);

    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        RouterTestingModule.withRoutes([
          { path: '', component: MockComponent },
          { path: 'men', component: MockComponent },
          { path: 'women', component: MockComponent },
          { path: 'wishlist', component: MockComponent },
          { path: 'cart', component: MockComponent },
          { path: 'auth/login', component: MockComponent },
          { path: 'auth/register', component: MockComponent },
          { path: 'profile', component: MockComponent },
          { path: 'orders', component: MockComponent },
          { path: 'admin', component: MockComponent }
        ])
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: CartService, useValue: cartSpy },
        { provide: WishlistService, useValue: wishlistSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    wishlistService = TestBed.inject(WishlistService) as jasmine.SpyObj<WishlistService>;
  });

  beforeEach(() => {
    // Setup default spy return values
    authService.getCurrentUser.and.returnValue(new BehaviorSubject<User | null>(null));
    authService.isAdmin.and.returnValue(new BehaviorSubject<boolean>(false));
    cartService.getCartItems.and.returnValue(new BehaviorSubject<CartItem[]>([]));
    wishlistService.getWishlistCount.and.returnValue(new BehaviorSubject<number>(0));

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('component initialization', () => {
    it('should initialize with default values', () => {
      expect(component.currentUser).toBeNull();
      expect(component.isAdmin).toBeFalsy();
      expect(component.cartItemCount).toBe(0);
      expect(component.wishlistItemCount).toBe(0);
    });

    it('should call all necessary service methods on init', () => {
      component.ngOnInit();

      expect(authService.getCurrentUser).toHaveBeenCalled();
      expect(authService.isAdmin).toHaveBeenCalled();
      expect(cartService.getCartItems).toHaveBeenCalled();
      expect(wishlistService.getWishlistCount).toHaveBeenCalled();
    });

    it('should subscribe to user changes', () => {
      const userSubject = new BehaviorSubject<User | null>(mockUser);
      authService.getCurrentUser.and.returnValue(userSubject);

      component.ngOnInit();

      expect(component.currentUser).toEqual(mockUser);
    });

    it('should subscribe to admin status changes', () => {
      const adminSubject = new BehaviorSubject<boolean>(true);
      authService.isAdmin.and.returnValue(adminSubject);

      component.ngOnInit();

      expect(component.isAdmin).toBeTruthy();
    });

    it('should subscribe to cart items changes', () => {
      const cartSubject = new BehaviorSubject<CartItem[]>([mockCartItem]);
      cartService.getCartItems.and.returnValue(cartSubject);

      component.ngOnInit();

      expect(component.cartItemCount).toBe(2); // quantity of mockCartItem
    });

    it('should subscribe to wishlist count changes', () => {
      const wishlistSubject = new BehaviorSubject<number>(5);
      wishlistService.getWishlistCount.and.returnValue(wishlistSubject);

      component.ngOnInit();

      expect(component.wishlistItemCount).toBe(5);
    });

    it('should calculate cart item count correctly with multiple items', () => {
      const cartItem2: CartItem = { ...mockCartItem, quantity: 3 };
      const cartSubject = new BehaviorSubject<CartItem[]>([mockCartItem, cartItem2]);
      cartService.getCartItems.and.returnValue(cartSubject);

      component.ngOnInit();

      expect(component.cartItemCount).toBe(5); // 2 + 3
    });

    it('should handle empty cart', () => {
      const cartSubject = new BehaviorSubject<CartItem[]>([]);
      cartService.getCartItems.and.returnValue(cartSubject);

      component.ngOnInit();

      expect(component.cartItemCount).toBe(0);
    });
  });

  describe('logout functionality', () => {
    it('should call auth service logout method', () => {
      component.logout();

      expect(authService.logout).toHaveBeenCalled();
    });

    it('should handle logout when user is not logged in', () => {
      expect(() => component.logout()).not.toThrow();
      expect(authService.logout).toHaveBeenCalled();
    });
  });

  describe('template rendering', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should render logo with correct link', () => {
      const logoLink = fixture.debugElement.query(By.css('.logo'));
      expect(logoLink).toBeTruthy();
      expect(logoLink.attributes['routerLink']).toBe('/');
    });

    it('should render navigation categories', () => {
      const navLinks = fixture.debugElement.queryAll(By.css('.category-nav a'));
      const expectedCategories = ['Men', 'Women', 'Kids', 'Home & Living', 'Beauty', 'Studio'];
      
      expect(navLinks.length).toBe(expectedCategories.length);
      
      navLinks.forEach((link, index) => {
        expect(link.nativeElement.textContent.trim()).toBe(expectedCategories[index]);
      });
    });

    it('should render search bar', () => {
      const searchBar = fixture.debugElement.query(By.css('.search-bar'));
      expect(searchBar).toBeTruthy();
      
      const searchInput = fixture.debugElement.query(By.css('input[matInput]'));
      expect(searchInput).toBeTruthy();
      expect(searchInput.attributes['placeholder']).toBe('Search for products, brands and more');
    });

    it('should render wishlist button with correct route', () => {
      const wishlistButton = fixture.debugElement.query(By.css('a[routerLink="/wishlist"]'));
      expect(wishlistButton).toBeTruthy();
    });

    it('should render cart button with correct route', () => {
      const cartButton = fixture.debugElement.query(By.css('a[routerLink="/cart"]'));
      expect(cartButton).toBeTruthy();
    });

    it('should show login/register buttons when user is not logged in', () => {
      authService.getCurrentUser.and.returnValue(new BehaviorSubject<User | null>(null));
      component.ngOnInit();
      fixture.detectChanges();

      const loginButton = fixture.debugElement.query(By.css('a[routerLink="/auth/login"]'));
      const registerButton = fixture.debugElement.query(By.css('a[routerLink="/auth/register"]'));

      expect(loginButton).toBeTruthy();
      expect(registerButton).toBeTruthy();
      expect(loginButton.nativeElement.textContent.trim()).toBe('Login');
      expect(registerButton.nativeElement.textContent.trim()).toBe('Register');
    });

    it('should show user menu when user is logged in', () => {
      authService.getCurrentUser.and.returnValue(new BehaviorSubject<User | null>(mockUser));
      component.ngOnInit();
      fixture.detectChanges();

      const userMenuButton = fixture.debugElement.query(By.css('button[matMenuTriggerFor="userMenu"]'));
      const loginButton = fixture.debugElement.query(By.css('a[routerLink="/auth/login"]'));

      expect(userMenuButton).toBeTruthy();
      expect(loginButton).toBeFalsy();
    });

    it('should show admin menu item for admin users', () => {
      authService.getCurrentUser.and.returnValue(new BehaviorSubject<User | null>(mockAdminUser));
      authService.isAdmin.and.returnValue(new BehaviorSubject<boolean>(true));
      component.ngOnInit();
      fixture.detectChanges();

      const adminMenuItem = fixture.debugElement.query(By.css('button[routerLink="/admin"]'));
      expect(adminMenuItem).toBeTruthy();
    });

    it('should not show admin menu item for regular users', () => {
      authService.getCurrentUser.and.returnValue(new BehaviorSubject<User | null>(mockUser));
      authService.isAdmin.and.returnValue(new BehaviorSubject<boolean>(false));
      component.ngOnInit();
      fixture.detectChanges();

      const adminMenuItem = fixture.debugElement.query(By.css('button[routerLink="/admin"]'));
      expect(adminMenuItem).toBeFalsy();
    });

    it('should display cart badge when cart has items', () => {
      cartService.getCartItems.and.returnValue(new BehaviorSubject<CartItem[]>([mockCartItem]));
      component.ngOnInit();
      fixture.detectChanges();

      const cartIcon = fixture.debugElement.query(By.css('a[routerLink="/cart"] mat-icon'));
      expect(cartIcon.attributes['matBadge']).toBe('2');
    });

    it('should not display cart badge when cart is empty', () => {
      cartService.getCartItems.and.returnValue(new BehaviorSubject<CartItem[]>([]));
      component.ngOnInit();
      fixture.detectChanges();

      const cartIcon = fixture.debugElement.query(By.css('a[routerLink="/cart"] mat-icon'));
      expect(cartIcon.attributes['matBadge']).toBeFalsy();
    });

    it('should display wishlist badge when wishlist has items', () => {
      wishlistService.getWishlistCount.and.returnValue(new BehaviorSubject<number>(3));
      component.ngOnInit();
      fixture.detectChanges();

      const wishlistIcon = fixture.debugElement.query(By.css('a[routerLink="/wishlist"] mat-icon'));
      expect(wishlistIcon.attributes['matBadge']).toBe('3');
    });

    it('should not display wishlist badge when wishlist is empty', () => {
      wishlistService.getWishlistCount.and.returnValue(new BehaviorSubject<number>(0));
      component.ngOnInit();
      fixture.detectChanges();

      const wishlistIcon = fixture.debugElement.query(By.css('a[routerLink="/wishlist"] mat-icon'));
      expect(wishlistIcon.attributes['matBadge']).toBeFalsy();
    });
  });

  describe('user interactions', () => {
    it('should call logout when logout menu item is clicked', () => {
      authService.getCurrentUser.and.returnValue(new BehaviorSubject<User | null>(mockUser));
      component.ngOnInit();
      fixture.detectChanges();

      spyOn(component, 'logout');

      const logoutButton = fixture.debugElement.query(By.css('button[mat-menu-item]'));
      // Find the logout button (last menu item)
      const menuItems = fixture.debugElement.queryAll(By.css('button[mat-menu-item]'));
      const logoutMenuItem = menuItems[menuItems.length - 1];

      logoutMenuItem.nativeElement.click();

      expect(component.logout).toHaveBeenCalled();
    });

    it('should navigate to correct routes when category links are clicked', () => {
      const categoryLinks = fixture.debugElement.queryAll(By.css('.category-nav a'));
      const expectedRoutes = ['/men', '/women', '/kids', '/home-living', '/beauty', '/studio'];

      categoryLinks.forEach((link, index) => {
        expect(link.attributes['routerLink']).toBe(expectedRoutes[index]);
      });
    });

    it('should navigate to profile when profile menu item is clicked', () => {
      authService.getCurrentUser.and.returnValue(new BehaviorSubject<User | null>(mockUser));
      component.ngOnInit();
      fixture.detectChanges();

      const profileMenuItem = fixture.debugElement.query(By.css('button[routerLink="/profile"]'));
      expect(profileMenuItem).toBeTruthy();
      expect(profileMenuItem.attributes['routerLink']).toBe('/profile');
    });

    it('should navigate to orders when orders menu item is clicked', () => {
      authService.getCurrentUser.and.returnValue(new BehaviorSubject<User | null>(mockUser));
      component.ngOnInit();
      fixture.detectChanges();

      const ordersMenuItem = fixture.debugElement.query(By.css('button[routerLink="/orders"]'));
      expect(ordersMenuItem).toBeTruthy();
      expect(ordersMenuItem.attributes['routerLink']).toBe('/orders');
    });
  });

  describe('responsive behavior', () => {
    it('should apply responsive styles', () => {
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      const styles = getComputedStyle(compiled);
      
      // Check that component has appropriate classes for responsive design
      const toolbar = fixture.debugElement.query(By.css('mat-toolbar'));
      expect(toolbar).toBeTruthy();
    });
  });

  describe('edge cases', () => {
    it('should handle service observable errors gracefully', () => {
      const errorObservable = new BehaviorSubject<User | null>(null);
      authService.getCurrentUser.and.returnValue(errorObservable);

      expect(() => component.ngOnInit()).not.toThrow();
    });

    it('should handle very large cart quantities', () => {
      const largeQuantityItem: CartItem = { ...mockCartItem, quantity: 9999 };
      cartService.getCartItems.and.returnValue(new BehaviorSubject<CartItem[]>([largeQuantityItem]));

      component.ngOnInit();

      expect(component.cartItemCount).toBe(9999);
    });

    it('should handle very large wishlist counts', () => {
      wishlistService.getWishlistCount.and.returnValue(new BehaviorSubject<number>(9999));

      component.ngOnInit();

      expect(component.wishlistItemCount).toBe(9999);
    });

    it('should handle null user gracefully', () => {
      authService.getCurrentUser.and.returnValue(new BehaviorSubject<User | null>(null));

      component.ngOnInit();

      expect(component.currentUser).toBeNull();
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should handle undefined quantities in cart items', () => {
      const undefinedQuantityItem = { ...mockCartItem, quantity: undefined as any };
      cartService.getCartItems.and.returnValue(new BehaviorSubject<CartItem[]>([undefinedQuantityItem]));

      component.ngOnInit();

      expect(component.cartItemCount).toBe(0); // NaN becomes 0
    });

    it('should handle cart items with negative quantities', () => {
      const negativeQuantityItem: CartItem = { ...mockCartItem, quantity: -5 };
      cartService.getCartItems.and.returnValue(new BehaviorSubject<CartItem[]>([negativeQuantityItem]));

      component.ngOnInit();

      expect(component.cartItemCount).toBe(-5);
    });

    it('should handle multiple rapid service updates', () => {
      const userSubject = new BehaviorSubject<User | null>(null);
      const cartSubject = new BehaviorSubject<CartItem[]>([]);
      
      authService.getCurrentUser.and.returnValue(userSubject);
      cartService.getCartItems.and.returnValue(cartSubject);

      component.ngOnInit();

      // Simulate rapid updates
      userSubject.next(mockUser);
      cartSubject.next([mockCartItem]);
      userSubject.next(null);
      cartSubject.next([]);

      expect(component.currentUser).toBeNull();
      expect(component.cartItemCount).toBe(0);
    });
  });

  describe('accessibility', () => {
    it('should have proper tooltips for icon buttons', () => {
      fixture.detectChanges();

      const wishlistButton = fixture.debugElement.query(By.css('a[routerLink="/wishlist"]'));
      const cartButton = fixture.debugElement.query(By.css('a[routerLink="/cart"]'));

      expect(wishlistButton.attributes['matTooltip']).toBe('Wishlist');
      expect(cartButton.attributes['matTooltip']).toBe('Cart');
    });

    it('should have proper ARIA labels and roles', () => {
      authService.getCurrentUser.and.returnValue(new BehaviorSubject<User | null>(mockUser));
      component.ngOnInit();
      fixture.detectChanges();

      const userMenuButton = fixture.debugElement.query(By.css('button[matMenuTriggerFor="userMenu"]'));
      expect(userMenuButton.attributes['matTooltip']).toBe('Account');
    });

    it('should have proper alt text for logo image', () => {
      fixture.detectChanges();

      const logoImage = fixture.debugElement.query(By.css('.logo img'));
      expect(logoImage.attributes['alt']).toBe('Myntra');
    });
  });
});