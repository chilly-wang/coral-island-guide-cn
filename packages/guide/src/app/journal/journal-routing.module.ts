import { Routes } from '@angular/router';

export const routes: Routes = [
    {

        path: '',
        loadComponent: () => import('./journal.component').then(m => m.JournalComponent),
        children: [
            {
                path: 'caught/:tabName',
                loadComponent: () => import('./components/caught/caught.component').then(m => m.CaughtComponent),
                title: 'APP.ROUTE.CAUGHT_JOURNAL'
            },
            {
                path: 'found/:tabName',
                loadComponent: () => import('./components/found/found.component').then(m => m.FoundComponent),
                title: 'APP.ROUTE.FOUND_JOURNAL'
            },
            {
                path: 'produce/:tabName',
                loadComponent: () => import('./components/produce/produce.component').then(m => m.ProduceComponent),
                title: 'APP.ROUTE.PRODUCE_JOURNAL'
            },
            {
                path: 'bestiary',
                loadComponent: () => import('./components/bestiary/bestiary.component').then(m => m.BestiaryComponent),
                title: 'APP.ROUTE.BESTIARY_JOURNAL'
            },
            {
                path: 'notes/:tabName',
                loadComponent: () => import('./components/notes/notes.component').then(m => m.NotesComponent),
                title: 'APP.ROUTE.NOTES_JOURNAL'
            },
            {
                path: 'clothing/:tabName',
                loadComponent: () => import('./components/bought/bought.component').then(m => m.BoughtComponent),
                title: 'APP.ROUTE.CLOTHING_JOURNAL'
            },
            {
                path: 'achievements',
                loadComponent: () => import('./components/achievements/achievements.component').then(m => m.AchievementsComponent),
                title: 'APP.ROUTE.ACHIEVEMENTS_JOURNAL'
            },
            {
                path: 'achievements/:achievementId',
                loadComponent: () => import('./components/achievements/achievements.component').then(m => m.AchievementsComponent),
                title: 'APP.ROUTE.ACHIEVEMENTS_JOURNAL'
            },
        ]
    },
];
