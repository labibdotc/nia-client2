import { useState, useEffect, useRef } from 'react';
import { supabase } from './supabase.js';
import {
  BODY, MONO, ACCENT, ACCENT_INK, DANGER, SUCCESS,
  EASE_PHYSICS, EASE_QUICK, EASE_DELIBERATE, EASE_SLOW, SKINS,
  ic, HomeIc, ChevDown, ChevRight, ChevLeft, PlusIc, MinusIc, CloseIc, NewIc,
  SparkPlusIc, ListIc, SearchIc, CheckIc, UploadIc, SendIc, MicIc, DashIc,
  UsersIc, FolderIc, CalIc, FileIc, SettingsIc, SparkIc, ChainIc, CanvasIc,
  UserIc, PlayIc, ShieldIc, BellIc, CardIc, HelpIc, TrashIc, LogOutIc, EditIc,
  KeyIc, PaletteIc, FileMenuIc, GlobeIc, CommunityIc, LearnIc, GoogleIc,
  NOSMark, Pearl, useViewport, useMountReveal, revealStyle, PULSE_KEYFRAMES,
  TIERS, TIER_ORDER_LIST, INTEGRATIONS, requireTier,
  LANGUAGES, FAQS, COMMUNITY_CHANNELS, LEARN_RESOURCES,
  NosToast, nosToast, Field, Input, PrimaryButton, GhostButton, Toggle,
  PROJECT_TYPES, MOODS, DEMO_SEED_EMAILS, DEMO_PROJECTS,
  GREETINGS, pickGreeting, callClaude,
} from './atoms.jsx';


const T_OB = SKINS.metallic; // onboarding-locked skin (matches Figma Make brand intro)

/* ─── NRI Skills Library — full 282-archetype dataset ─────────
   Canonical source for the Skills Library browser (Region 3).
   Schema:
     id    — stable identifier
     cat   — category id (1-13, see ALL_CATEGORIES)
     type  — discipline group ('Strategy', 'Production', 'Post', etc.)
     name  — role title
     tier  — seniority band (used for filtering and TIER_ORDER sort)
     rate  — typical day-rate range
     orb   — gradient-orb index (legacy field, kept for compatibility)
     sum   — one-paragraph role summary
   ──────────────────────────────────────────────────────────────── */
const ALL_CATEGORIES = [
  { id: 0,  label: 'All skills' },
  { id: 1,  label: 'Creative Direction & Vision' },
  { id: 2,  label: 'Production & Direction' },
  { id: 3,  label: 'Camera, Lighting & On-Set' },
  { id: 4,  label: 'Post-Production & Technical' },
  { id: 5,  label: 'Design & Visual Arts' },
  { id: 6,  label: 'Styling, Wardrobe & Beauty' },
  { id: 7,  label: 'Music, Audio & Performance' },
  { id: 8,  label: 'Photography & Digital Media' },
  { id: 9,  label: 'Production Operations' },
  { id: 10, label: 'Enterprise & Brand' },
  { id: 11, label: 'Technology Companies' },
  { id: 12, label: 'Business & Leadership' },
  { id: 13, label: 'Fine Art & Cultural Practice' },
];

const LIBRARY = [
  {id:1,cat:1,type:'Strategy',name:'Chief Creative Officer (CCO)',tier:'C-Suite',rate:'$2,000–5,000/day',orb:0,sum:'The CCO holds ultimate creative authority across an entire organisation — setting the creative philosophy, culture, and standards that govern all output. R'},
  {id:2,cat:1,type:'Strategy',name:'Executive Creative Director (ECD)',tier:'Executive',rate:'$1,500–4,000/day',orb:0,sum:'The ECD oversees all creative output across a division or the entire agency — responsible for maintaining creative excellence, developing creative talent, '},
  {id:3,cat:1,type:'Strategy',name:'Creative Director',tier:'Senior',rate:'$800–2,000/day',orb:0,sum:'The most common senior creative leadership role — responsible for the creative concept, visual direction, and overall aesthetic execution of campaigns, pro'},
  {id:4,cat:1,type:'Strategy',name:'Associate Creative Director (ACD)',tier:'Mid-Senior',rate:'$600–1,500/day',orb:0,sum:'The ACD operates as a senior creative executor and junior creative leader — developing strong conceptual and craft skills while beginning to manage junior '},
  {id:5,cat:1,type:'Strategy',name:'Art Director',tier:'Mid-Senior',rate:'$600–1,500/day',orb:0,sum:'Translates creative direction into tangible visual systems — overseeing layout, colour, typography, imagery, and on-set visual execution. Works across edit'},
  {id:6,cat:1,type:'Strategy',name:'Junior Art Director',tier:'Junior',rate:'$200–600/day',orb:0,sum:'A developing creative professional building foundational skills in visual concept development, layout, and art direction. Works under the guidance of Art D'},
  {id:7,cat:1,type:'Strategy',name:'Creative Strategist',tier:'Strategy',rate:'$500–1,500/day',orb:0,sum:'Sits at the intersection of data, culture, and creativity. Develops insight-led creative frameworks that align brand objectives with cultural relevance and'},
  {id:8,cat:1,type:'Strategy',name:'Creative Consultant',tier:'Senior / Advisory',rate:'$1,000–2,500/day',orb:0,sum:'An experienced senior creative who operates in an advisory or project-based capacity — brought in to solve specific creative challenges, evaluate existing '},
  {id:9,cat:1,type:'Strategy',name:'Treatment Designer',tier:'Specialist',rate:'$800–2,000/day',orb:0,sum:'Produces the creative treatment documents that directors and production companies use to pitch and win projects. Combines exceptional visual storytelling, '},
  {id:10,cat:1,type:'Strategy',name:'Creative Producer',tier:'Mid-Senior',rate:'$600–1,500/day',orb:0,sum:'Bridges creative direction and production logistics — ensuring that creative vision is executed practically, on time, and within budget. The Creative Produ'},
  {id:11,cat:1,type:'Strategy',name:'Concept Developer',tier:'Mid',rate:'$400–1,000/day',orb:0,sum:'Specialises in the early-stage development of creative ideas — building concepts, territories, and narrative frameworks from briefs before they reach the d'},
  {id:12,cat:1,type:'Strategy',name:'Creative Operations Manager',tier:'Operations',rate:'$500–1,500/day',orb:0,sum:'Manages the operational processes that enable a creative department to function — traffic management, resource planning, workflow systems, and the administ'},
  {id:13,cat:1,type:'Strategy',name:'Head of Creative',tier:'Senior Leadership',rate:'$1,200–3,000/day',orb:0,sum:'Leads the internal creative function for a brand, platform, or organisation — responsible for all creative output, team management, and the alignment of cr'},
  {id:14,cat:1,type:'Strategy',name:'Brand Director',tier:'Senior',rate:'$800–2,000/day',orb:0,sum:'Responsible for the holistic management and evolution of a brand — overseeing the strategy, identity, and communication standards that define how the brand'},
  {id:15,cat:1,type:'Strategy',name:'In-House Creative Director',tier:'Senior',rate:'$800–2,000/day',orb:0,sum:'A Creative Director embedded within a brand or organisation rather than operating from an agency — responsible for all externally and internally facing cre'},
  {id:16,cat:1,type:'Strategy',name:'Experiential Creative Director',tier:'Senior',rate:'$800–2,000/day',orb:0,sum:'Leads creative direction for live events, experiential activations, pop-ups, and immersive brand experiences — combining spatial design, narrative, and pro'},
  {id:17,cat:1,type:'Strategy',name:'Fashion Creative Director',tier:'Senior',rate:'$800–2,000/day',orb:0,sum:'Leads creative direction within the fashion industry — overseeing editorial content, campaign imagery, runway show aesthetics, and brand identity from a fa'},
  {id:18,cat:1,type:'Strategy',name:'Digital Creative Director',tier:'Senior',rate:'$800–2,000/day',orb:0,sum:'Leads creative direction specifically for digital and social channels — developing platform-native creative strategies, content systems, and interactive ex'},
  {id:19,cat:1,type:'Strategy',name:'Storyboard Artist',tier:'Specialist',rate:'$800–2,000/day',orb:0,sum:'Creates sequential visual narratives that translate scripts, treatments, and concepts into drawn or rendered panels — used for pre-visualising commercials,'},
  {id:20,cat:1,type:'Strategy',name:'Creative Project Manager',tier:'Mid',rate:'$400–1,000/day',orb:0,sum:'Manages the project lifecycle for creative work — scoping, scheduling, resourcing, and delivering creative projects on time and on budget while protecting '},
  {id:21,cat:2,type:'Production',name:'Director (Narrative / Commercial)',tier:'Director',rate:'$1,000–2,500/day',orb:1,sum:'Brings scripts and creative briefs to life through directorial vision — making every creative decision related to performance, framing, atmosphere, pacing,'},
  {id:22,cat:2,type:'Production',name:'Music Video Director',tier:'Director',rate:'$1,000–2,500/day',orb:1,sum:'Specialises in directing music videos — creating narrative, conceptual, or performance-based visual interpretations of music tracks. Works closely with art'},
  {id:23,cat:2,type:'Production',name:'Documentary Director',tier:'Director',rate:'$1,000–2,500/day',orb:1,sum:'Directs documentary productions — developing research-driven narratives, gaining access and trust from subjects, and shaping raw reality into compelling st'},
  {id:24,cat:2,type:'Production',name:'Content Director',tier:'Director / Senior',rate:'$1,000–2,500/day',orb:1,sum:'Directs digital-first content — social video, branded content, web series, and platform-native productions. Operates at the intersection of editorial creat'},
  {id:25,cat:2,type:'Production',name:'Short Film Director',tier:'Director',rate:'$1,000–2,500/day',orb:1,sum:'Directs short films — typically for festival circuit, streaming, or development as a proof of concept for longer-form work. Operates with limited budgets, '},
  {id:26,cat:2,type:'Production',name:'Executive Producer',tier:'Executive',rate:'$1,500–4,000/day',orb:1,sum:'Holds ultimate financial and operational accountability for a production — managing client relationships, overseeing budgets, assembling key crew, and ensu'},
  {id:27,cat:2,type:'Production',name:'Producer',tier:'Mid-Senior',rate:'$600–1,500/day',orb:1,sum:'The operational backbone of any production — translating creative vision into schedules, budgets, crew, and logistics. Manages all moving parts from brief '},
  {id:28,cat:2,type:'Production',name:'Line Producer',tier:'Mid-Senior',rate:'$600–1,500/day',orb:1,sum:'The operational bridge between the Executive Producer and the production departments — managing day-to-day costs, crew coordination, and schedule integrity'},
  {id:29,cat:2,type:'Production',name:'Post Producer',tier:'Mid',rate:'$400–1,000/day',orb:1,sum:'Manages the complete post-production process for a project — from picture lock through all finishing stages to final delivery. Acts as the logistical and c'},
  {id:30,cat:2,type:'Production',name:'Field Producer',tier:'Mid',rate:'$400–1,000/day',orb:1,sum:'Manages production logistics in the field — organising locations, talent, crew, and equipment for documentary, news, or branded content shoots conducted ou'},
  {id:31,cat:2,type:'Production',name:'Associate Producer',tier:'Mid',rate:'$400–1,000/day',orb:1,sum:'Supports the Producer or Executive Producer across a range of production duties — often responsible for specific elements such as casting coordination, log'},
  {id:32,cat:2,type:'Production',name:'Experiential Producer',tier:'Mid-Senior',rate:'$600–1,500/day',orb:1,sum:'Produces live events, experiential activations, and immersive brand experiences — managing the logistics, budget, and vendor network required to execute la'},
  {id:33,cat:2,type:'Production',name:'Production Manager',tier:'Mid',rate:'$400–1,000/day',orb:1,sum:'Manages the day-to-day operational logistics of a production — from crew contracts to travel, accommodation, and equipment — working under the Line Produce'},
  {id:34,cat:2,type:'Production',name:'1st Assistant Director (1st AD)',tier:'Department Head',rate:'$500–1,500/day',orb:1,sum:'The operational authority on set — responsible for running the schedule, managing the crew, and ensuring that the director can focus on creative decisions '},
  {id:35,cat:2,type:'Production',name:'2nd Assistant Director (2nd AD)',tier:'Mid',rate:'$400–1,000/day',orb:1,sum:'Supports the 1st AD by managing talent movement — getting actors and talent to set on time, managing background artists, and handling the administrative ou'},
  {id:36,cat:2,type:'Production',name:'Director\'s Assistant',tier:'Junior',rate:'$200–600/day',orb:1,sum:'A personal and professional assistant to the director — managing their schedule, communication, research, and administrative needs across development, pre-'},
  {id:37,cat:2,type:'Production',name:'Production Assistant',tier:'Entry',rate:'$500–1,500/day',orb:1,sum:'The entry-level production role — supporting all departments with tasks as required, learning the industry while performing essential on-set and office dut'},
  {id:38,cat:2,type:'Production',name:'Technical Director',tier:'Senior Specialist',rate:'$800–2,000/day',orb:1,sum:'Oversees all technical aspects of a production or live event — managing the technical infrastructure, crew, and systems that enable the show to run. Bridge'},
  {id:39,cat:2,type:'Production',name:'Co-Producer',tier:'Mid-Senior',rate:'$600–1,500/day',orb:1,sum:'Partners with the lead Producer on specific aspects of a production — often responsible for a particular territory, financing stream, or production element'},
  {id:40,cat:2,type:'Production',name:'Location Producer',tier:'Mid',rate:'$400–1,000/day',orb:1,sum:'Manages all aspects of production in a specific geographic location or territory — from crew and vendor sourcing to local authority relationships, permits,'},
  {id:41,cat:3,type:'Technical',name:'Director of Photography (DP / Cinematographer)',tier:'Head of Department',rate:'$1,000–2,500/day',orb:2,sum:'The visual architect of any production. Responsible for every image seen on screen — framing, lighting, lens choice, camera movement, and the overall visua'},
  {id:42,cat:3,type:'Technical',name:'Camera Operator',tier:'Mid',rate:'$400–1,000/day',orb:2,sum:'Physically operates the camera on set, executing the framing, movement, and technical requirements directed by the DP. Works across dolly, handheld, crane,'},
  {id:43,cat:3,type:'Technical',name:'1st AC (Focus Puller)',tier:'Mid',rate:'$400–1,000/day',orb:2,sum:'The 1st Assistant Camera manages the camera department\'s equipment and is responsible for maintaining precise focus throughout every shot. This is among th'},
  {id:44,cat:3,type:'Technical',name:'2nd AC (Clapper Loader)',tier:'Junior-Mid',rate:'$300–700/day',orb:2,sum:'The 2nd Assistant Camera manages media and slates — loading, labelling, and transferring all camera cards and magazines, and operating the clapperboard to '},
  {id:45,cat:3,type:'Technical',name:'Gaffer',tier:'Head of Department',rate:'$1,000–2,500/day',orb:2,sum:'Chief lighting technician and head of the electrical department. Works directly with the DP to design and execute the lighting plan — selecting fixtures, m'},
  {id:46,cat:3,type:'Technical',name:'Key Grip',tier:'Head of Department',rate:'$1,000–2,500/day',orb:2,sum:'Head of the grip department — responsible for all camera support equipment, rigging, and camera movement systems. Works closely with the Gaffer and DP to s'},
  {id:47,cat:3,type:'Technical',name:'Grip',tier:'Mid',rate:'$400–1,000/day',orb:2,sum:'Executes all camera support rigging under the direction of the Key Grip — physically setting up, adjusting, and moving all grip equipment throughout the sh'},
  {id:48,cat:3,type:'Technical',name:'Grip Assistant',tier:'Junior',rate:'$200–600/day',orb:2,sum:'The entry-level grip role — supporting the grip department with equipment loading, setup, and general tasks under Key Grip and Grip direction.'},
  {id:49,cat:3,type:'Technical',name:'Assistant Electrician',tier:'Junior-Mid',rate:'$300–700/day',orb:2,sum:'Supports the Gaffer and electrical department — running cable, setting lights, and operating lighting equipment under the direction of the Gaffer and Best '},
  {id:50,cat:3,type:'Technical',name:'Lighting Designer',tier:'Specialist',rate:'$800–2,000/day',orb:2,sum:'Designs lighting concepts and systems for live events, theatre productions, and experiential installations — creating atmosphere, directing attention, and '},
  {id:51,cat:3,type:'Technical',name:'Lighting Director',tier:'Senior',rate:'$800–2,000/day',orb:2,sum:'Responsible for the overall lighting direction of broadcast television productions — designing and managing lighting for studios, live broadcasts, and mult'},
  {id:52,cat:3,type:'Technical',name:'Lighting Tech',tier:'Junior-Mid',rate:'$300–700/day',orb:2,sum:'A lighting technician who operates lighting fixtures and equipment under the direction of the Gaffer or Lighting Director — setting, adjusting, and maintai'},
  {id:53,cat:3,type:'Technical',name:'Drone Operator',tier:'Specialist',rate:'$800–2,000/day',orb:2,sum:'Operates unmanned aerial vehicles to capture footage from aerial perspectives — combining technical piloting skill with cinematic sensibility to deliver sh'},
  {id:54,cat:3,type:'Technical',name:'FPV Drone Pilot',tier:'Specialist',rate:'$800–2,000/day',orb:2,sum:'Operates First Person View drones — high-performance, highly agile unmanned aircraft capable of moves impossible with traditional cinema drones. Used for d'},
  {id:55,cat:3,type:'Technical',name:'DIT (Digital Imaging Technician)',tier:'Specialist',rate:'$800–2,000/day',orb:2,sum:'Manages the digital pipeline on set — responsible for data ingest, backup, live colour management, and the delivery of dailies. Acts as the technical guard'},
  {id:56,cat:3,type:'Technical',name:'Digitech',tier:'Specialist',rate:'$800–2,000/day',orb:2,sum:'The photographic equivalent of a DIT — manages all digital capture, tethering, and data management on still photography sets. Provides the photographer and'},
  {id:57,cat:3,type:'Technical',name:'Steadicam Operator',tier:'Specialist',rate:'$800–2,000/day',orb:2,sum:'Operates a Steadicam rig — a camera stabilisation system worn by the operator — to achieve smooth, flowing camera movement impossible to replicate with a h'},
  {id:58,cat:3,type:'Technical',name:'Jib Operator',tier:'Specialist',rate:'$800–2,000/day',orb:2,sum:'Operates camera jib cranes — mechanical arm systems that enable smooth, elevated, and extended-reach camera movements. Used for reveal shots, elevated angl'},
  {id:59,cat:3,type:'Technical',name:'Jib Crane Tech / Jib Tech',tier:'Mid',rate:'$400–1,000/day',orb:2,sum:'Supports the Jib Operator by assembling, operating the panning head, and managing the technical mechanics of the jib system throughout the shooting day.'},
  {id:60,cat:3,type:'Technical',name:'Technocrane Operator',tier:'Senior Specialist',rate:'$800–2,000/day',orb:2,sum:'Operates a Technocrane — a remotely operated telescoping camera crane capable of extreme reach and precision movement. Used on high-end productions for com'},
  {id:61,cat:3,type:'Technical',name:'Technocrane Tech',tier:'Mid',rate:'$400–1,000/day',orb:2,sum:'Supports the Technocrane Operator with assembly, cabling, remote head setup, and technical maintenance of the Technocrane system throughout the shooting da'},
  {id:62,cat:3,type:'Technical',name:'Remote Head Tech',tier:'Specialist',rate:'$800–2,000/day',orb:2,sum:'Specialises in the setup and operation of remotely controlled camera head systems — enabling the camera to be precisely controlled from a distance or from '},
  {id:63,cat:3,type:'Technical',name:'Underwater Camera Operator',tier:'Specialist',rate:'$800–2,000/day',orb:2,sum:'Operates camera systems underwater — combining diving skill and certification with cinematographic technique to capture footage in aquatic environments.'},
  {id:64,cat:3,type:'Technical',name:'VTR Operator',tier:'Specialist',rate:'$800–2,000/day',orb:2,sum:'Video Tape Recording Operator — manages the playback and recording of video content during production. In modern contexts, operates digital recording syste'},
  {id:65,cat:3,type:'Technical',name:'Picture Car Coordinator',tier:'Specialist',rate:'$800–2,000/day',orb:2,sum:'Sources, manages, and coordinates all hero and background vehicles used in a production — from period cars for historical productions to contemporary fleet'},
  {id:66,cat:4,type:'Technical',name:'Editor',tier:'Mid-Senior',rate:'$600–1,500/day',orb:3,sum:'Constructs the narrative from raw footage — selecting, assembling, and refining shots to create pacing, emotion, and story. The editor is among the most cr'},
  {id:67,cat:4,type:'Technical',name:'Assistant Editor',tier:'Junior-Mid',rate:'$300–700/day',orb:3,sum:'Supports the Editor with technical and organisational tasks — managing media, syncing audio, organising project files, and enabling the Editor to focus on '},
  {id:68,cat:4,type:'Technical',name:'Colorist',tier:'Specialist',rate:'$800–2,000/day',orb:3,sum:'Shapes the final visual mood and atmosphere of a production through colour grading — balancing, enhancing, and transforming footage to achieve creative int'},
  {id:69,cat:4,type:'Technical',name:'Color Producer',tier:'Mid',rate:'$400–1,000/day',orb:3,sum:'Manages the business and scheduling operations of a colour department or grading facility — booking suites, managing client relationships, and ensuring tha'},
  {id:70,cat:4,type:'Technical',name:'VFX Supervisor',tier:'Senior',rate:'$800–2,000/day',orb:3,sum:'Responsible for all visual effects in a production — from on-set supervision through to final composited images. Oversees VFX artists, manages vendors, and'},
  {id:71,cat:4,type:'Technical',name:'VFX Artist',tier:'Mid',rate:'$400–1,000/day',orb:3,sum:'Creates individual visual effects shots — compositing, rotoscoping, painting, particle simulation, or any combination of digital techniques required to pro'},
  {id:72,cat:4,type:'Technical',name:'Compositor',tier:'Specialist',rate:'$800–2,000/day',orb:3,sum:'Combines multiple image elements — CG renders, live-action footage, matte paintings, and effects — into seamless finished shots. Compositing is the final c'},
  {id:73,cat:4,type:'Technical',name:'Motion Designer',tier:'Mid',rate:'$400–1,000/day',orb:3,sum:'Creates animated graphics, title sequences, and motion-based visual elements — combining design sensibility with technical animation skill across formats f'},
  {id:74,cat:4,type:'Technical',name:'3D Artist',tier:'Mid-Senior',rate:'$600–1,500/day',orb:3,sum:'Creates three-dimensional digital assets, environments, and animations — building the raw materials that VFX supervisors, compositors, and animators work w'},
  {id:75,cat:4,type:'Technical',name:'CG Artist',tier:'Mid',rate:'$400–1,000/day',orb:3,sum:'Creates computer-generated imagery across characters, creatures, environments, and simulations — contributing to the CG pipeline at a production level as d'},
  {id:76,cat:4,type:'Technical',name:'Render Artist',tier:'Specialist',rate:'$800–2,000/day',orb:3,sum:'Manages the technical process of rendering — converting 3D scene data into finished images — optimising render settings, managing render farms, and trouble'},
  {id:77,cat:4,type:'Technical',name:'Finishing Artist',tier:'Specialist',rate:'$800–2,000/day',orb:3,sum:'Performs the final technical and creative finishing steps on a project — online editing, conform, title integration, and all technical corrections that pre'},
  {id:78,cat:4,type:'Technical',name:'Retoucher',tier:'Specialist',rate:'$800–2,000/day',orb:3,sum:'Produces final polished photographs for editorial, advertising, and e-commerce — performing beauty retouching, compositing, and technical corrections to br'},
  {id:79,cat:4,type:'Technical',name:'Post Production Coordinator',tier:'Mid',rate:'$400–1,000/day',orb:3,sum:'Manages the administrative and logistical operations of the post-production phase — coordinating schedules, deliveries, and communication between editorial'},
  {id:80,cat:4,type:'Technical',name:'Post Sound Mixer',tier:'Senior',rate:'$800–2,000/day',orb:3,sum:'Manages the final audio mix for a production — balancing all sound elements including dialogue, music, sound effects, and foley into a coherent and technic'},
  {id:81,cat:4,type:'Technical',name:'Foley Artist',tier:'Specialist',rate:'$800–2,000/day',orb:3,sum:'Creates synchronised sound effects in a recording studio to match the actions on screen — footsteps, handling sounds, cloth movement — bringing physical re'},
  {id:82,cat:4,type:'Technical',name:'Sound Designer',tier:'Senior',rate:'$800–2,000/day',orb:3,sum:'Creates and assembles all non-music sonic elements in a production — from ambient environments and foley direction to designed effects, transitions, and so'},
  {id:83,cat:4,type:'Technical',name:'Audio Engineer (Post)',tier:'Specialist',rate:'$800–2,000/day',orb:3,sum:'Manages the technical aspects of audio recording, processing, and delivery in post-production — handling ADR recording, audio restoration, and the technica'},
  {id:84,cat:4,type:'Technical',name:'Animator',tier:'Mid',rate:'$400–1,000/day',orb:3,sum:'Brings characters, objects, and environments to life through movement — working across 2D and 3D animation disciplines to create the motion that gives CG w'},
  {id:85,cat:4,type:'Technical',name:'Data Manager (Post)',tier:'Specialist',rate:'$800–2,000/day',orb:3,sum:'Manages all digital assets throughout the post-production pipeline — ensuring that media, project files, deliverables, and archives are correctly managed, '},
  {id:86,cat:5,type:'Visual',name:'Graphic Designer',tier:'Mid',rate:'$400–1,000/day',orb:4,sum:'Creates visual communication across print and digital — from brand identity to campaign artwork, publications, packaging, and digital assets. The broadest '},
  {id:87,cat:5,type:'Visual',name:'Digital Designer',tier:'Mid',rate:'$400–1,000/day',orb:4,sum:'Specialises in design for digital environments — creating interfaces, digital campaigns, web graphics, and interactive elements optimised for screens and d'},
  {id:88,cat:5,type:'Visual',name:'Brand Identity Designer',tier:'Mid-Senior',rate:'$600–1,500/day',orb:4,sum:'Specialises in developing visual brand identities — creating logo systems, colour palettes, typography hierarchies, and comprehensive visual language guide'},
  {id:89,cat:5,type:'Visual',name:'Illustrator',tier:'Specialist',rate:'$800–2,000/day',orb:4,sum:'Creates original illustrations across editorial, advertising, publishing, and digital contexts — developing a distinctive visual voice and applying it to c'},
  {id:90,cat:5,type:'Visual',name:'UI/UX Designer',tier:'Mid',rate:'$400–1,000/day',orb:4,sum:'Designs the user interfaces and experiences for digital products — from apps and platforms to creative tools — combining user research, information archite'},
  {id:91,cat:5,type:'Visual',name:'Web Designer',tier:'Mid',rate:'$400–1,000/day',orb:4,sum:'Designs websites — creating visual layouts, page structures, and user experiences optimised for web environments. Often works closely with web developers o'},
  {id:92,cat:5,type:'Visual',name:'Web Developer',tier:'Mid',rate:'$400–1,000/day',orb:4,sum:'Builds and maintains websites and web applications — implementing designs, developing functionality, and ensuring performance, accessibility, and technical'},
  {id:93,cat:5,type:'Visual',name:'Product Designer',tier:'Mid-Senior',rate:'$600–1,500/day',orb:4,sum:'Designs physical or digital products — from consumer electronics and industrial objects to digital product experiences — combining functional and aesthetic'},
  {id:94,cat:5,type:'Visual',name:'Set Designer',tier:'Head of Department',rate:'$1,000–2,500/day',orb:4,sum:'Creates the physical environments in which productions take place — designing, planning, and overseeing the construction and dressing of sets that serve th'},
  {id:95,cat:5,type:'Visual',name:'Set Decorator',tier:'Head of Department',rate:'$1,000–2,500/day',orb:4,sum:'Responsible for everything inside a set that is not architectural — selecting, sourcing, and placing all props, furniture, and dressing that populate the p'},
  {id:96,cat:5,type:'Visual',name:'Set Dresser',tier:'Mid',rate:'$400–1,000/day',orb:4,sum:'Physically executes the placement and arrangement of all set decoration under the direction of the Set Decorator — dressing and striking sets, managing pro'},
  {id:97,cat:5,type:'Visual',name:'Production Designer',tier:'Head of Department',rate:'$1,000–2,500/day',orb:4,sum:'The head of the entire art department — responsible for the visual concept of the complete production environment. Creates a coherent, immersive world thro'},
  {id:98,cat:5,type:'Visual',name:'Scenic Painter',tier:'Specialist',rate:'$800–2,000/day',orb:4,sum:'Creates painted environments, backdrops, and scenic elements — from realistic architectural finishes and aged textures to artistic painted backdrops and de'},
  {id:99,cat:5,type:'Visual',name:'Layout Artist',tier:'Specialist',rate:'$800–2,000/day',orb:4,sum:'Creates the spatial layouts that define camera angles, character placement, and environment compositions in animated productions — translating storyboard p'},
  {id:100,cat:5,type:'Visual',name:'Projection Mapping Specialist',tier:'Specialist',rate:'$800–2,000/day',orb:4,sum:'Designs and executes projection mapping installations — projecting images and video onto three-dimensional surfaces to transform spaces and create immersiv'},
  {id:101,cat:5,type:'Visual',name:'Stage Designer / Live Show Designer',tier:'Senior Specialist',rate:'$800–2,000/day',orb:4,sum:'Designs the physical stage environment and visual landscape for live music performances, theatre productions, and large-scale events — creating the spatial'},
  {id:102,cat:5,type:'Visual',name:'Spatial Designer',tier:'Specialist',rate:'$800–2,000/day',orb:4,sum:'Creates spatial experiences — designing the way people move through, interact with, and experience physical spaces. Combines architectural thinking with ex'},
  {id:103,cat:5,type:'Visual',name:'Interior Designer',tier:'Mid-Senior',rate:'$600–1,500/day',orb:4,sum:'Designs and specifies the interior environments of spaces — for residential, commercial, and production contexts — creating functional, beautiful interiors'},
  {id:104,cat:5,type:'Visual',name:'Fabricator',tier:'Specialist',rate:'$800–2,000/day',orb:4,sum:'Builds, constructs, and manufactures custom physical elements — sets, props, scenic pieces, display structures, and event installations — to design specifi'},
  {id:105,cat:5,type:'Visual',name:'Design Assistant',tier:'Junior',rate:'$200–600/day',orb:4,sum:'Supports senior designers and art directors with the execution of design tasks — preparing files, sourcing references, managing assets, and developing foun'},
  {id:106,cat:6,type:'Styling',name:'Editorial Stylist',tier:'Mid-Senior',rate:'$600–1,500/day',orb:5,sum:'Creates fashion and lifestyle narratives for editorial contexts — working with photographers and art directors to build looks that tell stories rather than'},
  {id:107,cat:6,type:'Styling',name:'Commercial Stylist',tier:'Mid-Senior',rate:'$600–1,500/day',orb:5,sum:'Styles commercial advertising and branded content — prioritising product presentation, brand alignment, and client approval over editorial artistry. Balanc'},
  {id:108,cat:6,type:'Styling',name:'Celebrity Stylist',tier:'Senior',rate:'$800–2,000/day',orb:5,sum:'Manages the personal style and public appearance of high-profile talent — dressing them for red carpets, media appearances, editorial shoots, and everyday '},
  {id:109,cat:6,type:'Styling',name:'Street Stylist',tier:'Mid',rate:'$400–1,000/day',orb:5,sum:'Documents and curates real-world fashion as it appears on the street — photographing, interviewing, and profiling individuals whose personal style is cultu'},
  {id:110,cat:6,type:'Styling',name:'Prop Stylist',tier:'Mid',rate:'$400–1,000/day',orb:5,sum:'Sources, styles, and arranges props and objects in photographic and film productions — creating the physical supporting environment that frames and context'},
  {id:111,cat:6,type:'Styling',name:'Stylist Assistant',tier:'Junior',rate:'$200–600/day',orb:5,sum:'Supports lead stylists in all aspects of the styling workflow — from showroom pulls and steaming through to on-set dressing assistance and return coordinat'},
  {id:112,cat:6,type:'Styling',name:'Costume Designer',tier:'Head of Department',rate:'$1,000–2,500/day',orb:5,sum:'Designs or sources every costume worn on screen — building a coherent visual world through clothing that expresses character, period, status, and narrative'},
  {id:113,cat:6,type:'Styling',name:'Costume Assistant',tier:'Junior',rate:'$200–600/day',orb:5,sum:'Supports the Costume Designer and Wardrobe Supervisor with all costume department tasks — from shopping and sourcing through to on-set dressing and continu'},
  {id:114,cat:6,type:'Styling',name:'Wardrobe Supervisor',tier:'Mid-Senior',rate:'$600–1,500/day',orb:5,sum:'Manages the day-to-day operations of the wardrobe department — overseeing costume continuity, maintenance, and the daily workflow of the wardrobe team duri'},
  {id:115,cat:6,type:'Styling',name:'Fashion Designer',tier:'Mid-Senior',rate:'$600–1,500/day',orb:5,sum:'Creates original clothing and accessories — from concept through pattern, sampling, and production. Operates across haute couture, ready-to-wear, and comme'},
  {id:116,cat:6,type:'Styling',name:'Garment Production Manager',tier:'Mid-Senior',rate:'$600–1,500/day',orb:5,sum:'Manages the production process for garment manufacturing — coordinating factories, managing quality control, and ensuring garments are produced to specific'},
  {id:117,cat:6,type:'Styling',name:'Seamstress',tier:'Specialist',rate:'$800–2,000/day',orb:5,sum:'Creates and alters garments by hand and machine — bringing pattern maker and designer specifications into physical existence and performing alterations to '},
  {id:118,cat:6,type:'Styling',name:'Tailor',tier:'Specialist',rate:'$800–2,000/day',orb:5,sum:'Creates precision tailored garments — primarily menswear suits, coats, and structured pieces — using traditional tailoring techniques to achieve exact fit '},
  {id:119,cat:6,type:'Styling',name:'Prop Master',tier:'Head of Department',rate:'$1,000–2,500/day',orb:5,sum:'Heads the props department — responsible for every hand-held or actor-manipulated object that appears on screen, from hero props to background dressing use'},
  {id:120,cat:6,type:'Styling',name:'Hair Stylist',tier:'Mid',rate:'$400–1,000/day',orb:5,sum:'Creates and maintains all hair styling for talent on set — from natural, character-driven hairstyles to period-specific and creative fantasy hair concepts.'},
  {id:121,cat:6,type:'Styling',name:'Makeup Artist (Beauty)',tier:'Mid',rate:'$400–1,000/day',orb:5,sum:'Creates beauty and lifestyle makeup for commercial photography, television, and editorial — executing flawless, camera-ready beauty that enhances the talen'},
  {id:122,cat:6,type:'Styling',name:'Character Makeup Artist',tier:'Specialist',rate:'$800–2,000/day',orb:5,sum:'Creates non-naturalistic character makeup — ageing, injuries, cultural markings, period-specific looks, and any makeup work that transforms an actor\'s appe'},
  {id:123,cat:6,type:'Styling',name:'SFX Makeup Artist',tier:'Specialist',rate:'$800–2,000/day',orb:5,sum:'Creates special effects makeup — wounds, burns, ageing effects, creature makeup, and any makeup work that creates physical transformation or illusion using'},
  {id:124,cat:6,type:'Styling',name:'SFX Coordinator',tier:'Head of Department',rate:'$1,000–2,500/day',orb:5,sum:'Heads the special effects department — responsible for all practical on-set physical effects, including fire, water, explosions, atmospheric effects, and m'},
  {id:125,cat:6,type:'Styling',name:'Groomer',tier:'Specialist',rate:'$800–2,000/day',orb:5,sum:'Maintains talent\'s overall appearance on set — managing hair touch-ups, makeup maintenance, and general grooming between and during takes to ensure consist'},
  {id:126,cat:6,type:'Styling',name:'Nail Artist',tier:'Specialist',rate:'$800–2,000/day',orb:5,sum:'Creates nail art and nail styling for photo and film productions — from natural, commercial-ready nail looks to elaborate nail art designs for editorial an'},
  {id:127,cat:6,type:'Styling',name:'Food Stylist',tier:'Specialist',rate:'$800–2,000/day',orb:5,sum:'Prepares and styles food and beverages for photography and film — making food look its most appealing on camera using specialist techniques, equipment, and'},
  {id:128,cat:6,type:'Styling',name:'Florist',tier:'Specialist',rate:'$800–2,000/day',orb:5,sum:'Creates floral arrangements and botanical installations for productions and events — from table centrepieces and bridal work to elaborate set dressing and '},
  {id:129,cat:7,type:'Sound',name:'Composer',tier:'Senior',rate:'$800–2,000/day',orb:0,sum:'Creates original music scores that serve the emotional and narrative needs of a production. Works closely with directors and music supervisors from spottin'},
  {id:130,cat:7,type:'Sound',name:'Music Supervisor',tier:'Senior Specialist',rate:'$800–2,000/day',orb:0,sum:'Finds, licenses, and manages all music used in a production — from source music and sync licenses to trailer music and artist collaborations. Sits at the i'},
  {id:131,cat:7,type:'Sound',name:'Music Supervisor Assistant',tier:'Junior',rate:'$200–600/day',orb:0,sum:'Supports the Music Supervisor with research, clearance administration, cue sheet management, and client communication — building the skills and relationshi'},
  {id:132,cat:7,type:'Sound',name:'Sound Designer',tier:'Senior',rate:'$800–2,000/day',orb:0,sum:'Creates the complete sonic world of a production — designing, sourcing, and assembling all non-music sound elements that build the audio environment.'},
  {id:133,cat:7,type:'Sound',name:'Production Sound Mixer',tier:'Senior',rate:'$800–2,000/day',orb:0,sum:'Captures and manages all audio on set during principal photography — responsible for the quality and technical standard of all production sound that will b'},
  {id:134,cat:7,type:'Sound',name:'Post Sound Mixer',tier:'Senior',rate:'$800–2,000/day',orb:0,sum:'Manages the final audio mix — balancing dialogue, music, sound effects, and foley into a complete and technically compliant audio experience across all req'},
  {id:135,cat:7,type:'Sound',name:'Boom Operator',tier:'Mid',rate:'$400–1,000/day',orb:0,sum:'Physically positions and operates the boom microphone to capture on-set dialogue at the highest possible quality — working in precise coordination with the'},
  {id:136,cat:7,type:'Sound',name:'Studio Recording Engineer',tier:'Specialist',rate:'$800–2,000/day',orb:0,sum:'Records and engineers all studio audio sessions — from music recording and voice-over to ADR and podcast production. Manages the technical environment of t'},
  {id:137,cat:7,type:'Sound',name:'Live Sound Engineer',tier:'Specialist',rate:'$800–2,000/day',orb:0,sum:'Manages all audio for live performances — mixing front-of-house sound for the audience and monitoring sound for performers on stage.'},
  {id:138,cat:7,type:'Sound',name:'Audio Visual Technician',tier:'Specialist',rate:'$800–2,000/day',orb:0,sum:'Sets up, operates, and troubleshoots all audio-visual equipment at events and venues — from projection and display systems to audio playback and streaming '},
  {id:139,cat:7,type:'Sound',name:'Foley Artist',tier:'Specialist',rate:'$800–2,000/day',orb:0,sum:'Creates synchronised sound effects in a recording studio to match on-screen physical actions — bringing sonic reality to the audio world through precise pe'},
  {id:140,cat:7,type:'Sound',name:'Choreographer',tier:'Senior Specialist',rate:'$800–2,000/day',orb:0,sum:'Creates, teaches, and directs all dance and movement sequences in a production — developing movement vocabulary that serves the narrative, character, and v'},
  {id:141,cat:7,type:'Sound',name:'Movement Director',tier:'Senior Specialist',rate:'$800–2,000/day',orb:0,sum:'Works with actors and performers on all non-dance physical movement — developing physical performance, bodily character expression, and movement sequences '},
  {id:142,cat:7,type:'Sound',name:'Stunt Coordinator',tier:'Head of Department',rate:'$1,000–2,500/day',orb:0,sum:'Plans, designs, and executes all stunt work on a production — ensuring that all physical action is achieved safely while meeting the director\'s creative re'},
  {id:143,cat:7,type:'Sound',name:'Music Producer (Album/Track)',tier:'Senior',rate:'$800–2,000/day',orb:0,sum:'Oversees and shapes the creative and technical development of recorded music — working with artists to define and realise the sonic identity of a track, EP'},
  {id:144,cat:7,type:'Sound',name:'Vocal Director',tier:'Senior Specialist',rate:'$800–2,000/day',orb:0,sum:'Works with singers and vocal performers to achieve the best possible vocal performance — from individual artists to large-scale choral arrangements.'},
  {id:145,cat:7,type:'Sound',name:'Music Director',tier:'Senior',rate:'$800–2,000/day',orb:0,sum:'Leads the musical performance of a production — directing musicians, managing musical arrangements, and ensuring musical quality across live and recorded c'},
  {id:146,cat:7,type:'Sound',name:'Playback Operator',tier:'Specialist',rate:'$800–2,000/day',orb:0,sum:'Manages all pre-recorded music playback on set — ensuring that artists and performers have the correct music playing at the right moment during filming or '},
  {id:147,cat:7,type:'Sound',name:'DJ / Music Programmer',tier:'Specialist',rate:'$800–2,000/day',orb:0,sum:'Curates, mixes, and performs music for events, branded activations, content productions, and broadcast contexts — creating sonic atmosphere that serves the'},
  {id:148,cat:7,type:'Sound',name:'Intimacy Coordinator',tier:'Specialist',rate:'$800–2,000/day',orb:0,sum:'Supports performers and directors in planning, choreographing, and safely executing scenes that involve physical intimacy — ensuring consent, comfort, and '},
  {id:149,cat:7,type:'Sound',name:'Composer / Arranger',tier:'Mid-Senior',rate:'$600–1,500/day',orb:0,sum:'Composes and arranges music across commercial and creative contexts — often working at higher volume and speed than a film composer, producing tracks, iden'},
  {id:150,cat:8,type:'Writing',name:'Editorial / Fashion Photographer',tier:'Mid-Senior',rate:'$600–1,500/day',orb:1,sum:'Creates imagery for editorial contexts — magazine features, fashion stories, and visual narratives that prioritise artistic storytelling over direct commer'},
  {id:151,cat:8,type:'Writing',name:'Commercial / Advertising Photographer',tier:'Senior',rate:'$800–2,000/day',orb:1,sum:'Creates photography for commercial advertising purposes — delivering images that serve specific commercial objectives while meeting rigorous technical and '},
  {id:152,cat:8,type:'Writing',name:'Portrait Photographer',tier:'Mid',rate:'$400–1,000/day',orb:1,sum:'Specialises in photographing individuals — creating images that capture personality, status, and character for corporate, editorial, and personal contexts.'},
  {id:153,cat:8,type:'Writing',name:'E-Commerce Photographer',tier:'Mid',rate:'$400–1,000/day',orb:1,sum:'Produces high-volume product photography for e-commerce platforms — creating consistent, technically precise imagery that meets platform specifications and'},
  {id:154,cat:8,type:'Writing',name:'BTS (Behind-the-Scenes) Photographer',tier:'Mid',rate:'$400–1,000/day',orb:1,sum:'Documents the making of productions — capturing candid and staged behind-the-scenes imagery for use in marketing, press, and content purposes.'},
  {id:155,cat:8,type:'Writing',name:'Event & Press Photographer',tier:'Mid',rate:'$400–1,000/day',orb:1,sum:'Covers live events — red carpets, premieres, openings, corporate events, and press conferences — capturing newsworthy and marketable imagery under unpredic'},
  {id:156,cat:8,type:'Writing',name:'Sports Photographer',tier:'Specialist',rate:'$800–2,000/day',orb:1,sum:'Captures compelling imagery at sporting events — requiring technical mastery of high-speed photography, knowledge of specific sports, and access management'},
  {id:157,cat:8,type:'Writing',name:'Documentary Photographer',tier:'Mid-Senior',rate:'$600–1,500/day',orb:1,sum:'Creates long-form photographic documentary projects — using photography as a tool for journalism, advocacy, and cultural documentation. Requires patience, '},
  {id:158,cat:8,type:'Writing',name:'Street Photographer',tier:'Specialist',rate:'$800–2,000/day',orb:1,sum:'Creates candid photography in public spaces — documenting the human condition, social dynamics, and visual poetry of everyday urban life.'},
  {id:159,cat:8,type:'Writing',name:'Photo Assistant',tier:'Junior',rate:'$200–600/day',orb:1,sum:'Supports the photographer with all technical and logistical tasks — from equipment preparation and lighting setup through to on-set assistance and post-sho'},
  {id:160,cat:8,type:'Writing',name:'Content Creator / Influencer',tier:'Generalist',rate:'$500–1,500/day',orb:1,sum:'Produces original content primarily for social media — building and monetising audiences through a combination of production skill, platform knowledge, and'},
  {id:161,cat:8,type:'Writing',name:'Social Media Manager',tier:'Mid',rate:'$400–1,000/day',orb:1,sum:'Manages the day-to-day operations of social media accounts — publishing content, managing communities, responding to audiences, and reporting on performanc'},
  {id:162,cat:8,type:'Writing',name:'Social Media Strategist',tier:'Senior',rate:'$800–2,000/day',orb:1,sum:'Develops social media strategy — defining platform approach, content pillars, audience growth strategy, and the framework that guides all social content an'},
  {id:163,cat:8,type:'Writing',name:'Copywriter',tier:'Mid',rate:'$400–1,000/day',orb:1,sum:'Creates written content for advertising, marketing, and brand communications — from campaign headlines and social captions to long-form articles and brand '},
  {id:164,cat:8,type:'Writing',name:'Videographer',tier:'Mid',rate:'$400–1,000/day',orb:1,sum:'Captures and edits video content across corporate, event, social, and documentary formats — often operating as a one-person crew, shooting and editing inde'},
  {id:165,cat:8,type:'Writing',name:'UGC Creator',tier:'Specialist',rate:'$800–2,000/day',orb:1,sum:'Creates user-generated-style content — lo-fi, authentic-feeling video and photo content used by brands in paid advertising and organic social media.'},
  {id:166,cat:8,type:'Writing',name:'Marketing Director',tier:'Senior',rate:'$800–2,000/day',orb:1,sum:'Leads all marketing activity for an organisation — overseeing brand communications, campaign strategy, digital marketing, and the measurement and optimisat'},
  {id:167,cat:8,type:'Writing',name:'Marketing Manager',tier:'Mid',rate:'$400–1,000/day',orb:1,sum:'Executes and manages marketing programmes — developing campaigns, managing vendors, and tracking performance across multiple channels and platforms.'},
  {id:168,cat:8,type:'Writing',name:'Marketing Coordinator',tier:'Junior-Mid',rate:'$300–700/day',orb:1,sum:'Supports the marketing team with coordination, scheduling, and administrative tasks — managing content calendars, vendor communications, and campaign logis'},
  {id:169,cat:8,type:'Writing',name:'Writer / Content Journalist',tier:'Mid',rate:'$400–1,000/day',orb:1,sum:'Creates written content for editorial, brand, and digital platforms — combining journalism skills with content marketing capability to produce authoritativ'},
  {id:170,cat:8,type:'Writing',name:'Podcast Producer',tier:'Specialist',rate:'$800–2,000/day',orb:1,sum:'Produces podcasts from concept through distribution — managing recording, editing, guest booking, show notes, and the publishing workflow that brings audio'},
  {id:171,cat:8,type:'Writing',name:'Storyboard Artist (Marketing Context)',tier:'Specialist',rate:'$800–2,000/day',orb:1,sum:'Creates visual scripts for advertising, content, and digital productions — producing storyboard sequences that communicate camera direction, pacing, and na'},
  {id:172,cat:9,type:'Production',name:'Production Coordinator',tier:'Mid',rate:'$400–1,000/day',orb:2,sum:'The operational hub of any production — managing the flow of information, documents, and logistics between all departments and the production office.'},
  {id:173,cat:9,type:'Production',name:'Post Production Coordinator',tier:'Mid',rate:'$400–1,000/day',orb:2,sum:'Manages the operational flow of the post-production phase — coordinating schedules, deliveries, and communication between editorial, colour, sound, VFX, an'},
  {id:174,cat:9,type:'Production',name:'Casting Director',tier:'Senior Specialist',rate:'$800–2,000/day',orb:2,sum:'Responsible for finding and recommending the right talent for every speaking and principal role in a production — combining an encyclopaedic knowledge of a'},
  {id:175,cat:9,type:'Production',name:'Casting Associate',tier:'Mid',rate:'$400–1,000/day',orb:2,sum:'Supports the Casting Director across all casting functions — managing audition logistics, maintaining talent files, and developing the skills to become an '},
  {id:176,cat:9,type:'Production',name:'Location Manager',tier:'Senior',rate:'$800–2,000/day',orb:2,sum:'Responsible for finding, securing, and managing all filming locations — negotiating access agreements, managing location relationships, and ensuring each l'},
  {id:177,cat:9,type:'Production',name:'Location Scout',tier:'Mid',rate:'$400–1,000/day',orb:2,sum:'Finds and photographs potential filming locations based on creative briefs — building a visual library of options for the Location Manager and director to '},
  {id:178,cat:9,type:'Production',name:'Project Manager (Production)',tier:'Mid',rate:'$400–1,000/day',orb:2,sum:'Manages the complete lifecycle of creative and production projects — from scoping and scheduling through to delivery — ensuring all workstreams stay on tim'},
  {id:179,cat:9,type:'Production',name:'Production Office Coordinator',tier:'Mid',rate:'$400–1,000/day',orb:2,sum:'Runs the production office — managing the physical and operational infrastructure of the production base, including communication systems, crew services, a'},
  {id:180,cat:9,type:'Production',name:'Script Supervisor',tier:'Specialist',rate:'$800–2,000/day',orb:2,sum:'Maintains the creative and technical continuity of a production — tracking every detail of performance, set dressing, costume, and camera that must match a'},
  {id:181,cat:9,type:'Production',name:'Data Manager (Production)',tier:'Specialist',rate:'$800–2,000/day',orb:2,sum:'Manages all digital production data during principal photography — overseeing camera card ingest, backup verification, daily data delivery, and the integri'},
  {id:182,cat:9,type:'Production',name:'Transportation Coordinator',tier:'Specialist',rate:'$800–2,000/day',orb:2,sum:'Manages all transportation logistics for a production — crew vehicles, talent cars, equipment trucks, and all movement of people and assets between locatio'},
  {id:183,cat:9,type:'Production',name:'Catering Coordinator',tier:'Specialist',rate:'$800–2,000/day',orb:2,sum:'Manages all on-set catering and craft services — ensuring the crew is fed, nourished, and comfortable throughout the shooting day.'},
  {id:184,cat:9,type:'Production',name:'Props Buyer',tier:'Mid',rate:'$400–1,000/day',orb:2,sum:'Sources and purchases all props required for the production under the direction of the Prop Master — building a detailed knowledge of markets, vendors, and'},
  {id:185,cat:9,type:'Production',name:'Art Department Coordinator',tier:'Mid',rate:'$400–1,000/day',orb:2,sum:'Manages the administrative and operational functions of the art department — coordinating between the Production Designer, Set Designer, Set Decorator, and'},
  {id:186,cat:9,type:'Production',name:'Wardrobe Coordinator',tier:'Mid',rate:'$400–1,000/day',orb:2,sum:'Manages the administrative and logistical operations of the wardrobe department — coordinating fittings, managing costume inventory, and supporting the Cos'},
  {id:187,cat:9,type:'Production',name:'Talent Coordinator',tier:'Mid',rate:'$400–1,000/day',orb:2,sum:'Manages all logistics related to on-screen talent — actor and presenter scheduling, appearance fees, travel and accommodation, and the day-of talent manage'},
  {id:188,cat:9,type:'Production',name:'Clearances Coordinator',tier:'Specialist',rate:'$800–2,000/day',orb:2,sum:'Manages all intellectual property, music, image, and brand clearances required for a production — ensuring every piece of content and every identifiable el'},
  {id:189,cat:9,type:'Production',name:'Assistant Production Manager',tier:'Mid',rate:'$400–1,000/day',orb:2,sum:'Supports the Production Manager with all operational logistics — managing specific departments or functions delegated by the PM to ensure smooth day-to-day'},
  {id:190,cat:9,type:'Production',name:'Picture Car Coordinator',tier:'Specialist',rate:'$800–2,000/day',orb:2,sum:'Sources, manages, and coordinates all hero and background vehicles used across a production — managing the very specific world of specialist vehicle supply'},
  {id:191,cat:9,type:'Production',name:'Unit Publicist',tier:'Specialist',rate:'$800–2,000/day',orb:2,sum:'Manages all press and promotional activity during principal photography — handling set visits, press junket logistics, unit photography direction, and all '},
  {id:192,cat:10,type:'Enterprise',name:'Consumer Brand / Advertiser',tier:'Client',rate:'$500–1,500/day',orb:3,sum:'Consumer-facing brands that use advertising and branded content to drive product awareness, consideration, and purchase. Budget holders for campaign and co'},
  {id:193,cat:10,type:'Enterprise',name:'Fashion House / Luxury Brand',tier:'Client',rate:'$500–1,500/day',orb:3,sum:'Fashion and luxury brands with complex seasonal content requirements — editorial campaigns, runway coverage, social content, and brand films that uphold an'},
  {id:194,cat:10,type:'Enterprise',name:'Record Label',tier:'Client',rate:'$500–1,500/day',orb:3,sum:'Music industry companies that represent and develop recording artists — commissioning music videos, album rollout content, tour materials, and artist brand'},
  {id:195,cat:10,type:'Enterprise',name:'Advertising Agency',tier:'Client / Partner',rate:'$500–1,500/day',orb:3,sum:'Full-service advertising agencies that develop campaigns for brand clients — commissioning production companies, photographers, and creative talent to exec'},
  {id:196,cat:10,type:'Enterprise',name:'Creative Agency',tier:'Client / Partner',rate:'$500–1,500/day',orb:3,sum:'Agencies that specialise in brand identity, content, and creative strategy — developing the conceptual and visual systems that brands build their communica'},
  {id:197,cat:10,type:'Enterprise',name:'Production Company / Studio',tier:'Enterprise',rate:'$1,200–3,000/day',orb:3,sum:'Independent production companies and studios that develop, produce, and distribute creative content — building director and talent rosters, developing proj'},
  {id:198,cat:10,type:'Enterprise',name:'Talent Management Agency',tier:'Client / Partner',rate:'$500–1,500/day',orb:3,sum:'Agencies that manage the careers and commercial interests of artists, actors, musicians, athletes, and other talent — commissioning content and managing ta'},
  {id:199,cat:10,type:'Enterprise',name:'PR Agency',tier:'Client / Partner',rate:'$500–1,500/day',orb:3,sum:'Public relations agencies that manage media coverage, reputation, and brand narrative for clients — commissioning content and photography to support press '},
  {id:200,cat:10,type:'Enterprise',name:'Events Company',tier:'Enterprise',rate:'$1,200–3,000/day',orb:3,sum:'Events companies that plan, produce, and manage live experiences — from corporate conferences and product launches to entertainment events and experiential'},
  {id:201,cat:10,type:'Enterprise',name:'Post-Production House',tier:'Enterprise',rate:'$1,200–3,000/day',orb:3,sum:'Post-production facilities that provide editorial, colour, sound, VFX, and finishing services to film, TV, advertising, and content clients.'},
  {id:202,cat:10,type:'Enterprise',name:'Streaming Platform / Broadcaster',tier:'Enterprise',rate:'$1,200–3,000/day',orb:3,sum:'Streaming platforms and broadcasters that commission, develop, and distribute content — setting creative and technical standards for all content that carri'},
  {id:203,cat:10,type:'Enterprise',name:'Publishing House',tier:'Enterprise',rate:'$1,200–3,000/day',orb:3,sum:'Publishers that commission written and visual content — managing editorial calendars, commissioning photographers and writers, and producing content for pr'},
  {id:204,cat:10,type:'Enterprise',name:'Sports Organisation',tier:'Enterprise',rate:'$1,200–3,000/day',orb:3,sum:'Sports clubs, leagues, and governing bodies that use content, photography, and film to tell their stories, build fan engagement, and attract commercial par'},
  {id:205,cat:10,type:'Enterprise',name:'Cultural Institution / Museum',tier:'Enterprise',rate:'$1,200–3,000/day',orb:3,sum:'Museums, galleries, cultural centres, and arts organisations that commission creative content, exhibitions, and educational materials — increasingly using '},
  {id:206,cat:10,type:'Enterprise',name:'Non-Profit / NGO',tier:'Enterprise',rate:'$1,200–3,000/day',orb:3,sum:'Non-governmental and charitable organisations that use content and creative communication to advance their missions — requiring compelling imagery and stor'},
  {id:207,cat:10,type:'Enterprise',name:'Government / Tourism Board',tier:'Enterprise',rate:'$1,200–3,000/day',orb:3,sum:'Government bodies and tourism organisations that commission content to promote destinations, policies, and public sector initiatives — often requiring comp'},
  {id:208,cat:10,type:'Enterprise',name:'Music Festival / Live Events',tier:'Enterprise',rate:'$1,200–3,000/day',orb:3,sum:'Music festivals and large-scale live events that require significant creative, production, and content capability — from stage design and lighting to photo'},
  {id:209,cat:10,type:'Enterprise',name:'E-Commerce Brand',tier:'Enterprise',rate:'$1,200–3,000/day',orb:3,sum:'Digitally-native brands that sell directly to consumers online — requiring continuous, high-volume product and lifestyle photography, video content, and di'},
  {id:210,cat:10,type:'Enterprise',name:'Sports Brand',tier:'Enterprise',rate:'$1,200–3,000/day',orb:3,sum:'Sports and athletic lifestyle brands that use imagery, content, and athlete partnerships to build brand equity and drive product sales.'},
  {id:211,cat:10,type:'Enterprise',name:'Tech Company (Creative Client)',tier:'Enterprise',rate:'$1,200–3,000/day',orb:3,sum:'Technology companies that commission creative content — from product photography and brand film to social content and event production — to support marketi'},
  {id:212,cat:11,type:'Tech',name:'Creative Tech Platform (SaaS)',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'Software-as-a-service companies that build tools specifically for creative professionals — project management, asset management, collaboration, and creativ'},
  {id:213,cat:11,type:'Tech',name:'AI / Machine Learning Company (Creative)',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'AI companies building products for creative professionals — from image generation and editing tools to music composition, scriptwriting, and creative intel'},
  {id:214,cat:11,type:'Tech',name:'Production Management Software',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'Software companies building tools to manage the operational workflows of productions — call sheets, scheduling, budgeting, and crew management for film, TV'},
  {id:215,cat:11,type:'Tech',name:'Creative Talent Marketplace',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'Platforms that connect creative professionals with clients and opportunities — from freelance marketplaces to curated creative talent discovery platforms.'},
  {id:216,cat:11,type:'Tech',name:'Digital Asset Management (DAM) Platform',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'Software platforms that help organisations store, organise, and distribute their digital creative assets — photos, videos, brand files, and creative collat'},
  {id:217,cat:11,type:'Tech',name:'Video Streaming Infrastructure',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'Technology companies that provide the infrastructure and tools for video streaming — transcoding, CDN, live streaming, and video hosting platforms used by '},
  {id:218,cat:11,type:'Tech',name:'Music Tech Platform',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'Technology companies building tools for musicians, producers, and the music industry — from music creation and recording software to music licensing, distr'},
  {id:219,cat:11,type:'Tech',name:'E-Commerce Tech for Creatives',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'Platforms enabling creative professionals to sell their work directly — print-on-demand, digital download, licensing, and portfolio sites with integrated e'},
  {id:220,cat:11,type:'Tech',name:'Analytics & Intelligence Platform (Creative)',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'Platforms providing data and intelligence specifically for the creative economy — audience insights, content performance analytics, trend intelligence, and'},
  {id:221,cat:11,type:'Tech',name:'Creative Collaboration Tool',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'Platforms enabling creative teams to collaborate remotely — real-time feedback, asset sharing, version control, and approval workflows for creative project'},
  {id:222,cat:11,type:'Tech',name:'Post-Production Software Company',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'Companies that build professional post-production software — editing, colour, VFX, and audio tools used by post-production professionals globally.'},
  {id:223,cat:11,type:'Tech',name:'Virtual Production Technology',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'Companies developing virtual production infrastructure — LED volume stages, real-time rendering engines, camera tracking, and the integrated technology sys'},
  {id:224,cat:11,type:'Tech',name:'AR / VR / XR Content Company',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'Companies creating augmented, virtual, and extended reality content — from brand experiences and advertising to entertainment, education, and training cont'},
  {id:225,cat:11,type:'Tech',name:'Podcast Tech Platform',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'Companies building tools and infrastructure for podcast creation, distribution, monetisation, and analytics — serving independent creators and enterprise p'},
  {id:226,cat:11,type:'Tech',name:'Creator Economy Infrastructure',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'Companies building financial and operational infrastructure for the creator economy — payment processing, subscription management, creator financing, and b'},
  {id:227,cat:11,type:'Tech',name:'Media Monitoring & Intelligence',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'Platforms that monitor media coverage, social mentions, and brand performance across all channels — providing intelligence that brands, agencies, and PR fi'},
  {id:228,cat:11,type:'Tech',name:'Licensing & Rights Management Platform',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'Technology platforms that manage intellectual property licensing, rights clearance, and royalty management for photographers, musicians, publishers, and me'},
  {id:229,cat:11,type:'Tech',name:'Creative Education Platform',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'Online education platforms that teach creative skills — photography, filmmaking, design, music production, and business skills for creative professionals.'},
  {id:230,cat:11,type:'Tech',name:'Content Delivery Network (CDN)',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'Technology infrastructure companies that distribute digital content at speed and scale globally — enabling fast delivery of images, video, and digital asse'},
  {id:231,cat:11,type:'Tech',name:'Virtual Production Previsualization Tool',tier:'Technology',rate:'$800–2,000/day',orb:4,sum:'Software tools that enable film and VFX teams to previsualize and plan productions digitally before physical shooting — simulating camera positions, lighti'},
  {id:232,cat:12,type:'Business',name:'Creative Company CEO / Managing Director',tier:'C-Suite',rate:'$2,000–5,000/day',orb:5,sum:'The ultimate decision-maker in a creative business — responsible for overall strategy, culture, financial performance, and stakeholder relationships. Sets '},
  {id:233,cat:12,type:'Business',name:'Head of Production (Company Level)',tier:'Senior Leadership',rate:'$1,200–3,000/day',orb:5,sum:'Leads all production operations for an entire company or studio — overseeing the production pipeline, allocating resources, managing client relationships a'},
  {id:234,cat:12,type:'Business',name:'Chief Financial Officer (Creative Company)',tier:'C-Suite',rate:'$2,000–5,000/day',orb:5,sum:'Manages all financial operations for a creative company — from financial planning and reporting through to investor relations, fundraising, and financial r'},
  {id:235,cat:12,type:'Business',name:'Venture Capitalist (Media / Creative Tech)',tier:'Investor',rate:'Equity / Deal fee',orb:5,sum:'Venture capital investors who focus on media, creative technology, and the creator economy — identifying, funding, and supporting early-stage companies bui'},
  {id:236,cat:12,type:'Business',name:'Angel Investor (Creative Economy)',tier:'Investor',rate:'Equity / Deal fee',orb:5,sum:'Individual investors who provide early capital to creative economy companies — often former creative industry professionals with both capital and operating'},
  {id:237,cat:12,type:'Business',name:'Institutional / Strategic Investor',tier:'Investor',rate:'Equity / Deal fee',orb:5,sum:'Corporate or institutional investors who take strategic stakes in creative economy businesses — often large media companies, technology platforms, or famil'},
  {id:238,cat:12,type:'Business',name:'Private Equity (Media / Creative)',tier:'Investor',rate:'Equity / Deal fee',orb:5,sum:'Private equity firms that invest in and operate media and creative businesses — typically acquiring majority stakes and driving value creation through oper'},
  {id:239,cat:12,type:'Business',name:'Founder / Co-Founder (Creative Company)',tier:'Founder',rate:'Equity / Deal fee',orb:5,sum:'The builders of new creative economy companies — founding production companies, creative platforms, SaaS tools, and other ventures that serve or operate wi'},
  {id:240,cat:12,type:'Business',name:'Studio Executive',tier:'Senior Leadership',rate:'$1,200–3,000/day',orb:5,sum:'Senior decision-makers at major studios and streaming platforms — overseeing content strategy, development slates, and the commissioning decisions that sha'},
  {id:241,cat:12,type:'Business',name:'General Partner (Creative Fund)',tier:'Senior Investor',rate:'$500–1,500/day',orb:5,sum:'The senior decision-maker within a creative or media-focused investment fund — managing the full investment cycle from fundraising through deal-making and '},
  {id:242,cat:12,type:'Business',name:'Board Member / Advisor',tier:'Advisory',rate:'$500–1,500/day',orb:5,sum:'Senior individuals who provide strategic guidance to creative companies — bringing specific expertise in creative industries, finance, technology, or marke'},
  {id:243,cat:12,type:'Business',name:'Chief Operating Officer (Creative Company)',tier:'C-Suite',rate:'$2,000–5,000/day',orb:5,sum:'Manages the day-to-day operations of a creative company — translating the CEO\'s strategy into operational execution and managing the functional departments'},
  {id:244,cat:12,type:'Business',name:'Head of Business Development',tier:'Senior',rate:'$800–2,000/day',orb:5,sum:'Leads new business and partnership development for a creative company — identifying, developing, and closing new client relationships and strategic partner'},
  {id:245,cat:12,type:'Business',name:'Fund Manager (Creative Sector)',tier:'Investment',rate:'$500–1,500/day',orb:5,sum:'Manages investment portfolios with exposure to creative sector assets — from media company equity through to creative IP and content rights.'},
  {id:246,cat:12,type:'Business',name:'Limited Partner (LP)',tier:'Investor',rate:'Equity / Deal fee',orb:5,sum:'Institutional or high-net-worth investors who commit capital to creative economy funds — providing the capital base that GPs deploy into creative sector co'},
  {id:247,cat:12,type:'Business',name:'Entertainment Lawyer',tier:'Professional Services',rate:'$500–1,500/day',orb:5,sum:'Specialist lawyers who advise clients on intellectual property, contracts, talent deals, production agreements, and all legal matters specific to the enter'},
  {id:248,cat:12,type:'Business',name:'Talent Agent',tier:'Professional Services',rate:'$500–1,500/day',orb:5,sum:'Represents creative professionals — actors, directors, photographers, writers, and musicians — securing work, negotiating deals, and developing careers on '},
  {id:249,cat:12,type:'Business',name:'Business Manager (Entertainment)',tier:'Professional Services',rate:'$500–1,500/day',orb:5,sum:'Manages the financial, tax, and business affairs of entertainment industry talent — ensuring clients are financially compliant, protected, and building lon'},
  {id:250,cat:12,type:'Business',name:'Creative Industry Consultant',tier:'Advisory',rate:'$500–1,500/day',orb:5,sum:'Provides specialist advisory services to creative businesses, brands, and institutions — applying deep industry expertise to solve specific strategic, oper'},
  {id:251,cat:12,type:'Business',name:'Chief Creative Officer (Capital / Strategy Context)',tier:'C-Suite / Advisory',rate:'$500–1,500/day',orb:5,sum:'The most senior creative voice within a capital structure or multi-entity creative group — responsible for ensuring creative quality, vision, and cultural '},
  {id:252,cat:2,type:'Production',name:'Lead Actor / Principal Cast',tier:'Principal Talent',rate:'$500–1,500/day',orb:1,sum:'The primary on-screen talent driving the narrative — responsible for embodying character, delivering performance, and anchoring the emotional core of a pro'},
  {id:253,cat:2,type:'Production',name:'Supporting Actor',tier:'Supporting Talent',rate:'$500–1,500/day',orb:1,sum:'Delivers defined character performances in support of the lead narrative — bringing specificity, depth, and craft to roles that shape the world around the '},
  {id:254,cat:2,type:'Production',name:'Background Artist / Extra',tier:'Background Talent',rate:'$500–1,500/day',orb:1,sum:'Populates the world of a production — creating the ambient human texture of scenes without dialogue, bringing authenticity and life to any environment.'},
  {id:255,cat:2,type:'Production',name:'Stunt Coordinator',tier:'Senior Specialist',rate:'$800–2,000/day',orb:1,sum:'Designs, plans, and supervises all stunt and action sequences — ensuring performer safety while delivering the visceral physical storytelling the director '},
  {id:256,cat:2,type:'Production',name:'Stunt Performer / Stunt Double',tier:'Specialist Talent',rate:'$500–1,500/day',orb:1,sum:'Executes physical action sequences requiring specialist training — doubling for principal cast or performing featured stunt work in high-risk action scenar'},
  {id:257,cat:2,type:'Production',name:'Acting / Performance Coach',tier:'Specialist',rate:'$800–2,000/day',orb:1,sum:'Works one-on-one or in small groups with cast to develop performance, refine technique, and prepare actors for the specific demands of a role or production'},
  {id:258,cat:2,type:'Production',name:'Dialect & Accent Coach',tier:'Specialist',rate:'$800–2,000/day',orb:1,sum:'Trains and coaches actors in specific dialects, accents, and speech patterns required for their role — ensuring authenticity and consistency across the ful'},
  {id:259,cat:2,type:'Production',name:'Chemistry & Intimacy Coordinator',tier:'Specialist',rate:'$800–2,000/day',orb:1,sum:'Facilitates authentic relational and intimate performance between cast — creating the psychological and physical safety framework that allows actors to do '},
  {id:260,cat:2,type:'Production',name:'Casting Director',tier:'Senior Specialist',rate:'$800–2,000/day',orb:1,sum:'Leads the identification, audition, and selection of all talent for a production — translating character vision into the human performances that will defin'},
  {id:261,cat:2,type:'Production',name:'Script Supervisor',tier:'Mid–Senior',rate:'$600–1,500/day',orb:1,sum:'The guardian of continuity on set — tracking every visual, dialogue, and physical detail across takes to ensure the editor has everything needed for a seam'},
  {id:262,cat:13,type:'Visual',name:'Fine Art Painter',tier:'Independent / Represented',rate:'$500–1,500/day',orb:0,sum:'Creates original works on canvas, panel, or surface — developing a sustained body of practice that interrogates the world through paint, material, and mark'},
  {id:263,cat:13,type:'Visual',name:'Muralist',tier:'Independent / Commissioned',rate:'$500–1,500/day',orb:0,sum:'Creates large-scale painted works in public and private spaces — transforming walls, buildings, and environments into sites of cultural expression and comm'},
  {id:264,cat:13,type:'Visual',name:'Sculptor',tier:'Independent / Represented',rate:'$500–1,500/day',orb:0,sum:'Works in three-dimensional form — across material, scale, and process — to create objects and installations that occupy, challenge, and transform physical '},
  {id:265,cat:13,type:'Strategy',name:'Art Collector',tier:'Private / Institutional',rate:'$500–1,500/day',orb:0,sum:'Builds and manages a curated body of art acquisitions — developing taste, relationships, and a collection that holds cultural and financial significance.'},
  {id:266,cat:13,type:'Strategy',name:'Exhibition Curator',tier:'Mid–Senior',rate:'$600–1,500/day',orb:0,sum:'Conceives, develops, and delivers art exhibitions — selecting work, building interpretive frameworks, and creating the conditions for meaningful encounters'},
  {id:267,cat:13,type:'Strategy',name:'Art Gallery Director',tier:'Senior / Director',rate:'$1,000–2,500/day',orb:0,sum:'Leads the commercial, curatorial, and institutional direction of a gallery — managing artist relationships, sales strategy, and long-term programme develop'},
  {id:268,cat:13,type:'Strategy',name:'Art Dealer / Secondary Market Specialist',tier:'Mid–Senior',rate:'$600–1,500/day',orb:0,sum:'Operates in the secondary art market — identifying, valuing, sourcing, and placing artworks for private clients through direct sales, auction, and private '},
  {id:269,cat:13,type:'Strategy',name:'Art Advisor / Art Consultant',tier:'Mid–Senior',rate:'$600–1,500/day',orb:0,sum:'Provides expert guidance to private collectors, corporations, and institutions on art acquisition, collection development, and cultural investment strategy'},
  {id:270,cat:13,type:'Production',name:'Art Conservator / Restorer',tier:'Specialist',rate:'$800–2,000/day',orb:0,sum:'Preserves, stabilises, and restores artworks — applying specialist scientific and material knowledge to protect cultural objects for future generations.'},
  {id:271,cat:13,type:'Strategy',name:'Museum / Gallery Educator',tier:'Mid',rate:'$400–1,000/day',orb:0,sum:'Develops and delivers educational programmes that open art to diverse audiences — connecting exhibitions, collections, and ideas to communities, schools, a'},
  {id:272,cat:13,type:'Visual',name:'Printmaker',tier:'Independent / Represented',rate:'$500–1,500/day',orb:0,sum:'Creates original artworks through printmaking processes — etching, screenprint, lithography, and digital — developing editions that bring fine art to a bro'},
  {id:273,cat:13,type:'Visual',name:'Textile & Fibre Artist',tier:'Independent / Represented',rate:'$500–1,500/day',orb:0,sum:'Works with fabric, thread, and fibre as primary artistic media — creating works that bridge craft tradition, conceptual art practice, and contemporary mate'},
  {id:274,cat:13,type:'Visual',name:'Installation Artist',tier:'Independent / Institutional',rate:'$500–1,500/day',orb:0,sum:'Creates immersive, site-responsive environments and installations — transforming space itself into a medium for artistic experience.'},
  {id:275,cat:13,type:'Strategy',name:'Art Fair Director',tier:'Director / Executive',rate:'$1,200–3,000/day',orb:0,sum:'Leads the strategic, curatorial, and commercial direction of an art fair — selecting galleries, building the programme, and positioning the fair within the'},
  {id:276,cat:13,type:'Strategy',name:'Artist Estate Manager',tier:'Specialist',rate:'$800–2,000/day',orb:0,sum:'Manages the legal, commercial, and cultural legacy of a deceased or incapacitated artist — protecting their work, reputation, and the integrity of their pr'},
  {id:277,cat:13,type:'Visual',name:'Ceramic Artist / Potter',tier:'Independent / Represented',rate:'$500–1,500/day',orb:0,sum:'Works with clay and fire to create objects and artworks that span functional craft, decorative art, and fine art practice — building a market across multip'},
  {id:278,cat:13,type:'Strategy',name:'Public Art Commissioning Officer',tier:'Mid–Senior',rate:'$600–1,500/day',orb:0,sum:'Manages the commissioning, procurement, and delivery of public art on behalf of institutions, developers, and government bodies.'},
  {id:279,cat:13,type:'Strategy',name:'Art Writer / Critic',tier:'Independent / Staff',rate:'$500–1,500/day',orb:0,sum:'Writes critically and interpretively about art — reviewing exhibitions, profiling artists, and developing the discourse through which art is understood and'},
  {id:280,cat:13,type:'Production',name:'Art Technician / Gallery Installer',tier:'Mid',rate:'$400–1,000/day',orb:0,sum:'Handles the physical installation, care, and deinstallation of artworks — ensuring works are presented with precision, safety, and curatorial fidelity.'},
  {id:281,cat:13,type:'Strategy',name:'Cultural Fundraiser / Development Officer',tier:'Mid–Senior',rate:'$600–1,500/day',orb:0,sum:'Secures the financial support — through trusts, foundations, corporate partners, and individual donors — that makes ambitious cultural programming possible'},
  {id:282,cat:13,type:'Strategy',name:'Arts Lawyer / Cultural Property Specialist',tier:'Senior / Specialist',rate:'$500–1,500/day',orb:0,sum:'Provides specialist legal counsel on art transactions, intellectual property, cultural property, authenticity disputes, and the legal infrastructure of the'}
];

const TIER_ORDER = ['C-Suite','Executive','Director / Executive','Senior Leadership','Head of Department','Director / Senior','Senior / Advisory','Senior / Director','Senior / Specialist','Senior','Mid–Senior','Mid-Senior','Mid','Junior-Mid','Junior','Entry','Specialist','Senior Specialist','Independent / Commissioned','Independent / Represented','Private / Institutional','Enterprise','Technology','Investor','Senior Investor','Investment','Founder','Advisory','C-Suite / Advisory','Professional Services'];

/* ARCHETYPES_LIST kept as a smaller "primary disciplines" subset for places
   that don't need the full 282 (onboarding's first-glance list, switcher
   quick-pick). The full LIBRARY is the canonical source for the Skills
   Library browser.                                                       */
const ARCHETYPES_LIST = [
  { name: 'Creative Director', tier: 'Foundation', desc: 'Vision, aesthetics, brand storytelling' },
  { name: 'Art Director',      tier: 'Visual',     desc: 'Visual language, layout, design systems' },
  { name: 'Stylist',           tier: 'Visual',     desc: 'Wardrobe, props, set dressing' },
  { name: 'Photographer',      tier: 'Production', desc: 'Stills, editorial, commercial' },
  { name: 'Cinematographer',   tier: 'Production', desc: 'Camera, lighting, lensing' },
  { name: '1st AD',            tier: 'Production', desc: 'Schedule, crew, set logistics' },
  { name: 'Producer',          tier: 'Production', desc: 'Budget, delivery, logistics' },
  { name: 'Editor',            tier: 'Post',       desc: 'Picture cut, sequence, pacing' },
  { name: 'Music Supervisor',  tier: 'Post',       desc: 'Licensing, sync, sound direction' },
  { name: 'Retoucher',         tier: 'Post',       desc: 'Image finishing, colour' },
  { name: 'PR Specialist',     tier: 'Strategy',   desc: 'Press, narrative, amplification' },
  { name: 'Brand Strategist',  tier: 'Strategy',   desc: 'Positioning, identity, voice' },
  { name: 'Casting Director',  tier: 'Production', desc: 'Talent sourcing, chemistry' },
  { name: 'Set Designer',      tier: 'Visual',     desc: 'Spatial design, fabrication' },
  { name: 'Copywriter',        tier: 'Strategy',   desc: 'Voice, taglines, narrative' },
  { name: 'Creative Producer', tier: 'Production', desc: 'Producer + creative oversight' },
];

/* ─── OB · step pills (top progress) ─────────────────────────── */
function OBStepPills({ step, total = 3, labels = [] }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {Array.from({ length: total }).map((_, i) => {
        const n = i + 1;
        const active = n === step;
        const done = n < step;
        return (
          <div key={i} style={{
            padding: '6px 14px', borderRadius: 999,
            background: active ? ACCENT : (done ? T_OB.cardBgAlt : 'transparent'),
            border: `1px solid ${active ? 'transparent' : T_OB.borderMd}`,
            display: 'flex', alignItems: 'center', gap: 7,
            transition: `all ${EASE_DELIBERATE}`,
          }}>
            <span style={{
              fontFamily: MONO, fontSize: 9.5, fontWeight: 600, letterSpacing: '0.12em',
              color: active ? ACCENT_INK : (done ? T_OB.ink3 : T_OB.ink4),
            }}>{String(n).padStart(2, '0')}</span>
            {labels[i] && (
              <span style={{
                fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                fontSize: 11.5, letterSpacing: '-0.005em',
                color: active ? ACCENT_INK : (done ? T_OB.ink2 : T_OB.ink4),
              }}>{labels[i]}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── OB · step stack (the 3 cards on the left) ────────────── */
function OBStepStack({ step, titles, onPick }) {
  // The tall left-side step stack used to repeat what the top-bar
  // step pills already say. With the pills present, this stack added
  // visual noise without adding information — three progress indicators
  // on one screen. So this component now returns null. The signature is
  // preserved so callers don't need to be modified.
  return null;
}

/* ─── OB · pre-population banner ───────────────────────────── */
function OBPrepopBanner({ source }) {
  return (
    <div style={{
      padding: '10px 14px',
      background: 'rgba(255,171,13,0.08)',
      border: '1px solid rgba(255,171,13,0.20)',
      borderRadius: 10,
      display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 18,
    }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT, marginTop: 6, flexShrink: 0 }}/>
      <div>
        <div style={{ fontFamily: BODY, fontWeight: 500, fontSize: 12, color: T_OB.ink2, marginBottom: 2 }}>
          Found from your {source}
        </div>
        <div style={{ fontFamily: BODY, fontStyle: 'italic', fontSize: 11, color: T_OB.ink3, lineHeight: 1.5 }}>
          Confirm or update each field. Nothing is saved until you continue.
        </div>
      </div>
    </div>
  );
}

/* ─── OB · shared layout (top bar + bottom counter) ────────── */
function OBLayout({ children, step }) {
  const { isMobile, isTablet } = useViewport();
  // Hide the step-pill labels on mobile (just show the number); show full labels on tablet+
  const pillLabels = isMobile ? [] : ['Identity', 'Archetype', 'Photo'];
  return (
    <div style={{
      width: '100%', minHeight: '100vh', background: T_OB.pageBg,
      fontFamily: BODY, color: T_OB.ink,
      display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        flexShrink: 0,
        padding: isMobile ? '16px 20px' : (isTablet ? '20px 28px' : '24px 40px'),
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `1px solid ${T_OB.dividerInk}`,
        gap: 12,
      }}>
        <NOSMark T={T_OB} size={isMobile ? 12 : 14} label={isMobile ? null : "Welcome"} />
        {step
          ? <OBStepPills step={step} labels={pillLabels} />
          : <div style={{
              fontFamily: MONO, fontSize: 9.5, fontWeight: 500,
              letterSpacing: '0.14em', textTransform: 'uppercase', color: T_OB.ink4,
            }}>Onboarding</div>}
        {!isMobile && (
          <div style={{ fontFamily: BODY, fontStyle: 'italic', fontSize: 12, color: T_OB.ink4 }}>v1.4</div>
        )}
      </div>
      {/* Body — centred, single column. The previous design used a
          two-column layout with a tall left "step stack" repeating
          the step titles, but the step pills above already carry that
          information. One column reads cleaner and gives the form
          itself room to breathe. */}
      <div style={{
        flex: 1,
        padding: isMobile ? '24px 20px' : (isTablet ? '40px 36px' : '60px 80px'),
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: 0,
      }}>{children}</div>
    </div>
  );
}

/* ─── OB · screens ──────────────────────────────────────────── */

function OBSignUp({ form, setForm, onContinue, onSwitchToLogin, authError, authLoading }) {
  const [pwError, setPwError] = useState(null);
  const { isMobile } = useViewport();
  const valid = form.email && /\S+@\S+\.\S+/.test(form.email)
                && form.password && form.password.length >= 8;
  const handle = () => {
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) return;
    if (form.password.length < 8) { setPwError('Minimum 8 characters'); return; }
    onContinue();
  };
  return (
    <OBLayout>
      <div style={{
        width: '100%', maxWidth: 420,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <div style={{
          fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
          fontSize: isMobile ? 32 : 44,
          lineHeight: 1.05, letterSpacing: '-0.025em',
          color: T_OB.ink, marginBottom: isMobile ? 28 : 40,
          textAlign: 'center',
        }}>Welcome to Nia.</div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <button
            onClick={() => onContinue({ provider: 'google' })}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: T_OB.inputBg, border: `1px solid ${T_OB.borderMd}`,
              borderRadius: 10, padding: '12px 14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              fontFamily: BODY, fontSize: 13, fontWeight: 500,
              color: T_OB.ink, cursor: 'pointer',
            }}>
            <GoogleIc s={15} />
            Continue with Google
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0' }}>
            <div style={{ flex: 1, height: 1, background: T_OB.dividerInk }}/>
            <span style={{
              fontFamily: MONO, fontSize: 9.5, fontWeight: 500,
              letterSpacing: '0.14em', textTransform: 'uppercase', color: T_OB.ink4,
            }}>or</span>
            <div style={{ flex: 1, height: 1, background: T_OB.dividerInk }}/>
          </div>
          <Field T={T_OB} label="Email">
            <Input T={T_OB} value={form.email}
              onChange={v => setForm(f => ({ ...f, email: v }))}
              placeholder="you@studio.com" type="email" autoFocus />
          </Field>
          <Field T={T_OB} label="Password" hint="Minimum 8 characters." error={pwError}>
            <Input T={T_OB} value={form.password}
              onChange={v => { setPwError(null); setForm(f => ({ ...f, password: v })); }}
              placeholder="••••••••" type="password" />
          </Field>
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
            {(authError) && (
              <div style={{ alignSelf: 'stretch', fontFamily: BODY, fontSize: 12, color: '#ff4d4d', lineHeight: 1.4 }}>
                {authError}
              </div>
            )}
            <PrimaryButton T={T_OB} onClick={handle} disabled={!valid || authLoading}>
              {authLoading ? 'Creating account…' : <>Continue <ChevRight s={11} c="currentColor" sw={2} /></>}
            </PrimaryButton>
          </div>
        </div>
        <div style={{
          marginTop: 28, fontFamily: BODY, fontSize: 12, color: T_OB.ink3, textAlign: 'center',
        }}>
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
            fontSize: 12, color: ACCENT, padding: 0,
          }}>Log in</button>
        </div>
      </div>
    </OBLayout>
  );
}

function OBLogin({ onLogin, onGoogleSignIn, onSwitchToSignUp, authError, authLoading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { isMobile } = useViewport();
  const valid = email && /\S+@\S+\.\S+/.test(email) && password.length >= 1;
  return (
    <OBLayout>
      <div style={{
        width: '100%', maxWidth: 420,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <div style={{
          fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
          fontSize: isMobile ? 32 : 44,
          lineHeight: 1.05, letterSpacing: '-0.025em',
          color: T_OB.ink, marginBottom: isMobile ? 28 : 40,
          textAlign: 'center',
        }}>Welcome back.</div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <button
            onClick={onGoogleSignIn}
            disabled={authLoading}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: T_OB.inputBg, border: `1px solid ${T_OB.borderMd}`,
              borderRadius: 10, padding: '12px 14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              fontFamily: BODY, fontSize: 13, fontWeight: 500,
              color: T_OB.ink, cursor: authLoading ? 'not-allowed' : 'pointer', opacity: authLoading ? 0.6 : 1,
            }}>
            <GoogleIc s={15} />
            Continue with Google
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0' }}>
            <div style={{ flex: 1, height: 1, background: T_OB.dividerInk }}/>
            <span style={{
              fontFamily: MONO, fontSize: 9.5, fontWeight: 500,
              letterSpacing: '0.14em', textTransform: 'uppercase', color: T_OB.ink4,
            }}>or</span>
            <div style={{ flex: 1, height: 1, background: T_OB.dividerInk }}/>
          </div>
          <Field T={T_OB} label="Email">
            <Input T={T_OB} value={email}
              onChange={setEmail}
              placeholder="you@studio.com" type="email" autoFocus />
          </Field>
          <Field T={T_OB} label="Password">
            <Input T={T_OB} value={password}
              onChange={setPassword}
              placeholder="••••••••" type="password" />
          </Field>
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
            {authError && (
              <div style={{ alignSelf: 'stretch', fontFamily: BODY, fontSize: 12, color: '#ff4d4d', lineHeight: 1.4 }}>
                {authError}
              </div>
            )}
            <PrimaryButton T={T_OB} onClick={() => onLogin(email, password)} disabled={!valid || authLoading}>
              {authLoading ? 'Signing in…' : <>Sign in <ChevRight s={11} c="currentColor" sw={2} /></>}
            </PrimaryButton>
          </div>
        </div>
        <div style={{
          marginTop: 28, fontFamily: BODY, fontSize: 12, color: T_OB.ink3, textAlign: 'center',
        }}>
          Don't have an account?{' '}
          <button onClick={onSwitchToSignUp} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
            fontSize: 12, color: ACCENT, padding: 0,
          }}>Sign up</button>
        </div>
      </div>
    </OBLayout>
  );
}

function OBVerify({ form, onVerified, onResend }) {
  return (
    <OBLayout>
      <div style={{
        margin: '0 auto', maxWidth: 540, textAlign: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, marginTop: 40,
      }}>
        <div style={{
          width: 88, height: 88, borderRadius: 22,
          background: T_OB.cardBg, border: `1px solid ${T_OB.borderMd}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: T_OB.cardShadow,
        }}>
          <div style={{
            fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
            fontSize: 36, lineHeight: 1, letterSpacing: '-0.04em', color: ACCENT,
          }}>✓</div>
        </div>
        <div>
          <div style={{
            fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: T_OB.ink4, marginBottom: 14,
          }}>Step zero</div>
          <div style={{
            fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
            fontSize: 36, lineHeight: 1.15, letterSpacing: '-0.025em',
            color: T_OB.ink, marginBottom: 18,
          }}>Verify your email.</div>
          <div style={{
            fontFamily: BODY, fontSize: 13.5, lineHeight: 1.65,
            color: T_OB.ink3, maxWidth: 420, margin: '0 auto',
          }}>
            We sent a verification link to{' '}
            <span style={{ color: T_OB.ink, fontWeight: 500 }}>{form.email}</span>.
            Click it to continue setting up your terminal.
          </div>
        </div>
        <div style={{
          padding: '14px 18px', background: T_OB.cardBgAlt,
          border: `1px solid ${T_OB.dividerInk}`, borderRadius: 12,
          display: 'flex', alignItems: 'center', gap: 14,
          fontFamily: BODY, fontSize: 12, color: T_OB.ink3,
        }}>
          <span>Didn't get it?</span>
          <button onClick={onResend} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
            fontSize: 12, color: ACCENT, padding: 0,
          }}>Resend email</button>
        </div>
        <div style={{ marginTop: 20 }}>
          <PrimaryButton T={T_OB} onClick={onVerified}>
            I've verified — continue <ChevRight s={11} c="currentColor" sw={2} />
          </PrimaryButton>
        </div>
      </div>
    </OBLayout>
  );
}

function OBIdentity({ form, setForm, onContinue, onBack }) {
  const valid = form.name && form.location && form.role;
  return (
    <OBLayout step={1}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        {form.prepopulated && <OBPrepopBanner source="Google profile" />}
        <div style={{
          fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
          fontSize: 32, lineHeight: 1.15, letterSpacing: '-0.025em',
          color: T_OB.ink, marginBottom: 8,
        }}>Identity.</div>
        <div style={{ fontFamily: BODY, fontSize: 13, color: T_OB.ink3, marginBottom: 26, lineHeight: 1.6 }}>
          The basics. Used to personalise your briefs and shortcuts —
          never shared, never used to advertise.
        </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Field T={T_OB} label="Full name">
              <Input T={T_OB} value={form.name}
                onChange={v => setForm(f => ({ ...f, name: v }))}
                placeholder="Ikanyeng Rammutla" autoFocus
                suggested={form.prepopulated && !form.nameEdited}/>
            </Field>
            <Field T={T_OB} label="City" hint="Used for regional NRI rates and local team matching.">
              <Input T={T_OB} value={form.location}
                onChange={v => setForm(f => ({ ...f, location: v }))}
                placeholder="Boston" />
            </Field>
            <Field T={T_OB} label="What do you do?" hint="A short title is fine. You'll pick an archetype next.">
              <Input T={T_OB} value={form.role}
                onChange={v => setForm(f => ({ ...f, role: v }))}
                placeholder="Creative Director" />
            </Field>
          </div>
          <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <GhostButton T={T_OB} onClick={onBack}>← Back</GhostButton>
            <PrimaryButton T={T_OB} onClick={onContinue} disabled={!valid}>
              Continue <ChevRight s={11} c="currentColor" sw={2} />
            </PrimaryButton>
          </div>
      </div>
    </OBLayout>
  );
}

function OBArchetype({ form, setForm, onContinue, onBack, onPickStep }) {
  const { isMobile, isTablet } = useViewport();
  const [query, setQuery] = useState('');
  const [showSecondary, setShowSecondary] = useState(false);
  const filtered = ARCHETYPES_LIST.filter(a =>
    a.name.toLowerCase().includes(query.toLowerCase()) ||
    a.tier.toLowerCase().includes(query.toLowerCase()) ||
    a.desc.toLowerCase().includes(query.toLowerCase())
  );
  const pickPrimary = (a) => setForm(f => ({ ...f, archetypePrimary: a.name }));
  const toggleSecondary = (a) => setForm(f => {
    const list = f.archetypeSecondary || [];
    if (list.includes(a.name)) return { ...f, archetypeSecondary: list.filter(n => n !== a.name) };
    if (list.length >= 2) return f;
    return { ...f, archetypeSecondary: [...list, a.name] };
  });
  const valid = !!form.archetypePrimary;
  return (
    <OBLayout step={2}>
      <div style={{ width: '100%', maxWidth: 540, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{
            fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
            fontSize: 32, lineHeight: 1.15, letterSpacing: '-0.025em',
            color: T_OB.ink, marginBottom: 8,
          }}>Archetype.</div>
          <div style={{ fontFamily: BODY, fontSize: 13, color: T_OB.ink3, marginBottom: 22, lineHeight: 1.6 }}>
            Your archetype shapes everything Nia does for you — the shortcuts that load,
            the brief templates you start with, the language Claude uses. Pick one primary.
            Add up to two secondary if your work spans disciplines.
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: T_OB.inputBg, border: `1px solid ${T_OB.borderMd}`,
            borderRadius: 10, padding: '10px 14px', marginBottom: 18,
          }}>
            <SearchIc s={13} c={T_OB.ink3} sw={1.5} />
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search 282 archetypes…"
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                flex: 1, color: T_OB.ink, fontFamily: BODY, fontSize: 13, letterSpacing: '-0.005em',
              }}/>
            {query && (
              <button onClick={() => setQuery('')} style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: T_OB.ink3, padding: 0, display: 'flex',
              }}>
                <CloseIc s={11} c="currentColor" sw={1.6} />
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            {[
              { id: false, label: 'Primary' },
              { id: true,  label: `Secondary (${(form.archetypeSecondary || []).length}/2)` },
            ].map(t => {
              const on = showSecondary === t.id;
              return (
                <button key={String(t.id)} onClick={() => setShowSecondary(t.id)} style={{
                  background: on ? T_OB.cardBg : 'transparent',
                  border: `1px solid ${on ? T_OB.borderMd : 'transparent'}`,
                  borderRadius: 999, padding: '6px 12px',
                  fontFamily: BODY, fontSize: 11.5, fontWeight: 500,
                  fontStyle: on ? 'normal' : 'italic', letterSpacing: '-0.005em',
                  color: on ? T_OB.ink : T_OB.ink3, cursor: 'pointer',
                }}>{t.label}</button>
              );
            })}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 320, overflowY: 'auto', paddingRight: 4 }}>
            {filtered.map(a => {
              const isPrimary = form.archetypePrimary === a.name;
              const isSecondary = (form.archetypeSecondary || []).includes(a.name);
              const active = showSecondary ? isSecondary : isPrimary;
              const disabled = showSecondary && a.name === form.archetypePrimary;
              const handle = () => {
                if (disabled) return;
                if (showSecondary) toggleSecondary(a); else pickPrimary(a);
              };
              return (
                <button key={a.name} onClick={handle} disabled={disabled}
                  style={{
                    all: 'unset', boxSizing: 'border-box',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    padding: '12px 14px', borderRadius: 10,
                    background: active ? 'rgba(255,171,13,0.08)' : T_OB.cardBgAlt,
                    border: `1px solid ${active ? ACCENT : T_OB.dividerInk}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: 12, opacity: disabled ? 0.4 : 1, transition: `all ${EASE_QUICK}`,
                  }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left' }}>
                    <div style={{
                      fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                      fontSize: 13.5, color: T_OB.ink, letterSpacing: '-0.005em',
                    }}>{a.name}</div>
                    <div style={{ fontFamily: BODY, fontSize: 11.5, color: T_OB.ink3, lineHeight: 1.4 }}>{a.desc}</div>
                  </div>
                  <div style={{
                    fontFamily: MONO, fontSize: 9, fontWeight: 600,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: active ? ACCENT : T_OB.ink4, flexShrink: 0,
                  }}>
                    {disabled ? 'Primary' : (active ? '✓ Selected' : a.tier)}
                  </div>
                </button>
              );
            })}
          </div>
          <div style={{ marginTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <GhostButton T={T_OB} onClick={onBack}>← Back</GhostButton>
            <PrimaryButton T={T_OB} onClick={onContinue} disabled={!valid}>
              Continue <ChevRight s={11} c="currentColor" sw={2} />
            </PrimaryButton>
          </div>
      </div>
    </OBLayout>
  );
}

function OBPhoto({ form, setForm, onContinue, onSkip, onBack, onPickStep }) {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(form.avatarUrl || null);
  const handleFile = (file) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = (e) => { setPreview(e.target.result); setForm(f => ({ ...f, avatarUrl: e.target.result, avatarFile: file })); };
    r.readAsDataURL(file);
  };
  return (
    <OBLayout step={3}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div style={{
          fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
          fontSize: 32, lineHeight: 1.15, letterSpacing: '-0.025em',
          color: T_OB.ink, marginBottom: 8,
        }}>Photo.</div>
        <div style={{ fontFamily: BODY, fontSize: 13, color: T_OB.ink3, marginBottom: 32, lineHeight: 1.6 }}>
          Optional. Adds a face to your work when you collaborate with other Nia users.
          You can change or remove this anytime.
        </div>
          <button
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
            style={{
              all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
              width: '100%', minHeight: 220,
              background: T_OB.cardBgAlt,
              border: `1px dashed ${preview ? 'transparent' : T_OB.borderMd}`,
              borderRadius: 16,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 14, padding: 24, position: 'relative', overflow: 'hidden',
            }}>
            {preview ? (
              <>
                <img src={preview} alt="" style={{
                  width: 140, height: 140, borderRadius: '50%',
                  objectFit: 'cover', border: `2px solid ${ACCENT}`,
                }}/>
                <div style={{ fontFamily: BODY, fontStyle: 'italic', fontWeight: 500, fontSize: 12, color: T_OB.ink3 }}>
                  Click to change
                </div>
              </>
            ) : (
              <>
                <UploadIc s={28} c={T_OB.ink3} sw={1.4} />
                <div style={{
                  fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
                  fontSize: 14, color: T_OB.ink2, letterSpacing: '-0.005em',
                }}>Drop a photo, or click to upload</div>
                <div style={{
                  fontFamily: MONO, fontSize: 9.5, fontWeight: 500,
                  letterSpacing: '0.14em', textTransform: 'uppercase', color: T_OB.ink4,
                }}>JPG · PNG · ≤ 5MB</div>
              </>
            )}
          </button>
          <input ref={fileRef} type="file" accept="image/*" hidden
            onChange={e => handleFile(e.target.files[0])}/>
          <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <GhostButton T={T_OB} onClick={onBack}>← Back</GhostButton>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <GhostButton T={T_OB} onClick={onSkip}>Skip for now</GhostButton>
              <PrimaryButton T={T_OB} onClick={onContinue}>
                Finish setup <ChevRight s={11} c="currentColor" sw={2} />
              </PrimaryButton>
            </div>
          </div>
      </div>
    </OBLayout>
  );
}

function OBWelcome({ form, onEnter }) {
  // Final screen of onboarding. The user just finished setup — this is
  // a personal greeting before the terminal opens. Click anywhere to
  // enter. No button, no avatar, no eyebrow, no body copy.
  const firstName = (form.name || 'there').split(' ')[0];
  return (
    <OBLayout>
      <button onClick={onEnter}
        aria-label="Enter Nia"
        style={{
          all: 'unset', cursor: 'pointer',
          width: '100%', flex: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center',
        }}>
        <div style={{
          fontFamily: BODY, fontStyle: 'italic', fontWeight: 500,
          fontSize: 'clamp(36px, 6vw, 56px)',
          lineHeight: 1.05, letterSpacing: '-0.03em',
          color: T_OB.ink,
        }}>Hi, {firstName}.</div>
      </button>
    </OBLayout>
  );
}

/* ─── OB · orchestrator ─────────────────────────────────────── */
function NiaOnboarding({ onComplete, referralSource = 'direct', initialStage, initialForm: extInitialForm }) {
  const [stage, setStage] = useState(initialStage || 'signup');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [form, setForm] = useState({
    email: extInitialForm?.email || '', password: '',
    provider: extInitialForm?.provider || null, referralSource,
    name: extInitialForm?.name || '', location: '', role: '',
    archetypePrimary: '', archetypeSecondary: [],
    avatarUrl: extInitialForm?.avatarUrl || null, avatarFile: null,
    prepopulated: !!(extInitialForm?.name),
  });

  useEffect(() => {
    if (initialStage && initialStage !== stage) setStage(initialStage);
  }, [initialStage]);

  useEffect(() => {
    if (extInitialForm?.name && !form.prepopulated) {
      setForm(f => ({ ...f, ...extInitialForm, prepopulated: true }));
    }
  }, [extInitialForm]);

  const handleEmailSignUp = async () => {
    setAuthLoading(true);
    setAuthError(null);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { emailRedirectTo: window.location.origin },
    });
    setAuthLoading(false);
    if (error) { setAuthError(error.message); return; }
    setForm(f => ({ ...f, provider: 'email' }));
    setStage('verify');
  };

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
  };

  const handleLogin = async (email, password) => {
    setAuthLoading(true);
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setAuthLoading(false);
    if (error) { setAuthError(error.message); }
    // onAuthStateChange in shell handles navigation on success
  };

  const stages = {
    signup: <OBSignUp form={form} setForm={setForm}
      authLoading={authLoading} authError={authError}
      onContinue={(opts) => {
        if (opts?.provider === 'google') { handleGoogleSignIn(); }
        else { handleEmailSignUp(); }
      }}
      onSwitchToLogin={() => { setAuthError(null); setStage('login'); }} />,
    login: <OBLogin
      authLoading={authLoading} authError={authError}
      onLogin={handleLogin}
      onGoogleSignIn={handleGoogleSignIn}
      onSwitchToSignUp={() => { setAuthError(null); setStage('signup'); }} />,
    verify: <OBVerify form={form}
      onVerified={async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) setStage('identity');
        else nosToast('Email not yet verified — check your inbox.', { eyebrow: 'Verify', kind: 'danger' });
      }}
      onResend={async () => {
        await supabase.auth.resend({ type: 'signup', email: form.email });
        nosToast(`Verification resent to ${form.email}`, { eyebrow: 'Email' });
      }} />,
    identity: <OBIdentity form={form} setForm={setForm}
      onContinue={() => setStage('archetype')}
      onBack={() => setStage(form.provider === 'google' ? 'signup' : 'verify')} />,
    archetype: <OBArchetype form={form} setForm={setForm}
      onContinue={() => setStage('photo')} onBack={() => setStage('identity')}
      onPickStep={(n) => n === 1 && setStage('identity')} />,
    photo: <OBPhoto form={form} setForm={setForm}
      onContinue={() => setStage('welcome')} onSkip={() => setStage('welcome')}
      onBack={() => setStage('archetype')}
      onPickStep={(n) => { if (n === 1) setStage('identity'); if (n === 2) setStage('archetype'); }} />,
    welcome: <OBWelcome form={form}
      onEnter={() => onComplete?.({
        name: form.name, email: form.email, location: form.location, role: form.role,
        archetypePrimary: form.archetypePrimary, archetypeSecondary: form.archetypeSecondary,
        avatarUrl: form.avatarUrl, provider: form.provider,
        referralSource: form.referralSource,
      })} />,
  };
  return stages[stage] || null;
}

/* END OF REGION 2 — ONBOARDING MODULE */

export { NiaOnboarding, ALL_CATEGORIES, LIBRARY, TIER_ORDER, ARCHETYPES_LIST };
