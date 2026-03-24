# Design Templates Feature - Implementation Plan

## Overview
During account creation, users upload their resume and select a design template from TemplateMo. The selected template becomes the base design for Profile, Education, Career, Resume, Awards, and Skills sections. AI then generates design variations on top of the selected template.

**Source:** Free HTML/CSS templates from [TemplateMo](https://templatemo.com/tag/portfolio) (100% free for commercial use)

---

## User Flow

```
Register Account
      │
      ▼
Upload Resume (CV)
      │
      ▼
AI Parses Resume → Extracts Education, Career, Skills
      │
      ▼
Select Design Template (from TemplateMo options)
      │
      ▼
Template Applied to: Profile, Education, Career, Resume, Awards, Skills
      │
      ▼
Dashboard → AI generates design variations for each section
      │
      ▼
User can switch between AI variations or customize
```

**Note:** Home page remains untouched (uses existing design system)

---

## Feature Requirements

1. **Onboarding Template Selection** - Show templates during account setup after resume upload

2. **Template Applies To:**
   - Profile
   - Education
   - Career
   - Resume
   - Awards/Achievements
   - Skills
   - ~~Home~~ (excluded - keep existing)

3. **AI Design Variations** - Generate AI designs based on selected template style

4. **Custom Designs** - Users can customize on top of template + AI

---

## Implementation Plan

### Phase 1: Backend - Template Data Structure

#### 1.0 Update Onboarding Flow
**Current Flow:** Register → Upload CV → Dashboard
**New Flow:** Register → Upload CV → **Select Template** → Dashboard

Files to update:
- `backend/profiles/views.py` - Add template selection step
- `frontend/src/components/admin/Onboarding/` - Add template selection screen

#### 1.1 Create Template Model
**File:** `backend/templates_design/models.py` (new app)

```python
class DesignTemplate(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    thumbnail = models.ImageField(upload_to='template_thumbnails/')
    is_active = models.BooleanField(default=True)
    is_premium = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    # Complete design config for ALL sections
    config = models.JSONField(default=dict)
    # Structure:
    # {
    #   "home": { backgroundColor, textColor, fontFamily, ... },
    #   "profile": { ... },
    #   "education": { layoutType, cardStyle, ... },
    #   "career": { layoutType, cardStyle, ... },
    #   "resume": { template, sidebarColor, ... },
    #   "awards": { ... },
    #   "skills": { ... },
    #   "global": { primaryColor, accentColor, fontFamily, ... }
    # }

class UserSelectedTemplate(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    template = models.ForeignKey(DesignTemplate, on_delete=models.SET_NULL, null=True)
    customizations = models.JSONField(default=dict)  # User overrides
    selected_at = models.DateTimeField(auto_now=True)
```

#### 1.2 Create API Endpoints
**File:** `backend/templates_design/views.py`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/templates/` | GET | List all available templates |
| `/api/templates/<slug>/` | GET | Get single template details |
| `/api/templates/<slug>/preview/` | GET | Get full preview config |
| `/api/user/template/` | GET | Get user's selected template |
| `/api/user/template/` | POST | Select a template |
| `/api/user/template/customize/` | PATCH | Save customizations |

#### 1.3 Seed Initial Templates
Create management command: `python manage.py seed_templates`

**Templates from TemplateMo (Free - Commercial Use Allowed):**

| # | Template | Source | Style | Key Features |
|---|----------|--------|-------|--------------|
| 1 | **Mini Profile** | [tm-530](https://templatemo.com/tm-530-mini-profile) | Minimal | Bootstrap parallax, one-page, clean |
| 2 | **Nexaverse** | [tm-603](https://templatemo.com/tm-603-nexaverse) | Dark Glassmorphism | Modern glass effects, agency style |
| 3 | **Personal Shape** | [tm-593](https://templatemo.com/tm-593-personal-shape) | Gradient | Beautiful homepage gradient, stylish |
| 4 | **Glossy Touch** | [tm-592](https://templatemo.com/tm-592-glossy-touch) | Glassmorphism | Dark-blue gradient, modern |
| 5 | **Verticard** | [tm-533](https://templatemo.com/tm-533-flavor) | Minimal Gallery | Visual portfolios, gallery features |
| 6 | **Reflux** | [tm-531](https://templatemo.com/tm-531-flavor) | Sticky Sidebar | Detailed profiles, scrolling |
| 7 | **Elegance** | [tm-528](https://templatemo.com/tm-528-elegance) | Video Background | Blue gradient, carousel sections |
| 8 | **First Portfolio** | [tm-578](https://templatemo.com/tm-578-first-portfolio) | Colorful | Green/purple/white, one-page |

**Additional Options:**
- Prism Flux (600) - Dark carbon fiber with prismatic colors
- Sleeky Pro (598) - For photographers/creatives
- Vanilla (526) - Ocean blue, fixed sidebar

---

### Phase 1.5: Extract Designs from TemplateMo Templates

#### Download & Analyze Templates
```bash
# Download each template ZIP from templatemo.com
# Extract and analyze:
# - CSS variables and color schemes
# - Font families used
# - Layout structure (sidebar, grid, timeline)
# - Card/section styles
# - Animation effects
```

#### Extraction Process for Each Template

**Step 1:** Download ZIP and extract
**Step 2:** Analyze `css/` folder for:
- Primary/secondary/accent colors
- Background colors and gradients
- Font stacks
- Border radius values
- Shadow definitions
- Spacing patterns

**Step 3:** Analyze `index.html` for:
- Section structure
- Layout type (sidebar, full-width, cards)
- Component patterns

**Step 4:** Convert to JSON config:
```json
{
  "source": "templatemo-530-mini-profile",
  "name": "Mini Profile",
  "thumbnail": "/templates/mini-profile.png",
  "global": {
    "primaryColor": "#extracted-color",
    "fontFamily": "extracted-font",
    ...
  },
  "sections": { ... }
}
```

#### Template Storage Structure
```
frontend/public/templates/
├── mini-profile/
│   ├── thumbnail.png
│   ├── preview-home.png
│   ├── preview-career.png
│   └── config.json
├── nexaverse/
│   └── ...
└── glossy-touch/
    └── ...
```

---

### Phase 2: Frontend - Onboarding Template Selection

#### 2.1 Template Selection Step (Onboarding)
**File:** `frontend/src/components/admin/Onboarding/TemplateSelection.js`

Features:
- Full-screen template gallery (shown after CV upload)
- Large template cards with preview thumbnails
- Hover to see section previews (Education, Career, etc.)
- "Select This Template" button
- Progress indicator: CV Upload → **Template** → Dashboard

#### 2.2 Template Preview Cards
**File:** `frontend/src/components/admin/Onboarding/TemplateCard.js`

Features:
- Template thumbnail (main preview image)
- Template name and style tag
- Hover effect showing mini-previews of sections
- Selection highlight state

#### 2.3 Update Onboarding Flow
**File:** `frontend/src/components/admin/Onboarding/CVUpload.js`

After CV upload success:
```javascript
// Instead of going to dashboard directly
navigate('/onboarding/select-template');
```

#### 2.4 Add Route
**File:** `frontend/src/App.js`

```javascript
<Route path="/onboarding/select-template" element={<TemplateSelection />} />
```

#### 2.5 Settings - Change Template Later
**File:** `frontend/src/components/admin/Settings/TemplateSettings.js`

- Allow users to change template from Settings page
- Show current template with "Change" button
- Same gallery UI as onboarding

---

### Phase 3: Template + AI Design Integration

#### 3.1 AI Generates Variations Based on Template
**File:** `backend/ai/views.py`

Modify `generate_designs()` to accept template context:

```python
def generate_designs(request):
    context = request.data.get('context')  # career, education, etc.
    template_id = request.data.get('template_id')  # user's selected template

    # Get template's base config
    template = DesignTemplate.objects.get(id=template_id)
    base_config = template.config.get(context, {})

    # Generate AI variations that complement template style
    designs = []
    for i in range(5):
        design = {
            **base_config,  # Start with template values
            # AI variations on colors (within same palette family)
            'accentColor': vary_color(base_config['accentColor']),
            'cardStyle': random.choice(['elevated', 'flat', 'bordered', 'glassmorphism']),
            'layoutType': random.choice(get_compatible_layouts(context)),
            # Keep template's core identity
            'fontFamily': base_config['fontFamily'],
            'backgroundColor': base_config['backgroundColor'],
        }
        designs.append(design)

    return Response({'designs': designs})
```

#### 3.2 Update PreviewContext
**File:** `frontend/src/components/admin/PreviewContext.js`

```javascript
const [selectedTemplate, setSelectedTemplate] = useState(null);

// Load user's template on mount
useEffect(() => {
  const loadTemplate = async () => {
    const res = await api.get('/api/user/template/');
    setSelectedTemplate(res.data.template);
  };
  loadTemplate();
}, []);

// When generating AI designs, pass template context
const generateAiDesigns = async (section) => {
  const res = await api.post('/api/ai/generate-designs/', {
    context: section,
    template_id: selectedTemplate?.id
  });
  // AI designs are already based on template
  setAiDesigns(section, res.data.designs);
};
```

#### 3.3 Design Hierarchy
```
Template Base (from TemplateMo)
     │
     ▼
AI Variations (generated based on template style)
     │
     ▼
User Customizations (manual overrides)
```

#### 3.4 Section Design Settings UI
Each section's design panel shows:
- **Template Base** - "From: Mini Profile" (read-only info)
- **AI Options** - 5 design cards to choose from
- **Customize** - Color pickers, font selectors (override AI/template)
- **Reset** - "Reset to Template Default" button

---

### Phase 4: Customization Layer

#### 4.1 Per-Section Customization
Each section's design settings should allow:
- Override any template value
- Save as user customization (not modifying template)
- Visual indicator showing "customized" vs "from template"

#### 4.2 Global Customization Panel
**File:** `frontend/src/components/admin/Templates/GlobalCustomizer.js`

Features:
- Override global colors (applies to all sections)
- Override global fonts
- Reset individual sections to template defaults
- Reset all to template defaults

#### 4.3 Save/Load Customizations
- Auto-save customizations to `UserSelectedTemplate.customizations`
- Load customizations on dashboard mount
- Export/import customization JSON

---

### Phase 5: Integration with Existing Components

#### 5.1 Update Public Components
Files to update:
- `Home.js` - Apply merged design
- `Education.js` - Apply merged design + layout
- `CareerTimeline.js` - Apply merged design + layout
- `Profile.js` - Apply merged design
- `ResumeHTMLRenderer.js` - Apply merged design
- `AwardsSection.js` - Apply merged design

#### 5.2 Update Admin Components
Files to update:
- `DesignSettings.js` - Show template source
- `EducationDesignSettings.js` - Show template source
- `CareerPreview.js` - Use merged design
- All preview components

---

## Template Config Structure

```json
{
  "id": 1,
  "name": "Mini Profile",
  "slug": "mini-profile",
  "source": "templatemo-530",
  "thumbnail": "/templates/mini-profile/thumbnail.png",
  "previews": {
    "profile": "/templates/mini-profile/preview-profile.png",
    "education": "/templates/mini-profile/preview-education.png",
    "career": "/templates/mini-profile/preview-career.png"
  },
  "global": {
    "primaryColor": "#2563eb",
    "accentColor": "#3b82f6",
    "backgroundColor": "#ffffff",
    "textColor": "#1f2937",
    "fontFamily": "Inter",
    "borderRadius": 8
  },
  "profile": {
    "layoutType": "horizontal",
    "cardStyle": "elevated",
    "imageStyle": "circle",
    "showBio": true
  },
  "education": {
    "layoutType": "cards",
    "cardStyle": "elevated",
    "accentColor": "#2563eb",
    "showYear": true
  },
  "career": {
    "layoutType": "timeline",
    "cardStyle": "bordered",
    "accentColor": "#2563eb",
    "lineStyle": "solid"
  },
  "resume": {
    "template": "professional",
    "sidebarColor": "#1f2937",
    "accentColor": "#2563eb"
  },
  "awards": {
    "layoutType": "grid",
    "cardStyle": "flat",
    "showIcon": true
  },
  "skills": {
    "layoutType": "cards",
    "showProficiency": true,
    "showCategory": true,
    "barStyle": "rounded"
  }
}
```

**Note:** No `home` section - Home page uses existing design system independently.

---

## File Structure (New Files)

```
backend/
├── templates_design/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── serializers.py
│   ├── urls.py
│   ├── views.py
│   └── management/
│       └── commands/
│           └── seed_templates.py

frontend/
├── public/templates/              # Template assets
│   ├── mini-profile/
│   │   ├── thumbnail.png
│   │   ├── preview-profile.png
│   │   ├── preview-education.png
│   │   └── preview-career.png
│   ├── nexaverse/
│   └── glossy-touch/
│
├── src/components/admin/
│   ├── Onboarding/
│   │   ├── CVUpload.js           # (existing - update)
│   │   ├── TemplateSelection.js  # NEW - template picker step
│   │   └── TemplateCard.js       # NEW - template card component
│   │
│   └── Settings/
│       └── TemplateSettings.js   # NEW - change template later
```

---

## Database Migrations

1. Create new `templates_design` app
2. Run `python manage.py makemigrations templates_design`
3. Run `python manage.py migrate`
4. Run `python manage.py seed_templates`

---

## UI/UX Flow

### Onboarding (New User)
```
Register → Login
    │
    ▼
Upload Resume (CVUpload.js)
    │
    ├── AI parses CV → extracts Education, Career, Skills
    │
    ▼
Select Template (/onboarding/select-template) ← NEW STEP
    │
    ├── Show 8 template cards
    ├── Hover for section previews
    ├── Click to select
    │
    ▼
Dashboard (template applied to all sections)
    │
    ├── Each section shows AI design variations
    └── User can customize further
```

### Existing User (Change Template)
```
Dashboard → Settings
    │
    ├── Current Template: "Mini Profile"
    ├── [Change Template] button
    │
    ▼
Template Gallery (same as onboarding)
    │
    ▼
Confirm → All sections update to new template
```

### Section Design Flow
```
Profile/Education/Career/etc.
    │
    └── Design Settings Panel
            │
            ├── "Template: Mini Profile" (info badge)
            ├── AI Variations (5 cards)
            ├── [Apply] selected variation
            ├── [Customize] manual overrides
            └── [Reset to Template]
```

---

## Priority Order

### Part A: Design Templates (10-11 days)

| Phase | Task | Duration |
|-------|------|----------|
| **1** | Download TemplateMo templates, extract designs | 1 day |
| **1.5** | Create template JSON configs & thumbnails | 1 day |
| **2** | Backend models & API endpoints | 2 days |
| **3** | Onboarding template selection UI | 2 days |
| **4** | Update AI design generation (template-aware) | 1 day |
| **5** | Update section components to use template | 2 days |
| **6** | Settings page - change template | 1 day |
| **7** | Testing & polish | 1 day |

### Part B: Custom Sections (8-10 days)

| Phase | Task | Duration |
|-------|------|----------|
| **8** | Backend: SectionType, UserSection, SectionEntry models | 2 days |
| **9** | Backend: API endpoints for custom sections | 1 day |
| **10** | Frontend: Section manager UI (add/remove sections) | 2 days |
| **11** | Frontend: Dynamic entry forms | 2 days |
| **12** | Resume integration (include custom sections) | 1 day |
| **13** | Public page: dynamic routes + navigation | 1 day |
| **14** | AI designs for custom sections | 1 day |

**Total Estimated Time:** 18-21 days

### Recommended Approach
1. **MVP:** Start with templates only (Part A)
2. **Phase 2:** Add custom sections (Part B)

Or implement together if time permits.

---

## Section Ownership

| Section | Controlled By | Notes |
|---------|---------------|-------|
| **Home** | Existing system | Untouched - user's custom design |
| **Profile** | Template + AI | Template base → AI variations |
| **Education** | Template + AI | Template base → AI variations |
| **Career** | Template + AI | Template base → AI variations |
| **Resume** | Template + AI | Template base → AI variations |
| **Awards** | Template + AI | Template base → AI variations |
| **Skills** | Template + AI | Template base → AI variations |
| **Custom Sections** | Template + AI | User-created sections (see below) |
| **Blog** | Existing system | Keep current styling |

---

## Dynamic Custom Sections Feature

### Overview
Allow users to create custom sections (Certifications, Projects, Publications, etc.) that appear in both their **Resume** and **Public Profile**.

### Predefined Section Types (Quick Add)

| Section Type | Icon | Fields | Resume Placement |
|--------------|------|--------|------------------|
| **Certifications** | 🏆 | Name, Issuer, Date, Credential ID, URL | After Skills |
| **Projects** | 💼 | Name, Description, Technologies, URL, Image | After Career |
| **Publications** | 📄 | Title, Publisher, Date, URL, Co-authors | After Education |
| **Services** | 🛠️ | Service Name, Description, Price/Rate, Duration, Image | Public only (not resume) |
| **Volunteer** | 🤝 | Organization, Role, Duration, Description | After Career |
| **Languages** | 🌐 | Language, Proficiency Level | In Skills section |
| **Courses** | 📚 | Course Name, Platform, Completion Date, Certificate URL | After Education |
| **Testimonials** | 💬 | Client Name, Company, Quote, Rating, Image | Public only |
| **Interests** | ⭐ | Interest Name, Description | End of Resume |
| **References** | 👥 | Name, Title, Company, Contact | End of Resume |
| **Custom** | ➕ | User defines fields | User chooses |

### Section Visibility Options

Some sections make sense only on public page (not resume):

| Section | Resume | Public Page | Notes |
|---------|--------|-------------|-------|
| Certifications | ✅ | ✅ | Both |
| Projects | ✅ | ✅ | Both |
| **Services** | ❌ | ✅ | Public only - for freelancers |
| **Testimonials** | ❌ | ✅ | Public only - client quotes |
| Publications | ✅ | ✅ | Both |
| Volunteer | ✅ | ✅ | Both |

User can toggle visibility for each section independently.

### Data Model

```python
# backend/custom_sections/models.py

class SectionType(models.Model):
    """Predefined or user-created section types"""
    name = models.CharField(max_length=100)  # "Certifications"
    slug = models.SlugField()  # "certifications"
    icon = models.CharField(max_length=50)  # "certificate" or emoji
    is_system = models.BooleanField(default=False)  # True for predefined
    fields_schema = models.JSONField()  # Defines what fields this section has
    # Example fields_schema:
    # [
    #   {"name": "title", "type": "text", "required": true},
    #   {"name": "issuer", "type": "text", "required": true},
    #   {"name": "date", "type": "date", "required": false},
    #   {"name": "credential_url", "type": "url", "required": false}
    # ]

class UserSection(models.Model):
    """User's instance of a section type"""
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    section_type = models.ForeignKey(SectionType, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)  # Display title
    order = models.IntegerField(default=0)  # Order on public page
    show_on_resume = models.BooleanField(default=True)
    show_on_public = models.BooleanField(default=True)
    resume_placement = models.CharField(max_length=50)  # after_skills, after_career, etc.
    design_config = models.JSONField(default=dict)  # Section-specific design

class SectionEntry(models.Model):
    """Individual entries within a user section"""
    section = models.ForeignKey(UserSection, on_delete=models.CASCADE, related_name='entries')
    data = models.JSONField()  # Flexible data based on section_type.fields_schema
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    # Example data for Certification:
    # {
    #   "title": "AWS Solutions Architect",
    #   "issuer": "Amazon Web Services",
    #   "date": "2024-01",
    #   "credential_url": "https://..."
    # }
```

### API Endpoints

```
GET    /api/section-types/              # List available section types
POST   /api/section-types/              # Create custom section type

GET    /api/user-sections/              # List user's sections
POST   /api/user-sections/              # Add a section to profile
PATCH  /api/user-sections/<id>/         # Update section settings
DELETE /api/user-sections/<id>/         # Remove section

GET    /api/user-sections/<id>/entries/ # List entries in a section
POST   /api/user-sections/<id>/entries/ # Add entry
PATCH  /api/user-sections/<id>/entries/<entry_id>/
DELETE /api/user-sections/<id>/entries/<entry_id>/
```

### Frontend Components

```
frontend/src/components/
├── admin/
│   ├── CustomSections/
│   │   ├── SectionManager.js       # Add/remove/reorder sections
│   │   ├── SectionEditor.js        # Edit entries in a section
│   │   ├── SectionTypeSelector.js  # Choose from predefined or create custom
│   │   ├── DynamicEntryForm.js     # Form generated from fields_schema
│   │   └── SectionDesignSettings.js
│   │
│   └── Resume/
│       └── AdminResume.js          # Update to include custom sections
│
├── Public/
│   ├── DynamicSection.js           # Renders any custom section
│   └── Resume/
│       └── ResumeHTMLRenderer.js   # Update to include custom sections
```

### Resume Integration

Custom sections automatically appear in resume based on `resume_placement`:

```javascript
// Resume section order with custom sections
const resumeSections = [
  'profile',           // Always first
  'career',
  ...userSections.filter(s => s.resume_placement === 'after_career'),  // Projects, Volunteer
  'education',
  ...userSections.filter(s => s.resume_placement === 'after_education'),  // Publications
  'skills',
  ...userSections.filter(s => s.resume_placement === 'after_skills'),  // Certifications
  'awards',
  ...userSections.filter(s => s.resume_placement === 'end'),  // Interests, References
];
```

### Public Page Integration

Custom sections get their own routes:

```javascript
// App.js - Dynamic routes for custom sections
{userSections.map(section => (
  <Route
    key={section.slug}
    path={`/${section.slug}`}  // /certifications, /projects
    element={<DynamicSection sectionId={section.id} />}
  />
))}
```

Navigation automatically includes custom sections:
```javascript
// NavBar.js
const navItems = [
  { path: '/', label: 'Home' },
  { path: '/profile', label: 'Profile' },
  { path: '/education', label: 'Education' },
  { path: '/career', label: 'Career' },
  // Dynamic sections inserted here based on user config
  ...userSections.map(s => ({ path: `/${s.slug}`, label: s.title })),
  { path: '/resume', label: 'Resume' },
  { path: '/contact', label: 'Contact' },
];
```

### Template Support for Custom Sections

Templates provide a "generic" section style that applies to all custom sections:

```json
{
  "name": "Mini Profile",
  "sections": {
    "profile": { ... },
    "education": { ... },
    "career": { ... },
    "generic": {
      "layoutType": "cards",
      "cardStyle": "elevated",
      "accentColor": "#2563eb",
      "backgroundColor": "#ffffff",
      "textColor": "#1f2937"
    }
  }
}
```

AI generates designs for custom sections using the "generic" base:
```python
def generate_designs_for_section(section_type, template):
    base = template.config.get('generic', {})
    # Generate 5 variations based on generic style
    return generate_variations(base)
```

### UI Flow - Adding a Custom Section

```
Dashboard → Add Section (+ button)
    │
    ▼
Section Type Selector
    │
    ├── Predefined: Certifications, Projects, Publications...
    │       │
    │       └── Select → Section created with default fields
    │
    └── Custom: "Create Your Own"
            │
            ├── Enter section name
            ├── Define fields (add/remove)
            │   ├── Field name
            │   ├── Field type (text, date, url, image, textarea)
            │   └── Required?
            │
            └── Save → Section created
    │
    ▼
Section appears in sidebar → Add entries
    │
    ▼
Toggle: Show on Resume? Show on Public Page?
```

---

## Notes

- Keep backward compatibility - existing users without a template should continue working
- Templates should be immutable - users customize on top, never modify the template itself
- Consider adding template versioning for future updates
- Premium templates could be a monetization option
- Home page is excluded because users may have already customized it

## TemplateMo License & Attribution

**License:** Free for commercial and non-commercial use
**Attribution:** Optional but appreciated - add link to templatemo.com in footer
**Terms:** Can download, edit, and use freely

```html
<!-- Optional attribution in footer -->
<small>Design inspired by <a href="https://templatemo.com" target="_blank">TemplateMo</a></small>
```

## Quick Start - First Template (Mini Profile)

1. Download from https://templatemo.com/tm-530-mini-profile
2. Extract and analyze CSS/HTML
3. Create `mini-profile/config.json` with extracted values
4. Take screenshots for thumbnails
5. Test with existing React components
6. Adjust component styles to match template

---

*Created: 2026-03-22*
