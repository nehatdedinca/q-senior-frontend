import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTableModule,
} from '@angular/material/table';
import { CollectibleAsset, ComparableSale } from '../../../../models/collectible-asset';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [
    MatCardModule,
    MatTableModule,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRowDef,
    MatRow,
    CurrencyPipe,
    DatePipe,
  ],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionHistoryComponent {
  asset = input.required<CollectibleAsset>();

  protected displayedColumns: (keyof ComparableSale)[] = [
    'date',
    'description',
    'auctionHouse',
    'location',
    'price',
  ];
}
