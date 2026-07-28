# VenTour Flutter application

The traveler and guide interfaces are translated directly from the supplied prototype components.

```bash
chmod +x scripts/bootstrap_platforms.sh
./scripts/bootstrap_platforms.sh
flutter analyze
flutter run --dart-define=API_BASE_URL=http://10.0.2.2:3000/api/v1
```

Core folders:

- `core/`: configuration, tokens, mock fallback data
- `models/`: serializable app models
- `repositories/`: API/cache boundaries
- `providers/`: Riverpod state
- `services/`: Dio and Hive
- `routes/`: GoRouter routes and transitions
- `screens/`: prototype screens
- `widgets/`: reusable UI components
- `theme/`: centralized Material 3 theme
