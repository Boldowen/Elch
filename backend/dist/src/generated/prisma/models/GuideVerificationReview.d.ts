import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type GuideVerificationReviewModel = runtime.Types.Result.DefaultSelection<Prisma.$GuideVerificationReviewPayload>;
export type AggregateGuideVerificationReview = {
    _count: GuideVerificationReviewCountAggregateOutputType | null;
    _avg: GuideVerificationReviewAvgAggregateOutputType | null;
    _sum: GuideVerificationReviewSumAggregateOutputType | null;
    _min: GuideVerificationReviewMinAggregateOutputType | null;
    _max: GuideVerificationReviewMaxAggregateOutputType | null;
};
export type GuideVerificationReviewAvgAggregateOutputType = {
    assessmentScore: number | null;
};
export type GuideVerificationReviewSumAggregateOutputType = {
    assessmentScore: number | null;
};
export type GuideVerificationReviewMinAggregateOutputType = {
    id: string | null;
    guideProfileId: string | null;
    reviewerId: string | null;
    decision: $Enums.GuideVerificationDecision | null;
    decisionReason: string | null;
    internalNote: string | null;
    assessmentScore: number | null;
    documentStatus: $Enums.VerificationCheckStatus | null;
    referenceStatus: $Enums.VerificationCheckStatus | null;
    reviewedAt: Date | null;
};
export type GuideVerificationReviewMaxAggregateOutputType = {
    id: string | null;
    guideProfileId: string | null;
    reviewerId: string | null;
    decision: $Enums.GuideVerificationDecision | null;
    decisionReason: string | null;
    internalNote: string | null;
    assessmentScore: number | null;
    documentStatus: $Enums.VerificationCheckStatus | null;
    referenceStatus: $Enums.VerificationCheckStatus | null;
    reviewedAt: Date | null;
};
export type GuideVerificationReviewCountAggregateOutputType = {
    id: number;
    guideProfileId: number;
    reviewerId: number;
    decision: number;
    decisionReason: number;
    internalNote: number;
    assessmentScore: number;
    assessmentBreakdown: number;
    documentStatus: number;
    referenceStatus: number;
    applicationSnapshot: number;
    reviewedAt: number;
    _all: number;
};
export type GuideVerificationReviewAvgAggregateInputType = {
    assessmentScore?: true;
};
export type GuideVerificationReviewSumAggregateInputType = {
    assessmentScore?: true;
};
export type GuideVerificationReviewMinAggregateInputType = {
    id?: true;
    guideProfileId?: true;
    reviewerId?: true;
    decision?: true;
    decisionReason?: true;
    internalNote?: true;
    assessmentScore?: true;
    documentStatus?: true;
    referenceStatus?: true;
    reviewedAt?: true;
};
export type GuideVerificationReviewMaxAggregateInputType = {
    id?: true;
    guideProfileId?: true;
    reviewerId?: true;
    decision?: true;
    decisionReason?: true;
    internalNote?: true;
    assessmentScore?: true;
    documentStatus?: true;
    referenceStatus?: true;
    reviewedAt?: true;
};
export type GuideVerificationReviewCountAggregateInputType = {
    id?: true;
    guideProfileId?: true;
    reviewerId?: true;
    decision?: true;
    decisionReason?: true;
    internalNote?: true;
    assessmentScore?: true;
    assessmentBreakdown?: true;
    documentStatus?: true;
    referenceStatus?: true;
    applicationSnapshot?: true;
    reviewedAt?: true;
    _all?: true;
};
export type GuideVerificationReviewAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.GuideVerificationReviewWhereInput;
    orderBy?: Prisma.GuideVerificationReviewOrderByWithRelationInput | Prisma.GuideVerificationReviewOrderByWithRelationInput[];
    cursor?: Prisma.GuideVerificationReviewWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | GuideVerificationReviewCountAggregateInputType;
    _avg?: GuideVerificationReviewAvgAggregateInputType;
    _sum?: GuideVerificationReviewSumAggregateInputType;
    _min?: GuideVerificationReviewMinAggregateInputType;
    _max?: GuideVerificationReviewMaxAggregateInputType;
};
export type GetGuideVerificationReviewAggregateType<T extends GuideVerificationReviewAggregateArgs> = {
    [P in keyof T & keyof AggregateGuideVerificationReview]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateGuideVerificationReview[P]> : Prisma.GetScalarType<T[P], AggregateGuideVerificationReview[P]>;
};
export type GuideVerificationReviewGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.GuideVerificationReviewWhereInput;
    orderBy?: Prisma.GuideVerificationReviewOrderByWithAggregationInput | Prisma.GuideVerificationReviewOrderByWithAggregationInput[];
    by: Prisma.GuideVerificationReviewScalarFieldEnum[] | Prisma.GuideVerificationReviewScalarFieldEnum;
    having?: Prisma.GuideVerificationReviewScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: GuideVerificationReviewCountAggregateInputType | true;
    _avg?: GuideVerificationReviewAvgAggregateInputType;
    _sum?: GuideVerificationReviewSumAggregateInputType;
    _min?: GuideVerificationReviewMinAggregateInputType;
    _max?: GuideVerificationReviewMaxAggregateInputType;
};
export type GuideVerificationReviewGroupByOutputType = {
    id: string;
    guideProfileId: string;
    reviewerId: string;
    decision: $Enums.GuideVerificationDecision;
    decisionReason: string | null;
    internalNote: string | null;
    assessmentScore: number;
    assessmentBreakdown: runtime.JsonValue;
    documentStatus: $Enums.VerificationCheckStatus;
    referenceStatus: $Enums.VerificationCheckStatus;
    applicationSnapshot: runtime.JsonValue;
    reviewedAt: Date;
    _count: GuideVerificationReviewCountAggregateOutputType | null;
    _avg: GuideVerificationReviewAvgAggregateOutputType | null;
    _sum: GuideVerificationReviewSumAggregateOutputType | null;
    _min: GuideVerificationReviewMinAggregateOutputType | null;
    _max: GuideVerificationReviewMaxAggregateOutputType | null;
};
export type GetGuideVerificationReviewGroupByPayload<T extends GuideVerificationReviewGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<GuideVerificationReviewGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof GuideVerificationReviewGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], GuideVerificationReviewGroupByOutputType[P]> : Prisma.GetScalarType<T[P], GuideVerificationReviewGroupByOutputType[P]>;
}>>;
export type GuideVerificationReviewWhereInput = {
    AND?: Prisma.GuideVerificationReviewWhereInput | Prisma.GuideVerificationReviewWhereInput[];
    OR?: Prisma.GuideVerificationReviewWhereInput[];
    NOT?: Prisma.GuideVerificationReviewWhereInput | Prisma.GuideVerificationReviewWhereInput[];
    id?: Prisma.UuidFilter<"GuideVerificationReview"> | string;
    guideProfileId?: Prisma.UuidFilter<"GuideVerificationReview"> | string;
    reviewerId?: Prisma.UuidFilter<"GuideVerificationReview"> | string;
    decision?: Prisma.EnumGuideVerificationDecisionFilter<"GuideVerificationReview"> | $Enums.GuideVerificationDecision;
    decisionReason?: Prisma.StringNullableFilter<"GuideVerificationReview"> | string | null;
    internalNote?: Prisma.StringNullableFilter<"GuideVerificationReview"> | string | null;
    assessmentScore?: Prisma.IntFilter<"GuideVerificationReview"> | number;
    assessmentBreakdown?: Prisma.JsonFilter<"GuideVerificationReview">;
    documentStatus?: Prisma.EnumVerificationCheckStatusFilter<"GuideVerificationReview"> | $Enums.VerificationCheckStatus;
    referenceStatus?: Prisma.EnumVerificationCheckStatusFilter<"GuideVerificationReview"> | $Enums.VerificationCheckStatus;
    applicationSnapshot?: Prisma.JsonFilter<"GuideVerificationReview">;
    reviewedAt?: Prisma.DateTimeFilter<"GuideVerificationReview"> | Date | string;
    guideProfile?: Prisma.XOR<Prisma.GuideProfileScalarRelationFilter, Prisma.GuideProfileWhereInput>;
    reviewer?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type GuideVerificationReviewOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    guideProfileId?: Prisma.SortOrder;
    reviewerId?: Prisma.SortOrder;
    decision?: Prisma.SortOrder;
    decisionReason?: Prisma.SortOrderInput | Prisma.SortOrder;
    internalNote?: Prisma.SortOrderInput | Prisma.SortOrder;
    assessmentScore?: Prisma.SortOrder;
    assessmentBreakdown?: Prisma.SortOrder;
    documentStatus?: Prisma.SortOrder;
    referenceStatus?: Prisma.SortOrder;
    applicationSnapshot?: Prisma.SortOrder;
    reviewedAt?: Prisma.SortOrder;
    guideProfile?: Prisma.GuideProfileOrderByWithRelationInput;
    reviewer?: Prisma.UserOrderByWithRelationInput;
};
export type GuideVerificationReviewWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.GuideVerificationReviewWhereInput | Prisma.GuideVerificationReviewWhereInput[];
    OR?: Prisma.GuideVerificationReviewWhereInput[];
    NOT?: Prisma.GuideVerificationReviewWhereInput | Prisma.GuideVerificationReviewWhereInput[];
    guideProfileId?: Prisma.UuidFilter<"GuideVerificationReview"> | string;
    reviewerId?: Prisma.UuidFilter<"GuideVerificationReview"> | string;
    decision?: Prisma.EnumGuideVerificationDecisionFilter<"GuideVerificationReview"> | $Enums.GuideVerificationDecision;
    decisionReason?: Prisma.StringNullableFilter<"GuideVerificationReview"> | string | null;
    internalNote?: Prisma.StringNullableFilter<"GuideVerificationReview"> | string | null;
    assessmentScore?: Prisma.IntFilter<"GuideVerificationReview"> | number;
    assessmentBreakdown?: Prisma.JsonFilter<"GuideVerificationReview">;
    documentStatus?: Prisma.EnumVerificationCheckStatusFilter<"GuideVerificationReview"> | $Enums.VerificationCheckStatus;
    referenceStatus?: Prisma.EnumVerificationCheckStatusFilter<"GuideVerificationReview"> | $Enums.VerificationCheckStatus;
    applicationSnapshot?: Prisma.JsonFilter<"GuideVerificationReview">;
    reviewedAt?: Prisma.DateTimeFilter<"GuideVerificationReview"> | Date | string;
    guideProfile?: Prisma.XOR<Prisma.GuideProfileScalarRelationFilter, Prisma.GuideProfileWhereInput>;
    reviewer?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id">;
export type GuideVerificationReviewOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    guideProfileId?: Prisma.SortOrder;
    reviewerId?: Prisma.SortOrder;
    decision?: Prisma.SortOrder;
    decisionReason?: Prisma.SortOrderInput | Prisma.SortOrder;
    internalNote?: Prisma.SortOrderInput | Prisma.SortOrder;
    assessmentScore?: Prisma.SortOrder;
    assessmentBreakdown?: Prisma.SortOrder;
    documentStatus?: Prisma.SortOrder;
    referenceStatus?: Prisma.SortOrder;
    applicationSnapshot?: Prisma.SortOrder;
    reviewedAt?: Prisma.SortOrder;
    _count?: Prisma.GuideVerificationReviewCountOrderByAggregateInput;
    _avg?: Prisma.GuideVerificationReviewAvgOrderByAggregateInput;
    _max?: Prisma.GuideVerificationReviewMaxOrderByAggregateInput;
    _min?: Prisma.GuideVerificationReviewMinOrderByAggregateInput;
    _sum?: Prisma.GuideVerificationReviewSumOrderByAggregateInput;
};
export type GuideVerificationReviewScalarWhereWithAggregatesInput = {
    AND?: Prisma.GuideVerificationReviewScalarWhereWithAggregatesInput | Prisma.GuideVerificationReviewScalarWhereWithAggregatesInput[];
    OR?: Prisma.GuideVerificationReviewScalarWhereWithAggregatesInput[];
    NOT?: Prisma.GuideVerificationReviewScalarWhereWithAggregatesInput | Prisma.GuideVerificationReviewScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"GuideVerificationReview"> | string;
    guideProfileId?: Prisma.UuidWithAggregatesFilter<"GuideVerificationReview"> | string;
    reviewerId?: Prisma.UuidWithAggregatesFilter<"GuideVerificationReview"> | string;
    decision?: Prisma.EnumGuideVerificationDecisionWithAggregatesFilter<"GuideVerificationReview"> | $Enums.GuideVerificationDecision;
    decisionReason?: Prisma.StringNullableWithAggregatesFilter<"GuideVerificationReview"> | string | null;
    internalNote?: Prisma.StringNullableWithAggregatesFilter<"GuideVerificationReview"> | string | null;
    assessmentScore?: Prisma.IntWithAggregatesFilter<"GuideVerificationReview"> | number;
    assessmentBreakdown?: Prisma.JsonWithAggregatesFilter<"GuideVerificationReview">;
    documentStatus?: Prisma.EnumVerificationCheckStatusWithAggregatesFilter<"GuideVerificationReview"> | $Enums.VerificationCheckStatus;
    referenceStatus?: Prisma.EnumVerificationCheckStatusWithAggregatesFilter<"GuideVerificationReview"> | $Enums.VerificationCheckStatus;
    applicationSnapshot?: Prisma.JsonWithAggregatesFilter<"GuideVerificationReview">;
    reviewedAt?: Prisma.DateTimeWithAggregatesFilter<"GuideVerificationReview"> | Date | string;
};
export type GuideVerificationReviewCreateInput = {
    id?: string;
    decision: $Enums.GuideVerificationDecision;
    decisionReason?: string | null;
    internalNote?: string | null;
    assessmentScore: number;
    assessmentBreakdown: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    documentStatus: $Enums.VerificationCheckStatus;
    referenceStatus: $Enums.VerificationCheckStatus;
    applicationSnapshot: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    reviewedAt?: Date | string;
    guideProfile: Prisma.GuideProfileCreateNestedOneWithoutVerificationReviewsInput;
    reviewer: Prisma.UserCreateNestedOneWithoutGuideVerificationReviewsInput;
};
export type GuideVerificationReviewUncheckedCreateInput = {
    id?: string;
    guideProfileId: string;
    reviewerId: string;
    decision: $Enums.GuideVerificationDecision;
    decisionReason?: string | null;
    internalNote?: string | null;
    assessmentScore: number;
    assessmentBreakdown: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    documentStatus: $Enums.VerificationCheckStatus;
    referenceStatus: $Enums.VerificationCheckStatus;
    applicationSnapshot: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    reviewedAt?: Date | string;
};
export type GuideVerificationReviewUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    decision?: Prisma.EnumGuideVerificationDecisionFieldUpdateOperationsInput | $Enums.GuideVerificationDecision;
    decisionReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    internalNote?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    assessmentScore?: Prisma.IntFieldUpdateOperationsInput | number;
    assessmentBreakdown?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    documentStatus?: Prisma.EnumVerificationCheckStatusFieldUpdateOperationsInput | $Enums.VerificationCheckStatus;
    referenceStatus?: Prisma.EnumVerificationCheckStatusFieldUpdateOperationsInput | $Enums.VerificationCheckStatus;
    applicationSnapshot?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    reviewedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    guideProfile?: Prisma.GuideProfileUpdateOneRequiredWithoutVerificationReviewsNestedInput;
    reviewer?: Prisma.UserUpdateOneRequiredWithoutGuideVerificationReviewsNestedInput;
};
export type GuideVerificationReviewUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    guideProfileId?: Prisma.StringFieldUpdateOperationsInput | string;
    reviewerId?: Prisma.StringFieldUpdateOperationsInput | string;
    decision?: Prisma.EnumGuideVerificationDecisionFieldUpdateOperationsInput | $Enums.GuideVerificationDecision;
    decisionReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    internalNote?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    assessmentScore?: Prisma.IntFieldUpdateOperationsInput | number;
    assessmentBreakdown?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    documentStatus?: Prisma.EnumVerificationCheckStatusFieldUpdateOperationsInput | $Enums.VerificationCheckStatus;
    referenceStatus?: Prisma.EnumVerificationCheckStatusFieldUpdateOperationsInput | $Enums.VerificationCheckStatus;
    applicationSnapshot?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    reviewedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type GuideVerificationReviewCreateManyInput = {
    id?: string;
    guideProfileId: string;
    reviewerId: string;
    decision: $Enums.GuideVerificationDecision;
    decisionReason?: string | null;
    internalNote?: string | null;
    assessmentScore: number;
    assessmentBreakdown: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    documentStatus: $Enums.VerificationCheckStatus;
    referenceStatus: $Enums.VerificationCheckStatus;
    applicationSnapshot: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    reviewedAt?: Date | string;
};
export type GuideVerificationReviewUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    decision?: Prisma.EnumGuideVerificationDecisionFieldUpdateOperationsInput | $Enums.GuideVerificationDecision;
    decisionReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    internalNote?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    assessmentScore?: Prisma.IntFieldUpdateOperationsInput | number;
    assessmentBreakdown?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    documentStatus?: Prisma.EnumVerificationCheckStatusFieldUpdateOperationsInput | $Enums.VerificationCheckStatus;
    referenceStatus?: Prisma.EnumVerificationCheckStatusFieldUpdateOperationsInput | $Enums.VerificationCheckStatus;
    applicationSnapshot?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    reviewedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type GuideVerificationReviewUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    guideProfileId?: Prisma.StringFieldUpdateOperationsInput | string;
    reviewerId?: Prisma.StringFieldUpdateOperationsInput | string;
    decision?: Prisma.EnumGuideVerificationDecisionFieldUpdateOperationsInput | $Enums.GuideVerificationDecision;
    decisionReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    internalNote?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    assessmentScore?: Prisma.IntFieldUpdateOperationsInput | number;
    assessmentBreakdown?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    documentStatus?: Prisma.EnumVerificationCheckStatusFieldUpdateOperationsInput | $Enums.VerificationCheckStatus;
    referenceStatus?: Prisma.EnumVerificationCheckStatusFieldUpdateOperationsInput | $Enums.VerificationCheckStatus;
    applicationSnapshot?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    reviewedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type GuideVerificationReviewListRelationFilter = {
    every?: Prisma.GuideVerificationReviewWhereInput;
    some?: Prisma.GuideVerificationReviewWhereInput;
    none?: Prisma.GuideVerificationReviewWhereInput;
};
export type GuideVerificationReviewOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type GuideVerificationReviewCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    guideProfileId?: Prisma.SortOrder;
    reviewerId?: Prisma.SortOrder;
    decision?: Prisma.SortOrder;
    decisionReason?: Prisma.SortOrder;
    internalNote?: Prisma.SortOrder;
    assessmentScore?: Prisma.SortOrder;
    assessmentBreakdown?: Prisma.SortOrder;
    documentStatus?: Prisma.SortOrder;
    referenceStatus?: Prisma.SortOrder;
    applicationSnapshot?: Prisma.SortOrder;
    reviewedAt?: Prisma.SortOrder;
};
export type GuideVerificationReviewAvgOrderByAggregateInput = {
    assessmentScore?: Prisma.SortOrder;
};
export type GuideVerificationReviewMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    guideProfileId?: Prisma.SortOrder;
    reviewerId?: Prisma.SortOrder;
    decision?: Prisma.SortOrder;
    decisionReason?: Prisma.SortOrder;
    internalNote?: Prisma.SortOrder;
    assessmentScore?: Prisma.SortOrder;
    documentStatus?: Prisma.SortOrder;
    referenceStatus?: Prisma.SortOrder;
    reviewedAt?: Prisma.SortOrder;
};
export type GuideVerificationReviewMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    guideProfileId?: Prisma.SortOrder;
    reviewerId?: Prisma.SortOrder;
    decision?: Prisma.SortOrder;
    decisionReason?: Prisma.SortOrder;
    internalNote?: Prisma.SortOrder;
    assessmentScore?: Prisma.SortOrder;
    documentStatus?: Prisma.SortOrder;
    referenceStatus?: Prisma.SortOrder;
    reviewedAt?: Prisma.SortOrder;
};
export type GuideVerificationReviewSumOrderByAggregateInput = {
    assessmentScore?: Prisma.SortOrder;
};
export type GuideVerificationReviewCreateNestedManyWithoutReviewerInput = {
    create?: Prisma.XOR<Prisma.GuideVerificationReviewCreateWithoutReviewerInput, Prisma.GuideVerificationReviewUncheckedCreateWithoutReviewerInput> | Prisma.GuideVerificationReviewCreateWithoutReviewerInput[] | Prisma.GuideVerificationReviewUncheckedCreateWithoutReviewerInput[];
    connectOrCreate?: Prisma.GuideVerificationReviewCreateOrConnectWithoutReviewerInput | Prisma.GuideVerificationReviewCreateOrConnectWithoutReviewerInput[];
    createMany?: Prisma.GuideVerificationReviewCreateManyReviewerInputEnvelope;
    connect?: Prisma.GuideVerificationReviewWhereUniqueInput | Prisma.GuideVerificationReviewWhereUniqueInput[];
};
export type GuideVerificationReviewUncheckedCreateNestedManyWithoutReviewerInput = {
    create?: Prisma.XOR<Prisma.GuideVerificationReviewCreateWithoutReviewerInput, Prisma.GuideVerificationReviewUncheckedCreateWithoutReviewerInput> | Prisma.GuideVerificationReviewCreateWithoutReviewerInput[] | Prisma.GuideVerificationReviewUncheckedCreateWithoutReviewerInput[];
    connectOrCreate?: Prisma.GuideVerificationReviewCreateOrConnectWithoutReviewerInput | Prisma.GuideVerificationReviewCreateOrConnectWithoutReviewerInput[];
    createMany?: Prisma.GuideVerificationReviewCreateManyReviewerInputEnvelope;
    connect?: Prisma.GuideVerificationReviewWhereUniqueInput | Prisma.GuideVerificationReviewWhereUniqueInput[];
};
export type GuideVerificationReviewUpdateManyWithoutReviewerNestedInput = {
    create?: Prisma.XOR<Prisma.GuideVerificationReviewCreateWithoutReviewerInput, Prisma.GuideVerificationReviewUncheckedCreateWithoutReviewerInput> | Prisma.GuideVerificationReviewCreateWithoutReviewerInput[] | Prisma.GuideVerificationReviewUncheckedCreateWithoutReviewerInput[];
    connectOrCreate?: Prisma.GuideVerificationReviewCreateOrConnectWithoutReviewerInput | Prisma.GuideVerificationReviewCreateOrConnectWithoutReviewerInput[];
    upsert?: Prisma.GuideVerificationReviewUpsertWithWhereUniqueWithoutReviewerInput | Prisma.GuideVerificationReviewUpsertWithWhereUniqueWithoutReviewerInput[];
    createMany?: Prisma.GuideVerificationReviewCreateManyReviewerInputEnvelope;
    set?: Prisma.GuideVerificationReviewWhereUniqueInput | Prisma.GuideVerificationReviewWhereUniqueInput[];
    disconnect?: Prisma.GuideVerificationReviewWhereUniqueInput | Prisma.GuideVerificationReviewWhereUniqueInput[];
    delete?: Prisma.GuideVerificationReviewWhereUniqueInput | Prisma.GuideVerificationReviewWhereUniqueInput[];
    connect?: Prisma.GuideVerificationReviewWhereUniqueInput | Prisma.GuideVerificationReviewWhereUniqueInput[];
    update?: Prisma.GuideVerificationReviewUpdateWithWhereUniqueWithoutReviewerInput | Prisma.GuideVerificationReviewUpdateWithWhereUniqueWithoutReviewerInput[];
    updateMany?: Prisma.GuideVerificationReviewUpdateManyWithWhereWithoutReviewerInput | Prisma.GuideVerificationReviewUpdateManyWithWhereWithoutReviewerInput[];
    deleteMany?: Prisma.GuideVerificationReviewScalarWhereInput | Prisma.GuideVerificationReviewScalarWhereInput[];
};
export type GuideVerificationReviewUncheckedUpdateManyWithoutReviewerNestedInput = {
    create?: Prisma.XOR<Prisma.GuideVerificationReviewCreateWithoutReviewerInput, Prisma.GuideVerificationReviewUncheckedCreateWithoutReviewerInput> | Prisma.GuideVerificationReviewCreateWithoutReviewerInput[] | Prisma.GuideVerificationReviewUncheckedCreateWithoutReviewerInput[];
    connectOrCreate?: Prisma.GuideVerificationReviewCreateOrConnectWithoutReviewerInput | Prisma.GuideVerificationReviewCreateOrConnectWithoutReviewerInput[];
    upsert?: Prisma.GuideVerificationReviewUpsertWithWhereUniqueWithoutReviewerInput | Prisma.GuideVerificationReviewUpsertWithWhereUniqueWithoutReviewerInput[];
    createMany?: Prisma.GuideVerificationReviewCreateManyReviewerInputEnvelope;
    set?: Prisma.GuideVerificationReviewWhereUniqueInput | Prisma.GuideVerificationReviewWhereUniqueInput[];
    disconnect?: Prisma.GuideVerificationReviewWhereUniqueInput | Prisma.GuideVerificationReviewWhereUniqueInput[];
    delete?: Prisma.GuideVerificationReviewWhereUniqueInput | Prisma.GuideVerificationReviewWhereUniqueInput[];
    connect?: Prisma.GuideVerificationReviewWhereUniqueInput | Prisma.GuideVerificationReviewWhereUniqueInput[];
    update?: Prisma.GuideVerificationReviewUpdateWithWhereUniqueWithoutReviewerInput | Prisma.GuideVerificationReviewUpdateWithWhereUniqueWithoutReviewerInput[];
    updateMany?: Prisma.GuideVerificationReviewUpdateManyWithWhereWithoutReviewerInput | Prisma.GuideVerificationReviewUpdateManyWithWhereWithoutReviewerInput[];
    deleteMany?: Prisma.GuideVerificationReviewScalarWhereInput | Prisma.GuideVerificationReviewScalarWhereInput[];
};
export type GuideVerificationReviewCreateNestedManyWithoutGuideProfileInput = {
    create?: Prisma.XOR<Prisma.GuideVerificationReviewCreateWithoutGuideProfileInput, Prisma.GuideVerificationReviewUncheckedCreateWithoutGuideProfileInput> | Prisma.GuideVerificationReviewCreateWithoutGuideProfileInput[] | Prisma.GuideVerificationReviewUncheckedCreateWithoutGuideProfileInput[];
    connectOrCreate?: Prisma.GuideVerificationReviewCreateOrConnectWithoutGuideProfileInput | Prisma.GuideVerificationReviewCreateOrConnectWithoutGuideProfileInput[];
    createMany?: Prisma.GuideVerificationReviewCreateManyGuideProfileInputEnvelope;
    connect?: Prisma.GuideVerificationReviewWhereUniqueInput | Prisma.GuideVerificationReviewWhereUniqueInput[];
};
export type GuideVerificationReviewUncheckedCreateNestedManyWithoutGuideProfileInput = {
    create?: Prisma.XOR<Prisma.GuideVerificationReviewCreateWithoutGuideProfileInput, Prisma.GuideVerificationReviewUncheckedCreateWithoutGuideProfileInput> | Prisma.GuideVerificationReviewCreateWithoutGuideProfileInput[] | Prisma.GuideVerificationReviewUncheckedCreateWithoutGuideProfileInput[];
    connectOrCreate?: Prisma.GuideVerificationReviewCreateOrConnectWithoutGuideProfileInput | Prisma.GuideVerificationReviewCreateOrConnectWithoutGuideProfileInput[];
    createMany?: Prisma.GuideVerificationReviewCreateManyGuideProfileInputEnvelope;
    connect?: Prisma.GuideVerificationReviewWhereUniqueInput | Prisma.GuideVerificationReviewWhereUniqueInput[];
};
export type GuideVerificationReviewUpdateManyWithoutGuideProfileNestedInput = {
    create?: Prisma.XOR<Prisma.GuideVerificationReviewCreateWithoutGuideProfileInput, Prisma.GuideVerificationReviewUncheckedCreateWithoutGuideProfileInput> | Prisma.GuideVerificationReviewCreateWithoutGuideProfileInput[] | Prisma.GuideVerificationReviewUncheckedCreateWithoutGuideProfileInput[];
    connectOrCreate?: Prisma.GuideVerificationReviewCreateOrConnectWithoutGuideProfileInput | Prisma.GuideVerificationReviewCreateOrConnectWithoutGuideProfileInput[];
    upsert?: Prisma.GuideVerificationReviewUpsertWithWhereUniqueWithoutGuideProfileInput | Prisma.GuideVerificationReviewUpsertWithWhereUniqueWithoutGuideProfileInput[];
    createMany?: Prisma.GuideVerificationReviewCreateManyGuideProfileInputEnvelope;
    set?: Prisma.GuideVerificationReviewWhereUniqueInput | Prisma.GuideVerificationReviewWhereUniqueInput[];
    disconnect?: Prisma.GuideVerificationReviewWhereUniqueInput | Prisma.GuideVerificationReviewWhereUniqueInput[];
    delete?: Prisma.GuideVerificationReviewWhereUniqueInput | Prisma.GuideVerificationReviewWhereUniqueInput[];
    connect?: Prisma.GuideVerificationReviewWhereUniqueInput | Prisma.GuideVerificationReviewWhereUniqueInput[];
    update?: Prisma.GuideVerificationReviewUpdateWithWhereUniqueWithoutGuideProfileInput | Prisma.GuideVerificationReviewUpdateWithWhereUniqueWithoutGuideProfileInput[];
    updateMany?: Prisma.GuideVerificationReviewUpdateManyWithWhereWithoutGuideProfileInput | Prisma.GuideVerificationReviewUpdateManyWithWhereWithoutGuideProfileInput[];
    deleteMany?: Prisma.GuideVerificationReviewScalarWhereInput | Prisma.GuideVerificationReviewScalarWhereInput[];
};
export type GuideVerificationReviewUncheckedUpdateManyWithoutGuideProfileNestedInput = {
    create?: Prisma.XOR<Prisma.GuideVerificationReviewCreateWithoutGuideProfileInput, Prisma.GuideVerificationReviewUncheckedCreateWithoutGuideProfileInput> | Prisma.GuideVerificationReviewCreateWithoutGuideProfileInput[] | Prisma.GuideVerificationReviewUncheckedCreateWithoutGuideProfileInput[];
    connectOrCreate?: Prisma.GuideVerificationReviewCreateOrConnectWithoutGuideProfileInput | Prisma.GuideVerificationReviewCreateOrConnectWithoutGuideProfileInput[];
    upsert?: Prisma.GuideVerificationReviewUpsertWithWhereUniqueWithoutGuideProfileInput | Prisma.GuideVerificationReviewUpsertWithWhereUniqueWithoutGuideProfileInput[];
    createMany?: Prisma.GuideVerificationReviewCreateManyGuideProfileInputEnvelope;
    set?: Prisma.GuideVerificationReviewWhereUniqueInput | Prisma.GuideVerificationReviewWhereUniqueInput[];
    disconnect?: Prisma.GuideVerificationReviewWhereUniqueInput | Prisma.GuideVerificationReviewWhereUniqueInput[];
    delete?: Prisma.GuideVerificationReviewWhereUniqueInput | Prisma.GuideVerificationReviewWhereUniqueInput[];
    connect?: Prisma.GuideVerificationReviewWhereUniqueInput | Prisma.GuideVerificationReviewWhereUniqueInput[];
    update?: Prisma.GuideVerificationReviewUpdateWithWhereUniqueWithoutGuideProfileInput | Prisma.GuideVerificationReviewUpdateWithWhereUniqueWithoutGuideProfileInput[];
    updateMany?: Prisma.GuideVerificationReviewUpdateManyWithWhereWithoutGuideProfileInput | Prisma.GuideVerificationReviewUpdateManyWithWhereWithoutGuideProfileInput[];
    deleteMany?: Prisma.GuideVerificationReviewScalarWhereInput | Prisma.GuideVerificationReviewScalarWhereInput[];
};
export type EnumGuideVerificationDecisionFieldUpdateOperationsInput = {
    set?: $Enums.GuideVerificationDecision;
};
export type EnumVerificationCheckStatusFieldUpdateOperationsInput = {
    set?: $Enums.VerificationCheckStatus;
};
export type GuideVerificationReviewCreateWithoutReviewerInput = {
    id?: string;
    decision: $Enums.GuideVerificationDecision;
    decisionReason?: string | null;
    internalNote?: string | null;
    assessmentScore: number;
    assessmentBreakdown: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    documentStatus: $Enums.VerificationCheckStatus;
    referenceStatus: $Enums.VerificationCheckStatus;
    applicationSnapshot: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    reviewedAt?: Date | string;
    guideProfile: Prisma.GuideProfileCreateNestedOneWithoutVerificationReviewsInput;
};
export type GuideVerificationReviewUncheckedCreateWithoutReviewerInput = {
    id?: string;
    guideProfileId: string;
    decision: $Enums.GuideVerificationDecision;
    decisionReason?: string | null;
    internalNote?: string | null;
    assessmentScore: number;
    assessmentBreakdown: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    documentStatus: $Enums.VerificationCheckStatus;
    referenceStatus: $Enums.VerificationCheckStatus;
    applicationSnapshot: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    reviewedAt?: Date | string;
};
export type GuideVerificationReviewCreateOrConnectWithoutReviewerInput = {
    where: Prisma.GuideVerificationReviewWhereUniqueInput;
    create: Prisma.XOR<Prisma.GuideVerificationReviewCreateWithoutReviewerInput, Prisma.GuideVerificationReviewUncheckedCreateWithoutReviewerInput>;
};
export type GuideVerificationReviewCreateManyReviewerInputEnvelope = {
    data: Prisma.GuideVerificationReviewCreateManyReviewerInput | Prisma.GuideVerificationReviewCreateManyReviewerInput[];
    skipDuplicates?: boolean;
};
export type GuideVerificationReviewUpsertWithWhereUniqueWithoutReviewerInput = {
    where: Prisma.GuideVerificationReviewWhereUniqueInput;
    update: Prisma.XOR<Prisma.GuideVerificationReviewUpdateWithoutReviewerInput, Prisma.GuideVerificationReviewUncheckedUpdateWithoutReviewerInput>;
    create: Prisma.XOR<Prisma.GuideVerificationReviewCreateWithoutReviewerInput, Prisma.GuideVerificationReviewUncheckedCreateWithoutReviewerInput>;
};
export type GuideVerificationReviewUpdateWithWhereUniqueWithoutReviewerInput = {
    where: Prisma.GuideVerificationReviewWhereUniqueInput;
    data: Prisma.XOR<Prisma.GuideVerificationReviewUpdateWithoutReviewerInput, Prisma.GuideVerificationReviewUncheckedUpdateWithoutReviewerInput>;
};
export type GuideVerificationReviewUpdateManyWithWhereWithoutReviewerInput = {
    where: Prisma.GuideVerificationReviewScalarWhereInput;
    data: Prisma.XOR<Prisma.GuideVerificationReviewUpdateManyMutationInput, Prisma.GuideVerificationReviewUncheckedUpdateManyWithoutReviewerInput>;
};
export type GuideVerificationReviewScalarWhereInput = {
    AND?: Prisma.GuideVerificationReviewScalarWhereInput | Prisma.GuideVerificationReviewScalarWhereInput[];
    OR?: Prisma.GuideVerificationReviewScalarWhereInput[];
    NOT?: Prisma.GuideVerificationReviewScalarWhereInput | Prisma.GuideVerificationReviewScalarWhereInput[];
    id?: Prisma.UuidFilter<"GuideVerificationReview"> | string;
    guideProfileId?: Prisma.UuidFilter<"GuideVerificationReview"> | string;
    reviewerId?: Prisma.UuidFilter<"GuideVerificationReview"> | string;
    decision?: Prisma.EnumGuideVerificationDecisionFilter<"GuideVerificationReview"> | $Enums.GuideVerificationDecision;
    decisionReason?: Prisma.StringNullableFilter<"GuideVerificationReview"> | string | null;
    internalNote?: Prisma.StringNullableFilter<"GuideVerificationReview"> | string | null;
    assessmentScore?: Prisma.IntFilter<"GuideVerificationReview"> | number;
    assessmentBreakdown?: Prisma.JsonFilter<"GuideVerificationReview">;
    documentStatus?: Prisma.EnumVerificationCheckStatusFilter<"GuideVerificationReview"> | $Enums.VerificationCheckStatus;
    referenceStatus?: Prisma.EnumVerificationCheckStatusFilter<"GuideVerificationReview"> | $Enums.VerificationCheckStatus;
    applicationSnapshot?: Prisma.JsonFilter<"GuideVerificationReview">;
    reviewedAt?: Prisma.DateTimeFilter<"GuideVerificationReview"> | Date | string;
};
export type GuideVerificationReviewCreateWithoutGuideProfileInput = {
    id?: string;
    decision: $Enums.GuideVerificationDecision;
    decisionReason?: string | null;
    internalNote?: string | null;
    assessmentScore: number;
    assessmentBreakdown: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    documentStatus: $Enums.VerificationCheckStatus;
    referenceStatus: $Enums.VerificationCheckStatus;
    applicationSnapshot: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    reviewedAt?: Date | string;
    reviewer: Prisma.UserCreateNestedOneWithoutGuideVerificationReviewsInput;
};
export type GuideVerificationReviewUncheckedCreateWithoutGuideProfileInput = {
    id?: string;
    reviewerId: string;
    decision: $Enums.GuideVerificationDecision;
    decisionReason?: string | null;
    internalNote?: string | null;
    assessmentScore: number;
    assessmentBreakdown: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    documentStatus: $Enums.VerificationCheckStatus;
    referenceStatus: $Enums.VerificationCheckStatus;
    applicationSnapshot: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    reviewedAt?: Date | string;
};
export type GuideVerificationReviewCreateOrConnectWithoutGuideProfileInput = {
    where: Prisma.GuideVerificationReviewWhereUniqueInput;
    create: Prisma.XOR<Prisma.GuideVerificationReviewCreateWithoutGuideProfileInput, Prisma.GuideVerificationReviewUncheckedCreateWithoutGuideProfileInput>;
};
export type GuideVerificationReviewCreateManyGuideProfileInputEnvelope = {
    data: Prisma.GuideVerificationReviewCreateManyGuideProfileInput | Prisma.GuideVerificationReviewCreateManyGuideProfileInput[];
    skipDuplicates?: boolean;
};
export type GuideVerificationReviewUpsertWithWhereUniqueWithoutGuideProfileInput = {
    where: Prisma.GuideVerificationReviewWhereUniqueInput;
    update: Prisma.XOR<Prisma.GuideVerificationReviewUpdateWithoutGuideProfileInput, Prisma.GuideVerificationReviewUncheckedUpdateWithoutGuideProfileInput>;
    create: Prisma.XOR<Prisma.GuideVerificationReviewCreateWithoutGuideProfileInput, Prisma.GuideVerificationReviewUncheckedCreateWithoutGuideProfileInput>;
};
export type GuideVerificationReviewUpdateWithWhereUniqueWithoutGuideProfileInput = {
    where: Prisma.GuideVerificationReviewWhereUniqueInput;
    data: Prisma.XOR<Prisma.GuideVerificationReviewUpdateWithoutGuideProfileInput, Prisma.GuideVerificationReviewUncheckedUpdateWithoutGuideProfileInput>;
};
export type GuideVerificationReviewUpdateManyWithWhereWithoutGuideProfileInput = {
    where: Prisma.GuideVerificationReviewScalarWhereInput;
    data: Prisma.XOR<Prisma.GuideVerificationReviewUpdateManyMutationInput, Prisma.GuideVerificationReviewUncheckedUpdateManyWithoutGuideProfileInput>;
};
export type GuideVerificationReviewCreateManyReviewerInput = {
    id?: string;
    guideProfileId: string;
    decision: $Enums.GuideVerificationDecision;
    decisionReason?: string | null;
    internalNote?: string | null;
    assessmentScore: number;
    assessmentBreakdown: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    documentStatus: $Enums.VerificationCheckStatus;
    referenceStatus: $Enums.VerificationCheckStatus;
    applicationSnapshot: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    reviewedAt?: Date | string;
};
export type GuideVerificationReviewUpdateWithoutReviewerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    decision?: Prisma.EnumGuideVerificationDecisionFieldUpdateOperationsInput | $Enums.GuideVerificationDecision;
    decisionReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    internalNote?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    assessmentScore?: Prisma.IntFieldUpdateOperationsInput | number;
    assessmentBreakdown?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    documentStatus?: Prisma.EnumVerificationCheckStatusFieldUpdateOperationsInput | $Enums.VerificationCheckStatus;
    referenceStatus?: Prisma.EnumVerificationCheckStatusFieldUpdateOperationsInput | $Enums.VerificationCheckStatus;
    applicationSnapshot?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    reviewedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    guideProfile?: Prisma.GuideProfileUpdateOneRequiredWithoutVerificationReviewsNestedInput;
};
export type GuideVerificationReviewUncheckedUpdateWithoutReviewerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    guideProfileId?: Prisma.StringFieldUpdateOperationsInput | string;
    decision?: Prisma.EnumGuideVerificationDecisionFieldUpdateOperationsInput | $Enums.GuideVerificationDecision;
    decisionReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    internalNote?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    assessmentScore?: Prisma.IntFieldUpdateOperationsInput | number;
    assessmentBreakdown?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    documentStatus?: Prisma.EnumVerificationCheckStatusFieldUpdateOperationsInput | $Enums.VerificationCheckStatus;
    referenceStatus?: Prisma.EnumVerificationCheckStatusFieldUpdateOperationsInput | $Enums.VerificationCheckStatus;
    applicationSnapshot?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    reviewedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type GuideVerificationReviewUncheckedUpdateManyWithoutReviewerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    guideProfileId?: Prisma.StringFieldUpdateOperationsInput | string;
    decision?: Prisma.EnumGuideVerificationDecisionFieldUpdateOperationsInput | $Enums.GuideVerificationDecision;
    decisionReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    internalNote?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    assessmentScore?: Prisma.IntFieldUpdateOperationsInput | number;
    assessmentBreakdown?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    documentStatus?: Prisma.EnumVerificationCheckStatusFieldUpdateOperationsInput | $Enums.VerificationCheckStatus;
    referenceStatus?: Prisma.EnumVerificationCheckStatusFieldUpdateOperationsInput | $Enums.VerificationCheckStatus;
    applicationSnapshot?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    reviewedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type GuideVerificationReviewCreateManyGuideProfileInput = {
    id?: string;
    reviewerId: string;
    decision: $Enums.GuideVerificationDecision;
    decisionReason?: string | null;
    internalNote?: string | null;
    assessmentScore: number;
    assessmentBreakdown: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    documentStatus: $Enums.VerificationCheckStatus;
    referenceStatus: $Enums.VerificationCheckStatus;
    applicationSnapshot: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    reviewedAt?: Date | string;
};
export type GuideVerificationReviewUpdateWithoutGuideProfileInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    decision?: Prisma.EnumGuideVerificationDecisionFieldUpdateOperationsInput | $Enums.GuideVerificationDecision;
    decisionReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    internalNote?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    assessmentScore?: Prisma.IntFieldUpdateOperationsInput | number;
    assessmentBreakdown?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    documentStatus?: Prisma.EnumVerificationCheckStatusFieldUpdateOperationsInput | $Enums.VerificationCheckStatus;
    referenceStatus?: Prisma.EnumVerificationCheckStatusFieldUpdateOperationsInput | $Enums.VerificationCheckStatus;
    applicationSnapshot?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    reviewedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reviewer?: Prisma.UserUpdateOneRequiredWithoutGuideVerificationReviewsNestedInput;
};
export type GuideVerificationReviewUncheckedUpdateWithoutGuideProfileInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reviewerId?: Prisma.StringFieldUpdateOperationsInput | string;
    decision?: Prisma.EnumGuideVerificationDecisionFieldUpdateOperationsInput | $Enums.GuideVerificationDecision;
    decisionReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    internalNote?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    assessmentScore?: Prisma.IntFieldUpdateOperationsInput | number;
    assessmentBreakdown?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    documentStatus?: Prisma.EnumVerificationCheckStatusFieldUpdateOperationsInput | $Enums.VerificationCheckStatus;
    referenceStatus?: Prisma.EnumVerificationCheckStatusFieldUpdateOperationsInput | $Enums.VerificationCheckStatus;
    applicationSnapshot?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    reviewedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type GuideVerificationReviewUncheckedUpdateManyWithoutGuideProfileInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reviewerId?: Prisma.StringFieldUpdateOperationsInput | string;
    decision?: Prisma.EnumGuideVerificationDecisionFieldUpdateOperationsInput | $Enums.GuideVerificationDecision;
    decisionReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    internalNote?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    assessmentScore?: Prisma.IntFieldUpdateOperationsInput | number;
    assessmentBreakdown?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    documentStatus?: Prisma.EnumVerificationCheckStatusFieldUpdateOperationsInput | $Enums.VerificationCheckStatus;
    referenceStatus?: Prisma.EnumVerificationCheckStatusFieldUpdateOperationsInput | $Enums.VerificationCheckStatus;
    applicationSnapshot?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    reviewedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type GuideVerificationReviewSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    guideProfileId?: boolean;
    reviewerId?: boolean;
    decision?: boolean;
    decisionReason?: boolean;
    internalNote?: boolean;
    assessmentScore?: boolean;
    assessmentBreakdown?: boolean;
    documentStatus?: boolean;
    referenceStatus?: boolean;
    applicationSnapshot?: boolean;
    reviewedAt?: boolean;
    guideProfile?: boolean | Prisma.GuideProfileDefaultArgs<ExtArgs>;
    reviewer?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["guideVerificationReview"]>;
export type GuideVerificationReviewSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    guideProfileId?: boolean;
    reviewerId?: boolean;
    decision?: boolean;
    decisionReason?: boolean;
    internalNote?: boolean;
    assessmentScore?: boolean;
    assessmentBreakdown?: boolean;
    documentStatus?: boolean;
    referenceStatus?: boolean;
    applicationSnapshot?: boolean;
    reviewedAt?: boolean;
    guideProfile?: boolean | Prisma.GuideProfileDefaultArgs<ExtArgs>;
    reviewer?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["guideVerificationReview"]>;
export type GuideVerificationReviewSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    guideProfileId?: boolean;
    reviewerId?: boolean;
    decision?: boolean;
    decisionReason?: boolean;
    internalNote?: boolean;
    assessmentScore?: boolean;
    assessmentBreakdown?: boolean;
    documentStatus?: boolean;
    referenceStatus?: boolean;
    applicationSnapshot?: boolean;
    reviewedAt?: boolean;
    guideProfile?: boolean | Prisma.GuideProfileDefaultArgs<ExtArgs>;
    reviewer?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["guideVerificationReview"]>;
export type GuideVerificationReviewSelectScalar = {
    id?: boolean;
    guideProfileId?: boolean;
    reviewerId?: boolean;
    decision?: boolean;
    decisionReason?: boolean;
    internalNote?: boolean;
    assessmentScore?: boolean;
    assessmentBreakdown?: boolean;
    documentStatus?: boolean;
    referenceStatus?: boolean;
    applicationSnapshot?: boolean;
    reviewedAt?: boolean;
};
export type GuideVerificationReviewOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "guideProfileId" | "reviewerId" | "decision" | "decisionReason" | "internalNote" | "assessmentScore" | "assessmentBreakdown" | "documentStatus" | "referenceStatus" | "applicationSnapshot" | "reviewedAt", ExtArgs["result"]["guideVerificationReview"]>;
export type GuideVerificationReviewInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    guideProfile?: boolean | Prisma.GuideProfileDefaultArgs<ExtArgs>;
    reviewer?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type GuideVerificationReviewIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    guideProfile?: boolean | Prisma.GuideProfileDefaultArgs<ExtArgs>;
    reviewer?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type GuideVerificationReviewIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    guideProfile?: boolean | Prisma.GuideProfileDefaultArgs<ExtArgs>;
    reviewer?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $GuideVerificationReviewPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "GuideVerificationReview";
    objects: {
        guideProfile: Prisma.$GuideProfilePayload<ExtArgs>;
        reviewer: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        guideProfileId: string;
        reviewerId: string;
        decision: $Enums.GuideVerificationDecision;
        decisionReason: string | null;
        internalNote: string | null;
        assessmentScore: number;
        assessmentBreakdown: runtime.JsonValue;
        documentStatus: $Enums.VerificationCheckStatus;
        referenceStatus: $Enums.VerificationCheckStatus;
        applicationSnapshot: runtime.JsonValue;
        reviewedAt: Date;
    }, ExtArgs["result"]["guideVerificationReview"]>;
    composites: {};
};
export type GuideVerificationReviewGetPayload<S extends boolean | null | undefined | GuideVerificationReviewDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$GuideVerificationReviewPayload, S>;
export type GuideVerificationReviewCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<GuideVerificationReviewFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: GuideVerificationReviewCountAggregateInputType | true;
};
export interface GuideVerificationReviewDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['GuideVerificationReview'];
        meta: {
            name: 'GuideVerificationReview';
        };
    };
    findUnique<T extends GuideVerificationReviewFindUniqueArgs>(args: Prisma.SelectSubset<T, GuideVerificationReviewFindUniqueArgs<ExtArgs>>): Prisma.Prisma__GuideVerificationReviewClient<runtime.Types.Result.GetResult<Prisma.$GuideVerificationReviewPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends GuideVerificationReviewFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, GuideVerificationReviewFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__GuideVerificationReviewClient<runtime.Types.Result.GetResult<Prisma.$GuideVerificationReviewPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends GuideVerificationReviewFindFirstArgs>(args?: Prisma.SelectSubset<T, GuideVerificationReviewFindFirstArgs<ExtArgs>>): Prisma.Prisma__GuideVerificationReviewClient<runtime.Types.Result.GetResult<Prisma.$GuideVerificationReviewPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends GuideVerificationReviewFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, GuideVerificationReviewFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__GuideVerificationReviewClient<runtime.Types.Result.GetResult<Prisma.$GuideVerificationReviewPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends GuideVerificationReviewFindManyArgs>(args?: Prisma.SelectSubset<T, GuideVerificationReviewFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$GuideVerificationReviewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends GuideVerificationReviewCreateArgs>(args: Prisma.SelectSubset<T, GuideVerificationReviewCreateArgs<ExtArgs>>): Prisma.Prisma__GuideVerificationReviewClient<runtime.Types.Result.GetResult<Prisma.$GuideVerificationReviewPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends GuideVerificationReviewCreateManyArgs>(args?: Prisma.SelectSubset<T, GuideVerificationReviewCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends GuideVerificationReviewCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, GuideVerificationReviewCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$GuideVerificationReviewPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends GuideVerificationReviewDeleteArgs>(args: Prisma.SelectSubset<T, GuideVerificationReviewDeleteArgs<ExtArgs>>): Prisma.Prisma__GuideVerificationReviewClient<runtime.Types.Result.GetResult<Prisma.$GuideVerificationReviewPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends GuideVerificationReviewUpdateArgs>(args: Prisma.SelectSubset<T, GuideVerificationReviewUpdateArgs<ExtArgs>>): Prisma.Prisma__GuideVerificationReviewClient<runtime.Types.Result.GetResult<Prisma.$GuideVerificationReviewPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends GuideVerificationReviewDeleteManyArgs>(args?: Prisma.SelectSubset<T, GuideVerificationReviewDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends GuideVerificationReviewUpdateManyArgs>(args: Prisma.SelectSubset<T, GuideVerificationReviewUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends GuideVerificationReviewUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, GuideVerificationReviewUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$GuideVerificationReviewPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends GuideVerificationReviewUpsertArgs>(args: Prisma.SelectSubset<T, GuideVerificationReviewUpsertArgs<ExtArgs>>): Prisma.Prisma__GuideVerificationReviewClient<runtime.Types.Result.GetResult<Prisma.$GuideVerificationReviewPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends GuideVerificationReviewCountArgs>(args?: Prisma.Subset<T, GuideVerificationReviewCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], GuideVerificationReviewCountAggregateOutputType> : number>;
    aggregate<T extends GuideVerificationReviewAggregateArgs>(args: Prisma.Subset<T, GuideVerificationReviewAggregateArgs>): Prisma.PrismaPromise<GetGuideVerificationReviewAggregateType<T>>;
    groupBy<T extends GuideVerificationReviewGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: GuideVerificationReviewGroupByArgs['orderBy'];
    } : {
        orderBy?: GuideVerificationReviewGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, GuideVerificationReviewGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGuideVerificationReviewGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: GuideVerificationReviewFieldRefs;
}
export interface Prisma__GuideVerificationReviewClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    guideProfile<T extends Prisma.GuideProfileDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.GuideProfileDefaultArgs<ExtArgs>>): Prisma.Prisma__GuideProfileClient<runtime.Types.Result.GetResult<Prisma.$GuideProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    reviewer<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface GuideVerificationReviewFieldRefs {
    readonly id: Prisma.FieldRef<"GuideVerificationReview", 'String'>;
    readonly guideProfileId: Prisma.FieldRef<"GuideVerificationReview", 'String'>;
    readonly reviewerId: Prisma.FieldRef<"GuideVerificationReview", 'String'>;
    readonly decision: Prisma.FieldRef<"GuideVerificationReview", 'GuideVerificationDecision'>;
    readonly decisionReason: Prisma.FieldRef<"GuideVerificationReview", 'String'>;
    readonly internalNote: Prisma.FieldRef<"GuideVerificationReview", 'String'>;
    readonly assessmentScore: Prisma.FieldRef<"GuideVerificationReview", 'Int'>;
    readonly assessmentBreakdown: Prisma.FieldRef<"GuideVerificationReview", 'Json'>;
    readonly documentStatus: Prisma.FieldRef<"GuideVerificationReview", 'VerificationCheckStatus'>;
    readonly referenceStatus: Prisma.FieldRef<"GuideVerificationReview", 'VerificationCheckStatus'>;
    readonly applicationSnapshot: Prisma.FieldRef<"GuideVerificationReview", 'Json'>;
    readonly reviewedAt: Prisma.FieldRef<"GuideVerificationReview", 'DateTime'>;
}
export type GuideVerificationReviewFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.GuideVerificationReviewSelect<ExtArgs> | null;
    omit?: Prisma.GuideVerificationReviewOmit<ExtArgs> | null;
    include?: Prisma.GuideVerificationReviewInclude<ExtArgs> | null;
    where: Prisma.GuideVerificationReviewWhereUniqueInput;
};
export type GuideVerificationReviewFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.GuideVerificationReviewSelect<ExtArgs> | null;
    omit?: Prisma.GuideVerificationReviewOmit<ExtArgs> | null;
    include?: Prisma.GuideVerificationReviewInclude<ExtArgs> | null;
    where: Prisma.GuideVerificationReviewWhereUniqueInput;
};
export type GuideVerificationReviewFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.GuideVerificationReviewSelect<ExtArgs> | null;
    omit?: Prisma.GuideVerificationReviewOmit<ExtArgs> | null;
    include?: Prisma.GuideVerificationReviewInclude<ExtArgs> | null;
    where?: Prisma.GuideVerificationReviewWhereInput;
    orderBy?: Prisma.GuideVerificationReviewOrderByWithRelationInput | Prisma.GuideVerificationReviewOrderByWithRelationInput[];
    cursor?: Prisma.GuideVerificationReviewWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.GuideVerificationReviewScalarFieldEnum | Prisma.GuideVerificationReviewScalarFieldEnum[];
};
export type GuideVerificationReviewFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.GuideVerificationReviewSelect<ExtArgs> | null;
    omit?: Prisma.GuideVerificationReviewOmit<ExtArgs> | null;
    include?: Prisma.GuideVerificationReviewInclude<ExtArgs> | null;
    where?: Prisma.GuideVerificationReviewWhereInput;
    orderBy?: Prisma.GuideVerificationReviewOrderByWithRelationInput | Prisma.GuideVerificationReviewOrderByWithRelationInput[];
    cursor?: Prisma.GuideVerificationReviewWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.GuideVerificationReviewScalarFieldEnum | Prisma.GuideVerificationReviewScalarFieldEnum[];
};
export type GuideVerificationReviewFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.GuideVerificationReviewSelect<ExtArgs> | null;
    omit?: Prisma.GuideVerificationReviewOmit<ExtArgs> | null;
    include?: Prisma.GuideVerificationReviewInclude<ExtArgs> | null;
    where?: Prisma.GuideVerificationReviewWhereInput;
    orderBy?: Prisma.GuideVerificationReviewOrderByWithRelationInput | Prisma.GuideVerificationReviewOrderByWithRelationInput[];
    cursor?: Prisma.GuideVerificationReviewWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.GuideVerificationReviewScalarFieldEnum | Prisma.GuideVerificationReviewScalarFieldEnum[];
};
export type GuideVerificationReviewCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.GuideVerificationReviewSelect<ExtArgs> | null;
    omit?: Prisma.GuideVerificationReviewOmit<ExtArgs> | null;
    include?: Prisma.GuideVerificationReviewInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.GuideVerificationReviewCreateInput, Prisma.GuideVerificationReviewUncheckedCreateInput>;
};
export type GuideVerificationReviewCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.GuideVerificationReviewCreateManyInput | Prisma.GuideVerificationReviewCreateManyInput[];
    skipDuplicates?: boolean;
};
export type GuideVerificationReviewCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.GuideVerificationReviewSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.GuideVerificationReviewOmit<ExtArgs> | null;
    data: Prisma.GuideVerificationReviewCreateManyInput | Prisma.GuideVerificationReviewCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.GuideVerificationReviewIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type GuideVerificationReviewUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.GuideVerificationReviewSelect<ExtArgs> | null;
    omit?: Prisma.GuideVerificationReviewOmit<ExtArgs> | null;
    include?: Prisma.GuideVerificationReviewInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.GuideVerificationReviewUpdateInput, Prisma.GuideVerificationReviewUncheckedUpdateInput>;
    where: Prisma.GuideVerificationReviewWhereUniqueInput;
};
export type GuideVerificationReviewUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.GuideVerificationReviewUpdateManyMutationInput, Prisma.GuideVerificationReviewUncheckedUpdateManyInput>;
    where?: Prisma.GuideVerificationReviewWhereInput;
    limit?: number;
};
export type GuideVerificationReviewUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.GuideVerificationReviewSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.GuideVerificationReviewOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.GuideVerificationReviewUpdateManyMutationInput, Prisma.GuideVerificationReviewUncheckedUpdateManyInput>;
    where?: Prisma.GuideVerificationReviewWhereInput;
    limit?: number;
    include?: Prisma.GuideVerificationReviewIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type GuideVerificationReviewUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.GuideVerificationReviewSelect<ExtArgs> | null;
    omit?: Prisma.GuideVerificationReviewOmit<ExtArgs> | null;
    include?: Prisma.GuideVerificationReviewInclude<ExtArgs> | null;
    where: Prisma.GuideVerificationReviewWhereUniqueInput;
    create: Prisma.XOR<Prisma.GuideVerificationReviewCreateInput, Prisma.GuideVerificationReviewUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.GuideVerificationReviewUpdateInput, Prisma.GuideVerificationReviewUncheckedUpdateInput>;
};
export type GuideVerificationReviewDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.GuideVerificationReviewSelect<ExtArgs> | null;
    omit?: Prisma.GuideVerificationReviewOmit<ExtArgs> | null;
    include?: Prisma.GuideVerificationReviewInclude<ExtArgs> | null;
    where: Prisma.GuideVerificationReviewWhereUniqueInput;
};
export type GuideVerificationReviewDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.GuideVerificationReviewWhereInput;
    limit?: number;
};
export type GuideVerificationReviewDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.GuideVerificationReviewSelect<ExtArgs> | null;
    omit?: Prisma.GuideVerificationReviewOmit<ExtArgs> | null;
    include?: Prisma.GuideVerificationReviewInclude<ExtArgs> | null;
};
