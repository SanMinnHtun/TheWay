import type { ExplorationQuizSubmission } from "../data/explorationQuiz";

const model1Endpoint = import.meta.env.VITE_QUIZ_API_URL
  ? `${import.meta.env.VITE_QUIZ_API_URL.replace(/\/$/, "")}/quiz/submit`
  : "/api/model1/submit";

const zodiacGroups: Record<string, string> = {
  aries: "Aries / Taurus / Gemini",
  taurus: "Aries / Taurus / Gemini",
  gemini: "Aries / Taurus / Gemini",
  cancer: "Cancer / Leo / Virgo",
  leo: "Cancer / Leo / Virgo",
  virgo: "Cancer / Leo / Virgo",
  libra: "Libra / Scorpio / Sagittarius",
  scorpio: "Libra / Scorpio / Sagittarius",
  sagittarius: "Libra / Scorpio / Sagittarius",
  capricorn: "Capricorn / Aquarius / Pisces",
  aquarius: "Capricorn / Aquarius / Pisces",
  pisces: "Capricorn / Aquarius / Pisces"
};

const acceptedMbtiOptions = new Set([
  "Analyst (INTJ, INTP, ENTJ, ENTP)",
  "Diplomat (INFJ, INFP, ENFJ, ENFP)",
  "Sentinel (ISTJ, ISFJ, ESTJ, ESFJ)",
  "Explorer (ISTP, ISFP, ESTP, ESFP)",
  "Unknown / Skip"
]);

const energyUiOptions = [
  "Deep Focus - Prefer working alone in a quiet, focused environment",
  "Team Energy - Prefer discussing, collaborating, and brainstorming with peers",
  "Flexible - Adaptable to both solo tasks and team collaboration",
  "Leader Vibe - Prefer guiding the vision, organizing, and leading",
  "Hands-on - Prefer experimenting and building directly over reading theory"
];

const personalityUiOptions = [
  "Introvert - Recharges alone; prefers quiet focus",
  "Extrovert - Recharges around people; thrives in social settings",
  "Ambivert - Balanced between alone time and social interaction",
  "Selective Introvert - Social with a close circle of trusted friends",
  "Social Butterfly - Effortlessly connects and chats with anyone"
];

// The current backend validates these two fields against its Myanmar question
// option strings. Keep this mapping at the API boundary; the quiz UI stays English/Myanmar.
const energyOptions = [
  "Deep Focus - တစ်ယောက်တည်း အေးဆေး အာရုံစိုက်ပြီး လုပ်ရတာ ပိုကြိုက်တယ်",
  "Team Energy - သူငယ်ချင်းတွေနဲ့ စကားပြော၊ တိုင်ပင်ပြီး လုပ်ရတာ ပိုကြိုက်တယ်",
  "Flexible - အခြေအနေပေါ်မူတည်ပြီး တစ်ယောက်တည်းရော အဖွဲ့လိုက်ရော ရတယ်",
  "Leader Vibe - အစီအစဉ်ဆွဲပေးပြီး အဖွဲ့ကို ဦးဆောင်ရတာ ပိုကြိုက်တယ်",
  "Hands-on - စာတွေဖတ်နေတာထက် ကိုယ်တိုင် လက်နဲ့ ထိတွေ့စမ်းသပ်ရတာ ကြိုက်တယ်"
];

const personalityOptions = [
  "Introvert - တစ်ယောက်တည်း အေးဆေး နေရတာ ပိုကြိုက်တယ် (Social Battery မြန်မြန်ကုန်တယ်)",
  "Extrovert - လူအများကြီးနဲ့ ပျော်ပျော်ပါးပါး စကားပြောရတာ အားပြည့်တယ်",
  "Ambivert - အခြေအနေပေါ်မူတည်ပြီး တစ်ယောက်တည်းရော အဖွဲ့လိုက်ရော အဆင်ပြေတယ်",
  "Selective Introvert - ကိုယ်ခင်တဲ့ သူငယ်ချင်း အနည်းစုနဲ့ပဲ ပျော်ပျော်ပါးပါး နေတတ်တယ်",
  "Social Butterfly - ဘယ်သူနဲ့မဆို ခွေခွေခေါက်ခေါက် ခင်းမင်လွယ်တယ်"
];

function optionIndex(value: string, options: string[], field: string): number {
  const normalized = value.trim().toLocaleLowerCase();
  const index = options.findIndex((option) => option.toLocaleLowerCase() === normalized);
  if (index < 0) throw new Error(`exploration-quiz-invalid-${field}`);
  return index;
}

export function transformExplorationSubmission(payload: ExplorationQuizSubmission): ExplorationQuizSubmission {
  const zodiac = payload.zodiac.trim();
  const groupedZodiac = zodiacGroups[zodiac.toLocaleLowerCase()]
    ?? (zodiac.toLocaleLowerCase() === "other / skip" ? "Other / Skip" : zodiac);

  if (!new Set([
    "Aries / Taurus / Gemini",
    "Cancer / Leo / Virgo",
    "Libra / Scorpio / Sagittarius",
    "Capricorn / Aquarius / Pisces",
    "Other / Skip"
  ]).has(groupedZodiac)) {
    throw new Error("exploration-quiz-invalid-zodiac");
  }

  if (!acceptedMbtiOptions.has(payload.mbti)) {
    throw new Error("exploration-quiz-invalid-mbti");
  }
  const energyIndex = optionIndex(payload.energy, energyUiOptions, "energy");
  const personalityIndex = optionIndex(payload.personality_type, personalityUiOptions, "personality-type");

  if (
    payload.role_choices.length !== 7 ||
    payload.role_choices.some((choice) => !Number.isInteger(choice) || choice < 0 || choice > 4)
  ) {
    throw new Error("exploration-quiz-invalid-role-choices");
  }

  return {
    zodiac: groupedZodiac,
    mbti: payload.mbti,
    energy: energyOptions[energyIndex],
    personality_type: personalityOptions[personalityIndex],
    role_choices: [...payload.role_choices]
  };
}

export async function submitExplorationQuiz(payload: ExplorationQuizSubmission): Promise<unknown> {
  const transformedPayload = transformExplorationSubmission(payload);
  const response = await fetch(model1Endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(transformedPayload)
  });

  if (!response.ok) {
    let detail: unknown;
    const errorResponse = response.clone();
    try {
      detail = await response.json();
    } catch {
      detail = await errorResponse.text().catch(() => "<response body unavailable>");
    }
    console.error("Exploration quiz submission failed", {
      status: response.status,
      statusText: response.statusText,
      detail,
      payload: transformedPayload
    });
    throw new Error(`exploration-quiz-submit-failed:${response.status}`);
  }

  const responseText = await response.text();
  if (!responseText.trim()) return null;

  try {
    return JSON.parse(responseText) as unknown;
  } catch {
    return responseText;
  }
}
