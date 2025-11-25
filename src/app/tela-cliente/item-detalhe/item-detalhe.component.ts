import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DishService } from '../../../services/dish.service';
import { CarrinhoService } from '../carrinho.service';

@Component({
  selector: 'app-item-detalhe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item-detalhe.component.html',
  styleUrls: ['./item-detalhe.component.css']
})
export class ItemDetalheComponent implements OnInit {
  dish: any = null;
  displayPreco = '';

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private dishService: DishService,
    private carrinho: CarrinhoService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // Tenta buscar direto pelo endpoint
      const maybe = this.dishService.findById(+id);
      if (maybe && (maybe as any).subscribe) {
        (maybe as any).subscribe({
          next: (d: any) => this.setDish(d),
          error: (e: any) => {
            console.warn('findById falhou, tentando fallback findAll():', e);
            // fallback: buscar todos e procurar localmente pelo id
            this.dishService.findAll().subscribe({
              next: (list: any[]) => {
                const found = list.find(x => String(x.id) === String(id));
                if (found) this.setDish(found);
                else this.setDish({ nome: 'Item não encontrado', descricao: '', UrlImage: '', preco: 0 });
              },
              error: (err: any) => {
                console.error('findAll fallback também falhou', err);
                this.dish = { nome: 'Erro ao carregar item', descricao: '', UrlImage: '', preco: 0 };
              }
            });
          }
        });
      } else if (maybe && typeof (maybe as any).then === 'function') {
        (maybe as any).then((d: any) => this.setDish(d)).catch((e: any) => {
          console.warn('findById (promise) falhou, tentando findAll()', e);
          this.dishService.findAll().subscribe({
            next: (list: any[]) => {
              const found = list.find(x => String(x.id) === String(id));
              if (found) this.setDish(found);
              else this.setDish({ nome: 'Item não encontrado', descricao: '', UrlImage: '', preco: 0 });
            },
            error: (err: any) => {
              console.error('findAll fallback também falhou', err);
              this.dish = { nome: 'Erro ao carregar item', descricao: '', UrlImage: '', preco: 0 };
            }
          });
        });
      }
      return;
    }

    // Se não veio id, tentar ler o item enviado via navigation state (ex: do carrinho)
    const navState: any = history.state && (history.state as any).item ? (history.state as any).item : (history.state || null);
    if (navState && navState.nome) {
      // Normalizar forma dos campos para exibir
      this.setDish({
        id: navState.id,
        nome: navState.nome || navState.name,
        descricao: navState.descricao || navState.description,
        UrlImage: navState.UrlImage || navState.urlImage || navState.urlImagem || navState.image,
        preco: navState.preco || navState.price || navState.subtotal || 0
      });
    }
  }

  goBack() {
    this.location.back();
  }

  private setDish(d: any) {
    this.dish = d || null;
    // Normaliza e define `displayPreco` como string pronta para exibição
    if (!d) {
      this.displayPreco = '';
      return;
    }
    const raw = d.preco ?? d.price ?? d.precoStr ?? d.precoFormatado;
    if (typeof raw === 'string') {
      // Se já vier no formato "R$ 49,90" usa direto
      if (raw.trim().startsWith('R$')) {
        this.displayPreco = raw;
      } else {
        // tenta normalizar string numérica
        const normalized = raw.replace('R$', '').replace(/\./g, '').replace(/,/g, '.').trim();
        const parsed = parseFloat(normalized);
        this.displayPreco = isNaN(parsed) ? 'R$ 0,00' : `R$ ${parsed.toFixed(2).replace('.', ',')}`;
      }
    } else if (typeof raw === 'number') {
      this.displayPreco = `R$ ${raw.toFixed(2).replace('.', ',')}`;
    } else {
      this.displayPreco = 'R$ 0,00';
    }
  }

  quantidade = 1;
  isFavorite = false;

  inc() { this.quantidade++; }
  dec() { if (this.quantidade > 1) this.quantidade--; }

  atualizarQuantidadeFromDetail(delta: number) {
    const next = this.quantidade + delta;
    if (next < 1) return;
    this.quantidade = next;
  }

  toggleFavorite() { this.isFavorite = !this.isFavorite; }

  addToCart() {
    if (!this.dish) return;
    this.carrinho.adicionar({ ...this.dish, quantidade: this.quantidade });
  }
}
