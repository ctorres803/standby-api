import { Response } from 'express';
import { AuthRequest } from '../types';
import prisma from '../config/database';
import { AppError, handleError } from '../utils/errorHandler';
import { z } from 'zod';

export const createClientSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const updateClientSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const createClient = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, phone, address } = req.body;

    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        address,
      },
    });

    res.status(201).json({
      success: true,
      data: client,
      message: 'Client created successfully',
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const getAllClients = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, search, isActive } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { email: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.client.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        clients,
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

export const getClientById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        teams: {
          where: { isActive: true },
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

    if (!client) {
      throw new AppError('Client not found', 404);
    }

    res.json({
      success: true,
      data: client,
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const updateClient = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const client = await prisma.client.update({
      where: { id },
      data: req.body,
    });

    res.json({
      success: true,
      data: client,
      message: 'Client updated successfully',
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return handleError(new AppError('Client not found', 404), res);
    }
    handleError(error, res);
  }
};

export const deleteClient = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.client.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Client deleted successfully',
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return handleError(new AppError('Client not found', 404), res);
    }
    handleError(error, res);
  }
};
