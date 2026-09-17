import { Injectable, signal } from '@angular/core';
import { BaseChecklistService } from './base-checklist.service';

/** One capture checklist per existing save slot; donation remains independent. */
@Injectable({ providedIn: 'root' })
export class CapturedChecklistService extends BaseChecklistService {
    private readonly revision = signal(0);

    constructor() { super('captured'); }

    override isChecked(id: string): boolean {
        this.revision();
        return super.isChecked(id);
    }

    override save(): void {
        super.save();
        this.revision.update(value => value + 1);
    }

    toggle(id: string): void {
        this.isChecked(id) ? this.remove(id) : this.add(id);
    }
}
