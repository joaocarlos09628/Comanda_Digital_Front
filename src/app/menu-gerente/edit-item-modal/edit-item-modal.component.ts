import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuItem } from '../overview/overview.component'; 
// *** NOVO: Importe os módulos de animação ***
import { trigger, state, style, transition, animate } from '@angular/animations'; 


@Component({
  selector: 'app-edit-item-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-item-modal.component.html',
  styleUrls: ['./edit-item-modal.component.css'],
  // *** NOVO: Defina a animação do Side-Panel ***
  animations: [
    trigger('slideIn', [
      // Estado inicial (fora da tela, à direita)
      state('void', style({ transform: 'translateX(100%)' })),
      // Transição de entrada (vem da direita para 0)
      transition('void => *', [
        animate('300ms ease-out')
      ]),
      // Transição de saída (vai para fora da tela)
      transition('* => void', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class EditItemModalComponent implements OnInit {
  // Entradas/Saídas (Inputs e Outputs)
  @Input() item!: MenuItem; // O item que vem do OverviewComponent
  @Output() close = new EventEmitter<void>();
  @Output() itemUpdated = new EventEmitter<MenuItem>(); 

  // A propriedade que o HTML precisa para o formulário (corrigindo 'Property 'editForm' does not exist')
  editForm: Partial<MenuItem> = {};

  ngOnInit(): void {
    // Inicializa o formulário com os dados do item que veio como Input
    this.editForm = { ...this.item };
  }
  
  // Função que o HTML precisa (corrigindo 'Property 'onCancel' does not exist')
  onCancel(): void {
    this.close.emit();
  }

  // Função que o HTML precisa (corrigindo 'Property 'onSubmit' does not exist')
  onSubmit(): void {
    if (!this.editForm.nome || !this.editForm.preco || !this.editForm.categoria) {
        alert('Preencha os campos obrigatórios.');
        return;
    }
    
    // Emite o item atualizado para o componente pai
    this.itemUpdated.emit(this.editForm as MenuItem);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // Atualiza a pré-visualização (editForm.foto) com o Base64 da imagem
        this.editForm.foto = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}

