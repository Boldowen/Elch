import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ListingInventoryModel = runtime.Types.Result.DefaultSelection<Prisma.$ListingInventoryPayload>;
export type AggregateListingInventory = {
    _count: ListingInventoryCountAggregateOutputType | null;
    _avg: ListingInventoryAvgAggregateOutputType | null;
    _sum: ListingInventorySumAggregateOutputType | null;
    _min: ListingInventoryMinAggregateOutputType | null;
    _max: ListingInventoryMaxAggregateOutputType | null;
};
export type ListingInventoryAvgAggregateOutputType = {
    totalUnits: number | null;
    reservedUnits: number | null;
    availableUnits: number | null;
};
export type ListingInventorySumAggregateOutputType = {
    totalUnits: number | null;
    reservedUnits: number | null;
    availableUnits: number | null;
};
export type ListingInventoryMinAggregateOutputType = {
    id: string | null;
    listingId: string | null;
    date: Date | null;
    totalUnits: number | null;
    reservedUnits: number | null;
    availableUnits: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ListingInventoryMaxAggregateOutputType = {
    id: string | null;
    listingId: string | null;
    date: Date | null;
    totalUnits: number | null;
    reservedUnits: number | null;
    availableUnits: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ListingInventoryCountAggregateOutputType = {
    id: number;
    listingId: number;
    date: number;
    totalUnits: number;
    reservedUnits: number;
    availableUnits: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type ListingInventoryAvgAggregateInputType = {
    totalUnits?: true;
    reservedUnits?: true;
    availableUnits?: true;
};
export type ListingInventorySumAggregateInputType = {
    totalUnits?: true;
    reservedUnits?: true;
    availableUnits?: true;
};
export type ListingInventoryMinAggregateInputType = {
    id?: true;
    listingId?: true;
    date?: true;
    totalUnits?: true;
    reservedUnits?: true;
    availableUnits?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ListingInventoryMaxAggregateInputType = {
    id?: true;
    listingId?: true;
    date?: true;
    totalUnits?: true;
    reservedUnits?: true;
    availableUnits?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ListingInventoryCountAggregateInputType = {
    id?: true;
    listingId?: true;
    date?: true;
    totalUnits?: true;
    reservedUnits?: true;
    availableUnits?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type ListingInventoryAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ListingInventoryWhereInput;
    orderBy?: Prisma.ListingInventoryOrderByWithRelationInput | Prisma.ListingInventoryOrderByWithRelationInput[];
    cursor?: Prisma.ListingInventoryWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ListingInventoryCountAggregateInputType;
    _avg?: ListingInventoryAvgAggregateInputType;
    _sum?: ListingInventorySumAggregateInputType;
    _min?: ListingInventoryMinAggregateInputType;
    _max?: ListingInventoryMaxAggregateInputType;
};
export type GetListingInventoryAggregateType<T extends ListingInventoryAggregateArgs> = {
    [P in keyof T & keyof AggregateListingInventory]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateListingInventory[P]> : Prisma.GetScalarType<T[P], AggregateListingInventory[P]>;
};
export type ListingInventoryGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ListingInventoryWhereInput;
    orderBy?: Prisma.ListingInventoryOrderByWithAggregationInput | Prisma.ListingInventoryOrderByWithAggregationInput[];
    by: Prisma.ListingInventoryScalarFieldEnum[] | Prisma.ListingInventoryScalarFieldEnum;
    having?: Prisma.ListingInventoryScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ListingInventoryCountAggregateInputType | true;
    _avg?: ListingInventoryAvgAggregateInputType;
    _sum?: ListingInventorySumAggregateInputType;
    _min?: ListingInventoryMinAggregateInputType;
    _max?: ListingInventoryMaxAggregateInputType;
};
export type ListingInventoryGroupByOutputType = {
    id: string;
    listingId: string;
    date: Date;
    totalUnits: number;
    reservedUnits: number;
    availableUnits: number;
    createdAt: Date;
    updatedAt: Date;
    _count: ListingInventoryCountAggregateOutputType | null;
    _avg: ListingInventoryAvgAggregateOutputType | null;
    _sum: ListingInventorySumAggregateOutputType | null;
    _min: ListingInventoryMinAggregateOutputType | null;
    _max: ListingInventoryMaxAggregateOutputType | null;
};
export type GetListingInventoryGroupByPayload<T extends ListingInventoryGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ListingInventoryGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ListingInventoryGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ListingInventoryGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ListingInventoryGroupByOutputType[P]>;
}>>;
export type ListingInventoryWhereInput = {
    AND?: Prisma.ListingInventoryWhereInput | Prisma.ListingInventoryWhereInput[];
    OR?: Prisma.ListingInventoryWhereInput[];
    NOT?: Prisma.ListingInventoryWhereInput | Prisma.ListingInventoryWhereInput[];
    id?: Prisma.UuidFilter<"ListingInventory"> | string;
    listingId?: Prisma.UuidFilter<"ListingInventory"> | string;
    date?: Prisma.DateTimeFilter<"ListingInventory"> | Date | string;
    totalUnits?: Prisma.IntFilter<"ListingInventory"> | number;
    reservedUnits?: Prisma.IntFilter<"ListingInventory"> | number;
    availableUnits?: Prisma.IntFilter<"ListingInventory"> | number;
    createdAt?: Prisma.DateTimeFilter<"ListingInventory"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"ListingInventory"> | Date | string;
    listing?: Prisma.XOR<Prisma.ListingScalarRelationFilter, Prisma.ListingWhereInput>;
};
export type ListingInventoryOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    listingId?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    totalUnits?: Prisma.SortOrder;
    reservedUnits?: Prisma.SortOrder;
    availableUnits?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    listing?: Prisma.ListingOrderByWithRelationInput;
};
export type ListingInventoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    listingId_date?: Prisma.ListingInventoryListingIdDateCompoundUniqueInput;
    AND?: Prisma.ListingInventoryWhereInput | Prisma.ListingInventoryWhereInput[];
    OR?: Prisma.ListingInventoryWhereInput[];
    NOT?: Prisma.ListingInventoryWhereInput | Prisma.ListingInventoryWhereInput[];
    listingId?: Prisma.UuidFilter<"ListingInventory"> | string;
    date?: Prisma.DateTimeFilter<"ListingInventory"> | Date | string;
    totalUnits?: Prisma.IntFilter<"ListingInventory"> | number;
    reservedUnits?: Prisma.IntFilter<"ListingInventory"> | number;
    availableUnits?: Prisma.IntFilter<"ListingInventory"> | number;
    createdAt?: Prisma.DateTimeFilter<"ListingInventory"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"ListingInventory"> | Date | string;
    listing?: Prisma.XOR<Prisma.ListingScalarRelationFilter, Prisma.ListingWhereInput>;
}, "id" | "listingId_date">;
export type ListingInventoryOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    listingId?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    totalUnits?: Prisma.SortOrder;
    reservedUnits?: Prisma.SortOrder;
    availableUnits?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.ListingInventoryCountOrderByAggregateInput;
    _avg?: Prisma.ListingInventoryAvgOrderByAggregateInput;
    _max?: Prisma.ListingInventoryMaxOrderByAggregateInput;
    _min?: Prisma.ListingInventoryMinOrderByAggregateInput;
    _sum?: Prisma.ListingInventorySumOrderByAggregateInput;
};
export type ListingInventoryScalarWhereWithAggregatesInput = {
    AND?: Prisma.ListingInventoryScalarWhereWithAggregatesInput | Prisma.ListingInventoryScalarWhereWithAggregatesInput[];
    OR?: Prisma.ListingInventoryScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ListingInventoryScalarWhereWithAggregatesInput | Prisma.ListingInventoryScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"ListingInventory"> | string;
    listingId?: Prisma.UuidWithAggregatesFilter<"ListingInventory"> | string;
    date?: Prisma.DateTimeWithAggregatesFilter<"ListingInventory"> | Date | string;
    totalUnits?: Prisma.IntWithAggregatesFilter<"ListingInventory"> | number;
    reservedUnits?: Prisma.IntWithAggregatesFilter<"ListingInventory"> | number;
    availableUnits?: Prisma.IntWithAggregatesFilter<"ListingInventory"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ListingInventory"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"ListingInventory"> | Date | string;
};
export type ListingInventoryCreateInput = {
    id?: string;
    date: Date | string;
    totalUnits: number;
    reservedUnits?: number;
    availableUnits: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    listing: Prisma.ListingCreateNestedOneWithoutInventoryInput;
};
export type ListingInventoryUncheckedCreateInput = {
    id?: string;
    listingId: string;
    date: Date | string;
    totalUnits: number;
    reservedUnits?: number;
    availableUnits: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ListingInventoryUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalUnits?: Prisma.IntFieldUpdateOperationsInput | number;
    reservedUnits?: Prisma.IntFieldUpdateOperationsInput | number;
    availableUnits?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    listing?: Prisma.ListingUpdateOneRequiredWithoutInventoryNestedInput;
};
export type ListingInventoryUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    listingId?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalUnits?: Prisma.IntFieldUpdateOperationsInput | number;
    reservedUnits?: Prisma.IntFieldUpdateOperationsInput | number;
    availableUnits?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ListingInventoryCreateManyInput = {
    id?: string;
    listingId: string;
    date: Date | string;
    totalUnits: number;
    reservedUnits?: number;
    availableUnits: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ListingInventoryUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalUnits?: Prisma.IntFieldUpdateOperationsInput | number;
    reservedUnits?: Prisma.IntFieldUpdateOperationsInput | number;
    availableUnits?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ListingInventoryUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    listingId?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalUnits?: Prisma.IntFieldUpdateOperationsInput | number;
    reservedUnits?: Prisma.IntFieldUpdateOperationsInput | number;
    availableUnits?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ListingInventoryListRelationFilter = {
    every?: Prisma.ListingInventoryWhereInput;
    some?: Prisma.ListingInventoryWhereInput;
    none?: Prisma.ListingInventoryWhereInput;
};
export type ListingInventoryOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ListingInventoryListingIdDateCompoundUniqueInput = {
    listingId: string;
    date: Date | string;
};
export type ListingInventoryCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    listingId?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    totalUnits?: Prisma.SortOrder;
    reservedUnits?: Prisma.SortOrder;
    availableUnits?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ListingInventoryAvgOrderByAggregateInput = {
    totalUnits?: Prisma.SortOrder;
    reservedUnits?: Prisma.SortOrder;
    availableUnits?: Prisma.SortOrder;
};
export type ListingInventoryMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    listingId?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    totalUnits?: Prisma.SortOrder;
    reservedUnits?: Prisma.SortOrder;
    availableUnits?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ListingInventoryMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    listingId?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    totalUnits?: Prisma.SortOrder;
    reservedUnits?: Prisma.SortOrder;
    availableUnits?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ListingInventorySumOrderByAggregateInput = {
    totalUnits?: Prisma.SortOrder;
    reservedUnits?: Prisma.SortOrder;
    availableUnits?: Prisma.SortOrder;
};
export type ListingInventoryCreateNestedManyWithoutListingInput = {
    create?: Prisma.XOR<Prisma.ListingInventoryCreateWithoutListingInput, Prisma.ListingInventoryUncheckedCreateWithoutListingInput> | Prisma.ListingInventoryCreateWithoutListingInput[] | Prisma.ListingInventoryUncheckedCreateWithoutListingInput[];
    connectOrCreate?: Prisma.ListingInventoryCreateOrConnectWithoutListingInput | Prisma.ListingInventoryCreateOrConnectWithoutListingInput[];
    createMany?: Prisma.ListingInventoryCreateManyListingInputEnvelope;
    connect?: Prisma.ListingInventoryWhereUniqueInput | Prisma.ListingInventoryWhereUniqueInput[];
};
export type ListingInventoryUncheckedCreateNestedManyWithoutListingInput = {
    create?: Prisma.XOR<Prisma.ListingInventoryCreateWithoutListingInput, Prisma.ListingInventoryUncheckedCreateWithoutListingInput> | Prisma.ListingInventoryCreateWithoutListingInput[] | Prisma.ListingInventoryUncheckedCreateWithoutListingInput[];
    connectOrCreate?: Prisma.ListingInventoryCreateOrConnectWithoutListingInput | Prisma.ListingInventoryCreateOrConnectWithoutListingInput[];
    createMany?: Prisma.ListingInventoryCreateManyListingInputEnvelope;
    connect?: Prisma.ListingInventoryWhereUniqueInput | Prisma.ListingInventoryWhereUniqueInput[];
};
export type ListingInventoryUpdateManyWithoutListingNestedInput = {
    create?: Prisma.XOR<Prisma.ListingInventoryCreateWithoutListingInput, Prisma.ListingInventoryUncheckedCreateWithoutListingInput> | Prisma.ListingInventoryCreateWithoutListingInput[] | Prisma.ListingInventoryUncheckedCreateWithoutListingInput[];
    connectOrCreate?: Prisma.ListingInventoryCreateOrConnectWithoutListingInput | Prisma.ListingInventoryCreateOrConnectWithoutListingInput[];
    upsert?: Prisma.ListingInventoryUpsertWithWhereUniqueWithoutListingInput | Prisma.ListingInventoryUpsertWithWhereUniqueWithoutListingInput[];
    createMany?: Prisma.ListingInventoryCreateManyListingInputEnvelope;
    set?: Prisma.ListingInventoryWhereUniqueInput | Prisma.ListingInventoryWhereUniqueInput[];
    disconnect?: Prisma.ListingInventoryWhereUniqueInput | Prisma.ListingInventoryWhereUniqueInput[];
    delete?: Prisma.ListingInventoryWhereUniqueInput | Prisma.ListingInventoryWhereUniqueInput[];
    connect?: Prisma.ListingInventoryWhereUniqueInput | Prisma.ListingInventoryWhereUniqueInput[];
    update?: Prisma.ListingInventoryUpdateWithWhereUniqueWithoutListingInput | Prisma.ListingInventoryUpdateWithWhereUniqueWithoutListingInput[];
    updateMany?: Prisma.ListingInventoryUpdateManyWithWhereWithoutListingInput | Prisma.ListingInventoryUpdateManyWithWhereWithoutListingInput[];
    deleteMany?: Prisma.ListingInventoryScalarWhereInput | Prisma.ListingInventoryScalarWhereInput[];
};
export type ListingInventoryUncheckedUpdateManyWithoutListingNestedInput = {
    create?: Prisma.XOR<Prisma.ListingInventoryCreateWithoutListingInput, Prisma.ListingInventoryUncheckedCreateWithoutListingInput> | Prisma.ListingInventoryCreateWithoutListingInput[] | Prisma.ListingInventoryUncheckedCreateWithoutListingInput[];
    connectOrCreate?: Prisma.ListingInventoryCreateOrConnectWithoutListingInput | Prisma.ListingInventoryCreateOrConnectWithoutListingInput[];
    upsert?: Prisma.ListingInventoryUpsertWithWhereUniqueWithoutListingInput | Prisma.ListingInventoryUpsertWithWhereUniqueWithoutListingInput[];
    createMany?: Prisma.ListingInventoryCreateManyListingInputEnvelope;
    set?: Prisma.ListingInventoryWhereUniqueInput | Prisma.ListingInventoryWhereUniqueInput[];
    disconnect?: Prisma.ListingInventoryWhereUniqueInput | Prisma.ListingInventoryWhereUniqueInput[];
    delete?: Prisma.ListingInventoryWhereUniqueInput | Prisma.ListingInventoryWhereUniqueInput[];
    connect?: Prisma.ListingInventoryWhereUniqueInput | Prisma.ListingInventoryWhereUniqueInput[];
    update?: Prisma.ListingInventoryUpdateWithWhereUniqueWithoutListingInput | Prisma.ListingInventoryUpdateWithWhereUniqueWithoutListingInput[];
    updateMany?: Prisma.ListingInventoryUpdateManyWithWhereWithoutListingInput | Prisma.ListingInventoryUpdateManyWithWhereWithoutListingInput[];
    deleteMany?: Prisma.ListingInventoryScalarWhereInput | Prisma.ListingInventoryScalarWhereInput[];
};
export type ListingInventoryCreateWithoutListingInput = {
    id?: string;
    date: Date | string;
    totalUnits: number;
    reservedUnits?: number;
    availableUnits: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ListingInventoryUncheckedCreateWithoutListingInput = {
    id?: string;
    date: Date | string;
    totalUnits: number;
    reservedUnits?: number;
    availableUnits: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ListingInventoryCreateOrConnectWithoutListingInput = {
    where: Prisma.ListingInventoryWhereUniqueInput;
    create: Prisma.XOR<Prisma.ListingInventoryCreateWithoutListingInput, Prisma.ListingInventoryUncheckedCreateWithoutListingInput>;
};
export type ListingInventoryCreateManyListingInputEnvelope = {
    data: Prisma.ListingInventoryCreateManyListingInput | Prisma.ListingInventoryCreateManyListingInput[];
    skipDuplicates?: boolean;
};
export type ListingInventoryUpsertWithWhereUniqueWithoutListingInput = {
    where: Prisma.ListingInventoryWhereUniqueInput;
    update: Prisma.XOR<Prisma.ListingInventoryUpdateWithoutListingInput, Prisma.ListingInventoryUncheckedUpdateWithoutListingInput>;
    create: Prisma.XOR<Prisma.ListingInventoryCreateWithoutListingInput, Prisma.ListingInventoryUncheckedCreateWithoutListingInput>;
};
export type ListingInventoryUpdateWithWhereUniqueWithoutListingInput = {
    where: Prisma.ListingInventoryWhereUniqueInput;
    data: Prisma.XOR<Prisma.ListingInventoryUpdateWithoutListingInput, Prisma.ListingInventoryUncheckedUpdateWithoutListingInput>;
};
export type ListingInventoryUpdateManyWithWhereWithoutListingInput = {
    where: Prisma.ListingInventoryScalarWhereInput;
    data: Prisma.XOR<Prisma.ListingInventoryUpdateManyMutationInput, Prisma.ListingInventoryUncheckedUpdateManyWithoutListingInput>;
};
export type ListingInventoryScalarWhereInput = {
    AND?: Prisma.ListingInventoryScalarWhereInput | Prisma.ListingInventoryScalarWhereInput[];
    OR?: Prisma.ListingInventoryScalarWhereInput[];
    NOT?: Prisma.ListingInventoryScalarWhereInput | Prisma.ListingInventoryScalarWhereInput[];
    id?: Prisma.UuidFilter<"ListingInventory"> | string;
    listingId?: Prisma.UuidFilter<"ListingInventory"> | string;
    date?: Prisma.DateTimeFilter<"ListingInventory"> | Date | string;
    totalUnits?: Prisma.IntFilter<"ListingInventory"> | number;
    reservedUnits?: Prisma.IntFilter<"ListingInventory"> | number;
    availableUnits?: Prisma.IntFilter<"ListingInventory"> | number;
    createdAt?: Prisma.DateTimeFilter<"ListingInventory"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"ListingInventory"> | Date | string;
};
export type ListingInventoryCreateManyListingInput = {
    id?: string;
    date: Date | string;
    totalUnits: number;
    reservedUnits?: number;
    availableUnits: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ListingInventoryUpdateWithoutListingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalUnits?: Prisma.IntFieldUpdateOperationsInput | number;
    reservedUnits?: Prisma.IntFieldUpdateOperationsInput | number;
    availableUnits?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ListingInventoryUncheckedUpdateWithoutListingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalUnits?: Prisma.IntFieldUpdateOperationsInput | number;
    reservedUnits?: Prisma.IntFieldUpdateOperationsInput | number;
    availableUnits?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ListingInventoryUncheckedUpdateManyWithoutListingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalUnits?: Prisma.IntFieldUpdateOperationsInput | number;
    reservedUnits?: Prisma.IntFieldUpdateOperationsInput | number;
    availableUnits?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ListingInventorySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    listingId?: boolean;
    date?: boolean;
    totalUnits?: boolean;
    reservedUnits?: boolean;
    availableUnits?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    listing?: boolean | Prisma.ListingDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["listingInventory"]>;
export type ListingInventorySelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    listingId?: boolean;
    date?: boolean;
    totalUnits?: boolean;
    reservedUnits?: boolean;
    availableUnits?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    listing?: boolean | Prisma.ListingDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["listingInventory"]>;
export type ListingInventorySelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    listingId?: boolean;
    date?: boolean;
    totalUnits?: boolean;
    reservedUnits?: boolean;
    availableUnits?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    listing?: boolean | Prisma.ListingDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["listingInventory"]>;
export type ListingInventorySelectScalar = {
    id?: boolean;
    listingId?: boolean;
    date?: boolean;
    totalUnits?: boolean;
    reservedUnits?: boolean;
    availableUnits?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type ListingInventoryOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "listingId" | "date" | "totalUnits" | "reservedUnits" | "availableUnits" | "createdAt" | "updatedAt", ExtArgs["result"]["listingInventory"]>;
export type ListingInventoryInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    listing?: boolean | Prisma.ListingDefaultArgs<ExtArgs>;
};
export type ListingInventoryIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    listing?: boolean | Prisma.ListingDefaultArgs<ExtArgs>;
};
export type ListingInventoryIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    listing?: boolean | Prisma.ListingDefaultArgs<ExtArgs>;
};
export type $ListingInventoryPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ListingInventory";
    objects: {
        listing: Prisma.$ListingPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        listingId: string;
        date: Date;
        totalUnits: number;
        reservedUnits: number;
        availableUnits: number;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["listingInventory"]>;
    composites: {};
};
export type ListingInventoryGetPayload<S extends boolean | null | undefined | ListingInventoryDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ListingInventoryPayload, S>;
export type ListingInventoryCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ListingInventoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ListingInventoryCountAggregateInputType | true;
};
export interface ListingInventoryDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ListingInventory'];
        meta: {
            name: 'ListingInventory';
        };
    };
    findUnique<T extends ListingInventoryFindUniqueArgs>(args: Prisma.SelectSubset<T, ListingInventoryFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ListingInventoryClient<runtime.Types.Result.GetResult<Prisma.$ListingInventoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ListingInventoryFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ListingInventoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ListingInventoryClient<runtime.Types.Result.GetResult<Prisma.$ListingInventoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ListingInventoryFindFirstArgs>(args?: Prisma.SelectSubset<T, ListingInventoryFindFirstArgs<ExtArgs>>): Prisma.Prisma__ListingInventoryClient<runtime.Types.Result.GetResult<Prisma.$ListingInventoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ListingInventoryFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ListingInventoryFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ListingInventoryClient<runtime.Types.Result.GetResult<Prisma.$ListingInventoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ListingInventoryFindManyArgs>(args?: Prisma.SelectSubset<T, ListingInventoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ListingInventoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ListingInventoryCreateArgs>(args: Prisma.SelectSubset<T, ListingInventoryCreateArgs<ExtArgs>>): Prisma.Prisma__ListingInventoryClient<runtime.Types.Result.GetResult<Prisma.$ListingInventoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ListingInventoryCreateManyArgs>(args?: Prisma.SelectSubset<T, ListingInventoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ListingInventoryCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ListingInventoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ListingInventoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ListingInventoryDeleteArgs>(args: Prisma.SelectSubset<T, ListingInventoryDeleteArgs<ExtArgs>>): Prisma.Prisma__ListingInventoryClient<runtime.Types.Result.GetResult<Prisma.$ListingInventoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ListingInventoryUpdateArgs>(args: Prisma.SelectSubset<T, ListingInventoryUpdateArgs<ExtArgs>>): Prisma.Prisma__ListingInventoryClient<runtime.Types.Result.GetResult<Prisma.$ListingInventoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ListingInventoryDeleteManyArgs>(args?: Prisma.SelectSubset<T, ListingInventoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ListingInventoryUpdateManyArgs>(args: Prisma.SelectSubset<T, ListingInventoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ListingInventoryUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ListingInventoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ListingInventoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ListingInventoryUpsertArgs>(args: Prisma.SelectSubset<T, ListingInventoryUpsertArgs<ExtArgs>>): Prisma.Prisma__ListingInventoryClient<runtime.Types.Result.GetResult<Prisma.$ListingInventoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ListingInventoryCountArgs>(args?: Prisma.Subset<T, ListingInventoryCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ListingInventoryCountAggregateOutputType> : number>;
    aggregate<T extends ListingInventoryAggregateArgs>(args: Prisma.Subset<T, ListingInventoryAggregateArgs>): Prisma.PrismaPromise<GetListingInventoryAggregateType<T>>;
    groupBy<T extends ListingInventoryGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ListingInventoryGroupByArgs['orderBy'];
    } : {
        orderBy?: ListingInventoryGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ListingInventoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetListingInventoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ListingInventoryFieldRefs;
}
export interface Prisma__ListingInventoryClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    listing<T extends Prisma.ListingDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ListingDefaultArgs<ExtArgs>>): Prisma.Prisma__ListingClient<runtime.Types.Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ListingInventoryFieldRefs {
    readonly id: Prisma.FieldRef<"ListingInventory", 'String'>;
    readonly listingId: Prisma.FieldRef<"ListingInventory", 'String'>;
    readonly date: Prisma.FieldRef<"ListingInventory", 'DateTime'>;
    readonly totalUnits: Prisma.FieldRef<"ListingInventory", 'Int'>;
    readonly reservedUnits: Prisma.FieldRef<"ListingInventory", 'Int'>;
    readonly availableUnits: Prisma.FieldRef<"ListingInventory", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"ListingInventory", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"ListingInventory", 'DateTime'>;
}
export type ListingInventoryFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingInventorySelect<ExtArgs> | null;
    omit?: Prisma.ListingInventoryOmit<ExtArgs> | null;
    include?: Prisma.ListingInventoryInclude<ExtArgs> | null;
    where: Prisma.ListingInventoryWhereUniqueInput;
};
export type ListingInventoryFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingInventorySelect<ExtArgs> | null;
    omit?: Prisma.ListingInventoryOmit<ExtArgs> | null;
    include?: Prisma.ListingInventoryInclude<ExtArgs> | null;
    where: Prisma.ListingInventoryWhereUniqueInput;
};
export type ListingInventoryFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingInventorySelect<ExtArgs> | null;
    omit?: Prisma.ListingInventoryOmit<ExtArgs> | null;
    include?: Prisma.ListingInventoryInclude<ExtArgs> | null;
    where?: Prisma.ListingInventoryWhereInput;
    orderBy?: Prisma.ListingInventoryOrderByWithRelationInput | Prisma.ListingInventoryOrderByWithRelationInput[];
    cursor?: Prisma.ListingInventoryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ListingInventoryScalarFieldEnum | Prisma.ListingInventoryScalarFieldEnum[];
};
export type ListingInventoryFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingInventorySelect<ExtArgs> | null;
    omit?: Prisma.ListingInventoryOmit<ExtArgs> | null;
    include?: Prisma.ListingInventoryInclude<ExtArgs> | null;
    where?: Prisma.ListingInventoryWhereInput;
    orderBy?: Prisma.ListingInventoryOrderByWithRelationInput | Prisma.ListingInventoryOrderByWithRelationInput[];
    cursor?: Prisma.ListingInventoryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ListingInventoryScalarFieldEnum | Prisma.ListingInventoryScalarFieldEnum[];
};
export type ListingInventoryFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingInventorySelect<ExtArgs> | null;
    omit?: Prisma.ListingInventoryOmit<ExtArgs> | null;
    include?: Prisma.ListingInventoryInclude<ExtArgs> | null;
    where?: Prisma.ListingInventoryWhereInput;
    orderBy?: Prisma.ListingInventoryOrderByWithRelationInput | Prisma.ListingInventoryOrderByWithRelationInput[];
    cursor?: Prisma.ListingInventoryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ListingInventoryScalarFieldEnum | Prisma.ListingInventoryScalarFieldEnum[];
};
export type ListingInventoryCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingInventorySelect<ExtArgs> | null;
    omit?: Prisma.ListingInventoryOmit<ExtArgs> | null;
    include?: Prisma.ListingInventoryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ListingInventoryCreateInput, Prisma.ListingInventoryUncheckedCreateInput>;
};
export type ListingInventoryCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ListingInventoryCreateManyInput | Prisma.ListingInventoryCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ListingInventoryCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingInventorySelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ListingInventoryOmit<ExtArgs> | null;
    data: Prisma.ListingInventoryCreateManyInput | Prisma.ListingInventoryCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ListingInventoryIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ListingInventoryUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingInventorySelect<ExtArgs> | null;
    omit?: Prisma.ListingInventoryOmit<ExtArgs> | null;
    include?: Prisma.ListingInventoryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ListingInventoryUpdateInput, Prisma.ListingInventoryUncheckedUpdateInput>;
    where: Prisma.ListingInventoryWhereUniqueInput;
};
export type ListingInventoryUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ListingInventoryUpdateManyMutationInput, Prisma.ListingInventoryUncheckedUpdateManyInput>;
    where?: Prisma.ListingInventoryWhereInput;
    limit?: number;
};
export type ListingInventoryUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingInventorySelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ListingInventoryOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ListingInventoryUpdateManyMutationInput, Prisma.ListingInventoryUncheckedUpdateManyInput>;
    where?: Prisma.ListingInventoryWhereInput;
    limit?: number;
    include?: Prisma.ListingInventoryIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ListingInventoryUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingInventorySelect<ExtArgs> | null;
    omit?: Prisma.ListingInventoryOmit<ExtArgs> | null;
    include?: Prisma.ListingInventoryInclude<ExtArgs> | null;
    where: Prisma.ListingInventoryWhereUniqueInput;
    create: Prisma.XOR<Prisma.ListingInventoryCreateInput, Prisma.ListingInventoryUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ListingInventoryUpdateInput, Prisma.ListingInventoryUncheckedUpdateInput>;
};
export type ListingInventoryDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingInventorySelect<ExtArgs> | null;
    omit?: Prisma.ListingInventoryOmit<ExtArgs> | null;
    include?: Prisma.ListingInventoryInclude<ExtArgs> | null;
    where: Prisma.ListingInventoryWhereUniqueInput;
};
export type ListingInventoryDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ListingInventoryWhereInput;
    limit?: number;
};
export type ListingInventoryDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingInventorySelect<ExtArgs> | null;
    omit?: Prisma.ListingInventoryOmit<ExtArgs> | null;
    include?: Prisma.ListingInventoryInclude<ExtArgs> | null;
};
