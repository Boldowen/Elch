.PHONY: up down logs seed backend-dev mobile mobile-android

up:
	docker compose up --build

down:
	docker compose down

logs:
	docker compose logs -f backend postgres

seed:
	docker compose exec backend npm run prisma:seed

backend-dev:
	cd backend && npm install && npm run start:dev

mobile:
	cd frontend && npm install && npm start

mobile-android:
	cd frontend && npm install && npx expo start --android
