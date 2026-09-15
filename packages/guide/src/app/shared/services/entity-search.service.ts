import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, shareReplay } from 'rxjs';
import { DisplayTranslationService } from '../pipes/localized-display.pipe';
import { TranslationLoaderService } from './translation-loader.service';

type SearchableEntity = Record<string, unknown>;

/**
 * Builds user-facing search aliases for game entities without changing their
 * canonical data. English game names and the final localized display name are
 * kept together so every consumer can support bilingual search consistently.
 */
@Injectable({ providedIn: 'root' })
export class EntitySearchService {
    readonly #display = inject(DisplayTranslationService);
    readonly #translationLoader = inject(TranslationLoaderService);

    readonly englishTranslations$ = this.#translationLoader.englishGameTranslations$
        .pipe(
            map((translations) =>
                Object.fromEntries(
                    Object.entries(translations).filter(
                        (entry): entry is [string, string] => typeof entry[1] === 'string',
                    ),
                ),
            ),
            shareReplay({ bufferSize: 1, refCount: false }),
        );

    readonly #englishTranslations = toSignal(this.englishTranslations$, {
        initialValue: {} as Record<string, string>,
    });

    getLocalizedName(entity: unknown): string {
        return this.#display.translateEntity(entity);
    }

    getSearchTerms(entity: unknown): string[] {
        if (entity === null || entity === undefined) return [];
        if (typeof entity !== 'object') return [String(entity), this.getLocalizedName(entity)];

        const record = entity as SearchableEntity;
        const displayKey = this.#firstString(
            record['displayName'],
            record['characterName'],
            record['readableName'],
            record['title'],
            record['name'],
        );
        const canonicalName = this.#firstString(record['key']);
        const englishName = displayKey ? this.#englishTranslations()[displayKey] : undefined;
        const localizedName = this.getLocalizedName(entity);

        return [...new Set([englishName, canonicalName, localizedName].filter(this.#isSearchableName))];
    }

    matches(entity: unknown, query: string): boolean {
        const normalizedQuery = this.normalize(query);
        if (!normalizedQuery) return true;

        return this.getSearchTerms(entity).some((term) => {
            const normalizedTerm = this.normalize(term);
            return (
                normalizedTerm.includes(normalizedQuery) ||
                (normalizedTerm.length >= 3 && normalizedQuery.startsWith(`${normalizedTerm} `))
            );
        });
    }

    normalize(value: unknown): string {
        return String(value ?? '').trim().toLocaleLowerCase();
    }

    #firstString(...values: unknown[]): string | undefined {
        return values.find((value): value is string => typeof value === 'string' && value.length > 0);
    }

    #isSearchableName = (value: string | undefined): value is string =>
        typeof value === 'string' && value.trim().length > 0;
}
