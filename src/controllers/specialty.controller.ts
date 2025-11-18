import { Response } from 'express';
import { AuthRequest } from '../types';
import prisma from '../config/database';
import { AppError, handleError } from '../utils/errorHandler';
import { z } from 'zod';

export const createSpecialtySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export const updateSpecialtySchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const createSpecialty = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;

    const specialty = await prisma.specialty.create({
      data: {
        name,
        description,
      },
    });

    res.status(201).json({
      success: true,
      data: specialty,
      message: 'Specialty created successfully',
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return handleError(new AppError('Specialty already exists', 400), res);
    }
    handleError(error, res);
  }
};

export const getAllSpecialties = async (req: AuthRequest, res: Response) => {
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

    const [specialties, total] = await Promise.all([
      prisma.specialty.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.specialty.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        specialties,
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

export const getSpecialtyById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const specialty = await prisma.specialty.findUnique({
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

    if (!specialty) {
      throw new AppError('Specialty not found', 404);
    }

    res.json({
      success: true,
      data: specialty,
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const updateSpecialty = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const specialty = await prisma.specialty.update({
      where: { id },
      data: req.body,
    });

    res.json({
      success: true,
      data: specialty,
      message: 'Specialty updated successfully',
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return handleError(new AppError('Specialty not found', 404), res);
    }
    handleError(error, res);
  }
};

export const deleteSpecialty = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.specialty.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Specialty deleted successfully',
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return handleError(new AppError('Specialty not found', 404), res);
    }
    handleError(error, res);
  }
};
