import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ReportModel = runtime.Types.Result.DefaultSelection<Prisma.$ReportPayload>;
export type AggregateReport = {
    _count: ReportCountAggregateOutputType | null;
    _min: ReportMinAggregateOutputType | null;
    _max: ReportMaxAggregateOutputType | null;
};
export type ReportMinAggregateOutputType = {
    id: string | null;
    reporterId: string | null;
    reason: $Enums.ReportReason | null;
    targetType: $Enums.ReportTargetType | null;
    targetId: string | null;
    details: string | null;
    status: $Enums.ReportStatus | null;
    resolution: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    resolvedAt: Date | null;
};
export type ReportMaxAggregateOutputType = {
    id: string | null;
    reporterId: string | null;
    reason: $Enums.ReportReason | null;
    targetType: $Enums.ReportTargetType | null;
    targetId: string | null;
    details: string | null;
    status: $Enums.ReportStatus | null;
    resolution: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    resolvedAt: Date | null;
};
export type ReportCountAggregateOutputType = {
    id: number;
    reporterId: number;
    reason: number;
    targetType: number;
    targetId: number;
    details: number;
    status: number;
    resolution: number;
    createdAt: number;
    updatedAt: number;
    resolvedAt: number;
    _all: number;
};
export type ReportMinAggregateInputType = {
    id?: true;
    reporterId?: true;
    reason?: true;
    targetType?: true;
    targetId?: true;
    details?: true;
    status?: true;
    resolution?: true;
    createdAt?: true;
    updatedAt?: true;
    resolvedAt?: true;
};
export type ReportMaxAggregateInputType = {
    id?: true;
    reporterId?: true;
    reason?: true;
    targetType?: true;
    targetId?: true;
    details?: true;
    status?: true;
    resolution?: true;
    createdAt?: true;
    updatedAt?: true;
    resolvedAt?: true;
};
export type ReportCountAggregateInputType = {
    id?: true;
    reporterId?: true;
    reason?: true;
    targetType?: true;
    targetId?: true;
    details?: true;
    status?: true;
    resolution?: true;
    createdAt?: true;
    updatedAt?: true;
    resolvedAt?: true;
    _all?: true;
};
export type ReportAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReportWhereInput;
    orderBy?: Prisma.ReportOrderByWithRelationInput | Prisma.ReportOrderByWithRelationInput[];
    cursor?: Prisma.ReportWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ReportCountAggregateInputType;
    _min?: ReportMinAggregateInputType;
    _max?: ReportMaxAggregateInputType;
};
export type GetReportAggregateType<T extends ReportAggregateArgs> = {
    [P in keyof T & keyof AggregateReport]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateReport[P]> : Prisma.GetScalarType<T[P], AggregateReport[P]>;
};
export type ReportGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReportWhereInput;
    orderBy?: Prisma.ReportOrderByWithAggregationInput | Prisma.ReportOrderByWithAggregationInput[];
    by: Prisma.ReportScalarFieldEnum[] | Prisma.ReportScalarFieldEnum;
    having?: Prisma.ReportScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ReportCountAggregateInputType | true;
    _min?: ReportMinAggregateInputType;
    _max?: ReportMaxAggregateInputType;
};
export type ReportGroupByOutputType = {
    id: string;
    reporterId: string;
    reason: $Enums.ReportReason;
    targetType: $Enums.ReportTargetType;
    targetId: string;
    details: string | null;
    status: $Enums.ReportStatus;
    resolution: string | null;
    createdAt: Date;
    updatedAt: Date;
    resolvedAt: Date | null;
    _count: ReportCountAggregateOutputType | null;
    _min: ReportMinAggregateOutputType | null;
    _max: ReportMaxAggregateOutputType | null;
};
export type GetReportGroupByPayload<T extends ReportGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ReportGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ReportGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ReportGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ReportGroupByOutputType[P]>;
}>>;
export type ReportWhereInput = {
    AND?: Prisma.ReportWhereInput | Prisma.ReportWhereInput[];
    OR?: Prisma.ReportWhereInput[];
    NOT?: Prisma.ReportWhereInput | Prisma.ReportWhereInput[];
    id?: Prisma.UuidFilter<"Report"> | string;
    reporterId?: Prisma.UuidFilter<"Report"> | string;
    reason?: Prisma.EnumReportReasonFilter<"Report"> | $Enums.ReportReason;
    targetType?: Prisma.EnumReportTargetTypeFilter<"Report"> | $Enums.ReportTargetType;
    targetId?: Prisma.UuidFilter<"Report"> | string;
    details?: Prisma.StringNullableFilter<"Report"> | string | null;
    status?: Prisma.EnumReportStatusFilter<"Report"> | $Enums.ReportStatus;
    resolution?: Prisma.StringNullableFilter<"Report"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Report"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Report"> | Date | string;
    resolvedAt?: Prisma.DateTimeNullableFilter<"Report"> | Date | string | null;
    reporter?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    actions?: Prisma.ModerationActionListRelationFilter;
};
export type ReportOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    reporterId?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    targetType?: Prisma.SortOrder;
    targetId?: Prisma.SortOrder;
    details?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    resolution?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    resolvedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    reporter?: Prisma.UserOrderByWithRelationInput;
    actions?: Prisma.ModerationActionOrderByRelationAggregateInput;
};
export type ReportWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ReportWhereInput | Prisma.ReportWhereInput[];
    OR?: Prisma.ReportWhereInput[];
    NOT?: Prisma.ReportWhereInput | Prisma.ReportWhereInput[];
    reporterId?: Prisma.UuidFilter<"Report"> | string;
    reason?: Prisma.EnumReportReasonFilter<"Report"> | $Enums.ReportReason;
    targetType?: Prisma.EnumReportTargetTypeFilter<"Report"> | $Enums.ReportTargetType;
    targetId?: Prisma.UuidFilter<"Report"> | string;
    details?: Prisma.StringNullableFilter<"Report"> | string | null;
    status?: Prisma.EnumReportStatusFilter<"Report"> | $Enums.ReportStatus;
    resolution?: Prisma.StringNullableFilter<"Report"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Report"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Report"> | Date | string;
    resolvedAt?: Prisma.DateTimeNullableFilter<"Report"> | Date | string | null;
    reporter?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    actions?: Prisma.ModerationActionListRelationFilter;
}, "id">;
export type ReportOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    reporterId?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    targetType?: Prisma.SortOrder;
    targetId?: Prisma.SortOrder;
    details?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    resolution?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    resolvedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.ReportCountOrderByAggregateInput;
    _max?: Prisma.ReportMaxOrderByAggregateInput;
    _min?: Prisma.ReportMinOrderByAggregateInput;
};
export type ReportScalarWhereWithAggregatesInput = {
    AND?: Prisma.ReportScalarWhereWithAggregatesInput | Prisma.ReportScalarWhereWithAggregatesInput[];
    OR?: Prisma.ReportScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ReportScalarWhereWithAggregatesInput | Prisma.ReportScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"Report"> | string;
    reporterId?: Prisma.UuidWithAggregatesFilter<"Report"> | string;
    reason?: Prisma.EnumReportReasonWithAggregatesFilter<"Report"> | $Enums.ReportReason;
    targetType?: Prisma.EnumReportTargetTypeWithAggregatesFilter<"Report"> | $Enums.ReportTargetType;
    targetId?: Prisma.UuidWithAggregatesFilter<"Report"> | string;
    details?: Prisma.StringNullableWithAggregatesFilter<"Report"> | string | null;
    status?: Prisma.EnumReportStatusWithAggregatesFilter<"Report"> | $Enums.ReportStatus;
    resolution?: Prisma.StringNullableWithAggregatesFilter<"Report"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Report"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Report"> | Date | string;
    resolvedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Report"> | Date | string | null;
};
export type ReportCreateInput = {
    id?: string;
    reason: $Enums.ReportReason;
    targetType: $Enums.ReportTargetType;
    targetId: string;
    details?: string | null;
    status?: $Enums.ReportStatus;
    resolution?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    resolvedAt?: Date | string | null;
    reporter: Prisma.UserCreateNestedOneWithoutReportsCreatedInput;
    actions?: Prisma.ModerationActionCreateNestedManyWithoutReportInput;
};
export type ReportUncheckedCreateInput = {
    id?: string;
    reporterId: string;
    reason: $Enums.ReportReason;
    targetType: $Enums.ReportTargetType;
    targetId: string;
    details?: string | null;
    status?: $Enums.ReportStatus;
    resolution?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    resolvedAt?: Date | string | null;
    actions?: Prisma.ModerationActionUncheckedCreateNestedManyWithoutReportInput;
};
export type ReportUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.EnumReportReasonFieldUpdateOperationsInput | $Enums.ReportReason;
    targetType?: Prisma.EnumReportTargetTypeFieldUpdateOperationsInput | $Enums.ReportTargetType;
    targetId?: Prisma.StringFieldUpdateOperationsInput | string;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus;
    resolution?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reporter?: Prisma.UserUpdateOneRequiredWithoutReportsCreatedNestedInput;
    actions?: Prisma.ModerationActionUpdateManyWithoutReportNestedInput;
};
export type ReportUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reporterId?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.EnumReportReasonFieldUpdateOperationsInput | $Enums.ReportReason;
    targetType?: Prisma.EnumReportTargetTypeFieldUpdateOperationsInput | $Enums.ReportTargetType;
    targetId?: Prisma.StringFieldUpdateOperationsInput | string;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus;
    resolution?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    actions?: Prisma.ModerationActionUncheckedUpdateManyWithoutReportNestedInput;
};
export type ReportCreateManyInput = {
    id?: string;
    reporterId: string;
    reason: $Enums.ReportReason;
    targetType: $Enums.ReportTargetType;
    targetId: string;
    details?: string | null;
    status?: $Enums.ReportStatus;
    resolution?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    resolvedAt?: Date | string | null;
};
export type ReportUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.EnumReportReasonFieldUpdateOperationsInput | $Enums.ReportReason;
    targetType?: Prisma.EnumReportTargetTypeFieldUpdateOperationsInput | $Enums.ReportTargetType;
    targetId?: Prisma.StringFieldUpdateOperationsInput | string;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus;
    resolution?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ReportUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reporterId?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.EnumReportReasonFieldUpdateOperationsInput | $Enums.ReportReason;
    targetType?: Prisma.EnumReportTargetTypeFieldUpdateOperationsInput | $Enums.ReportTargetType;
    targetId?: Prisma.StringFieldUpdateOperationsInput | string;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus;
    resolution?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ReportListRelationFilter = {
    every?: Prisma.ReportWhereInput;
    some?: Prisma.ReportWhereInput;
    none?: Prisma.ReportWhereInput;
};
export type ReportOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ReportCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    reporterId?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    targetType?: Prisma.SortOrder;
    targetId?: Prisma.SortOrder;
    details?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    resolution?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    resolvedAt?: Prisma.SortOrder;
};
export type ReportMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    reporterId?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    targetType?: Prisma.SortOrder;
    targetId?: Prisma.SortOrder;
    details?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    resolution?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    resolvedAt?: Prisma.SortOrder;
};
export type ReportMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    reporterId?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    targetType?: Prisma.SortOrder;
    targetId?: Prisma.SortOrder;
    details?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    resolution?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    resolvedAt?: Prisma.SortOrder;
};
export type ReportScalarRelationFilter = {
    is?: Prisma.ReportWhereInput;
    isNot?: Prisma.ReportWhereInput;
};
export type ReportCreateNestedManyWithoutReporterInput = {
    create?: Prisma.XOR<Prisma.ReportCreateWithoutReporterInput, Prisma.ReportUncheckedCreateWithoutReporterInput> | Prisma.ReportCreateWithoutReporterInput[] | Prisma.ReportUncheckedCreateWithoutReporterInput[];
    connectOrCreate?: Prisma.ReportCreateOrConnectWithoutReporterInput | Prisma.ReportCreateOrConnectWithoutReporterInput[];
    createMany?: Prisma.ReportCreateManyReporterInputEnvelope;
    connect?: Prisma.ReportWhereUniqueInput | Prisma.ReportWhereUniqueInput[];
};
export type ReportUncheckedCreateNestedManyWithoutReporterInput = {
    create?: Prisma.XOR<Prisma.ReportCreateWithoutReporterInput, Prisma.ReportUncheckedCreateWithoutReporterInput> | Prisma.ReportCreateWithoutReporterInput[] | Prisma.ReportUncheckedCreateWithoutReporterInput[];
    connectOrCreate?: Prisma.ReportCreateOrConnectWithoutReporterInput | Prisma.ReportCreateOrConnectWithoutReporterInput[];
    createMany?: Prisma.ReportCreateManyReporterInputEnvelope;
    connect?: Prisma.ReportWhereUniqueInput | Prisma.ReportWhereUniqueInput[];
};
export type ReportUpdateManyWithoutReporterNestedInput = {
    create?: Prisma.XOR<Prisma.ReportCreateWithoutReporterInput, Prisma.ReportUncheckedCreateWithoutReporterInput> | Prisma.ReportCreateWithoutReporterInput[] | Prisma.ReportUncheckedCreateWithoutReporterInput[];
    connectOrCreate?: Prisma.ReportCreateOrConnectWithoutReporterInput | Prisma.ReportCreateOrConnectWithoutReporterInput[];
    upsert?: Prisma.ReportUpsertWithWhereUniqueWithoutReporterInput | Prisma.ReportUpsertWithWhereUniqueWithoutReporterInput[];
    createMany?: Prisma.ReportCreateManyReporterInputEnvelope;
    set?: Prisma.ReportWhereUniqueInput | Prisma.ReportWhereUniqueInput[];
    disconnect?: Prisma.ReportWhereUniqueInput | Prisma.ReportWhereUniqueInput[];
    delete?: Prisma.ReportWhereUniqueInput | Prisma.ReportWhereUniqueInput[];
    connect?: Prisma.ReportWhereUniqueInput | Prisma.ReportWhereUniqueInput[];
    update?: Prisma.ReportUpdateWithWhereUniqueWithoutReporterInput | Prisma.ReportUpdateWithWhereUniqueWithoutReporterInput[];
    updateMany?: Prisma.ReportUpdateManyWithWhereWithoutReporterInput | Prisma.ReportUpdateManyWithWhereWithoutReporterInput[];
    deleteMany?: Prisma.ReportScalarWhereInput | Prisma.ReportScalarWhereInput[];
};
export type ReportUncheckedUpdateManyWithoutReporterNestedInput = {
    create?: Prisma.XOR<Prisma.ReportCreateWithoutReporterInput, Prisma.ReportUncheckedCreateWithoutReporterInput> | Prisma.ReportCreateWithoutReporterInput[] | Prisma.ReportUncheckedCreateWithoutReporterInput[];
    connectOrCreate?: Prisma.ReportCreateOrConnectWithoutReporterInput | Prisma.ReportCreateOrConnectWithoutReporterInput[];
    upsert?: Prisma.ReportUpsertWithWhereUniqueWithoutReporterInput | Prisma.ReportUpsertWithWhereUniqueWithoutReporterInput[];
    createMany?: Prisma.ReportCreateManyReporterInputEnvelope;
    set?: Prisma.ReportWhereUniqueInput | Prisma.ReportWhereUniqueInput[];
    disconnect?: Prisma.ReportWhereUniqueInput | Prisma.ReportWhereUniqueInput[];
    delete?: Prisma.ReportWhereUniqueInput | Prisma.ReportWhereUniqueInput[];
    connect?: Prisma.ReportWhereUniqueInput | Prisma.ReportWhereUniqueInput[];
    update?: Prisma.ReportUpdateWithWhereUniqueWithoutReporterInput | Prisma.ReportUpdateWithWhereUniqueWithoutReporterInput[];
    updateMany?: Prisma.ReportUpdateManyWithWhereWithoutReporterInput | Prisma.ReportUpdateManyWithWhereWithoutReporterInput[];
    deleteMany?: Prisma.ReportScalarWhereInput | Prisma.ReportScalarWhereInput[];
};
export type EnumReportReasonFieldUpdateOperationsInput = {
    set?: $Enums.ReportReason;
};
export type EnumReportTargetTypeFieldUpdateOperationsInput = {
    set?: $Enums.ReportTargetType;
};
export type EnumReportStatusFieldUpdateOperationsInput = {
    set?: $Enums.ReportStatus;
};
export type ReportCreateNestedOneWithoutActionsInput = {
    create?: Prisma.XOR<Prisma.ReportCreateWithoutActionsInput, Prisma.ReportUncheckedCreateWithoutActionsInput>;
    connectOrCreate?: Prisma.ReportCreateOrConnectWithoutActionsInput;
    connect?: Prisma.ReportWhereUniqueInput;
};
export type ReportUpdateOneRequiredWithoutActionsNestedInput = {
    create?: Prisma.XOR<Prisma.ReportCreateWithoutActionsInput, Prisma.ReportUncheckedCreateWithoutActionsInput>;
    connectOrCreate?: Prisma.ReportCreateOrConnectWithoutActionsInput;
    upsert?: Prisma.ReportUpsertWithoutActionsInput;
    connect?: Prisma.ReportWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ReportUpdateToOneWithWhereWithoutActionsInput, Prisma.ReportUpdateWithoutActionsInput>, Prisma.ReportUncheckedUpdateWithoutActionsInput>;
};
export type ReportCreateWithoutReporterInput = {
    id?: string;
    reason: $Enums.ReportReason;
    targetType: $Enums.ReportTargetType;
    targetId: string;
    details?: string | null;
    status?: $Enums.ReportStatus;
    resolution?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    resolvedAt?: Date | string | null;
    actions?: Prisma.ModerationActionCreateNestedManyWithoutReportInput;
};
export type ReportUncheckedCreateWithoutReporterInput = {
    id?: string;
    reason: $Enums.ReportReason;
    targetType: $Enums.ReportTargetType;
    targetId: string;
    details?: string | null;
    status?: $Enums.ReportStatus;
    resolution?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    resolvedAt?: Date | string | null;
    actions?: Prisma.ModerationActionUncheckedCreateNestedManyWithoutReportInput;
};
export type ReportCreateOrConnectWithoutReporterInput = {
    where: Prisma.ReportWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReportCreateWithoutReporterInput, Prisma.ReportUncheckedCreateWithoutReporterInput>;
};
export type ReportCreateManyReporterInputEnvelope = {
    data: Prisma.ReportCreateManyReporterInput | Prisma.ReportCreateManyReporterInput[];
    skipDuplicates?: boolean;
};
export type ReportUpsertWithWhereUniqueWithoutReporterInput = {
    where: Prisma.ReportWhereUniqueInput;
    update: Prisma.XOR<Prisma.ReportUpdateWithoutReporterInput, Prisma.ReportUncheckedUpdateWithoutReporterInput>;
    create: Prisma.XOR<Prisma.ReportCreateWithoutReporterInput, Prisma.ReportUncheckedCreateWithoutReporterInput>;
};
export type ReportUpdateWithWhereUniqueWithoutReporterInput = {
    where: Prisma.ReportWhereUniqueInput;
    data: Prisma.XOR<Prisma.ReportUpdateWithoutReporterInput, Prisma.ReportUncheckedUpdateWithoutReporterInput>;
};
export type ReportUpdateManyWithWhereWithoutReporterInput = {
    where: Prisma.ReportScalarWhereInput;
    data: Prisma.XOR<Prisma.ReportUpdateManyMutationInput, Prisma.ReportUncheckedUpdateManyWithoutReporterInput>;
};
export type ReportScalarWhereInput = {
    AND?: Prisma.ReportScalarWhereInput | Prisma.ReportScalarWhereInput[];
    OR?: Prisma.ReportScalarWhereInput[];
    NOT?: Prisma.ReportScalarWhereInput | Prisma.ReportScalarWhereInput[];
    id?: Prisma.UuidFilter<"Report"> | string;
    reporterId?: Prisma.UuidFilter<"Report"> | string;
    reason?: Prisma.EnumReportReasonFilter<"Report"> | $Enums.ReportReason;
    targetType?: Prisma.EnumReportTargetTypeFilter<"Report"> | $Enums.ReportTargetType;
    targetId?: Prisma.UuidFilter<"Report"> | string;
    details?: Prisma.StringNullableFilter<"Report"> | string | null;
    status?: Prisma.EnumReportStatusFilter<"Report"> | $Enums.ReportStatus;
    resolution?: Prisma.StringNullableFilter<"Report"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Report"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Report"> | Date | string;
    resolvedAt?: Prisma.DateTimeNullableFilter<"Report"> | Date | string | null;
};
export type ReportCreateWithoutActionsInput = {
    id?: string;
    reason: $Enums.ReportReason;
    targetType: $Enums.ReportTargetType;
    targetId: string;
    details?: string | null;
    status?: $Enums.ReportStatus;
    resolution?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    resolvedAt?: Date | string | null;
    reporter: Prisma.UserCreateNestedOneWithoutReportsCreatedInput;
};
export type ReportUncheckedCreateWithoutActionsInput = {
    id?: string;
    reporterId: string;
    reason: $Enums.ReportReason;
    targetType: $Enums.ReportTargetType;
    targetId: string;
    details?: string | null;
    status?: $Enums.ReportStatus;
    resolution?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    resolvedAt?: Date | string | null;
};
export type ReportCreateOrConnectWithoutActionsInput = {
    where: Prisma.ReportWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReportCreateWithoutActionsInput, Prisma.ReportUncheckedCreateWithoutActionsInput>;
};
export type ReportUpsertWithoutActionsInput = {
    update: Prisma.XOR<Prisma.ReportUpdateWithoutActionsInput, Prisma.ReportUncheckedUpdateWithoutActionsInput>;
    create: Prisma.XOR<Prisma.ReportCreateWithoutActionsInput, Prisma.ReportUncheckedCreateWithoutActionsInput>;
    where?: Prisma.ReportWhereInput;
};
export type ReportUpdateToOneWithWhereWithoutActionsInput = {
    where?: Prisma.ReportWhereInput;
    data: Prisma.XOR<Prisma.ReportUpdateWithoutActionsInput, Prisma.ReportUncheckedUpdateWithoutActionsInput>;
};
export type ReportUpdateWithoutActionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.EnumReportReasonFieldUpdateOperationsInput | $Enums.ReportReason;
    targetType?: Prisma.EnumReportTargetTypeFieldUpdateOperationsInput | $Enums.ReportTargetType;
    targetId?: Prisma.StringFieldUpdateOperationsInput | string;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus;
    resolution?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reporter?: Prisma.UserUpdateOneRequiredWithoutReportsCreatedNestedInput;
};
export type ReportUncheckedUpdateWithoutActionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reporterId?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.EnumReportReasonFieldUpdateOperationsInput | $Enums.ReportReason;
    targetType?: Prisma.EnumReportTargetTypeFieldUpdateOperationsInput | $Enums.ReportTargetType;
    targetId?: Prisma.StringFieldUpdateOperationsInput | string;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus;
    resolution?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ReportCreateManyReporterInput = {
    id?: string;
    reason: $Enums.ReportReason;
    targetType: $Enums.ReportTargetType;
    targetId: string;
    details?: string | null;
    status?: $Enums.ReportStatus;
    resolution?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    resolvedAt?: Date | string | null;
};
export type ReportUpdateWithoutReporterInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.EnumReportReasonFieldUpdateOperationsInput | $Enums.ReportReason;
    targetType?: Prisma.EnumReportTargetTypeFieldUpdateOperationsInput | $Enums.ReportTargetType;
    targetId?: Prisma.StringFieldUpdateOperationsInput | string;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus;
    resolution?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    actions?: Prisma.ModerationActionUpdateManyWithoutReportNestedInput;
};
export type ReportUncheckedUpdateWithoutReporterInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.EnumReportReasonFieldUpdateOperationsInput | $Enums.ReportReason;
    targetType?: Prisma.EnumReportTargetTypeFieldUpdateOperationsInput | $Enums.ReportTargetType;
    targetId?: Prisma.StringFieldUpdateOperationsInput | string;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus;
    resolution?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    actions?: Prisma.ModerationActionUncheckedUpdateManyWithoutReportNestedInput;
};
export type ReportUncheckedUpdateManyWithoutReporterInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.EnumReportReasonFieldUpdateOperationsInput | $Enums.ReportReason;
    targetType?: Prisma.EnumReportTargetTypeFieldUpdateOperationsInput | $Enums.ReportTargetType;
    targetId?: Prisma.StringFieldUpdateOperationsInput | string;
    details?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus;
    resolution?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ReportCountOutputType = {
    actions: number;
};
export type ReportCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    actions?: boolean | ReportCountOutputTypeCountActionsArgs;
};
export type ReportCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReportCountOutputTypeSelect<ExtArgs> | null;
};
export type ReportCountOutputTypeCountActionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ModerationActionWhereInput;
};
export type ReportSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    reporterId?: boolean;
    reason?: boolean;
    targetType?: boolean;
    targetId?: boolean;
    details?: boolean;
    status?: boolean;
    resolution?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    resolvedAt?: boolean;
    reporter?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    actions?: boolean | Prisma.Report$actionsArgs<ExtArgs>;
    _count?: boolean | Prisma.ReportCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["report"]>;
export type ReportSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    reporterId?: boolean;
    reason?: boolean;
    targetType?: boolean;
    targetId?: boolean;
    details?: boolean;
    status?: boolean;
    resolution?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    resolvedAt?: boolean;
    reporter?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["report"]>;
export type ReportSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    reporterId?: boolean;
    reason?: boolean;
    targetType?: boolean;
    targetId?: boolean;
    details?: boolean;
    status?: boolean;
    resolution?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    resolvedAt?: boolean;
    reporter?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["report"]>;
export type ReportSelectScalar = {
    id?: boolean;
    reporterId?: boolean;
    reason?: boolean;
    targetType?: boolean;
    targetId?: boolean;
    details?: boolean;
    status?: boolean;
    resolution?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    resolvedAt?: boolean;
};
export type ReportOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "reporterId" | "reason" | "targetType" | "targetId" | "details" | "status" | "resolution" | "createdAt" | "updatedAt" | "resolvedAt", ExtArgs["result"]["report"]>;
export type ReportInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    reporter?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    actions?: boolean | Prisma.Report$actionsArgs<ExtArgs>;
    _count?: boolean | Prisma.ReportCountOutputTypeDefaultArgs<ExtArgs>;
};
export type ReportIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    reporter?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type ReportIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    reporter?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $ReportPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Report";
    objects: {
        reporter: Prisma.$UserPayload<ExtArgs>;
        actions: Prisma.$ModerationActionPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        reporterId: string;
        reason: $Enums.ReportReason;
        targetType: $Enums.ReportTargetType;
        targetId: string;
        details: string | null;
        status: $Enums.ReportStatus;
        resolution: string | null;
        createdAt: Date;
        updatedAt: Date;
        resolvedAt: Date | null;
    }, ExtArgs["result"]["report"]>;
    composites: {};
};
export type ReportGetPayload<S extends boolean | null | undefined | ReportDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ReportPayload, S>;
export type ReportCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ReportFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ReportCountAggregateInputType | true;
};
export interface ReportDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Report'];
        meta: {
            name: 'Report';
        };
    };
    findUnique<T extends ReportFindUniqueArgs>(args: Prisma.SelectSubset<T, ReportFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ReportClient<runtime.Types.Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ReportFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ReportFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ReportClient<runtime.Types.Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ReportFindFirstArgs>(args?: Prisma.SelectSubset<T, ReportFindFirstArgs<ExtArgs>>): Prisma.Prisma__ReportClient<runtime.Types.Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ReportFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ReportFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ReportClient<runtime.Types.Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ReportFindManyArgs>(args?: Prisma.SelectSubset<T, ReportFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ReportCreateArgs>(args: Prisma.SelectSubset<T, ReportCreateArgs<ExtArgs>>): Prisma.Prisma__ReportClient<runtime.Types.Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ReportCreateManyArgs>(args?: Prisma.SelectSubset<T, ReportCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ReportCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ReportCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ReportDeleteArgs>(args: Prisma.SelectSubset<T, ReportDeleteArgs<ExtArgs>>): Prisma.Prisma__ReportClient<runtime.Types.Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ReportUpdateArgs>(args: Prisma.SelectSubset<T, ReportUpdateArgs<ExtArgs>>): Prisma.Prisma__ReportClient<runtime.Types.Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ReportDeleteManyArgs>(args?: Prisma.SelectSubset<T, ReportDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ReportUpdateManyArgs>(args: Prisma.SelectSubset<T, ReportUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ReportUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ReportUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ReportUpsertArgs>(args: Prisma.SelectSubset<T, ReportUpsertArgs<ExtArgs>>): Prisma.Prisma__ReportClient<runtime.Types.Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ReportCountArgs>(args?: Prisma.Subset<T, ReportCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ReportCountAggregateOutputType> : number>;
    aggregate<T extends ReportAggregateArgs>(args: Prisma.Subset<T, ReportAggregateArgs>): Prisma.PrismaPromise<GetReportAggregateType<T>>;
    groupBy<T extends ReportGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ReportGroupByArgs['orderBy'];
    } : {
        orderBy?: ReportGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ReportGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReportGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ReportFieldRefs;
}
export interface Prisma__ReportClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    reporter<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    actions<T extends Prisma.Report$actionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Report$actionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ModerationActionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ReportFieldRefs {
    readonly id: Prisma.FieldRef<"Report", 'String'>;
    readonly reporterId: Prisma.FieldRef<"Report", 'String'>;
    readonly reason: Prisma.FieldRef<"Report", 'ReportReason'>;
    readonly targetType: Prisma.FieldRef<"Report", 'ReportTargetType'>;
    readonly targetId: Prisma.FieldRef<"Report", 'String'>;
    readonly details: Prisma.FieldRef<"Report", 'String'>;
    readonly status: Prisma.FieldRef<"Report", 'ReportStatus'>;
    readonly resolution: Prisma.FieldRef<"Report", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Report", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Report", 'DateTime'>;
    readonly resolvedAt: Prisma.FieldRef<"Report", 'DateTime'>;
}
export type ReportFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReportSelect<ExtArgs> | null;
    omit?: Prisma.ReportOmit<ExtArgs> | null;
    include?: Prisma.ReportInclude<ExtArgs> | null;
    where: Prisma.ReportWhereUniqueInput;
};
export type ReportFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReportSelect<ExtArgs> | null;
    omit?: Prisma.ReportOmit<ExtArgs> | null;
    include?: Prisma.ReportInclude<ExtArgs> | null;
    where: Prisma.ReportWhereUniqueInput;
};
export type ReportFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReportSelect<ExtArgs> | null;
    omit?: Prisma.ReportOmit<ExtArgs> | null;
    include?: Prisma.ReportInclude<ExtArgs> | null;
    where?: Prisma.ReportWhereInput;
    orderBy?: Prisma.ReportOrderByWithRelationInput | Prisma.ReportOrderByWithRelationInput[];
    cursor?: Prisma.ReportWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReportScalarFieldEnum | Prisma.ReportScalarFieldEnum[];
};
export type ReportFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReportSelect<ExtArgs> | null;
    omit?: Prisma.ReportOmit<ExtArgs> | null;
    include?: Prisma.ReportInclude<ExtArgs> | null;
    where?: Prisma.ReportWhereInput;
    orderBy?: Prisma.ReportOrderByWithRelationInput | Prisma.ReportOrderByWithRelationInput[];
    cursor?: Prisma.ReportWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReportScalarFieldEnum | Prisma.ReportScalarFieldEnum[];
};
export type ReportFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReportSelect<ExtArgs> | null;
    omit?: Prisma.ReportOmit<ExtArgs> | null;
    include?: Prisma.ReportInclude<ExtArgs> | null;
    where?: Prisma.ReportWhereInput;
    orderBy?: Prisma.ReportOrderByWithRelationInput | Prisma.ReportOrderByWithRelationInput[];
    cursor?: Prisma.ReportWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReportScalarFieldEnum | Prisma.ReportScalarFieldEnum[];
};
export type ReportCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReportSelect<ExtArgs> | null;
    omit?: Prisma.ReportOmit<ExtArgs> | null;
    include?: Prisma.ReportInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReportCreateInput, Prisma.ReportUncheckedCreateInput>;
};
export type ReportCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ReportCreateManyInput | Prisma.ReportCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ReportCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReportSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ReportOmit<ExtArgs> | null;
    data: Prisma.ReportCreateManyInput | Prisma.ReportCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ReportIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ReportUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReportSelect<ExtArgs> | null;
    omit?: Prisma.ReportOmit<ExtArgs> | null;
    include?: Prisma.ReportInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReportUpdateInput, Prisma.ReportUncheckedUpdateInput>;
    where: Prisma.ReportWhereUniqueInput;
};
export type ReportUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ReportUpdateManyMutationInput, Prisma.ReportUncheckedUpdateManyInput>;
    where?: Prisma.ReportWhereInput;
    limit?: number;
};
export type ReportUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReportSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ReportOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReportUpdateManyMutationInput, Prisma.ReportUncheckedUpdateManyInput>;
    where?: Prisma.ReportWhereInput;
    limit?: number;
    include?: Prisma.ReportIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ReportUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReportSelect<ExtArgs> | null;
    omit?: Prisma.ReportOmit<ExtArgs> | null;
    include?: Prisma.ReportInclude<ExtArgs> | null;
    where: Prisma.ReportWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReportCreateInput, Prisma.ReportUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ReportUpdateInput, Prisma.ReportUncheckedUpdateInput>;
};
export type ReportDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReportSelect<ExtArgs> | null;
    omit?: Prisma.ReportOmit<ExtArgs> | null;
    include?: Prisma.ReportInclude<ExtArgs> | null;
    where: Prisma.ReportWhereUniqueInput;
};
export type ReportDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReportWhereInput;
    limit?: number;
};
export type Report$actionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModerationActionSelect<ExtArgs> | null;
    omit?: Prisma.ModerationActionOmit<ExtArgs> | null;
    include?: Prisma.ModerationActionInclude<ExtArgs> | null;
    where?: Prisma.ModerationActionWhereInput;
    orderBy?: Prisma.ModerationActionOrderByWithRelationInput | Prisma.ModerationActionOrderByWithRelationInput[];
    cursor?: Prisma.ModerationActionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ModerationActionScalarFieldEnum | Prisma.ModerationActionScalarFieldEnum[];
};
export type ReportDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReportSelect<ExtArgs> | null;
    omit?: Prisma.ReportOmit<ExtArgs> | null;
    include?: Prisma.ReportInclude<ExtArgs> | null;
};
