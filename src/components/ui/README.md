# UI Components

This directory contains reusable UI components for the unified-login-modern-ui design system.

## Components

- [GlassCard](#glasscard-component) - Glassmorphism card component
- [GradientBackground](#gradientbackground-component) - Full viewport gradient backgrounds
- [StatCard](#statcard-component) - Statistics display card with trend indicators

---

## GlassCard Component

A flexible glassmorphism card component with multiple visual variants and optional hover animations.

### Features

- **Glassmorphism Effect**: Backdrop blur with semi-transparent backgrounds
- **Multiple Variants**: Light, dark, and colored styles
- **Hover Animations**: Optional scale and shadow effects on hover
- **Responsive Padding**: Automatically adjusts padding based on screen size
- **Customizable**: Supports custom className for additional styling

### Usage

```tsx
import GlassCard from '../components/ui/GlassCard';

// Basic usage with default light variant
<GlassCard>
  <h2>Card Title</h2>
  <p>Card content goes here</p>
</GlassCard>

// Dark variant
<GlassCard variant="dark">
  <p>Dark themed content</p>
</GlassCard>

// Colored variant with gradient
<GlassCard variant="colored">
  <p>Colorful content</p>
</GlassCard>

// With hover animation
<GlassCard variant="light" hover={true}>
  <p>Interactive card with hover effect</p>
</GlassCard>

// With custom styling
<GlassCard className="border-2 border-cyan-400" hover={true}>
  <p>Custom styled card</p>
</GlassCard>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | Required | Content to be rendered inside the card |
| `className` | `string` | `''` | Additional CSS classes to apply |
| `variant` | `'light' \| 'dark' \| 'colored'` | `'light'` | Visual style variant |
| `hover` | `boolean` | `false` | Enable hover animations |

### Variants

#### Light (Default)
- Background: `bg-white/10`
- Border: `border-white/20`
- Best for: Content on dark backgrounds

#### Dark
- Background: `bg-gray-900/40`
- Border: `border-gray-700/30`
- Best for: Creating depth and hierarchy

#### Colored
- Background: `bg-gradient-to-br from-blue-500/20 to-purple-500/20`
- Border: `border-white/20`
- Best for: Highlighting special content

### Responsive Padding

The component automatically adjusts padding based on screen size:
- Mobile: `p-4` (1rem)
- Tablet (sm): `p-6` (1.5rem)
- Desktop (md): `p-8` (2rem)

### Animation

When `hover={true}` is enabled:
- Scale: 1.02x on hover
- Shadow: Enhanced shadow effect
- Duration: 200ms transition

### Testing

To test the component visually, navigate to `/test-glasscard` in your browser.

To run automated tests:
```tsx
import { runAllGlassCardTests } from '../components/ui/GlassCard.test';

// In your component or console
runAllGlassCardTests();
```

### Requirements

This component satisfies the following requirements:
- **4.6**: Dashboard glassmorphism effects for card elements
- **5.2**: Admin Dashboard card-based layouts with glassmorphism
- **6.2**: Cleaner Dashboard card-based layouts with glassmorphism
- **7.2**: Customer Dashboard card-based layouts with glassmorphism

### Examples

#### Simple Content Card
```tsx
<GlassCard variant="light">
  <h3 className="text-xl font-semibold text-white mb-2">
    Welcome
  </h3>
  <p className="text-blue-100">
    This is a simple content card with glassmorphism effect.
  </p>
</GlassCard>
```

#### Interactive Service Card
```tsx
<GlassCard variant="dark" hover={true}>
  <div className="flex items-start gap-4">
    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-2xl">
      🚗
    </div>
    <div className="flex-1">
      <h3 className="text-xl font-semibold text-white mb-2">
        Car Wash Service
      </h3>
      <p className="text-gray-300 mb-3">
        Premium cleaning service
      </p>
      <div className="flex gap-2">
        <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
          Available
        </span>
        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
          $29.99
        </span>
      </div>
    </div>
  </div>
</GlassCard>
```

#### Grid Layout
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <GlassCard variant="light" hover={true}>
    <div className="text-center">
      <div className="text-4xl mb-2">📊</div>
      <h4 className="text-lg font-semibold text-white">Statistics</h4>
    </div>
  </GlassCard>
  
  <GlassCard variant="colored" hover={true}>
    <div className="text-center">
      <div className="text-4xl mb-2">📅</div>
      <h4 className="text-lg font-semibold text-white">Schedule</h4>
    </div>
  </GlassCard>
  
  <GlassCard variant="dark" hover={true}>
    <div className="text-center">
      <div className="text-4xl mb-2">⚙️</div>
      <h4 className="text-lg font-semibold text-white">Settings</h4>
    </div>
  </GlassCard>
</div>
```

### Browser Compatibility

The component uses `backdrop-filter` which is supported in:
- Chrome/Edge 76+
- Safari 9+
- Firefox 103+

For older browsers, the component will still render but without the blur effect.

### Accessibility

- The component uses semantic HTML
- Content inside the card should follow accessibility best practices
- Ensure sufficient color contrast for text content
- Interactive cards with `hover={true}` should also be keyboard accessible

### Performance

- Uses CSS transforms for animations (GPU accelerated)
- Framer Motion animations are optimized for performance
- Backdrop blur is hardware accelerated where supported


---

## GradientBackground Component

A full viewport gradient background component with optional animated blob decorations. Provides predefined color schemes for consistent visual design across the application.

### Features

- **Full Viewport Coverage**: Fixed positioning that covers the entire screen
- **Predefined Gradients**: Four carefully designed color schemes
- **Optional Animation**: Animated blob decorations with smooth, infinite motion
- **Content Layer Support**: Render children on top with proper z-index management
- **Performance Optimized**: GPU-accelerated transforms for smooth 60fps animation

### Usage

```tsx
import GradientBackground from '../components/ui/GradientBackground';

// Basic usage with default blue variant
<GradientBackground />

// With specific variant
<GradientBackground variant="purple" />

// With animated blobs
<GradientBackground variant="green" animated={true} />

// With content on top
<GradientBackground variant="orange" animated={true}>
  <div className="p-8">
    <h1>Your Content Here</h1>
  </div>
</GradientBackground>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'blue' \| 'purple' \| 'green' \| 'orange'` | `'blue'` | Color scheme for the gradient |
| `animated` | `boolean` | `false` | Enable animated blob decorations |
| `children` | `React.ReactNode` | `undefined` | Optional content to render on top |

### Gradient Variants

#### Blue (Default)
- Colors: Blue (600) → Indigo (700) → Purple (800)
- Best for: Login screens, professional dashboards
- Mood: Professional, trustworthy, calm

#### Purple
- Colors: Purple (600) → Pink (600) → Red (600)
- Best for: Creative interfaces, energetic designs
- Mood: Creative, bold, passionate

#### Green
- Colors: Green (500) → Teal (600) → Blue (700)
- Best for: Success states, nature-themed content
- Mood: Fresh, natural, positive

#### Orange
- Colors: Orange (500) → Red (600) → Pink (700)
- Best for: Warm, inviting, action-oriented designs
- Mood: Energetic, warm, exciting

### Animated Blobs

When `animated={true}` is enabled, three decorative blob elements are rendered with:
- **Smooth Motion**: Infinite looping animations with easeInOut timing
- **Staggered Timing**: Different durations (20s, 25s, 22s) for organic movement
- **Blend Mode**: `mix-blend-multiply` for beautiful color interactions
- **Blur Effect**: `blur-3xl` for soft, diffused appearance
- **Opacity**: 30% for subtle visual interest

### Technical Details

- **Positioning**: `fixed inset-0` for full viewport coverage
- **Z-Index**: Background layer with content on `z-10`
- **Animation Library**: Framer Motion for smooth, performant animations
- **Styling**: Tailwind CSS utility classes
- **Performance**: Uses CSS transforms (GPU accelerated)

### Testing

To test the component visually, navigate to `/test-gradient` in your browser.

To run automated tests:
```tsx
import { runAllGradientBackgroundTests } from '../components/ui/GradientBackground.test';

// In your component or console
runAllGradientBackgroundTests();
```

### Requirements

This component satisfies the following requirements:
- **3.1**: Login Screen gradient background using modern color schemes
- **4.7**: Dashboard gradient backgrounds and modern color transitions

### Use Cases

#### Login Screen
```tsx
<GradientBackground variant="blue" animated={true}>
  <IonContent>
    <div className="flex items-center justify-center min-h-screen">
      <GlassCard variant="light">
        <LoginForm />
      </GlassCard>
    </div>
  </IonContent>
</GradientBackground>
```

#### Dashboard Background
```tsx
<GradientBackground variant="purple">
  <IonPage>
    <IonHeader>
      <DashboardHeader />
    </IonHeader>
    <IonContent>
      <DashboardContent />
    </IonContent>
  </IonPage>
</GradientBackground>
```

#### Landing Page
```tsx
<GradientBackground variant="orange" animated={true}>
  <div className="container mx-auto px-4 py-16">
    <h1 className="text-6xl font-bold text-white mb-8">
      Welcome to Our Service
    </h1>
    <p className="text-xl text-white/80">
      Experience the difference
    </p>
  </div>
</GradientBackground>
```

### Browser Compatibility

The component uses modern CSS features:
- **Gradients**: Supported in all modern browsers
- **Fixed Positioning**: Universal support
- **Backdrop Blur** (for blobs): Chrome/Edge 76+, Safari 9+, Firefox 103+
- **CSS Transforms**: Universal support with GPU acceleration

### Accessibility

- The component is purely decorative and doesn't affect accessibility
- Ensure content rendered on top has sufficient contrast
- Text should be readable against the gradient background
- Consider providing alternative color schemes for accessibility preferences

### Performance

- **GPU Accelerated**: Uses CSS transforms for smooth animations
- **Optimized Rendering**: Fixed positioning prevents layout recalculations
- **Efficient Animations**: Framer Motion optimizes animation performance
- **60fps Target**: Animations are designed to maintain smooth frame rates

### Best Practices

1. **Choose Appropriate Variants**: Match the gradient to your content's mood and purpose
2. **Use Animation Sparingly**: Enable animated blobs for engaging screens (login, landing) but consider disabling for data-heavy dashboards
3. **Ensure Contrast**: Always test text readability on gradient backgrounds
4. **Layer Content Properly**: Use GlassCard components on top for best visual results
5. **Consider Performance**: On lower-end devices, consider disabling animations

### Combining with GlassCard

The GradientBackground and GlassCard components are designed to work together:

```tsx
<GradientBackground variant="blue" animated={true}>
  <div className="container mx-auto p-8">
    <GlassCard variant="light">
      <h2 className="text-2xl font-bold text-white mb-4">
        Beautiful Glassmorphism
      </h2>
      <p className="text-white/80">
        The glass effect looks stunning on gradient backgrounds
      </p>
    </GlassCard>
  </div>
</GradientBackground>
```

### Customization

While the component provides predefined variants, you can extend it by:
1. Adding new gradient variants in the component
2. Adjusting blob animation parameters
3. Modifying blur and opacity values
4. Creating custom color combinations

### Migration from Static Backgrounds

If you're replacing static backgrounds:

```tsx
// Before
<div className="bg-blue-600">
  <YourContent />
</div>

// After
<GradientBackground variant="blue">
  <YourContent />
</GradientBackground>
```

The component maintains the same structure while providing enhanced visual appeal.


---

## StatCard Component

A statistics display card component with glassmorphism styling, icon support, optional trend indicators, and hover animations. Perfect for displaying key metrics and KPIs on dashboards.

### Features

- **Glassmorphism Styling**: Consistent with design system aesthetics
- **Icon Support**: Uses Ionicons for visual representation
- **Trend Indicators**: Optional up/down arrows with percentage values
- **Hover Animations**: Scale and shadow effects on hover
- **Color Variants**: Multiple color options for icon backgrounds
- **Flexible Values**: Supports both numeric and string values
- **Responsive Design**: Works seamlessly across all screen sizes

### Usage

```tsx
import StatCard from '../components/ui/StatCard';
import { people, cash, car } from 'ionicons/icons';

// Basic usage
<StatCard
  title="Total Customers"
  value={1234}
  icon={people}
/>

// With trend indicator (up)
<StatCard
  title="Revenue"
  value="$2,450"
  icon={cash}
  color="green"
  trend={{ value: 12.5, direction: 'up' }}
/>

// With trend indicator (down)
<StatCard
  title="Pending Tasks"
  value={23}
  icon={car}
  color="orange"
  trend={{ value: 5.2, direction: 'down' }}
/>

// Custom color variant
<StatCard
  title="Active Users"
  value={856}
  icon={people}
  color="purple"
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | Required | The label/title for the statistic |
| `value` | `string \| number` | Required | The numeric or string value to display |
| `icon` | `string` | Required | Ionicon name to display |
| `trend` | `{ value: number, direction: 'up' \| 'down' }` | `undefined` | Optional trend indicator |
| `color` | `string` | `'blue'` | Color for the icon background |
| `className` | `string` | `''` | Additional CSS classes to apply |

### Color Variants

The component supports the following color variants for the icon background:

- **blue**: Blue gradient (default)
- **purple**: Purple gradient
- **green**: Green gradient
- **orange**: Orange gradient
- **red**: Red gradient
- **cyan**: Cyan gradient
- **indigo**: Indigo gradient
- **pink**: Pink gradient

Each color uses a gradient from the base color (500) to a darker shade (600).

### Trend Indicators

When a trend is provided:
- **Up trends**: Display with green color and up arrow
- **Down trends**: Display with red color and down arrow
- **Percentage**: Automatically displays absolute value with % symbol
- **Position**: Appears in the top-right corner of the card

```tsx
// Positive trend (green, up arrow)
trend={{ value: 15.7, direction: 'up' }}

// Negative trend (red, down arrow)
trend={{ value: 8.3, direction: 'down' }}

// Handles negative values correctly
trend={{ value: -10, direction: 'down' }} // Displays as "10%"
```

### Value Types

The component accepts both numeric and string values:

```tsx
// Numeric values
<StatCard title="Count" value={1234} icon={people} />

// String values
<StatCard title="Revenue" value="$2,450" icon={cash} />
<StatCard title="Status" value="Active" icon={people} />
<StatCard title="Rating" value="4.8★" icon={people} />
<StatCard title="Progress" value="85%" icon={people} />
```

### Layout Structure

The card is organized into three main sections:

1. **Header Row**: Icon (left) and trend indicator (right)
2. **Value**: Large, bold display of the main metric
3. **Title**: Smaller, muted label below the value

```
┌─────────────────────────────┐
│ [Icon]          [Trend ↑]   │
│                              │
│ 1,234                        │
│ Total Customers              │
└─────────────────────────────┘
```

### Animations

The component includes two types of animations:

1. **Mount Animation**: Fade-in and slide-up effect (300ms)
2. **Hover Animation**: Scale (1.05x) and enhanced shadow

Both animations are smooth and performant, using GPU-accelerated transforms.

### Testing

To test the component visually, navigate to `/test-statcard` in your browser.

The test page includes examples of:
- Basic stat cards
- Cards with trend indicators
- All color variants
- Different value types (numbers and strings)
- Responsive layouts

### Requirements

This component satisfies the following requirements:
- **5.6**: Admin Dashboard visual indicators for key metrics and statistics

### Use Cases

#### Admin Dashboard Overview
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <StatCard
    title="Total Customers"
    value={1234}
    icon={people}
    color="blue"
    trend={{ value: 12.5, direction: 'up' }}
  />
  <StatCard
    title="Active Cleaners"
    value={45}
    icon={car}
    color="purple"
    trend={{ value: 5.2, direction: 'up' }}
  />
  <StatCard
    title="Today's Revenue"
    value="$2,450"
    icon={cash}
    color="green"
    trend={{ value: 8.3, direction: 'down' }}
  />
  <StatCard
    title="Pending Bookings"
    value={23}
    icon={trendingUp}
    color="orange"
    trend={{ value: 15.7, direction: 'up' }}
  />
</div>
```

#### Cleaner Dashboard Stats
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <StatCard
    title="Today's Tasks"
    value={8}
    icon={list}
    color="blue"
  />
  <StatCard
    title="Completed"
    value={5}
    icon={checkmarkCircle}
    color="green"
  />
  <StatCard
    title="Remaining"
    value={3}
    icon={time}
    color="orange"
  />
</div>
```

#### Customer Dashboard Metrics
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <StatCard
    title="Loyalty Points"
    value={2450}
    icon={star}
    color="purple"
    trend={{ value: 10, direction: 'up' }}
  />
  <StatCard
    title="Total Bookings"
    value={18}
    icon={calendar}
    color="blue"
  />
</div>
```

### Responsive Design

The component is fully responsive and works well in various grid layouts:

```tsx
// 4 columns on desktop, 2 on tablet, 1 on mobile
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* StatCards */}
</div>

// 3 columns on desktop, 2 on tablet, 1 on mobile
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* StatCards */}
</div>

// 2 columns on tablet and up, 1 on mobile
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* StatCards */}
</div>
```

### Styling Details

- **Background**: `bg-white/10` with `backdrop-blur-md`
- **Border**: `border-white/20` with `rounded-2xl`
- **Padding**: `p-6` (1.5rem)
- **Icon Container**: Rounded (`rounded-xl`) with gradient background
- **Value Text**: `text-3xl font-bold text-white`
- **Title Text**: `text-sm text-white/70 font-medium`

### Accessibility

- Uses semantic HTML structure
- Icon provides visual context
- Text maintains sufficient contrast
- Hover effects are purely visual enhancements
- Screen readers will announce title and value

### Performance

- **GPU Accelerated**: Uses CSS transforms for animations
- **Optimized Rendering**: Minimal re-renders with React
- **Framer Motion**: Efficient animation library
- **Lightweight**: Small bundle size impact

### Best Practices

1. **Choose Meaningful Colors**: Match colors to the metric's context (green for revenue, red for errors, etc.)
2. **Use Consistent Icons**: Stick to a consistent icon style across your dashboard
3. **Provide Context**: Ensure titles clearly describe what the value represents
4. **Group Related Metrics**: Use grid layouts to organize related statistics
5. **Update Trends Regularly**: Keep trend indicators current and accurate
6. **Format Values Appropriately**: Use currency symbols, percentages, or units as needed

### Combining with Other Components

StatCard works beautifully with other design system components:

```tsx
<GradientBackground variant="blue" animated>
  <div className="container mx-auto p-8">
    <GlassCard variant="light">
      <h2 className="text-2xl font-bold text-white mb-6">
        Dashboard Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={1234}
          icon={people}
          color="blue"
          trend={{ value: 12.5, direction: 'up' }}
        />
        <StatCard
          title="Revenue"
          value="$45.2K"
          icon={cash}
          color="green"
          trend={{ value: 8.3, direction: 'up' }}
        />
        <StatCard
          title="Active Sessions"
          value={856}
          icon={trendingUp}
          color="purple"
        />
      </div>
    </GlassCard>
  </div>
</GradientBackground>
```

### Customization

You can customize the component further with the `className` prop:

```tsx
// Add custom border
<StatCard
  title="Custom"
  value={100}
  icon={people}
  className="border-2 border-cyan-400"
/>

// Adjust spacing
<StatCard
  title="Custom"
  value={100}
  icon={people}
  className="p-8"
/>

// Add custom background
<StatCard
  title="Custom"
  value={100}
  icon={people}
  className="bg-gradient-to-br from-purple-500/30 to-pink-500/30"
/>
```

### Browser Compatibility

The component uses modern CSS features:
- **Backdrop Filter**: Chrome/Edge 76+, Safari 9+, Firefox 103+
- **CSS Grid**: Universal support
- **CSS Transforms**: Universal support with GPU acceleration
- **Gradients**: Universal support

For older browsers, the component will still render but without the blur effect.

### Migration from Basic Cards

If you're replacing basic stat displays:

```tsx
// Before
<div className="bg-white rounded-lg p-4 shadow">
  <div className="text-gray-500 text-sm">Total Users</div>
  <div className="text-2xl font-bold">1,234</div>
</div>

// After
<StatCard
  title="Total Users"
  value={1234}
  icon={people}
  color="blue"
/>
```

The StatCard provides enhanced visual appeal with minimal code changes.


---

## DashboardHeader Component

A consistent header component for all role-specific dashboards. Displays the dashboard title, user information, and provides a logout button. Fully responsive for mobile, tablet, and desktop screens with glassmorphism styling.

### Features

- **User Information Display**: Shows user name and role with proper formatting
- **Logout Functionality**: Prominent logout button with icon
- **Responsive Design**: Adapts layout for mobile, tablet, and desktop
- **Glassmorphism Styling**: Consistent with design system aesthetics
- **Accessibility**: Proper ARIA labels and keyboard navigation support
- **Smooth Animations**: Fade-in animation on mount, hover effects on buttons
- **Mobile Optimization**: Simplified layout on small screens

### Usage

```tsx
import DashboardHeader from '../components/ui/DashboardHeader';
import { useAuthStore } from '../store/authStore';
import { useHistory } from 'react-router-dom';

function Dashboard() {
  const { user, logout } = useAuthStore();
  const history = useHistory();

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  return (
    <DashboardHeader
      title="Admin Dashboard"
      userName={user?.name || ''}
      userRole={user?.role || ''}
      onLogout={handleLogout}
    />
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | Required | The dashboard title to display |
| `userName` | `string` | Required | The name of the logged-in user |
| `userRole` | `string` | Required | The role of the user (ADMIN, CLEANER, CUSTOMER) |
| `onLogout` | `() => void` | Required | Callback function to handle logout action |
| `className` | `string` | `''` | Additional CSS classes to apply |

### Role Formatting

The component automatically formats role strings for display:
- `ADMIN` → `Admin`
- `CLEANER` → `Cleaner`
- `CUSTOMER` → `Customer`

The formatting capitalizes the first letter and lowercases the rest for a clean, professional appearance.

### Responsive Behavior

#### Desktop (lg: 1024px+)
- Full user information displayed (name and role)
- "Logout" text visible on button
- Larger title text (3xl)
- Maximum width container with padding

#### Tablet (sm: 640px - lg: 1023px)
- Full user information displayed (name and role)
- "Logout" text visible on button
- Medium title text (2xl)
- User info in rounded container with icon

#### Mobile (< 640px)
- First name only displayed
- Icon-only logout button (no text)
- Smaller title text (xl)
- Compact layout with minimal padding

### Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  Dashboard Title          [👤 User Name]  [🚪 Logout]   │
│                                Role                      │
└─────────────────────────────────────────────────────────┘
```

Mobile layout:
```
┌──────────────────────────────────────┐
│  Title        [👤 John]  [🚪]        │
└──────────────────────────────────────┘
```

### Styling Details

- **Background**: `bg-white/10` with `backdrop-blur-md`
- **Border**: `border-b border-white/20`
- **Height**: `h-16` on mobile, `h-20` on tablet/desktop
- **Shadow**: `shadow-lg` for depth
- **Title**: Bold, white text with responsive sizing
- **User Info**: Glassmorphism container with icon
- **Logout Button**: Red-tinted with hover effects

### Animations

#### Mount Animation
- Fade-in from opacity 0 to 1
- Slide down from -20px to 0
- Duration: 300ms

#### Logout Button Hover
- Scale: 1.05x on hover
- Scale: 0.95x on tap/click
- Background opacity increase
- Border opacity increase

### Accessibility

- **ARIA Labels**: Logout button has `aria-label="Logout"`
- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Focus Indicators**: Visible focus ring on logout button
- **Semantic HTML**: Uses proper `<header>` and `<button>` elements
- **Screen Reader Support**: All text content is accessible

### Testing

To test the component visually, navigate to `/test-dashboard-header` in your browser.

To run automated tests:
```tsx
import { runAllDashboardHeaderTests } from '../components/ui/DashboardHeader.test';

// In your component or console
runAllDashboardHeaderTests();
```

The test page includes examples of:
- Admin dashboard header
- Cleaner dashboard header
- Customer dashboard header
- Long name handling
- Custom styling
- Responsive behavior

### Requirements

This component satisfies the following requirements:
- **5.1**: Admin Dashboard modern header with user information and navigation
- **6.1**: Cleaner Dashboard modern header with user information and navigation
- **7.1**: Customer Dashboard modern header with user information and navigation

### Use Cases

#### Admin Dashboard
```tsx
<IonPage>
  <DashboardHeader
    title="Admin Dashboard"
    userName="John Doe"
    userRole="ADMIN"
    onLogout={handleLogout}
  />
  <IonContent>
    {/* Dashboard content */}
  </IonContent>
</IonPage>
```

#### Cleaner Dashboard
```tsx
<IonPage>
  <DashboardHeader
    title="My Tasks"
    userName="Jane Smith"
    userRole="CLEANER"
    onLogout={handleLogout}
  />
  <IonContent>
    {/* Task list */}
  </IonContent>
</IonPage>
```

#### Customer Dashboard
```tsx
<IonPage>
  <DashboardHeader
    title="My Bookings"
    userName="Bob Johnson"
    userRole="CUSTOMER"
    onLogout={handleLogout}
  />
  <IonContent>
    {/* Booking history */}
  </IonContent>
</IonPage>
```

#### With GradientBackground
```tsx
<GradientBackground variant="blue" animated>
  <IonPage>
    <DashboardHeader
      title="Dashboard"
      userName={user.name}
      userRole={user.role}
      onLogout={handleLogout}
    />
    <IonContent>
      <div className="p-6">
        {/* Dashboard content */}
      </div>
    </IonContent>
  </IonPage>
</GradientBackground>
```

### Integration with Auth Store

The component is designed to work seamlessly with the Zustand auth store:

```tsx
import { useAuthStore } from '../store/authStore';
import { useHistory } from 'react-router-dom';

function MyDashboard() {
  const { user, logout } = useAuthStore();
  const history = useHistory();

  const handleLogout = () => {
    logout(); // Clear auth state
    history.push('/login'); // Redirect to login
  };

  if (!user) {
    return null; // Or loading state
  }

  return (
    <DashboardHeader
      title="Dashboard"
      userName={user.name}
      userRole={user.role}
      onLogout={handleLogout}
    />
  );
}
```

### Name Handling

The component intelligently handles different name formats:

```tsx
// Full name - shows all on desktop, first name on mobile
userName="John Doe" // Desktop: "John Doe", Mobile: "John"

// Single name - shows as-is
userName="John" // Desktop: "John", Mobile: "John"

// Long name - shows all on desktop, first name on mobile
userName="Christopher Alexander Montgomery"
// Desktop: "Christopher Alexander Montgomery"
// Mobile: "Christopher"

// Name with middle initial
userName="John Q. Public" // Desktop: "John Q. Public", Mobile: "John"
```

### Customization

You can customize the header with the `className` prop:

```tsx
// Add custom border
<DashboardHeader
  title="Dashboard"
  userName="John Doe"
  userRole="ADMIN"
  onLogout={handleLogout}
  className="border-2 border-yellow-400"
/>

// Adjust background opacity
<DashboardHeader
  title="Dashboard"
  userName="John Doe"
  userRole="ADMIN"
  onLogout={handleLogout}
  className="bg-white/20"
/>

// Add custom shadow
<DashboardHeader
  title="Dashboard"
  userName="John Doe"
  userRole="ADMIN"
  onLogout={handleLogout}
  className="shadow-2xl"
/>
```

### Best Practices

1. **Always Provide Logout Handler**: Ensure the `onLogout` callback properly clears auth state and redirects
2. **Use Descriptive Titles**: Make dashboard titles clear and specific to the role
3. **Handle Missing User Data**: Check for user existence before rendering
4. **Consistent Placement**: Always place at the top of the page
5. **Test Responsive Behavior**: Verify the header works well on all screen sizes
6. **Maintain Contrast**: Ensure text is readable against the background

### Common Patterns

#### With Loading State
```tsx
function Dashboard() {
  const { user, logout } = useAuthStore();
  const history = useHistory();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardHeader
      title="Dashboard"
      userName={user.name}
      userRole={user.role}
      onLogout={() => {
        logout();
        history.push('/login');
      }}
    />
  );
}
```

#### With Confirmation Dialog
```tsx
function Dashboard() {
  const { user, logout } = useAuthStore();
  const history = useHistory();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      history.push('/login');
    }
  };

  return (
    <DashboardHeader
      title="Dashboard"
      userName={user?.name || ''}
      userRole={user?.role || ''}
      onLogout={handleLogout}
    />
  );
}
```

#### With Analytics Tracking
```tsx
function Dashboard() {
  const { user, logout } = useAuthStore();
  const history = useHistory();

  const handleLogout = () => {
    // Track logout event
    analytics.track('user_logout', {
      userId: user?.id,
      role: user?.role
    });
    
    logout();
    history.push('/login');
  };

  return (
    <DashboardHeader
      title="Dashboard"
      userName={user?.name || ''}
      userRole={user?.role || ''}
      onLogout={handleLogout}
    />
  );
}
```

### Browser Compatibility

The component uses modern CSS features:
- **Backdrop Filter**: Chrome/Edge 76+, Safari 9+, Firefox 103+
- **Flexbox**: Universal support
- **CSS Transforms**: Universal support with GPU acceleration
- **Responsive Design**: Universal support

For older browsers, the component will still render but without the blur effect.

### Performance

- **Lightweight**: Minimal re-renders with React
- **GPU Accelerated**: Uses CSS transforms for animations
- **Optimized Icons**: Ionicons are efficiently loaded
- **Framer Motion**: Efficient animation library
- **No Heavy Dependencies**: Only uses essential libraries

### Troubleshooting

#### User name not displaying
- Ensure `userName` prop is provided and not empty
- Check that the user object exists in auth store

#### Logout button not working
- Verify `onLogout` callback is properly defined
- Check that logout function clears auth state
- Ensure navigation/redirect is implemented

#### Responsive layout issues
- Test at different breakpoints (640px, 1024px)
- Verify Tailwind CSS is properly configured
- Check for conflicting CSS styles

#### Glassmorphism effect not visible
- Ensure browser supports `backdrop-filter`
- Check that there's content behind the header
- Verify background has sufficient opacity

### Migration from Old Headers

If you're replacing existing headers:

```tsx
// Before
<IonHeader>
  <IonToolbar>
    <IonTitle>Dashboard</IonTitle>
    <IonButtons slot="end">
      <IonButton onClick={logout}>Logout</IonButton>
    </IonButtons>
  </IonToolbar>
</IonHeader>

// After
<DashboardHeader
  title="Dashboard"
  userName={user.name}
  userRole={user.role}
  onLogout={handleLogout}
/>
```

The DashboardHeader provides enhanced visual appeal and consistent user information display with minimal code changes.

### Related Components

- **GradientBackground**: Use as page background for cohesive design
- **GlassCard**: Use for content sections below the header
- **StatCard**: Use for displaying metrics in dashboard content

### Future Enhancements

Potential improvements for future versions:
- Notification bell icon with badge
- User avatar image support
- Dropdown menu for additional user actions
- Theme toggle button
- Search functionality
- Breadcrumb navigation
