import { TestBed } from '@angular/core/testing';
import { WishlistService } from './wishlist.service';
import { Product } from '../models/product.model';

describe('WishlistService', () => {
  let service: WishlistService;

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
    inStock: false
  };

  const mockProduct3: Product = {
    id: 3,
    name: 'Test Product 3',
    description: 'Test Description 3',
    price: 2999,
    category: 'kids',
    subCategory: 'bottomwear',
    brand: 'TestBrand3',
    sizes: ['4', '6', '8'],
    colors: ['Green', 'Yellow'],
    images: ['image3.jpg'],
    rating: 4.7,
    reviews: 150,
    inStock: true
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WishlistService]
    });
    service = TestBed.inject(WishlistService);
    
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initialization', () => {
    it('should load wishlist from localStorage on initialization', () => {
      const storedWishlist = [mockProduct, mockProduct2];
      localStorage.setItem('wishlist_items', JSON.stringify(storedWishlist));
      
      const newService = new WishlistService();
      
      newService.getWishlistItems().subscribe(items => {
        expect(items).toEqual(storedWishlist);
        expect(items.length).toBe(2);
      });
    });

    it('should initialize with empty wishlist if no localStorage data', () => {
      service.getWishlistItems().subscribe(items => {
        expect(items).toEqual([]);
        expect(items.length).toBe(0);
      });
    });

    it('should handle corrupted localStorage data', () => {
      localStorage.setItem('wishlist_items', 'invalid json');
      spyOn(console, 'error');
      
      const newService = new WishlistService();
      
      newService.getWishlistItems().subscribe(items => {
        expect(items).toEqual([]);
        expect(console.error).toHaveBeenCalled();
      });
    });

    it('should handle null localStorage data', () => {
      localStorage.setItem('wishlist_items', 'null');
      
      const newService = new WishlistService();
      
      newService.getWishlistItems().subscribe(items => {
        expect(items).toEqual([]);
      });
    });
  });

  describe('getWishlistItems', () => {
    it('should return observable of wishlist items', () => {
      const observable = service.getWishlistItems();
      expect(observable).toBeTruthy();
      
      observable.subscribe(items => {
        expect(Array.isArray(items)).toBeTruthy();
      });
    });

    it('should return current wishlist items', () => {
      service.addToWishlist(mockProduct);
      service.addToWishlist(mockProduct2);
      
      service.getWishlistItems().subscribe(items => {
        expect(items.length).toBe(2);
        expect(items).toContain(mockProduct);
        expect(items).toContain(mockProduct2);
      });
    });
  });

  describe('addToWishlist', () => {
    it('should add new product to wishlist', () => {
      service.addToWishlist(mockProduct);
      
      service.getWishlistItems().subscribe(items => {
        expect(items.length).toBe(1);
        expect(items[0]).toEqual(mockProduct);
      });
      
      const storedWishlist = JSON.parse(localStorage.getItem('wishlist_items') || '[]');
      expect(storedWishlist).toEqual([mockProduct]);
    });

    it('should add multiple different products to wishlist', () => {
      service.addToWishlist(mockProduct);
      service.addToWishlist(mockProduct2);
      service.addToWishlist(mockProduct3);
      
      service.getWishlistItems().subscribe(items => {
        expect(items.length).toBe(3);
        expect(items).toContain(mockProduct);
        expect(items).toContain(mockProduct2);
        expect(items).toContain(mockProduct3);
      });
    });

    it('should not add duplicate products', () => {
      service.addToWishlist(mockProduct);
      service.addToWishlist(mockProduct);
      
      service.getWishlistItems().subscribe(items => {
        expect(items.length).toBe(1);
        expect(items[0]).toEqual(mockProduct);
      });
    });

    it('should not add product with same ID', () => {
      const duplicateProduct = { ...mockProduct, name: 'Different Name' };
      
      service.addToWishlist(mockProduct);
      service.addToWishlist(duplicateProduct);
      
      service.getWishlistItems().subscribe(items => {
        expect(items.length).toBe(1);
        expect(items[0]).toEqual(mockProduct);
      });
    });

    it('should update localStorage after adding', () => {
      service.addToWishlist(mockProduct);
      
      const storedWishlist = JSON.parse(localStorage.getItem('wishlist_items') || '[]');
      expect(storedWishlist.length).toBe(1);
      expect(storedWishlist[0].id).toBe(mockProduct.id);
    });

    it('should handle localStorage errors gracefully', () => {
      spyOn(localStorage, 'setItem').and.throwError('Storage error');
      spyOn(console, 'error');
      
      // Should not throw error
      expect(() => service.addToWishlist(mockProduct)).not.toThrow();
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle adding product with undefined id', () => {
      const invalidProduct = { ...mockProduct, id: undefined as any };
      
      service.addToWishlist(invalidProduct);
      
      service.getWishlistItems().subscribe(items => {
        expect(items.length).toBe(1);
      });
    });

    it('should handle adding null product', () => {
      expect(() => service.addToWishlist(null as any)).not.toThrow();
    });
  });

  describe('removeFromWishlist', () => {
    beforeEach(() => {
      service.addToWishlist(mockProduct);
      service.addToWishlist(mockProduct2);
      service.addToWishlist(mockProduct3);
    });

    it('should remove product from wishlist by ID', () => {
      service.removeFromWishlist(mockProduct.id);
      
      service.getWishlistItems().subscribe(items => {
        expect(items.length).toBe(2);
        expect(items.find(item => item.id === mockProduct.id)).toBeUndefined();
        expect(items).toContain(mockProduct2);
        expect(items).toContain(mockProduct3);
      });
    });

    it('should not remove anything if product ID not found', () => {
      service.removeFromWishlist(999);
      
      service.getWishlistItems().subscribe(items => {
        expect(items.length).toBe(3);
        expect(items).toContain(mockProduct);
        expect(items).toContain(mockProduct2);
        expect(items).toContain(mockProduct3);
      });
    });

    it('should handle removing from empty wishlist', () => {
      service.clearWishlist();
      service.removeFromWishlist(mockProduct.id);
      
      service.getWishlistItems().subscribe(items => {
        expect(items.length).toBe(0);
      });
    });

    it('should update localStorage after removal', () => {
      service.removeFromWishlist(mockProduct.id);
      
      const storedWishlist = JSON.parse(localStorage.getItem('wishlist_items') || '[]');
      expect(storedWishlist.length).toBe(2);
      expect(storedWishlist.find((item: Product) => item.id === mockProduct.id)).toBeUndefined();
    });

    it('should handle localStorage errors gracefully', () => {
      spyOn(localStorage, 'setItem').and.throwError('Storage error');
      spyOn(console, 'error');
      
      // Should not throw error
      expect(() => service.removeFromWishlist(mockProduct.id)).not.toThrow();
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle removing with undefined ID', () => {
      expect(() => service.removeFromWishlist(undefined as any)).not.toThrow();
    });

    it('should handle removing with null ID', () => {
      expect(() => service.removeFromWishlist(null as any)).not.toThrow();
    });

    it('should handle removing with negative ID', () => {
      service.removeFromWishlist(-1);
      
      service.getWishlistItems().subscribe(items => {
        expect(items.length).toBe(3);
      });
    });
  });

  describe('isInWishlist', () => {
    beforeEach(() => {
      service.addToWishlist(mockProduct);
      service.addToWishlist(mockProduct2);
    });

    it('should return true for product in wishlist', () => {
      service.isInWishlist(mockProduct.id).subscribe(isInWishlist => {
        expect(isInWishlist).toBeTruthy();
      });
    });

    it('should return false for product not in wishlist', () => {
      service.isInWishlist(mockProduct3.id).subscribe(isInWishlist => {
        expect(isInWishlist).toBeFalsy();
      });
    });

    it('should return false for non-existent product ID', () => {
      service.isInWishlist(999).subscribe(isInWishlist => {
        expect(isInWishlist).toBeFalsy();
      });
    });

    it('should handle undefined product ID', () => {
      service.isInWishlist(undefined as any).subscribe(isInWishlist => {
        expect(isInWishlist).toBeFalsy();
      });
    });

    it('should handle null product ID', () => {
      service.isInWishlist(null as any).subscribe(isInWishlist => {
        expect(isInWishlist).toBeFalsy();
      });
    });

    it('should handle negative product ID', () => {
      service.isInWishlist(-1).subscribe(isInWishlist => {
        expect(isInWishlist).toBeFalsy();
      });
    });

    it('should update when wishlist changes', () => {
      let isInWishlistValues: boolean[] = [];
      
      service.isInWishlist(mockProduct3.id).subscribe(isInWishlist => {
        isInWishlistValues.push(isInWishlist);
      });
      
      service.addToWishlist(mockProduct3);
      
      expect(isInWishlistValues.length).toBeGreaterThan(1);
      expect(isInWishlistValues[0]).toBeFalsy();
      expect(isInWishlistValues[isInWishlistValues.length - 1]).toBeTruthy();
    });
  });

  describe('toggleWishlist', () => {
    it('should add product if not in wishlist', () => {
      service.toggleWishlist(mockProduct);
      
      service.getWishlistItems().subscribe(items => {
        expect(items.length).toBe(1);
        expect(items[0]).toEqual(mockProduct);
      });
    });

    it('should remove product if already in wishlist', () => {
      service.addToWishlist(mockProduct);
      service.toggleWishlist(mockProduct);
      
      service.getWishlistItems().subscribe(items => {
        expect(items.length).toBe(0);
      });
    });

    it('should toggle correctly multiple times', () => {
      let itemsCount = 0;
      
      // Add
      service.toggleWishlist(mockProduct);
      service.getWishlistItems().subscribe(items => {
        itemsCount = items.length;
      });
      expect(itemsCount).toBe(1);
      
      // Remove
      service.toggleWishlist(mockProduct);
      service.getWishlistItems().subscribe(items => {
        itemsCount = items.length;
      });
      expect(itemsCount).toBe(0);
      
      // Add again
      service.toggleWishlist(mockProduct);
      service.getWishlistItems().subscribe(items => {
        itemsCount = items.length;
      });
      expect(itemsCount).toBe(1);
    });

    it('should handle toggling with null product', () => {
      expect(() => service.toggleWishlist(null as any)).not.toThrow();
    });

    it('should handle toggling with undefined product', () => {
      expect(() => service.toggleWishlist(undefined as any)).not.toThrow();
    });

    it('should handle toggling with product without ID', () => {
      const invalidProduct = { ...mockProduct, id: undefined as any };
      
      expect(() => service.toggleWishlist(invalidProduct)).not.toThrow();
    });
  });

  describe('getWishlistCount', () => {
    it('should return 0 for empty wishlist', () => {
      service.getWishlistCount().subscribe(count => {
        expect(count).toBe(0);
      });
    });

    it('should return correct count for single item', () => {
      service.addToWishlist(mockProduct);
      
      service.getWishlistCount().subscribe(count => {
        expect(count).toBe(1);
      });
    });

    it('should return correct count for multiple items', () => {
      service.addToWishlist(mockProduct);
      service.addToWishlist(mockProduct2);
      service.addToWishlist(mockProduct3);
      
      service.getWishlistCount().subscribe(count => {
        expect(count).toBe(3);
      });
    });

    it('should update count when items are added', () => {
      let countValues: number[] = [];
      
      service.getWishlistCount().subscribe(count => {
        countValues.push(count);
      });
      
      service.addToWishlist(mockProduct);
      service.addToWishlist(mockProduct2);
      
      expect(countValues.length).toBeGreaterThan(2);
      expect(countValues[0]).toBe(0);
      expect(countValues[countValues.length - 1]).toBe(2);
    });

    it('should update count when items are removed', () => {
      service.addToWishlist(mockProduct);
      service.addToWishlist(mockProduct2);
      
      let countValues: number[] = [];
      
      service.getWishlistCount().subscribe(count => {
        countValues.push(count);
      });
      
      service.removeFromWishlist(mockProduct.id);
      
      expect(countValues.length).toBeGreaterThan(1);
      expect(countValues[0]).toBe(2);
      expect(countValues[countValues.length - 1]).toBe(1);
    });
  });

  describe('clearWishlist', () => {
    beforeEach(() => {
      service.addToWishlist(mockProduct);
      service.addToWishlist(mockProduct2);
      service.addToWishlist(mockProduct3);
    });

    it('should clear all items from wishlist', () => {
      service.clearWishlist();
      
      service.getWishlistItems().subscribe(items => {
        expect(items.length).toBe(0);
        expect(items).toEqual([]);
      });
    });

    it('should clear localStorage', () => {
      service.clearWishlist();
      
      const storedWishlist = JSON.parse(localStorage.getItem('wishlist_items') || '[]');
      expect(storedWishlist).toEqual([]);
    });

    it('should reset wishlist count to 0', () => {
      service.clearWishlist();
      
      service.getWishlistCount().subscribe(count => {
        expect(count).toBe(0);
      });
    });

    it('should handle clearing already empty wishlist', () => {
      service.clearWishlist();
      service.clearWishlist();
      
      service.getWishlistItems().subscribe(items => {
        expect(items.length).toBe(0);
      });
    });

    it('should handle localStorage errors gracefully', () => {
      spyOn(localStorage, 'setItem').and.throwError('Storage error');
      spyOn(console, 'error');
      
      // Should not throw error
      expect(() => service.clearWishlist()).not.toThrow();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle very large wishlist', () => {
      const largeWishlist = Array.from({ length: 1000 }, (_, i) => ({
        ...mockProduct,
        id: i + 1,
        name: `Product ${i + 1}`
      }));
      
      largeWishlist.forEach(product => service.addToWishlist(product));
      
      service.getWishlistItems().subscribe(items => {
        expect(items.length).toBe(1000);
      });
    });

    it('should handle duplicate IDs correctly', () => {
      const product1 = { ...mockProduct, id: 1, name: 'Product 1' };
      const product2 = { ...mockProduct, id: 1, name: 'Product 2' };
      
      service.addToWishlist(product1);
      service.addToWishlist(product2);
      
      service.getWishlistItems().subscribe(items => {
        expect(items.length).toBe(1);
        expect(items[0]).toEqual(product1);
      });
    });

    it('should handle localStorage quota exceeded', () => {
      const largeProduct = { ...mockProduct, description: 'x'.repeat(1000000) };
      
      spyOn(localStorage, 'setItem').and.throwError('QuotaExceededError');
      spyOn(console, 'error');
      
      expect(() => service.addToWishlist(largeProduct)).not.toThrow();
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle concurrent modifications', () => {
      service.addToWishlist(mockProduct);
      
      // Simulate concurrent access
      setTimeout(() => service.addToWishlist(mockProduct2), 0);
      setTimeout(() => service.addToWishlist(mockProduct3), 0);
      
      service.getWishlistItems().subscribe(items => {
        expect(items.length).toBeGreaterThan(0);
      });
    });

    it('should handle products with missing required fields', () => {
      const incompleteProduct = { id: 999 } as Product;
      
      expect(() => service.addToWishlist(incompleteProduct)).not.toThrow();
      
      service.getWishlistItems().subscribe(items => {
        expect(items.length).toBe(1);
        expect(items[0].id).toBe(999);
      });
    });

    it('should handle multiple subscribers', () => {
      const subscription1Values: Product[][] = [];
      const subscription2Values: Product[][] = [];
      
      service.getWishlistItems().subscribe(items => subscription1Values.push(items));
      service.getWishlistItems().subscribe(items => subscription2Values.push(items));
      
      service.addToWishlist(mockProduct);
      
      expect(subscription1Values.length).toBeGreaterThan(0);
      expect(subscription2Values.length).toBeGreaterThan(0);
      expect(subscription1Values[subscription1Values.length - 1]).toEqual(
        subscription2Values[subscription2Values.length - 1]
      );
    });

    it('should handle localStorage being disabled', () => {
      spyOn(localStorage, 'getItem').and.throwError('Storage disabled');
      spyOn(localStorage, 'setItem').and.throwError('Storage disabled');
      spyOn(console, 'error');
      
      const newService = new WishlistService();
      
      expect(() => newService.addToWishlist(mockProduct)).not.toThrow();
      expect(console.error).toHaveBeenCalled();
      
      newService.getWishlistItems().subscribe(items => {
        expect(Array.isArray(items)).toBeTruthy();
      });
    });
  });
});