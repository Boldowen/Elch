import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../models.js";
import { type PrismaClient } from "./class.js";
export type * from '../models.js';
export type DMMF = typeof runtime.DMMF;
export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>;
export declare const PrismaClientKnownRequestError: typeof runtime.PrismaClientKnownRequestError;
export type PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export declare const PrismaClientUnknownRequestError: typeof runtime.PrismaClientUnknownRequestError;
export type PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export declare const PrismaClientRustPanicError: typeof runtime.PrismaClientRustPanicError;
export type PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export declare const PrismaClientInitializationError: typeof runtime.PrismaClientInitializationError;
export type PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export declare const PrismaClientValidationError: typeof runtime.PrismaClientValidationError;
export type PrismaClientValidationError = runtime.PrismaClientValidationError;
export declare const sql: typeof runtime.sqltag;
export declare const empty: runtime.Sql;
export declare const join: typeof runtime.join;
export declare const raw: typeof runtime.raw;
export declare const Sql: typeof runtime.Sql;
export type Sql = runtime.Sql;
export declare const Decimal: typeof runtime.Decimal;
export type Decimal = runtime.Decimal;
export type DecimalJsLike = runtime.DecimalJsLike;
export type Extension = runtime.Types.Extensions.UserArgs;
export declare const getExtensionContext: typeof runtime.Extensions.getExtensionContext;
export type Args<T, F extends runtime.Operation> = runtime.Types.Public.Args<T, F>;
export type Payload<T, F extends runtime.Operation = never> = runtime.Types.Public.Payload<T, F>;
export type Result<T, A, F extends runtime.Operation> = runtime.Types.Public.Result<T, A, F>;
export type Exact<A, W> = runtime.Types.Public.Exact<A, W>;
export type PrismaVersion = {
    client: string;
    engine: string;
};
export declare const prismaVersion: PrismaVersion;
export type Bytes = runtime.Bytes;
export type JsonObject = runtime.JsonObject;
export type JsonArray = runtime.JsonArray;
export type JsonValue = runtime.JsonValue;
export type InputJsonObject = runtime.InputJsonObject;
export type InputJsonArray = runtime.InputJsonArray;
export type InputJsonValue = runtime.InputJsonValue;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: runtime.DbNullClass;
export declare const JsonNull: runtime.JsonNullClass;
export declare const AnyNull: runtime.AnyNullClass;
type SelectAndInclude = {
    select: any;
    include: any;
};
type SelectAndOmit = {
    select: any;
    omit: any;
};
type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
export type Enumerable<T> = T | Array<T>;
export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
};
export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & (T extends SelectAndInclude ? 'Please either choose `select` or `include`.' : T extends SelectAndOmit ? 'Please either choose `select` or `omit`.' : {});
export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & K;
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
export type XOR<T, U> = T extends object ? U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : U : T;
type IsObject<T extends any> = T extends Array<any> ? False : T extends Date ? False : T extends Uint8Array ? False : T extends BigInt ? False : T extends object ? True : False;
export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;
type __Either<O extends object, K extends Key> = Omit<O, K> & {
    [P in K]: Prisma__Pick<O, P & keyof O>;
}[K];
type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;
type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;
type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
}[strict];
export type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown ? _Either<O, K, strict> : never;
export type Union = any;
export type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
} & {};
export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
} & {};
type _Merge<U extends object> = IntersectOf<Overwrite<U, {
    [K in keyof U]-?: At<U, K>;
}>>;
type Key = string | number | symbol;
type AtStrict<O extends object, K extends Key> = O[K & keyof O];
type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
}[strict];
export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
} & {};
export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
} & {};
type _Record<K extends keyof any, T> = {
    [P in K]: T;
};
type NoExpand<T> = T extends unknown ? T : never;
export type AtLeast<O extends object, K extends string> = NoExpand<O extends unknown ? (K extends keyof O ? {
    [P in K]: O[P];
} & O : O) | {
    [P in keyof O as P extends K ? P : never]-?: O[P];
} & O : never>;
type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;
export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;
export type Boolean = True | False;
export type True = 1;
export type False = 0;
export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
}[B];
export type Extends<A1 extends any, A2 extends any> = [A1] extends [never] ? 0 : A1 extends A2 ? 1 : 0;
export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;
export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
        0: 0;
        1: 1;
    };
    1: {
        0: 1;
        1: 1;
    };
}[B1][B2];
export type Keys<U extends Union> = U extends unknown ? keyof U : never;
export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O ? O[P] : never;
} : never;
type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> = IsObject<T> extends True ? U : T;
export type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True ? T[K] extends infer TK ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never> : never : {} extends FieldPaths<T[K]> ? never : K;
}[keyof T];
type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
export type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;
export type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>;
export type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;
export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;
type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>;
export declare const ModelName: {
    readonly User: "User";
    readonly RefreshToken: "RefreshToken";
    readonly EmailVerificationToken: "EmailVerificationToken";
    readonly PasswordResetToken: "PasswordResetToken";
    readonly GuideProfile: "GuideProfile";
    readonly GuideEvidence: "GuideEvidence";
    readonly CompetencyAttempt: "CompetencyAttempt";
    readonly TourismSource: "TourismSource";
    readonly TourismKnowledge: "TourismKnowledge";
    readonly ResearchRoute: "ResearchRoute";
    readonly RouteNode: "RouteNode";
    readonly RouteEdge: "RouteEdge";
    readonly SafetyPlan: "SafetyPlan";
    readonly SafetyPlanAudit: "SafetyPlanAudit";
    readonly GuideCompetency: "GuideCompetency";
    readonly GuideLanguageAssessment: "GuideLanguageAssessment";
    readonly GuideKnowledgeAssessment: "GuideKnowledgeAssessment";
    readonly GuideSkillAssessment: "GuideSkillAssessment";
    readonly GuideRouteCompetency: "GuideRouteCompetency";
    readonly GuideFirstAid: "GuideFirstAid";
    readonly AssessmentQuestion: "AssessmentQuestion";
    readonly AssessmentAttempt: "AssessmentAttempt";
    readonly AssessmentResponse: "AssessmentResponse";
    readonly AssessmentReview: "AssessmentReview";
    readonly AiConversation: "AiConversation";
    readonly AiMessage: "AiMessage";
    readonly AiExperimentRun: "AiExperimentRun";
    readonly AiEvaluationResult: "AiEvaluationResult";
    readonly GuideMatchRun: "GuideMatchRun";
    readonly GuideMatchResult: "GuideMatchResult";
    readonly GuideVerificationReview: "GuideVerificationReview";
    readonly Listing: "Listing";
    readonly ListingInventory: "ListingInventory";
    readonly ListingImage: "ListingImage";
    readonly Booking: "Booking";
    readonly PilotPayment: "PilotPayment";
    readonly BookingEvent: "BookingEvent";
    readonly IdempotencyKey: "IdempotencyKey";
    readonly Favorite: "Favorite";
    readonly Conversation: "Conversation";
    readonly ConversationParticipant: "ConversationParticipant";
    readonly UserBlock: "UserBlock";
    readonly Report: "Report";
    readonly ModerationAction: "ModerationAction";
    readonly Message: "Message";
    readonly Notification: "Notification";
    readonly PaymentMethod: "PaymentMethod";
    readonly Review: "Review";
    readonly Post: "Post";
    readonly PostImage: "PostImage";
    readonly PostLike: "PostLike";
    readonly PostComment: "PostComment";
    readonly Follow: "Follow";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export interface TypeMapCb<GlobalOmitOptions = {}> extends runtime.Types.Utils.Fn<{
    extArgs: runtime.Types.Extensions.InternalArgs;
}, runtime.Types.Utils.Record<string, any>> {
    returns: TypeMap<this['params']['extArgs'], GlobalOmitOptions>;
}
export type TypeMap<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
        omit: GlobalOmitOptions;
    };
    meta: {
        modelProps: "user" | "refreshToken" | "emailVerificationToken" | "passwordResetToken" | "guideProfile" | "guideEvidence" | "competencyAttempt" | "tourismSource" | "tourismKnowledge" | "researchRoute" | "routeNode" | "routeEdge" | "safetyPlan" | "safetyPlanAudit" | "guideCompetency" | "guideLanguageAssessment" | "guideKnowledgeAssessment" | "guideSkillAssessment" | "guideRouteCompetency" | "guideFirstAid" | "assessmentQuestion" | "assessmentAttempt" | "assessmentResponse" | "assessmentReview" | "aiConversation" | "aiMessage" | "aiExperimentRun" | "aiEvaluationResult" | "guideMatchRun" | "guideMatchResult" | "guideVerificationReview" | "listing" | "listingInventory" | "listingImage" | "booking" | "pilotPayment" | "bookingEvent" | "idempotencyKey" | "favorite" | "conversation" | "conversationParticipant" | "userBlock" | "report" | "moderationAction" | "message" | "notification" | "paymentMethod" | "review" | "post" | "postImage" | "postLike" | "postComment" | "follow";
        txIsolationLevel: TransactionIsolationLevel;
    };
    model: {
        User: {
            payload: Prisma.$UserPayload<ExtArgs>;
            fields: Prisma.UserFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.UserFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findFirst: {
                    args: Prisma.UserFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findMany: {
                    args: Prisma.UserFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                create: {
                    args: Prisma.UserCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                createMany: {
                    args: Prisma.UserCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                delete: {
                    args: Prisma.UserDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                update: {
                    args: Prisma.UserUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                deleteMany: {
                    args: Prisma.UserDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.UserUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                upsert: {
                    args: Prisma.UserUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                aggregate: {
                    args: Prisma.UserAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUser>;
                };
                groupBy: {
                    args: Prisma.UserGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserGroupByOutputType>[];
                };
                count: {
                    args: Prisma.UserCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserCountAggregateOutputType> | number;
                };
            };
        };
        RefreshToken: {
            payload: Prisma.$RefreshTokenPayload<ExtArgs>;
            fields: Prisma.RefreshTokenFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RefreshTokenFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RefreshTokenFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>;
                };
                findFirst: {
                    args: Prisma.RefreshTokenFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RefreshTokenFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>;
                };
                findMany: {
                    args: Prisma.RefreshTokenFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>[];
                };
                create: {
                    args: Prisma.RefreshTokenCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>;
                };
                createMany: {
                    args: Prisma.RefreshTokenCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.RefreshTokenCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>[];
                };
                delete: {
                    args: Prisma.RefreshTokenDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>;
                };
                update: {
                    args: Prisma.RefreshTokenUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>;
                };
                deleteMany: {
                    args: Prisma.RefreshTokenDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RefreshTokenUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.RefreshTokenUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>[];
                };
                upsert: {
                    args: Prisma.RefreshTokenUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>;
                };
                aggregate: {
                    args: Prisma.RefreshTokenAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRefreshToken>;
                };
                groupBy: {
                    args: Prisma.RefreshTokenGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RefreshTokenGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RefreshTokenCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RefreshTokenCountAggregateOutputType> | number;
                };
            };
        };
        EmailVerificationToken: {
            payload: Prisma.$EmailVerificationTokenPayload<ExtArgs>;
            fields: Prisma.EmailVerificationTokenFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.EmailVerificationTokenFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.EmailVerificationTokenFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload>;
                };
                findFirst: {
                    args: Prisma.EmailVerificationTokenFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.EmailVerificationTokenFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload>;
                };
                findMany: {
                    args: Prisma.EmailVerificationTokenFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload>[];
                };
                create: {
                    args: Prisma.EmailVerificationTokenCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload>;
                };
                createMany: {
                    args: Prisma.EmailVerificationTokenCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.EmailVerificationTokenCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload>[];
                };
                delete: {
                    args: Prisma.EmailVerificationTokenDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload>;
                };
                update: {
                    args: Prisma.EmailVerificationTokenUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload>;
                };
                deleteMany: {
                    args: Prisma.EmailVerificationTokenDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.EmailVerificationTokenUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.EmailVerificationTokenUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload>[];
                };
                upsert: {
                    args: Prisma.EmailVerificationTokenUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload>;
                };
                aggregate: {
                    args: Prisma.EmailVerificationTokenAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateEmailVerificationToken>;
                };
                groupBy: {
                    args: Prisma.EmailVerificationTokenGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.EmailVerificationTokenGroupByOutputType>[];
                };
                count: {
                    args: Prisma.EmailVerificationTokenCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.EmailVerificationTokenCountAggregateOutputType> | number;
                };
            };
        };
        PasswordResetToken: {
            payload: Prisma.$PasswordResetTokenPayload<ExtArgs>;
            fields: Prisma.PasswordResetTokenFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PasswordResetTokenFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PasswordResetTokenFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>;
                };
                findFirst: {
                    args: Prisma.PasswordResetTokenFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PasswordResetTokenFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>;
                };
                findMany: {
                    args: Prisma.PasswordResetTokenFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>[];
                };
                create: {
                    args: Prisma.PasswordResetTokenCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>;
                };
                createMany: {
                    args: Prisma.PasswordResetTokenCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PasswordResetTokenCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>[];
                };
                delete: {
                    args: Prisma.PasswordResetTokenDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>;
                };
                update: {
                    args: Prisma.PasswordResetTokenUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>;
                };
                deleteMany: {
                    args: Prisma.PasswordResetTokenDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PasswordResetTokenUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PasswordResetTokenUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>[];
                };
                upsert: {
                    args: Prisma.PasswordResetTokenUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>;
                };
                aggregate: {
                    args: Prisma.PasswordResetTokenAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePasswordResetToken>;
                };
                groupBy: {
                    args: Prisma.PasswordResetTokenGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PasswordResetTokenGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PasswordResetTokenCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PasswordResetTokenCountAggregateOutputType> | number;
                };
            };
        };
        GuideProfile: {
            payload: Prisma.$GuideProfilePayload<ExtArgs>;
            fields: Prisma.GuideProfileFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.GuideProfileFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideProfilePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.GuideProfileFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideProfilePayload>;
                };
                findFirst: {
                    args: Prisma.GuideProfileFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideProfilePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.GuideProfileFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideProfilePayload>;
                };
                findMany: {
                    args: Prisma.GuideProfileFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideProfilePayload>[];
                };
                create: {
                    args: Prisma.GuideProfileCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideProfilePayload>;
                };
                createMany: {
                    args: Prisma.GuideProfileCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.GuideProfileCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideProfilePayload>[];
                };
                delete: {
                    args: Prisma.GuideProfileDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideProfilePayload>;
                };
                update: {
                    args: Prisma.GuideProfileUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideProfilePayload>;
                };
                deleteMany: {
                    args: Prisma.GuideProfileDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.GuideProfileUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.GuideProfileUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideProfilePayload>[];
                };
                upsert: {
                    args: Prisma.GuideProfileUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideProfilePayload>;
                };
                aggregate: {
                    args: Prisma.GuideProfileAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateGuideProfile>;
                };
                groupBy: {
                    args: Prisma.GuideProfileGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.GuideProfileGroupByOutputType>[];
                };
                count: {
                    args: Prisma.GuideProfileCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.GuideProfileCountAggregateOutputType> | number;
                };
            };
        };
        GuideEvidence: {
            payload: Prisma.$GuideEvidencePayload<ExtArgs>;
            fields: Prisma.GuideEvidenceFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.GuideEvidenceFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideEvidencePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.GuideEvidenceFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideEvidencePayload>;
                };
                findFirst: {
                    args: Prisma.GuideEvidenceFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideEvidencePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.GuideEvidenceFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideEvidencePayload>;
                };
                findMany: {
                    args: Prisma.GuideEvidenceFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideEvidencePayload>[];
                };
                create: {
                    args: Prisma.GuideEvidenceCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideEvidencePayload>;
                };
                createMany: {
                    args: Prisma.GuideEvidenceCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.GuideEvidenceCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideEvidencePayload>[];
                };
                delete: {
                    args: Prisma.GuideEvidenceDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideEvidencePayload>;
                };
                update: {
                    args: Prisma.GuideEvidenceUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideEvidencePayload>;
                };
                deleteMany: {
                    args: Prisma.GuideEvidenceDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.GuideEvidenceUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.GuideEvidenceUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideEvidencePayload>[];
                };
                upsert: {
                    args: Prisma.GuideEvidenceUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideEvidencePayload>;
                };
                aggregate: {
                    args: Prisma.GuideEvidenceAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateGuideEvidence>;
                };
                groupBy: {
                    args: Prisma.GuideEvidenceGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.GuideEvidenceGroupByOutputType>[];
                };
                count: {
                    args: Prisma.GuideEvidenceCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.GuideEvidenceCountAggregateOutputType> | number;
                };
            };
        };
        CompetencyAttempt: {
            payload: Prisma.$CompetencyAttemptPayload<ExtArgs>;
            fields: Prisma.CompetencyAttemptFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CompetencyAttemptFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompetencyAttemptPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CompetencyAttemptFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompetencyAttemptPayload>;
                };
                findFirst: {
                    args: Prisma.CompetencyAttemptFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompetencyAttemptPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CompetencyAttemptFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompetencyAttemptPayload>;
                };
                findMany: {
                    args: Prisma.CompetencyAttemptFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompetencyAttemptPayload>[];
                };
                create: {
                    args: Prisma.CompetencyAttemptCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompetencyAttemptPayload>;
                };
                createMany: {
                    args: Prisma.CompetencyAttemptCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CompetencyAttemptCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompetencyAttemptPayload>[];
                };
                delete: {
                    args: Prisma.CompetencyAttemptDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompetencyAttemptPayload>;
                };
                update: {
                    args: Prisma.CompetencyAttemptUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompetencyAttemptPayload>;
                };
                deleteMany: {
                    args: Prisma.CompetencyAttemptDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CompetencyAttemptUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CompetencyAttemptUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompetencyAttemptPayload>[];
                };
                upsert: {
                    args: Prisma.CompetencyAttemptUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompetencyAttemptPayload>;
                };
                aggregate: {
                    args: Prisma.CompetencyAttemptAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCompetencyAttempt>;
                };
                groupBy: {
                    args: Prisma.CompetencyAttemptGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CompetencyAttemptGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CompetencyAttemptCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CompetencyAttemptCountAggregateOutputType> | number;
                };
            };
        };
        TourismSource: {
            payload: Prisma.$TourismSourcePayload<ExtArgs>;
            fields: Prisma.TourismSourceFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TourismSourceFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TourismSourcePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TourismSourceFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TourismSourcePayload>;
                };
                findFirst: {
                    args: Prisma.TourismSourceFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TourismSourcePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TourismSourceFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TourismSourcePayload>;
                };
                findMany: {
                    args: Prisma.TourismSourceFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TourismSourcePayload>[];
                };
                create: {
                    args: Prisma.TourismSourceCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TourismSourcePayload>;
                };
                createMany: {
                    args: Prisma.TourismSourceCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.TourismSourceCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TourismSourcePayload>[];
                };
                delete: {
                    args: Prisma.TourismSourceDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TourismSourcePayload>;
                };
                update: {
                    args: Prisma.TourismSourceUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TourismSourcePayload>;
                };
                deleteMany: {
                    args: Prisma.TourismSourceDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TourismSourceUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.TourismSourceUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TourismSourcePayload>[];
                };
                upsert: {
                    args: Prisma.TourismSourceUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TourismSourcePayload>;
                };
                aggregate: {
                    args: Prisma.TourismSourceAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTourismSource>;
                };
                groupBy: {
                    args: Prisma.TourismSourceGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TourismSourceGroupByOutputType>[];
                };
                count: {
                    args: Prisma.TourismSourceCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TourismSourceCountAggregateOutputType> | number;
                };
            };
        };
        TourismKnowledge: {
            payload: Prisma.$TourismKnowledgePayload<ExtArgs>;
            fields: Prisma.TourismKnowledgeFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TourismKnowledgeFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TourismKnowledgePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TourismKnowledgeFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TourismKnowledgePayload>;
                };
                findFirst: {
                    args: Prisma.TourismKnowledgeFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TourismKnowledgePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TourismKnowledgeFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TourismKnowledgePayload>;
                };
                findMany: {
                    args: Prisma.TourismKnowledgeFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TourismKnowledgePayload>[];
                };
                create: {
                    args: Prisma.TourismKnowledgeCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TourismKnowledgePayload>;
                };
                createMany: {
                    args: Prisma.TourismKnowledgeCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.TourismKnowledgeCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TourismKnowledgePayload>[];
                };
                delete: {
                    args: Prisma.TourismKnowledgeDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TourismKnowledgePayload>;
                };
                update: {
                    args: Prisma.TourismKnowledgeUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TourismKnowledgePayload>;
                };
                deleteMany: {
                    args: Prisma.TourismKnowledgeDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TourismKnowledgeUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.TourismKnowledgeUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TourismKnowledgePayload>[];
                };
                upsert: {
                    args: Prisma.TourismKnowledgeUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TourismKnowledgePayload>;
                };
                aggregate: {
                    args: Prisma.TourismKnowledgeAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTourismKnowledge>;
                };
                groupBy: {
                    args: Prisma.TourismKnowledgeGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TourismKnowledgeGroupByOutputType>[];
                };
                count: {
                    args: Prisma.TourismKnowledgeCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TourismKnowledgeCountAggregateOutputType> | number;
                };
            };
        };
        ResearchRoute: {
            payload: Prisma.$ResearchRoutePayload<ExtArgs>;
            fields: Prisma.ResearchRouteFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ResearchRouteFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ResearchRoutePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ResearchRouteFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ResearchRoutePayload>;
                };
                findFirst: {
                    args: Prisma.ResearchRouteFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ResearchRoutePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ResearchRouteFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ResearchRoutePayload>;
                };
                findMany: {
                    args: Prisma.ResearchRouteFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ResearchRoutePayload>[];
                };
                create: {
                    args: Prisma.ResearchRouteCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ResearchRoutePayload>;
                };
                createMany: {
                    args: Prisma.ResearchRouteCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ResearchRouteCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ResearchRoutePayload>[];
                };
                delete: {
                    args: Prisma.ResearchRouteDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ResearchRoutePayload>;
                };
                update: {
                    args: Prisma.ResearchRouteUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ResearchRoutePayload>;
                };
                deleteMany: {
                    args: Prisma.ResearchRouteDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ResearchRouteUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ResearchRouteUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ResearchRoutePayload>[];
                };
                upsert: {
                    args: Prisma.ResearchRouteUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ResearchRoutePayload>;
                };
                aggregate: {
                    args: Prisma.ResearchRouteAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateResearchRoute>;
                };
                groupBy: {
                    args: Prisma.ResearchRouteGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ResearchRouteGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ResearchRouteCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ResearchRouteCountAggregateOutputType> | number;
                };
            };
        };
        RouteNode: {
            payload: Prisma.$RouteNodePayload<ExtArgs>;
            fields: Prisma.RouteNodeFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RouteNodeFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteNodePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RouteNodeFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteNodePayload>;
                };
                findFirst: {
                    args: Prisma.RouteNodeFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteNodePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RouteNodeFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteNodePayload>;
                };
                findMany: {
                    args: Prisma.RouteNodeFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteNodePayload>[];
                };
                create: {
                    args: Prisma.RouteNodeCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteNodePayload>;
                };
                createMany: {
                    args: Prisma.RouteNodeCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.RouteNodeCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteNodePayload>[];
                };
                delete: {
                    args: Prisma.RouteNodeDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteNodePayload>;
                };
                update: {
                    args: Prisma.RouteNodeUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteNodePayload>;
                };
                deleteMany: {
                    args: Prisma.RouteNodeDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RouteNodeUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.RouteNodeUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteNodePayload>[];
                };
                upsert: {
                    args: Prisma.RouteNodeUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteNodePayload>;
                };
                aggregate: {
                    args: Prisma.RouteNodeAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRouteNode>;
                };
                groupBy: {
                    args: Prisma.RouteNodeGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RouteNodeGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RouteNodeCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RouteNodeCountAggregateOutputType> | number;
                };
            };
        };
        RouteEdge: {
            payload: Prisma.$RouteEdgePayload<ExtArgs>;
            fields: Prisma.RouteEdgeFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RouteEdgeFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteEdgePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RouteEdgeFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteEdgePayload>;
                };
                findFirst: {
                    args: Prisma.RouteEdgeFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteEdgePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RouteEdgeFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteEdgePayload>;
                };
                findMany: {
                    args: Prisma.RouteEdgeFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteEdgePayload>[];
                };
                create: {
                    args: Prisma.RouteEdgeCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteEdgePayload>;
                };
                createMany: {
                    args: Prisma.RouteEdgeCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.RouteEdgeCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteEdgePayload>[];
                };
                delete: {
                    args: Prisma.RouteEdgeDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteEdgePayload>;
                };
                update: {
                    args: Prisma.RouteEdgeUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteEdgePayload>;
                };
                deleteMany: {
                    args: Prisma.RouteEdgeDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RouteEdgeUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.RouteEdgeUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteEdgePayload>[];
                };
                upsert: {
                    args: Prisma.RouteEdgeUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteEdgePayload>;
                };
                aggregate: {
                    args: Prisma.RouteEdgeAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRouteEdge>;
                };
                groupBy: {
                    args: Prisma.RouteEdgeGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RouteEdgeGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RouteEdgeCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RouteEdgeCountAggregateOutputType> | number;
                };
            };
        };
        SafetyPlan: {
            payload: Prisma.$SafetyPlanPayload<ExtArgs>;
            fields: Prisma.SafetyPlanFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.SafetyPlanFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SafetyPlanPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.SafetyPlanFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SafetyPlanPayload>;
                };
                findFirst: {
                    args: Prisma.SafetyPlanFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SafetyPlanPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.SafetyPlanFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SafetyPlanPayload>;
                };
                findMany: {
                    args: Prisma.SafetyPlanFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SafetyPlanPayload>[];
                };
                create: {
                    args: Prisma.SafetyPlanCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SafetyPlanPayload>;
                };
                createMany: {
                    args: Prisma.SafetyPlanCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.SafetyPlanCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SafetyPlanPayload>[];
                };
                delete: {
                    args: Prisma.SafetyPlanDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SafetyPlanPayload>;
                };
                update: {
                    args: Prisma.SafetyPlanUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SafetyPlanPayload>;
                };
                deleteMany: {
                    args: Prisma.SafetyPlanDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.SafetyPlanUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.SafetyPlanUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SafetyPlanPayload>[];
                };
                upsert: {
                    args: Prisma.SafetyPlanUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SafetyPlanPayload>;
                };
                aggregate: {
                    args: Prisma.SafetyPlanAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSafetyPlan>;
                };
                groupBy: {
                    args: Prisma.SafetyPlanGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SafetyPlanGroupByOutputType>[];
                };
                count: {
                    args: Prisma.SafetyPlanCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SafetyPlanCountAggregateOutputType> | number;
                };
            };
        };
        SafetyPlanAudit: {
            payload: Prisma.$SafetyPlanAuditPayload<ExtArgs>;
            fields: Prisma.SafetyPlanAuditFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.SafetyPlanAuditFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SafetyPlanAuditPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.SafetyPlanAuditFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SafetyPlanAuditPayload>;
                };
                findFirst: {
                    args: Prisma.SafetyPlanAuditFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SafetyPlanAuditPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.SafetyPlanAuditFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SafetyPlanAuditPayload>;
                };
                findMany: {
                    args: Prisma.SafetyPlanAuditFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SafetyPlanAuditPayload>[];
                };
                create: {
                    args: Prisma.SafetyPlanAuditCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SafetyPlanAuditPayload>;
                };
                createMany: {
                    args: Prisma.SafetyPlanAuditCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.SafetyPlanAuditCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SafetyPlanAuditPayload>[];
                };
                delete: {
                    args: Prisma.SafetyPlanAuditDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SafetyPlanAuditPayload>;
                };
                update: {
                    args: Prisma.SafetyPlanAuditUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SafetyPlanAuditPayload>;
                };
                deleteMany: {
                    args: Prisma.SafetyPlanAuditDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.SafetyPlanAuditUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.SafetyPlanAuditUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SafetyPlanAuditPayload>[];
                };
                upsert: {
                    args: Prisma.SafetyPlanAuditUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SafetyPlanAuditPayload>;
                };
                aggregate: {
                    args: Prisma.SafetyPlanAuditAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSafetyPlanAudit>;
                };
                groupBy: {
                    args: Prisma.SafetyPlanAuditGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SafetyPlanAuditGroupByOutputType>[];
                };
                count: {
                    args: Prisma.SafetyPlanAuditCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SafetyPlanAuditCountAggregateOutputType> | number;
                };
            };
        };
        GuideCompetency: {
            payload: Prisma.$GuideCompetencyPayload<ExtArgs>;
            fields: Prisma.GuideCompetencyFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.GuideCompetencyFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideCompetencyPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.GuideCompetencyFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideCompetencyPayload>;
                };
                findFirst: {
                    args: Prisma.GuideCompetencyFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideCompetencyPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.GuideCompetencyFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideCompetencyPayload>;
                };
                findMany: {
                    args: Prisma.GuideCompetencyFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideCompetencyPayload>[];
                };
                create: {
                    args: Prisma.GuideCompetencyCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideCompetencyPayload>;
                };
                createMany: {
                    args: Prisma.GuideCompetencyCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.GuideCompetencyCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideCompetencyPayload>[];
                };
                delete: {
                    args: Prisma.GuideCompetencyDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideCompetencyPayload>;
                };
                update: {
                    args: Prisma.GuideCompetencyUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideCompetencyPayload>;
                };
                deleteMany: {
                    args: Prisma.GuideCompetencyDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.GuideCompetencyUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.GuideCompetencyUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideCompetencyPayload>[];
                };
                upsert: {
                    args: Prisma.GuideCompetencyUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideCompetencyPayload>;
                };
                aggregate: {
                    args: Prisma.GuideCompetencyAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateGuideCompetency>;
                };
                groupBy: {
                    args: Prisma.GuideCompetencyGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.GuideCompetencyGroupByOutputType>[];
                };
                count: {
                    args: Prisma.GuideCompetencyCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.GuideCompetencyCountAggregateOutputType> | number;
                };
            };
        };
        GuideLanguageAssessment: {
            payload: Prisma.$GuideLanguageAssessmentPayload<ExtArgs>;
            fields: Prisma.GuideLanguageAssessmentFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.GuideLanguageAssessmentFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideLanguageAssessmentPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.GuideLanguageAssessmentFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideLanguageAssessmentPayload>;
                };
                findFirst: {
                    args: Prisma.GuideLanguageAssessmentFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideLanguageAssessmentPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.GuideLanguageAssessmentFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideLanguageAssessmentPayload>;
                };
                findMany: {
                    args: Prisma.GuideLanguageAssessmentFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideLanguageAssessmentPayload>[];
                };
                create: {
                    args: Prisma.GuideLanguageAssessmentCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideLanguageAssessmentPayload>;
                };
                createMany: {
                    args: Prisma.GuideLanguageAssessmentCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.GuideLanguageAssessmentCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideLanguageAssessmentPayload>[];
                };
                delete: {
                    args: Prisma.GuideLanguageAssessmentDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideLanguageAssessmentPayload>;
                };
                update: {
                    args: Prisma.GuideLanguageAssessmentUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideLanguageAssessmentPayload>;
                };
                deleteMany: {
                    args: Prisma.GuideLanguageAssessmentDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.GuideLanguageAssessmentUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.GuideLanguageAssessmentUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideLanguageAssessmentPayload>[];
                };
                upsert: {
                    args: Prisma.GuideLanguageAssessmentUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideLanguageAssessmentPayload>;
                };
                aggregate: {
                    args: Prisma.GuideLanguageAssessmentAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateGuideLanguageAssessment>;
                };
                groupBy: {
                    args: Prisma.GuideLanguageAssessmentGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.GuideLanguageAssessmentGroupByOutputType>[];
                };
                count: {
                    args: Prisma.GuideLanguageAssessmentCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.GuideLanguageAssessmentCountAggregateOutputType> | number;
                };
            };
        };
        GuideKnowledgeAssessment: {
            payload: Prisma.$GuideKnowledgeAssessmentPayload<ExtArgs>;
            fields: Prisma.GuideKnowledgeAssessmentFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.GuideKnowledgeAssessmentFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideKnowledgeAssessmentPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.GuideKnowledgeAssessmentFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideKnowledgeAssessmentPayload>;
                };
                findFirst: {
                    args: Prisma.GuideKnowledgeAssessmentFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideKnowledgeAssessmentPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.GuideKnowledgeAssessmentFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideKnowledgeAssessmentPayload>;
                };
                findMany: {
                    args: Prisma.GuideKnowledgeAssessmentFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideKnowledgeAssessmentPayload>[];
                };
                create: {
                    args: Prisma.GuideKnowledgeAssessmentCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideKnowledgeAssessmentPayload>;
                };
                createMany: {
                    args: Prisma.GuideKnowledgeAssessmentCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.GuideKnowledgeAssessmentCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideKnowledgeAssessmentPayload>[];
                };
                delete: {
                    args: Prisma.GuideKnowledgeAssessmentDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideKnowledgeAssessmentPayload>;
                };
                update: {
                    args: Prisma.GuideKnowledgeAssessmentUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideKnowledgeAssessmentPayload>;
                };
                deleteMany: {
                    args: Prisma.GuideKnowledgeAssessmentDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.GuideKnowledgeAssessmentUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.GuideKnowledgeAssessmentUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideKnowledgeAssessmentPayload>[];
                };
                upsert: {
                    args: Prisma.GuideKnowledgeAssessmentUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideKnowledgeAssessmentPayload>;
                };
                aggregate: {
                    args: Prisma.GuideKnowledgeAssessmentAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateGuideKnowledgeAssessment>;
                };
                groupBy: {
                    args: Prisma.GuideKnowledgeAssessmentGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.GuideKnowledgeAssessmentGroupByOutputType>[];
                };
                count: {
                    args: Prisma.GuideKnowledgeAssessmentCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.GuideKnowledgeAssessmentCountAggregateOutputType> | number;
                };
            };
        };
        GuideSkillAssessment: {
            payload: Prisma.$GuideSkillAssessmentPayload<ExtArgs>;
            fields: Prisma.GuideSkillAssessmentFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.GuideSkillAssessmentFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideSkillAssessmentPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.GuideSkillAssessmentFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideSkillAssessmentPayload>;
                };
                findFirst: {
                    args: Prisma.GuideSkillAssessmentFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideSkillAssessmentPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.GuideSkillAssessmentFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideSkillAssessmentPayload>;
                };
                findMany: {
                    args: Prisma.GuideSkillAssessmentFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideSkillAssessmentPayload>[];
                };
                create: {
                    args: Prisma.GuideSkillAssessmentCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideSkillAssessmentPayload>;
                };
                createMany: {
                    args: Prisma.GuideSkillAssessmentCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.GuideSkillAssessmentCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideSkillAssessmentPayload>[];
                };
                delete: {
                    args: Prisma.GuideSkillAssessmentDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideSkillAssessmentPayload>;
                };
                update: {
                    args: Prisma.GuideSkillAssessmentUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideSkillAssessmentPayload>;
                };
                deleteMany: {
                    args: Prisma.GuideSkillAssessmentDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.GuideSkillAssessmentUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.GuideSkillAssessmentUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideSkillAssessmentPayload>[];
                };
                upsert: {
                    args: Prisma.GuideSkillAssessmentUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideSkillAssessmentPayload>;
                };
                aggregate: {
                    args: Prisma.GuideSkillAssessmentAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateGuideSkillAssessment>;
                };
                groupBy: {
                    args: Prisma.GuideSkillAssessmentGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.GuideSkillAssessmentGroupByOutputType>[];
                };
                count: {
                    args: Prisma.GuideSkillAssessmentCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.GuideSkillAssessmentCountAggregateOutputType> | number;
                };
            };
        };
        GuideRouteCompetency: {
            payload: Prisma.$GuideRouteCompetencyPayload<ExtArgs>;
            fields: Prisma.GuideRouteCompetencyFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.GuideRouteCompetencyFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideRouteCompetencyPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.GuideRouteCompetencyFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideRouteCompetencyPayload>;
                };
                findFirst: {
                    args: Prisma.GuideRouteCompetencyFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideRouteCompetencyPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.GuideRouteCompetencyFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideRouteCompetencyPayload>;
                };
                findMany: {
                    args: Prisma.GuideRouteCompetencyFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideRouteCompetencyPayload>[];
                };
                create: {
                    args: Prisma.GuideRouteCompetencyCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideRouteCompetencyPayload>;
                };
                createMany: {
                    args: Prisma.GuideRouteCompetencyCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.GuideRouteCompetencyCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideRouteCompetencyPayload>[];
                };
                delete: {
                    args: Prisma.GuideRouteCompetencyDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideRouteCompetencyPayload>;
                };
                update: {
                    args: Prisma.GuideRouteCompetencyUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideRouteCompetencyPayload>;
                };
                deleteMany: {
                    args: Prisma.GuideRouteCompetencyDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.GuideRouteCompetencyUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.GuideRouteCompetencyUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideRouteCompetencyPayload>[];
                };
                upsert: {
                    args: Prisma.GuideRouteCompetencyUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideRouteCompetencyPayload>;
                };
                aggregate: {
                    args: Prisma.GuideRouteCompetencyAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateGuideRouteCompetency>;
                };
                groupBy: {
                    args: Prisma.GuideRouteCompetencyGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.GuideRouteCompetencyGroupByOutputType>[];
                };
                count: {
                    args: Prisma.GuideRouteCompetencyCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.GuideRouteCompetencyCountAggregateOutputType> | number;
                };
            };
        };
        GuideFirstAid: {
            payload: Prisma.$GuideFirstAidPayload<ExtArgs>;
            fields: Prisma.GuideFirstAidFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.GuideFirstAidFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideFirstAidPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.GuideFirstAidFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideFirstAidPayload>;
                };
                findFirst: {
                    args: Prisma.GuideFirstAidFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideFirstAidPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.GuideFirstAidFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideFirstAidPayload>;
                };
                findMany: {
                    args: Prisma.GuideFirstAidFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideFirstAidPayload>[];
                };
                create: {
                    args: Prisma.GuideFirstAidCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideFirstAidPayload>;
                };
                createMany: {
                    args: Prisma.GuideFirstAidCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.GuideFirstAidCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideFirstAidPayload>[];
                };
                delete: {
                    args: Prisma.GuideFirstAidDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideFirstAidPayload>;
                };
                update: {
                    args: Prisma.GuideFirstAidUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideFirstAidPayload>;
                };
                deleteMany: {
                    args: Prisma.GuideFirstAidDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.GuideFirstAidUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.GuideFirstAidUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideFirstAidPayload>[];
                };
                upsert: {
                    args: Prisma.GuideFirstAidUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideFirstAidPayload>;
                };
                aggregate: {
                    args: Prisma.GuideFirstAidAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateGuideFirstAid>;
                };
                groupBy: {
                    args: Prisma.GuideFirstAidGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.GuideFirstAidGroupByOutputType>[];
                };
                count: {
                    args: Prisma.GuideFirstAidCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.GuideFirstAidCountAggregateOutputType> | number;
                };
            };
        };
        AssessmentQuestion: {
            payload: Prisma.$AssessmentQuestionPayload<ExtArgs>;
            fields: Prisma.AssessmentQuestionFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.AssessmentQuestionFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentQuestionPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.AssessmentQuestionFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentQuestionPayload>;
                };
                findFirst: {
                    args: Prisma.AssessmentQuestionFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentQuestionPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.AssessmentQuestionFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentQuestionPayload>;
                };
                findMany: {
                    args: Prisma.AssessmentQuestionFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentQuestionPayload>[];
                };
                create: {
                    args: Prisma.AssessmentQuestionCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentQuestionPayload>;
                };
                createMany: {
                    args: Prisma.AssessmentQuestionCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.AssessmentQuestionCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentQuestionPayload>[];
                };
                delete: {
                    args: Prisma.AssessmentQuestionDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentQuestionPayload>;
                };
                update: {
                    args: Prisma.AssessmentQuestionUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentQuestionPayload>;
                };
                deleteMany: {
                    args: Prisma.AssessmentQuestionDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.AssessmentQuestionUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.AssessmentQuestionUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentQuestionPayload>[];
                };
                upsert: {
                    args: Prisma.AssessmentQuestionUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentQuestionPayload>;
                };
                aggregate: {
                    args: Prisma.AssessmentQuestionAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateAssessmentQuestion>;
                };
                groupBy: {
                    args: Prisma.AssessmentQuestionGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AssessmentQuestionGroupByOutputType>[];
                };
                count: {
                    args: Prisma.AssessmentQuestionCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AssessmentQuestionCountAggregateOutputType> | number;
                };
            };
        };
        AssessmentAttempt: {
            payload: Prisma.$AssessmentAttemptPayload<ExtArgs>;
            fields: Prisma.AssessmentAttemptFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.AssessmentAttemptFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentAttemptPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.AssessmentAttemptFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentAttemptPayload>;
                };
                findFirst: {
                    args: Prisma.AssessmentAttemptFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentAttemptPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.AssessmentAttemptFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentAttemptPayload>;
                };
                findMany: {
                    args: Prisma.AssessmentAttemptFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentAttemptPayload>[];
                };
                create: {
                    args: Prisma.AssessmentAttemptCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentAttemptPayload>;
                };
                createMany: {
                    args: Prisma.AssessmentAttemptCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.AssessmentAttemptCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentAttemptPayload>[];
                };
                delete: {
                    args: Prisma.AssessmentAttemptDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentAttemptPayload>;
                };
                update: {
                    args: Prisma.AssessmentAttemptUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentAttemptPayload>;
                };
                deleteMany: {
                    args: Prisma.AssessmentAttemptDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.AssessmentAttemptUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.AssessmentAttemptUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentAttemptPayload>[];
                };
                upsert: {
                    args: Prisma.AssessmentAttemptUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentAttemptPayload>;
                };
                aggregate: {
                    args: Prisma.AssessmentAttemptAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateAssessmentAttempt>;
                };
                groupBy: {
                    args: Prisma.AssessmentAttemptGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AssessmentAttemptGroupByOutputType>[];
                };
                count: {
                    args: Prisma.AssessmentAttemptCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AssessmentAttemptCountAggregateOutputType> | number;
                };
            };
        };
        AssessmentResponse: {
            payload: Prisma.$AssessmentResponsePayload<ExtArgs>;
            fields: Prisma.AssessmentResponseFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.AssessmentResponseFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentResponsePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.AssessmentResponseFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentResponsePayload>;
                };
                findFirst: {
                    args: Prisma.AssessmentResponseFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentResponsePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.AssessmentResponseFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentResponsePayload>;
                };
                findMany: {
                    args: Prisma.AssessmentResponseFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentResponsePayload>[];
                };
                create: {
                    args: Prisma.AssessmentResponseCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentResponsePayload>;
                };
                createMany: {
                    args: Prisma.AssessmentResponseCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.AssessmentResponseCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentResponsePayload>[];
                };
                delete: {
                    args: Prisma.AssessmentResponseDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentResponsePayload>;
                };
                update: {
                    args: Prisma.AssessmentResponseUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentResponsePayload>;
                };
                deleteMany: {
                    args: Prisma.AssessmentResponseDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.AssessmentResponseUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.AssessmentResponseUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentResponsePayload>[];
                };
                upsert: {
                    args: Prisma.AssessmentResponseUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentResponsePayload>;
                };
                aggregate: {
                    args: Prisma.AssessmentResponseAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateAssessmentResponse>;
                };
                groupBy: {
                    args: Prisma.AssessmentResponseGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AssessmentResponseGroupByOutputType>[];
                };
                count: {
                    args: Prisma.AssessmentResponseCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AssessmentResponseCountAggregateOutputType> | number;
                };
            };
        };
        AssessmentReview: {
            payload: Prisma.$AssessmentReviewPayload<ExtArgs>;
            fields: Prisma.AssessmentReviewFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.AssessmentReviewFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentReviewPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.AssessmentReviewFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentReviewPayload>;
                };
                findFirst: {
                    args: Prisma.AssessmentReviewFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentReviewPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.AssessmentReviewFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentReviewPayload>;
                };
                findMany: {
                    args: Prisma.AssessmentReviewFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentReviewPayload>[];
                };
                create: {
                    args: Prisma.AssessmentReviewCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentReviewPayload>;
                };
                createMany: {
                    args: Prisma.AssessmentReviewCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.AssessmentReviewCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentReviewPayload>[];
                };
                delete: {
                    args: Prisma.AssessmentReviewDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentReviewPayload>;
                };
                update: {
                    args: Prisma.AssessmentReviewUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentReviewPayload>;
                };
                deleteMany: {
                    args: Prisma.AssessmentReviewDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.AssessmentReviewUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.AssessmentReviewUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentReviewPayload>[];
                };
                upsert: {
                    args: Prisma.AssessmentReviewUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AssessmentReviewPayload>;
                };
                aggregate: {
                    args: Prisma.AssessmentReviewAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateAssessmentReview>;
                };
                groupBy: {
                    args: Prisma.AssessmentReviewGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AssessmentReviewGroupByOutputType>[];
                };
                count: {
                    args: Prisma.AssessmentReviewCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AssessmentReviewCountAggregateOutputType> | number;
                };
            };
        };
        AiConversation: {
            payload: Prisma.$AiConversationPayload<ExtArgs>;
            fields: Prisma.AiConversationFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.AiConversationFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiConversationPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.AiConversationFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiConversationPayload>;
                };
                findFirst: {
                    args: Prisma.AiConversationFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiConversationPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.AiConversationFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiConversationPayload>;
                };
                findMany: {
                    args: Prisma.AiConversationFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiConversationPayload>[];
                };
                create: {
                    args: Prisma.AiConversationCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiConversationPayload>;
                };
                createMany: {
                    args: Prisma.AiConversationCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.AiConversationCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiConversationPayload>[];
                };
                delete: {
                    args: Prisma.AiConversationDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiConversationPayload>;
                };
                update: {
                    args: Prisma.AiConversationUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiConversationPayload>;
                };
                deleteMany: {
                    args: Prisma.AiConversationDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.AiConversationUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.AiConversationUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiConversationPayload>[];
                };
                upsert: {
                    args: Prisma.AiConversationUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiConversationPayload>;
                };
                aggregate: {
                    args: Prisma.AiConversationAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateAiConversation>;
                };
                groupBy: {
                    args: Prisma.AiConversationGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AiConversationGroupByOutputType>[];
                };
                count: {
                    args: Prisma.AiConversationCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AiConversationCountAggregateOutputType> | number;
                };
            };
        };
        AiMessage: {
            payload: Prisma.$AiMessagePayload<ExtArgs>;
            fields: Prisma.AiMessageFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.AiMessageFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiMessagePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.AiMessageFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiMessagePayload>;
                };
                findFirst: {
                    args: Prisma.AiMessageFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiMessagePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.AiMessageFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiMessagePayload>;
                };
                findMany: {
                    args: Prisma.AiMessageFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiMessagePayload>[];
                };
                create: {
                    args: Prisma.AiMessageCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiMessagePayload>;
                };
                createMany: {
                    args: Prisma.AiMessageCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.AiMessageCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiMessagePayload>[];
                };
                delete: {
                    args: Prisma.AiMessageDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiMessagePayload>;
                };
                update: {
                    args: Prisma.AiMessageUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiMessagePayload>;
                };
                deleteMany: {
                    args: Prisma.AiMessageDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.AiMessageUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.AiMessageUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiMessagePayload>[];
                };
                upsert: {
                    args: Prisma.AiMessageUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiMessagePayload>;
                };
                aggregate: {
                    args: Prisma.AiMessageAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateAiMessage>;
                };
                groupBy: {
                    args: Prisma.AiMessageGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AiMessageGroupByOutputType>[];
                };
                count: {
                    args: Prisma.AiMessageCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AiMessageCountAggregateOutputType> | number;
                };
            };
        };
        AiExperimentRun: {
            payload: Prisma.$AiExperimentRunPayload<ExtArgs>;
            fields: Prisma.AiExperimentRunFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.AiExperimentRunFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiExperimentRunPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.AiExperimentRunFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiExperimentRunPayload>;
                };
                findFirst: {
                    args: Prisma.AiExperimentRunFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiExperimentRunPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.AiExperimentRunFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiExperimentRunPayload>;
                };
                findMany: {
                    args: Prisma.AiExperimentRunFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiExperimentRunPayload>[];
                };
                create: {
                    args: Prisma.AiExperimentRunCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiExperimentRunPayload>;
                };
                createMany: {
                    args: Prisma.AiExperimentRunCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.AiExperimentRunCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiExperimentRunPayload>[];
                };
                delete: {
                    args: Prisma.AiExperimentRunDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiExperimentRunPayload>;
                };
                update: {
                    args: Prisma.AiExperimentRunUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiExperimentRunPayload>;
                };
                deleteMany: {
                    args: Prisma.AiExperimentRunDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.AiExperimentRunUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.AiExperimentRunUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiExperimentRunPayload>[];
                };
                upsert: {
                    args: Prisma.AiExperimentRunUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiExperimentRunPayload>;
                };
                aggregate: {
                    args: Prisma.AiExperimentRunAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateAiExperimentRun>;
                };
                groupBy: {
                    args: Prisma.AiExperimentRunGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AiExperimentRunGroupByOutputType>[];
                };
                count: {
                    args: Prisma.AiExperimentRunCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AiExperimentRunCountAggregateOutputType> | number;
                };
            };
        };
        AiEvaluationResult: {
            payload: Prisma.$AiEvaluationResultPayload<ExtArgs>;
            fields: Prisma.AiEvaluationResultFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.AiEvaluationResultFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiEvaluationResultPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.AiEvaluationResultFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiEvaluationResultPayload>;
                };
                findFirst: {
                    args: Prisma.AiEvaluationResultFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiEvaluationResultPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.AiEvaluationResultFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiEvaluationResultPayload>;
                };
                findMany: {
                    args: Prisma.AiEvaluationResultFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiEvaluationResultPayload>[];
                };
                create: {
                    args: Prisma.AiEvaluationResultCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiEvaluationResultPayload>;
                };
                createMany: {
                    args: Prisma.AiEvaluationResultCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.AiEvaluationResultCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiEvaluationResultPayload>[];
                };
                delete: {
                    args: Prisma.AiEvaluationResultDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiEvaluationResultPayload>;
                };
                update: {
                    args: Prisma.AiEvaluationResultUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiEvaluationResultPayload>;
                };
                deleteMany: {
                    args: Prisma.AiEvaluationResultDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.AiEvaluationResultUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.AiEvaluationResultUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiEvaluationResultPayload>[];
                };
                upsert: {
                    args: Prisma.AiEvaluationResultUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiEvaluationResultPayload>;
                };
                aggregate: {
                    args: Prisma.AiEvaluationResultAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateAiEvaluationResult>;
                };
                groupBy: {
                    args: Prisma.AiEvaluationResultGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AiEvaluationResultGroupByOutputType>[];
                };
                count: {
                    args: Prisma.AiEvaluationResultCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AiEvaluationResultCountAggregateOutputType> | number;
                };
            };
        };
        GuideMatchRun: {
            payload: Prisma.$GuideMatchRunPayload<ExtArgs>;
            fields: Prisma.GuideMatchRunFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.GuideMatchRunFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideMatchRunPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.GuideMatchRunFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideMatchRunPayload>;
                };
                findFirst: {
                    args: Prisma.GuideMatchRunFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideMatchRunPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.GuideMatchRunFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideMatchRunPayload>;
                };
                findMany: {
                    args: Prisma.GuideMatchRunFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideMatchRunPayload>[];
                };
                create: {
                    args: Prisma.GuideMatchRunCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideMatchRunPayload>;
                };
                createMany: {
                    args: Prisma.GuideMatchRunCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.GuideMatchRunCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideMatchRunPayload>[];
                };
                delete: {
                    args: Prisma.GuideMatchRunDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideMatchRunPayload>;
                };
                update: {
                    args: Prisma.GuideMatchRunUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideMatchRunPayload>;
                };
                deleteMany: {
                    args: Prisma.GuideMatchRunDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.GuideMatchRunUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.GuideMatchRunUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideMatchRunPayload>[];
                };
                upsert: {
                    args: Prisma.GuideMatchRunUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideMatchRunPayload>;
                };
                aggregate: {
                    args: Prisma.GuideMatchRunAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateGuideMatchRun>;
                };
                groupBy: {
                    args: Prisma.GuideMatchRunGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.GuideMatchRunGroupByOutputType>[];
                };
                count: {
                    args: Prisma.GuideMatchRunCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.GuideMatchRunCountAggregateOutputType> | number;
                };
            };
        };
        GuideMatchResult: {
            payload: Prisma.$GuideMatchResultPayload<ExtArgs>;
            fields: Prisma.GuideMatchResultFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.GuideMatchResultFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideMatchResultPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.GuideMatchResultFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideMatchResultPayload>;
                };
                findFirst: {
                    args: Prisma.GuideMatchResultFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideMatchResultPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.GuideMatchResultFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideMatchResultPayload>;
                };
                findMany: {
                    args: Prisma.GuideMatchResultFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideMatchResultPayload>[];
                };
                create: {
                    args: Prisma.GuideMatchResultCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideMatchResultPayload>;
                };
                createMany: {
                    args: Prisma.GuideMatchResultCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.GuideMatchResultCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideMatchResultPayload>[];
                };
                delete: {
                    args: Prisma.GuideMatchResultDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideMatchResultPayload>;
                };
                update: {
                    args: Prisma.GuideMatchResultUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideMatchResultPayload>;
                };
                deleteMany: {
                    args: Prisma.GuideMatchResultDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.GuideMatchResultUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.GuideMatchResultUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideMatchResultPayload>[];
                };
                upsert: {
                    args: Prisma.GuideMatchResultUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideMatchResultPayload>;
                };
                aggregate: {
                    args: Prisma.GuideMatchResultAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateGuideMatchResult>;
                };
                groupBy: {
                    args: Prisma.GuideMatchResultGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.GuideMatchResultGroupByOutputType>[];
                };
                count: {
                    args: Prisma.GuideMatchResultCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.GuideMatchResultCountAggregateOutputType> | number;
                };
            };
        };
        GuideVerificationReview: {
            payload: Prisma.$GuideVerificationReviewPayload<ExtArgs>;
            fields: Prisma.GuideVerificationReviewFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.GuideVerificationReviewFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideVerificationReviewPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.GuideVerificationReviewFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideVerificationReviewPayload>;
                };
                findFirst: {
                    args: Prisma.GuideVerificationReviewFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideVerificationReviewPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.GuideVerificationReviewFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideVerificationReviewPayload>;
                };
                findMany: {
                    args: Prisma.GuideVerificationReviewFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideVerificationReviewPayload>[];
                };
                create: {
                    args: Prisma.GuideVerificationReviewCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideVerificationReviewPayload>;
                };
                createMany: {
                    args: Prisma.GuideVerificationReviewCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.GuideVerificationReviewCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideVerificationReviewPayload>[];
                };
                delete: {
                    args: Prisma.GuideVerificationReviewDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideVerificationReviewPayload>;
                };
                update: {
                    args: Prisma.GuideVerificationReviewUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideVerificationReviewPayload>;
                };
                deleteMany: {
                    args: Prisma.GuideVerificationReviewDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.GuideVerificationReviewUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.GuideVerificationReviewUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideVerificationReviewPayload>[];
                };
                upsert: {
                    args: Prisma.GuideVerificationReviewUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GuideVerificationReviewPayload>;
                };
                aggregate: {
                    args: Prisma.GuideVerificationReviewAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateGuideVerificationReview>;
                };
                groupBy: {
                    args: Prisma.GuideVerificationReviewGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.GuideVerificationReviewGroupByOutputType>[];
                };
                count: {
                    args: Prisma.GuideVerificationReviewCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.GuideVerificationReviewCountAggregateOutputType> | number;
                };
            };
        };
        Listing: {
            payload: Prisma.$ListingPayload<ExtArgs>;
            fields: Prisma.ListingFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ListingFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ListingFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingPayload>;
                };
                findFirst: {
                    args: Prisma.ListingFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ListingFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingPayload>;
                };
                findMany: {
                    args: Prisma.ListingFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingPayload>[];
                };
                create: {
                    args: Prisma.ListingCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingPayload>;
                };
                createMany: {
                    args: Prisma.ListingCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ListingCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingPayload>[];
                };
                delete: {
                    args: Prisma.ListingDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingPayload>;
                };
                update: {
                    args: Prisma.ListingUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingPayload>;
                };
                deleteMany: {
                    args: Prisma.ListingDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ListingUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ListingUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingPayload>[];
                };
                upsert: {
                    args: Prisma.ListingUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingPayload>;
                };
                aggregate: {
                    args: Prisma.ListingAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateListing>;
                };
                groupBy: {
                    args: Prisma.ListingGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ListingGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ListingCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ListingCountAggregateOutputType> | number;
                };
            };
        };
        ListingInventory: {
            payload: Prisma.$ListingInventoryPayload<ExtArgs>;
            fields: Prisma.ListingInventoryFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ListingInventoryFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingInventoryPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ListingInventoryFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingInventoryPayload>;
                };
                findFirst: {
                    args: Prisma.ListingInventoryFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingInventoryPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ListingInventoryFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingInventoryPayload>;
                };
                findMany: {
                    args: Prisma.ListingInventoryFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingInventoryPayload>[];
                };
                create: {
                    args: Prisma.ListingInventoryCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingInventoryPayload>;
                };
                createMany: {
                    args: Prisma.ListingInventoryCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ListingInventoryCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingInventoryPayload>[];
                };
                delete: {
                    args: Prisma.ListingInventoryDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingInventoryPayload>;
                };
                update: {
                    args: Prisma.ListingInventoryUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingInventoryPayload>;
                };
                deleteMany: {
                    args: Prisma.ListingInventoryDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ListingInventoryUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ListingInventoryUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingInventoryPayload>[];
                };
                upsert: {
                    args: Prisma.ListingInventoryUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingInventoryPayload>;
                };
                aggregate: {
                    args: Prisma.ListingInventoryAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateListingInventory>;
                };
                groupBy: {
                    args: Prisma.ListingInventoryGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ListingInventoryGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ListingInventoryCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ListingInventoryCountAggregateOutputType> | number;
                };
            };
        };
        ListingImage: {
            payload: Prisma.$ListingImagePayload<ExtArgs>;
            fields: Prisma.ListingImageFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ListingImageFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingImagePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ListingImageFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingImagePayload>;
                };
                findFirst: {
                    args: Prisma.ListingImageFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingImagePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ListingImageFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingImagePayload>;
                };
                findMany: {
                    args: Prisma.ListingImageFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingImagePayload>[];
                };
                create: {
                    args: Prisma.ListingImageCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingImagePayload>;
                };
                createMany: {
                    args: Prisma.ListingImageCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ListingImageCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingImagePayload>[];
                };
                delete: {
                    args: Prisma.ListingImageDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingImagePayload>;
                };
                update: {
                    args: Prisma.ListingImageUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingImagePayload>;
                };
                deleteMany: {
                    args: Prisma.ListingImageDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ListingImageUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ListingImageUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingImagePayload>[];
                };
                upsert: {
                    args: Prisma.ListingImageUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListingImagePayload>;
                };
                aggregate: {
                    args: Prisma.ListingImageAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateListingImage>;
                };
                groupBy: {
                    args: Prisma.ListingImageGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ListingImageGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ListingImageCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ListingImageCountAggregateOutputType> | number;
                };
            };
        };
        Booking: {
            payload: Prisma.$BookingPayload<ExtArgs>;
            fields: Prisma.BookingFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.BookingFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.BookingFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingPayload>;
                };
                findFirst: {
                    args: Prisma.BookingFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.BookingFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingPayload>;
                };
                findMany: {
                    args: Prisma.BookingFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingPayload>[];
                };
                create: {
                    args: Prisma.BookingCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingPayload>;
                };
                createMany: {
                    args: Prisma.BookingCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.BookingCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingPayload>[];
                };
                delete: {
                    args: Prisma.BookingDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingPayload>;
                };
                update: {
                    args: Prisma.BookingUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingPayload>;
                };
                deleteMany: {
                    args: Prisma.BookingDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.BookingUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.BookingUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingPayload>[];
                };
                upsert: {
                    args: Prisma.BookingUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingPayload>;
                };
                aggregate: {
                    args: Prisma.BookingAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateBooking>;
                };
                groupBy: {
                    args: Prisma.BookingGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BookingGroupByOutputType>[];
                };
                count: {
                    args: Prisma.BookingCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BookingCountAggregateOutputType> | number;
                };
            };
        };
        PilotPayment: {
            payload: Prisma.$PilotPaymentPayload<ExtArgs>;
            fields: Prisma.PilotPaymentFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PilotPaymentFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PilotPaymentPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PilotPaymentFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PilotPaymentPayload>;
                };
                findFirst: {
                    args: Prisma.PilotPaymentFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PilotPaymentPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PilotPaymentFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PilotPaymentPayload>;
                };
                findMany: {
                    args: Prisma.PilotPaymentFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PilotPaymentPayload>[];
                };
                create: {
                    args: Prisma.PilotPaymentCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PilotPaymentPayload>;
                };
                createMany: {
                    args: Prisma.PilotPaymentCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PilotPaymentCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PilotPaymentPayload>[];
                };
                delete: {
                    args: Prisma.PilotPaymentDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PilotPaymentPayload>;
                };
                update: {
                    args: Prisma.PilotPaymentUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PilotPaymentPayload>;
                };
                deleteMany: {
                    args: Prisma.PilotPaymentDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PilotPaymentUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PilotPaymentUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PilotPaymentPayload>[];
                };
                upsert: {
                    args: Prisma.PilotPaymentUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PilotPaymentPayload>;
                };
                aggregate: {
                    args: Prisma.PilotPaymentAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePilotPayment>;
                };
                groupBy: {
                    args: Prisma.PilotPaymentGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PilotPaymentGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PilotPaymentCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PilotPaymentCountAggregateOutputType> | number;
                };
            };
        };
        BookingEvent: {
            payload: Prisma.$BookingEventPayload<ExtArgs>;
            fields: Prisma.BookingEventFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.BookingEventFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingEventPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.BookingEventFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingEventPayload>;
                };
                findFirst: {
                    args: Prisma.BookingEventFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingEventPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.BookingEventFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingEventPayload>;
                };
                findMany: {
                    args: Prisma.BookingEventFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingEventPayload>[];
                };
                create: {
                    args: Prisma.BookingEventCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingEventPayload>;
                };
                createMany: {
                    args: Prisma.BookingEventCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.BookingEventCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingEventPayload>[];
                };
                delete: {
                    args: Prisma.BookingEventDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingEventPayload>;
                };
                update: {
                    args: Prisma.BookingEventUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingEventPayload>;
                };
                deleteMany: {
                    args: Prisma.BookingEventDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.BookingEventUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.BookingEventUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingEventPayload>[];
                };
                upsert: {
                    args: Prisma.BookingEventUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingEventPayload>;
                };
                aggregate: {
                    args: Prisma.BookingEventAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateBookingEvent>;
                };
                groupBy: {
                    args: Prisma.BookingEventGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BookingEventGroupByOutputType>[];
                };
                count: {
                    args: Prisma.BookingEventCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BookingEventCountAggregateOutputType> | number;
                };
            };
        };
        IdempotencyKey: {
            payload: Prisma.$IdempotencyKeyPayload<ExtArgs>;
            fields: Prisma.IdempotencyKeyFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.IdempotencyKeyFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IdempotencyKeyPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.IdempotencyKeyFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IdempotencyKeyPayload>;
                };
                findFirst: {
                    args: Prisma.IdempotencyKeyFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IdempotencyKeyPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.IdempotencyKeyFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IdempotencyKeyPayload>;
                };
                findMany: {
                    args: Prisma.IdempotencyKeyFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IdempotencyKeyPayload>[];
                };
                create: {
                    args: Prisma.IdempotencyKeyCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IdempotencyKeyPayload>;
                };
                createMany: {
                    args: Prisma.IdempotencyKeyCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.IdempotencyKeyCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IdempotencyKeyPayload>[];
                };
                delete: {
                    args: Prisma.IdempotencyKeyDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IdempotencyKeyPayload>;
                };
                update: {
                    args: Prisma.IdempotencyKeyUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IdempotencyKeyPayload>;
                };
                deleteMany: {
                    args: Prisma.IdempotencyKeyDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.IdempotencyKeyUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.IdempotencyKeyUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IdempotencyKeyPayload>[];
                };
                upsert: {
                    args: Prisma.IdempotencyKeyUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IdempotencyKeyPayload>;
                };
                aggregate: {
                    args: Prisma.IdempotencyKeyAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateIdempotencyKey>;
                };
                groupBy: {
                    args: Prisma.IdempotencyKeyGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.IdempotencyKeyGroupByOutputType>[];
                };
                count: {
                    args: Prisma.IdempotencyKeyCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.IdempotencyKeyCountAggregateOutputType> | number;
                };
            };
        };
        Favorite: {
            payload: Prisma.$FavoritePayload<ExtArgs>;
            fields: Prisma.FavoriteFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.FavoriteFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FavoritePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.FavoriteFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FavoritePayload>;
                };
                findFirst: {
                    args: Prisma.FavoriteFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FavoritePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.FavoriteFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FavoritePayload>;
                };
                findMany: {
                    args: Prisma.FavoriteFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FavoritePayload>[];
                };
                create: {
                    args: Prisma.FavoriteCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FavoritePayload>;
                };
                createMany: {
                    args: Prisma.FavoriteCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.FavoriteCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FavoritePayload>[];
                };
                delete: {
                    args: Prisma.FavoriteDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FavoritePayload>;
                };
                update: {
                    args: Prisma.FavoriteUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FavoritePayload>;
                };
                deleteMany: {
                    args: Prisma.FavoriteDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.FavoriteUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.FavoriteUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FavoritePayload>[];
                };
                upsert: {
                    args: Prisma.FavoriteUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FavoritePayload>;
                };
                aggregate: {
                    args: Prisma.FavoriteAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateFavorite>;
                };
                groupBy: {
                    args: Prisma.FavoriteGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.FavoriteGroupByOutputType>[];
                };
                count: {
                    args: Prisma.FavoriteCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.FavoriteCountAggregateOutputType> | number;
                };
            };
        };
        Conversation: {
            payload: Prisma.$ConversationPayload<ExtArgs>;
            fields: Prisma.ConversationFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ConversationFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConversationPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ConversationFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConversationPayload>;
                };
                findFirst: {
                    args: Prisma.ConversationFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConversationPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ConversationFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConversationPayload>;
                };
                findMany: {
                    args: Prisma.ConversationFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConversationPayload>[];
                };
                create: {
                    args: Prisma.ConversationCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConversationPayload>;
                };
                createMany: {
                    args: Prisma.ConversationCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ConversationCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConversationPayload>[];
                };
                delete: {
                    args: Prisma.ConversationDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConversationPayload>;
                };
                update: {
                    args: Prisma.ConversationUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConversationPayload>;
                };
                deleteMany: {
                    args: Prisma.ConversationDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ConversationUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ConversationUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConversationPayload>[];
                };
                upsert: {
                    args: Prisma.ConversationUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConversationPayload>;
                };
                aggregate: {
                    args: Prisma.ConversationAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateConversation>;
                };
                groupBy: {
                    args: Prisma.ConversationGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ConversationGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ConversationCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ConversationCountAggregateOutputType> | number;
                };
            };
        };
        ConversationParticipant: {
            payload: Prisma.$ConversationParticipantPayload<ExtArgs>;
            fields: Prisma.ConversationParticipantFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ConversationParticipantFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConversationParticipantPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ConversationParticipantFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConversationParticipantPayload>;
                };
                findFirst: {
                    args: Prisma.ConversationParticipantFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConversationParticipantPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ConversationParticipantFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConversationParticipantPayload>;
                };
                findMany: {
                    args: Prisma.ConversationParticipantFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConversationParticipantPayload>[];
                };
                create: {
                    args: Prisma.ConversationParticipantCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConversationParticipantPayload>;
                };
                createMany: {
                    args: Prisma.ConversationParticipantCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ConversationParticipantCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConversationParticipantPayload>[];
                };
                delete: {
                    args: Prisma.ConversationParticipantDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConversationParticipantPayload>;
                };
                update: {
                    args: Prisma.ConversationParticipantUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConversationParticipantPayload>;
                };
                deleteMany: {
                    args: Prisma.ConversationParticipantDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ConversationParticipantUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ConversationParticipantUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConversationParticipantPayload>[];
                };
                upsert: {
                    args: Prisma.ConversationParticipantUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConversationParticipantPayload>;
                };
                aggregate: {
                    args: Prisma.ConversationParticipantAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateConversationParticipant>;
                };
                groupBy: {
                    args: Prisma.ConversationParticipantGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ConversationParticipantGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ConversationParticipantCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ConversationParticipantCountAggregateOutputType> | number;
                };
            };
        };
        UserBlock: {
            payload: Prisma.$UserBlockPayload<ExtArgs>;
            fields: Prisma.UserBlockFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.UserBlockFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserBlockPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.UserBlockFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserBlockPayload>;
                };
                findFirst: {
                    args: Prisma.UserBlockFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserBlockPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.UserBlockFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserBlockPayload>;
                };
                findMany: {
                    args: Prisma.UserBlockFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserBlockPayload>[];
                };
                create: {
                    args: Prisma.UserBlockCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserBlockPayload>;
                };
                createMany: {
                    args: Prisma.UserBlockCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.UserBlockCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserBlockPayload>[];
                };
                delete: {
                    args: Prisma.UserBlockDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserBlockPayload>;
                };
                update: {
                    args: Prisma.UserBlockUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserBlockPayload>;
                };
                deleteMany: {
                    args: Prisma.UserBlockDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.UserBlockUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.UserBlockUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserBlockPayload>[];
                };
                upsert: {
                    args: Prisma.UserBlockUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserBlockPayload>;
                };
                aggregate: {
                    args: Prisma.UserBlockAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUserBlock>;
                };
                groupBy: {
                    args: Prisma.UserBlockGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserBlockGroupByOutputType>[];
                };
                count: {
                    args: Prisma.UserBlockCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserBlockCountAggregateOutputType> | number;
                };
            };
        };
        Report: {
            payload: Prisma.$ReportPayload<ExtArgs>;
            fields: Prisma.ReportFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ReportFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReportPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ReportFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReportPayload>;
                };
                findFirst: {
                    args: Prisma.ReportFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReportPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ReportFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReportPayload>;
                };
                findMany: {
                    args: Prisma.ReportFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReportPayload>[];
                };
                create: {
                    args: Prisma.ReportCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReportPayload>;
                };
                createMany: {
                    args: Prisma.ReportCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ReportCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReportPayload>[];
                };
                delete: {
                    args: Prisma.ReportDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReportPayload>;
                };
                update: {
                    args: Prisma.ReportUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReportPayload>;
                };
                deleteMany: {
                    args: Prisma.ReportDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ReportUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ReportUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReportPayload>[];
                };
                upsert: {
                    args: Prisma.ReportUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReportPayload>;
                };
                aggregate: {
                    args: Prisma.ReportAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateReport>;
                };
                groupBy: {
                    args: Prisma.ReportGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ReportGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ReportCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ReportCountAggregateOutputType> | number;
                };
            };
        };
        ModerationAction: {
            payload: Prisma.$ModerationActionPayload<ExtArgs>;
            fields: Prisma.ModerationActionFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ModerationActionFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ModerationActionPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ModerationActionFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ModerationActionPayload>;
                };
                findFirst: {
                    args: Prisma.ModerationActionFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ModerationActionPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ModerationActionFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ModerationActionPayload>;
                };
                findMany: {
                    args: Prisma.ModerationActionFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ModerationActionPayload>[];
                };
                create: {
                    args: Prisma.ModerationActionCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ModerationActionPayload>;
                };
                createMany: {
                    args: Prisma.ModerationActionCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ModerationActionCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ModerationActionPayload>[];
                };
                delete: {
                    args: Prisma.ModerationActionDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ModerationActionPayload>;
                };
                update: {
                    args: Prisma.ModerationActionUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ModerationActionPayload>;
                };
                deleteMany: {
                    args: Prisma.ModerationActionDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ModerationActionUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ModerationActionUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ModerationActionPayload>[];
                };
                upsert: {
                    args: Prisma.ModerationActionUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ModerationActionPayload>;
                };
                aggregate: {
                    args: Prisma.ModerationActionAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateModerationAction>;
                };
                groupBy: {
                    args: Prisma.ModerationActionGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ModerationActionGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ModerationActionCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ModerationActionCountAggregateOutputType> | number;
                };
            };
        };
        Message: {
            payload: Prisma.$MessagePayload<ExtArgs>;
            fields: Prisma.MessageFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.MessageFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessagePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.MessageFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessagePayload>;
                };
                findFirst: {
                    args: Prisma.MessageFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessagePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.MessageFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessagePayload>;
                };
                findMany: {
                    args: Prisma.MessageFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessagePayload>[];
                };
                create: {
                    args: Prisma.MessageCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessagePayload>;
                };
                createMany: {
                    args: Prisma.MessageCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.MessageCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessagePayload>[];
                };
                delete: {
                    args: Prisma.MessageDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessagePayload>;
                };
                update: {
                    args: Prisma.MessageUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessagePayload>;
                };
                deleteMany: {
                    args: Prisma.MessageDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.MessageUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.MessageUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessagePayload>[];
                };
                upsert: {
                    args: Prisma.MessageUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessagePayload>;
                };
                aggregate: {
                    args: Prisma.MessageAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateMessage>;
                };
                groupBy: {
                    args: Prisma.MessageGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MessageGroupByOutputType>[];
                };
                count: {
                    args: Prisma.MessageCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MessageCountAggregateOutputType> | number;
                };
            };
        };
        Notification: {
            payload: Prisma.$NotificationPayload<ExtArgs>;
            fields: Prisma.NotificationFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.NotificationFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                findFirst: {
                    args: Prisma.NotificationFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                findMany: {
                    args: Prisma.NotificationFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>[];
                };
                create: {
                    args: Prisma.NotificationCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                createMany: {
                    args: Prisma.NotificationCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.NotificationCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>[];
                };
                delete: {
                    args: Prisma.NotificationDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                update: {
                    args: Prisma.NotificationUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                deleteMany: {
                    args: Prisma.NotificationDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.NotificationUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.NotificationUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>[];
                };
                upsert: {
                    args: Prisma.NotificationUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                aggregate: {
                    args: Prisma.NotificationAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateNotification>;
                };
                groupBy: {
                    args: Prisma.NotificationGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.NotificationGroupByOutputType>[];
                };
                count: {
                    args: Prisma.NotificationCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.NotificationCountAggregateOutputType> | number;
                };
            };
        };
        PaymentMethod: {
            payload: Prisma.$PaymentMethodPayload<ExtArgs>;
            fields: Prisma.PaymentMethodFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PaymentMethodFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentMethodPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PaymentMethodFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentMethodPayload>;
                };
                findFirst: {
                    args: Prisma.PaymentMethodFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentMethodPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PaymentMethodFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentMethodPayload>;
                };
                findMany: {
                    args: Prisma.PaymentMethodFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentMethodPayload>[];
                };
                create: {
                    args: Prisma.PaymentMethodCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentMethodPayload>;
                };
                createMany: {
                    args: Prisma.PaymentMethodCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PaymentMethodCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentMethodPayload>[];
                };
                delete: {
                    args: Prisma.PaymentMethodDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentMethodPayload>;
                };
                update: {
                    args: Prisma.PaymentMethodUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentMethodPayload>;
                };
                deleteMany: {
                    args: Prisma.PaymentMethodDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PaymentMethodUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PaymentMethodUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentMethodPayload>[];
                };
                upsert: {
                    args: Prisma.PaymentMethodUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentMethodPayload>;
                };
                aggregate: {
                    args: Prisma.PaymentMethodAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePaymentMethod>;
                };
                groupBy: {
                    args: Prisma.PaymentMethodGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PaymentMethodGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PaymentMethodCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PaymentMethodCountAggregateOutputType> | number;
                };
            };
        };
        Review: {
            payload: Prisma.$ReviewPayload<ExtArgs>;
            fields: Prisma.ReviewFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ReviewFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReviewPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ReviewFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReviewPayload>;
                };
                findFirst: {
                    args: Prisma.ReviewFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReviewPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ReviewFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReviewPayload>;
                };
                findMany: {
                    args: Prisma.ReviewFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReviewPayload>[];
                };
                create: {
                    args: Prisma.ReviewCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReviewPayload>;
                };
                createMany: {
                    args: Prisma.ReviewCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ReviewCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReviewPayload>[];
                };
                delete: {
                    args: Prisma.ReviewDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReviewPayload>;
                };
                update: {
                    args: Prisma.ReviewUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReviewPayload>;
                };
                deleteMany: {
                    args: Prisma.ReviewDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ReviewUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ReviewUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReviewPayload>[];
                };
                upsert: {
                    args: Prisma.ReviewUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReviewPayload>;
                };
                aggregate: {
                    args: Prisma.ReviewAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateReview>;
                };
                groupBy: {
                    args: Prisma.ReviewGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ReviewGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ReviewCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ReviewCountAggregateOutputType> | number;
                };
            };
        };
        Post: {
            payload: Prisma.$PostPayload<ExtArgs>;
            fields: Prisma.PostFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PostFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PostFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostPayload>;
                };
                findFirst: {
                    args: Prisma.PostFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PostFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostPayload>;
                };
                findMany: {
                    args: Prisma.PostFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostPayload>[];
                };
                create: {
                    args: Prisma.PostCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostPayload>;
                };
                createMany: {
                    args: Prisma.PostCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PostCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostPayload>[];
                };
                delete: {
                    args: Prisma.PostDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostPayload>;
                };
                update: {
                    args: Prisma.PostUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostPayload>;
                };
                deleteMany: {
                    args: Prisma.PostDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PostUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PostUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostPayload>[];
                };
                upsert: {
                    args: Prisma.PostUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostPayload>;
                };
                aggregate: {
                    args: Prisma.PostAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePost>;
                };
                groupBy: {
                    args: Prisma.PostGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PostGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PostCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PostCountAggregateOutputType> | number;
                };
            };
        };
        PostImage: {
            payload: Prisma.$PostImagePayload<ExtArgs>;
            fields: Prisma.PostImageFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PostImageFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostImagePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PostImageFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostImagePayload>;
                };
                findFirst: {
                    args: Prisma.PostImageFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostImagePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PostImageFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostImagePayload>;
                };
                findMany: {
                    args: Prisma.PostImageFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostImagePayload>[];
                };
                create: {
                    args: Prisma.PostImageCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostImagePayload>;
                };
                createMany: {
                    args: Prisma.PostImageCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PostImageCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostImagePayload>[];
                };
                delete: {
                    args: Prisma.PostImageDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostImagePayload>;
                };
                update: {
                    args: Prisma.PostImageUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostImagePayload>;
                };
                deleteMany: {
                    args: Prisma.PostImageDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PostImageUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PostImageUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostImagePayload>[];
                };
                upsert: {
                    args: Prisma.PostImageUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostImagePayload>;
                };
                aggregate: {
                    args: Prisma.PostImageAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePostImage>;
                };
                groupBy: {
                    args: Prisma.PostImageGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PostImageGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PostImageCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PostImageCountAggregateOutputType> | number;
                };
            };
        };
        PostLike: {
            payload: Prisma.$PostLikePayload<ExtArgs>;
            fields: Prisma.PostLikeFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PostLikeFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostLikePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PostLikeFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostLikePayload>;
                };
                findFirst: {
                    args: Prisma.PostLikeFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostLikePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PostLikeFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostLikePayload>;
                };
                findMany: {
                    args: Prisma.PostLikeFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostLikePayload>[];
                };
                create: {
                    args: Prisma.PostLikeCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostLikePayload>;
                };
                createMany: {
                    args: Prisma.PostLikeCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PostLikeCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostLikePayload>[];
                };
                delete: {
                    args: Prisma.PostLikeDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostLikePayload>;
                };
                update: {
                    args: Prisma.PostLikeUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostLikePayload>;
                };
                deleteMany: {
                    args: Prisma.PostLikeDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PostLikeUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PostLikeUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostLikePayload>[];
                };
                upsert: {
                    args: Prisma.PostLikeUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostLikePayload>;
                };
                aggregate: {
                    args: Prisma.PostLikeAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePostLike>;
                };
                groupBy: {
                    args: Prisma.PostLikeGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PostLikeGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PostLikeCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PostLikeCountAggregateOutputType> | number;
                };
            };
        };
        PostComment: {
            payload: Prisma.$PostCommentPayload<ExtArgs>;
            fields: Prisma.PostCommentFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PostCommentFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostCommentPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PostCommentFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostCommentPayload>;
                };
                findFirst: {
                    args: Prisma.PostCommentFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostCommentPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PostCommentFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostCommentPayload>;
                };
                findMany: {
                    args: Prisma.PostCommentFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostCommentPayload>[];
                };
                create: {
                    args: Prisma.PostCommentCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostCommentPayload>;
                };
                createMany: {
                    args: Prisma.PostCommentCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PostCommentCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostCommentPayload>[];
                };
                delete: {
                    args: Prisma.PostCommentDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostCommentPayload>;
                };
                update: {
                    args: Prisma.PostCommentUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostCommentPayload>;
                };
                deleteMany: {
                    args: Prisma.PostCommentDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PostCommentUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PostCommentUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostCommentPayload>[];
                };
                upsert: {
                    args: Prisma.PostCommentUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostCommentPayload>;
                };
                aggregate: {
                    args: Prisma.PostCommentAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePostComment>;
                };
                groupBy: {
                    args: Prisma.PostCommentGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PostCommentGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PostCommentCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PostCommentCountAggregateOutputType> | number;
                };
            };
        };
        Follow: {
            payload: Prisma.$FollowPayload<ExtArgs>;
            fields: Prisma.FollowFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.FollowFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FollowPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.FollowFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FollowPayload>;
                };
                findFirst: {
                    args: Prisma.FollowFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FollowPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.FollowFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FollowPayload>;
                };
                findMany: {
                    args: Prisma.FollowFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FollowPayload>[];
                };
                create: {
                    args: Prisma.FollowCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FollowPayload>;
                };
                createMany: {
                    args: Prisma.FollowCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.FollowCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FollowPayload>[];
                };
                delete: {
                    args: Prisma.FollowDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FollowPayload>;
                };
                update: {
                    args: Prisma.FollowUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FollowPayload>;
                };
                deleteMany: {
                    args: Prisma.FollowDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.FollowUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.FollowUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FollowPayload>[];
                };
                upsert: {
                    args: Prisma.FollowUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FollowPayload>;
                };
                aggregate: {
                    args: Prisma.FollowAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateFollow>;
                };
                groupBy: {
                    args: Prisma.FollowGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.FollowGroupByOutputType>[];
                };
                count: {
                    args: Prisma.FollowCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.FollowCountAggregateOutputType> | number;
                };
            };
        };
    };
} & {
    other: {
        payload: any;
        operations: {
            $executeRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $executeRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
            $queryRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $queryRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
        };
    };
};
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly email: "email";
    readonly passwordHash: "passwordHash";
    readonly name: "name";
    readonly phone: "phone";
    readonly avatarUrl: "avatarUrl";
    readonly provider: "provider";
    readonly providerSubject: "providerSubject";
    readonly roles: "roles";
    readonly isVerified: "isVerified";
    readonly emailVerifiedAt: "emailVerifiedAt";
    readonly moderationStatus: "moderationStatus";
    readonly suspendedUntil: "suspendedUntil";
    readonly suspensionReason: "suspensionReason";
    readonly lastLoginAt: "lastLoginAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly deletedAt: "deletedAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const RefreshTokenScalarFieldEnum: {
    readonly id: "id";
    readonly tokenHash: "tokenHash";
    readonly family: "family";
    readonly userAgent: "userAgent";
    readonly ipAddress: "ipAddress";
    readonly expiresAt: "expiresAt";
    readonly revokedAt: "revokedAt";
    readonly createdAt: "createdAt";
    readonly userId: "userId";
};
export type RefreshTokenScalarFieldEnum = (typeof RefreshTokenScalarFieldEnum)[keyof typeof RefreshTokenScalarFieldEnum];
export declare const EmailVerificationTokenScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly tokenHash: "tokenHash";
    readonly expiresAt: "expiresAt";
    readonly sentAt: "sentAt";
    readonly usedAt: "usedAt";
    readonly createdAt: "createdAt";
};
export type EmailVerificationTokenScalarFieldEnum = (typeof EmailVerificationTokenScalarFieldEnum)[keyof typeof EmailVerificationTokenScalarFieldEnum];
export declare const PasswordResetTokenScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly tokenHash: "tokenHash";
    readonly expiresAt: "expiresAt";
    readonly requestedAt: "requestedAt";
    readonly usedAt: "usedAt";
    readonly createdAt: "createdAt";
};
export type PasswordResetTokenScalarFieldEnum = (typeof PasswordResetTokenScalarFieldEnum)[keyof typeof PasswordResetTokenScalarFieldEnum];
export declare const GuideProfileScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly country: "country";
    readonly city: "city";
    readonly bio: "bio";
    readonly experienceYears: "experienceYears";
    readonly languages: "languages";
    readonly expertise: "expertise";
    readonly availability: "availability";
    readonly pricingType: "pricingType";
    readonly price: "price";
    readonly status: "status";
    readonly verified: "verified";
    readonly legalRole: "legalRole";
    readonly routeBadges: "routeBadges";
    readonly specialtySkills: "specialtySkills";
    readonly firstAidVerified: "firstAidVerified";
    readonly languageEstimate: "languageEstimate";
    readonly assessmentScore: "assessmentScore";
    readonly referenceContact: "referenceContact";
    readonly codeOfConductAccepted: "codeOfConductAccepted";
    readonly rankPoints: "rankPoints";
    readonly completedTrips: "completedTrips";
    readonly responseRate: "responseRate";
    readonly acceptanceRate: "acceptanceRate";
    readonly providerCancellationCount: "providerCancellationCount";
    readonly confirmedReportCount: "confirmedReportCount";
    readonly rankingUpdatedAt: "rankingUpdatedAt";
    readonly rating: "rating";
    readonly reviewCount: "reviewCount";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly deletedAt: "deletedAt";
};
export type GuideProfileScalarFieldEnum = (typeof GuideProfileScalarFieldEnum)[keyof typeof GuideProfileScalarFieldEnum];
export declare const GuideEvidenceScalarFieldEnum: {
    readonly id: "id";
    readonly guideProfileId: "guideProfileId";
    readonly type: "type";
    readonly issuer: "issuer";
    readonly reference: "reference";
    readonly verifiedAt: "verifiedAt";
    readonly expiresAt: "expiresAt";
    readonly status: "status";
    readonly metadata: "metadata";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type GuideEvidenceScalarFieldEnum = (typeof GuideEvidenceScalarFieldEnum)[keyof typeof GuideEvidenceScalarFieldEnum];
export declare const CompetencyAttemptScalarFieldEnum: {
    readonly id: "id";
    readonly guideProfileId: "guideProfileId";
    readonly taskType: "taskType";
    readonly routeId: "routeId";
    readonly rubricVersion: "rubricVersion";
    readonly aiScore: "aiScore";
    readonly humanScores: "humanScores";
    readonly confidence: "confidence";
    readonly breakdown: "breakdown";
    readonly passed: "passed";
    readonly reviewedAt: "reviewedAt";
    readonly createdAt: "createdAt";
};
export type CompetencyAttemptScalarFieldEnum = (typeof CompetencyAttemptScalarFieldEnum)[keyof typeof CompetencyAttemptScalarFieldEnum];
export declare const TourismSourceScalarFieldEnum: {
    readonly id: "id";
    readonly title: "title";
    readonly organization: "organization";
    readonly sourceType: "sourceType";
    readonly authorityLevel: "authorityLevel";
    readonly url: "url";
    readonly language: "language";
    readonly publishedAt: "publishedAt";
    readonly validFrom: "validFrom";
    readonly validTo: "validTo";
    readonly lastVerifiedAt: "lastVerifiedAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type TourismSourceScalarFieldEnum = (typeof TourismSourceScalarFieldEnum)[keyof typeof TourismSourceScalarFieldEnum];
export declare const TourismKnowledgeScalarFieldEnum: {
    readonly id: "id";
    readonly sourceId: "sourceId";
    readonly title: "title";
    readonly content: "content";
    readonly contentHash: "contentHash";
    readonly chunkIndex: "chunkIndex";
    readonly region: "region";
    readonly routeFamily: "routeFamily";
    readonly category: "category";
    readonly language: "language";
    readonly embedding: "embedding";
    readonly embeddingReference: "embeddingReference";
    readonly embeddingModel: "embeddingModel";
    readonly tokenCount: "tokenCount";
    readonly metadata: "metadata";
    readonly active: "active";
    readonly lastVerifiedAt: "lastVerifiedAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type TourismKnowledgeScalarFieldEnum = (typeof TourismKnowledgeScalarFieldEnum)[keyof typeof TourismKnowledgeScalarFieldEnum];
export declare const ResearchRouteScalarFieldEnum: {
    readonly id: "id";
    readonly sourceId: "sourceId";
    readonly code: "code";
    readonly name: "name";
    readonly routeFamily: "routeFamily";
    readonly description: "description";
    readonly minimumDays: "minimumDays";
    readonly recommendedDays: "recommendedDays";
    readonly riskLevel: "riskLevel";
    readonly minimumLanguageLevel: "minimumLanguageLevel";
    readonly routeBadge: "routeBadge";
    readonly firstAidRequired: "firstAidRequired";
    readonly requiredGuideLegalRole: "requiredGuideLegalRole";
    readonly requiredSpecialtySkills: "requiredSpecialtySkills";
    readonly active: "active";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ResearchRouteScalarFieldEnum = (typeof ResearchRouteScalarFieldEnum)[keyof typeof ResearchRouteScalarFieldEnum];
export declare const RouteNodeScalarFieldEnum: {
    readonly id: "id";
    readonly routeId: "routeId";
    readonly sourceId: "sourceId";
    readonly destinationId: "destinationId";
    readonly code: "code";
    readonly name: "name";
    readonly nameMn: "nameMn";
    readonly nameEn: "nameEn";
    readonly region: "region";
    readonly latitude: "latitude";
    readonly longitude: "longitude";
    readonly altitude: "altitude";
    readonly nodeType: "nodeType";
    readonly sequenceHint: "sequenceHint";
    readonly minimumVisitMinutes: "minimumVisitMinutes";
    readonly seasonalityMetadata: "seasonalityMetadata";
    readonly accessMetadata: "accessMetadata";
    readonly safetyMetadata: "safetyMetadata";
    readonly active: "active";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type RouteNodeScalarFieldEnum = (typeof RouteNodeScalarFieldEnum)[keyof typeof RouteNodeScalarFieldEnum];
export declare const RouteEdgeScalarFieldEnum: {
    readonly id: "id";
    readonly routeId: "routeId";
    readonly fromNodeId: "fromNodeId";
    readonly toNodeId: "toNodeId";
    readonly sourceId: "sourceId";
    readonly code: "code";
    readonly transportMode: "transportMode";
    readonly distanceKm: "distanceKm";
    readonly estimatedTravelMinutes: "estimatedTravelMinutes";
    readonly estimatedCostMinor: "estimatedCostMinor";
    readonly estimatedCostCurrency: "estimatedCostCurrency";
    readonly terrain: "terrain";
    readonly riskLevel: "riskLevel";
    readonly seasonality: "seasonality";
    readonly bidirectional: "bidirectional";
    readonly requiresRoadCheck: "requiresRoadCheck";
    readonly requiresWeatherCheck: "requiresWeatherCheck";
    readonly requiresPermitCheck: "requiresPermitCheck";
    readonly requiresGuide: "requiresGuide";
    readonly requiredGuideCompetencies: "requiredGuideCompetencies";
    readonly emergencyPlanRequired: "emergencyPlanRequired";
    readonly active: "active";
    readonly lastVerifiedAt: "lastVerifiedAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type RouteEdgeScalarFieldEnum = (typeof RouteEdgeScalarFieldEnum)[keyof typeof RouteEdgeScalarFieldEnum];
export declare const SafetyPlanScalarFieldEnum: {
    readonly id: "id";
    readonly routeId: "routeId";
    readonly createdById: "createdById";
    readonly guideProfileId: "guideProfileId";
    readonly reviewedById: "reviewedById";
    readonly title: "title";
    readonly tripStartAt: "tripStartAt";
    readonly tripEndAt: "tripEndAt";
    readonly riskLevelSnapshot: "riskLevelSnapshot";
    readonly itinerary: "itinerary";
    readonly emergencyContacts: "emergencyContacts";
    readonly communicationsPlan: "communicationsPlan";
    readonly evacuationPlan: "evacuationPlan";
    readonly medicalPlan: "medicalPlan";
    readonly riskMitigations: "riskMitigations";
    readonly equipmentChecklist: "equipmentChecklist";
    readonly permitReferences: "permitReferences";
    readonly status: "status";
    readonly version: "version";
    readonly submittedAt: "submittedAt";
    readonly approvedAt: "approvedAt";
    readonly rejectedAt: "rejectedAt";
    readonly revokedAt: "revokedAt";
    readonly expiresAt: "expiresAt";
    readonly reviewNotes: "reviewNotes";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type SafetyPlanScalarFieldEnum = (typeof SafetyPlanScalarFieldEnum)[keyof typeof SafetyPlanScalarFieldEnum];
export declare const SafetyPlanAuditScalarFieldEnum: {
    readonly id: "id";
    readonly safetyPlanId: "safetyPlanId";
    readonly actorId: "actorId";
    readonly action: "action";
    readonly fromStatus: "fromStatus";
    readonly toStatus: "toStatus";
    readonly planVersion: "planVersion";
    readonly snapshot: "snapshot";
    readonly reason: "reason";
    readonly createdAt: "createdAt";
};
export type SafetyPlanAuditScalarFieldEnum = (typeof SafetyPlanAuditScalarFieldEnum)[keyof typeof SafetyPlanAuditScalarFieldEnum];
export declare const GuideCompetencyScalarFieldEnum: {
    readonly id: "id";
    readonly guideProfileId: "guideProfileId";
    readonly routeId: "routeId";
    readonly assessmentAttemptId: "assessmentAttemptId";
    readonly competencyType: "competencyType";
    readonly competencyCode: "competencyCode";
    readonly score: "score";
    readonly status: "status";
    readonly verifiedById: "verifiedById";
    readonly verificationMethod: "verificationMethod";
    readonly validFrom: "validFrom";
    readonly validTo: "validTo";
    readonly metadata: "metadata";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type GuideCompetencyScalarFieldEnum = (typeof GuideCompetencyScalarFieldEnum)[keyof typeof GuideCompetencyScalarFieldEnum];
export declare const GuideLanguageAssessmentScalarFieldEnum: {
    readonly id: "id";
    readonly guideProfileId: "guideProfileId";
    readonly assessmentAttemptId: "assessmentAttemptId";
    readonly language: "language";
    readonly officialEvidenceType: "officialEvidenceType";
    readonly officialEvidenceValue: "officialEvidenceValue";
    readonly aiEstimatedCefr: "aiEstimatedCefr";
    readonly aiConfidence: "aiConfidence";
    readonly fluencyScore: "fluencyScore";
    readonly grammarScore: "grammarScore";
    readonly vocabularyScore: "vocabularyScore";
    readonly interactionScore: "interactionScore";
    readonly clarityScore: "clarityScore";
    readonly humanVerifiedCefr: "humanVerifiedCefr";
    readonly assessmentStatus: "assessmentStatus";
    readonly verifiedById: "verifiedById";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type GuideLanguageAssessmentScalarFieldEnum = (typeof GuideLanguageAssessmentScalarFieldEnum)[keyof typeof GuideLanguageAssessmentScalarFieldEnum];
export declare const GuideKnowledgeAssessmentScalarFieldEnum: {
    readonly id: "id";
    readonly guideProfileId: "guideProfileId";
    readonly assessmentAttemptId: "assessmentAttemptId";
    readonly historyScore: "historyScore";
    readonly cultureScore: "cultureScore";
    readonly geographyNatureScore: "geographyNatureScore";
    readonly lawEthicsScore: "lawEthicsScore";
    readonly societyEconomyScore: "societyEconomyScore";
    readonly totalScore: "totalScore";
    readonly pass: "pass";
    readonly evaluatorType: "evaluatorType";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type GuideKnowledgeAssessmentScalarFieldEnum = (typeof GuideKnowledgeAssessmentScalarFieldEnum)[keyof typeof GuideKnowledgeAssessmentScalarFieldEnum];
export declare const GuideSkillAssessmentScalarFieldEnum: {
    readonly id: "id";
    readonly guideProfileId: "guideProfileId";
    readonly assessmentAttemptId: "assessmentAttemptId";
    readonly communicationScore: "communicationScore";
    readonly guidingTechniqueScore: "guidingTechniqueScore";
    readonly explanationStructureScore: "explanationStructureScore";
    readonly factualPresentationScore: "factualPresentationScore";
    readonly groupCareScore: "groupCareScore";
    readonly questionHandlingScore: "questionHandlingScore";
    readonly professionalismScore: "professionalismScore";
    readonly totalScore: "totalScore";
    readonly aiConfidence: "aiConfidence";
    readonly humanReviewStatus: "humanReviewStatus";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type GuideSkillAssessmentScalarFieldEnum = (typeof GuideSkillAssessmentScalarFieldEnum)[keyof typeof GuideSkillAssessmentScalarFieldEnum];
export declare const GuideRouteCompetencyScalarFieldEnum: {
    readonly id: "id";
    readonly guideProfileId: "guideProfileId";
    readonly routeId: "routeId";
    readonly assessmentAttemptId: "assessmentAttemptId";
    readonly routeFamily: "routeFamily";
    readonly score: "score";
    readonly status: "status";
    readonly passedAt: "passedAt";
    readonly expiresAt: "expiresAt";
    readonly evaluatorType: "evaluatorType";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type GuideRouteCompetencyScalarFieldEnum = (typeof GuideRouteCompetencyScalarFieldEnum)[keyof typeof GuideRouteCompetencyScalarFieldEnum];
export declare const GuideFirstAidScalarFieldEnum: {
    readonly id: "id";
    readonly guideProfileId: "guideProfileId";
    readonly assessmentAttemptId: "assessmentAttemptId";
    readonly certificateProvider: "certificateProvider";
    readonly certificateReference: "certificateReference";
    readonly issuedAt: "issuedAt";
    readonly expiresAt: "expiresAt";
    readonly certificateStatus: "certificateStatus";
    readonly theoryScore: "theoryScore";
    readonly practicalVerificationStatus: "practicalVerificationStatus";
    readonly verifiedAt: "verifiedAt";
    readonly verifiedById: "verifiedById";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type GuideFirstAidScalarFieldEnum = (typeof GuideFirstAidScalarFieldEnum)[keyof typeof GuideFirstAidScalarFieldEnum];
export declare const AssessmentQuestionScalarFieldEnum: {
    readonly id: "id";
    readonly category: "category";
    readonly routeFamily: "routeFamily";
    readonly difficulty: "difficulty";
    readonly language: "language";
    readonly questionType: "questionType";
    readonly prompt: "prompt";
    readonly responseOptions: "responseOptions";
    readonly answerKey: "answerKey";
    readonly scoringRubric: "scoringRubric";
    readonly active: "active";
    readonly sourceId: "sourceId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type AssessmentQuestionScalarFieldEnum = (typeof AssessmentQuestionScalarFieldEnum)[keyof typeof AssessmentQuestionScalarFieldEnum];
export declare const AssessmentAttemptScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly guideProfileId: "guideProfileId";
    readonly routeId: "routeId";
    readonly routeFamily: "routeFamily";
    readonly assessmentType: "assessmentType";
    readonly language: "language";
    readonly status: "status";
    readonly rubricVersion: "rubricVersion";
    readonly startedAt: "startedAt";
    readonly submittedAt: "submittedAt";
    readonly completedAt: "completedAt";
    readonly score: "score";
    readonly aiScore: "aiScore";
    readonly humanScore: "humanScore";
    readonly passed: "passed";
    readonly humanPassed: "humanPassed";
    readonly aiEstimatedCefr: "aiEstimatedCefr";
    readonly humanCefr: "humanCefr";
    readonly aiConfidence: "aiConfidence";
    readonly metadata: "metadata";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type AssessmentAttemptScalarFieldEnum = (typeof AssessmentAttemptScalarFieldEnum)[keyof typeof AssessmentAttemptScalarFieldEnum];
export declare const AssessmentResponseScalarFieldEnum: {
    readonly id: "id";
    readonly assessmentAttemptId: "assessmentAttemptId";
    readonly questionId: "questionId";
    readonly responseText: "responseText";
    readonly responsePayload: "responsePayload";
    readonly audioReference: "audioReference";
    readonly aiScore: "aiScore";
    readonly humanScore: "humanScore";
    readonly aiFeedback: "aiFeedback";
    readonly humanFeedback: "humanFeedback";
    readonly unsafeActionDetected: "unsafeActionDetected";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type AssessmentResponseScalarFieldEnum = (typeof AssessmentResponseScalarFieldEnum)[keyof typeof AssessmentResponseScalarFieldEnum];
export declare const AssessmentReviewScalarFieldEnum: {
    readonly id: "id";
    readonly assessmentAttemptId: "assessmentAttemptId";
    readonly reviewerId: "reviewerId";
    readonly blindEvaluation: "blindEvaluation";
    readonly decision: "decision";
    readonly humanScore: "humanScore";
    readonly humanPassed: "humanPassed";
    readonly humanCefr: "humanCefr";
    readonly notes: "notes";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type AssessmentReviewScalarFieldEnum = (typeof AssessmentReviewScalarFieldEnum)[keyof typeof AssessmentReviewScalarFieldEnum];
export declare const AiConversationScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly title: "title";
    readonly experimentMode: "experimentMode";
    readonly status: "status";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly deletedAt: "deletedAt";
};
export type AiConversationScalarFieldEnum = (typeof AiConversationScalarFieldEnum)[keyof typeof AiConversationScalarFieldEnum];
export declare const AiMessageScalarFieldEnum: {
    readonly id: "id";
    readonly conversationId: "conversationId";
    readonly role: "role";
    readonly content: "content";
    readonly structuredContent: "structuredContent";
    readonly sources: "sources";
    readonly toolName: "toolName";
    readonly model: "model";
    readonly tokenCount: "tokenCount";
    readonly createdAt: "createdAt";
};
export type AiMessageScalarFieldEnum = (typeof AiMessageScalarFieldEnum)[keyof typeof AiMessageScalarFieldEnum];
export declare const AiExperimentRunScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly conversationId: "conversationId";
    readonly routeId: "routeId";
    readonly experimentMode: "experimentMode";
    readonly requestType: "requestType";
    readonly provider: "provider";
    readonly model: "model";
    readonly promptVersion: "promptVersion";
    readonly routeFamily: "routeFamily";
    readonly inputTokens: "inputTokens";
    readonly outputTokens: "outputTokens";
    readonly latencyMs: "latencyMs";
    readonly estimatedCost: "estimatedCost";
    readonly toolCalls: "toolCalls";
    readonly validatorResult: "validatorResult";
    readonly finalValidity: "finalValidity";
    readonly failureReason: "failureReason";
    readonly metadata: "metadata";
    readonly createdAt: "createdAt";
};
export type AiExperimentRunScalarFieldEnum = (typeof AiExperimentRunScalarFieldEnum)[keyof typeof AiExperimentRunScalarFieldEnum];
export declare const AiEvaluationResultScalarFieldEnum: {
    readonly id: "id";
    readonly experimentRunId: "experimentRunId";
    readonly reviewerId: "reviewerId";
    readonly evaluatorType: "evaluatorType";
    readonly blindEvaluation: "blindEvaluation";
    readonly factualAccuracy: "factualAccuracy";
    readonly hallucinationDetected: "hallucinationDetected";
    readonly poiValidity: "poiValidity";
    readonly spatialFeasibility: "spatialFeasibility";
    readonly temporalFeasibility: "temporalFeasibility";
    readonly budgetCompliance: "budgetCompliance";
    readonly seasonCompliance: "seasonCompliance";
    readonly safetyViolation: "safetyViolation";
    readonly personalizationScore: "personalizationScore";
    readonly aiScore: "aiScore";
    readonly humanScore: "humanScore";
    readonly aiPass: "aiPass";
    readonly humanPass: "humanPass";
    readonly aiCefr: "aiCefr";
    readonly humanCefr: "humanCefr";
    readonly safetyFalseNegative: "safetyFalseNegative";
    readonly safetyFalsePositive: "safetyFalsePositive";
    readonly notes: "notes";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type AiEvaluationResultScalarFieldEnum = (typeof AiEvaluationResultScalarFieldEnum)[keyof typeof AiEvaluationResultScalarFieldEnum];
export declare const GuideMatchRunScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly routeId: "routeId";
    readonly experimentRunId: "experimentRunId";
    readonly routeFamily: "routeFamily";
    readonly requestedStartAt: "requestedStartAt";
    readonly requestedEndAt: "requestedEndAt";
    readonly language: "language";
    readonly minimumCefr: "minimumCefr";
    readonly requirements: "requirements";
    readonly weights: "weights";
    readonly createdAt: "createdAt";
};
export type GuideMatchRunScalarFieldEnum = (typeof GuideMatchRunScalarFieldEnum)[keyof typeof GuideMatchRunScalarFieldEnum];
export declare const GuideMatchResultScalarFieldEnum: {
    readonly id: "id";
    readonly guideMatchRunId: "guideMatchRunId";
    readonly guideProfileId: "guideProfileId";
    readonly eligible: "eligible";
    readonly score: "score";
    readonly rank: "rank";
    readonly hardGateFailures: "hardGateFailures";
    readonly factors: "factors";
    readonly reasons: "reasons";
    readonly createdAt: "createdAt";
};
export type GuideMatchResultScalarFieldEnum = (typeof GuideMatchResultScalarFieldEnum)[keyof typeof GuideMatchResultScalarFieldEnum];
export declare const GuideVerificationReviewScalarFieldEnum: {
    readonly id: "id";
    readonly guideProfileId: "guideProfileId";
    readonly reviewerId: "reviewerId";
    readonly decision: "decision";
    readonly decisionReason: "decisionReason";
    readonly internalNote: "internalNote";
    readonly assessmentScore: "assessmentScore";
    readonly assessmentBreakdown: "assessmentBreakdown";
    readonly documentStatus: "documentStatus";
    readonly referenceStatus: "referenceStatus";
    readonly applicationSnapshot: "applicationSnapshot";
    readonly reviewedAt: "reviewedAt";
};
export type GuideVerificationReviewScalarFieldEnum = (typeof GuideVerificationReviewScalarFieldEnum)[keyof typeof GuideVerificationReviewScalarFieldEnum];
export declare const ListingScalarFieldEnum: {
    readonly id: "id";
    readonly slug: "slug";
    readonly title: "title";
    readonly location: "location";
    readonly description: "description";
    readonly category: "category";
    readonly price: "price";
    readonly basePriceMinor: "basePriceMinor";
    readonly cleaningFeeMinor: "cleaningFeeMinor";
    readonly serviceFeeMinor: "serviceFeeMinor";
    readonly taxMinor: "taxMinor";
    readonly extraGuestFeeMinor: "extraGuestFeeMinor";
    readonly depositMinor: "depositMinor";
    readonly currency: "currency";
    readonly priceUnit: "priceUnit";
    readonly datesLabel: "datesLabel";
    readonly tags: "tags";
    readonly amenities: "amenities";
    readonly rating: "rating";
    readonly reviewCount: "reviewCount";
    readonly published: "published";
    readonly status: "status";
    readonly defaultTotalUnits: "defaultTotalUnits";
    readonly hostId: "hostId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly deletedAt: "deletedAt";
};
export type ListingScalarFieldEnum = (typeof ListingScalarFieldEnum)[keyof typeof ListingScalarFieldEnum];
export declare const ListingInventoryScalarFieldEnum: {
    readonly id: "id";
    readonly listingId: "listingId";
    readonly date: "date";
    readonly totalUnits: "totalUnits";
    readonly reservedUnits: "reservedUnits";
    readonly availableUnits: "availableUnits";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ListingInventoryScalarFieldEnum = (typeof ListingInventoryScalarFieldEnum)[keyof typeof ListingInventoryScalarFieldEnum];
export declare const ListingImageScalarFieldEnum: {
    readonly id: "id";
    readonly url: "url";
    readonly alt: "alt";
    readonly sortOrder: "sortOrder";
    readonly listingId: "listingId";
};
export type ListingImageScalarFieldEnum = (typeof ListingImageScalarFieldEnum)[keyof typeof ListingImageScalarFieldEnum];
export declare const BookingScalarFieldEnum: {
    readonly id: "id";
    readonly travelerId: "travelerId";
    readonly guideId: "guideId";
    readonly listingId: "listingId";
    readonly startsAt: "startsAt";
    readonly endsAt: "endsAt";
    readonly guests: "guests";
    readonly amount: "amount";
    readonly amountMinor: "amountMinor";
    readonly baseAmountMinor: "baseAmountMinor";
    readonly cleaningFeeMinor: "cleaningFeeMinor";
    readonly serviceFeeMinor: "serviceFeeMinor";
    readonly taxMinor: "taxMinor";
    readonly extraGuestFeeMinor: "extraGuestFeeMinor";
    readonly depositMinor: "depositMinor";
    readonly currency: "currency";
    readonly status: "status";
    readonly note: "note";
    readonly expiresAt: "expiresAt";
    readonly cancellationPolicy: "cancellationPolicy";
    readonly freeCancellationUntil: "freeCancellationUntil";
    readonly lateCancellationPercent: "lateCancellationPercent";
    readonly noShowPercent: "noShowPercent";
    readonly cancellationFee: "cancellationFee";
    readonly cancellationFeeMinor: "cancellationFeeMinor";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly cancelledAt: "cancelledAt";
    readonly deletedAt: "deletedAt";
};
export type BookingScalarFieldEnum = (typeof BookingScalarFieldEnum)[keyof typeof BookingScalarFieldEnum];
export declare const PilotPaymentScalarFieldEnum: {
    readonly id: "id";
    readonly bookingId: "bookingId";
    readonly arrangement: "arrangement";
    readonly status: "status";
    readonly instructions: "instructions";
    readonly proposedById: "proposedById";
    readonly agreedByTravelerAt: "agreedByTravelerAt";
    readonly agreedByProviderAt: "agreedByProviderAt";
    readonly paidAt: "paidAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type PilotPaymentScalarFieldEnum = (typeof PilotPaymentScalarFieldEnum)[keyof typeof PilotPaymentScalarFieldEnum];
export declare const BookingEventScalarFieldEnum: {
    readonly id: "id";
    readonly bookingId: "bookingId";
    readonly actorId: "actorId";
    readonly actorType: "actorType";
    readonly fromStatus: "fromStatus";
    readonly toStatus: "toStatus";
    readonly eventType: "eventType";
    readonly reason: "reason";
    readonly metadata: "metadata";
    readonly createdAt: "createdAt";
};
export type BookingEventScalarFieldEnum = (typeof BookingEventScalarFieldEnum)[keyof typeof BookingEventScalarFieldEnum];
export declare const IdempotencyKeyScalarFieldEnum: {
    readonly id: "id";
    readonly key: "key";
    readonly userId: "userId";
    readonly requestHash: "requestHash";
    readonly responseBody: "responseBody";
    readonly statusCode: "statusCode";
    readonly expiresAt: "expiresAt";
    readonly createdAt: "createdAt";
};
export type IdempotencyKeyScalarFieldEnum = (typeof IdempotencyKeyScalarFieldEnum)[keyof typeof IdempotencyKeyScalarFieldEnum];
export declare const FavoriteScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly listingId: "listingId";
    readonly createdAt: "createdAt";
};
export type FavoriteScalarFieldEnum = (typeof FavoriteScalarFieldEnum)[keyof typeof FavoriteScalarFieldEnum];
export declare const ConversationScalarFieldEnum: {
    readonly id: "id";
    readonly bookingId: "bookingId";
    readonly title: "title";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly deletedAt: "deletedAt";
};
export type ConversationScalarFieldEnum = (typeof ConversationScalarFieldEnum)[keyof typeof ConversationScalarFieldEnum];
export declare const ConversationParticipantScalarFieldEnum: {
    readonly id: "id";
    readonly conversationId: "conversationId";
    readonly userId: "userId";
    readonly lastReadAt: "lastReadAt";
    readonly joinedAt: "joinedAt";
    readonly mutedAt: "mutedAt";
};
export type ConversationParticipantScalarFieldEnum = (typeof ConversationParticipantScalarFieldEnum)[keyof typeof ConversationParticipantScalarFieldEnum];
export declare const UserBlockScalarFieldEnum: {
    readonly id: "id";
    readonly blockerId: "blockerId";
    readonly blockedId: "blockedId";
    readonly createdAt: "createdAt";
};
export type UserBlockScalarFieldEnum = (typeof UserBlockScalarFieldEnum)[keyof typeof UserBlockScalarFieldEnum];
export declare const ReportScalarFieldEnum: {
    readonly id: "id";
    readonly reporterId: "reporterId";
    readonly reason: "reason";
    readonly targetType: "targetType";
    readonly targetId: "targetId";
    readonly details: "details";
    readonly status: "status";
    readonly resolution: "resolution";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly resolvedAt: "resolvedAt";
};
export type ReportScalarFieldEnum = (typeof ReportScalarFieldEnum)[keyof typeof ReportScalarFieldEnum];
export declare const ModerationActionScalarFieldEnum: {
    readonly id: "id";
    readonly reportId: "reportId";
    readonly adminId: "adminId";
    readonly action: "action";
    readonly reason: "reason";
    readonly metadata: "metadata";
    readonly expiresAt: "expiresAt";
    readonly createdAt: "createdAt";
};
export type ModerationActionScalarFieldEnum = (typeof ModerationActionScalarFieldEnum)[keyof typeof ModerationActionScalarFieldEnum];
export declare const MessageScalarFieldEnum: {
    readonly id: "id";
    readonly conversationId: "conversationId";
    readonly senderId: "senderId";
    readonly type: "type";
    readonly body: "body";
    readonly mediaUrl: "mediaUrl";
    readonly sentAt: "sentAt";
    readonly deletedAt: "deletedAt";
};
export type MessageScalarFieldEnum = (typeof MessageScalarFieldEnum)[keyof typeof MessageScalarFieldEnum];
export declare const NotificationScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly type: "type";
    readonly title: "title";
    readonly body: "body";
    readonly data: "data";
    readonly readAt: "readAt";
    readonly createdAt: "createdAt";
};
export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum];
export declare const PaymentMethodScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly providerRef: "providerRef";
    readonly brand: "brand";
    readonly last4: "last4";
    readonly expMonth: "expMonth";
    readonly expYear: "expYear";
    readonly isDefault: "isDefault";
    readonly createdAt: "createdAt";
    readonly deletedAt: "deletedAt";
};
export type PaymentMethodScalarFieldEnum = (typeof PaymentMethodScalarFieldEnum)[keyof typeof PaymentMethodScalarFieldEnum];
export declare const ReviewScalarFieldEnum: {
    readonly id: "id";
    readonly bookingId: "bookingId";
    readonly authorId: "authorId";
    readonly guideId: "guideId";
    readonly listingId: "listingId";
    readonly rating: "rating";
    readonly text: "text";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly deletedAt: "deletedAt";
};
export type ReviewScalarFieldEnum = (typeof ReviewScalarFieldEnum)[keyof typeof ReviewScalarFieldEnum];
export declare const PostScalarFieldEnum: {
    readonly id: "id";
    readonly authorId: "authorId";
    readonly text: "text";
    readonly location: "location";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly deletedAt: "deletedAt";
};
export type PostScalarFieldEnum = (typeof PostScalarFieldEnum)[keyof typeof PostScalarFieldEnum];
export declare const PostImageScalarFieldEnum: {
    readonly id: "id";
    readonly postId: "postId";
    readonly url: "url";
    readonly sortOrder: "sortOrder";
};
export type PostImageScalarFieldEnum = (typeof PostImageScalarFieldEnum)[keyof typeof PostImageScalarFieldEnum];
export declare const PostLikeScalarFieldEnum: {
    readonly id: "id";
    readonly postId: "postId";
    readonly userId: "userId";
    readonly createdAt: "createdAt";
};
export type PostLikeScalarFieldEnum = (typeof PostLikeScalarFieldEnum)[keyof typeof PostLikeScalarFieldEnum];
export declare const PostCommentScalarFieldEnum: {
    readonly id: "id";
    readonly postId: "postId";
    readonly authorId: "authorId";
    readonly text: "text";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly deletedAt: "deletedAt";
};
export type PostCommentScalarFieldEnum = (typeof PostCommentScalarFieldEnum)[keyof typeof PostCommentScalarFieldEnum];
export declare const FollowScalarFieldEnum: {
    readonly id: "id";
    readonly followerId: "followerId";
    readonly followingId: "followingId";
    readonly createdAt: "createdAt";
};
export type FollowScalarFieldEnum = (typeof FollowScalarFieldEnum)[keyof typeof FollowScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const JsonNullValueInput: {
    readonly JsonNull: runtime.JsonNullClass;
};
export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput];
export declare const NullableJsonNullValueInput: {
    readonly DbNull: runtime.DbNullClass;
    readonly JsonNull: runtime.JsonNullClass;
};
export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export declare const JsonNullValueFilter: {
    readonly DbNull: runtime.DbNullClass;
    readonly JsonNull: runtime.JsonNullClass;
    readonly AnyNull: runtime.AnyNullClass;
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;
export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>;
export type EnumAuthProviderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AuthProvider'>;
export type ListEnumAuthProviderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AuthProvider[]'>;
export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>;
export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>;
export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>;
export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;
export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>;
export type EnumUserModerationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserModerationStatus'>;
export type ListEnumUserModerationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserModerationStatus[]'>;
export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;
export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>;
export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>;
export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>;
export type EnumPricingTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PricingType'>;
export type ListEnumPricingTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PricingType[]'>;
export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>;
export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>;
export type EnumGuideStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GuideStatus'>;
export type ListEnumGuideStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GuideStatus[]'>;
export type EnumGuideLegalRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GuideLegalRole'>;
export type ListEnumGuideLegalRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GuideLegalRole[]'>;
export type EnumGuideEvidenceTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GuideEvidenceType'>;
export type ListEnumGuideEvidenceTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GuideEvidenceType[]'>;
export type EnumVerificationCheckStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VerificationCheckStatus'>;
export type ListEnumVerificationCheckStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VerificationCheckStatus[]'>;
export type EnumCompetencyTaskTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CompetencyTaskType'>;
export type ListEnumCompetencyTaskTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CompetencyTaskType[]'>;
export type EnumTourismSourceTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TourismSourceType'>;
export type ListEnumTourismSourceTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TourismSourceType[]'>;
export type EnumTourismAuthorityLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TourismAuthorityLevel'>;
export type ListEnumTourismAuthorityLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TourismAuthorityLevel[]'>;
export type EnumRouteFamilyFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RouteFamily'>;
export type ListEnumRouteFamilyFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RouteFamily[]'>;
export type EnumTourismKnowledgeCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TourismKnowledgeCategory'>;
export type ListEnumTourismKnowledgeCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TourismKnowledgeCategory[]'>;
export type EnumRouteRiskLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RouteRiskLevel'>;
export type ListEnumRouteRiskLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RouteRiskLevel[]'>;
export type EnumCefrLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CefrLevel'>;
export type ListEnumCefrLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CefrLevel[]'>;
export type EnumRouteNodeTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RouteNodeType'>;
export type ListEnumRouteNodeTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RouteNodeType[]'>;
export type EnumRouteTransportModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RouteTransportMode'>;
export type ListEnumRouteTransportModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RouteTransportMode[]'>;
export type EnumSafetyPlanStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SafetyPlanStatus'>;
export type ListEnumSafetyPlanStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SafetyPlanStatus[]'>;
export type EnumSafetyPlanAuditActionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SafetyPlanAuditAction'>;
export type ListEnumSafetyPlanAuditActionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SafetyPlanAuditAction[]'>;
export type EnumGuideCompetencyTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GuideCompetencyType'>;
export type ListEnumGuideCompetencyTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GuideCompetencyType[]'>;
export type EnumGuideCompetencyStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GuideCompetencyStatus'>;
export type ListEnumGuideCompetencyStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GuideCompetencyStatus[]'>;
export type EnumEvaluatorTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EvaluatorType'>;
export type ListEnumEvaluatorTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EvaluatorType[]'>;
export type EnumHumanReviewStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'HumanReviewStatus'>;
export type ListEnumHumanReviewStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'HumanReviewStatus[]'>;
export type EnumFirstAidCertificateStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FirstAidCertificateStatus'>;
export type ListEnumFirstAidCertificateStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FirstAidCertificateStatus[]'>;
export type EnumPracticalVerificationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PracticalVerificationStatus'>;
export type ListEnumPracticalVerificationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PracticalVerificationStatus[]'>;
export type EnumAssessmentCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AssessmentCategory'>;
export type ListEnumAssessmentCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AssessmentCategory[]'>;
export type EnumAssessmentDifficultyFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AssessmentDifficulty'>;
export type ListEnumAssessmentDifficultyFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AssessmentDifficulty[]'>;
export type EnumAssessmentQuestionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AssessmentQuestionType'>;
export type ListEnumAssessmentQuestionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AssessmentQuestionType[]'>;
export type EnumAssessmentTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AssessmentType'>;
export type ListEnumAssessmentTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AssessmentType[]'>;
export type EnumAssessmentAttemptStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AssessmentAttemptStatus'>;
export type ListEnumAssessmentAttemptStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AssessmentAttemptStatus[]'>;
export type EnumAssessmentReviewDecisionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AssessmentReviewDecision'>;
export type ListEnumAssessmentReviewDecisionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AssessmentReviewDecision[]'>;
export type EnumAiExperimentModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AiExperimentMode'>;
export type ListEnumAiExperimentModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AiExperimentMode[]'>;
export type EnumAiConversationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AiConversationStatus'>;
export type ListEnumAiConversationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AiConversationStatus[]'>;
export type EnumAiMessageRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AiMessageRole'>;
export type ListEnumAiMessageRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AiMessageRole[]'>;
export type EnumAiRequestTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AiRequestType'>;
export type ListEnumAiRequestTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AiRequestType[]'>;
export type EnumGuideVerificationDecisionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GuideVerificationDecision'>;
export type ListEnumGuideVerificationDecisionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GuideVerificationDecision[]'>;
export type EnumListingCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ListingCategory'>;
export type ListEnumListingCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ListingCategory[]'>;
export type EnumPriceUnitFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PriceUnit'>;
export type ListEnumPriceUnitFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PriceUnit[]'>;
export type EnumListingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ListingStatus'>;
export type ListEnumListingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ListingStatus[]'>;
export type EnumBookingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BookingStatus'>;
export type ListEnumBookingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BookingStatus[]'>;
export type EnumCancellationPolicyTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CancellationPolicyType'>;
export type ListEnumCancellationPolicyTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CancellationPolicyType[]'>;
export type EnumPaymentArrangementFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentArrangement'>;
export type ListEnumPaymentArrangementFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentArrangement[]'>;
export type EnumPaymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentStatus'>;
export type ListEnumPaymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentStatus[]'>;
export type EnumBookingActorTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BookingActorType'>;
export type ListEnumBookingActorTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BookingActorType[]'>;
export type EnumReportReasonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReportReason'>;
export type ListEnumReportReasonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReportReason[]'>;
export type EnumReportTargetTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReportTargetType'>;
export type ListEnumReportTargetTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReportTargetType[]'>;
export type EnumReportStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReportStatus'>;
export type ListEnumReportStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReportStatus[]'>;
export type EnumModerationActionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ModerationActionType'>;
export type ListEnumModerationActionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ModerationActionType[]'>;
export type EnumMessageTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MessageType'>;
export type ListEnumMessageTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MessageType[]'>;
export type EnumNotificationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationType'>;
export type ListEnumNotificationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationType[]'>;
export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;
export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>;
export type BatchPayload = {
    count: number;
};
export declare const defineExtension: runtime.Types.Extensions.ExtendsHook<"define", TypeMapCb, runtime.Types.Extensions.DefaultArgs>;
export type DefaultPrismaClient = PrismaClient;
export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
export type PrismaClientOptions = ({
    adapter: runtime.SqlDriverAdapterFactory;
    accelerateUrl?: never;
} | {
    accelerateUrl: string;
    adapter?: never;
}) & {
    errorFormat?: ErrorFormat;
    log?: (LogLevel | LogDefinition)[];
    transactionOptions?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: TransactionIsolationLevel;
    };
    omit?: GlobalOmitConfig;
    comments?: runtime.SqlCommenterPlugin[];
};
export type GlobalOmitConfig = {
    user?: Prisma.UserOmit;
    refreshToken?: Prisma.RefreshTokenOmit;
    emailVerificationToken?: Prisma.EmailVerificationTokenOmit;
    passwordResetToken?: Prisma.PasswordResetTokenOmit;
    guideProfile?: Prisma.GuideProfileOmit;
    guideEvidence?: Prisma.GuideEvidenceOmit;
    competencyAttempt?: Prisma.CompetencyAttemptOmit;
    tourismSource?: Prisma.TourismSourceOmit;
    tourismKnowledge?: Prisma.TourismKnowledgeOmit;
    researchRoute?: Prisma.ResearchRouteOmit;
    routeNode?: Prisma.RouteNodeOmit;
    routeEdge?: Prisma.RouteEdgeOmit;
    safetyPlan?: Prisma.SafetyPlanOmit;
    safetyPlanAudit?: Prisma.SafetyPlanAuditOmit;
    guideCompetency?: Prisma.GuideCompetencyOmit;
    guideLanguageAssessment?: Prisma.GuideLanguageAssessmentOmit;
    guideKnowledgeAssessment?: Prisma.GuideKnowledgeAssessmentOmit;
    guideSkillAssessment?: Prisma.GuideSkillAssessmentOmit;
    guideRouteCompetency?: Prisma.GuideRouteCompetencyOmit;
    guideFirstAid?: Prisma.GuideFirstAidOmit;
    assessmentQuestion?: Prisma.AssessmentQuestionOmit;
    assessmentAttempt?: Prisma.AssessmentAttemptOmit;
    assessmentResponse?: Prisma.AssessmentResponseOmit;
    assessmentReview?: Prisma.AssessmentReviewOmit;
    aiConversation?: Prisma.AiConversationOmit;
    aiMessage?: Prisma.AiMessageOmit;
    aiExperimentRun?: Prisma.AiExperimentRunOmit;
    aiEvaluationResult?: Prisma.AiEvaluationResultOmit;
    guideMatchRun?: Prisma.GuideMatchRunOmit;
    guideMatchResult?: Prisma.GuideMatchResultOmit;
    guideVerificationReview?: Prisma.GuideVerificationReviewOmit;
    listing?: Prisma.ListingOmit;
    listingInventory?: Prisma.ListingInventoryOmit;
    listingImage?: Prisma.ListingImageOmit;
    booking?: Prisma.BookingOmit;
    pilotPayment?: Prisma.PilotPaymentOmit;
    bookingEvent?: Prisma.BookingEventOmit;
    idempotencyKey?: Prisma.IdempotencyKeyOmit;
    favorite?: Prisma.FavoriteOmit;
    conversation?: Prisma.ConversationOmit;
    conversationParticipant?: Prisma.ConversationParticipantOmit;
    userBlock?: Prisma.UserBlockOmit;
    report?: Prisma.ReportOmit;
    moderationAction?: Prisma.ModerationActionOmit;
    message?: Prisma.MessageOmit;
    notification?: Prisma.NotificationOmit;
    paymentMethod?: Prisma.PaymentMethodOmit;
    review?: Prisma.ReviewOmit;
    post?: Prisma.PostOmit;
    postImage?: Prisma.PostImageOmit;
    postLike?: Prisma.PostLikeOmit;
    postComment?: Prisma.PostCommentOmit;
    follow?: Prisma.FollowOmit;
};
export type LogLevel = 'info' | 'query' | 'warn' | 'error';
export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
};
export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;
export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>;
export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;
export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
};
export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
};
export type PrismaAction = 'findUnique' | 'findUniqueOrThrow' | 'findMany' | 'findFirst' | 'findFirstOrThrow' | 'create' | 'createMany' | 'createManyAndReturn' | 'update' | 'updateMany' | 'updateManyAndReturn' | 'upsert' | 'delete' | 'deleteMany' | 'executeRaw' | 'queryRaw' | 'aggregate' | 'count' | 'runCommandRaw' | 'findRaw' | 'groupBy';
export type TransactionClient = Omit<DefaultPrismaClient, runtime.ITXClientDenyList>;
