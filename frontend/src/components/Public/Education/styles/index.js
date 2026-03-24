/**
 * Education Style Registry
 * Maps template styles to education components from the unified template system
 */

// Import from unified templates
import { MinimalEducation } from '../../../../templates/minimal';
import { CyberEducation } from '../../../../templates/cyber';
import { GlassEducation } from '../../../../templates/glass';
import { GradientEducation } from '../../../../templates/gradient';
import { ClassicEducation } from '../../../../templates/classic';
import { DeveloperEducation } from '../../../../templates/developer';

// Legacy imports
import EducationMinimal from './EducationMinimal';
import EducationDark from './EducationDark';
import EducationGlassmorphism from './EducationGlassmorphism';
import EducationGradient from './EducationGradient';
import EducationColorful from './EducationColorful';

// Wrapper to adapt template props
const createWrapper = (TemplateComponent) => {
  return ({ educationData, accentColor, backgroundColor, designConfig, isAdminPreview }) => {
    return <TemplateComponent
      data={educationData}
      accentColor={accentColor}
      backgroundColor={backgroundColor}
      designConfig={designConfig}
      isAdminPreview={isAdminPreview}
    />;
  };
};

// Map template styles to UNIFIED template components
const styleComponents = {
  // NEW unified templates
  minimal: createWrapper(MinimalEducation),
  cyber: createWrapper(CyberEducation),
  dark: createWrapper(CyberEducation),
  glass: createWrapper(GlassEducation),
  glassmorphism: createWrapper(GlassEducation),
  gradient: createWrapper(GradientEducation),
  classic: createWrapper(ClassicEducation),
  professional: createWrapper(ClassicEducation),
  developer: createWrapper(DeveloperEducation),

  // Legacy fallback
  colorful: EducationColorful,
};

// Get the education component for a given style
export const getEducationComponent = (style) => {
  const normalized = style?.toLowerCase().replace(/[^a-z]/g, '');
  return styleComponents[normalized] || styleComponents.minimal;
};

export {
  EducationMinimal,
  EducationDark,
  EducationGlassmorphism,
  EducationGradient,
  EducationColorful,
};

export default styleComponents;
