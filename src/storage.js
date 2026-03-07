/* ─── Ultra Instinct Storage Layer ─── */

const PREFIX = "ui_";

export const store = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  },
  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (e) { console.warn("Storage full:", e); }
  },
  remove(key) {
    localStorage.removeItem(PREFIX + key);
  }
};

/* Specific data accessors */
export const DB = {
  // Swaps
  getSwaps: () => store.get("swaps", {}),
  setSwaps: (s) => store.set("swaps", s),

  // Session history
  getHistory: () => store.get("history", []),
  addSession: (session) => {
    const hist = DB.getHistory();
    hist.unshift(session);
    store.set("history", hist);
    return hist;
  },

  // Last dates per routine
  getLastDates: () => store.get("lastDates", {}),
  setLastDate: (routineKey, date) => {
    const dates = DB.getLastDates();
    dates[routineKey] = date;
    store.set("lastDates", dates);
    return dates;
  },

  // Exercise history (new entries from logged sessions)
  getExtraHist: () => store.get("exHist", {}),
  addExerciseEntry: (exId, entry) => {
    const all = DB.getExtraHist();
    if (!all[exId]) all[exId] = [];
    all[exId].push(entry);
    store.set("exHist", all);
    return all;
  },

  // Current workout data (save in progress)
  saveWorkoutProgress: (data) => store.set("currentWorkout", data),
  getWorkoutProgress: () => store.get("currentWorkout", null),
  clearWorkoutProgress: () => store.remove("currentWorkout"),

  // Custom objectives per exercise
  getObjectives: () => store.get("objectives", {}),
  setObjective: (exId, obj) => {
    const all = DB.getObjectives();
    all[exId] = obj;
    store.set("objectives", all);
    return all;
  },

  // Mensurations
  getMensurations: () => store.get("mensurations", []),
  addMensuration: (entry) => {
    const all = DB.getMensurations();
    all.push(entry);
    all.sort((a, b) => a.date.localeCompare(b.date));
    store.set("mensurations", all);
    return all;
  },
  setMensurations: (arr) => store.set("mensurations", arr),

  // Settings
  getSettings: () => store.get("settings", { vibration: true, fontSize: "normal" }),
  setSettings: (s) => store.set("settings", s),

  // Custom exercises (user-created during session)
  getCustomExercises: () => store.get("customExercises", {}),
  addCustomExercise: (id, ex) => {
    const all = DB.getCustomExercises();
    all[id] = ex;
    store.set("customExercises", all);
    return all;
  },

  // Full reset
  resetAll: () => {
    Object.keys(localStorage).filter(k => k.startsWith(PREFIX)).forEach(k => localStorage.removeItem(k));
  }
};
