import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class InputValidationService {
  
  // Custom validators
  static emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const email = control.value;
      if (!email) return null;
      
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email) ? null : { invalidEmail: true };
    };
  }

  static passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value;
      if (!password) return null;
      
      const errors: ValidationErrors = {};
      
      if (password.length < 8) {
        errors['minLength'] = true;
      }
      
      if (!/[A-Z]/.test(password)) {
        errors['requiresUppercase'] = true;
      }
      
      if (!/[a-z]/.test(password)) {
        errors['requiresLowercase'] = true;
      }
      
      if (!/\d/.test(password)) {
        errors['requiresNumeric'] = true;
      }
      
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors['requiresSpecial'] = true;
      }
      
      return Object.keys(errors).length > 0 ? errors : null;
    };
  }

  static phoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const phone = control.value;
      if (!phone) return null;
      
      const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
      return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10 
        ? null : { invalidPhone: true };
    };
  }

  static noScriptValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      
      // Check for script tags or potential XSS attempts
      const scriptRegex = /<script[^>]*>.*?<\/script>/gi;
      const onEventRegex = /on\w+\s*=/gi;
      const javascriptRegex = /javascript:/gi;
      
      if (scriptRegex.test(value) || onEventRegex.test(value) || javascriptRegex.test(value)) {
        return { containsScript: true };
      }
      
      return null;
    };
  }

  // Input sanitization
  static sanitizeInput(input: string): string {
    if (!input) return '';
    
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .trim();
  }

  static sanitizeHtml(html: string): string {
    if (!html) return '';
    
    // Basic HTML sanitization - remove dangerous elements
    return html
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
      .replace(/<object[^>]*>.*?<\/object>/gi, '')
      .replace(/<embed[^>]*>.*?<\/embed>/gi, '')
      .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
      .replace(/on\w+\s*=\s*'[^']*'/gi, '')
      .replace(/javascript:/gi, '');
  }

  static validateAndSanitize(input: string, maxLength?: number): string {
    if (!input) return '';
    
    let sanitized = this.sanitizeInput(input);
    
    if (maxLength && sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
    }
    
    return sanitized;
  }
}