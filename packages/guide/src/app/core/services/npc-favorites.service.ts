import { computed, inject, Injectable } from '@angular/core';
import { UserDataService } from './user-data.service';

/** NPC favorites are stored in user data, shared by all save games. */
@Injectable({ providedIn: 'root' })
export class NpcFavoritesService {
    private readonly userData = inject(UserDataService);
    readonly keys = computed<readonly string[]>(() => this.userData.userData().npcFavorites);

    toggle(key: string): void {
        const next = this.keys().includes(key) ? this.keys().filter(entry => entry !== key) : [...this.keys(), key];
        this.userData.userData.update(store => ({ ...store, npcFavorites: next }));
        this.userData.save();
    }
}
