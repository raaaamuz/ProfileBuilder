from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from .models import EducationEntry, EducationDesign
from .serializers import EducationEntrySerializer, EducationDesignSerializer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.utils.decorators import method_decorator
from django.views import View
from django.contrib.auth.models import AnonymousUser
from rest_framework.views import APIView

class PublicReadPermission(permissions.BasePermission):
    """
    Custom permission to allow public access for GET requests while requiring authentication for others.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:  # Allows GET, HEAD, OPTIONS
            return True
        return request.user and request.user.is_authenticated

class EducationEntryViewSet(viewsets.ModelViewSet):
    serializer_class = EducationEntrySerializer
    permission_classes = [PublicReadPermission]  # Public GET access, Auth required for others

    def get_queryset(self):
        """Only return education entries for the logged-in user"""
        if self.request.user.is_authenticated:
            return EducationEntry.objects.filter(user=self.request.user)
        return EducationEntry.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["DELETE"], permission_classes=[permissions.IsAuthenticated])
    def clear_entries(self, request):
        """Delete all education entries for the user"""
        EducationEntry.objects.filter(user=request.user).delete()
        return Response({"message": "All education entries deleted."}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=["DELETE"], url_path='delete_entry', permission_classes=[permissions.IsAuthenticated])
    def delete_entry(self, request, pk=None):
        """Delete a specific education entry by ID"""
        try:
            entry = EducationEntry.objects.get(pk=pk, user=request.user)
            entry.delete()
            return Response({"message": "Education entry deleted."}, status=status.HTTP_204_NO_CONTENT)
        except EducationEntry.DoesNotExist:
            return Response({"error": "Education entry not found."}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=["PUT"], url_path='update_entry', permission_classes=[permissions.IsAuthenticated])
    def update_entry(self, request, pk=None):
        """Update a specific education entry by ID"""
        try:
            entry = EducationEntry.objects.get(pk=pk, user=request.user)
            serializer = EducationEntrySerializer(entry, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except EducationEntry.DoesNotExist:
            return Response({"error": "Education entry not found."}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=["POST"], permission_classes=[permissions.IsAuthenticated])
    def bulk_create(self, request):
        """Allows users to save multiple education entries at once"""
        user = request.user
        education_entries = request.data.get("education_entries", [])

        if not education_entries:
            return Response({"error": "No data provided"}, status=status.HTTP_400_BAD_REQUEST)

        created_entries = []
        for entry in education_entries:
            entry["user"] = user.id  # Assign user
            serializer = EducationEntrySerializer(data=entry)
            if serializer.is_valid():
                serializer.save(user=user)
                created_entries.append(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Education entries saved successfully", "data": created_entries}, status=status.HTTP_201_CREATED)

@method_decorator(csrf_exempt, name='dispatch')
class EducationDesignView(View):
    """Handles getting and updating the selected education design"""

    def get(self, request):
        """Retrieve the selected education design"""
        if not request.user or isinstance(request.user, AnonymousUser):
            return JsonResponse({"error": "Authentication required"}, status=401)

        design, created = EducationDesign.objects.get_or_create(user=request.user)
        return JsonResponse({"selected_design": design.selected_design})

@api_view(['PUT'])
@csrf_exempt
@permission_classes([permissions.IsAuthenticated])
def update_selected_design(request):
    """Update the selected education design"""
    if not request.user or isinstance(request.user, AnonymousUser):
        return JsonResponse({"error": "Authentication required"}, status=401)

    data = json.loads(request.body)
    design, created = EducationDesign.objects.get_or_create(user=request.user)
    serializer = EducationDesignSerializer(design, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse({"message": "Education design updated!"})
    return JsonResponse(serializer.errors, status=400)

@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def reorder_education(request):
    """Reorder education entries"""
    reordered_data = request.data.get('reorderedData', [])

    for index, item in enumerate(reordered_data):
        try:
            entry = EducationEntry.objects.get(id=item.get('id'), user=request.user)
            entry.order = index
            entry.save()
        except EducationEntry.DoesNotExist:
            continue

    return Response({"message": "Order updated successfully"})


class EducationDesignAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        """
        Retrieve the selected education design for the authenticated user.
        """
        design, created = EducationDesign.objects.get_or_create(user=request.user)
        return Response({
            "selected_design": design.selected_design,
            "design_config": design.design_config
        })

    def put(self, request, format=None):
        """
        Update the selected education design for the authenticated user.
        """
        design, created = EducationDesign.objects.get_or_create(user=request.user)
        serializer = EducationDesignSerializer(design, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Education design updated!",
                "design_config": serializer.data.get('design_config')
            })
        return Response(serializer.errors, status=400)