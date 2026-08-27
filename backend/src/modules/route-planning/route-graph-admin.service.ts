import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, RouteRiskLevel } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  CreateResearchRouteDto,
  CreateRouteEdgeDto,
  CreateRouteNodeDto,
  UpdateResearchRouteDto,
  UpdateRouteEdgeDto,
  UpdateRouteNodeDto,
} from './dto/route-graph-admin.dto.js';
import { RouteGraphRepository } from './route-graph.repository.js';

@Injectable()
export class RouteGraphAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly graph: RouteGraphRepository,
  ) {}

  list() {
    return this.graph.list(false);
  }

  async createRoute(dto: CreateResearchRouteDto) {
    this.assertDayRange(dto.minimumDays, dto.recommendedDays);
    const route = await this.prisma.researchRoute.create({
      data: { ...dto, active: dto.active ?? true },
    });
    return this.graph.find(route.id, false);
  }

  async updateRoute(reference: string, dto: UpdateResearchRouteDto) {
    const route = await this.resolveRoute(reference);
    this.assertDayRange(
      dto.minimumDays ?? route.minimumDays,
      dto.recommendedDays ?? route.recommendedDays,
    );
    if (dto.riskLevel && this.riskValue(dto.riskLevel) < this.riskValue(route.riskLevel)) {
      const highestEdge = await this.prisma.routeEdge.findFirst({
        where: { routeId: route.id, active: true },
        orderBy: { riskLevel: 'desc' },
        select: { riskLevel: true },
      });
      if (highestEdge && this.riskValue(dto.riskLevel) < this.riskValue(highestEdge.riskLevel)) {
        throw new BadRequestException(`Route risk cannot be below active edge risk ${highestEdge.riskLevel}`);
      }
    }
    await this.prisma.researchRoute.update({ where: { id: route.id }, data: dto });
    return this.graph.find(route.id, false);
  }

  async createNode(routeReference: string, dto: CreateRouteNodeDto) {
    const route = await this.resolveRoute(routeReference);
    await this.prisma.routeNode.create({
      data: {
        ...dto,
        routeId: route.id,
        name: `${dto.nameEn} / ${dto.nameMn}`,
        active: dto.active ?? true,
      } as Prisma.RouteNodeUncheckedCreateInput,
    });
    return this.graph.find(route.id, false);
  }

  async updateNode(id: string, dto: UpdateRouteNodeDto) {
    const node = await this.prisma.routeNode.findUnique({ where: { id } });
    if (!node) throw new NotFoundException('Route node not found');
    const data = {
      ...dto,
      ...(dto.nameEn || dto.nameMn
        ? { name: `${dto.nameEn ?? node.nameEn} / ${dto.nameMn ?? node.nameMn}` }
        : {}),
    };
    await this.prisma.routeNode.update({
      where: { id },
      data: data as Prisma.RouteNodeUncheckedUpdateInput,
    });
    return this.graph.find(node.routeId, false);
  }

  async createEdge(routeReference: string, dto: CreateRouteEdgeDto) {
    const route = await this.resolveRoute(routeReference);
    await this.assertNodesBelongToRoute(route.id, dto.fromNodeId, dto.toNodeId);
    this.assertRiskWithinRoute(route.riskLevel, dto.riskLevel);
    const { openMonths, lastVerifiedAt, ...edge } = dto;
    await this.prisma.routeEdge.create({
      data: {
        ...edge,
        routeId: route.id,
        seasonality: { openMonths, verificationStatus: 'ADMIN_REVIEWED' },
        lastVerifiedAt: new Date(lastVerifiedAt),
        active: dto.active ?? true,
      },
    });
    return this.graph.find(route.id, false);
  }

  async updateEdge(id: string, dto: UpdateRouteEdgeDto) {
    const edgeRecord = await this.prisma.routeEdge.findUnique({
      where: { id },
      include: { route: { select: { riskLevel: true } } },
    });
    if (!edgeRecord) throw new NotFoundException('Route edge not found');
    const fromNodeId = dto.fromNodeId ?? edgeRecord.fromNodeId;
    const toNodeId = dto.toNodeId ?? edgeRecord.toNodeId;
    await this.assertNodesBelongToRoute(edgeRecord.routeId, fromNodeId, toNodeId);
    this.assertRiskWithinRoute(edgeRecord.route.riskLevel, dto.riskLevel ?? edgeRecord.riskLevel);
    const { openMonths, lastVerifiedAt, ...edge } = dto;
    await this.prisma.routeEdge.update({
      where: { id },
      data: {
        ...edge,
        ...(openMonths ? { seasonality: { openMonths, verificationStatus: 'ADMIN_REVIEWED' } } : {}),
        ...(lastVerifiedAt ? { lastVerifiedAt: new Date(lastVerifiedAt) } : {}),
      },
    });
    return this.graph.find(edgeRecord.routeId, false);
  }

  private async resolveRoute(reference: string) {
    const route = await this.prisma.researchRoute.findFirst({
      where: {
        OR: this.isUuid(reference) ? [{ id: reference }, { code: reference }] : [{ code: reference }],
      },
    });
    if (!route) throw new NotFoundException('Research route not found');
    return route;
  }

  private async assertNodesBelongToRoute(routeId: string, fromNodeId: string, toNodeId: string) {
    if (fromNodeId === toNodeId) throw new BadRequestException('Route edge nodes must be different');
    const count = await this.prisma.routeNode.count({
      where: { id: { in: [fromNodeId, toNodeId] }, routeId, active: true },
    });
    if (count !== 2) throw new BadRequestException('Both active edge nodes must belong to the route');
  }

  private assertDayRange(minimumDays: number, recommendedDays: number) {
    if (minimumDays > recommendedDays) {
      throw new BadRequestException('minimumDays cannot exceed recommendedDays');
    }
  }

  private assertRiskWithinRoute(routeRisk: RouteRiskLevel, edgeRisk: RouteRiskLevel) {
    if (this.riskValue(edgeRisk) > this.riskValue(routeRisk)) {
      throw new BadRequestException(`Edge risk ${edgeRisk} exceeds declared route maximum ${routeRisk}`);
    }
  }

  private riskValue(risk: RouteRiskLevel) {
    return Number(risk.slice(1));
  }

  private isUuid(value: string) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  }
}
