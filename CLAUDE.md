# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server (runs on port 4444)
npm run dev

# Production build and start
npm run build
npm start

# Quality assurance
npm run lint          # ESLint checks
npm run lint:fix      # Fix ESLint issues automatically  
npm run type-check    # TypeScript compilation check

# Testing (80% coverage threshold enforced)
npm run test          # Run all tests
npm run test:watch    # Watch mode for development
npm run test:coverage # Run with coverage report

# Install dependencies (use legacy peer deps flag)
npm install --legacy-peer-deps
```

## Architecture Overview

### Tech Stack
- **Next.js 15** with App Router and React 19
- **TypeScript** with strict functional programming rules
- **Tailwind CSS v4** with comprehensive custom design system
- **Zod** for schema validation and runtime type checking
- **JWT Authentication** with dual storage (cookies + localStorage)

### Authentication System
The app uses a custom JWT-based authentication system built with React Context:

- **AuthContext** (`src/lib/contexts/AuthContext.tsx`) manages global auth state using useReducer
- **Dual token storage**: HTTP-only cookies (primary) + localStorage (fallback)
- **Global logout mechanism**: Automatic logout on token expiration via `setGlobalLogoutCallback()`
- **Session persistence**: Handles SSR/hydration properly with client-side token restoration

### API Layer Architecture
Uses functional programming patterns with Result types for consistent error handling:

```typescript
// All API calls return Result<T, E> - never throw exceptions
const result = await sitesApi.getAll();
matchResult(result, {
  success: (sites) => setSites(sites),
  error: (error) => toast.error(error.message)
});
```

Key utilities in `src/lib/api.ts`:
- `Result<T, E>` type for functional error handling
- `matchResult`, `mapResult`, `flatMapResult` for result composition
- Automatic JWT token injection and global logout on 401 responses

### State Management Strategy
- **Authentication**: React Context + useReducer pattern
- **API data**: Custom hooks with optimistic updates (e.g., `useSites`, `useProducts`)
- **Forms**: Local useState with Zod validation
- **No external state library** - pure React patterns throughout

### Functional Programming Principles
Enforced by ESLint configuration:

1. **Arrow functions only** - no function declarations
2. **No `any` types** - strict TypeScript throughout
3. **Immutable updates** - never mutate state directly
4. **Pure functions** - side effects clearly separated
5. **Result type pattern** - functional error handling vs exceptions
- Always use functional programming principles
- **Always defer to functional programming principles**:
  - When using TypeScript, create strong types and avoid using "any"
  - Avoid type assertions where possible
  - Avoid using bang operators or `?` to indicate something might be undefined; instead, handle the undefined case
  - Avoid using classes where possible
  - Opt for functional pipelines
  - Do not default to using events in props when a callback would work

### Code Organization
```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Route group for login/register
│   ├── dashboard/         # Protected dashboard pages
│   └── api/               # API routes (currently empty - backend is external)
├── components/            # Reusable UI components
│   ├── forms/             # Form-specific components
│   └── ui/                # Base UI components  
├── lib/                   # Business logic and utilities
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks for data fetching
│   ├── api.ts             # API layer with functional patterns
│   ├── constants.ts       # App-wide constants and navigation
│   └── validators.ts      # Zod schemas for validation
└── types/                 # TypeScript type definitions
```

### Testing Requirements
- **80% coverage threshold** enforced for branches, functions, lines, statements
- **Jest + React Testing Library** for component testing
- **Test location**: `__tests__` directories alongside source files
- **Mocking**: Next.js navigation and js-cookie pre-configured in jest.setup.js

### Styling System
- **Tailwind CSS v4** with extensive custom CSS architecture
- **Design system**: Comprehensive CSS custom properties for theming
- **Mobile-first responsive design** with collapsible sidebar
- **Consistent naming**: `lh-*` prefix for custom classes
- **Dark theme** with Lighthouse brand colors

### Environment Variables
```bash
NEXT_PUBLIC_API_URL=https://api.lighthousestudios.xyz  # Backend API URL
NEXTAUTH_SECRET=your-secure-random-string       # JWT secret
```

### Key Development Patterns

**Custom Hooks for Data Fetching:**
```typescript
// Pattern: Custom hooks encapsulate API calls and state management
export const useSites = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const createSite = async (data: CreateSiteRequest) => {
    // Optimistic update
    const tempSite = { ...data, id: 'temp' };
    setSites(prev => [...prev, tempSite]);
    
    const result = await sitesApi.create(data);
    matchResult(result, {
      success: (newSite) => setSites(prev => 
        prev.map(s => s.id === 'temp' ? newSite : s)
      ),
      error: () => setSites(prev => 
        prev.filter(s => s.id !== 'temp')
      )
    });
  };
}
```

**Form Validation with Zod:**
```typescript
// All forms use Zod schemas for validation
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

type LoginFormData = z.infer<typeof loginSchema>;
```

**Logout Handling:**
When implementing logout functionality, ensure redirects use `window.location.href = '/login'` rather than Next.js router to fully clear authentication state and prevent hydration issues.
```