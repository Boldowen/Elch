import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type PostImageModel = runtime.Types.Result.DefaultSelection<Prisma.$PostImagePayload>;
export type AggregatePostImage = {
    _count: PostImageCountAggregateOutputType | null;
    _avg: PostImageAvgAggregateOutputType | null;
    _sum: PostImageSumAggregateOutputType | null;
    _min: PostImageMinAggregateOutputType | null;
    _max: PostImageMaxAggregateOutputType | null;
};
export type PostImageAvgAggregateOutputType = {
    sortOrder: number | null;
};
export type PostImageSumAggregateOutputType = {
    sortOrder: number | null;
};
export type PostImageMinAggregateOutputType = {
    id: string | null;
    postId: string | null;
    url: string | null;
    sortOrder: number | null;
};
export type PostImageMaxAggregateOutputType = {
    id: string | null;
    postId: string | null;
    url: string | null;
    sortOrder: number | null;
};
export type PostImageCountAggregateOutputType = {
    id: number;
    postId: number;
    url: number;
    sortOrder: number;
    _all: number;
};
export type PostImageAvgAggregateInputType = {
    sortOrder?: true;
};
export type PostImageSumAggregateInputType = {
    sortOrder?: true;
};
export type PostImageMinAggregateInputType = {
    id?: true;
    postId?: true;
    url?: true;
    sortOrder?: true;
};
export type PostImageMaxAggregateInputType = {
    id?: true;
    postId?: true;
    url?: true;
    sortOrder?: true;
};
export type PostImageCountAggregateInputType = {
    id?: true;
    postId?: true;
    url?: true;
    sortOrder?: true;
    _all?: true;
};
export type PostImageAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PostImageWhereInput;
    orderBy?: Prisma.PostImageOrderByWithRelationInput | Prisma.PostImageOrderByWithRelationInput[];
    cursor?: Prisma.PostImageWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PostImageCountAggregateInputType;
    _avg?: PostImageAvgAggregateInputType;
    _sum?: PostImageSumAggregateInputType;
    _min?: PostImageMinAggregateInputType;
    _max?: PostImageMaxAggregateInputType;
};
export type GetPostImageAggregateType<T extends PostImageAggregateArgs> = {
    [P in keyof T & keyof AggregatePostImage]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePostImage[P]> : Prisma.GetScalarType<T[P], AggregatePostImage[P]>;
};
export type PostImageGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PostImageWhereInput;
    orderBy?: Prisma.PostImageOrderByWithAggregationInput | Prisma.PostImageOrderByWithAggregationInput[];
    by: Prisma.PostImageScalarFieldEnum[] | Prisma.PostImageScalarFieldEnum;
    having?: Prisma.PostImageScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PostImageCountAggregateInputType | true;
    _avg?: PostImageAvgAggregateInputType;
    _sum?: PostImageSumAggregateInputType;
    _min?: PostImageMinAggregateInputType;
    _max?: PostImageMaxAggregateInputType;
};
export type PostImageGroupByOutputType = {
    id: string;
    postId: string;
    url: string;
    sortOrder: number;
    _count: PostImageCountAggregateOutputType | null;
    _avg: PostImageAvgAggregateOutputType | null;
    _sum: PostImageSumAggregateOutputType | null;
    _min: PostImageMinAggregateOutputType | null;
    _max: PostImageMaxAggregateOutputType | null;
};
export type GetPostImageGroupByPayload<T extends PostImageGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PostImageGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PostImageGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PostImageGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PostImageGroupByOutputType[P]>;
}>>;
export type PostImageWhereInput = {
    AND?: Prisma.PostImageWhereInput | Prisma.PostImageWhereInput[];
    OR?: Prisma.PostImageWhereInput[];
    NOT?: Prisma.PostImageWhereInput | Prisma.PostImageWhereInput[];
    id?: Prisma.UuidFilter<"PostImage"> | string;
    postId?: Prisma.UuidFilter<"PostImage"> | string;
    url?: Prisma.StringFilter<"PostImage"> | string;
    sortOrder?: Prisma.IntFilter<"PostImage"> | number;
    post?: Prisma.XOR<Prisma.PostScalarRelationFilter, Prisma.PostWhereInput>;
};
export type PostImageOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    postId?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    post?: Prisma.PostOrderByWithRelationInput;
};
export type PostImageWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.PostImageWhereInput | Prisma.PostImageWhereInput[];
    OR?: Prisma.PostImageWhereInput[];
    NOT?: Prisma.PostImageWhereInput | Prisma.PostImageWhereInput[];
    postId?: Prisma.UuidFilter<"PostImage"> | string;
    url?: Prisma.StringFilter<"PostImage"> | string;
    sortOrder?: Prisma.IntFilter<"PostImage"> | number;
    post?: Prisma.XOR<Prisma.PostScalarRelationFilter, Prisma.PostWhereInput>;
}, "id">;
export type PostImageOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    postId?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    _count?: Prisma.PostImageCountOrderByAggregateInput;
    _avg?: Prisma.PostImageAvgOrderByAggregateInput;
    _max?: Prisma.PostImageMaxOrderByAggregateInput;
    _min?: Prisma.PostImageMinOrderByAggregateInput;
    _sum?: Prisma.PostImageSumOrderByAggregateInput;
};
export type PostImageScalarWhereWithAggregatesInput = {
    AND?: Prisma.PostImageScalarWhereWithAggregatesInput | Prisma.PostImageScalarWhereWithAggregatesInput[];
    OR?: Prisma.PostImageScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PostImageScalarWhereWithAggregatesInput | Prisma.PostImageScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"PostImage"> | string;
    postId?: Prisma.UuidWithAggregatesFilter<"PostImage"> | string;
    url?: Prisma.StringWithAggregatesFilter<"PostImage"> | string;
    sortOrder?: Prisma.IntWithAggregatesFilter<"PostImage"> | number;
};
export type PostImageCreateInput = {
    id?: string;
    url: string;
    sortOrder?: number;
    post: Prisma.PostCreateNestedOneWithoutImagesInput;
};
export type PostImageUncheckedCreateInput = {
    id?: string;
    postId: string;
    url: string;
    sortOrder?: number;
};
export type PostImageUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    post?: Prisma.PostUpdateOneRequiredWithoutImagesNestedInput;
};
export type PostImageUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    postId?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type PostImageCreateManyInput = {
    id?: string;
    postId: string;
    url: string;
    sortOrder?: number;
};
export type PostImageUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type PostImageUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    postId?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type PostImageListRelationFilter = {
    every?: Prisma.PostImageWhereInput;
    some?: Prisma.PostImageWhereInput;
    none?: Prisma.PostImageWhereInput;
};
export type PostImageOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type PostImageCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    postId?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
};
export type PostImageAvgOrderByAggregateInput = {
    sortOrder?: Prisma.SortOrder;
};
export type PostImageMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    postId?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
};
export type PostImageMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    postId?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
};
export type PostImageSumOrderByAggregateInput = {
    sortOrder?: Prisma.SortOrder;
};
export type PostImageCreateNestedManyWithoutPostInput = {
    create?: Prisma.XOR<Prisma.PostImageCreateWithoutPostInput, Prisma.PostImageUncheckedCreateWithoutPostInput> | Prisma.PostImageCreateWithoutPostInput[] | Prisma.PostImageUncheckedCreateWithoutPostInput[];
    connectOrCreate?: Prisma.PostImageCreateOrConnectWithoutPostInput | Prisma.PostImageCreateOrConnectWithoutPostInput[];
    createMany?: Prisma.PostImageCreateManyPostInputEnvelope;
    connect?: Prisma.PostImageWhereUniqueInput | Prisma.PostImageWhereUniqueInput[];
};
export type PostImageUncheckedCreateNestedManyWithoutPostInput = {
    create?: Prisma.XOR<Prisma.PostImageCreateWithoutPostInput, Prisma.PostImageUncheckedCreateWithoutPostInput> | Prisma.PostImageCreateWithoutPostInput[] | Prisma.PostImageUncheckedCreateWithoutPostInput[];
    connectOrCreate?: Prisma.PostImageCreateOrConnectWithoutPostInput | Prisma.PostImageCreateOrConnectWithoutPostInput[];
    createMany?: Prisma.PostImageCreateManyPostInputEnvelope;
    connect?: Prisma.PostImageWhereUniqueInput | Prisma.PostImageWhereUniqueInput[];
};
export type PostImageUpdateManyWithoutPostNestedInput = {
    create?: Prisma.XOR<Prisma.PostImageCreateWithoutPostInput, Prisma.PostImageUncheckedCreateWithoutPostInput> | Prisma.PostImageCreateWithoutPostInput[] | Prisma.PostImageUncheckedCreateWithoutPostInput[];
    connectOrCreate?: Prisma.PostImageCreateOrConnectWithoutPostInput | Prisma.PostImageCreateOrConnectWithoutPostInput[];
    upsert?: Prisma.PostImageUpsertWithWhereUniqueWithoutPostInput | Prisma.PostImageUpsertWithWhereUniqueWithoutPostInput[];
    createMany?: Prisma.PostImageCreateManyPostInputEnvelope;
    set?: Prisma.PostImageWhereUniqueInput | Prisma.PostImageWhereUniqueInput[];
    disconnect?: Prisma.PostImageWhereUniqueInput | Prisma.PostImageWhereUniqueInput[];
    delete?: Prisma.PostImageWhereUniqueInput | Prisma.PostImageWhereUniqueInput[];
    connect?: Prisma.PostImageWhereUniqueInput | Prisma.PostImageWhereUniqueInput[];
    update?: Prisma.PostImageUpdateWithWhereUniqueWithoutPostInput | Prisma.PostImageUpdateWithWhereUniqueWithoutPostInput[];
    updateMany?: Prisma.PostImageUpdateManyWithWhereWithoutPostInput | Prisma.PostImageUpdateManyWithWhereWithoutPostInput[];
    deleteMany?: Prisma.PostImageScalarWhereInput | Prisma.PostImageScalarWhereInput[];
};
export type PostImageUncheckedUpdateManyWithoutPostNestedInput = {
    create?: Prisma.XOR<Prisma.PostImageCreateWithoutPostInput, Prisma.PostImageUncheckedCreateWithoutPostInput> | Prisma.PostImageCreateWithoutPostInput[] | Prisma.PostImageUncheckedCreateWithoutPostInput[];
    connectOrCreate?: Prisma.PostImageCreateOrConnectWithoutPostInput | Prisma.PostImageCreateOrConnectWithoutPostInput[];
    upsert?: Prisma.PostImageUpsertWithWhereUniqueWithoutPostInput | Prisma.PostImageUpsertWithWhereUniqueWithoutPostInput[];
    createMany?: Prisma.PostImageCreateManyPostInputEnvelope;
    set?: Prisma.PostImageWhereUniqueInput | Prisma.PostImageWhereUniqueInput[];
    disconnect?: Prisma.PostImageWhereUniqueInput | Prisma.PostImageWhereUniqueInput[];
    delete?: Prisma.PostImageWhereUniqueInput | Prisma.PostImageWhereUniqueInput[];
    connect?: Prisma.PostImageWhereUniqueInput | Prisma.PostImageWhereUniqueInput[];
    update?: Prisma.PostImageUpdateWithWhereUniqueWithoutPostInput | Prisma.PostImageUpdateWithWhereUniqueWithoutPostInput[];
    updateMany?: Prisma.PostImageUpdateManyWithWhereWithoutPostInput | Prisma.PostImageUpdateManyWithWhereWithoutPostInput[];
    deleteMany?: Prisma.PostImageScalarWhereInput | Prisma.PostImageScalarWhereInput[];
};
export type PostImageCreateWithoutPostInput = {
    id?: string;
    url: string;
    sortOrder?: number;
};
export type PostImageUncheckedCreateWithoutPostInput = {
    id?: string;
    url: string;
    sortOrder?: number;
};
export type PostImageCreateOrConnectWithoutPostInput = {
    where: Prisma.PostImageWhereUniqueInput;
    create: Prisma.XOR<Prisma.PostImageCreateWithoutPostInput, Prisma.PostImageUncheckedCreateWithoutPostInput>;
};
export type PostImageCreateManyPostInputEnvelope = {
    data: Prisma.PostImageCreateManyPostInput | Prisma.PostImageCreateManyPostInput[];
    skipDuplicates?: boolean;
};
export type PostImageUpsertWithWhereUniqueWithoutPostInput = {
    where: Prisma.PostImageWhereUniqueInput;
    update: Prisma.XOR<Prisma.PostImageUpdateWithoutPostInput, Prisma.PostImageUncheckedUpdateWithoutPostInput>;
    create: Prisma.XOR<Prisma.PostImageCreateWithoutPostInput, Prisma.PostImageUncheckedCreateWithoutPostInput>;
};
export type PostImageUpdateWithWhereUniqueWithoutPostInput = {
    where: Prisma.PostImageWhereUniqueInput;
    data: Prisma.XOR<Prisma.PostImageUpdateWithoutPostInput, Prisma.PostImageUncheckedUpdateWithoutPostInput>;
};
export type PostImageUpdateManyWithWhereWithoutPostInput = {
    where: Prisma.PostImageScalarWhereInput;
    data: Prisma.XOR<Prisma.PostImageUpdateManyMutationInput, Prisma.PostImageUncheckedUpdateManyWithoutPostInput>;
};
export type PostImageScalarWhereInput = {
    AND?: Prisma.PostImageScalarWhereInput | Prisma.PostImageScalarWhereInput[];
    OR?: Prisma.PostImageScalarWhereInput[];
    NOT?: Prisma.PostImageScalarWhereInput | Prisma.PostImageScalarWhereInput[];
    id?: Prisma.UuidFilter<"PostImage"> | string;
    postId?: Prisma.UuidFilter<"PostImage"> | string;
    url?: Prisma.StringFilter<"PostImage"> | string;
    sortOrder?: Prisma.IntFilter<"PostImage"> | number;
};
export type PostImageCreateManyPostInput = {
    id?: string;
    url: string;
    sortOrder?: number;
};
export type PostImageUpdateWithoutPostInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type PostImageUncheckedUpdateWithoutPostInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type PostImageUncheckedUpdateManyWithoutPostInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type PostImageSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    postId?: boolean;
    url?: boolean;
    sortOrder?: boolean;
    post?: boolean | Prisma.PostDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["postImage"]>;
export type PostImageSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    postId?: boolean;
    url?: boolean;
    sortOrder?: boolean;
    post?: boolean | Prisma.PostDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["postImage"]>;
export type PostImageSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    postId?: boolean;
    url?: boolean;
    sortOrder?: boolean;
    post?: boolean | Prisma.PostDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["postImage"]>;
export type PostImageSelectScalar = {
    id?: boolean;
    postId?: boolean;
    url?: boolean;
    sortOrder?: boolean;
};
export type PostImageOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "postId" | "url" | "sortOrder", ExtArgs["result"]["postImage"]>;
export type PostImageInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    post?: boolean | Prisma.PostDefaultArgs<ExtArgs>;
};
export type PostImageIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    post?: boolean | Prisma.PostDefaultArgs<ExtArgs>;
};
export type PostImageIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    post?: boolean | Prisma.PostDefaultArgs<ExtArgs>;
};
export type $PostImagePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PostImage";
    objects: {
        post: Prisma.$PostPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        postId: string;
        url: string;
        sortOrder: number;
    }, ExtArgs["result"]["postImage"]>;
    composites: {};
};
export type PostImageGetPayload<S extends boolean | null | undefined | PostImageDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PostImagePayload, S>;
export type PostImageCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PostImageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PostImageCountAggregateInputType | true;
};
export interface PostImageDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PostImage'];
        meta: {
            name: 'PostImage';
        };
    };
    findUnique<T extends PostImageFindUniqueArgs>(args: Prisma.SelectSubset<T, PostImageFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PostImageClient<runtime.Types.Result.GetResult<Prisma.$PostImagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PostImageFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PostImageFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PostImageClient<runtime.Types.Result.GetResult<Prisma.$PostImagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PostImageFindFirstArgs>(args?: Prisma.SelectSubset<T, PostImageFindFirstArgs<ExtArgs>>): Prisma.Prisma__PostImageClient<runtime.Types.Result.GetResult<Prisma.$PostImagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PostImageFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PostImageFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PostImageClient<runtime.Types.Result.GetResult<Prisma.$PostImagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PostImageFindManyArgs>(args?: Prisma.SelectSubset<T, PostImageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PostImagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PostImageCreateArgs>(args: Prisma.SelectSubset<T, PostImageCreateArgs<ExtArgs>>): Prisma.Prisma__PostImageClient<runtime.Types.Result.GetResult<Prisma.$PostImagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PostImageCreateManyArgs>(args?: Prisma.SelectSubset<T, PostImageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PostImageCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PostImageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PostImagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PostImageDeleteArgs>(args: Prisma.SelectSubset<T, PostImageDeleteArgs<ExtArgs>>): Prisma.Prisma__PostImageClient<runtime.Types.Result.GetResult<Prisma.$PostImagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PostImageUpdateArgs>(args: Prisma.SelectSubset<T, PostImageUpdateArgs<ExtArgs>>): Prisma.Prisma__PostImageClient<runtime.Types.Result.GetResult<Prisma.$PostImagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PostImageDeleteManyArgs>(args?: Prisma.SelectSubset<T, PostImageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PostImageUpdateManyArgs>(args: Prisma.SelectSubset<T, PostImageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PostImageUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PostImageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PostImagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PostImageUpsertArgs>(args: Prisma.SelectSubset<T, PostImageUpsertArgs<ExtArgs>>): Prisma.Prisma__PostImageClient<runtime.Types.Result.GetResult<Prisma.$PostImagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PostImageCountArgs>(args?: Prisma.Subset<T, PostImageCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PostImageCountAggregateOutputType> : number>;
    aggregate<T extends PostImageAggregateArgs>(args: Prisma.Subset<T, PostImageAggregateArgs>): Prisma.PrismaPromise<GetPostImageAggregateType<T>>;
    groupBy<T extends PostImageGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PostImageGroupByArgs['orderBy'];
    } : {
        orderBy?: PostImageGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PostImageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPostImageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PostImageFieldRefs;
}
export interface Prisma__PostImageClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    post<T extends Prisma.PostDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PostDefaultArgs<ExtArgs>>): Prisma.Prisma__PostClient<runtime.Types.Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PostImageFieldRefs {
    readonly id: Prisma.FieldRef<"PostImage", 'String'>;
    readonly postId: Prisma.FieldRef<"PostImage", 'String'>;
    readonly url: Prisma.FieldRef<"PostImage", 'String'>;
    readonly sortOrder: Prisma.FieldRef<"PostImage", 'Int'>;
}
export type PostImageFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PostImageSelect<ExtArgs> | null;
    omit?: Prisma.PostImageOmit<ExtArgs> | null;
    include?: Prisma.PostImageInclude<ExtArgs> | null;
    where: Prisma.PostImageWhereUniqueInput;
};
export type PostImageFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PostImageSelect<ExtArgs> | null;
    omit?: Prisma.PostImageOmit<ExtArgs> | null;
    include?: Prisma.PostImageInclude<ExtArgs> | null;
    where: Prisma.PostImageWhereUniqueInput;
};
export type PostImageFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PostImageSelect<ExtArgs> | null;
    omit?: Prisma.PostImageOmit<ExtArgs> | null;
    include?: Prisma.PostImageInclude<ExtArgs> | null;
    where?: Prisma.PostImageWhereInput;
    orderBy?: Prisma.PostImageOrderByWithRelationInput | Prisma.PostImageOrderByWithRelationInput[];
    cursor?: Prisma.PostImageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PostImageScalarFieldEnum | Prisma.PostImageScalarFieldEnum[];
};
export type PostImageFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PostImageSelect<ExtArgs> | null;
    omit?: Prisma.PostImageOmit<ExtArgs> | null;
    include?: Prisma.PostImageInclude<ExtArgs> | null;
    where?: Prisma.PostImageWhereInput;
    orderBy?: Prisma.PostImageOrderByWithRelationInput | Prisma.PostImageOrderByWithRelationInput[];
    cursor?: Prisma.PostImageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PostImageScalarFieldEnum | Prisma.PostImageScalarFieldEnum[];
};
export type PostImageFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PostImageSelect<ExtArgs> | null;
    omit?: Prisma.PostImageOmit<ExtArgs> | null;
    include?: Prisma.PostImageInclude<ExtArgs> | null;
    where?: Prisma.PostImageWhereInput;
    orderBy?: Prisma.PostImageOrderByWithRelationInput | Prisma.PostImageOrderByWithRelationInput[];
    cursor?: Prisma.PostImageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PostImageScalarFieldEnum | Prisma.PostImageScalarFieldEnum[];
};
export type PostImageCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PostImageSelect<ExtArgs> | null;
    omit?: Prisma.PostImageOmit<ExtArgs> | null;
    include?: Prisma.PostImageInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PostImageCreateInput, Prisma.PostImageUncheckedCreateInput>;
};
export type PostImageCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PostImageCreateManyInput | Prisma.PostImageCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PostImageCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PostImageSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PostImageOmit<ExtArgs> | null;
    data: Prisma.PostImageCreateManyInput | Prisma.PostImageCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.PostImageIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type PostImageUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PostImageSelect<ExtArgs> | null;
    omit?: Prisma.PostImageOmit<ExtArgs> | null;
    include?: Prisma.PostImageInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PostImageUpdateInput, Prisma.PostImageUncheckedUpdateInput>;
    where: Prisma.PostImageWhereUniqueInput;
};
export type PostImageUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PostImageUpdateManyMutationInput, Prisma.PostImageUncheckedUpdateManyInput>;
    where?: Prisma.PostImageWhereInput;
    limit?: number;
};
export type PostImageUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PostImageSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PostImageOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PostImageUpdateManyMutationInput, Prisma.PostImageUncheckedUpdateManyInput>;
    where?: Prisma.PostImageWhereInput;
    limit?: number;
    include?: Prisma.PostImageIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type PostImageUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PostImageSelect<ExtArgs> | null;
    omit?: Prisma.PostImageOmit<ExtArgs> | null;
    include?: Prisma.PostImageInclude<ExtArgs> | null;
    where: Prisma.PostImageWhereUniqueInput;
    create: Prisma.XOR<Prisma.PostImageCreateInput, Prisma.PostImageUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PostImageUpdateInput, Prisma.PostImageUncheckedUpdateInput>;
};
export type PostImageDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PostImageSelect<ExtArgs> | null;
    omit?: Prisma.PostImageOmit<ExtArgs> | null;
    include?: Prisma.PostImageInclude<ExtArgs> | null;
    where: Prisma.PostImageWhereUniqueInput;
};
export type PostImageDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PostImageWhereInput;
    limit?: number;
};
export type PostImageDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PostImageSelect<ExtArgs> | null;
    omit?: Prisma.PostImageOmit<ExtArgs> | null;
    include?: Prisma.PostImageInclude<ExtArgs> | null;
};
