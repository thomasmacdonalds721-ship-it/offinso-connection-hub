/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  HardHat, Construction, Mountain, Zap, ShowerHead, Droplets, FlaskConical, GlassWater,
  Siren, Flame, AlertTriangle, Phone, Stethoscope, HeartPulse, Bandage, Activity,
  ClipboardList, Gauge, FileText, Megaphone, Sun, Moon, Brain, Dumbbell, Award,
  Check, ChevronRight, ArrowLeft, CheckCircle, Sparkles,
} from 'lucide-react';

type IconType = React.ComponentType<{ className?: string }>;

interface ChecklistItem { label?: string; text: string; }
interface LessonSection {
  heading: string;
  icon: IconType;
  paragraph: string;
  checklist?: ChecklistItem[];
  callout?: { label: string; text: string };
  danger?: { label: string; text: string };
}
interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
interface CourseModuleData {
  title: string;
  twiTitle: string;
  tagline: string;
  icon: IconType;
  sections: LessonSection[];
  quiz: QuizQuestion[];
}

const COURSE_MODULES: CourseModuleData[] = [
  {
    title: 'Workplace Safety Protocols',
    twiTitle: 'Ahobammɔ Nhyehyɛe Wɔ Adwumam',
    tagline: 'Master the fundamentals before stepping on site.',
    icon: HardHat,
    sections: [
      {
        heading: 'Personal Protective Equipment (PPE)',
        icon: HardHat,
        paragraph: 'Personal Protective Equipment is your last line of defense against workplace hazards. On every construction site, wearing the correct PPE is non-negotiable and legally required under occupational health and safety legislation.',
        checklist: [
          { label: 'Hard hat', text: 'Must meet ANSI/CSA standards; inspect before each use for cracks or dents.' },
          { label: 'High-visibility vest', text: 'Class 2 or 3 required near moving equipment or traffic.' },
          { label: 'Steel-toed boots', text: 'Must have puncture-resistant soles on sites with nail or sharp debris hazards.' },
          { label: 'Safety glasses/goggles', text: 'Required during cutting, grinding, drilling, and chemical handling.' },
          { label: 'Gloves', text: 'Match glove type to task — cut-resistant, chemical-resistant, or heat-resistant.' },
          { label: 'Hearing protection', text: 'Required when noise levels exceed 85 dB(A).' },
          { label: 'Respirator', text: 'N95 minimum for dust; full-face respirator for fumes or chemicals.' },
        ],
        callout: { label: 'Rule', text: 'Never modify, remove, or substitute PPE without authorization from your supervisor. Damaged PPE must be removed from service immediately.' },
      },
      {
        heading: 'Site Access & Controlled Zones',
        icon: Construction,
        paragraph: 'Construction sites are divided into controlled areas based on risk level. Understanding and respecting these boundaries prevents unauthorized entry into active hazard zones.',
        checklist: [
          { label: 'Exclusion zones', text: 'No entry without direct site supervisor authorization; typically used around cranes, excavations, and demolition areas.' },
          { label: 'Restricted zones', text: 'Access limited to trained workers with task-specific authorization.' },
          { label: 'Controlled zones', text: 'General site area; all workers must sign in and wear site PPE.' },
          { text: 'Perimeter fencing, safety tape, and signage must always be respected — never duck under barriers.' },
          { text: 'Visitors must be escorted at all times and provided with appropriate PPE.' },
        ],
        danger: { label: 'Never enter an exclusion zone without explicit clearance.', text: 'Unauthorized entry around overhead work, crane lifts, and excavations is a leading cause of fatalities.' },
      },
      {
        heading: 'Working at Height',
        icon: Mountain,
        paragraph: 'Falls from height account for a significant proportion of all construction fatalities. Any work above 1.8 metres (6 feet) requires fall protection systems.',
        checklist: [
          { text: 'Always use guardrails, safety nets, or personal fall arrest systems (PFAS) at height.' },
          { text: 'Inspect ladders before every use — check for cracks, loose rungs, and secure footing.' },
          { text: 'Scaffolding must be erected, altered, and dismantled only by competent persons.' },
          { text: 'Secure all tools and materials at height to prevent dropped-object injuries below.' },
          { text: 'Never work at height in high winds, icy conditions, or during lightning risk.' },
        ],
      },
      {
        heading: 'Electrical & Mechanical Safety',
        icon: Zap,
        paragraph: 'Electrical hazards and moving machinery are among the top causes of serious injuries on construction sites.',
        checklist: [
          { text: 'Follow lockout/tagout (LOTO) procedures before any maintenance or repair work on machinery.' },
          { text: 'Maintain a minimum 3-metre clearance from overhead power lines unless de-energized and grounded by the utility.' },
          { text: 'All portable electrical equipment must be inspected and tagged regularly.' },
          { text: 'Never bypass machine guards or safety interlocks under any circumstances.' },
          { text: 'Report frayed cords, exposed wires, or tripping circuits immediately.' },
        ],
        callout: { label: 'Remember', text: "Electricity can arc across a gap — you don't have to touch a live wire to receive a fatal shock." },
      },
    ],
    quiz: [
      { question: 'What is the minimum safe clearance distance from overhead power lines on a construction site?', options: ['1 metre', '3 metres', '5 metres', '10 metres'], correctIndex: 1, explanation: 'A minimum 3-metre (10-foot) clearance is required from overhead power lines unless they have been de-energized and grounded by the utility provider.' },
      { question: 'Which class of high-visibility vest is required near moving equipment or active traffic?', options: ['Class 1', 'Class 2 or 3', 'Any class', 'No vest is required'], correctIndex: 1, explanation: 'Class 2 or Class 3 high-visibility vests are required near moving equipment and traffic because they offer significantly greater conspicuity.' },
      { question: 'At what height does fall protection become legally required on a construction site?', options: ['3 metres (10 ft)', '1.8 metres (6 ft)', '4.5 metres (15 ft)', '2.4 metres (8 ft)'], correctIndex: 1, explanation: 'Fall protection is required for any work above 1.8 metres (6 feet). This includes guardrails, safety nets, or personal fall arrest systems.' },
      { question: 'What procedure must always be followed before maintaining or repairing machinery?', options: ['Notify a co-worker', 'Lockout/Tagout (LOTO)', 'Turn the machine off', 'Wear extra PPE'], correctIndex: 1, explanation: 'Lockout/Tagout (LOTO) is mandatory before any maintenance work. Simply turning a machine off is not sufficient — energy sources must be physically isolated and locked.' },
      { question: 'What should you do with PPE that has a visible crack or damage?', options: ['Continue using it carefully', 'Tape the damage and continue', 'Remove it from service immediately', 'Use it for lighter tasks only'], correctIndex: 2, explanation: 'Damaged PPE must be removed from service immediately. Compromised equipment cannot be relied upon to provide adequate protection and must be replaced.' },
    ],
  },
  {
    title: 'Worksite Hygiene',
    twiTitle: 'Adwumam Ahotefo',
    tagline: "Clean habits protect your health and your crew's health.",
    icon: ShowerHead,
    sections: [
      {
        heading: 'Personal Hygiene on Site',
        icon: ShowerHead,
        paragraph: 'Construction sites expose workers to dust, chemicals, biological hazards, and physical contaminants. Maintaining strict personal hygiene habits significantly reduces the risk of occupational illness.',
        checklist: [
          { text: 'Wash hands thoroughly with soap and water for at least 20 seconds before eating, drinking, or smoking.' },
          { text: 'Never eat, drink, or smoke in areas where hazardous substances are used or present.' },
          { text: 'Remove contaminated work clothes before leaving the site; change into clean clothing.' },
          { text: 'Shower before going home when working with asbestos, lead, silica dust, or chemical substances.' },
          { text: 'Do not wipe face with work gloves or contaminated hands.' },
        ],
        callout: { label: 'Lead & Asbestos', text: 'These materials can be brought home on skin, hair, and clothing, exposing your family. Decontamination before leaving the worksite is mandatory when these hazards are present.' },
      },
      {
        heading: 'Sanitation Facilities',
        icon: Droplets,
        paragraph: 'Employers are legally required to provide adequate sanitation facilities for all workers. These facilities must be maintained in a clean and functional condition.',
        checklist: [
          { text: 'A minimum of 1 toilet facility per 20 workers is required by most occupational health regulations.' },
          { text: 'Handwashing stations with soap, water, and drying facilities must be adjacent to toilets.' },
          { text: 'Facilities should be located within a reasonable distance (typically no more than 200m) of the work area.' },
          { text: 'Portable facilities must be serviced and cleaned regularly — report failures to your supervisor.' },
          { text: 'Use only designated facilities; never use the open site as a toilet.' },
        ],
      },
      {
        heading: 'Chemical & Substance Exposure',
        icon: FlaskConical,
        paragraph: 'Construction workers encounter a wide range of hazardous substances including silica dust, asbestos fibres, solvents, adhesives, paints, and concrete chemicals. Exposure can cause serious long-term disease.',
        checklist: [
          { text: 'Always read the Safety Data Sheet (SDS) before working with any chemical substance.' },
          { text: 'Use wet-cutting, vacuum-attached tools, or water suppression to control silica dust.' },
          { text: 'Store chemicals in their original containers with labels intact.' },
          { text: 'Never mix chemicals unless explicitly instructed in the SDS — mixing can create toxic gases.' },
          { text: 'Report any spills immediately and do not attempt to clean hazardous chemical spills without appropriate training.' },
        ],
        danger: { label: 'Silica dust', text: 'from cutting concrete, brick, or stone causes silicosis — an irreversible and potentially fatal lung disease. Always use respiratory protection and dust suppression.' },
      },
      {
        heading: 'Hydration & Site Water',
        icon: GlassWater,
        paragraph: 'Dehydration is a serious risk on construction sites, particularly in warm conditions. Dehydrated workers lose concentration and physical capability, increasing accident risk.',
        checklist: [
          { text: 'Drink water regularly — at least 250ml every 20 minutes during physical work in hot conditions.' },
          { text: 'Employers must provide potable (safe drinking) water accessible to all workers.' },
          { text: 'Never drink water from site plumbing, temporary connections, or standing water sources.' },
          { text: 'Watch for early signs of heat exhaustion: heavy sweating, dizziness, nausea, and cramps.' },
        ],
      },
    ],
    quiz: [
      { question: 'How long should you wash your hands with soap and water before eating on a construction site?', options: ['5 seconds', '10 seconds', 'At least 20 seconds', '1 minute'], correctIndex: 2, explanation: 'Handwashing for at least 20 seconds with soap and water is the recommended minimum to effectively remove contaminants before eating or touching your face.' },
      { question: 'What document must you read before working with any chemical substance on a construction site?', options: ['Safety Management Plan', 'Risk Register', 'Safety Data Sheet (SDS)', 'Toolbox Talk Record'], correctIndex: 2, explanation: 'The Safety Data Sheet (SDS) provides essential information about hazards, handling, storage, and emergency procedures for every chemical substance used on site.' },
      { question: 'What lung disease is caused by inhaling silica dust from cutting concrete or stone?', options: ['Mesothelioma', 'Silicosis', 'Asbestosis', 'Pneumonia'], correctIndex: 1, explanation: 'Silicosis is an irreversible and potentially fatal lung disease caused by inhaling fine silica dust. It develops over time with repeated, unprotected exposure to silica.' },
      { question: 'How often should workers drink water during physical work in hot conditions?', options: ['Every 2 hours', 'Only when thirsty', 'Every 20 minutes', 'Once before starting work'], correctIndex: 2, explanation: 'During physical work in hot conditions, workers should drink at least 250ml of water every 20 minutes. Do not wait until you feel thirsty — thirst is already a sign of mild dehydration.' },
      { question: 'Where should workers never eat or drink on a construction site?', options: ['In designated lunchrooms only', 'In areas where hazardous substances are present', 'Near the site entrance', 'All of the above'], correctIndex: 1, explanation: 'Eating, drinking, or smoking in areas where hazardous substances are present creates a direct route of ingestion — one of the most dangerous forms of chemical exposure.' },
    ],
  },
  {
    title: 'Emergency Response',
    twiTitle: 'Amanehunu Mmuaeɛ',
    tagline: 'Seconds matter. Know your plan before an emergency happens.',
    icon: Siren,
    sections: [
      {
        heading: 'Emergency Plans & Muster Points',
        icon: Siren,
        paragraph: "Every construction site must have a documented Emergency Response Plan (ERP). All workers must be briefed on this plan at site induction and must know the key procedures before starting work.",
        checklist: [
          { text: "Locate the site's Emergency Response Plan in your induction pack or site office on your first day." },
          { text: 'Know the locations of all muster (assembly) points — these are where everyone gathers after evacuation.' },
          { text: 'Know all emergency exits and evacuation routes; note any alternative routes in case the primary route is blocked.' },
          { text: "Know the name and location of the site's Emergency Warden(s) or Fire Warden." },
          { text: 'Understand the alarm system: what different alarm signals mean (e.g., continuous alarm = evacuate immediately).' },
        ],
        callout: { label: 'Action on hearing the alarm', text: 'Stop work immediately, secure any equipment that poses a hazard if left unattended, and proceed calmly to the nearest muster point. Never use elevators during an emergency evacuation.' },
      },
      {
        heading: 'Fire Safety',
        icon: Flame,
        paragraph: 'Fire on a construction site can spread rapidly due to the presence of flammable materials, open structures, and inadequate fire suppression systems in incomplete buildings.',
        checklist: [
          { text: 'Know the location of fire extinguishers near your work area. Never remove or cover them.' },
          { text: 'Understand fire extinguisher classes: A (ordinary combustibles), B (flammable liquids), C (electrical), D (metals).' },
          { text: 'Use PASS technique: Pull the pin, Aim at the base of the fire, Squeeze the handle, Sweep side to side.' },
          { text: 'Only attempt to fight a fire if it is small, contained, you have an escape route, and you are trained.' },
          { text: 'For large fires: raise the alarm, evacuate, call emergency services. Do not attempt to fight it.' },
          { text: 'Store flammable materials in designated, approved storage areas away from ignition sources.' },
        ],
        danger: { label: 'Never prop open fire doors or use them for storage.', text: 'Fire doors are life-saving barriers — they must always be fully operational and unobstructed.' },
      },
      {
        heading: 'Structural Collapse & Entrapment',
        icon: AlertTriangle,
        paragraph: 'Excavation collapses, structural failures, and trench cave-ins are among the most rapidly fatal construction emergencies. Response must be fast and controlled.',
        checklist: [
          { text: 'Call emergency services (911 / local emergency number) immediately.' },
          { text: 'Do NOT enter a collapsed area to rescue — secondary collapse is extremely common.' },
          { text: 'Keep bystanders clear of the collapse zone and maintain a safe perimeter.' },
          { text: 'Communicate with any trapped persons to provide reassurance and monitor their condition.' },
          { text: 'Provide rescuers with site plans, utility locations, and structural drawings when they arrive.' },
        ],
      },
      {
        heading: 'Calling Emergency Services',
        icon: Phone,
        paragraph: 'When calling emergency services, clear and accurate information speeds response time significantly. Know what to say before you dial.',
        checklist: [
          { text: 'State your name and the nature of the emergency clearly.' },
          { text: 'Give the exact site address, including street number, cross streets, and any site entry instructions.' },
          { text: 'Describe the number of persons injured, their apparent condition, and the type of incident.' },
          { text: 'Do not hang up until the dispatcher tells you to — they may need additional information.' },
          { text: 'Send someone to the site entrance to direct emergency services directly to the incident location.' },
        ],
        callout: { label: 'Post this at every work area', text: "Site address, site supervisor's name and mobile number, nearest hospital address, emergency services number." },
      },
    ],
    quiz: [
      { question: 'What does PASS stand for when using a fire extinguisher?', options: ['Push, Aim, Spray, Suppress', 'Pull, Aim, Squeeze, Sweep', 'Pin, Aim, Start, Stop', 'Point, Activate, Spray, Step back'], correctIndex: 1, explanation: 'PASS stands for Pull the pin, Aim at the base of the fire, Squeeze the handle, and Sweep side to side. Always aim at the base — not the flames.' },
      { question: 'Someone is trapped in a trench collapse. What is your FIRST action?', options: ['Climb in immediately to rescue them', 'Call emergency services', 'Try to dig them out with your hands', 'Wait to see if they free themselves'], correctIndex: 1, explanation: 'Call emergency services immediately. Never enter a collapsed trench — secondary collapse is extremely common and entering makes you a second victim. Rescue must be performed by trained responders.' },
      { question: 'Which fire extinguisher class is correct for an electrical fire?', options: ['Class A', 'Class B', 'Class C', 'Class D'], correctIndex: 2, explanation: 'Class C extinguishers are rated for electrical fires. Using water (Class A) on an electrical fire creates a serious electrocution risk.' },
      { question: 'During an emergency evacuation, you should:', options: ['Take the elevator to ground floor', 'Stop to gather your personal belongings first', 'Proceed calmly to the nearest muster point via the emergency exit', 'Wait until the alarm stops before evacuating'], correctIndex: 2, explanation: 'During evacuation, proceed immediately and calmly to the muster point via the emergency exit. Never use elevators, never delay for belongings, and never wait — alarms are an immediate action signal.' },
      { question: 'When calling emergency services, you should NOT:', options: ['State the exact site address', 'Describe the number of injured persons', 'Hang up before the dispatcher releases you', 'Send someone to meet emergency services at the site entrance'], correctIndex: 2, explanation: 'Never hang up before the dispatcher tells you to. Dispatchers often need to gather more information, provide instructions, or keep the line open to coordinate the response.' },
    ],
  },
  {
    title: 'First Aid Basics',
    twiTitle: 'Ayaresa Mfiase',
    tagline: 'Bridge the gap between injury and professional care.',
    icon: Bandage,
    sections: [
      {
        heading: 'The Primary Survey (DRSABCD)',
        icon: Stethoscope,
        paragraph: 'Before providing any first aid, always follow the Primary Survey to assess the scene and casualty safely. This structured approach applies to all serious emergencies.',
        checklist: [
          { label: 'D — Danger', text: 'Check for hazards to you, bystanders, and the patient. Do not put yourself at risk.' },
          { label: 'R — Response', text: 'Gently call to the patient and tap their shoulders. Are they conscious?' },
          { label: 'S — Send for help', text: 'Call 911/emergency services or direct someone specific to call.' },
          { label: 'A — Airway', text: 'Tilt the head back and lift the chin to open the airway. Look for obstructions.' },
          { label: 'B — Breathing', text: 'Look, listen, and feel for normal breathing for no more than 10 seconds.' },
          { label: 'C — CPR', text: 'If not breathing normally, begin CPR immediately.' },
          { label: 'D — Defibrillation', text: 'Attach an AED as soon as one is available.' },
        ],
      },
      {
        heading: 'CPR Essentials',
        icon: HeartPulse,
        paragraph: "Cardiopulmonary Resuscitation (CPR) keeps oxygen circulating when the heart has stopped. Starting CPR quickly can double or triple a person's chance of survival.",
        checklist: [
          { text: 'Position the heel of your hand on the centre of the chest (lower half of the sternum).' },
          { text: 'Push down hard and fast — at least 5cm (2 inches) depth, at a rate of 100–120 compressions per minute.' },
          { text: 'If trained in rescue breaths: give 30 compressions followed by 2 rescue breaths (30:2 ratio).' },
          { text: 'If untrained or uncomfortable with breaths: perform compression-only CPR continuously.' },
          { text: 'Continue CPR without stopping until the person shows signs of life, an AED is ready, or professional responders take over.' },
        ],
        callout: { label: 'Rhythm tip', text: 'The song "Stayin\' Alive" by the Bee Gees is approximately 100 BPM — use it mentally to maintain the correct compression rate.' },
      },
      {
        heading: 'Controlling Bleeding',
        icon: Bandage,
        paragraph: 'Severe bleeding is one of the leading causes of preventable death from trauma. Fast, effective control of bleeding is among the most important first aid skills on a construction site.',
        checklist: [
          { text: 'Apply firm, direct pressure to the wound using a clean cloth, dressing, or bandage.' },
          { text: 'Maintain continuous pressure — do not lift the dressing to check; if blood soaks through, add more material on top.' },
          { text: "For limb wounds that won't stop bleeding with pressure: apply a tourniquet 5–7cm above the wound." },
          { text: 'Elevate the injured limb above the level of the heart if possible and safe to do so.' },
          { text: 'Do not remove embedded objects; stabilize them in place to prevent further damage.' },
        ],
        danger: { label: 'Never remove a tourniquet once applied.', text: 'Removing a tourniquet in the field can cause a sudden surge of toxins into the bloodstream and fatal haemorrhage. Leave it in place for medical professionals.' },
      },
      {
        heading: 'Burns, Shock & Fractures',
        icon: Activity,
        paragraph: 'Construction sites carry elevated risks of burns from hot surfaces, chemicals, and electrical contact, as well as fractures and traumatic shock.',
        checklist: [
          { label: 'Burns', text: 'Cool the burn under cool (not cold) running water for a minimum of 20 minutes. Do not use ice, butter, or creams. Cover with a clean non-fluffy dressing.' },
          { label: 'Chemical burns', text: 'Brush off dry chemical first, then flush with large amounts of water for 20+ minutes. Remove contaminated clothing.' },
          { label: 'Shock', text: 'Lay the person down, raise their legs (unless head/spine injury), keep them warm, and reassure them. Do not give anything to eat or drink.' },
          { label: 'Fractures', text: 'Immobilize the injury in the position found. Do not attempt to straighten a broken limb. Splint if trained to do so.' },
        ],
      },
    ],
    quiz: [
      { question: 'In CPR, what is the correct compression-to-breath ratio for trained rescuers?', options: ['15:2', '30:2', '10:1', '20:2'], correctIndex: 1, explanation: 'The correct CPR ratio is 30 chest compressions followed by 2 rescue breaths (30:2). This ratio is used for adult CPR and is the international standard.' },
      { question: 'How long should you cool a thermal burn under running water?', options: ['2 minutes', '5 minutes', 'At least 20 minutes', '10 minutes'], correctIndex: 2, explanation: 'Burns must be cooled under cool (not cold) running water for a minimum of 20 minutes. This significantly reduces tissue damage and pain. Stopping early is a common mistake.' },
      { question: 'What is the FIRST step in the DRSABCD primary survey?', options: ['Check for breathing', 'Danger — check for hazards', 'Start CPR', 'Call for help'], correctIndex: 1, explanation: 'D — Danger is always the first step. You must check for hazards to yourself, bystanders, and the patient before approaching. A first aider who becomes a casualty helps no one.' },
      { question: 'When controlling severe bleeding, if blood soaks through the dressing you should:', options: ['Remove it and apply a fresh dressing', 'Add more material on top and maintain pressure', 'Reduce the pressure to see if bleeding has slowed', 'Apply ice over the dressing'], correctIndex: 1, explanation: 'Add more material on top and maintain continuous pressure. Removing the dressing disrupts the clotting process and can restart bleeding that had begun to slow.' },
      { question: 'What should you do if someone on site goes into shock?', options: ['Sit them upright and give them water', 'Lay them down, raise their legs if safe, keep them warm', 'Apply cold packs to their forehead', 'Leave them and call for help only'], correctIndex: 1, explanation: 'For shock: lay the person flat, raise their legs above heart level (unless there is a suspected head, spine, or leg injury), keep them warm with a blanket, reassure them, and monitor until help arrives. Do not give food or drink.' },
    ],
  },
  {
    title: 'Hazard Reporting',
    twiTitle: 'Asiane Amanneɛbɔ',
    tagline: 'If you see it, say it — reporting hazards saves lives.',
    icon: ClipboardList,
    sections: [
      {
        heading: 'Identifying Hazards',
        icon: AlertTriangle,
        paragraph: 'A hazard is anything on a worksite with the potential to cause harm — injury, illness, damage, or loss. Hazard identification is the foundation of every safety management system.',
        checklist: [
          { label: 'Physical hazards', text: 'Uneven surfaces, unguarded machinery, unsecured loads, falling objects, scaffolding defects.' },
          { label: 'Chemical hazards', text: 'Unlabelled containers, chemical spills, improper storage, inadequate ventilation.' },
          { label: 'Ergonomic hazards', text: 'Manual handling of heavy loads, repetitive motion, awkward postures.' },
          { label: 'Environmental hazards', text: 'Extreme heat, noise, poor lighting, adverse weather conditions.' },
          { label: 'Biological hazards', text: 'Contaminated soil, rodent activity, mould, or biological waste.' },
          { label: 'Psychosocial hazards', text: 'Workplace bullying, fatigue-inducing rosters, excessive work pressure.' },
        ],
      },
      {
        heading: 'The Risk Matrix: Assessing Hazards',
        icon: Gauge,
        paragraph: 'Once identified, each hazard must be assessed for risk — the combination of how likely it is to cause harm and how severe that harm would be.',
        checklist: [
          { label: 'Likelihood', text: 'Could it happen? Rate from Rare (1) to Almost Certain (5).' },
          { label: 'Consequence', text: 'How bad would it be? Rate from Insignificant (1) to Catastrophic (5).' },
          { text: 'Risk Rating = Likelihood × Consequence. High-rated risks require immediate action.' },
          { text: 'Use the Hierarchy of Controls to treat the risk: Eliminate → Substitute → Isolate → Engineer → Administrate → PPE.' },
        ],
        callout: { label: 'Hierarchy of Controls', text: 'The most effective control is always elimination — removing the hazard entirely. PPE is the last resort because it only protects the individual, not others nearby.' },
      },
      {
        heading: 'How to Report a Hazard',
        icon: FileText,
        paragraph: "Reporting hazards promptly — before an incident occurs — is every worker's responsibility and right. No worker should fear reporting a hazard.",
        checklist: [
          { text: 'Report hazards verbally to your direct supervisor or Safety Officer immediately after identifying them.' },
          { text: 'Complete a formal Hazard Report Form — most sites use paper or digital forms. Record: date, time, location, nature of hazard, people affected, and suggested control.' },
          { text: 'Take a photograph of the hazard if safe to do so — images provide valuable documentation.' },
          { text: 'If the hazard poses an immediate risk to life, stop work in the area and evacuate workers before reporting.' },
          { text: 'Follow up to confirm the hazard has been actioned — you are entitled to know the outcome.' },
        ],
        danger: { label: 'Never ignore a hazard because it\'s "not your job".', text: 'Under most occupational health and safety laws, all workers have a duty to report hazards. Failure to report can result in serious injuries to colleagues.' },
      },
      {
        heading: 'Near Misses & Incident Reporting',
        icon: Megaphone,
        paragraph: 'A near miss is an unplanned event that did not result in injury or damage but had the potential to. Reporting near misses is one of the most powerful tools in preventing future incidents.',
        checklist: [
          { text: 'Report all near misses — they indicate a system or process has broken down before someone gets hurt.' },
          { text: 'Never downplay or dismiss a near miss; what was a close call today may be a fatality tomorrow.' },
          { text: 'Incident and near miss reports should be filed within 24 hours of the event wherever possible.' },
          { text: 'All serious injuries, dangerous incidents, and deaths must be reported to the relevant regulatory authority within the legally required timeframe.' },
        ],
      },
    ],
    quiz: [
      { question: 'Which of the following is the MOST effective control in the Hierarchy of Controls?', options: ['PPE', 'Administrative controls', 'Engineering controls', 'Elimination'], correctIndex: 3, explanation: 'Elimination — removing the hazard entirely — is always the most effective control. PPE is the least effective because it only protects the individual and does not remove the hazard.' },
      { question: 'What is a "near miss" in construction safety terms?', options: ['An incident where someone was slightly injured', "An unplanned event that could have caused harm but didn't", 'A hazard that has been identified but not yet reported', 'A failed safety inspection'], correctIndex: 1, explanation: 'A near miss is an unplanned event with no injury or damage that had the potential to cause harm. Reporting near misses is critical — they reveal system failures before they result in actual injuries.' },
      { question: 'You find an unlabelled chemical container on site. This is best classified as which type of hazard?', options: ['Physical hazard', 'Chemical hazard', 'Ergonomic hazard', 'Psychosocial hazard'], correctIndex: 1, explanation: 'An unlabelled chemical container is a chemical hazard. Without the label, workers cannot identify the substance, understand its risks, or apply appropriate safety measures.' },
      { question: 'When should you stop work and evacuate workers from an area with a hazard?', options: ['Only after completing a risk assessment', 'Only if the supervisor agrees', 'When the hazard poses an immediate risk to life', 'After submitting a hazard report form'], correctIndex: 2, explanation: 'If a hazard poses an immediate risk to life, you must stop work and evacuate workers from the area before completing formal paperwork. Worker safety always takes priority over documentation.' },
      { question: 'A hazard has a likelihood rating of 4 and a consequence rating of 3. What is the risk rating?', options: ['7', '12', '34', '43'], correctIndex: 1, explanation: 'Risk Rating = Likelihood × Consequence. 4 × 3 = 12. A risk rating of 12 is typically classified as High and requires prompt corrective action.' },
    ],
  },
  {
    title: 'Preventive Health',
    twiTitle: 'Akwahosan Ho Banbɔ',
    tagline: 'Your long-term health is part of worksite safety.',
    icon: Dumbbell,
    sections: [
      {
        heading: 'Heat Stress & Sun Safety',
        icon: Sun,
        paragraph: 'Outdoor construction workers face significant risks from heat exposure. Heat-related illness progresses from heat cramps → heat exhaustion → heat stroke, and can become life-threatening rapidly.',
        checklist: [
          { text: 'Know the signs of heat exhaustion: heavy sweating, cool/clammy skin, weakness, nausea, dizziness, fast/weak pulse.' },
          { text: 'Heat stroke is a medical emergency: hot/dry skin, confusion, rapid strong pulse, unconsciousness. Call 911 immediately.' },
          { text: 'Schedule heavy outdoor work for cooler hours (early morning) and take rest breaks in the shade during peak heat (11am–3pm).' },
          { text: 'Wear lightweight, light-coloured, loose-fitting clothing. Apply sunscreen SPF 30+ to all exposed skin.' },
          { text: 'Never work through heat exhaustion — sit down, move to shade or cool area, hydrate, and tell your supervisor.' },
        ],
        callout: { label: 'Acclimatization', text: 'Workers new to outdoor heat require 7–14 days to physically adjust. During this period, start with shorter shifts in heat and increase gradually.' },
      },
      {
        heading: 'Managing Fatigue',
        icon: Moon,
        paragraph: 'Fatigue impairs judgment, reaction time, and situational awareness to the same degree as alcohol. Fatigued workers are significantly more likely to make errors that result in injury.',
        checklist: [
          { text: 'Aim for 7–9 hours of sleep each night. Sleep debt accumulates and cannot be fully recovered in a single catch-up sleep.' },
          { text: 'Report to your supervisor if you feel too fatigued to work safely — this is a professional obligation, not a weakness.' },
          { text: 'Take regular breaks during long shifts. Short 10–15 minute rest breaks significantly restore alertness.' },
          { text: 'Limit caffeine — it masks fatigue without restoring cognitive performance.' },
          { text: 'Recognize signs of fatigue in co-workers: slow movements, yawning, difficulty concentrating, irritability, loss of situational awareness.' },
        ],
        danger: { label: 'Operating machinery or working at height while severely fatigued is as dangerous as being impaired by alcohol.', text: 'It is your legal and ethical duty to take yourself off these tasks if fatigued.' },
      },
      {
        heading: 'Mental Health on the Worksite',
        icon: Brain,
        paragraph: 'The construction industry has among the highest rates of suicide and mental health challenges of any industry. Physical safety and mental health are inseparable.',
        checklist: [
          { text: 'Check in on colleagues regularly — ask "How are you going?" and listen genuinely to the answer.' },
          { text: "Know your company's Employee Assistance Program (EAP) — it provides free, confidential counselling services." },
          { text: 'Signs a colleague may be struggling: withdrawal from the team, uncharacteristic irritability, errors, talking about hopelessness.' },
          { text: 'Encourage an open, stigma-free culture on site. Seek help early — before a small problem becomes a crisis.' },
          { text: 'Crisis support is available 24/7 — reach out to a national crisis line or your local emergency services.' },
        ],
        callout: { label: 'R U OK?', text: "Having a genuine conversation can change a life. You don't need to have all the answers — listening without judgment is the most powerful thing you can do." },
      },
      {
        heading: 'Ergonomics & Musculoskeletal Health',
        icon: Dumbbell,
        paragraph: 'Musculoskeletal disorders (MSDs) — injuries to muscles, joints, tendons, and nerves — are among the most common long-term health issues for construction workers. Most are preventable.',
        checklist: [
          { label: 'Manual handling', text: 'Bend your knees, keep the load close to your body, lift with your legs not your back.' },
          { text: 'Avoid twisting while lifting — turn your whole body by moving your feet.' },
          { text: 'Use mechanical aids (trolleys, forklifts, hoists) whenever loads exceed safe manual handling limits (typically 25kg for a single lift).' },
          { text: 'Alternate repetitive tasks with different movements to reduce strain on any single muscle group.' },
          { text: 'Stretch before and during work shifts. Regular stretching significantly reduces injury risk.' },
          { text: 'Report early signs of MSD (persistent aching, numbness, reduced grip strength) before they become chronic.' },
        ],
      },
    ],
    quiz: [
      { question: 'What is the correct emergency response to a co-worker showing signs of heat stroke (hot dry skin, confusion, rapid pulse)?', options: ['Give them water and rest', 'Have them continue in shade', "Call 911 immediately — it's a medical emergency", 'Apply ice to their neck'], correctIndex: 2, explanation: 'Heat stroke is a life-threatening emergency. Call 911 immediately. While waiting, move the person to a cool area, apply cold wet cloths, and fan them. Do not leave them alone.' },
      { question: 'Why is caffeine NOT a safe solution for managing worksite fatigue?', options: ['It is prohibited on construction sites', 'It masks fatigue without restoring cognitive performance', 'It causes dehydration exclusively', 'It is only effective for 5 minutes'], correctIndex: 1, explanation: 'Caffeine masks the sensation of fatigue but does not restore cognitive performance, reaction time, or judgment. Workers may feel more alert while still being significantly impaired.' },
      { question: 'What is the generally accepted maximum single-person manual lift weight on a construction site?', options: ['10kg', '15kg', '25kg', '40kg'], correctIndex: 2, explanation: 'Most occupational health guidelines set 25kg as the upper limit for a single-person lift under ideal conditions. Above this weight, mechanical aids or team lifts should be used.' },
      { question: 'What is "acclimatization" in the context of working in heat?', options: ['Wearing lighter PPE in summer', 'The 7–14 day physical adjustment period required for new workers in heat', 'Staying hydrated during your first shift', 'Moving to a shaded area when overheating'], correctIndex: 1, explanation: 'Acclimatization is the 7–14 day period new workers require to physically adapt to working in heat. During this time, they should start with shorter shifts in hot conditions and gradually increase exposure.' },
      { question: 'When should you report yourself to your supervisor as too fatigued to work safely?', options: ['Only at the end of a shift', "Only if you have missed more than one night's sleep", 'As soon as you recognize you are too fatigued to work safely', 'Never — fatigue is a normal part of construction work'], correctIndex: 2, explanation: 'You should report fatigue to your supervisor as soon as you recognize it. This is a professional and legal obligation. Working while severely fatigued around heavy machinery and heights puts you and your colleagues at risk.' },
    ],
  },
];

interface QuizState {
  answers: (number | null)[];
  submitted: boolean;
  score: number;
}

interface WorkplaceSafetyCourseProps {
  studentName: string;
  studentPhone: string;
}

export default function WorkplaceSafetyCourse({ studentName, studentPhone }: WorkplaceSafetyCourseProps) {
  const [activeModule, setActiveModule] = useState(0);
  const [activeTab, setActiveTab] = useState<'lesson' | 'quiz'>('lesson');
  const [quizState, setQuizState] = useState<Record<number, QuizState>>({});
  const [completedModules, setCompletedModules] = useState<Set<number>>(new Set());
  const [showCertificate, setShowCertificate] = useState(false);
  const [certName, setCertName] = useState(studentName);

  const total = COURSE_MODULES.length;
  const allComplete = completedModules.size === total;

  const getQuizState = (idx: number): QuizState =>
    quizState[idx] || { answers: new Array(COURSE_MODULES[idx].quiz.length).fill(null), submitted: false, score: 0 };

  const goToModule = (idx: number) => {
    setActiveModule(idx);
    setActiveTab('lesson');
  };

  const selectOption = (modIdx: number, qIdx: number, optIdx: number) => {
    const state = getQuizState(modIdx);
    if (state.submitted) return;
    const answers = [...state.answers];
    answers[qIdx] = optIdx;
    setQuizState(prev => ({ ...prev, [modIdx]: { ...state, answers } }));
  };

  const submitQuiz = (modIdx: number) => {
    const state = getQuizState(modIdx);
    const quiz = COURSE_MODULES[modIdx].quiz;
    let correct = 0;
    state.answers.forEach((ans, qi) => { if (ans === quiz[qi].correctIndex) correct++; });
    const score = Math.round((correct / quiz.length) * 100);
    setQuizState(prev => ({ ...prev, [modIdx]: { ...state, submitted: true, score } }));
    if (score >= 70) {
      setCompletedModules(prev => new Set(prev).add(modIdx));
    }
  };

  const retakeQuiz = (modIdx: number) => {
    setQuizState(prev => ({
      ...prev,
      [modIdx]: { answers: new Array(COURSE_MODULES[modIdx].quiz.length).fill(null), submitted: false, score: 0 },
    }));
  };

  const avgScore = () => {
    const scores = Array.from(completedModules).map((idx: number) => getQuizState(idx).score);
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  if (showCertificate) {
    return (
      <div className="space-y-5">
        <button
          onClick={() => setShowCertificate(false)}
          className="text-xs font-semibold text-offinso-green-900 hover:text-offinso-green-700 flex items-center gap-1.5 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Modules
        </button>
        <div className="border-8 border-double border-offinso-green-800 p-8 rounded-xl bg-zinc-50 text-center space-y-4 relative overflow-hidden">
          <span className="text-[10px] font-mono font-bold tracking-widest text-offinso-gold block uppercase">
            OFFINSO MUNICIPAL ACADEMY REGISTRY
          </span>
          <h4 className="font-serif text-2xl sm:text-3xl font-extrabold text-offinso-green-900 leading-none">
            Certificate of Completion
          </h4>
          <p className="text-xs text-zinc-500 italic">Construction Safety &amp; Health — Essential Online Training</p>

          <div className="max-w-sm mx-auto pt-2">
            <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">Worker's Full Name</label>
            <input
              value={certName}
              onChange={(e) => setCertName(e.target.value)}
              placeholder="Enter your name"
              className="w-full text-center font-serif font-bold text-xl bg-transparent border-b-2 border-offinso-gold outline-none text-zinc-900 pb-1"
            />
          </div>

          <p className="text-xs text-zinc-650 max-w-md mx-auto leading-relaxed pt-2">
            has diligently completed all six modules of the Essential Construction Safety &amp; Health Training program, including all knowledge checks.
          </p>

          <div className="flex justify-center gap-10 pt-2 text-center">
            <div>
              <p className="text-lg font-serif font-extrabold text-offinso-green-900">{total}/{total}</p>
              <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Modules Passed</p>
            </div>
            <div className="border-r border-zinc-200"></div>
            <div>
              <p className="text-lg font-serif font-extrabold text-offinso-green-900">{avgScore()}%</p>
              <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Avg. Score</p>
            </div>
            <div className="border-r border-zinc-200"></div>
            <div>
              <p className="text-lg font-serif font-extrabold text-offinso-green-900">
                {new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
              <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Issue Date</p>
            </div>
          </div>

          <p className="text-[11px] text-zinc-550 leading-relaxed pt-2">
            Student profile contact telephone recorded under verified registry identifier{' '}
            <strong className="font-mono text-offinso-green-850 font-bold">{studentPhone}</strong>.
          </p>

          <div className="pt-2">
            <button
              onClick={() => window.print()}
              className="bg-offinso-green-800 hover:bg-offinso-green-900 text-white font-bold text-xs px-5 py-2.5 rounded transition uppercase tracking-wider cursor-pointer inline-flex items-center gap-1.5"
            >
              <Award className="w-4 h-4 text-offinso-gold" /> Print Certificate
            </button>
          </div>
        </div>
      </div>
    );
  }

  const mod = COURSE_MODULES[activeModule];
  const qState = getQuizState(activeModule);
  const allAnswered = qState.answers.every(a => a !== null);

  return (
    <div className="space-y-5">

      {/* Progress strip */}
      <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono">
        <span>{completedModules.size} of {total} modules complete</span>
        <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden max-w-xs">
          <div
            className="h-full bg-offinso-gold rounded-full transition-all"
            style={{ width: `${(completedModules.size / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Sidebar: module list */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-2xs space-y-1.5">
            <span className="text-[10px] text-zinc-400 font-mono font-bold tracking-widest block uppercase mb-2">
              COURSE MODULES
            </span>
            {COURSE_MODULES.map((m, idx) => {
              const isCompleted = completedModules.has(idx);
              const isActive = activeModule === idx;
              const ModIcon = m.icon;
              return (
                <button
                  key={idx}
                  onClick={() => goToModule(idx)}
                  className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition font-medium cursor-pointer ${
                    isActive ? 'bg-offinso-green-900 text-white shadow-2xs font-bold' : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-750'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isCompleted ? 'bg-emerald-100 text-emerald-800' : isActive ? 'bg-offinso-gold text-zinc-950' : 'bg-zinc-200 text-zinc-600'
                  }`}>
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : <ModIcon className="w-3.5 h-3.5" />}
                  </span>
                  <div className="truncate flex-1 text-left">
                    <p className="truncate font-semibold text-sm">{m.title}</p>
                    <p className={`text-[10px] truncate ${isActive ? 'text-zinc-200' : 'text-zinc-400'}`}>{m.tagline}</p>
                  </div>
                </button>
              );
            })}

            <button
              onClick={() => allComplete && setShowCertificate(true)}
              disabled={!allComplete}
              className={`w-full mt-2 text-left p-3 rounded-lg flex items-center gap-3 transition font-medium ${
                allComplete ? 'bg-offinso-gold text-zinc-950 font-bold cursor-pointer hover:bg-offinso-gold-dark' : 'bg-zinc-50 text-zinc-400 cursor-not-allowed opacity-60'
              }`}
            >
              <Award className="w-5 h-5 shrink-0" />
              <span className="text-sm">{allComplete ? '🏆 View Certificate' : 'Complete all modules to unlock'}</span>
            </button>
          </div>

          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 text-[10.5px] text-zinc-500 space-y-1">
            <p><strong className="text-zinc-700">Registered Student:</strong> {studentName}</p>
            <p><strong className="text-zinc-700">Mobile Hotline:</strong> {studentPhone}</p>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-8 space-y-5">

          {/* Module header */}
          <div className="bg-zinc-900 text-white p-5 sm:p-6 rounded-xl border border-zinc-800 flex items-start gap-4">
            <div className="w-12 h-12 bg-offinso-gold text-zinc-950 rounded-lg flex items-center justify-center shrink-0">
              <mod.icon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-offinso-gold font-bold uppercase tracking-widest font-mono">
                Module {activeModule + 1} of {total}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-extrabold text-white leading-tight">{mod.title}</h3>
              <p className="text-zinc-400 text-xs italic font-serif">Twi: {mod.twiTitle}</p>
              <p className="text-zinc-350 text-xs mt-1">{mod.tagline}</p>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 border-b border-zinc-200">
            <button
              onClick={() => setActiveTab('lesson')}
              className={`text-xs font-bold uppercase tracking-wider px-4 py-2.5 border-b-2 transition cursor-pointer ${
                activeTab === 'lesson' ? 'text-offinso-green-800 border-offinso-green-800' : 'text-zinc-400 border-transparent hover:text-zinc-700'
              }`}
            >
              📖 Lesson
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`text-xs font-bold uppercase tracking-wider px-4 py-2.5 border-b-2 transition cursor-pointer ${
                activeTab === 'quiz' ? 'text-offinso-green-800 border-offinso-green-800' : 'text-zinc-400 border-transparent hover:text-zinc-700'
              }`}
            >
              ✏️ Knowledge Check
            </button>
          </div>

          {activeTab === 'lesson' ? (
            <div className="space-y-4">
              {mod.sections.map((section, si) => {
                const SecIcon = section.icon;
                return (
                  <div key={si} className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-2xs space-y-3.5">
                    <h4 className="font-serif font-bold text-base text-offinso-green-900 flex items-center gap-2">
                      <SecIcon className="w-5 h-5 text-offinso-gold shrink-0" />
                      {section.heading}
                    </h4>
                    <p className="text-zinc-600 text-sm leading-relaxed">{section.paragraph}</p>

                    {section.checklist && (
                      <ul className="space-y-2">
                        {section.checklist.map((item, ii) => (
                          <li key={ii} className="flex gap-2.5 items-start text-xs text-zinc-650">
                            <span className="w-4.5 h-4.5 bg-emerald-50 text-emerald-800 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-3 h-3" />
                            </span>
                            <span className="leading-relaxed">
                              {item.label && <strong className="text-zinc-900">{item.label}: </strong>}
                              {item.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.callout && (
                      <div className="bg-amber-50 border-l-3 border-offinso-gold rounded-r-lg p-3.5 text-xs text-amber-900 leading-relaxed">
                        <strong className="text-amber-950">{section.callout.label}:</strong> {section.callout.text}
                      </div>
                    )}

                    {section.danger && (
                      <div className="bg-red-50 border-l-3 border-red-500 rounded-r-lg p-3.5 text-xs text-red-900 leading-relaxed flex gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <span><strong>{section.danger.label}</strong> {section.danger.text}</span>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Lesson nav */}
              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => activeModule > 0 && goToModule(activeModule - 1)}
                  disabled={activeModule === 0}
                  className="bg-zinc-100 hover:bg-zinc-200 disabled:opacity-40 text-zinc-700 font-bold text-xs px-4 py-2 rounded-md transition uppercase tracking-wider disabled:cursor-not-allowed cursor-pointer"
                >
                  ← Previous Module
                </button>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className="bg-offinso-green-800 hover:bg-offinso-green-900 text-white font-bold text-xs px-5 py-2 rounded-md transition flex items-center gap-1.5 uppercase tracking-wider cursor-pointer"
                >
                  Knowledge Check <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-2xs space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-zinc-100">
                <Sparkles className="w-6 h-6 text-offinso-gold shrink-0" />
                <div>
                  <h4 className="font-serif font-bold text-lg text-zinc-900">Knowledge Check</h4>
                  <p className="text-[11px] text-zinc-400">{mod.quiz.length} questions · 70% to pass · Select an answer for each question, then submit.</p>
                </div>
              </div>

              {mod.quiz.map((q, qi) => {
                const selected = qState.answers[qi];
                const isCorrect = selected === q.correctIndex;
                return (
                  <div key={qi} className="space-y-3 pb-4 border-b border-zinc-100 last:border-0 last:pb-0">
                    <p className="font-semibold text-sm text-zinc-900">
                      <span className="text-offinso-gold font-mono text-xs uppercase tracking-wider block mb-1">Question {qi + 1}</span>
                      {q.question}
                    </p>
                    <div className="space-y-2">
                      {q.options.map((opt, oi) => {
                        let style = 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-800';
                        if (!qState.submitted && selected === oi) {
                          style = 'bg-offinso-green-50 border-offinso-green-700 text-offinso-green-950 font-semibold';
                        } else if (qState.submitted) {
                          if (oi === q.correctIndex) style = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold';
                          else if (selected === oi) style = 'bg-red-50 border-red-300 text-red-900 font-semibold';
                          else style = 'bg-zinc-50 opacity-60 border-zinc-200 text-zinc-400';
                        }
                        return (
                          <button
                            key={oi}
                            disabled={qState.submitted}
                            onClick={() => selectOption(activeModule, qi, oi)}
                            className={`w-full text-left p-3 border rounded-lg transition-all flex items-center justify-between text-xs ${style} ${!qState.submitted ? 'cursor-pointer' : ''}`}
                          >
                            <span>{opt}</span>
                            {qState.submitted && oi === q.correctIndex && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                    {qState.submitted && (
                      <div className={`text-xs leading-relaxed p-3 rounded-lg ${isCorrect ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
                        {isCorrect ? '✅ Correct! ' : '❌ Incorrect. '}{q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}

              {!qState.submitted ? (
                <button
                  onClick={() => submitQuiz(activeModule)}
                  disabled={!allAnswered}
                  className="bg-offinso-green-800 hover:bg-offinso-green-900 disabled:opacity-40 text-white font-bold text-xs px-6 py-2.5 rounded-md transition uppercase tracking-wider disabled:cursor-not-allowed cursor-pointer"
                >
                  Submit Answers
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 text-center space-y-3"
                >
                  <p className={`font-serif text-4xl font-extrabold ${qState.score >= 70 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {qState.score}%
                  </p>
                  <p className="font-bold uppercase tracking-wider text-sm">
                    {qState.score >= 70 ? '✅ Passed' : '❌ Not Yet'}
                  </p>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    {qState.score >= 70
                      ? "Excellent work! You've demonstrated solid understanding of this module."
                      : 'Review the lesson material and try again. You need 70% to pass.'}
                  </p>
                  <div className="flex justify-center gap-3 pt-1 flex-wrap">
                    {qState.score < 70 && (
                      <button
                        onClick={() => retakeQuiz(activeModule)}
                        className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs px-4 py-2 rounded-md transition uppercase tracking-wider cursor-pointer"
                      >
                        Retake Quiz
                      </button>
                    )}
                    {qState.score >= 70 && activeModule < total - 1 && (
                      <button
                        onClick={() => goToModule(activeModule + 1)}
                        className="bg-offinso-green-800 hover:bg-offinso-green-900 text-white font-bold text-xs px-4 py-2 rounded-md transition uppercase tracking-wider cursor-pointer"
                      >
                        Next Module →
                      </button>
                    )}
                    {qState.score >= 70 && activeModule === total - 1 && allComplete && (
                      <button
                        onClick={() => setShowCertificate(true)}
                        className="bg-offinso-gold hover:bg-offinso-gold-dark text-zinc-950 font-bold text-xs px-4 py-2 rounded-md transition uppercase tracking-wider cursor-pointer"
                      >
                        🏆 Get Certificate
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
