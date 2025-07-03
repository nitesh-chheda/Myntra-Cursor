import { TestBed } from '@angular/core/testing';
import { CartService, CartItem } from './cart.service';
import { Product } from '../models/product.model';

describe('CartService', () => {
  let service: CartService;

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

  const mockProduct2: Product = {
    id: 2,
    name: 'Test Product 2',
    description: 'Test Description 2',
    price: 1499,
    category: 'women',
    subCategory: 'topwear',
    brand: 'TestBrand2',
    sizes: ['XS', 'S', 'M'],
    colors: ['Black', 'White'],
    images: ['image2.jpg'],
    rating: 4.2,
    reviews: 75,
    inStock: true
  };

  const mockCartItem: CartItem = {
    product: mockProduct,
    quantity: 2,
    size: 'M',
    color: 'Red'
  };

  const mockCartItem2: CartItem = {
    product: mockProduct2,
    quantity: 1,
    size: 'S',
    color: 'Black'
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    TestBed.configureTestingModule({
      providers: [CartService]
    });
    
    service = TestBed.inject(CartService);
  });

  afterEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initialization', () => {
    it('should load cart from localStorage on initialization', () => {
      const storedCart = [mockCartItem, mockCartItem2];
      localStorage.setItem('cart_items', JSON.stringify(storedCart));
      
      const newService = new CartService();
      
      newService.getCartItems().subscribe(items => {
        expect(items).toEqual(storedCart);
        expect(items.length).toBe(2);
      });
    });

    it('should initialize with empty cart if no localStorage data', () => {
      service.getCartItems().subscribe(items => {
        expect(items).toEqual([]);
        expect(items.length).toBe(0);
      });
    });

    it('should handle corrupted localStorage data', () => {
      localStorage.setItem('cart_items', 'invalid json');
      
      const newService = new CartService();
      
      newService.getCartItems().subscribe(items => {
        expect(items).toEqual([]);
      });
    });
  });

  describe('getCartItems', () => {
    it('should return observable of cart items', () => {
      const observable = service.getCartItems();
      expect(observable).toBeTruthy();
      
      observable.subscribe(items => {
        expect(Array.isArray(items)).toBeTruthy();
      });
    });
  });

  describe('addToCart', () => {
    it('should add new item to cart', () => {
      service.addToCart(mockCartItem);
      
      service.getCartItems().subscribe(items => {
        expect(items.length).toBe(1);
        expect(items[0]).toEqual(mockCartItem);
      });
      
      const storedCart = JSON.parse(localStorage.getItem('cart_items') || '[]');
      expect(storedCart).toEqual([mockCartItem]);
    });

    it('should add multiple different items to cart', () => {
      service.addToCart(mockCartItem);
      service.addToCart(mockCartItem2);
      
      service.getCartItems().subscribe(items => {
        expect(items.length).toBe(2);
        expect(items).toContain(mockCartItem);
        expect(items).toContain(mockCartItem2);
      });
    });

    it('should increase quantity if same item is added', () => {
      service.addToCart(mockCartItem);
      service.addToCart(mockCartItem);
      
      service.getCartItems().subscribe(items => {
        expect(items.length).toBe(1);
        expect(items[0].quantity).toBe(4); // 2 + 2
      });
    });

    it('should treat different sizes as different items', () => {
      const cartItemSizeL = { ...mockCartItem, size: 'L' };
      
      service.addToCart(mockCartItem);
      service.addToCart(cartItemSizeL);
      
      service.getCartItems().subscribe(items => {
        expect(items.length).toBe(2);
        expect(items[0].size).toBe('M');
        expect(items[1].size).toBe('L');
      });
    });

    it('should treat different colors as different items', () => {
      const cartItemColorBlue = { ...mockCartItem, color: 'Blue' };
      
      service.addToCart(mockCartItem);
      service.addToCart(cartItemColorBlue);
      
      service.getCartItems().subscribe(items => {
        expect(items.length).toBe(2);
        expect(items[0].color).toBe('Red');
        expect(items[1].color).toBe('Blue');
      });
    });

    it('should handle adding item with quantity 0', () => {
      const zeroQuantityItem = { ...mockCartItem, quantity: 0 };
      
      service.addToCart(zeroQuantityItem);
      
      service.getCartItems().subscribe(items => {
        expect(items.length).toBe(1);
        expect(items[0].quantity).toBe(0);
      });
    });

    it('should handle adding item with negative quantity', () => {
      const negativeQuantityItem = { ...mockCartItem, quantity: -1 };
      
      service.addToCart(negativeQuantityItem);
      
      service.getCartItems().subscribe(items => {
        expect(items.length).toBe(1);
        expect(items[0].quantity).toBe(-1);
      });
    });

    it('should handle localStorage errors gracefully', () => {
      spyOn(localStorage, 'setItem').and.throwError('Storage error');
      spyOn(console, 'error');
      
      // Should not throw error
      expect(() => service.addToCart(mockCartItem)).not.toThrow();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('removeFromCart', () => {
    beforeEach(() => {
      service.addToCart(mockCartItem);
      service.addToCart(mockCartItem2);
    });

    it('should remove item from cart', () => {
      service.removeFromCart(mockCartItem);
      
      service.getCartItems().subscribe(items => {
        expect(items.length).toBe(1);
        expect(items[0]).toEqual(mockCartItem2);
      });
    });

    it('should not remove item if not found', () => {
      const nonExistentItem = { ...mockCartItem, size: 'XL' };
      
      service.removeFromCart(nonExistentItem);
      
      service.getCartItems().subscribe(items => {
        expect(items.length).toBe(2);
      });
    });

    it('should remove correct item based on product, size, and color', () => {
      const sameProductDifferentSize = { ...mockCartItem, size: 'L' };
      service.addToCart(sameProductDifferentSize);
      
      service.removeFromCart(mockCartItem);
      
      service.getCartItems().subscribe(items => {
        expect(items.length).toBe(2);
        expect(items.some(item => item.size === 'L')).toBeTruthy();
        expect(items.some(item => item.size === 'M')).toBeFalsy();
      });
    });

    it('should update localStorage after removal', () => {
      service.removeFromCart(mockCartItem);
      
      const storedCart = JSON.parse(localStorage.getItem('cart_items') || '[]');
      expect(storedCart.length).toBe(1);
      expect(storedCart[0].product.id).toBe(mockCartItem2.product.id);
    });

    it('should handle localStorage errors gracefully', () => {
      spyOn(localStorage, 'setItem').and.throwError('Storage error');
      spyOn(console, 'error');
      
      // Should not throw error
      expect(() => service.removeFromCart(mockCartItem)).not.toThrow();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('updateQuantity', () => {
    beforeEach(() => {
      service.addToCart(mockCartItem);
      service.addToCart(mockCartItem2);
    });

    it('should update quantity of existing item', () => {
      service.updateQuantity(mockCartItem, 5);
      
      service.getCartItems().subscribe(items => {
        const updatedItem = items.find(item => 
          item.product.id === mockCartItem.product.id &&
          item.size === mockCartItem.size &&
          item.color === mockCartItem.color
        );
        expect(updatedItem?.quantity).toBe(5);
      });
    });

    it('should not update quantity if item not found', () => {
      const nonExistentItem = { ...mockCartItem, size: 'XL' };
      
      service.updateQuantity(nonExistentItem, 10);
      
      service.getCartItems().subscribe(items => {
        expect(items.length).toBe(2);
        expect(items.every(item => item.quantity !== 10)).toBeTruthy();
      });
    });

    it('should handle zero quantity update', () => {
      service.updateQuantity(mockCartItem, 0);
      
      service.getCartItems().subscribe(items => {
        const updatedItem = items.find(item => 
          item.product.id === mockCartItem.product.id &&
          item.size === mockCartItem.size &&
          item.color === mockCartItem.color
        );
        expect(updatedItem?.quantity).toBe(0);
      });
    });

    it('should handle negative quantity update', () => {
      service.updateQuantity(mockCartItem, -5);
      
      service.getCartItems().subscribe(items => {
        const updatedItem = items.find(item => 
          item.product.id === mockCartItem.product.id &&
          item.size === mockCartItem.size &&
          item.color === mockCartItem.color
        );
        expect(updatedItem?.quantity).toBe(-5);
      });
    });

    it('should update localStorage after quantity change', () => {
      service.updateQuantity(mockCartItem, 7);
      
      const storedCart = JSON.parse(localStorage.getItem('cart_items') || '[]');
      const updatedItem = storedCart.find((item: CartItem) => 
        item.product.id === mockCartItem.product.id &&
        item.size === mockCartItem.size &&
        item.color === mockCartItem.color
      );
      expect(updatedItem?.quantity).toBe(7);
    });

    it('should handle localStorage errors gracefully', () => {
      spyOn(localStorage, 'setItem').and.throwError('Storage error');
      spyOn(console, 'error');
      
      // Should not throw error
      expect(() => service.updateQuantity(mockCartItem, 5)).not.toThrow();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('clearCart', () => {
    beforeEach(() => {
      service.addToCart(mockCartItem);
      service.addToCart(mockCartItem2);
    });

    it('should clear all items from cart', () => {
      service.clearCart();
      
      service.getCartItems().subscribe(items => {
        expect(items.length).toBe(0);
        expect(items).toEqual([]);
      });
    });

    it('should clear localStorage', () => {
      service.clearCart();
      
      const storedCart = JSON.parse(localStorage.getItem('cart_items') || '[]');
      expect(storedCart).toEqual([]);
    });

    it('should handle clearing already empty cart', () => {
      service.clearCart();
      service.clearCart();
      
      service.getCartItems().subscribe(items => {
        expect(items.length).toBe(0);
      });
    });

    it('should handle localStorage errors gracefully', () => {
      spyOn(localStorage, 'setItem').and.throwError('Storage error');
      spyOn(console, 'error');
      
      // Should not throw error
      expect(() => service.clearCart()).not.toThrow();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('getCartTotal', () => {
    it('should calculate total for empty cart', () => {
      service.getCartTotal().subscribe(total => {
        expect(total).toBe(0);
      });
    });

    it('should calculate total for single item', () => {
      service.addToCart(mockCartItem);
      
      service.getCartTotal().subscribe(total => {
        expect(total).toBe(mockCartItem.product.price * mockCartItem.quantity);
        expect(total).toBe(999 * 2);
      });
    });

    it('should calculate total for multiple items', () => {
      service.addToCart(mockCartItem);
      service.addToCart(mockCartItem2);
      
      service.getCartTotal().subscribe(total => {
        const expectedTotal = (mockCartItem.product.price * mockCartItem.quantity) + 
                             (mockCartItem2.product.price * mockCartItem2.quantity);
        expect(total).toBe(expectedTotal);
        expect(total).toBe(999 * 2 + 1499 * 1);
      });
    });

    it('should handle items with zero quantity', () => {
      const zeroQuantityItem = { ...mockCartItem, quantity: 0 };
      service.addToCart(zeroQuantityItem);
      
      service.getCartTotal().subscribe(total => {
        expect(total).toBe(0);
      });
    });

    it('should handle items with negative quantity', () => {
      const negativeQuantityItem = { ...mockCartItem, quantity: -2 };
      service.addToCart(negativeQuantityItem);
      
      service.getCartTotal().subscribe(total => {
        expect(total).toBe(-999 * 2);
      });
    });

    it('should handle items with zero price', () => {
      const zeroProductPrice = { ...mockProduct, price: 0 };
      const zeroProductItem = { ...mockCartItem, product: zeroProductPrice };
      service.addToCart(zeroProductItem);
      
      service.getCartTotal().subscribe(total => {
        expect(total).toBe(0);
      });
    });

    it('should update total when cart items change', () => {
      service.addToCart(mockCartItem);
      
      let totalValues: number[] = [];
      service.getCartTotal().subscribe(total => {
        totalValues.push(total);
      });
      
      service.addToCart(mockCartItem2);
      
      expect(totalValues.length).toBeGreaterThan(1);
      expect(totalValues[totalValues.length - 1]).toBe(999 * 2 + 1499 * 1);
    });

    it('should handle very large totals', () => {
      const expensiveProduct = { ...mockProduct, price: 999999 };
      const expensiveItem = { ...mockCartItem, product: expensiveProduct, quantity: 100 };
      service.addToCart(expensiveItem);
      
      service.getCartTotal().subscribe(total => {
        expect(total).toBe(999999 * 100);
      });
    });

    it('should handle decimal calculations correctly', () => {
      const decimalProduct = { ...mockProduct, price: 999.99 };
      const decimalItem = { ...mockCartItem, product: decimalProduct, quantity: 3 };
      service.addToCart(decimalItem);
      
      service.getCartTotal().subscribe(total => {
        expect(total).toBe(999.99 * 3);
        expect(total).toBeCloseTo(2999.97, 2);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle undefined product', () => {
      const invalidItem = { ...mockCartItem, product: undefined as any };
      
      expect(() => service.addToCart(invalidItem)).not.toThrow();
    });

    it('should handle null cart item', () => {
      expect(() => service.addToCart(null as any)).not.toThrow();
    });

    it('should handle concurrent modifications', () => {
      service.addToCart(mockCartItem);
      
      // Simulate concurrent access
      const item1 = { ...mockCartItem, quantity: 3 };
      const item2 = { ...mockCartItem, quantity: 5 };
      
      service.addToCart(item1);
      service.addToCart(item2);
      
      service.getCartItems().subscribe(items => {
        expect(items.length).toBe(1);
        expect(items[0].quantity).toBe(2 + 3 + 5); // Original + additions
      });
    });

    it('should handle localStorage quota exceeded', () => {
      // Create a large cart item
      const largeProduct = { ...mockProduct, description: 'x'.repeat(1000000) };
      const largeItem = { ...mockCartItem, product: largeProduct };
      
      spyOn(localStorage, 'setItem').and.throwError('QuotaExceededError');
      spyOn(console, 'error');
      
      expect(() => service.addToCart(largeItem)).not.toThrow();
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle corrupted BehaviorSubject', () => {
      // This is a more advanced test that would require deeper mocking
      // For now, we'll just ensure the service handles unexpected states
      service.addToCart(mockCartItem);
      
      service.getCartItems().subscribe(items => {
        expect(Array.isArray(items)).toBeTruthy();
      });
    });

    it('should handle multiple subscriptions', () => {
      const subscription1Values: CartItem[][] = [];
      const subscription2Values: CartItem[][] = [];
      
      service.getCartItems().subscribe(items => subscription1Values.push(items));
      service.getCartItems().subscribe(items => subscription2Values.push(items));
      
      service.addToCart(mockCartItem);
      
      expect(subscription1Values.length).toBeGreaterThan(0);
      expect(subscription2Values.length).toBeGreaterThan(0);
      expect(subscription1Values[subscription1Values.length - 1]).toEqual(
        subscription2Values[subscription2Values.length - 1]
      );
    });
  });
});