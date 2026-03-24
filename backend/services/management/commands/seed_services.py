from django.core.management.base import BaseCommand
from services.models import Service
from users.models import CustomUser


class Command(BaseCommand):
    help = 'Seeds sample services data for testing'

    def handle(self, *args, **options):
        # Get the first user (or specify username)
        user = CustomUser.objects.first()
        if not user:
            self.stdout.write(self.style.ERROR('No users found. Please create a user first.'))
            return

        # Clear existing services for this user
        Service.objects.filter(user=user).delete()

        services_data = [
            {
                'title': 'Full-Stack Web Development',
                'short_description': 'End-to-end web applications using React, Django, and modern cloud infrastructure.',
                'description': 'I build complete web applications from concept to deployment. This includes frontend development with React/Next.js, backend APIs with Django/Node.js, database design, authentication, and cloud deployment on AWS/GCP.',
                'icon': 'Code',
                'price': '75',
                'price_type': 'hourly',
                'is_featured': True,
                'is_active': True,
                'order': 0,
            },
            {
                'title': 'UI/UX Design',
                'short_description': 'Beautiful, intuitive interfaces that users love. Figma to production-ready code.',
                'description': 'Creating user-centered designs with a focus on usability and aesthetics. I handle wireframing, prototyping in Figma, user testing, and can convert designs directly to responsive code.',
                'icon': 'Palette',
                'price': '60',
                'price_type': 'hourly',
                'is_featured': True,
                'is_active': True,
                'order': 1,
            },
            {
                'title': 'API Development & Integration',
                'short_description': 'RESTful APIs, GraphQL, and third-party integrations for seamless data flow.',
                'description': 'Design and build robust APIs that scale. I specialize in REST and GraphQL APIs, payment gateway integrations (Stripe, PayPal), OAuth implementations, and connecting your systems with third-party services.',
                'icon': 'Zap',
                'price': '70',
                'price_type': 'hourly',
                'is_featured': False,
                'is_active': True,
                'order': 2,
            },
            {
                'title': 'E-Commerce Solutions',
                'short_description': 'Custom online stores with payment processing, inventory, and order management.',
                'description': 'Build your online store from scratch or enhance existing platforms. Includes product catalogs, shopping carts, secure checkout, inventory management, and analytics dashboards.',
                'icon': 'Package',
                'price': '2500',
                'price_type': 'starting',
                'is_featured': False,
                'is_active': True,
                'order': 3,
            },
            {
                'title': 'Technical Consulting',
                'short_description': 'Architecture reviews, tech stack recommendations, and development roadmaps.',
                'description': 'Get expert guidance on your technical decisions. I provide architecture reviews, technology selection advice, scalability planning, and help teams adopt best practices.',
                'icon': 'Settings',
                'price': '150',
                'price_type': 'hourly',
                'is_featured': False,
                'is_active': True,
                'order': 4,
            },
            {
                'title': 'Mobile App Development',
                'short_description': 'Cross-platform mobile apps with React Native for iOS and Android.',
                'description': 'Develop mobile applications that work seamlessly on both iOS and Android. Using React Native for efficient cross-platform development with native performance.',
                'icon': 'Globe',
                'price': '5000',
                'price_type': 'starting',
                'is_featured': False,
                'is_active': True,
                'order': 5,
            },
            {
                'title': 'Security Audit',
                'short_description': 'Comprehensive security assessment and vulnerability remediation.',
                'description': 'Identify and fix security vulnerabilities in your applications. Includes penetration testing, code review, OWASP compliance checks, and security best practices implementation.',
                'icon': 'Shield',
                'price': '',
                'price_type': 'contact',
                'is_featured': False,
                'is_active': True,
                'order': 6,
            },
            {
                'title': 'Content Writing',
                'short_description': 'Technical documentation, blog posts, and API documentation.',
                'description': 'Clear, engaging technical content that helps users understand your product. I write developer documentation, tutorials, blog posts, and API references.',
                'icon': 'FileText',
                'price': '500',
                'price_type': 'fixed',
                'is_featured': False,
                'is_active': True,
                'order': 7,
            },
        ]

        for data in services_data:
            Service.objects.create(user=user, **data)
            self.stdout.write(f"  Created: {data['title']}")

        self.stdout.write(self.style.SUCCESS(f'\nSuccessfully created {len(services_data)} services for user: {user.username}'))
