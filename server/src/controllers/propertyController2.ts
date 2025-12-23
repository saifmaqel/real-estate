import { Prisma, PropertyType } from "@prisma/client";
import { PrismaClient } from "@prisma/client/extension";
import type { Request, Response } from "express";

const prisma = new PrismaClient();

const getProperties = (req: Request, res: Response) => {
  const {
    favoriteIds,
    priceMin,
    priceMax,
    beds,
    baths,
    propertyType,
    squareFeetMin,
    squareFeetMax,
    amenities,
    availableFrom,
    latitude,
    longitude,
  } = req.query;

  const whereConditions = [];

  if (favoriteIds) {
    const favoriteIdsArray = (favoriteIds as string).split(",").map(Number);

    whereConditions.push(
      Prisma.sql`p.id IN (${Prisma.join(favoriteIdsArray)})`
    );
  }

  if (priceMin) {
    whereConditions.push(Prisma.sql`p."pricePerMonth" >= ${Number(priceMin)}`);
  }

  if (priceMax) {
    whereConditions.push(Prisma.sql`p."pricePerMonth"<=${Number(priceMax)}`);
  }

  if (beds && beds !== "any") {
    whereConditions.push(Prisma.sql`p.beds >= ${Number(beds)}`);
  }

  if (baths && baths !== "any") {
    whereConditions.push(Prisma.sql`p.baths >= ${Number(baths)}`);
  }

  if (squareFeetMin) {
    whereConditions.push(
      Prisma.sql`p."squareFeet" >= ${Number(squareFeetMin)}`
    );
  }

  if (squareFeetMax) {
    whereConditions.push(
      Prisma.sql`p."squareFeet" <= ${Number(squareFeetMax)}`
    );
  }

  if (propertyType && propertyType !== "any") {
    whereConditions.push(
      Prisma.sql`p."propertyType" = ${propertyType}::"PropertyType"`
    );
  }

  if (amenities) {
    const amenitiesArray = (amenities as string).split(",");
    whereConditions.push(Prisma.sql`p.amenities @> ${amenitiesArray}`);
  }

  if (availableFrom && availableFrom !== "any") {
    if (typeof availableFrom === "string") {
      const date = new Date(availableFrom);
      if (!isNaN(date.getTime())) {
        whereConditions.push(
          Prisma.sql`EXISTS(
           SELECT 1 FROM "Lease" l 
           WHERE l."propertyId" = p.id AND l."startDate" <= ${date.toISOString()})`
        );
      }
    }
  }
};
