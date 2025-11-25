import { Component } from '@angular/core';
import { CarrinhoService } from '../carrinho.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-historico',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './historico.component.html',
  styleUrl: './historico.component.css'
})
export class HistoricoComponent {
  constructor(public carrinho: CarrinhoService) {}

  get cartCount(): number {
    return this.carrinho.listar().length;
  }

}
