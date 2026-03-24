"""
Seed script to create comprehensive demo data for p2c platform
Run: python seed_demo.py
"""
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import CustomUser
from profiles.models import UserProfile
from home.models import HomePageContent
from career.models import CareerEntry, Skill
from education.models import EducationEntry
from achievements.models import Award

user = CustomUser.objects.get(username='fff')
print(f'Setting up demo for: {user.username}')

# === HOME PAGE CONTENT ===
home, _ = HomePageContent.objects.get_or_create(user=user)
home.name = 'Alex Richardson'
home.title = 'Senior Full-Stack Developer'
home.tagline = 'Building Digital Experiences That Matter'
home.resume_objective = """Passionate full-stack developer with 8+ years of experience crafting scalable web applications and leading engineering teams. I specialize in React, Django, and cloud architecture, with a proven track record of delivering high-impact products for startups and enterprises alike.

Currently focused on AI-powered applications and helping businesses transform their digital presence. I believe great software is built at the intersection of technical excellence and user empathy."""
home.is_published = True
home.save()
print('Home page content created')

# === PROFILE ===
profile, _ = UserProfile.objects.get_or_create(user=user)
profile.phone = '+15551234567'
profile.location = 'San Francisco, CA'
profile.bio = """I am a senior full-stack developer passionate about building products that make a difference. With expertise spanning frontend frameworks, backend systems, and cloud infrastructure, I bring ideas to life through clean, maintainable code.

When I am not coding, you will find me mentoring junior developers, contributing to open-source projects, or exploring the latest in AI and machine learning."""
profile.linkedin = 'https://linkedin.com/in/alexrichardson'
profile.github = 'https://github.com/alexrichardson'
profile.twitter = 'https://twitter.com/alexrichardson'
profile.website = 'https://alexrichardson.dev'
profile.years_of_experience = 8
profile.job_title = 'Senior Full-Stack Developer'
profile.show_availability = True
profile.save()
print('Profile updated')

# === EDUCATION ===
EducationEntry.objects.filter(user=user).delete()

education_data = [
    {
        'university': 'Stanford University',
        'degree': 'Master of Science in Computer Science',
        'year': '2014 - 2016',
        'description': 'Specialized in Distributed Systems and Machine Learning. Thesis on "Scalable Real-time Data Processing Architectures". Teaching Assistant for CS101. GPA: 3.9',
        'order': 0,
    },
    {
        'university': 'University of California, Berkeley',
        'degree': 'Bachelor of Science in Computer Science & Mathematics',
        'year': '2010 - 2014',
        'description': 'Double major in Computer Science and Applied Mathematics. Deans List all semesters. President of ACM Student Chapter. GPA: 3.8, Magna Cum Laude',
        'order': 1,
    },
]

for edu in education_data:
    EducationEntry.objects.create(user=user, **edu)
print(f'Created {len(education_data)} education entries')

# === CAREER ===
CareerEntry.objects.filter(user=user).delete()

career_data = [
    {
        'company': 'TechVentures Inc.',
        'title': 'Senior Full-Stack Developer & Tech Lead',
        'year': 'Mar 2021 - Present',
        'description': """Leading a team of 6 engineers building a B2B SaaS platform serving 500+ enterprise clients.

Key Achievements:
- Architected microservices infrastructure handling 10M+ daily API requests
- Reduced page load times by 60% through performance optimization
- Implemented CI/CD pipelines reducing deployment time from 2 hours to 15 minutes
- Mentored 4 junior developers, 2 promoted to mid-level within a year""",
        'order': 0,
    },
    {
        'company': 'InnovateTech Solutions',
        'title': 'Full-Stack Developer',
        'year': 'Jun 2018 - Feb 2021',
        'description': """Built and maintained multiple client-facing web applications using React, Node.js, and PostgreSQL.

Key Achievements:
- Developed real-time collaboration features used by 50,000+ daily active users
- Built payment processing system handling $2M+ monthly transactions
- Created automated testing suite achieving 90% code coverage
- Reduced AWS costs by 40% through infrastructure optimization""",
        'order': 1,
    },
    {
        'company': 'StartupXYZ',
        'title': 'Junior Software Engineer',
        'year': 'Jul 2016 - May 2018',
        'description': """Early employee (#12) at a fast-growing fintech startup.

Key Achievements:
- Built MVP that helped secure $5M Series A funding
- Developed RESTful APIs serving mobile and web applications
- Implemented OAuth 2.0 authentication system""",
        'order': 2,
    },
]

for career in career_data:
    CareerEntry.objects.create(user=user, **career)
print(f'Created {len(career_data)} career entries')

# === SKILLS ===
Skill.objects.filter(user=user).delete()

skills_data = [
    # Frontend
    {'name': 'React.js', 'proficiency': 95, 'category': 'programming', 'order': 0},
    {'name': 'TypeScript', 'proficiency': 90, 'category': 'programming', 'order': 1},
    {'name': 'Next.js', 'proficiency': 88, 'category': 'programming', 'order': 2},
    {'name': 'Tailwind CSS', 'proficiency': 92, 'category': 'design', 'order': 3},
    # Backend
    {'name': 'Python/Django', 'proficiency': 93, 'category': 'programming', 'order': 4},
    {'name': 'Node.js', 'proficiency': 88, 'category': 'programming', 'order': 5},
    {'name': 'PostgreSQL', 'proficiency': 85, 'category': 'database', 'order': 6},
    {'name': 'GraphQL', 'proficiency': 82, 'category': 'programming', 'order': 7},
    # DevOps
    {'name': 'AWS', 'proficiency': 87, 'category': 'cloud', 'order': 8},
    {'name': 'Docker', 'proficiency': 90, 'category': 'cloud', 'order': 9},
    {'name': 'Kubernetes', 'proficiency': 78, 'category': 'cloud', 'order': 10},
    {'name': 'CI/CD', 'proficiency': 88, 'category': 'tools', 'order': 11},
    # Other
    {'name': 'System Design', 'proficiency': 85, 'category': 'other', 'order': 12},
    {'name': 'Team Leadership', 'proficiency': 88, 'category': 'soft_skills', 'order': 13},
]

for skill in skills_data:
    Skill.objects.create(user=user, **skill)
print(f'Created {len(skills_data)} skills')

# === AWARDS ===
Award.objects.filter(user=user).delete()

awards_data = [
    {
        'title': 'Best Technical Innovation Award',
        'organization': 'TechVentures Inc.',
        'year': '2023',
        'description': 'Recognized for designing and implementing an AI-powered recommendation engine that increased user engagement by 45%.',
        'order': 0,
    },
    {
        'title': 'Employee of the Year',
        'organization': 'InnovateTech Solutions',
        'year': '2020',
        'description': 'Awarded for exceptional contributions to product development and mentoring new team members.',
        'order': 1,
    },
    {
        'title': 'Hackathon Winner - 1st Place',
        'organization': 'Google Developer Conference',
        'year': '2019',
        'description': 'Led a team of 4 to build an accessibility tool for visually impaired users in 48 hours.',
        'order': 2,
    },
    {
        'title': 'Open Source Contributor Award',
        'organization': 'React Community',
        'year': '2018',
        'description': 'Recognized for significant contributions to popular React libraries with 5000+ GitHub stars.',
        'order': 3,
    },
]

for award in awards_data:
    Award.objects.create(user=user, **award)
print(f'Created {len(awards_data)} awards')

print('\n=== Demo data setup complete for user: fff ===')
print('Sections populated: Home, Profile, Education, Career, Skills, Awards')
print('(Services and Testimonials were already seeded earlier)')
