# GitHub Profile Frontend Documentation

## Overview

A beautiful, fully-functional frontend for managing GitHub profiles in DevPulse. The GitHub Profile page provides a comprehensive interface for users to view, sync, and manage their GitHub profile data.

## Routes & Pages

### 1. **Home Page** (`/`)
- Landing page with hero section
- Features overview
- Call-to-action buttons
- Responsive navigation
- Shows different CTAs based on authentication status

**Components:**
- Hero section with gradient text
- Features grid (3 columns)
- CTA section for unauthenticated users
- Footer

### 2. **GitHub Profile Page** (`/github/profile`)
- Dedicated page for managing GitHub profile data
- Real-time sync status
- Comprehensive profile information display
- Quick stats and metrics

**Server Component:** `app/github/profile/page.tsx`
- Handles authentication check
- Fetches user data from database
- Redirects to login if not authenticated

**Client Component:** `app/github/profile/github-profile-client.tsx`
- Interactive sync functionality
- Real-time UI updates
- Status messages and feedback

### 3. **Global Navigation** 
- **Component:** `components/navbar.tsx`
- Sticky header with DevPulse branding
- Responsive navigation links
- Conditional rendering based on auth state
- Mobile-friendly hamburger menu

## Features

### Profile Information Section
Displays:
- User avatar (from GitHub)
- Full name
- GitHub username
- Email address
- GitHub ID (unique identifier)
- Member since date
- Bio (from GitHub profile)

### Stats Display
- **Public Repositories**: Count of public repos on GitHub
- **Last Synced**: Timestamp of last sync operation
- **Profile Completion**: Visual progress indicator
- **Sync Status**: Current status badge

### Sync Functionality
- Manual sync button with loading state
- Fetches latest data from GitHub API
- Updates local database with fresh data
- Shows success/error messages
- Stores last sync time in localStorage
- Displays repository count after sync

### UI/UX Features
- Beautiful gradient backgrounds
- Smooth animations and transitions
- Dark mode support
- Responsive design (mobile-first)
- Loading indicators
- Error handling with user-friendly messages
- Success confirmations

## Component Structure

```
app/
├── github/
│   └── profile/
│       ├── page.tsx (Server Component)
│       └── github-profile-client.tsx (Client Component)
├── dashboard/
│   ├── page.tsx (Server Component)
│   ├── dashboard-content.tsx (Client Component with sync button)
│   └── updated with link to GitHub profile
├── layout.tsx (Updated with Navbar)
└── page.tsx (Updated home page)

components/
└── navbar.tsx (Global Navigation)
```

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Color Scheme**:
  - Primary: Blue (#0066CC and shades)
  - Accent: Purple (#9333EA)
  - Neutral: Slate (various shades)
- **Responsive Breakpoints**:
  - Mobile: 0-640px
  - Tablet: 640-1024px
  - Desktop: 1024px+

## Data Flow

```
User navigates to /github/profile
          ↓
Server Component fetches session & user data
          ↓
Redirects if not authenticated
          ↓
Client Component renders with user data
          ↓
User clicks "Sync Now" button
          ↓
POST request to /api/github/profile
          ↓
API fetches from GitHub using access token
          ↓
Updates database with fresh data
          ↓
Returns success response
          ↓
Client updates UI with new data
          ↓
Shows success message
```

## API Integration

### `/api/github/profile` (POST)
- **Purpose**: Sync GitHub profile data
- **Authentication**: Required (session token)
- **Response**:
```json
{
  "success": true,
  "profile": {
    "username": "string",
    "bio": "string | null",
    "avatarUrl": "string | null",
    "publicRepos": number
  }
}
```

## State Management

### Client State (github-profile-client.tsx)
- `loading`: Sync button loading state
- `syncing`: Sync operation in progress
- `message`: Success/error messages
- `syncData`: Latest synced profile data
- `lastSyncTime`: Timestamp of last sync

### Persistent State
- Last sync time stored in browser `localStorage`
- Survives page refreshes

## Responsive Design

### Mobile (< 640px)
- Hamburger menu navigation
- Single column layout
- Stacked buttons
- Touch-friendly spacing

### Tablet (640px - 1024px)
- Multi-column layout (2-3 columns)
- Visible navigation
- Optimized spacing

### Desktop (> 1024px)
- Full navigation bar
- 3-column grid layout
- Expanded features section
- Sidebar with quick stats

## Error Handling

- Network error handling
- API error messages
- Unauthorized access redirects
- User-friendly error messages
- Error logging for debugging

## Performance Optimizations

- Server-side rendering for SEO
- Client-side interactivity only where needed
- Lazy loading of components
- Optimized images and icons
- Minimal JavaScript bundle

## Accessibility Features

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Color contrast compliance
- Mobile screen reader support

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari, Chrome Mobile

## Future Enhancements

1. **Advanced Stats**
   - Repository analytics
   - Contribution graphs
   - Activity timeline

2. **Repository Management**
   - List all repositories
   - Filter and search
   - Repository-specific sync

3. **Webhooks**
   - Real-time sync on GitHub changes
   - Automatic profile updates

4. **Export Features**
   - PDF report generation
   - Data export options

5. **Notifications**
   - Sync notifications
   - Profile update alerts

## Testing

To test the GitHub Profile page:

1. Navigate to `/github/profile`
2. View profile information
3. Click "Sync Now" button
4. Verify success message appears
5. Check last sync time updates
6. Test on mobile view
7. Test dark mode toggle

## Troubleshooting

### Sync Button Not Working
- Check authentication status
- Verify API endpoint is accessible
- Check browser console for errors
- Ensure GitHub credentials are valid

### Page Not Loading
- Verify user is authenticated
- Check database connection
- Review server logs

### Styling Issues
- Clear browser cache
- Verify Tailwind CSS is compiled
- Check dark mode settings

## Contributing

When modifying the GitHub Profile frontend:

1. Maintain responsive design
2. Keep accessibility in mind
3. Update this documentation
4. Test on multiple screen sizes
5. Verify dark mode compatibility
