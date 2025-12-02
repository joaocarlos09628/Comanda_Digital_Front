import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderStatus } from '../../enums/order-status.enum';

@Component({
  selector: 'app-order-tracker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-tracker.component.html',
  styleUrls: ['./order-tracker.component.css']
})
export class OrderTrackerComponent implements OnChanges {
  @Input() status: OrderStatus | string | null | undefined = null;

  // returns -1 (none) .. 2 (all done)
  activeIndex(): number {
    // normalize status: trim, uppercase, and replace spaces/hyphens with underscore
    const raw = (this.status ?? '').toString();
    const s = raw.trim().toUpperCase().replace(/[-\s]+/g, '_');
    if (!s) return -1;
    const none = ['RECEIVED', 'DRAFT', 'PENDING'];
    const preparing = ['IN_PREPARATION', 'PREPARING', 'READY'];
    const onTheWay = ['ON_THE_WAY', 'OUT_FOR_DELIVERY', 'EN_ROUTE', 'DELIVERY'];
    const delivered = ['DELIVERED', 'FINISHED'];
    if (delivered.includes(s)) return 2;
    if (onTheWay.includes(s)) return 1;
    if (preparing.includes(s)) return 0;
    if (none.includes(s)) return -1;
    return -1;
  }

  isFilled(i: number) {
    const idx = this.activeIndex();
    return i <= idx;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['status']) {
      const raw = (this.status ?? '').toString();
      const normalized = raw.trim().toUpperCase().replace(/[-\s]+/g, '_');
      // debug: helps diagnose incoming values in the browser console
      // remove this log after verification
      // eslint-disable-next-line no-console
      console.log('[OrderTracker] status raw=', raw, 'normalized=', normalized);
    }
  }
}
