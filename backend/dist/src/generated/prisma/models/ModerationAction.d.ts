import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ModerationActionModel = runtime.Types.Result.DefaultSelection<Prisma.$ModerationActionPayload>;
export type AggregateModerationAction = {
    _count: ModerationActionCountAggregateOutputType | null;
    _min: ModerationActionMinAggregateOutputType | null;
    _max: ModerationActionMaxAggregateOutputType | null;
};
export type ModerationActionMinAggregateOutputType = {
    id: string | null;
    reportId: string | null;
    adminId: string | null;
    action: $Enums.ModerationActionType | null;
    reason: string | null;
    expiresAt: Date | null;
    createdAt: Date | null;
};
export type ModerationActionMaxAggregateOutputType = {
    id: string | null;
    reportId: string | null;
    adminId: string | null;
    action: $Enums.ModerationActionType | null;
    reason: string | null;
    expiresAt: Date | null;
    createdAt: Date | null;
};
export type ModerationActionCountAggregateOutputType = {
    id: number;
    reportId: number;
    adminId: number;
    action: number;
    reason: number;
    metadata: number;
    expiresAt: number;
    createdAt: number;
    _all: number;
};
export type ModerationActionMinAggregateInputType = {
    id?: true;
    reportId?: true;
    adminId?: true;
    action?: true;
    reason?: true;
    expiresAt?: true;
    createdAt?: true;
};
export type ModerationActionMaxAggregateInputType = {
    id?: true;
    reportId?: true;
    adminId?: true;
    action?: true;
    reason?: true;
    expiresAt?: true;
    createdAt?: true;
};
export type ModerationActionCountAggregateInputType = {
    id?: true;
    reportId?: true;
    adminId?: true;
    action?: true;
    reason?: true;
    metadata?: true;
    expiresAt?: true;
    createdAt?: true;
    _all?: true;
};
export type ModerationActionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ModerationActionWhereInput;
    orderBy?: Prisma.ModerationActionOrderByWithRelationInput | Prisma.ModerationActionOrderByWithRelationInput[];
    cursor?: Prisma.ModerationActionWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ModerationActionCountAggregateInputType;
    _min?: ModerationActionMinAggregateInputType;
    _max?: ModerationActionMaxAggregateInputType;
};
export type GetModerationActionAggregateType<T extends ModerationActionAggregateArgs> = {
    [P in keyof T & keyof AggregateModerationAction]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateModerationAction[P]> : Prisma.GetScalarType<T[P], AggregateModerationAction[P]>;
};
export type ModerationActionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ModerationActionWhereInput;
    orderBy?: Prisma.ModerationActionOrderByWithAggregationInput | Prisma.ModerationActionOrderByWithAggregationInput[];
    by: Prisma.ModerationActionScalarFieldEnum[] | Prisma.ModerationActionScalarFieldEnum;
    having?: Prisma.ModerationActionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ModerationActionCountAggregateInputType | true;
    _min?: ModerationActionMinAggregateInputType;
    _max?: ModerationActionMaxAggregateInputType;
};
export type ModerationActionGroupByOutputType = {
    id: string;
    reportId: string;
    adminId: string;
    action: $Enums.ModerationActionType;
    reason: string;
    metadata: runtime.JsonValue | null;
    expiresAt: Date | null;
    createdAt: Date;
    _count: ModerationActionCountAggregateOutputType | null;
    _min: ModerationActionMinAggregateOutputType | null;
    _max: ModerationActionMaxAggregateOutputType | null;
};
export type GetModerationActionGroupByPayload<T extends ModerationActionGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ModerationActionGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ModerationActionGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ModerationActionGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ModerationActionGroupByOutputType[P]>;
}>>;
export type ModerationActionWhereInput = {
    AND?: Prisma.ModerationActionWhereInput | Prisma.ModerationActionWhereInput[];
    OR?: Prisma.ModerationActionWhereInput[];
    NOT?: Prisma.ModerationActionWhereInput | Prisma.ModerationActionWhereInput[];
    id?: Prisma.UuidFilter<"ModerationAction"> | string;
    reportId?: Prisma.UuidFilter<"ModerationAction"> | string;
    adminId?: Prisma.UuidFilter<"ModerationAction"> | string;
    action?: Prisma.EnumModerationActionTypeFilter<"ModerationAction"> | $Enums.ModerationActionType;
    reason?: Prisma.StringFilter<"ModerationAction"> | string;
    metadata?: Prisma.JsonNullableFilter<"ModerationAction">;
    expiresAt?: Prisma.DateTimeNullableFilter<"ModerationAction"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"ModerationAction"> | Date | string;
    report?: Prisma.XOR<Prisma.ReportScalarRelationFilter, Prisma.ReportWhereInput>;
    admin?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type ModerationActionOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    reportId?: Prisma.SortOrder;
    adminId?: Prisma.SortOrder;
    action?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    metadata?: Prisma.SortOrderInput | Prisma.SortOrder;
    expiresAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    report?: Prisma.ReportOrderByWithRelationInput;
    admin?: Prisma.UserOrderByWithRelationInput;
};
export type ModerationActionWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ModerationActionWhereInput | Prisma.ModerationActionWhereInput[];
    OR?: Prisma.ModerationActionWhereInput[];
    NOT?: Prisma.ModerationActionWhereInput | Prisma.ModerationActionWhereInput[];
    reportId?: Prisma.UuidFilter<"ModerationAction"> | string;
    adminId?: Prisma.UuidFilter<"ModerationAction"> | string;
    action?: Prisma.EnumModerationActionTypeFilter<"ModerationAction"> | $Enums.ModerationActionType;
    reason?: Prisma.StringFilter<"ModerationAction"> | string;
    metadata?: Prisma.JsonNullableFilter<"ModerationAction">;
    expiresAt?: Prisma.DateTimeNullableFilter<"ModerationAction"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"ModerationAction"> | Date | string;
    report?: Prisma.XOR<Prisma.ReportScalarRelationFilter, Prisma.ReportWhereInput>;
    admin?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id">;
export type ModerationActionOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    reportId?: Prisma.SortOrder;
    adminId?: Prisma.SortOrder;
    action?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    metadata?: Prisma.SortOrderInput | Prisma.SortOrder;
    expiresAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.ModerationActionCountOrderByAggregateInput;
    _max?: Prisma.ModerationActionMaxOrderByAggregateInput;
    _min?: Prisma.ModerationActionMinOrderByAggregateInput;
};
export type ModerationActionScalarWhereWithAggregatesInput = {
    AND?: Prisma.ModerationActionScalarWhereWithAggregatesInput | Prisma.ModerationActionScalarWhereWithAggregatesInput[];
    OR?: Prisma.ModerationActionScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ModerationActionScalarWhereWithAggregatesInput | Prisma.ModerationActionScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"ModerationAction"> | string;
    reportId?: Prisma.UuidWithAggregatesFilter<"ModerationAction"> | string;
    adminId?: Prisma.UuidWithAggregatesFilter<"ModerationAction"> | string;
    action?: Prisma.EnumModerationActionTypeWithAggregatesFilter<"ModerationAction"> | $Enums.ModerationActionType;
    reason?: Prisma.StringWithAggregatesFilter<"ModerationAction"> | string;
    metadata?: Prisma.JsonNullableWithAggregatesFilter<"ModerationAction">;
    expiresAt?: Prisma.DateTimeNullableWithAggregatesFilter<"ModerationAction"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ModerationAction"> | Date | string;
};
export type ModerationActionCreateInput = {
    id?: string;
    action: $Enums.ModerationActionType;
    reason: string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    expiresAt?: Date | string | null;
    createdAt?: Date | string;
    report: Prisma.ReportCreateNestedOneWithoutActionsInput;
    admin: Prisma.UserCreateNestedOneWithoutModerationActionsInput;
};
export type ModerationActionUncheckedCreateInput = {
    id?: string;
    reportId: string;
    adminId: string;
    action: $Enums.ModerationActionType;
    reason: string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    expiresAt?: Date | string | null;
    createdAt?: Date | string;
};
export type ModerationActionUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.EnumModerationActionTypeFieldUpdateOperationsInput | $Enums.ModerationActionType;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    report?: Prisma.ReportUpdateOneRequiredWithoutActionsNestedInput;
    admin?: Prisma.UserUpdateOneRequiredWithoutModerationActionsNestedInput;
};
export type ModerationActionUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reportId?: Prisma.StringFieldUpdateOperationsInput | string;
    adminId?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.EnumModerationActionTypeFieldUpdateOperationsInput | $Enums.ModerationActionType;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ModerationActionCreateManyInput = {
    id?: string;
    reportId: string;
    adminId: string;
    action: $Enums.ModerationActionType;
    reason: string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    expiresAt?: Date | string | null;
    createdAt?: Date | string;
};
export type ModerationActionUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.EnumModerationActionTypeFieldUpdateOperationsInput | $Enums.ModerationActionType;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ModerationActionUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reportId?: Prisma.StringFieldUpdateOperationsInput | string;
    adminId?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.EnumModerationActionTypeFieldUpdateOperationsInput | $Enums.ModerationActionType;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ModerationActionListRelationFilter = {
    every?: Prisma.ModerationActionWhereInput;
    some?: Prisma.ModerationActionWhereInput;
    none?: Prisma.ModerationActionWhereInput;
};
export type ModerationActionOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ModerationActionCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    reportId?: Prisma.SortOrder;
    adminId?: Prisma.SortOrder;
    action?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    metadata?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ModerationActionMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    reportId?: Prisma.SortOrder;
    adminId?: Prisma.SortOrder;
    action?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ModerationActionMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    reportId?: Prisma.SortOrder;
    adminId?: Prisma.SortOrder;
    action?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ModerationActionCreateNestedManyWithoutAdminInput = {
    create?: Prisma.XOR<Prisma.ModerationActionCreateWithoutAdminInput, Prisma.ModerationActionUncheckedCreateWithoutAdminInput> | Prisma.ModerationActionCreateWithoutAdminInput[] | Prisma.ModerationActionUncheckedCreateWithoutAdminInput[];
    connectOrCreate?: Prisma.ModerationActionCreateOrConnectWithoutAdminInput | Prisma.ModerationActionCreateOrConnectWithoutAdminInput[];
    createMany?: Prisma.ModerationActionCreateManyAdminInputEnvelope;
    connect?: Prisma.ModerationActionWhereUniqueInput | Prisma.ModerationActionWhereUniqueInput[];
};
export type ModerationActionUncheckedCreateNestedManyWithoutAdminInput = {
    create?: Prisma.XOR<Prisma.ModerationActionCreateWithoutAdminInput, Prisma.ModerationActionUncheckedCreateWithoutAdminInput> | Prisma.ModerationActionCreateWithoutAdminInput[] | Prisma.ModerationActionUncheckedCreateWithoutAdminInput[];
    connectOrCreate?: Prisma.ModerationActionCreateOrConnectWithoutAdminInput | Prisma.ModerationActionCreateOrConnectWithoutAdminInput[];
    createMany?: Prisma.ModerationActionCreateManyAdminInputEnvelope;
    connect?: Prisma.ModerationActionWhereUniqueInput | Prisma.ModerationActionWhereUniqueInput[];
};
export type ModerationActionUpdateManyWithoutAdminNestedInput = {
    create?: Prisma.XOR<Prisma.ModerationActionCreateWithoutAdminInput, Prisma.ModerationActionUncheckedCreateWithoutAdminInput> | Prisma.ModerationActionCreateWithoutAdminInput[] | Prisma.ModerationActionUncheckedCreateWithoutAdminInput[];
    connectOrCreate?: Prisma.ModerationActionCreateOrConnectWithoutAdminInput | Prisma.ModerationActionCreateOrConnectWithoutAdminInput[];
    upsert?: Prisma.ModerationActionUpsertWithWhereUniqueWithoutAdminInput | Prisma.ModerationActionUpsertWithWhereUniqueWithoutAdminInput[];
    createMany?: Prisma.ModerationActionCreateManyAdminInputEnvelope;
    set?: Prisma.ModerationActionWhereUniqueInput | Prisma.ModerationActionWhereUniqueInput[];
    disconnect?: Prisma.ModerationActionWhereUniqueInput | Prisma.ModerationActionWhereUniqueInput[];
    delete?: Prisma.ModerationActionWhereUniqueInput | Prisma.ModerationActionWhereUniqueInput[];
    connect?: Prisma.ModerationActionWhereUniqueInput | Prisma.ModerationActionWhereUniqueInput[];
    update?: Prisma.ModerationActionUpdateWithWhereUniqueWithoutAdminInput | Prisma.ModerationActionUpdateWithWhereUniqueWithoutAdminInput[];
    updateMany?: Prisma.ModerationActionUpdateManyWithWhereWithoutAdminInput | Prisma.ModerationActionUpdateManyWithWhereWithoutAdminInput[];
    deleteMany?: Prisma.ModerationActionScalarWhereInput | Prisma.ModerationActionScalarWhereInput[];
};
export type ModerationActionUncheckedUpdateManyWithoutAdminNestedInput = {
    create?: Prisma.XOR<Prisma.ModerationActionCreateWithoutAdminInput, Prisma.ModerationActionUncheckedCreateWithoutAdminInput> | Prisma.ModerationActionCreateWithoutAdminInput[] | Prisma.ModerationActionUncheckedCreateWithoutAdminInput[];
    connectOrCreate?: Prisma.ModerationActionCreateOrConnectWithoutAdminInput | Prisma.ModerationActionCreateOrConnectWithoutAdminInput[];
    upsert?: Prisma.ModerationActionUpsertWithWhereUniqueWithoutAdminInput | Prisma.ModerationActionUpsertWithWhereUniqueWithoutAdminInput[];
    createMany?: Prisma.ModerationActionCreateManyAdminInputEnvelope;
    set?: Prisma.ModerationActionWhereUniqueInput | Prisma.ModerationActionWhereUniqueInput[];
    disconnect?: Prisma.ModerationActionWhereUniqueInput | Prisma.ModerationActionWhereUniqueInput[];
    delete?: Prisma.ModerationActionWhereUniqueInput | Prisma.ModerationActionWhereUniqueInput[];
    connect?: Prisma.ModerationActionWhereUniqueInput | Prisma.ModerationActionWhereUniqueInput[];
    update?: Prisma.ModerationActionUpdateWithWhereUniqueWithoutAdminInput | Prisma.ModerationActionUpdateWithWhereUniqueWithoutAdminInput[];
    updateMany?: Prisma.ModerationActionUpdateManyWithWhereWithoutAdminInput | Prisma.ModerationActionUpdateManyWithWhereWithoutAdminInput[];
    deleteMany?: Prisma.ModerationActionScalarWhereInput | Prisma.ModerationActionScalarWhereInput[];
};
export type ModerationActionCreateNestedManyWithoutReportInput = {
    create?: Prisma.XOR<Prisma.ModerationActionCreateWithoutReportInput, Prisma.ModerationActionUncheckedCreateWithoutReportInput> | Prisma.ModerationActionCreateWithoutReportInput[] | Prisma.ModerationActionUncheckedCreateWithoutReportInput[];
    connectOrCreate?: Prisma.ModerationActionCreateOrConnectWithoutReportInput | Prisma.ModerationActionCreateOrConnectWithoutReportInput[];
    createMany?: Prisma.ModerationActionCreateManyReportInputEnvelope;
    connect?: Prisma.ModerationActionWhereUniqueInput | Prisma.ModerationActionWhereUniqueInput[];
};
export type ModerationActionUncheckedCreateNestedManyWithoutReportInput = {
    create?: Prisma.XOR<Prisma.ModerationActionCreateWithoutReportInput, Prisma.ModerationActionUncheckedCreateWithoutReportInput> | Prisma.ModerationActionCreateWithoutReportInput[] | Prisma.ModerationActionUncheckedCreateWithoutReportInput[];
    connectOrCreate?: Prisma.ModerationActionCreateOrConnectWithoutReportInput | Prisma.ModerationActionCreateOrConnectWithoutReportInput[];
    createMany?: Prisma.ModerationActionCreateManyReportInputEnvelope;
    connect?: Prisma.ModerationActionWhereUniqueInput | Prisma.ModerationActionWhereUniqueInput[];
};
export type ModerationActionUpdateManyWithoutReportNestedInput = {
    create?: Prisma.XOR<Prisma.ModerationActionCreateWithoutReportInput, Prisma.ModerationActionUncheckedCreateWithoutReportInput> | Prisma.ModerationActionCreateWithoutReportInput[] | Prisma.ModerationActionUncheckedCreateWithoutReportInput[];
    connectOrCreate?: Prisma.ModerationActionCreateOrConnectWithoutReportInput | Prisma.ModerationActionCreateOrConnectWithoutReportInput[];
    upsert?: Prisma.ModerationActionUpsertWithWhereUniqueWithoutReportInput | Prisma.ModerationActionUpsertWithWhereUniqueWithoutReportInput[];
    createMany?: Prisma.ModerationActionCreateManyReportInputEnvelope;
    set?: Prisma.ModerationActionWhereUniqueInput | Prisma.ModerationActionWhereUniqueInput[];
    disconnect?: Prisma.ModerationActionWhereUniqueInput | Prisma.ModerationActionWhereUniqueInput[];
    delete?: Prisma.ModerationActionWhereUniqueInput | Prisma.ModerationActionWhereUniqueInput[];
    connect?: Prisma.ModerationActionWhereUniqueInput | Prisma.ModerationActionWhereUniqueInput[];
    update?: Prisma.ModerationActionUpdateWithWhereUniqueWithoutReportInput | Prisma.ModerationActionUpdateWithWhereUniqueWithoutReportInput[];
    updateMany?: Prisma.ModerationActionUpdateManyWithWhereWithoutReportInput | Prisma.ModerationActionUpdateManyWithWhereWithoutReportInput[];
    deleteMany?: Prisma.ModerationActionScalarWhereInput | Prisma.ModerationActionScalarWhereInput[];
};
export type ModerationActionUncheckedUpdateManyWithoutReportNestedInput = {
    create?: Prisma.XOR<Prisma.ModerationActionCreateWithoutReportInput, Prisma.ModerationActionUncheckedCreateWithoutReportInput> | Prisma.ModerationActionCreateWithoutReportInput[] | Prisma.ModerationActionUncheckedCreateWithoutReportInput[];
    connectOrCreate?: Prisma.ModerationActionCreateOrConnectWithoutReportInput | Prisma.ModerationActionCreateOrConnectWithoutReportInput[];
    upsert?: Prisma.ModerationActionUpsertWithWhereUniqueWithoutReportInput | Prisma.ModerationActionUpsertWithWhereUniqueWithoutReportInput[];
    createMany?: Prisma.ModerationActionCreateManyReportInputEnvelope;
    set?: Prisma.ModerationActionWhereUniqueInput | Prisma.ModerationActionWhereUniqueInput[];
    disconnect?: Prisma.ModerationActionWhereUniqueInput | Prisma.ModerationActionWhereUniqueInput[];
    delete?: Prisma.ModerationActionWhereUniqueInput | Prisma.ModerationActionWhereUniqueInput[];
    connect?: Prisma.ModerationActionWhereUniqueInput | Prisma.ModerationActionWhereUniqueInput[];
    update?: Prisma.ModerationActionUpdateWithWhereUniqueWithoutReportInput | Prisma.ModerationActionUpdateWithWhereUniqueWithoutReportInput[];
    updateMany?: Prisma.ModerationActionUpdateManyWithWhereWithoutReportInput | Prisma.ModerationActionUpdateManyWithWhereWithoutReportInput[];
    deleteMany?: Prisma.ModerationActionScalarWhereInput | Prisma.ModerationActionScalarWhereInput[];
};
export type EnumModerationActionTypeFieldUpdateOperationsInput = {
    set?: $Enums.ModerationActionType;
};
export type ModerationActionCreateWithoutAdminInput = {
    id?: string;
    action: $Enums.ModerationActionType;
    reason: string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    expiresAt?: Date | string | null;
    createdAt?: Date | string;
    report: Prisma.ReportCreateNestedOneWithoutActionsInput;
};
export type ModerationActionUncheckedCreateWithoutAdminInput = {
    id?: string;
    reportId: string;
    action: $Enums.ModerationActionType;
    reason: string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    expiresAt?: Date | string | null;
    createdAt?: Date | string;
};
export type ModerationActionCreateOrConnectWithoutAdminInput = {
    where: Prisma.ModerationActionWhereUniqueInput;
    create: Prisma.XOR<Prisma.ModerationActionCreateWithoutAdminInput, Prisma.ModerationActionUncheckedCreateWithoutAdminInput>;
};
export type ModerationActionCreateManyAdminInputEnvelope = {
    data: Prisma.ModerationActionCreateManyAdminInput | Prisma.ModerationActionCreateManyAdminInput[];
    skipDuplicates?: boolean;
};
export type ModerationActionUpsertWithWhereUniqueWithoutAdminInput = {
    where: Prisma.ModerationActionWhereUniqueInput;
    update: Prisma.XOR<Prisma.ModerationActionUpdateWithoutAdminInput, Prisma.ModerationActionUncheckedUpdateWithoutAdminInput>;
    create: Prisma.XOR<Prisma.ModerationActionCreateWithoutAdminInput, Prisma.ModerationActionUncheckedCreateWithoutAdminInput>;
};
export type ModerationActionUpdateWithWhereUniqueWithoutAdminInput = {
    where: Prisma.ModerationActionWhereUniqueInput;
    data: Prisma.XOR<Prisma.ModerationActionUpdateWithoutAdminInput, Prisma.ModerationActionUncheckedUpdateWithoutAdminInput>;
};
export type ModerationActionUpdateManyWithWhereWithoutAdminInput = {
    where: Prisma.ModerationActionScalarWhereInput;
    data: Prisma.XOR<Prisma.ModerationActionUpdateManyMutationInput, Prisma.ModerationActionUncheckedUpdateManyWithoutAdminInput>;
};
export type ModerationActionScalarWhereInput = {
    AND?: Prisma.ModerationActionScalarWhereInput | Prisma.ModerationActionScalarWhereInput[];
    OR?: Prisma.ModerationActionScalarWhereInput[];
    NOT?: Prisma.ModerationActionScalarWhereInput | Prisma.ModerationActionScalarWhereInput[];
    id?: Prisma.UuidFilter<"ModerationAction"> | string;
    reportId?: Prisma.UuidFilter<"ModerationAction"> | string;
    adminId?: Prisma.UuidFilter<"ModerationAction"> | string;
    action?: Prisma.EnumModerationActionTypeFilter<"ModerationAction"> | $Enums.ModerationActionType;
    reason?: Prisma.StringFilter<"ModerationAction"> | string;
    metadata?: Prisma.JsonNullableFilter<"ModerationAction">;
    expiresAt?: Prisma.DateTimeNullableFilter<"ModerationAction"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"ModerationAction"> | Date | string;
};
export type ModerationActionCreateWithoutReportInput = {
    id?: string;
    action: $Enums.ModerationActionType;
    reason: string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    expiresAt?: Date | string | null;
    createdAt?: Date | string;
    admin: Prisma.UserCreateNestedOneWithoutModerationActionsInput;
};
export type ModerationActionUncheckedCreateWithoutReportInput = {
    id?: string;
    adminId: string;
    action: $Enums.ModerationActionType;
    reason: string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    expiresAt?: Date | string | null;
    createdAt?: Date | string;
};
export type ModerationActionCreateOrConnectWithoutReportInput = {
    where: Prisma.ModerationActionWhereUniqueInput;
    create: Prisma.XOR<Prisma.ModerationActionCreateWithoutReportInput, Prisma.ModerationActionUncheckedCreateWithoutReportInput>;
};
export type ModerationActionCreateManyReportInputEnvelope = {
    data: Prisma.ModerationActionCreateManyReportInput | Prisma.ModerationActionCreateManyReportInput[];
    skipDuplicates?: boolean;
};
export type ModerationActionUpsertWithWhereUniqueWithoutReportInput = {
    where: Prisma.ModerationActionWhereUniqueInput;
    update: Prisma.XOR<Prisma.ModerationActionUpdateWithoutReportInput, Prisma.ModerationActionUncheckedUpdateWithoutReportInput>;
    create: Prisma.XOR<Prisma.ModerationActionCreateWithoutReportInput, Prisma.ModerationActionUncheckedCreateWithoutReportInput>;
};
export type ModerationActionUpdateWithWhereUniqueWithoutReportInput = {
    where: Prisma.ModerationActionWhereUniqueInput;
    data: Prisma.XOR<Prisma.ModerationActionUpdateWithoutReportInput, Prisma.ModerationActionUncheckedUpdateWithoutReportInput>;
};
export type ModerationActionUpdateManyWithWhereWithoutReportInput = {
    where: Prisma.ModerationActionScalarWhereInput;
    data: Prisma.XOR<Prisma.ModerationActionUpdateManyMutationInput, Prisma.ModerationActionUncheckedUpdateManyWithoutReportInput>;
};
export type ModerationActionCreateManyAdminInput = {
    id?: string;
    reportId: string;
    action: $Enums.ModerationActionType;
    reason: string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    expiresAt?: Date | string | null;
    createdAt?: Date | string;
};
export type ModerationActionUpdateWithoutAdminInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.EnumModerationActionTypeFieldUpdateOperationsInput | $Enums.ModerationActionType;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    report?: Prisma.ReportUpdateOneRequiredWithoutActionsNestedInput;
};
export type ModerationActionUncheckedUpdateWithoutAdminInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reportId?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.EnumModerationActionTypeFieldUpdateOperationsInput | $Enums.ModerationActionType;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ModerationActionUncheckedUpdateManyWithoutAdminInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reportId?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.EnumModerationActionTypeFieldUpdateOperationsInput | $Enums.ModerationActionType;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ModerationActionCreateManyReportInput = {
    id?: string;
    adminId: string;
    action: $Enums.ModerationActionType;
    reason: string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    expiresAt?: Date | string | null;
    createdAt?: Date | string;
};
export type ModerationActionUpdateWithoutReportInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.EnumModerationActionTypeFieldUpdateOperationsInput | $Enums.ModerationActionType;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    admin?: Prisma.UserUpdateOneRequiredWithoutModerationActionsNestedInput;
};
export type ModerationActionUncheckedUpdateWithoutReportInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    adminId?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.EnumModerationActionTypeFieldUpdateOperationsInput | $Enums.ModerationActionType;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ModerationActionUncheckedUpdateManyWithoutReportInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    adminId?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.EnumModerationActionTypeFieldUpdateOperationsInput | $Enums.ModerationActionType;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ModerationActionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    reportId?: boolean;
    adminId?: boolean;
    action?: boolean;
    reason?: boolean;
    metadata?: boolean;
    expiresAt?: boolean;
    createdAt?: boolean;
    report?: boolean | Prisma.ReportDefaultArgs<ExtArgs>;
    admin?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["moderationAction"]>;
export type ModerationActionSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    reportId?: boolean;
    adminId?: boolean;
    action?: boolean;
    reason?: boolean;
    metadata?: boolean;
    expiresAt?: boolean;
    createdAt?: boolean;
    report?: boolean | Prisma.ReportDefaultArgs<ExtArgs>;
    admin?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["moderationAction"]>;
export type ModerationActionSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    reportId?: boolean;
    adminId?: boolean;
    action?: boolean;
    reason?: boolean;
    metadata?: boolean;
    expiresAt?: boolean;
    createdAt?: boolean;
    report?: boolean | Prisma.ReportDefaultArgs<ExtArgs>;
    admin?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["moderationAction"]>;
export type ModerationActionSelectScalar = {
    id?: boolean;
    reportId?: boolean;
    adminId?: boolean;
    action?: boolean;
    reason?: boolean;
    metadata?: boolean;
    expiresAt?: boolean;
    createdAt?: boolean;
};
export type ModerationActionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "reportId" | "adminId" | "action" | "reason" | "metadata" | "expiresAt" | "createdAt", ExtArgs["result"]["moderationAction"]>;
export type ModerationActionInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    report?: boolean | Prisma.ReportDefaultArgs<ExtArgs>;
    admin?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type ModerationActionIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    report?: boolean | Prisma.ReportDefaultArgs<ExtArgs>;
    admin?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type ModerationActionIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    report?: boolean | Prisma.ReportDefaultArgs<ExtArgs>;
    admin?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $ModerationActionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ModerationAction";
    objects: {
        report: Prisma.$ReportPayload<ExtArgs>;
        admin: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        reportId: string;
        adminId: string;
        action: $Enums.ModerationActionType;
        reason: string;
        metadata: runtime.JsonValue | null;
        expiresAt: Date | null;
        createdAt: Date;
    }, ExtArgs["result"]["moderationAction"]>;
    composites: {};
};
export type ModerationActionGetPayload<S extends boolean | null | undefined | ModerationActionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ModerationActionPayload, S>;
export type ModerationActionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ModerationActionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ModerationActionCountAggregateInputType | true;
};
export interface ModerationActionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ModerationAction'];
        meta: {
            name: 'ModerationAction';
        };
    };
    findUnique<T extends ModerationActionFindUniqueArgs>(args: Prisma.SelectSubset<T, ModerationActionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ModerationActionClient<runtime.Types.Result.GetResult<Prisma.$ModerationActionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ModerationActionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ModerationActionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ModerationActionClient<runtime.Types.Result.GetResult<Prisma.$ModerationActionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ModerationActionFindFirstArgs>(args?: Prisma.SelectSubset<T, ModerationActionFindFirstArgs<ExtArgs>>): Prisma.Prisma__ModerationActionClient<runtime.Types.Result.GetResult<Prisma.$ModerationActionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ModerationActionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ModerationActionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ModerationActionClient<runtime.Types.Result.GetResult<Prisma.$ModerationActionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ModerationActionFindManyArgs>(args?: Prisma.SelectSubset<T, ModerationActionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ModerationActionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ModerationActionCreateArgs>(args: Prisma.SelectSubset<T, ModerationActionCreateArgs<ExtArgs>>): Prisma.Prisma__ModerationActionClient<runtime.Types.Result.GetResult<Prisma.$ModerationActionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ModerationActionCreateManyArgs>(args?: Prisma.SelectSubset<T, ModerationActionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ModerationActionCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ModerationActionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ModerationActionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ModerationActionDeleteArgs>(args: Prisma.SelectSubset<T, ModerationActionDeleteArgs<ExtArgs>>): Prisma.Prisma__ModerationActionClient<runtime.Types.Result.GetResult<Prisma.$ModerationActionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ModerationActionUpdateArgs>(args: Prisma.SelectSubset<T, ModerationActionUpdateArgs<ExtArgs>>): Prisma.Prisma__ModerationActionClient<runtime.Types.Result.GetResult<Prisma.$ModerationActionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ModerationActionDeleteManyArgs>(args?: Prisma.SelectSubset<T, ModerationActionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ModerationActionUpdateManyArgs>(args: Prisma.SelectSubset<T, ModerationActionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ModerationActionUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ModerationActionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ModerationActionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ModerationActionUpsertArgs>(args: Prisma.SelectSubset<T, ModerationActionUpsertArgs<ExtArgs>>): Prisma.Prisma__ModerationActionClient<runtime.Types.Result.GetResult<Prisma.$ModerationActionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ModerationActionCountArgs>(args?: Prisma.Subset<T, ModerationActionCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ModerationActionCountAggregateOutputType> : number>;
    aggregate<T extends ModerationActionAggregateArgs>(args: Prisma.Subset<T, ModerationActionAggregateArgs>): Prisma.PrismaPromise<GetModerationActionAggregateType<T>>;
    groupBy<T extends ModerationActionGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ModerationActionGroupByArgs['orderBy'];
    } : {
        orderBy?: ModerationActionGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ModerationActionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetModerationActionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ModerationActionFieldRefs;
}
export interface Prisma__ModerationActionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    report<T extends Prisma.ReportDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ReportDefaultArgs<ExtArgs>>): Prisma.Prisma__ReportClient<runtime.Types.Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    admin<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ModerationActionFieldRefs {
    readonly id: Prisma.FieldRef<"ModerationAction", 'String'>;
    readonly reportId: Prisma.FieldRef<"ModerationAction", 'String'>;
    readonly adminId: Prisma.FieldRef<"ModerationAction", 'String'>;
    readonly action: Prisma.FieldRef<"ModerationAction", 'ModerationActionType'>;
    readonly reason: Prisma.FieldRef<"ModerationAction", 'String'>;
    readonly metadata: Prisma.FieldRef<"ModerationAction", 'Json'>;
    readonly expiresAt: Prisma.FieldRef<"ModerationAction", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"ModerationAction", 'DateTime'>;
}
export type ModerationActionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModerationActionSelect<ExtArgs> | null;
    omit?: Prisma.ModerationActionOmit<ExtArgs> | null;
    include?: Prisma.ModerationActionInclude<ExtArgs> | null;
    where: Prisma.ModerationActionWhereUniqueInput;
};
export type ModerationActionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModerationActionSelect<ExtArgs> | null;
    omit?: Prisma.ModerationActionOmit<ExtArgs> | null;
    include?: Prisma.ModerationActionInclude<ExtArgs> | null;
    where: Prisma.ModerationActionWhereUniqueInput;
};
export type ModerationActionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ModerationActionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ModerationActionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ModerationActionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModerationActionSelect<ExtArgs> | null;
    omit?: Prisma.ModerationActionOmit<ExtArgs> | null;
    include?: Prisma.ModerationActionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ModerationActionCreateInput, Prisma.ModerationActionUncheckedCreateInput>;
};
export type ModerationActionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ModerationActionCreateManyInput | Prisma.ModerationActionCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ModerationActionCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModerationActionSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ModerationActionOmit<ExtArgs> | null;
    data: Prisma.ModerationActionCreateManyInput | Prisma.ModerationActionCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ModerationActionIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ModerationActionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModerationActionSelect<ExtArgs> | null;
    omit?: Prisma.ModerationActionOmit<ExtArgs> | null;
    include?: Prisma.ModerationActionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ModerationActionUpdateInput, Prisma.ModerationActionUncheckedUpdateInput>;
    where: Prisma.ModerationActionWhereUniqueInput;
};
export type ModerationActionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ModerationActionUpdateManyMutationInput, Prisma.ModerationActionUncheckedUpdateManyInput>;
    where?: Prisma.ModerationActionWhereInput;
    limit?: number;
};
export type ModerationActionUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModerationActionSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ModerationActionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ModerationActionUpdateManyMutationInput, Prisma.ModerationActionUncheckedUpdateManyInput>;
    where?: Prisma.ModerationActionWhereInput;
    limit?: number;
    include?: Prisma.ModerationActionIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ModerationActionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModerationActionSelect<ExtArgs> | null;
    omit?: Prisma.ModerationActionOmit<ExtArgs> | null;
    include?: Prisma.ModerationActionInclude<ExtArgs> | null;
    where: Prisma.ModerationActionWhereUniqueInput;
    create: Prisma.XOR<Prisma.ModerationActionCreateInput, Prisma.ModerationActionUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ModerationActionUpdateInput, Prisma.ModerationActionUncheckedUpdateInput>;
};
export type ModerationActionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModerationActionSelect<ExtArgs> | null;
    omit?: Prisma.ModerationActionOmit<ExtArgs> | null;
    include?: Prisma.ModerationActionInclude<ExtArgs> | null;
    where: Prisma.ModerationActionWhereUniqueInput;
};
export type ModerationActionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ModerationActionWhereInput;
    limit?: number;
};
export type ModerationActionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModerationActionSelect<ExtArgs> | null;
    omit?: Prisma.ModerationActionOmit<ExtArgs> | null;
    include?: Prisma.ModerationActionInclude<ExtArgs> | null;
};
