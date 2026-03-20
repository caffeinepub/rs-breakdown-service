# RS Breakdown Service

## Current State
App has a HomePage with hero section, service selection cards, request form, contact buttons, how-it-works, testimonials, and footer. No splash screen or dedicated landing home page exists. Logo is a simple Truck icon + text.

## Requested Changes (Diff)

### Add
- App logo image (already generated at /assets/generated/rs-logo-transparent.dim_400x400.png)
- SplashScreen component: full-screen animated splash showing the RS logo, brand name, and tagline. Auto-dismisses after ~2.5s with a smooth fade transition.
- After splash, show a new-style Home landing page with large icon cards for each of the 4 services (Jump Start, Fuel Delivery, Flat Tyre, Towing), each with a big icon and title. Tapping a service card scrolls/navigates to the request form.

### Modify
- App.tsx: wrap HomePage with splash screen logic (useState to track if splash is done)
- Header logo: replace Truck icon with the generated RS logo image
- HomePage service section: make the 4 service cards much larger with bigger icons (at least 80px icon in a big circle), the card title bold and prominent
- The splash screen should feel premium: dark bg with yellow glow, animated logo entrance, brand name, tagline "Delhi NCR's #1 Roadside Assistance"

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/src/components/SplashScreen.tsx` - full screen splash with logo, brand name, animated entrance, auto-dismiss after 2.5s
2. Update `App.tsx` to show SplashScreen first, then transition to RouterProvider
3. Update `HomePage.tsx` service cards to be large/prominent with big icons
4. Update header to use the RS logo image instead of Truck icon
