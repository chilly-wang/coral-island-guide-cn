import { MinimalItem } from "../types/minimal-item.type";
import { Quality } from "../enums/quality.enum";
import { GenericEntry } from "../types/generic-entry.type";

export interface ItemUpgradeData {
    price: number;
    daysDelay: number;
    unlockRequirements: { item: MinimalItem, amount: number; }[]
    requirements: { item: MinimalItem, amount: number; }[]
    /** "Any …" materials, e.g. for the Oracle Chamber upgrades. */
    genericRequirements?: GenericEntry[]
    hardnessLevel: string;
    toolType: string;
    townRank: number;
    item: MinimalItem,
    useCustomIcon: boolean,
    customIcon: string | null;
    useCategory: boolean;
    category: string;
    priority: number;
    priceOverride: number;
    tag: string[]
    affecting?: string,
    level?: Quality,
}
