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

# --- Research reproducibility (plan section 15.3) ---

.PHONY: test backend-test research-test research-metrics

test: backend-test research-test

backend-test:
	cd backend && npm test

research-test:
	python3 -m compileall -q research/scripts research/training research/tests
	python3 -m unittest discover -s research/tests

# Recomputes every primary metric from research/evaluation/primary_metrics.manifest.json.
# ALLOW_DEMO=1 is required while the manifest still points at the demo fixtures.
research-metrics:
	python3 -m research.scripts.run_primary_metrics --force $(if $(ALLOW_DEMO),--allow-demo,)
