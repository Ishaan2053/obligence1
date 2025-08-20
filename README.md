# inkline
AI Agent that parses your contracts and gives you insightful information.


legal-doc-extractor-platform/
├── 📁 packages/
│   ├── 📁 backend/                        # FastAPI Backend
│   │   ├── 📁 app/
│   │   │   ├── 📄 __init__.py
│   │   │   ├── 📄 main.py                 # FastAPI application entry point
│   │   │   ├── 📁 api/
│   │   │   │   ├── 📄 __init__.py
│   │   │   │   ├── 📄 auth.py             # Authentication endpoints
│   │   │   │   ├── 📄 documents.py        # Document upload/processing endpoints
│   │   │   │   ├── 📄 analytics.py        # Analytics and reporting endpoints
│   │   │   │   ├── 📄 webhooks.py         # Webhook handlers for Portia
│   │   │   │   └── 📄 users.py            # User management endpoints
│   │   │   ├── 📁 core/
│   │   │   │   ├── 📄 __init__.py
│   │   │   │   ├── 📄 config.py           # App configuration and settings
│   │   │   │   ├── 📄 security.py         # JWT and authentication logic
│   │   │   │   ├── 📄 database.py         # Database connection and session
│   │   │   │   └── 📄 redis.py            # Redis connection and utilities
│   │   │   ├── 📁 models/
│   │   │   │   ├── 📄 __init__.py
│   │   │   │   ├── 📄 user.py             # User SQLAlchemy models
│   │   │   │   ├── 📄 document.py         # Document SQLAlchemy models
│   │   │   │   ├── 📄 extraction.py       # Extraction result models
│   │   │   │   └── 📄 audit.py            # Audit trail models
│   │   │   ├── 📁 schemas/
│   │   │   │   ├── 📄 __init__.py
│   │   │   │   ├── 📄 user.py             # User Pydantic schemas
│   │   │   │   ├── 📄 document.py         # Document Pydantic schemas
│   │   │   │   ├── 📄 extraction.py       # Extraction Pydantic schemas
│   │   │   │   └── 📄 analytics.py        # Analytics Pydantic schemas
│   │   │   ├── 📁 services/
│   │   │   │   ├── 📄 __init__.py
│   │   │   │   ├── 📄 portia_service.py   # Portia AI agent integration
│   │   │   │   ├── 📄 document_service.py # Document processing logic
│   │   │   │   ├── 📄 email_service.py    # Email notification service
│   │   │   │   ├── 📄 analytics_service.py # Analytics generation
│   │   │   │   └── 📄 auth_service.py     # Authentication business logic
│   │   │   ├── 📁 utils/
│   │   │   │   ├── 📄 __init__.py
│   │   │   │   ├── 📄 pdf_utils.py        # PDF processing utilities
│   │   │   │   ├── 📄 file_utils.py       # File handling utilities
│   │   │   │   ├── 📄 validation.py       # Data validation utilities
│   │   │   │   └── 📄 logging.py          # Custom logging setup
│   │   │   └── 📁 middleware/
│   │   │       ├── 📄 __init__.py
│   │   │       ├── 📄 cors.py             # CORS middleware
│   │   │       ├── 📄 auth.py             # Authentication middleware
│   │   │       └── 📄 logging.py          # Request logging middleware
│   │   ├── 📁 alembic/                    # Database migrations
│   │   │   ├── 📄 env.py
│   │   │   ├── 📄 script.py.mako
│   │   │   └── 📁 versions/
│   │   ├── 📁 tests/
│   │   │   ├── 📄 __init__.py
│   │   │   ├── 📄 conftest.py             # Pytest configuration
│   │   │   ├── 📁 api/                    # API endpoint tests
│   │   │   ├── 📁 services/               # Service layer tests
│   │   │   └── 📁 integration/            # Integration tests
│   │   ├── 📄 requirements.txt            # Python dependencies
│   │   ├── 📄 Dockerfile                  # Docker configuration for backend
│   │   ├── 📄 .env.example               # Environment variables template
│   │   ├── 📄 alembic.ini                # Alembic configuration
│   │   └── 📄 pyproject.toml             # Python project configuration
│   │
│   ├── 📁 frontend/                       # Next.js Frontend
│   │   ├── 📁 src/
│   │   │   ├── 📁 app/                    # Next.js App Router
│   │   │   │   ├── 📄 layout.tsx          # Root layout
│   │   │   │   ├── 📄 page.tsx            # Home page
│   │   │   │   ├── 📄 globals.css         # Global styles
│   │   │   │   ├── 📁 auth/               # Authentication pages
│   │   │   │   │   ├── 📄 login/page.tsx
│   │   │   │   │   └── 📄 register/page.tsx
│   │   │   │   ├── 📁 dashboard/          # Dashboard pages
│   │   │   │   │   ├── 📄 page.tsx        # Main dashboard
│   │   │   │   │   ├── 📄 layout.tsx      # Dashboard layout
│   │   │   │   │   ├── 📁 documents/      # Document management
│   │   │   │   │   │   ├── 📄 page.tsx
│   │   │   │   │   │   ├── 📄 upload/page.tsx
│   │   │   │   │   │   └── 📄 [id]/page.tsx
│   │   │   │   │   ├── 📁 analytics/      # Analytics views
│   │   │   │   │   │   └── 📄 page.tsx
│   │   │   │   │   └── 📁 settings/       # User settings
│   │   │   │   │       └── 📄 page.tsx
│   │   │   │   └── 📁 api/                # API route handlers
│   │   │   │       ├── 📄 auth/[...nextauth]/route.ts
│   │   │   │       └── 📄 upload/route.ts
│   │   │   ├── 📁 components/             # Reusable React components
│   │   │   │   ├── 📁 ui/                 # Basic UI components
│   │   │   │   │   ├── 📄 button.tsx
│   │   │   │   │   ├── 📄 input.tsx
│   │   │   │   │   ├── 📄 dialog.tsx
│   │   │   │   │   ├── 📄 table.tsx
│   │   │   │   │   └── 📄 card.tsx
│   │   │   │   ├── 📁 features/           # Feature-specific components
│   │   │   │   │   ├── 📄 pdf-viewer.tsx  # PDF viewing component
│   │   │   │   │   ├── 📄 document-upload.tsx
│   │   │   │   │   ├── 📄 extraction-results.tsx
│   │   │   │   │   ├── 📄 analytics-chart.tsx
│   │   │   │   │   └── 📄 legal-review.tsx
│   │   │   │   ├── 📁 layout/             # Layout components
│   │   │   │   │   ├── 📄 sidebar.tsx
│   │   │   │   │   ├── 📄 header.tsx
│   │   │   │   │   └── 📄 footer.tsx
│   │   │   │   └── 📁 forms/              # Form components
│   │   │   │       ├── 📄 login-form.tsx
│   │   │   │       ├── 📄 upload-form.tsx
│   │   │   │       └── 📄 settings-form.tsx
│   │   │   ├── 📁 lib/                    # Utility libraries
│   │   │   │   ├── 📄 api.ts              # API client setup (axios/fetch)
│   │   │   │   ├── 📄 auth.ts             # Authentication utilities
│   │   │   │   ├── 📄 utils.ts            # General utilities
│   │   │   │   ├── 📄 types.ts            # TypeScript type definitions
│   │   │   │   ├── 📄 constants.ts        # App constants
│   │   │   │   └── 📄 validations.ts      # Form validation schemas
│   │   │   ├── 📁 hooks/                  # Custom React hooks
│   │   │   │   ├── 📄 use-auth.ts         # Authentication hook
│   │   │   │   ├── 📄 use-documents.ts    # Document management hook
│   │   │   │   ├── 📄 use-api.ts          # API calling hook
│   │   │   │   └── 📄 use-websocket.ts    # Real-time updates hook
│   │   │   ├── 📁 store/                  # State management (Zustand/Redux)
│   │   │   │   ├── 📄 auth-store.ts       # Authentication state
│   │   │   │   ├── 📄 document-store.ts   # Document state
│   │   │   │   └── 📄 ui-store.ts         # UI state (modals, loading)
│   │   │   └── 📁 styles/                 # Styling files
│   │   │       ├── 📄 globals.css         # Global CSS
│   │   │       └── 📄 components.css      # Component-specific CSS
│   │   ├── 📁 public/                     # Static assets
│   │   │   ├── 📄 favicon.ico
│   │   │   ├── 📁 icons/
│   │   │   └── 📁 images/
│   │   ├── 📄 package.json               # Node.js dependencies
│   │   ├── 📄 next.config.js             # Next.js configuration
│   │   ├── 📄 tailwind.config.js         # Tailwind CSS configuration
│   │   ├── 📄 tsconfig.json              # TypeScript configuration
│   │   ├── 📄 .eslintrc.json             # ESLint configuration
│   │   ├── 📄 .env.local.example         # Environment variables template
│   │   └── 📄 Dockerfile                 # Docker configuration for frontend
│   │
│   └── 📁 shared/                        # Shared utilities and types
│       ├── 📄 package.json               # Shared package configuration
│       ├── 📁 types/                     # Shared TypeScript types
│       │   ├── 📄 user.ts
│       │   ├── 📄 document.ts
│       │   ├── 📄 extraction.ts
│       │   └── 📄 api.ts
│       ├── 📁 constants/                 # Shared constants
│       │   ├── 📄 status.ts
│       │   ├── 📄 document-types.ts
│       │   └── 📄 api-endpoints.ts
│       └── 📁 utils/                     # Shared utility functions
│           ├── 📄 validation.ts
│           ├── 📄 formatting.ts
│           └── 📄 date-utils.ts
│
├── 📁 infrastructure/                     # Deployment and infrastructure
│   ├── 📁 docker/
│   │   ├── 📄 docker-compose.yml         # Local development setup
│   │   ├── 📄 docker-compose.prod.yml    # Production setup
│   │   └── 📁 nginx/                     # Nginx configuration
│   │       └── 📄 nginx.conf
│   ├── 📁 k8s/                          # Kubernetes manifests (optional)
│   │   ├── 📄 backend-deployment.yaml
│   │   ├── 📄 frontend-deployment.yaml
│   │   ├── 📄 postgres-deployment.yaml
│   │   ├── 📄 redis-deployment.yaml
│   │   └── 📄 ingress.yaml
│   └── 📁 terraform/                    # Infrastructure as Code (optional)
│       ├── 📄 main.tf
│       ├── 📄 variables.tf
│       └── 📄 outputs.tf
│
├── 📁 docs/                             # Documentation
│   ├── 📄 README.md                     # Project overview
│   ├── 📄 API.md                        # API documentation
│   ├── 📄 DEPLOYMENT.md                 # Deployment guide
│   ├── 📄 DEVELOPMENT.md                # Development setup
│   └── 📁 images/                       # Documentation images
│
├── 📁 scripts/                          # Utility scripts
│   ├── 📄 setup.sh                      # Development environment setup
│   ├── 📄 backup.sh                     # Database backup script
│   ├── 📄 deploy.sh                     # Deployment script
│   └── 📄 seed-data.py                  # Database seeding script
│
├── 📄 package.json                      # Root package.json for monorepo
├── 📄 pnpm-workspace.yaml               # PNPM workspace configuration
├── 📄 turbo.json                        # Turbo build configuration
├── 📄 .gitignore                        # Git ignore rules
├── 📄 .env.example                      # Environment variables template
├── 📄 README.md                         # Project documentation
├── 📄 LICENSE                           # Project license
└── 📄 CHANGELOG.md                      # Project changelog

