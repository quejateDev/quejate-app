'use client';

import { useState, ReactNode } from 'react';
import { SettingsSidebar } from './SettingsSidebar';
import { SettingsSectionId } from '@/types/settings';
import { DEFAULT_SETTINGS_SECTION } from '@/constants/settings';

interface SettingsLayoutProps {
  children: (activeSection: SettingsSectionId) => ReactNode;
  initialSection?: SettingsSectionId;
  className?: string;
}

export function SettingsLayout({
  children,
  initialSection = DEFAULT_SETTINGS_SECTION as SettingsSectionId,
  className
}: SettingsLayoutProps) {
  const [activeSection, setActiveSection] = useState<SettingsSectionId>(initialSection);

  return (
    <div className={className}>
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="sticky top-4">
            <SettingsSidebar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </div>
        </div>

        <div className="lg:col-span-8 xl:col-span-9">
          {children(activeSection)}
        </div>
      </div>
    </div>
  );
}
