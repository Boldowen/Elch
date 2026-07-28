import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ListingImageModel = runtime.Types.Result.DefaultSelection<Prisma.$ListingImagePayload>;
export type AggregateListingImage = {
    _count: ListingImageCountAggregateOutputType | null;
    _avg: ListingImageAvgAggregateOutputType | null;
    _sum: ListingImageSumAggregateOutputType | null;
    _min: ListingImageMinAggregateOutputType | null;
    _max: ListingImageMaxAggregateOutputType | null;
};
export type ListingImageAvgAggregateOutputType = {
    sortOrder: number | null;
};
export type ListingImageSumAggregateOutputType = {
    sortOrder: number | null;
};
export type ListingImageMinAggregateOutputType = {
    id: string | null;
    url: string | null;
    alt: string | null;
    sortOrder: number | null;
    listingId: string | null;
};
export type ListingImageMaxAggregateOutputType = {
    id: string | null;
    url: string | null;
    alt: string | null;
    sortOrder: number | null;
    listingId: string | null;
};
export type ListingImageCountAggregateOutputType = {
    id: number;
    url: number;
    alt: number;
    sortOrder: number;
    listingId: number;
    _all: number;
};
export type ListingImageAvgAggregateInputType = {
    sortOrder?: true;
};
export type ListingImageSumAggregateInputType = {
    sortOrder?: true;
};
export type ListingImageMinAggregateInputType = {
    id?: true;
    url?: true;
    alt?: true;
    sortOrder?: true;
    listingId?: true;
};
export type ListingImageMaxAggregateInputType = {
    id?: true;
    url?: true;
    alt?: true;
    sortOrder?: true;
    listingId?: true;
};
export type ListingImageCountAggregateInputType = {
    id?: true;
    url?: true;
    alt?: true;
    sortOrder?: true;
    listingId?: true;
    _all?: true;
};
export type ListingImageAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ListingImageWhereInput;
    orderBy?: Prisma.ListingImageOrderByWithRelationInput | Prisma.ListingImageOrderByWithRelationInput[];
    cursor?: Prisma.ListingImageWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ListingImageCountAggregateInputType;
    _avg?: ListingImageAvgAggregateInputType;
    _sum?: ListingImageSumAggregateInputType;
    _min?: ListingImageMinAggregateInputType;
    _max?: ListingImageMaxAggregateInputType;
};
export type GetListingImageAggregateType<T extends ListingImageAggregateArgs> = {
    [P in keyof T & keyof AggregateListingImage]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateListingImage[P]> : Prisma.GetScalarType<T[P], AggregateListingImage[P]>;
};
export type ListingImageGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ListingImageWhereInput;
    orderBy?: Prisma.ListingImageOrderByWithAggregationInput | Prisma.ListingImageOrderByWithAggregationInput[];
    by: Prisma.ListingImageScalarFieldEnum[] | Prisma.ListingImageScalarFieldEnum;
    having?: Prisma.ListingImageScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ListingImageCountAggregateInputType | true;
    _avg?: ListingImageAvgAggregateInputType;
    _sum?: ListingImageSumAggregateInputType;
    _min?: ListingImageMinAggregateInputType;
    _max?: ListingImageMaxAggregateInputType;
};
export type ListingImageGroupByOutputType = {
    id: string;
    url: string;
    alt: string | null;
    sortOrder: number;
    listingId: string;
    _count: ListingImageCountAggregateOutputType | null;
    _avg: ListingImageAvgAggregateOutputType | null;
    _sum: ListingImageSumAggregateOutputType | null;
    _min: ListingImageMinAggregateOutputType | null;
    _max: ListingImageMaxAggregateOutputType | null;
};
export type GetListingImageGroupByPayload<T extends ListingImageGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ListingImageGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ListingImageGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ListingImageGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ListingImageGroupByOutputType[P]>;
}>>;
export type ListingImageWhereInput = {
    AND?: Prisma.ListingImageWhereInput | Prisma.ListingImageWhereInput[];
    OR?: Prisma.ListingImageWhereInput[];
    NOT?: Prisma.ListingImageWhereInput | Prisma.ListingImageWhereInput[];
    id?: Prisma.UuidFilter<"ListingImage"> | string;
    url?: Prisma.StringFilter<"ListingImage"> | string;
    alt?: Prisma.StringNullableFilter<"ListingImage"> | string | null;
    sortOrder?: Prisma.IntFilter<"ListingImage"> | number;
    listingId?: Prisma.UuidFilter<"ListingImage"> | string;
    listing?: Prisma.XOR<Prisma.ListingScalarRelationFilter, Prisma.ListingWhereInput>;
};
export type ListingImageOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    alt?: Prisma.SortOrderInput | Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    listingId?: Prisma.SortOrder;
    listing?: Prisma.ListingOrderByWithRelationInput;
};
export type ListingImageWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ListingImageWhereInput | Prisma.ListingImageWhereInput[];
    OR?: Prisma.ListingImageWhereInput[];
    NOT?: Prisma.ListingImageWhereInput | Prisma.ListingImageWhereInput[];
    url?: Prisma.StringFilter<"ListingImage"> | string;
    alt?: Prisma.StringNullableFilter<"ListingImage"> | string | null;
    sortOrder?: Prisma.IntFilter<"ListingImage"> | number;
    listingId?: Prisma.UuidFilter<"ListingImage"> | string;
    listing?: Prisma.XOR<Prisma.ListingScalarRelationFilter, Prisma.ListingWhereInput>;
}, "id">;
export type ListingImageOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    alt?: Prisma.SortOrderInput | Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    listingId?: Prisma.SortOrder;
    _count?: Prisma.ListingImageCountOrderByAggregateInput;
    _avg?: Prisma.ListingImageAvgOrderByAggregateInput;
    _max?: Prisma.ListingImageMaxOrderByAggregateInput;
    _min?: Prisma.ListingImageMinOrderByAggregateInput;
    _sum?: Prisma.ListingImageSumOrderByAggregateInput;
};
export type ListingImageScalarWhereWithAggregatesInput = {
    AND?: Prisma.ListingImageScalarWhereWithAggregatesInput | Prisma.ListingImageScalarWhereWithAggregatesInput[];
    OR?: Prisma.ListingImageScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ListingImageScalarWhereWithAggregatesInput | Prisma.ListingImageScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"ListingImage"> | string;
    url?: Prisma.StringWithAggregatesFilter<"ListingImage"> | string;
    alt?: Prisma.StringNullableWithAggregatesFilter<"ListingImage"> | string | null;
    sortOrder?: Prisma.IntWithAggregatesFilter<"ListingImage"> | number;
    listingId?: Prisma.UuidWithAggregatesFilter<"ListingImage"> | string;
};
export type ListingImageCreateInput = {
    id?: string;
    url: string;
    alt?: string | null;
    sortOrder?: number;
    listing: Prisma.ListingCreateNestedOneWithoutImagesInput;
};
export type ListingImageUncheckedCreateInput = {
    id?: string;
    url: string;
    alt?: string | null;
    sortOrder?: number;
    listingId: string;
};
export type ListingImageUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    alt?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    listing?: Prisma.ListingUpdateOneRequiredWithoutImagesNestedInput;
};
export type ListingImageUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    alt?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    listingId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ListingImageCreateManyInput = {
    id?: string;
    url: string;
    alt?: string | null;
    sortOrder?: number;
    listingId: string;
};
export type ListingImageUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    alt?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type ListingImageUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    alt?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    listingId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ListingImageListRelationFilter = {
    every?: Prisma.ListingImageWhereInput;
    some?: Prisma.ListingImageWhereInput;
    none?: Prisma.ListingImageWhereInput;
};
export type ListingImageOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ListingImageCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    alt?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    listingId?: Prisma.SortOrder;
};
export type ListingImageAvgOrderByAggregateInput = {
    sortOrder?: Prisma.SortOrder;
};
export type ListingImageMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    alt?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    listingId?: Prisma.SortOrder;
};
export type ListingImageMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    alt?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    listingId?: Prisma.SortOrder;
};
export type ListingImageSumOrderByAggregateInput = {
    sortOrder?: Prisma.SortOrder;
};
export type ListingImageCreateNestedManyWithoutListingInput = {
    create?: Prisma.XOR<Prisma.ListingImageCreateWithoutListingInput, Prisma.ListingImageUncheckedCreateWithoutListingInput> | Prisma.ListingImageCreateWithoutListingInput[] | Prisma.ListingImageUncheckedCreateWithoutListingInput[];
    connectOrCreate?: Prisma.ListingImageCreateOrConnectWithoutListingInput | Prisma.ListingImageCreateOrConnectWithoutListingInput[];
    createMany?: Prisma.ListingImageCreateManyListingInputEnvelope;
    connect?: Prisma.ListingImageWhereUniqueInput | Prisma.ListingImageWhereUniqueInput[];
};
export type ListingImageUncheckedCreateNestedManyWithoutListingInput = {
    create?: Prisma.XOR<Prisma.ListingImageCreateWithoutListingInput, Prisma.ListingImageUncheckedCreateWithoutListingInput> | Prisma.ListingImageCreateWithoutListingInput[] | Prisma.ListingImageUncheckedCreateWithoutListingInput[];
    connectOrCreate?: Prisma.ListingImageCreateOrConnectWithoutListingInput | Prisma.ListingImageCreateOrConnectWithoutListingInput[];
    createMany?: Prisma.ListingImageCreateManyListingInputEnvelope;
    connect?: Prisma.ListingImageWhereUniqueInput | Prisma.ListingImageWhereUniqueInput[];
};
export type ListingImageUpdateManyWithoutListingNestedInput = {
    create?: Prisma.XOR<Prisma.ListingImageCreateWithoutListingInput, Prisma.ListingImageUncheckedCreateWithoutListingInput> | Prisma.ListingImageCreateWithoutListingInput[] | Prisma.ListingImageUncheckedCreateWithoutListingInput[];
    connectOrCreate?: Prisma.ListingImageCreateOrConnectWithoutListingInput | Prisma.ListingImageCreateOrConnectWithoutListingInput[];
    upsert?: Prisma.ListingImageUpsertWithWhereUniqueWithoutListingInput | Prisma.ListingImageUpsertWithWhereUniqueWithoutListingInput[];
    createMany?: Prisma.ListingImageCreateManyListingInputEnvelope;
    set?: Prisma.ListingImageWhereUniqueInput | Prisma.ListingImageWhereUniqueInput[];
    disconnect?: Prisma.ListingImageWhereUniqueInput | Prisma.ListingImageWhereUniqueInput[];
    delete?: Prisma.ListingImageWhereUniqueInput | Prisma.ListingImageWhereUniqueInput[];
    connect?: Prisma.ListingImageWhereUniqueInput | Prisma.ListingImageWhereUniqueInput[];
    update?: Prisma.ListingImageUpdateWithWhereUniqueWithoutListingInput | Prisma.ListingImageUpdateWithWhereUniqueWithoutListingInput[];
    updateMany?: Prisma.ListingImageUpdateManyWithWhereWithoutListingInput | Prisma.ListingImageUpdateManyWithWhereWithoutListingInput[];
    deleteMany?: Prisma.ListingImageScalarWhereInput | Prisma.ListingImageScalarWhereInput[];
};
export type ListingImageUncheckedUpdateManyWithoutListingNestedInput = {
    create?: Prisma.XOR<Prisma.ListingImageCreateWithoutListingInput, Prisma.ListingImageUncheckedCreateWithoutListingInput> | Prisma.ListingImageCreateWithoutListingInput[] | Prisma.ListingImageUncheckedCreateWithoutListingInput[];
    connectOrCreate?: Prisma.ListingImageCreateOrConnectWithoutListingInput | Prisma.ListingImageCreateOrConnectWithoutListingInput[];
    upsert?: Prisma.ListingImageUpsertWithWhereUniqueWithoutListingInput | Prisma.ListingImageUpsertWithWhereUniqueWithoutListingInput[];
    createMany?: Prisma.ListingImageCreateManyListingInputEnvelope;
    set?: Prisma.ListingImageWhereUniqueInput | Prisma.ListingImageWhereUniqueInput[];
    disconnect?: Prisma.ListingImageWhereUniqueInput | Prisma.ListingImageWhereUniqueInput[];
    delete?: Prisma.ListingImageWhereUniqueInput | Prisma.ListingImageWhereUniqueInput[];
    connect?: Prisma.ListingImageWhereUniqueInput | Prisma.ListingImageWhereUniqueInput[];
    update?: Prisma.ListingImageUpdateWithWhereUniqueWithoutListingInput | Prisma.ListingImageUpdateWithWhereUniqueWithoutListingInput[];
    updateMany?: Prisma.ListingImageUpdateManyWithWhereWithoutListingInput | Prisma.ListingImageUpdateManyWithWhereWithoutListingInput[];
    deleteMany?: Prisma.ListingImageScalarWhereInput | Prisma.ListingImageScalarWhereInput[];
};
export type ListingImageCreateWithoutListingInput = {
    id?: string;
    url: string;
    alt?: string | null;
    sortOrder?: number;
};
export type ListingImageUncheckedCreateWithoutListingInput = {
    id?: string;
    url: string;
    alt?: string | null;
    sortOrder?: number;
};
export type ListingImageCreateOrConnectWithoutListingInput = {
    where: Prisma.ListingImageWhereUniqueInput;
    create: Prisma.XOR<Prisma.ListingImageCreateWithoutListingInput, Prisma.ListingImageUncheckedCreateWithoutListingInput>;
};
export type ListingImageCreateManyListingInputEnvelope = {
    data: Prisma.ListingImageCreateManyListingInput | Prisma.ListingImageCreateManyListingInput[];
    skipDuplicates?: boolean;
};
export type ListingImageUpsertWithWhereUniqueWithoutListingInput = {
    where: Prisma.ListingImageWhereUniqueInput;
    update: Prisma.XOR<Prisma.ListingImageUpdateWithoutListingInput, Prisma.ListingImageUncheckedUpdateWithoutListingInput>;
    create: Prisma.XOR<Prisma.ListingImageCreateWithoutListingInput, Prisma.ListingImageUncheckedCreateWithoutListingInput>;
};
export type ListingImageUpdateWithWhereUniqueWithoutListingInput = {
    where: Prisma.ListingImageWhereUniqueInput;
    data: Prisma.XOR<Prisma.ListingImageUpdateWithoutListingInput, Prisma.ListingImageUncheckedUpdateWithoutListingInput>;
};
export type ListingImageUpdateManyWithWhereWithoutListingInput = {
    where: Prisma.ListingImageScalarWhereInput;
    data: Prisma.XOR<Prisma.ListingImageUpdateManyMutationInput, Prisma.ListingImageUncheckedUpdateManyWithoutListingInput>;
};
export type ListingImageScalarWhereInput = {
    AND?: Prisma.ListingImageScalarWhereInput | Prisma.ListingImageScalarWhereInput[];
    OR?: Prisma.ListingImageScalarWhereInput[];
    NOT?: Prisma.ListingImageScalarWhereInput | Prisma.ListingImageScalarWhereInput[];
    id?: Prisma.UuidFilter<"ListingImage"> | string;
    url?: Prisma.StringFilter<"ListingImage"> | string;
    alt?: Prisma.StringNullableFilter<"ListingImage"> | string | null;
    sortOrder?: Prisma.IntFilter<"ListingImage"> | number;
    listingId?: Prisma.UuidFilter<"ListingImage"> | string;
};
export type ListingImageCreateManyListingInput = {
    id?: string;
    url: string;
    alt?: string | null;
    sortOrder?: number;
};
export type ListingImageUpdateWithoutListingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    alt?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type ListingImageUncheckedUpdateWithoutListingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    alt?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type ListingImageUncheckedUpdateManyWithoutListingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    alt?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type ListingImageSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    url?: boolean;
    alt?: boolean;
    sortOrder?: boolean;
    listingId?: boolean;
    listing?: boolean | Prisma.ListingDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["listingImage"]>;
export type ListingImageSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    url?: boolean;
    alt?: boolean;
    sortOrder?: boolean;
    listingId?: boolean;
    listing?: boolean | Prisma.ListingDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["listingImage"]>;
export type ListingImageSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    url?: boolean;
    alt?: boolean;
    sortOrder?: boolean;
    listingId?: boolean;
    listing?: boolean | Prisma.ListingDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["listingImage"]>;
export type ListingImageSelectScalar = {
    id?: boolean;
    url?: boolean;
    alt?: boolean;
    sortOrder?: boolean;
    listingId?: boolean;
};
export type ListingImageOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "url" | "alt" | "sortOrder" | "listingId", ExtArgs["result"]["listingImage"]>;
export type ListingImageInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    listing?: boolean | Prisma.ListingDefaultArgs<ExtArgs>;
};
export type ListingImageIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    listing?: boolean | Prisma.ListingDefaultArgs<ExtArgs>;
};
export type ListingImageIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    listing?: boolean | Prisma.ListingDefaultArgs<ExtArgs>;
};
export type $ListingImagePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ListingImage";
    objects: {
        listing: Prisma.$ListingPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        url: string;
        alt: string | null;
        sortOrder: number;
        listingId: string;
    }, ExtArgs["result"]["listingImage"]>;
    composites: {};
};
export type ListingImageGetPayload<S extends boolean | null | undefined | ListingImageDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ListingImagePayload, S>;
export type ListingImageCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ListingImageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ListingImageCountAggregateInputType | true;
};
export interface ListingImageDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ListingImage'];
        meta: {
            name: 'ListingImage';
        };
    };
    findUnique<T extends ListingImageFindUniqueArgs>(args: Prisma.SelectSubset<T, ListingImageFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ListingImageClient<runtime.Types.Result.GetResult<Prisma.$ListingImagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ListingImageFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ListingImageFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ListingImageClient<runtime.Types.Result.GetResult<Prisma.$ListingImagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ListingImageFindFirstArgs>(args?: Prisma.SelectSubset<T, ListingImageFindFirstArgs<ExtArgs>>): Prisma.Prisma__ListingImageClient<runtime.Types.Result.GetResult<Prisma.$ListingImagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ListingImageFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ListingImageFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ListingImageClient<runtime.Types.Result.GetResult<Prisma.$ListingImagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ListingImageFindManyArgs>(args?: Prisma.SelectSubset<T, ListingImageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ListingImagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ListingImageCreateArgs>(args: Prisma.SelectSubset<T, ListingImageCreateArgs<ExtArgs>>): Prisma.Prisma__ListingImageClient<runtime.Types.Result.GetResult<Prisma.$ListingImagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ListingImageCreateManyArgs>(args?: Prisma.SelectSubset<T, ListingImageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ListingImageCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ListingImageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ListingImagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ListingImageDeleteArgs>(args: Prisma.SelectSubset<T, ListingImageDeleteArgs<ExtArgs>>): Prisma.Prisma__ListingImageClient<runtime.Types.Result.GetResult<Prisma.$ListingImagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ListingImageUpdateArgs>(args: Prisma.SelectSubset<T, ListingImageUpdateArgs<ExtArgs>>): Prisma.Prisma__ListingImageClient<runtime.Types.Result.GetResult<Prisma.$ListingImagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ListingImageDeleteManyArgs>(args?: Prisma.SelectSubset<T, ListingImageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ListingImageUpdateManyArgs>(args: Prisma.SelectSubset<T, ListingImageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ListingImageUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ListingImageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ListingImagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ListingImageUpsertArgs>(args: Prisma.SelectSubset<T, ListingImageUpsertArgs<ExtArgs>>): Prisma.Prisma__ListingImageClient<runtime.Types.Result.GetResult<Prisma.$ListingImagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ListingImageCountArgs>(args?: Prisma.Subset<T, ListingImageCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ListingImageCountAggregateOutputType> : number>;
    aggregate<T extends ListingImageAggregateArgs>(args: Prisma.Subset<T, ListingImageAggregateArgs>): Prisma.PrismaPromise<GetListingImageAggregateType<T>>;
    groupBy<T extends ListingImageGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ListingImageGroupByArgs['orderBy'];
    } : {
        orderBy?: ListingImageGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ListingImageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetListingImageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ListingImageFieldRefs;
}
export interface Prisma__ListingImageClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    listing<T extends Prisma.ListingDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ListingDefaultArgs<ExtArgs>>): Prisma.Prisma__ListingClient<runtime.Types.Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ListingImageFieldRefs {
    readonly id: Prisma.FieldRef<"ListingImage", 'String'>;
    readonly url: Prisma.FieldRef<"ListingImage", 'String'>;
    readonly alt: Prisma.FieldRef<"ListingImage", 'String'>;
    readonly sortOrder: Prisma.FieldRef<"ListingImage", 'Int'>;
    readonly listingId: Prisma.FieldRef<"ListingImage", 'String'>;
}
export type ListingImageFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingImageSelect<ExtArgs> | null;
    omit?: Prisma.ListingImageOmit<ExtArgs> | null;
    include?: Prisma.ListingImageInclude<ExtArgs> | null;
    where: Prisma.ListingImageWhereUniqueInput;
};
export type ListingImageFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingImageSelect<ExtArgs> | null;
    omit?: Prisma.ListingImageOmit<ExtArgs> | null;
    include?: Prisma.ListingImageInclude<ExtArgs> | null;
    where: Prisma.ListingImageWhereUniqueInput;
};
export type ListingImageFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingImageSelect<ExtArgs> | null;
    omit?: Prisma.ListingImageOmit<ExtArgs> | null;
    include?: Prisma.ListingImageInclude<ExtArgs> | null;
    where?: Prisma.ListingImageWhereInput;
    orderBy?: Prisma.ListingImageOrderByWithRelationInput | Prisma.ListingImageOrderByWithRelationInput[];
    cursor?: Prisma.ListingImageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ListingImageScalarFieldEnum | Prisma.ListingImageScalarFieldEnum[];
};
export type ListingImageFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingImageSelect<ExtArgs> | null;
    omit?: Prisma.ListingImageOmit<ExtArgs> | null;
    include?: Prisma.ListingImageInclude<ExtArgs> | null;
    where?: Prisma.ListingImageWhereInput;
    orderBy?: Prisma.ListingImageOrderByWithRelationInput | Prisma.ListingImageOrderByWithRelationInput[];
    cursor?: Prisma.ListingImageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ListingImageScalarFieldEnum | Prisma.ListingImageScalarFieldEnum[];
};
export type ListingImageFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingImageSelect<ExtArgs> | null;
    omit?: Prisma.ListingImageOmit<ExtArgs> | null;
    include?: Prisma.ListingImageInclude<ExtArgs> | null;
    where?: Prisma.ListingImageWhereInput;
    orderBy?: Prisma.ListingImageOrderByWithRelationInput | Prisma.ListingImageOrderByWithRelationInput[];
    cursor?: Prisma.ListingImageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ListingImageScalarFieldEnum | Prisma.ListingImageScalarFieldEnum[];
};
export type ListingImageCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingImageSelect<ExtArgs> | null;
    omit?: Prisma.ListingImageOmit<ExtArgs> | null;
    include?: Prisma.ListingImageInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ListingImageCreateInput, Prisma.ListingImageUncheckedCreateInput>;
};
export type ListingImageCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ListingImageCreateManyInput | Prisma.ListingImageCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ListingImageCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingImageSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ListingImageOmit<ExtArgs> | null;
    data: Prisma.ListingImageCreateManyInput | Prisma.ListingImageCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ListingImageIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ListingImageUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingImageSelect<ExtArgs> | null;
    omit?: Prisma.ListingImageOmit<ExtArgs> | null;
    include?: Prisma.ListingImageInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ListingImageUpdateInput, Prisma.ListingImageUncheckedUpdateInput>;
    where: Prisma.ListingImageWhereUniqueInput;
};
export type ListingImageUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ListingImageUpdateManyMutationInput, Prisma.ListingImageUncheckedUpdateManyInput>;
    where?: Prisma.ListingImageWhereInput;
    limit?: number;
};
export type ListingImageUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingImageSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ListingImageOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ListingImageUpdateManyMutationInput, Prisma.ListingImageUncheckedUpdateManyInput>;
    where?: Prisma.ListingImageWhereInput;
    limit?: number;
    include?: Prisma.ListingImageIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ListingImageUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingImageSelect<ExtArgs> | null;
    omit?: Prisma.ListingImageOmit<ExtArgs> | null;
    include?: Prisma.ListingImageInclude<ExtArgs> | null;
    where: Prisma.ListingImageWhereUniqueInput;
    create: Prisma.XOR<Prisma.ListingImageCreateInput, Prisma.ListingImageUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ListingImageUpdateInput, Prisma.ListingImageUncheckedUpdateInput>;
};
export type ListingImageDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingImageSelect<ExtArgs> | null;
    omit?: Prisma.ListingImageOmit<ExtArgs> | null;
    include?: Prisma.ListingImageInclude<ExtArgs> | null;
    where: Prisma.ListingImageWhereUniqueInput;
};
export type ListingImageDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ListingImageWhereInput;
    limit?: number;
};
export type ListingImageDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListingImageSelect<ExtArgs> | null;
    omit?: Prisma.ListingImageOmit<ExtArgs> | null;
    include?: Prisma.ListingImageInclude<ExtArgs> | null;
};
