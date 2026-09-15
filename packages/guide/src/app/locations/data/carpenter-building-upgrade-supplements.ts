import { ItemUpgradeData, MinimalItem } from '@ci/data-types';

const BUILDING_IDS = {
    barn1: 'item_110001',
    barn2: 'item_110002',
    barn3: 'item_110003',
    coop1: 'item_110004',
    coop2: 'item_110005',
    coop3: 'item_110006',
} as const;

const BUILDING_ORDER = [
    BUILDING_IDS.coop1,
    BUILDING_IDS.coop2,
    BUILDING_IDS.coop3,
    BUILDING_IDS.barn1,
    BUILDING_IDS.barn2,
    BUILDING_IDS.barn3,
] as const;

const MATERIALS = {
    hardwood: item('item_65063', 'DT_InventoryItems.item_65063_name', 'HardWood_Sprite'),
    stone: item('item_65004', 'DT_InventoryItems.item_65004_name', 'Stone_Sprite'),
    fiber: item('item_65032', 'DT_InventoryItems.item_65032_name', 'Fiber_Sprite'),
    silverBar: item('item_61044', 'DT_InventoryItems.item_61044_name', 'Silver_Bar_Sprite'),
    goldBar: item('item_61006', 'DT_InventoryItems.item_61006_name', 'Gold_Bar_Sprite'),
} as const;

const BUILDING_ITEMS = {
    barn1: item(BUILDING_IDS.barn1, 'DT_InventoryItems.item_110001_name', 'Barn_level_1_blueprint_Sprite'),
    barn2: item(BUILDING_IDS.barn2, 'DT_InventoryItems.item_110002_name', 'placeholder_icon'),
    barn3: item(BUILDING_IDS.barn3, 'DT_InventoryItems.item_110003_name', 'placeholder_icon'),
    coop1: item(BUILDING_IDS.coop1, 'DT_InventoryItems.item_110004_name', 'Coop_level_1_blueprint_Sprite'),
    coop2: item(BUILDING_IDS.coop2, 'DT_InventoryItems.item_110005_name', 'placeholder_icon'),
    coop3: item(BUILDING_IDS.coop3, 'DT_InventoryItems.item_110006_name', 'placeholder_icon'),
} as const;

const CORRECTED_UPGRADES: Record<string, ItemUpgradeData> = {
    [BUILDING_IDS.coop2]: upgrade(BUILDING_ITEMS.coop2, 4500, 2, 2, BUILDING_ITEMS.coop1, [
        requirement(MATERIALS.hardwood, 20),
        requirement(MATERIALS.stone, 50),
        requirement(MATERIALS.fiber, 10),
        requirement(MATERIALS.silverBar, 3),
    ]),
    [BUILDING_IDS.coop3]: upgrade(BUILDING_ITEMS.coop3, 10000, 3, 3, BUILDING_ITEMS.coop2, [
        requirement(MATERIALS.hardwood, 35),
        requirement(MATERIALS.stone, 70),
        requirement(MATERIALS.fiber, 20),
        requirement(MATERIALS.goldBar, 3),
    ]),
    [BUILDING_IDS.barn2]: upgrade(BUILDING_ITEMS.barn2, 6500, 2, 5, BUILDING_ITEMS.barn1, [
        requirement(MATERIALS.hardwood, 40),
        requirement(MATERIALS.stone, 100),
        requirement(MATERIALS.fiber, 10),
        requirement(MATERIALS.silverBar, 5),
    ]),
    [BUILDING_IDS.barn3]: upgrade(BUILDING_ITEMS.barn3, 15000, 3, 6, BUILDING_ITEMS.barn2, [
        requirement(MATERIALS.hardwood, 60),
        requirement(MATERIALS.stone, 120),
        requirement(MATERIALS.fiber, 20),
        requirement(MATERIALS.goldBar, 5),
    ]),
};

const ANIMAL_CAPACITY: Record<string, number> = {
    [BUILDING_IDS.coop1]: 4,
    [BUILDING_IDS.coop2]: 8,
    [BUILDING_IDS.coop3]: 12,
    [BUILDING_IDS.barn1]: 4,
    [BUILDING_IDS.barn2]: 8,
    [BUILDING_IDS.barn3]: 12,
};

/**
 * The v1.3-1247 carpenter export contains the building item/localization records,
 * but omits the level-2 upgrade rows and has stale level-3 costs. Keep this
 * display-layer correction separate from the extracted live database.
 */
export function applyCarpenterBuildingUpgradeSupplements(upgrades: ItemUpgradeData[]): ItemUpgradeData[] {
    const byId = new Map(upgrades.map((entry) => [entry.item.id, entry]));
    Object.entries(CORRECTED_UPGRADES).forEach(([id, corrected]) => byId.set(id, corrected));

    const buildings = BUILDING_ORDER.map((id) => byId.get(id)).filter((entry): entry is ItemUpgradeData => !!entry);
    const remaining = upgrades.filter((entry) => !BUILDING_ORDER.includes(entry.item.id as typeof BUILDING_ORDER[number]));
    return [...buildings, ...remaining];
}

export function getBuildingAnimalCapacity(itemId: string): number | undefined {
    return ANIMAL_CAPACITY[itemId];
}

function item(id: string, displayName: string, iconName: string): MinimalItem {
    return { id, displayName, iconName };
}

function requirement(requiredItem: MinimalItem, amount: number) {
    return { item: requiredItem, amount };
}

function upgrade(
    building: MinimalItem,
    price: number,
    daysDelay: number,
    priority: number,
    previousLevel: MinimalItem,
    requirements: ItemUpgradeData['requirements'],
): ItemUpgradeData {
    return {
        item: building,
        price,
        priceOverride: price,
        daysDelay,
        townRank: 0,
        tag: [],
        priority,
        requirements,
        unlockRequirements: [requirement(previousLevel, 1)],
        category: 'None',
        customIcon: null,
        hardnessLevel: 'Basic',
        toolType: 'None',
        useCategory: true,
        useCustomIcon: false,
    };
}
