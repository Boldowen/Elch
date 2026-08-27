import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type IdempotencyKeyModel = runtime.Types.Result.DefaultSelection<Prisma.$IdempotencyKeyPayload>;
export type AggregateIdempotencyKey = {
    _count: IdempotencyKeyCountAggregateOutputType | null;
    _avg: IdempotencyKeyAvgAggregateOutputType | null;
    _sum: IdempotencyKeySumAggregateOutputType | null;
    _min: IdempotencyKeyMinAggregateOutputType | null;
    _max: IdempotencyKeyMaxAggregateOutputType | null;
};
export type IdempotencyKeyAvgAggregateOutputType = {
    statusCode: number | null;
};
export type IdempotencyKeySumAggregateOutputType = {
    statusCode: number | null;
};
export type IdempotencyKeyMinAggregateOutputType = {
    id: string | null;
    key: string | null;
    userId: string | null;
    requestHash: string | null;
    statusCode: number | null;
    expiresAt: Date | null;
    createdAt: Date | null;
};
export type IdempotencyKeyMaxAggregateOutputType = {
    id: string | null;
    key: string | null;
    userId: string | null;
    requestHash: string | null;
    statusCode: number | null;
    expiresAt: Date | null;
    createdAt: Date | null;
};
export type IdempotencyKeyCountAggregateOutputType = {
    id: number;
    key: number;
    userId: number;
    requestHash: number;
    responseBody: number;
    statusCode: number;
    expiresAt: number;
    createdAt: number;
    _all: number;
};
export type IdempotencyKeyAvgAggregateInputType = {
    statusCode?: true;
};
export type IdempotencyKeySumAggregateInputType = {
    statusCode?: true;
};
export type IdempotencyKeyMinAggregateInputType = {
    id?: true;
    key?: true;
    userId?: true;
    requestHash?: true;
    statusCode?: true;
    expiresAt?: true;
    createdAt?: true;
};
export type IdempotencyKeyMaxAggregateInputType = {
    id?: true;
    key?: true;
    userId?: true;
    requestHash?: true;
    statusCode?: true;
    expiresAt?: true;
    createdAt?: true;
};
export type IdempotencyKeyCountAggregateInputType = {
    id?: true;
    key?: true;
    userId?: true;
    requestHash?: true;
    responseBody?: true;
    statusCode?: true;
    expiresAt?: true;
    createdAt?: true;
    _all?: true;
};
export type IdempotencyKeyAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.IdempotencyKeyWhereInput;
    orderBy?: Prisma.IdempotencyKeyOrderByWithRelationInput | Prisma.IdempotencyKeyOrderByWithRelationInput[];
    cursor?: Prisma.IdempotencyKeyWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | IdempotencyKeyCountAggregateInputType;
    _avg?: IdempotencyKeyAvgAggregateInputType;
    _sum?: IdempotencyKeySumAggregateInputType;
    _min?: IdempotencyKeyMinAggregateInputType;
    _max?: IdempotencyKeyMaxAggregateInputType;
};
export type GetIdempotencyKeyAggregateType<T extends IdempotencyKeyAggregateArgs> = {
    [P in keyof T & keyof AggregateIdempotencyKey]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateIdempotencyKey[P]> : Prisma.GetScalarType<T[P], AggregateIdempotencyKey[P]>;
};
export type IdempotencyKeyGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.IdempotencyKeyWhereInput;
    orderBy?: Prisma.IdempotencyKeyOrderByWithAggregationInput | Prisma.IdempotencyKeyOrderByWithAggregationInput[];
    by: Prisma.IdempotencyKeyScalarFieldEnum[] | Prisma.IdempotencyKeyScalarFieldEnum;
    having?: Prisma.IdempotencyKeyScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: IdempotencyKeyCountAggregateInputType | true;
    _avg?: IdempotencyKeyAvgAggregateInputType;
    _sum?: IdempotencyKeySumAggregateInputType;
    _min?: IdempotencyKeyMinAggregateInputType;
    _max?: IdempotencyKeyMaxAggregateInputType;
};
export type IdempotencyKeyGroupByOutputType = {
    id: string;
    key: string;
    userId: string;
    requestHash: string;
    responseBody: runtime.JsonValue | null;
    statusCode: number | null;
    expiresAt: Date;
    createdAt: Date;
    _count: IdempotencyKeyCountAggregateOutputType | null;
    _avg: IdempotencyKeyAvgAggregateOutputType | null;
    _sum: IdempotencyKeySumAggregateOutputType | null;
    _min: IdempotencyKeyMinAggregateOutputType | null;
    _max: IdempotencyKeyMaxAggregateOutputType | null;
};
export type GetIdempotencyKeyGroupByPayload<T extends IdempotencyKeyGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<IdempotencyKeyGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof IdempotencyKeyGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], IdempotencyKeyGroupByOutputType[P]> : Prisma.GetScalarType<T[P], IdempotencyKeyGroupByOutputType[P]>;
}>>;
export type IdempotencyKeyWhereInput = {
    AND?: Prisma.IdempotencyKeyWhereInput | Prisma.IdempotencyKeyWhereInput[];
    OR?: Prisma.IdempotencyKeyWhereInput[];
    NOT?: Prisma.IdempotencyKeyWhereInput | Prisma.IdempotencyKeyWhereInput[];
    id?: Prisma.UuidFilter<"IdempotencyKey"> | string;
    key?: Prisma.UuidFilter<"IdempotencyKey"> | string;
    userId?: Prisma.UuidFilter<"IdempotencyKey"> | string;
    requestHash?: Prisma.StringFilter<"IdempotencyKey"> | string;
    responseBody?: Prisma.JsonNullableFilter<"IdempotencyKey">;
    statusCode?: Prisma.IntNullableFilter<"IdempotencyKey"> | number | null;
    expiresAt?: Prisma.DateTimeFilter<"IdempotencyKey"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"IdempotencyKey"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type IdempotencyKeyOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    requestHash?: Prisma.SortOrder;
    responseBody?: Prisma.SortOrderInput | Prisma.SortOrder;
    statusCode?: Prisma.SortOrderInput | Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type IdempotencyKeyWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    userId_key?: Prisma.IdempotencyKeyUserIdKeyCompoundUniqueInput;
    AND?: Prisma.IdempotencyKeyWhereInput | Prisma.IdempotencyKeyWhereInput[];
    OR?: Prisma.IdempotencyKeyWhereInput[];
    NOT?: Prisma.IdempotencyKeyWhereInput | Prisma.IdempotencyKeyWhereInput[];
    key?: Prisma.UuidFilter<"IdempotencyKey"> | string;
    userId?: Prisma.UuidFilter<"IdempotencyKey"> | string;
    requestHash?: Prisma.StringFilter<"IdempotencyKey"> | string;
    responseBody?: Prisma.JsonNullableFilter<"IdempotencyKey">;
    statusCode?: Prisma.IntNullableFilter<"IdempotencyKey"> | number | null;
    expiresAt?: Prisma.DateTimeFilter<"IdempotencyKey"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"IdempotencyKey"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "userId_key">;
export type IdempotencyKeyOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    requestHash?: Prisma.SortOrder;
    responseBody?: Prisma.SortOrderInput | Prisma.SortOrder;
    statusCode?: Prisma.SortOrderInput | Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.IdempotencyKeyCountOrderByAggregateInput;
    _avg?: Prisma.IdempotencyKeyAvgOrderByAggregateInput;
    _max?: Prisma.IdempotencyKeyMaxOrderByAggregateInput;
    _min?: Prisma.IdempotencyKeyMinOrderByAggregateInput;
    _sum?: Prisma.IdempotencyKeySumOrderByAggregateInput;
};
export type IdempotencyKeyScalarWhereWithAggregatesInput = {
    AND?: Prisma.IdempotencyKeyScalarWhereWithAggregatesInput | Prisma.IdempotencyKeyScalarWhereWithAggregatesInput[];
    OR?: Prisma.IdempotencyKeyScalarWhereWithAggregatesInput[];
    NOT?: Prisma.IdempotencyKeyScalarWhereWithAggregatesInput | Prisma.IdempotencyKeyScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"IdempotencyKey"> | string;
    key?: Prisma.UuidWithAggregatesFilter<"IdempotencyKey"> | string;
    userId?: Prisma.UuidWithAggregatesFilter<"IdempotencyKey"> | string;
    requestHash?: Prisma.StringWithAggregatesFilter<"IdempotencyKey"> | string;
    responseBody?: Prisma.JsonNullableWithAggregatesFilter<"IdempotencyKey">;
    statusCode?: Prisma.IntNullableWithAggregatesFilter<"IdempotencyKey"> | number | null;
    expiresAt?: Prisma.DateTimeWithAggregatesFilter<"IdempotencyKey"> | Date | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"IdempotencyKey"> | Date | string;
};
export type IdempotencyKeyCreateInput = {
    id?: string;
    key: string;
    requestHash: string;
    responseBody?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    statusCode?: number | null;
    expiresAt: Date | string;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutIdempotencyKeysInput;
};
export type IdempotencyKeyUncheckedCreateInput = {
    id?: string;
    key: string;
    userId: string;
    requestHash: string;
    responseBody?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    statusCode?: number | null;
    expiresAt: Date | string;
    createdAt?: Date | string;
};
export type IdempotencyKeyUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    requestHash?: Prisma.StringFieldUpdateOperationsInput | string;
    responseBody?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    statusCode?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutIdempotencyKeysNestedInput;
};
export type IdempotencyKeyUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    requestHash?: Prisma.StringFieldUpdateOperationsInput | string;
    responseBody?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    statusCode?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type IdempotencyKeyCreateManyInput = {
    id?: string;
    key: string;
    userId: string;
    requestHash: string;
    responseBody?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    statusCode?: number | null;
    expiresAt: Date | string;
    createdAt?: Date | string;
};
export type IdempotencyKeyUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    requestHash?: Prisma.StringFieldUpdateOperationsInput | string;
    responseBody?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    statusCode?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type IdempotencyKeyUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    requestHash?: Prisma.StringFieldUpdateOperationsInput | string;
    responseBody?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    statusCode?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type IdempotencyKeyListRelationFilter = {
    every?: Prisma.IdempotencyKeyWhereInput;
    some?: Prisma.IdempotencyKeyWhereInput;
    none?: Prisma.IdempotencyKeyWhereInput;
};
export type IdempotencyKeyOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type IdempotencyKeyUserIdKeyCompoundUniqueInput = {
    userId: string;
    key: string;
};
export type IdempotencyKeyCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    requestHash?: Prisma.SortOrder;
    responseBody?: Prisma.SortOrder;
    statusCode?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type IdempotencyKeyAvgOrderByAggregateInput = {
    statusCode?: Prisma.SortOrder;
};
export type IdempotencyKeyMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    requestHash?: Prisma.SortOrder;
    statusCode?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type IdempotencyKeyMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    requestHash?: Prisma.SortOrder;
    statusCode?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type IdempotencyKeySumOrderByAggregateInput = {
    statusCode?: Prisma.SortOrder;
};
export type IdempotencyKeyCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.IdempotencyKeyCreateWithoutUserInput, Prisma.IdempotencyKeyUncheckedCreateWithoutUserInput> | Prisma.IdempotencyKeyCreateWithoutUserInput[] | Prisma.IdempotencyKeyUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.IdempotencyKeyCreateOrConnectWithoutUserInput | Prisma.IdempotencyKeyCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.IdempotencyKeyCreateManyUserInputEnvelope;
    connect?: Prisma.IdempotencyKeyWhereUniqueInput | Prisma.IdempotencyKeyWhereUniqueInput[];
};
export type IdempotencyKeyUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.IdempotencyKeyCreateWithoutUserInput, Prisma.IdempotencyKeyUncheckedCreateWithoutUserInput> | Prisma.IdempotencyKeyCreateWithoutUserInput[] | Prisma.IdempotencyKeyUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.IdempotencyKeyCreateOrConnectWithoutUserInput | Prisma.IdempotencyKeyCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.IdempotencyKeyCreateManyUserInputEnvelope;
    connect?: Prisma.IdempotencyKeyWhereUniqueInput | Prisma.IdempotencyKeyWhereUniqueInput[];
};
export type IdempotencyKeyUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.IdempotencyKeyCreateWithoutUserInput, Prisma.IdempotencyKeyUncheckedCreateWithoutUserInput> | Prisma.IdempotencyKeyCreateWithoutUserInput[] | Prisma.IdempotencyKeyUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.IdempotencyKeyCreateOrConnectWithoutUserInput | Prisma.IdempotencyKeyCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.IdempotencyKeyUpsertWithWhereUniqueWithoutUserInput | Prisma.IdempotencyKeyUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.IdempotencyKeyCreateManyUserInputEnvelope;
    set?: Prisma.IdempotencyKeyWhereUniqueInput | Prisma.IdempotencyKeyWhereUniqueInput[];
    disconnect?: Prisma.IdempotencyKeyWhereUniqueInput | Prisma.IdempotencyKeyWhereUniqueInput[];
    delete?: Prisma.IdempotencyKeyWhereUniqueInput | Prisma.IdempotencyKeyWhereUniqueInput[];
    connect?: Prisma.IdempotencyKeyWhereUniqueInput | Prisma.IdempotencyKeyWhereUniqueInput[];
    update?: Prisma.IdempotencyKeyUpdateWithWhereUniqueWithoutUserInput | Prisma.IdempotencyKeyUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.IdempotencyKeyUpdateManyWithWhereWithoutUserInput | Prisma.IdempotencyKeyUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.IdempotencyKeyScalarWhereInput | Prisma.IdempotencyKeyScalarWhereInput[];
};
export type IdempotencyKeyUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.IdempotencyKeyCreateWithoutUserInput, Prisma.IdempotencyKeyUncheckedCreateWithoutUserInput> | Prisma.IdempotencyKeyCreateWithoutUserInput[] | Prisma.IdempotencyKeyUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.IdempotencyKeyCreateOrConnectWithoutUserInput | Prisma.IdempotencyKeyCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.IdempotencyKeyUpsertWithWhereUniqueWithoutUserInput | Prisma.IdempotencyKeyUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.IdempotencyKeyCreateManyUserInputEnvelope;
    set?: Prisma.IdempotencyKeyWhereUniqueInput | Prisma.IdempotencyKeyWhereUniqueInput[];
    disconnect?: Prisma.IdempotencyKeyWhereUniqueInput | Prisma.IdempotencyKeyWhereUniqueInput[];
    delete?: Prisma.IdempotencyKeyWhereUniqueInput | Prisma.IdempotencyKeyWhereUniqueInput[];
    connect?: Prisma.IdempotencyKeyWhereUniqueInput | Prisma.IdempotencyKeyWhereUniqueInput[];
    update?: Prisma.IdempotencyKeyUpdateWithWhereUniqueWithoutUserInput | Prisma.IdempotencyKeyUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.IdempotencyKeyUpdateManyWithWhereWithoutUserInput | Prisma.IdempotencyKeyUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.IdempotencyKeyScalarWhereInput | Prisma.IdempotencyKeyScalarWhereInput[];
};
export type IdempotencyKeyCreateWithoutUserInput = {
    id?: string;
    key: string;
    requestHash: string;
    responseBody?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    statusCode?: number | null;
    expiresAt: Date | string;
    createdAt?: Date | string;
};
export type IdempotencyKeyUncheckedCreateWithoutUserInput = {
    id?: string;
    key: string;
    requestHash: string;
    responseBody?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    statusCode?: number | null;
    expiresAt: Date | string;
    createdAt?: Date | string;
};
export type IdempotencyKeyCreateOrConnectWithoutUserInput = {
    where: Prisma.IdempotencyKeyWhereUniqueInput;
    create: Prisma.XOR<Prisma.IdempotencyKeyCreateWithoutUserInput, Prisma.IdempotencyKeyUncheckedCreateWithoutUserInput>;
};
export type IdempotencyKeyCreateManyUserInputEnvelope = {
    data: Prisma.IdempotencyKeyCreateManyUserInput | Prisma.IdempotencyKeyCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type IdempotencyKeyUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.IdempotencyKeyWhereUniqueInput;
    update: Prisma.XOR<Prisma.IdempotencyKeyUpdateWithoutUserInput, Prisma.IdempotencyKeyUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.IdempotencyKeyCreateWithoutUserInput, Prisma.IdempotencyKeyUncheckedCreateWithoutUserInput>;
};
export type IdempotencyKeyUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.IdempotencyKeyWhereUniqueInput;
    data: Prisma.XOR<Prisma.IdempotencyKeyUpdateWithoutUserInput, Prisma.IdempotencyKeyUncheckedUpdateWithoutUserInput>;
};
export type IdempotencyKeyUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.IdempotencyKeyScalarWhereInput;
    data: Prisma.XOR<Prisma.IdempotencyKeyUpdateManyMutationInput, Prisma.IdempotencyKeyUncheckedUpdateManyWithoutUserInput>;
};
export type IdempotencyKeyScalarWhereInput = {
    AND?: Prisma.IdempotencyKeyScalarWhereInput | Prisma.IdempotencyKeyScalarWhereInput[];
    OR?: Prisma.IdempotencyKeyScalarWhereInput[];
    NOT?: Prisma.IdempotencyKeyScalarWhereInput | Prisma.IdempotencyKeyScalarWhereInput[];
    id?: Prisma.UuidFilter<"IdempotencyKey"> | string;
    key?: Prisma.UuidFilter<"IdempotencyKey"> | string;
    userId?: Prisma.UuidFilter<"IdempotencyKey"> | string;
    requestHash?: Prisma.StringFilter<"IdempotencyKey"> | string;
    responseBody?: Prisma.JsonNullableFilter<"IdempotencyKey">;
    statusCode?: Prisma.IntNullableFilter<"IdempotencyKey"> | number | null;
    expiresAt?: Prisma.DateTimeFilter<"IdempotencyKey"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"IdempotencyKey"> | Date | string;
};
export type IdempotencyKeyCreateManyUserInput = {
    id?: string;
    key: string;
    requestHash: string;
    responseBody?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    statusCode?: number | null;
    expiresAt: Date | string;
    createdAt?: Date | string;
};
export type IdempotencyKeyUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    requestHash?: Prisma.StringFieldUpdateOperationsInput | string;
    responseBody?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    statusCode?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type IdempotencyKeyUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    requestHash?: Prisma.StringFieldUpdateOperationsInput | string;
    responseBody?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    statusCode?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type IdempotencyKeyUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    requestHash?: Prisma.StringFieldUpdateOperationsInput | string;
    responseBody?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    statusCode?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type IdempotencyKeySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    key?: boolean;
    userId?: boolean;
    requestHash?: boolean;
    responseBody?: boolean;
    statusCode?: boolean;
    expiresAt?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["idempotencyKey"]>;
export type IdempotencyKeySelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    key?: boolean;
    userId?: boolean;
    requestHash?: boolean;
    responseBody?: boolean;
    statusCode?: boolean;
    expiresAt?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["idempotencyKey"]>;
export type IdempotencyKeySelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    key?: boolean;
    userId?: boolean;
    requestHash?: boolean;
    responseBody?: boolean;
    statusCode?: boolean;
    expiresAt?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["idempotencyKey"]>;
export type IdempotencyKeySelectScalar = {
    id?: boolean;
    key?: boolean;
    userId?: boolean;
    requestHash?: boolean;
    responseBody?: boolean;
    statusCode?: boolean;
    expiresAt?: boolean;
    createdAt?: boolean;
};
export type IdempotencyKeyOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "key" | "userId" | "requestHash" | "responseBody" | "statusCode" | "expiresAt" | "createdAt", ExtArgs["result"]["idempotencyKey"]>;
export type IdempotencyKeyInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type IdempotencyKeyIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type IdempotencyKeyIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $IdempotencyKeyPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "IdempotencyKey";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        key: string;
        userId: string;
        requestHash: string;
        responseBody: runtime.JsonValue | null;
        statusCode: number | null;
        expiresAt: Date;
        createdAt: Date;
    }, ExtArgs["result"]["idempotencyKey"]>;
    composites: {};
};
export type IdempotencyKeyGetPayload<S extends boolean | null | undefined | IdempotencyKeyDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$IdempotencyKeyPayload, S>;
export type IdempotencyKeyCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<IdempotencyKeyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: IdempotencyKeyCountAggregateInputType | true;
};
export interface IdempotencyKeyDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['IdempotencyKey'];
        meta: {
            name: 'IdempotencyKey';
        };
    };
    findUnique<T extends IdempotencyKeyFindUniqueArgs>(args: Prisma.SelectSubset<T, IdempotencyKeyFindUniqueArgs<ExtArgs>>): Prisma.Prisma__IdempotencyKeyClient<runtime.Types.Result.GetResult<Prisma.$IdempotencyKeyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends IdempotencyKeyFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, IdempotencyKeyFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__IdempotencyKeyClient<runtime.Types.Result.GetResult<Prisma.$IdempotencyKeyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends IdempotencyKeyFindFirstArgs>(args?: Prisma.SelectSubset<T, IdempotencyKeyFindFirstArgs<ExtArgs>>): Prisma.Prisma__IdempotencyKeyClient<runtime.Types.Result.GetResult<Prisma.$IdempotencyKeyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends IdempotencyKeyFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, IdempotencyKeyFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__IdempotencyKeyClient<runtime.Types.Result.GetResult<Prisma.$IdempotencyKeyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends IdempotencyKeyFindManyArgs>(args?: Prisma.SelectSubset<T, IdempotencyKeyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$IdempotencyKeyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends IdempotencyKeyCreateArgs>(args: Prisma.SelectSubset<T, IdempotencyKeyCreateArgs<ExtArgs>>): Prisma.Prisma__IdempotencyKeyClient<runtime.Types.Result.GetResult<Prisma.$IdempotencyKeyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends IdempotencyKeyCreateManyArgs>(args?: Prisma.SelectSubset<T, IdempotencyKeyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends IdempotencyKeyCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, IdempotencyKeyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$IdempotencyKeyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends IdempotencyKeyDeleteArgs>(args: Prisma.SelectSubset<T, IdempotencyKeyDeleteArgs<ExtArgs>>): Prisma.Prisma__IdempotencyKeyClient<runtime.Types.Result.GetResult<Prisma.$IdempotencyKeyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends IdempotencyKeyUpdateArgs>(args: Prisma.SelectSubset<T, IdempotencyKeyUpdateArgs<ExtArgs>>): Prisma.Prisma__IdempotencyKeyClient<runtime.Types.Result.GetResult<Prisma.$IdempotencyKeyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends IdempotencyKeyDeleteManyArgs>(args?: Prisma.SelectSubset<T, IdempotencyKeyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends IdempotencyKeyUpdateManyArgs>(args: Prisma.SelectSubset<T, IdempotencyKeyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends IdempotencyKeyUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, IdempotencyKeyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$IdempotencyKeyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends IdempotencyKeyUpsertArgs>(args: Prisma.SelectSubset<T, IdempotencyKeyUpsertArgs<ExtArgs>>): Prisma.Prisma__IdempotencyKeyClient<runtime.Types.Result.GetResult<Prisma.$IdempotencyKeyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends IdempotencyKeyCountArgs>(args?: Prisma.Subset<T, IdempotencyKeyCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], IdempotencyKeyCountAggregateOutputType> : number>;
    aggregate<T extends IdempotencyKeyAggregateArgs>(args: Prisma.Subset<T, IdempotencyKeyAggregateArgs>): Prisma.PrismaPromise<GetIdempotencyKeyAggregateType<T>>;
    groupBy<T extends IdempotencyKeyGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: IdempotencyKeyGroupByArgs['orderBy'];
    } : {
        orderBy?: IdempotencyKeyGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, IdempotencyKeyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIdempotencyKeyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: IdempotencyKeyFieldRefs;
}
export interface Prisma__IdempotencyKeyClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface IdempotencyKeyFieldRefs {
    readonly id: Prisma.FieldRef<"IdempotencyKey", 'String'>;
    readonly key: Prisma.FieldRef<"IdempotencyKey", 'String'>;
    readonly userId: Prisma.FieldRef<"IdempotencyKey", 'String'>;
    readonly requestHash: Prisma.FieldRef<"IdempotencyKey", 'String'>;
    readonly responseBody: Prisma.FieldRef<"IdempotencyKey", 'Json'>;
    readonly statusCode: Prisma.FieldRef<"IdempotencyKey", 'Int'>;
    readonly expiresAt: Prisma.FieldRef<"IdempotencyKey", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"IdempotencyKey", 'DateTime'>;
}
export type IdempotencyKeyFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IdempotencyKeySelect<ExtArgs> | null;
    omit?: Prisma.IdempotencyKeyOmit<ExtArgs> | null;
    include?: Prisma.IdempotencyKeyInclude<ExtArgs> | null;
    where: Prisma.IdempotencyKeyWhereUniqueInput;
};
export type IdempotencyKeyFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IdempotencyKeySelect<ExtArgs> | null;
    omit?: Prisma.IdempotencyKeyOmit<ExtArgs> | null;
    include?: Prisma.IdempotencyKeyInclude<ExtArgs> | null;
    where: Prisma.IdempotencyKeyWhereUniqueInput;
};
export type IdempotencyKeyFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IdempotencyKeySelect<ExtArgs> | null;
    omit?: Prisma.IdempotencyKeyOmit<ExtArgs> | null;
    include?: Prisma.IdempotencyKeyInclude<ExtArgs> | null;
    where?: Prisma.IdempotencyKeyWhereInput;
    orderBy?: Prisma.IdempotencyKeyOrderByWithRelationInput | Prisma.IdempotencyKeyOrderByWithRelationInput[];
    cursor?: Prisma.IdempotencyKeyWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.IdempotencyKeyScalarFieldEnum | Prisma.IdempotencyKeyScalarFieldEnum[];
};
export type IdempotencyKeyFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IdempotencyKeySelect<ExtArgs> | null;
    omit?: Prisma.IdempotencyKeyOmit<ExtArgs> | null;
    include?: Prisma.IdempotencyKeyInclude<ExtArgs> | null;
    where?: Prisma.IdempotencyKeyWhereInput;
    orderBy?: Prisma.IdempotencyKeyOrderByWithRelationInput | Prisma.IdempotencyKeyOrderByWithRelationInput[];
    cursor?: Prisma.IdempotencyKeyWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.IdempotencyKeyScalarFieldEnum | Prisma.IdempotencyKeyScalarFieldEnum[];
};
export type IdempotencyKeyFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IdempotencyKeySelect<ExtArgs> | null;
    omit?: Prisma.IdempotencyKeyOmit<ExtArgs> | null;
    include?: Prisma.IdempotencyKeyInclude<ExtArgs> | null;
    where?: Prisma.IdempotencyKeyWhereInput;
    orderBy?: Prisma.IdempotencyKeyOrderByWithRelationInput | Prisma.IdempotencyKeyOrderByWithRelationInput[];
    cursor?: Prisma.IdempotencyKeyWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.IdempotencyKeyScalarFieldEnum | Prisma.IdempotencyKeyScalarFieldEnum[];
};
export type IdempotencyKeyCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IdempotencyKeySelect<ExtArgs> | null;
    omit?: Prisma.IdempotencyKeyOmit<ExtArgs> | null;
    include?: Prisma.IdempotencyKeyInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.IdempotencyKeyCreateInput, Prisma.IdempotencyKeyUncheckedCreateInput>;
};
export type IdempotencyKeyCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.IdempotencyKeyCreateManyInput | Prisma.IdempotencyKeyCreateManyInput[];
    skipDuplicates?: boolean;
};
export type IdempotencyKeyCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IdempotencyKeySelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.IdempotencyKeyOmit<ExtArgs> | null;
    data: Prisma.IdempotencyKeyCreateManyInput | Prisma.IdempotencyKeyCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.IdempotencyKeyIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type IdempotencyKeyUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IdempotencyKeySelect<ExtArgs> | null;
    omit?: Prisma.IdempotencyKeyOmit<ExtArgs> | null;
    include?: Prisma.IdempotencyKeyInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.IdempotencyKeyUpdateInput, Prisma.IdempotencyKeyUncheckedUpdateInput>;
    where: Prisma.IdempotencyKeyWhereUniqueInput;
};
export type IdempotencyKeyUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.IdempotencyKeyUpdateManyMutationInput, Prisma.IdempotencyKeyUncheckedUpdateManyInput>;
    where?: Prisma.IdempotencyKeyWhereInput;
    limit?: number;
};
export type IdempotencyKeyUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IdempotencyKeySelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.IdempotencyKeyOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.IdempotencyKeyUpdateManyMutationInput, Prisma.IdempotencyKeyUncheckedUpdateManyInput>;
    where?: Prisma.IdempotencyKeyWhereInput;
    limit?: number;
    include?: Prisma.IdempotencyKeyIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type IdempotencyKeyUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IdempotencyKeySelect<ExtArgs> | null;
    omit?: Prisma.IdempotencyKeyOmit<ExtArgs> | null;
    include?: Prisma.IdempotencyKeyInclude<ExtArgs> | null;
    where: Prisma.IdempotencyKeyWhereUniqueInput;
    create: Prisma.XOR<Prisma.IdempotencyKeyCreateInput, Prisma.IdempotencyKeyUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.IdempotencyKeyUpdateInput, Prisma.IdempotencyKeyUncheckedUpdateInput>;
};
export type IdempotencyKeyDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IdempotencyKeySelect<ExtArgs> | null;
    omit?: Prisma.IdempotencyKeyOmit<ExtArgs> | null;
    include?: Prisma.IdempotencyKeyInclude<ExtArgs> | null;
    where: Prisma.IdempotencyKeyWhereUniqueInput;
};
export type IdempotencyKeyDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.IdempotencyKeyWhereInput;
    limit?: number;
};
export type IdempotencyKeyDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IdempotencyKeySelect<ExtArgs> | null;
    omit?: Prisma.IdempotencyKeyOmit<ExtArgs> | null;
    include?: Prisma.IdempotencyKeyInclude<ExtArgs> | null;
};
