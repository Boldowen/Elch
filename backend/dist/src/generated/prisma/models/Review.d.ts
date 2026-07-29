import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ReviewModel = runtime.Types.Result.DefaultSelection<Prisma.$ReviewPayload>;
export type AggregateReview = {
    _count: ReviewCountAggregateOutputType | null;
    _avg: ReviewAvgAggregateOutputType | null;
    _sum: ReviewSumAggregateOutputType | null;
    _min: ReviewMinAggregateOutputType | null;
    _max: ReviewMaxAggregateOutputType | null;
};
export type ReviewAvgAggregateOutputType = {
    rating: number | null;
};
export type ReviewSumAggregateOutputType = {
    rating: number | null;
};
export type ReviewMinAggregateOutputType = {
    id: string | null;
    bookingId: string | null;
    authorId: string | null;
    guideId: string | null;
    listingId: string | null;
    rating: number | null;
    text: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
};
export type ReviewMaxAggregateOutputType = {
    id: string | null;
    bookingId: string | null;
    authorId: string | null;
    guideId: string | null;
    listingId: string | null;
    rating: number | null;
    text: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
};
export type ReviewCountAggregateOutputType = {
    id: number;
    bookingId: number;
    authorId: number;
    guideId: number;
    listingId: number;
    rating: number;
    text: number;
    createdAt: number;
    updatedAt: number;
    deletedAt: number;
    _all: number;
};
export type ReviewAvgAggregateInputType = {
    rating?: true;
};
export type ReviewSumAggregateInputType = {
    rating?: true;
};
export type ReviewMinAggregateInputType = {
    id?: true;
    bookingId?: true;
    authorId?: true;
    guideId?: true;
    listingId?: true;
    rating?: true;
    text?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
};
export type ReviewMaxAggregateInputType = {
    id?: true;
    bookingId?: true;
    authorId?: true;
    guideId?: true;
    listingId?: true;
    rating?: true;
    text?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
};
export type ReviewCountAggregateInputType = {
    id?: true;
    bookingId?: true;
    authorId?: true;
    guideId?: true;
    listingId?: true;
    rating?: true;
    text?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
    _all?: true;
};
export type ReviewAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReviewWhereInput;
    orderBy?: Prisma.ReviewOrderByWithRelationInput | Prisma.ReviewOrderByWithRelationInput[];
    cursor?: Prisma.ReviewWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ReviewCountAggregateInputType;
    _avg?: ReviewAvgAggregateInputType;
    _sum?: ReviewSumAggregateInputType;
    _min?: ReviewMinAggregateInputType;
    _max?: ReviewMaxAggregateInputType;
};
export type GetReviewAggregateType<T extends ReviewAggregateArgs> = {
    [P in keyof T & keyof AggregateReview]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateReview[P]> : Prisma.GetScalarType<T[P], AggregateReview[P]>;
};
export type ReviewGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReviewWhereInput;
    orderBy?: Prisma.ReviewOrderByWithAggregationInput | Prisma.ReviewOrderByWithAggregationInput[];
    by: Prisma.ReviewScalarFieldEnum[] | Prisma.ReviewScalarFieldEnum;
    having?: Prisma.ReviewScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ReviewCountAggregateInputType | true;
    _avg?: ReviewAvgAggregateInputType;
    _sum?: ReviewSumAggregateInputType;
    _min?: ReviewMinAggregateInputType;
    _max?: ReviewMaxAggregateInputType;
};
export type ReviewGroupByOutputType = {
    id: string;
    bookingId: string | null;
    authorId: string;
    guideId: string | null;
    listingId: string | null;
    rating: number;
    text: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    _count: ReviewCountAggregateOutputType | null;
    _avg: ReviewAvgAggregateOutputType | null;
    _sum: ReviewSumAggregateOutputType | null;
    _min: ReviewMinAggregateOutputType | null;
    _max: ReviewMaxAggregateOutputType | null;
};
export type GetReviewGroupByPayload<T extends ReviewGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ReviewGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ReviewGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ReviewGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ReviewGroupByOutputType[P]>;
}>>;
export type ReviewWhereInput = {
    AND?: Prisma.ReviewWhereInput | Prisma.ReviewWhereInput[];
    OR?: Prisma.ReviewWhereInput[];
    NOT?: Prisma.ReviewWhereInput | Prisma.ReviewWhereInput[];
    id?: Prisma.UuidFilter<"Review"> | string;
    bookingId?: Prisma.UuidNullableFilter<"Review"> | string | null;
    authorId?: Prisma.UuidFilter<"Review"> | string;
    guideId?: Prisma.UuidNullableFilter<"Review"> | string | null;
    listingId?: Prisma.UuidNullableFilter<"Review"> | string | null;
    rating?: Prisma.IntFilter<"Review"> | number;
    text?: Prisma.StringFilter<"Review"> | string;
    createdAt?: Prisma.DateTimeFilter<"Review"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Review"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"Review"> | Date | string | null;
    author?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    guide?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    listing?: Prisma.XOR<Prisma.ListingNullableScalarRelationFilter, Prisma.ListingWhereInput> | null;
    booking?: Prisma.XOR<Prisma.BookingNullableScalarRelationFilter, Prisma.BookingWhereInput> | null;
};
export type ReviewOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    bookingId?: Prisma.SortOrderInput | Prisma.SortOrder;
    authorId?: Prisma.SortOrder;
    guideId?: Prisma.SortOrderInput | Prisma.SortOrder;
    listingId?: Prisma.SortOrderInput | Prisma.SortOrder;
    rating?: Prisma.SortOrder;
    text?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    author?: Prisma.UserOrderByWithRelationInput;
    guide?: Prisma.UserOrderByWithRelationInput;
    listing?: Prisma.ListingOrderByWithRelationInput;
    booking?: Prisma.BookingOrderByWithRelationInput;
};
export type ReviewWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    bookingId?: string;
    AND?: Prisma.ReviewWhereInput | Prisma.ReviewWhereInput[];
    OR?: Prisma.ReviewWhereInput[];
    NOT?: Prisma.ReviewWhereInput | Prisma.ReviewWhereInput[];
    authorId?: Prisma.UuidFilter<"Review"> | string;
    guideId?: Prisma.UuidNullableFilter<"Review"> | string | null;
    listingId?: Prisma.UuidNullableFilter<"Review"> | string | null;
    rating?: Prisma.IntFilter<"Review"> | number;
    text?: Prisma.StringFilter<"Review"> | string;
    createdAt?: Prisma.DateTimeFilter<"Review"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Review"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"Review"> | Date | string | null;
    author?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    guide?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    listing?: Prisma.XOR<Prisma.ListingNullableScalarRelationFilter, Prisma.ListingWhereInput> | null;
    booking?: Prisma.XOR<Prisma.BookingNullableScalarRelationFilter, Prisma.BookingWhereInput> | null;
}, "id" | "bookingId">;
export type ReviewOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    bookingId?: Prisma.SortOrderInput | Prisma.SortOrder;
    authorId?: Prisma.SortOrder;
    guideId?: Prisma.SortOrderInput | Prisma.SortOrder;
    listingId?: Prisma.SortOrderInput | Prisma.SortOrder;
    rating?: Prisma.SortOrder;
    text?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.ReviewCountOrderByAggregateInput;
    _avg?: Prisma.ReviewAvgOrderByAggregateInput;
    _max?: Prisma.ReviewMaxOrderByAggregateInput;
    _min?: Prisma.ReviewMinOrderByAggregateInput;
    _sum?: Prisma.ReviewSumOrderByAggregateInput;
};
export type ReviewScalarWhereWithAggregatesInput = {
    AND?: Prisma.ReviewScalarWhereWithAggregatesInput | Prisma.ReviewScalarWhereWithAggregatesInput[];
    OR?: Prisma.ReviewScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ReviewScalarWhereWithAggregatesInput | Prisma.ReviewScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"Review"> | string;
    bookingId?: Prisma.UuidNullableWithAggregatesFilter<"Review"> | string | null;
    authorId?: Prisma.UuidWithAggregatesFilter<"Review"> | string;
    guideId?: Prisma.UuidNullableWithAggregatesFilter<"Review"> | string | null;
    listingId?: Prisma.UuidNullableWithAggregatesFilter<"Review"> | string | null;
    rating?: Prisma.IntWithAggregatesFilter<"Review"> | number;
    text?: Prisma.StringWithAggregatesFilter<"Review"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Review"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Review"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Review"> | Date | string | null;
};
export type ReviewCreateInput = {
    id?: string;
    rating: number;
    text: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    author: Prisma.UserCreateNestedOneWithoutReviewsWrittenInput;
    guide?: Prisma.UserCreateNestedOneWithoutReviewsReceivedInput;
    listing?: Prisma.ListingCreateNestedOneWithoutReviewsInput;
    booking?: Prisma.BookingCreateNestedOneWithoutReviewInput;
};
export type ReviewUncheckedCreateInput = {
    id?: string;
    bookingId?: string | null;
    authorId: string;
    guideId?: string | null;
    listingId?: string | null;
    rating: number;
    text: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type ReviewUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rating?: Prisma.IntFieldUpdateOperationsInput | number;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    author?: Prisma.UserUpdateOneRequiredWithoutReviewsWrittenNestedInput;
    guide?: Prisma.UserUpdateOneWithoutReviewsReceivedNestedInput;
    listing?: Prisma.ListingUpdateOneWithoutReviewsNestedInput;
    booking?: Prisma.BookingUpdateOneWithoutReviewNestedInput;
};
export type ReviewUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    bookingId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    authorId?: Prisma.StringFieldUpdateOperationsInput | string;
    guideId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    listingId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    rating?: Prisma.IntFieldUpdateOperationsInput | number;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ReviewCreateManyInput = {
    id?: string;
    bookingId?: string | null;
    authorId: string;
    guideId?: string | null;
    listingId?: string | null;
    rating: number;
    text: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type ReviewUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rating?: Prisma.IntFieldUpdateOperationsInput | number;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ReviewUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    bookingId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    authorId?: Prisma.StringFieldUpdateOperationsInput | string;
    guideId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    listingId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    rating?: Prisma.IntFieldUpdateOperationsInput | number;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ReviewListRelationFilter = {
    every?: Prisma.ReviewWhereInput;
    some?: Prisma.ReviewWhereInput;
    none?: Prisma.ReviewWhereInput;
};
export type ReviewOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ReviewNullableScalarRelationFilter = {
    is?: Prisma.ReviewWhereInput | null;
    isNot?: Prisma.ReviewWhereInput | null;
};
export type ReviewCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    bookingId?: Prisma.SortOrder;
    authorId?: Prisma.SortOrder;
    guideId?: Prisma.SortOrder;
    listingId?: Prisma.SortOrder;
    rating?: Prisma.SortOrder;
    text?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type ReviewAvgOrderByAggregateInput = {
    rating?: Prisma.SortOrder;
};
export type ReviewMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    bookingId?: Prisma.SortOrder;
    authorId?: Prisma.SortOrder;
    guideId?: Prisma.SortOrder;
    listingId?: Prisma.SortOrder;
    rating?: Prisma.SortOrder;
    text?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type ReviewMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    bookingId?: Prisma.SortOrder;
    authorId?: Prisma.SortOrder;
    guideId?: Prisma.SortOrder;
    listingId?: Prisma.SortOrder;
    rating?: Prisma.SortOrder;
    text?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type ReviewSumOrderByAggregateInput = {
    rating?: Prisma.SortOrder;
};
export type ReviewCreateNestedManyWithoutAuthorInput = {
    create?: Prisma.XOR<Prisma.ReviewCreateWithoutAuthorInput, Prisma.ReviewUncheckedCreateWithoutAuthorInput> | Prisma.ReviewCreateWithoutAuthorInput[] | Prisma.ReviewUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?: Prisma.ReviewCreateOrConnectWithoutAuthorInput | Prisma.ReviewCreateOrConnectWithoutAuthorInput[];
    createMany?: Prisma.ReviewCreateManyAuthorInputEnvelope;
    connect?: Prisma.ReviewWhereUniqueInput | Prisma.ReviewWhereUniqueInput[];
};
export type ReviewCreateNestedManyWithoutGuideInput = {
    create?: Prisma.XOR<Prisma.ReviewCreateWithoutGuideInput, Prisma.ReviewUncheckedCreateWithoutGuideInput> | Prisma.ReviewCreateWithoutGuideInput[] | Prisma.ReviewUncheckedCreateWithoutGuideInput[];
    connectOrCreate?: Prisma.ReviewCreateOrConnectWithoutGuideInput | Prisma.ReviewCreateOrConnectWithoutGuideInput[];
    createMany?: Prisma.ReviewCreateManyGuideInputEnvelope;
    connect?: Prisma.ReviewWhereUniqueInput | Prisma.ReviewWhereUniqueInput[];
};
export type ReviewUncheckedCreateNestedManyWithoutAuthorInput = {
    create?: Prisma.XOR<Prisma.ReviewCreateWithoutAuthorInput, Prisma.ReviewUncheckedCreateWithoutAuthorInput> | Prisma.ReviewCreateWithoutAuthorInput[] | Prisma.ReviewUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?: Prisma.ReviewCreateOrConnectWithoutAuthorInput | Prisma.ReviewCreateOrConnectWithoutAuthorInput[];
    createMany?: Prisma.ReviewCreateManyAuthorInputEnvelope;
    connect?: Prisma.ReviewWhereUniqueInput | Prisma.ReviewWhereUniqueInput[];
};
export type ReviewUncheckedCreateNestedManyWithoutGuideInput = {
    create?: Prisma.XOR<Prisma.ReviewCreateWithoutGuideInput, Prisma.ReviewUncheckedCreateWithoutGuideInput> | Prisma.ReviewCreateWithoutGuideInput[] | Prisma.ReviewUncheckedCreateWithoutGuideInput[];
    connectOrCreate?: Prisma.ReviewCreateOrConnectWithoutGuideInput | Prisma.ReviewCreateOrConnectWithoutGuideInput[];
    createMany?: Prisma.ReviewCreateManyGuideInputEnvelope;
    connect?: Prisma.ReviewWhereUniqueInput | Prisma.ReviewWhereUniqueInput[];
};
export type ReviewUpdateManyWithoutAuthorNestedInput = {
    create?: Prisma.XOR<Prisma.ReviewCreateWithoutAuthorInput, Prisma.ReviewUncheckedCreateWithoutAuthorInput> | Prisma.ReviewCreateWithoutAuthorInput[] | Prisma.ReviewUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?: Prisma.ReviewCreateOrConnectWithoutAuthorInput | Prisma.ReviewCreateOrConnectWithoutAuthorInput[];
    upsert?: Prisma.ReviewUpsertWithWhereUniqueWithoutAuthorInput | Prisma.ReviewUpsertWithWhereUniqueWithoutAuthorInput[];
    createMany?: Prisma.ReviewCreateManyAuthorInputEnvelope;
    set?: Prisma.ReviewWhereUniqueInput | Prisma.ReviewWhereUniqueInput[];
    disconnect?: Prisma.ReviewWhereUniqueInput | Prisma.ReviewWhereUniqueInput[];
    delete?: Prisma.ReviewWhereUniqueInput | Prisma.ReviewWhereUniqueInput[];
    connect?: Prisma.ReviewWhereUniqueInput | Prisma.ReviewWhereUniqueInput[];
    update?: Prisma.ReviewUpdateWithWhereUniqueWithoutAuthorInput | Prisma.ReviewUpdateWithWhereUniqueWithoutAuthorInput[];
    updateMany?: Prisma.ReviewUpdateManyWithWhereWithoutAuthorInput | Prisma.ReviewUpdateManyWithWhereWithoutAuthorInput[];
    deleteMany?: Prisma.ReviewScalarWhereInput | Prisma.ReviewScalarWhereInput[];
};
export type ReviewUpdateManyWithoutGuideNestedInput = {
    create?: Prisma.XOR<Prisma.ReviewCreateWithoutGuideInput, Prisma.ReviewUncheckedCreateWithoutGuideInput> | Prisma.ReviewCreateWithoutGuideInput[] | Prisma.ReviewUncheckedCreateWithoutGuideInput[];
    connectOrCreate?: Prisma.ReviewCreateOrConnectWithoutGuideInput | Prisma.ReviewCreateOrConnectWithoutGuideInput[];
    upsert?: Prisma.ReviewUpsertWithWhereUniqueWithoutGuideInput | Prisma.ReviewUpsertWithWhereUniqueWithoutGuideInput[];
    createMany?: Prisma.ReviewCreateManyGuideInputEnvelope;
    set?: Prisma.ReviewWhereUniqueInput | Prisma.ReviewWhereUniqueInput[];
    disconnect?: Prisma.ReviewWhereUniqueInput | Prisma.ReviewWhereUniqueInput[];
    delete?: Prisma.ReviewWhereUniqueInput | Prisma.ReviewWhereUniqueInput[];
    connect?: Prisma.ReviewWhereUniqueInput | Prisma.ReviewWhereUniqueInput[];
    update?: Prisma.ReviewUpdateWithWhereUniqueWithoutGuideInput | Prisma.ReviewUpdateWithWhereUniqueWithoutGuideInput[];
    updateMany?: Prisma.ReviewUpdateManyWithWhereWithoutGuideInput | Prisma.ReviewUpdateManyWithWhereWithoutGuideInput[];
    deleteMany?: Prisma.ReviewScalarWhereInput | Prisma.ReviewScalarWhereInput[];
};
export type ReviewUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?: Prisma.XOR<Prisma.ReviewCreateWithoutAuthorInput, Prisma.ReviewUncheckedCreateWithoutAuthorInput> | Prisma.ReviewCreateWithoutAuthorInput[] | Prisma.ReviewUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?: Prisma.ReviewCreateOrConnectWithoutAuthorInput | Prisma.ReviewCreateOrConnectWithoutAuthorInput[];
    upsert?: Prisma.ReviewUpsertWithWhereUniqueWithoutAuthorInput | Prisma.ReviewUpsertWithWhereUniqueWithoutAuthorInput[];
    createMany?: Prisma.ReviewCreateManyAuthorInputEnvelope;
    set?: Prisma.ReviewWhereUniqueInput | Prisma.ReviewWhereUniqueInput[];
    disconnect?: Prisma.ReviewWhereUniqueInput | Prisma.ReviewWhereUniqueInput[];
    delete?: Prisma.ReviewWhereUniqueInput | Prisma.ReviewWhereUniqueInput[];
    connect?: Prisma.ReviewWhereUniqueInput | Prisma.ReviewWhereUniqueInput[];
    update?: Prisma.ReviewUpdateWithWhereUniqueWithoutAuthorInput | Prisma.ReviewUpdateWithWhereUniqueWithoutAuthorInput[];
    updateMany?: Prisma.ReviewUpdateManyWithWhereWithoutAuthorInput | Prisma.ReviewUpdateManyWithWhereWithoutAuthorInput[];
    deleteMany?: Prisma.ReviewScalarWhereInput | Prisma.ReviewScalarWhereInput[];
};
export type ReviewUncheckedUpdateManyWithoutGuideNestedInput = {
    create?: Prisma.XOR<Prisma.ReviewCreateWithoutGuideInput, Prisma.ReviewUncheckedCreateWithoutGuideInput> | Prisma.ReviewCreateWithoutGuideInput[] | Prisma.ReviewUncheckedCreateWithoutGuideInput[];
    connectOrCreate?: Prisma.ReviewCreateOrConnectWithoutGuideInput | Prisma.ReviewCreateOrConnectWithoutGuideInput[];
    upsert?: Prisma.ReviewUpsertWithWhereUniqueWithoutGuideInput | Prisma.ReviewUpsertWithWhereUniqueWithoutGuideInput[];
    createMany?: Prisma.ReviewCreateManyGuideInputEnvelope;
    set?: Prisma.ReviewWhereUniqueInput | Prisma.ReviewWhereUniqueInput[];
    disconnect?: Prisma.ReviewWhereUniqueInput | Prisma.ReviewWhereUniqueInput[];
    delete?: Prisma.ReviewWhereUniqueInput | Prisma.ReviewWhereUniqueInput[];
    connect?: Prisma.ReviewWhereUniqueInput | Prisma.ReviewWhereUniqueInput[];
    update?: Prisma.ReviewUpdateWithWhereUniqueWithoutGuideInput | Prisma.ReviewUpdateWithWhereUniqueWithoutGuideInput[];
    updateMany?: Prisma.ReviewUpdateManyWithWhereWithoutGuideInput | Prisma.ReviewUpdateManyWithWhereWithoutGuideInput[];
    deleteMany?: Prisma.ReviewScalarWhereInput | Prisma.ReviewScalarWhereInput[];
};
export type ReviewCreateNestedManyWithoutListingInput = {
    create?: Prisma.XOR<Prisma.ReviewCreateWithoutListingInput, Prisma.ReviewUncheckedCreateWithoutListingInput> | Prisma.ReviewCreateWithoutListingInput[] | Prisma.ReviewUncheckedCreateWithoutListingInput[];
    connectOrCreate?: Prisma.ReviewCreateOrConnectWithoutListingInput | Prisma.ReviewCreateOrConnectWithoutListingInput[];
    createMany?: Prisma.ReviewCreateManyListingInputEnvelope;
    connect?: Prisma.ReviewWhereUniqueInput | Prisma.ReviewWhereUniqueInput[];
};
export type ReviewUncheckedCreateNestedManyWithoutListingInput = {
    create?: Prisma.XOR<Prisma.ReviewCreateWithoutListingInput, Prisma.ReviewUncheckedCreateWithoutListingInput> | Prisma.ReviewCreateWithoutListingInput[] | Prisma.ReviewUncheckedCreateWithoutListingInput[];
    connectOrCreate?: Prisma.ReviewCreateOrConnectWithoutListingInput | Prisma.ReviewCreateOrConnectWithoutListingInput[];
    createMany?: Prisma.ReviewCreateManyListingInputEnvelope;
    connect?: Prisma.ReviewWhereUniqueInput | Prisma.ReviewWhereUniqueInput[];
};
export type ReviewUpdateManyWithoutListingNestedInput = {
    create?: Prisma.XOR<Prisma.ReviewCreateWithoutListingInput, Prisma.ReviewUncheckedCreateWithoutListingInput> | Prisma.ReviewCreateWithoutListingInput[] | Prisma.ReviewUncheckedCreateWithoutListingInput[];
    connectOrCreate?: Prisma.ReviewCreateOrConnectWithoutListingInput | Prisma.ReviewCreateOrConnectWithoutListingInput[];
    upsert?: Prisma.ReviewUpsertWithWhereUniqueWithoutListingInput | Prisma.ReviewUpsertWithWhereUniqueWithoutListingInput[];
    createMany?: Prisma.ReviewCreateManyListingInputEnvelope;
    set?: Prisma.ReviewWhereUniqueInput | Prisma.ReviewWhereUniqueInput[];
    disconnect?: Prisma.ReviewWhereUniqueInput | Prisma.ReviewWhereUniqueInput[];
    delete?: Prisma.ReviewWhereUniqueInput | Prisma.ReviewWhereUniqueInput[];
    connect?: Prisma.ReviewWhereUniqueInput | Prisma.ReviewWhereUniqueInput[];
    update?: Prisma.ReviewUpdateWithWhereUniqueWithoutListingInput | Prisma.ReviewUpdateWithWhereUniqueWithoutListingInput[];
    updateMany?: Prisma.ReviewUpdateManyWithWhereWithoutListingInput | Prisma.ReviewUpdateManyWithWhereWithoutListingInput[];
    deleteMany?: Prisma.ReviewScalarWhereInput | Prisma.ReviewScalarWhereInput[];
};
export type ReviewUncheckedUpdateManyWithoutListingNestedInput = {
    create?: Prisma.XOR<Prisma.ReviewCreateWithoutListingInput, Prisma.ReviewUncheckedCreateWithoutListingInput> | Prisma.ReviewCreateWithoutListingInput[] | Prisma.ReviewUncheckedCreateWithoutListingInput[];
    connectOrCreate?: Prisma.ReviewCreateOrConnectWithoutListingInput | Prisma.ReviewCreateOrConnectWithoutListingInput[];
    upsert?: Prisma.ReviewUpsertWithWhereUniqueWithoutListingInput | Prisma.ReviewUpsertWithWhereUniqueWithoutListingInput[];
    createMany?: Prisma.ReviewCreateManyListingInputEnvelope;
    set?: Prisma.ReviewWhereUniqueInput | Prisma.ReviewWhereUniqueInput[];
    disconnect?: Prisma.ReviewWhereUniqueInput | Prisma.ReviewWhereUniqueInput[];
    delete?: Prisma.ReviewWhereUniqueInput | Prisma.ReviewWhereUniqueInput[];
    connect?: Prisma.ReviewWhereUniqueInput | Prisma.ReviewWhereUniqueInput[];
    update?: Prisma.ReviewUpdateWithWhereUniqueWithoutListingInput | Prisma.ReviewUpdateWithWhereUniqueWithoutListingInput[];
    updateMany?: Prisma.ReviewUpdateManyWithWhereWithoutListingInput | Prisma.ReviewUpdateManyWithWhereWithoutListingInput[];
    deleteMany?: Prisma.ReviewScalarWhereInput | Prisma.ReviewScalarWhereInput[];
};
export type ReviewCreateNestedOneWithoutBookingInput = {
    create?: Prisma.XOR<Prisma.ReviewCreateWithoutBookingInput, Prisma.ReviewUncheckedCreateWithoutBookingInput>;
    connectOrCreate?: Prisma.ReviewCreateOrConnectWithoutBookingInput;
    connect?: Prisma.ReviewWhereUniqueInput;
};
export type ReviewUncheckedCreateNestedOneWithoutBookingInput = {
    create?: Prisma.XOR<Prisma.ReviewCreateWithoutBookingInput, Prisma.ReviewUncheckedCreateWithoutBookingInput>;
    connectOrCreate?: Prisma.ReviewCreateOrConnectWithoutBookingInput;
    connect?: Prisma.ReviewWhereUniqueInput;
};
export type ReviewUpdateOneWithoutBookingNestedInput = {
    create?: Prisma.XOR<Prisma.ReviewCreateWithoutBookingInput, Prisma.ReviewUncheckedCreateWithoutBookingInput>;
    connectOrCreate?: Prisma.ReviewCreateOrConnectWithoutBookingInput;
    upsert?: Prisma.ReviewUpsertWithoutBookingInput;
    disconnect?: Prisma.ReviewWhereInput | boolean;
    delete?: Prisma.ReviewWhereInput | boolean;
    connect?: Prisma.ReviewWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ReviewUpdateToOneWithWhereWithoutBookingInput, Prisma.ReviewUpdateWithoutBookingInput>, Prisma.ReviewUncheckedUpdateWithoutBookingInput>;
};
export type ReviewUncheckedUpdateOneWithoutBookingNestedInput = {
    create?: Prisma.XOR<Prisma.ReviewCreateWithoutBookingInput, Prisma.ReviewUncheckedCreateWithoutBookingInput>;
    connectOrCreate?: Prisma.ReviewCreateOrConnectWithoutBookingInput;
    upsert?: Prisma.ReviewUpsertWithoutBookingInput;
    disconnect?: Prisma.ReviewWhereInput | boolean;
    delete?: Prisma.ReviewWhereInput | boolean;
    connect?: Prisma.ReviewWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ReviewUpdateToOneWithWhereWithoutBookingInput, Prisma.ReviewUpdateWithoutBookingInput>, Prisma.ReviewUncheckedUpdateWithoutBookingInput>;
};
export type ReviewCreateWithoutAuthorInput = {
    id?: string;
    rating: number;
    text: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    guide?: Prisma.UserCreateNestedOneWithoutReviewsReceivedInput;
    listing?: Prisma.ListingCreateNestedOneWithoutReviewsInput;
    booking?: Prisma.BookingCreateNestedOneWithoutReviewInput;
};
export type ReviewUncheckedCreateWithoutAuthorInput = {
    id?: string;
    bookingId?: string | null;
    guideId?: string | null;
    listingId?: string | null;
    rating: number;
    text: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type ReviewCreateOrConnectWithoutAuthorInput = {
    where: Prisma.ReviewWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReviewCreateWithoutAuthorInput, Prisma.ReviewUncheckedCreateWithoutAuthorInput>;
};
export type ReviewCreateManyAuthorInputEnvelope = {
    data: Prisma.ReviewCreateManyAuthorInput | Prisma.ReviewCreateManyAuthorInput[];
    skipDuplicates?: boolean;
};
export type ReviewCreateWithoutGuideInput = {
    id?: string;
    rating: number;
    text: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    author: Prisma.UserCreateNestedOneWithoutReviewsWrittenInput;
    listing?: Prisma.ListingCreateNestedOneWithoutReviewsInput;
    booking?: Prisma.BookingCreateNestedOneWithoutReviewInput;
};
export type ReviewUncheckedCreateWithoutGuideInput = {
    id?: string;
    bookingId?: string | null;
    authorId: string;
    listingId?: string | null;
    rating: number;
    text: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type ReviewCreateOrConnectWithoutGuideInput = {
    where: Prisma.ReviewWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReviewCreateWithoutGuideInput, Prisma.ReviewUncheckedCreateWithoutGuideInput>;
};
export type ReviewCreateManyGuideInputEnvelope = {
    data: Prisma.ReviewCreateManyGuideInput | Prisma.ReviewCreateManyGuideInput[];
    skipDuplicates?: boolean;
};
export type ReviewUpsertWithWhereUniqueWithoutAuthorInput = {
    where: Prisma.ReviewWhereUniqueInput;
    update: Prisma.XOR<Prisma.ReviewUpdateWithoutAuthorInput, Prisma.ReviewUncheckedUpdateWithoutAuthorInput>;
    create: Prisma.XOR<Prisma.ReviewCreateWithoutAuthorInput, Prisma.ReviewUncheckedCreateWithoutAuthorInput>;
};
export type ReviewUpdateWithWhereUniqueWithoutAuthorInput = {
    where: Prisma.ReviewWhereUniqueInput;
    data: Prisma.XOR<Prisma.ReviewUpdateWithoutAuthorInput, Prisma.ReviewUncheckedUpdateWithoutAuthorInput>;
};
export type ReviewUpdateManyWithWhereWithoutAuthorInput = {
    where: Prisma.ReviewScalarWhereInput;
    data: Prisma.XOR<Prisma.ReviewUpdateManyMutationInput, Prisma.ReviewUncheckedUpdateManyWithoutAuthorInput>;
};
export type ReviewScalarWhereInput = {
    AND?: Prisma.ReviewScalarWhereInput | Prisma.ReviewScalarWhereInput[];
    OR?: Prisma.ReviewScalarWhereInput[];
    NOT?: Prisma.ReviewScalarWhereInput | Prisma.ReviewScalarWhereInput[];
    id?: Prisma.UuidFilter<"Review"> | string;
    bookingId?: Prisma.UuidNullableFilter<"Review"> | string | null;
    authorId?: Prisma.UuidFilter<"Review"> | string;
    guideId?: Prisma.UuidNullableFilter<"Review"> | string | null;
    listingId?: Prisma.UuidNullableFilter<"Review"> | string | null;
    rating?: Prisma.IntFilter<"Review"> | number;
    text?: Prisma.StringFilter<"Review"> | string;
    createdAt?: Prisma.DateTimeFilter<"Review"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Review"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"Review"> | Date | string | null;
};
export type ReviewUpsertWithWhereUniqueWithoutGuideInput = {
    where: Prisma.ReviewWhereUniqueInput;
    update: Prisma.XOR<Prisma.ReviewUpdateWithoutGuideInput, Prisma.ReviewUncheckedUpdateWithoutGuideInput>;
    create: Prisma.XOR<Prisma.ReviewCreateWithoutGuideInput, Prisma.ReviewUncheckedCreateWithoutGuideInput>;
};
export type ReviewUpdateWithWhereUniqueWithoutGuideInput = {
    where: Prisma.ReviewWhereUniqueInput;
    data: Prisma.XOR<Prisma.ReviewUpdateWithoutGuideInput, Prisma.ReviewUncheckedUpdateWithoutGuideInput>;
};
export type ReviewUpdateManyWithWhereWithoutGuideInput = {
    where: Prisma.ReviewScalarWhereInput;
    data: Prisma.XOR<Prisma.ReviewUpdateManyMutationInput, Prisma.ReviewUncheckedUpdateManyWithoutGuideInput>;
};
export type ReviewCreateWithoutListingInput = {
    id?: string;
    rating: number;
    text: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    author: Prisma.UserCreateNestedOneWithoutReviewsWrittenInput;
    guide?: Prisma.UserCreateNestedOneWithoutReviewsReceivedInput;
    booking?: Prisma.BookingCreateNestedOneWithoutReviewInput;
};
export type ReviewUncheckedCreateWithoutListingInput = {
    id?: string;
    bookingId?: string | null;
    authorId: string;
    guideId?: string | null;
    rating: number;
    text: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type ReviewCreateOrConnectWithoutListingInput = {
    where: Prisma.ReviewWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReviewCreateWithoutListingInput, Prisma.ReviewUncheckedCreateWithoutListingInput>;
};
export type ReviewCreateManyListingInputEnvelope = {
    data: Prisma.ReviewCreateManyListingInput | Prisma.ReviewCreateManyListingInput[];
    skipDuplicates?: boolean;
};
export type ReviewUpsertWithWhereUniqueWithoutListingInput = {
    where: Prisma.ReviewWhereUniqueInput;
    update: Prisma.XOR<Prisma.ReviewUpdateWithoutListingInput, Prisma.ReviewUncheckedUpdateWithoutListingInput>;
    create: Prisma.XOR<Prisma.ReviewCreateWithoutListingInput, Prisma.ReviewUncheckedCreateWithoutListingInput>;
};
export type ReviewUpdateWithWhereUniqueWithoutListingInput = {
    where: Prisma.ReviewWhereUniqueInput;
    data: Prisma.XOR<Prisma.ReviewUpdateWithoutListingInput, Prisma.ReviewUncheckedUpdateWithoutListingInput>;
};
export type ReviewUpdateManyWithWhereWithoutListingInput = {
    where: Prisma.ReviewScalarWhereInput;
    data: Prisma.XOR<Prisma.ReviewUpdateManyMutationInput, Prisma.ReviewUncheckedUpdateManyWithoutListingInput>;
};
export type ReviewCreateWithoutBookingInput = {
    id?: string;
    rating: number;
    text: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    author: Prisma.UserCreateNestedOneWithoutReviewsWrittenInput;
    guide?: Prisma.UserCreateNestedOneWithoutReviewsReceivedInput;
    listing?: Prisma.ListingCreateNestedOneWithoutReviewsInput;
};
export type ReviewUncheckedCreateWithoutBookingInput = {
    id?: string;
    authorId: string;
    guideId?: string | null;
    listingId?: string | null;
    rating: number;
    text: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type ReviewCreateOrConnectWithoutBookingInput = {
    where: Prisma.ReviewWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReviewCreateWithoutBookingInput, Prisma.ReviewUncheckedCreateWithoutBookingInput>;
};
export type ReviewUpsertWithoutBookingInput = {
    update: Prisma.XOR<Prisma.ReviewUpdateWithoutBookingInput, Prisma.ReviewUncheckedUpdateWithoutBookingInput>;
    create: Prisma.XOR<Prisma.ReviewCreateWithoutBookingInput, Prisma.ReviewUncheckedCreateWithoutBookingInput>;
    where?: Prisma.ReviewWhereInput;
};
export type ReviewUpdateToOneWithWhereWithoutBookingInput = {
    where?: Prisma.ReviewWhereInput;
    data: Prisma.XOR<Prisma.ReviewUpdateWithoutBookingInput, Prisma.ReviewUncheckedUpdateWithoutBookingInput>;
};
export type ReviewUpdateWithoutBookingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rating?: Prisma.IntFieldUpdateOperationsInput | number;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    author?: Prisma.UserUpdateOneRequiredWithoutReviewsWrittenNestedInput;
    guide?: Prisma.UserUpdateOneWithoutReviewsReceivedNestedInput;
    listing?: Prisma.ListingUpdateOneWithoutReviewsNestedInput;
};
export type ReviewUncheckedUpdateWithoutBookingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    authorId?: Prisma.StringFieldUpdateOperationsInput | string;
    guideId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    listingId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    rating?: Prisma.IntFieldUpdateOperationsInput | number;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ReviewCreateManyAuthorInput = {
    id?: string;
    bookingId?: string | null;
    guideId?: string | null;
    listingId?: string | null;
    rating: number;
    text: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type ReviewCreateManyGuideInput = {
    id?: string;
    bookingId?: string | null;
    authorId: string;
    listingId?: string | null;
    rating: number;
    text: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type ReviewUpdateWithoutAuthorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rating?: Prisma.IntFieldUpdateOperationsInput | number;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    guide?: Prisma.UserUpdateOneWithoutReviewsReceivedNestedInput;
    listing?: Prisma.ListingUpdateOneWithoutReviewsNestedInput;
    booking?: Prisma.BookingUpdateOneWithoutReviewNestedInput;
};
export type ReviewUncheckedUpdateWithoutAuthorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    bookingId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    guideId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    listingId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    rating?: Prisma.IntFieldUpdateOperationsInput | number;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ReviewUncheckedUpdateManyWithoutAuthorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    bookingId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    guideId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    listingId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    rating?: Prisma.IntFieldUpdateOperationsInput | number;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ReviewUpdateWithoutGuideInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rating?: Prisma.IntFieldUpdateOperationsInput | number;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    author?: Prisma.UserUpdateOneRequiredWithoutReviewsWrittenNestedInput;
    listing?: Prisma.ListingUpdateOneWithoutReviewsNestedInput;
    booking?: Prisma.BookingUpdateOneWithoutReviewNestedInput;
};
export type ReviewUncheckedUpdateWithoutGuideInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    bookingId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    authorId?: Prisma.StringFieldUpdateOperationsInput | string;
    listingId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    rating?: Prisma.IntFieldUpdateOperationsInput | number;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ReviewUncheckedUpdateManyWithoutGuideInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    bookingId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    authorId?: Prisma.StringFieldUpdateOperationsInput | string;
    listingId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    rating?: Prisma.IntFieldUpdateOperationsInput | number;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ReviewCreateManyListingInput = {
    id?: string;
    bookingId?: string | null;
    authorId: string;
    guideId?: string | null;
    rating: number;
    text: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type ReviewUpdateWithoutListingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rating?: Prisma.IntFieldUpdateOperationsInput | number;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    author?: Prisma.UserUpdateOneRequiredWithoutReviewsWrittenNestedInput;
    guide?: Prisma.UserUpdateOneWithoutReviewsReceivedNestedInput;
    booking?: Prisma.BookingUpdateOneWithoutReviewNestedInput;
};
export type ReviewUncheckedUpdateWithoutListingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    bookingId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    authorId?: Prisma.StringFieldUpdateOperationsInput | string;
    guideId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    rating?: Prisma.IntFieldUpdateOperationsInput | number;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ReviewUncheckedUpdateManyWithoutListingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    bookingId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    authorId?: Prisma.StringFieldUpdateOperationsInput | string;
    guideId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    rating?: Prisma.IntFieldUpdateOperationsInput | number;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ReviewSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    bookingId?: boolean;
    authorId?: boolean;
    guideId?: boolean;
    listingId?: boolean;
    rating?: boolean;
    text?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    guide?: boolean | Prisma.Review$guideArgs<ExtArgs>;
    listing?: boolean | Prisma.Review$listingArgs<ExtArgs>;
    booking?: boolean | Prisma.Review$bookingArgs<ExtArgs>;
}, ExtArgs["result"]["review"]>;
export type ReviewSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    bookingId?: boolean;
    authorId?: boolean;
    guideId?: boolean;
    listingId?: boolean;
    rating?: boolean;
    text?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    guide?: boolean | Prisma.Review$guideArgs<ExtArgs>;
    listing?: boolean | Prisma.Review$listingArgs<ExtArgs>;
    booking?: boolean | Prisma.Review$bookingArgs<ExtArgs>;
}, ExtArgs["result"]["review"]>;
export type ReviewSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    bookingId?: boolean;
    authorId?: boolean;
    guideId?: boolean;
    listingId?: boolean;
    rating?: boolean;
    text?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    guide?: boolean | Prisma.Review$guideArgs<ExtArgs>;
    listing?: boolean | Prisma.Review$listingArgs<ExtArgs>;
    booking?: boolean | Prisma.Review$bookingArgs<ExtArgs>;
}, ExtArgs["result"]["review"]>;
export type ReviewSelectScalar = {
    id?: boolean;
    bookingId?: boolean;
    authorId?: boolean;
    guideId?: boolean;
    listingId?: boolean;
    rating?: boolean;
    text?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
};
export type ReviewOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "bookingId" | "authorId" | "guideId" | "listingId" | "rating" | "text" | "createdAt" | "updatedAt" | "deletedAt", ExtArgs["result"]["review"]>;
export type ReviewInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    guide?: boolean | Prisma.Review$guideArgs<ExtArgs>;
    listing?: boolean | Prisma.Review$listingArgs<ExtArgs>;
    booking?: boolean | Prisma.Review$bookingArgs<ExtArgs>;
};
export type ReviewIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    guide?: boolean | Prisma.Review$guideArgs<ExtArgs>;
    listing?: boolean | Prisma.Review$listingArgs<ExtArgs>;
    booking?: boolean | Prisma.Review$bookingArgs<ExtArgs>;
};
export type ReviewIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    guide?: boolean | Prisma.Review$guideArgs<ExtArgs>;
    listing?: boolean | Prisma.Review$listingArgs<ExtArgs>;
    booking?: boolean | Prisma.Review$bookingArgs<ExtArgs>;
};
export type $ReviewPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Review";
    objects: {
        author: Prisma.$UserPayload<ExtArgs>;
        guide: Prisma.$UserPayload<ExtArgs> | null;
        listing: Prisma.$ListingPayload<ExtArgs> | null;
        booking: Prisma.$BookingPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        bookingId: string | null;
        authorId: string;
        guideId: string | null;
        listingId: string | null;
        rating: number;
        text: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }, ExtArgs["result"]["review"]>;
    composites: {};
};
export type ReviewGetPayload<S extends boolean | null | undefined | ReviewDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ReviewPayload, S>;
export type ReviewCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ReviewFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ReviewCountAggregateInputType | true;
};
export interface ReviewDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Review'];
        meta: {
            name: 'Review';
        };
    };
    findUnique<T extends ReviewFindUniqueArgs>(args: Prisma.SelectSubset<T, ReviewFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ReviewClient<runtime.Types.Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ReviewFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ReviewFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ReviewClient<runtime.Types.Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ReviewFindFirstArgs>(args?: Prisma.SelectSubset<T, ReviewFindFirstArgs<ExtArgs>>): Prisma.Prisma__ReviewClient<runtime.Types.Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ReviewFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ReviewFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ReviewClient<runtime.Types.Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ReviewFindManyArgs>(args?: Prisma.SelectSubset<T, ReviewFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ReviewCreateArgs>(args: Prisma.SelectSubset<T, ReviewCreateArgs<ExtArgs>>): Prisma.Prisma__ReviewClient<runtime.Types.Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ReviewCreateManyArgs>(args?: Prisma.SelectSubset<T, ReviewCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ReviewCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ReviewCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ReviewDeleteArgs>(args: Prisma.SelectSubset<T, ReviewDeleteArgs<ExtArgs>>): Prisma.Prisma__ReviewClient<runtime.Types.Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ReviewUpdateArgs>(args: Prisma.SelectSubset<T, ReviewUpdateArgs<ExtArgs>>): Prisma.Prisma__ReviewClient<runtime.Types.Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ReviewDeleteManyArgs>(args?: Prisma.SelectSubset<T, ReviewDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ReviewUpdateManyArgs>(args: Prisma.SelectSubset<T, ReviewUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ReviewUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ReviewUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ReviewUpsertArgs>(args: Prisma.SelectSubset<T, ReviewUpsertArgs<ExtArgs>>): Prisma.Prisma__ReviewClient<runtime.Types.Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ReviewCountArgs>(args?: Prisma.Subset<T, ReviewCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ReviewCountAggregateOutputType> : number>;
    aggregate<T extends ReviewAggregateArgs>(args: Prisma.Subset<T, ReviewAggregateArgs>): Prisma.PrismaPromise<GetReviewAggregateType<T>>;
    groupBy<T extends ReviewGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ReviewGroupByArgs['orderBy'];
    } : {
        orderBy?: ReviewGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ReviewGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReviewGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ReviewFieldRefs;
}
export interface Prisma__ReviewClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    author<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    guide<T extends Prisma.Review$guideArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Review$guideArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    listing<T extends Prisma.Review$listingArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Review$listingArgs<ExtArgs>>): Prisma.Prisma__ListingClient<runtime.Types.Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    booking<T extends Prisma.Review$bookingArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Review$bookingArgs<ExtArgs>>): Prisma.Prisma__BookingClient<runtime.Types.Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ReviewFieldRefs {
    readonly id: Prisma.FieldRef<"Review", 'String'>;
    readonly bookingId: Prisma.FieldRef<"Review", 'String'>;
    readonly authorId: Prisma.FieldRef<"Review", 'String'>;
    readonly guideId: Prisma.FieldRef<"Review", 'String'>;
    readonly listingId: Prisma.FieldRef<"Review", 'String'>;
    readonly rating: Prisma.FieldRef<"Review", 'Int'>;
    readonly text: Prisma.FieldRef<"Review", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Review", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Review", 'DateTime'>;
    readonly deletedAt: Prisma.FieldRef<"Review", 'DateTime'>;
}
export type ReviewFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReviewSelect<ExtArgs> | null;
    omit?: Prisma.ReviewOmit<ExtArgs> | null;
    include?: Prisma.ReviewInclude<ExtArgs> | null;
    where: Prisma.ReviewWhereUniqueInput;
};
export type ReviewFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReviewSelect<ExtArgs> | null;
    omit?: Prisma.ReviewOmit<ExtArgs> | null;
    include?: Prisma.ReviewInclude<ExtArgs> | null;
    where: Prisma.ReviewWhereUniqueInput;
};
export type ReviewFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReviewSelect<ExtArgs> | null;
    omit?: Prisma.ReviewOmit<ExtArgs> | null;
    include?: Prisma.ReviewInclude<ExtArgs> | null;
    where?: Prisma.ReviewWhereInput;
    orderBy?: Prisma.ReviewOrderByWithRelationInput | Prisma.ReviewOrderByWithRelationInput[];
    cursor?: Prisma.ReviewWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReviewScalarFieldEnum | Prisma.ReviewScalarFieldEnum[];
};
export type ReviewFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReviewSelect<ExtArgs> | null;
    omit?: Prisma.ReviewOmit<ExtArgs> | null;
    include?: Prisma.ReviewInclude<ExtArgs> | null;
    where?: Prisma.ReviewWhereInput;
    orderBy?: Prisma.ReviewOrderByWithRelationInput | Prisma.ReviewOrderByWithRelationInput[];
    cursor?: Prisma.ReviewWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReviewScalarFieldEnum | Prisma.ReviewScalarFieldEnum[];
};
export type ReviewFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReviewSelect<ExtArgs> | null;
    omit?: Prisma.ReviewOmit<ExtArgs> | null;
    include?: Prisma.ReviewInclude<ExtArgs> | null;
    where?: Prisma.ReviewWhereInput;
    orderBy?: Prisma.ReviewOrderByWithRelationInput | Prisma.ReviewOrderByWithRelationInput[];
    cursor?: Prisma.ReviewWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReviewScalarFieldEnum | Prisma.ReviewScalarFieldEnum[];
};
export type ReviewCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReviewSelect<ExtArgs> | null;
    omit?: Prisma.ReviewOmit<ExtArgs> | null;
    include?: Prisma.ReviewInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReviewCreateInput, Prisma.ReviewUncheckedCreateInput>;
};
export type ReviewCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ReviewCreateManyInput | Prisma.ReviewCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ReviewCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReviewSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ReviewOmit<ExtArgs> | null;
    data: Prisma.ReviewCreateManyInput | Prisma.ReviewCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ReviewIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ReviewUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReviewSelect<ExtArgs> | null;
    omit?: Prisma.ReviewOmit<ExtArgs> | null;
    include?: Prisma.ReviewInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReviewUpdateInput, Prisma.ReviewUncheckedUpdateInput>;
    where: Prisma.ReviewWhereUniqueInput;
};
export type ReviewUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ReviewUpdateManyMutationInput, Prisma.ReviewUncheckedUpdateManyInput>;
    where?: Prisma.ReviewWhereInput;
    limit?: number;
};
export type ReviewUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReviewSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ReviewOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReviewUpdateManyMutationInput, Prisma.ReviewUncheckedUpdateManyInput>;
    where?: Prisma.ReviewWhereInput;
    limit?: number;
    include?: Prisma.ReviewIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ReviewUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReviewSelect<ExtArgs> | null;
    omit?: Prisma.ReviewOmit<ExtArgs> | null;
    include?: Prisma.ReviewInclude<ExtArgs> | null;
    where: Prisma.ReviewWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReviewCreateInput, Prisma.ReviewUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ReviewUpdateInput, Prisma.ReviewUncheckedUpdateInput>;
};
export type ReviewDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReviewSelect<ExtArgs> | null;
    omit?: Prisma.ReviewOmit<ExtArgs> | null;
    include?: Prisma.ReviewInclude<ExtArgs> | null;
    where: Prisma.ReviewWhereUniqueInput;
};
export type ReviewDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReviewWhereInput;
    limit?: number;
};
export type Review$guideArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
export type Review$listingArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingSelect<ExtArgs> | null;
    omit?: Prisma.ListingOmit<ExtArgs> | null;
    include?: Prisma.ListingInclude<ExtArgs> | null;
    where?: Prisma.ListingWhereInput;
};
export type Review$bookingArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BookingSelect<ExtArgs> | null;
    omit?: Prisma.BookingOmit<ExtArgs> | null;
    include?: Prisma.BookingInclude<ExtArgs> | null;
    where?: Prisma.BookingWhereInput;
};
export type ReviewDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReviewSelect<ExtArgs> | null;
    omit?: Prisma.ReviewOmit<ExtArgs> | null;
    include?: Prisma.ReviewInclude<ExtArgs> | null;
};
