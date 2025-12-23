import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTenant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cognitoId } = req.params;

    if (!cognitoId) {
      res.status(400).json({ error: "Missing cognitoId" });
      return;
    }

    const tenant = await prisma.tenant.findUnique({
      where: { cognitoId: cognitoId },
      include: {
        favorites: true,
      },
    });

    if (tenant) {
      res.json(tenant);
    } else {
      res.status(404).json({ message: "Tenant not found" });
    }
  } catch (error) {
    res.status(500).json({ message: `Error retieving tenant: ${error}` });
  }
};

export const createTenant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId, name, email, phoneNumber } = req.body;

    if (!cognitoId || !name || !email || !phoneNumber) {
      res.status(400).json({ error: "Missing Inputs" });
      return;
    }

    const tenant = await prisma.tenant.create({
      data: { cognitoId, name, email, phoneNumber },
    });

    res.status(201).json(tenant);
  } catch (error) {
    res.status(500).json({ message: `Error creating tenant: ${error}` });
  }
};

export const updateTenant = async (req: Request, res: Response) => {
  try {
    const { cognitoId } = req.params;
    const { name, email, phoneNumber } = req.body;

    if (!cognitoId || !name || !email || !phoneNumber) {
      res.status(400).json({ error: "Missing Inputs" });
      return;
    }

    const tenant = await prisma.tenant.update({
      where: { cognitoId: cognitoId },
      data: {
        name,
        email,
        phoneNumber,
      },
    });

    res.json(tenant);
  } catch (error) {
    res.status(500).json({
      message: `Error updating tenant ${
        error instanceof Error ? error.message : "Unknown Error"
      }`,
    });
  }
};
