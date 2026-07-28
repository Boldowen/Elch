# VenTour mobile (Expo React Native)

Expo React Native client for the VenTour NestJS API. Replaces the previous Flutter frontend (archived as `../frontend_flutter_backup`).

## Stack

- Expo SDK 57 + React Native
- React Navigation (native stack + bottom tabs)
- Axios (JWT attach + refresh retry)
- AsyncStorage (session + cache)
- expo-image

## Setup

```bash
cd frontend
npm install
```

### API base URL

Default:

- Android emulator: `http://10.0.2.2:3000/api/v1`
- iOS simulator: `http://localhost:3000/api/v1`

Physical device:

```bash
EXPO_PUBLIC_API_BASE_URL=http://YOUR_LAN_IP:3000/api/v1 npx expo start
```

## Run

Start backend first (from repo root):

```bash
docker compose up --build
# optional seed
docker compose exec backend npm run prisma:seed
```

Then:

```bash
npm start
# press a for Android emulator, or scan QR with Expo Go
```

### Linux watcher limit

If Metro exits with `ENOSPC: System limit for number of file watchers reached`,
increase the inotify limits and restart Expo:

```bash
sudo sysctl -w fs.inotify.max_user_watches=1048576
sudo sysctl -w fs.inotify.max_user_instances=2048
npm start
```

## Seed accounts

| Email | Password | Role |
|-------|----------|------|
| traveler@ventour.mn | Password123! | TRAVELER |
| guide@ventour.mn | Password123! | GUIDE |

## Screens

Welcome, Auth, Explore, Community, Trips, Inbox, Profile, Listing detail, Guides, Guide detail/registration/dashboard/edit/ranking, Chat, Account settings, Saved trips, Payments, Help.
