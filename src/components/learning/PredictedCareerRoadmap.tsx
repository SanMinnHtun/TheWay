import { useState } from "react";
import { type EditableRoadmap, type RoadmapStatus } from "../../data/roadmapGenerator";
import { useCareerRoadmap } from "../../context/CareerRoadmapContext";
import { useI18n } from "../../i18n/I18nContext";
import { Progress } from "../ui/progress";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";

const statusLabels: Record<RoadmapStatus, string> = {
  pending: "Not started",
  "in-progress": "In progress",
  completed: "Completed"
};

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function PredictedRoadmapContent({ savedOnly = false }: { savedOnly?: boolean }) {
  const { language } = useI18n();
  const { roadmap, savedRoadmap, updateRoadmap, saveRoadmap } = useCareerRoadmap();
  const active = savedOnly && savedRoadmap
    ? (roadmap?.roleTitle === savedRoadmap.roleTitle ? roadmap : savedRoadmap)
    : roadmap;
  const [newSkills, setNewSkills] = useState<Record<string, string>>({});
  const [saveMessage, setSaveMessage] = useState("");
  const isBurmese = language === "my";

  if (!active) return <p className="career-roadmap-empty">{isBurmese ? "သင်၏ ရလဒ်မှ လမ်းပြမြေပုံကို အရင်ဖန်တီးပါ။" : "Complete the roadmap assessment to create your top-match roadmap."}</p>;

  const allSkills = active.stages.flatMap((stage) => stage.skills);
  const completed = allSkills.filter((skill) => skill.status === "completed").length;
  const progress = allSkills.length ? Math.round((completed / allSkills.length) * 100) : 0;
  const updateStage = (stageId: string, change: (stage: EditableRoadmap["stages"][number]) => EditableRoadmap["stages"][number]) => {
    updateRoadmap((current) => ({ ...current, stages: current.stages.map((stage) => stage.id === stageId ? change(stage) : stage) }), savedOnly);
  };

  const handleSave = async () => {
    try {
      await saveRoadmap(savedOnly);
      setSaveMessage(isBurmese ? "My Roadmap တွင် သိမ်းပြီးပါပြီ။" : "Saved to My Roadmap.");
    } catch {
      setSaveMessage(isBurmese ? "မသိမ်းနိုင်ပါ။ ထပ်မံကြိုးစားပါ။" : "Could not save. Please try again.");
    }
  };

  return (
    <div className="predicted-roadmap-view">
      <header className="predicted-roadmap-header">
        <div>
          <p className="experience-eyebrow">{isBurmese ? "သင်၏ ထိပ်တန်းကိုက်ညီမှု" : "Your top match"}</p>
          <h2>{active.roleTitle}</h2>
          <p>{Math.round(active.matchPercentage)}% {isBurmese ? "ကိုက်ညီမှု" : "match"} · {completed}/{allSkills.length} {isBurmese ? "ကျွမ်းကျင်မှု ပြီးစီး" : "skills completed"}</p>
        </div>
        <div className="predicted-roadmap-progress"><strong>{progress}%</strong><Progress value={progress} aria-label={`${progress}% complete`} /></div>
      </header>

      <div className="roadmap-editor-toolbar">
        <button type="button" onClick={() => updateRoadmap((current) => ({
          ...current,
          stages: [...current.stages, { id: makeId("stage"), title: "New milestone", description: "", status: "pending", skills: [] }]
        }), savedOnly)}>{isBurmese ? "+ အဆင့်ထည့်ရန်" : "+ Add milestone"}</button>
        <button type="button" className="roadmap-save-button" onClick={handleSave}>{isBurmese ? "My Roadmap တွင် သိမ်းရန်" : "Save to My Roadmap"}</button>
        {saveMessage ? <span role="status">{saveMessage}</span> : null}
      </div>

      <div className="roadmap-edit-stage-list">
        {active.stages.map((stage) => (
          <section className="roadmap-edit-stage" key={stage.id}>
            <div className="roadmap-edit-stage-heading">
              <input aria-label="Milestone title" value={stage.title} onChange={(event) => updateStage(stage.id, (item) => ({ ...item, title: event.target.value }))} />
              <select aria-label="Milestone status" value={stage.status} onChange={(event) => updateStage(stage.id, (item) => ({ ...item, status: event.target.value as RoadmapStatus }))}>
                {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
              <button type="button" className="roadmap-delete-button" onClick={() => updateRoadmap((current) => ({ ...current, stages: current.stages.filter((item) => item.id !== stage.id) }), savedOnly)}>{isBurmese ? "ဖယ်ရှားရန်" : "Delete milestone"}</button>
            </div>
            <textarea aria-label="Milestone description" value={stage.description} onChange={(event) => updateStage(stage.id, (item) => ({ ...item, description: event.target.value }))} placeholder="Describe this milestone" />
            <ul className="roadmap-edit-skills">
              {stage.skills.map((skill, skillIndex) => (
                <li key={skill.id}>
                  <input aria-label="Skill name" value={skill.name} onChange={(event) => updateStage(stage.id, (item) => ({ ...item, skills: item.skills.map((entry) => entry.id === skill.id ? { ...entry, name: event.target.value } : entry) }))} />
                  <select aria-label={`${skill.name} status`} value={skill.status} onChange={(event) => updateStage(stage.id, (item) => ({ ...item, skills: item.skills.map((entry) => entry.id === skill.id ? { ...entry, status: event.target.value as RoadmapStatus } : entry) }))}>
                    {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                  <div className="roadmap-skill-actions">
                    <button type="button" aria-label={`Move ${skill.name} up`} disabled={skillIndex === 0} onClick={() => updateStage(stage.id, (item) => { const skills = [...item.skills]; [skills[skillIndex - 1], skills[skillIndex]] = [skills[skillIndex], skills[skillIndex - 1]]; return { ...item, skills }; })}>↑</button>
                    <button type="button" aria-label={`Move ${skill.name} down`} disabled={skillIndex === stage.skills.length - 1} onClick={() => updateStage(stage.id, (item) => { const skills = [...item.skills]; [skills[skillIndex + 1], skills[skillIndex]] = [skills[skillIndex], skills[skillIndex + 1]]; return { ...item, skills }; })}>↓</button>
                    <button type="button" className="roadmap-delete-button" aria-label={`Delete ${skill.name}`} onClick={() => updateStage(stage.id, (item) => ({ ...item, skills: item.skills.filter((entry) => entry.id !== skill.id) }))}>×</button>
                  </div>
                </li>
              ))}
            </ul>
            <form className="roadmap-add-skill" onSubmit={(event) => {
              event.preventDefault();
              const name = (newSkills[stage.id] ?? "").trim();
              if (!name) return;
              updateStage(stage.id, (item) => ({ ...item, skills: [...item.skills, { id: makeId("skill"), name, status: "pending" }] }));
              setNewSkills((current) => ({ ...current, [stage.id]: "" }));
            }}>
              <input value={newSkills[stage.id] ?? ""} onChange={(event) => setNewSkills((current) => ({ ...current, [stage.id]: event.target.value }))} placeholder={isBurmese ? "ကျွမ်းကျင်မှုအသစ်" : "Add a skill"} aria-label="New skill" />
              <button type="submit">{isBurmese ? "ထည့်ရန်" : "Add skill"}</button>
            </form>
          </section>
        ))}
      </div>
    </div>
  );
}

export function PredictedRoadmapModal() {
  const { language } = useI18n();
  const { isRoadmapModalOpen, setRoadmapModalOpen, roadmap } = useCareerRoadmap();
  const labels = language === "my"
    ? { title: "သင့်အလုပ်အကိုင်လမ်းပြမြေပုံ", description: "ထိပ်တန်းကိုက်ညီသည့် အလုပ်အကိုင်အတွက် ကိုယ်ပိုင်လမ်းကြောင်းကို ပြင်ဆင်ပါ။" }
    : { title: "Your Career Roadmap", description: "Customize a learning path for your highest predicted career match." };
  return (
    <Sheet open={isRoadmapModalOpen} onOpenChange={setRoadmapModalOpen}>
      <SheetContent side="right" className="career-roadmap-modal">
        <SheetHeader><SheetTitle>{labels.title}</SheetTitle><SheetDescription>{roadmap?.roleTitle ?? labels.description}</SheetDescription></SheetHeader>
        <div className="career-roadmap-modal-scroll"><PredictedRoadmapContent /></div>
      </SheetContent>
    </Sheet>
  );
}
