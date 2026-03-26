import { useState, useEffect, useRef, useCallback } from "react";
import { DB } from "./storage";
import { generateReport, copyReport } from "./report";

/* ═══════════════════════════════════════════════════════════
   ULTRA INSTINCT — V8.1
   5-tab nav · Séances (stats+hist+1RM) · Fix water · SW
   ═══════════════════════════════════════════════════════════ */

/* ─── EXERCISES DB ─── */
const EX={
  hack_squat_a:{name:"Hack Squat",muscle:"Quadriceps",rest:180,warm:["Adducteurs 2×15 @15-20kg","Vide ×15","60kg ×10","100kg ×6","140kg ×3"],hist:[{d:"2024-11-09",kg:70,r:12},{d:"2024-11-16",kg:70,r:12},{d:"2024-11-23",kg:70,r:12},{d:"2024-12-04",kg:70,r:12},{d:"2024-12-11",kg:90,r:10},{d:"2025-01-03",kg:100,r:10},{d:"2025-01-22",kg:120,r:10},{d:"2025-01-31",kg:120,r:10},{d:"2025-02-07",kg:140,r:10},{d:"2025-02-16",kg:140,r:10}]},
  vsquat:{name:"V Squat",muscle:"Quadriceps",rest:150,hist:[{d:"2025-01-13",kg:80,r:10},{d:"2025-02-25",kg:140,r:10}]},
  leg_press_a:{name:"Leg Press",muscle:"Quadriceps",rest:180,hist:[{d:"2025-02-25",kg:180,r:10}]},
  leg_ext_a:{name:"Leg Extension",muscle:"Quadriceps",rest:90,hist:[{d:"2024-11-09",kg:30,r:20},{d:"2024-11-16",kg:35,r:15},{d:"2024-11-23",kg:40,r:15},{d:"2024-12-04",kg:40,r:15},{d:"2024-12-11",kg:40,r:15},{d:"2025-01-03",kg:40,r:15},{d:"2025-01-22",kg:40,r:15},{d:"2025-01-31",kg:40,r:15},{d:"2025-02-07",kg:60,r:8},{d:"2025-02-16",kg:60,r:12},{d:"2025-02-25",kg:80,r:15}]},
  leg_curl_debout_a:{name:"Leg Curl Debout",muscle:"Ischio-jambiers",rest:90,hist:[{d:"2024-11-09",kg:10,r:8},{d:"2024-11-16",kg:10,r:12},{d:"2024-11-23",kg:15,r:8},{d:"2024-12-04",kg:15,r:12},{d:"2024-12-11",kg:17.5,r:10},{d:"2025-01-03",kg:15,r:10},{d:"2025-01-22",kg:22.5,r:10},{d:"2025-01-31",kg:22.5,r:10},{d:"2025-02-07",kg:25,r:12},{d:"2025-02-16",kg:25,r:10},{d:"2025-02-25",kg:25,r:12}]},
  nordic_ham:{name:"Assisted Nordic Ham",muscle:"Ischio-jambiers",rest:120,hist:[{d:"2025-02-16",kg:20,r:10}]},
  leg_curl_allonge_a:{name:"Leg Curl Allongé",muscle:"Ischio-jambiers",rest:90,hist:[{d:"2025-01-22",kg:37.5,r:12},{d:"2025-01-31",kg:37.5,r:12},{d:"2025-02-07",kg:40,r:9}]},
  iso_leg_press_a:{name:"Iso Lateral Leg Press",muscle:"Quadriceps",rest:150,hist:[{d:"2024-11-16",kg:120,r:10},{d:"2024-11-23",kg:120,r:10},{d:"2024-12-04",kg:130,r:10},{d:"2024-12-11",kg:140,r:10},{d:"2025-01-03",kg:140,r:10},{d:"2025-01-22",kg:140,r:10},{d:"2025-01-31",kg:140,r:10},{d:"2025-02-07",kg:170,r:10},{d:"2025-02-16",kg:170,r:10}]},
  mollet_presse:{name:"Mollet à la Presse",muscle:"Mollets",rest:60,hist:[{d:"2025-02-25",kg:80,r:15}]},
  seated_calf_a:{name:"Seated Calf Raise",muscle:"Mollets",rest:60,hist:[{d:"2025-02-16",kg:30,r:13}]},
  hack_squat_b:{name:"Hack Squat",muscle:"Quadriceps",rest:180,warm:["Adducteurs 2×15 @15-20kg","Vide ×15","80kg ×10","120kg ×6","160kg ×3"],hist:[{d:"2024-12-07",kg:90,r:6},{d:"2024-12-15",kg:110,r:6},{d:"2025-01-09",kg:140,r:6},{d:"2025-01-18",kg:150,r:6},{d:"2025-01-26",kg:160,r:6},{d:"2025-02-03",kg:180,r:6},{d:"2025-02-12",kg:200,r:6},{d:"2025-02-22",kg:180,r:6},{d:"2025-03-01",kg:180,r:6}]},
  leg_press_b:{name:"Leg Press",muscle:"Quadriceps",rest:180,hist:[{d:"2024-11-20",kg:120,r:10},{d:"2024-11-28",kg:140,r:10},{d:"2024-12-07",kg:160,r:10},{d:"2024-12-15",kg:160,r:10},{d:"2025-01-09",kg:180,r:10},{d:"2025-01-18",kg:210,r:10},{d:"2025-01-26",kg:210,r:10},{d:"2025-02-03",kg:220,r:10},{d:"2025-02-12",kg:220,r:10},{d:"2025-02-22",kg:220,r:10},{d:"2025-03-01",kg:220,r:10}]},
  leg_ext_b:{name:"Leg Extension",muscle:"Quadriceps",rest:90,hist:[{d:"2024-11-20",kg:40,r:15},{d:"2024-11-28",kg:40,r:12},{d:"2024-12-07",kg:40,r:12},{d:"2024-12-15",kg:40,r:12},{d:"2025-01-09",kg:40,r:12},{d:"2025-01-18",kg:40,r:12},{d:"2025-01-26",kg:50,r:14},{d:"2025-02-12",kg:60,r:15},{d:"2025-02-22",kg:60,r:15},{d:"2025-03-01",kg:30,r:15}]},
  leg_curl_debout_b:{name:"Leg Curl Debout",muscle:"Ischio-jambiers",rest:90,hist:[{d:"2025-02-12",kg:25,r:10},{d:"2025-02-22",kg:25,r:10},{d:"2025-03-01",kg:25,r:12}]},
  leg_curl_allonge_b:{name:"Leg Curl Allongé",muscle:"Ischio-jambiers",rest:90,hist:[{d:"2025-01-26",kg:40,r:8},{d:"2025-02-03",kg:35,r:12},{d:"2025-02-12",kg:40,r:8},{d:"2025-02-22",kg:40,r:8},{d:"2025-03-01",kg:40,r:8}]},
  seated_calf_b:{name:"Mollet Assis",muscle:"Mollets",rest:60,hist:[{d:"2025-01-18",kg:20,r:15},{d:"2025-01-26",kg:20,r:15},{d:"2025-02-03",kg:20,r:15},{d:"2025-02-12",kg:30,r:12},{d:"2025-02-22",kg:30,r:12},{d:"2025-03-01",kg:30,r:12}]},
  ab_oblique:{name:"Ab Crunch Oblique",muscle:"Abdominaux",rest:60,hist:[{d:"2025-02-22",kg:20,r:15},{d:"2025-03-01",kg:20,r:15}]},
  lat_pulldown_a:{name:"Lat Pull Down",muscle:"Dos (largeur)",rest:150,warm:["Tirage vertical 40kg ×12","Tractions PDC ×8"],hist:[{d:"2025-02-14",kg:100,r:8},{d:"2025-02-27",kg:110,r:8}]},
  iso_front_lat:{name:"Iso Front Lat Pull Down",muscle:"Dos (largeur)",rest:120,hist:[{d:"2025-02-27",kg:35,r:10},{d:"2025-03-04",kg:70,r:10}]},
  tirage_h_serre:{name:"Tirage Horizontal Serré",muscle:"Dos (épaisseur)",rest:120,hist:[{d:"2025-01-21",kg:70,r:10},{d:"2025-01-24",kg:70,r:8},{d:"2025-02-01",kg:70,r:8},{d:"2025-02-14",kg:75,r:8},{d:"2025-03-04",kg:70,r:10}]},
  low_row:{name:"Low Row Machine",muscle:"Dos (épaisseur)",rest:120,hist:[{d:"2025-02-09",kg:110,r:8},{d:"2025-02-27",kg:100,r:10}]},
  dev_incline:{name:"Développé Incliné",muscle:"Pectoraux (haut)",rest:150,warm:["Barre vide ×15","40kg ×10","60kg ×6"],hist:[{d:"2025-02-14",kg:90,r:5},{d:"2025-02-27",kg:90,r:9},{d:"2025-03-04",kg:70,r:8}]},
  chest_press_a:{name:"Chest Press",muscle:"Pectoraux",rest:150,hist:[{d:"2025-02-27",kg:100,r:10},{d:"2025-03-04",kg:60,r:10}]},
  iso_bench:{name:"Iso Lateral Bench Press",muscle:"Pectoraux",rest:150,hist:[{d:"2025-02-27",kg:90,r:9},{d:"2025-03-04",kg:100,r:3}]},
  ecarte_haut:{name:"Écarté Haut du Pec",muscle:"Pectoraux (haut)",rest:90,hist:[{d:"2025-02-09",kg:8,r:12},{d:"2025-02-27",kg:8,r:12},{d:"2025-03-04",kg:6,r:15}]},
  curl_pupitre:{name:"Curl Pupitre Haltère",muscle:"Biceps",rest:90,hist:[{d:"2025-02-27",kg:14,r:10},{d:"2025-03-04",kg:14,r:10}]},
  curl_marteau:{name:"Curl Marteau",muscle:"Biceps",rest:90,hist:[{d:"2025-02-09",kg:20,r:14},{d:"2025-02-27",kg:20,r:14},{d:"2025-03-04",kg:20,r:14}]},
  ext_triceps_corde:{name:"Extension Triceps Corde",muscle:"Triceps",rest:90,hist:[{d:"2025-02-09",kg:25,r:12},{d:"2025-02-27",kg:22.5,r:10},{d:"2025-03-04",kg:22.5,r:12}]},
  poulie_triceps:{name:"Poulie Triceps",muscle:"Triceps",rest:90,hist:[{d:"2025-02-09",kg:32.5,r:12},{d:"2025-02-27",kg:22.5,r:10},{d:"2025-03-04",kg:15,r:12}]},
  chest_press_b:{name:"Chest Press",muscle:"Pectoraux",rest:150,warm:["Incline barre 20kg ×15","40kg ×10","50kg ×6"],hist:[{d:"2025-02-11",kg:85,r:8},{d:"2025-02-23",kg:80,r:8}]},
  dev_incline_b:{name:"Développé Incliné Barre",muscle:"Pectoraux (haut)",rest:150,hist:[{d:"2025-02-05",kg:65,r:10},{d:"2025-02-11",kg:65,r:7},{d:"2025-02-23",kg:60,r:8}]},
  butterfly_b:{name:"Butterfly",muscle:"Pectoraux",rest:90,hist:[{d:"2025-02-05",kg:20,r:15},{d:"2025-02-11",kg:20,r:15},{d:"2025-02-23",kg:20,r:15}]},
  ecarte_haut_b:{name:"Écarté Haut du Pec",muscle:"Pectoraux (haut)",rest:90,hist:[{d:"2025-02-05",kg:6,r:15},{d:"2025-02-11",kg:6,r:15},{d:"2025-02-23",kg:6,r:15}]},
  pulldown_b:{name:"Pull Down",muscle:"Dos (largeur)",rest:150,hist:[{d:"2025-02-18",kg:100,r:10},{d:"2025-02-23",kg:100,r:6}]},
  traction_b:{name:"Tractions Lestées",muscle:"Dos (largeur)",rest:150,hist:[{d:"2025-02-05",kg:10,r:6},{d:"2025-02-11",kg:10,r:6}]},
  iso_high_row:{name:"Iso Lateral High Row",muscle:"Dos (épaisseur)",rest:120,hist:[{d:"2025-02-11",kg:45,r:10},{d:"2025-02-23",kg:40,r:10}]},
  shoulder_press:{name:"Shoulder Press",muscle:"Épaules",rest:120,hist:[{d:"2025-02-05",kg:45,r:8},{d:"2025-03-04",kg:40,r:8}]},
  lat_raise:{name:"Élévation Latérale",muscle:"Épaules",rest:90,hist:[{d:"2025-02-05",kg:10,r:12},{d:"2025-02-11",kg:10,r:12},{d:"2025-02-23",kg:10,r:12},{d:"2025-03-04",kg:10,r:12}]},
  shrug:{name:"Shrug",muscle:"Trapèzes",rest:90,hist:[{d:"2025-02-11",kg:30,r:15},{d:"2025-02-23",kg:24,r:15},{d:"2025-03-04",kg:36,r:15}]},
  biceps_pupitre_b:{name:"Biceps Pupitre",muscle:"Biceps",rest:90,hist:[{d:"2025-02-11",kg:10,r:10},{d:"2025-02-23",kg:12,r:10}]},
  corde_triceps_b:{name:"Corde Triceps",muscle:"Triceps",rest:90,hist:[{d:"2025-02-11",kg:22.5,r:12},{d:"2025-02-23",kg:22.5,r:10}]},
  corde_overhead:{name:"Corde Triceps Overhead",muscle:"Triceps",rest:90,hist:[{d:"2025-02-23",kg:15,r:12},{d:"2025-03-04",kg:22.5,r:12}]},
  curl_marteau_b:{name:"Curl Marteau",muscle:"Biceps",rest:90,hist:[{d:"2025-02-18",kg:18,r:15},{d:"2025-03-04",kg:20,r:14}]},
};

const OBJ={hack_squat_a:"180kg×10",vsquat:"160kg×10",leg_press_a:"220kg×10",leg_ext_a:"80kg×15",leg_curl_debout_a:"30kg×12",leg_curl_allonge_a:"45kg×12",iso_leg_press_a:"100kg/j×10",mollet_presse:"100kg×15",hack_squat_b:"220kg×6",leg_press_b:"280kg×10",leg_ext_b:"70kg×15",leg_curl_debout_b:"30kg×12",leg_curl_allonge_b:"45kg×12",seated_calf_b:"40kg×15",dev_incline:"90kg×8",iso_bench:"110kg×8",ecarte_haut:"12kg×15",lat_pulldown_a:"110kg×10",iso_front_lat:"45kg/b×10",tirage_h_serre:"85kg×10",low_row:"120kg×10",curl_pupitre:"18kg×12",curl_marteau:"24kg×14",ext_triceps_corde:"30kg×12",chest_press_b:"100kg×10",dev_incline_b:"75kg×10",butterfly_b:"25kg×15",pulldown_b:"120kg×10",iso_high_row:"55kg/b×10",shoulder_press:"50kg×10",lat_raise:"14kg×12"};

const INIT_ROUTINES={
  upper_a:{name:"Upper A",emoji:"💪",tag:"MARDI · DOS + PECS + BRAS",day:"Mardi",warmup:"Rameur ou vélo 5 min (FC 120-130) → Mobilité épaules 3 min",sets:4,
    exercises:["lat_pulldown_a","iso_front_lat","tirage_h_serre","dev_incline","iso_bench","ecarte_haut","curl_pupitre","ext_triceps_corde","curl_marteau"],
    alts:{lat_pulldown_a:["iso_front_lat"],iso_bench:["chest_press_a"],tirage_h_serre:["low_row"],ext_triceps_corde:["poulie_triceps"]}},
  lower_a:{name:"Lower A",emoji:"🦵",tag:"JEUDI · FORCE + PUISSANCE",day:"Jeudi",warmup:"Vélo 5 min → Mobilité 5 min (squats corps, good mornings)",sets:4,
    exercises:["hack_squat_a","vsquat","leg_ext_a","leg_curl_allonge_a","iso_leg_press_a","leg_curl_debout_a","mollet_presse"],
    alts:{vsquat:["leg_press_a"],leg_curl_allonge_a:["nordic_ham"],mollet_presse:["seated_calf_a"]}},
  upper_b:{name:"Upper B",emoji:"💪",tag:"SAMEDI · PECS + DOS + ÉPAULES",day:"Samedi",warmup:"Rameur ou vélo 5 min → Mobilité épaules 3 min",sets:4,
    exercises:["chest_press_b","dev_incline_b","butterfly_b","ecarte_haut_b","pulldown_b","iso_high_row","shoulder_press","lat_raise","biceps_pupitre_b","corde_triceps_b","curl_marteau_b","corde_overhead"],
    alts:{pulldown_b:["traction_b"],corde_triceps_b:["corde_overhead"]}},
  lower_b:{name:"Lower B",emoji:"🦵",tag:"DIMANCHE · VOLUME + HYPERTROPHIE",day:"Dimanche",warmup:"Vélo ou marche inclinée 5 min → Mobilité 5 min",sets:4,
    exercises:["hack_squat_b","leg_press_b","leg_ext_b","leg_curl_debout_b","leg_curl_allonge_b","seated_calf_b","ab_oblique"],
    alts:{}},
};

const LAST_SESSIONS={upper_a:"2026-03-03",lower_a:"2026-02-27",upper_b:"2026-03-01",lower_b:"2026-03-02"};
const INIT_HISTORY=[
  {id:1,routine:"upper_a",date:"2026-03-03",duration:"1:35",exercises:9,prs:1},
  {id:2,routine:"lower_b",date:"2026-03-02",duration:"1:22",exercises:7,prs:0},
  {id:3,routine:"upper_b",date:"2026-03-01",duration:"1:28",exercises:12,prs:0},
  {id:4,routine:"lower_a",date:"2026-02-27",duration:"1:18",exercises:7,prs:2},
  {id:5,routine:"upper_a",date:"2026-02-24",duration:"1:30",exercises:9,prs:1},
  {id:6,routine:"lower_b",date:"2026-02-23",duration:"1:20",exercises:7,prs:0},
  {id:7,routine:"upper_b",date:"2026-02-22",duration:"1:25",exercises:12,prs:1},
  {id:8,routine:"lower_a",date:"2026-02-20",duration:"1:15",exercises:7,prs:1},
];

/* ─── THEME ─── */
const T={bg:"#0D1220",bgCard:"rgba(19,27,46,0.25)",bgInput:"rgba(25,38,64,0.35)",bgEl:"rgba(28,42,72,0.3)",
  bd:"rgba(180,200,255,0.12)",bdM:"rgba(180,200,255,0.2)",
  w:"#F0F3FF",t1:"#D8DFF5",t2:"#9AA4C4",t3:"#6672A0",t4:"#3E4A70",
  bl:"#7090FF",blL:"#9CB5FF",vi:"#A88CFF",cy:"#5CE8FA",pk:"#E280FF",pkS:"#F0AAFF",wa:"#FFB86E",gn:"#8AE8A0",
  aura:"linear-gradient(135deg,#7090FF 0%,#A88CFF 45%,#E280FF 100%)",
  ss:"linear-gradient(135deg,#C0D0FF 0%,#F0F3FF 35%,#C5B0FF 70%,#E280FF 100%)",
  am:"linear-gradient(135deg,rgba(112,144,255,0.08),rgba(168,140,255,0.05))"};

/* ─── MENSUR (AFTER T) ─── */
const INIT_MENSUR=[
  {date:"2025-11-10",poids:74.85,ventre:81,bras:38.5,cuisse:53.5},
  {date:"2025-11-23",poids:74.50,ventre:80.5,bras:39,cuisse:53.5},
  {date:"2025-12-07",poids:75.15,ventre:79.5,bras:39,cuisse:55.5},
  {date:"2025-12-21",poids:74.60,ventre:77.5,bras:39,cuisse:56.5},
  {date:"2026-01-04",poids:74.95,ventre:77.5,bras:38.5,cuisse:56.5},
  {date:"2026-01-18",poids:74.50,ventre:77,bras:38.5,cuisse:57,poitrine:103},
  {date:"2026-01-25",poids:73.60,ventre:76,bras:39,cuisse:57.5,poitrine:103},
  {date:"2026-02-01",poids:73.25,ventre:74.5,bras:39,cuisse:58,poitrine:104,bf:11.9,muscle:56.7,meta:1786},
  {date:"2026-02-08",poids:72.85,ventre:74.5,bras:39,cuisse:58,poitrine:104,bf:12.2,muscle:56.7,meta:1786},
  {date:"2026-02-15",poids:74.60,ventre:75,bras:39,cuisse:58,poitrine:104},
  {date:"2026-03-06",poids:74.60,bf:12.2,muscle:56.7,meta:1786},
];
const MENSUR_FIELDS=[
  {key:"poids",label:"Poids",unit:"kg",color:T.bl,obj:"78-80 kg",icon:"⚖️"},
  {key:"bf",label:"Body Fat",unit:"%",color:T.cy,obj:"12-14%",icon:"🔥"},
  {key:"ventre",label:"Tour de ventre",unit:"cm",color:T.cy,obj:"< 78 cm",icon:"📏"},
  {key:"poitrine",label:"Tour de poitrine",unit:"cm",color:T.pk,obj:"108-110 cm",icon:"💪"},
  {key:"cuisse",label:"Tour de cuisses",unit:"cm",color:T.vi,obj:"61-63 cm",icon:"🦵"},
  {key:"bras",label:"Tour de bras",unit:"cm",color:T.wa,obj:"40-41 cm",icon:"💪"},
  {key:"muscle",label:"Muscle squelettique",unit:"%",color:T.gn,obj:"58%+",icon:"🏋️"},
  {key:"meta",label:"Métabolisme base",unit:"kcal",color:"#E8A08A",obj:"1850+",icon:"⚡"},
];

/* ─── CONSTANTS ─── */
const DEADLINE=new Date("2027-04-27T00:00:00");
const APP_VERSION="8.1";
const FONT_SIZES={small:0.85,normal:1,large:1.15};
const RO=[60,90,120,150,180,210,240];
const localDate=()=>{const d=new Date();return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`};
const fm=s=>`${Math.floor(s/60)}:${(s%60).toString().padStart(2,"0")}`;
const last=id=>{const h=EX[id]?.hist;return h?.length?h[h.length-1]:null};
const prBest=id=>{const h=EX[id]?.hist;return h?.length?h.reduce((b,e)=>e.kg>b.kg?e:b,h[0]):null};
const dateFR=d=>{if(!d)return"";const[y,m,dd]=d.split("-");return`${dd}/${m}/${y}`};
const ago=d=>{if(!d)return"";const now=new Date();const then=new Date(d+"T12:00:00");const diff=Math.floor((now-then)/(1000*60*60*24));return diff===0?"Aujourd'hui":diff===1?"Hier":diff<7?`il y a ${diff}j`:`il y a ${Math.floor(diff/7)} sem`};
const daysLeft=()=>Math.max(0,Math.ceil((DEADLINE-new Date())/(1000*60*60*24)));
const sz=(base,sc)=>Math.round(base*sc);
const e1rm=(kg,r)=>r===1?kg:Math.round(kg*(1+r/30)*10)/10; // Epley formula

// Smart target: calcule l'objectif dynamique basé sur l'historique
const smartTarget=(exId)=>{
  const ex=EX[exId];if(!ex||!ex.hist||ex.hist.length===0)return null;
  const h=ex.hist;const lst=h[h.length-1];const prev=h.length>=2?h[h.length-2]:null;
  const name=(ex.name||"").toLowerCase();
  
  // Detect mode
  const isForce=name.includes("force")||lst.r<=8;
  const isVolume=name.includes("volume")||lst.r>=12;
  
  // Detect equipment for rounding
  const isDumbbell=name.includes("haltère")||name.includes("marteau")||name.includes("pupitre")||name.includes("curl");
  const kgStep=isDumbbell?2:lst.kg>=40?5:2.5;
  const round=(v)=>isDumbbell?Math.round(v/2)*2:Math.round(v/kgStep)*kgStep;
  
  // Rep ranges
  const maxRep=isForce?8:isVolume?15:12;
  const minRep=isForce?6:isVolume?12:8;
  
  if(!prev){
    return{kg:lst.kg,r:Math.min(lst.r+1,maxRep),type:"same",label:"Consolider"};
  }
  
  const regressed=lst.kg<prev.kg||(lst.kg===prev.kg&&lst.r<prev.r);
  const stagnated=lst.kg===prev.kg&&lst.r===prev.r;
  
  if(lst.r>=maxRep){
    return{kg:round(lst.kg+kgStep),r:minRep,type:"up",label:"Monter"};
  }
  if(regressed){
    return{kg:lst.kg,r:prev.r,type:"recover",label:"Rattraper"};
  }
  if(stagnated){
    return{kg:lst.kg,r:lst.r+1,type:"push",label:"Pousser"};
  }
  return{kg:lst.kg,r:Math.min(lst.r+1,maxRep),type:"progress",label:"Progresser"};
};
const waterL=(ml)=>{const l=ml/1000;return l===Math.floor(l)?l.toFixed(1):l<10?(Math.round(l*100)/100).toString():l.toFixed(1)};

/* ═══ COMPONENTS ═══ */

function RestTimer({duration,exName,onDone,onSkip}){
  const[rem,setRem]=useState(duration);const iR=useRef(null);const cbR=useRef(onDone);
  useEffect(()=>{cbR.current=onDone},[onDone]);
  useEffect(()=>{setRem(duration);clearInterval(iR.current);
    iR.current=setInterval(()=>{setRem(p=>{if(p<=1){clearInterval(iR.current);cbR.current();return 0}return p-1})},1000);
    return()=>clearInterval(iR.current)},[duration]);
  const pct=((duration-rem)/duration)*100,urg=rem<=10;
  return(<div onClick={onSkip} style={{position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:200,background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
    {/* Glow background */}
    <div style={{position:"absolute",width:300,height:300,borderRadius:"50%",background:urg?"radial-gradient(circle,rgba(226,128,255,0.12),transparent 70%)":"radial-gradient(circle,rgba(112,144,255,0.08),transparent 70%)",pointerEvents:"none",transition:"background 0.5s"}}/>
    {/* Exercise name */}
    <div style={{fontSize:14,fontWeight:700,color:urg?T.pkS:T.bl,letterSpacing:"2px",textTransform:"uppercase",marginBottom:20,position:"relative"}}>⏱ {exName}</div>
    {/* Giant timer */}
    <div style={{fontSize:120,fontWeight:900,lineHeight:1,fontVariantNumeric:"tabular-nums",fontFamily:"monospace",background:urg?"linear-gradient(135deg,#E280FF,#FF70B0)":T.ss,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",filter:urg?"drop-shadow(0 0 30px rgba(226,128,255,0.4))":"drop-shadow(0 0 20px rgba(192,208,255,0.2))",position:"relative",transition:"filter 0.3s"}}>{fm(rem)}</div>
    {/* Progress bar */}
    <div style={{width:200,height:4,borderRadius:2,background:"rgba(180,200,255,0.08)",marginTop:30,overflow:"hidden",position:"relative"}}>
      <div style={{height:"100%",borderRadius:2,background:urg?"linear-gradient(90deg,#E280FF,#FF70B0)":T.aura,width:`${pct}%`,transition:"width 1s linear",boxShadow:urg?"0 0 12px rgba(226,128,255,0.4)":"0 0 8px rgba(112,144,255,0.3)"}}/></div>
    {/* Skip hint */}
    <div style={{fontSize:12,color:T.t4,marginTop:20,fontWeight:600,position:"relative"}}>Touche pour skip</div>
  </div>);
}
function RC({val,set}){const[o,sO]=useState(false);return(<div style={{position:"relative"}}><button onClick={e=>{e.stopPropagation();sO(!o)}} style={{padding:"4px 10px",borderRadius:7,cursor:"pointer",background:T.bgInput,border:`1px solid ${T.bdM}`,color:T.bl,fontSize:11,fontWeight:700,fontFamily:"monospace",display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:10}}>⏱</span>{fm(val)}</button>
  {o&&<div onClick={e=>e.stopPropagation()} style={{position:"absolute",top:"100%",right:0,marginTop:6,zIndex:90,background:T.bgEl,border:`1px solid ${T.bdM}`,borderRadius:12,padding:6,width:190,display:"flex",flexWrap:"wrap",gap:4,boxShadow:"0 12px 48px rgba(0,0,0,0.6)"}}>
    {RO.map(d=><button key={d} onClick={()=>{set(d);sO(false)}} style={{padding:"7px 0",borderRadius:8,cursor:"pointer",flex:"1 0 52px",textAlign:"center",background:d===val?"rgba(112,144,255,0.14)":"rgba(180,200,255,0.03)",border:`1px solid ${d===val?"rgba(112,144,255,0.3)":T.bd}`,color:d===val?T.blL:T.t3,fontSize:12,fontWeight:700,fontFamily:"monospace"}}>{fm(d)}</button>)}</div>}</div>);
}
function SR({i,prev,cur,up,val,done,isPR,fSc}){
  const inp=(v,p)=>({width:"100%",padding:"9px 4px",borderRadius:9,textAlign:"center",background:v?"rgba(92,232,250,0.05)":T.bgInput,border:`1px solid ${v?"rgba(92,232,250,0.2)":p?"rgba(226,128,255,0.35)":T.bdM}`,color:T.w,fontSize:sz(15,fSc),fontWeight:600,outline:"none",fontFamily:"inherit"});
  return(<div style={{display:"grid",gridTemplateColumns:"30px 1fr 72px 72px 42px",gap:8,alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${T.bd}`,opacity:done?0.4:1}}>
    <div style={{fontSize:sz(13,fSc),fontWeight:800,textAlign:"center",color:done?T.cy:T.t3}}>{i+1}</div>
    <div style={{fontSize:sz(12,fSc),color:T.t3,fontFamily:"monospace"}}>{prev?`${prev.kg} × ${prev.r}`:"—"}</div>
    <div style={{position:"relative"}}><input type="number" inputMode="decimal" placeholder="kg" value={cur.kg||""} disabled={done} onChange={e=>up({...cur,kg:parseFloat(e.target.value)||0})} style={inp(done,isPR)}/>
      {isPR&&!done&&<div style={{position:"absolute",top:-7,right:-5,fontSize:8,fontWeight:900,color:T.pk,background:"rgba(226,128,255,0.12)",border:"1px solid rgba(226,128,255,0.25)",padding:"1px 6px",borderRadius:6}}>PR</div>}</div>
    <input type="number" inputMode="numeric" placeholder="reps" value={cur.reps||""} disabled={done} onChange={e=>up({...cur,reps:parseInt(e.target.value)||0})} style={inp(done,false)}/>
    <button onClick={val} disabled={done||!cur.kg||!cur.reps} style={{width:38,height:38,borderRadius:9,cursor:done?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",background:done?"rgba(92,232,250,0.1)":cur.kg&&cur.reps?"rgba(112,144,255,0.1)":"rgba(180,200,255,0.02)",border:`1.5px solid ${done?"rgba(92,232,250,0.3)":cur.kg&&cur.reps?"rgba(112,144,255,0.25)":T.bd}`,color:done?T.cy:cur.kg&&cur.reps?T.blL:T.t4,fontSize:16,fontWeight:800}}>✓</button>
  </div>);
}
function ExCard({exId,slotKey,alts,onRest,nSets,swaps,onSwap,onData,customObjs,onObjChange,fSc}){
  const swapped=swaps[exId];const[aId,setAId]=useState(swapped||exId);
  const ax=EX[aId]||{name:aId,muscle:"Custom",rest:120,hist:[]};
  const lp=last(aId);const prR=prBest(aId);const st=smartTarget(aId);
  const defaultObj=OBJ[aId]||"";const customObj=customObjs[aId];const obj=customObj?.text||defaultObj;const objMode=customObj?.mode||"default";
  const prev=lp?Array(nSets).fill(lp):null;
  const targetKg=st?st.kg:lp?lp.kg:0;const targetReps=st?st.r:lp?lp.r:0;

  // Detect compound vs isolation from rest time
  const isCompound=ax.rest>=120;
  // Detect equipment type for rounding
  const nm=(ax.name||"").toLowerCase();
  const isDumbbell=nm.includes("haltère")||nm.includes("marteau")||nm.includes("pupitre");
  const roundStep=isDumbbell?2:targetKg>=40?5:2.5;
  // Build smart set loading
  const buildSets=(n,kg,reps)=>{
    if(!kg||!isCompound||n<=2)return Array(n).fill(null).map(()=>({kg,reps,done:false}));
    const round=(v)=>{if(isDumbbell)return Math.round(v/2)*2;const s=kg>=40?5:2.5;return Math.round(v/s)*s};
    // 1 warmup set at ~50%, rest all max
    if(n===3){
      return[
        {kg:round(kg*0.5),reps,done:false},
        {kg,reps,done:false},
        {kg,reps,done:false}
      ];
    }
    if(n===4){
      return[
        {kg:round(kg*0.5),reps,done:false},
        {kg,reps,done:false},
        {kg,reps,done:false},
        {kg,reps,done:false}
      ];
    }
    if(n>=5){
      return[
        {kg:round(kg*0.4),reps,done:false},
        {kg:round(kg*0.65),reps,done:false},
        ...Array(n-2).fill(null).map(()=>({kg,reps,done:false}))
      ];
    }
    return Array(n).fill(null).map(()=>({kg,reps,done:false}));
  };
  const[sets,setSets]=useState(buildSets(nSets,targetKg,targetReps));
  const[open,setOpen]=useState(true);const[prs,setPrs]=useState([]);const[rest,setRest]=useState(ax.rest||120);const[showSwap,setShowSwap]=useState(false);const[search,setSearch]=useState("");
  const[showObj,setShowObj]=useState(false);const[objInput,setObjInput]=useState(customObj?.text||"");
  const done=sets.filter(s=>s.done).length;const allD=done===sets.length&&done>0;const aList=alts||[];
  const allExList=Object.entries(EX).map(([id,e])=>({id,name:e.name,muscle:e.muscle}));
  const filtered=search.length>0?allExList.filter(e=>e.name.toLowerCase().includes(search.toLowerCase())||e.muscle.toLowerCase().includes(search.toLowerCase())):aList.length>0?[{id:exId,...EX[exId]},...aList.map(a=>({id:a,...EX[a]}))]:allExList.slice(0,8);
  useEffect(()=>{if(onData){const validSets=sets.filter(s=>s.done&&s.kg>0);const bestSet=validSets.length>0?validSets.reduce((b,s)=>s.kg>b.kg?s:b,validSets[0]):null;onData(slotKey,{activeId:aId,name:ax.name,muscle:ax.muscle,sets:sets.map(s=>({kg:s.kg,reps:s.reps,done:s.done,isPR:s.kg>0&&prR&&s.kg>prR.kg})),bestSet,prevBest:lp,hasPR:prs.length>0,objective:obj})}},[sets,prs]);
  const validate=i=>{const n=[...sets];n[i].done=true;setSets(n);if(prR&&n[i].kg>prR.kg)setPrs(p=>[...p,i]);onRest(rest,ax.name)};
  const swap=nId=>{setAId(nId);onSwap(exId,nId);const nex=EX[nId]||{rest:120,name:""};setRest(nex.rest||120);const nst=smartTarget(nId);const nlp=last(nId);const nkg=nst?nst.kg:nlp?nlp.kg:0;const nr=nst?nst.r:nlp?nlp.r:0;const nc=nex.rest>=120;
    const nnm=(nex.name||"").toLowerCase();const ndb=nnm.includes("haltère")||nnm.includes("marteau")||nnm.includes("pupitre")||nnm.includes("curl");
    const nround=(v)=>ndb?Math.round(v/2)*2:nkg>=40?Math.round(v/5)*5:Math.round(v/2.5)*2.5;
    const newSets=(!nkg||!nc||nSets<=2)?Array(nSets).fill(null).map(()=>({kg:nkg,reps:nr,done:false})):
      nSets===3?[{kg:nround(nkg*0.5),reps:nr,done:false},{kg:nkg,reps:nr,done:false},{kg:nkg,reps:nr,done:false}]:
      nSets===4?[{kg:nround(nkg*0.5),reps:nr,done:false},{kg:nkg,reps:nr,done:false},{kg:nkg,reps:nr,done:false},{kg:nkg,reps:nr,done:false}]:
      [{kg:nround(nkg*0.4),reps:nr,done:false},{kg:nround(nkg*0.65),reps:nr,done:false},...Array(nSets-2).fill(null).map(()=>({kg:nkg,reps:nr,done:false}))];
    setSets(newSets);setPrs([]);setShowSwap(false);setSearch("");setObjInput(customObjs[nId]?.text||OBJ[nId]||"")};
  const setObjMode=(mode)=>{let text="";if(mode==="up"&&lp)text=`${lp.kg+5}kg × ${lp.r}`;else if(mode==="stable"&&lp)text=`${lp.kg}kg × ${lp.r+2}`;else if(mode==="custom")text=objInput||defaultObj;else text=defaultObj;setObjInput(text);onObjChange(aId,{mode,text});setShowObj(false)};
  const saveCustomObj=()=>{onObjChange(aId,{mode:"custom",text:objInput});setShowObj(false)};
  return(<div style={{background:allD?"linear-gradient(135deg,rgba(92,232,250,0.04),rgba(112,144,255,0.03))":T.bgCard,border:`1px solid ${allD?"rgba(92,232,250,0.12)":T.bd}`,borderRadius:16,marginBottom:10}}>
    <div onClick={()=>setOpen(!open)} style={{padding:"13px 16px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:open?`1px solid ${T.bd}`:"none"}}>
      <div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
        <span style={{fontSize:sz(15,fSc),fontWeight:700,color:T.w}}>{ax.name}</span>
        {prs.length>0&&<span style={{fontSize:9,fontWeight:800,color:T.pk,background:"rgba(226,128,255,0.1)",border:"1px solid rgba(226,128,255,0.2)",padding:"2px 8px",borderRadius:10}}>🏆 PR</span>}
        <button onClick={e=>{e.stopPropagation();setShowSwap(!showSwap)}} style={{fontSize:9,fontWeight:700,color:T.vi,background:"rgba(168,140,255,0.08)",border:"1px solid rgba(168,140,255,0.15)",padding:"2px 8px",borderRadius:8,cursor:"pointer"}}>⇄ swap</button></div>
      <div style={{fontSize:sz(11,fSc),color:T.t3,marginTop:3}}>{ax.muscle}{lp?` · ${lp.kg}kg × ${lp.r}`:""}
        {st&&<span style={{marginLeft:6,fontSize:10,fontWeight:700,color:st.type==="up"?T.gn:st.type==="recover"?T.wa:T.cy,background:st.type==="up"?"rgba(138,232,160,0.1)":st.type==="recover"?"rgba(255,184,110,0.1)":"rgba(92,232,250,0.08)",border:`1px solid ${st.type==="up"?"rgba(138,232,160,0.2)":st.type==="recover"?"rgba(255,184,110,0.2)":"rgba(92,232,250,0.15)"}`,padding:"1px 7px",borderRadius:6}}>→ {st.kg}kg × {st.r} · {st.label}</span>}
        {obj&&<button onClick={e=>{e.stopPropagation();setShowObj(!showObj)}} style={{marginLeft:6,fontSize:10,color:T.vi,fontWeight:700,background:"rgba(168,140,255,0.06)",border:"1px solid rgba(168,140,255,0.12)",padding:"1px 7px",borderRadius:6,cursor:"pointer"}}>🎯 {obj} {objMode==="up"?"📈":objMode==="stable"?"🔒":""}</button>}
        {!obj&&<button onClick={e=>{e.stopPropagation();setShowObj(!showObj)}} style={{marginLeft:6,fontSize:10,color:T.t4,fontWeight:600,background:"rgba(180,200,255,0.04)",border:`1px solid ${T.bd}`,padding:"1px 7px",borderRadius:6,cursor:"pointer"}}>+ objectif</button>}</div></div>
      <div style={{display:"flex",alignItems:"center",gap:10}} onClick={e=>e.stopPropagation()}>
        <RC val={rest} set={setRest}/><span style={{fontSize:12,fontWeight:800,fontFamily:"monospace",color:allD?T.cy:T.t3,minWidth:30,textAlign:"center"}}>{done}/{sets.length}</span>
        <span onClick={e=>{e.stopPropagation();setOpen(!open)}} style={{color:T.t3,fontSize:12,cursor:"pointer",transform:open?"rotate(180deg)":"none",transition:"transform 0.2s",display:"inline-block"}}>▾</span></div></div>
    {showObj&&<div onClick={e=>e.stopPropagation()} style={{padding:"12px 16px",background:"rgba(168,140,255,0.04)",borderBottom:`1px solid ${T.bd}`}}>
      <div style={{fontSize:10,fontWeight:800,color:T.vi,letterSpacing:"1px",textTransform:"uppercase",marginBottom:8}}>🎯 Objectif pour {ax.name}</div>
      <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
        {[{id:"up",label:"📈 Augmenter",desc:lp?`${lp.kg+5}kg × ${lp.r}`:"+5kg"},{id:"stable",label:"🔒 Stabiliser",desc:lp?`${lp.kg}kg × ${lp.r+2}`:"+2 reps"},{id:"default",label:"🏠 V6",desc:defaultObj||"—"}].map(m=>
          <button key={m.id} onClick={()=>setObjMode(m.id)} style={{flex:"1 0 80px",padding:"8px 6px",borderRadius:9,cursor:"pointer",textAlign:"center",background:objMode===m.id?"rgba(168,140,255,0.12)":"rgba(180,200,255,0.03)",border:`1px solid ${objMode===m.id?"rgba(168,140,255,0.25)":T.bd}`,color:objMode===m.id?T.vi:T.t3}}><div style={{fontSize:12,fontWeight:700}}>{m.label}</div><div style={{fontSize:10,color:T.t4,marginTop:2}}>{m.desc}</div></button>)}</div>
      <div style={{display:"flex",gap:6}}><input type="text" value={objInput} onChange={e=>setObjInput(e.target.value)} placeholder="Ex: 150kg × 8" style={{flex:1,padding:"9px 12px",borderRadius:9,background:T.bgInput,border:`1px solid ${T.bdM}`,color:T.w,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
        <button onClick={saveCustomObj} style={{padding:"9px 16px",borderRadius:9,cursor:"pointer",background:"rgba(112,144,255,0.1)",border:"1px solid rgba(112,144,255,0.25)",color:T.blL,fontSize:12,fontWeight:700}}>OK</button></div></div>}
    {showSwap&&<div style={{padding:"10px 16px",background:"rgba(168,140,255,0.04)",borderBottom:`1px solid ${T.bd}`}}>
      <input type="text" placeholder="🔍 Rechercher un exercice..." value={search} onChange={e=>setSearch(e.target.value)} onClick={e=>e.stopPropagation()} style={{width:"100%",padding:"9px 12px",borderRadius:9,background:T.bgInput,border:`1px solid ${T.bdM}`,color:T.w,fontSize:13,outline:"none",marginBottom:8,fontFamily:"inherit"}}/>
      <div style={{maxHeight:180,overflowY:"auto",display:"flex",flexDirection:"column",gap:4}}>
        {filtered.slice(0,12).map(ex=><button key={ex.id} onClick={e=>{e.stopPropagation();swap(ex.id)}} style={{padding:"8px 12px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,textAlign:"left",background:aId===ex.id?"rgba(112,144,255,0.12)":"rgba(180,200,255,0.03)",border:`1px solid ${aId===ex.id?"rgba(112,144,255,0.25)":T.bd}`,color:aId===ex.id?T.blL:T.t2,display:"flex",justifyContent:"space-between"}}><span>{ex.name}</span><span style={{fontSize:10,color:T.t4}}>{ex.muscle}</span></button>)}
        {filtered.length===0&&<div style={{fontSize:12,color:T.t3,padding:8,textAlign:"center"}}>Aucun exercice trouvé</div>}</div></div>}
    {open&&<div style={{padding:"6px 16px 12px"}}>
      {ax.warm&&<div style={{padding:"8px 12px",marginBottom:8,borderRadius:10,background:"rgba(255,184,110,0.05)",border:"1px solid rgba(255,184,110,0.12)"}}><div style={{fontSize:9,fontWeight:800,color:T.wa,letterSpacing:"1.2px",textTransform:"uppercase",marginBottom:5}}>Échauffement spécifique</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:4}}>{ax.warm.map((w,i)=><span key={i} style={{fontSize:10,padding:"3px 8px",borderRadius:6,background:"rgba(255,184,110,0.08)",border:"1px solid rgba(255,184,110,0.1)",color:"#DDBB88",fontWeight:600}}>{w}</span>)}</div></div>}
      <div style={{display:"grid",gridTemplateColumns:"30px 1fr 72px 72px 42px",gap:8,padding:"4px 0"}}>{["SET","PREV","KG","REPS",""].map((h,j)=><div key={j} style={{fontSize:9,fontWeight:800,color:T.t4,letterSpacing:"1.5px",textAlign:"center"}}>{h}</div>)}</div>
      {sets.map((s,i)=><SR key={i} i={i} prev={prev?.[i]} cur={s} up={u=>{const n=[...sets];n[i]={...u,done:s.done};setSets(n)}} val={()=>validate(i)} done={s.done} isPR={s.kg>0&&prR&&s.kg>prR.kg} fSc={fSc}/>)}
      <button onClick={()=>setSets([...sets,{kg:0,reps:0,done:false}])} style={{width:"100%",padding:"9px",marginTop:8,background:"none",border:`1.5px dashed ${T.bdM}`,borderRadius:9,color:T.t3,fontSize:12,fontWeight:600,cursor:"pointer"}}>+ Set</button>
    </div>}</div>);
}

/* ─── NAV (5 tabs) ─── */
function Nav({active,go}){return(<div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:50,background:"rgba(13,18,32,0.75)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",borderTop:`1px solid ${T.bdM}`,display:"flex",padding:"8px 0 calc(10px + env(safe-area-inset-bottom, 12px))"}}>
  {[{id:"home",i:"⚡",l:"Home"},{id:"daily",i:"💧",l:"Quotidien"},{id:"sessions",i:"🏋️",l:"Séances"},{id:"body",i:"📐",l:"Corps"},{id:"settings",i:"⚙️",l:"Réglages"}].map(x=><div key={x.id} onClick={()=>go(x.id)} style={{flex:1,textAlign:"center",cursor:"pointer",padding:"2px 0"}}><div style={{fontSize:20,marginBottom:3}}>{x.i}</div><div style={{fontSize:10,fontWeight:700,letterSpacing:"0.5px",color:active===x.id?T.blL:T.t4}}>{x.l}</div></div>)}
</div>)}

function Logo({sz:s}){const lg=s==="lg";return(<div><div style={{fontSize:lg?34:17,fontWeight:900,letterSpacing:lg?"1px":"0.5px",lineHeight:1,background:T.ss,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",filter:`drop-shadow(0 0 ${lg?30:14}px rgba(192,208,255,0.25))`}}>ULTRA INSTINCT</div></div>)}

function Spark({hist}){if(!hist||hist.length<2)return null;const v=hist.map(h=>h.kg),mn=Math.min(...v),mx=Math.max(...v),rg=mx-mn||1,w=160,h=40;
  const pts=v.map((val,i)=>`${(i/(v.length-1))*w},${h-((val-mn)/rg)*(h-6)}`).join(" ");
  return(<svg width={w} height={h+2} style={{display:"block"}}><defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#7090FF"/><stop offset="100%" stopColor="#E280FF"/></linearGradient></defs>
    <polyline points={pts} fill="none" stroke="url(#sg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx={(v.length-1)/(v.length-1)*w} cy={h-((v[v.length-1]-mn)/rg)*(h-6)} r="3" fill={T.pk}/></svg>);
}

/* ═══ MAIN APP ═══ */
export default function App(){
  const[scr,setScr]=useState("home");
  const[rKey,setRKey]=useState(null);
  const[start,setStart]=useState(null);
  const[elapsed,setElapsed]=useState(0);
  const[timer,setTimer]=useState(null);
  const[selEx,setSelEx]=useState(null);
  const[sTab,setSTab]=useState("prs");
  const[swaps,setSwaps]=useState(()=>DB.getSwaps());
  const[customObjs,setCustomObjs]=useState(()=>DB.getObjectives());
  const[sessHist,setSessHist]=useState(()=>{const h=DB.getHistory();return h.length>0?h:INIT_HISTORY});
  const[lastDates,setLastDates]=useState(()=>{const d=DB.getLastDates();return Object.keys(d).length>0?d:{...LAST_SESSIONS}});
  const[mensur,setMensur]=useState(()=>{const m=DB.getMensurations();return m.length>0?m:[...INIT_MENSUR]});
  const[workoutData,setWorkoutData]=useState({});
  const[reportText,setReportText]=useState("");
  const[copied,setCopied]=useState(false);
  const[prCount,setPrCount]=useState(0);
  const[sessionNotes,setSessionNotes]=useState("");
  const[settings,setSettings]=useState(()=>DB.getSettings());
  const[exOrder,setExOrder]=useState([]);
  const[slotKeys,setSlotKeys]=useState([]);
  const[showAddEx,setShowAddEx]=useState(false);
  const[addExSearch,setAddExSearch]=useState("");
  const[newExName,setNewExName]=useState("");
  const[newExMuscle,setNewExMuscle]=useState("");
  const[histView,setHistView]=useState("chrono");
  const[histDetail,setHistDetail]=useState(null);
  const[bodyTab,setBodyTab]=useState("dashboard");
  const[showForm,setShowForm]=useState(false);
  const[formData,setFormData]=useState({date:localDate(),poids:"",bf:"",ventre:"",poitrine:"",cuisse:"",bras:"",muscle:"",meta:""});
  const[showReset,setShowReset]=useState(false);
  const[waterToday,setWaterToday]=useState(()=>DB.getWaterToday());
  const[waterInput,setWaterInput]=useState("");
  const[macrosToday,setMacrosToday]=useState(()=>DB.getMacrosToday());
  const[macroForm,setMacroForm]=useState(()=>{const y=DB.getMacrosYesterday();return y?{kcal:y.kcal||"",prot:y.prot||"",gluc:y.gluc||"",lip:y.lip||""}:{kcal:"",prot:"",gluc:"",lip:""}});
  const[dailyTab,setDailyTab]=useState("water");
  const[confirmDel,setConfirmDel]=useState(null);
  const[routines,setRoutines]=useState(()=>{const r=DB.getRoutines();return r||{...INIT_ROUTINES}});
  const[editKey,setEditKey]=useState(null);
  const[editForm,setEditForm]=useState(null);
  const[editExSearch,setEditExSearch]=useState("");
  const ref=useRef(null);
  const slotCounter=useRef(0);

  const fSc=FONT_SIZES[settings.fontSize]||1;
  const waterGoal=settings.waterGoal||3000;
  const dayRef=useRef(localDate());

  // Auto-reset water/macros on day change (check every 30s + on visibility change)
  useEffect(()=>{
    const checkDay=()=>{
      const now=localDate();
      if(now!==dayRef.current){dayRef.current=now;setWaterToday(DB.getWaterToday());setMacrosToday(DB.getMacrosToday());
        const y=DB.getMacrosYesterday();setMacroForm(y?{kcal:y.kcal||"",prot:y.prot||"",gluc:y.gluc||"",lip:y.lip||""}:{kcal:"",prot:"",gluc:"",lip:""})}
    };
    const iv=setInterval(checkDay,30000);
    const onVis=()=>{if(document.visibilityState==="visible")checkDay()};
    document.addEventListener("visibilitychange",onVis);
    return()=>{clearInterval(iv);document.removeEventListener("visibilitychange",onVis)};
  },[]);

  useEffect(()=>{if(scr==="workout"&&start){ref.current=setInterval(()=>setElapsed(Math.floor((Date.now()-start)/1000)),1000);return()=>clearInterval(ref.current)}},[scr,start]);
  useEffect(()=>{DB.setSwaps(swaps)},[swaps]);
  useEffect(()=>{DB.setSettings(settings)},[settings]);
  useEffect(()=>{DB.setRoutines(routines)},[routines]);
  useEffect(()=>{if(rKey&&scr==="workout"){const raw=routines[rKey].exercises;const exs=raw.map(e=>typeof e==="string"?e:e.id);setExOrder(exs);setSlotKeys(exs.map(()=>"s"+(slotCounter.current++)))}},[rKey,scr]);
  useEffect(()=>{
    // Inject custom exercises
    const ce=DB.getCustomExercises();Object.entries(ce).forEach(([id,ex])=>{if(!EX[id])EX[id]={...ex,hist:ex.hist||[]}; else if(ex.hist)EX[id].hist=ex.hist});
    // Merge exHist (saved from sessions) into EX
    const eh=DB.getExtraHist();Object.entries(eh).forEach(([id,entries])=>{if(EX[id]){const existing=EX[id].hist||[];const existingDates=new Set(existing.map(h=>h.d+h.kg+h.r));entries.forEach(e=>{if(!existingDates.has(e.d+e.kg+e.r)){existing.push(e);existingDates.add(e.d+e.kg+e.r)}});EX[id].hist=existing}})
  },[]);

  const handleObjChange=(exId,obj)=>{setCustomObjs(p=>{const n={...p,[exId]:obj};DB.setObjective(exId,obj);return n})};
  const goR=k=>{setRKey(k);setStart(Date.now());setElapsed(0);setWorkoutData({});setPrCount(0);setSessionNotes("");setShowAddEx(false);setAddExSearch("");setScr("workout")};
  const handleExData=(sk,data)=>{setWorkoutData(p=>({...p,[sk]:data}))};
  const moveEx=(idx,dir)=>{const t=idx+dir;setExOrder(p=>{const n=[...p];if(t<0||t>=n.length)return p;[n[idx],n[t]]=[n[t],n[idx]];return n});setSlotKeys(p=>{const n=[...p];if(t<0||t>=p.length)return p;[n[idx],n[t]]=[n[t],n[idx]];return n})};
  const addExToSession=(exId)=>{setExOrder(p=>[...p,exId]);setSlotKeys(p=>[...p,"s"+(slotCounter.current++)]);setShowAddEx(false);setAddExSearch("");setNewExName("");setNewExMuscle("")};
  const addCustomEx=()=>{if(!newExName.trim())return;const id="custom_"+Date.now();EX[id]={name:newExName.trim(),muscle:newExMuscle.trim()||"Custom",rest:120,hist:[]};DB.addCustomExercise(id,EX[id]);addExToSession(id)};
  const removeEx=(idx)=>{setExOrder(p=>p.filter((_,i)=>i!==idx));setSlotKeys(p=>p.filter((_,i)=>i!==idx))};

  const finish=()=>{
    clearInterval(ref.current);setTimer(null);
    const today=localDate();const dur=fm(elapsed);
    const prs=Object.values(workoutData).filter(d=>d.hasPR).length;setPrCount(prs);
    const detail=Object.values(workoutData).filter(d=>d.sets.some(s=>s.done)).map(d=>({name:d.name,muscle:d.muscle,bestKg:d.bestSet?.kg||0,bestReps:d.bestSet?.reps||0,hasPR:d.hasPR}));
    const session={id:Date.now(),routine:rKey,date:today,duration:dur,exercises:Object.keys(workoutData).length||exOrder.length,prs,detail};
    setSessHist(DB.addSession(session));setLastDates(DB.setLastDate(rKey,today));
    Object.entries(workoutData).forEach(([_,d])=>{if(d.bestSet&&d.bestSet.kg>0){DB.addExerciseEntry(d.activeId,{d:today,kg:d.bestSet.kg,r:d.bestSet.reps});if(EX[d.activeId]){if(!EX[d.activeId].hist)EX[d.activeId].hist=[];EX[d.activeId].hist.push({d:today,kg:d.bestSet.kg,r:d.bestSet.reps})}}});
    const r=routines[rKey];const exR=Object.values(workoutData).filter(d=>d.sets.some(s=>s.done));
    setReportText(generateReport(r.name,r.emoji,dur,exR,new Date().toLocaleDateString("fr-FR"),""));setScr("summary");
  };
  const handleCopyReport=async()=>{const r=routines[rKey];const exR=Object.values(workoutData).filter(d=>d.sets.some(s=>s.done));const fresh=generateReport(r.name,r.emoji,fm(elapsed),exR,new Date().toLocaleDateString("fr-FR"),sessionNotes);setReportText(fresh);const ok=await copyReport(fresh);setCopied(ok);setTimeout(()=>setCopied(false),2500)};
  const resetToHome=()=>{setScr("home");setRKey(null);setStart(null);setElapsed(0);setWorkoutData({});setReportText("");setSessionNotes("");setExOrder([]);setSlotKeys([]);setShowAddEx(false)};
  const tRest=useCallback((dur,name)=>setTimer({duration:dur,exerciseName:name}),[]);
  const handleSwap=(origId,newId)=>setSwaps(p=>({...p,[origId]:newId===origId?undefined:newId}));
  const routine=rKey?routines[rKey]:null;

  const addWater=(ml)=>{setWaterToday(DB.addWater(ml))};
  const undoWater=()=>{setWaterToday(DB.removeLastWater())};
  const recentAmounts=DB.getRecentWaterAmounts();
  const saveMacros=()=>{const data={kcal:parseFloat(macroForm.kcal)||0,prot:parseFloat(macroForm.prot)||0,gluc:parseFloat(macroForm.gluc)||0,lip:parseFloat(macroForm.lip)||0};setMacrosToday(DB.setMacrosToday(data))};
  const deleteSession=(id)=>{setSessHist(DB.deleteSession(id));setConfirmDel(null)};

  // Routine editor handlers
  const openEditor=(key)=>{
    const r=key?{...routines[key],exercises:[...routines[key].exercises]}:
      {name:"",emoji:"💪",tag:"",day:"",warmup:"",sets:4,exercises:[],alts:{}};
    setEditKey(key||"new_"+Date.now());setEditForm(r);setEditExSearch("");setScr("editor");
  };
  const saveRoutine=()=>{
    if(!editForm.name.trim())return;
    const key=editKey.startsWith("new_")?editKey:editKey;
    setRoutines(p=>{const n={...p,[key]:editForm};return n});
    setScr("home");setEditKey(null);setEditForm(null);
  };
  const deleteRoutine=(key)=>{setRoutines(p=>{const n={...p};delete n[key];return n});setScr("home");setEditKey(null);setEditForm(null)};
  const edMoveEx=(idx,dir)=>{const t=idx+dir;setEditForm(p=>{const exs=[...p.exercises];if(t<0||t>=exs.length)return p;[exs[idx],exs[t]]=[exs[t],exs[idx]];return{...p,exercises:exs}})};
  const edAddEx=(exId)=>{setEditForm(p=>({...p,exercises:[...p.exercises,{id:exId,sets:p.sets}]}));setEditExSearch("")};
  const edRemoveEx=(idx)=>{setEditForm(p=>({...p,exercises:p.exercises.filter((_,i)=>i!==idx)}))};
  const edSetSets=(idx,n)=>{setEditForm(p=>{const exs=[...p.exercises];const e=exs[idx];exs[idx]=typeof e==="object"?{...e,sets:n}:{id:e,sets:n};return{...p,exercises:exs}})};
  const dupRoutine=(key)=>{const r=routines[key];const nk="dup_"+Date.now();setRoutines(p=>({...p,[nk]:{...r,name:r.name+" (copie)",exercises:[...r.exercises],alts:{...r.alts}}}))};

  const doExport=()=>{const data=DB.exportAll();const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`ui-backup-${localDate()}.json`;document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url);DB.setLastExport();setSettings(s=>({...s}))};
  const doImport=(e)=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=(ev)=>{try{DB.importAll(JSON.parse(ev.target.result));window.location.reload()}catch{alert("Fichier invalide")}};reader.readAsText(file)};
  const doImportHealth=(e)=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=(ev)=>{try{DB.importHealth(JSON.parse(ev.target.result));window.location.reload()}catch{alert("Fichier invalide")}};reader.readAsText(file)};
  const doImportRoutines=(e)=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=(ev)=>{try{const data=JSON.parse(ev.target.result);const newR=DB.importRoutinesFile(data);
    // Also inject exercises into runtime EX
    if(data.exercises)Object.entries(data.exercises).forEach(([id,ex])=>{EX[id]=ex});
    setRoutines(newR);setCustomObjs(DB.getObjectives());setScr("home");alert("Programme importé !")}catch(err){alert("Fichier invalide: "+err.message)}};reader.readAsText(file)};

  // Nutrition ↔ Performance correlation
  const getNutriBefore=(date,days=3)=>{
    const allMacros=DB.getMacrosHistory(90);
    const d=new Date(date+"T12:00:00");
    const result=[];
    for(let i=1;i<=days;i++){const dd=new Date(d);dd.setDate(dd.getDate()-i);const key=`${dd.getFullYear()}-${String(dd.getMonth()+1).padStart(2,"0")}-${String(dd.getDate()).padStart(2,"0")}`;const m=allMacros.find(x=>x.date===key);if(m)result.push(m)}
    if(result.length===0)return null;
    return{kcal:Math.round(result.reduce((s,m)=>s+m.kcal,0)/result.length),prot:Math.round(result.reduce((s,m)=>s+m.prot,0)/result.length),gluc:Math.round(result.reduce((s,m)=>s+m.gluc,0)/result.length),lip:Math.round(result.reduce((s,m)=>s+m.lip,0)/result.length),days:result.length};
  };
  const nutriLevel=(macros)=>{if(!macros)return{icon:"⚪",label:"N/A",color:T.t4};if(macros.kcal>=2300&&macros.prot>=160)return{icon:"🟢",label:"OK",color:T.gn};if(macros.kcal>=1800&&macros.prot>=120)return{icon:"🟡",label:"Moyen",color:T.wa};return{icon:"🔴",label:"Faible",color:T.pk}};

  const generateDailyReport=()=>{
    const wh=DB.getWaterHistory(7);const mh=DB.getMacrosHistory(7);const latM=mensur.length>0?mensur[mensur.length-1]:null;const rs=sessHist.slice(0,4);
    let r=`# 📊 Ultra Instinct — Rapport Hebdo\n**Date** : ${new Date().toLocaleDateString("fr-FR")}\n**Countdown** : ${daysLeft()} jours\n\n## 💧 Hydratation (7j)\n`;
    wh.forEach(d=>{r+=`${dateFR(d.date)} : ${waterL(d.total)}L\n`});
    r+=`\n## 🍎 Macros (7j)\n`;mh.forEach(d=>{r+=`${dateFR(d.date)} : ${d.kcal}kcal · P${d.prot}g · G${d.gluc}g · L${d.lip}g\n`});
    if(mh.length>0){const avgK=Math.round(mh.reduce((s,m)=>s+m.kcal,0)/mh.length);const avgP=Math.round(mh.reduce((s,m)=>s+m.prot,0)/mh.length);r+=`**Moyenne** : ${avgK}kcal · P${avgP}g\n`}
    if(latM){r+=`\n## 📐 Mensurations (${dateFR(latM.date)})\n`;MENSUR_FIELDS.forEach(f=>{if(latM[f.key]!=null)r+=`${f.label} : ${latM[f.key]} ${f.unit}\n`})}
    r+=`\n## 🏋️ Dernières séances\n`;
    rs.forEach(s=>{
      const rt=routines[s.routine];const nb=getNutriBefore(s.date);const nl=nutriLevel(nb);
      r+=`${dateFR(s.date)} · ${rt?.emoji} ${rt?.name} · ${s.duration} · ${s.prs} PR${s.prs>1?"s":""}`;
      if(nb)r+=` · Nutri J-3: ${nl.icon} ${nb.kcal}kcal P${nb.prot}g`;
      r+=`\n`;
      if(s.detail)s.detail.forEach(d=>{r+=`  → ${d.name}: ${d.bestKg}kg × ${d.bestReps}${d.hasPR?" 🏆":""}\n`});
    });
    // Correlation insights
    const sessWithNutri=sessHist.slice(0,20).map(s=>({...s,nutri:getNutriBefore(s.date)})).filter(s=>s.nutri);
    if(sessWithNutri.length>=4){
      const withPR=sessWithNutri.filter(s=>s.prs>0);const noPR=sessWithNutri.filter(s=>s.prs===0);
      if(withPR.length>0&&noPR.length>0){
        const avgPR=Math.round(withPR.reduce((s,x)=>s+x.nutri.kcal,0)/withPR.length);
        const avgNoPR=Math.round(noPR.reduce((s,x)=>s+x.nutri.kcal,0)/noPR.length);
        const avgProtPR=Math.round(withPR.reduce((s,x)=>s+x.nutri.prot,0)/withPR.length);
        const avgProtNoPR=Math.round(noPR.reduce((s,x)=>s+x.nutri.prot,0)/noPR.length);
        r+=`\n## 🔬 Corrélations Nutrition ↔ Performance\n`;
        r+=`Séances avec PR (${withPR.length}) : moy. ${avgPR}kcal · P${avgProtPR}g (J-3)\n`;
        r+=`Séances sans PR (${noPR.length}) : moy. ${avgNoPR}kcal · P${avgProtNoPR}g (J-3)\n`;
        const diff=avgPR-avgNoPR;
        if(diff>100)r+=`→ **+${diff}kcal** en moyenne avant les séances avec PR\n`;
        else if(diff<-100)r+=`→ Pas de lien clair entre surplus calorique et PRs\n`;
        else r+=`→ Nutrition similaire, les PRs viennent d'ailleurs (récup, programme, forme)\n`;
      }
    }
    return r+`\n---\n*Ultra Instinct v${APP_VERSION}*`;
  };
  const copyDailyReport=async()=>{const ok=await copyReport(generateDailyReport());setCopied(ok);setTimeout(()=>setCopied(false),2500)};

  const css=`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
    *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}input[type=number]{-moz-appearance:textfield}body{margin:0;background:${T.bg}}
    @keyframes fadeUp{from{}to{}}@keyframes auraFloat{0%,100%{opacity:0.5;transform:translateY(0)}50%{opacity:0.9;transform:translateY(-8px)}}
    @keyframes logoGlow{0%,100%{filter:drop-shadow(0 0 20px rgba(192,208,255,0.15))}50%{filter:drop-shadow(0 0 35px rgba(192,208,255,0.3))}}`;
  const safeTop="env(safe-area-inset-top, 20px)";
  const shell={fontFamily:"'Outfit',-apple-system,sans-serif",background:T.bg,color:T.w,minHeight:"100vh",paddingBottom:"calc(80px + env(safe-area-inset-bottom, 0px))",position:"relative"};
  const card={padding:"14px 16px",borderRadius:14,background:T.bgCard,border:`1px solid ${T.bd}`};
  const tabBtn=(active)=>({flex:1,padding:"9px 8px",borderRadius:10,cursor:"pointer",fontSize:sz(12,fSc),fontWeight:700,background:active?"rgba(112,144,255,0.08)":"rgba(180,200,255,0.02)",border:`1px solid ${active?"rgba(112,144,255,0.2)":T.bd}`,color:active?T.blL:T.t3});

  /* ═══ HOME ═══ */
  if(scr==="home"){
    const wPct=Math.min(waterToday.total/waterGoal*100,100);
    return(<div style={shell}><style>{css}</style>
    {/* Goku full background */}
    <img src="/goku_home.jpg" alt="" style={{position:"fixed",top:"12%",left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:500,height:"auto",opacity:0.4,pointerEvents:"none",zIndex:0,maskImage:"linear-gradient(to bottom, black 50%, transparent 90%)",WebkitMaskImage:"linear-gradient(to bottom, black 50%, transparent 90%)"}}/>
    <div style={{position:"relative",zIndex:1}}>
      {/* Logo + Countdown */}
      <div style={{textAlign:"center",paddingTop:`calc(30px + ${safeTop})`,paddingBottom:12}}>
        <Logo sz="lg"/>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,marginTop:14,padding:"6px 16px",borderRadius:10,background:"rgba(112,144,255,0.08)",border:"1px solid rgba(112,144,255,0.12)"}}>
          <span style={{fontSize:sz(20,fSc),fontWeight:900,background:T.ss,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{daysLeft()}</span>
          <span style={{fontSize:sz(10,fSc),color:T.t3,fontWeight:600}}>jours · 27/04/2027</span>
        </div>
      </div>

      {/* Daily summary */}
      <div style={{padding:"0 16px",marginBottom:16,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        <div style={{...card,animation:"fadeUp 0.4s ease 0.05s both",cursor:"pointer"}} onClick={()=>setScr("daily")}>
          <div style={{fontSize:9,fontWeight:800,color:T.cy,letterSpacing:"1px",textTransform:"uppercase",marginBottom:6}}>💧 Eau</div>
          <div style={{fontSize:sz(18,fSc),fontWeight:900,color:T.cy}}>{waterL(waterToday.total)}<span style={{fontSize:sz(11,fSc),color:T.t3}}>/{(waterGoal/1000).toFixed(0)}L</span></div>
          <div style={{height:4,borderRadius:2,background:"rgba(92,232,250,0.08)",marginTop:6,overflow:"hidden"}}><div style={{height:"100%",borderRadius:2,background:T.cy,width:`${wPct}%`}}/></div></div>
        <div style={{...card,animation:"fadeUp 0.4s ease 0.1s both",cursor:"pointer"}} onClick={()=>setScr("daily")}>
          <div style={{fontSize:9,fontWeight:800,color:T.wa,letterSpacing:"1px",textTransform:"uppercase",marginBottom:6}}>🍎 Macros</div>
          {macrosToday?<><div style={{fontSize:sz(18,fSc),fontWeight:900,color:T.wa}}>{macrosToday.kcal}<span style={{fontSize:sz(11,fSc),color:T.t3}}> kcal</span></div>
            <div style={{fontSize:sz(10,fSc),color:T.t3,marginTop:2}}>P{macrosToday.prot}g · G{macrosToday.gluc}g · L{macrosToday.lip}g</div></>
          :<div style={{fontSize:sz(12,fSc),color:T.t4,fontWeight:600}}>Non renseigné</div>}</div></div>
      {/* Routines */}
      <div style={{padding:"0 16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{fontSize:10,fontWeight:800,color:T.t4,letterSpacing:"3px",textTransform:"uppercase",paddingLeft:2}}>Routines</div>
          <button onClick={()=>openEditor(null)} style={{padding:"5px 12px",borderRadius:8,cursor:"pointer",background:"rgba(168,140,255,0.08)",border:"1px solid rgba(168,140,255,0.15)",color:T.vi,fontSize:10,fontWeight:700}}>+ Créer</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {Object.entries(routines).map(([key,r],idx)=>{const ld=lastDates[key];return(
            <div key={key} style={{position:"relative",animation:`fadeUp 0.4s ease ${0.15+idx*0.08}s both`}}>
              <button onClick={()=>goR(key)} style={{width:"100%",padding:"20px 16px 16px",borderRadius:16,cursor:"pointer",background:T.bgCard,border:`1px solid ${T.bd}`,textAlign:"left",position:"relative"}}>
                <div style={{position:"relative"}}>
                  <div style={{fontSize:28,marginBottom:6}}>{r.emoji}</div>
                  <div style={{fontSize:9,fontWeight:700,letterSpacing:"1.5px",color:T.bl,marginBottom:6}}>{r.tag}</div>
                  <div style={{fontSize:sz(17,fSc),fontWeight:800,color:T.w}}>{r.name}</div>
                  <div style={{fontSize:sz(11,fSc),color:T.t3,marginTop:3}}>{r.exercises.length} exos · {r.exercises.reduce((s,e)=>s+(typeof e==="object"&&e.sets?e.sets:r.sets),0)} séries</div>
                  {ld&&<div style={{fontSize:sz(10,fSc),color:T.t4,marginTop:6,fontWeight:600,display:"flex",alignItems:"center",gap:4}}><span style={{color:T.vi}}>●</span> {ago(ld)}</div>}
                </div></button>
              <button onClick={()=>openEditor(key)} style={{position:"absolute",top:8,right:8,width:28,height:28,borderRadius:8,cursor:"pointer",background:"rgba(168,140,255,0.1)",border:"1px solid rgba(168,140,255,0.2)",color:T.vi,fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",padding:0,zIndex:2}}>✏️</button>
            </div>)})}
        </div></div>
    </div><Nav active="home" go={setScr}/></div>)}

  /* ═══ EDITOR ═══ */
  if(scr==="editor"&&editForm){
    const allExForEdit=Object.entries(EX).map(([id,e])=>({id,name:e.name,muscle:e.muscle}));
    const editF=editExSearch.length>0?allExForEdit.filter(e=>e.name.toLowerCase().includes(editExSearch.toLowerCase())||e.muscle.toLowerCase().includes(editExSearch.toLowerCase())):[];
    const isNew=editKey.startsWith("new_")||editKey.startsWith("dup_");
    const emojis=["💪","🦵","🏋️","⚡","🔥","💎","🎯","🚀","💥","🏆"];
    return(<div style={shell}><style>{css}</style>
    <img src="/goku_home.jpg" alt="" style={{position:"fixed",top:"12%",left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:500,height:"auto",opacity:0.4,pointerEvents:"none",zIndex:0,maskImage:"linear-gradient(to bottom, black 50%, transparent 90%)",WebkitMaskImage:"linear-gradient(to bottom, black 50%, transparent 90%)"}}/>
    <div style={{padding:`calc(16px + ${safeTop}) 20px 16px`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={()=>{setScr("home");setEditKey(null);setEditForm(null)}} style={{width:34,height:34,borderRadius:9,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(180,200,255,0.04)",border:`1px solid ${T.bdM}`,color:T.t2,fontSize:16,fontWeight:700,padding:0}}>←</button>
          <h2 style={{margin:0,fontSize:sz(20,fSc),fontWeight:800,color:T.w}}>{isNew?"Nouvelle routine":"Modifier routine"}</h2></div>
        <button onClick={saveRoutine} disabled={!editForm.name.trim()} style={{padding:"8px 18px",borderRadius:10,cursor:editForm.name.trim()?"pointer":"default",background:editForm.name.trim()?"rgba(92,232,250,0.1)":"rgba(180,200,255,0.03)",border:`1px solid ${editForm.name.trim()?"rgba(92,232,250,0.25)":T.bd}`,color:editForm.name.trim()?T.cy:T.t4,fontSize:sz(13,fSc),fontWeight:700}}>✓ Sauver</button>
      </div></div>
    <div style={{padding:"0 16px",paddingBottom:80}}>
      {/* Name + Emoji */}
      <div style={{...card,marginBottom:10}}>
        <div style={{fontSize:10,fontWeight:800,color:T.vi,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:10}}>Identité</div>
        <div style={{display:"flex",gap:8,marginBottom:10}}>
          <input type="text" placeholder="Nom de la routine" value={editForm.name} onChange={e=>setEditForm(p=>({...p,name:e.target.value}))}
            style={{flex:1,padding:"10px 12px",borderRadius:9,background:T.bgInput,border:`1px solid ${T.bdM}`,color:T.w,fontSize:sz(15,fSc),fontWeight:700,outline:"none",fontFamily:"inherit"}}/>
        </div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:10}}>
          {emojis.map(em=><button key={em} onClick={()=>setEditForm(p=>({...p,emoji:em}))} style={{width:36,height:36,borderRadius:8,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",background:editForm.emoji===em?"rgba(168,140,255,0.15)":"rgba(180,200,255,0.03)",border:`1px solid ${editForm.emoji===em?"rgba(168,140,255,0.3)":T.bd}`}}>{em}</button>)}
        </div>
        <input type="text" placeholder="Tag (ex: MARDI · DOS + PECS)" value={editForm.tag} onChange={e=>setEditForm(p=>({...p,tag:e.target.value}))}
          style={{width:"100%",padding:"9px 12px",borderRadius:9,background:T.bgInput,border:`1px solid ${T.bdM}`,color:T.bl,fontSize:sz(11,fSc),fontWeight:700,outline:"none",fontFamily:"inherit",letterSpacing:"1px",marginBottom:8}}/>
        <div style={{display:"flex",gap:8}}>
          <input type="text" placeholder="Jour" value={editForm.day} onChange={e=>setEditForm(p=>({...p,day:e.target.value}))}
            style={{flex:1,padding:"9px 12px",borderRadius:9,background:T.bgInput,border:`1px solid ${T.bdM}`,color:T.w,fontSize:sz(13,fSc),outline:"none",fontFamily:"inherit"}}/>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:sz(11,fSc),color:T.t3}}>Séries</span>
            {[3,4,5].map(n=><button key={n} onClick={()=>setEditForm(p=>({...p,sets:n}))} style={{width:32,height:32,borderRadius:8,cursor:"pointer",fontSize:sz(13,fSc),fontWeight:700,background:editForm.sets===n?"rgba(112,144,255,0.12)":"rgba(180,200,255,0.03)",border:`1px solid ${editForm.sets===n?"rgba(112,144,255,0.3)":T.bd}`,color:editForm.sets===n?T.blL:T.t3}}>{n}</button>)}</div>
        </div>
      </div>

      {/* Warmup */}
      <div style={{...card,marginBottom:10}}>
        <div style={{fontSize:10,fontWeight:800,color:T.wa,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:8}}>🔥 Échauffement général</div>
        <input type="text" placeholder="Ex: Rameur 5 min → Mobilité épaules" value={editForm.warmup} onChange={e=>setEditForm(p=>({...p,warmup:e.target.value}))}
          style={{width:"100%",padding:"9px 12px",borderRadius:9,background:T.bgInput,border:`1px solid ${T.bdM}`,color:T.w,fontSize:sz(12,fSc),outline:"none",fontFamily:"inherit"}}/>
      </div>

      {/* Exercises */}
      <div style={{...card,marginBottom:10}}>
        <div style={{fontSize:10,fontWeight:800,color:T.bl,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:10}}>Exercices ({editForm.exercises.length})</div>
        {editForm.exercises.map((exEntry,i)=>{const eid=typeof exEntry==="object"?exEntry.id:exEntry;const exSets=typeof exEntry==="object"?exEntry.sets:editForm.sets;const ex=EX[eid];return(
          <div key={eid+i} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 0",borderBottom:`1px solid ${T.bd}`}}>
            <div style={{display:"flex",flexDirection:"column",gap:2}}>
              <button onClick={()=>edMoveEx(i,-1)} disabled={i===0} style={{width:22,height:18,borderRadius:4,cursor:i===0?"default":"pointer",background:"rgba(180,200,255,0.04)",border:`1px solid ${T.bd}`,color:i===0?T.t4:T.t2,fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",padding:0,opacity:i===0?0.3:1}}>↑</button>
              <button onClick={()=>edMoveEx(i,1)} disabled={i===editForm.exercises.length-1} style={{width:22,height:18,borderRadius:4,cursor:i===editForm.exercises.length-1?"default":"pointer",background:"rgba(180,200,255,0.04)",border:`1px solid ${T.bd}`,color:i===editForm.exercises.length-1?T.t4:T.t2,fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",padding:0,opacity:i===editForm.exercises.length-1?0.3:1}}>↓</button>
            </div>
            <div style={{flex:1}}><span style={{fontSize:sz(13,fSc),fontWeight:600,color:T.w}}>{ex?.name||eid}</span><span style={{fontSize:10,color:T.t4,marginLeft:6}}>{ex?.muscle||""}</span></div>
            <div style={{display:"flex",alignItems:"center",gap:3}}>
              {[1,2,3,4,5].map(n=><button key={n} onClick={()=>edSetSets(i,n)} style={{width:20,height:20,borderRadius:5,cursor:"pointer",fontSize:9,fontWeight:700,background:exSets===n?"rgba(112,144,255,0.15)":"rgba(180,200,255,0.03)",border:`1px solid ${exSets===n?"rgba(112,144,255,0.3)":T.bd}`,color:exSets===n?T.blL:T.t4,display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>{n}</button>)}
            </div>
            <button onClick={()=>edRemoveEx(i)} style={{width:24,height:24,borderRadius:6,cursor:"pointer",background:"rgba(226,128,255,0.06)",border:"1px solid rgba(226,128,255,0.15)",color:T.pk,fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>✕</button>
          </div>)})}

        {/* Add exercise */}
        <div style={{marginTop:10}}>
          <input type="text" placeholder="🔍 Ajouter un exercice..." value={editExSearch} onChange={e=>setEditExSearch(e.target.value)}
            style={{width:"100%",padding:"9px 12px",borderRadius:9,background:T.bgInput,border:`1px solid ${T.bdM}`,color:T.w,fontSize:13,outline:"none",fontFamily:"inherit",marginBottom:6}}/>
          {editF.length>0&&<div style={{maxHeight:150,overflowY:"auto",display:"flex",flexDirection:"column",gap:3}}>
            {editF.slice(0,8).map(ex=><button key={ex.id} onClick={()=>edAddEx(ex.id)} style={{padding:"7px 10px",borderRadius:7,cursor:"pointer",fontSize:11,fontWeight:600,textAlign:"left",background:"rgba(180,200,255,0.03)",border:`1px solid ${T.bd}`,color:T.t2,display:"flex",justifyContent:"space-between"}}><span>{ex.name}</span><span style={{fontSize:9,color:T.t4}}>{ex.muscle}</span></button>)}</div>}
        </div>
      </div>

      {/* Actions */}
      <div style={{display:"flex",gap:8}}>
        {!isNew&&<button onClick={()=>dupRoutine(editKey)} style={{flex:1,padding:"12px",borderRadius:10,cursor:"pointer",background:"rgba(168,140,255,0.08)",border:"1px solid rgba(168,140,255,0.2)",color:T.vi,fontSize:sz(12,fSc),fontWeight:700}}>📋 Dupliquer</button>}
        {!isNew&&<button onClick={()=>{if(confirm("Supprimer cette routine ?"))deleteRoutine(editKey)}} style={{flex:1,padding:"12px",borderRadius:10,cursor:"pointer",background:"rgba(226,128,255,0.06)",border:"1px solid rgba(226,128,255,0.2)",color:T.pk,fontSize:sz(12,fSc),fontWeight:700}}>🗑️ Supprimer</button>}
      </div>
    </div></div>)}

  /* ═══ DAILY ═══ */
  if(scr==="daily"){
    const wPct=Math.min(waterToday.total/waterGoal*100,100);
    const wHist=DB.getWaterHistory(7);const maxW=Math.max(...wHist.map(d=>d.total),waterGoal);
    return(<div style={shell}><style>{css}</style>
    <img src="/goku_home.jpg" alt="" style={{position:"fixed",top:"12%",left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:500,height:"auto",opacity:0.4,pointerEvents:"none",zIndex:0,maskImage:"linear-gradient(to bottom, black 50%, transparent 90%)",WebkitMaskImage:"linear-gradient(to bottom, black 50%, transparent 90%)"}}/>
    <div style={{padding:`calc(16px + ${safeTop}) 20px 16px`}}><Logo sz="sm"/><h2 style={{margin:"12px 0 0",fontSize:sz(22,fSc),fontWeight:800,color:T.w}}>Quotidien</h2></div>
    <div style={{display:"flex",padding:"0 16px",gap:6,marginBottom:16}}>
      {[{id:"water",l:"💧 Eau"},{id:"macros",l:"🍎 Macros"},{id:"report",l:"📋 Rapport"}].map(t=><button key={t.id} onClick={()=>setDailyTab(t.id)} style={tabBtn(dailyTab===t.id)}>{t.l}</button>)}</div>
    <div style={{padding:"0 16px",paddingBottom:80}}>
      {dailyTab==="water"&&<div>
        <div style={{...card,textAlign:"center",marginBottom:12,animation:"fadeUp 0.3s ease both"}}>
          <div style={{fontSize:sz(42,fSc),fontWeight:900,color:T.cy}}>{waterL(waterToday.total)}<span style={{fontSize:sz(16,fSc),color:T.t3}}>L</span></div>
          <div style={{fontSize:sz(11,fSc),color:T.t3,marginTop:2}}>{Math.round(wPct)}% · objectif {(waterGoal/1000).toFixed(0)}L</div>
          <div style={{height:8,borderRadius:4,background:"rgba(92,232,250,0.08)",marginTop:12,overflow:"hidden"}}><div style={{height:"100%",borderRadius:4,background:wPct>=100?"linear-gradient(90deg,#5CE8FA,#8AE8A0)":T.cy,width:`${wPct}%`,transition:"width 0.3s"}}/></div></div>
        <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
          {(recentAmounts.length>0?recentAmounts:[250,500,750]).map(ml=>(
            <button key={ml} onClick={()=>addWater(ml)} style={{flex:"1 0 60px",padding:"12px 8px",borderRadius:10,cursor:"pointer",textAlign:"center",background:"rgba(92,232,250,0.06)",border:"1px solid rgba(92,232,250,0.15)",color:T.cy,fontSize:sz(14,fSc),fontWeight:700}}>{ml}ml</button>))}</div>
        <div style={{display:"flex",gap:6,marginBottom:12}}>
          <input type="number" inputMode="numeric" placeholder="Volume en ml" value={waterInput} onChange={e=>setWaterInput(e.target.value)} style={{flex:1,padding:"10px 12px",borderRadius:9,background:T.bgInput,border:`1px solid ${T.bdM}`,color:T.w,fontSize:sz(14,fSc),outline:"none",fontFamily:"inherit"}}/>
          <button onClick={()=>{const v=parseInt(waterInput);if(v>0){addWater(v);setWaterInput("")}}} style={{padding:"10px 20px",borderRadius:9,cursor:"pointer",background:"rgba(92,232,250,0.1)",border:"1px solid rgba(92,232,250,0.25)",color:T.cy,fontSize:sz(13,fSc),fontWeight:700}}>+ Eau</button></div>
        {waterToday.logs.length>0&&<button onClick={undoWater} style={{marginBottom:16,padding:"6px 14px",borderRadius:8,cursor:"pointer",background:"rgba(180,200,255,0.04)",border:`1px solid ${T.bd}`,color:T.t3,fontSize:11,fontWeight:600}}>↩ Annuler dernier</button>}
        <div style={{...card,animation:"fadeUp 0.3s ease 0.1s both"}}>
          <div style={{fontSize:10,fontWeight:800,color:T.t4,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:12}}>7 derniers jours</div>
          <div style={{display:"flex",alignItems:"flex-end",gap:6,height:100}}>
            {wHist.map((d,i)=>{const pct=maxW>0?(d.total/maxW)*100:0;const day=new Date(d.date+"T12:00:00").toLocaleDateString("fr-FR",{weekday:"short"}).charAt(0).toUpperCase();return(
              <div key={i} style={{flex:1,textAlign:"center"}}><div style={{fontSize:9,fontWeight:700,color:d.total>=waterGoal?T.cy:T.t3,marginBottom:4}}>{waterL(d.total)}</div>
                <div style={{height:70,borderRadius:4,background:"rgba(92,232,250,0.06)",display:"flex",alignItems:"flex-end",overflow:"hidden"}}><div style={{width:"100%",height:`${pct}%`,borderRadius:4,background:d.total>=waterGoal?"linear-gradient(180deg,#5CE8FA,#8AE8A0)":"rgba(92,232,250,0.3)",transition:"height 0.3s"}}/></div>
                <div style={{fontSize:9,fontWeight:700,color:T.t4,marginTop:4}}>{day}</div></div>)})}</div></div>
      </div>}
      {dailyTab==="macros"&&<div>
        <div style={{...card,marginBottom:12,animation:"fadeUp 0.3s ease both"}}>
          <div style={{fontSize:10,fontWeight:800,color:T.wa,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:12}}>🍎 Macros du jour</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[{k:"kcal",l:"Calories",u:"kcal",c:T.wa},{k:"prot",l:"Protéines",u:"g",c:T.pk},{k:"gluc",l:"Glucides",u:"g",c:T.bl},{k:"lip",l:"Lipides",u:"g",c:T.vi}].map(f=>(
              <div key={f.k}><label style={{fontSize:10,color:T.t3,fontWeight:600,display:"block",marginBottom:3}}>{f.l} ({f.u})</label>
                <input type="number" inputMode="decimal" value={macroForm[f.k]} onChange={e=>setMacroForm(p=>({...p,[f.k]:e.target.value}))} placeholder={macrosToday?.[f.k]?.toString()||""} style={{width:"100%",padding:"10px",borderRadius:9,background:T.bgInput,border:`1px solid ${T.bdM}`,color:f.c,fontSize:sz(16,fSc),fontWeight:700,outline:"none",fontFamily:"inherit",textAlign:"center"}}/></div>))}</div>
          <button onClick={saveMacros} style={{width:"100%",marginTop:14,padding:"12px",borderRadius:10,cursor:"pointer",background:"rgba(255,184,110,0.1)",border:"1.5px solid rgba(255,184,110,0.28)",color:T.wa,fontSize:sz(14,fSc),fontWeight:700}}>✓ Enregistrer</button></div>
        {macrosToday&&<div style={{...card,animation:"fadeUp 0.3s ease 0.05s both"}}>
          <div style={{fontSize:10,fontWeight:800,color:T.t4,letterSpacing:"1px",textTransform:"uppercase",marginBottom:8}}>Résumé du jour</div>
          <div style={{display:"flex",justifyContent:"space-around"}}>
            {[{v:macrosToday.kcal,l:"kcal",c:T.wa},{v:macrosToday.prot,l:"P",c:T.pk},{v:macrosToday.gluc,l:"G",c:T.bl},{v:macrosToday.lip,l:"L",c:T.vi}].map((x,i)=>(
              <div key={i} style={{textAlign:"center"}}><div style={{fontSize:sz(20,fSc),fontWeight:900,color:x.c}}>{x.v}</div><div style={{fontSize:9,color:T.t3}}>{x.l}</div></div>))}</div></div>}
      </div>}
      {dailyTab==="report"&&<div>
        <div style={{...card,animation:"fadeUp 0.3s ease both"}}>
          <div style={{fontSize:sz(15,fSc),fontWeight:800,marginBottom:6,background:T.ss,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>📋 Rapport hebdo</div>
          <div style={{fontSize:sz(12,fSc),color:T.t2,marginBottom:12,lineHeight:1.6}}>Eau, macros, mensurations et séances des 7 derniers jours</div>
          <button onClick={copyDailyReport} style={{width:"100%",padding:"13px",borderRadius:10,cursor:"pointer",background:copied?"rgba(92,232,250,0.15)":"rgba(112,144,255,0.1)",border:`1.5px solid ${copied?"rgba(92,232,250,0.35)":"rgba(112,144,255,0.28)"}`,color:copied?T.cy:T.blL,fontSize:sz(14,fSc),fontWeight:700,transition:"all 0.3s"}}>{copied?"✅ Copié !":"📋 Copier le rapport"}</button></div>
      </div>}
    </div><Nav active="daily" go={setScr}/></div>)}

  /* ═══ WORKOUT ═══ */
  if(scr==="workout"){
    const allExForAdd=Object.entries(EX).map(([id,e])=>({id,name:e.name,muscle:e.muscle}));
    const addF=addExSearch.length>0?allExForAdd.filter(e=>e.name.toLowerCase().includes(addExSearch.toLowerCase())||e.muscle.toLowerCase().includes(addExSearch.toLowerCase())):[];
    return(<div style={shell}><style>{css}</style>
    <div style={{position:"sticky",top:0,zIndex:50,padding:`calc(10px + ${safeTop}) 16px 10px`,background:"rgba(13,18,32,0.7)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",borderBottom:`1px solid ${T.bdM}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={resetToHome} style={{width:34,height:34,borderRadius:9,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(180,200,255,0.04)",border:`1px solid ${T.bdM}`,color:T.t2,fontSize:16,fontWeight:700,padding:0}}>←</button>
          <div><div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:15,fontWeight:900,letterSpacing:"0.5px",background:T.ss,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",filter:"drop-shadow(0 0 10px rgba(192,208,255,0.2))"}}>UI</span>
            <div style={{padding:"3px 10px",borderRadius:7,background:T.bgInput,border:`1px solid ${T.bdM}`,display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:14}}>{routine.emoji}</span><span style={{fontSize:sz(12,fSc),fontWeight:700,color:T.t1}}>{routine.name}</span></div></div></div></div>
        <button onClick={finish} style={{padding:"9px 22px",borderRadius:10,cursor:"pointer",background:"rgba(92,232,250,0.08)",border:"1px solid rgba(92,232,250,0.22)",color:T.cy,fontSize:13,fontWeight:700}}>Terminer ✓</button></div>
      <div style={{textAlign:"center",marginTop:6}}>
        <span style={{fontSize:32,fontWeight:900,fontVariantNumeric:"tabular-nums",fontFamily:"monospace",background:T.ss,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",filter:"drop-shadow(0 0 12px rgba(192,208,255,0.2))"}}>{fm(elapsed)}</span>
      </div></div>
    <div style={{padding:"14px 12px",paddingBottom:timer?150:80}}>
      {routine.warmup&&<div style={{padding:"12px 16px",borderRadius:14,marginBottom:12,background:"rgba(255,184,110,0.06)",border:"1px solid rgba(255,184,110,0.15)"}}><div style={{fontSize:10,fontWeight:800,color:T.wa,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:6}}>🔥 Échauffement général</div>
        <div style={{fontSize:sz(12,fSc),color:T.t2,lineHeight:1.7}}>{routine.warmup.split("→").map((s,i)=><span key={i}>{i>0&&<span style={{color:T.wa}}> → </span>}{s.trim()}</span>)}</div></div>}
      {exOrder.map((exId,i)=>(
        <div key={slotKeys[i]} style={{animation:`fadeUp 0.35s ease ${i*0.05}s both`}}>
          <div style={{display:"flex",justifyContent:"flex-end",gap:4,marginBottom:2,paddingRight:4}}>
            <button onClick={()=>moveEx(i,-1)} disabled={i===0} style={{width:26,height:22,borderRadius:6,cursor:i===0?"default":"pointer",background:"rgba(180,200,255,0.04)",border:`1px solid ${T.bd}`,color:i===0?T.t4:T.t2,fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",padding:0,opacity:i===0?0.3:1}}>↑</button>
            <button onClick={()=>moveEx(i,1)} disabled={i===exOrder.length-1} style={{width:26,height:22,borderRadius:6,cursor:i===exOrder.length-1?"default":"pointer",background:"rgba(180,200,255,0.04)",border:`1px solid ${T.bd}`,color:i===exOrder.length-1?T.t4:T.t2,fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",padding:0,opacity:i===exOrder.length-1?0.3:1}}>↓</button>
            <button onClick={()=>removeEx(i)} style={{width:26,height:22,borderRadius:6,cursor:"pointer",background:"rgba(226,128,255,0.06)",border:"1px solid rgba(226,128,255,0.15)",color:T.pk,fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>✕</button></div>
          <ExCard exId={exId} slotKey={slotKeys[i]} alts={routine.alts[exId]} onRest={tRest} nSets={(() => {const e=routine.exercises[i];return typeof e==="object"&&e.sets?e.sets:routine.sets})()} swaps={swaps} onSwap={handleSwap} onData={handleExData} customObjs={customObjs} onObjChange={handleObjChange} fSc={fSc}/></div>))}
      {!showAddEx&&<button onClick={()=>setShowAddEx(true)} style={{width:"100%",padding:"14px",marginTop:8,background:"rgba(112,144,255,0.06)",border:"1.5px dashed rgba(112,144,255,0.25)",borderRadius:14,color:T.blL,fontSize:sz(13,fSc),fontWeight:700,cursor:"pointer"}}>+ Ajouter un exercice</button>}
      {showAddEx&&<div style={{marginTop:8,padding:"16px",borderRadius:16,background:T.bgCard,border:`1px solid ${T.bdM}`,animation:"fadeUp 0.3s ease both"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontSize:10,fontWeight:800,color:T.bl,letterSpacing:"1.5px",textTransform:"uppercase"}}>Ajouter un exercice</div>
          <button onClick={()=>{setShowAddEx(false);setAddExSearch("")}} style={{padding:"4px 10px",borderRadius:7,cursor:"pointer",background:"rgba(180,200,255,0.04)",border:`1px solid ${T.bd}`,color:T.t3,fontSize:11,fontWeight:700}}>✕</button></div>
        <input type="text" placeholder="🔍 Rechercher dans la base..." value={addExSearch} onChange={e=>setAddExSearch(e.target.value)} style={{width:"100%",padding:"10px 12px",borderRadius:9,background:T.bgInput,border:`1px solid ${T.bdM}`,color:T.w,fontSize:13,outline:"none",marginBottom:8,fontFamily:"inherit"}}/>
        {addF.length>0&&<div style={{maxHeight:160,overflowY:"auto",display:"flex",flexDirection:"column",gap:4,marginBottom:12}}>
          {addF.slice(0,10).map(ex=><button key={ex.id} onClick={()=>addExToSession(ex.id)} style={{padding:"8px 12px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,textAlign:"left",background:"rgba(180,200,255,0.03)",border:`1px solid ${T.bd}`,color:T.t2,display:"flex",justifyContent:"space-between"}}><span>{ex.name}</span><span style={{fontSize:10,color:T.t4}}>{ex.muscle}</span></button>)}</div>}
        <div style={{padding:"12px",borderRadius:10,background:"rgba(168,140,255,0.04)",border:"1px solid rgba(168,140,255,0.1)"}}>
          <div style={{fontSize:10,fontWeight:700,color:T.vi,marginBottom:8}}>Ou créer un exercice custom :</div>
          <div style={{display:"flex",gap:6,marginBottom:8}}>
            <input type="text" placeholder="Nom" value={newExName} onChange={e=>setNewExName(e.target.value)} style={{flex:2,padding:"9px 10px",borderRadius:9,background:T.bgInput,border:`1px solid ${T.bdM}`,color:T.w,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
            <input type="text" placeholder="Muscle" value={newExMuscle} onChange={e=>setNewExMuscle(e.target.value)} style={{flex:1,padding:"9px 10px",borderRadius:9,background:T.bgInput,border:`1px solid ${T.bdM}`,color:T.w,fontSize:13,outline:"none",fontFamily:"inherit"}}/></div>
          <button onClick={addCustomEx} disabled={!newExName.trim()} style={{width:"100%",padding:"10px",borderRadius:9,cursor:newExName.trim()?"pointer":"default",background:newExName.trim()?"rgba(168,140,255,0.1)":"rgba(180,200,255,0.03)",border:`1px solid ${newExName.trim()?"rgba(168,140,255,0.25)":T.bd}`,color:newExName.trim()?T.vi:T.t4,fontSize:12,fontWeight:700}}>Créer & ajouter</button></div></div>}
    </div>
    {timer&&<RestTimer duration={timer.duration} exName={timer.exerciseName} onDone={()=>setTimer(null)} onSkip={()=>setTimer(null)}/>}
  </div>)}

  /* ═══ SUMMARY ═══ */
  if(scr==="summary"){return(<div style={shell}><style>{css}</style>
    <div style={{position:"fixed",top:"12%",left:"50%",transform:"translateX(-50%)",width:300,height:300,background:"radial-gradient(circle,rgba(92,232,250,0.08),rgba(112,144,255,0.04) 45%,transparent 75%)",pointerEvents:"none",animation:"auraFloat 6s ease-in-out infinite"}}/>
    <div style={{position:"relative",zIndex:1}}>
      <div style={{padding:`calc(20px + ${safeTop}) 24px 28px`,textAlign:"center"}}>
        <div style={{width:72,height:72,borderRadius:"50%",margin:"0 auto 18px",background:"rgba(92,232,250,0.06)",border:"1.5px solid rgba(92,232,250,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,boxShadow:"0 0 50px rgba(92,232,250,0.1)",animation:"fadeUp 0.5s ease both"}}>⚡</div>
        <div style={{fontSize:sz(26,fSc),fontWeight:900,background:T.ss,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",filter:"drop-shadow(0 0 16px rgba(192,208,255,0.2))",animation:"fadeUp 0.4s ease 0.1s both"}}>Séance terminée</div>
        <p style={{margin:"10px 0 0",fontSize:sz(14,fSc),color:T.t3,fontWeight:500,animation:"fadeUp 0.4s ease 0.15s both"}}>{routine.emoji} {routine.name} · {fm(elapsed)}</p></div>
      <div style={{padding:"0 16px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:16,animation:"fadeUp 0.4s ease 0.2s both"}}>
          {[{l:"Durée",v:fm(elapsed),c:T.bl},{l:"Exercices",v:Object.keys(workoutData).length||exOrder.length,c:T.vi},{l:"PRs",v:prCount,c:T.pk}].map((s,i)=>(<div key={i} style={{...card,padding:"18px 10px",textAlign:"center"}}><div style={{fontSize:sz(22,fSc),fontWeight:900,color:s.c}}>{s.v}</div><div style={{fontSize:10,color:T.t4,marginTop:5,fontWeight:600}}>{s.l}</div></div>))}</div>
        <div style={{padding:"22px 20px",borderRadius:16,background:T.am,border:"1px solid rgba(112,144,255,0.15)",marginBottom:14,animation:"fadeUp 0.4s ease 0.3s both"}}>
          <div style={{fontSize:sz(15,fSc),fontWeight:800,marginBottom:6,background:T.ss,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>🤖 Rapport Claude</div>
          <div style={{fontSize:sz(12,fSc),color:T.t2,marginBottom:12,lineHeight:1.6}}>Ajoute tes notes puis copie le rapport pour débriefer</div>
          <textarea value={sessionNotes} onChange={e=>setSessionNotes(e.target.value)} placeholder={"Tes ressentis, questions, ajustements...\nEx: Hack squat facile → monter à 150kg ?"} rows={4} style={{width:"100%",padding:"12px",borderRadius:10,background:T.bgInput,border:`1px solid ${T.bdM}`,color:T.w,fontSize:sz(13,fSc),outline:"none",fontFamily:"inherit",resize:"vertical",lineHeight:1.6,marginBottom:12,minHeight:80}}/>
          <button onClick={handleCopyReport} style={{width:"100%",padding:"13px",borderRadius:10,cursor:"pointer",background:copied?"rgba(92,232,250,0.15)":"rgba(112,144,255,0.1)",border:`1.5px solid ${copied?"rgba(92,232,250,0.35)":"rgba(112,144,255,0.28)"}`,color:copied?T.cy:T.blL,fontSize:sz(14,fSc),fontWeight:700,transition:"all 0.3s"}}>{copied?"✅ Copié !":"📋 Copier le rapport"}</button>
          {reportText&&<div style={{marginTop:12,textAlign:"left",padding:"12px",borderRadius:10,background:"rgba(13,18,32,0.3)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",maxHeight:160,overflowY:"auto"}}><pre style={{margin:0,fontSize:10,color:T.t3,whiteSpace:"pre-wrap",fontFamily:"monospace",lineHeight:1.5}}>{reportText.slice(0,400)}{reportText.length>400?"...":""}</pre></div>}</div>
        <button onClick={resetToHome} style={{width:"100%",padding:"14px",borderRadius:12,cursor:"pointer",background:T.bgCard,border:`1px solid ${T.bd}`,color:T.t2,fontSize:sz(14,fSc),fontWeight:600}}>Retour</button>
      </div></div></div>)}

  /* ═══ SESSIONS (Stats + Historique + 1RM fusionnés) ═══ */
  if(scr==="sessions"){
    const allEx=Object.entries(EX).filter(([_,e])=>e.hist?.length>=2);
    const prBoard=Object.entries(EX).filter(([_,e])=>e.hist?.length>0).map(([id,e])=>{const p=e.hist.reduce((b,h)=>h.kg>b.kg?h:b,e.hist[0]);const g=p.kg-e.hist[0].kg;return{id,name:e.name,muscle:e.muscle,pr:p,gain:g,obj:OBJ[id]}}).sort((a,b)=>b.gain-a.gain);
    const vol=[{m:"Quadriceps",s:16,t:16,c:T.bl},{m:"Ischio-jambiers",s:10,t:10,c:T.vi},{m:"Pectoraux",s:14,t:15,c:T.pk},{m:"Dos",s:14,t:15,c:T.cy},{m:"Épaules",s:11,t:11,c:T.wa},{m:"Biceps",s:8,t:8,c:T.gn},{m:"Triceps",s:8,t:8,c:"#E8A08A"},{m:"Mollets",s:8,t:8,c:T.t2}];
    const grouped={};sessHist.forEach(s=>{if(!grouped[s.routine])grouped[s.routine]=[];grouped[s.routine].push(s)});
    // 1RM board
    const rmBoard=Object.entries(EX).filter(([_,e])=>e.hist?.length>0).map(([id,e])=>{const best=e.hist.reduce((b,h)=>{const rm=e1rm(h.kg,h.r);return rm>b.rm?{...h,rm,id}:b},{rm:0,id});return{id,name:e.name,muscle:e.muscle,rm:best.rm,kg:best.kg,r:best.r}}).filter(x=>x.rm>0).sort((a,b)=>b.rm-a.rm);

    return(<div style={shell}><style>{css}</style>
    <img src="/goku_home.jpg" alt="" style={{position:"fixed",top:"12%",left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:500,height:"auto",opacity:0.4,pointerEvents:"none",zIndex:0,maskImage:"linear-gradient(to bottom, black 50%, transparent 90%)",WebkitMaskImage:"linear-gradient(to bottom, black 50%, transparent 90%)"}}/>
      <div style={{padding:`calc(16px + ${safeTop}) 20px 16px`}}><Logo sz="sm"/><h2 style={{margin:"12px 0 0",fontSize:sz(22,fSc),fontWeight:800,color:T.w}}>Séances</h2></div>
      <div style={{display:"flex",padding:"0 16px",gap:4,marginBottom:16,flexWrap:"wrap"}}>
        {[{id:"prs",l:"🏆 PRs"},{id:"1rm",l:"💎 1RM"},{id:"progress",l:"📈 Courbes"},{id:"volume",l:"💪 Volume"},{id:"chrono",l:"📅 Historique"},{id:"routine",l:"🔁 Routines"}].map(t=>(
          <button key={t.id} onClick={()=>{setSTab(t.id);setSelEx(null);setHistDetail(null)}} style={{...tabBtn(sTab===t.id),flex:"none",padding:"8px 12px",fontSize:sz(11,fSc)}}>{t.l}</button>))}</div>
      <div style={{padding:"0 16px",paddingBottom:80}}>

        {/* PRs */}
        {sTab==="prs"&&<div>{prBoard.map((it,i)=>(<div key={it.id} onClick={()=>setSelEx(selEx===it.id?null:it.id)} style={{...card,marginBottom:8,cursor:"pointer",animation:`fadeUp 0.3s ease ${i*0.03}s both`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{flex:1}}><div style={{fontSize:sz(14,fSc),fontWeight:700,color:T.w}}>{it.name}</div><div style={{fontSize:sz(11,fSc),color:T.t3,marginTop:2}}>{it.muscle}</div></div>
            <div style={{textAlign:"right"}}><div style={{fontSize:sz(16,fSc),fontWeight:900,color:T.pk}}>{it.pr.kg}<span style={{fontSize:sz(11,fSc),fontWeight:500,color:T.t3}}>kg</span> <span style={{fontSize:sz(12,fSc),color:T.t2}}>× {it.pr.r}</span></div>{it.gain>0&&<div style={{fontSize:10,fontWeight:700,color:T.cy,marginTop:2}}>+{it.gain}kg</div>}</div></div>
          {it.obj&&<div style={{marginTop:4,fontSize:10,color:T.vi,fontWeight:600}}>🎯 {it.obj}</div>}
          {selEx===it.id&&<div style={{marginTop:10}}><Spark hist={EX[it.id].hist}/></div>}
        </div>))}</div>}

        {/* 1RM */}
        {sTab==="1rm"&&<div>
          <div style={{...card,marginBottom:12,background:T.am,border:"1px solid rgba(112,144,255,0.15)"}}>
            <div style={{fontSize:sz(11,fSc),color:T.t2,lineHeight:1.5}}>1RM estimé (Epley) = charge × (1 + reps/30). Indique ta force maximale théorique sur 1 rep.</div></div>
          {rmBoard.map((it,i)=>(<div key={it.id} style={{...card,marginBottom:8,animation:`fadeUp 0.3s ease ${i*0.03}s both`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontSize:sz(14,fSc),fontWeight:700,color:T.w}}>{it.name}</div><div style={{fontSize:sz(10,fSc),color:T.t3,marginTop:2}}>{it.muscle}</div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:sz(18,fSc),fontWeight:900,color:T.gn}}>{it.rm}<span style={{fontSize:sz(11,fSc),color:T.t3}}>kg</span></div>
                <div style={{fontSize:9,color:T.t4}}>({it.kg}kg × {it.r})</div></div></div>
          </div>))}</div>}

        {/* Progress */}
        {sTab==="progress"&&<div>{selEx?(<div>
          <button onClick={()=>setSelEx(null)} style={{padding:"6px 14px",borderRadius:8,cursor:"pointer",background:T.bgCard,border:`1px solid ${T.bdM}`,color:T.t2,fontSize:12,fontWeight:600,marginBottom:12}}>← Retour</button>
          <div style={{...card,padding:"16px"}}>
            <div style={{fontSize:sz(16,fSc),fontWeight:800,color:T.w,marginBottom:4}}>{EX[selEx].name}</div>
            <div style={{fontSize:sz(11,fSc),color:T.t3,marginBottom:12}}>{EX[selEx].muscle} · {EX[selEx].hist.length} séances · 1RM: {e1rm(EX[selEx].hist[EX[selEx].hist.length-1].kg,EX[selEx].hist[EX[selEx].hist.length-1].r)}kg</div>
            <Spark hist={EX[selEx].hist}/>
            <div style={{marginTop:16}}>{[...EX[selEx].hist].reverse().map((h,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${T.bd}`}}><span style={{fontSize:sz(12,fSc),color:T.t2}}>{dateFR(h.d)}</span><span style={{fontSize:sz(13,fSc),fontWeight:700,color:i===0?T.pk:T.t1}}>{h.kg}kg × {h.r}</span></div>))}</div></div>
        </div>):(<div>{allEx.map(([id,ex],i)=>(<div key={id} onClick={()=>setSelEx(id)} style={{...card,marginBottom:8,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",animation:`fadeUp 0.3s ease ${i*0.02}s both`}}>
          <div><div style={{fontSize:sz(13,fSc),fontWeight:700,color:T.w}}>{ex.name}</div><div style={{fontSize:10,color:T.t3,marginTop:2}}>{ex.muscle} · {ex.hist.length} séances</div></div>
          <div style={{display:"flex",alignItems:"center",gap:8}}><Spark hist={ex.hist}/><div style={{fontSize:sz(14,fSc),fontWeight:800,color:T.pk,minWidth:45,textAlign:"right"}}>{ex.hist[ex.hist.length-1].kg}<span style={{fontSize:10,color:T.t3}}>kg</span></div></div></div>))}</div>)}</div>}

        {/* Volume */}
        {sTab==="volume"&&<div>
          <div style={{fontSize:10,fontWeight:800,color:T.t4,letterSpacing:"2px",textTransform:"uppercase",marginBottom:12}}>Séries / semaine</div>
          {vol.map((v,i)=>{const pct=Math.min((v.s/Math.max(...vol.map(x=>x.t)))*100,100);return(<div key={i} style={{...card,marginBottom:8,animation:`fadeUp 0.3s ease ${i*0.04}s both`}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:sz(13,fSc),fontWeight:700,color:T.w}}>{v.m}</span><span style={{fontSize:sz(13,fSc),fontWeight:800,color:v.c}}>{v.s}<span style={{fontSize:10,fontWeight:500,color:T.t3}}>/{v.t}</span></span></div>
            <div style={{height:6,borderRadius:3,background:"rgba(180,200,255,0.06)",overflow:"hidden"}}><div style={{height:"100%",borderRadius:3,background:v.c,width:`${pct}%`,boxShadow:`0 0 8px ${v.c}40`}}/></div></div>)})}</div>}

        {/* History chrono */}
        {sTab==="chrono"&&<div>
          {histDetail&&<div style={{...card,marginBottom:12,animation:"fadeUp 0.2s ease both",border:`1px solid ${T.bdM}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{fontSize:sz(15,fSc),fontWeight:800,color:T.w}}>{routines[histDetail.routine]?.emoji} {routines[histDetail.routine]?.name} · {dateFR(histDetail.date)}</div>
              <button onClick={()=>setHistDetail(null)} style={{padding:"4px 10px",borderRadius:7,cursor:"pointer",background:"rgba(180,200,255,0.04)",border:`1px solid ${T.bd}`,color:T.t3,fontSize:11,fontWeight:700}}>✕</button></div>
            <div style={{fontSize:sz(11,fSc),color:T.t3,marginBottom:6}}>{histDetail.duration} · {histDetail.exercises} exos · {histDetail.prs} PR{histDetail.prs>1?"s":""}</div>
            {(()=>{const nb=getNutriBefore(histDetail.date);const nl=nutriLevel(nb);return nb?<div style={{fontSize:sz(10,fSc),color:nl.color,fontWeight:700,marginBottom:10,padding:"6px 10px",borderRadius:8,background:"rgba(180,200,255,0.03)",border:`1px solid ${T.bd}`}}>{nl.icon} Nutrition J-3 : {nb.kcal}kcal · P{nb.prot}g · G{nb.gluc}g · L{nb.lip}g ({nb.days}j de data)</div>:null})()}
            {histDetail.detail?histDetail.detail.map((d,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${T.bd}`}}>
                <div><span style={{fontSize:sz(12,fSc),fontWeight:600,color:T.t1}}>{d.name}</span><span style={{fontSize:10,color:T.t4,marginLeft:6}}>{d.muscle}</span></div>
                <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:sz(13,fSc),fontWeight:700,color:d.hasPR?T.pk:T.t1}}>{d.bestKg}kg × {d.bestReps}</span>{d.hasPR&&<span style={{fontSize:8,fontWeight:800,color:T.pk}}>🏆</span>}</div></div>))
            :<div style={{fontSize:sz(11,fSc),color:T.t4}}>Détail non disponible</div>}</div>}
          {sessHist.map((s,i)=>{const r=routines[s.routine];const nb=getNutriBefore(s.date);const nl=nutriLevel(nb);return(
            <div key={s.id} onClick={()=>setHistDetail(histDetail?.id===s.id?null:s)} style={{...card,marginBottom:8,cursor:"pointer",animation:`fadeUp 0.3s ease ${i*0.03}s both`,display:"flex",justifyContent:"space-between",alignItems:"center",}}>
              <div><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:16}}>{r?.emoji}</span><span style={{fontSize:sz(14,fSc),fontWeight:700,color:T.w}}>{r?.name}</span>{nb&&<span style={{fontSize:10}} title={`Nutri J-3: ${nb.kcal}kcal`}>{nl.icon}</span>}</div>
              <div style={{fontSize:sz(11,fSc),color:T.t3,marginTop:3}}>{dateFR(s.date)} · {s.duration} · {s.exercises} exos</div></div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                {s.prs>0&&<span style={{fontSize:sz(12,fSc),fontWeight:800,color:T.pk}}>🏆{s.prs}</span>}
                {confirmDel===s.id?<div style={{display:"flex",gap:4}} onClick={e=>e.stopPropagation()}>
                  <button onClick={()=>deleteSession(s.id)} style={{padding:"4px 8px",borderRadius:6,cursor:"pointer",background:"rgba(226,128,255,0.12)",border:"1px solid rgba(226,128,255,0.3)",color:T.pk,fontSize:10,fontWeight:700}}>Oui</button>
                  <button onClick={()=>setConfirmDel(null)} style={{padding:"4px 8px",borderRadius:6,cursor:"pointer",background:T.bgInput,border:`1px solid ${T.bd}`,color:T.t3,fontSize:10,fontWeight:700}}>Non</button></div>
                :<button onClick={e=>{e.stopPropagation();setConfirmDel(s.id)}} style={{width:24,height:24,borderRadius:6,cursor:"pointer",background:"rgba(226,128,255,0.04)",border:"1px solid rgba(226,128,255,0.12)",color:T.t4,fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>✕</button>}
              </div></div>)})}</div>}

        {/* History by routine */}
        {sTab==="routine"&&<div>{Object.entries(grouped).map(([rk,sessions],gi)=>{const r=routines[rk];return(
          <div key={rk} style={{marginBottom:16,animation:`fadeUp 0.3s ease ${gi*0.05}s both`}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,padding:"0 4px"}}><span style={{fontSize:18}}>{r?.emoji}</span><span style={{fontSize:sz(15,fSc),fontWeight:800,color:T.w}}>{r?.name}</span><span style={{fontSize:sz(11,fSc),color:T.t3}}>({sessions.length})</span></div>
            {sessions.map((s,i)=>(<div key={s.id} onClick={()=>setHistDetail(histDetail?.id===s.id?null:s)} style={{...card,marginBottom:6,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:sz(12,fSc),color:T.t2}}>{dateFR(s.date)} · {s.duration}</div>
              <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:sz(11,fSc),color:T.t3}}>{s.exercises} exos</span>{s.prs>0&&<span style={{fontSize:sz(11,fSc),fontWeight:800,color:T.pk}}>🏆 {s.prs}</span>}</div></div>))}</div>)})}</div>}

      </div><Nav active="sessions" go={setScr}/></div>)}

  /* ═══ BODY ═══ */
  if(scr==="body"){
    const latest=mensur.length>0?mensur[mensur.length-1]:null;const prev=mensur.length>1?mensur[mensur.length-2]:null;
    const delta=(key)=>{if(!latest||!prev||!latest[key]||!prev[key])return null;return latest[key]-prev[key]};
    const sparkData=(key)=>mensur.filter(m=>m[key]!=null).map(m=>({d:m.date,kg:m[key],r:0}));
    const handleAddMensur=()=>{const entry={date:formData.date};MENSUR_FIELDS.forEach(f=>{if(formData[f.key]&&formData[f.key]!=="")entry[f.key]=parseFloat(formData[f.key])});
      if(Object.keys(entry).length>1){setMensur(DB.addMensuration(entry));setShowForm(false);setFormData({date:localDate(),poids:"",bf:"",ventre:"",poitrine:"",cuisse:"",bras:"",muscle:"",meta:""})}};
    return(<div style={shell}><style>{css}</style>
    <img src="/goku_home.jpg" alt="" style={{position:"fixed",top:"12%",left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:500,height:"auto",opacity:0.4,pointerEvents:"none",zIndex:0,maskImage:"linear-gradient(to bottom, black 50%, transparent 90%)",WebkitMaskImage:"linear-gradient(to bottom, black 50%, transparent 90%)"}}/>
      <div style={{padding:`calc(16px + ${safeTop}) 20px 16px`}}><Logo sz="sm"/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12}}>
          <h2 style={{margin:0,fontSize:sz(22,fSc),fontWeight:800,color:T.w}}>Corps</h2>
          <button onClick={()=>setShowForm(!showForm)} style={{padding:"8px 16px",borderRadius:10,cursor:"pointer",background:showForm?"rgba(226,128,255,0.1)":"rgba(112,144,255,0.1)",border:`1px solid ${showForm?"rgba(226,128,255,0.25)":"rgba(112,144,255,0.25)"}`,color:showForm?T.pk:T.blL,fontSize:sz(12,fSc),fontWeight:700}}>{showForm?"✕ Fermer":"+ Mesure"}</button></div></div>
      {showForm&&<div style={{padding:"0 16px",marginBottom:16,animation:"fadeUp 0.3s ease both"}}>
        <div style={{padding:"16px",borderRadius:16,background:T.bgCard,border:`1px solid ${T.bdM}`}}>
          <div style={{fontSize:10,fontWeight:800,color:T.vi,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:12}}>📐 Nouvelle mesure</div>
          <div style={{marginBottom:12}}><label style={{fontSize:11,color:T.t3,fontWeight:600,display:"block",marginBottom:4}}>Date</label>
            <input type="date" value={formData.date} onChange={e=>setFormData(p=>({...p,date:e.target.value}))} style={{width:"100%",padding:"10px 12px",borderRadius:9,background:T.bgInput,border:`1px solid ${T.bdM}`,color:T.w,fontSize:14,outline:"none",fontFamily:"inherit"}}/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {MENSUR_FIELDS.map(f=>(<div key={f.key}><label style={{fontSize:10,color:T.t3,fontWeight:600,display:"block",marginBottom:3}}>{f.icon} {f.label} ({f.unit})</label>
              <input type="number" inputMode="decimal" step="0.1" placeholder={latest?.[f.key]?.toString()||""} value={formData[f.key]} onChange={e=>setFormData(p=>({...p,[f.key]:e.target.value}))} style={{width:"100%",padding:"9px 10px",borderRadius:9,background:T.bgInput,border:`1px solid ${T.bdM}`,color:T.w,fontSize:14,fontWeight:600,outline:"none",fontFamily:"inherit"}}/></div>))}</div>
          <button onClick={handleAddMensur} style={{width:"100%",marginTop:14,padding:"12px",borderRadius:10,cursor:"pointer",background:"rgba(112,144,255,0.1)",border:"1.5px solid rgba(112,144,255,0.28)",color:T.blL,fontSize:sz(14,fSc),fontWeight:700}}>✓ Enregistrer</button></div></div>}
      <div style={{display:"flex",padding:"0 16px",gap:6,marginBottom:16}}>
        {[{id:"dashboard",l:"📊 Vue"},{id:"history",l:"📋 Historique"}].map(t=><button key={t.id} onClick={()=>setBodyTab(t.id)} style={tabBtn(bodyTab===t.id)}>{t.l}</button>)}</div>
      <div style={{padding:"0 16px",paddingBottom:80}}>
        {bodyTab==="dashboard"&&<div>
          {latest&&<div style={{fontSize:10,color:T.t4,fontWeight:600,marginBottom:12}}>Dernière mesure : {dateFR(latest.date)}</div>}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {MENSUR_FIELDS.map((f,i)=>{const val=latest?.[f.key];const d=delta(f.key);const hist=sparkData(f.key);if(!val&&hist.length===0)return null;return(
              <div key={f.key} style={{...card,animation:`fadeUp 0.3s ease ${i*0.04}s both`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><span style={{fontSize:10,color:T.t3,fontWeight:600}}>{f.icon} {f.label}</span>
                  {d!=null&&<span style={{fontSize:10,fontWeight:700,color:f.key==="ventre"||f.key==="bf"?(d<=0?T.cy:T.wa):(d>=0?T.cy:T.wa)}}>{d>0?"+":""}{d.toFixed(1)}{f.unit}</span>}</div>
                <div style={{fontSize:sz(22,fSc),fontWeight:900,color:f.color}}>{val}<span style={{fontSize:sz(12,fSc),fontWeight:500,color:T.t3}}> {f.unit}</span></div>
                {f.obj&&<div style={{fontSize:10,color:T.vi,fontWeight:600,marginTop:4}}>🎯 {f.obj}</div>}
                {hist.length>=2&&<div style={{marginTop:8}}><Spark hist={hist}/></div>}</div>)})}
          </div>
          {mensur.length>=2&&<div style={{marginTop:16,...card,animation:"fadeUp 0.3s ease 0.3s both"}}>
            <div style={{fontSize:10,fontWeight:800,color:T.t4,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:10}}>📈 Progression depuis le début</div>
            {MENSUR_FIELDS.filter(f=>{const first=mensur.find(m=>m[f.key]!=null);const last2=mensur.slice().reverse().find(m=>m[f.key]!=null);return first&&last2&&first!==last2}).map(f=>{
              const first=mensur.find(m=>m[f.key]!=null);const last2=mensur.slice().reverse().find(m=>m[f.key]!=null);const diff=last2[f.key]-first[f.key];const good=f.key==="ventre"||f.key==="bf"?diff<=0:diff>=0;
              return(<div key={f.key} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${T.bd}`}}><span style={{fontSize:sz(12,fSc),color:T.t2}}>{f.label}</span><span style={{fontSize:sz(12,fSc),fontWeight:800,color:good?T.cy:T.wa}}>{diff>0?"+":""}{diff.toFixed(1)} {f.unit}</span></div>)})}</div>}
        </div>}
        {bodyTab==="history"&&<div>{[...mensur].reverse().map((m,i)=>(
          <div key={i} style={{...card,marginBottom:8,animation:`fadeUp 0.3s ease ${i*0.03}s both`}}>
            <div style={{fontSize:sz(12,fSc),fontWeight:700,color:T.blL,marginBottom:8}}>{dateFR(m.date)}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
              {MENSUR_FIELDS.filter(f=>m[f.key]!=null).map(f=>(<div key={f.key} style={{textAlign:"center"}}><div style={{fontSize:9,color:T.t4,fontWeight:600}}>{f.icon}</div><div style={{fontSize:sz(14,fSc),fontWeight:800,color:f.color}}>{m[f.key]}</div><div style={{fontSize:8,color:T.t4}}>{f.unit}</div></div>))}</div></div>))}</div>}
      </div><Nav active="body" go={setScr}/></div>)}

  /* ═══ SETTINGS ═══ */
  if(scr==="settings"){
    const setFS=(s)=>setSettings(p=>({...p,fontSize:s}));const setWG=(g)=>setSettings(p=>({...p,waterGoal:g}));
    const handleReset=()=>{DB.resetAll();setSwaps({});setCustomObjs({});setSessHist(INIT_HISTORY);setLastDates({...LAST_SESSIONS});setMensur([...INIT_MENSUR]);setRoutines({...INIT_ROUTINES});setSettings({fontSize:"normal",waterGoal:3000});setShowReset(false)};
    const lastExp=DB.getLastExport();const expDays=lastExp?Math.floor((new Date()-new Date(lastExp+"T12:00:00"))/(1000*60*60*24)):null;
    return(<div style={shell}><style>{css}</style>
    <img src="/goku_home.jpg" alt="" style={{position:"fixed",top:"12%",left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:500,height:"auto",opacity:0.4,pointerEvents:"none",zIndex:0,maskImage:"linear-gradient(to bottom, black 50%, transparent 90%)",WebkitMaskImage:"linear-gradient(to bottom, black 50%, transparent 90%)"}}/>
      <div style={{padding:`calc(16px + ${safeTop}) 20px 16px`}}><Logo sz="sm"/><h2 style={{margin:"12px 0 0",fontSize:sz(22,fSc),fontWeight:800,color:T.w}}>Réglages</h2></div>
      <div style={{padding:"0 16px",paddingBottom:80}}>
        <div style={{...card,marginBottom:10,animation:"fadeUp 0.3s ease both"}}>
          <div style={{fontSize:sz(14,fSc),fontWeight:700,color:T.w,marginBottom:10}}>🔤 Taille de police</div>
          <div style={{display:"flex",gap:6}}>{[{id:"small",l:"Petit"},{id:"normal",l:"Normal"},{id:"large",l:"Grand"}].map(s=>(<button key={s.id} onClick={()=>setFS(s.id)} style={tabBtn(settings.fontSize===s.id)}>{s.l}</button>))}</div></div>
        <div style={{...card,marginBottom:10,animation:"fadeUp 0.3s ease 0.05s both"}}>
          <div style={{fontSize:sz(14,fSc),fontWeight:700,color:T.w,marginBottom:10}}>💧 Objectif eau journalier</div>
          <div style={{display:"flex",gap:6}}>{[2000,2500,3000,3500].map(g=>(<button key={g} onClick={()=>setWG(g)} style={tabBtn(waterGoal===g)}>{(g/1000).toFixed(1)}L</button>))}</div></div>
        <div style={{...card,marginBottom:10,animation:"fadeUp 0.3s ease 0.1s both"}}>
          <div style={{fontSize:sz(14,fSc),fontWeight:700,color:T.w,marginBottom:4}}>💾 Sauvegarde</div>
          {expDays!=null&&<div style={{fontSize:11,color:expDays>7?T.wa:T.t3,marginBottom:10,fontWeight:expDays>7?700:500}}>{expDays>7?"⚠️ ":""}Dernier export : il y a {expDays}j</div>}
          {expDays==null&&<div style={{fontSize:11,color:T.wa,marginBottom:10,fontWeight:700}}>⚠️ Aucun export</div>}
          <div style={{display:"flex",gap:8}}>
            <button onClick={doExport} style={{flex:1,padding:"10px",borderRadius:10,cursor:"pointer",background:"rgba(112,144,255,0.1)",border:"1px solid rgba(112,144,255,0.25)",color:T.blL,fontSize:sz(12,fSc),fontWeight:700}}>📤 Exporter</button>
            <label style={{flex:1,padding:"10px",borderRadius:10,cursor:"pointer",background:"rgba(168,140,255,0.08)",border:"1px solid rgba(168,140,255,0.2)",color:T.vi,fontSize:sz(12,fSc),fontWeight:700,textAlign:"center"}}>📥 Importer<input type="file" accept=".json" onChange={doImport} style={{display:"none"}}/></label></div></div>
        <div style={{...card,marginBottom:10,animation:"fadeUp 0.3s ease 0.12s both"}}>
          <div style={{fontSize:sz(14,fSc),fontWeight:700,color:T.w,marginBottom:4}}>🍎 Données Apple Santé</div>
          <div style={{fontSize:11,color:T.t3,marginBottom:10}}>Importer macros + eau depuis le fichier health_import.json</div>
          <label style={{display:"block",padding:"10px",borderRadius:10,cursor:"pointer",background:"rgba(138,232,160,0.08)",border:"1px solid rgba(138,232,160,0.2)",color:T.gn,fontSize:sz(12,fSc),fontWeight:700,textAlign:"center"}}>🍎 Importer données Santé<input type="file" accept=".json" onChange={doImportHealth} style={{display:"none"}}/></label></div>
        <div style={{...card,marginBottom:10,animation:"fadeUp 0.3s ease 0.13s both"}}>
          <div style={{fontSize:sz(14,fSc),fontWeight:700,color:T.w,marginBottom:4}}>🏋️ Importer un programme</div>
          <div style={{fontSize:11,color:T.t3,marginBottom:10}}>Remplace toutes les routines par un fichier JSON (exercices + objectifs inclus)</div>
          <label style={{display:"block",padding:"10px",borderRadius:10,cursor:"pointer",background:"rgba(112,144,255,0.08)",border:"1px solid rgba(112,144,255,0.2)",color:T.blL,fontSize:sz(12,fSc),fontWeight:700,textAlign:"center"}}>🏋️ Importer routines (.json)<input type="file" accept=".json" onChange={doImportRoutines} style={{display:"none"}}/></label></div>
        <div style={{...card,marginBottom:10,animation:"fadeUp 0.3s ease 0.15s both"}}>
          <div style={{fontSize:sz(14,fSc),fontWeight:700,color:T.w,marginBottom:4}}>🗑️ Réinitialiser</div>
          <div style={{fontSize:11,color:T.t3,marginBottom:12}}>Supprime toutes les données locales</div>
          {!showReset?<button onClick={()=>setShowReset(true)} style={{padding:"10px 20px",borderRadius:10,cursor:"pointer",background:"rgba(226,128,255,0.06)",border:"1px solid rgba(226,128,255,0.2)",color:T.pk,fontSize:sz(12,fSc),fontWeight:700}}>Réinitialiser</button>
          :<div style={{padding:"12px",borderRadius:10,background:"rgba(226,128,255,0.04)",border:"1px solid rgba(226,128,255,0.15)"}}>
            <div style={{fontSize:12,fontWeight:700,color:T.pk,marginBottom:10}}>⚠️ Action irréversible.</div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={handleReset} style={{flex:1,padding:"10px",borderRadius:9,cursor:"pointer",background:"rgba(226,128,255,0.12)",border:"1px solid rgba(226,128,255,0.3)",color:T.pk,fontSize:13,fontWeight:700}}>Confirmer</button>
              <button onClick={()=>setShowReset(false)} style={{flex:1,padding:"10px",borderRadius:9,cursor:"pointer",background:T.bgInput,border:`1px solid ${T.bdM}`,color:T.t2,fontSize:13,fontWeight:700}}>Annuler</button></div></div>}</div>
        <div style={{...card,marginBottom:10,animation:"fadeUp 0.3s ease 0.2s both"}}>
          <div style={{fontSize:sz(14,fSc),fontWeight:700,color:T.w,marginBottom:10}}>ℹ️ À propos</div>
          {[{l:"Application",v:"Ultra Instinct"},{l:"Version",v:`v${APP_VERSION}`},{l:"Stack",v:"React 18 · PWA"},{l:"Hébergement",v:"Vercel"},{l:"Données",v:"localStorage"},{l:"Auteur",v:"Stephen C."}].map((r,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:`1px solid ${T.bd}`}}><span style={{fontSize:sz(12,fSc),color:T.t3}}>{r.l}</span><span style={{fontSize:sz(12,fSc),fontWeight:600,color:T.t1}}>{r.v}</span></div>))}</div>
      </div><Nav active="settings" go={setScr}/></div>)}

  return null;
}
