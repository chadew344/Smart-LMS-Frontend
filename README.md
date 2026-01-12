# Smart Learning Management System - Frontend

> A modern, responsive web application built with React, TypeScript, and TailwindCSS

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2+-61dafb.svg)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1+-38bdf8.svg)](https://tailwindcss.com/)
[![Redux](https://img.shields.io/badge/Redux-Toolkit-764abc.svg)](https://redux-toolkit.js.org/)

## 🚀 Live Demo

- **Frontend Application:** [smart-lms-frontend.vercel.app](https://smart-lms-frontend.vercel.app)
- **Backend API:** [smart-lms-backend.vercel.app](https://smart-lms-backend.vercel.app)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [State Management](#state-management)
- [Routing](#routing)
- [API Integration](#api-integration)
- [Deployment](#deployment)
- [Responsive Design](#responsive-design)

<a id="features"></a>

## ✨ Features

- **Modern UI/UX** - Clean, intuitive interface with smooth animations
- **Fully Responsive** - Optimized for mobile, tablet, and desktop devices
- **Type-Safe** - Complete TypeScript implementation across the application
- **State Management** - Centralized state with Redux Toolkit
- **Authentication** - Secure JWT-based authentication with auto-refresh
- **Role-Based Access** - Different UI/features based on user roles
- **Form Validation** - Client-side validation with real-time feedback
- **Error Handling** - User-friendly error messages and loading states
- **Dark Mode** - Theme switching capability
- **Advanced Feature:**
  - **Stripe Payments** - Seamless, secure checkout integration for subscriptions or one-time payments.
  - **Google OAuth** - Social login option for fast and secure authentication.
  - **PDF Generation** - Dynamic PDF creation from user data or reports for download or email.
  - **Email Notifications** - Automated transactional emails (welcome, invoices, reminders) and custom notifications.

<a id="tech-stack"></a>

## 🛠️ Tech Stack

### Core Technologies

- **Framework:** React 19.2+
- **Language:** TypeScript 5.9+
- **Build Tool:** Vite 7.2+
- **Styling:** TailwindCSS 4.1+

### State Management & Data Fetching

- **State:** Redux Toolkit
- **Async State:** Redux Toolkit Query / React Query
- **Form State:** React Hook Form

### Routing & Navigation

- **Router:** React Router v7

### HTTP & Authentication

- **HTTP Client:** Axios
- **Token Management:** JWT with auto-refresh
- **Protected Routes:** Custom auth guards

### UI Components & Icons

- **Icons:** Lucide React
- **Notifications:** Sonner
- **Modals:** Radix UI / shadcn UI

### Validation & Utilities

- **Validation:** Zod
- **Class Names:** clsx

### Development Tools

- **Linting:** ESLint
- **Formatting:** Prettier
- **Type Checking:** TypeScript Compiler

<a id="screenshots"></a>

## 📸 Screenshots

_(Only a few screenshots are shown here. More screenshots are available in the /screenshots folder.)_

### Landing Page

<img height="400px" src="/screenshots/landing-dark.png" width="700px"/>

<img height="400px" src="/screenshots/landing-light.png" width="700px"/>

### Auth Page

<img height="400px" src="/screenshots/login-light.png" width="700px"/>

<img height="400px" src="/screenshots/register-dark.png" width="700px"/>

### Course Browse Page

<img height="400px" src="/screenshots/browse-courses-dark.png" width="700px"/>

### Dashboard Page

<img height="400px" src="/screenshots/dashboard-dark.png" width="700px"/>

### Mobile View

<img height="400px" src="/screenshots/login-mobile-dark.png" width="700px"/>

<img height="400px" src="/screenshots/dashboard-mobile-dark.png" width="700px"/>

> ℹ️ Note: For more screenshots and views, check the [screenshots folder](./screenshots/).

### Authentication

![Login Screen](./screenshots/login.png)
_Login page with validation_

<a id="getting-started"></a>

## 🚦 Getting Started

### Prerequisites

- Node.js v22 or higher
- npm or yarn
- Git
- Backend API running (see backend README)

### Installation

1. **Clone the repository**

   ```bash
   https://github.com/chadew344/Smart-LMS-Frontend.git
   cd Smart-LMS-Frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Then edit `.env` with your actual values (see [Environment Variables](#environment-variables))

4. **Start development server**

   ```bash
   npm run dev
   ```

   Application will be available at `http://localhost:5173`

5. **Build for production**

   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

### Available Scripts

```bash
npm run dev          # Start development server with HMR
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
npm run format       # Format code with Prettier
```

<a id="environment-variables"></a>

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_GOOGLE_CLIENT_ID=your-google-client-id-paste-here
```

**For Production (Vercel/Netlify):**

- Add these as environment variables in your deployment platform
- Use production API URL for `VITE_API_BASE_URL`

⚠️ **Security Note:** Only variables prefixed with `VITE_` are exposed to the client. Never put sensitive secrets here.

<a id="project-structure"></a>

## 📁 Project Structure

```
frontend/
├── public
│   ├── smart-lms.svg
│   └── vite.svg
├── screenshots
├── src
│   ├── assets
│   │   ├── course-placeholder.svg
│   │   └── react.svg
│   ├── components
│   │   ├── common
│   │   │   ├── CourseCard.tsx
│   │   │   ├── NotificationBell.tsx
│   │   │   ├── ProfileDropdown.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── QuizCard.tsx
│   │   │   ├── SearchInput.tsx
│   │   │   ├── StateCard.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── UserAvatar.tsx
│   │   ├── features
│   │   │   ├── AiChat.tsx
│   │   │   ├── AppToaster.tsx
│   │   │   ├── LessonList.tsx
│   │   │   └── VideoPlayer.tsx
│   │   ├── layout
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── PublicLayout.tsx
│   │   └── ui
│   │       ├── accordion.tsx
│   │       ├── alert-dialog.tsx
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── progress.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── slider.tsx
│   │       ├── spinner.tsx
│   │       ├── tabs.tsx
│   │       └── textarea.tsx
│   ├── data
│   │   ├── lessonData.ts
│   │   └── mockData.ts
│   ├── lib
│   │   ├── error.ts
│   │   ├── navigation.ts
│   │   ├── notification.ts
│   │   ├── string.ts
│   │   └── utils.ts
│   ├── pages
│   │   ├── dashboard
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── InstructorDashboard.tsx
│   │   │   └── StudentDashboard.tsx
│   │   ├── instructor
│   │   │   └── MyCourses.tsx
│   │   ├── student
│   │       └── MyCourse.tsx
│   │   ├── Auth.tsx
│   │   ├── BrowseCourse.tsx
│   │   ├── courseDetails.tsx
│   │   ├── CreateCourse.tsx
│   │   ├── DashboardIndex.tsx
│   │   ├── ForgotPassword.tsx
│   │   ├── Landing.tsx
│   │   ├── NotFound.tsx
│   │   ├── Payment.tsx
│   │   ├── PaymentSuccess.tsx
│   │   ├── Report.tsx
│   │   └── ResetPassword.tsx
│   ├── routes
│   │   └── index.tsx
│   ├── schema
│   │   └── auth.schema.ts
│   ├── services
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── courseService.ts
│   │   ├── enrollmentService.ts
│   │   ├── paymentService.ts
│   │   └── uploadService.ts
│   ├── store
│   │   ├── hook.ts
│   │   ├── slices
│   │   │   ├── authSlice.ts
│   │   │   ├── courseSlice.ts
│   │   │   ├── enrollmentSlice.ts
│   │   │   └── themeSlice.ts
│   │   └── store.ts
│   ├── types
│   │   ├── authTypes.ts
│   │   ├── courseTypes.ts
│   │   ├── enrollmentTypes.ts
│   │   ├── index.ts
│   │   ├── themeTypes.ts
│   │   └── userTypes.ts
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env.example
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

<a id="state-management"></a>

## 🏪 State Management

### Redux Store Structure

```typescript
{
  auth: {
    user: User | null,
    accessToken: string | null,
    isAuthenticated: boolean,
    loading: boolean,
    error: string | null
  },
  [entity1]: {
    items: Entity1[],
    currentItem: Entity1 | null,
    loading: boolean,
    error: string | null,
    pagination: {
      page: number,
      limit: number,
      total: number
    }
  },
  [entity2]: {
    // Similar structure
  }
}
```

### Redux Toolkit Usage

**Action Creators (Slice):**

```typescript
// authSlice.ts
export const { setCredentials, logout } = authSlice.actions;

// Usage in components
dispatch(setCredentials({ user, accessToken }));
dispatch(logout());
```

**Redux Hooks:**

- `useAppSelector` – typed selector hook to read state from the store.
- `useAppDispatch` – typed dispatch hook to dispatch actions.

**Selectors:**

```typescript
// store/hooks.ts
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

**Async Thunks:**

```typescript
// authSlice.ts
export const login = createAsyncThunk<
  AuthResponse,
  LoginData,
  { rejectValue: string }
>("auth/login", async (userData: LoginData, thunkAPI) => {
  try {
    return await authService.login(userData);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, "Login failed"));
  }
});
);
```

<a id="routing"></a>

## 🛣️ Routing

### Route Structure

```typescript
// router/index.tsx
<Routes>
  <Route
    path="/dashboard"
    element={
      <RequireAuth>
        <DashboardLayout />
      </RequireAuth>
    }
  >
    <Route index element={<DashboardIndex />} />
    <Route path="courses" element={<BrowseCourse />} />
    <Route path="my-courses" element={<StudnentMyCourses />} />

    <Route path="teaching">
      <Route path="create-course" element={<CreateCourse />} />
      <Route path="my-classes" element={<MyCourses />} />
    </Route>
  </Route>

  <Route path="/" element={<PublicLayout />}>
    <Route index element={<Index />} />
    <Route path="/courses" element={<BrowseCourse />} />
    <Route path="/courses/:courseId" element={<CourseDetail />} />
  </Route>

  <Route path="/login" element={<Auth />} />
  <Route path="/register" element={<Auth />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

### Protected Routes Implementation

```typescript
// components/auth/ProtectedRoute.tsx
const RequireAuth = ({ children }: RequireAuthProps) => {
  const { isAuthenticated, isLoading, isInitialized } = useAppSelector(
    (state) => state.auth
  );

  if (!isInitialized || isLoading) {
    return <Spinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
```

<a id="api-integration"></a>

## 🔌 API Integration

### Axios Configuration

```typescript
// services/api.ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Request interceptor - Add auth token

api.interceptors.request.use((config) => {
  const isPublic = PUBLIC_ENDPOINTS.some((url) => config.url?.includes(url));

  if (!isPublic && store) {
    const state = store.getState() as RootState;
    const token = state.auth.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// Response interceptor - Handle token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (
      error.response?.status === 401 &&
      !PUBLIC_ENDPOINTS.some((url) => originalRequest.url?.includes(url)) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const { data } = await api.post("/auth/refresh", {});

        if (store && data.accessToken) {
          const { setAccessToken } = await import("../store/slices/authSlice");
          store.dispatch(setAccessToken(data.accessToken));
        }

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        return api(originalRequest);
      } catch (refreshErr) {
        if (store) {
          const { logout } = await import("../store/slices/authSlice");
          store.dispatch(logout());
        }

        window.location.href = "/login";

        console.error(refreshErr);
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);
```

### API Methods

```typescript
// api/authApi.ts
const authService = {
  register: async (userData: RegisterData) => {
    const response = await api.post("/auth/register", userData);
    return response.data.data;
  },

  login: async (userData: LoginData): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      userData
    );
    return response.data.data;
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>("/auth/refresh");
    return response.data.data;
  },

  logout: async (): Promise<ApiResponse<null>> => {
    const response = await api.post<ApiResponse<null>>("/auth/logout");
    return response.data;
  },
};
```

<a id="deployment"></a>

## 🚀 Deployment

### Deploying to Vercel

1. **Install Vercel CLI** (optional)

   ```bash
   npm install -g vercel
   ```

2. **Deploy via GitHub**

   - Connect repository at [vercel.com](https://vercel.com)
   - Select the frontend repository
   - Configure build settings:
     ```
     Build Command: npm run build
     Output Directory: dist
     Install Command: npm install
     ```

3. **Set environment variables**

   - Add all `VITE_*` variables from `.env`
   - Set `VITE_API_BASE_URL` to production backend URL

4. **Deploy**
   - Push to main branch for automatic deployment
   - Or run `vercel --prod` from CLI

### Build Optimization

The production build is optimized with:

- **Code Splitting** - Automatic route-based splitting
- **Tree Shaking** - Removes unused code
- **Minification** - Compressed JS/CSS bundles
- **Asset Optimization** - Compressed images and fonts
- **Lazy Loading** - Components loaded on demand

<a id="responsive-design"></a>

## 📱 Responsive Design

### Breakpoints (TailwindCSS)

```
screens: {
  'sm': '640px',   // Mobile landscape
  'md': '768px',   // Tablet
  'lg': '1024px',  // Desktop
  'xl': '1280px',  // Large desktop
  '2xl': '1536px'  // Extra large
}
```

### Responsive Usage Examples

```tsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>

// Responsive text
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  Welcome
</h1>

// Responsive padding
<div className="p-4 md:p-6 lg:p-8">
  Content
</div>

// Mobile menu toggle
<div className="md:hidden">
  <MobileMenu />
</div>
<div className="hidden md:block">
  <DesktopMenu />
</div>
```

## ♿ Accessibility

### WCAG 2.1 Compliance

- **Semantic HTML** - Proper use of headings, landmarks, and ARIA labels
- **Keyboard Navigation** - All interactive elements accessible via keyboard
- **Focus Indicators** - Visible focus states for all interactive elements
- **Color Contrast** - Minimum 4.5:1 contrast ratio for text
- **Alt Text** - Descriptive alt text for all images
- **Form Labels** - Associated labels for all form inputs
- **Error Messages** - Clear, descriptive error messages

### Example Implementation

```tsx
<button
  aria-label="Close modal"
  onClick={handleClose}
  className="focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  <X className="w-5 h-5" aria-hidden="true" />
</button>

<img
  src={avatar}
  alt={`${user.name}'s profile picture`}
  className="w-10 h-10 rounded-full"
/>

<form aria-labelledby="login-heading">
  <h2 id="login-heading">Login to your account</h2>
  <label htmlFor="email">Email</label>
  <input
    id="email"
    type="email"
    aria-required="true"
    aria-invalid={!!errors.email}
    aria-describedby={errors.email ? "email-error" : undefined}
  />
  {errors.email && (
    <span id="email-error" role="alert">
      {errors.email}
    </span>
  )}
</form>
```

## 📝 Code Quality

### TypeScript Best Practices

- Strict mode enabled
- No `any` types unless absolutely necessary
- Proper interface/type definitions
- Type guards for runtime checks

### ESLint Rules

- React hooks rules
- TypeScript recommended rules
- Unused variables detection
- Import order enforcement

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Contact

For questions or support, contact: chanuthdewhan@gmail.com

---

Note: This project was developed by a student as part of the Rapid API Development module.
