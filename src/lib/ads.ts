import fs from "fs";
import path from "path";

export interface AdSettings {
  directLinkUrl: string;
  requiredClicks: number;
  bannerCode: string;
  isEnabled: boolean;
}

const DEFAULT_SETTINGS: AdSettings = {
  directLinkUrl: "https://consciousdunkvastly.com/vkcab8pm?key=2d7f9ab1644671035abd720ada6bab69",
  requiredClicks: 3,
  bannerCode: "",
  isEnabled: true,
};

const SETTINGS_FILE = path.join(process.cwd(), "adSettings.json");

export function getAdSettings(): AdSettings {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = fs.readFileSync(SETTINGS_FILE, "utf8");
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    }
  } catch (error) {
    console.error("Failed to read adSettings.json, using defaults:", error);
  }
  return DEFAULT_SETTINGS;
}

export function saveAdSettings(settings: Partial<AdSettings>): AdSettings {
  try {
    const current = getAdSettings();
    const updated = { ...current, ...settings };
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), "utf8");
    return updated;
  } catch (error) {
    console.error("Failed to write adSettings.json:", error);
    return DEFAULT_SETTINGS;
  }
}
