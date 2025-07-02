import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <span>&copy; {{ year }} Fashion E-Commerce. All rights reserved.</span>
        <span class="footer-links">
          <a href="#">Privacy Policy</a> |
          <a href="#">Terms of Service</a> |
          <a href="#">Contact Us</a>
        </span>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #222;
      color: #fff;
      padding: 24px 0;
      text-align: center;
      margin-top: 40px;
    }
    .footer-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .footer-links a {
      color: #fff;
      text-decoration: underline;
      margin: 0 4px;
      font-size: 0.95em;
    }
    .footer-links a:hover {
      color: #ff3f6c;
    }
  `]
})
export class FooterComponent {
  year = new Date().getFullYear();
} 