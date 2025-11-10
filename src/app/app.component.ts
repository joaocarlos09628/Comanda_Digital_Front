import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './menu-gerente/overview/overview.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, OverviewComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Sistema de Gerenciamento';
}

