# Lighthouse Dashboard

A modern dashboard for managing WordPress plugins and AI-powered features. Built with Next.js 15, TypeScript, and Tailwind CSS following functional programming principles.

## Features

- 🚀 **User Authentication** - Secure login/register with JWT tokens
- 🏗️ **Site Management** - CRUD operations for WordPress sites
- 🎨 **Modern UI** - Responsive design with Lighthouse brand colors
- 🔧 **Plugin Management** - Manage Neural Search and AI Readiness plugins
- 📊 **Dashboard Analytics** - Overview of sites and plugin usage
- 🧪 **Comprehensive Testing** - Unit tests with Jest and Testing Library
- 📱 **Mobile Responsive** - Works seamlessly on all devices

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lighthouse-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```bash
   NEXT_PUBLIC_API_URL=https://api.lighthousestudios.xyz
   NEXTAUTH_SECRET=your-secure-random-string
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Visit [http://localhost:4444](http://localhost:4444)

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes | `https://api.lighthousestudios.xyz` |
| `NEXTAUTH_SECRET` | JWT secret for authentication | Yes | - |
| `NODE_ENV` | Environment mode | No | `development` |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run type-check` | Run TypeScript checks |
| `npm run test` | Run Jest tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |

## Project Structure

```
lighthouse-dashboard/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── (auth)/            # Auth route group
│   │   │   ├── login/         # Login page
│   │   │   └── register/      # Register page
│   │   ├── dashboard/         # Dashboard pages
│   │   │   ├── layout.tsx     # Dashboard layout
│   │   │   ├── page.tsx       # Dashboard home
│   │   │   ├── sites/         # Site management
│   │   │   ├── billing/       # Billing (coming soon)
│   │   │   ├── diagnostics/   # Diagnostics (coming soon)
│   │   │   └── insights/      # Insights (coming soon)
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components/            # Reusable components
│   │   ├── forms/             # Form components
│   │   │   ├── TextField.tsx
│   │   │   └── PasswordField.tsx
│   │   └── ui/                # UI components
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Modal.tsx
│   │       └── ComingSoon.tsx
│   ├── lib/                   # Utilities and logic
│   │   ├── contexts/          # React contexts
│   │   │   └── AuthContext.tsx
│   │   ├── hooks/             # Custom hooks
│   │   │   ├── useAuth.ts
│   │   │   └── useSites.ts
│   │   ├── api.ts             # API utilities
│   │   ├── constants.ts       # App constants
│   │   └── validators.ts      # Zod schemas
│   └── types/                 # TypeScript types
│       └── index.ts
├── public/                    # Static assets
├── tailwind.config.ts         # Tailwind configuration
├── jest.config.js            # Jest configuration
├── eslint.config.mjs         # ESLint configuration
└── README.md                 # This file
```

## Architecture & Design Principles

### Functional Programming

This project follows functional programming principles:

- **Pure Functions**: Functions without side effects
- **Immutability**: State is never mutated directly
- **Composition**: Complex logic built from simple functions
- **Result Types**: Functional error handling with `Result<T, E>`

### Code Conventions

1. **Arrow Functions Only**
   ```typescript
   // ✅ Good
   const MyComponent: React.FC = () => <div>Hello</div>;
   
   // ❌ Avoid
   function MyComponent() { return <div>Hello</div>; }
   ```

2. **Strong TypeScript**
   ```typescript
   // ✅ Good
   interface Props { name: string; age?: number; }
   
   // ❌ Avoid
   const props: any = { name: "John" };
   ```

3. **Functional Error Handling**
   ```typescript
   // ✅ Good
   const result = await authApi.login(credentials);
   matchResult(result, {
     success: (data) => setUser(data.user),
     error: (error) => setError(error.message),
   });
   ```

4. **Component Structure**
   ```typescript
   // ✅ Good - One component per file, PascalCase names
   export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
     // Component logic
   };
   ```

### State Management

- **Authentication**: Context + useReducer
- **Forms**: Local state with validation
- **API Data**: Custom hooks with optimistic updates
- **Error Handling**: Functional Result types

## API Integration

The dashboard integrates with REST endpoints:

- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration  
- `GET /sites` - List user sites
- `POST /sites` - Create new site
- `DELETE /sites/:id` - Delete site

All API calls use the functional `Result<T, E>` type for consistent error handling.

## Testing

Tests are written using Jest and React Testing Library:

```bash
# Run all tests
npm run test

# Run with coverage (must maintain >80%)
npm run test:coverage

# Watch mode for development
npm run test:watch
```

Test files are located alongside source files in `__tests__` directories.

## Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

3. **Environment Setup**
   - Set `NEXT_PUBLIC_API_URL` to your production API
   - Set `NEXTAUTH_SECRET` to a secure random string
   - Configure any additional environment variables

## Contributing

1. Follow the established functional programming patterns
2. Maintain test coverage above 80%
3. Use TypeScript strictly (no `any` types)
4. Follow the component and file naming conventions
5. Write pure functions where possible
6. Use the Result type for error handling

## Future Roadmap

- **Billing Management** - Subscription and payment handling
- **Advanced Diagnostics** - Site performance and AI readiness checks  
- **Rich Insights** - Analytics and AI-powered recommendations
- **Plugin Marketplace** - Extended plugin ecosystem
- **Team Collaboration** - Multi-user site management

## License

Copyright © 2024 Lighthouse. All rights reserved.
