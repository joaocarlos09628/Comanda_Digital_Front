// IMPORTAÇÕES PRINCIPAIS
import { Component, OnInit, OnDestroy, signal } from '@angular/core';

// Importações de Módulos Comuns para usar directives como *ngIf, *ngFor, etc
import { NgIf, NgFor, NgClass, DatePipe } from '@angular/common'; 

// Importações do CDK Drag & Drop para permitir arrastar e soltar cards entre colunas
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop'; 



// DEFINIÇÃO DE TIPOS E INTERFACES
// Interface que define a estrutura de um item dentro de um pedido (nome e quantidade)
interface OrderItem {
  name: string;
  qty: number;
}

// Interface que define a estrutura completa de um pedido do sistema
export interface Order { 
  id: string;                                           // ID único do pedido
  orderId: number;                                      // Número do pedido para exibição
  table: string;                                    
  status: 'A PREPARAR' | 'EM PREPARO' | 'PRONTO' | 'ENTREGUE';  // Estado atual do pedido
  items: OrderItem[];                                   // Lista de itens do pedido
  timestamp: Date;                                      // Data/hora de criação do pedido
  justUpdated?: boolean;                                // Flag para animar quando o status muda
}

// Declarações globais (variables do ambiente externo que podem estar disponíveis)
declare const __app_id: string;
declare const __firebase_config: string;
declare const __initial_auth_token: string;
@Component({
  selector: 'app-painel',
  standalone: true,
  imports: [
    // Imports Standalone Corretos:
    NgIf, NgFor, NgClass, DatePipe,// Comuns
    CdkDrag, CdkDropList, CdkDropListGroup // CDK Drag & Drop
  ], 
  templateUrl: './painel.component.html',
  styleUrl: './painel.component.css',
})
export class PainelComponent implements OnInit, OnDestroy {

  // ========== SINAIS (SIGNALS) - Estado Reativo do Componente ==========
  // Um Signal é como uma variável reativa que notifica quando muda
  
  // SINAL DA DATA E HORA ATUAL - Atualiza a cada segundo
  currentDateTime = signal<Date>(new Date());
  private updateIntervalId: any;  // ID do intervalo que atualiza a hora

  // ========== COLUNAS DO KANBAN - Listas de pedidos por status ==========
  // Cada sinal armazena um array de pedidos em cada etapa do fluxo
  
  // Sinal para pedidos que ainda não foram iniciados
  toPrepare = signal<Order[]>([
    { id: '1', orderId: 100, table: '', status: 'A PREPARAR', items: [{name: 'Pizza Margherita', qty: 1}, {name: 'Batata Frita', qty: 1}], timestamp: new Date(Date.now() - 5 * 60 * 1000) },
    { id: '2', orderId: 101, table: '', status: 'A PREPARAR', items: [{name: 'Refrigerante 600ml', qty: 2}, {name: 'Pizza Pepperoni', qty: 1}], timestamp: new Date(Date.now() - 3 * 60 * 1000) }
  ]);
  
  // Sinal para pedidos que estão sendo preparados
  inProgress = signal<Order[]>([
    { id: '3', orderId: 98, table: '', status: 'EM PREPARO', items: [{name: 'Pizza Quatro Queijos', qty: 1}], timestamp: new Date(Date.now() - 9 * 60 * 1000) }
  ]);
  
  // Sinal para pedidos que já foram finalizados
  ready = signal<Order[]>([
    { id: '4', orderId: 97, table: '', status: 'PRONTO', items: [{name: 'Pizza Chocolate', qty: 1}], timestamp: new Date(Date.now() - 15 * 60 * 1000) }
  ]);
  
  // Sinal para pedidos que já foram entregues
  delivered = signal<Order[]>([
    { id: '5', orderId: 96, table: '', status: 'ENTREGUE', items: [{name: 'Refrigerante 2L', qty: 1}], timestamp: new Date(Date.now() - 20 * 60 * 1000) }
  ]);

  constructor() {}
  
  // ========== PROPRIEDADES AUXILIARES ==========
  
  // Caminho da logo - tenta usar /assets/logo.png e faz fallback para favicon
  logoSrc = '/assets/logo.png';

  // Sinal para armazenar o texto de busca digitado pelo usuário
  searchQuery = signal('');
  
  // ========== LIFECYCLE - ngOnInit (quando o componente é inicializado) ==========
  ngOnInit() { 
    // Inicia um intervalo que atualiza a data/hora a cada 1000ms (1 segundo)
    // Isso faz o relógio no header ficar sempre com a hora correta
    this.updateIntervalId = setInterval(() => {
      this.currentDateTime.set(new Date());
    }, 1000);
  }

  // ========== LIFECYCLE - ngOnDestroy (quando o componente é destruído) ==========
  ngOnDestroy() {
    // Para o intervalo de atualização de hora
    // Isso libera memória e evita vazamentos de memória
    if (this.updateIntervalId) {
      clearInterval(this.updateIntervalId);
    }
  }

  // ========== MÉTODOS DE AÇÃO - Handlers de cliques de botão ==========
  
  // Método executado quando clica o botão de ATUALIZAR pedidos
  listenForOrders() { 
    console.log('Atualizando pedidos...');
    // Nota: Aqui você pode conectar a uma API real para buscar novos pedidos
  }

  // Método executado quando a imagem da logo FALHA ao carregar
  onLogoError() {
    // Se /assets/logo.png não existir, tenta usar o favicon como fallback
    if (this.logoSrc !== '/favicon.ico') {
      this.logoSrc = '/favicon.ico';
    }
  }

  // ========== MÉTODOS DE FILTRAGEM E BUSCA ==========
  
  // Filtra uma lista de pedidos com base no texto digitado na busca
  // Procura por: número do pedido, mesa ou nome de algum item
  filterOrders(list: Order[]): Order[] {
    // Pega o texto de busca e converte para minúsculas para comparação
    const q = this.searchQuery().toLowerCase().trim();
    // Se não houver texto, retorna todos os pedidos
    if (!q) return list;
    // Filtra apenas os pedidos que correspondem à busca
    return list.filter(o => {
      // Verifica se o número do pedido contém o texto procurado
      if (o.orderId.toString().includes(q)) return true;
      // Verifica se a mesa contém o texto procurado
      if (o.table && o.table.toLowerCase().includes(q)) return true;
      // Verifica se algum item do pedido tem o nome procurado
      if (o.items && o.items.some(i => i.name.toLowerCase().includes(q))) return true;
      // Se não achou em nada, não inclui na busca
      return false;
    });
  }


  /**
   * Calcula o tempo decorrido entre o timestamp do pedido e a hora atual
   * Retorna uma string formatada (ex: "há 5 minutos", "há 2 horas")
   */
  getTimeElapsed(timestamp: Date): string {
    // Pega a hora atual do sinal
    const now = this.currentDateTime();
    // Calcula a diferença em segundos entre agora e quando foi criado
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);

    // Se menos de 60 segundos, mostra uma mensagem genérica
    if (diffInSeconds < 60) {
      return 'há alguns segundos';
    } 
    // Se menos de 1 hora, converte para minutos
    else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `há ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    } 
    // Se 1 hora ou mais, converte para horas
    else {
      const hours = Math.floor(diffInSeconds / 3600);
      return `há ${hours} hora${hours > 1 ? 's' : ''}`;
    }
  }
  
  // ========== MÉTODOS DE DRAG & DROP - Arrastar e Soltar Cards entre Colunas ==========
  
  // Executado quando um card é arrastado de uma coluna para outra
  // O evento contém informações sobre qual card foi movido e para onde
  // CORREÇÃO CRÍTICA NGTSC(2345): Tipagem correta do evento CdkDragDrop
  drop(event: CdkDragDrop<Order[]>) { 
    // Se o card foi soltado na MESMA coluna, apenas reordena a posição
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      return;
    }

    // Se foi soltado em uma coluna DIFERENTE, transfere o card
    transferArrayItem(
      event.previousContainer.data,   // Remove da coluna antiga
      event.container.data,           // Adiciona na coluna nova
      event.previousIndex,            // Posição antiga
      event.currentIndex              // Posição nova
    );

    // Determina qual é o novo status baseado no ID da coluna destino
    let newStatus: Order['status'];
    switch (event.container.id) {
      case 'toPrepareList': newStatus = 'A PREPARAR'; break;
      case 'inProgressList': newStatus = 'EM PREPARO'; break;
      case 'readyList': newStatus = 'PRONTO'; break;
      case 'deliveredList': newStatus = 'ENTREGUE'; break;
      default: return;
    }

    const movedOrder = event.container.data[event.currentIndex];
    movedOrder.status = newStatus;

    // Comente a linha abaixo se o Firebase não estiver configurado:
    // this.updateOrderStatus(movedOrder.id, newStatus); 
    // Ativa o flag de "justUpdated" para mostrar uma animação visual
    // por 700ms para destacar que o pedido foi movido
    movedOrder.justUpdated = true;
    setTimeout(() => movedOrder.justUpdated = false, 700);
  }

  // ========== MÉTODOS DE ESTILO E CORES - Retornar classes/cores baseadas no status ==========
  
  // Cores baseadas no Figma (para a barra lateral do card)
  getStatusColor(status: Order['status']): string {
    switch (status) {
        case 'A PREPARAR': return 'border-red-500';      // Vermelho para pedidos novos
        case 'EM PREPARO': return 'border-orange-500';   // Laranja para pedidos em progresso
        case 'PRONTO': return 'border-green-500';        // Verde para pedidos finalizados
        case 'ENTREGUE': return 'border-blue-500';       // Azul para pedidos entregues
        default: return '';
    }
  }

  // ========== MÉTODOS DE TRANSIÇÃO DE STATUS - Mover pedidos entre colunas por botão ==========
  
  /**
   * Move um pedido para o próximo status por clique em botão de ação
   * A PREPARAR → EM PREPARO → PRONTO → ENTREGUE
   */
  moveOrderToNextStatus(orderId: number): void {
    // Faz cópias das listas atuais para evitar problemas de reatividade
    const currentToPrepare = this.toPrepare();
    const currentInProgress = this.inProgress();
    const currentReady = this.ready();
    const currentDelivered = this.delivered();

    // ========== ETAPA 1: De "A PREPARAR" para "EM PREPARO" ==========
    // Procura o pedido em cada lista e o move para a próxima
    let orderIndex = currentToPrepare.findIndex(o => o.orderId === orderId);
    if (orderIndex !== -1) {
      // Remove o pedido da lista "A PREPARAR"
      const [order] = currentToPrepare.splice(orderIndex, 1);
      // Atualiza o status do pedido
      order.status = 'EM PREPARO';
      // Ativa a animação de atualização por 700ms
      order.justUpdated = true;
      setTimeout(() => order.justUpdated = false, 700);
      // Salva as mudanças nas listas (reatividade do Signal)
      this.toPrepare.set([...currentToPrepare]);
      this.inProgress.set([...currentInProgress, order]);
      return;  // Sai do método (pedido já foi movido)
    }

    // ========== ETAPA 2: De "EM PREPARO" para "PRONTO" ==========
    orderIndex = currentInProgress.findIndex(o => o.orderId === orderId);
    if (orderIndex !== -1) {
      // Remove o pedido da lista "EM PREPARO"
      const [order] = currentInProgress.splice(orderIndex, 1);
      // Atualiza o status do pedido
      order.status = 'PRONTO';
      // Ativa a animação de atualização por 700ms
      order.justUpdated = true;
      setTimeout(() => order.justUpdated = false, 700);
      // Salva as mudanças nas listas
      this.inProgress.set([...currentInProgress]);
      this.ready.set([...currentReady, order]);
      return;  // Sai do método
    }

    // ========== ETAPA 3: De "PRONTO" para "ENTREGUE" ==========
    orderIndex = currentReady.findIndex(o => o.orderId === orderId);
    if (orderIndex !== -1) {
      // Remove o pedido da lista "PRONTO"
      const [order] = currentReady.splice(orderIndex, 1);
      // Atualiza o status do pedido
      order.status = 'ENTREGUE';
      // Ativa a animação de atualização por 700ms
      order.justUpdated = true;
      setTimeout(() => order.justUpdated = false, 700);
      // Salva as mudanças nas listas
      this.ready.set([...currentReady]);
      this.delivered.set([...currentDelivered, order]);
      return;  // Sai do método
    }
  }
}