import { inject, Injectable, signal } from '@angular/core';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({ providedIn: 'root' })
export class NpcFavoritesService {
    private readonly storage = inject(LocalStorageService);
    private readonly storageKey = 'coral-guide-npc-favorites';
    readonly keys = signal<readonly string[]>(this.read());

    private read(): string[] {
        try {
            const value: unknown = JSON.parse(this.storage.getItem(this.storageKey) ?? '[]');
            return Array.isArray(value) ? value.filter((key): key is string => typeof key === 'string') : [];
        } catch { return []; }
    }

    toggle(key: string): void {
        const next = this.keys().includes(key) ? this.keys().filter(entry => entry !== key) : [...this.keys(), key];
        this.storage.setItem(this.storageKey, JSON.stringify(next));
        this.keys.set(next);
    }
}
