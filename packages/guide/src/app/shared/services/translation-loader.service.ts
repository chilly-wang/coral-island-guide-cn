import { inject, Injectable } from '@angular/core';
import { TranslateLoader, TranslationObject } from "@ngx-translate/core";
import { forkJoin, map, Observable, of, ReplaySubject, tap } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { SettingsService } from "./settings.service";

@Injectable({
    providedIn: 'root'
})
export class TranslationLoaderService implements TranslateLoader {

    private static readonly englishGameTranslations = new ReplaySubject<TranslationObject>(1);

    readonly englishGameTranslations$ = TranslationLoaderService.englishGameTranslations.asObservable();

    readonly #http = inject(HttpClient);
    readonly #settings = inject(SettingsService).getSettings();
    readonly #i18nPath = `/assets/${this.#settings.useBeta ? 'beta' : 'live'}/database/i18n/`
    readonly #appI18nPath = '/assets/i18n/app/';

    getTranslation(lang: string): Observable<TranslationObject> {
        const appLanguage = lang === 'zh-CN' ? 'zh-CN' : 'en';

        return forkJoin([
            this.#http.get<TranslationObject>(this.#i18nPath + lang + '.json'),
            lang === 'zh-CN'
                ? this.#http.get<TranslationObject>(this.#i18nPath + 'en.json')
                : of({}),
            this.#http.get<TranslationObject>(this.#appI18nPath + 'en.json'),
            this.#http.get<TranslationObject>(this.#appI18nPath + appLanguage + '.json'),
        ]).pipe(
            tap(([gameTranslations, englishGameTranslations]) => {
                if (lang === 'en') {
                    TranslationLoaderService.englishGameTranslations.next(gameTranslations);
                } else if (lang === 'zh-CN') {
                    TranslationLoaderService.englishGameTranslations.next(englishGameTranslations);
                }
            }),
            map(([gameTranslations, englishGameTranslations, englishUi, localizedUi]) => {
                const localizedGameTranslations = lang === 'zh-CN'
                    ? this.#applyEntityFallbacks(gameTranslations, englishGameTranslations, localizedUi)
                    : gameTranslations;

                return this.#mergeTranslations(localizedGameTranslations, englishUi, localizedUi);
            })
        );
    }

    /**
     * Keep the official game localization authoritative. Only official entries
     * that are missing or still equal to their English value receive a
     * centralized app-level entity-name fallback.
     */
    #applyEntityFallbacks(
        gameTranslations: TranslationObject,
        englishGameTranslations: TranslationObject,
        localizedUi: TranslationObject
    ): TranslationObject {
        const entityFallbacks = this.#readNestedObject(localizedUi, ['APP', 'DISPLAY', 'ENTITY']);
        if (!entityFallbacks) return gameTranslations;

        const result = {...gameTranslations};
        for (const [key, englishValue] of Object.entries(englishGameTranslations)) {
            if (typeof englishValue !== 'string') continue;

            const localizedValue = result[key];
            if (typeof localizedValue === 'string' && localizedValue.trim() !== englishValue.trim()) continue;

            const fallbackKey = this.#normalizeDisplayValue(englishValue);
            const fallback = entityFallbacks[fallbackKey];
            if (typeof fallback === 'string' && fallback) result[key] = fallback;
        }

        return result;
    }

    #readNestedObject(source: TranslationObject, path: string[]): TranslationObject | undefined {
        let current: unknown = source;
        for (const segment of path) {
            if (!this.#isTranslationObject(current)) return undefined;
            current = current[segment];
        }
        return this.#isTranslationObject(current) ? current : undefined;
    }

    #normalizeDisplayValue(value: string): string {
        return value
            .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
            .replace(/[^A-Za-z0-9]+/g, '_')
            .replace(/^_|_$/g, '')
            .toUpperCase();
    }

    #mergeTranslations(...translations: TranslationObject[]): TranslationObject {
        return translations.reduce<TranslationObject>((result, translation) => {
            for (const [key, value] of Object.entries(translation)) {
                const existingValue = result[key];
                result[key] = this.#isTranslationObject(existingValue) && this.#isTranslationObject(value)
                    ? this.#mergeTranslations(existingValue, value)
                    : value;
            }
            return result;
        }, {});
    }

    #isTranslationObject(value: unknown): value is TranslationObject {
        return typeof value === 'object' && value !== null && !Array.isArray(value);
    }

}
