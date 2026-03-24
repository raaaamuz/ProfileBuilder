from django.core.management.base import BaseCommand
from testimonials.models import Testimonial
from users.models import CustomUser
from datetime import date


class Command(BaseCommand):
    help = 'Seeds sample testimonials data for testing'

    def handle(self, *args, **options):
        # Get the first user (or specify username)
        user = CustomUser.objects.first()
        if not user:
            self.stdout.write(self.style.ERROR('No users found. Please create a user first.'))
            return

        # Clear existing testimonials for this user
        Testimonial.objects.filter(user=user).delete()

        testimonials_data = [
            {
                'client_name': 'Sarah Johnson',
                'client_title': 'CTO',
                'client_company': 'TechStart Inc.',
                'content': 'Exceptional work on our web platform! Delivered a complex e-commerce solution on time and exceeded our expectations. The attention to detail and proactive communication made the entire process smooth. Highly recommend!',
                'rating': 5,
                'project_name': 'E-Commerce Platform',
                'date': date(2024, 2, 15),
                'linkedin_url': 'https://linkedin.com/in/example',
                'is_featured': True,
                'is_active': True,
                'order': 0,
            },
            {
                'client_name': 'Michael Chen',
                'client_title': 'Product Manager',
                'client_company': 'InnovateCorp',
                'content': 'Working together on our mobile app was a great experience. Technical expertise combined with clear communication and meeting all deadlines. The app has received fantastic user feedback since launch.',
                'rating': 5,
                'project_name': 'Mobile App Development',
                'date': date(2024, 1, 20),
                'linkedin_url': '',
                'is_featured': True,
                'is_active': True,
                'order': 1,
            },
            {
                'client_name': 'Emily Rodriguez',
                'client_title': 'Founder',
                'client_company': 'GreenLeaf Startup',
                'content': 'Transformed our outdated website into a modern, responsive platform. Great understanding of UX principles and delivered a design that our customers love. Very professional throughout.',
                'rating': 5,
                'project_name': 'Website Redesign',
                'date': date(2023, 11, 8),
                'linkedin_url': '',
                'is_featured': False,
                'is_active': True,
                'order': 2,
            },
            {
                'client_name': 'David Kim',
                'client_title': 'Engineering Lead',
                'client_company': 'DataFlow Systems',
                'content': 'Helped us build a robust API infrastructure that handles millions of requests daily. Deep technical knowledge and excellent problem-solving skills. Would definitely work together again.',
                'rating': 5,
                'project_name': 'API Infrastructure',
                'date': date(2023, 9, 25),
                'linkedin_url': '',
                'is_featured': False,
                'is_active': True,
                'order': 3,
            },
            {
                'client_name': 'Amanda Foster',
                'client_title': 'Marketing Director',
                'client_company': 'BrandBoost Agency',
                'content': 'Delivered exactly what we needed for our client dashboard. Good communication and responsive to feedback. The final product was polished and professional.',
                'rating': 4,
                'project_name': 'Analytics Dashboard',
                'date': date(2023, 8, 12),
                'linkedin_url': '',
                'is_featured': False,
                'is_active': True,
                'order': 4,
            },
            {
                'client_name': 'James Wilson',
                'client_title': 'CEO',
                'client_company': 'QuickServe Solutions',
                'content': 'Outstanding consulting work that helped us make critical technology decisions. Saved us months of potential mistakes with expert guidance. Truly valuable partnership.',
                'rating': 5,
                'project_name': 'Technical Consulting',
                'date': date(2023, 7, 5),
                'linkedin_url': '',
                'is_featured': False,
                'is_active': True,
                'order': 5,
            },
        ]

        for data in testimonials_data:
            Testimonial.objects.create(user=user, **data)
            self.stdout.write(f"  Created: {data['client_name']} - {data['client_company']}")

        self.stdout.write(self.style.SUCCESS(f'\nSuccessfully created {len(testimonials_data)} testimonials for user: {user.username}'))
