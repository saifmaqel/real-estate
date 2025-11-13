import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getManager = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId } = req.params;

    if (!cognitoId) {
      res.status(400).json({ error: "Missing cognitoId" });
      return;
    }

    const manager = await prisma.manager.findUnique({
      where: { cognitoId: cognitoId },
    });
    if (manager) {
      res.json(manager);
    } else {
      res.status(400).json({ message: "Manager not found" });
    }
  } catch (error) {
    res.status(500).json({ message: `Error retieving manager: ${error}` });
  }
};

export const createManager = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId, name, email, phoneNumber } = req.body;

    if (!cognitoId || !name || !email || !phoneNumber) {
      res.status(400).json({ error: "Missing Inputs" });
      return;
    }

    const manager = await prisma.manager.create({
      data: { cognitoId, name, email, phoneNumber },
    });

    res.status(201).json(manager);
  } catch (error) {
    res.status(500).json({ message: `Error creating manager: ${error}` });
  }
};

export const updateManager = async (req: Request, res: Response) => {
  try {
    const { cognitoId } = req.params;
    const { name, email, phoneNumber } = req.body;

    if (!cognitoId || !name || !email || !phoneNumber) {
      res.status(400).json({ error: "Missing Inputs" });
      return;
    }

    const manager = await prisma.manager.update({
      where: { cognitoId: cognitoId },
      data: {
        name,
        email,
        phoneNumber,
      },
    });

    res.json(manager);
  } catch (error) {
    res.status(500).json({
      message: `Error updating manager ${
        error instanceof Error ? error.message : "Unknown Error"
      }`,
    });
  }
};
