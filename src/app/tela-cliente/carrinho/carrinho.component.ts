import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CarrinhoService } from '../carrinho.service';

// Estrutura simples do item do carrinho usada neste componente
interface CarrinhoItem {
  id?: number | string;
  nome: string;
  descricao?: string;
  preco: number | string;
  UrlImage?: string;
  urlImagem?: string;
  quantidade: number;
  subtotal?: number;
}

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.css']
})
export class CarrinhoComponent implements OnInit {

  itensCarrinho: CarrinhoItem[] = [];
  valorTotal = 0;

  constructor(private carrinhoService: CarrinhoService, private router: Router) {}

  goBack() {
    // Volta para a tela do cliente. Usamos router.navigate para garantir comportamento consistente.
    this.router.navigate(['/cliente']);
  }

  ngOnInit(): void {
    // Busca itens do serviço de carrinho (retorna array em memória)
    this.syncFromService();

    // Assina eventos de mudança nos itens para atualizar a lista quando outro componente alterar
    this.carrinhoService.itemsChanged$.subscribe(() => this.syncFromService());
  }

  private syncFromService() {
    const stored = this.carrinhoService.listar() || [];
    this.itensCarrinho = stored.map((it: any) => {
      const precoNum = this.toNumberPrice(it.preco);
      const quantidade = typeof it.quantidade === 'number' ? it.quantidade : (it.quantidade ? Number(it.quantidade) : 1);
      return {
        id: it.id,
        nome: it.nome || it.name || '',
        descricao: it.descricao || it.description || '',
        preco: precoNum,
        UrlImage: it.UrlImage || it.urlImage || it.urlImagem || it.image || '',
        quantidade,
        subtotal: precoNum * quantidade
      } as CarrinhoItem;
    });
    this.calcularTotais();
  }

  private toNumberPrice(v: any): number {
    if (typeof v === 'number') return v;
    if (!v) return 0;
    let s = String(v);
    s = s.replace(/R\$|\s/g, '');
    s = s.replace(/\./g, '');
    s = s.replace(/,/g, '.');
    const n = parseFloat(s);
    return isNaN(n) ? 0 : n;
  }

  calcularTotais(): void {
    this.valorTotal = this.itensCarrinho.reduce((acc, item) => {
      item.subtotal = this.toNumberPrice(item.preco) * (item.quantidade || 0);
      return acc + (item.subtotal || 0);
    }, 0);
  }

  atualizarQuantidade(item: CarrinhoItem, delta: number): void {
    if (delta < 0 && item.quantidade === 1) {
      // se for diminuir quando quantidade=1, remove
      this.removerItem(item);
      return;
    }
    const nova = Math.max(0, (item.quantidade || 0) + delta);
    // atualizar no serviço e sincronizar
    this.carrinhoService.atualizarQuantidade(item, nova);
    this.syncFromService();
  }

  removerItem(item: CarrinhoItem) {
    this.carrinhoService.remover(item);
    this.syncFromService();
  }

  clearCart(): void {
    // Limpa totalmente o carrinho no serviço e sincroniza
    this.carrinhoService.clear();
    this.syncFromService();
  }

  openDetail(item: CarrinhoItem) {
    // se tivermos id, navega pela rota com id; caso contrário envia no state
    if (item.id !== undefined && item.id !== null) {
      this.router.navigate(['/item-detalhe', item.id]);
      return;
    }
    this.router.navigateByUrl('/item-detalhe', { state: { item } });
  }

  irParaCheckout(): void {
    // Navega para a tela de checkout
    console.log('Navegando para checkout, valorTotal=', this.valorTotal, 'itens=', this.itensCarrinho.length);
    this.router.navigate(['/cliente/checkout']).catch(err => console.error('Erro navegando para checkout', err));
  }
}
