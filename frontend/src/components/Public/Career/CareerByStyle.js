import { useContext } from 'react';
import { PreviewContext } from '../../admin/PreviewContext';
import { getCareerComponent } from './styles';
import CareerTimeline from './CareerTimeline';

/**
 * CareerByStyle - Renders the appropriate career component based on selected template style
 */
const CareerByStyle = ({ liveDesignConfig, liveCareerData, globalFont, isAdminPreview = true }) => {
  const { selectedTemplate, liveCareerDesign } = useContext(PreviewContext);

  const templateStyle = selectedTemplate?.style || null;

  // If no template selected, use original CareerTimeline
  if (!templateStyle) {
    return <CareerTimeline liveDesignConfig={liveDesignConfig} liveCareerData={liveCareerData} globalFont={globalFont} isAdminPreview={isAdminPreview} />;
  }

  // Get the appropriate career component for this template style
  const CareerComponent = getCareerComponent(templateStyle);

  // Use AI-generated design colors if available, otherwise use template defaults
  const accentColor = liveCareerDesign?.accentColor || '#6366f1';
  const backgroundColor = liveCareerDesign?.backgroundColor;
  const textColor = liveCareerDesign?.textColor;

  return (
    <CareerComponent
      careerData={liveCareerData || []}
      accentColor={accentColor}
      backgroundColor={backgroundColor}
      textColor={textColor}
      designConfig={liveCareerDesign}
      isAdminPreview={isAdminPreview}
    />
  );
};

export default CareerByStyle;
