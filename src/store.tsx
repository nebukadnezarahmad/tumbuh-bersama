import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  AppState,
  Caregiver,
  Consents,
  Measurement,
  Notifications,
  Profile,
  StageId,
  Task,
} from "./types";
import { PRIORITY_TEMPLATES } from "./data";
import { addDays, addMonths, todayISO } from "./lib/date";

const STORAGE_KEY = "tumbuh-bersama.state.v1";

const baseState: AppState = {
  version: 1,
  profile: null,
  tasks: [],
  measurements: [],
  consents: {
    shareMaternal: false,
    shareChild: false,
    shareTasks: true,
    analytics: false,
  },
  notifications: {
    weekly: true,
    visits: true,
    growth: true,
    lockScreenDetail: false,
  },
  caregivers: [],
  menu: {
    recipeId: null,
    substitutions: {},
    pantry: [],
    minutes: 45,
    budget: 20000,
    allergies: [],
  },
  shoppingDone: [],
  demo: false,
};

function makeId(prefix: string): string {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `${prefix}-${random}`;
}

export function taskFromTemplate(
  template: (typeof PRIORITY_TEMPLATES)[number],
  today = todayISO(),
): Task {
  return {
    id: makeId("task"),
    title: template.title,
    reason: template.reason,
    ruleId: template.ruleId,
    ruleVersion: "1.0",
    source: template.source,
    owner: template.owner,
    due: addDays(today, template.offsetDays),
    status: "rencana",
    createdAt: today,
  };
}

export function taskFromTitle(
  stage: StageId,
  title: string,
  owner: Task["owner"],
  days = 3,
): Task {
  const template =
    PRIORITY_TEMPLATES.find(
      (item) => item.stage === stage && item.title === title,
    ) ??
    PRIORITY_TEMPLATES.find((item) => item.stage === stage) ??
    PRIORITY_TEMPLATES[0];
  return taskFromTemplate(
    {
      ...template,
      title,
      owner,
      offsetDays: days,
    },
    todayISO(),
  );
}

export function buildDemoState(): AppState {
  const today = todayISO();
  const birthDate = addMonths(today, -9);
  const templates = PRIORITY_TEMPLATES.filter(
    (item) => item.stage === "mpasi",
  ).slice(0, 3);

  const measurementDates = [2, 4, 6, 8].map((month) =>
    addDays(addMonths(birthDate, month), 4),
  );
  const values = [
    { weightKg: 4.8, heightCm: 56.5 },
    { weightKg: 6.1, heightCm: 61.2 },
    { weightKg: 7.0, heightCm: 65.0 },
    { weightKg: 7.9, heightCm: 68.4 },
  ];

  const measurements: Measurement[] = measurementDates.map((date, index) => ({
    id: makeId("measure"),
    date,
    weightKg: values[index].weightKg,
    heightCm: values[index].heightCm,
    position: "telentang",
    source: "Posyandu (contoh)",
    confirmed: true,
    createdAt: date,
  }));

  return {
    ...baseState,
    profile: {
      motherName: "Rani",
      childName: "Alya",
      stage: "mpasi",
      childBirthDate: birthDate,
      dueDate: "",
      startedAt: today,
    },
    tasks: templates.map((template) => taskFromTemplate(template, today)),
    measurements,
    caregivers: [
      {
        id: makeId("care"),
        name: "Dimas",
        email: "dimas@contoh.id",
        invitedAt: addDays(today, -2),
        expiresAt: addDays(today, 5),
        status: "aktif",
      },
    ],
    menu: {
      recipeId: null,
      substitutions: {},
      pantry: ["Beras", "Telur", "Wortel", "Kentang", "Tomat"],
      minutes: 45,
      budget: 20000,
      allergies: [],
    },
    demo: true,
  };
}

export function buildEmptyState(
  stage: StageId,
  motherName: string,
  childName: string,
  birthDate: string,
): AppState {
  const templates = PRIORITY_TEMPLATES.filter(
    (item) => item.stage === stage,
  ).slice(0, 3);
  return {
    ...baseState,
    profile: {
      motherName,
      childName,
      stage,
      childBirthDate: birthDate,
      dueDate: "",
      startedAt: todayISO(),
    },
    tasks: templates.map((template) => taskFromTemplate(template)),
    demo: false,
  };
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return baseState;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    if (!parsed || parsed.version !== 1) return baseState;
    return {
      ...baseState,
      ...parsed,
      consents: { ...baseState.consents, ...parsed.consents },
      notifications: { ...baseState.notifications, ...parsed.notifications },
      menu: { ...baseState.menu, ...parsed.menu },
    };
  } catch {
    return baseState;
  }
}

interface StoreValue {
  state: AppState;
  setState: (updater: (current: AppState) => AppState) => void;
  setProfile: (profile: Profile) => void;
  updateProfile: (patch: Partial<Profile>) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  removeTask: (id: string) => void;
  addMeasurement: (measurement: Measurement) => void;
  removeMeasurement: (id: string) => void;
  setConsent: (key: keyof Consents, value: boolean) => void;
  setNotification: (key: keyof Notifications, value: boolean) => void;
  inviteCaregiver: (name: string, email: string) => void;
  revokeCaregiver: (id: string) => void;
  resetDemo: () => void;
  clearAll: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Penyimpanan penuh atau ditolak peramban. Aplikasi tetap berjalan di memori.
    }
  }, [state]);

  const update = useCallback((updater: (current: AppState) => AppState) => {
    setState((current) => updater(current));
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      state,
      setState: update,
      setProfile: (profile) =>
        update((current) => ({ ...current, profile })),
      updateProfile: (patch) =>
        update((current) => ({
          ...current,
          profile: current.profile
            ? { ...current.profile, ...patch }
            : current.profile,
        })),
      addTask: (task) =>
        update((current) => ({ ...current, tasks: [...current.tasks, task] })),
      updateTask: (id, patch) =>
        update((current) => ({
          ...current,
          tasks: current.tasks.map((task) =>
            task.id === id ? { ...task, ...patch } : task,
          ),
        })),
      removeTask: (id) =>
        update((current) => ({
          ...current,
          tasks: current.tasks.filter((task) => task.id !== id),
        })),
      addMeasurement: (measurement) =>
        update((current) => ({
          ...current,
          measurements: [...current.measurements, measurement],
        })),
      removeMeasurement: (id) =>
        update((current) => ({
          ...current,
          measurements: current.measurements.filter(
            (item) => item.id !== id,
          ),
        })),
      setConsent: (key, value) =>
        update((current) => ({
          ...current,
          consents: { ...current.consents, [key]: value },
        })),
      setNotification: (key, value) =>
        update((current) => ({
          ...current,
          notifications: { ...current.notifications, [key]: value },
        })),
      inviteCaregiver: (name, email) => {
        const today = todayISO();
        const caregiver: Caregiver = {
          id: makeId("care"),
          name,
          email,
          invitedAt: today,
          expiresAt: addDays(today, 7),
          status: "menunggu",
        };
        update((current) => ({
          ...current,
          caregivers: [...current.caregivers, caregiver],
        }));
      },
      revokeCaregiver: (id) =>
        update((current) => ({
          ...current,
          caregivers: current.caregivers.filter((item) => item.id !== id),
        })),
      resetDemo: () => setState(buildDemoState()),
      clearAll: () => {
        localStorage.removeItem(STORAGE_KEY);
        setState(baseState);
      },
    }),
    [state, update],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore(): StoreValue {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore harus dipakai di dalam StoreProvider");
  return value;
}
