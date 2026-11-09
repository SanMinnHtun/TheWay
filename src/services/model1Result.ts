type DataRecord = Record<string, unknown>;

export interface Model1RoleMatch {
  role: string;
  percentage: number;
}

function isRecord(value: unknown): value is DataRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function findField(record: DataRecord, aliases: string[]) {
  const normalizedAliases = aliases.map(normalizeKey);
  const key = Object.keys(record).find((candidate) => normalizedAliases.includes(normalizeKey(candidate)));
  return key ? record[key] : undefined;
}

function unwrapResult(value: unknown): unknown {
  if (!isRecord(value)) return value;

  for (const envelope of ["result", "results", "assessment", "assessment_result", "data"]) {
    const nested = findField(value, [envelope]);
    if (isRecord(nested) || Array.isArray(nested)) return unwrapResult(nested);
  }

  return value;
}

function readRoleMatch(value: unknown): Model1RoleMatch | null {
  if (!isRecord(value)) return null;
  const role = findField(value, ["role", "career", "name", "path", "field"]);
  const rawPercentage = findField(value, ["percentage", "score", "match", "fit"]);
  const parsedPercentage = typeof rawPercentage === "number"
    ? rawPercentage
    : typeof rawPercentage === "string"
      ? Number(rawPercentage.trim().replace("%", ""))
      : Number(rawPercentage);

  if (typeof role !== "string" || !Number.isFinite(parsedPercentage)) return null;
  const percentage = parsedPercentage <= 1 ? parsedPercentage * 100 : parsedPercentage;
  return { role, percentage: Math.max(0, Math.min(100, percentage)) };
}

/** Extract the backend's ranked Model 1 matches without inventing local scores. */
export function getModel1RoleMatches(value: unknown): { primary: Model1RoleMatch | null; matches: Model1RoleMatch[] } {
  const data = unwrapResult(value);
  if (!isRecord(data)) return { primary: null, matches: [] };

  const primary = readRoleMatch(findField(data, ["primary_recommendation", "primaryRecommendation", "top_match"]));
  const runnerUp = readRoleMatch(findField(data, ["runner_up", "runnerUp", "second_recommendation"]));
  const all = findField(data, ["all_role_percentages", "allRolePercentages", "role_percentages", "career_matches"]);
  const matches: Model1RoleMatch[] = Array.isArray(all)
    ? all.map(readRoleMatch).filter((match): match is Model1RoleMatch => match !== null)
    : isRecord(all)
      ? Object.entries(all).flatMap(([role, percentage]) => {
          const match = readRoleMatch({ role, percentage });
          return match ? [match] : [];
        })
      : [];

  for (const fallback of [primary, runnerUp]) {
    if (fallback && !matches.some((match) => normalizeKey(match.role) === normalizeKey(fallback.role))) {
      matches.push(fallback);
    }
  }

  const uniqueMatches = new Map<string, Model1RoleMatch>();
  for (const match of matches) {
    const key = normalizeKey(match.role);
    const existing = uniqueMatches.get(key);
    if (!existing || match.percentage > existing.percentage) uniqueMatches.set(key, match);
  }

  const ranked = [...uniqueMatches.values()].sort((a, b) => b.percentage - a.percentage);
  return { primary: primary ?? ranked[0] ?? null, matches: ranked };
}
