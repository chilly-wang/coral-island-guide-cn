import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
    providedIn: 'root',
})
export class LocalDataResetService {
    static readonly PROJECT_STORAGE_KEYS = [
        'coral-guide-settings',
        'user-data_live',
        'user-data_beta',
        'checklist',
        'checklist_live',
        'checklist_beta',
        'latest-changelogs',
        'databaseHideImportantNote',
        ...[
            'bought',
            'cooking-recipes',
            'crafted',
            'defeated',
            'heart-events',
            'museum',
            'offerings',
            'orchestra-zones',
            'shipped',
        ].flatMap((checklist) => [`checklist_${checklist}_live`, `checklist_${checklist}_beta`]),
    ] as const;

    readonly #localStorage = inject(LocalStorageService);

    resetAll(): void {
        LocalDataResetService.PROJECT_STORAGE_KEYS.forEach((key) => this.#localStorage.removeItem(key));
    }
}
