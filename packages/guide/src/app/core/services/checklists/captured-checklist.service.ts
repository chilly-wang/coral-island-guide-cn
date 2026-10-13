import { inject, Injectable, signal } from '@angular/core';
import { BaseChecklistService } from './base-checklist.service';
import { MuseumChecklistService } from './museum-checklist.service';

/**
 * One capture/"obtained" checklist per existing save slot, used by the caught and found journals.
 * Donating to the museum implies having obtained the item, so donated items count as obtained,
 * while obtained items are not necessarily donated.
 */
@Injectable({ providedIn: 'root' })
export class CapturedChecklistService extends BaseChecklistService {
    private readonly revision = signal(0);
    private readonly museum = inject(MuseumChecklistService);

    constructor() { super('captured'); }

    override isChecked(id: string): boolean {
        this.revision();
        return super.isChecked(id);
    }

    override save(): void {
        super.save();
        this.revision.update(value => value + 1);
    }

    isDonated(id: string): boolean {
        this.revision();
        return this.museum.isChecked(id);
    }

    isObtained(id: string): boolean {
        return this.isChecked(id) || this.isDonated(id);
    }
}
