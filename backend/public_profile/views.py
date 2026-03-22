import os
import re
import base64
import anthropic
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model

from users.models import UserTabSettings
from blog.serializers import BlogPostSerializer
from career.serializers import CareerEntrySerializer, SkillSerializer
from career.models import CareerDesignSettings
from education.serializers import EducationEntrySerializer
from education.models import EducationDesign
from home.serializers import HomePageContentSerializer
from profiles.serializers import UserProfileSerializer
from profiles.models import ProfileDesign
from career.models import SkillsDesignSettings
from users.serializers import UserTabSettingsSerializer
from achievements.models import Award, Achievement
from achievements.serializers import AwardSerializer, AchievementSerializer
from profiles.models import ProfileNote
from profiles.serializers import ProfileNoteSerializer

User = get_user_model()


def embed_profile_picture_in_html(html_content, profile):
    """Replace profile picture URL with base64 data URL for PDF generation"""
    if not profile or not profile.profile_picture or not profile.profile_picture.name:
        return html_content

    try:
        # Read the profile picture and convert to base64
        profile.profile_picture.open('rb')
        image_data = profile.profile_picture.read()
        profile.profile_picture.close()

        # Determine mime type
        filename = profile.profile_picture.name.lower()
        if filename.endswith('.png'):
            mime_type = 'image/png'
        elif filename.endswith('.gif'):
            mime_type = 'image/gif'
        else:
            mime_type = 'image/jpeg'

        # Create base64 data URL
        base64_data = base64.b64encode(image_data).decode('utf-8')
        data_url = f'data:{mime_type};base64,{base64_data}'

        # Replace image src URLs that contain the profile picture path
        picture_filename = os.path.basename(profile.profile_picture.name)
        patterns = [
            rf'src="[^"]*{re.escape(picture_filename)}[^"]*"',
            rf"src='[^']*{re.escape(picture_filename)}[^']*'",
            r'src="[^"]*profile[_-]?pic[^"]*"',
            r"src='[^']*profile[_-]?pic[^']*'",
        ]

        for pattern in patterns:
            html_content = re.sub(pattern, f'src="{data_url}"', html_content)

        return html_content
    except Exception as e:
        print(f"Error embedding profile picture: {e}")
        return html_content


# Configure Claude API
import os
CLAUDE_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
claude_client = anthropic.Anthropic(api_key=CLAUDE_API_KEY)


class PublicProfileAggregateView(APIView):
    permission_classes = []  # Allow public access

    def get(self, request, username):
        # Get the user by username (case-insensitive)
        user = get_object_or_404(User, username__iexact=username)

        # 1. Public blog posts
        from blog.models import BlogPost
        blog_posts = BlogPost.objects.filter(author=user)
        blog_data = BlogPostSerializer(blog_posts, many=True).data

        # 2. Career entries
        from career.models import CareerEntry, Skill
        career_entries = CareerEntry.objects.filter(user=user)
        career_data = CareerEntrySerializer(career_entries, many=True).data

        # 3. Education entries
        from education.models import EducationEntry
        education_entries = EducationEntry.objects.filter(user=user)
        education_data = EducationEntrySerializer(education_entries, many=True).data

        # 4. Public HomePage content
        from home.models import HomePageContent
        home_content = HomePageContent.objects.filter(user=user).first()
        home_data = HomePageContentSerializer(home_content).data if home_content else {}

        # 5. User Profile data (public version)
        from profiles.models import UserProfile
        user_profile_obj = UserProfile.objects.filter(user=user).first()
        profile_data = UserProfileSerializer(user_profile_obj).data if user_profile_obj else {}

        # 6. User Tab Settings
        tab_settings_obj, created = UserTabSettings.objects.get_or_create(
            user=user, defaults={"settings": {}}
        )
        tab_settings_data = UserTabSettingsSerializer(tab_settings_obj).data
        print(f"Tab settings for {username}: {tab_settings_data}")

        # 7. User Skills with proficiency (deduplicated by name, keeping highest proficiency)
        all_skills = Skill.objects.filter(user=user).order_by('-proficiency')
        # Remove duplicates by returning only one skill per name (keep highest proficiency)
        unique_ids = []
        seen = set()
        for skill in all_skills:
            name_lower = skill.name.lower().strip()
            if name_lower not in seen:
                seen.add(name_lower)
                unique_ids.append(skill.id)
        skills = all_skills.filter(id__in=unique_ids).order_by('category', 'order', '-proficiency')
        skill_data = SkillSerializer(skills, many=True).data

        # 8. Awards and Achievements
        awards = Award.objects.filter(user=user)
        awards_data = AwardSerializer(awards, many=True).data
        achievements = Achievement.objects.filter(user=user)
        achievements_data = AchievementSerializer(achievements, many=True).data

        # 9. Design configs for career, education, and profile
        career_design = CareerDesignSettings.objects.filter(user=user).first()
        career_design_config = career_design.design_config if career_design and career_design.design_config else None

        education_design = EducationDesign.objects.filter(user=user).first()
        education_design_config = education_design.design_config if education_design and education_design.design_config else None

        profile_design = ProfileDesign.objects.filter(user=user).first()
        profile_design_config = profile_design.design_config if profile_design and profile_design.design_config else None

        # Skills design config
        skills_design = SkillsDesignSettings.objects.filter(user=user).first()
        skills_design_config = skills_design.design_config if skills_design and skills_design.design_config else None

        # 10. Profile Notes (visible only)
        notes = ProfileNote.objects.filter(user=user, is_visible=True)
        notes_data = ProfileNoteSerializer(notes, many=True).data

        # Construct the response data using camelCase keys where needed
        response_data = {
            "blogPosts": blog_data,
            "careerEntries": career_data,
            "educationEntries": education_data,
            "homeContent": home_data,
            "backgroundVideo": home_data.get("background_video", ""),
            "description": home_data.get("description", ""),
            "youtubeLink": home_data.get("youtube_link", ""),
            "linkedinLink": home_data.get("linkedin_link", ""),
            "facebookLink": home_data.get("facebook_link", ""),
            "twitterLink": home_data.get("twitter_link", ""),
            "customSettings": home_data.get("custom_settings", {}),
            "title": home_data.get("title", ""),
            "userProfile": profile_data,
            "tabSettings": tab_settings_data,
            "skills": skill_data,
            "awards": awards_data,
            "achievements": achievements_data,
            "career_design_config": career_design_config,
            "education_design_config": education_design_config,
            "profile_design_config": profile_design_config,
            "skills_design_config": skills_design_config,
            "notes": notes_data,
        }

        return Response(response_data, status=status.HTTP_200_OK)


class PublicProfileAggregateViewResume(APIView):
    permission_classes = []  # Allow public access

    def get(self, request, username):
        print("Fetching aggregated resume data from PublicProfileAggregateView...")

        # Get the user and profile for embedding profile picture later
        user = get_object_or_404(User, username__iexact=username)
        from profiles.models import UserProfile
        user_profile = UserProfile.objects.filter(user=user).first()

        # Call the PublicProfileAggregateView to get the aggregated data
        aggregate_view = PublicProfileAggregateView()
        aggregated_response = aggregate_view.get(request, username)
        response_data = aggregated_response.data

        # Get profile picture URL for the prompt (absolute URL)
        profile_picture_url = ""
        if user_profile and user_profile.profile_picture and user_profile.profile_picture.name:
            profile_picture_url = request.build_absolute_uri(user_profile.profile_picture.url)

        prompt = (
            """You are a professional resume designer generating polished HTML resumes with Tailwind CSS styling. Output only valid HTML (no markdown) as a complete document including <html>, <head>, and <body> tags.
        Use Tailwind CSS classes for styling. Do not include inline or embedded CSS. Instead, use classes like "container", "text-xl", "font-bold", "mb-4", etc., to style the resume professionally. Follow modern resume templates with a clean layout and ensure the resume is visually balanced, using proper headings, bullet points, and spacing.

        Key requirements:
        - dont keep too much margin on the top and bottom of the page, keep standard margin.
        - include all the description without ignore anything from career and education, keep all the entries.
        - Use a neutral or white background.
        - Do not include social media links except for a direct LinkedIn link (not reference) in small font.
        - Include all available data: contact information, education, career history, skills, awards, achievements, interests, etc.
        - description supposed to be in the form of bullet points.
        - based on the input fetch user skill and add to the resume, languages known, awards, achievements, interests, hobbies, etc., and include in resume as per standard resume.
        - underline the headings, use standard font size and professional fonts.
        - Classify whether the content belongs to a student, experienced professional, fresher, etc., and include in resume.
        - Use underlining, icons where applicable, and proper bullet points and alignment to enhance readability.
        - Ensure the resume is well-formatted, visually balanced, and professional-looking.
        - Use standard font size with professional fonts and sizing.
        - Always include detailed descriptions for career and education entries with appropriate titles.
        - Organize the content into sections and ensure that the Tailwind classes enhance readability and professionalism.
        - IMPORTANT: If a profile picture URL is provided, include a circular profile photo (80-100px) in the header/sidebar area using an <img> tag with the exact URL provided.

        Generate professional HTML resume with in a A4 sheet container, allow multi page if needed using the following aggregated user data.
        The data includes sections like career entries, education entries, profile summary, projects, achievements, languages known
        and user profile information. The output should be a complete HTML document with proper
        <html>, <head>, and <body> tags. Use inline or embedded CSS for styling if needed. Use professional styling for a resume, using professional fonts and sizing.

        Profile Picture URL: """ + (profile_picture_url or "No photo available") + """

        Below is the user data:\n\n""" +
        f"{response_data}"
        )

        try:
            # Use Claude API to generate resume
            message = claude_client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=8000,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            generated_html = message.content[0].text

            # Remove any leftover markdown formatting (triple backticks)
            generated_html = re.sub(r'^```(?:html)?\n?', '', generated_html.strip())
            generated_html = re.sub(r'\n?```$', '', generated_html.strip())

            print("Resume generation complete using Claude API.")

            # Embed profile picture as base64 so it works when printing/saving as PDF
            if user_profile:
                generated_html = embed_profile_picture_in_html(generated_html, user_profile)

            # Optionally, write the generated HTML to a local file
            output_dir = os.path.join(os.path.dirname(__file__), "generated_resumes")
            os.makedirs(output_dir, exist_ok=True)
            output_file = os.path.join(output_dir, f"{username}_resume.html")
            with open(output_file, "w", encoding="utf-8") as f:
                f.write(generated_html)
            print(f"Resume saved locally at: {output_file}")

            return Response({"resume_html": generated_html}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Error generating HTML resume with Claude: {e}")
            return Response({"error": f"Failed to generate HTML resume: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
