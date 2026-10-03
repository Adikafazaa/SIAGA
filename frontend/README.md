# HavenCare Frontend

Implementation of the clinical and wellbeing interface based on `havencare_blueprint_canvas.html`, built with Next.js 14 (App Router), React 18, TypeScript, and Tailwind CSS. The folder structure (`src/app`, `src/components`, `src/features`, `src/lib`), authentication flow, and API proxy mechanisms adhere to the core platform architecture.

## Getting Started

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). To test the production build, execute `npm run build`.

## Key Screens & Routes

| Design View | Route | Description & Features |
| --- | --- | --- |
| Public Landing | `/` | Mood exploration, login/register access points, and crisis hotline resources |
| Authentication | `/login`, `/register` | Email/password login, Google Auth (if configured), and pre-seeded 1-click demo accounts |
| Wellness Hub | `/dashboard` | Daily emotional check-in, mood history trends, and patient journey navigation |
| Reflection Chat | `/chat` | Real-time empathetic AI counseling sessions with SSE token streaming and live guardrail feedback |
| Clinical Assessments | `/assessments` | Standardized clinical screening instruments (PHQ-9 for Depression & GAD-7 for Anxiety) |
| Community Support | `/community` | Local peer support timeline and client-side self-expression posts |
| Crisis Support | SOS Floating Action | Immediate emergency hotlines and nearby psychiatric emergency facilities (IGD) |

*Doctor DPJP, SOC Admin Telemetry, Onboarding, and Profile routes are fully available. Users are redirected to `/dashboard` upon patient sign-in.*

## Demo Mode Limitations

When running without a live backend instance, the frontend seamlessly operates in client-side mock mode. Community posts and wellness check-ins are persisted locally in browser storage. Simulated chat interactions utilize in-memory mock responses. HavenCare AI is an assistive support platform and not an emergency service or substitute for professional psychiatric diagnosis.
