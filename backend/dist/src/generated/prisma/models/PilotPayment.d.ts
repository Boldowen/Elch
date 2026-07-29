import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type PilotPaymentModel = runtime.Types.Result.DefaultSelection<Prisma.$PilotPaymentPayload>;
export type AggregatePilotPayment = {
    _count: PilotPaymentCountAggregateOutputType | null;
    _min: PilotPaymentMinAggregateOutputType | null;
    _max: PilotPaymentMaxAggregateOutputType | null;
};
export type PilotPaymentMinAggregateOutputType = {
    id: string | null;
    bookingId: string | null;
    arrangement: $Enums.PaymentArrangement | null;
    status: $Enums.PaymentStatus | null;
    instructions: string | null;
    proposedById: string | null;
    agreedByTravelerAt: Date | null;
    agreedByProviderAt: Date | null;
    paidAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type PilotPaymentMaxAggregateOutputType = {
    id: string | null;
    bookingId: string | null;
    arrangement: $Enums.PaymentArrangement | null;
    status: $Enums.PaymentStatus | null;
    instructions: string | null;
    proposedById: string | null;
    agreedByTravelerAt: Date | null;
    agreedByProviderAt: Date | null;
    paidAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type PilotPaymentCountAggregateOutputType = {
    id: number;
    bookingId: number;
    arrangement: number;
    status: number;
    instructions: number;
    proposedById: number;
    agreedByTravelerAt: number;
    agreedByProviderAt: number;
    paidAt: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type PilotPaymentMinAggregateInputType = {
    id?: true;
    bookingId?: true;
    arrangement?: true;
    status?: true;
    instructions?: true;
    proposedById?: true;
    agreedByTravelerAt?: true;
    agreedByProviderAt?: true;
    paidAt?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type PilotPaymentMaxAggregateInputType = {
    id?: true;
    bookingId?: true;
    arrangement?: true;
    status?: true;
    instructions?: true;
    proposedById?: true;
    agreedByTravelerAt?: true;
    agreedByProviderAt?: true;
    paidAt?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type PilotPaymentCountAggregateInputType = {
    id?: true;
    bookingId?: true;
    arrangement?: true;
    status?: true;
    instructions?: true;
    proposedById?: true;
    agreedByTravelerAt?: true;
    agreedByProviderAt?: true;
    paidAt?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type PilotPaymentAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PilotPaymentWhereInput;
    orderBy?: Prisma.PilotPaymentOrderByWithRelationInput | Prisma.PilotPaymentOrderByWithRelationInput[];
    cursor?: Prisma.PilotPaymentWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PilotPaymentCountAggregateInputType;
    _min?: PilotPaymentMinAggregateInputType;
    _max?: PilotPaymentMaxAggregateInputType;
};
export type GetPilotPaymentAggregateType<T extends PilotPaymentAggregateArgs> = {
    [P in keyof T & keyof AggregatePilotPayment]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePilotPayment[P]> : Prisma.GetScalarType<T[P], AggregatePilotPayment[P]>;
};
export type PilotPaymentGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PilotPaymentWhereInput;
    orderBy?: Prisma.PilotPaymentOrderByWithAggregationInput | Prisma.PilotPaymentOrderByWithAggregationInput[];
    by: Prisma.PilotPaymentScalarFieldEnum[] | Prisma.PilotPaymentScalarFieldEnum;
    having?: Prisma.PilotPaymentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PilotPaymentCountAggregateInputType | true;
    _min?: PilotPaymentMinAggregateInputType;
    _max?: PilotPaymentMaxAggregateInputType;
};
export type PilotPaymentGroupByOutputType = {
    id: string;
    bookingId: string;
    arrangement: $Enums.PaymentArrangement;
    status: $Enums.PaymentStatus;
    instructions: string | null;
    proposedById: string;
    agreedByTravelerAt: Date | null;
    agreedByProviderAt: Date | null;
    paidAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    _count: PilotPaymentCountAggregateOutputType | null;
    _min: PilotPaymentMinAggregateOutputType | null;
    _max: PilotPaymentMaxAggregateOutputType | null;
};
export type GetPilotPaymentGroupByPayload<T extends PilotPaymentGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PilotPaymentGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PilotPaymentGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PilotPaymentGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PilotPaymentGroupByOutputType[P]>;
}>>;
export type PilotPaymentWhereInput = {
    AND?: Prisma.PilotPaymentWhereInput | Prisma.PilotPaymentWhereInput[];
    OR?: Prisma.PilotPaymentWhereInput[];
    NOT?: Prisma.PilotPaymentWhereInput | Prisma.PilotPaymentWhereInput[];
    id?: Prisma.UuidFilter<"PilotPayment"> | string;
    bookingId?: Prisma.UuidFilter<"PilotPayment"> | string;
    arrangement?: Prisma.EnumPaymentArrangementFilter<"PilotPayment"> | $Enums.PaymentArrangement;
    status?: Prisma.EnumPaymentStatusFilter<"PilotPayment"> | $Enums.PaymentStatus;
    instructions?: Prisma.StringNullableFilter<"PilotPayment"> | string | null;
    proposedById?: Prisma.UuidFilter<"PilotPayment"> | string;
    agreedByTravelerAt?: Prisma.DateTimeNullableFilter<"PilotPayment"> | Date | string | null;
    agreedByProviderAt?: Prisma.DateTimeNullableFilter<"PilotPayment"> | Date | string | null;
    paidAt?: Prisma.DateTimeNullableFilter<"PilotPayment"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"PilotPayment"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"PilotPayment"> | Date | string;
    booking?: Prisma.XOR<Prisma.BookingScalarRelationFilter, Prisma.BookingWhereInput>;
    proposedBy?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type PilotPaymentOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    bookingId?: Prisma.SortOrder;
    arrangement?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    instructions?: Prisma.SortOrderInput | Prisma.SortOrder;
    proposedById?: Prisma.SortOrder;
    agreedByTravelerAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    agreedByProviderAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    paidAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    booking?: Prisma.BookingOrderByWithRelationInput;
    proposedBy?: Prisma.UserOrderByWithRelationInput;
};
export type PilotPaymentWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    bookingId?: string;
    AND?: Prisma.PilotPaymentWhereInput | Prisma.PilotPaymentWhereInput[];
    OR?: Prisma.PilotPaymentWhereInput[];
    NOT?: Prisma.PilotPaymentWhereInput | Prisma.PilotPaymentWhereInput[];
    arrangement?: Prisma.EnumPaymentArrangementFilter<"PilotPayment"> | $Enums.PaymentArrangement;
    status?: Prisma.EnumPaymentStatusFilter<"PilotPayment"> | $Enums.PaymentStatus;
    instructions?: Prisma.StringNullableFilter<"PilotPayment"> | string | null;
    proposedById?: Prisma.UuidFilter<"PilotPayment"> | string;
    agreedByTravelerAt?: Prisma.DateTimeNullableFilter<"PilotPayment"> | Date | string | null;
    agreedByProviderAt?: Prisma.DateTimeNullableFilter<"PilotPayment"> | Date | string | null;
    paidAt?: Prisma.DateTimeNullableFilter<"PilotPayment"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"PilotPayment"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"PilotPayment"> | Date | string;
    booking?: Prisma.XOR<Prisma.BookingScalarRelationFilter, Prisma.BookingWhereInput>;
    proposedBy?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "bookingId">;
export type PilotPaymentOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    bookingId?: Prisma.SortOrder;
    arrangement?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    instructions?: Prisma.SortOrderInput | Prisma.SortOrder;
    proposedById?: Prisma.SortOrder;
    agreedByTravelerAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    agreedByProviderAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    paidAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.PilotPaymentCountOrderByAggregateInput;
    _max?: Prisma.PilotPaymentMaxOrderByAggregateInput;
    _min?: Prisma.PilotPaymentMinOrderByAggregateInput;
};
export type PilotPaymentScalarWhereWithAggregatesInput = {
    AND?: Prisma.PilotPaymentScalarWhereWithAggregatesInput | Prisma.PilotPaymentScalarWhereWithAggregatesInput[];
    OR?: Prisma.PilotPaymentScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PilotPaymentScalarWhereWithAggregatesInput | Prisma.PilotPaymentScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"PilotPayment"> | string;
    bookingId?: Prisma.UuidWithAggregatesFilter<"PilotPayment"> | string;
    arrangement?: Prisma.EnumPaymentArrangementWithAggregatesFilter<"PilotPayment"> | $Enums.PaymentArrangement;
    status?: Prisma.EnumPaymentStatusWithAggregatesFilter<"PilotPayment"> | $Enums.PaymentStatus;
    instructions?: Prisma.StringNullableWithAggregatesFilter<"PilotPayment"> | string | null;
    proposedById?: Prisma.UuidWithAggregatesFilter<"PilotPayment"> | string;
    agreedByTravelerAt?: Prisma.DateTimeNullableWithAggregatesFilter<"PilotPayment"> | Date | string | null;
    agreedByProviderAt?: Prisma.DateTimeNullableWithAggregatesFilter<"PilotPayment"> | Date | string | null;
    paidAt?: Prisma.DateTimeNullableWithAggregatesFilter<"PilotPayment"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"PilotPayment"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"PilotPayment"> | Date | string;
};
export type PilotPaymentCreateInput = {
    id?: string;
    arrangement: $Enums.PaymentArrangement;
    status?: $Enums.PaymentStatus;
    instructions?: string | null;
    agreedByTravelerAt?: Date | string | null;
    agreedByProviderAt?: Date | string | null;
    paidAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    booking: Prisma.BookingCreateNestedOneWithoutPaymentInput;
    proposedBy: Prisma.UserCreateNestedOneWithoutPaymentArrangementsProposedInput;
};
export type PilotPaymentUncheckedCreateInput = {
    id?: string;
    bookingId: string;
    arrangement: $Enums.PaymentArrangement;
    status?: $Enums.PaymentStatus;
    instructions?: string | null;
    proposedById: string;
    agreedByTravelerAt?: Date | string | null;
    agreedByProviderAt?: Date | string | null;
    paidAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PilotPaymentUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    arrangement?: Prisma.EnumPaymentArrangementFieldUpdateOperationsInput | $Enums.PaymentArrangement;
    status?: Prisma.EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus;
    instructions?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    agreedByTravelerAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    agreedByProviderAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    booking?: Prisma.BookingUpdateOneRequiredWithoutPaymentNestedInput;
    proposedBy?: Prisma.UserUpdateOneRequiredWithoutPaymentArrangementsProposedNestedInput;
};
export type PilotPaymentUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    bookingId?: Prisma.StringFieldUpdateOperationsInput | string;
    arrangement?: Prisma.EnumPaymentArrangementFieldUpdateOperationsInput | $Enums.PaymentArrangement;
    status?: Prisma.EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus;
    instructions?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    proposedById?: Prisma.StringFieldUpdateOperationsInput | string;
    agreedByTravelerAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    agreedByProviderAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PilotPaymentCreateManyInput = {
    id?: string;
    bookingId: string;
    arrangement: $Enums.PaymentArrangement;
    status?: $Enums.PaymentStatus;
    instructions?: string | null;
    proposedById: string;
    agreedByTravelerAt?: Date | string | null;
    agreedByProviderAt?: Date | string | null;
    paidAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PilotPaymentUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    arrangement?: Prisma.EnumPaymentArrangementFieldUpdateOperationsInput | $Enums.PaymentArrangement;
    status?: Prisma.EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus;
    instructions?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    agreedByTravelerAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    agreedByProviderAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PilotPaymentUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    bookingId?: Prisma.StringFieldUpdateOperationsInput | string;
    arrangement?: Prisma.EnumPaymentArrangementFieldUpdateOperationsInput | $Enums.PaymentArrangement;
    status?: Prisma.EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus;
    instructions?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    proposedById?: Prisma.StringFieldUpdateOperationsInput | string;
    agreedByTravelerAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    agreedByProviderAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PilotPaymentListRelationFilter = {
    every?: Prisma.PilotPaymentWhereInput;
    some?: Prisma.PilotPaymentWhereInput;
    none?: Prisma.PilotPaymentWhereInput;
};
export type PilotPaymentOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type PilotPaymentNullableScalarRelationFilter = {
    is?: Prisma.PilotPaymentWhereInput | null;
    isNot?: Prisma.PilotPaymentWhereInput | null;
};
export type PilotPaymentCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    bookingId?: Prisma.SortOrder;
    arrangement?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    instructions?: Prisma.SortOrder;
    proposedById?: Prisma.SortOrder;
    agreedByTravelerAt?: Prisma.SortOrder;
    agreedByProviderAt?: Prisma.SortOrder;
    paidAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PilotPaymentMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    bookingId?: Prisma.SortOrder;
    arrangement?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    instructions?: Prisma.SortOrder;
    proposedById?: Prisma.SortOrder;
    agreedByTravelerAt?: Prisma.SortOrder;
    agreedByProviderAt?: Prisma.SortOrder;
    paidAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PilotPaymentMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    bookingId?: Prisma.SortOrder;
    arrangement?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    instructions?: Prisma.SortOrder;
    proposedById?: Prisma.SortOrder;
    agreedByTravelerAt?: Prisma.SortOrder;
    agreedByProviderAt?: Prisma.SortOrder;
    paidAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PilotPaymentCreateNestedManyWithoutProposedByInput = {
    create?: Prisma.XOR<Prisma.PilotPaymentCreateWithoutProposedByInput, Prisma.PilotPaymentUncheckedCreateWithoutProposedByInput> | Prisma.PilotPaymentCreateWithoutProposedByInput[] | Prisma.PilotPaymentUncheckedCreateWithoutProposedByInput[];
    connectOrCreate?: Prisma.PilotPaymentCreateOrConnectWithoutProposedByInput | Prisma.PilotPaymentCreateOrConnectWithoutProposedByInput[];
    createMany?: Prisma.PilotPaymentCreateManyProposedByInputEnvelope;
    connect?: Prisma.PilotPaymentWhereUniqueInput | Prisma.PilotPaymentWhereUniqueInput[];
};
export type PilotPaymentUncheckedCreateNestedManyWithoutProposedByInput = {
    create?: Prisma.XOR<Prisma.PilotPaymentCreateWithoutProposedByInput, Prisma.PilotPaymentUncheckedCreateWithoutProposedByInput> | Prisma.PilotPaymentCreateWithoutProposedByInput[] | Prisma.PilotPaymentUncheckedCreateWithoutProposedByInput[];
    connectOrCreate?: Prisma.PilotPaymentCreateOrConnectWithoutProposedByInput | Prisma.PilotPaymentCreateOrConnectWithoutProposedByInput[];
    createMany?: Prisma.PilotPaymentCreateManyProposedByInputEnvelope;
    connect?: Prisma.PilotPaymentWhereUniqueInput | Prisma.PilotPaymentWhereUniqueInput[];
};
export type PilotPaymentUpdateManyWithoutProposedByNestedInput = {
    create?: Prisma.XOR<Prisma.PilotPaymentCreateWithoutProposedByInput, Prisma.PilotPaymentUncheckedCreateWithoutProposedByInput> | Prisma.PilotPaymentCreateWithoutProposedByInput[] | Prisma.PilotPaymentUncheckedCreateWithoutProposedByInput[];
    connectOrCreate?: Prisma.PilotPaymentCreateOrConnectWithoutProposedByInput | Prisma.PilotPaymentCreateOrConnectWithoutProposedByInput[];
    upsert?: Prisma.PilotPaymentUpsertWithWhereUniqueWithoutProposedByInput | Prisma.PilotPaymentUpsertWithWhereUniqueWithoutProposedByInput[];
    createMany?: Prisma.PilotPaymentCreateManyProposedByInputEnvelope;
    set?: Prisma.PilotPaymentWhereUniqueInput | Prisma.PilotPaymentWhereUniqueInput[];
    disconnect?: Prisma.PilotPaymentWhereUniqueInput | Prisma.PilotPaymentWhereUniqueInput[];
    delete?: Prisma.PilotPaymentWhereUniqueInput | Prisma.PilotPaymentWhereUniqueInput[];
    connect?: Prisma.PilotPaymentWhereUniqueInput | Prisma.PilotPaymentWhereUniqueInput[];
    update?: Prisma.PilotPaymentUpdateWithWhereUniqueWithoutProposedByInput | Prisma.PilotPaymentUpdateWithWhereUniqueWithoutProposedByInput[];
    updateMany?: Prisma.PilotPaymentUpdateManyWithWhereWithoutProposedByInput | Prisma.PilotPaymentUpdateManyWithWhereWithoutProposedByInput[];
    deleteMany?: Prisma.PilotPaymentScalarWhereInput | Prisma.PilotPaymentScalarWhereInput[];
};
export type PilotPaymentUncheckedUpdateManyWithoutProposedByNestedInput = {
    create?: Prisma.XOR<Prisma.PilotPaymentCreateWithoutProposedByInput, Prisma.PilotPaymentUncheckedCreateWithoutProposedByInput> | Prisma.PilotPaymentCreateWithoutProposedByInput[] | Prisma.PilotPaymentUncheckedCreateWithoutProposedByInput[];
    connectOrCreate?: Prisma.PilotPaymentCreateOrConnectWithoutProposedByInput | Prisma.PilotPaymentCreateOrConnectWithoutProposedByInput[];
    upsert?: Prisma.PilotPaymentUpsertWithWhereUniqueWithoutProposedByInput | Prisma.PilotPaymentUpsertWithWhereUniqueWithoutProposedByInput[];
    createMany?: Prisma.PilotPaymentCreateManyProposedByInputEnvelope;
    set?: Prisma.PilotPaymentWhereUniqueInput | Prisma.PilotPaymentWhereUniqueInput[];
    disconnect?: Prisma.PilotPaymentWhereUniqueInput | Prisma.PilotPaymentWhereUniqueInput[];
    delete?: Prisma.PilotPaymentWhereUniqueInput | Prisma.PilotPaymentWhereUniqueInput[];
    connect?: Prisma.PilotPaymentWhereUniqueInput | Prisma.PilotPaymentWhereUniqueInput[];
    update?: Prisma.PilotPaymentUpdateWithWhereUniqueWithoutProposedByInput | Prisma.PilotPaymentUpdateWithWhereUniqueWithoutProposedByInput[];
    updateMany?: Prisma.PilotPaymentUpdateManyWithWhereWithoutProposedByInput | Prisma.PilotPaymentUpdateManyWithWhereWithoutProposedByInput[];
    deleteMany?: Prisma.PilotPaymentScalarWhereInput | Prisma.PilotPaymentScalarWhereInput[];
};
export type PilotPaymentCreateNestedOneWithoutBookingInput = {
    create?: Prisma.XOR<Prisma.PilotPaymentCreateWithoutBookingInput, Prisma.PilotPaymentUncheckedCreateWithoutBookingInput>;
    connectOrCreate?: Prisma.PilotPaymentCreateOrConnectWithoutBookingInput;
    connect?: Prisma.PilotPaymentWhereUniqueInput;
};
export type PilotPaymentUncheckedCreateNestedOneWithoutBookingInput = {
    create?: Prisma.XOR<Prisma.PilotPaymentCreateWithoutBookingInput, Prisma.PilotPaymentUncheckedCreateWithoutBookingInput>;
    connectOrCreate?: Prisma.PilotPaymentCreateOrConnectWithoutBookingInput;
    connect?: Prisma.PilotPaymentWhereUniqueInput;
};
export type PilotPaymentUpdateOneWithoutBookingNestedInput = {
    create?: Prisma.XOR<Prisma.PilotPaymentCreateWithoutBookingInput, Prisma.PilotPaymentUncheckedCreateWithoutBookingInput>;
    connectOrCreate?: Prisma.PilotPaymentCreateOrConnectWithoutBookingInput;
    upsert?: Prisma.PilotPaymentUpsertWithoutBookingInput;
    disconnect?: Prisma.PilotPaymentWhereInput | boolean;
    delete?: Prisma.PilotPaymentWhereInput | boolean;
    connect?: Prisma.PilotPaymentWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PilotPaymentUpdateToOneWithWhereWithoutBookingInput, Prisma.PilotPaymentUpdateWithoutBookingInput>, Prisma.PilotPaymentUncheckedUpdateWithoutBookingInput>;
};
export type PilotPaymentUncheckedUpdateOneWithoutBookingNestedInput = {
    create?: Prisma.XOR<Prisma.PilotPaymentCreateWithoutBookingInput, Prisma.PilotPaymentUncheckedCreateWithoutBookingInput>;
    connectOrCreate?: Prisma.PilotPaymentCreateOrConnectWithoutBookingInput;
    upsert?: Prisma.PilotPaymentUpsertWithoutBookingInput;
    disconnect?: Prisma.PilotPaymentWhereInput | boolean;
    delete?: Prisma.PilotPaymentWhereInput | boolean;
    connect?: Prisma.PilotPaymentWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PilotPaymentUpdateToOneWithWhereWithoutBookingInput, Prisma.PilotPaymentUpdateWithoutBookingInput>, Prisma.PilotPaymentUncheckedUpdateWithoutBookingInput>;
};
export type EnumPaymentArrangementFieldUpdateOperationsInput = {
    set?: $Enums.PaymentArrangement;
};
export type EnumPaymentStatusFieldUpdateOperationsInput = {
    set?: $Enums.PaymentStatus;
};
export type PilotPaymentCreateWithoutProposedByInput = {
    id?: string;
    arrangement: $Enums.PaymentArrangement;
    status?: $Enums.PaymentStatus;
    instructions?: string | null;
    agreedByTravelerAt?: Date | string | null;
    agreedByProviderAt?: Date | string | null;
    paidAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    booking: Prisma.BookingCreateNestedOneWithoutPaymentInput;
};
export type PilotPaymentUncheckedCreateWithoutProposedByInput = {
    id?: string;
    bookingId: string;
    arrangement: $Enums.PaymentArrangement;
    status?: $Enums.PaymentStatus;
    instructions?: string | null;
    agreedByTravelerAt?: Date | string | null;
    agreedByProviderAt?: Date | string | null;
    paidAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PilotPaymentCreateOrConnectWithoutProposedByInput = {
    where: Prisma.PilotPaymentWhereUniqueInput;
    create: Prisma.XOR<Prisma.PilotPaymentCreateWithoutProposedByInput, Prisma.PilotPaymentUncheckedCreateWithoutProposedByInput>;
};
export type PilotPaymentCreateManyProposedByInputEnvelope = {
    data: Prisma.PilotPaymentCreateManyProposedByInput | Prisma.PilotPaymentCreateManyProposedByInput[];
    skipDuplicates?: boolean;
};
export type PilotPaymentUpsertWithWhereUniqueWithoutProposedByInput = {
    where: Prisma.PilotPaymentWhereUniqueInput;
    update: Prisma.XOR<Prisma.PilotPaymentUpdateWithoutProposedByInput, Prisma.PilotPaymentUncheckedUpdateWithoutProposedByInput>;
    create: Prisma.XOR<Prisma.PilotPaymentCreateWithoutProposedByInput, Prisma.PilotPaymentUncheckedCreateWithoutProposedByInput>;
};
export type PilotPaymentUpdateWithWhereUniqueWithoutProposedByInput = {
    where: Prisma.PilotPaymentWhereUniqueInput;
    data: Prisma.XOR<Prisma.PilotPaymentUpdateWithoutProposedByInput, Prisma.PilotPaymentUncheckedUpdateWithoutProposedByInput>;
};
export type PilotPaymentUpdateManyWithWhereWithoutProposedByInput = {
    where: Prisma.PilotPaymentScalarWhereInput;
    data: Prisma.XOR<Prisma.PilotPaymentUpdateManyMutationInput, Prisma.PilotPaymentUncheckedUpdateManyWithoutProposedByInput>;
};
export type PilotPaymentScalarWhereInput = {
    AND?: Prisma.PilotPaymentScalarWhereInput | Prisma.PilotPaymentScalarWhereInput[];
    OR?: Prisma.PilotPaymentScalarWhereInput[];
    NOT?: Prisma.PilotPaymentScalarWhereInput | Prisma.PilotPaymentScalarWhereInput[];
    id?: Prisma.UuidFilter<"PilotPayment"> | string;
    bookingId?: Prisma.UuidFilter<"PilotPayment"> | string;
    arrangement?: Prisma.EnumPaymentArrangementFilter<"PilotPayment"> | $Enums.PaymentArrangement;
    status?: Prisma.EnumPaymentStatusFilter<"PilotPayment"> | $Enums.PaymentStatus;
    instructions?: Prisma.StringNullableFilter<"PilotPayment"> | string | null;
    proposedById?: Prisma.UuidFilter<"PilotPayment"> | string;
    agreedByTravelerAt?: Prisma.DateTimeNullableFilter<"PilotPayment"> | Date | string | null;
    agreedByProviderAt?: Prisma.DateTimeNullableFilter<"PilotPayment"> | Date | string | null;
    paidAt?: Prisma.DateTimeNullableFilter<"PilotPayment"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"PilotPayment"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"PilotPayment"> | Date | string;
};
export type PilotPaymentCreateWithoutBookingInput = {
    id?: string;
    arrangement: $Enums.PaymentArrangement;
    status?: $Enums.PaymentStatus;
    instructions?: string | null;
    agreedByTravelerAt?: Date | string | null;
    agreedByProviderAt?: Date | string | null;
    paidAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    proposedBy: Prisma.UserCreateNestedOneWithoutPaymentArrangementsProposedInput;
};
export type PilotPaymentUncheckedCreateWithoutBookingInput = {
    id?: string;
    arrangement: $Enums.PaymentArrangement;
    status?: $Enums.PaymentStatus;
    instructions?: string | null;
    proposedById: string;
    agreedByTravelerAt?: Date | string | null;
    agreedByProviderAt?: Date | string | null;
    paidAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PilotPaymentCreateOrConnectWithoutBookingInput = {
    where: Prisma.PilotPaymentWhereUniqueInput;
    create: Prisma.XOR<Prisma.PilotPaymentCreateWithoutBookingInput, Prisma.PilotPaymentUncheckedCreateWithoutBookingInput>;
};
export type PilotPaymentUpsertWithoutBookingInput = {
    update: Prisma.XOR<Prisma.PilotPaymentUpdateWithoutBookingInput, Prisma.PilotPaymentUncheckedUpdateWithoutBookingInput>;
    create: Prisma.XOR<Prisma.PilotPaymentCreateWithoutBookingInput, Prisma.PilotPaymentUncheckedCreateWithoutBookingInput>;
    where?: Prisma.PilotPaymentWhereInput;
};
export type PilotPaymentUpdateToOneWithWhereWithoutBookingInput = {
    where?: Prisma.PilotPaymentWhereInput;
    data: Prisma.XOR<Prisma.PilotPaymentUpdateWithoutBookingInput, Prisma.PilotPaymentUncheckedUpdateWithoutBookingInput>;
};
export type PilotPaymentUpdateWithoutBookingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    arrangement?: Prisma.EnumPaymentArrangementFieldUpdateOperationsInput | $Enums.PaymentArrangement;
    status?: Prisma.EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus;
    instructions?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    agreedByTravelerAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    agreedByProviderAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    proposedBy?: Prisma.UserUpdateOneRequiredWithoutPaymentArrangementsProposedNestedInput;
};
export type PilotPaymentUncheckedUpdateWithoutBookingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    arrangement?: Prisma.EnumPaymentArrangementFieldUpdateOperationsInput | $Enums.PaymentArrangement;
    status?: Prisma.EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus;
    instructions?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    proposedById?: Prisma.StringFieldUpdateOperationsInput | string;
    agreedByTravelerAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    agreedByProviderAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PilotPaymentCreateManyProposedByInput = {
    id?: string;
    bookingId: string;
    arrangement: $Enums.PaymentArrangement;
    status?: $Enums.PaymentStatus;
    instructions?: string | null;
    agreedByTravelerAt?: Date | string | null;
    agreedByProviderAt?: Date | string | null;
    paidAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PilotPaymentUpdateWithoutProposedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    arrangement?: Prisma.EnumPaymentArrangementFieldUpdateOperationsInput | $Enums.PaymentArrangement;
    status?: Prisma.EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus;
    instructions?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    agreedByTravelerAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    agreedByProviderAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    booking?: Prisma.BookingUpdateOneRequiredWithoutPaymentNestedInput;
};
export type PilotPaymentUncheckedUpdateWithoutProposedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    bookingId?: Prisma.StringFieldUpdateOperationsInput | string;
    arrangement?: Prisma.EnumPaymentArrangementFieldUpdateOperationsInput | $Enums.PaymentArrangement;
    status?: Prisma.EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus;
    instructions?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    agreedByTravelerAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    agreedByProviderAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PilotPaymentUncheckedUpdateManyWithoutProposedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    bookingId?: Prisma.StringFieldUpdateOperationsInput | string;
    arrangement?: Prisma.EnumPaymentArrangementFieldUpdateOperationsInput | $Enums.PaymentArrangement;
    status?: Prisma.EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus;
    instructions?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    agreedByTravelerAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    agreedByProviderAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PilotPaymentSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    bookingId?: boolean;
    arrangement?: boolean;
    status?: boolean;
    instructions?: boolean;
    proposedById?: boolean;
    agreedByTravelerAt?: boolean;
    agreedByProviderAt?: boolean;
    paidAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    booking?: boolean | Prisma.BookingDefaultArgs<ExtArgs>;
    proposedBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["pilotPayment"]>;
export type PilotPaymentSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    bookingId?: boolean;
    arrangement?: boolean;
    status?: boolean;
    instructions?: boolean;
    proposedById?: boolean;
    agreedByTravelerAt?: boolean;
    agreedByProviderAt?: boolean;
    paidAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    booking?: boolean | Prisma.BookingDefaultArgs<ExtArgs>;
    proposedBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["pilotPayment"]>;
export type PilotPaymentSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    bookingId?: boolean;
    arrangement?: boolean;
    status?: boolean;
    instructions?: boolean;
    proposedById?: boolean;
    agreedByTravelerAt?: boolean;
    agreedByProviderAt?: boolean;
    paidAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    booking?: boolean | Prisma.BookingDefaultArgs<ExtArgs>;
    proposedBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["pilotPayment"]>;
export type PilotPaymentSelectScalar = {
    id?: boolean;
    bookingId?: boolean;
    arrangement?: boolean;
    status?: boolean;
    instructions?: boolean;
    proposedById?: boolean;
    agreedByTravelerAt?: boolean;
    agreedByProviderAt?: boolean;
    paidAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type PilotPaymentOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "bookingId" | "arrangement" | "status" | "instructions" | "proposedById" | "agreedByTravelerAt" | "agreedByProviderAt" | "paidAt" | "createdAt" | "updatedAt", ExtArgs["result"]["pilotPayment"]>;
export type PilotPaymentInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    booking?: boolean | Prisma.BookingDefaultArgs<ExtArgs>;
    proposedBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type PilotPaymentIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    booking?: boolean | Prisma.BookingDefaultArgs<ExtArgs>;
    proposedBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type PilotPaymentIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    booking?: boolean | Prisma.BookingDefaultArgs<ExtArgs>;
    proposedBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $PilotPaymentPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PilotPayment";
    objects: {
        booking: Prisma.$BookingPayload<ExtArgs>;
        proposedBy: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        bookingId: string;
        arrangement: $Enums.PaymentArrangement;
        status: $Enums.PaymentStatus;
        instructions: string | null;
        proposedById: string;
        agreedByTravelerAt: Date | null;
        agreedByProviderAt: Date | null;
        paidAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["pilotPayment"]>;
    composites: {};
};
export type PilotPaymentGetPayload<S extends boolean | null | undefined | PilotPaymentDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PilotPaymentPayload, S>;
export type PilotPaymentCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PilotPaymentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PilotPaymentCountAggregateInputType | true;
};
export interface PilotPaymentDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PilotPayment'];
        meta: {
            name: 'PilotPayment';
        };
    };
    findUnique<T extends PilotPaymentFindUniqueArgs>(args: Prisma.SelectSubset<T, PilotPaymentFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PilotPaymentClient<runtime.Types.Result.GetResult<Prisma.$PilotPaymentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PilotPaymentFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PilotPaymentFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PilotPaymentClient<runtime.Types.Result.GetResult<Prisma.$PilotPaymentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PilotPaymentFindFirstArgs>(args?: Prisma.SelectSubset<T, PilotPaymentFindFirstArgs<ExtArgs>>): Prisma.Prisma__PilotPaymentClient<runtime.Types.Result.GetResult<Prisma.$PilotPaymentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PilotPaymentFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PilotPaymentFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PilotPaymentClient<runtime.Types.Result.GetResult<Prisma.$PilotPaymentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PilotPaymentFindManyArgs>(args?: Prisma.SelectSubset<T, PilotPaymentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PilotPaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PilotPaymentCreateArgs>(args: Prisma.SelectSubset<T, PilotPaymentCreateArgs<ExtArgs>>): Prisma.Prisma__PilotPaymentClient<runtime.Types.Result.GetResult<Prisma.$PilotPaymentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PilotPaymentCreateManyArgs>(args?: Prisma.SelectSubset<T, PilotPaymentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PilotPaymentCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PilotPaymentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PilotPaymentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PilotPaymentDeleteArgs>(args: Prisma.SelectSubset<T, PilotPaymentDeleteArgs<ExtArgs>>): Prisma.Prisma__PilotPaymentClient<runtime.Types.Result.GetResult<Prisma.$PilotPaymentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PilotPaymentUpdateArgs>(args: Prisma.SelectSubset<T, PilotPaymentUpdateArgs<ExtArgs>>): Prisma.Prisma__PilotPaymentClient<runtime.Types.Result.GetResult<Prisma.$PilotPaymentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PilotPaymentDeleteManyArgs>(args?: Prisma.SelectSubset<T, PilotPaymentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PilotPaymentUpdateManyArgs>(args: Prisma.SelectSubset<T, PilotPaymentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PilotPaymentUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PilotPaymentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PilotPaymentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PilotPaymentUpsertArgs>(args: Prisma.SelectSubset<T, PilotPaymentUpsertArgs<ExtArgs>>): Prisma.Prisma__PilotPaymentClient<runtime.Types.Result.GetResult<Prisma.$PilotPaymentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PilotPaymentCountArgs>(args?: Prisma.Subset<T, PilotPaymentCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PilotPaymentCountAggregateOutputType> : number>;
    aggregate<T extends PilotPaymentAggregateArgs>(args: Prisma.Subset<T, PilotPaymentAggregateArgs>): Prisma.PrismaPromise<GetPilotPaymentAggregateType<T>>;
    groupBy<T extends PilotPaymentGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PilotPaymentGroupByArgs['orderBy'];
    } : {
        orderBy?: PilotPaymentGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PilotPaymentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPilotPaymentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PilotPaymentFieldRefs;
}
export interface Prisma__PilotPaymentClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    booking<T extends Prisma.BookingDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BookingDefaultArgs<ExtArgs>>): Prisma.Prisma__BookingClient<runtime.Types.Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    proposedBy<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PilotPaymentFieldRefs {
    readonly id: Prisma.FieldRef<"PilotPayment", 'String'>;
    readonly bookingId: Prisma.FieldRef<"PilotPayment", 'String'>;
    readonly arrangement: Prisma.FieldRef<"PilotPayment", 'PaymentArrangement'>;
    readonly status: Prisma.FieldRef<"PilotPayment", 'PaymentStatus'>;
    readonly instructions: Prisma.FieldRef<"PilotPayment", 'String'>;
    readonly proposedById: Prisma.FieldRef<"PilotPayment", 'String'>;
    readonly agreedByTravelerAt: Prisma.FieldRef<"PilotPayment", 'DateTime'>;
    readonly agreedByProviderAt: Prisma.FieldRef<"PilotPayment", 'DateTime'>;
    readonly paidAt: Prisma.FieldRef<"PilotPayment", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"PilotPayment", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"PilotPayment", 'DateTime'>;
}
export type PilotPaymentFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PilotPaymentSelect<ExtArgs> | null;
    omit?: Prisma.PilotPaymentOmit<ExtArgs> | null;
    include?: Prisma.PilotPaymentInclude<ExtArgs> | null;
    where: Prisma.PilotPaymentWhereUniqueInput;
};
export type PilotPaymentFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PilotPaymentSelect<ExtArgs> | null;
    omit?: Prisma.PilotPaymentOmit<ExtArgs> | null;
    include?: Prisma.PilotPaymentInclude<ExtArgs> | null;
    where: Prisma.PilotPaymentWhereUniqueInput;
};
export type PilotPaymentFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PilotPaymentSelect<ExtArgs> | null;
    omit?: Prisma.PilotPaymentOmit<ExtArgs> | null;
    include?: Prisma.PilotPaymentInclude<ExtArgs> | null;
    where?: Prisma.PilotPaymentWhereInput;
    orderBy?: Prisma.PilotPaymentOrderByWithRelationInput | Prisma.PilotPaymentOrderByWithRelationInput[];
    cursor?: Prisma.PilotPaymentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PilotPaymentScalarFieldEnum | Prisma.PilotPaymentScalarFieldEnum[];
};
export type PilotPaymentFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PilotPaymentSelect<ExtArgs> | null;
    omit?: Prisma.PilotPaymentOmit<ExtArgs> | null;
    include?: Prisma.PilotPaymentInclude<ExtArgs> | null;
    where?: Prisma.PilotPaymentWhereInput;
    orderBy?: Prisma.PilotPaymentOrderByWithRelationInput | Prisma.PilotPaymentOrderByWithRelationInput[];
    cursor?: Prisma.PilotPaymentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PilotPaymentScalarFieldEnum | Prisma.PilotPaymentScalarFieldEnum[];
};
export type PilotPaymentFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PilotPaymentSelect<ExtArgs> | null;
    omit?: Prisma.PilotPaymentOmit<ExtArgs> | null;
    include?: Prisma.PilotPaymentInclude<ExtArgs> | null;
    where?: Prisma.PilotPaymentWhereInput;
    orderBy?: Prisma.PilotPaymentOrderByWithRelationInput | Prisma.PilotPaymentOrderByWithRelationInput[];
    cursor?: Prisma.PilotPaymentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PilotPaymentScalarFieldEnum | Prisma.PilotPaymentScalarFieldEnum[];
};
export type PilotPaymentCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PilotPaymentSelect<ExtArgs> | null;
    omit?: Prisma.PilotPaymentOmit<ExtArgs> | null;
    include?: Prisma.PilotPaymentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PilotPaymentCreateInput, Prisma.PilotPaymentUncheckedCreateInput>;
};
export type PilotPaymentCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PilotPaymentCreateManyInput | Prisma.PilotPaymentCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PilotPaymentCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PilotPaymentSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PilotPaymentOmit<ExtArgs> | null;
    data: Prisma.PilotPaymentCreateManyInput | Prisma.PilotPaymentCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.PilotPaymentIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type PilotPaymentUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PilotPaymentSelect<ExtArgs> | null;
    omit?: Prisma.PilotPaymentOmit<ExtArgs> | null;
    include?: Prisma.PilotPaymentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PilotPaymentUpdateInput, Prisma.PilotPaymentUncheckedUpdateInput>;
    where: Prisma.PilotPaymentWhereUniqueInput;
};
export type PilotPaymentUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PilotPaymentUpdateManyMutationInput, Prisma.PilotPaymentUncheckedUpdateManyInput>;
    where?: Prisma.PilotPaymentWhereInput;
    limit?: number;
};
export type PilotPaymentUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PilotPaymentSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PilotPaymentOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PilotPaymentUpdateManyMutationInput, Prisma.PilotPaymentUncheckedUpdateManyInput>;
    where?: Prisma.PilotPaymentWhereInput;
    limit?: number;
    include?: Prisma.PilotPaymentIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type PilotPaymentUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PilotPaymentSelect<ExtArgs> | null;
    omit?: Prisma.PilotPaymentOmit<ExtArgs> | null;
    include?: Prisma.PilotPaymentInclude<ExtArgs> | null;
    where: Prisma.PilotPaymentWhereUniqueInput;
    create: Prisma.XOR<Prisma.PilotPaymentCreateInput, Prisma.PilotPaymentUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PilotPaymentUpdateInput, Prisma.PilotPaymentUncheckedUpdateInput>;
};
export type PilotPaymentDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PilotPaymentSelect<ExtArgs> | null;
    omit?: Prisma.PilotPaymentOmit<ExtArgs> | null;
    include?: Prisma.PilotPaymentInclude<ExtArgs> | null;
    where: Prisma.PilotPaymentWhereUniqueInput;
};
export type PilotPaymentDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PilotPaymentWhereInput;
    limit?: number;
};
export type PilotPaymentDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PilotPaymentSelect<ExtArgs> | null;
    omit?: Prisma.PilotPaymentOmit<ExtArgs> | null;
    include?: Prisma.PilotPaymentInclude<ExtArgs> | null;
};
