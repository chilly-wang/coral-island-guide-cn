import { ToDo } from "./to-do.type";
import { Checklist } from "../interfaces/checklist.interface";
import { DashboardFilterData } from "../../my-coral-guide/types/dashboard-filter.type";

export type UserData = {
    name: string;
    myGuideFilter: DashboardFilterData;
    todoText: string;
    todos: ToDo[];
    checklists: Record<string, Checklist>;
}

export type UserDataStore = {
    version: number;
    currentIndex: number;
    data: UserData[];
    /** Shared by all save games. */
    npcFavorites: string[];
}
