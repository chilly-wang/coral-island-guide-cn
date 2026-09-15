import { inject, Injectable, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { addSpacesToPascalCase } from '@ci/util';

const OFFICIAL_DISPLAY_KEYS: Record<string, string> = {
    Blacksmith: '4633BB554EAEE6807AC67A9B8BE8EED7',
    Carpenter: '1BF6BEC149674EF9BC5999B35847C64F',
    'Band of Smiles': '9191D0C8486FFBDF7A3416A232220DA9',
    'Socket & Pan': '3045076142E0AB4EC869F2B692EC8B0F',
    'Ramen Shop': '945146F74738816ECE4003A4A06A1C3A',
    'Cherry blossom': '8EF2D38949838663AFDA43A85BFC2ED7',
    'Tree Planting': 'E20176C34306883D7D50FFA88C62E0C9',
    Animal: '233D397F4705A67583B35B974E9FA79A',
    'Beach Clean Up': '1A58302449D23CC3014F12AF86A0F8C8',
    Spooky: 'DAEB45214FF7DDC93F510CB9B286E893',
    Harvest: '64AE6355470B9DB1892FB4AD0801561D',
    'New Year Eve Feast': '120609E041A9BD77372301A7949E878F',
    'Winter Fair': '5766C0024266D1606B7D78B01217B494',
};

// Canonical location values do not consistently store their localization key.
// Keep the verified aliases here so every location consumer follows the same
// official-translation-first lookup before using APP.DISPLAY.LOCATION fallbacks.
const OFFICIAL_LOCATION_KEYS: Record<string, string> = {
    'Ocean Dock': 'Location_OceanDockPier',
    'Ocean Dock Pier': 'Location_OceanDockPier',
    Savannah: 'Location_Savannah',
    Lake: 'Location_Lake',
    'Cavern Entrance': 'Location_MineAreaOutside',
    'Garden Lane': 'Location_GardenLane',
    Beach: 'Location_Beach',
    Forest: 'Location_Forest',
    Woodlands: 'Location_Woodlands',
    'Hot Spring': 'Location_Hotspring',
    Dump: 'Location_RecyclingCenter',
    'Middle Forest': 'Location_MiddleForest',
    Diving: '1AF655E8460C05CE7F055081D83C3A5E',
    'Jellyfish Area': '0CBA72F440D3B916BF1404B41A61826C',
};

@Pipe({
    name: 'localizedDisplay',
    standalone: true,
    pure: false,
})
export class LocalizedDisplayPipe implements PipeTransform {
    readonly #display = inject(DisplayTranslationService);

    transform(value: unknown, context = 'VALUE'): string {
        return this.#display.translate(value, context);
    }
}

/**
 * The single display entry point for game entity names. Most entities expose a
 * game-localization key through `displayName`, `characterName`, `title`, or
 * `readableName`; callers may also pass that key directly.
 */
@Pipe({
    name: 'localizedEntityName',
    standalone: true,
    pure: false,
})
export class LocalizedEntityNamePipe implements PipeTransform {
    readonly #display = inject(DisplayTranslationService);

    transform(entity: unknown): string {
        return this.#display.translateEntity(entity);
    }
}

@Injectable({ providedIn: 'root' })
export class DisplayTranslationService {
    readonly #translate = inject(TranslateService);

    translate(value: unknown, context = 'VALUE'): string {
        if (value === null || value === undefined || value === '') return '';

        if (Array.isArray(value)) {
            return value.map((entry) => this.translate(entry, context)).join(', ');
        }

        const sourceValue = String(value).trim();
        if (!sourceValue) return '';

        const officialKey =
            (context.toLowerCase() === 'location' ? OFFICIAL_LOCATION_KEYS[sourceValue] : undefined) ??
            OFFICIAL_DISPLAY_KEYS[sourceValue] ??
            sourceValue;
        const officialTranslation = this.#translateValue(officialKey);
        // Some official zh-CN entries intentionally or accidentally remain English.
        // Normalize that translated display text as well, so the app-level display
        // fallback can cover it without changing the canonical game data.
        const displayValue = officialTranslation !== officialKey ? officialTranslation.trim() : sourceValue;

        if (context.toLowerCase() === 'location') {
            const depthLocation = displayValue.match(/^(\d+)m\s+(.+)$/i);
            if (depthLocation) {
                return this.#translate.instant('APP.LOCATION_DEPTH', {
                    depth: depthLocation[1],
                    location: this.translate(depthLocation[2], context),
                });
            }
        }

        if (displayValue.includes(',')) {
            return displayValue
                .split(',')
                .map((entry) => this.translate(entry, context))
                .join(', ');
        }

        const normalizedValue = this.#normalizeValue(displayValue);
        const normalizedContext = context.replace(/[^A-Za-z0-9]+/g, '_').toUpperCase();
        const contextualKey = `APP.DISPLAY.${normalizedContext}.${normalizedValue}`;
        const contextualTranslation = this.#translateValue(contextualKey);
        if (contextualTranslation !== contextualKey) return contextualTranslation;

        // Route titles contain canonical shop/festival/processor names but do not
        // carry the entity kind. Reuse the same centralized mappings instead of
        // duplicating every name in a route-only dictionary.
        if (normalizedContext === 'ROUTE') {
            for (const fallbackContext of ['SHOP', 'FESTIVAL', 'LOCATION', 'PROCESSOR']) {
                const fallbackKey = `APP.DISPLAY.${fallbackContext}.${normalizedValue}`;
                const fallbackTranslation = this.#translateValue(fallbackKey);
                if (fallbackTranslation !== fallbackKey) return fallbackTranslation;
            }
        }

        const directAppKey = `APP.${normalizedContext}.${normalizedValue}`;
        const directAppTranslation = this.#translateValue(directAppKey);
        if (directAppTranslation !== directAppKey) return directAppTranslation;

        const appContextKey = `APP.DISPLAY_${normalizedContext}.${normalizedValue}`;
        const appContextTranslation = this.#translateValue(appContextKey);
        if (appContextTranslation !== appContextKey) return appContextTranslation;

        const genericKey = `APP.DISPLAY.VALUE.${normalizedValue}`;
        const genericTranslation = this.#translateValue(genericKey);
        if (genericTranslation !== genericKey) return genericTranslation;

        // NPC names are often left in English by the official zh-CN data. Entity
        // consumers still share this single fallback, including gifts, rewards,
        // projects and My Guide.
        if (normalizedContext === 'ENTITY') {
            const npcKey = `APP.DISPLAY.NPC.${normalizedValue}`;
            const npcTranslation = this.#translateValue(npcKey);
            if (npcTranslation !== npcKey) return npcTranslation;
        }

        return addSpacesToPascalCase(displayValue);
    }

    translateEntity(entity: unknown): string {
        if (entity === null || entity === undefined) return '';
        if (typeof entity !== 'object') return this.translate(entity, 'entity');

        const record = entity as Record<string, unknown>;
        const id = record['id'] ?? record['itemId'] ?? record['key'];
        const displayKey =
            record['displayName'] ??
            record['characterName'] ??
            record['readableName'] ??
            record['title'] ??
            record['name'];

        // NPC canonical names can collide with non-NPC game keys (for example,
        // Sunny is also a weather value). Resolve the explicit NPC display map
        // by entity type before the generic official-key lookup. Weather and
        // other value contexts continue through their own mappings unchanged.
        if (typeof record['characterName'] === 'string') {
            for (const npcName of [record['key'], record['characterName']]) {
                if (typeof npcName !== 'string') continue;
                const npcKey = `APP.DISPLAY.NPC.${this.#normalizeValue(npcName)}`;
                const npcTranslation = this.#translateValue(npcKey);
                if (npcTranslation !== npcKey) return npcTranslation;
            }
        }

        // Some extracted item records retain a canonical English displayName but
        // their official localized name is stored under the inventory-table key.
        // Resolve that key from the stable item id before considering fallbacks.
        if (typeof id === 'string' && id.toLowerCase().startsWith('item_')) {
            const normalizedId = `item_${id.slice(5)}`;
            const idOverrideKey = `APP.DISPLAY.ENTITY_OVERRIDE_ID.${this.#normalizeValue(normalizedId)}`;
            const idOverride = this.#translateValue(idOverrideKey);
            if (idOverride !== idOverrideKey) return idOverride;

            const inventoryNameKey = `DT_InventoryItems.${normalizedId}_name`;
            const inventoryName = this.#translateValue(inventoryNameKey);
            if (inventoryName !== inventoryNameKey) return this.translate(inventoryName, 'entity');

            const idFallbackKey = `APP.DISPLAY.ENTITY_ID.${this.#normalizeValue(normalizedId)}`;
            const idFallback = this.#translateValue(idFallbackKey);
            if (idFallback !== idFallbackKey) return idFallback;
        }

        return this.translate(displayKey, 'entity');
    }

    #translateValue(key: string): string {
        const translated = this.#translate.instant(key);
        return typeof translated === 'string' ? translated : key;
    }

    #normalizeValue(value: string): string {
        return value
            .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
            .replace(/[^A-Za-z0-9]+/g, '_')
            .replace(/^_|_$/g, '')
            .toUpperCase();
    }
}
