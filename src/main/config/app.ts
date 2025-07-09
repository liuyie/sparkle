import { readFile, writeFile } from 'fs/promises'
import { appConfigPath } from '../utils/dirs'
import yaml from 'yaml'
import { deepMerge } from '../utils/merge'
import { defaultConfig } from '../utils/template'
import { readFileSync } from 'fs'

let appConfig: AppConfig // config.yaml

export async function getAppConfig(force = false): Promise<AppConfig> {
  if (force || !appConfig) {
    const data = await readFile(appConfigPath(), 'utf-8')
    appConfig = yaml.parse(data, { merge: true }) || defaultConfig
  }
  if (typeof appConfig !== 'object') appConfig = defaultConfig
  return appConfig
}

export async function patchAppConfig(patch: Partial<AppConfig>): Promise<void> {
  appConfig = deepMerge(appConfig, patch)
  await writeFile(appConfigPath(), yaml.stringify(appConfig))
}

export function getAppConfigSync(): AppConfig {
  try {
    const raw = readFileSync(appConfigPath(), 'utf-8')
    const data = yaml.parse(raw, { merge: true }) as AppConfig
    if (typeof data === 'object' && data !== null) {
      return data
    }
    return defaultConfig
  } catch (e) {
    return defaultConfig
  }
}
