/**
 * Profile Style Registry
 * Maps template styles to profile components from the unified template system
 */

// Import from unified templates
import { MinimalProfile } from '../../../../templates/minimal';
import { CyberProfile } from '../../../../templates/cyber';
import { GlassProfile } from '../../../../templates/glass';
import { GradientProfile } from '../../../../templates/gradient';
import { ClassicProfile } from '../../../../templates/classic';
import { DeveloperProfile } from '../../../../templates/developer';

// Legacy imports for backward compatibility
import ProfileMinimal from './ProfileMinimal';
import ProfileDark from './ProfileDark';
import ProfileGlassmorphism from './ProfileGlassmorphism';
import ProfileGradient from './ProfileGradient';
import ProfileColorful from './ProfileColorful';
import ProfileProfessional from './ProfileProfessional';

// Wrapper to adapt template props to ByStyle component props
const createWrapper = (TemplateComponent) => {
  return ({ profileData, accentColor, backgroundColor, gradientBg, isAdminPreview }) => {
    return <TemplateComponent data={profileData} accentColor={accentColor} backgroundColor={backgroundColor} isAdminPreview={isAdminPreview} />;
  };
};

// Map template styles to UNIFIED template components
const styleComponents = {
  // NEW unified templates (completely different layouts)
  minimal: createWrapper(MinimalProfile),
  cyber: createWrapper(CyberProfile),
  dark: createWrapper(CyberProfile),  // alias
  glass: createWrapper(GlassProfile),
  glassmorphism: createWrapper(GlassProfile),  // alias
  gradient: createWrapper(GradientProfile),
  classic: createWrapper(ClassicProfile),
  professional: createWrapper(ClassicProfile),  // alias
  developer: createWrapper(DeveloperProfile),

  // Legacy fallbacks (for templates not yet migrated)
  colorful: ProfileColorful,
};

// Get the profile component for a given style
export const getProfileComponent = (style) => {
  const normalized = style?.toLowerCase().replace(/[^a-z]/g, '');
  return styleComponents[normalized] || styleComponents.minimal;
};

// Export all components
export {
  ProfileMinimal,
  ProfileDark,
  ProfileGlassmorphism,
  ProfileGradient,
  ProfileColorful,
  ProfileProfessional,
};

export default styleComponents;
