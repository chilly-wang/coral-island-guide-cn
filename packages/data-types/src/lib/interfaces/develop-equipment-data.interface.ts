import { MinimalItem } from "../types/minimal-item.type";
import { TranslationKey } from "../types/translation-key";
import { GenericEntry } from "../types/generic-entry.type";

/** One entry of a "Develop equipment" shop: lab or Oracle Chamber (see scripts/generate-extra-shop-data.mjs). */
export interface DevelopEquipmentData {
    key: string;
    displayName: TranslationKey;
    description: TranslationKey | null;
    iconName: string;
    /** Item (and crafting recipe) received on purchase; null for sturdy computer components. */
    item: MinimalItem | null;
    price: number;
    /** null where no rank applies (the ocean has no rank of its own). */
    townRank: number | null;
    appliesTo: TranslationKey | null;
    requirements: { item: MinimalItem, amount: number }[];
    genericRequirements: GenericEntry[];
    dependencies: { key: string, displayName: TranslationKey }[];
}
