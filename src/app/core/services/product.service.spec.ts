import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../models/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Cotton T-Shirt',
      description: 'Comfortable cotton t-shirt for everyday wear',
      price: 999,
      category: 'men',
      subCategory: 'topwear',
      brand: 'Nike',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Red', 'Blue', 'White'],
      images: ['image1.jpg', 'image2.jpg'],
      rating: 4.5,
      reviews: 120,
      inStock: true
    },
    {
      id: 2,
      name: 'Denim Jeans',
      description: 'Classic denim jeans with perfect fit',
      price: 1999,
      category: 'women',
      subCategory: 'bottomwear',
      brand: 'Levi\'s',
      sizes: ['28', '30', '32', '34'],
      colors: ['Dark Blue', 'Light Blue'],
      images: ['jeans1.jpg', 'jeans2.jpg'],
      rating: 4.2,
      reviews: 85,
      inStock: true
    },
    {
      id: 3,
      name: 'Running Shoes',
      description: 'Lightweight running shoes for athletes',
      price: 3999,
      category: 'men',
      subCategory: 'footwear',
      brand: 'Adidas',
      sizes: ['7', '8', '9', '10', '11'],
      colors: ['Black', 'White', 'Gray'],
      images: ['shoes1.jpg', 'shoes2.jpg'],
      rating: 4.8,
      reviews: 250,
      inStock: false
    },
    {
      id: 4,
      name: 'Summer Dress',
      description: 'Elegant summer dress for special occasions',
      price: 2499,
      category: 'women',
      subCategory: 'dress',
      brand: 'Zara',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Red', 'Black', 'Yellow'],
      images: ['dress1.jpg', 'dress2.jpg'],
      rating: 4.3,
      reviews: 95,
      inStock: true
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts', () => {
    it('should retrieve all products', () => {
      service.getProducts().subscribe(products => {
        expect(products).toEqual(mockProducts);
        expect(products.length).toBe(4);
      });

      const req = httpMock.expectOne('assets/data/products.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });

    it('should handle empty products array', () => {
      service.getProducts().subscribe(products => {
        expect(products).toEqual([]);
        expect(products.length).toBe(0);
      });

      const req = httpMock.expectOne('assets/data/products.json');
      req.flush([]);
    });

    it('should handle HTTP error', () => {
      service.getProducts().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne('assets/data/products.json');
      req.error(new ErrorEvent('Network error'));
    });

    it('should handle malformed response', () => {
      service.getProducts().subscribe(products => {
        // Angular's HttpClient will treat 'invalid json' as a string response, not JSON
        expect(products as any).toBe('invalid json');
      });

      const req = httpMock.expectOne('assets/data/products.json');
      req.flush('invalid json');
    });
  });

  describe('getProductById', () => {
    it('should retrieve product by valid ID', () => {
      const productId = 1;
      
      service.getProductById(productId).subscribe(product => {
        expect(product).toEqual(mockProducts[0]);
        expect(product?.id).toBe(productId);
      });

      const req = httpMock.expectOne('assets/data/products.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });

    it('should return undefined for non-existent product ID', () => {
      const productId = 999;
      
      service.getProductById(productId).subscribe(product => {
        expect(product).toBeUndefined();
      });

      const req = httpMock.expectOne('assets/data/products.json');
      req.flush(mockProducts);
    });

    it('should handle zero ID', () => {
      const productId = 0;
      
      service.getProductById(productId).subscribe(product => {
        expect(product).toBeUndefined();
      });

      const req = httpMock.expectOne('assets/data/products.json');
      req.flush(mockProducts);
    });

    it('should handle negative ID', () => {
      const productId = -1;
      
      service.getProductById(productId).subscribe(product => {
        expect(product).toBeUndefined();
      });

      const req = httpMock.expectOne('assets/data/products.json');
      req.flush(mockProducts);
    });

    it('should handle HTTP error', () => {
      const productId = 1;
      
      service.getProductById(productId).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne('assets/data/products.json');
      req.error(new ErrorEvent('Network error'));
    });

    it('should handle empty products array', () => {
      const productId = 1;
      
      service.getProductById(productId).subscribe(product => {
        expect(product).toBeUndefined();
      });

      const req = httpMock.expectOne('assets/data/products.json');
      req.flush([]);
    });
  });

  describe('getProductsByCategory', () => {
    it('should retrieve products by valid category', () => {
      const category = 'men';
      const expectedProducts = mockProducts.filter(p => p.category === category);
      
      service.getProductsByCategory(category).subscribe(products => {
        expect(products).toEqual(expectedProducts);
        expect(products.length).toBe(2);
        expect(products.every(p => p.category === category)).toBeTruthy();
      });

      const req = httpMock.expectOne('assets/data/products.json');
      req.flush(mockProducts);
    });

    it('should return empty array for non-existent category', () => {
      const category = 'nonexistent';
      
      service.getProductsByCategory(category).subscribe(products => {
        expect(products).toEqual([]);
        expect(products.length).toBe(0);
      });

      const req = httpMock.expectOne('assets/data/products.json');
      req.flush(mockProducts);
    });

    it('should handle case sensitivity', () => {
      const category = 'MEN';
      
      service.getProductsByCategory(category).subscribe(products => {
        expect(products).toEqual([]);
        expect(products.length).toBe(0);
      });

      const req = httpMock.expectOne('assets/data/products.json');
      req.flush(mockProducts);
    });

    it('should handle empty category string', () => {
      const category = '';
      
      service.getProductsByCategory(category).subscribe(products => {
        expect(products).toEqual([]);
        expect(products.length).toBe(0);
      });

      const req = httpMock.expectOne('assets/data/products.json');
      req.flush(mockProducts);
    });

    it('should handle HTTP error', () => {
      const category = 'men';
      
      service.getProductsByCategory(category).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne('assets/data/products.json');
      req.error(new ErrorEvent('Network error'));
    });

    it('should handle women category', () => {
      const category = 'women';
      const expectedProducts = mockProducts.filter(p => p.category === category);
      
      service.getProductsByCategory(category).subscribe(products => {
        expect(products.length).toBe(2);
        expect(products.every(p => p.category === category)).toBeTruthy();
      });

      const req = httpMock.expectOne('assets/data/products.json');
      req.flush(mockProducts);
    });
  });

  describe('getProductsByBrand', () => {
    it('should retrieve products by valid brand', () => {
      const brand = 'Nike';
      const expectedProducts = mockProducts.filter(p => p.brand === brand);
      
      service.getProductsByBrand(brand).subscribe(products => {
        expect(products).toEqual(expectedProducts);
        expect(products.length).toBe(1);
        expect(products.every(p => p.brand === brand)).toBeTruthy();
      });

      const req = httpMock.expectOne('assets/data/products.json');
      req.flush(mockProducts);
    });

    it('should return empty array for non-existent brand', () => {
      const brand = 'UnknownBrand';
      
      service.getProductsByBrand(brand).subscribe(products => {
        expect(products).toEqual([]);
        expect(products.length).toBe(0);
      });

      const req = httpMock.expectOne('assets/data/products.json');
      req.flush(mockProducts);
    });

    it('should handle case sensitivity', () => {
      const brand = 'nike';
      
      service.getProductsByBrand(brand).subscribe(products => {
        expect(products).toEqual([]);
        expect(products.length).toBe(0);
      });

      const req = httpMock.expectOne('assets/data/products.json');
      req.flush(mockProducts);
    });

    it('should handle empty brand string', () => {
      const brand = '';
      
      service.getProductsByBrand(brand).subscribe(products => {
        expect(products).toEqual([]);
        expect(products.length).toBe(0);
      });

      const req = httpMock.expectOne('assets/data/products.json');
      req.flush(mockProducts);
    });

    it('should handle HTTP error', () => {
      const brand = 'Nike';
      
      service.getProductsByBrand(brand).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne('assets/data/products.json');
      req.error(new ErrorEvent('Network error'));
    });

    it('should handle special characters in brand name', () => {
      const brand = 'Levi\'s';
      const expectedProducts = mockProducts.filter(p => p.brand === brand);
      
      service.getProductsByBrand(brand).subscribe(products => {
        expect(products.length).toBe(1);
        expect(products[0].brand).toBe(brand);
      });

      const req = httpMock.expectOne('assets/data/products.json');
      req.flush(mockProducts);
    });
  });

  describe('searchProducts', () => {
    it('should search products by name', () => {
      const query = 'cotton';
      
      service.searchProducts(query).subscribe(products => {
        expect(products.length).toBe(1);
        expect(products[0].name.toLowerCase()).toContain(query.toLowerCase());
      });

      const req = httpMock.expectOne('assets/data/products.json');
      req.flush(mockProducts);
    });

    it('should search products by description', () => {
      const query = 'comfortable';
      
      service.searchProducts(query).subscribe(products => {
        expect(products.length).toBe(1);
        expect(products[0].description.toLowerCase()).toContain(query.toLowerCase());
      });

      const req = httpMock.expectOne('assets/data/products.json');
      req.flush(mockProducts);
    });

    it('should be case insensitive', () => {
      const query = 'COTTON';
      
      service.searchProducts(query).subscribe(products => {
        expect(products.length).toBe(1);
        expect(products[0].name.toLowerCase()).toContain(query.toLowerCase());
      });

      const req = httpMock.expectOne('assets/data/products.json');
      req.flush(mockProducts);
    });

    it('should return empty array for non-matching query', () => {
      const query = 'nonexistent';
      
      service.searchProducts(query).subscribe(products => {
        expect(products).toEqual([]);
        expect(products.length).toBe(0);
      });

      const req = httpMock.expectOne('assets/data/products.json');
      req.flush(mockProducts);
    });

    it('should handle empty query string', () => {
      const query = '';
      
      service.searchProducts(query).subscribe(products => {
        expect(products).toEqual(mockProducts);
        expect(products.length).toBe(4);
      });

      const req = httpMock.expectOne('assets/data/products.json');
      req.flush(mockProducts);
    });

    it('should handle whitespace-only query', () => {
      const query = '   ';
      
      service.searchProducts(query).subscribe(products => {
        expect(products).toEqual([]);
        expect(products.length).toBe(0);
      });

      const req = httpMock.expectOne('assets/data/products.json');
      req.flush(mockProducts);
    });

    it('should search in both name and description', () => {
      const query = 'elegant';
      
      service.searchProducts(query).subscribe(products => {
        expect(products.length).toBe(1);
        expect(products[0].description.toLowerCase()).toContain(query.toLowerCase());
      });

      const req = httpMock.expectOne('assets/data/products.json');
      req.flush(mockProducts);
    });

    it('should handle partial matches', () => {
      const query = 'denim';
      
      service.searchProducts(query).subscribe(products => {
        expect(products.length).toBe(1);
        expect(products[0].name.toLowerCase()).toContain(query.toLowerCase());
      });

      const req = httpMock.expectOne('assets/data/products.json');
      req.flush(mockProducts);
    });

    it('should handle HTTP error', () => {
      const query = 'cotton';
      
      service.searchProducts(query).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne('assets/data/products.json');
      req.error(new ErrorEvent('Network error'));
    });

    it('should handle special characters in query', () => {
      const query = 'levi\'s';
      
      service.searchProducts(query).subscribe(products => {
        expect(products.length).toBe(0); // Brand is not searched, only name and description
      });

      const req = httpMock.expectOne('assets/data/products.json');
      req.flush(mockProducts);
    });
  });

  describe('edge cases', () => {
    it('should handle null response', () => {
      service.getProducts().subscribe(products => {
        expect(products).toBeNull();
      });

      const req = httpMock.expectOne('assets/data/products.json');
      req.flush(null);
    });

    it('should handle products with missing properties', () => {
      const incompleteProducts = [
        { id: 1, name: 'Test Product' } as Product
      ];

      service.getProducts().subscribe(products => {
        expect(products).toEqual(incompleteProducts);
      });

      const req = httpMock.expectOne('assets/data/products.json');
      req.flush(incompleteProducts);
    });

    it('should handle very large product arrays', () => {
      const largeProductArray = Array.from({ length: 1000 }, (_, i) => ({
        ...mockProducts[0],
        id: i + 1,
        name: `Product ${i + 1}`
      }));

      service.getProducts().subscribe(products => {
        expect(products.length).toBe(1000);
      });

      const req = httpMock.expectOne('assets/data/products.json');
      req.flush(largeProductArray);
    });

    it('should handle products with duplicate IDs', () => {
      const duplicateProducts = [
        { ...mockProducts[0], id: 1 },
        { ...mockProducts[1], id: 1 }
      ];

      service.getProductById(1).subscribe(product => {
        expect(product).toEqual(duplicateProducts[0]);
      });

      const req = httpMock.expectOne('assets/data/products.json');
      req.flush(duplicateProducts);
    });

    it('should handle network timeout', () => {
      service.getProducts().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne('assets/data/products.json');
      req.error(new ErrorEvent('timeout'));
    });
  });
});