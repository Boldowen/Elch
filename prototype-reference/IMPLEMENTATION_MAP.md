# Prototype implementation map

The uploaded Figma Make ZIP was treated as the visual and interaction source of truth. No alternate visual system was introduced.

## Screen mapping

| Prototype screen | Flutter screen |
|---|---|
| Welcome | `lib/screens/welcome_screen.dart` |
| Login / Register / Forgot password | `lib/screens/auth_screen.dart` |
| Explore | `lib/screens/explore_screen.dart` |
| Category list + map | `lib/screens/category_listing_screen.dart` |
| Listing detail | `lib/screens/listing_detail_screen.dart` |
| Guides | `lib/screens/guides_screen.dart` |
| Guide detail | `lib/screens/guide_detail_screen.dart` |
| Trips | `lib/screens/trips_screen.dart` |
| Inbox | `lib/screens/inbox_screen.dart` |
| Chat | `lib/screens/chat_screen.dart` |
| Profile | `lib/screens/profile_screen.dart` |
| Account settings | `lib/screens/account_settings_screen.dart` |
| Saved trips | `lib/screens/saved_trips_screen.dart` |
| Payment methods | `lib/screens/payment_methods_screen.dart` |
| Help center | `lib/screens/help_center_screen.dart` |
| Guide application | `lib/screens/guide_registration_screen.dart` |
| Guide dashboard | `lib/screens/guide_dashboard_screen.dart` |

## Preserved design tokens

- Brand: `#FF385C`
- Brand dark: `#E11D48`
- Ink: `#222222`
- Secondary text: `#717171`
- Intro background: `#0D0F12`
- Intro panel: `#15191F`
- Intro accent: `#FF5A3C`
- Mobile composition target: approximately 430 × 920 logical pixels, responsive outside that size
- Rounded cards, pill filters, asymmetric category masks, fixed booking bar, and five-tab bottom navigation are retained.

## Interaction coverage

Role selection, auth modes, filters, list/map switching, image galleries, favorites, booking confirmation, guide filters, guide packages, chat image sharing, emoji selection, simulated delivery/read receipts, payment selection/removal, settings toggles, FAQ expansion, guide application validation, dashboard request acceptance/decline, availability, logout, and language preference persistence are implemented.
