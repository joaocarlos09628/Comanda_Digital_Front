import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  // Importações necessárias para usar *ngFor e routerLink no template
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  // Categorias exibidas na barra horizontal (usadas pelo template)
  categories = [
    { label: 'Pizza', icon: '🍕', bg: 'bg-yellow-50' },
    { label: 'Bebidas', icon: '🥤', bg: 'bg-blue-50' },
    { label: 'Sobremesa', icon: '🍰', bg: 'bg-pink-50' },
    { label: 'Especiais', icon: '⭐', bg: 'bg-green-50' }
  ];

  // Produtos de exemplo que alimentam os cards (poderá vir de um serviço no futuro)
  products = [
    {
      id: 1,
      name: 'Margherita Especial',
      description: 'Molho de tomate artesanal, mussarela, manjericão fresco.',
      price: 29.9,
      img: 'https://placehold.co/100x100/fecaca/9f1239?text=Item'
    },
    {
      id: 2,
      name: 'Pepperoni Crocante',
      description: 'Fatias generosas de pepperoni e borda crocante.',
      price: 34.5,
      img: 'https://placehold.co/100x100/fecaca/9f1239?text=Item'
    },
    {
      id: 3,
      name: 'Quatro Queijos Premium',
      description: 'Blend de queijos especiais, toque de mel opcional.',
      price: 38.0,
      img: 'https://placehold.co/100x100/fecaca/9f1239?text=Item'
    }
  ];

  // Ação de adicionar ao carrinho (aqui só um stub que loga no console)
  addToCart(product: any) {
    console.log('Adicionar ao carrinho:', product);
    // futuramente chamar um serviço de carrinho
  }
}
