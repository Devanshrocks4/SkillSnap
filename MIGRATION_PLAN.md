# Firestore Migration Plan

## Current State Analysis

### 1. Candidate Dashboard (`src/pages/candidate/index.tsx`)
- Imports: `mockJobs`, `mockApplications`, `mockInterviews`, `mockOnboarding`
- Uses hardcoded candidate ID `c1`
- Needs: Firestore queries with real-time subscriptions

### 2. Recruiter Dashboard (`src/pages/recruiter/index.tsx`)
- Imports: `mockJobs`, `mockApplications`, `mockCandidates`, `mockInterviews`, `mockOnboarding`, `mockActivity`
- Uses hardcoded data for charts
- Needs: Multiple Firestore queries with subscriptions

### 3. Admin Dashboard (`src/pages/admin/index.tsx`)
- Imports: `mockCandidates`, `mockJobs`, `mockApplications`, `mockOnboarding`
- Uses hardcoded recruiter list
- Needs: Complete Firestore migration with user roles

### 4. Existing Firestore Services
- `jobService.ts` - Has basic CRUD
- `applicationService.ts` - Has basic CRUD
- `userService.ts` - Has basic user management

### 5. Missing Service Methods
- Interviews (Firestore collection)
- Onboarding (Firestore collection)
- Activity feed
- Stats aggregation

## Implementation Phases

### Phase 1: Create Missing Firestore Services
1. Create `interviewService.ts` - Interviews CRUD
2. Create `onboardingService.ts` - Onboarding CRUD
3. Enhance existing services with stats methods

### Phase 2: Migrate Candidate Dashboard
1. Replace mock imports with Firestore service calls
2. Add real-time subscriptions
3. Add loading/empty/error states

### Phase 3: Migrate Recruiter Dashboard
1. Replace mock imports with Firestore service calls
2. Add real-time subscriptions
3. Add loading/empty/error states

### Phase 4: Migrate Admin Dashboard
1. Replace mock imports with Firestore service calls
2. Add user role filtering
3. Add loading/empty/error states

### Phase 5: Cleanup & Verification
1. Remove mock data imports from all dashboards
2. Check for localStorage auth remnants
3. Run production build
4. Generate final report
