/* ─── Ultra Instinct Storage Layer v8 ─── */

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

const today = () => new Date().toISOString().slice(0, 10);

export const DB = {
  // ─── Swaps ───
  getSwaps: () => store.get("swaps", {}),
  setSwaps: (s) => store.set("swaps", s),

  // ─── Session history ───
  getHistory: () => store.get("history", []),
  addSession: (session) => {
    const hist = DB.getHistory();
    hist.unshift(session);
    store.set("history", hist);
    return hist;
  },
  deleteSession: (id) => {
    const hist = DB.getHistory().filter(s => s.id !== id);
    store.set("history", hist);
    return hist;
  },

  // ─── Last dates per routine ───
  getLastDates: () => store.get("lastDates", {}),
  setLastDate: (routineKey, date) => {
    const dates = DB.getLastDates();
    dates[routineKey] = date;
    store.set("lastDates", dates);
    return dates;
  },

  // ─── Exercise history ───
  getExtraHist: () => store.get("exHist", {}),
  addExerciseEntry: (exId, entry) => {
    const all = DB.getExtraHist();
    if (!all[exId]) all[exId] = [];
    all[exId].push(entry);
    store.set("exHist", all);
    return all;
  },

  // ─── Workout progress ───
  saveWorkoutProgress: (data) => store.set("currentWorkout", data),
  getWorkoutProgress: () => store.get("currentWorkout", null),
  clearWorkoutProgress: () => store.remove("currentWorkout"),

  // ─── Objectives ───
  getObjectives: () => store.get("objectives", {}),
  setObjective: (exId, obj) => {
    const all = DB.getObjectives();
    all[exId] = obj;
    store.set("objectives", all);
    return all;
  },

  // ─── Mensurations ───
  getMensurations: () => store.get("mensurations", []),
  addMensuration: (entry) => {
    const all = DB.getMensurations();
    all.push(entry);
    all.sort((a, b) => a.date.localeCompare(b.date));
    store.set("mensurations", all);
    return all;
  },
  setMensurations: (arr) => store.set("mensurations", arr),

  // ─── Settings ───
  getSettings: () => store.get("settings", { fontSize: "normal", waterGoal: 3000 }),
  setSettings: (s) => store.set("settings", s),

  // ─── Custom exercises ───
  getCustomExercises: () => store.get("customExercises", {}),
  addCustomExercise: (id, ex) => {
    const all = DB.getCustomExercises();
    all[id] = ex;
    store.set("customExercises", all);
    return all;
  },

  // ─── Water tracking ───
  getWaterToday: () => {
    const d = today();
    const all = store.get("water", {});
    return all[d] || { total: 0, logs: [] };
  },
  addWater: (ml) => {
    const d = today();
    const all = store.get("water", {});
    if (!all[d]) all[d] = { total: 0, logs: [] };
    all[d].total += ml;
    all[d].logs.push({ ml, time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) });
    store.set("water", all);
    return all[d];
  },
  removeLastWater: () => {
    const d = today();
    const all = store.get("water", {});
    if (!all[d] || all[d].logs.length === 0) return all[d] || { total: 0, logs: [] };
    const last = all[d].logs.pop();
    all[d].total -= last.ml;
    if (all[d].total < 0) all[d].total = 0;
    store.set("water", all);
    return all[d];
  },
  getWaterHistory: (days = 7) => {
    const all = store.get("water", {});
    const result = [];
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      result.push({ date: key, total: all[key]?.total || 0 });
    }
    return result.reverse();
  },
  getRecentWaterAmounts: () => {
    const all = store.get("water", {});
    const d = today();
    const logs = all[d]?.logs || [];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yKey = yesterday.toISOString().slice(0, 10);
    const yLogs = all[yKey]?.logs || [];
    const unique = [...new Set([...logs, ...yLogs].map(l => l.ml))];
    return unique.slice(0, 3);
  },

  // ─── Macros tracking ───
  getMacrosToday: () => {
    const d = today();
    const all = store.get("macros", {});
    return all[d] || null;
  },
  setMacrosToday: (data) => {
    const d = today();
    const all = store.get("macros", {});
    all[d] = { ...data, date: d };
    store.set("macros", all);
    return all[d];
  },
  getMacrosYesterday: () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const d = yesterday.toISOString().slice(0, 10);
    const all = store.get("macros", {});
    return all[d] || null;
  },
  getMacrosHistory: (days = 7) => {
    const all = store.get("macros", {});
    const result = [];
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      if (all[key]) result.push(all[key]);
    }
    return result.reverse();
  },

  // ─── Export / Import ───
  getLastExport: () => store.get("lastExport", null),
  setLastExport: () => { store.set("lastExport", today()); },
  exportAll: () => {
    const data = {};
    Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .forEach(k => { data[k.slice(PREFIX.length)] = store.get(k.slice(PREFIX.length)); });
    return data;
  },
  importAll: (data) => {
    Object.entries(data).forEach(([key, value]) => {
      store.set(key, value);
    });
  },

  // ─── Full reset ───
  resetAll: () => {
    Object.keys(localStorage).filter(k => k.startsWith(PREFIX)).forEach(k => localStorage.removeItem(k));
  }
};
