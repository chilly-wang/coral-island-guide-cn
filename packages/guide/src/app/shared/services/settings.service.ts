import { inject, Injectable } from '@angular/core';
import { Settings } from '../interfaces/settings.interface';
import { LocalStorageService } from '../../core/local-storage/local-storage.service';

@Injectable({
    providedIn: 'root',
})
export class SettingsService {
    localStorage = inject(LocalStorageService);
    private readonly CURRENT_SETTINGS_VERSION = 1;
    private readonly SETTINGS_STORAGE_KEY = 'coral-guide-settings';
    private readonly DEFAULT_SETTINGS: Settings = {
        version: this.CURRENT_SETTINGS_VERSION,
        useBeta: false,
        language: 'zh-CN',
    };
    private _settings?: Settings;

    saveSettings(partialSettings: Partial<Settings>): void {
        const settings: Settings = {
            ...this.DEFAULT_SETTINGS,
            ...partialSettings,
            useBeta: false,
            language: 'zh-CN',
        };

        this.localStorage.setItem(this.SETTINGS_STORAGE_KEY, JSON.stringify(settings));

        this._settings = settings;
    }

    getSettings(): Settings {
        const settings = this.localStorage.getItem(this.SETTINGS_STORAGE_KEY);

        if (!settings) {
            this.saveSettings(this.DEFAULT_SETTINGS);
        } else if (!this._settings) {
            const parsedSettings = JSON.parse(settings);

            this._settings = this._migrate(parsedSettings);
        }

        return this._settings!;
    }

    private _migrate(parsedSettings: Partial<Settings> | Settings): Settings {
        const migrated = { ...this.DEFAULT_SETTINGS };
        if (
            parsedSettings.version !== migrated.version ||
            parsedSettings.useBeta !== migrated.useBeta ||
            parsedSettings.language !== migrated.language ||
            'disableChangelogs' in parsedSettings
        ) {
            this.saveSettings(migrated);
        }
        return migrated;
    }
}
