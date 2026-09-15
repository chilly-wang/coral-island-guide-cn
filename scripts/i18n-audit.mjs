#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const appRoot = path.resolve('packages/guide/src/app');
const databaseRoot = path.resolve('packages/guide/src/assets/live/database');
const failOnFindings = process.argv.includes('--fail');
const verboseEntities = process.argv.includes('--verbose-entities');
const findings = [];
const brandOnly = /^(?:Coral Guide|Coral Island Wiki|GitHub|CG|BETA)$/i;
const runtimeDisplayProperty =
    /(?:\.|\b)(?:displayName|readableName|machine|buff|displayKey|mastery|masteryType|categoryName|characterName|npcKey|spawnLocation|location|rarity|fishSize|pattern|difficulty)\b/i;
const runtimeLocalization =
    /(?:\|\s*(?:translate|localizedDisplay|localizedEntityName)|dynamicText\.|display\.translate)/;
const entityNameProperties = new Set(['displayName', 'characterName', 'readableName', 'title']);

function walk(directory) {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const fullPath = path.join(directory, entry.name);
        return entry.isDirectory() ? walk(fullPath) : [fullPath];
    });
}

function add(file, line, category, text) {
    const normalized = text.replace(/\s+/g, ' ').trim();
    if (!normalized || brandOnly.test(normalized)) return;
    findings.push({ file: path.relative(process.cwd(), file), line, category, text: normalized });
}

function auditHtml(file, lines) {
    lines.forEach((line, index) => {
        if (line.includes('i18n-audit-ignore')) return;
        const lineNumber = index + 1;
        const withoutExpressions = line.replace(/\{\{[\s\S]*?\}\}/g, '');
        for (const match of withoutExpressions.matchAll(/>([^<{]+)</g)) {
            const text = match[1].replace(/&(?:[a-z]+|#\d+);/gi, ' ').trim();
            if (/\b[A-Za-z]{2,}\b/.test(text)) add(file, lineNumber, 'html-text', text);
        }

        for (const match of line.matchAll(/\b(?:placeholder|title|aria-label|matTooltip|alt)="([A-Za-z][^"]*)"/g)) {
            if (!match[1].includes('{{') && !/^https?:/i.test(match[1]))
                add(file, lineNumber, 'html-attribute', match[1]);
        }

        if (
            /\{\{[^}]+(?:\.(?:rarity|fishSize|pattern|difficulty|spawnLocation|characterName)\b|(?:SHOP|FESTIVAL)_DISPLAY_NAMES)[^}]*\}\}/.test(
                line,
            ) &&
            !/(?:\|\s*(?:translate|localizedDisplay))|display\.translate/.test(line)
        ) {
            add(file, lineNumber, 'canonical-display', line.trim());
        }

        // Runtime values are a common source of English that a literal-only audit
        // cannot see. Only flag bindings whose property is known to be presented
        // to users and which bypass both official localization and APP fallbacks.
        for (const match of line.matchAll(/\{\{([\s\S]*?)\}\}/g)) {
            const expression = match[1];
            if (runtimeDisplayProperty.test(expression) && !runtimeLocalization.test(expression)) {
                add(file, lineNumber, 'runtime-display', expression.trim());
            }
        }
    });
}

function auditTypeScript(file, lines) {
    lines.forEach((line, index) => {
        if (line.includes('i18n-audit-ignore')) return;
        const lineNumber = index + 1;
        const routeTitle = line.match(/\btitle\s*:\s*['"]([^'"]*[A-Za-z][^'"]*)['"]/);
        const nearbyLines = lines.slice(index, index + 4).join(' ');
        if (routeTitle && !routeTitle[1].startsWith('APP.') && !nearbyLines.includes('translationKey'))
            add(file, lineNumber, 'route-title', routeTitle[1]);

        const displayProperty = line.match(
            /\b(?:label|displayName|placeholder|tooltip|headerText)\s*[:=]\s*['"]([^'"]*[A-Za-z][^'"]*)['"]/,
        );
        if (displayProperty && !displayProperty[1].startsWith('APP.'))
            add(file, lineNumber, 'typescript-ui', displayProperty[1]);
    });
}

function normalizeDisplayValue(value) {
    return value
        .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
        .replace(/[^A-Za-z0-9]+/g, '_')
        .replace(/^_|_$/g, '')
        .toUpperCase();
}

function collectEntityKeys(value, sourceFile, result) {
    if (Array.isArray(value)) {
        for (const entry of value) collectEntityKeys(entry, sourceFile, result);
        return;
    }
    if (!value || typeof value !== 'object') return;

    const entityId = [value.id, value.itemId, value.key].find(
        (candidate) => typeof candidate === 'string' && candidate.toLowerCase().startsWith('item_'),
    );
    for (const property of entityNameProperties) {
        const localizationKey = value[property];
        if (typeof localizationKey !== 'string') continue;

        const entity = result.get(localizationKey) ?? { files: new Set(), ids: new Set() };
        entity.files.add(sourceFile);
        if (entityId) entity.ids.add(entityId);
        result.set(localizationKey, entity);
    }

    for (const [key, nestedValue] of Object.entries(value)) {
        collectEntityKeys(nestedValue, sourceFile, result);
    }
}

function auditOfficialEntityNames() {
    const english = JSON.parse(fs.readFileSync(path.join(databaseRoot, 'i18n/en.json'), 'utf8'));
    const chinese = JSON.parse(fs.readFileSync(path.join(databaseRoot, 'i18n/zh-CN.json'), 'utf8'));
    const appChinese = JSON.parse(
        fs.readFileSync(path.resolve('packages/guide/src/assets/i18n/app/zh-CN.json'), 'utf8'),
    );
    const fallbacks = appChinese?.APP?.DISPLAY?.ENTITY ?? {};
    const npcFallbacks = appChinese?.APP?.DISPLAY?.NPC ?? {};
    const valueFallbacks = appChinese?.APP?.DISPLAY?.VALUE ?? {};
    const idFallbacks = appChinese?.APP?.DISPLAY?.ENTITY_ID ?? {};
    const idOverrides = appChinese?.APP?.DISPLAY?.ENTITY_OVERRIDE_ID ?? {};
    const entityKeys = new Map();

    for (const entry of fs.readdirSync(databaseRoot, { withFileTypes: true })) {
        if (!entry.isFile() || !entry.name.endsWith('.json')) continue;
        const file = path.join(databaseRoot, entry.name);
        collectEntityKeys(JSON.parse(fs.readFileSync(file, 'utf8')), entry.name, entityKeys);
    }

    const unresolved = [...entityKeys.entries()].flatMap(([key, entity]) => {
        const englishName = typeof english[key] === 'string' ? english[key] : key;
        const chineseName = typeof chinese[key] === 'string' ? chinese[key] : key;
        const fallback = fallbacks[normalizeDisplayValue(englishName)];
        const npcFallback = npcFallbacks[normalizeDisplayValue(englishName)];
        const valueFallback = valueFallbacks[normalizeDisplayValue(englishName)];
        const hasIdFallback = [...entity.ids].some(
            (id) =>
                typeof idFallbacks[normalizeDisplayValue(id)] === 'string' ||
                typeof idOverrides[normalizeDisplayValue(id)] === 'string',
        );
        const hasOfficialIdName = [...entity.ids].some((id) => {
            if (!id.toLowerCase().startsWith('item_')) return false;
            const normalizedId = `item_${id.slice(5)}`;
            const itemNameKey = `DT_InventoryItems.${normalizedId}_name`;
            return (
                typeof chinese[itemNameKey] === 'string' &&
                chinese[itemNameKey].trim() !== (english[itemNameKey] ?? itemNameKey).trim()
            );
        });
        if (
            !/[A-Za-z]{2}/.test(englishName) ||
            chineseName.trim() !== englishName.trim() ||
            hasOfficialIdName ||
            hasIdFallback ||
            typeof fallback === 'string' ||
            typeof npcFallback === 'string' ||
            typeof valueFallback === 'string'
        )
            return [];
        return [{ key, englishName, files: [...entity.files] }];
    });

    return { total: entityKeys.size, unresolved };
}

for (const file of walk(appRoot).filter((file) => /\.(?:html|ts)$/.test(file))) {
    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
    file.endsWith('.html') ? auditHtml(file, lines) : auditTypeScript(file, lines);
}

const entityAudit = auditOfficialEntityNames();
const untranslatedEntities = entityAudit.unresolved;

const byCategory = findings.reduce((summary, finding) => {
    summary[finding.category] = (summary[finding.category] ?? 0) + 1;
    return summary;
}, {});

console.log(`i18n audit: ${findings.length} suspicious user-visible English occurrence(s)\n`);
for (const finding of findings) {
    console.log(`${finding.file}:${finding.line} [${finding.category}] ${finding.text}`);
}
console.log('\nSummary');
for (const [category, count] of Object.entries(byCategory).sort()) console.log(`  ${category}: ${count}`);
console.log(
    '\nReview findings manually; canonical IDs, brands, and official untranslated game text may be valid exceptions.',
);
console.log(
    `\nEntity audit: ${untranslatedEntities.length} of ${entityAudit.total} referenced entity localization key(s) still resolve to official English after official ID-name and app fallback lookup.`,
);
for (const entity of untranslatedEntities.slice(0, verboseEntities ? undefined : 40)) {
    console.log(`  ${entity.englishName} [${entity.key}] (${entity.files.slice(0, 4).join(', ')})`);
}
if (!verboseEntities && untranslatedEntities.length > 40) {
    console.log(`  ... ${untranslatedEntities.length - 40} more; rerun with --verbose-entities to list all.`);
}

if (failOnFindings && (findings.length || untranslatedEntities.length)) process.exitCode = 1;
