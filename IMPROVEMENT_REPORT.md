# VenTour сайжруулалтын тайлан

**Тайлангийн огноо:** 2026-07-23  
**Эх төлөвлөгөө:** `ventour_improvement_plan.txt`  
**Хамрах хүрээ:** Phase 0–3-ын pilot-д хамгийн өндөр ач холбогдолтой booking, security, lifecycle, CI болон listing inventory

## 1. Товч дүгнэлт

VenTour MVP-ийн booking урсгалыг pilot ашиглалтад ойртуулах эхний үндсэн ажлууд хийгдэв. Booking үүсгэлт одоо self-booking, давхар booking, давтан хүсэлт болон inventory race condition-оос сервер болон PostgreSQL түвшинд хамгаалагдсан.

Booking-ийн бүрэн төлөв, audit history, cancellation policy, автомат эхлэх/дуусах lifecycle, booking-тэй холбоотой conversation нэмэгдсэн. Mobile application дээр refresh token-ийг secure storage-д шилжүүлж, session expiration урсгалыг сайжруулсан.

Listing management, publish/unpublish workflow болон өдөр тутмын multi-unit inventory нэмэгдэж, CI болон PostgreSQL integration test-үүдээр үндсэн critical нөхцөлүүдийг баталгаажуулдаг болсон.

## 2. Booking security ба найдвартай байдал

### 2.1 Self-booking хамгаалалт

- Хэрэглэгч өөрийн listing-ийг booking хийх боломжгүй.
- Guide өөрийгөө booking хийх боломжгүй.
- API `SELF_BOOKING_NOT_ALLOWED` тогтвортой error code буцаана.
- Listing болон guide хоёр нөхцөлийг integration test шалгана.

### 2.2 Давхар booking ба concurrency

- Guide-ийн давхардсан хугацааг PostgreSQL exclusion constraint хамгаална.
- Идэвхтэй гэж үзэх төлөвүүд:
  - `PENDING`
  - `CONFIRMED`
  - `IN_PROGRESS`
- Listing booking нь өдрийн inventory-г атомикаар reserve хийнэ.
- Inventory 0 болсон үед `BOOKING_TIME_UNAVAILABLE` буцаана.
- Cancel, decline эсвэл expire болсон listing booking-ийн inventory буцаан суларна.

### 2.3 Idempotency

- `POST /bookings` хүсэлт бүр UUID хэлбэрийн `Idempotency-Key` header шаардана.
- Ижил key болон ижил payload дахин ирэхэд өмнөх response-г буцаана.
- Ижил key-г өөр payload-тай ашиглавал `IDEMPOTENCY_KEY_REUSED` алдаа буцаана.
- Idempotency record 24 цагийн хүчинтэй.

### 2.4 Input validation

- Booking note: хамгийн ихдээ 1000 тэмдэгт.
- Message body: хамгийн ихдээ 2000 тэмдэгт.
- User name: 2–100 тэмдэгт.
- Phone: international phone number validation.
- Media URL: зөвхөн HTTPS.
- Listing title, location, description, зураг, amenities болон tags-д хязгаар нэмэгдсэн.

## 3. Booking lifecycle

Booking-ийн төлөвүүдийг дараах байдлаар өргөтгөсөн:

- `DRAFT`
- `PENDING`
- `CONFIRMED`
- `IN_PROGRESS`
- `COMPLETED`
- `DECLINED`
- `CANCELLED_BY_TRAVELER`
- `CANCELLED_BY_PROVIDER`
- `EXPIRED`
- `NO_SHOW`
- `DISPUTED`
- `REFUND_PENDING`
- `REFUNDED`

Хэрэгжсэн transition-ууд:

| Action | Actor | Transition |
|---|---|---|
| Submit | Traveler | Create → `PENDING` |
| Accept | Provider | `PENDING → CONFIRMED` |
| Decline | Provider | `PENDING → DECLINED` |
| Cancel | Traveler | `PENDING/CONFIRMED → CANCELLED_BY_TRAVELER` |
| Cancel | Provider | `CONFIRMED → CANCELLED_BY_PROVIDER` |
| Start | Provider/System | `CONFIRMED → IN_PROGRESS` |
| Complete | Provider/System | `IN_PROGRESS → COMPLETED` |
| Dispute | Participant | `IN_PROGRESS/COMPLETED → DISPUTED` |

Хүчингүй transition үед `BOOKING_TRANSITION_INVALID` буцаана. Concurrent status update үед зөвхөн нэг хүсэлт төлөвийг өөрчилж чадна.

## 4. Audit болон booking conversation

### 4.1 Booking audit

`BookingEvent` model нэмэгдсэн. Дараах мэдээллийг хадгална:

- Booking ID
- Actor ID болон actor type
- Өмнөх болон шинэ төлөв
- Event type
- Reason болон metadata
- Үүссэн хугацаа

User болон system transition бүр audit event үүсгэнэ.

### 4.2 Conversation

Booking үүсэхэд traveler болон provider-ийн conversation автоматаар үүснэ. Дараах үйл явдал system message үүсгэнэ:

- Booking request sent
- Provider accepted/declined
- Traveler/provider cancelled
- Booking expired
- Booking started
- Booking completed
- Dispute opened

## 5. Cancellation policy

Booking хийх үед cancellation нөхцөлийг snapshot болгон хадгалдаг болсон.

Одоогийн pilot default:

- Policy: `FLEXIBLE`
- Үнэгүй цуцлалт: эхлэхээс 24 цагийн өмнө
- Late traveler cancellation: нийт үнийн 20%
- No-show хувь: 100%

Confirmed booking-ийг free cancellation хугацаанаас хойш traveler цуцалбал `cancellationFee` сервер талд decimal arithmetic ашиглан тооцогдоно. Mobile booking дэлгэц дээр нөхцөлийг хүсэлт илгээхээс өмнө харуулна.

## 6. Автомат lifecycle job

`@nestjs/schedule` ашигласан background job минут тутам ажиллана.

- Хугацаандаа provider хариулаагүй `PENDING` хүсэлт → `EXPIRED`.
- Эхлэх хугацаа болсон `CONFIRMED` booking → `IN_PROGRESS`.
- Дуусах хугацаа болсон `IN_PROGRESS` booking → `COMPLETED`.
- Guide booking completed болоход `completedTrips` нэг удаа нэмэгдэнэ.
- Автомат transition бүр audit event болон system message үүсгэнэ.
- Conditional database update ашигласан тул олон application instance зэрэг ажилласан ч нэг transition давхар бүртгэгдэхгүй.

## 7. Authentication ба session security

### 7.1 Token storage

- Access token зөвхөн application memory-д хадгалагдана.
- Refresh token Android Keystore/iOS Keychain-д тулгуурласан Expo SecureStore-д хадгалагдана.
- Preferences болон non-sensitive cache AsyncStorage-д үлдсэн.
- Хуучин AsyncStorage session format-ийг нэг удаа автоматаар secure format руу шилжүүлнэ.

### 7.2 Session expiration

Refresh token хүчингүй эсвэл хугацаа дууссан үед:

1. Memory session цэвэрлэнэ.
2. SecureStore refresh token цэвэрлэнэ.
3. Authentication navigation руу буцна.
4. `Session expired, please sign in again` мэдээлэл харуулна.

### 7.3 Logout all devices

`POST /auth/logout-all` endpoint нэмэгдсэн. Тухайн хэрэглэгчийн revoke хийгдээгүй бүх refresh token-ийг хүчингүй болгоно.

## 8. Listing management

### 8.1 Listing API

| Method | Endpoint | Зориулалт |
|---|---|---|
| `POST` | `/listings` | Draft listing үүсгэх |
| `GET` | `/listings/mine` | Provider-ийн listing-үүд |
| `PATCH` | `/listings/:id` | Listing засах |
| `POST` | `/listings/:id/publish` | Нийтлэх |
| `POST` | `/listings/:id/unpublish` | Нийтлэлээс буулгах |
| `DELETE` | `/listings/:id` | Archive хийх |
| `GET` | `/listings/:id/inventory` | Inventory calendar унших |
| `PATCH` | `/listings/:id/inventory` | Inventory шинэчлэх |

Listing ownership сервер талд шалгагдана. Active booking байгаа listing-ийг archive хийх боломжгүй.

### 8.2 Listing workflow

Дараах төлөвүүд schema-д нэмэгдсэн:

- `DRAFT`
- `PENDING_REVIEW`
- `PUBLISHED`
- `SUSPENDED`
- `ARCHIVED`

Одоогийн provider UI нь draft listing-ийг publish хийх, published listing-ийг unpublish хийх боломжтой.

### 8.3 Structured price unit

String байсан `priceUnit` дараах enum болсон:

- `PER_NIGHT`
- `PER_HOUR`
- `PER_DAY`
- `PER_PERSON`
- `PER_GROUP`
- `PACKAGE`

Хуучин seed болон database value-ууд migration хийх үед шинэ enum руу хөрвөнө.

## 9. Multi-unit inventory

`ListingInventory` нь listing болон өдөр тус бүрээр дараах утгыг хадгална:

- `totalUnits`
- `reservedUnits`
- `availableUnits`

Database invariant:

```text
reservedUnits + availableUnits = totalUnits
```

Мөн бүх unit утга 0-ээс багагүй байна. Provider нийт unit-ийг аль хэдийн reserved болсон хэмжээнээс доош бууруулж чадахгүй.

Booking transaction өдөр бүрийн inventory row-г атомикаар шинэчилдэг. Нэг listing 2 unit-тэй үед 5 зэрэгцээ хүсэлт ирэхэд яг 2 booking үүсэж, үлдсэн хүсэлтүүд availability conflict авдаг нь integration test-ээр баталгаажсан.

## 10. Mobile application өөрчлөлт

- Booking create хүсэлт бүр шинэ UUID idempotency key ашиглана.
- Session expiration global handler нэмэгдсэн.
- Refresh token SecureStore-д шилжсэн.
- Cancellation policy booking хийхээс өмнө харагдана.
- Шинэ `PriceUnit` enum-ийг хэрэглэгчид ойлгомжтой `night/hour/day/person/group/package` текст рүү хөрвүүлнэ.
- Guide workspace дээр provider-ийн listing болон publish/unpublish action харагдана.
- Expo SDK dependency version-ууд SDK 57-той нийцүүлэгдсэн.

## 11. Database migration

Нэмэгдсэн migration-ууд:

1. `20260723000000_booking_reliability`
   - Booking status өргөтгөл
   - BookingEvent
   - IdempotencyKey
   - Guide overlap constraint
   - Booking provider/time constraints
2. `20260723120000_booking_policy_lifecycle`
   - Cancellation policy snapshot
   - Expiration болон lifecycle index
3. `20260723150000_listing_inventory`
   - ListingStatus
   - PriceUnit
   - ListingInventory
   - Multi-unit inventory constraint

Бүх зургаан migration-ийг хоосон PostgreSQL 17 database дээр дарааллаар deploy хийж шалгасан.

## 12. CI ба automated test

GitHub Actions workflow дараах ажлыг автоматаар гүйцэтгэнэ:

1. Backend dependency install
2. Prisma client generate
3. Migration deploy
4. Backend lint
5. Backend build
6. PostgreSQL integration tests
7. Backend Docker image build
8. Mobile dependency install
9. Expo Doctor
10. Android production export

Integration test-ийн үр дүн:

| Test | Үр дүн |
|---|---|
| Listing self-booking | PASS |
| Guide self-booking | PASS |
| Idempotency replay/conflict | PASS |
| 10 concurrent guide requests → 1 booking | PASS |
| Late cancellation fee | PASS |
| Automatic expire/start/complete | PASS |
| Listing create/publish/update/unpublish | PASS |
| 5 requests/2 inventory units → 2 bookings | PASS |
| Cancelled booking inventory release | PASS |

Нийт test suite-ийн одоогийн байдал: **7 integration test, бүгд PASS**. Зарим test нэг test case дотор олон acceptance condition шалгадаг.

Нэмэлт validation:

- Backend TypeScript build: PASS
- Backend ESLint: PASS
- Prisma schema validation: PASS
- Expo Doctor: 20/20 PASS
- Android production export: PASS

## 13. Гол өөрчлөгдсөн файлууд

- `backend/prisma/schema.prisma`
- `backend/src/modules/bookings/bookings.service.ts`
- `backend/src/modules/bookings/booking-lifecycle.service.ts`
- `backend/src/modules/listings/listings.service.ts`
- `backend/src/modules/listings/listings.controller.ts`
- `backend/test/bookings.integration.spec.ts`
- `backend/jest.config.cjs`
- `.github/workflows/ci.yml`
- `frontend/src/services/storage.js`
- `frontend/src/services/api.js`
- `frontend/src/context/AuthContext.js`
- `frontend/src/screens/BookingScreen.js`
- `frontend/src/screens/GuideDashboardScreen.js`

## 14. Үлдсэн эрсдэл ба дараагийн ажил

### Pilot-оос өмнөх өндөр priority

1. Email verification token, expiry, resend cooldown болон rate limit.
2. Forgot/reset/change password; reset хийсний дараа бүх session revoke хийх.
3. Guide verification decision reason болон reviewer audit.
4. Notification entity болон booking/message notification delivery.
5. Report, block, mute болон moderation workflow.
6. Listing create/edit/inventory-д зориулсан бүрэн mobile form/calendar UI.
7. Provider бүрийн configurable cancellation policy.
8. Timezone болон daylight-saving edge case-ийн нэмэлт тест.
9. Structured pricing, tax/fee/deposit болон minor-unit money model.
10. Monitoring, backup, restore test болон production secret management.

### Техникийн анхаарах зүйл

- Одоогийн cancellation policy нь бүх booking-д ижил pilot default ашиглаж байна.
- Background lifecycle job database conditional update-аар duplicate transition-ийг хамгаалдаг боловч production олон instance орчинд metrics болон job monitoring нэмэх шаардлагатай.
- Mobile listing management нь одоогоор жагсаалт болон publish/unpublish action-тай; бүрэн create/edit/calendar UX дараагийн ажил.
- Online payment, verified review болон ranking recalculation хараахан хэрэгжээгүй.
- Dependency audit-аар илэрсэн vulnerability-уудыг breaking update хийхээс өмнө тусад нь шалгаж, эрсдэлийн үнэлгээ хийх шаардлагатай.

## 15. Дүгнэлт

Эхний milestone болох “хоёр хэрэглэгч давхардахгүй, аюулгүй booking үүсгэж, provider accept/decline, талууд cancel, system start/complete хийж чаддаг болох” үндсэн түвшинд биелсэн.

Дараагийн хөгжүүлэлтийг authentication verification болон trust/safety хэсэгт төвлөрүүлснээр controlled pilot-д шаардлагатай үлдсэн гол эрсдэлүүдийг бууруулах боломжтой.
