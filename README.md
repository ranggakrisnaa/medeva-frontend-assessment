# Frontend - Medeva Assessment

Frontend application untuk sistem manajemen karyawan dan tenaga kesehatan yang dibangun dengan React, TypeScript, dan Vite.

## Tech Stack

- **React 18** - Library UI
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **React Router DOM v7** - Routing
- **TanStack Query v5** - Data fetching & caching
- **React Hook Form** - Form management
- **Yup** - Form validation
- **Axios** - HTTP client
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - UI components
- **Sonner** - Toast notifications
- **Lucide React** - Icons
- **react-infinite-scroll-component** - Infinite scroll

## Prerequisites

- Node.js >= 18
- pnpm >= 8

## Installation

```bash
# Install dependencies
pnpm install
```

## Environment Variables

Buat file `.env` di root folder frontend:

```env
VITE_API_URL=http://localhost:3000/api
```

## Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Lint code
pnpm lint
```

Development server akan berjalan di `http://localhost:5173`

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   ├── ui/         # shadcn/ui components
│   │   └── layout/     # Layout components (Sidebar, MobileNav, etc)
│   ├── hooks/          # Custom hooks
│   │   ├── useApi.ts   # React Query hooks
│   │   ├── useAuth.ts  # Authentication hooks
│   │   └── useDebounce.ts # Debounce hook
│   ├── lib/            # Utilities
│   │   ├── axios.ts    # Axios instance with interceptors
│   │   ├── utils.ts    # Helper functions
│   │   └── validations.ts # Yup schemas
│   ├── pages/          # Page components
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── DepartmentListPage.tsx
│   │   ├── DepartmentFormPage.tsx
│   │   ├── EmployeeListPage.tsx
│   │   └── EmployeeFormPage.tsx
│   ├── services/       # API services
│   │   └── api.service.ts
│   ├── App.tsx         # Root component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── .env                # Environment variables
├── package.json
├── tsconfig.json       # TypeScript config
├── vite.config.ts      # Vite config
└── tailwind.config.js  # Tailwind config
```

## Features

### Authentication

- Login dengan email & password
- JWT token management
- Auto redirect jika tidak terautentikasi
- Role-based access control (ADMIN, MANAGER, USER)

### Dashboard

- Statistik total karyawan, departemen, dan posisi
- Chart dengan Chart.js
- Role-based data visibility

### Department Management

- CRUD departemen
- Search & pagination
- Role-based access (ADMIN only)

### Employee Management

- CRUD karyawan
- Advanced filtering:
  - Search by name/NIK/phone (debounced)
  - Filter by department (infinite scroll dropdown)
  - Filter by status (Active/Inactive)
- Pagination dengan custom limit (5, 10, 25, 50, 100)
- URL params untuk shareable links
- Infinite scroll pada dropdown department & position
- Toast notifications
- Delete confirmation dialog
- Status toggle (Active/Inactive)
- Role-based access:
  - ADMIN: Full access (create, read, update, delete)
  - MANAGER: Read, create, update
  - USER: Read only

## Component Architecture

### Custom Hooks

**useApi.ts**

```typescript
- useCurrentUser() - Get current user data
- useDepartments() - Fetch departments with pagination
- usePositions() - Fetch positions by department
- useEmployees() - Fetch employees with filters
- useCreateEmployee() - Create employee mutation
- useUpdateEmployee() - Update employee mutation
- useDeleteEmployee() - Delete employee mutation
```

**useAuth.ts**

```typescript
- useAuth() - Login mutation
- useCurrentUser() - Get current user from token
```

**useDebounce.ts**

```typescript
- useDebounce(value, delay) - Debounce input values
```

### Reusable Components

**InfiniteScrollDropdown**

- Custom dropdown dengan infinite scroll
- Digunakan untuk department & position selection
- Props: value, onValueChange, items, displayField, valueField, onLoadMore, hasMore, isLoading

### UI Components (shadcn/ui)

- Button
- Input
- Card
- Badge
- Select
- Dialog
- Alert
- Pagination
- Dropdown Menu
- Sheet (Mobile Nav)

## State Management

- **React Query** - Server state (caching, invalidation)
- **React Hook Form** - Form state
- **URL Search Params** - Filter & pagination state (shareable)
- **Local State (useState)** - UI state

## API Integration

Semua API calls menggunakan Axios instance dengan:

- Base URL dari environment variable
- Request interceptor untuk JWT token
- Response interceptor untuk error handling
- Auto redirect ke login jika 401

## Form Validation

Menggunakan Yup schemas:

- **employeeCreateSchema** - Validasi create employee (password required)
- **employeeEditSchema** - Validasi edit employee (password optional)
- **loginSchema** - Validasi login
- **departmentSchema** - Validasi department

## Styling

- **Tailwind CSS v4** - Utility-first CSS
- **shadcn/ui** - Consistent design system
- Responsive design (mobile-first)
- Dark mode ready (not implemented yet)

## Performance Optimizations

- Code splitting dengan React Router lazy loading
- React Query caching & background refetching
- Debounced search input (500ms)
- Infinite scroll untuk dropdown (load on demand)
- Optimistic updates pada mutations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create feature branch
2. Make changes
3. Run linting: `pnpm lint`
4. Build untuk check errors: `pnpm build`
5. Submit PR

## License

Proprietary - Medeva Assessment
