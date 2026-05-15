import { promises as fs } from "node:fs";
import path from "node:path";
import { revalidatePath } from "next/cache";
import homeContent from "@/content/home.json";
import type { HomeContent } from "@/app/types/content";

const fallbackContent = homeContent as HomeContent;
const contentFilePath = path.join(process.cwd(), "content", "home.json");

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

export async function getHomeContent(): Promise<HomeContent> {
  try {
    const rawContent = await fs.readFile(contentFilePath, "utf8");
    const content = JSON.parse(rawContent) as unknown;

    if (isHomeContent(content)) {
      return content;
    }
  } catch (error) {
    console.warn("Content file is unavailable or invalid, using fallback home content.", error);
  }

  return fallbackContent;
}

export async function saveHomeContent(content: HomeContent) {
  await fs.mkdir(path.dirname(contentFilePath), { recursive: true });
  await fs.writeFile(contentFilePath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
  revalidatePath("/");

  return content;
}
