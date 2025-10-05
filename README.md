# Contact Details CRM

A modern, dynamic Contact Relationship Management (CRM) application built with Angular 15. This application provides a comprehensive interface for managing contact information with dynamic layouts, form generation, and real-time data management.

## 🚀 How to Run the App

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- Angular CLI (v15.2.11)

### Installation & Setup
```bash
# Clone the repository
git clone <repository-url>
cd contact-details-crm

# Install dependencies
npm install

# Start development server
npm start
# OR
ng serve

# Open browser and navigate to
http://localhost:4200
```

### Available Scripts
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run unit tests
npm run lint       # Run ESLint
ng generate        # Generate new components/services
```

## 🛠️ Tech Stack

### Core Technologies
- **Angular 15.2.11** - Frontend framework with standalone components
- **TypeScript 4.9** - Type-safe JavaScript superset
- **RxJS 7.5** - Reactive programming with observables
- **SCSS** - Enhanced CSS with variables and mixins

### Angular Features Used
- **Standalone Components** - Modern component architecture without NgModules
- **OnPush Change Detection** - Optimized performance strategy
- **Reactive Forms** - Dynamic form generation and validation
- **HTTP Interceptors** - Mock API simulation and caching
- **Services with Dependency Injection** - Clean architecture patterns

### Development Tools
- **Angular CLI** - Project scaffolding and build tools
- **ESLint** - Code quality and style enforcement
- **Karma + Jasmine** - Unit testing framework

## 📁 Folder Structure

```
src/
├── app/
│   ├── components/
│   │   └── ui/
│   │       ├── contact-details/     # Main contact management interface
│   │       ├── conversations/       # Chat/conversation display
│   │       ├── field-row/          # Individual form field renderer
│   │       ├── folder-card/        # Collapsible form sections
│   │       ├── notes/              # Notes management
│   │       └── tasks/              # Task management
│   ├── interceptors/
│   │   ├── cache.interceptor.ts    # HTTP response caching
│   │   └── mock-api.interceptor.ts # Development API simulation
│   ├── services/
│   │   ├── activities.service.ts   # Activity data management
│   │   ├── contacts.service.ts     # Contact CRUD operations
│   │   ├── layout.service.ts       # Dynamic layout management
│   │   └── schema.service.ts       # Form schema configuration
│   ├── app-routing.module.ts       # Application routing
│   ├── app.component.ts           # Root application component
│   ├── app.module.ts              # Main application module
│   └── models.ts                  # TypeScript interfaces and types
├── assets/
│   ├── contactData.json           # Mock contact data
│   └── contactField.json          # Form field schema configuration
├── styles.scss                    # Global application styles
└── main.ts                        # Application bootstrap
```

### Component Architecture
```
AppComponent (Root)
├── ContactDetailsComponent (Main Interface)
│   ├── FolderCardComponent (Form Sections)
│   │   └── FieldRowComponent (Individual Fields)
│   ├── ConversationsComponent
│   ├── NotesComponent
│   └── TasksComponent
```

## 📊 JSON Configuration Usage

### 1. `contactData.json` - Contact Database
**Location**: `src/assets/contactData.json`

**Purpose**: Mock database containing sample contact records

**Structure**:
```json
[
  {
    "firstName": "Devon",
    "lastName": "Lane",
    "phone": "+1 (555) 000-0000",
    "email": "devon@example.com",
    "address": "123 Main St, Anytown, AT 12345",
    "businessName": "Acme Corp",
    "streetAddress": "456 Business Ave",
    "city": "Business City",
    "country": "United States",
    "owner": "Devon Lane",
    "followers": ["A", "B"],
    "tags": ["client", "priority"]
  }
]
```

**Usage**:
- Loaded by `ContactsService` via HTTP interceptor
- Provides sample data for development and testing
- Supports full CRUD operations (Create, Read, Update, Delete)
- Simulates real API responses with 150ms latency

### 2. `contactField.json` - Form Schema Configuration
**Location**: `src/assets/contactField.json`

**Purpose**: Defines dynamic form structure and field types

**Structure**:
```json
{
  "folders": [
    {
      "name": "Contact",
      "icon": "user",
      "fields": [
        {
          "key": "firstName",
          "label": "First Name",
          "type": "string"
        }
      ]
    }
  ]
}
```

**Field Types Supported**:
- `string` - Single-line text input
- `string-multiline` - Multi-line textarea
- `phone` - Phone number with tel: linking
- `email` - Email with mailto: linking
- `radio` - Single selection dropdown
- `multi-select` - Multiple selection checkboxes

**Usage**:
- Loaded by `SchemaService` to generate dynamic forms
- Drives `FolderCardComponent` rendering
- Supports field filtering and search
- Enables form validation and type-specific inputs
- Controls field visibility (hidden fields excluded from UI)

## 🎨 Dynamic Layout System

The application supports 6 different layout configurations:

### Layout Options
1. **default** - Contact details on left, conversations/notes/tasks on right
2. **alt** - Conversations on left, contact details/notes/tasks on right
3. **opt3** - Contact details in middle column
4. **opt4** - Contact details in middle, conversations left, notes/tasks right
5. **opt5** - Contact details on right, conversations/notes/tasks on left
6. **opt6** - Full-width layout with contact details spanning multiple columns

### Implementation
- Managed by `LayoutService` with reactive state management
- Dynamic component positioning using Angular's structural directives
- Responsive design adapting to different screen sizes
- Layout state persisted across navigation

## ✨ Key Features

### 🔧 Dynamic Form Generation
- Schema-driven form creation from JSON configuration
- Support for multiple field types with validation
- Real-time field filtering and search
- Conditional field rendering

### 📝 Contact Management
- **Add Mode**: Create new contacts with empty form fields
- **Individual Field Editing**: Click edit icons on phone/email fields for quick updates
- **Navigation**: Previous/next contact browsing with circular navigation
- **Real-time Updates**: Automatic UI refresh when data changes

### 🎯 Advanced UI Features
- **Collapsible Sections**: Organize fields into logical folders
- **Search & Filter**: Real-time field filtering across all sections
- **Responsive Design**: Mobile-friendly interface
- **Optimized Performance**: OnPush change detection strategy

### 🔄 Mock API System
- HTTP interceptor simulating real API behavior
- Realistic response delays and error handling
- Support for GET, POST, PUT, DELETE operations
- Automatic data persistence during development

## 🐛 Known Issues

### Performance Considerations
1. **Search Optimization**: No debouncing on search input (immediate filtering)
2. **Tag Deletion**: Tags are not getting deleted

### Browser Compatibility
- **Tested**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Known Issues**: IE 11 not supported (Angular 15 requirement)



## 🔧 Development Guidelines

### Code Style
- Follow Angular style guide conventions
- Use OnPush change detection for all components
- Implement comprehensive TypeScript interfaces
- Document all public methods and complex logic

### Testing Strategy
- Unit tests for all services and components
- Integration tests for critical user workflows
- E2E tests for complete user journeys
- Mock data for consistent test environments

### Performance Best Practices
- Lazy loading for large datasets
- TrackBy functions for ngFor loops
- Reactive programming patterns with RxJS
- Efficient change detection strategies

---

