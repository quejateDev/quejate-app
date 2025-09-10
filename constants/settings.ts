import { User, Shield, Settings } from 'lucide-react';
import { SettingsSection } from '@/types/settings';

export const SETTINGS_SECTIONS: SettingsSection[] = [
    {
        id: 'profile',
        title: 'Configuración de la cuenta',
        icon: User,
        description: 'Actualiza tu información personal'
    },
    {
        id: 'privacy',
        title: 'Privacidad',
        icon: Shield,
        description: 'Conoce el tratamiento de tus datos personales'
    },
    {
        id: 'terms',
        title: 'Términos y Condiciones',
        icon: Settings,
        description: 'Revisa los términos y condiciones de uso'
    }
];

export const DEFAULT_SETTINGS_SECTION = 'profile';
