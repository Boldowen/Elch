import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type UserBlockModel = runtime.Types.Result.DefaultSelection<Prisma.$UserBlockPayload>;
export type AggregateUserBlock = {
    _count: UserBlockCountAggregateOutputType | null;
    _min: UserBlockMinAggregateOutputType | null;
    _max: UserBlockMaxAggregateOutputType | null;
};
export type UserBlockMinAggregateOutputType = {
    id: string | null;
    blockerId: string | null;
    blockedId: string | null;
    createdAt: Date | null;
};
export type UserBlockMaxAggregateOutputType = {
    id: string | null;
    blockerId: string | null;
    blockedId: string | null;
    createdAt: Date | null;
};
export type UserBlockCountAggregateOutputType = {
    id: number;
    blockerId: number;
    blockedId: number;
    createdAt: number;
    _all: number;
};
export type UserBlockMinAggregateInputType = {
    id?: true;
    blockerId?: true;
    blockedId?: true;
    createdAt?: true;
};
export type UserBlockMaxAggregateInputType = {
    id?: true;
    blockerId?: true;
    blockedId?: true;
    createdAt?: true;
};
export type UserBlockCountAggregateInputType = {
    id?: true;
    blockerId?: true;
    blockedId?: true;
    createdAt?: true;
    _all?: true;
};
export type UserBlockAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserBlockWhereInput;
    orderBy?: Prisma.UserBlockOrderByWithRelationInput | Prisma.UserBlockOrderByWithRelationInput[];
    cursor?: Prisma.UserBlockWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | UserBlockCountAggregateInputType;
    _min?: UserBlockMinAggregateInputType;
    _max?: UserBlockMaxAggregateInputType;
};
export type GetUserBlockAggregateType<T extends UserBlockAggregateArgs> = {
    [P in keyof T & keyof AggregateUserBlock]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUserBlock[P]> : Prisma.GetScalarType<T[P], AggregateUserBlock[P]>;
};
export type UserBlockGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserBlockWhereInput;
    orderBy?: Prisma.UserBlockOrderByWithAggregationInput | Prisma.UserBlockOrderByWithAggregationInput[];
    by: Prisma.UserBlockScalarFieldEnum[] | Prisma.UserBlockScalarFieldEnum;
    having?: Prisma.UserBlockScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserBlockCountAggregateInputType | true;
    _min?: UserBlockMinAggregateInputType;
    _max?: UserBlockMaxAggregateInputType;
};
export type UserBlockGroupByOutputType = {
    id: string;
    blockerId: string;
    blockedId: string;
    createdAt: Date;
    _count: UserBlockCountAggregateOutputType | null;
    _min: UserBlockMinAggregateOutputType | null;
    _max: UserBlockMaxAggregateOutputType | null;
};
export type GetUserBlockGroupByPayload<T extends UserBlockGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UserBlockGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UserBlockGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UserBlockGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UserBlockGroupByOutputType[P]>;
}>>;
export type UserBlockWhereInput = {
    AND?: Prisma.UserBlockWhereInput | Prisma.UserBlockWhereInput[];
    OR?: Prisma.UserBlockWhereInput[];
    NOT?: Prisma.UserBlockWhereInput | Prisma.UserBlockWhereInput[];
    id?: Prisma.UuidFilter<"UserBlock"> | string;
    blockerId?: Prisma.UuidFilter<"UserBlock"> | string;
    blockedId?: Prisma.UuidFilter<"UserBlock"> | string;
    createdAt?: Prisma.DateTimeFilter<"UserBlock"> | Date | string;
    blocker?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    blocked?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type UserBlockOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    blockerId?: Prisma.SortOrder;
    blockedId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    blocker?: Prisma.UserOrderByWithRelationInput;
    blocked?: Prisma.UserOrderByWithRelationInput;
};
export type UserBlockWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    blockerId_blockedId?: Prisma.UserBlockBlockerIdBlockedIdCompoundUniqueInput;
    AND?: Prisma.UserBlockWhereInput | Prisma.UserBlockWhereInput[];
    OR?: Prisma.UserBlockWhereInput[];
    NOT?: Prisma.UserBlockWhereInput | Prisma.UserBlockWhereInput[];
    blockerId?: Prisma.UuidFilter<"UserBlock"> | string;
    blockedId?: Prisma.UuidFilter<"UserBlock"> | string;
    createdAt?: Prisma.DateTimeFilter<"UserBlock"> | Date | string;
    blocker?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    blocked?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "blockerId_blockedId">;
export type UserBlockOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    blockerId?: Prisma.SortOrder;
    blockedId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.UserBlockCountOrderByAggregateInput;
    _max?: Prisma.UserBlockMaxOrderByAggregateInput;
    _min?: Prisma.UserBlockMinOrderByAggregateInput;
};
export type UserBlockScalarWhereWithAggregatesInput = {
    AND?: Prisma.UserBlockScalarWhereWithAggregatesInput | Prisma.UserBlockScalarWhereWithAggregatesInput[];
    OR?: Prisma.UserBlockScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UserBlockScalarWhereWithAggregatesInput | Prisma.UserBlockScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"UserBlock"> | string;
    blockerId?: Prisma.UuidWithAggregatesFilter<"UserBlock"> | string;
    blockedId?: Prisma.UuidWithAggregatesFilter<"UserBlock"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"UserBlock"> | Date | string;
};
export type UserBlockCreateInput = {
    id?: string;
    createdAt?: Date | string;
    blocker: Prisma.UserCreateNestedOneWithoutBlocksCreatedInput;
    blocked: Prisma.UserCreateNestedOneWithoutBlocksReceivedInput;
};
export type UserBlockUncheckedCreateInput = {
    id?: string;
    blockerId: string;
    blockedId: string;
    createdAt?: Date | string;
};
export type UserBlockUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    blocker?: Prisma.UserUpdateOneRequiredWithoutBlocksCreatedNestedInput;
    blocked?: Prisma.UserUpdateOneRequiredWithoutBlocksReceivedNestedInput;
};
export type UserBlockUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    blockerId?: Prisma.StringFieldUpdateOperationsInput | string;
    blockedId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserBlockCreateManyInput = {
    id?: string;
    blockerId: string;
    blockedId: string;
    createdAt?: Date | string;
};
export type UserBlockUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserBlockUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    blockerId?: Prisma.StringFieldUpdateOperationsInput | string;
    blockedId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserBlockListRelationFilter = {
    every?: Prisma.UserBlockWhereInput;
    some?: Prisma.UserBlockWhereInput;
    none?: Prisma.UserBlockWhereInput;
};
export type UserBlockOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type UserBlockBlockerIdBlockedIdCompoundUniqueInput = {
    blockerId: string;
    blockedId: string;
};
export type UserBlockCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    blockerId?: Prisma.SortOrder;
    blockedId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type UserBlockMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    blockerId?: Prisma.SortOrder;
    blockedId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type UserBlockMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    blockerId?: Prisma.SortOrder;
    blockedId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type UserBlockCreateNestedManyWithoutBlockerInput = {
    create?: Prisma.XOR<Prisma.UserBlockCreateWithoutBlockerInput, Prisma.UserBlockUncheckedCreateWithoutBlockerInput> | Prisma.UserBlockCreateWithoutBlockerInput[] | Prisma.UserBlockUncheckedCreateWithoutBlockerInput[];
    connectOrCreate?: Prisma.UserBlockCreateOrConnectWithoutBlockerInput | Prisma.UserBlockCreateOrConnectWithoutBlockerInput[];
    createMany?: Prisma.UserBlockCreateManyBlockerInputEnvelope;
    connect?: Prisma.UserBlockWhereUniqueInput | Prisma.UserBlockWhereUniqueInput[];
};
export type UserBlockCreateNestedManyWithoutBlockedInput = {
    create?: Prisma.XOR<Prisma.UserBlockCreateWithoutBlockedInput, Prisma.UserBlockUncheckedCreateWithoutBlockedInput> | Prisma.UserBlockCreateWithoutBlockedInput[] | Prisma.UserBlockUncheckedCreateWithoutBlockedInput[];
    connectOrCreate?: Prisma.UserBlockCreateOrConnectWithoutBlockedInput | Prisma.UserBlockCreateOrConnectWithoutBlockedInput[];
    createMany?: Prisma.UserBlockCreateManyBlockedInputEnvelope;
    connect?: Prisma.UserBlockWhereUniqueInput | Prisma.UserBlockWhereUniqueInput[];
};
export type UserBlockUncheckedCreateNestedManyWithoutBlockerInput = {
    create?: Prisma.XOR<Prisma.UserBlockCreateWithoutBlockerInput, Prisma.UserBlockUncheckedCreateWithoutBlockerInput> | Prisma.UserBlockCreateWithoutBlockerInput[] | Prisma.UserBlockUncheckedCreateWithoutBlockerInput[];
    connectOrCreate?: Prisma.UserBlockCreateOrConnectWithoutBlockerInput | Prisma.UserBlockCreateOrConnectWithoutBlockerInput[];
    createMany?: Prisma.UserBlockCreateManyBlockerInputEnvelope;
    connect?: Prisma.UserBlockWhereUniqueInput | Prisma.UserBlockWhereUniqueInput[];
};
export type UserBlockUncheckedCreateNestedManyWithoutBlockedInput = {
    create?: Prisma.XOR<Prisma.UserBlockCreateWithoutBlockedInput, Prisma.UserBlockUncheckedCreateWithoutBlockedInput> | Prisma.UserBlockCreateWithoutBlockedInput[] | Prisma.UserBlockUncheckedCreateWithoutBlockedInput[];
    connectOrCreate?: Prisma.UserBlockCreateOrConnectWithoutBlockedInput | Prisma.UserBlockCreateOrConnectWithoutBlockedInput[];
    createMany?: Prisma.UserBlockCreateManyBlockedInputEnvelope;
    connect?: Prisma.UserBlockWhereUniqueInput | Prisma.UserBlockWhereUniqueInput[];
};
export type UserBlockUpdateManyWithoutBlockerNestedInput = {
    create?: Prisma.XOR<Prisma.UserBlockCreateWithoutBlockerInput, Prisma.UserBlockUncheckedCreateWithoutBlockerInput> | Prisma.UserBlockCreateWithoutBlockerInput[] | Prisma.UserBlockUncheckedCreateWithoutBlockerInput[];
    connectOrCreate?: Prisma.UserBlockCreateOrConnectWithoutBlockerInput | Prisma.UserBlockCreateOrConnectWithoutBlockerInput[];
    upsert?: Prisma.UserBlockUpsertWithWhereUniqueWithoutBlockerInput | Prisma.UserBlockUpsertWithWhereUniqueWithoutBlockerInput[];
    createMany?: Prisma.UserBlockCreateManyBlockerInputEnvelope;
    set?: Prisma.UserBlockWhereUniqueInput | Prisma.UserBlockWhereUniqueInput[];
    disconnect?: Prisma.UserBlockWhereUniqueInput | Prisma.UserBlockWhereUniqueInput[];
    delete?: Prisma.UserBlockWhereUniqueInput | Prisma.UserBlockWhereUniqueInput[];
    connect?: Prisma.UserBlockWhereUniqueInput | Prisma.UserBlockWhereUniqueInput[];
    update?: Prisma.UserBlockUpdateWithWhereUniqueWithoutBlockerInput | Prisma.UserBlockUpdateWithWhereUniqueWithoutBlockerInput[];
    updateMany?: Prisma.UserBlockUpdateManyWithWhereWithoutBlockerInput | Prisma.UserBlockUpdateManyWithWhereWithoutBlockerInput[];
    deleteMany?: Prisma.UserBlockScalarWhereInput | Prisma.UserBlockScalarWhereInput[];
};
export type UserBlockUpdateManyWithoutBlockedNestedInput = {
    create?: Prisma.XOR<Prisma.UserBlockCreateWithoutBlockedInput, Prisma.UserBlockUncheckedCreateWithoutBlockedInput> | Prisma.UserBlockCreateWithoutBlockedInput[] | Prisma.UserBlockUncheckedCreateWithoutBlockedInput[];
    connectOrCreate?: Prisma.UserBlockCreateOrConnectWithoutBlockedInput | Prisma.UserBlockCreateOrConnectWithoutBlockedInput[];
    upsert?: Prisma.UserBlockUpsertWithWhereUniqueWithoutBlockedInput | Prisma.UserBlockUpsertWithWhereUniqueWithoutBlockedInput[];
    createMany?: Prisma.UserBlockCreateManyBlockedInputEnvelope;
    set?: Prisma.UserBlockWhereUniqueInput | Prisma.UserBlockWhereUniqueInput[];
    disconnect?: Prisma.UserBlockWhereUniqueInput | Prisma.UserBlockWhereUniqueInput[];
    delete?: Prisma.UserBlockWhereUniqueInput | Prisma.UserBlockWhereUniqueInput[];
    connect?: Prisma.UserBlockWhereUniqueInput | Prisma.UserBlockWhereUniqueInput[];
    update?: Prisma.UserBlockUpdateWithWhereUniqueWithoutBlockedInput | Prisma.UserBlockUpdateWithWhereUniqueWithoutBlockedInput[];
    updateMany?: Prisma.UserBlockUpdateManyWithWhereWithoutBlockedInput | Prisma.UserBlockUpdateManyWithWhereWithoutBlockedInput[];
    deleteMany?: Prisma.UserBlockScalarWhereInput | Prisma.UserBlockScalarWhereInput[];
};
export type UserBlockUncheckedUpdateManyWithoutBlockerNestedInput = {
    create?: Prisma.XOR<Prisma.UserBlockCreateWithoutBlockerInput, Prisma.UserBlockUncheckedCreateWithoutBlockerInput> | Prisma.UserBlockCreateWithoutBlockerInput[] | Prisma.UserBlockUncheckedCreateWithoutBlockerInput[];
    connectOrCreate?: Prisma.UserBlockCreateOrConnectWithoutBlockerInput | Prisma.UserBlockCreateOrConnectWithoutBlockerInput[];
    upsert?: Prisma.UserBlockUpsertWithWhereUniqueWithoutBlockerInput | Prisma.UserBlockUpsertWithWhereUniqueWithoutBlockerInput[];
    createMany?: Prisma.UserBlockCreateManyBlockerInputEnvelope;
    set?: Prisma.UserBlockWhereUniqueInput | Prisma.UserBlockWhereUniqueInput[];
    disconnect?: Prisma.UserBlockWhereUniqueInput | Prisma.UserBlockWhereUniqueInput[];
    delete?: Prisma.UserBlockWhereUniqueInput | Prisma.UserBlockWhereUniqueInput[];
    connect?: Prisma.UserBlockWhereUniqueInput | Prisma.UserBlockWhereUniqueInput[];
    update?: Prisma.UserBlockUpdateWithWhereUniqueWithoutBlockerInput | Prisma.UserBlockUpdateWithWhereUniqueWithoutBlockerInput[];
    updateMany?: Prisma.UserBlockUpdateManyWithWhereWithoutBlockerInput | Prisma.UserBlockUpdateManyWithWhereWithoutBlockerInput[];
    deleteMany?: Prisma.UserBlockScalarWhereInput | Prisma.UserBlockScalarWhereInput[];
};
export type UserBlockUncheckedUpdateManyWithoutBlockedNestedInput = {
    create?: Prisma.XOR<Prisma.UserBlockCreateWithoutBlockedInput, Prisma.UserBlockUncheckedCreateWithoutBlockedInput> | Prisma.UserBlockCreateWithoutBlockedInput[] | Prisma.UserBlockUncheckedCreateWithoutBlockedInput[];
    connectOrCreate?: Prisma.UserBlockCreateOrConnectWithoutBlockedInput | Prisma.UserBlockCreateOrConnectWithoutBlockedInput[];
    upsert?: Prisma.UserBlockUpsertWithWhereUniqueWithoutBlockedInput | Prisma.UserBlockUpsertWithWhereUniqueWithoutBlockedInput[];
    createMany?: Prisma.UserBlockCreateManyBlockedInputEnvelope;
    set?: Prisma.UserBlockWhereUniqueInput | Prisma.UserBlockWhereUniqueInput[];
    disconnect?: Prisma.UserBlockWhereUniqueInput | Prisma.UserBlockWhereUniqueInput[];
    delete?: Prisma.UserBlockWhereUniqueInput | Prisma.UserBlockWhereUniqueInput[];
    connect?: Prisma.UserBlockWhereUniqueInput | Prisma.UserBlockWhereUniqueInput[];
    update?: Prisma.UserBlockUpdateWithWhereUniqueWithoutBlockedInput | Prisma.UserBlockUpdateWithWhereUniqueWithoutBlockedInput[];
    updateMany?: Prisma.UserBlockUpdateManyWithWhereWithoutBlockedInput | Prisma.UserBlockUpdateManyWithWhereWithoutBlockedInput[];
    deleteMany?: Prisma.UserBlockScalarWhereInput | Prisma.UserBlockScalarWhereInput[];
};
export type UserBlockCreateWithoutBlockerInput = {
    id?: string;
    createdAt?: Date | string;
    blocked: Prisma.UserCreateNestedOneWithoutBlocksReceivedInput;
};
export type UserBlockUncheckedCreateWithoutBlockerInput = {
    id?: string;
    blockedId: string;
    createdAt?: Date | string;
};
export type UserBlockCreateOrConnectWithoutBlockerInput = {
    where: Prisma.UserBlockWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserBlockCreateWithoutBlockerInput, Prisma.UserBlockUncheckedCreateWithoutBlockerInput>;
};
export type UserBlockCreateManyBlockerInputEnvelope = {
    data: Prisma.UserBlockCreateManyBlockerInput | Prisma.UserBlockCreateManyBlockerInput[];
    skipDuplicates?: boolean;
};
export type UserBlockCreateWithoutBlockedInput = {
    id?: string;
    createdAt?: Date | string;
    blocker: Prisma.UserCreateNestedOneWithoutBlocksCreatedInput;
};
export type UserBlockUncheckedCreateWithoutBlockedInput = {
    id?: string;
    blockerId: string;
    createdAt?: Date | string;
};
export type UserBlockCreateOrConnectWithoutBlockedInput = {
    where: Prisma.UserBlockWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserBlockCreateWithoutBlockedInput, Prisma.UserBlockUncheckedCreateWithoutBlockedInput>;
};
export type UserBlockCreateManyBlockedInputEnvelope = {
    data: Prisma.UserBlockCreateManyBlockedInput | Prisma.UserBlockCreateManyBlockedInput[];
    skipDuplicates?: boolean;
};
export type UserBlockUpsertWithWhereUniqueWithoutBlockerInput = {
    where: Prisma.UserBlockWhereUniqueInput;
    update: Prisma.XOR<Prisma.UserBlockUpdateWithoutBlockerInput, Prisma.UserBlockUncheckedUpdateWithoutBlockerInput>;
    create: Prisma.XOR<Prisma.UserBlockCreateWithoutBlockerInput, Prisma.UserBlockUncheckedCreateWithoutBlockerInput>;
};
export type UserBlockUpdateWithWhereUniqueWithoutBlockerInput = {
    where: Prisma.UserBlockWhereUniqueInput;
    data: Prisma.XOR<Prisma.UserBlockUpdateWithoutBlockerInput, Prisma.UserBlockUncheckedUpdateWithoutBlockerInput>;
};
export type UserBlockUpdateManyWithWhereWithoutBlockerInput = {
    where: Prisma.UserBlockScalarWhereInput;
    data: Prisma.XOR<Prisma.UserBlockUpdateManyMutationInput, Prisma.UserBlockUncheckedUpdateManyWithoutBlockerInput>;
};
export type UserBlockScalarWhereInput = {
    AND?: Prisma.UserBlockScalarWhereInput | Prisma.UserBlockScalarWhereInput[];
    OR?: Prisma.UserBlockScalarWhereInput[];
    NOT?: Prisma.UserBlockScalarWhereInput | Prisma.UserBlockScalarWhereInput[];
    id?: Prisma.UuidFilter<"UserBlock"> | string;
    blockerId?: Prisma.UuidFilter<"UserBlock"> | string;
    blockedId?: Prisma.UuidFilter<"UserBlock"> | string;
    createdAt?: Prisma.DateTimeFilter<"UserBlock"> | Date | string;
};
export type UserBlockUpsertWithWhereUniqueWithoutBlockedInput = {
    where: Prisma.UserBlockWhereUniqueInput;
    update: Prisma.XOR<Prisma.UserBlockUpdateWithoutBlockedInput, Prisma.UserBlockUncheckedUpdateWithoutBlockedInput>;
    create: Prisma.XOR<Prisma.UserBlockCreateWithoutBlockedInput, Prisma.UserBlockUncheckedCreateWithoutBlockedInput>;
};
export type UserBlockUpdateWithWhereUniqueWithoutBlockedInput = {
    where: Prisma.UserBlockWhereUniqueInput;
    data: Prisma.XOR<Prisma.UserBlockUpdateWithoutBlockedInput, Prisma.UserBlockUncheckedUpdateWithoutBlockedInput>;
};
export type UserBlockUpdateManyWithWhereWithoutBlockedInput = {
    where: Prisma.UserBlockScalarWhereInput;
    data: Prisma.XOR<Prisma.UserBlockUpdateManyMutationInput, Prisma.UserBlockUncheckedUpdateManyWithoutBlockedInput>;
};
export type UserBlockCreateManyBlockerInput = {
    id?: string;
    blockedId: string;
    createdAt?: Date | string;
};
export type UserBlockCreateManyBlockedInput = {
    id?: string;
    blockerId: string;
    createdAt?: Date | string;
};
export type UserBlockUpdateWithoutBlockerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    blocked?: Prisma.UserUpdateOneRequiredWithoutBlocksReceivedNestedInput;
};
export type UserBlockUncheckedUpdateWithoutBlockerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    blockedId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserBlockUncheckedUpdateManyWithoutBlockerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    blockedId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserBlockUpdateWithoutBlockedInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    blocker?: Prisma.UserUpdateOneRequiredWithoutBlocksCreatedNestedInput;
};
export type UserBlockUncheckedUpdateWithoutBlockedInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    blockerId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserBlockUncheckedUpdateManyWithoutBlockedInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    blockerId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserBlockSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    blockerId?: boolean;
    blockedId?: boolean;
    createdAt?: boolean;
    blocker?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    blocked?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userBlock"]>;
export type UserBlockSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    blockerId?: boolean;
    blockedId?: boolean;
    createdAt?: boolean;
    blocker?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    blocked?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userBlock"]>;
export type UserBlockSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    blockerId?: boolean;
    blockedId?: boolean;
    createdAt?: boolean;
    blocker?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    blocked?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userBlock"]>;
export type UserBlockSelectScalar = {
    id?: boolean;
    blockerId?: boolean;
    blockedId?: boolean;
    createdAt?: boolean;
};
export type UserBlockOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "blockerId" | "blockedId" | "createdAt", ExtArgs["result"]["userBlock"]>;
export type UserBlockInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    blocker?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    blocked?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type UserBlockIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    blocker?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    blocked?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type UserBlockIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    blocker?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    blocked?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $UserBlockPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "UserBlock";
    objects: {
        blocker: Prisma.$UserPayload<ExtArgs>;
        blocked: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        blockerId: string;
        blockedId: string;
        createdAt: Date;
    }, ExtArgs["result"]["userBlock"]>;
    composites: {};
};
export type UserBlockGetPayload<S extends boolean | null | undefined | UserBlockDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserBlockPayload, S>;
export type UserBlockCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<UserBlockFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserBlockCountAggregateInputType | true;
};
export interface UserBlockDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['UserBlock'];
        meta: {
            name: 'UserBlock';
        };
    };
    findUnique<T extends UserBlockFindUniqueArgs>(args: Prisma.SelectSubset<T, UserBlockFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UserBlockClient<runtime.Types.Result.GetResult<Prisma.$UserBlockPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends UserBlockFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UserBlockFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserBlockClient<runtime.Types.Result.GetResult<Prisma.$UserBlockPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends UserBlockFindFirstArgs>(args?: Prisma.SelectSubset<T, UserBlockFindFirstArgs<ExtArgs>>): Prisma.Prisma__UserBlockClient<runtime.Types.Result.GetResult<Prisma.$UserBlockPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends UserBlockFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UserBlockFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserBlockClient<runtime.Types.Result.GetResult<Prisma.$UserBlockPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends UserBlockFindManyArgs>(args?: Prisma.SelectSubset<T, UserBlockFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserBlockPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends UserBlockCreateArgs>(args: Prisma.SelectSubset<T, UserBlockCreateArgs<ExtArgs>>): Prisma.Prisma__UserBlockClient<runtime.Types.Result.GetResult<Prisma.$UserBlockPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends UserBlockCreateManyArgs>(args?: Prisma.SelectSubset<T, UserBlockCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends UserBlockCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, UserBlockCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserBlockPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends UserBlockDeleteArgs>(args: Prisma.SelectSubset<T, UserBlockDeleteArgs<ExtArgs>>): Prisma.Prisma__UserBlockClient<runtime.Types.Result.GetResult<Prisma.$UserBlockPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends UserBlockUpdateArgs>(args: Prisma.SelectSubset<T, UserBlockUpdateArgs<ExtArgs>>): Prisma.Prisma__UserBlockClient<runtime.Types.Result.GetResult<Prisma.$UserBlockPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends UserBlockDeleteManyArgs>(args?: Prisma.SelectSubset<T, UserBlockDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends UserBlockUpdateManyArgs>(args: Prisma.SelectSubset<T, UserBlockUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends UserBlockUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, UserBlockUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserBlockPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends UserBlockUpsertArgs>(args: Prisma.SelectSubset<T, UserBlockUpsertArgs<ExtArgs>>): Prisma.Prisma__UserBlockClient<runtime.Types.Result.GetResult<Prisma.$UserBlockPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends UserBlockCountArgs>(args?: Prisma.Subset<T, UserBlockCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UserBlockCountAggregateOutputType> : number>;
    aggregate<T extends UserBlockAggregateArgs>(args: Prisma.Subset<T, UserBlockAggregateArgs>): Prisma.PrismaPromise<GetUserBlockAggregateType<T>>;
    groupBy<T extends UserBlockGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: UserBlockGroupByArgs['orderBy'];
    } : {
        orderBy?: UserBlockGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, UserBlockGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserBlockGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: UserBlockFieldRefs;
}
export interface Prisma__UserBlockClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    blocker<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    blocked<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface UserBlockFieldRefs {
    readonly id: Prisma.FieldRef<"UserBlock", 'String'>;
    readonly blockerId: Prisma.FieldRef<"UserBlock", 'String'>;
    readonly blockedId: Prisma.FieldRef<"UserBlock", 'String'>;
    readonly createdAt: Prisma.FieldRef<"UserBlock", 'DateTime'>;
}
export type UserBlockFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserBlockSelect<ExtArgs> | null;
    omit?: Prisma.UserBlockOmit<ExtArgs> | null;
    include?: Prisma.UserBlockInclude<ExtArgs> | null;
    where: Prisma.UserBlockWhereUniqueInput;
};
export type UserBlockFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserBlockSelect<ExtArgs> | null;
    omit?: Prisma.UserBlockOmit<ExtArgs> | null;
    include?: Prisma.UserBlockInclude<ExtArgs> | null;
    where: Prisma.UserBlockWhereUniqueInput;
};
export type UserBlockFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserBlockSelect<ExtArgs> | null;
    omit?: Prisma.UserBlockOmit<ExtArgs> | null;
    include?: Prisma.UserBlockInclude<ExtArgs> | null;
    where?: Prisma.UserBlockWhereInput;
    orderBy?: Prisma.UserBlockOrderByWithRelationInput | Prisma.UserBlockOrderByWithRelationInput[];
    cursor?: Prisma.UserBlockWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserBlockScalarFieldEnum | Prisma.UserBlockScalarFieldEnum[];
};
export type UserBlockFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserBlockSelect<ExtArgs> | null;
    omit?: Prisma.UserBlockOmit<ExtArgs> | null;
    include?: Prisma.UserBlockInclude<ExtArgs> | null;
    where?: Prisma.UserBlockWhereInput;
    orderBy?: Prisma.UserBlockOrderByWithRelationInput | Prisma.UserBlockOrderByWithRelationInput[];
    cursor?: Prisma.UserBlockWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserBlockScalarFieldEnum | Prisma.UserBlockScalarFieldEnum[];
};
export type UserBlockFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserBlockSelect<ExtArgs> | null;
    omit?: Prisma.UserBlockOmit<ExtArgs> | null;
    include?: Prisma.UserBlockInclude<ExtArgs> | null;
    where?: Prisma.UserBlockWhereInput;
    orderBy?: Prisma.UserBlockOrderByWithRelationInput | Prisma.UserBlockOrderByWithRelationInput[];
    cursor?: Prisma.UserBlockWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserBlockScalarFieldEnum | Prisma.UserBlockScalarFieldEnum[];
};
export type UserBlockCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserBlockSelect<ExtArgs> | null;
    omit?: Prisma.UserBlockOmit<ExtArgs> | null;
    include?: Prisma.UserBlockInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserBlockCreateInput, Prisma.UserBlockUncheckedCreateInput>;
};
export type UserBlockCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.UserBlockCreateManyInput | Prisma.UserBlockCreateManyInput[];
    skipDuplicates?: boolean;
};
export type UserBlockCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserBlockSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserBlockOmit<ExtArgs> | null;
    data: Prisma.UserBlockCreateManyInput | Prisma.UserBlockCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.UserBlockIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type UserBlockUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserBlockSelect<ExtArgs> | null;
    omit?: Prisma.UserBlockOmit<ExtArgs> | null;
    include?: Prisma.UserBlockInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserBlockUpdateInput, Prisma.UserBlockUncheckedUpdateInput>;
    where: Prisma.UserBlockWhereUniqueInput;
};
export type UserBlockUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.UserBlockUpdateManyMutationInput, Prisma.UserBlockUncheckedUpdateManyInput>;
    where?: Prisma.UserBlockWhereInput;
    limit?: number;
};
export type UserBlockUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserBlockSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserBlockOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserBlockUpdateManyMutationInput, Prisma.UserBlockUncheckedUpdateManyInput>;
    where?: Prisma.UserBlockWhereInput;
    limit?: number;
    include?: Prisma.UserBlockIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type UserBlockUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserBlockSelect<ExtArgs> | null;
    omit?: Prisma.UserBlockOmit<ExtArgs> | null;
    include?: Prisma.UserBlockInclude<ExtArgs> | null;
    where: Prisma.UserBlockWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserBlockCreateInput, Prisma.UserBlockUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.UserBlockUpdateInput, Prisma.UserBlockUncheckedUpdateInput>;
};
export type UserBlockDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserBlockSelect<ExtArgs> | null;
    omit?: Prisma.UserBlockOmit<ExtArgs> | null;
    include?: Prisma.UserBlockInclude<ExtArgs> | null;
    where: Prisma.UserBlockWhereUniqueInput;
};
export type UserBlockDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserBlockWhereInput;
    limit?: number;
};
export type UserBlockDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserBlockSelect<ExtArgs> | null;
    omit?: Prisma.UserBlockOmit<ExtArgs> | null;
    include?: Prisma.UserBlockInclude<ExtArgs> | null;
};
