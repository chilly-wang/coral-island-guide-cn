import { Injectable, signal } from '@angular/core';
import { BaseChecklistService } from './base-checklist.service';

/** Completed town attractions; shared by the locations page and the My Coral Guide checklist. */
@Injectable({ providedIn: 'root' })
export class AttractionsChecklistService extends BaseChecklistService {
    private readonly revision = signal(0);

    constructor() { super('attractions'); }

    override isChecked(id: string): boolean {
        this.revision();
        return super.isChecked(id);
    }

    override save(): void {
        super.save();
        this.revision.update(value => value + 1);
    }
}
