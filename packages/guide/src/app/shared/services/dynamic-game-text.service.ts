import { inject, Injectable } from '@angular/core';
import { Effect, Requirement } from '@ci/data-types';
import { TranslateService } from '@ngx-translate/core';
import { DisplayTranslationService } from '../pipes/localized-display.pipe';

/**
 * Formats canonical runtime values without changing the extracted game data.
 * Game localization is always tried first by DisplayTranslationService; APP.*
 * entries are only display fallbacks for values missing from the game files.
 */
@Injectable({providedIn: 'root'})
export class DynamicGameTextService {
    readonly #translate = inject(TranslateService);
    readonly #display = inject(DisplayTranslationService);

    localizeGameDisplayValue(value: unknown, context = 'value'): string {
        return this.#display.translate(value, context);
    }

    formatProcessorName(value: unknown): string {
        return this.localizeGameDisplayValue(value, 'processor');
    }

    formatNpcName(value: unknown): string {
        return this.localizeGameDisplayValue(value, 'npc');
    }

    formatUnlockCondition(mastery: string, level: number): string {
        return this.#t('APP.DYNAMIC.REQUIREMENT.MASTERY_LEVEL', {
            mastery: this.localizeGameDisplayValue(mastery, 'mastery'),
            level
        });
    }

    formatRequirementText(requirement: Requirement): string {
        switch (requirement.type) {
            case 'EditorOnly': return this.#t('APP.DYNAMIC.REQUIREMENT.EDITOR_ONLY');
            case 'IsMultiplayer': return this.#t('APP.DYNAMIC.REQUIREMENT.MULTIPLAYER');
            case 'MountAcquired': return this.#t(requirement.meta.inverted
                ? 'APP.DYNAMIC.REQUIREMENT.MOUNT_NOT_ACQUIRED'
                : 'APP.DYNAMIC.REQUIREMENT.MOUNT_ACQUIRED');
            case 'CountNPCHeartLevel': return this.#t('APP.DYNAMIC.REQUIREMENT.ANY_NPC_HEARTS', requirement.meta);
            case 'IsCutsceneTriggered': return this.#t('APP.DYNAMIC.REQUIREMENT.CUTSCENE_VIEWED', requirement.meta);
            case 'MarriageHasProposed': return this.#t(requirement.meta.inverted
                ? 'APP.DYNAMIC.REQUIREMENT.MARRIAGE_NOT_PROPOSED'
                : 'APP.DYNAMIC.REQUIREMENT.MARRIAGE_PROPOSED');
            case 'IsGiantUnlocked': return this.#t('APP.DYNAMIC.REQUIREMENT.GIANTS_UNLOCKED', requirement.meta);
            case 'QuestFact': return this.#t('APP.DYNAMIC.REQUIREMENT.QUEST_FACT', requirement.meta);
            case 'ItemWithCategoryInInventory': return this.#t('APP.DYNAMIC.REQUIREMENT.CATEGORY_IN_INVENTORY', {
                ...requirement.meta,
                category: this.localizeGameDisplayValue(requirement.meta.categoryName, 'category')
            });
            case 'ObjectState': return this.#t('APP.DYNAMIC.REQUIREMENT.OBJECT_STATE', {
                name: requirement.meta.customName ?? requirement.meta.id,
                state: requirement.meta.state
            });
            case 'QuestActive': return this.#t('APP.DYNAMIC.REQUIREMENT.QUEST_ACTIVE', requirement.meta);
            case 'TempleLevel': return this.#t('APP.DYNAMIC.REQUIREMENT.TEMPLE_LEVEL', requirement.meta);
            case 'CompleteMining': return this.#t('APP.DYNAMIC.REQUIREMENT.MINE_LEVEL', {
                ...requirement.meta,
                mine: this.localizeGameDisplayValue(requirement.meta.mine, 'mine')
            });
            case 'FarmHouse': return this.#t('APP.DYNAMIC.REQUIREMENT.FARM_HOUSE_LEVEL', requirement.meta);
            case 'HasCookingUtensil': return this.#t(requirement.meta.inverted
                ? 'APP.DYNAMIC.REQUIREMENT.UTENSIL_NOT_UNLOCKED'
                : 'APP.DYNAMIC.REQUIREMENT.UTENSIL_UNLOCKED', {
                utensil: this.localizeGameDisplayValue(requirement.meta.utensil, 'utensil')
            });
            case 'MasteryLevel': return this.formatUnlockCondition(requirement.meta.mastery, requirement.meta.level);
            case 'NPCHeartLevel': return this.#t('APP.DYNAMIC.REQUIREMENT.NPC_HEARTS', {
                ...requirement.meta,
                npc: this.formatNpcName(requirement.meta.npcKey)
            });
            case 'QuestFactCompare': return this.#t(
                requirement.meta.comparator === 'MoreEqual'
                    ? 'APP.DYNAMIC.REQUIREMENT.QUEST_FACT_AT_LEAST'
                    : 'APP.DYNAMIC.REQUIREMENT.QUEST_FACT_EQUALS',
                requirement.meta
            );
            case 'DinoHologramItemRewardClaimed': return this.#t('APP.DYNAMIC.REQUIREMENT.DINO_REWARD', {
                dinosaur: this.localizeGameDisplayValue(requirement.meta.dinosaursName, 'entity')
            });
            default: return '';
        }
    }

    formatEffectText(effect: Effect): string {
        switch (effect.type) {
            case 'BoostMaxStamina': return this.#t('APP.DYNAMIC.EFFECT.MAX_STAMINA');
            case 'ChangeAppearancePotion': return this.#t('APP.DYNAMIC.EFFECT.CHANGE_APPEARANCE');
            case 'BoostMaxHealth': return this.#t('APP.DYNAMIC.EFFECT.MAX_HEALTH');
            case 'UnlockCookingUtensil': return this.#t('APP.DYNAMIC.EFFECT.UNLOCK_UTENSIL', {
                utensil: this.localizeGameDisplayValue(effect.meta.utensil, 'utensil')
            });
            case 'SetQuestFactValue': return this.#t('APP.DYNAMIC.EFFECT.SET_QUEST_FACT', effect.meta);
            case 'ConsumeItemMastery': return this.#t('APP.DYNAMIC.EFFECT.MASTERY_POINT', {
                mastery: this.localizeGameDisplayValue(effect.meta.mastery, 'mastery')
            });
            case 'SetQuestActive': return this.#t('APP.DYNAMIC.EFFECT.ACTIVATE_QUEST', effect.meta);
            case 'SetQuestCompleted': return this.#t('APP.DYNAMIC.EFFECT.COMPLETE_QUEST', effect.meta);
            case 'UpdateNPCSchedule': return this.#t('APP.DYNAMIC.EFFECT.UPDATE_NPC_SCHEDULES', {
                npcs: effect.meta.npcIds.map(npc => this.formatNpcName(npc)).join(', ')
            });
            case 'ChangeObjectState': return this.#t('APP.DYNAMIC.EFFECT.CHANGE_OBJECT_STATE', {
                name: effect.meta.customName ?? effect.meta.id,
                state: effect.meta.state
            });
            case 'MarkDinoHologramRewardClaimed': return this.#t('APP.DYNAMIC.EFFECT.DINO_REWARD_CLAIMED', effect.meta);
            default: return '';
        }
    }

    #t(key: string, params?: object): string {
        const translated = this.#translate.instant(key, params);
        return typeof translated === 'string' && translated !== key ? translated : key;
    }
}
