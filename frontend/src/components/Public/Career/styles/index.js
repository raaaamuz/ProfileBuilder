/**
 * Career Style Registry
 * Maps template styles to career components from the unified template system
 */

// Import from unified templates
import { MinimalCareer } from '../../../../templates/minimal';
import { CyberCareer } from '../../../../templates/cyber';
import { GlassCareer } from '../../../../templates/glass';
import { GradientCareer } from '../../../../templates/gradient';
import { ClassicCareer } from '../../../../templates/classic';
import { DeveloperCareer } from '../../../../templates/developer';

// Legacy imports for backward compatibility
import CareerMinimal from './CareerMinimal';
import CareerDark from './CareerDark';
import CareerGlassmorphism from './CareerGlassmorphism';
import CareerGradient from './CareerGradient';
import CareerColorful from './CareerColorful';
import CareerProfessional from './CareerProfessional';

// Wrapper to adapt template props to ByStyle component props
const createWrapper = (TemplateComponent) => {
  return ({ careerData, accentColor, backgroundColor, textColor, designConfig, isAdminPreview }) => {
    return <TemplateComponent
      data={careerData}
      accentColor={accentColor}
      backgroundColor={backgroundColor}
      textColor={textColor}
      designConfig={designConfig}
      isAdminPreview={isAdminPreview}
    />;
  };
};

// Map template styles to UNIFIED template components
const styleComponents = {
  // NEW unified templates (completely different layouts)
  minimal: createWrapper(MinimalCareer),
  cyber: createWrapper(CyberCareer),
  dark: createWrapper(CyberCareer),  // alias
  glass: createWrapper(GlassCareer),
  glassmorphism: createWrapper(GlassCareer),  // alias
  gradient: createWrapper(GradientCareer),
  classic: createWrapper(ClassicCareer),
  professional: createWrapper(ClassicCareer),  // alias
  developer: createWrapper(DeveloperCareer),

  // Legacy fallbacks
  colorful: CareerColorful,
};

// Get the career component for a given style
export const getCareerComponent = (style) => {
  const normalized = style?.toLowerCase().replace(/[^a-z]/g, '');
  return styleComponents[normalized] || styleComponents.minimal;
};

// Export all components
export {
  CareerMinimal,
  CareerDark,
  CareerGlassmorphism,
  CareerGradient,
  CareerColorful,
  CareerProfessional,
};

export default styleComponents;
