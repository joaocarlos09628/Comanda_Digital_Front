// tela-cliente/carrinho/carrinho.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon'; // Usando a interface anterior
import { ItemMenu } from '../home/home.component';

// Estrutura de um item no carrinho
interface CarrinhoItem extends ItemMenu {
  quantidade: number;
  subtotal: number;
}

@Component({
  selector: 'app-carrinho',
  standalone: true,
  // Adicionando DecimalPipe para formatação de moeda
  imports: [CommonModule, MatIconModule, DecimalPipe],
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.scss']
})
export class CarrinhoComponent implements OnInit {

  itensCarrinho: CarrinhoItem[] = [];
  valorTotal: number = 0;
  
  // Simulação de injeção do serviço de carrinho
  // constructor(private carrinhoService: CarrinhoService) {}

  ngOnInit(): void {
    // Dados de exemplo para o carrinho
    this.itensCarrinho = [
      {
        nome: 'Pizza Mussarela', descricao: 'Queijo, molho especial', preco: 49.90,
        urlImagem: 'https://placehold.co/200x200/fecaca/9f1239?text=Mussarela',
        quantidade: 1, subtotal: 49.90
      },
      {
        nome: 'Pizza Pepperoni', descricao: 'Pepperoni crocante', preco: 49.90,
        urlImagem: 'https://placehold.co/200x200/fecaca/9f1239?text=Pepperoni',
        quantidade: 2, subtotal: 99.80
      },
      {
        nome: 'Bebida Refri', descricao: 'Lata 350ml', preco: 6.00,
        urlImagem: null,
        quantidade: 4, subtotal: 24.00
      }
    ];
    
    this.calcularTotais();
  }

  calcularTotais(): void {
    this.valorTotal = this.itensCarrinho.reduce((acc, item) => {
      item.subtotal = item.preco * item.quantidade;
      return acc + item.subtotal;
    }, 0);
  }

  // Lógica para aumentar ou diminuir a quantidade
  atualizarQuantidade(item: CarrinhoItem, delta: number): void {
    item.quantidade += delta;
    
    if (item.quantidade <= 0) {
      // Remover item se a quantidade for 0 ou menos
      this.itensCarrinho = this.itensCarrinho.filter(i => i.nome !== item.nome);
    }
    
    this.calcularTotais();
  }
  
  // Ação para finalizar a compra
  irParaCheckout(): void {
    console.log('Navegando para o Checkout com total:', this.valorTotal);
    // Aqui você usaria o Router para navegar para /checkout
  }
}
