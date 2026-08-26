import type { Timestamp } from "@firebase/firestore";
import type { ProfileDateOfBirth, UserMode } from "../types/profile";

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

export function formatDateOfBirth(dateOfBirth?: ProfileDateOfBirth) {
  if (!dateOfBirth) {
    return "Not set";
  }

  const month = monthNames[dateOfBirth.month - 1] ?? "";

  return `${dateOfBirth.day} ${month} ${dateOfBirth.year}`;
}

export function formatProfileTimestamp(value: Timestamp | Date | null) {
  if (!value) {
    return "Not available";
  }

  const date = value instanceof Date ? value : value.toDate();

  return new Intl.DateTimeFormat("en", {
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
