import { Response } from 'express';
import { AuthRequest } from '../types';
import prisma from '../config/database';
import { AppError, handleError } from '../utils/errorHandler';
import { z } from 'zod';

export const createServiceLineSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export const updateServiceLineSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const createServiceLine = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;

    const serviceLine = await prisma.serviceLine.create({
      data: {
        name,
        description,
      },
    });

    res.status(201).json({
      success: true,
      data: serviceLine,
      message: 'Service line created successfully',
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return handleError(new AppError('Service line already exists', 400), res);
    }
    handleError(error, res);
  }
};

export const getAllServiceLines = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, search, isActive } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const [serviceLines, total] = await Promise.all([
      prisma.serviceLine.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.serviceLine.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        serviceLines,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const getServiceLineById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const serviceLine = await prisma.serviceLine.findUnique({
      where: { id },
      include: {
        teams: {
          include: {
            team: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });

    if (!serviceLine) {
      throw new AppError('Service line not found', 404);
    }

    res.json({
      success: true,
      data: serviceLine,
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const updateServiceLine = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const serviceLine = await prisma.serviceLine.update({
      where: { id },
      data: req.body,
    });

    res.json({
      success: true,
      data: serviceLine,
      message: 'Service line updated successfully',
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return handleError(new AppError('Service line not found', 404), res);
    }
    handleError(error, res);
  }
};

export const deleteServiceLine = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.serviceLine.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Service line deleted successfully',
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return handleError(new AppError('Service line not found', 404), res);
    }
    handleError(error, res);
  }
};
