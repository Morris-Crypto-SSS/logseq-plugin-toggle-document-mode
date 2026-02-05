import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user'

export const settings: SettingSchemaDesc[] = [
  {
    key: 'enableOnStartup',
    type: 'boolean',
    default: false,
    title: 'Enable on Startup',
    description: 'Automatically enable Doc Mode when Logseq starts (restores previous state)',
  },
]
