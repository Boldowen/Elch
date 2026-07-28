import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type BookingEventModel = runtime.Types.Result.DefaultSelection<Prisma.$BookingEventPayload>;
export type AggregateBookingEvent = {
    _count: BookingEventCountAggregateOutputType | null;
    _min: BookingEventMinAggregateOutputType | null;
    _max: BookingEventMaxAggregateOutputType | null;
};
export type BookingEventMinAggregateOutputType = {
    id: string | null;
    bookingId: string | null;
    actorId: string | null;
    actorType: $Enums.BookingActorType | null;
    fromStatus: $Enums.BookingStatus | null;
    toStatus: $Enums.BookingStatus | null;
    eventType: string | null;
    reason: string | null;
    createdAt: Date | null;
};
export type BookingEventMaxAggregateOutputType = {
    id: string | null;
    bookingId: string | null;
    actorId: string | null;
    actorType: $Enums.BookingActorType | null;
    fromStatus: $Enums.BookingStatus | null;
    toStatus: $Enums.BookingStatus | null;
    eventType: string | null;
    reason: string | null;
    createdAt: Date | null;
};
export type BookingEventCountAggregateOutputType = {
    id: number;
    bookingId: number;
    actorId: number;
    actorType: number;
    fromStatus: number;
    toStatus: number;
    eventType: number;
    reason: number;
    metadata: number;
    createdAt: number;
    _all: number;
};
export type BookingEventMinAggregateInputType = {
    id?: true;
    bookingId?: true;
    actorId?: true;
    actorType?: true;
    fromStatus?: true;
    toStatus?: true;
    eventType?: true;
    reason?: true;
    createdAt?: true;
};
export type BookingEventMaxAggregateInputType = {
    id?: true;
    bookingId?: true;
    actorId?: true;
    actorType?: true;
    fromStatus?: true;
    toStatus?: true;
    eventType?: true;
    reason?: true;
    createdAt?: true;
};
export type BookingEventCountAggregateInputType = {
    id?: true;
    bookingId?: true;
    actorId?: true;
    actorType?: true;
    fromStatus?: true;
    toStatus?: true;
    eventType?: true;
    reason?: true;
    metadata?: true;
    createdAt?: true;
    _all?: true;
};
export type BookingEventAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BookingEventWhereInput;
    orderBy?: Prisma.BookingEventOrderByWithRelationInput | Prisma.BookingEventOrderByWithRelationInput[];
    cursor?: Prisma.BookingEventWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | BookingEventCountAggregateInputType;
    _min?: BookingEventMinAggregateInputType;
    _max?: BookingEventMaxAggregateInputType;
};
export type GetBookingEventAggregateType<T extends BookingEventAggregateArgs> = {
    [P in keyof T & keyof AggregateBookingEvent]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateBookingEvent[P]> : Prisma.GetScalarType<T[P], AggregateBookingEvent[P]>;
};
export type BookingEventGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BookingEventWhereInput;
    orderBy?: Prisma.BookingEventOrderByWithAggregationInput | Prisma.BookingEventOrderByWithAggregationInput[];
    by: Prisma.BookingEventScalarFieldEnum[] | Prisma.BookingEventScalarFieldEnum;
    having?: Prisma.BookingEventScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BookingEventCountAggregateInputType | true;
    _min?: BookingEventMinAggregateInputType;
    _max?: BookingEventMaxAggregateInputType;
};
export type BookingEventGroupByOutputType = {
    id: string;
    bookingId: string;
    actorId: string | null;
    actorType: $Enums.BookingActorType;
    fromStatus: $Enums.BookingStatus | null;
    toStatus: $Enums.BookingStatus;
    eventType: string;
    reason: string | null;
    metadata: runtime.JsonValue | null;
    createdAt: Date;
    _count: BookingEventCountAggregateOutputType | null;
    _min: BookingEventMinAggregateOutputType | null;
    _max: BookingEventMaxAggregateOutputType | null;
};
export type GetBookingEventGroupByPayload<T extends BookingEventGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<BookingEventGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof BookingEventGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], BookingEventGroupByOutputType[P]> : Prisma.GetScalarType<T[P], BookingEventGroupByOutputType[P]>;
}>>;
export type BookingEventWhereInput = {
    AND?: Prisma.BookingEventWhereInput | Prisma.BookingEventWhereInput[];
    OR?: Prisma.BookingEventWhereInput[];
    NOT?: Prisma.BookingEventWhereInput | Prisma.BookingEventWhereInput[];
    id?: Prisma.UuidFilter<"BookingEvent"> | string;
    bookingId?: Prisma.UuidFilter<"BookingEvent"> | string;
    actorId?: Prisma.UuidNullableFilter<"BookingEvent"> | string | null;
    actorType?: Prisma.EnumBookingActorTypeFilter<"BookingEvent"> | $Enums.BookingActorType;
    fromStatus?: Prisma.EnumBookingStatusNullableFilter<"BookingEvent"> | $Enums.BookingStatus | null;
    toStatus?: Prisma.EnumBookingStatusFilter<"BookingEvent"> | $Enums.BookingStatus;
    eventType?: Prisma.StringFilter<"BookingEvent"> | string;
    reason?: Prisma.StringNullableFilter<"BookingEvent"> | string | null;
    metadata?: Prisma.JsonNullableFilter<"BookingEvent">;
    createdAt?: Prisma.DateTimeFilter<"BookingEvent"> | Date | string;
    booking?: Prisma.XOR<Prisma.BookingScalarRelationFilter, Prisma.BookingWhereInput>;
    actor?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
};
export type BookingEventOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    bookingId?: Prisma.SortOrder;
    actorId?: Prisma.SortOrderInput | Prisma.SortOrder;
    actorType?: Prisma.SortOrder;
    fromStatus?: Prisma.SortOrderInput | Prisma.SortOrder;
    toStatus?: Prisma.SortOrder;
    eventType?: Prisma.SortOrder;
    reason?: Prisma.SortOrderInput | Prisma.SortOrder;
    metadata?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    booking?: Prisma.BookingOrderByWithRelationInput;
    actor?: Prisma.UserOrderByWithRelationInput;
};
export type BookingEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.BookingEventWhereInput | Prisma.BookingEventWhereInput[];
    OR?: Prisma.BookingEventWhereInput[];
    NOT?: Prisma.BookingEventWhereInput | Prisma.BookingEventWhereInput[];
    bookingId?: Prisma.UuidFilter<"BookingEvent"> | string;
    actorId?: Prisma.UuidNullableFilter<"BookingEvent"> | string | null;
    actorType?: Prisma.EnumBookingActorTypeFilter<"BookingEvent"> | $Enums.BookingActorType;
    fromStatus?: Prisma.EnumBookingStatusNullableFilter<"BookingEvent"> | $Enums.BookingStatus | null;
    toStatus?: Prisma.EnumBookingStatusFilter<"BookingEvent"> | $Enums.BookingStatus;
    eventType?: Prisma.StringFilter<"BookingEvent"> | string;
    reason?: Prisma.StringNullableFilter<"BookingEvent"> | string | null;
    metadata?: Prisma.JsonNullableFilter<"BookingEvent">;
    createdAt?: Prisma.DateTimeFilter<"BookingEvent"> | Date | string;
    booking?: Prisma.XOR<Prisma.BookingScalarRelationFilter, Prisma.BookingWhereInput>;
    actor?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
}, "id">;
export type BookingEventOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    bookingId?: Prisma.SortOrder;
    actorId?: Prisma.SortOrderInput | Prisma.SortOrder;
    actorType?: Prisma.SortOrder;
    fromStatus?: Prisma.SortOrderInput | Prisma.SortOrder;
    toStatus?: Prisma.SortOrder;
    eventType?: Prisma.SortOrder;
    reason?: Prisma.SortOrderInput | Prisma.SortOrder;
    metadata?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.BookingEventCountOrderByAggregateInput;
    _max?: Prisma.BookingEventMaxOrderByAggregateInput;
    _min?: Prisma.BookingEventMinOrderByAggregateInput;
};
export type BookingEventScalarWhereWithAggregatesInput = {
    AND?: Prisma.BookingEventScalarWhereWithAggregatesInput | Prisma.BookingEventScalarWhereWithAggregatesInput[];
    OR?: Prisma.BookingEventScalarWhereWithAggregatesInput[];
    NOT?: Prisma.BookingEventScalarWhereWithAggregatesInput | Prisma.BookingEventScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"BookingEvent"> | string;
    bookingId?: Prisma.UuidWithAggregatesFilter<"BookingEvent"> | string;
    actorId?: Prisma.UuidNullableWithAggregatesFilter<"BookingEvent"> | string | null;
    actorType?: Prisma.EnumBookingActorTypeWithAggregatesFilter<"BookingEvent"> | $Enums.BookingActorType;
    fromStatus?: Prisma.EnumBookingStatusNullableWithAggregatesFilter<"BookingEvent"> | $Enums.BookingStatus | null;
    toStatus?: Prisma.EnumBookingStatusWithAggregatesFilter<"BookingEvent"> | $Enums.BookingStatus;
    eventType?: Prisma.StringWithAggregatesFilter<"BookingEvent"> | string;
    reason?: Prisma.StringNullableWithAggregatesFilter<"BookingEvent"> | string | null;
    metadata?: Prisma.JsonNullableWithAggregatesFilter<"BookingEvent">;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"BookingEvent"> | Date | string;
};
export type BookingEventCreateInput = {
    id?: string;
    actorType: $Enums.BookingActorType;
    fromStatus?: $Enums.BookingStatus | null;
    toStatus: $Enums.BookingStatus;
    eventType: string;
    reason?: string | null;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    booking: Prisma.BookingCreateNestedOneWithoutEventsInput;
    actor?: Prisma.UserCreateNestedOneWithoutBookingEventsInput;
};
export type BookingEventUncheckedCreateInput = {
    id?: string;
    bookingId: string;
    actorId?: string | null;
    actorType: $Enums.BookingActorType;
    fromStatus?: $Enums.BookingStatus | null;
    toStatus: $Enums.BookingStatus;
    eventType: string;
    reason?: string | null;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
};
export type BookingEventUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    actorType?: Prisma.EnumBookingActorTypeFieldUpdateOperationsInput | $Enums.BookingActorType;
    fromStatus?: Prisma.NullableEnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus | null;
    toStatus?: Prisma.EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus;
    eventType?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    booking?: Prisma.BookingUpdateOneRequiredWithoutEventsNestedInput;
    actor?: Prisma.UserUpdateOneWithoutBookingEventsNestedInput;
};
export type BookingEventUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    bookingId?: Prisma.StringFieldUpdateOperationsInput | string;
    actorId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actorType?: Prisma.EnumBookingActorTypeFieldUpdateOperationsInput | $Enums.BookingActorType;
    fromStatus?: Prisma.NullableEnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus | null;
    toStatus?: Prisma.EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus;
    eventType?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BookingEventCreateManyInput = {
    id?: string;
    bookingId: string;
    actorId?: string | null;
    actorType: $Enums.BookingActorType;
    fromStatus?: $Enums.BookingStatus | null;
    toStatus: $Enums.BookingStatus;
    eventType: string;
    reason?: string | null;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
};
export type BookingEventUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    actorType?: Prisma.EnumBookingActorTypeFieldUpdateOperationsInput | $Enums.BookingActorType;
    fromStatus?: Prisma.NullableEnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus | null;
    toStatus?: Prisma.EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus;
    eventType?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BookingEventUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    bookingId?: Prisma.StringFieldUpdateOperationsInput | string;
    actorId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actorType?: Prisma.EnumBookingActorTypeFieldUpdateOperationsInput | $Enums.BookingActorType;
    fromStatus?: Prisma.NullableEnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus | null;
    toStatus?: Prisma.EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus;
    eventType?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BookingEventListRelationFilter = {
    every?: Prisma.BookingEventWhereInput;
    some?: Prisma.BookingEventWhereInput;
    none?: Prisma.BookingEventWhereInput;
};
export type BookingEventOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type BookingEventCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    bookingId?: Prisma.SortOrder;
    actorId?: Prisma.SortOrder;
    actorType?: Prisma.SortOrder;
    fromStatus?: Prisma.SortOrder;
    toStatus?: Prisma.SortOrder;
    eventType?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    metadata?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type BookingEventMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    bookingId?: Prisma.SortOrder;
    actorId?: Prisma.SortOrder;
    actorType?: Prisma.SortOrder;
    fromStatus?: Prisma.SortOrder;
    toStatus?: Prisma.SortOrder;
    eventType?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type BookingEventMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    bookingId?: Prisma.SortOrder;
    actorId?: Prisma.SortOrder;
    actorType?: Prisma.SortOrder;
    fromStatus?: Prisma.SortOrder;
    toStatus?: Prisma.SortOrder;
    eventType?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type BookingEventCreateNestedManyWithoutActorInput = {
    create?: Prisma.XOR<Prisma.BookingEventCreateWithoutActorInput, Prisma.BookingEventUncheckedCreateWithoutActorInput> | Prisma.BookingEventCreateWithoutActorInput[] | Prisma.BookingEventUncheckedCreateWithoutActorInput[];
    connectOrCreate?: Prisma.BookingEventCreateOrConnectWithoutActorInput | Prisma.BookingEventCreateOrConnectWithoutActorInput[];
    createMany?: Prisma.BookingEventCreateManyActorInputEnvelope;
    connect?: Prisma.BookingEventWhereUniqueInput | Prisma.BookingEventWhereUniqueInput[];
};
export type BookingEventUncheckedCreateNestedManyWithoutActorInput = {
    create?: Prisma.XOR<Prisma.BookingEventCreateWithoutActorInput, Prisma.BookingEventUncheckedCreateWithoutActorInput> | Prisma.BookingEventCreateWithoutActorInput[] | Prisma.BookingEventUncheckedCreateWithoutActorInput[];
    connectOrCreate?: Prisma.BookingEventCreateOrConnectWithoutActorInput | Prisma.BookingEventCreateOrConnectWithoutActorInput[];
    createMany?: Prisma.BookingEventCreateManyActorInputEnvelope;
    connect?: Prisma.BookingEventWhereUniqueInput | Prisma.BookingEventWhereUniqueInput[];
};
export type BookingEventUpdateManyWithoutActorNestedInput = {
    create?: Prisma.XOR<Prisma.BookingEventCreateWithoutActorInput, Prisma.BookingEventUncheckedCreateWithoutActorInput> | Prisma.BookingEventCreateWithoutActorInput[] | Prisma.BookingEventUncheckedCreateWithoutActorInput[];
    connectOrCreate?: Prisma.BookingEventCreateOrConnectWithoutActorInput | Prisma.BookingEventCreateOrConnectWithoutActorInput[];
    upsert?: Prisma.BookingEventUpsertWithWhereUniqueWithoutActorInput | Prisma.BookingEventUpsertWithWhereUniqueWithoutActorInput[];
    createMany?: Prisma.BookingEventCreateManyActorInputEnvelope;
    set?: Prisma.BookingEventWhereUniqueInput | Prisma.BookingEventWhereUniqueInput[];
    disconnect?: Prisma.BookingEventWhereUniqueInput | Prisma.BookingEventWhereUniqueInput[];
    delete?: Prisma.BookingEventWhereUniqueInput | Prisma.BookingEventWhereUniqueInput[];
    connect?: Prisma.BookingEventWhereUniqueInput | Prisma.BookingEventWhereUniqueInput[];
    update?: Prisma.BookingEventUpdateWithWhereUniqueWithoutActorInput | Prisma.BookingEventUpdateWithWhereUniqueWithoutActorInput[];
    updateMany?: Prisma.BookingEventUpdateManyWithWhereWithoutActorInput | Prisma.BookingEventUpdateManyWithWhereWithoutActorInput[];
    deleteMany?: Prisma.BookingEventScalarWhereInput | Prisma.BookingEventScalarWhereInput[];
};
export type BookingEventUncheckedUpdateManyWithoutActorNestedInput = {
    create?: Prisma.XOR<Prisma.BookingEventCreateWithoutActorInput, Prisma.BookingEventUncheckedCreateWithoutActorInput> | Prisma.BookingEventCreateWithoutActorInput[] | Prisma.BookingEventUncheckedCreateWithoutActorInput[];
    connectOrCreate?: Prisma.BookingEventCreateOrConnectWithoutActorInput | Prisma.BookingEventCreateOrConnectWithoutActorInput[];
    upsert?: Prisma.BookingEventUpsertWithWhereUniqueWithoutActorInput | Prisma.BookingEventUpsertWithWhereUniqueWithoutActorInput[];
    createMany?: Prisma.BookingEventCreateManyActorInputEnvelope;
    set?: Prisma.BookingEventWhereUniqueInput | Prisma.BookingEventWhereUniqueInput[];
    disconnect?: Prisma.BookingEventWhereUniqueInput | Prisma.BookingEventWhereUniqueInput[];
    delete?: Prisma.BookingEventWhereUniqueInput | Prisma.BookingEventWhereUniqueInput[];
    connect?: Prisma.BookingEventWhereUniqueInput | Prisma.BookingEventWhereUniqueInput[];
    update?: Prisma.BookingEventUpdateWithWhereUniqueWithoutActorInput | Prisma.BookingEventUpdateWithWhereUniqueWithoutActorInput[];
    updateMany?: Prisma.BookingEventUpdateManyWithWhereWithoutActorInput | Prisma.BookingEventUpdateManyWithWhereWithoutActorInput[];
    deleteMany?: Prisma.BookingEventScalarWhereInput | Prisma.BookingEventScalarWhereInput[];
};
export type BookingEventCreateNestedManyWithoutBookingInput = {
    create?: Prisma.XOR<Prisma.BookingEventCreateWithoutBookingInput, Prisma.BookingEventUncheckedCreateWithoutBookingInput> | Prisma.BookingEventCreateWithoutBookingInput[] | Prisma.BookingEventUncheckedCreateWithoutBookingInput[];
    connectOrCreate?: Prisma.BookingEventCreateOrConnectWithoutBookingInput | Prisma.BookingEventCreateOrConnectWithoutBookingInput[];
    createMany?: Prisma.BookingEventCreateManyBookingInputEnvelope;
    connect?: Prisma.BookingEventWhereUniqueInput | Prisma.BookingEventWhereUniqueInput[];
};
export type BookingEventUncheckedCreateNestedManyWithoutBookingInput = {
    create?: Prisma.XOR<Prisma.BookingEventCreateWithoutBookingInput, Prisma.BookingEventUncheckedCreateWithoutBookingInput> | Prisma.BookingEventCreateWithoutBookingInput[] | Prisma.BookingEventUncheckedCreateWithoutBookingInput[];
    connectOrCreate?: Prisma.BookingEventCreateOrConnectWithoutBookingInput | Prisma.BookingEventCreateOrConnectWithoutBookingInput[];
    createMany?: Prisma.BookingEventCreateManyBookingInputEnvelope;
    connect?: Prisma.BookingEventWhereUniqueInput | Prisma.BookingEventWhereUniqueInput[];
};
export type BookingEventUpdateManyWithoutBookingNestedInput = {
    create?: Prisma.XOR<Prisma.BookingEventCreateWithoutBookingInput, Prisma.BookingEventUncheckedCreateWithoutBookingInput> | Prisma.BookingEventCreateWithoutBookingInput[] | Prisma.BookingEventUncheckedCreateWithoutBookingInput[];
    connectOrCreate?: Prisma.BookingEventCreateOrConnectWithoutBookingInput | Prisma.BookingEventCreateOrConnectWithoutBookingInput[];
    upsert?: Prisma.BookingEventUpsertWithWhereUniqueWithoutBookingInput | Prisma.BookingEventUpsertWithWhereUniqueWithoutBookingInput[];
    createMany?: Prisma.BookingEventCreateManyBookingInputEnvelope;
    set?: Prisma.BookingEventWhereUniqueInput | Prisma.BookingEventWhereUniqueInput[];
    disconnect?: Prisma.BookingEventWhereUniqueInput | Prisma.BookingEventWhereUniqueInput[];
    delete?: Prisma.BookingEventWhereUniqueInput | Prisma.BookingEventWhereUniqueInput[];
    connect?: Prisma.BookingEventWhereUniqueInput | Prisma.BookingEventWhereUniqueInput[];
    update?: Prisma.BookingEventUpdateWithWhereUniqueWithoutBookingInput | Prisma.BookingEventUpdateWithWhereUniqueWithoutBookingInput[];
    updateMany?: Prisma.BookingEventUpdateManyWithWhereWithoutBookingInput | Prisma.BookingEventUpdateManyWithWhereWithoutBookingInput[];
    deleteMany?: Prisma.BookingEventScalarWhereInput | Prisma.BookingEventScalarWhereInput[];
};
export type BookingEventUncheckedUpdateManyWithoutBookingNestedInput = {
    create?: Prisma.XOR<Prisma.BookingEventCreateWithoutBookingInput, Prisma.BookingEventUncheckedCreateWithoutBookingInput> | Prisma.BookingEventCreateWithoutBookingInput[] | Prisma.BookingEventUncheckedCreateWithoutBookingInput[];
    connectOrCreate?: Prisma.BookingEventCreateOrConnectWithoutBookingInput | Prisma.BookingEventCreateOrConnectWithoutBookingInput[];
    upsert?: Prisma.BookingEventUpsertWithWhereUniqueWithoutBookingInput | Prisma.BookingEventUpsertWithWhereUniqueWithoutBookingInput[];
    createMany?: Prisma.BookingEventCreateManyBookingInputEnvelope;
    set?: Prisma.BookingEventWhereUniqueInput | Prisma.BookingEventWhereUniqueInput[];
    disconnect?: Prisma.BookingEventWhereUniqueInput | Prisma.BookingEventWhereUniqueInput[];
    delete?: Prisma.BookingEventWhereUniqueInput | Prisma.BookingEventWhereUniqueInput[];
    connect?: Prisma.BookingEventWhereUniqueInput | Prisma.BookingEventWhereUniqueInput[];
    update?: Prisma.BookingEventUpdateWithWhereUniqueWithoutBookingInput | Prisma.BookingEventUpdateWithWhereUniqueWithoutBookingInput[];
    updateMany?: Prisma.BookingEventUpdateManyWithWhereWithoutBookingInput | Prisma.BookingEventUpdateManyWithWhereWithoutBookingInput[];
    deleteMany?: Prisma.BookingEventScalarWhereInput | Prisma.BookingEventScalarWhereInput[];
};
export type EnumBookingActorTypeFieldUpdateOperationsInput = {
    set?: $Enums.BookingActorType;
};
export type NullableEnumBookingStatusFieldUpdateOperationsInput = {
    set?: $Enums.BookingStatus | null;
};
export type BookingEventCreateWithoutActorInput = {
    id?: string;
    actorType: $Enums.BookingActorType;
    fromStatus?: $Enums.BookingStatus | null;
    toStatus: $Enums.BookingStatus;
    eventType: string;
    reason?: string | null;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    booking: Prisma.BookingCreateNestedOneWithoutEventsInput;
};
export type BookingEventUncheckedCreateWithoutActorInput = {
    id?: string;
    bookingId: string;
    actorType: $Enums.BookingActorType;
    fromStatus?: $Enums.BookingStatus | null;
    toStatus: $Enums.BookingStatus;
    eventType: string;
    reason?: string | null;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
};
export type BookingEventCreateOrConnectWithoutActorInput = {
    where: Prisma.BookingEventWhereUniqueInput;
    create: Prisma.XOR<Prisma.BookingEventCreateWithoutActorInput, Prisma.BookingEventUncheckedCreateWithoutActorInput>;
};
export type BookingEventCreateManyActorInputEnvelope = {
    data: Prisma.BookingEventCreateManyActorInput | Prisma.BookingEventCreateManyActorInput[];
    skipDuplicates?: boolean;
};
export type BookingEventUpsertWithWhereUniqueWithoutActorInput = {
    where: Prisma.BookingEventWhereUniqueInput;
    update: Prisma.XOR<Prisma.BookingEventUpdateWithoutActorInput, Prisma.BookingEventUncheckedUpdateWithoutActorInput>;
    create: Prisma.XOR<Prisma.BookingEventCreateWithoutActorInput, Prisma.BookingEventUncheckedCreateWithoutActorInput>;
};
export type BookingEventUpdateWithWhereUniqueWithoutActorInput = {
    where: Prisma.BookingEventWhereUniqueInput;
    data: Prisma.XOR<Prisma.BookingEventUpdateWithoutActorInput, Prisma.BookingEventUncheckedUpdateWithoutActorInput>;
};
export type BookingEventUpdateManyWithWhereWithoutActorInput = {
    where: Prisma.BookingEventScalarWhereInput;
    data: Prisma.XOR<Prisma.BookingEventUpdateManyMutationInput, Prisma.BookingEventUncheckedUpdateManyWithoutActorInput>;
};
export type BookingEventScalarWhereInput = {
    AND?: Prisma.BookingEventScalarWhereInput | Prisma.BookingEventScalarWhereInput[];
    OR?: Prisma.BookingEventScalarWhereInput[];
    NOT?: Prisma.BookingEventScalarWhereInput | Prisma.BookingEventScalarWhereInput[];
    id?: Prisma.UuidFilter<"BookingEvent"> | string;
    bookingId?: Prisma.UuidFilter<"BookingEvent"> | string;
    actorId?: Prisma.UuidNullableFilter<"BookingEvent"> | string | null;
    actorType?: Prisma.EnumBookingActorTypeFilter<"BookingEvent"> | $Enums.BookingActorType;
    fromStatus?: Prisma.EnumBookingStatusNullableFilter<"BookingEvent"> | $Enums.BookingStatus | null;
    toStatus?: Prisma.EnumBookingStatusFilter<"BookingEvent"> | $Enums.BookingStatus;
    eventType?: Prisma.StringFilter<"BookingEvent"> | string;
    reason?: Prisma.StringNullableFilter<"BookingEvent"> | string | null;
    metadata?: Prisma.JsonNullableFilter<"BookingEvent">;
    createdAt?: Prisma.DateTimeFilter<"BookingEvent"> | Date | string;
};
export type BookingEventCreateWithoutBookingInput = {
    id?: string;
    actorType: $Enums.BookingActorType;
    fromStatus?: $Enums.BookingStatus | null;
    toStatus: $Enums.BookingStatus;
    eventType: string;
    reason?: string | null;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    actor?: Prisma.UserCreateNestedOneWithoutBookingEventsInput;
};
export type BookingEventUncheckedCreateWithoutBookingInput = {
    id?: string;
    actorId?: string | null;
    actorType: $Enums.BookingActorType;
    fromStatus?: $Enums.BookingStatus | null;
    toStatus: $Enums.BookingStatus;
    eventType: string;
    reason?: string | null;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
};
export type BookingEventCreateOrConnectWithoutBookingInput = {
    where: Prisma.BookingEventWhereUniqueInput;
    create: Prisma.XOR<Prisma.BookingEventCreateWithoutBookingInput, Prisma.BookingEventUncheckedCreateWithoutBookingInput>;
};
export type BookingEventCreateManyBookingInputEnvelope = {
    data: Prisma.BookingEventCreateManyBookingInput | Prisma.BookingEventCreateManyBookingInput[];
    skipDuplicates?: boolean;
};
export type BookingEventUpsertWithWhereUniqueWithoutBookingInput = {
    where: Prisma.BookingEventWhereUniqueInput;
    update: Prisma.XOR<Prisma.BookingEventUpdateWithoutBookingInput, Prisma.BookingEventUncheckedUpdateWithoutBookingInput>;
    create: Prisma.XOR<Prisma.BookingEventCreateWithoutBookingInput, Prisma.BookingEventUncheckedCreateWithoutBookingInput>;
};
export type BookingEventUpdateWithWhereUniqueWithoutBookingInput = {
    where: Prisma.BookingEventWhereUniqueInput;
    data: Prisma.XOR<Prisma.BookingEventUpdateWithoutBookingInput, Prisma.BookingEventUncheckedUpdateWithoutBookingInput>;
};
export type BookingEventUpdateManyWithWhereWithoutBookingInput = {
    where: Prisma.BookingEventScalarWhereInput;
    data: Prisma.XOR<Prisma.BookingEventUpdateManyMutationInput, Prisma.BookingEventUncheckedUpdateManyWithoutBookingInput>;
};
export type BookingEventCreateManyActorInput = {
    id?: string;
    bookingId: string;
    actorType: $Enums.BookingActorType;
    fromStatus?: $Enums.BookingStatus | null;
    toStatus: $Enums.BookingStatus;
    eventType: string;
    reason?: string | null;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
};
export type BookingEventUpdateWithoutActorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    actorType?: Prisma.EnumBookingActorTypeFieldUpdateOperationsInput | $Enums.BookingActorType;
    fromStatus?: Prisma.NullableEnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus | null;
    toStatus?: Prisma.EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus;
    eventType?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    booking?: Prisma.BookingUpdateOneRequiredWithoutEventsNestedInput;
};
export type BookingEventUncheckedUpdateWithoutActorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    bookingId?: Prisma.StringFieldUpdateOperationsInput | string;
    actorType?: Prisma.EnumBookingActorTypeFieldUpdateOperationsInput | $Enums.BookingActorType;
    fromStatus?: Prisma.NullableEnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus | null;
    toStatus?: Prisma.EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus;
    eventType?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BookingEventUncheckedUpdateManyWithoutActorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    bookingId?: Prisma.StringFieldUpdateOperationsInput | string;
    actorType?: Prisma.EnumBookingActorTypeFieldUpdateOperationsInput | $Enums.BookingActorType;
    fromStatus?: Prisma.NullableEnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus | null;
    toStatus?: Prisma.EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus;
    eventType?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BookingEventCreateManyBookingInput = {
    id?: string;
    actorId?: string | null;
    actorType: $Enums.BookingActorType;
    fromStatus?: $Enums.BookingStatus | null;
    toStatus: $Enums.BookingStatus;
    eventType: string;
    reason?: string | null;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
};
export type BookingEventUpdateWithoutBookingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    actorType?: Prisma.EnumBookingActorTypeFieldUpdateOperationsInput | $Enums.BookingActorType;
    fromStatus?: Prisma.NullableEnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus | null;
    toStatus?: Prisma.EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus;
    eventType?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    actor?: Prisma.UserUpdateOneWithoutBookingEventsNestedInput;
};
export type BookingEventUncheckedUpdateWithoutBookingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    actorId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actorType?: Prisma.EnumBookingActorTypeFieldUpdateOperationsInput | $Enums.BookingActorType;
    fromStatus?: Prisma.NullableEnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus | null;
    toStatus?: Prisma.EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus;
    eventType?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BookingEventUncheckedUpdateManyWithoutBookingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    actorId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actorType?: Prisma.EnumBookingActorTypeFieldUpdateOperationsInput | $Enums.BookingActorType;
    fromStatus?: Prisma.NullableEnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus | null;
    toStatus?: Prisma.EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus;
    eventType?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BookingEventSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    bookingId?: boolean;
    actorId?: boolean;
    actorType?: boolean;
    fromStatus?: boolean;
    toStatus?: boolean;
    eventType?: boolean;
    reason?: boolean;
    metadata?: boolean;
    createdAt?: boolean;
    booking?: boolean | Prisma.BookingDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.BookingEvent$actorArgs<ExtArgs>;
}, ExtArgs["result"]["bookingEvent"]>;
export type BookingEventSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    bookingId?: boolean;
    actorId?: boolean;
    actorType?: boolean;
    fromStatus?: boolean;
    toStatus?: boolean;
    eventType?: boolean;
    reason?: boolean;
    metadata?: boolean;
    createdAt?: boolean;
    booking?: boolean | Prisma.BookingDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.BookingEvent$actorArgs<ExtArgs>;
}, ExtArgs["result"]["bookingEvent"]>;
export type BookingEventSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    bookingId?: boolean;
    actorId?: boolean;
    actorType?: boolean;
    fromStatus?: boolean;
    toStatus?: boolean;
    eventType?: boolean;
    reason?: boolean;
    metadata?: boolean;
    createdAt?: boolean;
    booking?: boolean | Prisma.BookingDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.BookingEvent$actorArgs<ExtArgs>;
}, ExtArgs["result"]["bookingEvent"]>;
export type BookingEventSelectScalar = {
    id?: boolean;
    bookingId?: boolean;
    actorId?: boolean;
    actorType?: boolean;
    fromStatus?: boolean;
    toStatus?: boolean;
    eventType?: boolean;
    reason?: boolean;
    metadata?: boolean;
    createdAt?: boolean;
};
export type BookingEventOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "bookingId" | "actorId" | "actorType" | "fromStatus" | "toStatus" | "eventType" | "reason" | "metadata" | "createdAt", ExtArgs["result"]["bookingEvent"]>;
export type BookingEventInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    booking?: boolean | Prisma.BookingDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.BookingEvent$actorArgs<ExtArgs>;
};
export type BookingEventIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    booking?: boolean | Prisma.BookingDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.BookingEvent$actorArgs<ExtArgs>;
};
export type BookingEventIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    booking?: boolean | Prisma.BookingDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.BookingEvent$actorArgs<ExtArgs>;
};
export type $BookingEventPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "BookingEvent";
    objects: {
        booking: Prisma.$BookingPayload<ExtArgs>;
        actor: Prisma.$UserPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        bookingId: string;
        actorId: string | null;
        actorType: $Enums.BookingActorType;
        fromStatus: $Enums.BookingStatus | null;
        toStatus: $Enums.BookingStatus;
        eventType: string;
        reason: string | null;
        metadata: runtime.JsonValue | null;
        createdAt: Date;
    }, ExtArgs["result"]["bookingEvent"]>;
    composites: {};
};
export type BookingEventGetPayload<S extends boolean | null | undefined | BookingEventDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$BookingEventPayload, S>;
export type BookingEventCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<BookingEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: BookingEventCountAggregateInputType | true;
};
export interface BookingEventDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['BookingEvent'];
        meta: {
            name: 'BookingEvent';
        };
    };
    findUnique<T extends BookingEventFindUniqueArgs>(args: Prisma.SelectSubset<T, BookingEventFindUniqueArgs<ExtArgs>>): Prisma.Prisma__BookingEventClient<runtime.Types.Result.GetResult<Prisma.$BookingEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends BookingEventFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, BookingEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__BookingEventClient<runtime.Types.Result.GetResult<Prisma.$BookingEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends BookingEventFindFirstArgs>(args?: Prisma.SelectSubset<T, BookingEventFindFirstArgs<ExtArgs>>): Prisma.Prisma__BookingEventClient<runtime.Types.Result.GetResult<Prisma.$BookingEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends BookingEventFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, BookingEventFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__BookingEventClient<runtime.Types.Result.GetResult<Prisma.$BookingEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends BookingEventFindManyArgs>(args?: Prisma.SelectSubset<T, BookingEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BookingEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends BookingEventCreateArgs>(args: Prisma.SelectSubset<T, BookingEventCreateArgs<ExtArgs>>): Prisma.Prisma__BookingEventClient<runtime.Types.Result.GetResult<Prisma.$BookingEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends BookingEventCreateManyArgs>(args?: Prisma.SelectSubset<T, BookingEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends BookingEventCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, BookingEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BookingEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends BookingEventDeleteArgs>(args: Prisma.SelectSubset<T, BookingEventDeleteArgs<ExtArgs>>): Prisma.Prisma__BookingEventClient<runtime.Types.Result.GetResult<Prisma.$BookingEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends BookingEventUpdateArgs>(args: Prisma.SelectSubset<T, BookingEventUpdateArgs<ExtArgs>>): Prisma.Prisma__BookingEventClient<runtime.Types.Result.GetResult<Prisma.$BookingEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends BookingEventDeleteManyArgs>(args?: Prisma.SelectSubset<T, BookingEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends BookingEventUpdateManyArgs>(args: Prisma.SelectSubset<T, BookingEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends BookingEventUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, BookingEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BookingEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends BookingEventUpsertArgs>(args: Prisma.SelectSubset<T, BookingEventUpsertArgs<ExtArgs>>): Prisma.Prisma__BookingEventClient<runtime.Types.Result.GetResult<Prisma.$BookingEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends BookingEventCountArgs>(args?: Prisma.Subset<T, BookingEventCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], BookingEventCountAggregateOutputType> : number>;
    aggregate<T extends BookingEventAggregateArgs>(args: Prisma.Subset<T, BookingEventAggregateArgs>): Prisma.PrismaPromise<GetBookingEventAggregateType<T>>;
    groupBy<T extends BookingEventGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: BookingEventGroupByArgs['orderBy'];
    } : {
        orderBy?: BookingEventGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, BookingEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBookingEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: BookingEventFieldRefs;
}
export interface Prisma__BookingEventClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    booking<T extends Prisma.BookingDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BookingDefaultArgs<ExtArgs>>): Prisma.Prisma__BookingClient<runtime.Types.Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    actor<T extends Prisma.BookingEvent$actorArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BookingEvent$actorArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface BookingEventFieldRefs {
    readonly id: Prisma.FieldRef<"BookingEvent", 'String'>;
    readonly bookingId: Prisma.FieldRef<"BookingEvent", 'String'>;
    readonly actorId: Prisma.FieldRef<"BookingEvent", 'String'>;
    readonly actorType: Prisma.FieldRef<"BookingEvent", 'BookingActorType'>;
    readonly fromStatus: Prisma.FieldRef<"BookingEvent", 'BookingStatus'>;
    readonly toStatus: Prisma.FieldRef<"BookingEvent", 'BookingStatus'>;
    readonly eventType: Prisma.FieldRef<"BookingEvent", 'String'>;
    readonly reason: Prisma.FieldRef<"BookingEvent", 'String'>;
    readonly metadata: Prisma.FieldRef<"BookingEvent", 'Json'>;
    readonly createdAt: Prisma.FieldRef<"BookingEvent", 'DateTime'>;
}
export type BookingEventFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BookingEventSelect<ExtArgs> | null;
    omit?: Prisma.BookingEventOmit<ExtArgs> | null;
    include?: Prisma.BookingEventInclude<ExtArgs> | null;
    where: Prisma.BookingEventWhereUniqueInput;
};
export type BookingEventFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BookingEventSelect<ExtArgs> | null;
    omit?: Prisma.BookingEventOmit<ExtArgs> | null;
    include?: Prisma.BookingEventInclude<ExtArgs> | null;
    where: Prisma.BookingEventWhereUniqueInput;
};
export type BookingEventFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BookingEventSelect<ExtArgs> | null;
    omit?: Prisma.BookingEventOmit<ExtArgs> | null;
    include?: Prisma.BookingEventInclude<ExtArgs> | null;
    where?: Prisma.BookingEventWhereInput;
    orderBy?: Prisma.BookingEventOrderByWithRelationInput | Prisma.BookingEventOrderByWithRelationInput[];
    cursor?: Prisma.BookingEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BookingEventScalarFieldEnum | Prisma.BookingEventScalarFieldEnum[];
};
export type BookingEventFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BookingEventSelect<ExtArgs> | null;
    omit?: Prisma.BookingEventOmit<ExtArgs> | null;
    include?: Prisma.BookingEventInclude<ExtArgs> | null;
    where?: Prisma.BookingEventWhereInput;
    orderBy?: Prisma.BookingEventOrderByWithRelationInput | Prisma.BookingEventOrderByWithRelationInput[];
    cursor?: Prisma.BookingEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BookingEventScalarFieldEnum | Prisma.BookingEventScalarFieldEnum[];
};
export type BookingEventFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BookingEventSelect<ExtArgs> | null;
    omit?: Prisma.BookingEventOmit<ExtArgs> | null;
    include?: Prisma.BookingEventInclude<ExtArgs> | null;
    where?: Prisma.BookingEventWhereInput;
    orderBy?: Prisma.BookingEventOrderByWithRelationInput | Prisma.BookingEventOrderByWithRelationInput[];
    cursor?: Prisma.BookingEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BookingEventScalarFieldEnum | Prisma.BookingEventScalarFieldEnum[];
};
export type BookingEventCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BookingEventSelect<ExtArgs> | null;
    omit?: Prisma.BookingEventOmit<ExtArgs> | null;
    include?: Prisma.BookingEventInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BookingEventCreateInput, Prisma.BookingEventUncheckedCreateInput>;
};
export type BookingEventCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.BookingEventCreateManyInput | Prisma.BookingEventCreateManyInput[];
    skipDuplicates?: boolean;
};
export type BookingEventCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BookingEventSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BookingEventOmit<ExtArgs> | null;
    data: Prisma.BookingEventCreateManyInput | Prisma.BookingEventCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.BookingEventIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type BookingEventUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BookingEventSelect<ExtArgs> | null;
    omit?: Prisma.BookingEventOmit<ExtArgs> | null;
    include?: Prisma.BookingEventInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BookingEventUpdateInput, Prisma.BookingEventUncheckedUpdateInput>;
    where: Prisma.BookingEventWhereUniqueInput;
};
export type BookingEventUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.BookingEventUpdateManyMutationInput, Prisma.BookingEventUncheckedUpdateManyInput>;
    where?: Prisma.BookingEventWhereInput;
    limit?: number;
};
export type BookingEventUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BookingEventSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BookingEventOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BookingEventUpdateManyMutationInput, Prisma.BookingEventUncheckedUpdateManyInput>;
    where?: Prisma.BookingEventWhereInput;
    limit?: number;
    include?: Prisma.BookingEventIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type BookingEventUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BookingEventSelect<ExtArgs> | null;
    omit?: Prisma.BookingEventOmit<ExtArgs> | null;
    include?: Prisma.BookingEventInclude<ExtArgs> | null;
    where: Prisma.BookingEventWhereUniqueInput;
    create: Prisma.XOR<Prisma.BookingEventCreateInput, Prisma.BookingEventUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.BookingEventUpdateInput, Prisma.BookingEventUncheckedUpdateInput>;
};
export type BookingEventDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BookingEventSelect<ExtArgs> | null;
    omit?: Prisma.BookingEventOmit<ExtArgs> | null;
    include?: Prisma.BookingEventInclude<ExtArgs> | null;
    where: Prisma.BookingEventWhereUniqueInput;
};
export type BookingEventDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BookingEventWhereInput;
    limit?: number;
};
export type BookingEvent$actorArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
export type BookingEventDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BookingEventSelect<ExtArgs> | null;
    omit?: Prisma.BookingEventOmit<ExtArgs> | null;
    include?: Prisma.BookingEventInclude<ExtArgs> | null;
};
