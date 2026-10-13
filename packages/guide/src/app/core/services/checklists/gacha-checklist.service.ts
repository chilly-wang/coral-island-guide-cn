import { Injectable, signal } from '@angular/core';
import { BaseChecklistService } from './base-checklist.service';

/** Items obtained from the Savannah gacha machines; shared by the journal page and the My Coral Guide checklist. */
@Injectable({ providedIn: 'root' })
export class GachaChecklistService extends BaseChecklistService {
    private readonly revision = signal(0);

    constructor() { super('gacha'); }

    override isChecked(id: string): boolean {
        this.revision();
        return super.isChecked(id);
    }

    override save(): void {
        super.save();
        this.revision.update(value => value + 1);
    }
}
