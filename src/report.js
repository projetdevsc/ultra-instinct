/* ─── Claude Report Generator ─── */

export function generateReport(routineName, routineEmoji, duration, exerciseResults, date) {
  const d = date || new Date().toLocaleDateString("fr-FR");
  
  // Count PRs
  const totalPRs = exerciseResults.filter(e => e.hasPR).length;
  
  // Build exercise table
  let exLines = "";
  exerciseResults.forEach(ex => {
    exLines += `\n### ${ex.name} (${ex.muscle})\n`;
    exLines += `| Set | Charge | Reps | PR |\n|---|---|---|---|\n`;
    ex.sets.forEach((s, i) => {
      if (s.kg > 0 && s.reps > 0) {
        exLines += `| ${i + 1} | ${s.kg}kg | ${s.reps} | ${s.isPR ? "🏆" : ""} |\n`;
      }
    });
    if (ex.bestSet) {
      exLines += `\n**Meilleur set** : ${ex.bestSet.kg}kg × ${ex.bestSet.reps}`;
      if (ex.prevBest) {
        const diff = ex.bestSet.kg - ex.prevBest.kg;
        exLines += ` (${diff > 0 ? "+" : ""}${diff}kg vs dernière séance)`;
      }
      exLines += "\n";
    }
    if (ex.objective) {
      exLines += `**Objectif** : ${ex.objective}\n`;
    }
  });

  // Volume
  const totalSets = exerciseResults.reduce((sum, e) => sum + e.sets.filter(s => s.kg > 0).length, 0);
  const totalReps = exerciseResults.reduce((sum, e) => sum + e.sets.reduce((rs, s) => rs + (s.reps || 0), 0), 0);

  const report = `# 📊 Ultra Instinct — Rapport de séance
## ${routineEmoji} ${routineName}
**Date** : ${d}
**Durée** : ${duration}
**Exercices** : ${exerciseResults.length}
**Volume total** : ${totalSets} séries · ${totalReps} reps
${totalPRs > 0 ? `**🏆 PRs** : ${totalPRs} nouveau${totalPRs > 1 ? "x" : ""} record${totalPRs > 1 ? "s" : ""}` : "Pas de nouveau PR"}

---
${exLines}
---

## 💬 Points à discuter
- [Ajoute tes questions / sensations / ajustements ici]

---
*Généré par Ultra Instinct — ${d}*`;

  return report;
}

export async function copyReport(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); document.body.removeChild(ta); return true; }
    catch { document.body.removeChild(ta); return false; }
  }
}
