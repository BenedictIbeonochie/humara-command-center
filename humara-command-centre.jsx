import { useState, useEffect, useMemo, useCallback } from "react";
import { Search, Bell, GitBranch, FileText, MessageSquare, Send, Plus, Filter, ChevronDown, ChevronRight, Clock, AlertTriangle, CheckCircle2, Circle, ArrowRight, X, Users, Zap, BarChart3, ExternalLink, RefreshCw, Copy, Tag, Layers, ShieldCheck, Code2, Globe, Cpu, TestTube, Rocket, Settings, Calendar, Hash, ArrowUpRight, ChevronUp, Minus } from "lucide-react";

// ─── TASK DATA (pre-loaded from your backlog) ──────────────────────────────
const RAW_TASKS = [{"id":17,"name":"Study the tokens projects to understand how they are designed, their utility value, any pools they are part of etc","assignee":"","due":"","est_days":"3.0","parent":"","priority":"Medium","project":"Humara Token Project","status":"Not Started","tags":"Phase 0, Research"},{"id":18,"name":"Design DB schema for off-chain points program","assignee":"","due":"","est_days":"2.0","parent":"","priority":"High","project":"Humara Token Project","status":"Not Started","tags":"Phase 0, Backend"},{"id":19,"name":"Implement points-accrual service (bookings + reviews + referrals + add-ons)","assignee":"","due":"","est_days":"4.0","parent":"","priority":"High","project":"Humara Token Project","status":"Not Started","tags":"Phase 0, Backend"},{"id":20,"name":"Expose points balance and history API (REST + WebSocket)","assignee":"","due":"","est_days":"2.0","parent":"","priority":"High","project":"Humara Token Project","status":"Not Started","tags":"Phase 0, Backend"},{"id":21,"name":"Build user-facing points dashboard (React / React Native)","assignee":"","due":"","est_days":"4.0","parent":"","priority":"High","project":"Humara Token Project","status":"Not Started","tags":"Phase 0, Frontend"},{"id":22,"name":"Write TRAVEL ERC-20 smart contract","assignee":"","due":"","est_days":"5.0","parent":"","priority":"High","project":"Humara Token Project","status":"Not Started","tags":"Phase 0, Smart Contract"},{"id":23,"name":"Write Rewards Vault contract","assignee":"","due":"","est_days":"3.0","parent":"","priority":"High","project":"Humara Token Project","status":"Not Started","tags":"Phase 0, Smart Contract"},{"id":24,"name":"Write Lock Vault contract (tiered lock-ups)","assignee":"","due":"","est_days":"4.0","parent":"","priority":"High","project":"Humara Token Project","status":"Not Started","tags":"Phase 0, Smart Contract"},{"id":25,"name":"Write Airdrop distribution contract (Merkle-tree)","assignee":"","due":"","est_days":"3.0","parent":"","priority":"High","project":"Humara Token Project","status":"Not Started","tags":"Phase 0, Smart Contract"},{"id":26,"name":"Implement Buyback Executor (cron, USDC→TRAVEL on Aerodrome)","assignee":"","due":"","est_days":"4.0","parent":"","priority":"High","project":"Humara Token Project","status":"Not Started","tags":"Phase 0, Backend"},{"id":27,"name":"Internal audit (slither / mythril / echidna fuzzing)","assignee":"","due":"","est_days":"3.0","parent":"","priority":"High","project":"Humara Token Project","status":"Not Started","tags":"Phase 0, Security"},{"id":28,"name":"External audit loop (Certik + SpyWolf/SolidProof/Hacken)","assignee":"","due":"","est_days":"6.0","parent":"","priority":"High","project":"Humara Token Project","status":"Not Started","tags":"Phase 0, Security"},{"id":29,"name":"Build Admin Console (multisig-gated ops UI)","assignee":"","due":"","est_days":"4.0","parent":"","priority":"Medium","project":"Humara Token Project","status":"Not Started","tags":"Phase 0, Frontend"},{"id":30,"name":"Build snapshot tooling (Merkle root + proofs)","assignee":"","due":"","est_days":"3.0","parent":"","priority":"High","project":"Humara Token Project","status":"Not Started","tags":"Phase 0, Backend"},{"id":31,"name":"Token-holder role middleware (read tier from chain)","assignee":"","due":"","est_days":"2.0","parent":"","priority":"High","project":"Humara Token Project","status":"Not Started","tags":"Phase 0, Backend"},{"id":32,"name":"Deploy TRAVEL + Rewards Vault + Lock Vault + Airdrop to Base mainnet","assignee":"","due":"","est_days":"2.0","parent":"","priority":"High","project":"Humara Token Project","status":"Not Started","tags":"Phase 1, Smart Contract, TGE"},{"id":33,"name":"Seed liquidity pools (Aerodrome + Uniswap V3)","assignee":"","due":"","est_days":"1.0","parent":"","priority":"High","project":"Humara Token Project","status":"Not Started","tags":"Phase 1, TGE"},{"id":34,"name":"Lock LP tokens (Unicrypt / Team Finance)","assignee":"","due":"","est_days":"1.0","parent":"","priority":"High","project":"Humara Token Project","status":"Not Started","tags":"Phase 1, TGE"},{"id":35,"name":"Publish Merkle root and open airdrop claim window (30 days)","assignee":"","due":"","est_days":"2.0","parent":"","priority":"High","project":"Humara Token Project","status":"Not Started","tags":"Phase 1, TGE"},{"id":36,"name":"CEX listing technical integration packs (MEXC / Gate / Bitget)","assignee":"","due":"","est_days":"3.0","parent":"","priority":"Medium","project":"Humara Token Project","status":"Not Started","tags":"Phase 1, Integration"},{"id":37,"name":"TGE runbook + dry-run + on-call rota","assignee":"","due":"","est_days":"1.0","parent":"","priority":"High","project":"Humara Token Project","status":"Not Started","tags":"Phase 1, Ops"},{"id":38,"name":"Automate monthly buyback cron","assignee":"","due":"","est_days":"3.0","parent":"","priority":"High","project":"Humara Token Project","status":"Not Started","tags":"Phase 2, Backend, Flywheel"},{"id":39,"name":"Implement tier-cashback engine (pay cashback in TRAVEL)","assignee":"","due":"","est_days":"4.0","parent":"","priority":"High","project":"Humara Token Project","status":"Not Started","tags":"Phase 2, Backend, Flywheel"},{"id":40,"name":"Implement AVA-payment discount (+3% off if paid in TRAVEL)","assignee":"","due":"","est_days":"2.0","parent":"","priority":"High","project":"Humara Token Project","status":"Not Started","tags":"Phase 2, Backend, Frontend"},{"id":41,"name":"Governance voting contract and front-end","assignee":"","due":"","est_days":"5.0","parent":"","priority":"Medium","project":"Humara Token Project","status":"Not Started","tags":"Phase 2, Smart Contract, Frontend"},{"id":42,"name":"Partner-project airdrop receiver","assignee":"","due":"","est_days":"3.0","parent":"","priority":"Low","project":"Humara Token Project","status":"Not Started","tags":"Phase 2, Backend"},{"id":43,"name":"Alerting and observability dashboards (Grafana / PagerDuty / Tenderly)","assignee":"","due":"","est_days":"2.0","parent":"","priority":"High","project":"Humara Token Project","status":"Not Started","tags":"Phase 2, Ops"},{"id":44,"name":"Multi-chain bridge (LayerZero OFT to BNB + Solana)","assignee":"","due":"","est_days":"8.0","parent":"","priority":"Medium","project":"Humara Token Project","status":"Not Started","tags":"Phase 3, Smart Contract, Integration"},{"id":45,"name":"Flight-purchase-in-TRAVEL rail (OTC hedge < 60s)","assignee":"","due":"","est_days":"6.0","parent":"","priority":"High","project":"Humara Token Project","status":"Not Started","tags":"Phase 3, Backend"},{"id":46,"name":"Travel Tiger NFT contract (ERC-721, 2222 supply)","assignee":"","due":"","est_days":"3.0","parent":"","priority":"Low","project":"Humara Token Project","status":"Not Started","tags":"Phase 3, Smart Contract"},{"id":47,"name":"Additional CEX integrations (Coinbase / Kraken)","assignee":"","due":"","est_days":"3.0","parent":"","priority":"Low","project":"Humara Token Project","status":"Not Started","tags":"Phase 3, Integration"},{"id":48,"name":"Server Start-up & Initialization","assignee":"","due":"","est_days":"1.0","parent":"","priority":"Medium","project":"Python Server Dev","status":"Not Started","tags":"Phase 0, Backend, Server-Dev"},{"id":49,"name":"Obtain server JWT token to call IATI API directly","assignee":"","due":"","est_days":"","parent":"Server Start-up & Initialization","priority":"","project":"Python Server Dev","status":"Not Started","tags":"Phase 0, Backend"},{"id":51,"name":"User registration & login","assignee":"","due":"","est_days":"4.0","parent":"","priority":"","project":"Python Server Dev","status":"Not Started","tags":"Phase 0, Backend"},{"id":56,"name":"Alchemy web hook implementation (On TI Wallet activity)","assignee":"","due":"","est_days":"4.0","parent":"","priority":"High","project":"Python Server Dev","status":"Not Started","tags":"Phase 0, Backend, Integration"},{"id":59,"name":"Asynchronous pre-booking (for OTC calls)","assignee":"","due":"","est_days":"4.0","parent":"","priority":"","project":"Python Server Dev","status":"Not Started","tags":"Phase 0, Backend"},{"id":62,"name":"Swapin web hook implementation (On FIAT deposited)","assignee":"","due":"","est_days":"3.0","parent":"","priority":"","project":"Python Server Dev","status":"Not Started","tags":"Phase 0, Backend, Integration"},{"id":64,"name":"Implement the integration with IATI APIs","assignee":"","due":"","est_days":"16.0","parent":"","priority":"","project":"Python Server Dev","status":"Not Started","tags":"Phase 0, Backend, Integration"},{"id":69,"name":"Integration with REACT Front-end App","assignee":"","due":"","est_days":"3.0","parent":"","priority":"","project":"Python Server Dev","status":"Not Started","tags":"Phase 0, Frontend, Integration"},{"id":70,"name":"Database Design and setup","assignee":"","due":"","est_days":"2.0","parent":"","priority":"","project":"Python Server Dev","status":"Not Started","tags":"Phase 0, Backend"},{"id":71,"name":"Deploy and test complete server in AWS","assignee":"","due":"","est_days":"4.0","parent":"","priority":"","project":"Python Server Dev","status":"Not Started","tags":"Phase 0, Backend, DevOps"},{"id":73,"name":"Server shutdown process","assignee":"","due":"","est_days":"1.0","parent":"","priority":"","project":"Python Server Dev","status":"Not Started","tags":"Phase 0, Backend, DevOps"},{"id":83,"name":"Handle all failure/Error scenarios","assignee":"","due":"","est_days":"2.0","parent":"","priority":"","project":"Python Server Dev","status":"Not Started","tags":"Phase 0, Backend, QA"},{"id":85,"name":"End to end testing (REACT to python server)","assignee":"","due":"","est_days":"2.0","parent":"","priority":"","project":"Python Server Dev","status":"Not Started","tags":"Phase 0, QA"}];

const TEAM = ["Benedict Ibe","Steven","Unassigned"];
const PHASES = ["Phase 0","Phase 1","Phase 2","Phase 3"];
const WORKSTREAMS = ["Backend","Frontend","Smart Contract","Integration","Security","Ops","QA","DevOps","Research","Flywheel","TGE","Server-Dev"];
const STATUSES = ["Not Started","In Progress","In Review","Done","Blocked"];
const PRIORITIES = ["High","Medium","Low"];

const PHASE_COLORS = {"Phase 0":"#6366f1","Phase 1":"#f59e0b","Phase 2":"#10b981","Phase 3":"#ec4899"};
const STATUS_COLORS = {"Not Started":"#64748b","In Progress":"#3b82f6","In Review":"#a855f7","Done":"#22c55e","Blocked":"#ef4444"};
const PRIORITY_COLORS = {"High":"#ef4444","Medium":"#f59e0b","Low":"#6b7280"};

const WORKSTREAM_ICONS = {Backend:Cpu,Frontend:Globe,["Smart Contract"]:ShieldCheck,Integration:Zap,Security:ShieldCheck,Ops:Settings,QA:TestTube,DevOps:Rocket,Research:Search,Flywheel:RefreshCw,TGE:Rocket,["Server-Dev"]:Code2};

// ─── MOCK GITHUB DATA ──────────────────────────────────────────────────────
const GITHUB_REPOS = [
  {name:"humara-contracts",desc:"TRAVEL ERC-20, Rewards Vault, Lock Vault, Airdrop — Solidity + Hardhat",lang:"Solidity",stars:2,branch:"main",lastCommit:"feat: add pausable + role-gated mint to TRAVEL.sol",commitTime:"2h ago",prs:3,issues:5,buildStatus:"passing"},
  {name:"humara-server",desc:"Python FastAPI — IATI integration, crypto swap, OTC settlement, booking lifecycle",lang:"Python",stars:1,branch:"develop",lastCommit:"fix: websocket notify on USDC deposit complete",commitTime:"5h ago",prs:2,issues:8,buildStatus:"failing"},
  {name:"humara-web",desc:"React / Next.js — booking flow, points dashboard, admin console",lang:"TypeScript",stars:1,branch:"main",lastCommit:"feat: points dashboard skeleton + tier badge component",commitTime:"1d ago",prs:1,issues:4,buildStatus:"passing"},
  {name:"humara-mobile",desc:"React Native — iOS + Android travel booking app",lang:"TypeScript",stars:0,branch:"main",lastCommit:"chore: update RN to 0.74, fix iOS build",commitTime:"3d ago",prs:0,issues:2,buildStatus:"passing"},
];

const GITHUB_ACTIVITY = [
  {type:"commit",repo:"humara-contracts",msg:"feat: add pausable + role-gated mint to TRAVEL.sol",author:"Steven",time:"2h ago",sha:"a3f9c12"},
  {type:"pr",repo:"humara-contracts",msg:"PR #14: Rewards Vault reentrancy guard + access control",author:"Steven",time:"4h ago",status:"open"},
  {type:"commit",repo:"humara-server",msg:"fix: websocket notify on USDC deposit complete",author:"Benedict Ibe",time:"5h ago",sha:"e7b2d45"},
  {type:"pr",repo:"humara-server",msg:"PR #27: Alchemy webhook — swap-to-USDC flow",author:"Benedict Ibe",time:"8h ago",status:"review"},
  {type:"issue",repo:"humara-server",msg:"#42: OTC quote API timeout on high-latency networks",author:"Steven",time:"1d ago",status:"open"},
  {type:"commit",repo:"humara-web",msg:"feat: points dashboard skeleton + tier badge component",author:"Benedict Ibe",time:"1d ago",sha:"c1d8f90"},
  {type:"pr",repo:"humara-contracts",msg:"PR #12: Lock Vault tiered lock-up logic",author:"Steven",time:"2d ago",status:"merged"},
];

// ─── STYLES ─────────────────────────────────────────────────────────────────
const font = "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace";
const fontSans = "'DM Sans', 'Segoe UI', sans-serif";

const S = {
  root: {fontFamily:fontSans,background:"#0a0b0f",color:"#e2e8f0",minHeight:"100vh",position:"relative",overflow:"hidden"},
  gridBg: {position:"fixed",inset:0,backgroundImage:"radial-gradient(circle at 1px 1px, rgba(99,102,241,0.08) 1px, transparent 0)",backgroundSize:"32px 32px",pointerEvents:"none",zIndex:0},
  noise: {position:"fixed",inset:0,opacity:0.03,backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",pointerEvents:"none",zIndex:0},
  content: {position:"relative",zIndex:1,maxWidth:1440,margin:"0 auto",padding:"0 24px 48px"},
  header: {display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 0",borderBottom:"1px solid rgba(99,102,241,0.15)"},
  logo: {display:"flex",alignItems:"center",gap:12},
  logoIcon: {width:40,height:40,borderRadius:10,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,color:"#fff",fontFamily:font,boxShadow:"0 0 24px rgba(99,102,241,0.4)"},
  logoText: {fontSize:20,fontWeight:700,letterSpacing:"-0.5px",background:"linear-gradient(135deg,#c7d2fe,#818cf8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"},
  logoSub: {fontSize:11,color:"#64748b",fontFamily:font,letterSpacing:"2px",textTransform:"uppercase",marginTop:2},
  headerRight: {display:"flex",alignItems:"center",gap:16},
  bellBtn: {width:40,height:40,borderRadius:10,border:"1px solid rgba(99,102,241,0.2)",background:"rgba(99,102,241,0.06)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",position:"relative",color:"#818cf8",transition:"all 0.2s"},
  bellDot: {position:"absolute",top:8,right:8,width:8,height:8,borderRadius:"50%",background:"#ef4444",border:"2px solid #0a0b0f"},
  avatar: {width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#6366f1,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#fff",cursor:"pointer"},
  tabs: {display:"flex",gap:4,padding:"16px 0",overflowX:"auto"},
  tab: (active) => ({padding:"10px 20px",borderRadius:10,border:`1px solid ${active ? "rgba(99,102,241,0.4)" : "transparent"}`,background:active ? "rgba(99,102,241,0.12)" : "transparent",color:active ? "#a5b4fc" : "#64748b",fontSize:13,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:8,transition:"all 0.2s",whiteSpace:"nowrap",fontFamily:fontSans}),
  tabBadge: (color) => ({fontSize:10,padding:"2px 7px",borderRadius:6,background:color||"rgba(99,102,241,0.2)",color:"#fff",fontWeight:700,fontFamily:font}),
  card: {background:"rgba(15,17,24,0.8)",border:"1px solid rgba(99,102,241,0.1)",borderRadius:14,padding:20,backdropFilter:"blur(12px)"},
  cardHeader: {display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16},
  cardTitle: {fontSize:15,fontWeight:700,color:"#c7d2fe",display:"flex",alignItems:"center",gap:8},
  grid2: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:16},
  grid3: {display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16},
  statCard: (color) => ({background:`linear-gradient(135deg, ${color}15, ${color}08)`,border:`1px solid ${color}25`,borderRadius:12,padding:"16px 20px"}),
  statValue: {fontSize:28,fontWeight:800,fontFamily:font,letterSpacing:"-1px"},
  statLabel: {fontSize:11,color:"#94a3b8",marginTop:4,fontFamily:font,textTransform:"uppercase",letterSpacing:"1px"},
  pill: (bg,fg) => ({display:"inline-flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:20,background:bg,color:fg,fontSize:11,fontWeight:600,fontFamily:font,whiteSpace:"nowrap"}),
  input: {width:"100%",padding:"10px 14px",borderRadius:10,border:"1px solid rgba(99,102,241,0.2)",background:"rgba(99,102,241,0.06)",color:"#e2e8f0",fontSize:13,fontFamily:fontSans,outline:"none"},
  textarea: {width:"100%",padding:"12px 14px",borderRadius:10,border:"1px solid rgba(99,102,241,0.2)",background:"rgba(99,102,241,0.06)",color:"#e2e8f0",fontSize:13,fontFamily:fontSans,outline:"none",resize:"vertical",minHeight:80},
  select: {padding:"8px 12px",borderRadius:8,border:"1px solid rgba(99,102,241,0.2)",background:"rgba(15,17,24,0.9)",color:"#e2e8f0",fontSize:12,fontFamily:fontSans,outline:"none",cursor:"pointer"},
  btn: (primary) => ({padding:"10px 20px",borderRadius:10,border:primary ? "none" : "1px solid rgba(99,102,241,0.3)",background:primary ? "linear-gradient(135deg,#6366f1,#7c3aed)" : "transparent",color:primary ? "#fff" : "#a5b4fc",fontSize:13,fontWeight:600,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6,transition:"all 0.2s",fontFamily:fontSans}),
  btnSm: (primary) => ({padding:"6px 14px",borderRadius:8,border:primary ? "none" : "1px solid rgba(99,102,241,0.2)",background:primary ? "rgba(99,102,241,0.8)" : "rgba(99,102,241,0.08)",color:primary ? "#fff" : "#a5b4fc",fontSize:11,fontWeight:600,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:4,fontFamily:font}),
  divider: {height:1,background:"rgba(99,102,241,0.1)",margin:"16px 0"},
  taskRow: (selected) => ({display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderRadius:10,background:selected ? "rgba(99,102,241,0.08)" : "transparent",border:`1px solid ${selected ? "rgba(99,102,241,0.2)" : "transparent"}`,cursor:"pointer",transition:"all 0.15s"}),
  empty: {textAlign:"center",padding:40,color:"#475569",fontSize:14},
  modalOverlay: {position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(8px)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center"},
  modal: {background:"#12141c",border:"1px solid rgba(99,102,241,0.2)",borderRadius:16,padding:28,width:"100%",maxWidth:560,maxHeight:"80vh",overflowY:"auto",position:"relative"},
  reminderCard: {background:"linear-gradient(135deg,rgba(245,158,11,0.08),rgba(239,68,68,0.05))",border:"1px solid rgba(245,158,11,0.2)",borderRadius:12,padding:16,marginBottom:12},
};

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function PhaseBadge({phase}) {
  const c = PHASE_COLORS[phase] || "#64748b";
  return <span style={S.pill(c+"20",c)}><Layers size={10}/> {phase}</span>;
}
function StatusBadge({status}) {
  const c = STATUS_COLORS[status] || "#64748b";
  return <span style={S.pill(c+"20",c)}>{status==="Done"?<CheckCircle2 size={10}/>:status==="Blocked"?<AlertTriangle size={10}/>:<Circle size={10}/>} {status}</span>;
}
function PriorityDot({p}) {
  const c = PRIORITY_COLORS[p]||"#475569";
  return <span style={{width:8,height:8,borderRadius:"50%",background:c,display:"inline-block",flexShrink:0}} title={p}/>;
}
function WorkstreamBadge({ws}) {
  const Icon = WORKSTREAM_ICONS[ws]||Tag;
  return <span style={{...S.pill("rgba(99,102,241,0.1)","#818cf8"),gap:3}}><Icon size={9}/>{ws}</span>;
}

function Modal({children, onClose}) {
  return <div style={S.modalOverlay} onClick={onClose}>
    <div style={S.modal} onClick={e=>e.stopPropagation()}>
      <button onClick={onClose} style={{position:"absolute",top:16,right:16,background:"none",border:"none",color:"#64748b",cursor:"pointer"}}><X size={18}/></button>
      {children}
    </div>
  </div>;
}

// ─── OVERVIEW TAB ────────────────────────────────────────────────────────────
function OverviewTab({tasks, setActiveTab}) {
  const phaseStats = PHASES.map(p => {
    const t = tasks.filter(x => x.tags.includes(p) && !x.parent);
    return {phase:p, total:t.length, done:t.filter(x=>x.status==="Done").length, inProgress:t.filter(x=>x.status==="In Progress").length, blocked:t.filter(x=>x.status==="Blocked").length, days:t.reduce((s,x)=>s+parseFloat(x.est_days||0),0)};
  });
  const total = tasks.filter(t=>!t.parent).length;
  const done = tasks.filter(t=>t.status==="Done"&&!t.parent).length;
  const inProg = tasks.filter(t=>t.status==="In Progress"&&!t.parent).length;
  const blocked = tasks.filter(t=>t.status==="Blocked"&&!t.parent).length;
  const totalDays = tasks.filter(t=>!t.parent).reduce((s,x)=>s+parseFloat(x.est_days||0),0);
  const highPri = tasks.filter(t=>t.priority==="High"&&!t.parent).length;

  return <div>
    <div style={{...S.grid3,marginBottom:20}}>
      {[
        {label:"TOTAL TASKS",value:total,color:"#6366f1"},
        {label:"ESTIMATED DAYS",value:Math.round(totalDays),color:"#8b5cf6"},
        {label:"HIGH PRIORITY",value:highPri,color:"#ef4444"},
      ].map((s,i)=><div key={i} style={S.statCard(s.color)}>
        <div style={{...S.statValue,color:s.color}}>{s.value}</div>
        <div style={S.statLabel}>{s.label}</div>
      </div>)}
    </div>
    <div style={{...S.grid2,marginBottom:20}}>
      {[
        {label:"IN PROGRESS",value:inProg,color:"#3b82f6"},
        {label:"BLOCKED",value:blocked,color:"#ef4444"},
        {label:"NOT STARTED",value:total-done-inProg-blocked,color:"#64748b"},
        {label:"COMPLETED",value:done,color:"#22c55e"},
      ].map((s,i)=><div key={i} style={{...S.statCard(s.color),padding:"12px 16px"}}>
        <div style={{...S.statValue,fontSize:22,color:s.color}}>{s.value}</div>
        <div style={S.statLabel}>{s.label}</div>
      </div>)}
    </div>

    <div style={S.card}>
      <div style={S.cardHeader}>
        <div style={S.cardTitle}><BarChart3 size={16} color="#818cf8"/> Phase Progress</div>
      </div>
      {phaseStats.map((p,i)=>{
        const pct = p.total>0?Math.round(p.done/p.total*100):0;
        return <div key={i} style={{marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <PhaseBadge phase={p.phase}/>
              <span style={{fontSize:12,color:"#94a3b8",fontFamily:font}}>{p.done}/{p.total} tasks</span>
            </div>
            <span style={{fontSize:12,fontFamily:font,color:PHASE_COLORS[p.phase]}}>{p.days}d est.</span>
          </div>
          <div style={{height:6,borderRadius:3,background:"rgba(99,102,241,0.1)",overflow:"hidden"}}>
            <div style={{height:"100%",width:`${pct}%`,borderRadius:3,background:`linear-gradient(90deg,${PHASE_COLORS[p.phase]},${PHASE_COLORS[p.phase]}aa)`,transition:"width 0.5s"}}/>
          </div>
        </div>;
      })}
    </div>

    <div style={{...S.card,marginTop:16}}>
      <div style={S.cardHeader}>
        <div style={S.cardTitle}><Zap size={16} color="#f59e0b"/> Quick Actions</div>
      </div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
        {[
          {label:"View Task Board",icon:Layers,tab:"tasks"},
          {label:"GitHub Activity",icon:GitBranch,tab:"github"},
          {label:"Create Request",icon:Plus,tab:"requests"},
          {label:"View Reminders",icon:Bell,tab:"reminders"},
        ].map((a,i)=><button key={i} style={S.btn(false)} onClick={()=>setActiveTab(a.tab)}><a.icon size={14}/>{a.label}</button>)}
      </div>
    </div>
  </div>;
}

// ─── TASKS TAB ───────────────────────────────────────────────────────────────
function TasksTab({tasks, setTasks}) {
  const [filterPhase, setFilterPhase] = useState("All");
  const [filterWs, setFilterWs] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterProject, setFilterProject] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(null);

  const filtered = useMemo(()=>{
    return tasks.filter(t => {
      if(t.parent) return false;
      if(filterPhase!=="All" && !t.tags.includes(filterPhase)) return false;
      if(filterWs!=="All" && !t.tags.includes(filterWs)) return false;
      if(filterStatus!=="All" && t.status!==filterStatus) return false;
      if(filterProject!=="All" && t.project!==filterProject) return false;
      if(search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  },[tasks,filterPhase,filterWs,filterStatus,filterProject,search]);

  const updateTask = (id, field, value) => {
    setTasks(prev => prev.map(t => t.id===id ? {...t,[field]:value} : t));
  };

  return <div>
    <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
      <div style={{position:"relative",flex:"1 1 200px"}}>
        <Search size={14} style={{position:"absolute",left:12,top:12,color:"#64748b"}}/>
        <input style={{...S.input,paddingLeft:34}} placeholder="Search tasks..." value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>
      <select style={S.select} value={filterProject} onChange={e=>setFilterProject(e.target.value)}>
        <option value="All">All Projects</option>
        <option>Humara Token Project</option>
        <option>Python Server Dev</option>
      </select>
      <select style={S.select} value={filterPhase} onChange={e=>setFilterPhase(e.target.value)}>
        <option value="All">All Phases</option>
        {PHASES.map(p=><option key={p}>{p}</option>)}
      </select>
      <select style={S.select} value={filterWs} onChange={e=>setFilterWs(e.target.value)}>
        <option value="All">All Workstreams</option>
        {WORKSTREAMS.map(w=><option key={w}>{w}</option>)}
      </select>
      <select style={S.select} value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
        <option value="All">All Statuses</option>
        {STATUSES.map(s=><option key={s}>{s}</option>)}
      </select>
    </div>

    <div style={{fontSize:12,color:"#64748b",marginBottom:12,fontFamily:font}}>{filtered.length} tasks</div>

    <div style={S.card}>
      {filtered.length===0 && <div style={S.empty}>No tasks match your filters</div>}
      {filtered.map((t,i) => {
        const phase = PHASES.find(p=>t.tags.includes(p));
        const ws = WORKSTREAMS.filter(w=>t.tags.includes(w));
        const subtasks = tasks.filter(s=>s.parent===t.name);
        const isSelected = selectedTask===t.id;
        return <div key={t.id}>
          <div style={S.taskRow(isSelected)} onClick={()=>setSelectedTask(isSelected?null:t.id)}>
            <div style={{display:"flex",alignItems:"center",gap:6,minWidth:0,flex:1}}>
              {isSelected ? <ChevronDown size={14} color="#818cf8"/> : <ChevronRight size={14} color="#475569"/>}
              <PriorityDot p={t.priority}/>
              <span style={{fontSize:13,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.name}</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
              {phase && <PhaseBadge phase={phase}/>}
              <StatusBadge status={t.status}/>
              {t.est_days && <span style={{fontSize:11,color:"#64748b",fontFamily:font}}>{t.est_days}d</span>}
            </div>
          </div>

          {isSelected && <div style={{padding:"8px 16px 16px 40px",borderBottom:"1px solid rgba(99,102,241,0.06)"}}>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
              {ws.map(w=><WorkstreamBadge key={w} ws={w}/>)}
              <span style={{fontSize:11,color:"#475569",fontFamily:font}}>Project: {t.project}</span>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:12,flexWrap:"wrap"}}>
              <span style={{fontSize:11,color:"#94a3b8"}}>Status:</span>
              <select style={{...S.select,fontSize:11,padding:"4px 8px"}} value={t.status} onChange={e=>updateTask(t.id,"status",e.target.value)}>
                {STATUSES.map(s=><option key={s}>{s}</option>)}
              </select>
              <span style={{fontSize:11,color:"#94a3b8",marginLeft:8}}>Assignee:</span>
              <select style={{...S.select,fontSize:11,padding:"4px 8px"}} value={t.assignee||"Unassigned"} onChange={e=>updateTask(t.id,"assignee",e.target.value)}>
                {TEAM.map(m=><option key={m}>{m}</option>)}
              </select>
              <span style={{fontSize:11,color:"#94a3b8",marginLeft:8}}>Priority:</span>
              <select style={{...S.select,fontSize:11,padding:"4px 8px"}} value={t.priority||"Medium"} onChange={e=>updateTask(t.id,"priority",e.target.value)}>
                {PRIORITIES.map(p=><option key={p}>{p}</option>)}
              </select>
            </div>
            {subtasks.length>0 && <div>
              <div style={{fontSize:11,color:"#64748b",marginBottom:6,fontFamily:font}}>SUB-TASKS ({subtasks.length})</div>
              {subtasks.map(st=><div key={st.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderTop:"1px solid rgba(99,102,241,0.05)"}}>
                <Circle size={10} color={STATUS_COLORS[st.status]}/>
                <span style={{fontSize:12,flex:1}}>{st.name}</span>
                <select style={{...S.select,fontSize:10,padding:"2px 6px"}} value={st.status} onChange={e=>updateTask(st.id,"status",e.target.value)}>
                  {STATUSES.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>)}
            </div>}
          </div>}
          {i<filtered.length-1 && <div style={{height:1,background:"rgba(99,102,241,0.04)"}}/>}
        </div>;
      })}
    </div>
  </div>;
}

// ─── GITHUB TAB ──────────────────────────────────────────────────────────────
function GitHubTab() {
  const [activeRepo, setActiveRepo] = useState(null);
  return <div>
    <div style={{...S.grid2,marginBottom:20}}>
      {GITHUB_REPOS.map((r,i)=><div key={i} style={{...S.card,cursor:"pointer",border:activeRepo===i?"1px solid rgba(99,102,241,0.4)":S.card.border}} onClick={()=>setActiveRepo(activeRepo===i?null:i)}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:10}}>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:"#a5b4fc",display:"flex",alignItems:"center",gap:6}}><GitBranch size={14}/>{r.name}</div>
            <div style={{fontSize:11,color:"#64748b",marginTop:4}}>{r.desc}</div>
          </div>
          <span style={{...S.pill(r.buildStatus==="passing"?"rgba(34,197,94,0.15)":"rgba(239,68,68,0.15)",r.buildStatus==="passing"?"#22c55e":"#ef4444")}}>{r.buildStatus==="passing"?<CheckCircle2 size={9}/>:<AlertTriangle size={9}/>}{r.buildStatus}</span>
        </div>
        <div style={{display:"flex",gap:12,fontSize:11,color:"#94a3b8",fontFamily:font}}>
          <span style={{display:"flex",alignItems:"center",gap:4}}><Code2 size={10}/>{r.lang}</span>
          <span style={{display:"flex",alignItems:"center",gap:4}}><GitBranch size={10}/>{r.branch}</span>
          <span style={{display:"flex",alignItems:"center",gap:4}}><ArrowUpRight size={10}/>{r.prs} PRs</span>
          <span style={{display:"flex",alignItems:"center",gap:4}}><AlertTriangle size={10}/>{r.issues}</span>
        </div>
        <div style={{marginTop:10,fontSize:11,color:"#64748b"}}>
          <span style={{color:"#818cf8",fontFamily:font}}>{r.commitTime}</span> — {r.lastCommit}
        </div>
      </div>)}
    </div>

    <div style={S.card}>
      <div style={S.cardHeader}>
        <div style={S.cardTitle}><Clock size={16} color="#818cf8"/> Recent Activity</div>
      </div>
      {GITHUB_ACTIVITY.map((a,i)=><div key={i} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"10px 0",borderTop:i>0?"1px solid rgba(99,102,241,0.06)":"none"}}>
        <div style={{width:32,height:32,borderRadius:8,background:a.type==="commit"?"rgba(34,197,94,0.12)":a.type==="pr"?"rgba(168,85,247,0.12)":"rgba(239,68,68,0.12)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          {a.type==="commit"?<CheckCircle2 size={14} color="#22c55e"/>:a.type==="pr"?<GitBranch size={14} color="#a855f7"/>:<AlertTriangle size={14} color="#ef4444"/>}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:13,fontWeight:500}}>{a.msg}</div>
          <div style={{display:"flex",gap:8,marginTop:4,fontSize:11,color:"#64748b",fontFamily:font}}>
            <span>{a.repo}</span>
            <span>{a.author}</span>
            <span>{a.time}</span>
            {a.sha && <span style={{color:"#818cf8"}}>{a.sha}</span>}
            {a.status && <span style={{...S.pill(a.status==="merged"?"rgba(168,85,247,0.15)":"rgba(245,158,11,0.15)",a.status==="merged"?"#a855f7":"#f59e0b")}}>{a.status}</span>}
          </div>
        </div>
      </div>)}
    </div>

    <div style={{marginTop:16,padding:16,background:"rgba(99,102,241,0.04)",borderRadius:12,border:"1px dashed rgba(99,102,241,0.2)"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,color:"#818cf8",fontSize:13,fontWeight:600,marginBottom:8}}><Zap size={14}/> Connect GitHub</div>
      <p style={{fontSize:12,color:"#94a3b8",margin:0,lineHeight:1.6}}>
        Connect your GitHub account to enable live commit tracking, PR status updates, automated build version tagging, and push notifications to Slack channels. Click below to authenticate via GitHub OAuth.
      </p>
      <button style={{...S.btn(true),marginTop:12}}><GitBranch size={14}/> Connect GitHub <ExternalLink size={12}/></button>
    </div>
  </div>;
}

// ─── NOTION TAB ──────────────────────────────────────────────────────────────
function NotionTab({tasks}) {
  const [creatingDoc, setCreatingDoc] = useState(null);
  const docTemplates = [
    {phase:"Phase 0",title:"Pre-Launch Infrastructure Documentation",sections:["Points Program Schema","Smart Contract Architecture","Security Audit Reports","Admin Console Specs"]},
    {phase:"Phase 1",title:"TGE Launch Documentation",sections:["Deployment Runbook","Liquidity Pool Configuration","Airdrop Claim Window Specs","CEX Integration Packs"]},
    {phase:"Phase 2",title:"Flywheel Operations Handbook",sections:["Buyback Automation Cron Config","Cashback Engine Logic","AVA-Payment Discount Flow","Governance Voting Protocol"]},
    {phase:"Phase 3",title:"Expansion Playbook",sections:["Multi-Chain Bridge Architecture","Flight-in-TRAVEL Payment Rail","Travel Tiger NFT Spec","Tier-1 CEX Integration Guide"]},
  ];

  const taskDocs = useMemo(()=>{
    return tasks.filter(t=>!t.parent && (t.status==="In Progress"||t.status==="In Review")).slice(0,6);
  },[tasks]);

  return <div>
    <div style={{...S.grid2,marginBottom:20}}>
      {docTemplates.map((d,i)=>{
        const pc = PHASE_COLORS[d.phase];
        return <div key={i} style={{...S.card,borderColor:`${pc}25`}}>
          <PhaseBadge phase={d.phase}/>
          <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0",marginTop:10,marginBottom:6}}>{d.title}</div>
          <div style={{marginBottom:12}}>
            {d.sections.map((s,j)=><div key={j} style={{display:"flex",alignItems:"center",gap:6,padding:"4px 0",fontSize:12,color:"#94a3b8"}}>
              <FileText size={10} color={pc}/>{s}
            </div>)}
          </div>
          <button style={S.btnSm(true)} onClick={()=>setCreatingDoc(d)}><Plus size={12}/> Create in Notion</button>
        </div>;
      })}
    </div>

    {taskDocs.length>0 && <div style={S.card}>
      <div style={S.cardHeader}>
        <div style={S.cardTitle}><FileText size={16} color="#818cf8"/> Auto-Generate Task Documentation</div>
      </div>
      <p style={{fontSize:12,color:"#64748b",margin:"0 0 12px"}}>Create Notion pages automatically for active tasks with acceptance criteria, specs, and integration notes.</p>
      {taskDocs.map((t,i)=><div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderTop:"1px solid rgba(99,102,241,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <FileText size={12} color="#818cf8"/>
          <span style={{fontSize:13}}>{t.name}</span>
        </div>
        <button style={S.btnSm(false)}><Plus size={10}/> Generate Doc</button>
      </div>)}
    </div>}

    <div style={{marginTop:16,padding:16,background:"rgba(99,102,241,0.04)",borderRadius:12,border:"1px dashed rgba(99,102,241,0.2)"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,color:"#818cf8",fontSize:13,fontWeight:600,marginBottom:8}}><FileText size={14}/> Connect Notion</div>
      <p style={{fontSize:12,color:"#94a3b8",margin:0,lineHeight:1.6}}>
        Connect your Notion workspace to auto-create documentation pages, sync task status bi-directionally with your Notion Projects database, and generate milestone reports.
      </p>
      <button style={{...S.btn(true),marginTop:12}}><FileText size={14}/> Connect Notion <ExternalLink size={12}/></button>
    </div>

    {creatingDoc && <Modal onClose={()=>setCreatingDoc(null)}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
        <FileText size={20} color="#818cf8"/>
        <span style={{fontSize:16,fontWeight:700}}>Create Notion Document</span>
      </div>
      <PhaseBadge phase={creatingDoc.phase}/>
      <div style={{fontSize:15,fontWeight:600,margin:"12px 0 8px"}}>{creatingDoc.title}</div>
      <p style={{fontSize:12,color:"#94a3b8",marginBottom:16}}>This will create a structured Notion page with the following sections:</p>
      {creatingDoc.sections.map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",fontSize:13,color:"#c7d2fe"}}><CheckCircle2 size={12} color="#22c55e"/>{s}</div>)}
      <div style={{display:"flex",gap:8,marginTop:20}}>
        <button style={S.btn(true)} onClick={()=>setCreatingDoc(null)}><Rocket size={14}/> Create Page</button>
        <button style={S.btn(false)} onClick={()=>setCreatingDoc(null)}>Cancel</button>
      </div>
    </Modal>}
  </div>;
}

// ─── SLACK TAB ───────────────────────────────────────────────────────────────
function SlackTab() {
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [message, setMessage] = useState("");
  const [sentMessages, setSentMessages] = useState([]);

  const channels = [
    {name:"#humara-backend",desc:"Backend team — server, APIs, booking flow",members:4,color:"#3b82f6"},
    {name:"#humara-contracts",desc:"Smart contract development & audits",members:3,color:"#a855f7"},
    {name:"#humara-frontend",desc:"React/React Native UI development",members:3,color:"#22c55e"},
    {name:"#humara-devops",desc:"Deployments, AWS, CI/CD pipelines",members:2,color:"#f59e0b"},
    {name:"#humara-general",desc:"General team communication",members:6,color:"#6366f1"},
    {name:"#humara-alerts",desc:"Automated alerts — build failures, deployments",members:6,color:"#ef4444"},
  ];

  const handleSend = () => {
    if(!message.trim() || !selectedChannel) return;
    setSentMessages(prev=>[{channel:selectedChannel,msg:message,time:"Just now"},...prev]);
    setMessage("");
  };

  return <div>
    <div style={{...S.grid3,marginBottom:20}}>
      {channels.map((c,i)=><div key={i} style={{...S.card,cursor:"pointer",border:selectedChannel===c.name?`1px solid ${c.color}40`:S.card.border,background:selectedChannel===c.name?`${c.color}08`:"rgba(15,17,24,0.8)"}} onClick={()=>setSelectedChannel(c.name)}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
          <Hash size={14} color={c.color}/>
          <span style={{fontSize:13,fontWeight:700,color:c.color}}>{c.name}</span>
        </div>
        <div style={{fontSize:11,color:"#64748b",marginBottom:8}}>{c.desc}</div>
        <div style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:"#475569"}}><Users size={10}/>{c.members} members</div>
      </div>)}
    </div>

    {selectedChannel && <div style={S.card}>
      <div style={S.cardHeader}>
        <div style={S.cardTitle}><Send size={16} color="#818cf8"/> Send to {selectedChannel}</div>
      </div>
      <textarea style={S.textarea} placeholder={`Message ${selectedChannel}...`} value={message} onChange={e=>setMessage(e.target.value)}/>
      <div style={{display:"flex",justifyContent:"flex-end",marginTop:10}}>
        <button style={S.btn(true)} onClick={handleSend}><Send size={14}/> Send Message</button>
      </div>
    </div>}

    {sentMessages.length>0 && <div style={{...S.card,marginTop:16}}>
      <div style={S.cardHeader}>
        <div style={S.cardTitle}><CheckCircle2 size={16} color="#22c55e"/> Sent Messages</div>
      </div>
      {sentMessages.map((m,i)=><div key={i} style={{padding:"8px 0",borderTop:i>0?"1px solid rgba(99,102,241,0.06)":"none",display:"flex",gap:10,alignItems:"flex-start"}}>
        <Hash size={12} color="#818cf8" style={{marginTop:3}}/>
        <div>
          <div style={{fontSize:11,fontWeight:600,color:"#818cf8"}}>{m.channel} <span style={{color:"#475569",fontWeight:400}}>· {m.time}</span></div>
          <div style={{fontSize:13,marginTop:2}}>{m.msg}</div>
        </div>
      </div>)}
    </div>}

    <div style={{marginTop:16,padding:16,background:"rgba(99,102,241,0.04)",borderRadius:12,border:"1px dashed rgba(99,102,241,0.2)"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,color:"#818cf8",fontSize:13,fontWeight:600,marginBottom:8}}><MessageSquare size={14}/> Connect Slack</div>
      <p style={{fontSize:12,color:"#94a3b8",margin:0,lineHeight:1.6}}>
        Connect your Slack workspace for automated notifications — build status alerts, task assignment pings, deadline reminders, and daily standup summaries pushed to the right channels.
      </p>
      <button style={{...S.btn(true),marginTop:12}}><MessageSquare size={14}/> Connect Slack <ExternalLink size={12}/></button>
    </div>
  </div>;
}

// ─── REQUESTS TAB ────────────────────────────────────────────────────────────
function RequestsTab({tasks}) {
  const [requests, setRequests] = useState([
    {id:1,from:"Benedict Ibe",to:"Steven",title:"Review RewardsVault reentrancy guard implementation","desc":"Need a code review on the reentrancy guard pattern used in RewardsVault.sol before we move to internal audit.","priority":"High",status:"Open",created:"2h ago",linkedTask:"Write Rewards Vault contract"},
    {id:2,from:"Steven",to:"Benedict Ibe",title:"Confirm Alchemy webhook endpoint URL","desc":"Which endpoint should the Alchemy webhook POST to? Need the exact route path for TI wallet activity monitoring.","priority":"Medium",status:"Open",created:"5h ago",linkedTask:"Alchemy web hook implementation (On TI Wallet activity)"},
  ]);
  const [showNew, setShowNew] = useState(false);
  const [newReq, setNewReq] = useState({from:"Benedict Ibe",to:"Steven",title:"",desc:"",priority:"Medium",linkedTask:""});

  const handleCreate = () => {
    if(!newReq.title.trim()) return;
    setRequests(prev=>[{...newReq,id:Date.now(),status:"Open",created:"Just now"},...prev]);
    setNewReq({from:"Benedict Ibe",to:"Steven",title:"",desc:"",priority:"Medium",linkedTask:""});
    setShowNew(false);
  };

  return <div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
      <div style={{fontSize:12,color:"#64748b",fontFamily:font}}>{requests.length} active requests</div>
      <button style={S.btn(true)} onClick={()=>setShowNew(true)}><Plus size={14}/> New Request</button>
    </div>

    {requests.map((r,i)=><div key={r.id} style={{...S.card,marginBottom:12,borderLeft:`3px solid ${PRIORITY_COLORS[r.priority]}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
        <div>
          <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>{r.title}</div>
          <div style={{display:"flex",gap:8,alignItems:"center",fontSize:11,color:"#64748b",fontFamily:font}}>
            <span>{r.from}</span><ArrowRight size={10}/><span>{r.to}</span>
            <span>· {r.created}</span>
          </div>
        </div>
        <div style={{display:"flex",gap:6}}>
          <span style={S.pill(PRIORITY_COLORS[r.priority]+"20",PRIORITY_COLORS[r.priority])}>{r.priority}</span>
          <span style={S.pill(r.status==="Open"?"rgba(59,130,246,0.15)":"rgba(34,197,94,0.15)",r.status==="Open"?"#3b82f6":"#22c55e")}>{r.status}</span>
        </div>
      </div>
      <p style={{fontSize:13,color:"#94a3b8",margin:"0 0 10px",lineHeight:1.6}}>{r.desc}</p>
      {r.linkedTask && <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:"#818cf8"}}>
        <Layers size={10}/> Linked: {r.linkedTask}
      </div>}
      <div style={{display:"flex",gap:8,marginTop:12}}>
        <button style={S.btnSm(false)} onClick={()=>setRequests(prev=>prev.map(x=>x.id===r.id?{...x,status:x.status==="Open"?"Resolved":"Open"}:x))}>
          {r.status==="Open"?<><CheckCircle2 size={10}/> Resolve</>:<><RefreshCw size={10}/> Reopen</>}
        </button>
        <button style={S.btnSm(false)} onClick={()=>setRequests(prev=>prev.filter(x=>x.id!==r.id))}><X size={10}/> Remove</button>
      </div>
    </div>)}

    {showNew && <Modal onClose={()=>setShowNew(false)}>
      <div style={{fontSize:16,fontWeight:700,marginBottom:16,display:"flex",alignItems:"center",gap:8}}><Plus size={18} color="#818cf8"/>New Request</div>
      <div style={{marginBottom:12}}>
        <label style={{fontSize:11,color:"#94a3b8",display:"block",marginBottom:4,fontFamily:font}}>TITLE</label>
        <input style={S.input} value={newReq.title} onChange={e=>setNewReq({...newReq,title:e.target.value})} placeholder="What do you need?"/>
      </div>
      <div style={{marginBottom:12}}>
        <label style={{fontSize:11,color:"#94a3b8",display:"block",marginBottom:4,fontFamily:font}}>DESCRIPTION</label>
        <textarea style={S.textarea} value={newReq.desc} onChange={e=>setNewReq({...newReq,desc:e.target.value})} placeholder="Provide context..."/>
      </div>
      <div style={{display:"flex",gap:12,marginBottom:12}}>
        <div style={{flex:1}}>
          <label style={{fontSize:11,color:"#94a3b8",display:"block",marginBottom:4,fontFamily:font}}>FROM</label>
          <select style={{...S.select,width:"100%"}} value={newReq.from} onChange={e=>setNewReq({...newReq,from:e.target.value})}>
            {TEAM.filter(t=>t!=="Unassigned").map(t=><option key={t}>{t}</option>)}
          </select>
        </div>
        <div style={{flex:1}}>
          <label style={{fontSize:11,color:"#94a3b8",display:"block",marginBottom:4,fontFamily:font}}>TO</label>
          <select style={{...S.select,width:"100%"}} value={newReq.to} onChange={e=>setNewReq({...newReq,to:e.target.value})}>
            {TEAM.filter(t=>t!=="Unassigned").map(t=><option key={t}>{t}</option>)}
          </select>
        </div>
        <div style={{flex:1}}>
          <label style={{fontSize:11,color:"#94a3b8",display:"block",marginBottom:4,fontFamily:font}}>PRIORITY</label>
          <select style={{...S.select,width:"100%"}} value={newReq.priority} onChange={e=>setNewReq({...newReq,priority:e.target.value})}>
            {PRIORITIES.map(p=><option key={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div style={{marginBottom:16}}>
        <label style={{fontSize:11,color:"#94a3b8",display:"block",marginBottom:4,fontFamily:font}}>LINK TO TASK (optional)</label>
        <select style={{...S.select,width:"100%"}} value={newReq.linkedTask} onChange={e=>setNewReq({...newReq,linkedTask:e.target.value})}>
          <option value="">None</option>
          {tasks.filter(t=>!t.parent).map(t=><option key={t.id} value={t.name}>{t.name}</option>)}
        </select>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button style={S.btn(true)} onClick={handleCreate}><Send size={14}/> Create Request</button>
        <button style={S.btn(false)} onClick={()=>setShowNew(false)}>Cancel</button>
      </div>
    </Modal>}
  </div>;
}

// ─── REMINDERS TAB ───────────────────────────────────────────────────────────
function RemindersTab({tasks}) {
  const [reminderConfig, setReminderConfig] = useState({daysBeforeDeadline:2,hoursBeforeDeadline:10,channel:"#humara-general",enabled:true});

  // Simulate tasks with approaching deadlines
  const upcomingTasks = useMemo(()=>{
    const withDeadlines = tasks.filter(t=>!t.parent && t.status!=="Done").slice(0,8).map((t,i)=>({
      ...t,
      simulatedDeadline: i<3 ? `${i+1} day${i>0?"s":""}, ${10-i*3} hours` : i<5 ? `${i+2} days` : `${i+5} days`,
      urgency: i<3 ? "urgent" : i<5 ? "approaching" : "on-track"
    }));
    return withDeadlines;
  },[tasks]);

  const generateReminder = (task) => {
    const urgencyMap = {
      urgent: `Hi${task.assignee?` ${task.assignee.split(" ")[0]}`:""},\n\nHope you are progressing smoothly on "${task.name}". Kindly notify if you are facing challenges as we approach the deadline to this task which is in ${task.simulatedDeadline}.\n\nIf there are any blockers, please flag them in #humara-general so we can unblock you quickly.\n\nBest,\nHumara Command Centre`,
      approaching: `Quick check-in on "${task.name}" — deadline is in ${task.simulatedDeadline}. Let us know if the timeline still works or if you need support.`,
      "on-track": `Reminder: "${task.name}" is due in ${task.simulatedDeadline}. No action needed if on track.`
    };
    return urgencyMap[task.urgency];
  };

  return <div>
    <div style={S.card}>
      <div style={S.cardHeader}>
        <div style={S.cardTitle}><Settings size={16} color="#818cf8"/> Reminder Configuration</div>
        <span style={S.pill(reminderConfig.enabled?"rgba(34,197,94,0.15)":"rgba(239,68,68,0.15)",reminderConfig.enabled?"#22c55e":"#ef4444")}>
          {reminderConfig.enabled?"Active":"Paused"}
        </span>
      </div>
      <div style={{display:"flex",gap:16,alignItems:"center",flexWrap:"wrap"}}>
        <div>
          <label style={{fontSize:11,color:"#94a3b8",display:"block",marginBottom:4,fontFamily:font}}>TRIGGER BEFORE DEADLINE</label>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <input type="number" style={{...S.input,width:60,textAlign:"center"}} value={reminderConfig.daysBeforeDeadline} onChange={e=>setReminderConfig({...reminderConfig,daysBeforeDeadline:+e.target.value})}/>
            <span style={{fontSize:12,color:"#64748b"}}>days,</span>
            <input type="number" style={{...S.input,width:60,textAlign:"center"}} value={reminderConfig.hoursBeforeDeadline} onChange={e=>setReminderConfig({...reminderConfig,hoursBeforeDeadline:+e.target.value})}/>
            <span style={{fontSize:12,color:"#64748b"}}>hours</span>
          </div>
        </div>
        <div>
          <label style={{fontSize:11,color:"#94a3b8",display:"block",marginBottom:4,fontFamily:font}}>SLACK CHANNEL</label>
          <select style={S.select} value={reminderConfig.channel} onChange={e=>setReminderConfig({...reminderConfig,channel:e.target.value})}>
            <option>#humara-general</option>
            <option>#humara-backend</option>
            <option>#humara-contracts</option>
            <option>#humara-frontend</option>
            <option>#humara-devops</option>
          </select>
        </div>
        <div style={{marginTop:16}}>
          <button style={S.btnSm(true)} onClick={()=>setReminderConfig(c=>({...c,enabled:!c.enabled}))}>
            {reminderConfig.enabled ? <><Minus size={10}/> Pause</> : <><Zap size={10}/> Enable</>}
          </button>
        </div>
      </div>
    </div>

    <div style={{marginTop:20}}>
      <div style={{fontSize:13,fontWeight:700,color:"#c7d2fe",marginBottom:12,display:"flex",alignItems:"center",gap:8}}><Bell size={14} color="#f59e0b"/> Upcoming Deadline Reminders</div>
      {upcomingTasks.map((t,i)=>{
        const bgMap = {urgent:"linear-gradient(135deg,rgba(239,68,68,0.08),rgba(245,158,11,0.04))",approaching:"rgba(245,158,11,0.06)","on-track":"rgba(99,102,241,0.04)"};
        const borderMap = {urgent:"rgba(239,68,68,0.25)",approaching:"rgba(245,158,11,0.2)","on-track":"rgba(99,102,241,0.1)"};
        const iconMap = {urgent:<AlertTriangle size={16} color="#ef4444"/>,approaching:<Clock size={16} color="#f59e0b"/>,"on-track":<CheckCircle2 size={16} color="#22c55e"/>};
        return <div key={t.id} style={{background:bgMap[t.urgency],border:`1px solid ${borderMap[t.urgency]}`,borderRadius:12,padding:16,marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
            <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
              {iconMap[t.urgency]}
              <div>
                <div style={{fontSize:14,fontWeight:600}}>{t.name}</div>
                <div style={{display:"flex",gap:6,marginTop:6,alignItems:"center"}}>
                  {t.priority && <PriorityDot p={t.priority}/>}
                  <span style={{fontSize:11,color:"#64748b",fontFamily:font}}>Deadline in {t.simulatedDeadline}</span>
                  {t.assignee && <span style={{fontSize:11,color:"#818cf8"}}>· {t.assignee}</span>}
                </div>
              </div>
            </div>
            <span style={{...S.pill(t.urgency==="urgent"?"rgba(239,68,68,0.15)":t.urgency==="approaching"?"rgba(245,158,11,0.15)":"rgba(34,197,94,0.15)",t.urgency==="urgent"?"#ef4444":t.urgency==="approaching"?"#f59e0b":"#22c55e"),textTransform:"capitalize"}}>{t.urgency}</span>
          </div>
          <div style={{background:"rgba(0,0,0,0.25)",borderRadius:8,padding:12,marginTop:8,fontFamily:font,fontSize:12,color:"#c7d2fe",whiteSpace:"pre-wrap",lineHeight:1.6}}>
            {generateReminder(t)}
          </div>
          <div style={{display:"flex",gap:8,marginTop:10}}>
            <button style={S.btnSm(true)}><Send size={10}/> Send to Slack</button>
            <button style={S.btnSm(false)}><Copy size={10}/> Copy</button>
          </div>
        </div>;
      })}
    </div>
  </div>;
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function HumaraCommandCentre() {
  const [activeTab, setActiveTab] = useState("overview");
  const [tasks, setTasks] = useState(RAW_TASKS);

  const tabDefs = [
    {id:"overview",label:"Overview",icon:BarChart3},
    {id:"tasks",label:"Task Board",icon:Layers,badge:tasks.filter(t=>!t.parent).length,badgeColor:"rgba(99,102,241,0.3)"},
    {id:"github",label:"GitHub",icon:GitBranch,badge:GITHUB_REPOS.length},
    {id:"notion",label:"Notion Docs",icon:FileText},
    {id:"slack",label:"Slack",icon:MessageSquare},
    {id:"requests",label:"Requests",icon:Send,badge:"2",badgeColor:"rgba(245,158,11,0.3)"},
    {id:"reminders",label:"Reminders",icon:Bell,badge:"3",badgeColor:"rgba(239,68,68,0.3)"},
  ];

  return <div style={S.root}>
    <div style={S.gridBg}/>
    <div style={S.noise}/>
    <div style={S.content}>
      {/* Header */}
      <div style={S.header}>
        <div style={S.logo}>
          <div style={S.logoIcon}>H</div>
          <div>
            <div style={S.logoText}>Humara Command Centre</div>
            <div style={S.logoSub}>Token Launch · Project Ops</div>
          </div>
        </div>
        <div style={S.headerRight}>
          <div style={S.bellBtn}><Bell size={16}/><div style={S.bellDot}/></div>
          <div style={S.avatar}>BI</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={S.tabs}>
        {tabDefs.map(t=><div key={t.id} style={S.tab(activeTab===t.id)} onClick={()=>setActiveTab(t.id)}>
          <t.icon size={15}/>
          {t.label}
          {t.badge && <span style={S.tabBadge(t.badgeColor)}>{t.badge}</span>}
        </div>)}
      </div>

      {/* Content */}
      <div style={{marginTop:8}}>
        {activeTab==="overview" && <OverviewTab tasks={tasks} setActiveTab={setActiveTab}/>}
        {activeTab==="tasks" && <TasksTab tasks={tasks} setTasks={setTasks}/>}
        {activeTab==="github" && <GitHubTab/>}
        {activeTab==="notion" && <NotionTab tasks={tasks}/>}
        {activeTab==="slack" && <SlackTab/>}
        {activeTab==="requests" && <RequestsTab tasks={tasks}/>}
        {activeTab==="reminders" && <RemindersTab tasks={tasks}/>}
      </div>
    </div>
  </div>;
}
