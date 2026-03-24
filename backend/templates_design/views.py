from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import DesignTemplate, UserSelectedTemplate
from .serializers import (
    DesignTemplateSerializer,
    DesignTemplateListSerializer,
    UserSelectedTemplateSerializer,
    SelectTemplateSerializer,
    CustomizeTemplateSerializer
)


@api_view(['GET'])
@permission_classes([AllowAny])
def list_templates(request):
    """List all available design templates"""
    templates = DesignTemplate.objects.filter(is_active=True)
    serializer = DesignTemplateListSerializer(templates, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_template(request, slug):
    """Get a single template with full config"""
    try:
        template = DesignTemplate.objects.get(slug=slug, is_active=True)
    except DesignTemplate.DoesNotExist:
        return Response(
            {'error': 'Template not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = DesignTemplateSerializer(template)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_template(request):
    """Get the current user's selected template"""
    try:
        user_template = UserSelectedTemplate.objects.get(user=request.user)
        serializer = UserSelectedTemplateSerializer(user_template)
        return Response(serializer.data)
    except UserSelectedTemplate.DoesNotExist:
        return Response({
            'template': None,
            'customizations': {},
            'message': 'No template selected'
        })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def select_template(request):
    """Select a template for the user"""
    serializer = SelectTemplateSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    template_id = serializer.validated_data['template_id']
    template = DesignTemplate.objects.get(id=template_id)

    # Create or update user's template selection
    user_template, created = UserSelectedTemplate.objects.update_or_create(
        user=request.user,
        defaults={
            'template': template,
            'customizations': {}  # Reset customizations when changing template
        }
    )

    return Response({
        'message': f'Template "{template.name}" selected successfully',
        'template': DesignTemplateSerializer(template).data
    })


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def customize_template(request):
    """Add customizations on top of the selected template"""
    serializer = CustomizeTemplateSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    try:
        user_template = UserSelectedTemplate.objects.get(user=request.user)
    except UserSelectedTemplate.DoesNotExist:
        return Response(
            {'error': 'No template selected. Please select a template first.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    section = serializer.validated_data['section']
    customizations = serializer.validated_data['customizations']

    # Merge with existing customizations
    current_customizations = user_template.customizations or {}
    if section in current_customizations:
        current_customizations[section].update(customizations)
    else:
        current_customizations[section] = customizations

    user_template.customizations = current_customizations
    user_template.save()

    return Response({
        'message': f'Customizations for {section} saved',
        'merged_config': user_template.get_merged_config()
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reset_customizations(request):
    """Reset all or specific section customizations"""
    section = request.data.get('section')

    try:
        user_template = UserSelectedTemplate.objects.get(user=request.user)
    except UserSelectedTemplate.DoesNotExist:
        return Response(
            {'error': 'No template selected'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if section:
        # Reset specific section
        if section in user_template.customizations:
            del user_template.customizations[section]
            user_template.save()
            return Response({'message': f'Customizations for {section} reset'})
        else:
            return Response({'message': f'No customizations found for {section}'})
    else:
        # Reset all customizations
        user_template.customizations = {}
        user_template.save()
        return Response({'message': 'All customizations reset'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_section_config(request, section):
    """Get merged config for a specific section"""
    try:
        user_template = UserSelectedTemplate.objects.get(user=request.user)
        config = user_template.get_merged_config(section)
        return Response({
            'section': section,
            'config': config,
            'template_name': user_template.template.name if user_template.template else None
        })
    except UserSelectedTemplate.DoesNotExist:
        return Response({
            'section': section,
            'config': {},
            'template_name': None
        })


@api_view(['GET'])
@permission_classes([AllowAny])
def get_public_template_config(request, username):
    """Get template config for a public profile"""
    from users.models import CustomUser

    try:
        user = CustomUser.objects.get(username=username)
        user_template = UserSelectedTemplate.objects.get(user=user)
        template = user_template.template
        return Response({
            'template_id': template.id if template else None,
            'template_name': template.name if template else None,
            'template_style': template.style if template else None,
            'config': user_template.get_merged_config()
        })
    except (CustomUser.DoesNotExist, UserSelectedTemplate.DoesNotExist):
        return Response({
            'template_id': None,
            'template_name': None,
            'template_style': None,
            'config': {}
        })
