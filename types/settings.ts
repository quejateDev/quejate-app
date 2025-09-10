export interface SettingsSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

export interface SettingsNavigation {
  sections: SettingsSection[];
  activeSection: string;
}

export type SettingsSectionId = 'profile' | 'privacy' | 'terms';
