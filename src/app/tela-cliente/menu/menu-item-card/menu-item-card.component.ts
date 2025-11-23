import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemMenu } from '../menu.component';

@Component({
  selector: 'app-menu-item-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-item-card.component.html',
  styleUrls: ['./menu-item-card.component.css']
})
export class MenuItemCardComponent {
  @Input() item!: ItemMenu;
  @Output() add = new EventEmitter<ItemMenu>();
  @Output() open = new EventEmitter<ItemMenu>();

  onAdd() {
    this.add.emit(this.item);
  }

  onOpen() {
    this.open.emit(this.item);
  }
}
