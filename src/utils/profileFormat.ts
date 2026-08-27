import type { Timestamp } from "@firebase/firestore";
import type { AppLanguage, ProfileDateOfBirth, UserMode } from "../types/profile";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

function getLocale(language: AppLanguage = "en") {
  return language === "my" ? "my-MM" : "en";
}

export function formatDateOfBirth(dateOfBirth?: ProfileDateOfBirth, language: AppLanguage = "en") {
  if (!dateOfBirth) {
    return "Not set";
  }

  const date = new Date(dateOfBirth.year, dateOfBirth.month - 1, dateOfBirth.day);

  if (Number.isNaN(date.getTime())) {
    const month = monthNames[dateOfBirth.month - 1] ?? "";

    return `${dateOfBirth.day} ${month} ${dateOfBirth.year}`;
  }

  return new Intl.DateTimeFormat(getLocale(language), {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
}

export function formatProfileTimestamp(value: Timestamp | Date | null, language: AppLanguage = "en") {
  if (!value) {
    return "Not available";
  }

  const date = value instanceof Date ? value : value.toDate();

  return new Intl.DateTimeFormat(getLocale(language), {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
}

export function formatMode(mode: UserMode) {
  return mode === "GOAL" ? "I know my goal" : "I am still exploring";
}

export function formatGender(gender?: string) {
  if (!gender) {
    return "Not set";
  }

  return gender[0].toUpperCase() + gender.slice(1);
}
