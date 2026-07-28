import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type PostCommentModel = runtime.Types.Result.DefaultSelection<Prisma.$PostCommentPayload>;
export type AggregatePostComment = {
    _count: PostCommentCountAggregateOutputType | null;
    _min: PostCommentMinAggregateOutputType | null;
    _max: PostCommentMaxAggregateOutputType | null;
};
export type PostCommentMinAggregateOutputType = {
    id: string | null;
    postId: string | null;
    authorId: string | null;
    text: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
};
export type PostCommentMaxAggregateOutputType = {
    id: string | null;
    postId: string | null;
    authorId: string | null;
    text: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
};
export type PostCommentCountAggregateOutputType = {
    id: number;
    postId: number;
    authorId: number;
    text: number;
    createdAt: number;
    updatedAt: number;
    deletedAt: number;
    _all: number;
};
export type PostCommentMinAggregateInputType = {
    id?: true;
    postId?: true;
    authorId?: true;
    text?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
};
export type PostCommentMaxAggregateInputType = {
    id?: true;
    postId?: true;
    authorId?: true;
    text?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
};
export type PostCommentCountAggregateInputType = {
    id?: true;
    postId?: true;
    authorId?: true;
    text?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
    _all?: true;
};
export type PostCommentAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PostCommentWhereInput;
    orderBy?: Prisma.PostCommentOrderByWithRelationInput | Prisma.PostCommentOrderByWithRelationInput[];
    cursor?: Prisma.PostCommentWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PostCommentCountAggregateInputType;
    _min?: PostCommentMinAggregateInputType;
    _max?: PostCommentMaxAggregateInputType;
};
export type GetPostCommentAggregateType<T extends PostCommentAggregateArgs> = {
    [P in keyof T & keyof AggregatePostComment]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePostComment[P]> : Prisma.GetScalarType<T[P], AggregatePostComment[P]>;
};
export type PostCommentGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PostCommentWhereInput;
    orderBy?: Prisma.PostCommentOrderByWithAggregationInput | Prisma.PostCommentOrderByWithAggregationInput[];
    by: Prisma.PostCommentScalarFieldEnum[] | Prisma.PostCommentScalarFieldEnum;
    having?: Prisma.PostCommentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PostCommentCountAggregateInputType | true;
    _min?: PostCommentMinAggregateInputType;
    _max?: PostCommentMaxAggregateInputType;
};
export type PostCommentGroupByOutputType = {
    id: string;
    postId: string;
    authorId: string;
    text: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    _count: PostCommentCountAggregateOutputType | null;
    _min: PostCommentMinAggregateOutputType | null;
    _max: PostCommentMaxAggregateOutputType | null;
};
export type GetPostCommentGroupByPayload<T extends PostCommentGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PostCommentGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PostCommentGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PostCommentGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PostCommentGroupByOutputType[P]>;
}>>;
export type PostCommentWhereInput = {
    AND?: Prisma.PostCommentWhereInput | Prisma.PostCommentWhereInput[];
    OR?: Prisma.PostCommentWhereInput[];
    NOT?: Prisma.PostCommentWhereInput | Prisma.PostCommentWhereInput[];
    id?: Prisma.UuidFilter<"PostComment"> | string;
    postId?: Prisma.UuidFilter<"PostComment"> | string;
    authorId?: Prisma.UuidFilter<"PostComment"> | string;
    text?: Prisma.StringFilter<"PostComment"> | string;
    createdAt?: Prisma.DateTimeFilter<"PostComment"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"PostComment"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"PostComment"> | Date | string | null;
    post?: Prisma.XOR<Prisma.PostScalarRelationFilter, Prisma.PostWhereInput>;
    author?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type PostCommentOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    postId?: Prisma.SortOrder;
    authorId?: Prisma.SortOrder;
    text?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    post?: Prisma.PostOrderByWithRelationInput;
    author?: Prisma.UserOrderByWithRelationInput;
};
export type PostCommentWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.PostCommentWhereInput | Prisma.PostCommentWhereInput[];
    OR?: Prisma.PostCommentWhereInput[];
    NOT?: Prisma.PostCommentWhereInput | Prisma.PostCommentWhereInput[];
    postId?: Prisma.UuidFilter<"PostComment"> | string;
    authorId?: Prisma.UuidFilter<"PostComment"> | string;
    text?: Prisma.StringFilter<"PostComment"> | string;
    createdAt?: Prisma.DateTimeFilter<"PostComment"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"PostComment"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"PostComment"> | Date | string | null;
    post?: Prisma.XOR<Prisma.PostScalarRelationFilter, Prisma.PostWhereInput>;
    author?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id">;
export type PostCommentOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    postId?: Prisma.SortOrder;
    authorId?: Prisma.SortOrder;
    text?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.PostCommentCountOrderByAggregateInput;
    _max?: Prisma.PostCommentMaxOrderByAggregateInput;
    _min?: Prisma.PostCommentMinOrderByAggregateInput;
};
export type PostCommentScalarWhereWithAggregatesInput = {
    AND?: Prisma.PostCommentScalarWhereWithAggregatesInput | Prisma.PostCommentScalarWhereWithAggregatesInput[];
    OR?: Prisma.PostCommentScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PostCommentScalarWhereWithAggregatesInput | Prisma.PostCommentScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"PostComment"> | string;
    postId?: Prisma.UuidWithAggregatesFilter<"PostComment"> | string;
    authorId?: Prisma.UuidWithAggregatesFilter<"PostComment"> | string;
    text?: Prisma.StringWithAggregatesFilter<"PostComment"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"PostComment"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"PostComment"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"PostComment"> | Date | string | null;
};
export type PostCommentCreateInput = {
    id?: string;
    text: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    post: Prisma.PostCreateNestedOneWithoutCommentsInput;
    author: Prisma.UserCreateNestedOneWithoutPostCommentsInput;
};
export type PostCommentUncheckedCreateInput = {
    id?: string;
    postId: string;
    authorId: string;
    text: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type PostCommentUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    post?: Prisma.PostUpdateOneRequiredWithoutCommentsNestedInput;
    author?: Prisma.UserUpdateOneRequiredWithoutPostCommentsNestedInput;
};
export type PostCommentUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    postId?: Prisma.StringFieldUpdateOperationsInput | string;
    authorId?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type PostCommentCreateManyInput = {
    id?: string;
    postId: string;
    authorId: string;
    text: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type PostCommentUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type PostCommentUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    postId?: Prisma.StringFieldUpdateOperationsInput | string;
    authorId?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type PostCommentListRelationFilter = {
    every?: Prisma.PostCommentWhereInput;
    some?: Prisma.PostCommentWhereInput;
    none?: Prisma.PostCommentWhereInput;
};
export type PostCommentOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type PostCommentCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    postId?: Prisma.SortOrder;
    authorId?: Prisma.SortOrder;
    text?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type PostCommentMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    postId?: Prisma.SortOrder;
    authorId?: Prisma.SortOrder;
    text?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type PostCommentMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    postId?: Prisma.SortOrder;
    authorId?: Prisma.SortOrder;
    text?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type PostCommentCreateNestedManyWithoutAuthorInput = {
    create?: Prisma.XOR<Prisma.PostCommentCreateWithoutAuthorInput, Prisma.PostCommentUncheckedCreateWithoutAuthorInput> | Prisma.PostCommentCreateWithoutAuthorInput[] | Prisma.PostCommentUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?: Prisma.PostCommentCreateOrConnectWithoutAuthorInput | Prisma.PostCommentCreateOrConnectWithoutAuthorInput[];
    createMany?: Prisma.PostCommentCreateManyAuthorInputEnvelope;
    connect?: Prisma.PostCommentWhereUniqueInput | Prisma.PostCommentWhereUniqueInput[];
};
export type PostCommentUncheckedCreateNestedManyWithoutAuthorInput = {
    create?: Prisma.XOR<Prisma.PostCommentCreateWithoutAuthorInput, Prisma.PostCommentUncheckedCreateWithoutAuthorInput> | Prisma.PostCommentCreateWithoutAuthorInput[] | Prisma.PostCommentUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?: Prisma.PostCommentCreateOrConnectWithoutAuthorInput | Prisma.PostCommentCreateOrConnectWithoutAuthorInput[];
    createMany?: Prisma.PostCommentCreateManyAuthorInputEnvelope;
    connect?: Prisma.PostCommentWhereUniqueInput | Prisma.PostCommentWhereUniqueInput[];
};
export type PostCommentUpdateManyWithoutAuthorNestedInput = {
    create?: Prisma.XOR<Prisma.PostCommentCreateWithoutAuthorInput, Prisma.PostCommentUncheckedCreateWithoutAuthorInput> | Prisma.PostCommentCreateWithoutAuthorInput[] | Prisma.PostCommentUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?: Prisma.PostCommentCreateOrConnectWithoutAuthorInput | Prisma.PostCommentCreateOrConnectWithoutAuthorInput[];
    upsert?: Prisma.PostCommentUpsertWithWhereUniqueWithoutAuthorInput | Prisma.PostCommentUpsertWithWhereUniqueWithoutAuthorInput[];
    createMany?: Prisma.PostCommentCreateManyAuthorInputEnvelope;
    set?: Prisma.PostCommentWhereUniqueInput | Prisma.PostCommentWhereUniqueInput[];
    disconnect?: Prisma.PostCommentWhereUniqueInput | Prisma.PostCommentWhereUniqueInput[];
    delete?: Prisma.PostCommentWhereUniqueInput | Prisma.PostCommentWhereUniqueInput[];
    connect?: Prisma.PostCommentWhereUniqueInput | Prisma.PostCommentWhereUniqueInput[];
    update?: Prisma.PostCommentUpdateWithWhereUniqueWithoutAuthorInput | Prisma.PostCommentUpdateWithWhereUniqueWithoutAuthorInput[];
    updateMany?: Prisma.PostCommentUpdateManyWithWhereWithoutAuthorInput | Prisma.PostCommentUpdateManyWithWhereWithoutAuthorInput[];
    deleteMany?: Prisma.PostCommentScalarWhereInput | Prisma.PostCommentScalarWhereInput[];
};
export type PostCommentUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?: Prisma.XOR<Prisma.PostCommentCreateWithoutAuthorInput, Prisma.PostCommentUncheckedCreateWithoutAuthorInput> | Prisma.PostCommentCreateWithoutAuthorInput[] | Prisma.PostCommentUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?: Prisma.PostCommentCreateOrConnectWithoutAuthorInput | Prisma.PostCommentCreateOrConnectWithoutAuthorInput[];
    upsert?: Prisma.PostCommentUpsertWithWhereUniqueWithoutAuthorInput | Prisma.PostCommentUpsertWithWhereUniqueWithoutAuthorInput[];
    createMany?: Prisma.PostCommentCreateManyAuthorInputEnvelope;
    set?: Prisma.PostCommentWhereUniqueInput | Prisma.PostCommentWhereUniqueInput[];
    disconnect?: Prisma.PostCommentWhereUniqueInput | Prisma.PostCommentWhereUniqueInput[];
    delete?: Prisma.PostCommentWhereUniqueInput | Prisma.PostCommentWhereUniqueInput[];
    connect?: Prisma.PostCommentWhereUniqueInput | Prisma.PostCommentWhereUniqueInput[];
    update?: Prisma.PostCommentUpdateWithWhereUniqueWithoutAuthorInput | Prisma.PostCommentUpdateWithWhereUniqueWithoutAuthorInput[];
    updateMany?: Prisma.PostCommentUpdateManyWithWhereWithoutAuthorInput | Prisma.PostCommentUpdateManyWithWhereWithoutAuthorInput[];
    deleteMany?: Prisma.PostCommentScalarWhereInput | Prisma.PostCommentScalarWhereInput[];
};
export type PostCommentCreateNestedManyWithoutPostInput = {
    create?: Prisma.XOR<Prisma.PostCommentCreateWithoutPostInput, Prisma.PostCommentUncheckedCreateWithoutPostInput> | Prisma.PostCommentCreateWithoutPostInput[] | Prisma.PostCommentUncheckedCreateWithoutPostInput[];
    connectOrCreate?: Prisma.PostCommentCreateOrConnectWithoutPostInput | Prisma.PostCommentCreateOrConnectWithoutPostInput[];
    createMany?: Prisma.PostCommentCreateManyPostInputEnvelope;
    connect?: Prisma.PostCommentWhereUniqueInput | Prisma.PostCommentWhereUniqueInput[];
};
export type PostCommentUncheckedCreateNestedManyWithoutPostInput = {
    create?: Prisma.XOR<Prisma.PostCommentCreateWithoutPostInput, Prisma.PostCommentUncheckedCreateWithoutPostInput> | Prisma.PostCommentCreateWithoutPostInput[] | Prisma.PostCommentUncheckedCreateWithoutPostInput[];
    connectOrCreate?: Prisma.PostCommentCreateOrConnectWithoutPostInput | Prisma.PostCommentCreateOrConnectWithoutPostInput[];
    createMany?: Prisma.PostCommentCreateManyPostInputEnvelope;
    connect?: Prisma.PostCommentWhereUniqueInput | Prisma.PostCommentWhereUniqueInput[];
};
export type PostCommentUpdateManyWithoutPostNestedInput = {
    create?: Prisma.XOR<Prisma.PostCommentCreateWithoutPostInput, Prisma.PostCommentUncheckedCreateWithoutPostInput> | Prisma.PostCommentCreateWithoutPostInput[] | Prisma.PostCommentUncheckedCreateWithoutPostInput[];
    connectOrCreate?: Prisma.PostCommentCreateOrConnectWithoutPostInput | Prisma.PostCommentCreateOrConnectWithoutPostInput[];
    upsert?: Prisma.PostCommentUpsertWithWhereUniqueWithoutPostInput | Prisma.PostCommentUpsertWithWhereUniqueWithoutPostInput[];
    createMany?: Prisma.PostCommentCreateManyPostInputEnvelope;
    set?: Prisma.PostCommentWhereUniqueInput | Prisma.PostCommentWhereUniqueInput[];
    disconnect?: Prisma.PostCommentWhereUniqueInput | Prisma.PostCommentWhereUniqueInput[];
    delete?: Prisma.PostCommentWhereUniqueInput | Prisma.PostCommentWhereUniqueInput[];
    connect?: Prisma.PostCommentWhereUniqueInput | Prisma.PostCommentWhereUniqueInput[];
    update?: Prisma.PostCommentUpdateWithWhereUniqueWithoutPostInput | Prisma.PostCommentUpdateWithWhereUniqueWithoutPostInput[];
    updateMany?: Prisma.PostCommentUpdateManyWithWhereWithoutPostInput | Prisma.PostCommentUpdateManyWithWhereWithoutPostInput[];
    deleteMany?: Prisma.PostCommentScalarWhereInput | Prisma.PostCommentScalarWhereInput[];
};
export type PostCommentUncheckedUpdateManyWithoutPostNestedInput = {
    create?: Prisma.XOR<Prisma.PostCommentCreateWithoutPostInput, Prisma.PostCommentUncheckedCreateWithoutPostInput> | Prisma.PostCommentCreateWithoutPostInput[] | Prisma.PostCommentUncheckedCreateWithoutPostInput[];
    connectOrCreate?: Prisma.PostCommentCreateOrConnectWithoutPostInput | Prisma.PostCommentCreateOrConnectWithoutPostInput[];
    upsert?: Prisma.PostCommentUpsertWithWhereUniqueWithoutPostInput | Prisma.PostCommentUpsertWithWhereUniqueWithoutPostInput[];
    createMany?: Prisma.PostCommentCreateManyPostInputEnvelope;
    set?: Prisma.PostCommentWhereUniqueInput | Prisma.PostCommentWhereUniqueInput[];
    disconnect?: Prisma.PostCommentWhereUniqueInput | Prisma.PostCommentWhereUniqueInput[];
    delete?: Prisma.PostCommentWhereUniqueInput | Prisma.PostCommentWhereUniqueInput[];
    connect?: Prisma.PostCommentWhereUniqueInput | Prisma.PostCommentWhereUniqueInput[];
    update?: Prisma.PostCommentUpdateWithWhereUniqueWithoutPostInput | Prisma.PostCommentUpdateWithWhereUniqueWithoutPostInput[];
    updateMany?: Prisma.PostCommentUpdateManyWithWhereWithoutPostInput | Prisma.PostCommentUpdateManyWithWhereWithoutPostInput[];
    deleteMany?: Prisma.PostCommentScalarWhereInput | Prisma.PostCommentScalarWhereInput[];
};
export type PostCommentCreateWithoutAuthorInput = {
    id?: string;
    text: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    post: Prisma.PostCreateNestedOneWithoutCommentsInput;
};
export type PostCommentUncheckedCreateWithoutAuthorInput = {
    id?: string;
    postId: string;
    text: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type PostCommentCreateOrConnectWithoutAuthorInput = {
    where: Prisma.PostCommentWhereUniqueInput;
    create: Prisma.XOR<Prisma.PostCommentCreateWithoutAuthorInput, Prisma.PostCommentUncheckedCreateWithoutAuthorInput>;
};
export type PostCommentCreateManyAuthorInputEnvelope = {
    data: Prisma.PostCommentCreateManyAuthorInput | Prisma.PostCommentCreateManyAuthorInput[];
    skipDuplicates?: boolean;
};
export type PostCommentUpsertWithWhereUniqueWithoutAuthorInput = {
    where: Prisma.PostCommentWhereUniqueInput;
    update: Prisma.XOR<Prisma.PostCommentUpdateWithoutAuthorInput, Prisma.PostCommentUncheckedUpdateWithoutAuthorInput>;
    create: Prisma.XOR<Prisma.PostCommentCreateWithoutAuthorInput, Prisma.PostCommentUncheckedCreateWithoutAuthorInput>;
};
export type PostCommentUpdateWithWhereUniqueWithoutAuthorInput = {
    where: Prisma.PostCommentWhereUniqueInput;
    data: Prisma.XOR<Prisma.PostCommentUpdateWithoutAuthorInput, Prisma.PostCommentUncheckedUpdateWithoutAuthorInput>;
};
export type PostCommentUpdateManyWithWhereWithoutAuthorInput = {
    where: Prisma.PostCommentScalarWhereInput;
    data: Prisma.XOR<Prisma.PostCommentUpdateManyMutationInput, Prisma.PostCommentUncheckedUpdateManyWithoutAuthorInput>;
};
export type PostCommentScalarWhereInput = {
    AND?: Prisma.PostCommentScalarWhereInput | Prisma.PostCommentScalarWhereInput[];
    OR?: Prisma.PostCommentScalarWhereInput[];
    NOT?: Prisma.PostCommentScalarWhereInput | Prisma.PostCommentScalarWhereInput[];
    id?: Prisma.UuidFilter<"PostComment"> | string;
    postId?: Prisma.UuidFilter<"PostComment"> | string;
    authorId?: Prisma.UuidFilter<"PostComment"> | string;
    text?: Prisma.StringFilter<"PostComment"> | string;
    createdAt?: Prisma.DateTimeFilter<"PostComment"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"PostComment"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"PostComment"> | Date | string | null;
};
export type PostCommentCreateWithoutPostInput = {
    id?: string;
    text: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    author: Prisma.UserCreateNestedOneWithoutPostCommentsInput;
};
export type PostCommentUncheckedCreateWithoutPostInput = {
    id?: string;
    authorId: string;
    text: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type PostCommentCreateOrConnectWithoutPostInput = {
    where: Prisma.PostCommentWhereUniqueInput;
    create: Prisma.XOR<Prisma.PostCommentCreateWithoutPostInput, Prisma.PostCommentUncheckedCreateWithoutPostInput>;
};
export type PostCommentCreateManyPostInputEnvelope = {
    data: Prisma.PostCommentCreateManyPostInput | Prisma.PostCommentCreateManyPostInput[];
    skipDuplicates?: boolean;
};
export type PostCommentUpsertWithWhereUniqueWithoutPostInput = {
    where: Prisma.PostCommentWhereUniqueInput;
    update: Prisma.XOR<Prisma.PostCommentUpdateWithoutPostInput, Prisma.PostCommentUncheckedUpdateWithoutPostInput>;
    create: Prisma.XOR<Prisma.PostCommentCreateWithoutPostInput, Prisma.PostCommentUncheckedCreateWithoutPostInput>;
};
export type PostCommentUpdateWithWhereUniqueWithoutPostInput = {
    where: Prisma.PostCommentWhereUniqueInput;
    data: Prisma.XOR<Prisma.PostCommentUpdateWithoutPostInput, Prisma.PostCommentUncheckedUpdateWithoutPostInput>;
};
export type PostCommentUpdateManyWithWhereWithoutPostInput = {
    where: Prisma.PostCommentScalarWhereInput;
    data: Prisma.XOR<Prisma.PostCommentUpdateManyMutationInput, Prisma.PostCommentUncheckedUpdateManyWithoutPostInput>;
};
export type PostCommentCreateManyAuthorInput = {
    id?: string;
    postId: string;
    text: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type PostCommentUpdateWithoutAuthorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    post?: Prisma.PostUpdateOneRequiredWithoutCommentsNestedInput;
};
export type PostCommentUncheckedUpdateWithoutAuthorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    postId?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type PostCommentUncheckedUpdateManyWithoutAuthorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    postId?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type PostCommentCreateManyPostInput = {
    id?: string;
    authorId: string;
    text: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type PostCommentUpdateWithoutPostInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    author?: Prisma.UserUpdateOneRequiredWithoutPostCommentsNestedInput;
};
export type PostCommentUncheckedUpdateWithoutPostInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    authorId?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type PostCommentUncheckedUpdateManyWithoutPostInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    authorId?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type PostCommentSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    postId?: boolean;
    authorId?: boolean;
    text?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    post?: boolean | Prisma.PostDefaultArgs<ExtArgs>;
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["postComment"]>;
export type PostCommentSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    postId?: boolean;
    authorId?: boolean;
    text?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    post?: boolean | Prisma.PostDefaultArgs<ExtArgs>;
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["postComment"]>;
export type PostCommentSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    postId?: boolean;
    authorId?: boolean;
    text?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    post?: boolean | Prisma.PostDefaultArgs<ExtArgs>;
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["postComment"]>;
export type PostCommentSelectScalar = {
    id?: boolean;
    postId?: boolean;
    authorId?: boolean;
    text?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
};
export type PostCommentOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "postId" | "authorId" | "text" | "createdAt" | "updatedAt" | "deletedAt", ExtArgs["result"]["postComment"]>;
export type PostCommentInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    post?: boolean | Prisma.PostDefaultArgs<ExtArgs>;
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type PostCommentIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    post?: boolean | Prisma.PostDefaultArgs<ExtArgs>;
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type PostCommentIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    post?: boolean | Prisma.PostDefaultArgs<ExtArgs>;
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $PostCommentPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PostComment";
    objects: {
        post: Prisma.$PostPayload<ExtArgs>;
        author: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        postId: string;
        authorId: string;
        text: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }, ExtArgs["result"]["postComment"]>;
    composites: {};
};
export type PostCommentGetPayload<S extends boolean | null | undefined | PostCommentDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PostCommentPayload, S>;
export type PostCommentCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PostCommentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PostCommentCountAggregateInputType | true;
};
export interface PostCommentDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PostComment'];
        meta: {
            name: 'PostComment';
        };
    };
    findUnique<T extends PostCommentFindUniqueArgs>(args: Prisma.SelectSubset<T, PostCommentFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PostCommentClient<runtime.Types.Result.GetResult<Prisma.$PostCommentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PostCommentFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PostCommentFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PostCommentClient<runtime.Types.Result.GetResult<Prisma.$PostCommentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PostCommentFindFirstArgs>(args?: Prisma.SelectSubset<T, PostCommentFindFirstArgs<ExtArgs>>): Prisma.Prisma__PostCommentClient<runtime.Types.Result.GetResult<Prisma.$PostCommentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PostCommentFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PostCommentFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PostCommentClient<runtime.Types.Result.GetResult<Prisma.$PostCommentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PostCommentFindManyArgs>(args?: Prisma.SelectSubset<T, PostCommentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PostCommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PostCommentCreateArgs>(args: Prisma.SelectSubset<T, PostCommentCreateArgs<ExtArgs>>): Prisma.Prisma__PostCommentClient<runtime.Types.Result.GetResult<Prisma.$PostCommentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PostCommentCreateManyArgs>(args?: Prisma.SelectSubset<T, PostCommentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PostCommentCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PostCommentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PostCommentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PostCommentDeleteArgs>(args: Prisma.SelectSubset<T, PostCommentDeleteArgs<ExtArgs>>): Prisma.Prisma__PostCommentClient<runtime.Types.Result.GetResult<Prisma.$PostCommentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PostCommentUpdateArgs>(args: Prisma.SelectSubset<T, PostCommentUpdateArgs<ExtArgs>>): Prisma.Prisma__PostCommentClient<runtime.Types.Result.GetResult<Prisma.$PostCommentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PostCommentDeleteManyArgs>(args?: Prisma.SelectSubset<T, PostCommentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PostCommentUpdateManyArgs>(args: Prisma.SelectSubset<T, PostCommentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PostCommentUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PostCommentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PostCommentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PostCommentUpsertArgs>(args: Prisma.SelectSubset<T, PostCommentUpsertArgs<ExtArgs>>): Prisma.Prisma__PostCommentClient<runtime.Types.Result.GetResult<Prisma.$PostCommentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PostCommentCountArgs>(args?: Prisma.Subset<T, PostCommentCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PostCommentCountAggregateOutputType> : number>;
    aggregate<T extends PostCommentAggregateArgs>(args: Prisma.Subset<T, PostCommentAggregateArgs>): Prisma.PrismaPromise<GetPostCommentAggregateType<T>>;
    groupBy<T extends PostCommentGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PostCommentGroupByArgs['orderBy'];
    } : {
        orderBy?: PostCommentGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PostCommentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPostCommentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PostCommentFieldRefs;
}
export interface Prisma__PostCommentClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    post<T extends Prisma.PostDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PostDefaultArgs<ExtArgs>>): Prisma.Prisma__PostClient<runtime.Types.Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    author<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PostCommentFieldRefs {
    readonly id: Prisma.FieldRef<"PostComment", 'String'>;
    readonly postId: Prisma.FieldRef<"PostComment", 'String'>;
    readonly authorId: Prisma.FieldRef<"PostComment", 'String'>;
    readonly text: Prisma.FieldRef<"PostComment", 'String'>;
    readonly createdAt: Prisma.FieldRef<"PostComment", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"PostComment", 'DateTime'>;
    readonly deletedAt: Prisma.FieldRef<"PostComment", 'DateTime'>;
}
export type PostCommentFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PostCommentSelect<ExtArgs> | null;
    omit?: Prisma.PostCommentOmit<ExtArgs> | null;
    include?: Prisma.PostCommentInclude<ExtArgs> | null;
    where: Prisma.PostCommentWhereUniqueInput;
};
export type PostCommentFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PostCommentSelect<ExtArgs> | null;
    omit?: Prisma.PostCommentOmit<ExtArgs> | null;
    include?: Prisma.PostCommentInclude<ExtArgs> | null;
    where: Prisma.PostCommentWhereUniqueInput;
};
export type PostCommentFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PostCommentSelect<ExtArgs> | null;
    omit?: Prisma.PostCommentOmit<ExtArgs> | null;
    include?: Prisma.PostCommentInclude<ExtArgs> | null;
    where?: Prisma.PostCommentWhereInput;
    orderBy?: Prisma.PostCommentOrderByWithRelationInput | Prisma.PostCommentOrderByWithRelationInput[];
    cursor?: Prisma.PostCommentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PostCommentScalarFieldEnum | Prisma.PostCommentScalarFieldEnum[];
};
export type PostCommentFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PostCommentSelect<ExtArgs> | null;
    omit?: Prisma.PostCommentOmit<ExtArgs> | null;
    include?: Prisma.PostCommentInclude<ExtArgs> | null;
    where?: Prisma.PostCommentWhereInput;
    orderBy?: Prisma.PostCommentOrderByWithRelationInput | Prisma.PostCommentOrderByWithRelationInput[];
    cursor?: Prisma.PostCommentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PostCommentScalarFieldEnum | Prisma.PostCommentScalarFieldEnum[];
};
export type PostCommentFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PostCommentSelect<ExtArgs> | null;
    omit?: Prisma.PostCommentOmit<ExtArgs> | null;
    include?: Prisma.PostCommentInclude<ExtArgs> | null;
    where?: Prisma.PostCommentWhereInput;
    orderBy?: Prisma.PostCommentOrderByWithRelationInput | Prisma.PostCommentOrderByWithRelationInput[];
    cursor?: Prisma.PostCommentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PostCommentScalarFieldEnum | Prisma.PostCommentScalarFieldEnum[];
};
export type PostCommentCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PostCommentSelect<ExtArgs> | null;
    omit?: Prisma.PostCommentOmit<ExtArgs> | null;
    include?: Prisma.PostCommentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PostCommentCreateInput, Prisma.PostCommentUncheckedCreateInput>;
};
export type PostCommentCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PostCommentCreateManyInput | Prisma.PostCommentCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PostCommentCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PostCommentSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PostCommentOmit<ExtArgs> | null;
    data: Prisma.PostCommentCreateManyInput | Prisma.PostCommentCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.PostCommentIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type PostCommentUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PostCommentSelect<ExtArgs> | null;
    omit?: Prisma.PostCommentOmit<ExtArgs> | null;
    include?: Prisma.PostCommentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PostCommentUpdateInput, Prisma.PostCommentUncheckedUpdateInput>;
    where: Prisma.PostCommentWhereUniqueInput;
};
export type PostCommentUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PostCommentUpdateManyMutationInput, Prisma.PostCommentUncheckedUpdateManyInput>;
    where?: Prisma.PostCommentWhereInput;
    limit?: number;
};
export type PostCommentUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PostCommentSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PostCommentOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PostCommentUpdateManyMutationInput, Prisma.PostCommentUncheckedUpdateManyInput>;
    where?: Prisma.PostCommentWhereInput;
    limit?: number;
    include?: Prisma.PostCommentIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type PostCommentUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PostCommentSelect<ExtArgs> | null;
    omit?: Prisma.PostCommentOmit<ExtArgs> | null;
    include?: Prisma.PostCommentInclude<ExtArgs> | null;
    where: Prisma.PostCommentWhereUniqueInput;
    create: Prisma.XOR<Prisma.PostCommentCreateInput, Prisma.PostCommentUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PostCommentUpdateInput, Prisma.PostCommentUncheckedUpdateInput>;
};
export type PostCommentDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PostCommentSelect<ExtArgs> | null;
    omit?: Prisma.PostCommentOmit<ExtArgs> | null;
    include?: Prisma.PostCommentInclude<ExtArgs> | null;
    where: Prisma.PostCommentWhereUniqueInput;
};
export type PostCommentDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PostCommentWhereInput;
    limit?: number;
};
export type PostCommentDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PostCommentSelect<ExtArgs> | null;
    omit?: Prisma.PostCommentOmit<ExtArgs> | null;
    include?: Prisma.PostCommentInclude<ExtArgs> | null;
};
