import * as runtime from "@prisma/client/runtime/client";
export const PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export const PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export const PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export const PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export const PrismaClientValidationError = runtime.PrismaClientValidationError;
export const sql = runtime.sqltag;
export const empty = runtime.empty;
export const join = runtime.join;
export const raw = runtime.raw;
export const Sql = runtime.Sql;
export const Decimal = runtime.Decimal;
export const getExtensionContext = runtime.Extensions.getExtensionContext;
export const prismaVersion = {
    client: "7.7.0",
    engine: "75cbdc1eb7150937890ad5465d861175c6624711"
};
export const NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
export const DbNull = runtime.DbNull;
export const JsonNull = runtime.JsonNull;
export const AnyNull = runtime.AnyNull;
export const ModelName = {
    User: 'User',
    RefreshToken: 'RefreshToken',
    GuideProfile: 'GuideProfile',
    Listing: 'Listing',
    ListingInventory: 'ListingInventory',
    ListingImage: 'ListingImage',
    Booking: 'Booking',
    BookingEvent: 'BookingEvent',
    IdempotencyKey: 'IdempotencyKey',
    Favorite: 'Favorite',
    Conversation: 'Conversation',
    ConversationParticipant: 'ConversationParticipant',
    Message: 'Message',
    PaymentMethod: 'PaymentMethod',
    Review: 'Review',
    Post: 'Post',
    PostImage: 'PostImage',
    PostLike: 'PostLike',
    PostComment: 'PostComment',
    Follow: 'Follow'
};
export const TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
export const UserScalarFieldEnum = {
    id: 'id',
    email: 'email',
    passwordHash: 'passwordHash',
    name: 'name',
    phone: 'phone',
    avatarUrl: 'avatarUrl',
    provider: 'provider',
    roles: 'roles',
    isVerified: 'isVerified',
    lastLoginAt: 'lastLoginAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
};
export const RefreshTokenScalarFieldEnum = {
    id: 'id',
    tokenHash: 'tokenHash',
    family: 'family',
    userAgent: 'userAgent',
    ipAddress: 'ipAddress',
    expiresAt: 'expiresAt',
    revokedAt: 'revokedAt',
    createdAt: 'createdAt',
    userId: 'userId'
};
export const GuideProfileScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    country: 'country',
    city: 'city',
    bio: 'bio',
    experienceYears: 'experienceYears',
    languages: 'languages',
    expertise: 'expertise',
    availability: 'availability',
    pricingType: 'pricingType',
    price: 'price',
    status: 'status',
    verified: 'verified',
    assessmentScore: 'assessmentScore',
    referenceContact: 'referenceContact',
    codeOfConductAccepted: 'codeOfConductAccepted',
    rankPoints: 'rankPoints',
    completedTrips: 'completedTrips',
    responseRate: 'responseRate',
    rating: 'rating',
    reviewCount: 'reviewCount',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
};
export const ListingScalarFieldEnum = {
    id: 'id',
    slug: 'slug',
    title: 'title',
    location: 'location',
    description: 'description',
    category: 'category',
    price: 'price',
    priceUnit: 'priceUnit',
    datesLabel: 'datesLabel',
    tags: 'tags',
    amenities: 'amenities',
    rating: 'rating',
    reviewCount: 'reviewCount',
    published: 'published',
    status: 'status',
    defaultTotalUnits: 'defaultTotalUnits',
    hostId: 'hostId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
};
export const ListingInventoryScalarFieldEnum = {
    id: 'id',
    listingId: 'listingId',
    date: 'date',
    totalUnits: 'totalUnits',
    reservedUnits: 'reservedUnits',
    availableUnits: 'availableUnits',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const ListingImageScalarFieldEnum = {
    id: 'id',
    url: 'url',
    alt: 'alt',
    sortOrder: 'sortOrder',
    listingId: 'listingId'
};
export const BookingScalarFieldEnum = {
    id: 'id',
    travelerId: 'travelerId',
    guideId: 'guideId',
    listingId: 'listingId',
    startsAt: 'startsAt',
    endsAt: 'endsAt',
    guests: 'guests',
    amount: 'amount',
    currency: 'currency',
    status: 'status',
    note: 'note',
    expiresAt: 'expiresAt',
    cancellationPolicy: 'cancellationPolicy',
    freeCancellationUntil: 'freeCancellationUntil',
    lateCancellationPercent: 'lateCancellationPercent',
    noShowPercent: 'noShowPercent',
    cancellationFee: 'cancellationFee',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    cancelledAt: 'cancelledAt',
    deletedAt: 'deletedAt'
};
export const BookingEventScalarFieldEnum = {
    id: 'id',
    bookingId: 'bookingId',
    actorId: 'actorId',
    actorType: 'actorType',
    fromStatus: 'fromStatus',
    toStatus: 'toStatus',
    eventType: 'eventType',
    reason: 'reason',
    metadata: 'metadata',
    createdAt: 'createdAt'
};
export const IdempotencyKeyScalarFieldEnum = {
    id: 'id',
    key: 'key',
    userId: 'userId',
    requestHash: 'requestHash',
    responseBody: 'responseBody',
    statusCode: 'statusCode',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt'
};
export const FavoriteScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    listingId: 'listingId',
    createdAt: 'createdAt'
};
export const ConversationScalarFieldEnum = {
    id: 'id',
    bookingId: 'bookingId',
    title: 'title',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
};
export const ConversationParticipantScalarFieldEnum = {
    id: 'id',
    conversationId: 'conversationId',
    userId: 'userId',
    lastReadAt: 'lastReadAt',
    joinedAt: 'joinedAt'
};
export const MessageScalarFieldEnum = {
    id: 'id',
    conversationId: 'conversationId',
    senderId: 'senderId',
    type: 'type',
    body: 'body',
    mediaUrl: 'mediaUrl',
    sentAt: 'sentAt',
    deletedAt: 'deletedAt'
};
export const PaymentMethodScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    providerRef: 'providerRef',
    brand: 'brand',
    last4: 'last4',
    expMonth: 'expMonth',
    expYear: 'expYear',
    isDefault: 'isDefault',
    createdAt: 'createdAt',
    deletedAt: 'deletedAt'
};
export const ReviewScalarFieldEnum = {
    id: 'id',
    authorId: 'authorId',
    guideId: 'guideId',
    rating: 'rating',
    text: 'text',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
};
export const PostScalarFieldEnum = {
    id: 'id',
    authorId: 'authorId',
    text: 'text',
    location: 'location',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
};
export const PostImageScalarFieldEnum = {
    id: 'id',
    postId: 'postId',
    url: 'url',
    sortOrder: 'sortOrder'
};
export const PostLikeScalarFieldEnum = {
    id: 'id',
    postId: 'postId',
    userId: 'userId',
    createdAt: 'createdAt'
};
export const PostCommentScalarFieldEnum = {
    id: 'id',
    postId: 'postId',
    authorId: 'authorId',
    text: 'text',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
};
export const FollowScalarFieldEnum = {
    id: 'id',
    followerId: 'followerId',
    followingId: 'followingId',
    createdAt: 'createdAt'
};
export const SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
export const JsonNullValueInput = {
    JsonNull: JsonNull
};
export const NullableJsonNullValueInput = {
    DbNull: DbNull,
    JsonNull: JsonNull
};
export const QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
export const NullsOrder = {
    first: 'first',
    last: 'last'
};
export const JsonNullValueFilter = {
    DbNull: DbNull,
    JsonNull: JsonNull,
    AnyNull: AnyNull
};
export const defineExtension = runtime.Extensions.defineExtension;
//# sourceMappingURL=prismaNamespace.js.map