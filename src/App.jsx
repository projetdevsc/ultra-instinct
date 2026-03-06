import { useState, useEffect, useRef, useCallback } from "react";
import { DB } from "./storage";
import { generateReport, copyReport } from "./report";

/* ═══════════════════════════════════════════════════
   ULTRA INSTINCT — PUSH BUILD
   Swap persistant · Historique séances · Last date Home
   ═══════════════════════════════════════════════════ */

/* ─── EXERCISES DB ─── */
const EX = {
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

const OBJ = {
  hack_squat_a:"180kg×10",vsquat:"160kg×10",leg_press_a:"220kg×10",leg_ext_a:"80kg×15",leg_curl_debout_a:"30kg×12",leg_curl_allonge_a:"45kg×12",iso_leg_press_a:"100kg/j×10",mollet_presse:"100kg×15",
  hack_squat_b:"220kg×6",leg_press_b:"280kg×10",leg_ext_b:"70kg×15",leg_curl_debout_b:"30kg×12",leg_curl_allonge_b:"45kg×12",seated_calf_b:"40kg×15",
  dev_incline:"90kg×8",iso_bench:"110kg×8",ecarte_haut:"12kg×15",lat_pulldown_a:"110kg×10",iso_front_lat:"45kg/b×10",tirage_h_serre:"85kg×10",low_row:"120kg×10",curl_pupitre:"18kg×12",curl_marteau:"24kg×14",ext_triceps_corde:"30kg×12",
  chest_press_b:"100kg×10",dev_incline_b:"75kg×10",butterfly_b:"25kg×15",pulldown_b:"120kg×10",iso_high_row:"55kg/b×10",shoulder_press:"50kg×10",lat_raise:"14kg×12",
};

/* ─── INITIAL ROUTINES ─── */
const INIT_ROUTINES = {
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

/* ─── Last session dates ─── */
const LAST_SESSIONS = { upper_a:"2026-03-03", lower_a:"2026-02-27", upper_b:"2026-03-01", lower_b:"2026-03-02" };

/* ─── Mensuration history ─── */
const INIT_MENSUR = [
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
];

const MENSUR_FIELDS = [
  {key:"poids",label:"Poids",unit:"kg",color:T.bl,obj:"78-80 kg",icon:"⚖️"},
  {key:"bf",label:"Body Fat",unit:"%",color:T.cy,obj:"12-14%",icon:"🔥"},
  {key:"ventre",label:"Tour de ventre",unit:"cm",color:T.cy,obj:"< 78 cm",icon:"📏"},
  {key:"poitrine",label:"Tour de poitrine",unit:"cm",color:T.pk,obj:"108-110 cm",icon:"💪"},
  {key:"cuisse",label:"Tour de cuisses",unit:"cm",color:T.vi,obj:"61-63 cm",icon:"🦵"},
  {key:"bras",label:"Tour de bras",unit:"cm",color:T.wa,obj:"40-41 cm",icon:"💪"},
  {key:"muscle",label:"Muscle squelettique",unit:"%",color:T.gn,obj:"58%+",icon:"🏋️"},
  {key:"meta",label:"Métabolisme base",unit:"kcal",color:"#E8A08A",obj:"1850+",icon:"⚡"},
];

/* ─── Session history log ─── */
const INIT_HISTORY = [
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
const T={bg:"#0D1220",bgCard:"#131B2E",bgInput:"#192640",bgEl:"#1C2A48",
  bd:"rgba(180,200,255,0.07)",bdM:"rgba(180,200,255,0.12)",
  w:"#F0F3FF",t1:"#D8DFF5",t2:"#9AA4C4",t3:"#6672A0",t4:"#3E4A70",
  bl:"#7090FF",blL:"#9CB5FF",vi:"#A88CFF",cy:"#5CE8FA",pk:"#E280FF",pkS:"#F0AAFF",wa:"#FFB86E",gn:"#8AE8A0",
  aura:"linear-gradient(135deg,#7090FF 0%,#A88CFF 45%,#E280FF 100%)",
  ss:"linear-gradient(135deg,#C0D0FF 0%,#F0F3FF 35%,#C5B0FF 70%,#E280FF 100%)",
  am:"linear-gradient(135deg,rgba(112,144,255,0.16),rgba(168,140,255,0.1))"};

const RO=[60,90,120,150,180,210,240];
const fm=s=>`${Math.floor(s/60)}:${(s%60).toString().padStart(2,"0")}`;
const last=id=>{const h=EX[id]?.hist;return h?.length?h[h.length-1]:null};
const pr=id=>{const h=EX[id]?.hist;return h?.length?h.reduce((b,e)=>e.kg>b.kg?e:b,h[0]):null};
const dateFR=d=>{if(!d)return"";const[y,m,dd]=d.split("-");return`${dd}/${m}/${y}`};
const ago=d=>{if(!d)return"";const now=new Date("2026-03-06T12:00:00");const then=new Date(d+"T12:00:00");const diff=Math.floor((now-then)/(1000*60*60*24));return diff===0?"Aujourd'hui":diff===1?"Hier":diff<7?`il y a ${diff}j`:`il y a ${Math.floor(diff/7)} sem`};

/* ═══ COMPONENTS ═══ */

function RestTimer({duration,exName,onDone,onSkip}){
  const[rem,setRem]=useState(duration);const iR=useRef(null);const cbR=useRef(onDone);
  useEffect(()=>{cbR.current=onDone},[onDone]);
  useEffect(()=>{setRem(duration);clearInterval(iR.current);
    iR.current=setInterval(()=>{setRem(p=>{if(p<=1){clearInterval(iR.current);if(navigator.vibrate)navigator.vibrate([200,100,200,100,300]);cbR.current();return 0}return p-1})},1000);
    return()=>clearInterval(iR.current)},[duration]);
  const pct=((duration-rem)/duration)*100,urg=rem<=10;
  return(<div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:200,background:`linear-gradient(180deg,rgba(13,18,32,0.97),${T.bg})`,backdropFilter:"blur(28px)",borderTop:`2px solid ${urg?"rgba(226,128,255,0.45)":"rgba(112,144,255,0.2)"}`}}>
    {urg&&<div style={{position:"absolute",bottom:20,left:"50%",transform:"translateX(-50%)",width:200,height:100,background:"radial-gradient(ellipse,rgba(226,128,255,0.15),transparent 70%)",pointerEvents:"none"}}/>}
    <div style={{height:3,background:"rgba(112,144,255,0.08)"}}><div style={{height:"100%",background:urg?"linear-gradient(90deg,#E280FF,#FF70B0)":T.aura,width:`${pct}%`,transition:"width 1s linear",boxShadow:urg?"0 0 20px rgba(226,128,255,0.5)":"0 0 14px rgba(112,144,255,0.3)"}}/></div>
    <div style={{padding:"18px 24px 32px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"relative"}}>
      <div><div style={{fontSize:11,fontWeight:700,color:urg?T.pkS:T.bl,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:8}}>⏱ Repos · {exName}</div>
        <div style={{fontSize:52,fontWeight:900,lineHeight:1,fontVariantNumeric:"tabular-nums",background:urg?"linear-gradient(135deg,#E280FF,#FF70B0)":T.ss,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",filter:urg?"drop-shadow(0 0 12px rgba(226,128,255,0.35))":"drop-shadow(0 0 8px rgba(192,208,255,0.15))"}}>{fm(rem)}</div></div>
      <button onClick={onSkip} style={{padding:"11px 24px",borderRadius:11,cursor:"pointer",background:T.bgCard,border:`1px solid ${T.bdM}`,color:T.t2,fontSize:13,fontWeight:700}}>Skip →</button>
    </div></div>);
}

function RC({val,set}){const[o,sO]=useState(false);return(<div style={{position:"relative"}}>
  <button onClick={e=>{e.stopPropagation();sO(!o)}} style={{padding:"4px 10px",borderRadius:7,cursor:"pointer",background:T.bgInput,border:`1px solid ${T.bdM}`,color:T.bl,fontSize:11,fontWeight:700,fontFamily:"monospace",display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:10}}>⏱</span>{fm(val)}</button>
  {o&&<div onClick={e=>e.stopPropagation()} style={{position:"absolute",top:"100%",right:0,marginTop:6,zIndex:90,background:T.bgEl,border:`1px solid ${T.bdM}`,borderRadius:12,padding:6,width:190,display:"flex",flexWrap:"wrap",gap:4,boxShadow:"0 12px 48px rgba(0,0,0,0.6)"}}>
    {RO.map(d=><button key={d} onClick={()=>{set(d);sO(false)}} style={{padding:"7px 0",borderRadius:8,cursor:"pointer",flex:"1 0 52px",textAlign:"center",background:d===val?"rgba(112,144,255,0.14)":"rgba(180,200,255,0.03)",border:`1px solid ${d===val?"rgba(112,144,255,0.3)":T.bd}`,color:d===val?T.blL:T.t3,fontSize:12,fontWeight:700,fontFamily:"monospace"}}>{fm(d)}</button>)}
  </div>}</div>);
}

function SR({i,prev,cur,up,val,done,isPR}){
  const inp=(v,p)=>({width:"100%",padding:"9px 4px",borderRadius:9,textAlign:"center",background:v?"rgba(92,232,250,0.05)":T.bgInput,border:`1px solid ${v?"rgba(92,232,250,0.2)":p?"rgba(226,128,255,0.35)":T.bdM}`,color:T.w,fontSize:15,fontWeight:600,outline:"none",fontFamily:"inherit"});
  return(<div style={{display:"grid",gridTemplateColumns:"30px 1fr 72px 72px 42px",gap:8,alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${T.bd}`,opacity:done?0.4:1}}>
    <div style={{fontSize:13,fontWeight:800,textAlign:"center",color:done?T.cy:T.t3}}>{i+1}</div>
    <div style={{fontSize:12,color:T.t3,fontFamily:"monospace"}}>{prev?`${prev.kg} × ${prev.r}`:"—"}</div>
    <div style={{position:"relative"}}><input type="number" inputMode="decimal" placeholder="kg" value={cur.kg||""} disabled={done} onChange={e=>up({...cur,kg:parseFloat(e.target.value)||0})} style={inp(done,isPR)}/>
      {isPR&&!done&&<div style={{position:"absolute",top:-7,right:-5,fontSize:8,fontWeight:900,color:T.pk,background:"rgba(226,128,255,0.12)",border:"1px solid rgba(226,128,255,0.25)",padding:"1px 6px",borderRadius:6}}>PR</div>}</div>
    <input type="number" inputMode="numeric" placeholder="reps" value={cur.reps||""} disabled={done} onChange={e=>up({...cur,reps:parseInt(e.target.value)||0})} style={inp(done,false)}/>
    <button onClick={val} disabled={done||!cur.kg||!cur.reps} style={{width:38,height:38,borderRadius:9,cursor:done?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",background:done?"rgba(92,232,250,0.1)":cur.kg&&cur.reps?"rgba(112,144,255,0.1)":"rgba(180,200,255,0.02)",border:`1.5px solid ${done?"rgba(92,232,250,0.3)":cur.kg&&cur.reps?"rgba(112,144,255,0.25)":T.bd}`,color:done?T.cy:cur.kg&&cur.reps?T.blL:T.t4,fontSize:16,fontWeight:800}}>✓</button>
  </div>);
}

function ExCard({exId,alts,onRest,nSets,swaps,onSwap,onData,customObjs,onObjChange}){
  const swapped=swaps[exId];
  const[aId,setAId]=useState(swapped||exId);
  const ax=EX[aId];const lp=last(aId);const prR=pr(aId);
  const defaultObj=OBJ[aId]||"";
  const customObj=customObjs[aId];
  const obj=customObj?.text||defaultObj;
  const objMode=customObj?.mode||"default";
  const prev=lp?Array(nSets).fill(lp):null;
  const[sets,setSets]=useState(Array(nSets).fill(null).map(()=>({kg:0,reps:0,done:false})));
  const[open,setOpen]=useState(true);const[prs,setPrs]=useState([]);const[rest,setRest]=useState(ax.rest);const[showSwap,setShowSwap]=useState(false);const[search,setSearch]=useState("");
  const[showObj,setShowObj]=useState(false);const[objInput,setObjInput]=useState(customObj?.text||"");
  const done=sets.filter(s=>s.done).length;const allD=done===sets.length&&done>0;const aList=alts||[];

  const allExList=Object.entries(EX).map(([id,e])=>({id,name:e.name,muscle:e.muscle}));
  const filtered=search.length>0?allExList.filter(e=>e.name.toLowerCase().includes(search.toLowerCase())||e.muscle.toLowerCase().includes(search.toLowerCase())):aList.length>0?[{id:exId,...EX[exId]},...aList.map(a=>({id:a,...EX[a]}))]:allExList.slice(0,8);

  useEffect(()=>{
    if(onData){
      const validSets=sets.filter(s=>s.done&&s.kg>0);
      const bestSet=validSets.length>0?validSets.reduce((b,s)=>s.kg>b.kg?s:b,validSets[0]):null;
      onData(exId,{activeId:aId,name:ax.name,muscle:ax.muscle,sets:sets.map(s=>({kg:s.kg,reps:s.reps,done:s.done,isPR:s.kg>0&&prR&&s.kg>prR.kg})),bestSet,prevBest:lp,hasPR:prs.length>0,objective:obj});
    }
  },[sets,prs]);

  const validate=i=>{const n=[...sets];n[i].done=true;setSets(n);if(prR&&n[i].kg>prR.kg){setPrs(p=>[...p,i]);if(navigator.vibrate)navigator.vibrate([100,50,100,50,200])}onRest(rest,ax.name)};
  const swap=nId=>{setAId(nId);onSwap(exId,nId);setRest(EX[nId].rest);setSets(Array(nSets).fill(null).map(()=>({kg:0,reps:0,done:false})));setPrs([]);setShowSwap(false);setSearch("");
    const co=customObjs[nId];setObjInput(co?.text||OBJ[nId]||"")};

  const setObjMode=(mode)=>{
    let text="";
    if(mode==="up"&&lp) text=`${lp.kg+5}kg × ${lp.r}`;
    else if(mode==="stable"&&lp) text=`${lp.kg}kg × ${lp.r+2}`;
    else if(mode==="custom") text=objInput||defaultObj;
    else text=defaultObj;
    setObjInput(text);
    onObjChange(aId,{mode,text});
    setShowObj(false);
  };
  const saveCustomObj=()=>{onObjChange(aId,{mode:"custom",text:objInput});setShowObj(false)};

  return(<div style={{background:allD?"linear-gradient(135deg,rgba(92,232,250,0.04),rgba(112,144,255,0.03))":T.bgCard,border:`1px solid ${allD?"rgba(92,232,250,0.12)":T.bd}`,borderRadius:16,marginBottom:10,overflow:"hidden"}}>
    <div onClick={()=>setOpen(!open)} style={{padding:"13px 16px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:open?`1px solid ${T.bd}`:"none"}}>
      <div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
        <span style={{fontSize:15,fontWeight:700,color:T.w}}>{ax.name}</span>
        {prs.length>0&&<span style={{fontSize:9,fontWeight:800,color:T.pk,background:"rgba(226,128,255,0.1)",border:"1px solid rgba(226,128,255,0.2)",padding:"2px 8px",borderRadius:10}}>🏆 PR</span>}
        <button onClick={e=>{e.stopPropagation();setShowSwap(!showSwap)}} style={{fontSize:9,fontWeight:700,color:T.vi,background:"rgba(168,140,255,0.08)",border:"1px solid rgba(168,140,255,0.15)",padding:"2px 8px",borderRadius:8,cursor:"pointer"}}>⇄ swap</button>
      </div>
      <div style={{fontSize:11,color:T.t3,marginTop:3}}>{ax.muscle}{lp?` · ${lp.kg}kg × ${lp.r}`:""}
        {obj&&<button onClick={e=>{e.stopPropagation();setShowObj(!showObj)}} style={{marginLeft:6,fontSize:10,color:T.vi,fontWeight:700,background:"rgba(168,140,255,0.06)",border:"1px solid rgba(168,140,255,0.12)",padding:"1px 7px",borderRadius:6,cursor:"pointer"}}>
          🎯 {obj} {objMode==="up"?"📈":objMode==="stable"?"🔒":""}
        </button>}
        {!obj&&<button onClick={e=>{e.stopPropagation();setShowObj(!showObj)}} style={{marginLeft:6,fontSize:10,color:T.t4,fontWeight:600,background:"rgba(180,200,255,0.04)",border:`1px solid ${T.bd}`,padding:"1px 7px",borderRadius:6,cursor:"pointer"}}>+ objectif</button>}
      </div></div>
      <div style={{display:"flex",alignItems:"center",gap:10}} onClick={e=>e.stopPropagation()}>
        <RC val={rest} set={setRest}/><span style={{fontSize:12,fontWeight:800,fontFamily:"monospace",color:allD?T.cy:T.t3,minWidth:30,textAlign:"center"}}>{done}/{sets.length}</span>
        <span onClick={e=>{e.stopPropagation();setOpen(!open)}} style={{color:T.t3,fontSize:12,cursor:"pointer",transform:open?"rotate(180deg)":"none",transition:"transform 0.2s",display:"inline-block"}}>▾</span></div></div>
    {/* Objective editor */}
    {showObj&&<div onClick={e=>e.stopPropagation()} style={{padding:"12px 16px",background:"rgba(168,140,255,0.04)",borderBottom:`1px solid ${T.bd}`}}>
      <div style={{fontSize:10,fontWeight:800,color:T.vi,letterSpacing:"1px",textTransform:"uppercase",marginBottom:8}}>🎯 Objectif pour {ax.name}</div>
      <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
        {[{id:"up",label:"📈 Augmenter",desc:lp?`${lp.kg+5}kg × ${lp.r}`:"+5kg"},
          {id:"stable",label:"🔒 Stabiliser",desc:lp?`${lp.kg}kg × ${lp.r+2}`:"+2 reps"},
          {id:"default",label:"🏠 V6",desc:defaultObj||"—"},
        ].map(m=><button key={m.id} onClick={()=>setObjMode(m.id)} style={{flex:"1 0 80px",padding:"8px 6px",borderRadius:9,cursor:"pointer",textAlign:"center",
          background:objMode===m.id?"rgba(168,140,255,0.12)":"rgba(180,200,255,0.03)",border:`1px solid ${objMode===m.id?"rgba(168,140,255,0.25)":T.bd}`,color:objMode===m.id?T.vi:T.t3}}>
          <div style={{fontSize:12,fontWeight:700}}>{m.label}</div>
          <div style={{fontSize:10,color:T.t4,marginTop:2}}>{m.desc}</div>
        </button>)}
      </div>
      <div style={{display:"flex",gap:6}}>
        <input type="text" value={objInput} onChange={e=>setObjInput(e.target.value)} placeholder="Ex: 150kg × 8"
          style={{flex:1,padding:"9px 12px",borderRadius:9,background:T.bgInput,border:`1px solid ${T.bdM}`,color:T.w,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
        <button onClick={saveCustomObj} style={{padding:"9px 16px",borderRadius:9,cursor:"pointer",background:"rgba(112,144,255,0.1)",border:"1px solid rgba(112,144,255,0.25)",color:T.blL,fontSize:12,fontWeight:700}}>OK</button>
      </div>
    </div>}
    {showSwap&&<div style={{padding:"10px 16px",background:"rgba(168,140,255,0.04)",borderBottom:`1px solid ${T.bd}`}}>
      <input type="text" placeholder="🔍 Rechercher un exercice..." value={search} onChange={e=>setSearch(e.target.value)} onClick={e=>e.stopPropagation()}
        style={{width:"100%",padding:"9px 12px",borderRadius:9,background:T.bgInput,border:`1px solid ${T.bdM}`,color:T.w,fontSize:13,outline:"none",marginBottom:8,fontFamily:"inherit"}}/>
      <div style={{maxHeight:180,overflowY:"auto",display:"flex",flexDirection:"column",gap:4}}>
        {filtered.slice(0,12).map(ex=><button key={ex.id} onClick={e=>{e.stopPropagation();swap(ex.id)}} style={{padding:"8px 12px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,textAlign:"left",
          background:aId===ex.id?"rgba(112,144,255,0.12)":"rgba(180,200,255,0.03)",border:`1px solid ${aId===ex.id?"rgba(112,144,255,0.25)":T.bd}`,color:aId===ex.id?T.blL:T.t2,display:"flex",justifyContent:"space-between"}}>
          <span>{ex.name}</span><span style={{fontSize:10,color:T.t4}}>{ex.muscle}</span></button>)}
        {filtered.length===0&&<div style={{fontSize:12,color:T.t3,padding:8,textAlign:"center"}}>Aucun exercice trouvé</div>}
      </div>
    </div>}
    {open&&<div style={{padding:"6px 16px 12px"}}>
      {ax.warm&&<div style={{padding:"8px 12px",marginBottom:8,borderRadius:10,background:"rgba(255,184,110,0.05)",border:"1px solid rgba(255,184,110,0.12)"}}>
        <div style={{fontSize:9,fontWeight:800,color:T.wa,letterSpacing:"1.2px",textTransform:"uppercase",marginBottom:5}}>Échauffement spécifique</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:4}}>{ax.warm.map((w,i)=><span key={i} style={{fontSize:10,padding:"3px 8px",borderRadius:6,background:"rgba(255,184,110,0.08)",border:"1px solid rgba(255,184,110,0.1)",color:"#DDBB88",fontWeight:600}}>{w}</span>)}</div></div>}
      <div style={{display:"grid",gridTemplateColumns:"30px 1fr 72px 72px 42px",gap:8,padding:"4px 0"}}>
        {["SET","PREV","KG","REPS",""].map((h,j)=><div key={j} style={{fontSize:9,fontWeight:800,color:T.t4,letterSpacing:"1.5px",textAlign:"center"}}>{h}</div>)}</div>
      {sets.map((s,i)=><SR key={i} i={i} prev={prev?.[i]} cur={s} up={u=>{const n=[...sets];n[i]={...u,done:s.done};setSets(n)}} val={()=>validate(i)} done={s.done} isPR={s.kg>0&&prR&&s.kg>prR.kg}/>)}
      <button onClick={()=>setSets([...sets,{kg:0,reps:0,done:false}])} style={{width:"100%",padding:"9px",marginTop:8,background:"none",border:`1.5px dashed ${T.bdM}`,borderRadius:9,color:T.t3,fontSize:12,fontWeight:600,cursor:"pointer"}}>+ Set</button>
    </div>}
  </div>);
}

function Nav({active,go}){return(<div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:50,background:"rgba(13,18,32,0.96)",backdropFilter:"blur(24px)",borderTop:`1px solid ${T.bdM}`,display:"flex",padding:"6px 0 calc(8px + env(safe-area-inset-bottom, 12px))"}}>
  {[{id:"home",i:"⚡",l:"Home"},{id:"stats",i:"📊",l:"Stats"},{id:"history",i:"📋",l:"Historique"},{id:"body",i:"📐",l:"Corps"}].map(x=><div key={x.id} onClick={()=>go(x.id)} style={{flex:1,textAlign:"center",cursor:"pointer",padding:"4px 0"}}><div style={{fontSize:18,marginBottom:2}}>{x.i}</div><div style={{fontSize:9,fontWeight:700,letterSpacing:"0.8px",color:active===x.id?T.blL:T.t4}}>{x.l}</div></div>)}
</div>)}

function Logo({sz}){const lg=sz==="lg";return(<div><div style={{fontSize:lg?34:17,fontWeight:900,letterSpacing:lg?"1px":"0.5px",lineHeight:1,background:T.ss,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",filter:`drop-shadow(0 0 ${lg?30:14}px rgba(192,208,255,0.25))`}}>ULTRA INSTINCT</div>{lg&&<div style={{marginTop:10,fontSize:11,fontWeight:600,letterSpacing:"5px",textTransform:"uppercase",color:T.t3,textAlign:"center"}}>Beyond your limits</div>}</div>)}

/* Mini sparkline */
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
  const ref=useRef(null);

  useEffect(()=>{if(scr==="workout"&&start){ref.current=setInterval(()=>setElapsed(Math.floor((Date.now()-start)/1000)),1000);return()=>clearInterval(ref.current)}},[scr,start]);

  // Save swaps to localStorage whenever they change
  useEffect(()=>{DB.setSwaps(swaps)},[swaps]);

  const handleObjChange=(exId,obj)=>{
    setCustomObjs(p=>{const n={...p,[exId]:obj};DB.setObjective(exId,obj);return n});
  };

  const goR=k=>{setRKey(k);setStart(Date.now());setElapsed(0);setWorkoutData({});setPrCount(0);setSessionNotes("");setScr("workout")};
  
  const handleExData=(slotId,data)=>{setWorkoutData(p=>({...p,[slotId]:data}));};

  const finish=()=>{
    clearInterval(ref.current);setTimer(null);
    const today=new Date().toISOString().slice(0,10);
    const dur=fm(elapsed);
    
    // Count PRs from workout data
    const prs=Object.values(workoutData).filter(d=>d.hasPR).length;
    setPrCount(prs);
    
    // Save session to history
    const session={id:Date.now(),routine:rKey,date:today,duration:dur,exercises:Object.keys(workoutData).length||INIT_ROUTINES[rKey].exercises.length,prs};
    const newHist=DB.addSession(session);
    setSessHist(newHist);
    
    // Update last date
    const newDates=DB.setLastDate(rKey,today);
    setLastDates(newDates);
    
    // Save exercise history entries (best set per exercise)
    Object.entries(workoutData).forEach(([_,d])=>{
      if(d.bestSet&&d.bestSet.kg>0){
        DB.addExerciseEntry(d.activeId,{d:today,kg:d.bestSet.kg,r:d.bestSet.reps});
      }
    });
    
    // Generate report
    const r=INIT_ROUTINES[rKey];
    const exResults=Object.values(workoutData).filter(d=>d.sets.some(s=>s.done));
    const report=generateReport(r.name,r.emoji,dur,exResults,new Date().toLocaleDateString("fr-FR"),"");
    setReportText(report);
    
    setScr("summary");
  };
  
  const handleCopyReport=async()=>{
    // Regenerate with latest notes
    const r=INIT_ROUTINES[rKey];
    const exResults=Object.values(workoutData).filter(d=>d.sets.some(s=>s.done));
    const freshReport=generateReport(r.name,r.emoji,fm(elapsed),exResults,new Date().toLocaleDateString("fr-FR"),sessionNotes);
    setReportText(freshReport);
    const ok=await copyReport(freshReport);
    setCopied(ok);
    setTimeout(()=>setCopied(false),2500);
  };
  
  const reset=()=>{setScr("home");setRKey(null);setStart(null);setElapsed(0);setWorkoutData({});setReportText("");setSessionNotes("")};
  const tRest=useCallback((dur,name)=>setTimer({duration:dur,exerciseName:name}),[]);
  const handleSwap=(origId,newId)=>setSwaps(p=>({...p,[origId]:newId===origId?undefined:newId}));
  const routine=rKey?INIT_ROUTINES[rKey]:null;

  const css=`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
    *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}input[type=number]{-moz-appearance:textfield}body{margin:0;background:${T.bg}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}@keyframes auraFloat{0%,100%{opacity:0.5;transform:translateY(0)}50%{opacity:0.9;transform:translateY(-8px)}}
    @keyframes logoGlow{0%,100%{filter:drop-shadow(0 0 20px rgba(192,208,255,0.15))}50%{filter:drop-shadow(0 0 35px rgba(192,208,255,0.3))}}`;
  const safeTop="env(safe-area-inset-top, 20px)";
  const shell={fontFamily:"'Outfit',-apple-system,sans-serif",background:T.bg,color:T.w,minHeight:"100vh",paddingBottom:"calc(76px + env(safe-area-inset-bottom, 0px))",position:"relative"};

  /* ═══ HOME ═══ */
  if(scr==="home"){return(<div style={shell}><style>{css}</style>
    <div style={{position:"fixed",top:"-25%",left:"5%",width:"90%",height:"55%",background:"radial-gradient(ellipse,rgba(112,144,255,0.07),rgba(168,140,255,0.04) 45%,transparent 75%)",pointerEvents:"none",animation:"auraFloat 8s ease-in-out infinite"}}/>
    <div style={{position:"relative",zIndex:1}}>
      <div style={{padding:`calc(20px + ${safeTop}) 24px 30px`,textAlign:"center"}}>
        <img src="/icon.png" alt="" style={{width:80,height:80,borderRadius:20,marginBottom:16,boxShadow:"0 0 40px rgba(112,144,255,0.15)",animation:"logoGlow 4s ease-in-out infinite"}}/>
        <Logo sz="lg"/></div>
      <div style={{padding:"0 16px"}}>
        <div style={{fontSize:10,fontWeight:800,color:T.t4,letterSpacing:"3px",textTransform:"uppercase",marginBottom:14,paddingLeft:2}}>Routines</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {Object.entries(INIT_ROUTINES).map(([key,r],idx)=>{const ld=lastDates[key];return(
            <button key={key} onClick={()=>goR(key)} style={{padding:"20px 16px 16px",borderRadius:16,cursor:"pointer",background:T.bgCard,border:`1px solid ${T.bd}`,textAlign:"left",position:"relative",overflow:"hidden",animation:`fadeUp 0.4s ease ${idx*0.08}s both`}}>
              <div style={{position:"absolute",top:-10,right:-10,width:70,height:70,background:"radial-gradient(circle,rgba(112,144,255,0.1),transparent 70%)",pointerEvents:"none"}}/>
              <div style={{position:"relative"}}>
                <div style={{fontSize:28,marginBottom:6}}>{r.emoji}</div>
                <div style={{fontSize:9,fontWeight:700,letterSpacing:"1.5px",color:T.bl,marginBottom:6}}>{r.tag}</div>
                <div style={{fontSize:17,fontWeight:800,color:T.w}}>{r.name}</div>
                <div style={{fontSize:11,color:T.t3,marginTop:3}}>{r.exercises.length} exos · {r.sets} séries</div>
                {ld&&<div style={{fontSize:10,color:T.t4,marginTop:6,fontWeight:600,display:"flex",alignItems:"center",gap:4}}>
                  <span style={{color:T.vi}}>●</span> {ago(ld)}
                </div>}
              </div>
            </button>)})}
        </div>
      </div>
    </div><Nav active="home" go={setScr}/></div>)}

  /* ═══ WORKOUT ═══ */
  if(scr==="workout"){return(<div style={shell}><style>{css}</style>
    <div style={{position:"sticky",top:0,zIndex:50,padding:`calc(10px + ${safeTop}) 16px 14px`,background:"rgba(13,18,32,0.95)",backdropFilter:"blur(24px)",borderBottom:`1px solid ${T.bdM}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <button onClick={reset} style={{width:34,height:34,borderRadius:9,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(180,200,255,0.04)",border:`1px solid ${T.bdM}`,color:T.t2,fontSize:16,fontWeight:700,padding:0}}>←</button>
        <div><div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:15,fontWeight:900,letterSpacing:"0.5px",background:T.ss,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",filter:"drop-shadow(0 0 10px rgba(192,208,255,0.2))"}}>UI</span>
          <div style={{padding:"3px 10px",borderRadius:7,background:T.bgInput,border:`1px solid ${T.bdM}`,display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:14}}>{routine.emoji}</span><span style={{fontSize:12,fontWeight:700,color:T.t1}}>{routine.name}</span></div></div>
          <div style={{fontSize:15,fontWeight:800,color:T.bl,fontVariantNumeric:"tabular-nums",marginTop:5,fontFamily:"monospace"}}>{fm(elapsed)}</div></div></div>
      <button onClick={finish} style={{padding:"9px 22px",borderRadius:10,cursor:"pointer",background:"rgba(92,232,250,0.08)",border:"1px solid rgba(92,232,250,0.22)",color:T.cy,fontSize:13,fontWeight:700}}>Terminer ✓</button></div>
    <div style={{padding:"14px 12px",paddingBottom:timer?150:80}}>
      {routine.warmup&&<div style={{padding:"12px 16px",borderRadius:14,marginBottom:12,background:"rgba(255,184,110,0.06)",border:"1px solid rgba(255,184,110,0.15)"}}>
        <div style={{fontSize:10,fontWeight:800,color:T.wa,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:6}}>🔥 Échauffement général</div>
        <div style={{fontSize:12,color:T.t2,lineHeight:1.7}}>{routine.warmup.split("→").map((s,i)=><span key={i}>{i>0&&<span style={{color:T.wa}}> → </span>}{s.trim()}</span>)}</div></div>}
      {routine.exercises.map((exId,i)=><div key={exId} style={{animation:`fadeUp 0.35s ease ${i*0.05}s both`}}>
        <ExCard exId={exId} alts={routine.alts[exId]} onRest={tRest} nSets={routine.sets} swaps={swaps} onSwap={handleSwap} onData={handleExData} customObjs={customObjs} onObjChange={handleObjChange}/></div>)}</div>
    {timer&&<RestTimer duration={timer.duration} exName={timer.exerciseName} onDone={()=>setTimer(null)} onSkip={()=>setTimer(null)}/>}
  </div>)}

  /* ═══ SUMMARY ═══ */
  if(scr==="summary"){return(<div style={shell}><style>{css}</style>
    <div style={{position:"fixed",top:"8%",left:"50%",transform:"translateX(-50%)",width:300,height:300,background:"radial-gradient(circle,rgba(92,232,250,0.08),rgba(112,144,255,0.04) 45%,transparent 75%)",pointerEvents:"none",animation:"auraFloat 6s ease-in-out infinite"}}/>
    <div style={{position:"relative",zIndex:1}}>
      <div style={{padding:`calc(20px + ${safeTop}) 24px 28px`,textAlign:"center"}}>
        <div style={{width:72,height:72,borderRadius:"50%",margin:"0 auto 18px",background:"rgba(92,232,250,0.06)",border:"1.5px solid rgba(92,232,250,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,boxShadow:"0 0 50px rgba(92,232,250,0.1)",animation:"fadeUp 0.5s ease both"}}>⚡</div>
        <div style={{fontSize:26,fontWeight:900,background:T.ss,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",filter:"drop-shadow(0 0 16px rgba(192,208,255,0.2))",animation:"fadeUp 0.4s ease 0.1s both"}}>Séance terminée</div>
        <p style={{margin:"10px 0 0",fontSize:14,color:T.t3,fontWeight:500,animation:"fadeUp 0.4s ease 0.15s both"}}>{routine.emoji} {routine.name} · {fm(elapsed)}</p></div>
      <div style={{padding:"0 16px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:16,animation:"fadeUp 0.4s ease 0.2s both"}}>
          {[{l:"Durée",v:fm(elapsed),c:T.bl},{l:"Exercices",v:Object.keys(workoutData).length||routine.exercises.length,c:T.vi},{l:"PRs",v:prCount,c:T.pk}].map((s,i)=>(<div key={i} style={{padding:"18px 10px",borderRadius:14,textAlign:"center",background:T.bgCard,border:`1px solid ${T.bd}`}}>
            <div style={{fontSize:22,fontWeight:900,color:s.c}}>{s.v}</div>
            <div style={{fontSize:10,color:T.t4,marginTop:5,fontWeight:600}}>{s.l}</div></div>))}</div>
        <div style={{padding:"22px 20px",borderRadius:16,background:T.am,border:"1px solid rgba(112,144,255,0.15)",marginBottom:14,animation:"fadeUp 0.4s ease 0.3s both"}}>
          <div style={{fontSize:15,fontWeight:800,marginBottom:6,background:T.ss,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>🤖 Rapport Claude</div>
          <div style={{fontSize:12,color:T.t2,marginBottom:12,lineHeight:1.6}}>Ajoute tes notes puis copie le rapport pour débriefer</div>
          <textarea value={sessionNotes} onChange={e=>setSessionNotes(e.target.value)} placeholder="Tes ressentis, questions, ajustements...&#10;Ex: Hack squat facile → monter à 150kg ?&#10;Douleur épaule droite sur le bench..." rows={4}
            style={{width:"100%",padding:"12px",borderRadius:10,background:T.bgInput,border:`1px solid ${T.bdM}`,color:T.w,fontSize:13,outline:"none",fontFamily:"inherit",resize:"vertical",lineHeight:1.6,marginBottom:12,minHeight:80}}/>
          <button onClick={handleCopyReport} style={{width:"100%",padding:"13px",borderRadius:10,cursor:"pointer",background:copied?"rgba(92,232,250,0.15)":"rgba(112,144,255,0.1)",border:`1.5px solid ${copied?"rgba(92,232,250,0.35)":"rgba(112,144,255,0.28)"}`,color:copied?T.cy:T.blL,fontSize:14,fontWeight:700,transition:"all 0.3s"}}>{copied?"✅ Copié dans le presse-papier !":"📋 Copier le rapport"}</button>
          {reportText&&<div style={{marginTop:12,textAlign:"left",padding:"12px",borderRadius:10,background:"rgba(0,0,0,0.2)",maxHeight:160,overflowY:"auto"}}>
            <pre style={{margin:0,fontSize:10,color:T.t3,whiteSpace:"pre-wrap",fontFamily:"monospace",lineHeight:1.5}}>{reportText.slice(0,400)}{reportText.length>400?"...":""}</pre>
          </div>}</div>
        <button onClick={reset} style={{width:"100%",padding:"14px",borderRadius:12,cursor:"pointer",background:T.bgCard,border:`1px solid ${T.bd}`,color:T.t2,fontSize:14,fontWeight:600}}>Retour</button>
      </div></div></div>)}

  /* ═══ HISTORY ═══ */
  if(scr==="history"){
    const[histView,setHistView]=useState("chrono"); // chrono | routine
    const grouped={};sessHist.forEach(s=>{if(!grouped[s.routine])grouped[s.routine]=[];grouped[s.routine].push(s)});
    return(<div style={shell}><style>{css}</style>
    <div style={{padding:`calc(16px + ${safeTop}) 20px 16px`}}><Logo sz="sm"/><h2 style={{margin:"12px 0 0",fontSize:22,fontWeight:800,color:T.w}}>Historique</h2></div>
    <div style={{display:"flex",padding:"0 16px",gap:6,marginBottom:16}}>
      {[{id:"chrono",l:"📅 Chronologique"},{id:"routine",l:"🏋️ Par routine"}].map(t=>(<button key={t.id} onClick={()=>setHistView(t.id)} style={{flex:1,padding:"9px 8px",borderRadius:10,cursor:"pointer",fontSize:12,fontWeight:700,background:histView===t.id?"rgba(112,144,255,0.1)":"rgba(180,200,255,0.03)",border:`1px solid ${histView===t.id?"rgba(112,144,255,0.25)":T.bd}`,color:histView===t.id?T.blL:T.t3}}>{t.l}</button>))}</div>
    <div style={{padding:"0 16px",paddingBottom:80}}>
      {histView==="chrono"&&sessHist.map((s,i)=>{const r=INIT_ROUTINES[s.routine];return(
        <div key={s.id} style={{padding:"14px 16px",borderRadius:14,marginBottom:8,background:T.bgCard,border:`1px solid ${T.bd}`,animation:`fadeUp 0.3s ease ${i*0.03}s both`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:16}}>{r?.emoji}</span>
            <span style={{fontSize:14,fontWeight:700,color:T.w}}>{r?.name}</span>
            {s.note&&<span style={{fontSize:9,fontWeight:700,color:T.wa,background:"rgba(255,184,110,0.08)",border:"1px solid rgba(255,184,110,0.15)",padding:"2px 7px",borderRadius:6}}>{s.note}</span>}
          </div>
          <div style={{fontSize:11,color:T.t3,marginTop:3}}>{dateFR(s.date)} · {s.duration} · {s.exercises} exos</div></div>
          <div style={{textAlign:"right"}}>{s.prs>0&&<div style={{fontSize:12,fontWeight:800,color:T.pk}}>🏆 {s.prs} PR{s.prs>1?"s":""}</div>}</div>
        </div>)})}
      {histView==="routine"&&Object.entries(grouped).map(([rk,sessions],gi)=>{const r=INIT_ROUTINES[rk];return(
        <div key={rk} style={{marginBottom:16,animation:`fadeUp 0.3s ease ${gi*0.05}s both`}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,padding:"0 4px"}}>
            <span style={{fontSize:18}}>{r?.emoji}</span>
            <span style={{fontSize:15,fontWeight:800,color:T.w}}>{r?.name}</span>
            <span style={{fontSize:11,color:T.t3}}>({sessions.length} séances)</span>
          </div>
          {sessions.map((s,i)=>(
            <div key={s.id} style={{padding:"10px 16px",borderRadius:12,marginBottom:6,background:T.bgCard,border:`1px solid ${T.bd}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:12,color:T.t2}}>{dateFR(s.date)} · {s.duration}</div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:11,color:T.t3}}>{s.exercises} exos</span>
                {s.prs>0&&<span style={{fontSize:11,fontWeight:800,color:T.pk}}>🏆 {s.prs}</span>}
              </div>
            </div>))}
        </div>)})}
    </div><Nav active="history" go={setScr}/></div>)}

  /* ═══ STATS ═══ */
  if(scr==="stats"){
    const allEx=Object.entries(EX).filter(([_,e])=>e.hist?.length>=2);
    const prBoard=Object.entries(EX).filter(([_,e])=>e.hist?.length>0).map(([id,e])=>{const p=e.hist.reduce((b,h)=>h.kg>b.kg?h:b,e.hist[0]);const g=p.kg-e.hist[0].kg;return{id,name:e.name,muscle:e.muscle,pr:p,gain:g,obj:OBJ[id]}}).sort((a,b)=>b.gain-a.gain);
    const vol=[{m:"Quadriceps",s:16,t:16,c:T.bl},{m:"Ischio-jambiers",s:10,t:10,c:T.vi},{m:"Pectoraux",s:14,t:15,c:T.pk},{m:"Dos",s:14,t:15,c:T.cy},{m:"Épaules",s:11,t:11,c:T.wa},{m:"Biceps",s:8,t:8,c:T.gn},{m:"Triceps",s:8,t:8,c:"#E8A08A"},{m:"Mollets",s:8,t:8,c:T.t2}];

    return(<div style={shell}><style>{css}</style>
      <div style={{padding:`calc(16px + ${safeTop}) 20px 16px`}}><Logo sz="sm"/><h2 style={{margin:"12px 0 0",fontSize:22,fontWeight:800,color:T.w}}>Statistiques</h2></div>
      <div style={{display:"flex",padding:"0 16px",gap:6,marginBottom:16}}>
        {[{id:"prs",l:"🏆 PRs"},{id:"progress",l:"📈 Courbes"},{id:"volume",l:"💪 Volume"}].map(t=>(<button key={t.id} onClick={()=>{setSTab(t.id);setSelEx(null)}} style={{flex:1,padding:"9px 8px",borderRadius:10,cursor:"pointer",fontSize:12,fontWeight:700,background:sTab===t.id?"rgba(112,144,255,0.1)":"rgba(180,200,255,0.03)",border:`1px solid ${sTab===t.id?"rgba(112,144,255,0.25)":T.bd}`,color:sTab===t.id?T.blL:T.t3}}>{t.l}</button>))}</div>
      <div style={{padding:"0 16px",paddingBottom:80}}>
        {sTab==="prs"&&<div>{prBoard.map((it,i)=>(<div key={it.id} onClick={()=>setSelEx(selEx===it.id?null:it.id)} style={{padding:"12px 16px",borderRadius:14,marginBottom:8,cursor:"pointer",background:selEx===it.id?T.bgEl:T.bgCard,border:`1px solid ${selEx===it.id?T.bdM:T.bd}`,animation:`fadeUp 0.3s ease ${i*0.03}s both`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:T.w}}>{it.name}</div><div style={{fontSize:11,color:T.t3,marginTop:2}}>{it.muscle}</div></div>
            <div style={{textAlign:"right"}}><div style={{fontSize:16,fontWeight:900,color:T.pk}}>{it.pr.kg}<span style={{fontSize:11,fontWeight:500,color:T.t3}}>kg</span> <span style={{fontSize:12,color:T.t2}}>× {it.pr.r}</span></div>
              {it.gain>0&&<div style={{fontSize:10,fontWeight:700,color:T.cy,marginTop:2}}>+{it.gain}kg</div>}</div></div>
          {it.obj&&<div style={{marginTop:4,fontSize:10,color:T.vi,fontWeight:600}}>🎯 {it.obj}</div>}
          {selEx===it.id&&<div style={{marginTop:10}}><Spark hist={EX[it.id].hist}/></div>}
        </div>))}</div>}
        {sTab==="progress"&&<div>{selEx?(<div>
          <button onClick={()=>setSelEx(null)} style={{padding:"6px 14px",borderRadius:8,cursor:"pointer",background:T.bgCard,border:`1px solid ${T.bdM}`,color:T.t2,fontSize:12,fontWeight:600,marginBottom:12}}>← Retour</button>
          <div style={{padding:"16px",borderRadius:16,background:T.bgCard,border:`1px solid ${T.bd}`}}>
            <div style={{fontSize:16,fontWeight:800,color:T.w,marginBottom:4}}>{EX[selEx].name}</div>
            <div style={{fontSize:11,color:T.t3,marginBottom:12}}>{EX[selEx].muscle} · {EX[selEx].hist.length} séances</div>
            <Spark hist={EX[selEx].hist}/>
            <div style={{marginTop:16}}>{[...EX[selEx].hist].reverse().map((h,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${T.bd}`}}>
              <span style={{fontSize:12,color:T.t2}}>{dateFR(h.d)}</span>
              <span style={{fontSize:13,fontWeight:700,color:i===0?T.pk:T.t1}}>{h.kg}kg × {h.r}</span></div>))}</div></div>
        </div>):(<div>{allEx.map(([id,ex],i)=>(<div key={id} onClick={()=>setSelEx(id)} style={{padding:"12px 16px",borderRadius:14,marginBottom:8,cursor:"pointer",background:T.bgCard,border:`1px solid ${T.bd}`,display:"flex",justifyContent:"space-between",alignItems:"center",animation:`fadeUp 0.3s ease ${i*0.02}s both`}}>
          <div><div style={{fontSize:13,fontWeight:700,color:T.w}}>{ex.name}</div><div style={{fontSize:10,color:T.t3,marginTop:2}}>{ex.muscle} · {ex.hist.length} séances</div></div>
          <div style={{display:"flex",alignItems:"center",gap:8}}><Spark hist={ex.hist}/><div style={{fontSize:14,fontWeight:800,color:T.pk,minWidth:45,textAlign:"right"}}>{ex.hist[ex.hist.length-1].kg}<span style={{fontSize:10,color:T.t3}}>kg</span></div></div></div>))}</div>)}</div>}
        {sTab==="volume"&&<div>
          <div style={{fontSize:10,fontWeight:800,color:T.t4,letterSpacing:"2px",textTransform:"uppercase",marginBottom:12}}>Séries / semaine</div>
          {vol.map((v,i)=>{const pct=Math.min((v.s/Math.max(...vol.map(x=>x.t)))*100,100);return(<div key={i} style={{padding:"12px 16px",borderRadius:14,marginBottom:8,background:T.bgCard,border:`1px solid ${T.bd}`,animation:`fadeUp 0.3s ease ${i*0.04}s both`}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:13,fontWeight:700,color:T.w}}>{v.m}</span><span style={{fontSize:13,fontWeight:800,color:v.c}}>{v.s}<span style={{fontSize:10,fontWeight:500,color:T.t3}}>/{v.t}</span></span></div>
            <div style={{height:6,borderRadius:3,background:"rgba(180,200,255,0.06)",overflow:"hidden"}}><div style={{height:"100%",borderRadius:3,background:v.c,width:`${pct}%`,boxShadow:`0 0 8px ${v.c}40`}}/></div></div>)})}
        </div>}
      </div><Nav active="stats" go={setScr}/></div>)}

  /* ═══ BODY / MENSURATIONS ═══ */
  if(scr==="body"){
    const[bodyTab,setBodyTab]=useState("dashboard");
    const[showForm,setShowForm]=useState(false);
    const[formData,setFormData]=useState({date:new Date().toISOString().slice(0,10),poids:"",bf:"",ventre:"",poitrine:"",cuisse:"",bras:"",muscle:"",meta:""});

    const latest=mensur.length>0?mensur[mensur.length-1]:null;
    const prev=mensur.length>1?mensur[mensur.length-2]:null;

    const delta=(key)=>{
      if(!latest||!prev||!latest[key]||!prev[key])return null;
      const d=latest[key]-prev[key];
      return d;
    };

    const sparkData=(key)=>mensur.filter(m=>m[key]!=null).map(m=>({d:m.date,kg:m[key],r:0}));

    const handleAddMensur=()=>{
      const entry={date:formData.date};
      MENSUR_FIELDS.forEach(f=>{if(formData[f.key]&&formData[f.key]!=="")entry[f.key]=parseFloat(formData[f.key])});
      if(Object.keys(entry).length>1){
        const updated=DB.addMensuration(entry);
        setMensur(updated);
        setShowForm(false);
        setFormData({date:new Date().toISOString().slice(0,10),poids:"",bf:"",ventre:"",poitrine:"",cuisse:"",bras:"",muscle:"",meta:""});
      }
    };

    return(<div style={shell}><style>{css}</style>
      <div style={{padding:`calc(16px + ${safeTop}) 20px 16px`}}>
        <Logo sz="sm"/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12}}>
          <h2 style={{margin:0,fontSize:22,fontWeight:800,color:T.w}}>Corps</h2>
          <button onClick={()=>setShowForm(!showForm)} style={{padding:"8px 16px",borderRadius:10,cursor:"pointer",background:showForm?"rgba(226,128,255,0.1)":"rgba(112,144,255,0.1)",border:`1px solid ${showForm?"rgba(226,128,255,0.25)":"rgba(112,144,255,0.25)"}`,color:showForm?T.pk:T.blL,fontSize:12,fontWeight:700}}>{showForm?"✕ Fermer":"+ Mesure"}</button>
        </div>
      </div>

      {/* Form */}
      {showForm&&<div style={{padding:"0 16px",marginBottom:16,animation:"fadeUp 0.3s ease both"}}>
        <div style={{padding:"16px",borderRadius:16,background:T.bgCard,border:`1px solid ${T.bdM}`}}>
          <div style={{fontSize:10,fontWeight:800,color:T.vi,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:12}}>📐 Nouvelle mesure</div>
          <div style={{marginBottom:12}}>
            <label style={{fontSize:11,color:T.t3,fontWeight:600,display:"block",marginBottom:4}}>Date</label>
            <input type="date" value={formData.date} onChange={e=>setFormData(p=>({...p,date:e.target.value}))}
              style={{width:"100%",padding:"10px 12px",borderRadius:9,background:T.bgInput,border:`1px solid ${T.bdM}`,color:T.w,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {MENSUR_FIELDS.map(f=>(
              <div key={f.key}>
                <label style={{fontSize:10,color:T.t3,fontWeight:600,display:"block",marginBottom:3}}>{f.icon} {f.label} ({f.unit})</label>
                <input type="number" inputMode="decimal" step="0.1" placeholder={latest?.[f.key]?.toString()||""} value={formData[f.key]}
                  onChange={e=>setFormData(p=>({...p,[f.key]:e.target.value}))}
                  style={{width:"100%",padding:"9px 10px",borderRadius:9,background:T.bgInput,border:`1px solid ${T.bdM}`,color:T.w,fontSize:14,fontWeight:600,outline:"none",fontFamily:"inherit"}}/>
              </div>
            ))}
          </div>
          <button onClick={handleAddMensur} style={{width:"100%",marginTop:14,padding:"12px",borderRadius:10,cursor:"pointer",background:"rgba(112,144,255,0.1)",border:"1.5px solid rgba(112,144,255,0.28)",color:T.blL,fontSize:14,fontWeight:700}}>✓ Enregistrer</button>
        </div>
      </div>}

      {/* Tabs */}
      <div style={{display:"flex",padding:"0 16px",gap:6,marginBottom:16}}>
        {[{id:"dashboard",l:"📊 Vue"},{id:"history",l:"📋 Historique"}].map(t=>(
          <button key={t.id} onClick={()=>setBodyTab(t.id)} style={{flex:1,padding:"9px 8px",borderRadius:10,cursor:"pointer",fontSize:12,fontWeight:700,background:bodyTab===t.id?"rgba(112,144,255,0.1)":"rgba(180,200,255,0.03)",border:`1px solid ${bodyTab===t.id?"rgba(112,144,255,0.25)":T.bd}`,color:bodyTab===t.id?T.blL:T.t3}}>{t.l}</button>
        ))}
      </div>

      <div style={{padding:"0 16px",paddingBottom:80}}>
        {/* Dashboard */}
        {bodyTab==="dashboard"&&<div>
          {latest&&<div style={{fontSize:10,color:T.t4,fontWeight:600,marginBottom:12}}>Dernière mesure : {dateFR(latest.date)}</div>}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {MENSUR_FIELDS.map((f,i)=>{
              const val=latest?.[f.key];
              const d=delta(f.key);
              const hist=sparkData(f.key);
              if(!val&&hist.length===0)return null;
              return(
                <div key={f.key} style={{padding:"14px 12px",borderRadius:14,background:T.bgCard,border:`1px solid ${T.bd}`,animation:`fadeUp 0.3s ease ${i*0.04}s both`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                    <span style={{fontSize:10,color:T.t3,fontWeight:600}}>{f.icon} {f.label}</span>
                    {d!=null&&<span style={{fontSize:10,fontWeight:700,color:
                      f.key==="ventre"?(d<=0?T.cy:T.wa)
                      :f.key==="bf"?(d<=0?T.cy:T.wa)
                      :(d>=0?T.cy:T.wa)
                    }}>{d>0?"+":""}{d.toFixed(1)}{f.unit}</span>}
                  </div>
                  <div style={{fontSize:22,fontWeight:900,color:f.color}}>{val}{f.unit!=="kg"&&f.unit!=="%"&&f.unit!=="kcal"?" ":""}<span style={{fontSize:12,fontWeight:500,color:T.t3}}>{f.unit}</span></div>
                  {f.obj&&<div style={{fontSize:10,color:T.vi,fontWeight:600,marginTop:4}}>🎯 {f.obj}</div>}
                  {hist.length>=2&&<div style={{marginTop:8}}><Spark hist={hist}/></div>}
                </div>
              );
            })}
          </div>

          {/* Progression summary */}
          {mensur.length>=2&&<div style={{marginTop:16,padding:"16px",borderRadius:14,background:T.bgCard,border:`1px solid ${T.bd}`,animation:"fadeUp 0.3s ease 0.3s both"}}>
            <div style={{fontSize:10,fontWeight:800,color:T.t4,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:10}}>📈 Progression depuis le début</div>
            {MENSUR_FIELDS.filter(f=>{const first=mensur.find(m=>m[f.key]!=null);const last2=mensur.slice().reverse().find(m=>m[f.key]!=null);return first&&last2&&first!==last2}).map(f=>{
              const first=mensur.find(m=>m[f.key]!=null);
              const last2=mensur.slice().reverse().find(m=>m[f.key]!=null);
              const diff=last2[f.key]-first[f.key];
              const good=f.key==="ventre"||f.key==="bf"?diff<=0:diff>=0;
              return(<div key={f.key} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${T.bd}`}}>
                <span style={{fontSize:12,color:T.t2}}>{f.label}</span>
                <span style={{fontSize:12,fontWeight:800,color:good?T.cy:T.wa}}>{diff>0?"+":""}{diff.toFixed(1)} {f.unit}</span>
              </div>);
            })}
          </div>}
        </div>}

        {/* History */}
        {bodyTab==="history"&&<div>
          {[...mensur].reverse().map((m,i)=>(
            <div key={i} style={{padding:"14px 16px",borderRadius:14,marginBottom:8,background:T.bgCard,border:`1px solid ${T.bd}`,animation:`fadeUp 0.3s ease ${i*0.03}s both`}}>
              <div style={{fontSize:12,fontWeight:700,color:T.blL,marginBottom:8}}>{dateFR(m.date)}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
                {MENSUR_FIELDS.filter(f=>m[f.key]!=null).map(f=>(
                  <div key={f.key} style={{textAlign:"center"}}>
                    <div style={{fontSize:9,color:T.t4,fontWeight:600}}>{f.icon}</div>
                    <div style={{fontSize:14,fontWeight:800,color:f.color}}>{m[f.key]}</div>
                    <div style={{fontSize:8,color:T.t4}}>{f.unit}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>}
      </div>
      <Nav active="body" go={setScr}/>
    </div>);
  }

  return null;
}
