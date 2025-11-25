import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DishService } from '../../../services/dish.service';
import { MenuItem } from '../../menu-gerente/overview/overview.component';
import { CarrinhoService } from '../../tela-cliente/carrinho.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  dishes: MenuItem[] = [];
  filtered: MenuItem[] = [];
  categories: string[] = [];
  selectedCategory = 'Todas';
  search = '';

  constructor(private dishService: DishService, private carrinho: CarrinhoService, private router: Router) {}

  get cartCount(): number {
    return this.carrinho.listar().length;
  }

  ngOnInit(): void {
    // Se vier de navigation state com termo de busca, aplica antes de renderizar
    const s = history.state && (history.state as any).search;
    if (s) this.search = s;
    this.load();
  }

  openBusca() {
    this.router.navigate(['/cliente/busca']);
  }

  load() {
    this.dishService.findAll().subscribe({
      next: (items) => {
        this.dishes = items;
        const set = new Set(items.map(i => i.categoria || 'Outros'));
        this.categories = ['Todas', ...Array.from(set)];
        this.applyFilter();
      },
      error: (e) => console.error('Erro ao carregar pratos', e)
    });
  }

  applyFilter() {
    const term = this.search.trim().toLowerCase();
    this.filtered = this.dishes.filter(d => {
      const matchCat = this.selectedCategory === 'Todas' || d.categoria === this.selectedCategory;
      const matchText = !term || (d.nome && d.nome.toLowerCase().includes(term));
      return matchCat && matchText;
    });
  }

  onCategory(cat: string) {
    this.selectedCategory = cat;
    this.applyFilter();
  }

  addToCart(item: MenuItem) {
    this.carrinho.adicionar({ ...item, quantidade: 1 });
  }
}
