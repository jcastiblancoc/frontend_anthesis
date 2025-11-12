import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-container">
      <div class="logo-container">
        <a href="https://github.com/jcastiblancoc" target="_blank" rel="noopener noreferrer">
          <img [src]="logoPath" alt="JC Logo" class="jc-logo">
        </a>
      </div>
      <div class="content">
        <h1 class="title">Knowledge Test Anthesis</h1>
        <h2 class="subtitle">Dashboard of Emissions</h2>
        <p class="description">Comprehensive analytics and insights for tracking and reducing your carbon footprint</p>
        <div class="cta-buttons">
          <a routerLink="/dashboard" class="primary-button">View Dashboard</a>
        </div>
      </div>
      <div class="footer">
        <div class="creator-info">
          <div class="creator-name">Created by: Jeisson Castiblanco</div>
          <div class="creator-role">Backend Engineer</div>
          <div class="creator-year">© 2025</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
    
    .home-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
      padding: 2rem;
      position: relative;
      overflow: hidden;
    }
    
    .logo-container {
      display: flex;
      justify-content: flex-start;
      width: 100%;
      margin-bottom: 2rem;
    }
    
    .content {
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 2rem 0;
    }
    
    .title {
      font-size: 3.5rem;
      font-weight: 800;
      color: #2c3e50;
      margin: 0 0 1rem;
      line-height: 1.2;
    }
    
    .subtitle {
      font-size: 1.8rem;
      font-weight: 400;
      color: #4a6fa5;
      margin: 0 0 2rem;
    }
    
    .description {
      font-size: 1.2rem;
      color: #5d7796;
      max-width: 600px;
      margin: 0 auto 3rem;
      line-height: 1.6;
    }
    
    .cta-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-bottom: 4rem;
    }
    
    .primary-button, .secondary-button {
      padding: 0.9rem 2rem;
      border-radius: 8px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s ease;
      font-size: 1rem;
    }
    
    .primary-button {
      background-color: #2ecc71;
      color: white;
      border: 2px solid #2ecc71;
      
      &:hover {
        background-color: #27ae60;
        border-color: #27ae60;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3);
      }
    }
    
    .secondary-button {
      background-color: transparent;
      color: #4a6fa5;
      border: 2px solid #4a6fa5;
      
      &:hover {
        background-color: rgba(74, 111, 165, 0.1);
        transform: translateY(-2px);
      }
    }
    
    .footer {
      margin-top: auto;
      width: 100%;
      padding: 2rem 0;
      text-align: center;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }
    
    .creator-info {
      margin-top: 2rem;
      color: #5d7796;
      font-size: 0.9rem;
    }
    
    .creator-name {
      font-weight: 600;
      color: #2c3e50;
    }
    
    .creator-role {
      font-style: italic;
      margin: 0.3rem 0;
    }
    
    .creator-year {
      font-size: 0.8rem;
      opacity: 0.8;
    }
    
    .jc-logo {
      height: 100px;
      width: auto;
      border-radius: 8px;
      object-fit: contain;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    @media (max-width: 768px) {
      .title {
        font-size: 2.5rem;
      }
      
      .subtitle {
        font-size: 1.4rem;
      }
      
      .cta-buttons {
        flex-direction: column;
        align-items: center;
      }
    }
  `]
})
export class HomeComponent {
  logoPath = 'assets/images/generated-image.jpg';
}
