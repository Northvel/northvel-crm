import { useState, useEffect, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Karla:wght@300;400;500;600&display=swap');`;

const STATUSES = ["Submitted","Under Review","Approved","Buyer Engaged","Negotiating","Closed","Rejected"];
const STATUS_COLORS = {
  "Submitted": "#6B6B6B",
  "Under Review": "#B8960C",
  "Approved": "#2E7D4F",
  "Buyer Engaged": "#1A5C8A",
  "Negotiating": "#8A4A1A",
  "Closed": "#1A3A1A",
  "Rejected": "#7D2E2E",
};
const STATUS_BG = {
  "Submitted": "#2A2A2A",
  "Under Review": "#2A2200",
  "Approved": "#0A2A1A",
  "Buyer Engaged": "#0A1E2A",
  "Negotiating": "#2A1A0A",
  "Closed": "#0A1A0A",
  "Rejected": "#2A0A0A",
};

const INITIAL_USERS = [
  { id: "admin", name: "Marcus Veil", email: "admin@northvel.com", password: "admin123", role: "admin", avatar: "MV" },
  { id: "sp1", name: "James Ashworth", email: "james@northvel.com", password: "pass123", role: "sourcing_partner", avatar: "JA" },
  { id: "sp2", name: "Celeste Fontaine", email: "celeste@northvel.com", password: "pass123", role: "sourcing_partner", avatar: "CF" },
];

const INITIAL_OPPORTUNITIES = [
  {
    id: "opp1", type: "buy", submittedBy: "sp1", submittedByName: "James Ashworth",
    status: "Under Review", createdAt: "2025-05-01T10:00:00",
    data: { fullName: "Harrison Welt", email: "hwelt@private.com", phone: "212-555-0191",
      desiredVehicle: "2024 Ferrari SF90 Stradale", preferredSpecs: "Rosso Corsa, Pista kit, full carbon interior", budget: "$600,000", timeline: "60 days", paymentType: "Cash", tradeIn: "No", notes: "Prefers factory order if available." },
    notes: [{ author: "Marcus Veil", text: "Client verified. Connected with Ferrari NA dealer.", date: "2025-05-02T14:30:00" }]
  },
  {
    id: "opp2", type: "sell", submittedBy: "sp1", submittedByName: "James Ashworth",
    status: "Approved", createdAt: "2025-05-03T09:00:00",
    data: { fullName: "Diana Cross", email: "diana@dcross.io", phone: "310-555-0847",
      make: "Lamborghini", model: "Huracán EVO Spyder", year: "2022", vin: "ZHWUD4ZF9NLA12345",
      mileage: "3,200", exteriorColor: "Grigio Lynx", interiorColor: "Nero Ade", askingPrice: "$285,000",
      location: "Beverly Hills, CA", loanStatus: "Clear Title", photoLinks: "drive.google.com/xyz", notes: "Very clean, original tires, no incidents." },
    notes: []
  },
  {
    id: "opp3", type: "buy", submittedBy: "sp2", submittedByName: "Celeste Fontaine",
    status: "Submitted", createdAt: "2025-05-08T16:00:00",
    data: { fullName: "Viktor Larsen", email: "vlarsen@larsencap.com", phone: "646-555-0332",
      desiredVehicle: "Rolls-Royce Cullinan Black Badge", preferredSpecs: "Midnight Emerald, bespoke interior", budget: "$450,000", timeline: "90 days", paymentType: "Financing", tradeIn: "Yes – 2021 Bentley Bentayga V8", notes: "Repeat client. Discretion required." },
    notes: []
  },
];

const css = `
  ${FONTS}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0A0A0A; }
  :root {
    --black: #0A0A0A;
    --dark: #111111;
    --dark2: #181818;
    --dark3: #222222;
    --border: rgba(255,255,255,0.08);
    --border2: rgba(255,255,255,0.14);
    --gold: #C9A84C;
    --gold-light: #E2C97E;
    --white: #F5F3EE;
    --muted: #888888;
    --muted2: #555555;
    --font-display: 'Cormorant Garamond', serif;
    --font-body: 'Karla', sans-serif;
  }
  .app { display: flex; min-height: 100vh; background: var(--black); color: var(--white); font-family: var(--font-body); }
  
  /* SIDEBAR */
  .sidebar { width: 240px; min-height: 100vh; background: var(--dark); border-right: 1px solid var(--border); display: flex; flex-direction: column; flex-shrink: 0; }
  .sidebar-logo { padding: 28px 24px 20px; border-bottom: 1px solid var(--border); }
  .logo-n { font-family: var(--font-display); font-size: 28px; font-weight: 300; color: var(--gold); letter-spacing: 0.12em; }
  .logo-sub { font-size: 9px; letter-spacing: 0.35em; color: var(--muted); text-transform: uppercase; margin-top: 2px; }
  .sidebar-user { padding: 16px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; }
  .avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--dark3); border: 1px solid var(--border2); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 500; color: var(--gold); letter-spacing: 0.05em; flex-shrink: 0; }
  .user-info { flex: 1; min-width: 0; }
  .user-name { font-size: 12px; font-weight: 500; color: var(--white); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .user-role { font-size: 10px; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; margin-top: 1px; }
  .sidebar-nav { flex: 1; padding: 12px 0; }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 24px; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); cursor: pointer; transition: all 0.2s; border-left: 2px solid transparent; }
  .nav-item:hover { color: var(--white); background: rgba(255,255,255,0.03); }
  .nav-item.active { color: var(--gold); border-left-color: var(--gold); background: rgba(201,168,76,0.05); }
  .nav-badge { margin-left: auto; background: var(--gold); color: var(--black); font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 10px; min-width: 18px; text-align: center; }
  .sidebar-logout { padding: 16px 24px; border-top: 1px solid var(--border); }
  .logout-btn { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted2); cursor: pointer; background: none; border: none; color: var(--muted); transition: color 0.2s; font-family: var(--font-body); }
  .logout-btn:hover { color: var(--white); }
  
  /* MAIN */
  .main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
  .topbar { background: var(--dark); border-bottom: 1px solid var(--border); padding: 16px 32px; display: flex; align-items: center; justify-content: space-between; }
  .page-title { font-family: var(--font-display); font-size: 22px; font-weight: 400; color: var(--white); letter-spacing: 0.04em; }
  .page-subtitle { font-size: 11px; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; margin-top: 2px; }
  .content { flex: 1; padding: 32px; overflow-y: auto; }
  
  /* LOGIN */
  .login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--black); flex-direction: column; gap: 0; }
  .login-box { background: var(--dark); border: 1px solid var(--border); padding: 48px 40px; width: 360px; }
  .login-logo { font-family: var(--font-display); font-size: 42px; font-weight: 300; color: var(--gold); letter-spacing: 0.15em; text-align: center; }
  .login-tagline { text-align: center; font-size: 10px; letter-spacing: 0.3em; color: var(--muted); text-transform: uppercase; margin-top: 4px; margin-bottom: 36px; }
  .login-divider { width: 40px; height: 1px; background: var(--gold); margin: 0 auto 36px; }
  .field-label { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; display: block; }
  .field-group { margin-bottom: 20px; }
  .field-input { width: 100%; background: var(--dark2); border: 1px solid var(--border); color: var(--white); font-family: var(--font-body); font-size: 13px; padding: 11px 14px; outline: none; transition: border 0.2s; }
  .field-input:focus { border-color: var(--gold); }
  .field-input::placeholder { color: var(--muted2); }
  .field-select { width: 100%; background: var(--dark2); border: 1px solid var(--border); color: var(--white); font-family: var(--font-body); font-size: 13px; padding: 11px 14px; outline: none; transition: border 0.2s; appearance: none; cursor: pointer; }
  .field-select:focus { border-color: var(--gold); }
  .field-textarea { width: 100%; background: var(--dark2); border: 1px solid var(--border); color: var(--white); font-family: var(--font-body); font-size: 13px; padding: 11px 14px; outline: none; transition: border 0.2s; resize: vertical; min-height: 80px; }
  .field-textarea:focus { border-color: var(--gold); }
  .btn-primary { width: 100%; background: var(--gold); color: var(--black); border: none; font-family: var(--font-body); font-size: 11px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; padding: 13px; cursor: pointer; transition: background 0.2s; }
  .btn-primary:hover { background: var(--gold-light); }
  .btn-secondary { background: transparent; color: var(--gold); border: 1px solid var(--gold); font-family: var(--font-body); font-size: 11px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; padding: 10px 20px; cursor: pointer; transition: all 0.2s; }
  .btn-secondary:hover { background: rgba(201,168,76,0.1); }
  .btn-ghost { background: transparent; color: var(--muted); border: 1px solid var(--border); font-family: var(--font-body); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; padding: 8px 16px; cursor: pointer; transition: all 0.2s; }
  .btn-ghost:hover { color: var(--white); border-color: var(--border2); }
  .error-msg { font-size: 12px; color: #C04A4A; margin-top: 12px; text-align: center; }
  
  /* DASHBOARD */
  .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
  .stat-card { background: var(--dark); border: 1px solid var(--border); padding: 20px 24px; }
  .stat-label { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }
  .stat-value { font-family: var(--font-display); font-size: 32px; font-weight: 300; color: var(--white); line-height: 1; }
  .stat-sub { font-size: 11px; color: var(--muted); margin-top: 6px; }
  .gold-text { color: var(--gold); }
  .section-label { font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--muted); margin-bottom: 16px; padding-bottom: 10px; border-bottom: 1px solid var(--border); }
  
  /* OPPORTUNITIES TABLE */
  .opp-table { width: 100%; border-collapse: collapse; }
  .opp-table th { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); font-weight: 400; text-align: left; padding: 10px 16px; border-bottom: 1px solid var(--border); }
  .opp-table td { padding: 14px 16px; border-bottom: 1px solid var(--border); font-size: 13px; vertical-align: middle; }
  .opp-table tr:hover td { background: rgba(255,255,255,0.02); }
  .opp-table tr { cursor: pointer; }
  .type-badge { display: inline-flex; align-items: center; gap: 4px; font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; padding: 3px 8px; border-radius: 2px; font-weight: 500; }
  .type-buy { background: rgba(30,60,100,0.4); color: #7EB4E8; border: 1px solid rgba(126,180,232,0.2); }
  .type-sell { background: rgba(80,50,10,0.4); color: #E8B87E; border: 1px solid rgba(232,184,126,0.2); }
  .status-badge { display: inline-block; font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; padding: 3px 8px; border-radius: 2px; font-weight: 500; }
  .opp-name { font-weight: 500; color: var(--white); }
  .opp-vehicle { color: var(--muted); font-size: 12px; margin-top: 2px; }
  .opp-date { font-size: 11px; color: var(--muted); }
  .opp-partner { font-size: 12px; color: var(--muted); }
  
  /* DETAIL PANEL */
  .detail-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 100; display: flex; align-items: stretch; justify-content: flex-end; }
  .detail-panel { width: 520px; background: var(--dark); border-left: 1px solid var(--border); display: flex; flex-direction: column; overflow-y: auto; animation: slideIn 0.25s ease; }
  @keyframes slideIn { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  .detail-header { padding: 24px 28px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: flex-start; flex-shrink: 0; }
  .detail-body { padding: 28px; flex: 1; overflow-y: auto; }
  .close-btn { background: none; border: none; color: var(--muted); font-size: 20px; cursor: pointer; line-height: 1; padding: 0; transition: color 0.2s; }
  .close-btn:hover { color: var(--white); }
  .detail-section { margin-bottom: 28px; }
  .detail-section-title { font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--gold); margin-bottom: 14px; }
  .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
  .detail-key { font-size: 11px; color: var(--muted); }
  .detail-val { font-size: 12px; color: var(--white); text-align: right; max-width: 260px; }
  .note-card { background: var(--dark2); border: 1px solid var(--border); padding: 14px 16px; margin-bottom: 10px; border-left: 2px solid var(--gold); }
  .note-author { font-size: 10px; color: var(--gold); letter-spacing: 0.1em; text-transform: uppercase; }
  .note-date { font-size: 10px; color: var(--muted); float: right; }
  .note-text { font-size: 12px; color: var(--white); margin-top: 6px; line-height: 1.6; }
  .note-input { width: 100%; background: var(--dark2); border: 1px solid var(--border); color: var(--white); font-family: var(--font-body); font-size: 12px; padding: 10px 12px; resize: none; min-height: 70px; outline: none; margin-bottom: 10px; }
  .note-input:focus { border-color: var(--gold); }
  
  /* FORMS */
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .form-grid.full { grid-template-columns: 1fr; }
  .form-section { margin-bottom: 32px; }
  .form-section-title { font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--gold); margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid rgba(201,168,76,0.2); }
  .form-type-select { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px; }
  .type-option { background: var(--dark2); border: 1px solid var(--border); padding: 20px 24px; cursor: pointer; transition: all 0.2s; text-align: center; }
  .type-option:hover { border-color: var(--border2); }
  .type-option.selected { border-color: var(--gold); background: rgba(201,168,76,0.05); }
  .type-option-title { font-family: var(--font-display); font-size: 18px; font-weight: 400; color: var(--white); margin-bottom: 6px; }
  .type-option-sub { font-size: 11px; color: var(--muted); letter-spacing: 0.05em; }
  
  /* NOTIFICATIONS */
  .notif-item { background: var(--dark); border: 1px solid var(--border); padding: 16px 20px; margin-bottom: 10px; display: flex; gap: 14px; align-items: flex-start; }
  .notif-item.unread { border-left: 2px solid var(--gold); }
  .notif-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); flex-shrink: 0; margin-top: 5px; }
  .notif-dot.read { background: var(--muted2); }
  .notif-text { font-size: 13px; color: var(--white); line-height: 1.5; }
  .notif-time { font-size: 11px; color: var(--muted); margin-top: 4px; }
  
  /* ADMIN USERS */
  .user-card { background: var(--dark); border: 1px solid var(--border); padding: 20px 24px; display: flex; align-items: center; gap: 16px; margin-bottom: 10px; }
  .user-card-info { flex: 1; }
  .user-card-name { font-size: 14px; font-weight: 500; color: var(--white); }
  .user-card-email { font-size: 12px; color: var(--muted); margin-top: 2px; }
  .role-chip { font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; padding: 3px 8px; border-radius: 2px; }
  .role-admin { background: rgba(201,168,76,0.15); color: var(--gold); border: 1px solid rgba(201,168,76,0.3); }
  .role-sp { background: rgba(255,255,255,0.05); color: var(--muted); border: 1px solid var(--border); }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 200; display: flex; align-items: center; justify-content: center; }
  .modal-box { background: var(--dark); border: 1px solid var(--border2); padding: 36px; width: 420px; }
  .modal-title { font-family: var(--font-display); font-size: 22px; font-weight: 400; color: var(--white); margin-bottom: 24px; }
  .btn-danger { background: transparent; color: #C04A4A; border: 1px solid rgba(192,74,74,0.4); font-family: var(--font-body); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; padding: 8px 16px; cursor: pointer; transition: all 0.2s; }
  .btn-danger:hover { background: rgba(192,74,74,0.1); }
  .empty-state { text-align: center; padding: 60px 0; }
  .empty-icon { font-size: 36px; margin-bottom: 16px; opacity: 0.2; }
  .empty-title { font-family: var(--font-display); font-size: 20px; font-weight: 400; color: var(--muted); margin-bottom: 8px; }
  .empty-sub { font-size: 12px; color: var(--muted2); }
  .success-banner { background: rgba(46,125,79,0.15); border: 1px solid rgba(46,125,79,0.3); padding: 12px 16px; font-size: 12px; color: #6EC89A; letter-spacing: 0.05em; margin-bottom: 24px; }
  .gold-line { height: 1px; background: linear-gradient(90deg, var(--gold), transparent); margin: 24px 0; }
  @media (max-width: 768px) {
    .stat-grid { grid-template-columns: repeat(2, 1fr); }
    .form-grid { grid-template-columns: 1fr; }
    .sidebar { display: none; }
  }
`;

export default function NorthvelCRM() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [opportunities, setOpportunities] = useState(INITIAL_OPPORTUNITIES);
  const [notifications, setNotifications] = useState([
    { id: "n1", userId: "sp1", text: "Your submission for Harrison Welt has been moved to Under Review.", time: "2025-05-02T14:30:00", read: false },
    { id: "n2", userId: "sp1", text: "Your submission for Diana Cross has been marked Approved.", time: "2025-05-04T10:00:00", read: true },
  ]);
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [formType, setFormType] = useState(null);
  const [formData, setFormData] = useState({});
  const [formSuccess, setFormSuccess] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "sourcing_partner" });
  const [styleEl] = useState(() => {
    if (typeof document !== "undefined") {
      const el = document.createElement("style");
      el.textContent = css;
      document.head.appendChild(el);
      return el;
    }
  });

  const login = () => {
    const user = users.find(u => u.email === loginEmail && u.password === loginPassword);
    if (user) { setCurrentUser(user); setLoginError(""); }
    else setLoginError("Invalid credentials. Please try again.");
  };

  const logout = () => { setCurrentUser(null); setPage("dashboard"); setLoginEmail(""); setLoginPassword(""); };

  const myOpps = currentUser
    ? currentUser.role === "admin"
      ? opportunities
      : opportunities.filter(o => o.submittedBy === currentUser.id)
    : [];

  const myNotifs = currentUser ? notifications.filter(n => n.userId === currentUser.id) : [];
  const unreadCount = myNotifs.filter(n => !n.read).length;

  const submitForm = () => {
    const opp = {
      id: `opp${Date.now()}`, type: formType, submittedBy: currentUser.id,
      submittedByName: currentUser.name, status: "Submitted",
      createdAt: new Date().toISOString(), data: { ...formData }, notes: []
    };
    setOpportunities(prev => [...prev, opp]);
    setFormSuccess(true);
    setTimeout(() => { setFormSuccess(false); setFormType(null); setFormData({}); setPage("my-opportunities"); }, 2500);
  };

  const updateStatus = () => {
    if (!newStatus || !selectedOpp) return;
    const updated = opportunities.map(o => o.id === selectedOpp.id ? { ...o, status: newStatus } : o);
    setOpportunities(updated);
    const notif = {
      id: `n${Date.now()}`, userId: selectedOpp.submittedBy,
      text: `Your submission for ${selectedOpp.data.fullName} has been moved to "${newStatus}".`,
      time: new Date().toISOString(), read: false
    };
    setNotifications(prev => [...prev, notif]);
    setSelectedOpp(prev => ({ ...prev, status: newStatus }));
    setNewStatus("");
  };

  const addNote = () => {
    if (!noteText.trim() || !selectedOpp) return;
    const note = { author: currentUser.name, text: noteText, date: new Date().toISOString() };
    const updated = opportunities.map(o => o.id === selectedOpp.id ? { ...o, notes: [...o.notes, note] } : o);
    setOpportunities(updated);
    setSelectedOpp(prev => ({ ...prev, notes: [...prev.notes, note] }));
    setNoteText("");
  };

  const addUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) return;
    const u = { ...newUser, id: `u${Date.now()}`, avatar: newUser.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() };
    setUsers(prev => [...prev, u]);
    setNewUser({ name: "", email: "", password: "", role: "sourcing_partner" });
    setShowAddUser(false);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => n.userId === currentUser.id ? { ...n, read: true } : n));
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getVehicleDisplay = (opp) => {
    if (opp.type === "buy") return opp.data.desiredVehicle || "Vehicle Request";
    return `${opp.data.year || ""} ${opp.data.make || ""} ${opp.data.model || ""}`.trim();
  };

  if (!currentUser) {
    return (
      <div className="login-wrap">
        <div className="login-box">
          <div className="login-logo">NORTHVEL</div>
          <div className="login-tagline">Exotic & Luxury Automotive</div>
          <div className="login-divider" />
          <div className="field-group">
            <label className="field-label">Email Address</label>
            <input className="field-input" type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && login()} placeholder="partner@northvel.com" />
          </div>
          <div className="field-group">
            <label className="field-label">Password</label>
            <input className="field-input" type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && login()} placeholder="••••••••" />
          </div>
          <button className="btn-primary" onClick={login}>Access Portal</button>
          {loginError && <div className="error-msg">{loginError}</div>}
        </div>
        <div style={{ marginTop: 20, fontSize: 10, color: "#444", letterSpacing: "0.15em", textTransform: "uppercase", textAlign: "center" }}>
          Demo: admin@northvel.com / admin123 · james@northvel.com / pass123
        </div>
      </div>
    );
  }

  const renderDashboard = () => {
    const total = myOpps.length;
    const active = myOpps.filter(o => !["Closed","Rejected"].includes(o.status)).length;
    const closed = myOpps.filter(o => o.status === "Closed").length;
    const pending = myOpps.filter(o => o.status === "Submitted").length;
    return (
      <div>
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-label">Total Opportunities</div>
            <div className="stat-value">{total}</div>
            <div className="stat-sub">All submissions</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active Pipeline</div>
            <div className="stat-value gold-text">{active}</div>
            <div className="stat-sub">In progress</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending Review</div>
            <div className="stat-value">{pending}</div>
            <div className="stat-sub">Awaiting action</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Closed Deals</div>
            <div className="stat-value">{closed}</div>
            <div className="stat-sub">Successfully closed</div>
          </div>
        </div>
        <div className="section-label">Recent Opportunities</div>
        {myOpps.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">◇</div>
            <div className="empty-title">No opportunities yet</div>
            <div className="empty-sub">Submit your first opportunity to begin.</div>
          </div>
        ) : (
          <table className="opp-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Type</th>
                <th>Vehicle</th>
                {currentUser.role === "admin" && <th>Partner</th>}
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {myOpps.slice().reverse().slice(0, 5).map(opp => (
                <tr key={opp.id} onClick={() => setSelectedOpp(opp)}>
                  <td><div className="opp-name">{opp.data.fullName}</div></td>
                  <td><span className={`type-badge ${opp.type === "buy" ? "type-buy" : "type-sell"}`}>{opp.type === "buy" ? "Sourcing" : "Consign"}</span></td>
                  <td><div style={{ fontSize: 12, color: "#AAA", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{getVehicleDisplay(opp)}</div></td>
                  {currentUser.role === "admin" && <td className="opp-partner">{opp.submittedByName}</td>}
                  <td><span className="status-badge" style={{ background: STATUS_BG[opp.status], color: STATUS_COLORS[opp.status] }}>{opp.status}</span></td>
                  <td className="opp-date">{formatDate(opp.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  const renderOpportunities = () => (
    <div>
      {myOpps.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">◇</div>
          <div className="empty-title">No opportunities submitted</div>
          <div className="empty-sub">Use "Submit Opportunity" to create your first entry.</div>
        </div>
      ) : (
        <table className="opp-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Type</th>
              <th>Vehicle</th>
              {currentUser.role === "admin" && <th>Partner</th>}
              <th>Status</th>
              <th>Notes</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {myOpps.slice().reverse().map(opp => (
              <tr key={opp.id} onClick={() => setSelectedOpp(opp)}>
                <td><div className="opp-name">{opp.data.fullName}</div><div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{opp.data.email}</div></td>
                <td><span className={`type-badge ${opp.type === "buy" ? "type-buy" : "type-sell"}`}>{opp.type === "buy" ? "Sourcing" : "Consign"}</span></td>
                <td><div style={{ fontSize: 12, color: "#AAA", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{getVehicleDisplay(opp)}</div></td>
                {currentUser.role === "admin" && <td className="opp-partner">{opp.submittedByName}</td>}
                <td><span className="status-badge" style={{ background: STATUS_BG[opp.status], color: STATUS_COLORS[opp.status] }}>{opp.status}</span></td>
                <td style={{ fontSize: 12, color: "#666" }}>{opp.notes.length}</td>
                <td className="opp-date">{formatDate(opp.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const renderSubmit = () => {
    if (formSuccess) return (
      <div className="empty-state">
        <div style={{ fontSize: 36, marginBottom: 16, color: "var(--gold)" }}>✓</div>
        <div className="empty-title" style={{ color: "var(--gold)" }}>Opportunity Submitted</div>
        <div className="empty-sub">Redirecting to your opportunities…</div>
      </div>
    );
    if (!formType) return (
      <div>
        <div className="section-label" style={{ marginBottom: 24 }}>Select Opportunity Type</div>
        <div className="form-type-select">
          <div className={`type-option ${formType === "buy" ? "selected" : ""}`} onClick={() => setFormType("buy")}>
            <div className="type-option-title">Vehicle Sourcing</div>
            <div className="type-option-sub">Client seeking a specific exotic or luxury vehicle</div>
          </div>
          <div className={`type-option ${formType === "sell" ? "selected" : ""}`} onClick={() => setFormType("sell")}>
            <div className="type-option-title">Sell / Consign</div>
            <div className="type-option-sub">Client looking to sell or consign a luxury vehicle</div>
          </div>
        </div>
      </div>
    );

    const f = (field) => formData[field] || "";
    const s = (field) => (val) => setFormData(prev => ({ ...prev, [field]: val }));

    if (formType === "buy") return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <button className="btn-ghost" onClick={() => setFormType(null)} style={{ padding: "6px 12px" }}>← Back</button>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>Vehicle Sourcing Request</div>
        </div>
        <div className="form-section">
          <div className="form-section-title">Client Information</div>
          <div className="form-grid">
            <div className="field-group"><label className="field-label">Full Name *</label><input className="field-input" value={f("fullName")} onChange={e => s("fullName")(e.target.value)} placeholder="Harrison Welt" /></div>
            <div className="field-group"><label className="field-label">Email *</label><input className="field-input" type="email" value={f("email")} onChange={e => s("email")(e.target.value)} placeholder="client@email.com" /></div>
            <div className="field-group"><label className="field-label">Phone</label><input className="field-input" value={f("phone")} onChange={e => s("phone")(e.target.value)} placeholder="212-555-0100" /></div>
          </div>
        </div>
        <div className="form-section">
          <div className="form-section-title">Vehicle Details</div>
          <div className="form-grid">
            <div className="field-group" style={{ gridColumn: "1/-1" }}><label className="field-label">Desired Vehicle *</label><input className="field-input" value={f("desiredVehicle")} onChange={e => s("desiredVehicle")(e.target.value)} placeholder="e.g. 2024 Ferrari SF90 Stradale" /></div>
            <div className="field-group" style={{ gridColumn: "1/-1" }}><label className="field-label">Preferred Specs</label><textarea className="field-textarea" value={f("preferredSpecs")} onChange={e => s("preferredSpecs")(e.target.value)} placeholder="Color, interior, options, packages…" /></div>
            <div className="field-group"><label className="field-label">Budget</label><input className="field-input" value={f("budget")} onChange={e => s("budget")(e.target.value)} placeholder="$500,000" /></div>
            <div className="field-group"><label className="field-label">Timeline</label><input className="field-input" value={f("timeline")} onChange={e => s("timeline")(e.target.value)} placeholder="60 days, ASAP, etc." /></div>
            <div className="field-group"><label className="field-label">Payment Method</label><select className="field-select" value={f("paymentType")} onChange={e => s("paymentType")(e.target.value)}><option value="">Select…</option><option>Cash</option><option>Financing</option><option>Undecided</option></select></div>
            <div className="field-group"><label className="field-label">Trade-In</label><select className="field-select" value={f("tradeIn")} onChange={e => s("tradeIn")(e.target.value)}><option value="">Select…</option><option>No</option><option>Yes</option><option>Possibly</option></select></div>
            <div className="field-group" style={{ gridColumn: "1/-1" }}><label className="field-label">Additional Notes</label><textarea className="field-textarea" value={f("notes")} onChange={e => s("notes")(e.target.value)} placeholder="Any additional context or preferences…" /></div>
          </div>
        </div>
        <button className="btn-primary" style={{ width: "auto", padding: "13px 48px" }} onClick={submitForm} disabled={!f("fullName") || !f("desiredVehicle")}>Submit Opportunity</button>
      </div>
    );

    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <button className="btn-ghost" onClick={() => setFormType(null)} style={{ padding: "6px 12px" }}>← Back</button>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>Sell / Consign Vehicle</div>
        </div>
        <div className="form-section">
          <div className="form-section-title">Client Information</div>
          <div className="form-grid">
            <div className="field-group"><label className="field-label">Full Name *</label><input className="field-input" value={f("fullName")} onChange={e => s("fullName")(e.target.value)} placeholder="Diana Cross" /></div>
            <div className="field-group"><label className="field-label">Email *</label><input className="field-input" type="email" value={f("email")} onChange={e => s("email")(e.target.value)} placeholder="client@email.com" /></div>
            <div className="field-group"><label className="field-label">Phone</label><input className="field-input" value={f("phone")} onChange={e => s("phone")(e.target.value)} placeholder="310-555-0100" /></div>
          </div>
        </div>
        <div className="form-section">
          <div className="form-section-title">Vehicle Information</div>
          <div className="form-grid">
            <div className="field-group"><label className="field-label">Make *</label><input className="field-input" value={f("make")} onChange={e => s("make")(e.target.value)} placeholder="Lamborghini" /></div>
            <div className="field-group"><label className="field-label">Model *</label><input className="field-input" value={f("model")} onChange={e => s("model")(e.target.value)} placeholder="Huracán EVO Spyder" /></div>
            <div className="field-group"><label className="field-label">Year</label><input className="field-input" value={f("year")} onChange={e => s("year")(e.target.value)} placeholder="2022" /></div>
            <div className="field-group"><label className="field-label">VIN</label><input className="field-input" value={f("vin")} onChange={e => s("vin")(e.target.value)} placeholder="ZHWUD4ZF9NLA12345" /></div>
            <div className="field-group"><label className="field-label">Mileage</label><input className="field-input" value={f("mileage")} onChange={e => s("mileage")(e.target.value)} placeholder="3,200" /></div>
            <div className="field-group"><label className="field-label">Exterior Color</label><input className="field-input" value={f("exteriorColor")} onChange={e => s("exteriorColor")(e.target.value)} placeholder="Grigio Lynx" /></div>
            <div className="field-group"><label className="field-label">Interior Color</label><input className="field-input" value={f("interiorColor")} onChange={e => s("interiorColor")(e.target.value)} placeholder="Nero Ade" /></div>
            <div className="field-group"><label className="field-label">Asking Price</label><input className="field-input" value={f("askingPrice")} onChange={e => s("askingPrice")(e.target.value)} placeholder="$285,000" /></div>
            <div className="field-group"><label className="field-label">Vehicle Location</label><input className="field-input" value={f("location")} onChange={e => s("location")(e.target.value)} placeholder="Beverly Hills, CA" /></div>
            <div className="field-group"><label className="field-label">Loan / Title Status</label><select className="field-select" value={f("loanStatus")} onChange={e => s("loanStatus")(e.target.value)}><option value="">Select…</option><option>Clear Title</option><option>Active Loan</option><option>Lease</option><option>Unknown</option></select></div>
            <div className="field-group" style={{ gridColumn: "1/-1" }}><label className="field-label">Photo Upload or Photo Links</label><input className="field-input" value={f("photoLinks")} onChange={e => s("photoLinks")(e.target.value)} placeholder="drive.google.com/… or dropbox.com/…" /></div>
            <div className="field-group" style={{ gridColumn: "1/-1" }}><label className="field-label">Additional Notes</label><textarea className="field-textarea" value={f("notes")} onChange={e => s("notes")(e.target.value)} placeholder="Condition, history, modifications, seller situation…" /></div>
          </div>
        </div>
        <button className="btn-primary" style={{ width: "auto", padding: "13px 48px" }} onClick={submitForm} disabled={!f("fullName") || !f("make") || !f("model")}>Submit Opportunity</button>
      </div>
    );
  };

  const renderNotifications = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>{unreadCount} unread</div>
        {unreadCount > 0 && <button className="btn-ghost" onClick={markAllRead}>Mark all read</button>}
      </div>
      {myNotifs.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">◯</div><div className="empty-title">No notifications</div></div>
      ) : myNotifs.slice().reverse().map(n => (
        <div key={n.id} className={`notif-item ${!n.read ? "unread" : ""}`}>
          <div className={`notif-dot ${n.read ? "read" : ""}`} />
          <div><div className="notif-text">{n.text}</div><div className="notif-time">{formatDate(n.time)}</div></div>
        </div>
      ))}
    </div>
  );

  const renderUsers = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>{users.length} users</div>
        <button className="btn-secondary" onClick={() => setShowAddUser(true)}>+ Add Partner</button>
      </div>
      {users.map(u => (
        <div key={u.id} className="user-card">
          <div className="avatar" style={{ width: 40, height: 40, fontSize: 13 }}>{u.avatar}</div>
          <div className="user-card-info">
            <div className="user-card-name">{u.name}</div>
            <div className="user-card-email">{u.email}</div>
          </div>
          <span className={`role-chip ${u.role === "admin" ? "role-admin" : "role-sp"}`}>
            {u.role === "admin" ? "Admin" : "Sourcing Partner"}
          </span>
        </div>
      ))}
      {showAddUser && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-title">Add Sourcing Partner</div>
            <div className="field-group"><label className="field-label">Full Name</label><input className="field-input" value={newUser.name} onChange={e => setNewUser(p => ({ ...p, name: e.target.value }))} /></div>
            <div className="field-group"><label className="field-label">Email</label><input className="field-input" type="email" value={newUser.email} onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))} /></div>
            <div className="field-group"><label className="field-label">Password</label><input className="field-input" type="text" value={newUser.password} onChange={e => setNewUser(p => ({ ...p, password: e.target.value }))} /></div>
            <div className="field-group"><label className="field-label">Role</label><select className="field-select" value={newUser.role} onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))}><option value="sourcing_partner">Sourcing Partner</option><option value="admin">Admin</option></select></div>
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={addUser}>Create User</button>
              <button className="btn-ghost" onClick={() => setShowAddUser(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderDetail = () => {
    if (!selectedOpp) return null;
    const opp = selectedOpp;
    const isBuy = opp.type === "buy";
    return (
      <div className="detail-overlay" onClick={e => { if (e.target === e.currentTarget) setSelectedOpp(null); }}>
        <div className="detail-panel">
          <div className="detail-header">
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 400, marginBottom: 4 }}>{opp.data.fullName}</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span className={`type-badge ${isBuy ? "type-buy" : "type-sell"}`}>{isBuy ? "Sourcing Request" : "Sell / Consign"}</span>
                <span className="status-badge" style={{ background: STATUS_BG[opp.status], color: STATUS_COLORS[opp.status] }}>{opp.status}</span>
              </div>
            </div>
            <button className="close-btn" onClick={() => setSelectedOpp(null)}>×</button>
          </div>
          <div className="detail-body">
            <div className="detail-section">
              <div className="detail-section-title">Client Information</div>
              <div className="detail-row"><span className="detail-key">Name</span><span className="detail-val">{opp.data.fullName}</span></div>
              <div className="detail-row"><span className="detail-key">Email</span><span className="detail-val">{opp.data.email}</span></div>
              <div className="detail-row"><span className="detail-key">Phone</span><span className="detail-val">{opp.data.phone || "—"}</span></div>
              {currentUser.role === "admin" && <div className="detail-row"><span className="detail-key">Submitted by</span><span className="detail-val">{opp.submittedByName}</span></div>}
              <div className="detail-row"><span className="detail-key">Date</span><span className="detail-val">{formatDate(opp.createdAt)}</span></div>
            </div>

            <div className="detail-section">
              <div className="detail-section-title">{isBuy ? "Vehicle Request" : "Vehicle Details"}</div>
              {isBuy ? (
                <>
                  <div className="detail-row"><span className="detail-key">Desired Vehicle</span><span className="detail-val">{opp.data.desiredVehicle}</span></div>
                  <div className="detail-row"><span className="detail-key">Preferred Specs</span><span className="detail-val">{opp.data.preferredSpecs || "—"}</span></div>
                  <div className="detail-row"><span className="detail-key">Budget</span><span className="detail-val">{opp.data.budget || "—"}</span></div>
                  <div className="detail-row"><span className="detail-key">Timeline</span><span className="detail-val">{opp.data.timeline || "—"}</span></div>
                  <div className="detail-row"><span className="detail-key">Payment</span><span className="detail-val">{opp.data.paymentType || "—"}</span></div>
                  <div className="detail-row"><span className="detail-key">Trade-In</span><span className="detail-val">{opp.data.tradeIn || "—"}</span></div>
                </>
              ) : (
                <>
                  <div className="detail-row"><span className="detail-key">Vehicle</span><span className="detail-val">{opp.data.year} {opp.data.make} {opp.data.model}</span></div>
                  <div className="detail-row"><span className="detail-key">VIN</span><span className="detail-val" style={{ fontFamily: "monospace", fontSize: 11 }}>{opp.data.vin || "—"}</span></div>
                  <div className="detail-row"><span className="detail-key">Mileage</span><span className="detail-val">{opp.data.mileage || "—"}</span></div>
                  <div className="detail-row"><span className="detail-key">Exterior</span><span className="detail-val">{opp.data.exteriorColor || "—"}</span></div>
                  <div className="detail-row"><span className="detail-key">Interior</span><span className="detail-val">{opp.data.interiorColor || "—"}</span></div>
                  <div className="detail-row"><span className="detail-key">Asking Price</span><span className="detail-val" style={{ color: "var(--gold)" }}>{opp.data.askingPrice || "—"}</span></div>
                  <div className="detail-row"><span className="detail-key">Location</span><span className="detail-val">{opp.data.location || "—"}</span></div>
                  <div className="detail-row"><span className="detail-key">Title / Loan</span><span className="detail-val">{opp.data.loanStatus || "—"}</span></div>
                  {opp.data.photoLinks && <div className="detail-row"><span className="detail-key">Photos</span><span className="detail-val" style={{ color: "var(--gold)", wordBreak: "break-all" }}>{opp.data.photoLinks}</span></div>}
                </>
              )}
              {opp.data.notes && <div className="detail-row" style={{ flexDirection: "column", gap: 6 }}><span className="detail-key">Notes</span><span className="detail-val" style={{ textAlign: "left", maxWidth: "100%", lineHeight: 1.6 }}>{opp.data.notes}</span></div>}
            </div>

            {currentUser.role === "admin" && (
              <div className="detail-section">
                <div className="detail-section-title">Update Status</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <select className="field-select" value={newStatus} onChange={e => setNewStatus(e.target.value)} style={{ flex: 1 }}>
                    <option value="">Change status…</option>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button className="btn-secondary" onClick={updateStatus} disabled={!newStatus}>Update</button>
                </div>
              </div>
            )}

            <div className="detail-section">
              <div className="detail-section-title">Internal Notes ({opp.notes.length})</div>
              {opp.notes.map((n, i) => (
                <div key={i} className="note-card">
                  <span className="note-author">{n.author}</span>
                  <span className="note-date">{formatDate(n.date)}</span>
                  <div className="note-text">{n.text}</div>
                </div>
              ))}
              {currentUser.role === "admin" && (
                <div style={{ marginTop: 12 }}>
                  <textarea className="note-input" placeholder="Add internal note…" value={noteText} onChange={e => setNoteText(e.target.value)} />
                  <button className="btn-secondary" onClick={addNote} disabled={!noteText.trim()}>Add Note</button>
                </div>
              )}
              {currentUser.role !== "admin" && opp.notes.length === 0 && <div style={{ fontSize: 12, color: "var(--muted2)" }}>No notes yet.</div>}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const pages = {
    dashboard: { title: "Dashboard", subtitle: currentUser.role === "admin" ? "Full Pipeline Overview" : "Your Opportunity Pipeline", render: renderDashboard },
    "submit-opportunity": { title: "Submit Opportunity", subtitle: "New Client Intake", render: renderSubmit },
    "my-opportunities": { title: currentUser.role === "admin" ? "All Opportunities" : "My Opportunities", subtitle: currentUser.role === "admin" ? "Complete Submission Log" : "Your Submitted Opportunities", render: renderOpportunities },
    notifications: { title: "Notifications", subtitle: "Status Updates & Alerts", render: renderNotifications },
    ...(currentUser.role === "admin" ? { users: { title: "Manage Users", subtitle: "Sourcing Partners & Admins", render: renderUsers } } : {}),
  };

  const currentPage = pages[page] || pages.dashboard;

  return (
    <div className="app">
      <div className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-n">NORTHVEL</div>
          <div className="logo-sub">Exotic & Luxury Automotive</div>
        </div>
        <div className="sidebar-user">
          <div className="avatar">{currentUser.avatar}</div>
          <div className="user-info">
            <div className="user-name">{currentUser.name}</div>
            <div className="user-role">{currentUser.role === "admin" ? "Administrator" : "Sourcing Partner"}</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {[
            { key: "dashboard", label: "Dashboard" },
            { key: "submit-opportunity", label: "Submit Opportunity" },
            { key: "my-opportunities", label: currentUser.role === "admin" ? "All Opportunities" : "My Opportunities" },
            { key: "notifications", label: "Notifications", badge: unreadCount },
            ...(currentUser.role === "admin" ? [{ key: "users", label: "Manage Users" }] : []),
          ].map(item => (
            <div key={item.key} className={`nav-item ${page === item.key ? "active" : ""}`} onClick={() => { setPage(item.key); setFormType(null); setFormData({}); setFormSuccess(false); }}>
              <span>{item.label}</span>
              {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
            </div>
          ))}
        </nav>
        <div className="sidebar-logout">
          <button className="logout-btn" onClick={logout}>Sign Out</button>
        </div>
      </div>
      <div className="main">
        <div className="topbar">
          <div>
            <div className="page-title">{currentPage.title}</div>
            <div className="page-subtitle">{currentPage.subtitle}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {currentUser.role === "admin" && (
              <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", padding: "4px 10px" }}>Admin</div>
            )}
            <div style={{ fontSize: 12, color: "var(--muted)" }}>{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
          </div>
        </div>
        <div className="content">
          {currentPage.render()}
        </div>
      </div>
      {selectedOpp && renderDetail()}
    </div>
  );
}
