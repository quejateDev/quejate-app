'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SETTINGS_SECTIONS } from '@/constants/settings';
import { SettingsSectionId } from '@/types/settings';

interface SettingsSidebarProps {
  activeSection: SettingsSectionId;
  onSectionChange: (sectionId: SettingsSectionId) => void;
  className?: string;
}

export function SettingsSidebar({
  activeSection,
  onSectionChange,
  className
}: SettingsSidebarProps) {
  return (
    <Card className={cn("p-2", className)}>
      <div className="space-y-1">
        {SETTINGS_SECTIONS.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <Button
              key={section.id}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-auto py-3 px-3",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
              onClick={() => onSectionChange(section.id as SettingsSectionId)}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <div className="flex flex-col items-start">
                <span className="font-medium text-sm">{section.title}</span>
                {section.description && (
                  <span className={cn(
                    "text-xs mt-0.5 text-left",
                    isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}>
                    {section.description}
                  </span>
                )}
              </div>
            </Button>
          );
        })}
      </div>
    </Card>
  );
}
