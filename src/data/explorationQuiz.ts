export interface ExplorationQuestion {
  id: number;
  field: "zodiac" | "mbti" | "energy" | "personality_type" | "role_choices";
  prompt: string;
  myPrompt: string;
  options: string[];
  myOptions: string[];
}

export const roleChoiceScoringChannels = [
  "Software Engineering / Backend Development",
  "UI/UX Design & Frontend Engineering",
  "Data Science, AI & Knowledge Engineering",
  "Cybersecurity & Quality Assurance",
  "Cloud Engineering, DevOps & Systems/IoT Architecture"
] as const;

function question(
  id: number,
  field: ExplorationQuestion["field"],
  prompt: string,
  myPrompt: string,
  optionPairs: Array<[string, string]>
): ExplorationQuestion {
  return {
    id,
    field,
    prompt,
    myPrompt,
    options: optionPairs.map(([english]) => english),
    myOptions: optionPairs.map(([, myanmar]) => myanmar)
  };
}

export const explorationQuestions: ExplorationQuestion[] = [
  question(1, "zodiac", "Select your Zodiac sign:", "သင့်ရာသီခွင်ကို ရွေးပါ။", [
    ["Aries", "မိဿရာသီ"],
    ["Taurus", "ပြိဿရာသီ"],
    ["Gemini", "မေထုန်ရာသီ"],
    ["Cancer", "ကရကဋ်ရာသီ"],
    ["Leo", "သိဟ်ရာသီ"],
    ["Virgo", "ကန်ရာသီ"],
    ["Libra", "တူရာသီ"],
    ["Scorpio", "ဗြိစ္ဆာရာသီ"],
    ["Sagittarius", "ဓနုရာသီ"],
    ["Capricorn", "မကာရရာသီ"],
    ["Aquarius", "ကုမ်ရာသီ"],
    ["Pisces", "မိန်ရာသီ"]
  ]),
  question(2, "mbti", "Select your MBTI personality group:", "သင့် MBTI ကိုယ်ရည်ကိုယ်သွေးအုပ်စုကို ရွေးပါ။", [
    ["Analyst (INTJ, INTP, ENTJ, ENTP)", "ခွဲခြမ်းစိတ်ဖြာသူ (INTJ, INTP, ENTJ, ENTP)"],
    ["Diplomat (INFJ, INFP, ENFJ, ENFP)", "ညှိနှိုင်းဆက်ဆံသူ (INFJ, INFP, ENFJ, ENFP)"],
    ["Sentinel (ISTJ, ISFJ, ESTJ, ESFJ)", "စနစ်တကျ လုပ်ဆောင်သူ (ISTJ, ISFJ, ESTJ, ESFJ)"],
    ["Explorer (ISTP, ISFP, ESTP, ESFP)", "စူးစမ်းလေ့လာသူ (ISTP, ISFP, ESTP, ESFP)"],
    ["Unknown / Skip", "မသိပါ / ကျော်ရန်"]
  ]),
  question(3, "energy", "What is your primary source of energy?", "သင့်အားအင်ကို အဓိကဖြစ်စေသည့်အရာက ဘာလဲ။", [
    ["Deep Focus - Prefer working alone in a quiet, focused environment", "အာရုံစူးစိုက်မှု - တိတ်ဆိတ်ပြီး အာရုံစိုက်နိုင်သောနေရာတွင် တစ်ယောက်တည်းလုပ်ရတာကို နှစ်သက်သည်"],
    ["Team Energy - Prefer discussing, collaborating, and brainstorming with peers", "အဖွဲ့လိုက်အားအင် - အဖွဲ့ဝင်များနှင့် ဆွေးနွေး၊ ပူးပေါင်း၊ အကြံဖလှယ်ရတာကို နှစ်သက်သည်"],
    ["Flexible - Adaptable to both solo tasks and team collaboration", "လိုက်လျောညီထွေရှိမှု - တစ်ယောက်တည်းလုပ်ခြင်းနှင့် အဖွဲ့လိုက်လုပ်ခြင်း နှစ်မျိုးလုံးကို လိုက်လျောညီထွေ လုပ်နိုင်သည်"],
    ["Leader Vibe - Prefer guiding the vision, organizing, and leading", "ခေါင်းဆောင်မှုပုံစံ - ရည်မှန်းချက်ချမှတ်ခြင်း၊ စီစဉ်ခြင်းနှင့် ဦးဆောင်ခြင်းကို နှစ်သက်သည်"],
    ["Hands-on - Prefer experimenting and building directly over reading theory", "လက်တွေ့လုပ်ဆောင်မှု - သီအိုရီဖတ်ခြင်းထက် စမ်းသပ်ခြင်းနှင့် တိုက်ရိုက်တည်ဆောက်ခြင်းကို နှစ်သက်သည်"]
  ]),
  question(4, "personality_type", "How would you best describe your social personality?", "သင့်လူမှုဆက်ဆံရေးပုံစံကို ဘယ်လိုဖော်ပြမလဲ။", [
    ["Introvert - Recharges alone; prefers quiet focus", "Introvert - တစ်ယောက်တည်းနေချိန်တွင် အားပြန်ပြည့်ပြီး တိတ်ဆိတ်စွာ အာရုံစိုက်ရတာကို နှစ်သက်သည်"],
    ["Extrovert - Recharges around people; thrives in social settings", "Extrovert - လူများနှင့်အတူရှိချိန်တွင် အားပြန်ပြည့်ပြီး လူမှုဆက်ဆံရေးတွင် တက်ကြွသည်"],
    ["Ambivert - Balanced between alone time and social interaction", "Ambivert - တစ်ယောက်တည်းနေချိန်နှင့် လူမှုဆက်ဆံရေးကြား မျှတစွာ နေထိုင်သည်"],
    ["Selective Introvert - Social with a close circle of trusted friends", "ရွေးချယ်ပေါင်းသင်းသူ - ယုံကြည်ရသော ရင်းနှီးသူအနည်းငယ်နှင့်သာ ပေါင်းသင်းရတာကို နှစ်သက်သည်"],
    ["Social Butterfly - Effortlessly connects and chats with anyone", "လူမှုဆက်ဆံရေးကောင်းသူ - မည်သူနှင့်မဆို အလွယ်တကူ ရင်းနှီးစွာ စကားပြောနိုင်သည်"]
  ]),
  question(5, "role_choices", "When you are hanging out with friends or working on a group task, what role do you naturally fall into?", "သူငယ်ချင်းများနှင့် အတူရှိချိန် သို့မဟုတ် အဖွဲ့လိုက်လုပ်ငန်းလုပ်ချိန်တွင် သင်က သဘာဝအတိုင်း ဘယ်အခန်းကဏ္ဍကို ယူတတ်သလဲ။", [
    ["Organizes everything, keeps track of time, and assigns roles.", "အရာအားလုံးကို စီစဉ်ပြီး အချိန်ကိုကြည့်ကာ တာဝန်များကို ခွဲဝေပေးသည်။"],
    ["Focuses on how things look, colors, and overall visual vibe.", "ပုံစံ၊ အရောင်နှင့် အမြင်ပိုင်းဆိုင်ရာခံစားမှုကို အာရုံစိုက်သည်။"],
    ["Researches all options, looks at reviews, and digs into details.", "ရွေးချယ်စရာများကို ရှာဖွေလေ့လာပြီး သုံးသပ်ချက်များနှင့် အသေးစိတ်များကို စစ်ဆေးသည်။"],
    ["Solves practical problems quietly on the spot when things break.", "တစ်ခုခုပျက်သွားလျှင် လက်တွေ့ပြဿနာကို တိတ်တဆိတ် ချက်ချင်းဖြေရှင်းပေးသည်။"],
    ["Guides the technical setup or handles mechanical/equipment tools.", "နည်းပညာပိုင်း တပ်ဆင်မှုကို ဦးဆောင်ခြင်း သို့မဟုတ် စက်ပစ္စည်းကိရိယာများကို ကိုင်တွယ်သည်။"]
  ]),
  question(6, "role_choices", "If you are starting a new physical build or creative project, what is your go-to style?", "ပစ္စည်းတစ်ခု တည်ဆောက်ခြင်း သို့မဟုတ် ဖန်တီးမှု project အသစ်စတင်ချိန်တွင် သင့်လုပ်ဆောင်ပုံက ဘယ်လိုလဲ။", [
    ["Jump straight into putting parts together to see fast progress.", "မြန်မြန်တိုးတက်မှုမြင်ရရန် အစိတ်အပိုင်းများကို ချက်ချင်းစတင်တပ်ဆင်သည်။"],
    ["Design the aesthetic layout first so it looks visually sleek.", "အမြင်ပိုင်း သပ်ရပ်လှပစေရန် ဒီဇိုင်းပုံစံကို အရင်ရေးဆွဲသည်။"],
    ["Count, inventory, and verify every single component and instruction.", "အစိတ်အပိုင်းနှင့် ညွှန်ကြားချက်တိုင်းကို ရေတွက်၊ စာရင်းပြုစု၊ အတည်ပြုသည်။"],
    ["Test structural strength and make sure nothing breaks under stress.", "ခံနိုင်ရည်ကို စမ်းသပ်ပြီး ဖိအားအောက်တွင် ဘာမှမပျက်ကြောင်း သေချာစေသည်။"],
    ["Plan out the execution steps or assemble the core electrical components.", "လုပ်ဆောင်ရမည့်အဆင့်များကို စီစဉ်ခြင်း သို့မဟုတ် အဓိကလျှပ်စစ်အစိတ်အပိုင်းများကို တပ်ဆင်ခြင်း ပြုလုပ်သည်။"]
  ]),
  question(7, "role_choices", "When solving a puzzle or troubleshooting a problem, how do you tackle it?", "ပဟေဠိတစ်ခု ဖြေရှင်းခြင်း သို့မဟုတ် ပြဿနာတစ်ခု ရှာဖွေပြင်ဆင်ခြင်းကို ဘယ်လိုလုပ်ဆောင်သလဲ။", [
    ["Experiment step-by-step with practical logic until it works.", "အလုပ်ဖြစ်သည်အထိ လက်တွေ့ကျသော ယုတ္တိဖြင့် အဆင့်ဆင့် စမ်းသပ်သည်။"],
    ["Redesign the interaction to make it intuitive and easy for everyone.", "လူတိုင်းအတွက် နားလည်လွယ်အသုံးပြုရလွယ်စေရန် လုပ်ဆောင်ပုံကို ပြန်လည်ဒီဇိုင်းဆွဲသည်။"],
    ["Analyze underlying patterns, past data, and evidence.", "နောက်ကွယ်ရှိ ပုံစံများ၊ ယခင်ဒေတာနှင့် သက်သေများကို ခွဲခြမ်းစိတ်ဖြာသည်။"],
    ["Inspect carefully for security flaws, loopholes, or edge cases.", "လုံခြုံရေးအားနည်းချက်၊ ကွက်လပ် သို့မဟုတ် ထူးခြားအခြေအနေများရှိမရှိ သေချာစစ်ဆေးသည်။"],
    ["Guide others step-by-step or fix the underlying system tools.", "အခြားသူများကို အဆင့်ဆင့် လမ်းညွှန်ခြင်း သို့မဟုတ် အခြေခံစနစ်ကိရိယာများကို ပြင်ဆင်ခြင်း ပြုလုပ်သည်။"]
  ]),
  question(8, "role_choices", "What aspect of tech and apps do you find most satisfying?", "နည်းပညာနှင့် app များတွင် ဘယ်အရာက သင့်ကို အကျေနပ်ဆုံးဖြစ်စေသလဲ။", [
    ["Lightning-fast execution and solid logic running under the hood.", "အတွင်းပိုင်းတွင် မြန်ဆန်စွာလုပ်ဆောင်ပြီး ခိုင်မာသော logic အလုပ်လုပ်နေခြင်း။"],
    ["Clean visual themes, smooth animations, and beautiful interfaces.", "သပ်ရပ်သော visual theme၊ ချောမွေ့သော animation နှင့် လှပသော interface များ။"],
    ["Smart recommendations that predict exactly what you need.", "သင်လိုအပ်သည်ကို တိတိကျကျ ခန့်မှန်းပေးသော စမတ်အကြံပြုချက်များ။"],
    ["Air-tight security that keeps user accounts and data completely safe.", "အသုံးပြုသူအကောင့်နှင့် ဒေတာများကို လုံခြုံစွာကာကွယ်ပေးသော ခိုင်မာသည့် security။"],
    ["Connecting physical gadgets and IoT devices over a network.", "ကွန်ရက်မှတစ်ဆင့် ရုပ်ဝတ္ထုပစ္စည်းများနှင့် IoT ကိရိယာများကို ချိတ်ဆက်ခြင်း။"]
  ]),
  question(9, "role_choices", "When picking up a new technical skill, how do you prefer to learn?", "နည်းပညာကျွမ်းကျင်မှုအသစ်တစ်ခုကို သင်ယူရာတွင် ဘယ်လိုသင်ယူရတာကို နှစ်သက်သလဲ။", [
    ["Hands-on building by hacking together sample projects.", "နမူနာ project များကို လက်တွေ့တည်ဆောက်ရင်း သင်ယူသည်။"],
    ["Analyzing visual examples and designing custom UI components.", "အမြင်နမူနာများကို ခွဲခြမ်းစိတ်ဖြာပြီး ကိုယ်ပိုင် UI component များ ဒီဇိုင်းဆွဲရင်း သင်ယူသည်။"],
    ["Solving logic puzzles, math problems, and data challenges.", "Logic ပဟေဠိ၊ သင်္ချာပြဿနာနှင့် ဒေတာစိန်ခေါ်မှုများကို ဖြေရှင်းရင်း သင်ယူသည်။"],
    ["Discovering hidden mechanics, edge cases, and exploit prevention.", "ကွယ်ဝှက်ထားသော လုပ်ဆောင်ပုံ၊ ထူးခြားအခြေအနေနှင့် exploit ကာကွယ်ပုံများကို ရှာဖွေရင်း သင်ယူသည်။"],
    ["Collaborating on setup tasks or configuring hardware environments.", "တပ်ဆင်မှုလုပ်ငန်းများတွင် ပူးပေါင်းခြင်း သို့မဟုတ် hardware ပတ်ဝန်းကျင်များကို ပြင်ဆင်ရင်း သင်ယူသည်။"]
  ]),
  question(10, "role_choices", "When organizing a workspace or digital bookshelf, what is your top priority?", "အလုပ်လုပ်ရာနေရာ သို့မဟုတ် ဒစ်ဂျစ်တယ်စာအုပ်စင်ကို စီစဉ်ရာတွင် ဘာကို ဦးစားပေးသလဲ။", [
    ["Structuring items in a clean, logical, and highly functional order.", "ပစ္စည်းများကို သပ်ရပ်ပြီး ယုတ္တိရှိကာ အသုံးဝင်သောအစီအစဉ်ဖြင့် စီစဉ်ခြင်း။"],
    ["Making it visually pleasing, modern, and uncluttered.", "အမြင်ပိုင်းလှပ၊ ခေတ်မီပြီး ရှုပ်ထွေးမှုမရှိအောင် ပြုလုပ်ခြင်း။"],
    ["Categorizing items systematically with tagging and documentation.", "ပစ္စည်းများကို အမျိုးအစားခွဲပြီး tag နှင့် မှတ်တမ်းများဖြင့် စနစ်တကျ စီစဉ်ခြင်း။"],
    ["Ensuring sensitive materials are locked down and protected.", "အရေးကြီးသောအရာများကို ကာကွယ်လုံခြုံစွာ ထိန်းသိမ်းထားခြင်း။"],
    ["Delegating responsibilities or neatly managing power cables and rigs.", "တာဝန်များခွဲဝေခြင်း သို့မဟုတ် power cable နှင့် rig များကို သပ်ရပ်စွာ စီမံခြင်း။"]
  ]),
  question(11, "role_choices", "What compliment from your peers makes you feel most accomplished?", "လုပ်ဖော်ကိုင်ဖက်များထံမှ ဘယ်လိုချီးကျူးစကားက သင့်ကို အအောင်မြင်ဆုံးခံစားစေသလဲ။", [
    ["\"Your solution works flawlessly and runs super fast!\"", "\"သင့်ဖြေရှင်းချက်က အပြစ်အနာအဆာမရှိဘဲ အရမ်းမြန်တယ်။\""],
    ["\"This design looks stunning and is so intuitive to use!\"", "\"ဒီဇိုင်းက အရမ်းလှပြီး အသုံးပြုရတာလည်း လွယ်ကူတယ်။\""],
    ["\"Your data insights and analysis were spot on!\"", "\"သင့်ဒေတာအမြင်နဲ့ ခွဲခြမ်းစိတ်ဖြာမှုက တကယ်တိကျတယ်။\""],
    ["\"Thanks for catching those critical vulnerabilities and keeping us safe!\"", "\"အရေးကြီးတဲ့ လုံခြုံရေးအားနည်းချက်တွေကို ရှာတွေ့ပြီး ကာကွယ်ပေးလို့ ကျေးဇူးတင်ပါတယ်။\""],
    ["\"Your system coordination and setup kept everything running smoothly!\"", "\"သင့်စနစ်ညှိနှိုင်းမှုနဲ့ တပ်ဆင်မှုကြောင့် အရာအားလုံး ချောချောမွေ့မွေ့ အလုပ်လုပ်တယ်။\"" ]
  ])
];

export interface ExplorationQuizSubmission {
  zodiac: string;
  mbti: string;
  energy: string;
  personality_type: string;
  role_choices: number[];
}

export function buildExplorationSubmission(answers: Array<number | null>): ExplorationQuizSubmission {
  if (answers.length !== explorationQuestions.length || answers.some((answer) => answer === null)) {
    throw new Error("exploration-quiz-incomplete");
  }

  const selectedOptions = answers as number[];
  const valueFor = (questionId: number) => {
    const question = explorationQuestions[questionId - 1];
    return question.options[selectedOptions[questionId - 1]];
  };

  return {
    zodiac: valueFor(1),
    mbti: valueFor(2),
    energy: valueFor(3),
    personality_type: valueFor(4),
    role_choices: selectedOptions.slice(4)
  };
}
