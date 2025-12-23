import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getLeases = async (req: Request, res: Response): Promise<void> => {
  try {
    const leases = await prisma.lease.findMany({
      include: {
        tenant: true,
        property: true,
      },
    });

    if (!leases) {
      res.status(404).json({ message: `Can not finde leases` });
      return;
    }

    res.json(leases);
  } catch (error) {
    res.status(500).json({ message: `Error retieving leases: ${error}` });
  }
};

export const getLeasePayments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: `Missing lease id` });
      return;
    }

    const payments = await prisma.payment.findMany({
      where: { leaseId: Number(id) },
    });

    if (!payments) {
      res.status(404).json({ message: `Can not finde payments` });
      return;
    }

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: `Error retieving leases: ${error}` });
  }
};
