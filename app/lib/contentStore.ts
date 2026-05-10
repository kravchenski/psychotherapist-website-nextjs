import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import homeContent from "@/content/home.json";
import type { HomeContent } from "@/app/types/content";
import { ensurePrismaTables, getPrismaClient } from "./prisma";

const HOME_CONTENT_KEY = "home";
const fallbackContent = homeContent as HomeContent;

function isTimelineItem(value: unknown): value is HomeContent["about"]["timeline"][number] {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.year === "string" &&
    (item.title === undefined || typeof item.title === "string") &&
    (item.institution === undefined || typeof item.institution === "string") &&
    (item.courses === undefined ||
      (Array.isArray(item.courses) && item.courses.every((course) => typeof course === "string")))
  );
}

export function isHomeContent(value: unknown): value is HomeContent {
  if (!value || typeof value !== "object") {
    return false;
  }

  const content = value as Record<string, unknown>;
  const hero = content.hero as Record<string, unknown> | undefined;
  const about = content.about as Record<string, unknown> | undefined;
  const services = content.services as Record<string, unknown> | undefined;
  const contacts = content.contacts as Record<string, unknown> | undefined;

  return Boolean(
    hero &&
      about &&
      services &&
      contacts &&
      typeof hero.title === "string" &&
      typeof hero.description === "string" &&
      typeof hero.primaryButtonText === "string" &&
      typeof hero.secondaryButtonText === "string" &&
      (hero.photoUrl === undefined || typeof hero.photoUrl === "string") &&
      typeof about.label === "string" &&
      typeof about.heading === "string" &&
      typeof about.intro === "string" &&
      typeof about.description === "string" &&
      (about.photoUrl === undefined || typeof about.photoUrl === "string") &&
      Array.isArray(about.timeline) &&
      about.timeline.every(isTimelineItem) &&
      typeof services.label === "string" &&
      typeof services.description === "string" &&
      typeof services.highlight === "string" &&
      typeof services.cardTitle === "string" &&
      typeof services.cardDescription === "string" &&
      typeof services.buttonText === "string" &&
      Array.isArray(services.items) &&
      services.items.every((item) => typeof item === "string") &&
      typeof contacts.label === "string" &&
      typeof contacts.description === "string" &&
      typeof contacts.phoneLabel === "string" &&
      typeof contacts.phoneValue === "string" &&
      typeof contacts.hoursLabel === "string" &&
      typeof contacts.hoursValue === "string" &&
      (contacts.hoursSubValue === undefined || typeof contacts.hoursSubValue === "string"),
  );
}

function toJsonContent(content: HomeContent): Prisma.InputJsonValue {
  return content as Prisma.InputJsonValue;
}

function isPrismaConnectionError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientUnknownRequestError
  );
}

function isPrismaMissingTableError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2021"
  );
}

async function upsertHomeContentRecord(
  data: Prisma.InputJsonValue,
  shouldUpdate: boolean,
) {
  const prisma = getPrismaClient();
  if (!prisma) {
    return null;
  }

  try {
    return await prisma.siteContent.upsert({
      where: { key: HOME_CONTENT_KEY },
      update: shouldUpdate ? { data } : {},
      create: {
        key: HOME_CONTENT_KEY,
        data,
      },
    });
  } catch (error) {
    if (isPrismaMissingTableError(error)) {
      await ensurePrismaTables(prisma);

      return prisma.siteContent.upsert({
        where: { key: HOME_CONTENT_KEY },
        update: shouldUpdate ? { data } : {},
        create: {
          key: HOME_CONTENT_KEY,
          data,
        },
      });
    }

    throw error;
  }
}

export async function getHomeContent(): Promise<HomeContent> {
  if (!getPrismaClient()) {
    return fallbackContent;
  }

  try {
    const record = await upsertHomeContentRecord(toJsonContent(fallbackContent), false);
    if (!record) {
      return fallbackContent;
    }

    if (isHomeContent(record.data)) {
      return record.data;
    }
  } catch (error) {
    if (isPrismaConnectionError(error)) {
      console.warn("Database is unavailable, using fallback home content.");
      return fallbackContent;
    }

    throw error;
  }

  return fallbackContent;
}

export async function saveHomeContent(content: HomeContent) {
  if (!getPrismaClient()) {
    throw new Error("Database URL is not configured");
  }

  let saved;

  try {
    saved = await upsertHomeContentRecord(toJsonContent(content), true);
  } catch (error) {
    if (isPrismaConnectionError(error)) {
      throw new Error("Database is unavailable");
    }

    throw error;
  }

  revalidatePath("/");

  return saved?.data as HomeContent;
}
