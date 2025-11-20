// Caminho: src/app/menu-gerente/overview/overview.component.ts (versão final e completa)

// ============================================================================
// IMPORTS - Importações necessárias do Angular
// ============================================================================
// Component: Decorator para criar um componente Angular
// OnInit: Interface para executar código quando o componente inicia
// CommonModule: Módulo que fornece *ngIf, *ngFor, etc.
// FormsModule: Módulo que permite usar [(ngModel)] para two-way binding
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Componentes do menu-gerente que este componente usa
import { AddItemModalComponent } from '../add-item-modal/add-item-modal.component';
import { RemovePopupComponent } from '../remove-popup/remove-popup.component';
import { EditItemModalComponent } from '../edit-item-modal/edit-item-modal.component'; 

// ============================================================================
// INTERFACE - Define a estrutura de cada item do cardápio
// ============================================================================
// MenuItem define o que cada item do menu tem: id, foto, nome, preço, etc
export interface MenuItem {
  id: number;                // ID único do item (para identificar)
  foto?: string;             // Caminho da foto do item
  nome: string;              // Nome do item (Pizza Mussarela, Coca, etc)
  preco: string;             // Preço formatado (R$ 49,90)
  categoria: string;         // Categoria do item (Pizza, Bebida, Doce)
  tag?: string;              // Tag adicional (Mussarela, Coca, etc)
  descricao?: string;        // Descrição do item
}

// ============================================================================
// DECORATOR @Component - Configuração do componente
// ============================================================================
// selector: Nome da tag HTML que esse componente usa (<app-overview>)
// standalone: true = Componente funciona sozinho sem precisar de módulo
// imports: Módulos e componentes que este componente precisa usar
// templateUrl: Arquivo HTML que renderiza a interface
// styleUrls: Arquivo CSS com os estilos deste componente
@Component({
  selector: 'app-overview',
  standalone: true, 
  imports: [
    CommonModule,               // Fornece *ngIf, *ngFor, etc.
    FormsModule,                // Fornece [(ngModel)] para inputs
    AddItemModalComponent,      // Modal para adicionar novos itens
    RemovePopupComponent,       // Popup para confirmar remoção
    EditItemModalComponent      // Modal para editar itens existentes
  ],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  
  menuItems: MenuItem[] = [
    { id: 1, foto: 'pizza_sq.jpg', nome: 'Pizza Mussarela', preco: 'R$ 49,90', categoria: 'Pizza', tag: 'Mussarela', descricao: 'Descrição da Pizza Mussarela.' },
    { id: 2, foto: 'pizza_sq.jpg', nome: 'Pizza Pepperoni', preco: 'R$ 49,90', categoria: 'Pizza', tag: 'Pepperoni', descricao: 'Descrição da Pizza Pepperoni.' },
    { id: 3, foto: 'coca_sq.jpg', nome: 'Coca', preco: 'R$ 8,00', categoria: 'Bebida', tag: 'Coca', descricao: 'Bebida refrescante de 350ml.' },
    { id: 4, foto: 'chocolate_sq.jpg', nome: 'Pizza Chocolate', preco: 'R$ 56,00', categoria: 'Doce', tag: 'Chocolate', descricao: 'Pizza doce com chocolate e frutas.' },
  ];

 filteredItems: MenuItem[] = [...this.menuItems];
  searchTerm: string = '';
  
  // ============================================================================
  // FILTROS - Variáveis que controlam como os itens são exibidos
  // ============================================================================
  // selectedCategory: A categoria selecionada no momento
  // Começa com 'Todas' para mostrar todos os itens sem filtro
  selectedCategory: string = 'Todas';

  // allCategories: Lista das categorias que aparecem como botões de filtro
  // Deve ser igual às categorias dos itens (Pizza, Doce, Bebida)
  allCategories: string[] = ['Todas', 'Pizza', 'Doce', 'Bebida'];

  // ============================================================================
  // MODAIS - Variáveis para controlar quais modais estão abertos ou fechados
  // ============================================================================
  // isAddItemModalOpen: true = modal de adicionar está visível, false = escondido
  isAddItemModalOpen: boolean = false;

  // isEditItemModalOpen: true = modal de editar está visível, false = escondido
  isEditItemModalOpen: boolean = false; 

  // isRemovePopupOpen: true = popup de confirmação de remoção está visível, false = escondido
  isRemovePopupOpen: boolean = false;

  // selectedItem: Armazena o item que está sendo editado ou removido
  // null = nenhum item selecionado no momento
  selectedItem: MenuItem | null = null;

  // ============================================================================
  // MÉTODO LIFECYCLE - ngOnInit executa quando o componente carrega
  // ============================================================================
  // Chamamos applyCombinedFilter para aplicar os filtros quando o componente inicia
  ngOnInit(): void {
    this.applyCombinedFilter(); // CORRIGIDO
  }  // --- Lógica de Abertura/Fechamento ---

  // ============================================================================
  // MÉTODOS PARA ABRIR/FECHAR MODAIS
  // ============================================================================
  
  // openAddItemModal: Abre o modal para adicionar um novo item ao cardápio
  openAddItemModal(): void {
    this.isAddItemModalOpen = true;
  }
  
  // openEditItem: Abre o modal para editar um item existente
  // Recebe o item como parâmetro e armazena em selectedItem
  openEditItem(item: MenuItem): void { // <-- Função que o HTML precisa
    this.selectedItem = item; 
    this.isEditItemModalOpen = true; 
  }

  // openRemoveConfirm: Abre o popup para confirmar a remoção de um item
  // Armazena o item selecionado antes de pedir confirmação
  openRemoveConfirm(item: MenuItem): void {
    this.selectedItem = item;
    this.isRemovePopupOpen = true;
  }
  
  // closeModal: Fecha todos os modais e reseta as variáveis
  // Também aplica os filtros novamente para atualizar a lista após operações
  closeModal(): void {
    this.isAddItemModalOpen = false;
    this.isEditItemModalOpen = false; 
    this.isRemovePopupOpen = false;
    this.selectedItem = null;
    this.applyCombinedFilter(); // CORRIGIDO
  }

  // ============================================================================
  // MÉTODO PARA FILTRO POR CATEGORIA
  // ============================================================================
  
  // applyCategoryFilter: Muda a categoria selecionada e aplica o filtro
  // Recebe a categoria (Pizza, Doce, Bebida ou Todas)
  applyCategoryFilter(category: string): void {
    // Define qual categoria está selecionada (muda visual dos botões)
    this.selectedCategory = category;

    // Aplica o filtro combinado (texto + categoria) para atualizar a lista
    this.applyCombinedFilter();
  }

  // ============================================================================
  // MÉTODOS PARA ADICIONAR, EDITAR E REMOVER ITENS (CRUD)
  // ============================================================================
  
  // onItemAdded: Executado quando um novo item é adicionado via modal
  // Adiciona o item no início da lista e fecha o modal
  onItemAdded(newItem: MenuItem): void {
    this.menuItems.unshift({ ...newItem, id: Date.now() });
    this.closeModal(); 
  }
  
  // onItemUpdated: Executado quando um item é editado via modal
  // Encontra o item na lista e substitui suas informações
  onItemUpdated(updatedItem: MenuItem): void { // <-- Função que o HTML precisa
    if (this.selectedItem) {
      const index = this.menuItems.findIndex(i => i.id === this.selectedItem!.id);
      if (index !== -1) {
        this.menuItems[index] = { ...this.menuItems[index], ...updatedItem };
      }
    }
    this.closeModal();
  }

  // onRemoveConfirmed: Executado quando o usuário confirma a remoção de um item
  // Remove o item da lista e fecha o popup
  onRemoveConfirmed(): void {
    if (this.selectedItem) {
      this.menuItems = this.menuItems.filter(i => i.id !== this.selectedItem!.id);
    }
    this.closeModal();
  } // Lógica de Filtro COMBINADA (Texto + Categoria)
  applyCombinedFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();
    
    let tempItems = this.menuItems;

    // A. FILTRO DE TEXTO: Aplica a busca por texto no nome/categoria
    if (term) {
      tempItems = tempItems.filter(
        item =>
          item.nome.toLowerCase().includes(term) ||
          item.categoria.toLowerCase().includes(term)
      );
    }

    // B. FILTRO DE CATEGORIA: Aplica a categoria selecionada
    if (this.selectedCategory !== 'Todas') {
      tempItems = tempItems.filter(item => 
        item.categoria === this.selectedCategory
      );
    }

    this.filteredItems = tempItems;
  }
}