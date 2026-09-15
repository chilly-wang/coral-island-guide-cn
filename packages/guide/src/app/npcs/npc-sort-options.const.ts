export const sortOptions = [
    {
        displayName: 'APP.NPC_SORT.DEFAULT',
        value: 'default'
    },
    {
        displayName: 'APP.NPC_SORT.ALPHABETICAL',
        value: 'alphabetical'
    },
    {
        displayName: 'APP.NPC_SORT.BIRTHDATE',
        value: 'birthdate'
    }
] as const;

const sortValues = sortOptions.map(s => s.value);
export type NpcSortValues = typeof sortValues[number]
