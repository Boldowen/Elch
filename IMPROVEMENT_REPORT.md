# VenTour сайжруулалтын тайлан

**Тайлангийн огноо:** 2026-07-28
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

### 4.3 Notification

`Notification` entity болон хэрэглэгчийн notification API нэмэгдсэн:

- `GET /notifications` — сүүлийн notification болон unread count
- `PATCH /notifications/:id/read` — нэг notification уншсанаар тэмдэглэх
- `PATCH /notifications/read-all` — бүгдийг уншсанаар тэмдэглэх

Booking үүсэх, accept/decline/cancel хийх, автоматаар expire/start/complete болох,
мөн шинэ message ирэхэд холбогдох хэрэглэгчдэд notification transaction дотор
үүснэ. Өөр хэрэглэгчийн notification-ийг уншсанаар тэмдэглэх боломжгүй.

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

### 7.4 Email verification

- Register хийхэд 256-bit random verification token үүснэ.
- Database-д raw token биш SHA-256 hash хадгалагдана.
- Link 30 минутын хүчинтэй бөгөөд зөвхөн нэг удаа ашиглагдана.
- Нэг token баталгаажмагц бусад идэвхтэй verification link хүчингүй болно.
- Resend нь 60 секундийн database cooldown болон route rate limit-тэй.
- Resend response нь email бүртгэлтэй эсэхийг задруулахгүй.
- Production email delivery Resend API ашиглаж, token болон API key log-д ордоггүй.
- Mobile app `ventour://verify-email` deep link болон resend action дэмжинэ.

### 7.5 Password recovery

- `POST /auth/forgot-password` нь account байгаа эсэхээс үл хамааран ижил response буцаана.
- Reset token raw хэлбэрээр хадгалагдахгүй, SHA-256 hash болон 30 минутын expiry ашиглана.
- Reset link нэг удаа ашиглагдаж, дараа нь тухайн account-ийн бусад reset token хүчингүй болно.
- `POST /auth/reset-password` болон authenticated `POST /auth/change-password` нэмэгдсэн.
- Reset/change амжилттай үед бүх refresh token revoke хийгдэнэ.
- Password 8–64 тэмдэгт, uppercase, lowercase болон number шаардлагатай.
- Mobile app forgot-password screen, `ventour://reset-password` deep link болон change-password form дэмжинэ.

### 7.6 Guide verification audit

- Review бүр reviewer, decision, reason, internal note болон reviewed time хадгална.
- Local knowledge, communication, safety, professionalism assessment breakdown хадгалагдана.
- Document болон reference check тусдаа status-тай.
- Review хийх үеийн application data immutable snapshot болон үлдэнэ.
- Reject decision reason-гүй бол API болон database түвшинд хориглоно.
- Approve хийхийн өмнө document/reference status хоёул `VERIFIED` байх ёстой.
- Нэг pending application дээр concurrent хоёр шийдвэр үүсэхгүй.
- Applicant reject хийлгэсний дараа дахин apply хийсэн ч өмнөх audit history хадгалагдана.
- Approve/reject үр дүн applicant-д notification үүсгэнэ.

### 7.7 Report, block, mute болон moderation

- User block/unblock болон blocked-user list API нэмэгдсэн.
- Block хийхэд хоёр чиглэлийн follow устаж, message/follow/like/comment хаагдана.
- Block хийсэн хэрэглэгчдийн post болон comment feed-д харагдахгүй.
- Conversation mute нь message-г хадгалсаар notification delivery-г зогсооно.
- User, listing, guide, post, message болон booking report дэмжинэ.
- Spam, harassment, scam, unsafe behavior, fake listing, inappropriate content, payment fraud report reason дэмжинэ.
- Admin report queue болон immutable moderation action audit нэмэгдсэн.
- Content remove, warning, temporary/permanent suspension, listing unpublish, guide verification revoke action хэрэгжинэ.
- Suspension хийхэд refresh token revoke болж, JWT болон login дээр account status дахин шалгагдана.
- Temporary suspension хугацаа дуусмагц account автоматаар active болно.
- Mobile chat дээр mute/report/block, admin profile дээр Safety Reports workspace нэмэгдсэн.

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

## 10. Structured pricing

Listing үнэ дараах integer minor-unit бүрэлдэхүүнтэй болсон:

- Base price
- Cleaning fee
- Service fee
- Tax
- Extra guest fee
- Deposit
- ISO 4217 currency

`PricingService` бүх нийлбэр, duration болон guest multiplier, cancellation fee-г
integer arithmetic-аар тооцно. Booking бүр тухайн үеийн бүх price breakdown болон
нийт `amountMinor`-ийг snapshot болгон хадгална. `POST /bookings/quote` endpoint нь
booking хийхээс өмнө серверийн authoritative задаргааг буцаана. Mobile booking
дэлгэц нийт үнэ, fee/tax болон deposit-ийг энэ quote-оор харуулна.

### 10.1 Verified reviews

- Review зөвхөн `COMPLETED` booking-ийн traveler үүсгэнэ.
- `bookingId` unique constraint нэг booking-д нэг review-г баталгаажуулна.
- Guide болон listing booking хоёул review target болж чадна.
- Public review list зөвхөн booking-оор баталгаажсан review харуулна.
- Review create transaction дотор average rating болон review count шинэчлэгдэнэ.
- Rating 1–5, review text 10–2000 тэмдэгтийн validation-тай.
- Mobile Trips дэлгэц completed, review-гүй booking дээр review action харуулна.

### 10.2 Guide ranking recalculation

Ranking нь дараах хэмжүүрүүдээр deterministic байдлаар тооцогдоно:

- Bayesian verified-review quality — 400 хүртэл point
- Completed trips — 200 хүртэл point
- Response rate — 100 хүртэл point
- Acceptance rate — 100 хүртэл point
- Recent activity — 100 хүртэл point
- Admin assessment — 50 хүртэл point
- Provider cancellation — нэг бүр 50 point penalty
- Confirmed moderation report — нэг бүр 100 point penalty

Global review average болон 5-review prior ашигласнаар цөөн review-тэй guide шууд
ranking-ийн дээд хэсэгт гарах эрсдэл буурсан. Ranking цаг тутам автоматаар,
verified review үүсэхэд шууд, мөн admin endpoint-оор гараар дахин тооцогдоно.
Mobile ranking дэлгэц response, acceptance, completed trips болон penalty
хэмжүүрүүдийг ил тод харуулна.

### 10.3 Pilot payment arrangement

- `CASH_ON_ARRIVAL`, `BANK_TRANSFER`, `PROVIDER_TERMINAL` arrangement дэмжинэ.
- Arrangement booking-тэй one-to-one холбоотой бөгөөд amount/currency-г booking snapshot-оос авна.
- Proposal хийсэн тал автоматаар зөвшөөрсөнд тооцогдож, нөгөө тал тусдаа agree хийнэ.
- Хоёр тал зөвшөөрсний дараа status `AGREED` болно.
- Зөвхөн provider мөнгө хүлээн авснаа `PAID` болгож баталгаажуулна.
- Method, instructions, proposer, agreement timestamps болон paid time хадгалагдана.
- Pilot үед `ONLINE_PAYMENT` сервер талаас `ONLINE_PAYMENT_DISABLED` алдаагаар хаалттай.
- Full card number, CVV, password болон OTP авах model/DTO/UI байхгүй.
- Traveler Trips болон Guide workspace-оос booking payment policy удирдана.

## 11. Mobile application өөрчлөлт

- Booking create хүсэлт бүр шинэ UUID idempotency key ашиглана.
- Session expiration global handler нэмэгдсэн.
- Refresh token SecureStore-д шилжсэн.
- Cancellation policy booking хийхээс өмнө харагдана.
- Шинэ `PriceUnit` enum-ийг хэрэглэгчид ойлгомжтой `night/hour/day/person/group/package` текст рүү хөрвүүлнэ.
- Guide workspace дээр provider-ийн listing болон publish/unpublish action харагдана.
- Expo SDK dependency version-ууд SDK 57-той нийцүүлэгдсэн.

## 12. Database migration

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
4. `20260728120000_notifications`
   - Notification entity болон type
   - Unread query index
5. `20260728150000_structured_pricing`
   - Listing price component minor units
   - Booking price snapshot
   - Currency болон non-negative database constraints
6. `20260728180000_email_verification`
   - `emailVerifiedAt`
   - Hashed, expiring, one-time verification token
   - Resend cooldown index
7. `20260728210000_password_recovery`
   - Hashed, expiring, one-time password reset token
   - Per-user request cooldown index
8. `20260728230000_guide_verification_audit`
   - Reviewer болон immutable application snapshot
   - Assessment/document/reference audit
   - Reject reason database constraint
9. `20260729010000_trust_safety`
   - User block болон conversation mute
   - Report queue, reason, target болон status
   - Moderation action audit болон account suspension
10. `20260729030000_verified_reviews`
   - Booking-bound verified review
   - One-review-per-booking unique constraint
   - Guide/listing review indexes болон rating constraint
11. `20260729050000_guide_ranking`
   - Acceptance/cancellation/report metrics
   - Ranking recalculation timestamp болон database range constraints
12. `20260729070000_pilot_payment`
   - Booking-bound payment arrangement
   - Two-party agreement болон payment status timestamps

Бүх арван таван migration-ийг цэвэр PostgreSQL 17 database дээр дарааллаар deploy хийж шалгасан.

## 13. CI ба automated test

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
| Email verification hash/expiry/cooldown/one-time use | PASS |
| Password reset/change болон session revocation | PASS |
| Guide reject/reapply/approve audit history | PASS |
| Block/mute/report/moderation/suspension enforcement | PASS |
| Completed-booking review ownership болон duplicate protection | PASS |
| Bayesian ranking formula болон penalty weights | PASS |
| Response/acceptance/activity/cancellation metric aggregation | PASS |
| Pilot payment proposal/agreement/provider-paid authorization | PASS |

Нийт test suite-ийн одоогийн байдал: **17 integration test, бүгд PASS**. Зарим test нэг test case дотор олон acceptance condition шалгадаг.

Нэмэлт validation:

- Backend TypeScript build: PASS
- Backend ESLint: PASS
- Prisma schema validation: PASS
- Expo Doctor: 20/20 PASS
- Android production export: PASS

## 14. Гол өөрчлөгдсөн файлууд

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

## 15. Үлдсэн эрсдэл ба дараагийн ажил

### Pilot-оос өмнөх өндөр priority

1. Push notification delivery болон device token management.
2. Listing create/edit/inventory-д зориулсан бүрэн mobile form/calendar UI.
3. Provider бүрийн configurable cancellation policy.
4. Timezone болон daylight-saving edge case-ийн нэмэлт тест.
5. Monitoring, backup, restore test болон production secret management.

### Техникийн анхаарах зүйл

- Одоогийн cancellation policy нь бүх booking-д ижил pilot default ашиглаж байна.
- Background lifecycle job database conditional update-аар duplicate transition-ийг хамгаалдаг боловч production олон instance орчинд metrics болон job monitoring нэмэх шаардлагатай.
- Mobile listing management нь одоогоор жагсаалт болон publish/unpublish action-тай; бүрэн create/edit/calendar UX дараагийн ажил.
- Online payment хараахан хэрэгжээгүй.
- Dependency audit-аар илэрсэн vulnerability-уудыг breaking update хийхээс өмнө тусад нь шалгаж, эрсдэлийн үнэлгээ хийх шаардлагатай.

## 16. Дүгнэлт

Эхний milestone болох “хоёр хэрэглэгч давхардахгүй, аюулгүй booking үүсгэж, provider accept/decline, талууд cancel, system start/complete хийж чаддаг болох” үндсэн түвшинд биелсэн.

Дараагийн хөгжүүлэлтийг authentication verification болон trust/safety хэсэгт төвлөрүүлснээр controlled pilot-д шаардлагатай үлдсэн гол эрсдэлүүдийг бууруулах боломжтой.
