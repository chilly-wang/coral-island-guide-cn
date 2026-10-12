import { BaseRawItemUpgradeData } from "./base-raw-item-upgrade-data.interface";

export interface RawLabUpgradeData extends BaseRawItemUpgradeData {
    "affecting": string,
    "level": number,
    /** Underwater upgrades are sold at the Oracle Chamber, not the lab. */
    "underwater"?: boolean,
}
