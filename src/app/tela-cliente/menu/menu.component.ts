import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MenuService } from '../menu.service';
import { CarrinhoService } from '../carrinho.service';
import { MenuItemCardComponent } from './menu-item-card/menu-item-card.component';

// Interface tipada para os itens do cardápio
export interface ItemMenu {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  img?: string;
  inCart?: boolean;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuItemCardComponent],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  // categorias disponíveis
  categorias: string[] = ['Pizzas', 'Doces', 'Bebidas'];
  categoriaSelecionada = 'Pizzas';

  // todos os itens (fonte única de verdade). itensMenu é a lista filtrada exibida
  allItems: ItemMenu[] = [];
  itensMenu: ItemMenu[] = [];

  constructor(
    private router: Router,
    private menuService: MenuService,
    private carrinhoService: CarrinhoService
  ) {}

  ngOnInit(): void {
    // Dados de exemplo - substituir por chamada ao menuService quando pronto
    this.allItems = [
      { id: 1, nome: 'Mussarela', descricao: 'Queijo, molho especial', preco: 49.9, categoria: 'Pizzas', img: 'https://placehold.co/240x180/fecaca/9f1239?text=Mussarela' },
      { id: 2, nome: 'Pepperoni', descricao: 'Pepperoni crocante', preco: 54.9, categoria: 'Pizzas', img: 'https://placehold.co/240x180/fecaca/9f1239?text=Pepperoni' },
      { id: 3, nome: 'Portuguesa', descricao: 'Ovo, presunto e cebola', preco: 59.9, categoria: 'Pizzas', img: 'https://placehold.co/240x180/fecaca/9f1239?text=Portuguesa' }
    ];

    // Inicializo a lista exibida
    this.filtrarPorCategoria(this.categoriaSelecionada);
  }

  // Filtra itens por categoria e atualiza categoriaSelecionada
  filtrarPorCategoria(categoria: string) {
    this.categoriaSelecionada = categoria;
    this.itensMenu = this.allItems.filter(i => i.categoria === categoria);
  }

  // Navega para a tela de detalhe do produto
  navegarParaDetalhes(item: ItemMenu) {
    this.router.navigate(['/item-detalhe', item.id]);
  }

  // Adiciona o item ao carrinho através do serviço
  adicionarAoCarrinho(item: ItemMenu) {
    item.inCart = true;
    this.carrinhoService.adicionar(item);
  }

  // Retorna a contagem atual do carrinho (sincronamente)
  get contadorCarrinho() {
    // carrinhoService.listar() retorna array no nosso serviço de exemplo
    return this.carrinhoService.listar().length;
  }
}

