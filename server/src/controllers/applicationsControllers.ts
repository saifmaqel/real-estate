import type { Request, Response } from "express";
import { ApplicationStatus, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getApplecations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, userType } = req.query;

    let whereClause = {};

    if (userId && userType) {
      if (userType === "tenant") {
        whereClause = { tenantCognitoId: String(userId) };
      } else if (userType === "manager") {
        whereClause = {
          property: {
            managerCognitoId: String(userId),
          },
        };
      }
    }

    const applications = await prisma.application.findMany({
      where: whereClause,
      include: {
        tenant: true,
        property: {
          include: {
            location: true,
            manager: true,
          },
        },
      },
    });

    function calculateNextPaymentDate(startDate: Date): Date {
      const today = new Date();
      const nextPaymentDate = new Date(startDate);
      while (nextPaymentDate <= today) {
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
      }
      return nextPaymentDate;
    }

    const formattedApplications = await Promise.all(
      applications.map(async (app) => {
        const lease = await prisma.lease.findFirst({
          where: {
            tenant: {
              cognitoId: app.tenantCognitoId,
            },
            propertyId: app.propertyId,
          },
          orderBy: { startDate: "desc" },
        });
        return {
          ...app,
          property: {
            ...app.property,
            address: app.property.location.address,
          },
          manager: app.property.manager,
          lease: lease
            ? {
                ...lease,
                nextpaymentDate: calculateNextPaymentDate(lease.startDate),
              }
            : null,
        };
      })
    );

    res.json(formattedApplications);
  } catch (error) {
    res.status(500).json({ message: `Error retieving applications: ${error}` });
  }
};

export const createApplication = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      applicationDate,
      status,
      propertyId,
      tenantCognitoId,
      name,
      email,
      phoneNumber,
      message,
    } = req.params;

    if (
      !propertyId ||
      !tenantCognitoId ||
      !applicationDate ||
      !status ||
      !name ||
      !email ||
      !phoneNumber ||
      !message
    ) {
      res.status(400).json({ message: `Missing Inputs` });
      return;
    }

    const property = await prisma.property.findUnique({
      where: {
        id: Number(propertyId),
      },
      select: {
        pricePerMonth: true,
        securityDeposit: true,
      },
    });

    if (!property) {
      res.status(400).json({ message: `Missing property id` });
      return;
    }

    const newApplication = await prisma.$transaction(async (prisma) => {
      // create lease first
      const newLease = await prisma.lease.create({
        data: {
          startDate: new Date(),
          endDate: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          ),
          rent: property.pricePerMonth,
          deposit: property.securityDeposit,
          tenant: {
            connect: {
              cognitoId: tenantCognitoId,
            },
          },
          property: {
            connect: {
              id: Number(propertyId),
            },
          },
        },
      });

      // then create the applecation with lease connection
      const newApplication = await prisma.application.create({
        data: {
          applicationDate: new Date(applicationDate),
          status: status as ApplicationStatus,
          name,
          email,
          phoneNumber,
          message,
          property: {
            connect: {
              id: Number(propertyId),
            },
          },
          tenant: {
            connect: {
              cognitoId: tenantCognitoId,
            },
          },
          lease: {
            connect: {
              id: newLease.id,
            },
          },
        },
        include: {
          property: true,
          tenant: true,
          lease: true,
        },
      });
      return newApplication;
    });
    res.status(201).json(newApplication);
  } catch (error) {
    res.status(500).json({ message: `Error creating application: ${error}` });
  }
};

export const updateApplicationStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (
      status !== ApplicationStatus.Approved &&
      status !== ApplicationStatus.Denied &&
      status !== ApplicationStatus.Pending
    ) {
      res.status(400).json({ message: "Invalid status" });
      return;
    }

    const application = await prisma.application.findUnique({
      where: {
        id: Number(id),
      },
      include: { property: true, tenant: true },
    });

    if (!application) {
      res.status(404).json({ message: "Application not found" });
      return;
    }

    if (status === ApplicationStatus.Approved) {
      const updatedApplication = await prisma.$transaction(async (tx) => {
        const newLease = await tx.lease.create({
          data: {
            startDate: new Date(),
            endDate: new Date(
              new Date().setFullYear(new Date().getFullYear() + 1)
            ),
            rent: application.property.pricePerMonth,
            deposit: application.property.securityDeposit,
            tenant: {
              connect: {
                cognitoId: application.tenant.cognitoId,
              },
            },
            property: {
              connect: {
                id: application.property.id,
              },
            },
          },
        });

        await tx.property.update({
          where: {
            id: application.propertyId,
          },
          data: {
            tenants: {
              connect: {
                cognitoId: application.tenant.cognitoId,
              },
            },
          },
        });

        return tx.application.update({
          where: {
            id: Number(id),
          },
          data: {
            status,
            leaseId: newLease.id,
          },
        });
      });
    } else if (status === ApplicationStatus.Denied) {
      // update the application
      await prisma.application.update({
        where: {
          id: Number(id),
        },
        data: { status },
      });
    }
    const updatedApplication = await prisma.application.findUnique({
      where: {
        id: Number(id),
      },
      include: { property: true, tenant: true, lease: true },
    });
    res.json(updatedApplication);
    // res.json(payments);
  } catch (error) {
    res.status(500).json({ message: `Error updating application: ${error}` });
  }
};
