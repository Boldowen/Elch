import type * as runtime from "@prisma/client/runtime/client";
import * as $Enums from "./enums.js";
import type * as Prisma from "./internal/prismaNamespace.js";
export type UuidFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedUuidFilter<$PrismaModel> | string;
};
export type StringFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringFilter<$PrismaModel> | string;
};
export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringNullableFilter<$PrismaModel> | string | null;
};
export type EnumAuthProviderFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthProvider | Prisma.EnumAuthProviderFieldRefInput<$PrismaModel>;
    in?: $Enums.AuthProvider[] | Prisma.ListEnumAuthProviderFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AuthProvider[] | Prisma.ListEnumAuthProviderFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAuthProviderFilter<$PrismaModel> | $Enums.AuthProvider;
};
export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolFilter<$PrismaModel> | boolean;
};
export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
};
export type EnumUserModerationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.UserModerationStatus | Prisma.EnumUserModerationStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.UserModerationStatus[] | Prisma.ListEnumUserModerationStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.UserModerationStatus[] | Prisma.ListEnumUserModerationStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumUserModerationStatusFilter<$PrismaModel> | $Enums.UserModerationStatus;
};
export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeFilter<$PrismaModel> | Date | string;
};
export type SortOrderInput = {
    sort: Prisma.SortOrder;
    nulls?: Prisma.NullsOrder;
};
export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedUuidWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedStringNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedStringNullableFilter<$PrismaModel>;
};
export type EnumAuthProviderWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthProvider | Prisma.EnumAuthProviderFieldRefInput<$PrismaModel>;
    in?: $Enums.AuthProvider[] | Prisma.ListEnumAuthProviderFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AuthProvider[] | Prisma.ListEnumAuthProviderFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAuthProviderWithAggregatesFilter<$PrismaModel> | $Enums.AuthProvider;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumAuthProviderFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumAuthProviderFilter<$PrismaModel>;
};
export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedBoolFilter<$PrismaModel>;
    _max?: Prisma.NestedBoolFilter<$PrismaModel>;
};
export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
};
export type EnumUserModerationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserModerationStatus | Prisma.EnumUserModerationStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.UserModerationStatus[] | Prisma.ListEnumUserModerationStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.UserModerationStatus[] | Prisma.ListEnumUserModerationStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumUserModerationStatusWithAggregatesFilter<$PrismaModel> | $Enums.UserModerationStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumUserModerationStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumUserModerationStatusFilter<$PrismaModel>;
};
export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeFilter<$PrismaModel>;
};
export type IntFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntFilter<$PrismaModel> | number;
};
export type JsonFilter<$PrismaModel = never> = Prisma.PatchUndefined<Prisma.Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>, Required<JsonFilterBase<$PrismaModel>>> | Prisma.OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>;
export type JsonFilterBase<$PrismaModel = never> = {
    equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    path?: string[];
    mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    lt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    lte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
};
export type EnumPricingTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.PricingType | Prisma.EnumPricingTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.PricingType[] | Prisma.ListEnumPricingTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PricingType[] | Prisma.ListEnumPricingTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPricingTypeFilter<$PrismaModel> | $Enums.PricingType;
};
export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel> | null;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalNullableFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type EnumGuideStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.GuideStatus | Prisma.EnumGuideStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.GuideStatus[] | Prisma.ListEnumGuideStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.GuideStatus[] | Prisma.ListEnumGuideStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumGuideStatusFilter<$PrismaModel> | $Enums.GuideStatus;
};
export type EnumGuideLegalRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.GuideLegalRole | Prisma.EnumGuideLegalRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.GuideLegalRole[] | Prisma.ListEnumGuideLegalRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.GuideLegalRole[] | Prisma.ListEnumGuideLegalRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumGuideLegalRoleFilter<$PrismaModel> | $Enums.GuideLegalRole;
};
export type JsonNullableFilter<$PrismaModel = never> = Prisma.PatchUndefined<Prisma.Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>, Required<JsonNullableFilterBase<$PrismaModel>>> | Prisma.OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>;
export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    path?: string[];
    mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    lt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    lte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
};
export type DecimalFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedIntFilter<$PrismaModel>;
    _max?: Prisma.NestedIntFilter<$PrismaModel>;
};
export type JsonWithAggregatesFilter<$PrismaModel = never> = Prisma.PatchUndefined<Prisma.Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>, Required<JsonWithAggregatesFilterBase<$PrismaModel>>> | Prisma.OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>;
export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    path?: string[];
    mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    lt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    lte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedJsonFilter<$PrismaModel>;
    _max?: Prisma.NestedJsonFilter<$PrismaModel>;
};
export type EnumPricingTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PricingType | Prisma.EnumPricingTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.PricingType[] | Prisma.ListEnumPricingTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PricingType[] | Prisma.ListEnumPricingTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPricingTypeWithAggregatesFilter<$PrismaModel> | $Enums.PricingType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPricingTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPricingTypeFilter<$PrismaModel>;
};
export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel> | null;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
};
export type EnumGuideStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GuideStatus | Prisma.EnumGuideStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.GuideStatus[] | Prisma.ListEnumGuideStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.GuideStatus[] | Prisma.ListEnumGuideStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumGuideStatusWithAggregatesFilter<$PrismaModel> | $Enums.GuideStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumGuideStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumGuideStatusFilter<$PrismaModel>;
};
export type EnumGuideLegalRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GuideLegalRole | Prisma.EnumGuideLegalRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.GuideLegalRole[] | Prisma.ListEnumGuideLegalRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.GuideLegalRole[] | Prisma.ListEnumGuideLegalRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumGuideLegalRoleWithAggregatesFilter<$PrismaModel> | $Enums.GuideLegalRole;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumGuideLegalRoleFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumGuideLegalRoleFilter<$PrismaModel>;
};
export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = Prisma.PatchUndefined<Prisma.Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>, Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>> | Prisma.OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>;
export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    path?: string[];
    mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    lt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    lte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedJsonNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedJsonNullableFilter<$PrismaModel>;
};
export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalWithAggregatesFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _sum?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _min?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _max?: Prisma.NestedDecimalFilter<$PrismaModel>;
};
export type EnumGuideEvidenceTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.GuideEvidenceType | Prisma.EnumGuideEvidenceTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.GuideEvidenceType[] | Prisma.ListEnumGuideEvidenceTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.GuideEvidenceType[] | Prisma.ListEnumGuideEvidenceTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumGuideEvidenceTypeFilter<$PrismaModel> | $Enums.GuideEvidenceType;
};
export type EnumVerificationCheckStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.VerificationCheckStatus | Prisma.EnumVerificationCheckStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.VerificationCheckStatus[] | Prisma.ListEnumVerificationCheckStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.VerificationCheckStatus[] | Prisma.ListEnumVerificationCheckStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumVerificationCheckStatusFilter<$PrismaModel> | $Enums.VerificationCheckStatus;
};
export type EnumGuideEvidenceTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GuideEvidenceType | Prisma.EnumGuideEvidenceTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.GuideEvidenceType[] | Prisma.ListEnumGuideEvidenceTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.GuideEvidenceType[] | Prisma.ListEnumGuideEvidenceTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumGuideEvidenceTypeWithAggregatesFilter<$PrismaModel> | $Enums.GuideEvidenceType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumGuideEvidenceTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumGuideEvidenceTypeFilter<$PrismaModel>;
};
export type EnumVerificationCheckStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.VerificationCheckStatus | Prisma.EnumVerificationCheckStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.VerificationCheckStatus[] | Prisma.ListEnumVerificationCheckStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.VerificationCheckStatus[] | Prisma.ListEnumVerificationCheckStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumVerificationCheckStatusWithAggregatesFilter<$PrismaModel> | $Enums.VerificationCheckStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumVerificationCheckStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumVerificationCheckStatusFilter<$PrismaModel>;
};
export type EnumCompetencyTaskTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.CompetencyTaskType | Prisma.EnumCompetencyTaskTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.CompetencyTaskType[] | Prisma.ListEnumCompetencyTaskTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CompetencyTaskType[] | Prisma.ListEnumCompetencyTaskTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCompetencyTaskTypeFilter<$PrismaModel> | $Enums.CompetencyTaskType;
};
export type EnumCompetencyTaskTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CompetencyTaskType | Prisma.EnumCompetencyTaskTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.CompetencyTaskType[] | Prisma.ListEnumCompetencyTaskTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CompetencyTaskType[] | Prisma.ListEnumCompetencyTaskTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCompetencyTaskTypeWithAggregatesFilter<$PrismaModel> | $Enums.CompetencyTaskType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumCompetencyTaskTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumCompetencyTaskTypeFilter<$PrismaModel>;
};
export type EnumTourismSourceTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TourismSourceType | Prisma.EnumTourismSourceTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.TourismSourceType[] | Prisma.ListEnumTourismSourceTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TourismSourceType[] | Prisma.ListEnumTourismSourceTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTourismSourceTypeFilter<$PrismaModel> | $Enums.TourismSourceType;
};
export type EnumTourismAuthorityLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.TourismAuthorityLevel | Prisma.EnumTourismAuthorityLevelFieldRefInput<$PrismaModel>;
    in?: $Enums.TourismAuthorityLevel[] | Prisma.ListEnumTourismAuthorityLevelFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TourismAuthorityLevel[] | Prisma.ListEnumTourismAuthorityLevelFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTourismAuthorityLevelFilter<$PrismaModel> | $Enums.TourismAuthorityLevel;
};
export type EnumTourismSourceReviewStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TourismSourceReviewStatus | Prisma.EnumTourismSourceReviewStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.TourismSourceReviewStatus[] | Prisma.ListEnumTourismSourceReviewStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TourismSourceReviewStatus[] | Prisma.ListEnumTourismSourceReviewStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTourismSourceReviewStatusFilter<$PrismaModel> | $Enums.TourismSourceReviewStatus;
};
export type UuidNullableFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedUuidNullableFilter<$PrismaModel> | string | null;
};
export type EnumTourismSourceTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TourismSourceType | Prisma.EnumTourismSourceTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.TourismSourceType[] | Prisma.ListEnumTourismSourceTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TourismSourceType[] | Prisma.ListEnumTourismSourceTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTourismSourceTypeWithAggregatesFilter<$PrismaModel> | $Enums.TourismSourceType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumTourismSourceTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumTourismSourceTypeFilter<$PrismaModel>;
};
export type EnumTourismAuthorityLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TourismAuthorityLevel | Prisma.EnumTourismAuthorityLevelFieldRefInput<$PrismaModel>;
    in?: $Enums.TourismAuthorityLevel[] | Prisma.ListEnumTourismAuthorityLevelFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TourismAuthorityLevel[] | Prisma.ListEnumTourismAuthorityLevelFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTourismAuthorityLevelWithAggregatesFilter<$PrismaModel> | $Enums.TourismAuthorityLevel;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumTourismAuthorityLevelFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumTourismAuthorityLevelFilter<$PrismaModel>;
};
export type EnumTourismSourceReviewStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TourismSourceReviewStatus | Prisma.EnumTourismSourceReviewStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.TourismSourceReviewStatus[] | Prisma.ListEnumTourismSourceReviewStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TourismSourceReviewStatus[] | Prisma.ListEnumTourismSourceReviewStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTourismSourceReviewStatusWithAggregatesFilter<$PrismaModel> | $Enums.TourismSourceReviewStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumTourismSourceReviewStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumTourismSourceReviewStatusFilter<$PrismaModel>;
};
export type UuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedStringNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedStringNullableFilter<$PrismaModel>;
};
export type EnumRouteFamilyNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.RouteFamily | Prisma.EnumRouteFamilyFieldRefInput<$PrismaModel> | null;
    in?: $Enums.RouteFamily[] | Prisma.ListEnumRouteFamilyFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.RouteFamily[] | Prisma.ListEnumRouteFamilyFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumRouteFamilyNullableFilter<$PrismaModel> | $Enums.RouteFamily | null;
};
export type EnumTourismKnowledgeCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.TourismKnowledgeCategory | Prisma.EnumTourismKnowledgeCategoryFieldRefInput<$PrismaModel>;
    in?: $Enums.TourismKnowledgeCategory[] | Prisma.ListEnumTourismKnowledgeCategoryFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TourismKnowledgeCategory[] | Prisma.ListEnumTourismKnowledgeCategoryFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTourismKnowledgeCategoryFilter<$PrismaModel> | $Enums.TourismKnowledgeCategory;
};
export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableFilter<$PrismaModel> | number | null;
};
export type EnumRouteFamilyNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RouteFamily | Prisma.EnumRouteFamilyFieldRefInput<$PrismaModel> | null;
    in?: $Enums.RouteFamily[] | Prisma.ListEnumRouteFamilyFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.RouteFamily[] | Prisma.ListEnumRouteFamilyFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumRouteFamilyNullableWithAggregatesFilter<$PrismaModel> | $Enums.RouteFamily | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumRouteFamilyNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumRouteFamilyNullableFilter<$PrismaModel>;
};
export type EnumTourismKnowledgeCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TourismKnowledgeCategory | Prisma.EnumTourismKnowledgeCategoryFieldRefInput<$PrismaModel>;
    in?: $Enums.TourismKnowledgeCategory[] | Prisma.ListEnumTourismKnowledgeCategoryFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TourismKnowledgeCategory[] | Prisma.ListEnumTourismKnowledgeCategoryFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTourismKnowledgeCategoryWithAggregatesFilter<$PrismaModel> | $Enums.TourismKnowledgeCategory;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumTourismKnowledgeCategoryFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumTourismKnowledgeCategoryFilter<$PrismaModel>;
};
export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedIntNullableFilter<$PrismaModel>;
};
export type EnumRouteFamilyFilter<$PrismaModel = never> = {
    equals?: $Enums.RouteFamily | Prisma.EnumRouteFamilyFieldRefInput<$PrismaModel>;
    in?: $Enums.RouteFamily[] | Prisma.ListEnumRouteFamilyFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RouteFamily[] | Prisma.ListEnumRouteFamilyFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRouteFamilyFilter<$PrismaModel> | $Enums.RouteFamily;
};
export type EnumRouteRiskLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.RouteRiskLevel | Prisma.EnumRouteRiskLevelFieldRefInput<$PrismaModel>;
    in?: $Enums.RouteRiskLevel[] | Prisma.ListEnumRouteRiskLevelFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RouteRiskLevel[] | Prisma.ListEnumRouteRiskLevelFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRouteRiskLevelFilter<$PrismaModel> | $Enums.RouteRiskLevel;
};
export type EnumCefrLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.CefrLevel | Prisma.EnumCefrLevelFieldRefInput<$PrismaModel>;
    in?: $Enums.CefrLevel[] | Prisma.ListEnumCefrLevelFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CefrLevel[] | Prisma.ListEnumCefrLevelFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCefrLevelFilter<$PrismaModel> | $Enums.CefrLevel;
};
export type EnumRouteFamilyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RouteFamily | Prisma.EnumRouteFamilyFieldRefInput<$PrismaModel>;
    in?: $Enums.RouteFamily[] | Prisma.ListEnumRouteFamilyFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RouteFamily[] | Prisma.ListEnumRouteFamilyFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRouteFamilyWithAggregatesFilter<$PrismaModel> | $Enums.RouteFamily;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumRouteFamilyFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumRouteFamilyFilter<$PrismaModel>;
};
export type EnumRouteRiskLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RouteRiskLevel | Prisma.EnumRouteRiskLevelFieldRefInput<$PrismaModel>;
    in?: $Enums.RouteRiskLevel[] | Prisma.ListEnumRouteRiskLevelFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RouteRiskLevel[] | Prisma.ListEnumRouteRiskLevelFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRouteRiskLevelWithAggregatesFilter<$PrismaModel> | $Enums.RouteRiskLevel;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumRouteRiskLevelFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumRouteRiskLevelFilter<$PrismaModel>;
};
export type EnumCefrLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CefrLevel | Prisma.EnumCefrLevelFieldRefInput<$PrismaModel>;
    in?: $Enums.CefrLevel[] | Prisma.ListEnumCefrLevelFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CefrLevel[] | Prisma.ListEnumCefrLevelFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCefrLevelWithAggregatesFilter<$PrismaModel> | $Enums.CefrLevel;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumCefrLevelFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumCefrLevelFilter<$PrismaModel>;
};
export type EnumRouteNodeTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.RouteNodeType | Prisma.EnumRouteNodeTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.RouteNodeType[] | Prisma.ListEnumRouteNodeTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RouteNodeType[] | Prisma.ListEnumRouteNodeTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRouteNodeTypeFilter<$PrismaModel> | $Enums.RouteNodeType;
};
export type EnumRouteNodeTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RouteNodeType | Prisma.EnumRouteNodeTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.RouteNodeType[] | Prisma.ListEnumRouteNodeTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RouteNodeType[] | Prisma.ListEnumRouteNodeTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRouteNodeTypeWithAggregatesFilter<$PrismaModel> | $Enums.RouteNodeType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumRouteNodeTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumRouteNodeTypeFilter<$PrismaModel>;
};
export type EnumRouteTransportModeFilter<$PrismaModel = never> = {
    equals?: $Enums.RouteTransportMode | Prisma.EnumRouteTransportModeFieldRefInput<$PrismaModel>;
    in?: $Enums.RouteTransportMode[] | Prisma.ListEnumRouteTransportModeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RouteTransportMode[] | Prisma.ListEnumRouteTransportModeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRouteTransportModeFilter<$PrismaModel> | $Enums.RouteTransportMode;
};
export type EnumRouteTransportModeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RouteTransportMode | Prisma.EnumRouteTransportModeFieldRefInput<$PrismaModel>;
    in?: $Enums.RouteTransportMode[] | Prisma.ListEnumRouteTransportModeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RouteTransportMode[] | Prisma.ListEnumRouteTransportModeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRouteTransportModeWithAggregatesFilter<$PrismaModel> | $Enums.RouteTransportMode;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumRouteTransportModeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumRouteTransportModeFilter<$PrismaModel>;
};
export type EnumSafetyPlanStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SafetyPlanStatus | Prisma.EnumSafetyPlanStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.SafetyPlanStatus[] | Prisma.ListEnumSafetyPlanStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SafetyPlanStatus[] | Prisma.ListEnumSafetyPlanStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSafetyPlanStatusFilter<$PrismaModel> | $Enums.SafetyPlanStatus;
};
export type EnumSafetyPlanStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SafetyPlanStatus | Prisma.EnumSafetyPlanStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.SafetyPlanStatus[] | Prisma.ListEnumSafetyPlanStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SafetyPlanStatus[] | Prisma.ListEnumSafetyPlanStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSafetyPlanStatusWithAggregatesFilter<$PrismaModel> | $Enums.SafetyPlanStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSafetyPlanStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSafetyPlanStatusFilter<$PrismaModel>;
};
export type EnumSafetyPlanAuditActionFilter<$PrismaModel = never> = {
    equals?: $Enums.SafetyPlanAuditAction | Prisma.EnumSafetyPlanAuditActionFieldRefInput<$PrismaModel>;
    in?: $Enums.SafetyPlanAuditAction[] | Prisma.ListEnumSafetyPlanAuditActionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SafetyPlanAuditAction[] | Prisma.ListEnumSafetyPlanAuditActionFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSafetyPlanAuditActionFilter<$PrismaModel> | $Enums.SafetyPlanAuditAction;
};
export type EnumSafetyPlanStatusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.SafetyPlanStatus | Prisma.EnumSafetyPlanStatusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.SafetyPlanStatus[] | Prisma.ListEnumSafetyPlanStatusFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.SafetyPlanStatus[] | Prisma.ListEnumSafetyPlanStatusFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumSafetyPlanStatusNullableFilter<$PrismaModel> | $Enums.SafetyPlanStatus | null;
};
export type EnumSafetyPlanAuditActionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SafetyPlanAuditAction | Prisma.EnumSafetyPlanAuditActionFieldRefInput<$PrismaModel>;
    in?: $Enums.SafetyPlanAuditAction[] | Prisma.ListEnumSafetyPlanAuditActionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SafetyPlanAuditAction[] | Prisma.ListEnumSafetyPlanAuditActionFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSafetyPlanAuditActionWithAggregatesFilter<$PrismaModel> | $Enums.SafetyPlanAuditAction;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSafetyPlanAuditActionFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSafetyPlanAuditActionFilter<$PrismaModel>;
};
export type EnumSafetyPlanStatusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SafetyPlanStatus | Prisma.EnumSafetyPlanStatusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.SafetyPlanStatus[] | Prisma.ListEnumSafetyPlanStatusFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.SafetyPlanStatus[] | Prisma.ListEnumSafetyPlanStatusFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumSafetyPlanStatusNullableWithAggregatesFilter<$PrismaModel> | $Enums.SafetyPlanStatus | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSafetyPlanStatusNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSafetyPlanStatusNullableFilter<$PrismaModel>;
};
export type EnumGuideCompetencyTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.GuideCompetencyType | Prisma.EnumGuideCompetencyTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.GuideCompetencyType[] | Prisma.ListEnumGuideCompetencyTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.GuideCompetencyType[] | Prisma.ListEnumGuideCompetencyTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumGuideCompetencyTypeFilter<$PrismaModel> | $Enums.GuideCompetencyType;
};
export type EnumGuideCompetencyStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.GuideCompetencyStatus | Prisma.EnumGuideCompetencyStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.GuideCompetencyStatus[] | Prisma.ListEnumGuideCompetencyStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.GuideCompetencyStatus[] | Prisma.ListEnumGuideCompetencyStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumGuideCompetencyStatusFilter<$PrismaModel> | $Enums.GuideCompetencyStatus;
};
export type EnumGuideCompetencyTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GuideCompetencyType | Prisma.EnumGuideCompetencyTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.GuideCompetencyType[] | Prisma.ListEnumGuideCompetencyTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.GuideCompetencyType[] | Prisma.ListEnumGuideCompetencyTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumGuideCompetencyTypeWithAggregatesFilter<$PrismaModel> | $Enums.GuideCompetencyType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumGuideCompetencyTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumGuideCompetencyTypeFilter<$PrismaModel>;
};
export type EnumGuideCompetencyStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GuideCompetencyStatus | Prisma.EnumGuideCompetencyStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.GuideCompetencyStatus[] | Prisma.ListEnumGuideCompetencyStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.GuideCompetencyStatus[] | Prisma.ListEnumGuideCompetencyStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumGuideCompetencyStatusWithAggregatesFilter<$PrismaModel> | $Enums.GuideCompetencyStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumGuideCompetencyStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumGuideCompetencyStatusFilter<$PrismaModel>;
};
export type EnumCefrLevelNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.CefrLevel | Prisma.EnumCefrLevelFieldRefInput<$PrismaModel> | null;
    in?: $Enums.CefrLevel[] | Prisma.ListEnumCefrLevelFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.CefrLevel[] | Prisma.ListEnumCefrLevelFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumCefrLevelNullableFilter<$PrismaModel> | $Enums.CefrLevel | null;
};
export type EnumCefrLevelNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CefrLevel | Prisma.EnumCefrLevelFieldRefInput<$PrismaModel> | null;
    in?: $Enums.CefrLevel[] | Prisma.ListEnumCefrLevelFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.CefrLevel[] | Prisma.ListEnumCefrLevelFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumCefrLevelNullableWithAggregatesFilter<$PrismaModel> | $Enums.CefrLevel | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumCefrLevelNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumCefrLevelNullableFilter<$PrismaModel>;
};
export type EnumEvaluatorTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.EvaluatorType | Prisma.EnumEvaluatorTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.EvaluatorType[] | Prisma.ListEnumEvaluatorTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.EvaluatorType[] | Prisma.ListEnumEvaluatorTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumEvaluatorTypeFilter<$PrismaModel> | $Enums.EvaluatorType;
};
export type EnumEvaluatorTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EvaluatorType | Prisma.EnumEvaluatorTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.EvaluatorType[] | Prisma.ListEnumEvaluatorTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.EvaluatorType[] | Prisma.ListEnumEvaluatorTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumEvaluatorTypeWithAggregatesFilter<$PrismaModel> | $Enums.EvaluatorType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumEvaluatorTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumEvaluatorTypeFilter<$PrismaModel>;
};
export type EnumHumanReviewStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.HumanReviewStatus | Prisma.EnumHumanReviewStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.HumanReviewStatus[] | Prisma.ListEnumHumanReviewStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.HumanReviewStatus[] | Prisma.ListEnumHumanReviewStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumHumanReviewStatusFilter<$PrismaModel> | $Enums.HumanReviewStatus;
};
export type EnumHumanReviewStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.HumanReviewStatus | Prisma.EnumHumanReviewStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.HumanReviewStatus[] | Prisma.ListEnumHumanReviewStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.HumanReviewStatus[] | Prisma.ListEnumHumanReviewStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumHumanReviewStatusWithAggregatesFilter<$PrismaModel> | $Enums.HumanReviewStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumHumanReviewStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumHumanReviewStatusFilter<$PrismaModel>;
};
export type EnumFirstAidCertificateStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.FirstAidCertificateStatus | Prisma.EnumFirstAidCertificateStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.FirstAidCertificateStatus[] | Prisma.ListEnumFirstAidCertificateStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.FirstAidCertificateStatus[] | Prisma.ListEnumFirstAidCertificateStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumFirstAidCertificateStatusFilter<$PrismaModel> | $Enums.FirstAidCertificateStatus;
};
export type EnumPracticalVerificationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PracticalVerificationStatus | Prisma.EnumPracticalVerificationStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.PracticalVerificationStatus[] | Prisma.ListEnumPracticalVerificationStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PracticalVerificationStatus[] | Prisma.ListEnumPracticalVerificationStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPracticalVerificationStatusFilter<$PrismaModel> | $Enums.PracticalVerificationStatus;
};
export type EnumFirstAidCertificateStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FirstAidCertificateStatus | Prisma.EnumFirstAidCertificateStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.FirstAidCertificateStatus[] | Prisma.ListEnumFirstAidCertificateStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.FirstAidCertificateStatus[] | Prisma.ListEnumFirstAidCertificateStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumFirstAidCertificateStatusWithAggregatesFilter<$PrismaModel> | $Enums.FirstAidCertificateStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumFirstAidCertificateStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumFirstAidCertificateStatusFilter<$PrismaModel>;
};
export type EnumPracticalVerificationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PracticalVerificationStatus | Prisma.EnumPracticalVerificationStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.PracticalVerificationStatus[] | Prisma.ListEnumPracticalVerificationStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PracticalVerificationStatus[] | Prisma.ListEnumPracticalVerificationStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPracticalVerificationStatusWithAggregatesFilter<$PrismaModel> | $Enums.PracticalVerificationStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPracticalVerificationStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPracticalVerificationStatusFilter<$PrismaModel>;
};
export type EnumAssessmentCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.AssessmentCategory | Prisma.EnumAssessmentCategoryFieldRefInput<$PrismaModel>;
    in?: $Enums.AssessmentCategory[] | Prisma.ListEnumAssessmentCategoryFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AssessmentCategory[] | Prisma.ListEnumAssessmentCategoryFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAssessmentCategoryFilter<$PrismaModel> | $Enums.AssessmentCategory;
};
export type EnumAssessmentDifficultyFilter<$PrismaModel = never> = {
    equals?: $Enums.AssessmentDifficulty | Prisma.EnumAssessmentDifficultyFieldRefInput<$PrismaModel>;
    in?: $Enums.AssessmentDifficulty[] | Prisma.ListEnumAssessmentDifficultyFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AssessmentDifficulty[] | Prisma.ListEnumAssessmentDifficultyFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAssessmentDifficultyFilter<$PrismaModel> | $Enums.AssessmentDifficulty;
};
export type EnumAssessmentQuestionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AssessmentQuestionType | Prisma.EnumAssessmentQuestionTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.AssessmentQuestionType[] | Prisma.ListEnumAssessmentQuestionTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AssessmentQuestionType[] | Prisma.ListEnumAssessmentQuestionTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAssessmentQuestionTypeFilter<$PrismaModel> | $Enums.AssessmentQuestionType;
};
export type EnumAssessmentCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AssessmentCategory | Prisma.EnumAssessmentCategoryFieldRefInput<$PrismaModel>;
    in?: $Enums.AssessmentCategory[] | Prisma.ListEnumAssessmentCategoryFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AssessmentCategory[] | Prisma.ListEnumAssessmentCategoryFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAssessmentCategoryWithAggregatesFilter<$PrismaModel> | $Enums.AssessmentCategory;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumAssessmentCategoryFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumAssessmentCategoryFilter<$PrismaModel>;
};
export type EnumAssessmentDifficultyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AssessmentDifficulty | Prisma.EnumAssessmentDifficultyFieldRefInput<$PrismaModel>;
    in?: $Enums.AssessmentDifficulty[] | Prisma.ListEnumAssessmentDifficultyFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AssessmentDifficulty[] | Prisma.ListEnumAssessmentDifficultyFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAssessmentDifficultyWithAggregatesFilter<$PrismaModel> | $Enums.AssessmentDifficulty;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumAssessmentDifficultyFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumAssessmentDifficultyFilter<$PrismaModel>;
};
export type EnumAssessmentQuestionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AssessmentQuestionType | Prisma.EnumAssessmentQuestionTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.AssessmentQuestionType[] | Prisma.ListEnumAssessmentQuestionTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AssessmentQuestionType[] | Prisma.ListEnumAssessmentQuestionTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAssessmentQuestionTypeWithAggregatesFilter<$PrismaModel> | $Enums.AssessmentQuestionType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumAssessmentQuestionTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumAssessmentQuestionTypeFilter<$PrismaModel>;
};
export type EnumAssessmentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AssessmentType | Prisma.EnumAssessmentTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.AssessmentType[] | Prisma.ListEnumAssessmentTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AssessmentType[] | Prisma.ListEnumAssessmentTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAssessmentTypeFilter<$PrismaModel> | $Enums.AssessmentType;
};
export type EnumAssessmentAttemptStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AssessmentAttemptStatus | Prisma.EnumAssessmentAttemptStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.AssessmentAttemptStatus[] | Prisma.ListEnumAssessmentAttemptStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AssessmentAttemptStatus[] | Prisma.ListEnumAssessmentAttemptStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAssessmentAttemptStatusFilter<$PrismaModel> | $Enums.AssessmentAttemptStatus;
};
export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedBoolNullableFilter<$PrismaModel> | boolean | null;
};
export type EnumAssessmentTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AssessmentType | Prisma.EnumAssessmentTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.AssessmentType[] | Prisma.ListEnumAssessmentTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AssessmentType[] | Prisma.ListEnumAssessmentTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAssessmentTypeWithAggregatesFilter<$PrismaModel> | $Enums.AssessmentType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumAssessmentTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumAssessmentTypeFilter<$PrismaModel>;
};
export type EnumAssessmentAttemptStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AssessmentAttemptStatus | Prisma.EnumAssessmentAttemptStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.AssessmentAttemptStatus[] | Prisma.ListEnumAssessmentAttemptStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AssessmentAttemptStatus[] | Prisma.ListEnumAssessmentAttemptStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAssessmentAttemptStatusWithAggregatesFilter<$PrismaModel> | $Enums.AssessmentAttemptStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumAssessmentAttemptStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumAssessmentAttemptStatusFilter<$PrismaModel>;
};
export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedBoolNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedBoolNullableFilter<$PrismaModel>;
};
export type EnumAssessmentReviewDecisionFilter<$PrismaModel = never> = {
    equals?: $Enums.AssessmentReviewDecision | Prisma.EnumAssessmentReviewDecisionFieldRefInput<$PrismaModel>;
    in?: $Enums.AssessmentReviewDecision[] | Prisma.ListEnumAssessmentReviewDecisionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AssessmentReviewDecision[] | Prisma.ListEnumAssessmentReviewDecisionFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAssessmentReviewDecisionFilter<$PrismaModel> | $Enums.AssessmentReviewDecision;
};
export type EnumAssessmentReviewDecisionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AssessmentReviewDecision | Prisma.EnumAssessmentReviewDecisionFieldRefInput<$PrismaModel>;
    in?: $Enums.AssessmentReviewDecision[] | Prisma.ListEnumAssessmentReviewDecisionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AssessmentReviewDecision[] | Prisma.ListEnumAssessmentReviewDecisionFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAssessmentReviewDecisionWithAggregatesFilter<$PrismaModel> | $Enums.AssessmentReviewDecision;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumAssessmentReviewDecisionFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumAssessmentReviewDecisionFilter<$PrismaModel>;
};
export type EnumAiExperimentModeFilter<$PrismaModel = never> = {
    equals?: $Enums.AiExperimentMode | Prisma.EnumAiExperimentModeFieldRefInput<$PrismaModel>;
    in?: $Enums.AiExperimentMode[] | Prisma.ListEnumAiExperimentModeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AiExperimentMode[] | Prisma.ListEnumAiExperimentModeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAiExperimentModeFilter<$PrismaModel> | $Enums.AiExperimentMode;
};
export type EnumAiConversationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AiConversationStatus | Prisma.EnumAiConversationStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.AiConversationStatus[] | Prisma.ListEnumAiConversationStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AiConversationStatus[] | Prisma.ListEnumAiConversationStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAiConversationStatusFilter<$PrismaModel> | $Enums.AiConversationStatus;
};
export type EnumAiExperimentModeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AiExperimentMode | Prisma.EnumAiExperimentModeFieldRefInput<$PrismaModel>;
    in?: $Enums.AiExperimentMode[] | Prisma.ListEnumAiExperimentModeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AiExperimentMode[] | Prisma.ListEnumAiExperimentModeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAiExperimentModeWithAggregatesFilter<$PrismaModel> | $Enums.AiExperimentMode;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumAiExperimentModeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumAiExperimentModeFilter<$PrismaModel>;
};
export type EnumAiConversationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AiConversationStatus | Prisma.EnumAiConversationStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.AiConversationStatus[] | Prisma.ListEnumAiConversationStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AiConversationStatus[] | Prisma.ListEnumAiConversationStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAiConversationStatusWithAggregatesFilter<$PrismaModel> | $Enums.AiConversationStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumAiConversationStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumAiConversationStatusFilter<$PrismaModel>;
};
export type EnumAiMessageRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.AiMessageRole | Prisma.EnumAiMessageRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.AiMessageRole[] | Prisma.ListEnumAiMessageRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AiMessageRole[] | Prisma.ListEnumAiMessageRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAiMessageRoleFilter<$PrismaModel> | $Enums.AiMessageRole;
};
export type EnumAiMessageRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AiMessageRole | Prisma.EnumAiMessageRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.AiMessageRole[] | Prisma.ListEnumAiMessageRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AiMessageRole[] | Prisma.ListEnumAiMessageRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAiMessageRoleWithAggregatesFilter<$PrismaModel> | $Enums.AiMessageRole;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumAiMessageRoleFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumAiMessageRoleFilter<$PrismaModel>;
};
export type EnumAiRequestTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AiRequestType | Prisma.EnumAiRequestTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.AiRequestType[] | Prisma.ListEnumAiRequestTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AiRequestType[] | Prisma.ListEnumAiRequestTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAiRequestTypeFilter<$PrismaModel> | $Enums.AiRequestType;
};
export type EnumAiRequestTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AiRequestType | Prisma.EnumAiRequestTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.AiRequestType[] | Prisma.ListEnumAiRequestTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AiRequestType[] | Prisma.ListEnumAiRequestTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAiRequestTypeWithAggregatesFilter<$PrismaModel> | $Enums.AiRequestType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumAiRequestTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumAiRequestTypeFilter<$PrismaModel>;
};
export type EnumGuideVerificationDecisionFilter<$PrismaModel = never> = {
    equals?: $Enums.GuideVerificationDecision | Prisma.EnumGuideVerificationDecisionFieldRefInput<$PrismaModel>;
    in?: $Enums.GuideVerificationDecision[] | Prisma.ListEnumGuideVerificationDecisionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.GuideVerificationDecision[] | Prisma.ListEnumGuideVerificationDecisionFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumGuideVerificationDecisionFilter<$PrismaModel> | $Enums.GuideVerificationDecision;
};
export type EnumGuideVerificationDecisionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GuideVerificationDecision | Prisma.EnumGuideVerificationDecisionFieldRefInput<$PrismaModel>;
    in?: $Enums.GuideVerificationDecision[] | Prisma.ListEnumGuideVerificationDecisionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.GuideVerificationDecision[] | Prisma.ListEnumGuideVerificationDecisionFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumGuideVerificationDecisionWithAggregatesFilter<$PrismaModel> | $Enums.GuideVerificationDecision;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumGuideVerificationDecisionFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumGuideVerificationDecisionFilter<$PrismaModel>;
};
export type EnumListingCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.ListingCategory | Prisma.EnumListingCategoryFieldRefInput<$PrismaModel>;
    in?: $Enums.ListingCategory[] | Prisma.ListEnumListingCategoryFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ListingCategory[] | Prisma.ListEnumListingCategoryFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumListingCategoryFilter<$PrismaModel> | $Enums.ListingCategory;
};
export type EnumPriceUnitFilter<$PrismaModel = never> = {
    equals?: $Enums.PriceUnit | Prisma.EnumPriceUnitFieldRefInput<$PrismaModel>;
    in?: $Enums.PriceUnit[] | Prisma.ListEnumPriceUnitFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PriceUnit[] | Prisma.ListEnumPriceUnitFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPriceUnitFilter<$PrismaModel> | $Enums.PriceUnit;
};
export type EnumListingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ListingStatus | Prisma.EnumListingStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ListingStatus[] | Prisma.ListEnumListingStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ListingStatus[] | Prisma.ListEnumListingStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumListingStatusFilter<$PrismaModel> | $Enums.ListingStatus;
};
export type EnumListingCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ListingCategory | Prisma.EnumListingCategoryFieldRefInput<$PrismaModel>;
    in?: $Enums.ListingCategory[] | Prisma.ListEnumListingCategoryFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ListingCategory[] | Prisma.ListEnumListingCategoryFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumListingCategoryWithAggregatesFilter<$PrismaModel> | $Enums.ListingCategory;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumListingCategoryFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumListingCategoryFilter<$PrismaModel>;
};
export type EnumPriceUnitWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PriceUnit | Prisma.EnumPriceUnitFieldRefInput<$PrismaModel>;
    in?: $Enums.PriceUnit[] | Prisma.ListEnumPriceUnitFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PriceUnit[] | Prisma.ListEnumPriceUnitFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPriceUnitWithAggregatesFilter<$PrismaModel> | $Enums.PriceUnit;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPriceUnitFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPriceUnitFilter<$PrismaModel>;
};
export type EnumListingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ListingStatus | Prisma.EnumListingStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ListingStatus[] | Prisma.ListEnumListingStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ListingStatus[] | Prisma.ListEnumListingStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumListingStatusWithAggregatesFilter<$PrismaModel> | $Enums.ListingStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumListingStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumListingStatusFilter<$PrismaModel>;
};
export type EnumBookingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStatus | Prisma.EnumBookingStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.BookingStatus[] | Prisma.ListEnumBookingStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.BookingStatus[] | Prisma.ListEnumBookingStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumBookingStatusFilter<$PrismaModel> | $Enums.BookingStatus;
};
export type EnumCancellationPolicyTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.CancellationPolicyType | Prisma.EnumCancellationPolicyTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.CancellationPolicyType[] | Prisma.ListEnumCancellationPolicyTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CancellationPolicyType[] | Prisma.ListEnumCancellationPolicyTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCancellationPolicyTypeFilter<$PrismaModel> | $Enums.CancellationPolicyType;
};
export type EnumBookingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStatus | Prisma.EnumBookingStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.BookingStatus[] | Prisma.ListEnumBookingStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.BookingStatus[] | Prisma.ListEnumBookingStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumBookingStatusWithAggregatesFilter<$PrismaModel> | $Enums.BookingStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumBookingStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumBookingStatusFilter<$PrismaModel>;
};
export type EnumCancellationPolicyTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CancellationPolicyType | Prisma.EnumCancellationPolicyTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.CancellationPolicyType[] | Prisma.ListEnumCancellationPolicyTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CancellationPolicyType[] | Prisma.ListEnumCancellationPolicyTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCancellationPolicyTypeWithAggregatesFilter<$PrismaModel> | $Enums.CancellationPolicyType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumCancellationPolicyTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumCancellationPolicyTypeFilter<$PrismaModel>;
};
export type EnumPaymentArrangementFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentArrangement | Prisma.EnumPaymentArrangementFieldRefInput<$PrismaModel>;
    in?: $Enums.PaymentArrangement[] | Prisma.ListEnumPaymentArrangementFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PaymentArrangement[] | Prisma.ListEnumPaymentArrangementFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPaymentArrangementFilter<$PrismaModel> | $Enums.PaymentArrangement;
};
export type EnumPaymentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | Prisma.EnumPaymentStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.PaymentStatus[] | Prisma.ListEnumPaymentStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PaymentStatus[] | Prisma.ListEnumPaymentStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPaymentStatusFilter<$PrismaModel> | $Enums.PaymentStatus;
};
export type EnumPaymentArrangementWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentArrangement | Prisma.EnumPaymentArrangementFieldRefInput<$PrismaModel>;
    in?: $Enums.PaymentArrangement[] | Prisma.ListEnumPaymentArrangementFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PaymentArrangement[] | Prisma.ListEnumPaymentArrangementFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPaymentArrangementWithAggregatesFilter<$PrismaModel> | $Enums.PaymentArrangement;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPaymentArrangementFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPaymentArrangementFilter<$PrismaModel>;
};
export type EnumPaymentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | Prisma.EnumPaymentStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.PaymentStatus[] | Prisma.ListEnumPaymentStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PaymentStatus[] | Prisma.ListEnumPaymentStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel> | $Enums.PaymentStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPaymentStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPaymentStatusFilter<$PrismaModel>;
};
export type EnumBookingActorTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingActorType | Prisma.EnumBookingActorTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.BookingActorType[] | Prisma.ListEnumBookingActorTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.BookingActorType[] | Prisma.ListEnumBookingActorTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumBookingActorTypeFilter<$PrismaModel> | $Enums.BookingActorType;
};
export type EnumBookingStatusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStatus | Prisma.EnumBookingStatusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.BookingStatus[] | Prisma.ListEnumBookingStatusFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.BookingStatus[] | Prisma.ListEnumBookingStatusFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumBookingStatusNullableFilter<$PrismaModel> | $Enums.BookingStatus | null;
};
export type EnumBookingActorTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingActorType | Prisma.EnumBookingActorTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.BookingActorType[] | Prisma.ListEnumBookingActorTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.BookingActorType[] | Prisma.ListEnumBookingActorTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumBookingActorTypeWithAggregatesFilter<$PrismaModel> | $Enums.BookingActorType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumBookingActorTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumBookingActorTypeFilter<$PrismaModel>;
};
export type EnumBookingStatusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStatus | Prisma.EnumBookingStatusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.BookingStatus[] | Prisma.ListEnumBookingStatusFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.BookingStatus[] | Prisma.ListEnumBookingStatusFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumBookingStatusNullableWithAggregatesFilter<$PrismaModel> | $Enums.BookingStatus | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumBookingStatusNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumBookingStatusNullableFilter<$PrismaModel>;
};
export type EnumReportReasonFilter<$PrismaModel = never> = {
    equals?: $Enums.ReportReason | Prisma.EnumReportReasonFieldRefInput<$PrismaModel>;
    in?: $Enums.ReportReason[] | Prisma.ListEnumReportReasonFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ReportReason[] | Prisma.ListEnumReportReasonFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumReportReasonFilter<$PrismaModel> | $Enums.ReportReason;
};
export type EnumReportTargetTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ReportTargetType | Prisma.EnumReportTargetTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.ReportTargetType[] | Prisma.ListEnumReportTargetTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ReportTargetType[] | Prisma.ListEnumReportTargetTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumReportTargetTypeFilter<$PrismaModel> | $Enums.ReportTargetType;
};
export type EnumReportStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ReportStatus | Prisma.EnumReportStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ReportStatus[] | Prisma.ListEnumReportStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ReportStatus[] | Prisma.ListEnumReportStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumReportStatusFilter<$PrismaModel> | $Enums.ReportStatus;
};
export type EnumReportReasonWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReportReason | Prisma.EnumReportReasonFieldRefInput<$PrismaModel>;
    in?: $Enums.ReportReason[] | Prisma.ListEnumReportReasonFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ReportReason[] | Prisma.ListEnumReportReasonFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumReportReasonWithAggregatesFilter<$PrismaModel> | $Enums.ReportReason;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumReportReasonFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumReportReasonFilter<$PrismaModel>;
};
export type EnumReportTargetTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReportTargetType | Prisma.EnumReportTargetTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.ReportTargetType[] | Prisma.ListEnumReportTargetTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ReportTargetType[] | Prisma.ListEnumReportTargetTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumReportTargetTypeWithAggregatesFilter<$PrismaModel> | $Enums.ReportTargetType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumReportTargetTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumReportTargetTypeFilter<$PrismaModel>;
};
export type EnumReportStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReportStatus | Prisma.EnumReportStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ReportStatus[] | Prisma.ListEnumReportStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ReportStatus[] | Prisma.ListEnumReportStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumReportStatusWithAggregatesFilter<$PrismaModel> | $Enums.ReportStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumReportStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumReportStatusFilter<$PrismaModel>;
};
export type EnumModerationActionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ModerationActionType | Prisma.EnumModerationActionTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.ModerationActionType[] | Prisma.ListEnumModerationActionTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ModerationActionType[] | Prisma.ListEnumModerationActionTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumModerationActionTypeFilter<$PrismaModel> | $Enums.ModerationActionType;
};
export type EnumModerationActionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ModerationActionType | Prisma.EnumModerationActionTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.ModerationActionType[] | Prisma.ListEnumModerationActionTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ModerationActionType[] | Prisma.ListEnumModerationActionTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumModerationActionTypeWithAggregatesFilter<$PrismaModel> | $Enums.ModerationActionType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumModerationActionTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumModerationActionTypeFilter<$PrismaModel>;
};
export type EnumMessageTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageType | Prisma.EnumMessageTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.MessageType[] | Prisma.ListEnumMessageTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.MessageType[] | Prisma.ListEnumMessageTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumMessageTypeFilter<$PrismaModel> | $Enums.MessageType;
};
export type EnumMessageTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageType | Prisma.EnumMessageTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.MessageType[] | Prisma.ListEnumMessageTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.MessageType[] | Prisma.ListEnumMessageTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumMessageTypeWithAggregatesFilter<$PrismaModel> | $Enums.MessageType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumMessageTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumMessageTypeFilter<$PrismaModel>;
};
export type EnumNotificationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | Prisma.EnumNotificationTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.NotificationType[] | Prisma.ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.NotificationType[] | Prisma.ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumNotificationTypeFilter<$PrismaModel> | $Enums.NotificationType;
};
export type EnumNotificationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | Prisma.EnumNotificationTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.NotificationType[] | Prisma.ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.NotificationType[] | Prisma.ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel> | $Enums.NotificationType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumNotificationTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumNotificationTypeFilter<$PrismaModel>;
};
export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedUuidFilter<$PrismaModel> | string;
};
export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringFilter<$PrismaModel> | string;
};
export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringNullableFilter<$PrismaModel> | string | null;
};
export type NestedEnumAuthProviderFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthProvider | Prisma.EnumAuthProviderFieldRefInput<$PrismaModel>;
    in?: $Enums.AuthProvider[] | Prisma.ListEnumAuthProviderFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AuthProvider[] | Prisma.ListEnumAuthProviderFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAuthProviderFilter<$PrismaModel> | $Enums.AuthProvider;
};
export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolFilter<$PrismaModel> | boolean;
};
export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
};
export type NestedEnumUserModerationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.UserModerationStatus | Prisma.EnumUserModerationStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.UserModerationStatus[] | Prisma.ListEnumUserModerationStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.UserModerationStatus[] | Prisma.ListEnumUserModerationStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumUserModerationStatusFilter<$PrismaModel> | $Enums.UserModerationStatus;
};
export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeFilter<$PrismaModel> | Date | string;
};
export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedUuidWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntFilter<$PrismaModel> | number;
};
export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedStringNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedStringNullableFilter<$PrismaModel>;
};
export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableFilter<$PrismaModel> | number | null;
};
export type NestedEnumAuthProviderWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthProvider | Prisma.EnumAuthProviderFieldRefInput<$PrismaModel>;
    in?: $Enums.AuthProvider[] | Prisma.ListEnumAuthProviderFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AuthProvider[] | Prisma.ListEnumAuthProviderFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAuthProviderWithAggregatesFilter<$PrismaModel> | $Enums.AuthProvider;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumAuthProviderFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumAuthProviderFilter<$PrismaModel>;
};
export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedBoolFilter<$PrismaModel>;
    _max?: Prisma.NestedBoolFilter<$PrismaModel>;
};
export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
};
export type NestedEnumUserModerationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserModerationStatus | Prisma.EnumUserModerationStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.UserModerationStatus[] | Prisma.ListEnumUserModerationStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.UserModerationStatus[] | Prisma.ListEnumUserModerationStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumUserModerationStatusWithAggregatesFilter<$PrismaModel> | $Enums.UserModerationStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumUserModerationStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumUserModerationStatusFilter<$PrismaModel>;
};
export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeFilter<$PrismaModel>;
};
export type NestedEnumPricingTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.PricingType | Prisma.EnumPricingTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.PricingType[] | Prisma.ListEnumPricingTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PricingType[] | Prisma.ListEnumPricingTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPricingTypeFilter<$PrismaModel> | $Enums.PricingType;
};
export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel> | null;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalNullableFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type NestedEnumGuideStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.GuideStatus | Prisma.EnumGuideStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.GuideStatus[] | Prisma.ListEnumGuideStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.GuideStatus[] | Prisma.ListEnumGuideStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumGuideStatusFilter<$PrismaModel> | $Enums.GuideStatus;
};
export type NestedEnumGuideLegalRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.GuideLegalRole | Prisma.EnumGuideLegalRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.GuideLegalRole[] | Prisma.ListEnumGuideLegalRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.GuideLegalRole[] | Prisma.ListEnumGuideLegalRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumGuideLegalRoleFilter<$PrismaModel> | $Enums.GuideLegalRole;
};
export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedIntFilter<$PrismaModel>;
    _max?: Prisma.NestedIntFilter<$PrismaModel>;
};
export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatFilter<$PrismaModel> | number;
};
export type NestedJsonFilter<$PrismaModel = never> = Prisma.PatchUndefined<Prisma.Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>, Required<NestedJsonFilterBase<$PrismaModel>>> | Prisma.OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>;
export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    path?: string[];
    mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    lt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    lte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
};
export type NestedEnumPricingTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PricingType | Prisma.EnumPricingTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.PricingType[] | Prisma.ListEnumPricingTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PricingType[] | Prisma.ListEnumPricingTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPricingTypeWithAggregatesFilter<$PrismaModel> | $Enums.PricingType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPricingTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPricingTypeFilter<$PrismaModel>;
};
export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel> | null;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
};
export type NestedEnumGuideStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GuideStatus | Prisma.EnumGuideStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.GuideStatus[] | Prisma.ListEnumGuideStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.GuideStatus[] | Prisma.ListEnumGuideStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumGuideStatusWithAggregatesFilter<$PrismaModel> | $Enums.GuideStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumGuideStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumGuideStatusFilter<$PrismaModel>;
};
export type NestedEnumGuideLegalRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GuideLegalRole | Prisma.EnumGuideLegalRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.GuideLegalRole[] | Prisma.ListEnumGuideLegalRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.GuideLegalRole[] | Prisma.ListEnumGuideLegalRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumGuideLegalRoleWithAggregatesFilter<$PrismaModel> | $Enums.GuideLegalRole;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumGuideLegalRoleFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumGuideLegalRoleFilter<$PrismaModel>;
};
export type NestedJsonNullableFilter<$PrismaModel = never> = Prisma.PatchUndefined<Prisma.Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>, Required<NestedJsonNullableFilterBase<$PrismaModel>>> | Prisma.OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>;
export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    path?: string[];
    mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    lt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    lte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
};
export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalWithAggregatesFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _sum?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _min?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _max?: Prisma.NestedDecimalFilter<$PrismaModel>;
};
export type NestedEnumGuideEvidenceTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.GuideEvidenceType | Prisma.EnumGuideEvidenceTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.GuideEvidenceType[] | Prisma.ListEnumGuideEvidenceTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.GuideEvidenceType[] | Prisma.ListEnumGuideEvidenceTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumGuideEvidenceTypeFilter<$PrismaModel> | $Enums.GuideEvidenceType;
};
export type NestedEnumVerificationCheckStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.VerificationCheckStatus | Prisma.EnumVerificationCheckStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.VerificationCheckStatus[] | Prisma.ListEnumVerificationCheckStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.VerificationCheckStatus[] | Prisma.ListEnumVerificationCheckStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumVerificationCheckStatusFilter<$PrismaModel> | $Enums.VerificationCheckStatus;
};
export type NestedEnumGuideEvidenceTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GuideEvidenceType | Prisma.EnumGuideEvidenceTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.GuideEvidenceType[] | Prisma.ListEnumGuideEvidenceTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.GuideEvidenceType[] | Prisma.ListEnumGuideEvidenceTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumGuideEvidenceTypeWithAggregatesFilter<$PrismaModel> | $Enums.GuideEvidenceType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumGuideEvidenceTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumGuideEvidenceTypeFilter<$PrismaModel>;
};
export type NestedEnumVerificationCheckStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.VerificationCheckStatus | Prisma.EnumVerificationCheckStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.VerificationCheckStatus[] | Prisma.ListEnumVerificationCheckStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.VerificationCheckStatus[] | Prisma.ListEnumVerificationCheckStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumVerificationCheckStatusWithAggregatesFilter<$PrismaModel> | $Enums.VerificationCheckStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumVerificationCheckStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumVerificationCheckStatusFilter<$PrismaModel>;
};
export type NestedEnumCompetencyTaskTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.CompetencyTaskType | Prisma.EnumCompetencyTaskTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.CompetencyTaskType[] | Prisma.ListEnumCompetencyTaskTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CompetencyTaskType[] | Prisma.ListEnumCompetencyTaskTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCompetencyTaskTypeFilter<$PrismaModel> | $Enums.CompetencyTaskType;
};
export type NestedEnumCompetencyTaskTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CompetencyTaskType | Prisma.EnumCompetencyTaskTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.CompetencyTaskType[] | Prisma.ListEnumCompetencyTaskTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CompetencyTaskType[] | Prisma.ListEnumCompetencyTaskTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCompetencyTaskTypeWithAggregatesFilter<$PrismaModel> | $Enums.CompetencyTaskType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumCompetencyTaskTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumCompetencyTaskTypeFilter<$PrismaModel>;
};
export type NestedEnumTourismSourceTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TourismSourceType | Prisma.EnumTourismSourceTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.TourismSourceType[] | Prisma.ListEnumTourismSourceTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TourismSourceType[] | Prisma.ListEnumTourismSourceTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTourismSourceTypeFilter<$PrismaModel> | $Enums.TourismSourceType;
};
export type NestedEnumTourismAuthorityLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.TourismAuthorityLevel | Prisma.EnumTourismAuthorityLevelFieldRefInput<$PrismaModel>;
    in?: $Enums.TourismAuthorityLevel[] | Prisma.ListEnumTourismAuthorityLevelFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TourismAuthorityLevel[] | Prisma.ListEnumTourismAuthorityLevelFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTourismAuthorityLevelFilter<$PrismaModel> | $Enums.TourismAuthorityLevel;
};
export type NestedEnumTourismSourceReviewStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TourismSourceReviewStatus | Prisma.EnumTourismSourceReviewStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.TourismSourceReviewStatus[] | Prisma.ListEnumTourismSourceReviewStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TourismSourceReviewStatus[] | Prisma.ListEnumTourismSourceReviewStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTourismSourceReviewStatusFilter<$PrismaModel> | $Enums.TourismSourceReviewStatus;
};
export type NestedUuidNullableFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedUuidNullableFilter<$PrismaModel> | string | null;
};
export type NestedEnumTourismSourceTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TourismSourceType | Prisma.EnumTourismSourceTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.TourismSourceType[] | Prisma.ListEnumTourismSourceTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TourismSourceType[] | Prisma.ListEnumTourismSourceTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTourismSourceTypeWithAggregatesFilter<$PrismaModel> | $Enums.TourismSourceType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumTourismSourceTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumTourismSourceTypeFilter<$PrismaModel>;
};
export type NestedEnumTourismAuthorityLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TourismAuthorityLevel | Prisma.EnumTourismAuthorityLevelFieldRefInput<$PrismaModel>;
    in?: $Enums.TourismAuthorityLevel[] | Prisma.ListEnumTourismAuthorityLevelFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TourismAuthorityLevel[] | Prisma.ListEnumTourismAuthorityLevelFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTourismAuthorityLevelWithAggregatesFilter<$PrismaModel> | $Enums.TourismAuthorityLevel;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumTourismAuthorityLevelFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumTourismAuthorityLevelFilter<$PrismaModel>;
};
export type NestedEnumTourismSourceReviewStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TourismSourceReviewStatus | Prisma.EnumTourismSourceReviewStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.TourismSourceReviewStatus[] | Prisma.ListEnumTourismSourceReviewStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TourismSourceReviewStatus[] | Prisma.ListEnumTourismSourceReviewStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTourismSourceReviewStatusWithAggregatesFilter<$PrismaModel> | $Enums.TourismSourceReviewStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumTourismSourceReviewStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumTourismSourceReviewStatusFilter<$PrismaModel>;
};
export type NestedUuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedStringNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedStringNullableFilter<$PrismaModel>;
};
export type NestedEnumRouteFamilyNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.RouteFamily | Prisma.EnumRouteFamilyFieldRefInput<$PrismaModel> | null;
    in?: $Enums.RouteFamily[] | Prisma.ListEnumRouteFamilyFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.RouteFamily[] | Prisma.ListEnumRouteFamilyFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumRouteFamilyNullableFilter<$PrismaModel> | $Enums.RouteFamily | null;
};
export type NestedEnumTourismKnowledgeCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.TourismKnowledgeCategory | Prisma.EnumTourismKnowledgeCategoryFieldRefInput<$PrismaModel>;
    in?: $Enums.TourismKnowledgeCategory[] | Prisma.ListEnumTourismKnowledgeCategoryFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TourismKnowledgeCategory[] | Prisma.ListEnumTourismKnowledgeCategoryFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTourismKnowledgeCategoryFilter<$PrismaModel> | $Enums.TourismKnowledgeCategory;
};
export type NestedEnumRouteFamilyNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RouteFamily | Prisma.EnumRouteFamilyFieldRefInput<$PrismaModel> | null;
    in?: $Enums.RouteFamily[] | Prisma.ListEnumRouteFamilyFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.RouteFamily[] | Prisma.ListEnumRouteFamilyFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumRouteFamilyNullableWithAggregatesFilter<$PrismaModel> | $Enums.RouteFamily | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumRouteFamilyNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumRouteFamilyNullableFilter<$PrismaModel>;
};
export type NestedEnumTourismKnowledgeCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TourismKnowledgeCategory | Prisma.EnumTourismKnowledgeCategoryFieldRefInput<$PrismaModel>;
    in?: $Enums.TourismKnowledgeCategory[] | Prisma.ListEnumTourismKnowledgeCategoryFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TourismKnowledgeCategory[] | Prisma.ListEnumTourismKnowledgeCategoryFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTourismKnowledgeCategoryWithAggregatesFilter<$PrismaModel> | $Enums.TourismKnowledgeCategory;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumTourismKnowledgeCategoryFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumTourismKnowledgeCategoryFilter<$PrismaModel>;
};
export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedIntNullableFilter<$PrismaModel>;
};
export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatNullableFilter<$PrismaModel> | number | null;
};
export type NestedEnumRouteFamilyFilter<$PrismaModel = never> = {
    equals?: $Enums.RouteFamily | Prisma.EnumRouteFamilyFieldRefInput<$PrismaModel>;
    in?: $Enums.RouteFamily[] | Prisma.ListEnumRouteFamilyFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RouteFamily[] | Prisma.ListEnumRouteFamilyFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRouteFamilyFilter<$PrismaModel> | $Enums.RouteFamily;
};
export type NestedEnumRouteRiskLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.RouteRiskLevel | Prisma.EnumRouteRiskLevelFieldRefInput<$PrismaModel>;
    in?: $Enums.RouteRiskLevel[] | Prisma.ListEnumRouteRiskLevelFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RouteRiskLevel[] | Prisma.ListEnumRouteRiskLevelFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRouteRiskLevelFilter<$PrismaModel> | $Enums.RouteRiskLevel;
};
export type NestedEnumCefrLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.CefrLevel | Prisma.EnumCefrLevelFieldRefInput<$PrismaModel>;
    in?: $Enums.CefrLevel[] | Prisma.ListEnumCefrLevelFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CefrLevel[] | Prisma.ListEnumCefrLevelFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCefrLevelFilter<$PrismaModel> | $Enums.CefrLevel;
};
export type NestedEnumRouteFamilyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RouteFamily | Prisma.EnumRouteFamilyFieldRefInput<$PrismaModel>;
    in?: $Enums.RouteFamily[] | Prisma.ListEnumRouteFamilyFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RouteFamily[] | Prisma.ListEnumRouteFamilyFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRouteFamilyWithAggregatesFilter<$PrismaModel> | $Enums.RouteFamily;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumRouteFamilyFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumRouteFamilyFilter<$PrismaModel>;
};
export type NestedEnumRouteRiskLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RouteRiskLevel | Prisma.EnumRouteRiskLevelFieldRefInput<$PrismaModel>;
    in?: $Enums.RouteRiskLevel[] | Prisma.ListEnumRouteRiskLevelFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RouteRiskLevel[] | Prisma.ListEnumRouteRiskLevelFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRouteRiskLevelWithAggregatesFilter<$PrismaModel> | $Enums.RouteRiskLevel;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumRouteRiskLevelFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumRouteRiskLevelFilter<$PrismaModel>;
};
export type NestedEnumCefrLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CefrLevel | Prisma.EnumCefrLevelFieldRefInput<$PrismaModel>;
    in?: $Enums.CefrLevel[] | Prisma.ListEnumCefrLevelFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CefrLevel[] | Prisma.ListEnumCefrLevelFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCefrLevelWithAggregatesFilter<$PrismaModel> | $Enums.CefrLevel;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumCefrLevelFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumCefrLevelFilter<$PrismaModel>;
};
export type NestedEnumRouteNodeTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.RouteNodeType | Prisma.EnumRouteNodeTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.RouteNodeType[] | Prisma.ListEnumRouteNodeTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RouteNodeType[] | Prisma.ListEnumRouteNodeTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRouteNodeTypeFilter<$PrismaModel> | $Enums.RouteNodeType;
};
export type NestedEnumRouteNodeTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RouteNodeType | Prisma.EnumRouteNodeTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.RouteNodeType[] | Prisma.ListEnumRouteNodeTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RouteNodeType[] | Prisma.ListEnumRouteNodeTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRouteNodeTypeWithAggregatesFilter<$PrismaModel> | $Enums.RouteNodeType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumRouteNodeTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumRouteNodeTypeFilter<$PrismaModel>;
};
export type NestedEnumRouteTransportModeFilter<$PrismaModel = never> = {
    equals?: $Enums.RouteTransportMode | Prisma.EnumRouteTransportModeFieldRefInput<$PrismaModel>;
    in?: $Enums.RouteTransportMode[] | Prisma.ListEnumRouteTransportModeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RouteTransportMode[] | Prisma.ListEnumRouteTransportModeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRouteTransportModeFilter<$PrismaModel> | $Enums.RouteTransportMode;
};
export type NestedEnumRouteTransportModeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RouteTransportMode | Prisma.EnumRouteTransportModeFieldRefInput<$PrismaModel>;
    in?: $Enums.RouteTransportMode[] | Prisma.ListEnumRouteTransportModeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RouteTransportMode[] | Prisma.ListEnumRouteTransportModeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRouteTransportModeWithAggregatesFilter<$PrismaModel> | $Enums.RouteTransportMode;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumRouteTransportModeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumRouteTransportModeFilter<$PrismaModel>;
};
export type NestedEnumSafetyPlanStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SafetyPlanStatus | Prisma.EnumSafetyPlanStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.SafetyPlanStatus[] | Prisma.ListEnumSafetyPlanStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SafetyPlanStatus[] | Prisma.ListEnumSafetyPlanStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSafetyPlanStatusFilter<$PrismaModel> | $Enums.SafetyPlanStatus;
};
export type NestedEnumSafetyPlanStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SafetyPlanStatus | Prisma.EnumSafetyPlanStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.SafetyPlanStatus[] | Prisma.ListEnumSafetyPlanStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SafetyPlanStatus[] | Prisma.ListEnumSafetyPlanStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSafetyPlanStatusWithAggregatesFilter<$PrismaModel> | $Enums.SafetyPlanStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSafetyPlanStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSafetyPlanStatusFilter<$PrismaModel>;
};
export type NestedEnumSafetyPlanAuditActionFilter<$PrismaModel = never> = {
    equals?: $Enums.SafetyPlanAuditAction | Prisma.EnumSafetyPlanAuditActionFieldRefInput<$PrismaModel>;
    in?: $Enums.SafetyPlanAuditAction[] | Prisma.ListEnumSafetyPlanAuditActionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SafetyPlanAuditAction[] | Prisma.ListEnumSafetyPlanAuditActionFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSafetyPlanAuditActionFilter<$PrismaModel> | $Enums.SafetyPlanAuditAction;
};
export type NestedEnumSafetyPlanStatusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.SafetyPlanStatus | Prisma.EnumSafetyPlanStatusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.SafetyPlanStatus[] | Prisma.ListEnumSafetyPlanStatusFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.SafetyPlanStatus[] | Prisma.ListEnumSafetyPlanStatusFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumSafetyPlanStatusNullableFilter<$PrismaModel> | $Enums.SafetyPlanStatus | null;
};
export type NestedEnumSafetyPlanAuditActionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SafetyPlanAuditAction | Prisma.EnumSafetyPlanAuditActionFieldRefInput<$PrismaModel>;
    in?: $Enums.SafetyPlanAuditAction[] | Prisma.ListEnumSafetyPlanAuditActionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SafetyPlanAuditAction[] | Prisma.ListEnumSafetyPlanAuditActionFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSafetyPlanAuditActionWithAggregatesFilter<$PrismaModel> | $Enums.SafetyPlanAuditAction;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSafetyPlanAuditActionFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSafetyPlanAuditActionFilter<$PrismaModel>;
};
export type NestedEnumSafetyPlanStatusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SafetyPlanStatus | Prisma.EnumSafetyPlanStatusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.SafetyPlanStatus[] | Prisma.ListEnumSafetyPlanStatusFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.SafetyPlanStatus[] | Prisma.ListEnumSafetyPlanStatusFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumSafetyPlanStatusNullableWithAggregatesFilter<$PrismaModel> | $Enums.SafetyPlanStatus | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSafetyPlanStatusNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSafetyPlanStatusNullableFilter<$PrismaModel>;
};
export type NestedEnumGuideCompetencyTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.GuideCompetencyType | Prisma.EnumGuideCompetencyTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.GuideCompetencyType[] | Prisma.ListEnumGuideCompetencyTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.GuideCompetencyType[] | Prisma.ListEnumGuideCompetencyTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumGuideCompetencyTypeFilter<$PrismaModel> | $Enums.GuideCompetencyType;
};
export type NestedEnumGuideCompetencyStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.GuideCompetencyStatus | Prisma.EnumGuideCompetencyStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.GuideCompetencyStatus[] | Prisma.ListEnumGuideCompetencyStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.GuideCompetencyStatus[] | Prisma.ListEnumGuideCompetencyStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumGuideCompetencyStatusFilter<$PrismaModel> | $Enums.GuideCompetencyStatus;
};
export type NestedEnumGuideCompetencyTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GuideCompetencyType | Prisma.EnumGuideCompetencyTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.GuideCompetencyType[] | Prisma.ListEnumGuideCompetencyTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.GuideCompetencyType[] | Prisma.ListEnumGuideCompetencyTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumGuideCompetencyTypeWithAggregatesFilter<$PrismaModel> | $Enums.GuideCompetencyType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumGuideCompetencyTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumGuideCompetencyTypeFilter<$PrismaModel>;
};
export type NestedEnumGuideCompetencyStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GuideCompetencyStatus | Prisma.EnumGuideCompetencyStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.GuideCompetencyStatus[] | Prisma.ListEnumGuideCompetencyStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.GuideCompetencyStatus[] | Prisma.ListEnumGuideCompetencyStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumGuideCompetencyStatusWithAggregatesFilter<$PrismaModel> | $Enums.GuideCompetencyStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumGuideCompetencyStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumGuideCompetencyStatusFilter<$PrismaModel>;
};
export type NestedEnumCefrLevelNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.CefrLevel | Prisma.EnumCefrLevelFieldRefInput<$PrismaModel> | null;
    in?: $Enums.CefrLevel[] | Prisma.ListEnumCefrLevelFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.CefrLevel[] | Prisma.ListEnumCefrLevelFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumCefrLevelNullableFilter<$PrismaModel> | $Enums.CefrLevel | null;
};
export type NestedEnumCefrLevelNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CefrLevel | Prisma.EnumCefrLevelFieldRefInput<$PrismaModel> | null;
    in?: $Enums.CefrLevel[] | Prisma.ListEnumCefrLevelFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.CefrLevel[] | Prisma.ListEnumCefrLevelFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumCefrLevelNullableWithAggregatesFilter<$PrismaModel> | $Enums.CefrLevel | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumCefrLevelNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumCefrLevelNullableFilter<$PrismaModel>;
};
export type NestedEnumEvaluatorTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.EvaluatorType | Prisma.EnumEvaluatorTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.EvaluatorType[] | Prisma.ListEnumEvaluatorTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.EvaluatorType[] | Prisma.ListEnumEvaluatorTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumEvaluatorTypeFilter<$PrismaModel> | $Enums.EvaluatorType;
};
export type NestedEnumEvaluatorTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EvaluatorType | Prisma.EnumEvaluatorTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.EvaluatorType[] | Prisma.ListEnumEvaluatorTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.EvaluatorType[] | Prisma.ListEnumEvaluatorTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumEvaluatorTypeWithAggregatesFilter<$PrismaModel> | $Enums.EvaluatorType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumEvaluatorTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumEvaluatorTypeFilter<$PrismaModel>;
};
export type NestedEnumHumanReviewStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.HumanReviewStatus | Prisma.EnumHumanReviewStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.HumanReviewStatus[] | Prisma.ListEnumHumanReviewStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.HumanReviewStatus[] | Prisma.ListEnumHumanReviewStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumHumanReviewStatusFilter<$PrismaModel> | $Enums.HumanReviewStatus;
};
export type NestedEnumHumanReviewStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.HumanReviewStatus | Prisma.EnumHumanReviewStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.HumanReviewStatus[] | Prisma.ListEnumHumanReviewStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.HumanReviewStatus[] | Prisma.ListEnumHumanReviewStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumHumanReviewStatusWithAggregatesFilter<$PrismaModel> | $Enums.HumanReviewStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumHumanReviewStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumHumanReviewStatusFilter<$PrismaModel>;
};
export type NestedEnumFirstAidCertificateStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.FirstAidCertificateStatus | Prisma.EnumFirstAidCertificateStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.FirstAidCertificateStatus[] | Prisma.ListEnumFirstAidCertificateStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.FirstAidCertificateStatus[] | Prisma.ListEnumFirstAidCertificateStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumFirstAidCertificateStatusFilter<$PrismaModel> | $Enums.FirstAidCertificateStatus;
};
export type NestedEnumPracticalVerificationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PracticalVerificationStatus | Prisma.EnumPracticalVerificationStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.PracticalVerificationStatus[] | Prisma.ListEnumPracticalVerificationStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PracticalVerificationStatus[] | Prisma.ListEnumPracticalVerificationStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPracticalVerificationStatusFilter<$PrismaModel> | $Enums.PracticalVerificationStatus;
};
export type NestedEnumFirstAidCertificateStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FirstAidCertificateStatus | Prisma.EnumFirstAidCertificateStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.FirstAidCertificateStatus[] | Prisma.ListEnumFirstAidCertificateStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.FirstAidCertificateStatus[] | Prisma.ListEnumFirstAidCertificateStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumFirstAidCertificateStatusWithAggregatesFilter<$PrismaModel> | $Enums.FirstAidCertificateStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumFirstAidCertificateStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumFirstAidCertificateStatusFilter<$PrismaModel>;
};
export type NestedEnumPracticalVerificationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PracticalVerificationStatus | Prisma.EnumPracticalVerificationStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.PracticalVerificationStatus[] | Prisma.ListEnumPracticalVerificationStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PracticalVerificationStatus[] | Prisma.ListEnumPracticalVerificationStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPracticalVerificationStatusWithAggregatesFilter<$PrismaModel> | $Enums.PracticalVerificationStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPracticalVerificationStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPracticalVerificationStatusFilter<$PrismaModel>;
};
export type NestedEnumAssessmentCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.AssessmentCategory | Prisma.EnumAssessmentCategoryFieldRefInput<$PrismaModel>;
    in?: $Enums.AssessmentCategory[] | Prisma.ListEnumAssessmentCategoryFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AssessmentCategory[] | Prisma.ListEnumAssessmentCategoryFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAssessmentCategoryFilter<$PrismaModel> | $Enums.AssessmentCategory;
};
export type NestedEnumAssessmentDifficultyFilter<$PrismaModel = never> = {
    equals?: $Enums.AssessmentDifficulty | Prisma.EnumAssessmentDifficultyFieldRefInput<$PrismaModel>;
    in?: $Enums.AssessmentDifficulty[] | Prisma.ListEnumAssessmentDifficultyFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AssessmentDifficulty[] | Prisma.ListEnumAssessmentDifficultyFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAssessmentDifficultyFilter<$PrismaModel> | $Enums.AssessmentDifficulty;
};
export type NestedEnumAssessmentQuestionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AssessmentQuestionType | Prisma.EnumAssessmentQuestionTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.AssessmentQuestionType[] | Prisma.ListEnumAssessmentQuestionTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AssessmentQuestionType[] | Prisma.ListEnumAssessmentQuestionTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAssessmentQuestionTypeFilter<$PrismaModel> | $Enums.AssessmentQuestionType;
};
export type NestedEnumAssessmentCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AssessmentCategory | Prisma.EnumAssessmentCategoryFieldRefInput<$PrismaModel>;
    in?: $Enums.AssessmentCategory[] | Prisma.ListEnumAssessmentCategoryFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AssessmentCategory[] | Prisma.ListEnumAssessmentCategoryFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAssessmentCategoryWithAggregatesFilter<$PrismaModel> | $Enums.AssessmentCategory;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumAssessmentCategoryFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumAssessmentCategoryFilter<$PrismaModel>;
};
export type NestedEnumAssessmentDifficultyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AssessmentDifficulty | Prisma.EnumAssessmentDifficultyFieldRefInput<$PrismaModel>;
    in?: $Enums.AssessmentDifficulty[] | Prisma.ListEnumAssessmentDifficultyFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AssessmentDifficulty[] | Prisma.ListEnumAssessmentDifficultyFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAssessmentDifficultyWithAggregatesFilter<$PrismaModel> | $Enums.AssessmentDifficulty;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumAssessmentDifficultyFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumAssessmentDifficultyFilter<$PrismaModel>;
};
export type NestedEnumAssessmentQuestionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AssessmentQuestionType | Prisma.EnumAssessmentQuestionTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.AssessmentQuestionType[] | Prisma.ListEnumAssessmentQuestionTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AssessmentQuestionType[] | Prisma.ListEnumAssessmentQuestionTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAssessmentQuestionTypeWithAggregatesFilter<$PrismaModel> | $Enums.AssessmentQuestionType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumAssessmentQuestionTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumAssessmentQuestionTypeFilter<$PrismaModel>;
};
export type NestedEnumAssessmentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AssessmentType | Prisma.EnumAssessmentTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.AssessmentType[] | Prisma.ListEnumAssessmentTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AssessmentType[] | Prisma.ListEnumAssessmentTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAssessmentTypeFilter<$PrismaModel> | $Enums.AssessmentType;
};
export type NestedEnumAssessmentAttemptStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AssessmentAttemptStatus | Prisma.EnumAssessmentAttemptStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.AssessmentAttemptStatus[] | Prisma.ListEnumAssessmentAttemptStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AssessmentAttemptStatus[] | Prisma.ListEnumAssessmentAttemptStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAssessmentAttemptStatusFilter<$PrismaModel> | $Enums.AssessmentAttemptStatus;
};
export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedBoolNullableFilter<$PrismaModel> | boolean | null;
};
export type NestedEnumAssessmentTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AssessmentType | Prisma.EnumAssessmentTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.AssessmentType[] | Prisma.ListEnumAssessmentTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AssessmentType[] | Prisma.ListEnumAssessmentTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAssessmentTypeWithAggregatesFilter<$PrismaModel> | $Enums.AssessmentType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumAssessmentTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumAssessmentTypeFilter<$PrismaModel>;
};
export type NestedEnumAssessmentAttemptStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AssessmentAttemptStatus | Prisma.EnumAssessmentAttemptStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.AssessmentAttemptStatus[] | Prisma.ListEnumAssessmentAttemptStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AssessmentAttemptStatus[] | Prisma.ListEnumAssessmentAttemptStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAssessmentAttemptStatusWithAggregatesFilter<$PrismaModel> | $Enums.AssessmentAttemptStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumAssessmentAttemptStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumAssessmentAttemptStatusFilter<$PrismaModel>;
};
export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedBoolNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedBoolNullableFilter<$PrismaModel>;
};
export type NestedEnumAssessmentReviewDecisionFilter<$PrismaModel = never> = {
    equals?: $Enums.AssessmentReviewDecision | Prisma.EnumAssessmentReviewDecisionFieldRefInput<$PrismaModel>;
    in?: $Enums.AssessmentReviewDecision[] | Prisma.ListEnumAssessmentReviewDecisionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AssessmentReviewDecision[] | Prisma.ListEnumAssessmentReviewDecisionFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAssessmentReviewDecisionFilter<$PrismaModel> | $Enums.AssessmentReviewDecision;
};
export type NestedEnumAssessmentReviewDecisionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AssessmentReviewDecision | Prisma.EnumAssessmentReviewDecisionFieldRefInput<$PrismaModel>;
    in?: $Enums.AssessmentReviewDecision[] | Prisma.ListEnumAssessmentReviewDecisionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AssessmentReviewDecision[] | Prisma.ListEnumAssessmentReviewDecisionFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAssessmentReviewDecisionWithAggregatesFilter<$PrismaModel> | $Enums.AssessmentReviewDecision;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumAssessmentReviewDecisionFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumAssessmentReviewDecisionFilter<$PrismaModel>;
};
export type NestedEnumAiExperimentModeFilter<$PrismaModel = never> = {
    equals?: $Enums.AiExperimentMode | Prisma.EnumAiExperimentModeFieldRefInput<$PrismaModel>;
    in?: $Enums.AiExperimentMode[] | Prisma.ListEnumAiExperimentModeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AiExperimentMode[] | Prisma.ListEnumAiExperimentModeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAiExperimentModeFilter<$PrismaModel> | $Enums.AiExperimentMode;
};
export type NestedEnumAiConversationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AiConversationStatus | Prisma.EnumAiConversationStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.AiConversationStatus[] | Prisma.ListEnumAiConversationStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AiConversationStatus[] | Prisma.ListEnumAiConversationStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAiConversationStatusFilter<$PrismaModel> | $Enums.AiConversationStatus;
};
export type NestedEnumAiExperimentModeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AiExperimentMode | Prisma.EnumAiExperimentModeFieldRefInput<$PrismaModel>;
    in?: $Enums.AiExperimentMode[] | Prisma.ListEnumAiExperimentModeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AiExperimentMode[] | Prisma.ListEnumAiExperimentModeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAiExperimentModeWithAggregatesFilter<$PrismaModel> | $Enums.AiExperimentMode;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumAiExperimentModeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumAiExperimentModeFilter<$PrismaModel>;
};
export type NestedEnumAiConversationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AiConversationStatus | Prisma.EnumAiConversationStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.AiConversationStatus[] | Prisma.ListEnumAiConversationStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AiConversationStatus[] | Prisma.ListEnumAiConversationStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAiConversationStatusWithAggregatesFilter<$PrismaModel> | $Enums.AiConversationStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumAiConversationStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumAiConversationStatusFilter<$PrismaModel>;
};
export type NestedEnumAiMessageRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.AiMessageRole | Prisma.EnumAiMessageRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.AiMessageRole[] | Prisma.ListEnumAiMessageRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AiMessageRole[] | Prisma.ListEnumAiMessageRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAiMessageRoleFilter<$PrismaModel> | $Enums.AiMessageRole;
};
export type NestedEnumAiMessageRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AiMessageRole | Prisma.EnumAiMessageRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.AiMessageRole[] | Prisma.ListEnumAiMessageRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AiMessageRole[] | Prisma.ListEnumAiMessageRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAiMessageRoleWithAggregatesFilter<$PrismaModel> | $Enums.AiMessageRole;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumAiMessageRoleFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumAiMessageRoleFilter<$PrismaModel>;
};
export type NestedEnumAiRequestTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AiRequestType | Prisma.EnumAiRequestTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.AiRequestType[] | Prisma.ListEnumAiRequestTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AiRequestType[] | Prisma.ListEnumAiRequestTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAiRequestTypeFilter<$PrismaModel> | $Enums.AiRequestType;
};
export type NestedEnumAiRequestTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AiRequestType | Prisma.EnumAiRequestTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.AiRequestType[] | Prisma.ListEnumAiRequestTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AiRequestType[] | Prisma.ListEnumAiRequestTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAiRequestTypeWithAggregatesFilter<$PrismaModel> | $Enums.AiRequestType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumAiRequestTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumAiRequestTypeFilter<$PrismaModel>;
};
export type NestedEnumGuideVerificationDecisionFilter<$PrismaModel = never> = {
    equals?: $Enums.GuideVerificationDecision | Prisma.EnumGuideVerificationDecisionFieldRefInput<$PrismaModel>;
    in?: $Enums.GuideVerificationDecision[] | Prisma.ListEnumGuideVerificationDecisionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.GuideVerificationDecision[] | Prisma.ListEnumGuideVerificationDecisionFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumGuideVerificationDecisionFilter<$PrismaModel> | $Enums.GuideVerificationDecision;
};
export type NestedEnumGuideVerificationDecisionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GuideVerificationDecision | Prisma.EnumGuideVerificationDecisionFieldRefInput<$PrismaModel>;
    in?: $Enums.GuideVerificationDecision[] | Prisma.ListEnumGuideVerificationDecisionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.GuideVerificationDecision[] | Prisma.ListEnumGuideVerificationDecisionFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumGuideVerificationDecisionWithAggregatesFilter<$PrismaModel> | $Enums.GuideVerificationDecision;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumGuideVerificationDecisionFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumGuideVerificationDecisionFilter<$PrismaModel>;
};
export type NestedEnumListingCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.ListingCategory | Prisma.EnumListingCategoryFieldRefInput<$PrismaModel>;
    in?: $Enums.ListingCategory[] | Prisma.ListEnumListingCategoryFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ListingCategory[] | Prisma.ListEnumListingCategoryFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumListingCategoryFilter<$PrismaModel> | $Enums.ListingCategory;
};
export type NestedEnumPriceUnitFilter<$PrismaModel = never> = {
    equals?: $Enums.PriceUnit | Prisma.EnumPriceUnitFieldRefInput<$PrismaModel>;
    in?: $Enums.PriceUnit[] | Prisma.ListEnumPriceUnitFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PriceUnit[] | Prisma.ListEnumPriceUnitFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPriceUnitFilter<$PrismaModel> | $Enums.PriceUnit;
};
export type NestedEnumListingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ListingStatus | Prisma.EnumListingStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ListingStatus[] | Prisma.ListEnumListingStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ListingStatus[] | Prisma.ListEnumListingStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumListingStatusFilter<$PrismaModel> | $Enums.ListingStatus;
};
export type NestedEnumListingCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ListingCategory | Prisma.EnumListingCategoryFieldRefInput<$PrismaModel>;
    in?: $Enums.ListingCategory[] | Prisma.ListEnumListingCategoryFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ListingCategory[] | Prisma.ListEnumListingCategoryFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumListingCategoryWithAggregatesFilter<$PrismaModel> | $Enums.ListingCategory;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumListingCategoryFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumListingCategoryFilter<$PrismaModel>;
};
export type NestedEnumPriceUnitWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PriceUnit | Prisma.EnumPriceUnitFieldRefInput<$PrismaModel>;
    in?: $Enums.PriceUnit[] | Prisma.ListEnumPriceUnitFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PriceUnit[] | Prisma.ListEnumPriceUnitFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPriceUnitWithAggregatesFilter<$PrismaModel> | $Enums.PriceUnit;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPriceUnitFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPriceUnitFilter<$PrismaModel>;
};
export type NestedEnumListingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ListingStatus | Prisma.EnumListingStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ListingStatus[] | Prisma.ListEnumListingStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ListingStatus[] | Prisma.ListEnumListingStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumListingStatusWithAggregatesFilter<$PrismaModel> | $Enums.ListingStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumListingStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumListingStatusFilter<$PrismaModel>;
};
export type NestedEnumBookingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStatus | Prisma.EnumBookingStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.BookingStatus[] | Prisma.ListEnumBookingStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.BookingStatus[] | Prisma.ListEnumBookingStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumBookingStatusFilter<$PrismaModel> | $Enums.BookingStatus;
};
export type NestedEnumCancellationPolicyTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.CancellationPolicyType | Prisma.EnumCancellationPolicyTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.CancellationPolicyType[] | Prisma.ListEnumCancellationPolicyTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CancellationPolicyType[] | Prisma.ListEnumCancellationPolicyTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCancellationPolicyTypeFilter<$PrismaModel> | $Enums.CancellationPolicyType;
};
export type NestedEnumBookingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStatus | Prisma.EnumBookingStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.BookingStatus[] | Prisma.ListEnumBookingStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.BookingStatus[] | Prisma.ListEnumBookingStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumBookingStatusWithAggregatesFilter<$PrismaModel> | $Enums.BookingStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumBookingStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumBookingStatusFilter<$PrismaModel>;
};
export type NestedEnumCancellationPolicyTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CancellationPolicyType | Prisma.EnumCancellationPolicyTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.CancellationPolicyType[] | Prisma.ListEnumCancellationPolicyTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CancellationPolicyType[] | Prisma.ListEnumCancellationPolicyTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCancellationPolicyTypeWithAggregatesFilter<$PrismaModel> | $Enums.CancellationPolicyType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumCancellationPolicyTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumCancellationPolicyTypeFilter<$PrismaModel>;
};
export type NestedEnumPaymentArrangementFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentArrangement | Prisma.EnumPaymentArrangementFieldRefInput<$PrismaModel>;
    in?: $Enums.PaymentArrangement[] | Prisma.ListEnumPaymentArrangementFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PaymentArrangement[] | Prisma.ListEnumPaymentArrangementFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPaymentArrangementFilter<$PrismaModel> | $Enums.PaymentArrangement;
};
export type NestedEnumPaymentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | Prisma.EnumPaymentStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.PaymentStatus[] | Prisma.ListEnumPaymentStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PaymentStatus[] | Prisma.ListEnumPaymentStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPaymentStatusFilter<$PrismaModel> | $Enums.PaymentStatus;
};
export type NestedEnumPaymentArrangementWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentArrangement | Prisma.EnumPaymentArrangementFieldRefInput<$PrismaModel>;
    in?: $Enums.PaymentArrangement[] | Prisma.ListEnumPaymentArrangementFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PaymentArrangement[] | Prisma.ListEnumPaymentArrangementFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPaymentArrangementWithAggregatesFilter<$PrismaModel> | $Enums.PaymentArrangement;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPaymentArrangementFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPaymentArrangementFilter<$PrismaModel>;
};
export type NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | Prisma.EnumPaymentStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.PaymentStatus[] | Prisma.ListEnumPaymentStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PaymentStatus[] | Prisma.ListEnumPaymentStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel> | $Enums.PaymentStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPaymentStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPaymentStatusFilter<$PrismaModel>;
};
export type NestedEnumBookingActorTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingActorType | Prisma.EnumBookingActorTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.BookingActorType[] | Prisma.ListEnumBookingActorTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.BookingActorType[] | Prisma.ListEnumBookingActorTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumBookingActorTypeFilter<$PrismaModel> | $Enums.BookingActorType;
};
export type NestedEnumBookingStatusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStatus | Prisma.EnumBookingStatusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.BookingStatus[] | Prisma.ListEnumBookingStatusFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.BookingStatus[] | Prisma.ListEnumBookingStatusFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumBookingStatusNullableFilter<$PrismaModel> | $Enums.BookingStatus | null;
};
export type NestedEnumBookingActorTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingActorType | Prisma.EnumBookingActorTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.BookingActorType[] | Prisma.ListEnumBookingActorTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.BookingActorType[] | Prisma.ListEnumBookingActorTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumBookingActorTypeWithAggregatesFilter<$PrismaModel> | $Enums.BookingActorType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumBookingActorTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumBookingActorTypeFilter<$PrismaModel>;
};
export type NestedEnumBookingStatusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStatus | Prisma.EnumBookingStatusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.BookingStatus[] | Prisma.ListEnumBookingStatusFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.BookingStatus[] | Prisma.ListEnumBookingStatusFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumBookingStatusNullableWithAggregatesFilter<$PrismaModel> | $Enums.BookingStatus | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumBookingStatusNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumBookingStatusNullableFilter<$PrismaModel>;
};
export type NestedEnumReportReasonFilter<$PrismaModel = never> = {
    equals?: $Enums.ReportReason | Prisma.EnumReportReasonFieldRefInput<$PrismaModel>;
    in?: $Enums.ReportReason[] | Prisma.ListEnumReportReasonFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ReportReason[] | Prisma.ListEnumReportReasonFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumReportReasonFilter<$PrismaModel> | $Enums.ReportReason;
};
export type NestedEnumReportTargetTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ReportTargetType | Prisma.EnumReportTargetTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.ReportTargetType[] | Prisma.ListEnumReportTargetTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ReportTargetType[] | Prisma.ListEnumReportTargetTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumReportTargetTypeFilter<$PrismaModel> | $Enums.ReportTargetType;
};
export type NestedEnumReportStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ReportStatus | Prisma.EnumReportStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ReportStatus[] | Prisma.ListEnumReportStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ReportStatus[] | Prisma.ListEnumReportStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumReportStatusFilter<$PrismaModel> | $Enums.ReportStatus;
};
export type NestedEnumReportReasonWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReportReason | Prisma.EnumReportReasonFieldRefInput<$PrismaModel>;
    in?: $Enums.ReportReason[] | Prisma.ListEnumReportReasonFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ReportReason[] | Prisma.ListEnumReportReasonFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumReportReasonWithAggregatesFilter<$PrismaModel> | $Enums.ReportReason;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumReportReasonFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumReportReasonFilter<$PrismaModel>;
};
export type NestedEnumReportTargetTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReportTargetType | Prisma.EnumReportTargetTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.ReportTargetType[] | Prisma.ListEnumReportTargetTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ReportTargetType[] | Prisma.ListEnumReportTargetTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumReportTargetTypeWithAggregatesFilter<$PrismaModel> | $Enums.ReportTargetType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumReportTargetTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumReportTargetTypeFilter<$PrismaModel>;
};
export type NestedEnumReportStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReportStatus | Prisma.EnumReportStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ReportStatus[] | Prisma.ListEnumReportStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ReportStatus[] | Prisma.ListEnumReportStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumReportStatusWithAggregatesFilter<$PrismaModel> | $Enums.ReportStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumReportStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumReportStatusFilter<$PrismaModel>;
};
export type NestedEnumModerationActionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ModerationActionType | Prisma.EnumModerationActionTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.ModerationActionType[] | Prisma.ListEnumModerationActionTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ModerationActionType[] | Prisma.ListEnumModerationActionTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumModerationActionTypeFilter<$PrismaModel> | $Enums.ModerationActionType;
};
export type NestedEnumModerationActionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ModerationActionType | Prisma.EnumModerationActionTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.ModerationActionType[] | Prisma.ListEnumModerationActionTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ModerationActionType[] | Prisma.ListEnumModerationActionTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumModerationActionTypeWithAggregatesFilter<$PrismaModel> | $Enums.ModerationActionType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumModerationActionTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumModerationActionTypeFilter<$PrismaModel>;
};
export type NestedEnumMessageTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageType | Prisma.EnumMessageTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.MessageType[] | Prisma.ListEnumMessageTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.MessageType[] | Prisma.ListEnumMessageTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumMessageTypeFilter<$PrismaModel> | $Enums.MessageType;
};
export type NestedEnumMessageTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageType | Prisma.EnumMessageTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.MessageType[] | Prisma.ListEnumMessageTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.MessageType[] | Prisma.ListEnumMessageTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumMessageTypeWithAggregatesFilter<$PrismaModel> | $Enums.MessageType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumMessageTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumMessageTypeFilter<$PrismaModel>;
};
export type NestedEnumNotificationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | Prisma.EnumNotificationTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.NotificationType[] | Prisma.ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.NotificationType[] | Prisma.ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumNotificationTypeFilter<$PrismaModel> | $Enums.NotificationType;
};
export type NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | Prisma.EnumNotificationTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.NotificationType[] | Prisma.ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.NotificationType[] | Prisma.ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel> | $Enums.NotificationType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumNotificationTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumNotificationTypeFilter<$PrismaModel>;
};
