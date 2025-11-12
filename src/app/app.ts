import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="app-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
    
    .app-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 1rem;
      min-height: 100vh;
      background-color: #f5f7fa;
    }
    
    @media (prefers-color-scheme: dark) {
      .app-container {
        background-color: #121212;
        color: #e0e0e0;
      }
    }
  `]
})
export class App {}
