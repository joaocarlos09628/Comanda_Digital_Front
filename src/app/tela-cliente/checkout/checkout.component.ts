import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CarrinhoService } from '../carrinho.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  endereco = 'Rua sei lá faltou ideia';
  pagamento = 'Pagamento na entrega';
  valorSubtotal = 0;
  shipping = 10; // R$ 10,00

  constructor(private carrinho: CarrinhoService, private router: Router) {}

  ngOnInit(): void {
    console.log('CheckoutComponent: ngOnInit');
    this.recalc();
    // opcional: ouvir mudanças no carrinho
    this.carrinho.itemsChanged$.subscribe(() => this.recalc());
  }

  private recalc() {
    const items = this.carrinho.listar() || [];
    this.valorSubtotal = items.reduce((acc: number, it: any) => {
      const qtd = it.quantidade || 1;
      const preco = typeof it.preco === 'number' ? it.preco : parseFloat(String(it.preco).replace(/R\$|\s|\.|,/g, m => (m === ',' ? '.' : '')) ) || 0;
      return acc + preco * qtd;
    }, 0);
  }

  voltar() {
    this.router.navigate(['/cliente/carrinho']);
  }

  finalizarPedido() {
    // aqui só demonstrativo — o backend será integrado depois
    console.log('Finalizando pedido — subtotal', this.valorSubtotal, 'shipping', this.shipping, 'endereco', this.endereco);
    alert('Pedido finalizado (demo)');
    this.router.navigate(['/cliente']);
  }
}
