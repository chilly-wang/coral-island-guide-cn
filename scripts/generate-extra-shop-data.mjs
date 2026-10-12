// Generates shop data the upstream pak-files-parser does not cover, straight from the extracted game files:
//   node scripts/generate-extra-shop-data.mjs
//
// - Laboratory "Develop equipment"              -> lab-develop-equipment.json
// - Oracle Chamber (神谕室) counter stock         -> oracle-chamber-shop-items.json
// - Oracle Chamber opening hours                 -> oracle-chamber-opening-hours.json
// - Oracle Chamber underwater produce upgrades   -> oracle-chamber-item-upgrade.json
// - Oracle Chamber "Underwater crafting lab"     -> oracle-chamber-develop-equipment.json
// It also links these entries from the item database pages (buyAt / isUpgradeResult) and adds the
// official names and descriptions (all game languages) to the database i18n files.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const GAME_CONTENT = 'pak-assets/live/ProjectCoral/Content';
const GAME_DATA = join(GAME_CONTENT, 'ProjectCoral/Core/Data');
const SHOP_DATA = join(GAME_DATA, 'Shops');
const DATABASE = 'packages/guide/src/assets/live/database';
const ORACLE_CHAMBER = { url: 'oracle-chamber', displayName: 'Oracle Chamber' };
const LEGACY_ORACLE_URL = 'merfolk-oracle-tail-store';

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const writeJson = (path, data) => writeFileSync(path, JSON.stringify(data, null, 2));
const rows = (path) => readJson(path)[0].Rows;
const enumValue = (value) => value.split('::').pop();

const items = new Map(readJson(join(DATABASE, 'items.json')).map((item) => [item.id, item]));
const tagBasedItems = new Map(readJson(join(DATABASE, 'tag-based-items.json')).map((item) => [item.key, item]));

/** Mistakes in the official localization, corrected here. */
const OFFICIAL_TEXT_FIXES = {
    // Lumina Sprinkler III is "阳光喷洒器 II" in the official zh-CN text (every other language says III).
    BA077E084B3583B8977BAE8D38041AAD: { 'zh-CN': '阳光喷洒器 III' },
};

const textKeys = new Set();
const textKey = (text) => {
    if (!text?.Key) return null;
    textKeys.add(text.Key);
    return text.Key;
};

/** Quality variants (item_x-a … -d) are folded into their base item by the upstream parser. */
const QUALITY_SUFFIXES = { a: 'bronze', b: 'silver', c: 'gold', d: 'osmium' };
const minimalItem = (id) => {
    const item = items.get(id.replace(/-[abcd]$/, ''));
    if (!item) throw new Error(`Unknown item ${id}`);
    return { id: item.id, displayName: item.displayName, iconName: item.iconName };
};

const genericEntry = (requirement) => {
    const generic = tagBasedItems.get(requirement.genericItem.RowName);
    if (!generic) throw new Error(`Unknown generic item ${requirement.genericItem.RowName}`);
    return {
        shouldBeSameItem: false,
        amount: requirement.amount,
        genericItem: { key: generic.key, displayName: generic.displayName, iconName: generic.iconName },
    };
};

// "/Game/.../Auto_trash_collector_Sprite.Auto_trash_collector_Sprite" -> "Auto_trash_collector_Sprite"
const iconName = (assetPath) => assetPath.split('.').pop();

// ---------------------------------------------------------------------------------------------
// Develop equipment (lab "Develop equipment", Oracle Chamber "Underwater crafting lab")
// ---------------------------------------------------------------------------------------------

function developEquipment({ shopTable, requirementTable, contextTable, effectAsset, showTownRank }) {
    const shop = rows(shopTable);
    const requirements = rows(requirementTable);
    const contexts = rows(contextTable);
    const effects = readJson(effectAsset);
    const effectsByName = new Map(effects.map((effect) => [effect.Name, effect]));
    const effectMap = effects.find((effect) => effect.Type === 'C_GameplayEffectsConfig').Properties.map;

    /** The item handed out on purchase (e.g. sturdy computer components only unlock a feature). */
    const receivedItem = (key) => {
        const entry = effectMap.find((e) => e.Key === key);
        for (const ref of entry?.Value.effects ?? []) {
            const effect = effectsByName.get(ref.ObjectName.split(':')[1].replace(/'$/, ''));
            if (effect?.Type === 'C_AddItemToInventoryEffect') return minimalItem(effect.Properties.itemData.itemID);
        }
        return null;
    };

    const enabledKeys = Object.keys(shop).filter((key) => shop[key].enable);

    return enabledKeys
        .map((key, index) => ({ key, index, row: shop[key] }))
        .sort((a, b) => a.row.priority - b.row.priority || a.index - b.index)
        .map(({ key, row }) => {
            const item = receivedItem(key);
            const context = contexts[key];
            // Lumina wands use their own name as footnote, which adds nothing next to the title.
            const footnote = context?.footnoteText?.SourceString === row.shopItemName.SourceString ? null : context?.footnoteText;
            return {
                key,
                displayName: textKey(row.shopItemName),
                description: textKey(row.customDescription),
                iconName: item?.iconName ?? iconName(row.customIcon.AssetPathName),
                item,
                price: row.priceOverride,
                townRank: showTownRank ? row.townRank : null,
                appliesTo: textKey(footnote),
                requirements: (requirements[key]?.shopItemRequirements ?? []).map((requirement) => ({
                    item: minimalItem(requirement.item.itemID),
                    amount: requirement.amount,
                })),
                genericRequirements: (requirements[key]?.shopGenericItemRequirements ?? []).map(genericEntry),
                dependencies: (context?.upgradeDependencies ?? [])
                    .filter((dependency) => enabledKeys.includes(dependency))
                    .map((dependency) => ({
                        key: dependency,
                        displayName: textKey(shop[dependency].shopItemName),
                    })),
            };
        });
}

const labDevelopEquipment = developEquipment({
    shopTable: join(SHOP_DATA, 'DT_CraftingShop.json'),
    requirementTable: join(SHOP_DATA, 'CraftShop/DT_CraftingShopItemRequirement.json'),
    contextTable: join(SHOP_DATA, 'CraftShop/DT_DevelopEquipmentContext.json'),
    effectAsset: join(SHOP_DATA, 'CraftShop/DA_CraftingShopEffect.json'),
    showTownRank: true,
});
writeJson(join(DATABASE, 'lab-develop-equipment.json'), labDevelopEquipment);

// The ocean has no rank of its own, so the Underwater crafting lab shows no rank requirement.
const oracleDevelopEquipment = developEquipment({
    shopTable: join(SHOP_DATA, 'DT_UnderwaterCraftingShop.json'),
    requirementTable: join(SHOP_DATA, 'UnderwaterCraftingShop/DT_UnderwaterCraftingShopItemRequirement.json'),
    contextTable: join(SHOP_DATA, 'UnderwaterCraftingShop/DT_UnderwaterCraftingDevelopEquipmentContext.json'),
    effectAsset: join(SHOP_DATA, 'UnderwaterCraftingShop/DA_UnderwaterCraftingShopEffect.json'),
    showTownRank: false,
});
writeJson(join(DATABASE, 'oracle-chamber-develop-equipment.json'), oracleDevelopEquipment);

// ---------------------------------------------------------------------------------------------
// Oracle Chamber counter stock (the game names this table "MerfolkTailShop", but it holds the
// solar core and essences; the tails live in DT_ShopMerfolkOracleTailStore)
// ---------------------------------------------------------------------------------------------

const oracleShopItems = Object.values(rows(join(SHOP_DATA, 'MerfolkTail/DT_MerfolkTailShop.json')))
    .filter((row) => row.enable)
    .map((row) => {
        const item = items.get(row.item.itemID);
        return {
            item: { ...minimalItem(item.id), price: item.price, sellPrice: item.sellPrice },
            allowedDays: [],
            allowedSeasons: [],
            allowedWeather: [],
            forbiddenDays: [],
            forbiddenSeasons: [],
            forbiddenWeather: [],
            townRank: row.townRank,
            tag: row.tag ?? [],
            priceOverride: row.priceOverride,
            priority: row.priority,
            enabled: true,
            availableSinceDate: false,
            availableTillDate: false,
            availableDuringTime: false,
        };
    });
writeJson(join(DATABASE, 'oracle-chamber-shop-items.json'), oracleShopItems);

// ---------------------------------------------------------------------------------------------
// Oracle Chamber opening hours
// The game data (Merfolk_OracleHours) lists Mon, Tue, Tue, Wed, Thu, Fri, Sun 9:00–21:00, which looks
// like a typo for every day. Until verified in game we follow the wiki: every day 9:00–17:00.
// ---------------------------------------------------------------------------------------------

writeJson(join(DATABASE, 'oracle-chamber-opening-hours.json'), [
    {
        Building: {
            isCoreEveryDay: true,
            isCoreOnlyWeekdays: false,
            coreOpeningDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            coreOpeningHours: { from: { hours: 9, minutes: 0 }, to: { hours: 17, minutes: 0 } },
        },
    },
]);

// ---------------------------------------------------------------------------------------------
// Oracle Chamber produce quality upgrades (the "underwater" rows of the lab upgrade table)
// ---------------------------------------------------------------------------------------------

const QUALITY_BY_LEVEL = { 1: 'bronze', 2: 'silver', 3: 'gold', 4: 'osmium' };
// Grouped by kind (all seed levels, then all seaweed levels) rather than the game's level-by-level order.
const UPGRADE_KIND_ORDER = ['EC_LabUpgradeEnum::UnderwaterSeeds', 'EC_LabUpgradeEnum::UnderwaterFodder'];
const oracleUpgrades = Object.values(rows(join(SHOP_DATA, 'DT_LabUpgrade.json')))
    .filter((row) => row.enable && row.underwater)
    .sort((a, b) => UPGRADE_KIND_ORDER.indexOf(a.affecting) - UPGRADE_KIND_ORDER.indexOf(b.affecting) || a.level - b.level)
    .map((row) => ({
        item: minimalItem(row.item.itemID),
        price: row.price,
        daysDelay: row.daysDelay,
        townRank: row.townRank,
        tag: row.tag ?? [],
        priceOverride: row.priceOverride,
        priority: row.priority,
        requirements: row.requirements.map((requirement) => ({
            item: minimalItem(requirement.item.itemID),
            amount: requirement.amount,
        })),
        genericRequirements: row.genericItem.map(genericEntry),
        unlockRequirements: [],
        category: enumValue(row.category),
        customIcon: null,
        hardnessLevel: enumValue(row.hardnessLevel),
        toolType: enumValue(row.toolType),
        useCategory: row.useCategory,
        useCustomIcon: false,
        affecting: enumValue(row.affecting),
        level: QUALITY_BY_LEVEL[row.level] ?? QUALITY_SUFFIXES[row.item.itemID.slice(-1)],
    }));
writeJson(join(DATABASE, 'oracle-chamber-item-upgrade.json'), oracleUpgrades);

// ---------------------------------------------------------------------------------------------
// Item database pages
// ---------------------------------------------------------------------------------------------

const isOracle = (entry) => [ORACLE_CHAMBER.url, LEGACY_ORACLE_URL].includes(entry.shop?.url);

function updateItemPage(id, update) {
    const path = join(DATABASE, 'items', `${id}.json`);
    if (!existsSync(path)) return;
    const page = readJson(path);
    update(page);
    writeJson(path, page);
}

const tailItemIds = Object.values(rows(join(SHOP_DATA, 'DT_ShopMerfolkOracleTailStore.json'))).map((row) => row.item.itemID);
const tailShopItems = readJson(join(DATABASE, 'oracle-chamber-tail-shop-items.json'));

const buyAtEntries = new Map();
for (const entry of [...tailShopItems, ...oracleShopItems]) {
    buyAtEntries.set(entry.item.id, [...(buyAtEntries.get(entry.item.id) ?? []), { ...entry, shop: ORACLE_CHAMBER }]);
}
for (const id of new Set([...tailItemIds, ...buyAtEntries.keys()])) {
    updateItemPage(id, (page) => {
        page.buyAt = [...(page.buyAt ?? []).filter((entry) => !isOracle(entry)), ...(buyAtEntries.get(id) ?? [])];
    });
}

const upgradeResults = new Map();
for (const upgrade of oracleUpgrades) {
    upgradeResults.set(upgrade.item.id, [...(upgradeResults.get(upgrade.item.id) ?? []), { ...upgrade, shop: ORACLE_CHAMBER }]);
}
for (const [id, upgrades] of upgradeResults) {
    updateItemPage(id, (page) => {
        page.isUpgradeResult = [...(page.isUpgradeResult ?? []).filter((entry) => !isOracle(entry)), ...upgrades];
    });
}

// ---------------------------------------------------------------------------------------------
// Official localizations live in the game's Localization folder; the site keeps one flat file per language.
// ---------------------------------------------------------------------------------------------

for (const language of ['de', 'en', 'es', 'fr', 'id', 'ja', 'ko', 'pt-BR', 'th-TH', 'zh-CN']) {
    const sourcePath = join(GAME_CONTENT, 'Localization/Game', language, 'Game.json');
    const targetPath = join(DATABASE, 'i18n', `${language}.json`);
    if (!existsSync(sourcePath) || !existsSync(targetPath)) continue;

    const official = Object.assign({}, ...Object.values(readJson(sourcePath)));
    const target = readJson(targetPath);
    for (const key of textKeys) {
        const text = OFFICIAL_TEXT_FIXES[key]?.[language] ?? official[key];
        if (text !== undefined) target[key] = text;
    }
    writeFileSync(targetPath, JSON.stringify(target));
}

console.log(
    `lab develop equipment: ${labDevelopEquipment.length}, oracle chamber: ${oracleShopItems.length} stock, ` +
    `${oracleUpgrades.length} upgrades, ${oracleDevelopEquipment.length} develop equipment, ${textKeys.size} texts`,
);
