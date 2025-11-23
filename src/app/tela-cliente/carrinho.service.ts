import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {
  private items: any[] = [];

  constructor() { }

  // Adiciona item ao carrinho (exemplo simples, sem persistência)
  adicionar(item: any) {
    this.items.push(item);
    console.log('Carrinho - item adicionado:', item);
  }

  // Retorna itens do carrinho
  listar() {
    return this.items;
  }
}
