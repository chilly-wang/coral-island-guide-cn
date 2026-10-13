import { MinimalItem } from "../types/minimal-item.type";

export type GachaTier = 'special' | 'A' | 'B' | 'C';

/** A Savannah gacha machine (Treasure Bubbles) and its prize pool (see scripts/generate-extra-shop-data.mjs). */
export interface GachaMachineData {
    key: 'west' | 'east';
    rewards: { item: MinimalItem, tier: GachaTier }[];
}
