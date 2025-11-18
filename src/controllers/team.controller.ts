import { Response } from 'express';
import { AuthRequest } from '../types';
import prisma from '../config/database';
import { AppError, handleError } from '../utils/errorHandler';
import { z } from 'zod';

export const createTeamSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  memberIds: z.array(z.string()).optional(),
  serviceLineIds: z.array(z.string()).optional(),
  specialtyIds: z.array(z.string()).optional(),
  clientIds: z.array(z.string()).optional(),
});

export const updateTeamSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const addMemberSchema = z.object({
  userId: z.string(),
  role: z.enum(['LEADER', 'MEMBER']).optional(),
});

export const assignServiceLineSchema = z.object({
  serviceLineId: z.string(),
});

export const assignSpecialtySchema = z.object({
  specialtyId: z.string(),
});

export const assignClientSchema = z.object({
  clientId: z.string(),
});

export const createTeam = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, memberIds, serviceLineIds, specialtyIds, clientIds } = req.body;

    const team = await prisma.team.create({
      data: {
        name,
        description,
        members: memberIds ? {
          create: memberIds.map((userId: string) => ({
            userId,
            role: 'MEMBER',
          })),
        } : undefined,
        serviceLines: serviceLineIds ? {
          create: serviceLineIds.map((serviceLineId: string) => ({
            serviceLineId,
          })),
        } : undefined,
        specialties: specialtyIds ? {
          create: specialtyIds.map((specialtyId: string) => ({
            specialtyId,
          })),
        } : undefined,
        clients: clientIds ? {
          create: clientIds.map((clientId: string) => ({
            clientId,
          })),
        } : undefined,
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        serviceLines: {
          include: {
            serviceLine: true,
          },
        },
        specialties: {
          include: {
            specialty: true,
          },
        },
        clients: {
          include: {
            client: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: team,
      message: 'Team created successfully',
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const getAllTeams = async (req: AuthRequest, res: Response) => {
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

    const [teams, total] = await Promise.all([
      prisma.team.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          _count: {
            select: {
              members: true,
              serviceLines: true,
              specialties: true,
              clients: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.team.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        teams,
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

export const getTeamById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                role: true,
              },
            },
          },
        },
        serviceLines: {
          include: {
            serviceLine: true,
          },
        },
        specialties: {
          include: {
            specialty: true,
          },
        },
        clients: {
          include: {
            client: true,
          },
        },
      },
    });

    if (!team) {
      throw new AppError('Team not found', 404);
    }

    res.json({
      success: true,
      data: team,
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const updateTeam = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const team = await prisma.team.update({
      where: { id },
      data: req.body,
    });

    res.json({
      success: true,
      data: team,
      message: 'Team updated successfully',
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return handleError(new AppError('Team not found', 404), res);
    }
    handleError(error, res);
  }
};

export const deleteTeam = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.team.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Team deleted successfully',
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return handleError(new AppError('Team not found', 404), res);
    }
    handleError(error, res);
  }
};

// Team Members Management
export const addTeamMember = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.body;

    const teamMember = await prisma.teamMember.create({
      data: {
        teamId: id,
        userId,
        role: role || 'MEMBER',
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: teamMember,
      message: 'Team member added successfully',
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return handleError(new AppError('User is already a member of this team', 400), res);
    }
    handleError(error, res);
  }
};

export const removeTeamMember = async (req: AuthRequest, res: Response) => {
  try {
    const { id, userId } = req.params;

    await prisma.teamMember.delete({
      where: {
        teamId_userId: {
          teamId: id,
          userId,
        },
      },
    });

    res.json({
      success: true,
      message: 'Team member removed successfully',
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return handleError(new AppError('Team member not found', 404), res);
    }
    handleError(error, res);
  }
};

// Service Lines Management
export const assignServiceLine = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { serviceLineId } = req.body;

    const teamServiceLine = await prisma.teamServiceLine.create({
      data: {
        teamId: id,
        serviceLineId,
      },
      include: {
        serviceLine: true,
      },
    });

    res.status(201).json({
      success: true,
      data: teamServiceLine,
      message: 'Service line assigned successfully',
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return handleError(new AppError('Service line already assigned to this team', 400), res);
    }
    handleError(error, res);
  }
};

export const removeServiceLine = async (req: AuthRequest, res: Response) => {
  try {
    const { id, serviceLineId } = req.params;

    await prisma.teamServiceLine.delete({
      where: {
        teamId_serviceLineId: {
          teamId: id,
          serviceLineId,
        },
      },
    });

    res.json({
      success: true,
      message: 'Service line removed successfully',
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return handleError(new AppError('Service line assignment not found', 404), res);
    }
    handleError(error, res);
  }
};

// Specialties Management
export const assignSpecialty = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { specialtyId } = req.body;

    const teamSpecialty = await prisma.teamSpecialty.create({
      data: {
        teamId: id,
        specialtyId,
      },
      include: {
        specialty: true,
      },
    });

    res.status(201).json({
      success: true,
      data: teamSpecialty,
      message: 'Specialty assigned successfully',
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return handleError(new AppError('Specialty already assigned to this team', 400), res);
    }
    handleError(error, res);
  }
};

export const removeSpecialty = async (req: AuthRequest, res: Response) => {
  try {
    const { id, specialtyId } = req.params;

    await prisma.teamSpecialty.delete({
      where: {
        teamId_specialtyId: {
          teamId: id,
          specialtyId,
        },
      },
    });

    res.json({
      success: true,
      message: 'Specialty removed successfully',
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return handleError(new AppError('Specialty assignment not found', 404), res);
    }
    handleError(error, res);
  }
};

// Clients Management
export const assignClient = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { clientId } = req.body;

    const teamClient = await prisma.teamClient.create({
      data: {
        teamId: id,
        clientId,
      },
      include: {
        client: true,
      },
    });

    res.status(201).json({
      success: true,
      data: teamClient,
      message: 'Client assigned successfully',
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return handleError(new AppError('Client already assigned to this team', 400), res);
    }
    handleError(error, res);
  }
};

export const removeClient = async (req: AuthRequest, res: Response) => {
  try {
    const { id, clientId } = req.params;

    await prisma.teamClient.delete({
      where: {
        teamId_clientId: {
          teamId: id,
          clientId,
        },
      },
    });

    res.json({
      success: true,
      message: 'Client removed successfully',
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return handleError(new AppError('Client assignment not found', 404), res);
    }
    handleError(error, res);
  }
};
