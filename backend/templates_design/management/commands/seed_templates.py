from django.core.management.base import BaseCommand
from templates_design.models import DesignTemplate


TEMPLATES = [
    {
        "name": "Mini Profile",
        "slug": "mini-profile",
        "source": "templatemo-530",
        "description": "Clean minimal design with parallax effects. Perfect for simple, elegant portfolios.",
        "thumbnail": "/templates/mini-profile/thumbnail.png",
        "style": "minimal",
        "order": 1,
        "config": {
            "global": {
                "primaryColor": "#343a40",
                "accentColor": "#6c757d",
                "backgroundColor": "#ffffff",
                "textColor": "#212529",
                "secondaryTextColor": "#6c757d",
                "fontFamily": "Open Sans",
                "borderRadius": 4
            },
            "profile": {
                "layoutType": "horizontal",
                "cardStyle": "flat",
                "imageStyle": "rounded",
                "backgroundColor": "#f8f9fa",
                "showBio": True
            },
            "education": {
                "layoutType": "cards",
                "cardStyle": "elevated",
                "backgroundColor": "#ffffff",
                "accentColor": "#343a40",
                "borderRadius": 8,
                "showYear": True
            },
            "career": {
                "layoutType": "timeline",
                "cardStyle": "bordered",
                "backgroundColor": "#ffffff",
                "accentColor": "#343a40",
                "lineStyle": "solid",
                "borderRadius": 8
            },
            "resume": {
                "template": "professional",
                "sidebarColor": "#343a40",
                "accentColor": "#6c757d",
                "fontFamily": "Open Sans"
            },
            "awards": {
                "layoutType": "grid",
                "cardStyle": "elevated",
                "backgroundColor": "#ffffff",
                "accentColor": "#343a40"
            },
            "skills": {
                "layoutType": "cards",
                "cardStyle": "flat",
                "showProficiency": True,
                "showCategory": True,
                "barColor": "#343a40",
                "backgroundColor": "#f8f9fa"
            },
            "generic": {
                "layoutType": "cards",
                "cardStyle": "elevated",
                "backgroundColor": "#ffffff",
                "accentColor": "#343a40",
                "borderRadius": 8
            }
        }
    },
    {
        "name": "Nexaverse",
        "slug": "nexaverse",
        "source": "templatemo-603",
        "description": "Dark glassmorphism design with cyan and purple accents. Modern and futuristic.",
        "thumbnail": "/templates/nexaverse/thumbnail.png",
        "style": "glassmorphism",
        "order": 2,
        "config": {
            "global": {
                "primaryColor": "#00d4ff",
                "accentColor": "#a855f7",
                "backgroundColor": "#0a0a1a",
                "textColor": "#ffffff",
                "secondaryTextColor": "#a0aec0",
                "fontFamily": "Syne",
                "borderRadius": 16
            },
            "profile": {
                "layoutType": "centered",
                "cardStyle": "glassmorphism",
                "imageStyle": "circle",
                "backgroundColor": "rgba(255,255,255,0.05)",
                "glowEffect": True,
                "showBio": True
            },
            "education": {
                "layoutType": "cards",
                "cardStyle": "glassmorphism",
                "backgroundColor": "rgba(255,255,255,0.05)",
                "accentColor": "#00d4ff",
                "borderRadius": 16,
                "glowEffect": True,
                "showYear": True
            },
            "career": {
                "layoutType": "timeline",
                "cardStyle": "glassmorphism",
                "backgroundColor": "rgba(255,255,255,0.05)",
                "accentColor": "#a855f7",
                "lineStyle": "gradient",
                "borderRadius": 16,
                "glowEffect": True
            },
            "resume": {
                "template": "modern",
                "sidebarColor": "#1a1a2e",
                "accentColor": "#00d4ff",
                "fontFamily": "Syne"
            },
            "awards": {
                "layoutType": "grid",
                "cardStyle": "glassmorphism",
                "backgroundColor": "rgba(255,255,255,0.05)",
                "accentColor": "#a855f7",
                "glowEffect": True
            },
            "skills": {
                "layoutType": "grid",
                "cardStyle": "glassmorphism",
                "showProficiency": True,
                "showCategory": True,
                "barColor": "linear-gradient(90deg, #00d4ff, #a855f7)",
                "backgroundColor": "rgba(255,255,255,0.05)"
            },
            "generic": {
                "layoutType": "cards",
                "cardStyle": "glassmorphism",
                "backgroundColor": "rgba(255,255,255,0.05)",
                "accentColor": "#00d4ff",
                "borderRadius": 16,
                "glowEffect": True
            }
        }
    },
    {
        "name": "Personal Shape",
        "slug": "personal-shape",
        "source": "templatemo-593",
        "description": "Stylish portfolio with beautiful gradient backgrounds. Creative and bold.",
        "thumbnail": "/templates/personal-shape/thumbnail.png",
        "style": "gradient",
        "order": 3,
        "config": {
            "global": {
                "primaryColor": "#667eea",
                "accentColor": "#764ba2",
                "backgroundColor": "#f7fafc",
                "textColor": "#2d3748",
                "secondaryTextColor": "#718096",
                "fontFamily": "Poppins",
                "borderRadius": 12,
                "gradient": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            },
            "profile": {
                "layoutType": "horizontal",
                "cardStyle": "elevated",
                "imageStyle": "rounded",
                "backgroundColor": "#ffffff",
                "gradient": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "showBio": True
            },
            "education": {
                "layoutType": "zigzag",
                "cardStyle": "elevated",
                "backgroundColor": "#ffffff",
                "accentColor": "#667eea",
                "borderRadius": 12,
                "showYear": True
            },
            "career": {
                "layoutType": "alternating",
                "cardStyle": "elevated",
                "backgroundColor": "#ffffff",
                "accentColor": "#764ba2",
                "lineStyle": "gradient",
                "borderRadius": 12
            },
            "resume": {
                "template": "creative",
                "sidebarColor": "#667eea",
                "accentColor": "#764ba2",
                "fontFamily": "Poppins"
            },
            "awards": {
                "layoutType": "masonry",
                "cardStyle": "elevated",
                "backgroundColor": "#ffffff",
                "accentColor": "#667eea"
            },
            "skills": {
                "layoutType": "pills",
                "cardStyle": "gradient",
                "showProficiency": True,
                "showCategory": True,
                "barColor": "linear-gradient(90deg, #667eea, #764ba2)",
                "backgroundColor": "#ffffff"
            },
            "generic": {
                "layoutType": "cards",
                "cardStyle": "elevated",
                "backgroundColor": "#ffffff",
                "accentColor": "#667eea",
                "borderRadius": 12
            }
        }
    },
    {
        "name": "Glossy Touch",
        "slug": "glossy-touch",
        "source": "templatemo-592",
        "description": "Modern glassmorphism with dark blue gradient. Sleek and professional.",
        "thumbnail": "/templates/glossy-touch/thumbnail.png",
        "style": "glassmorphism",
        "order": 4,
        "config": {
            "global": {
                "primaryColor": "#3b82f6",
                "accentColor": "#60a5fa",
                "backgroundColor": "#0f172a",
                "textColor": "#f1f5f9",
                "secondaryTextColor": "#94a3b8",
                "fontFamily": "Inter",
                "borderRadius": 20,
                "gradient": "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)"
            },
            "profile": {
                "layoutType": "centered",
                "cardStyle": "glassmorphism",
                "imageStyle": "circle",
                "backgroundColor": "rgba(59,130,246,0.1)",
                "showBio": True
            },
            "education": {
                "layoutType": "cards",
                "cardStyle": "glassmorphism",
                "backgroundColor": "rgba(59,130,246,0.1)",
                "accentColor": "#3b82f6",
                "borderRadius": 20,
                "showYear": True
            },
            "career": {
                "layoutType": "timeline",
                "cardStyle": "glassmorphism",
                "backgroundColor": "rgba(59,130,246,0.1)",
                "accentColor": "#60a5fa",
                "lineStyle": "dashed",
                "borderRadius": 20
            },
            "resume": {
                "template": "modern",
                "sidebarColor": "#1e3a5f",
                "accentColor": "#3b82f6",
                "fontFamily": "Inter"
            },
            "awards": {
                "layoutType": "grid",
                "cardStyle": "glassmorphism",
                "backgroundColor": "rgba(59,130,246,0.1)",
                "accentColor": "#3b82f6"
            },
            "skills": {
                "layoutType": "bars",
                "cardStyle": "glassmorphism",
                "showProficiency": True,
                "showCategory": True,
                "barColor": "#3b82f6",
                "backgroundColor": "rgba(59,130,246,0.1)"
            },
            "generic": {
                "layoutType": "cards",
                "cardStyle": "glassmorphism",
                "backgroundColor": "rgba(59,130,246,0.1)",
                "accentColor": "#3b82f6",
                "borderRadius": 20
            }
        }
    },
    {
        "name": "Elegance",
        "slug": "elegance",
        "source": "templatemo-528",
        "description": "Blue gradient with video background support. Elegant scrolling sections.",
        "thumbnail": "/templates/elegance/thumbnail.png",
        "style": "gradient",
        "order": 5,
        "config": {
            "global": {
                "primaryColor": "#1e40af",
                "accentColor": "#3b82f6",
                "backgroundColor": "#eff6ff",
                "textColor": "#1e3a8a",
                "secondaryTextColor": "#3b82f6",
                "fontFamily": "Montserrat",
                "borderRadius": 8,
                "gradient": "linear-gradient(180deg, #1e40af 0%, #3b82f6 100%)"
            },
            "profile": {
                "layoutType": "horizontal",
                "cardStyle": "elevated",
                "imageStyle": "rounded",
                "backgroundColor": "#ffffff",
                "showBio": True
            },
            "education": {
                "layoutType": "timeline",
                "cardStyle": "bordered",
                "backgroundColor": "#ffffff",
                "accentColor": "#1e40af",
                "borderRadius": 8,
                "showYear": True
            },
            "career": {
                "layoutType": "cards",
                "cardStyle": "elevated",
                "backgroundColor": "#ffffff",
                "accentColor": "#3b82f6",
                "lineStyle": "solid",
                "borderRadius": 8
            },
            "resume": {
                "template": "professional",
                "sidebarColor": "#1e40af",
                "accentColor": "#3b82f6",
                "fontFamily": "Montserrat"
            },
            "awards": {
                "layoutType": "carousel",
                "cardStyle": "elevated",
                "backgroundColor": "#ffffff",
                "accentColor": "#1e40af"
            },
            "skills": {
                "layoutType": "cards",
                "cardStyle": "bordered",
                "showProficiency": True,
                "showCategory": True,
                "barColor": "#1e40af",
                "backgroundColor": "#ffffff"
            },
            "generic": {
                "layoutType": "cards",
                "cardStyle": "elevated",
                "backgroundColor": "#ffffff",
                "accentColor": "#1e40af",
                "borderRadius": 8
            }
        }
    },
    {
        "name": "First Portfolio",
        "slug": "first-portfolio",
        "source": "templatemo-578",
        "description": "Vibrant one-page design with green and purple accents. Fresh and energetic.",
        "thumbnail": "/templates/first-portfolio/thumbnail.png",
        "style": "colorful",
        "order": 6,
        "config": {
            "global": {
                "primaryColor": "#10b981",
                "accentColor": "#8b5cf6",
                "backgroundColor": "#ffffff",
                "textColor": "#111827",
                "secondaryTextColor": "#6b7280",
                "fontFamily": "Nunito",
                "borderRadius": 10
            },
            "profile": {
                "layoutType": "split",
                "cardStyle": "flat",
                "imageStyle": "circle",
                "backgroundColor": "#f0fdf4",
                "showBio": True
            },
            "education": {
                "layoutType": "cards",
                "cardStyle": "bordered",
                "backgroundColor": "#ffffff",
                "accentColor": "#10b981",
                "borderRadius": 10,
                "showYear": True
            },
            "career": {
                "layoutType": "timeline",
                "cardStyle": "elevated",
                "backgroundColor": "#ffffff",
                "accentColor": "#8b5cf6",
                "lineStyle": "dotted",
                "borderRadius": 10
            },
            "resume": {
                "template": "creative",
                "sidebarColor": "#10b981",
                "accentColor": "#8b5cf6",
                "fontFamily": "Nunito"
            },
            "awards": {
                "layoutType": "grid",
                "cardStyle": "bordered",
                "backgroundColor": "#ffffff",
                "accentColor": "#10b981"
            },
            "skills": {
                "layoutType": "tags",
                "cardStyle": "pill",
                "showProficiency": False,
                "showCategory": True,
                "barColor": "#10b981",
                "backgroundColor": "#f0fdf4"
            },
            "generic": {
                "layoutType": "cards",
                "cardStyle": "bordered",
                "backgroundColor": "#ffffff",
                "accentColor": "#10b981",
                "borderRadius": 10
            }
        }
    },
    {
        "name": "Reflux",
        "slug": "reflux",
        "source": "templatemo-531",
        "description": "One-page scrolling with sticky sidebar. Detailed and comprehensive.",
        "thumbnail": "/templates/reflux/thumbnail.png",
        "style": "professional",
        "order": 7,
        "config": {
            "global": {
                "primaryColor": "#dc2626",
                "accentColor": "#f97316",
                "backgroundColor": "#fafafa",
                "textColor": "#171717",
                "secondaryTextColor": "#525252",
                "fontFamily": "Roboto",
                "borderRadius": 6
            },
            "profile": {
                "layoutType": "sidebar",
                "cardStyle": "flat",
                "imageStyle": "square",
                "backgroundColor": "#ffffff",
                "showBio": True
            },
            "education": {
                "layoutType": "list",
                "cardStyle": "flat",
                "backgroundColor": "#ffffff",
                "accentColor": "#dc2626",
                "borderRadius": 6,
                "showYear": True
            },
            "career": {
                "layoutType": "list",
                "cardStyle": "flat",
                "backgroundColor": "#ffffff",
                "accentColor": "#f97316",
                "lineStyle": "solid",
                "borderRadius": 6
            },
            "resume": {
                "template": "classic",
                "sidebarColor": "#dc2626",
                "accentColor": "#f97316",
                "fontFamily": "Roboto"
            },
            "awards": {
                "layoutType": "list",
                "cardStyle": "flat",
                "backgroundColor": "#ffffff",
                "accentColor": "#dc2626"
            },
            "skills": {
                "layoutType": "bars",
                "cardStyle": "flat",
                "showProficiency": True,
                "showCategory": True,
                "barColor": "#dc2626",
                "backgroundColor": "#ffffff"
            },
            "generic": {
                "layoutType": "list",
                "cardStyle": "flat",
                "backgroundColor": "#ffffff",
                "accentColor": "#dc2626",
                "borderRadius": 6
            }
        }
    },
    {
        "name": "Developer Portfolio",
        "slug": "developer-portfolio",
        "source": "custom",
        "description": "Split-screen layout with fixed sidebar. Terminal aesthetics, perfect for developers.",
        "thumbnail": "/templates/developer/thumbnail.png",
        "style": "developer",
        "order": 8,
        "config": {
            "global": {
                "primaryColor": "#64ffda",
                "accentColor": "#64ffda",
                "backgroundColor": "#0a192f",
                "textColor": "#ccd6f6",
                "secondaryTextColor": "#8892b0",
                "fontFamily": "Fira Code",
                "borderRadius": 8,
                "layout": "split-fixed"
            },
            "profile": {
                "layoutType": "split-fixed",
                "cardStyle": "terminal",
                "imageStyle": "rounded",
                "backgroundColor": "#0a192f",
                "showBio": True,
                "sidebarWidth": "45%"
            },
            "education": {
                "layoutType": "cards",
                "cardStyle": "terminal",
                "backgroundColor": "#112240",
                "accentColor": "#64ffda",
                "borderRadius": 8,
                "showYear": True
            },
            "career": {
                "layoutType": "bullet-points",
                "cardStyle": "minimal",
                "backgroundColor": "#0a192f",
                "accentColor": "#64ffda",
                "lineStyle": "none",
                "borderRadius": 8
            },
            "resume": {
                "template": "developer",
                "sidebarColor": "#0a192f",
                "accentColor": "#64ffda",
                "fontFamily": "Fira Code"
            },
            "awards": {
                "layoutType": "grid",
                "cardStyle": "bordered",
                "backgroundColor": "#112240",
                "accentColor": "#64ffda"
            },
            "skills": {
                "layoutType": "terminal",
                "cardStyle": "code-block",
                "showProficiency": True,
                "showCategory": True,
                "barColor": "#64ffda",
                "backgroundColor": "#1d2433"
            },
            "generic": {
                "layoutType": "cards",
                "cardStyle": "bordered",
                "backgroundColor": "#112240",
                "accentColor": "#64ffda",
                "borderRadius": 8
            }
        }
    },
    {
        "name": "Starter Dark",
        "slug": "starter-dark",
        "source": "custom",
        "description": "Simple dark theme with minimal design. Clean and focused.",
        "thumbnail": "/templates/starter-dark/thumbnail.png",
        "style": "dark",
        "order": 9,
        "config": {
            "global": {
                "primaryColor": "#f3f4f6",
                "accentColor": "#9ca3af",
                "backgroundColor": "#111827",
                "textColor": "#f9fafb",
                "secondaryTextColor": "#9ca3af",
                "fontFamily": "Inter",
                "borderRadius": 8
            },
            "profile": {
                "layoutType": "centered",
                "cardStyle": "flat",
                "imageStyle": "circle",
                "backgroundColor": "#1f2937",
                "showBio": True
            },
            "education": {
                "layoutType": "cards",
                "cardStyle": "bordered",
                "backgroundColor": "#1f2937",
                "accentColor": "#f3f4f6",
                "borderRadius": 8,
                "borderColor": "#374151",
                "showYear": True
            },
            "career": {
                "layoutType": "timeline",
                "cardStyle": "bordered",
                "backgroundColor": "#1f2937",
                "accentColor": "#9ca3af",
                "lineStyle": "solid",
                "borderRadius": 8,
                "borderColor": "#374151"
            },
            "resume": {
                "template": "modern",
                "sidebarColor": "#1f2937",
                "accentColor": "#f3f4f6",
                "fontFamily": "Inter"
            },
            "awards": {
                "layoutType": "grid",
                "cardStyle": "bordered",
                "backgroundColor": "#1f2937",
                "accentColor": "#f3f4f6",
                "borderColor": "#374151"
            },
            "skills": {
                "layoutType": "bars",
                "cardStyle": "flat",
                "showProficiency": True,
                "showCategory": True,
                "barColor": "#f3f4f6",
                "backgroundColor": "#1f2937"
            },
            "generic": {
                "layoutType": "cards",
                "cardStyle": "bordered",
                "backgroundColor": "#1f2937",
                "accentColor": "#f3f4f6",
                "borderRadius": 8,
                "borderColor": "#374151"
            }
        }
    }
]


class Command(BaseCommand):
    help = 'Seed the database with design templates'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing templates before seeding',
        )

    def handle(self, *args, **options):
        if options['clear']:
            deleted_count = DesignTemplate.objects.all().delete()[0]
            self.stdout.write(f'Deleted {deleted_count} existing templates')

        created_count = 0
        updated_count = 0

        for template_data in TEMPLATES:
            template, created = DesignTemplate.objects.update_or_create(
                slug=template_data['slug'],
                defaults={
                    'name': template_data['name'],
                    'source': template_data['source'],
                    'description': template_data['description'],
                    'thumbnail': template_data['thumbnail'],
                    'style': template_data['style'],
                    'order': template_data['order'],
                    'config': template_data['config'],
                    'is_active': True,
                    'is_premium': False
                }
            )

            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f'Created: {template.name}'))
            else:
                updated_count += 1
                self.stdout.write(f'Updated: {template.name}')

        self.stdout.write(self.style.SUCCESS(
            f'\nDone! Created: {created_count}, Updated: {updated_count}'
        ))
