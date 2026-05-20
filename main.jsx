import { useState } from "react";

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
      desiredVehicle: "2024 Ferrari SF90 Stradale", preferredSpecs: "Rosso Corsa, Pista kit, full carbon interior",
      budget: "$600,000", timeline: "60 days", paymentType: "Cash", tradeIn: "No",
      notes: "Prefers factory order if available." },
    notes: [{ author: "Marcus Veil", text: "Client verified. Connected with Ferrari NA dealer.", date: "2025-05-02T14:30:00" }]
  },
  {
    id: "opp2", type: "sell", submittedBy: "sp1", submittedByName: "James Ashworth",
    status: "Approved", createdAt: "2025-05-03T09:00:00",
    data: { fullName: "Diana Cross", email: "diana@dcross.io", phone: "310-555-0847",
      make: "Lamborghini", model: "Huracán EVO Spyder", year: "2022", vin: "ZHWUD4ZF9NLA12345",
      mileage: "3,200", exteriorColor: "Grigio Lynx", interiorColor: "Nero Ade", askingPrice: "$285,000",
      location: "Beverly Hills, CA", loanStatus: "Clear Title", photoLinks: "drive.google.com/xyz",
      notes: "Very clean, original tires, no incidents." },
    notes: []
  },
  {
    id: "opp3", type: "buy", submittedBy: "sp2", submittedByName: "Celeste Fontaine",
    status: "Submitted", createdAt: "2025-05-08T16:00:00",
    data: { fullName: "Viktor Larsen", email: "vlarsen@larsencap.com", phone: "646-555-0332",
      desiredVehicle: "Rolls-Royce Cullinan Black Badge", preferredSpecs: "Midnight Emerald, bespoke interior",
      budget: "$450,000", timeline: "90 days", paymentType: "Financing",
      tradeIn: "Yes – 2021 Bentley Bentayga V8", notes: "Repeat client. Discretion required." },
    notes: []
  },
];

const INITIAL_NOTIFICATIONS = [
  { id: "n1", userId: "sp1", text: "Your submission for Harrison Welt has been moved to Under Review.", time: "2025-05-02T14:30:00", read: false },
  { id: "n2", userId: "sp1", text: "Your submission for Diana Cross has been marked Approved.", time: "2025-05-04T10:00:00", read: true },
];

export default function App() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [opportunities, setOpportunities] = useState(INITIAL_OPPORTUNITIES);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const login = () => {
    const user = users.find(u => u.email === loginEmail && u.password === loginPassword);
    if (user) { setCurrentUser(user); setLoginError(""); }
    else setLoginError("Invalid credentials. Please try again.");
  };

  const logout = () => {
    setCurrentUser(null);
    setPage("dashboard");
    setLoginEmail("");
    setLoginPassword("");
    setMobileNavOpen(false);
  };

  const navigate = (key) => {
    setPage(key);
    setFormType(null);
    setFormData({});
    setFormSuccess(false);
    setMobileNavOpen(false);
  };

  const myOpps = currentUser
    ? currentUser.role === "admin"
      ? opportunities
      : opportunities.filter(o => o.submittedBy === currentUser.id)
    : [];

  const myNotifs = currentUser ? notifications.filter(n => n.userId === currentUser.id) : [];
  const unreadCount = myNotifs.filter(n => !n.read).length;

  const submitForm = () => {
    const opp = {
      id: `opp${Date.now()}`,
      type: formType,
      submittedBy: currentUser.id,
      submittedByName: currentUser.name,
      status: "Submitted",
      createdAt: new Date().toISOString(),
      data: { ...formData },
      notes: []
    };
    setOpportunities(prev => [...prev, opp]);
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setFormType(null);
      setFormData({});
      setPage("my-opportunities");
    }, 2500);
  };

  const updateStatus = () => {
    if (!newStatus || !selectedOpp) return;
    setOpportunities(prev => prev.map(o => o.id === selectedOpp.id ? { ...o, status: newStatus } : o));
    const notif = {
      id: `n${Date.now()}`,
      userId: selectedOpp.submittedBy,
      text: `Your submission for ${selectedOpp.data.fullName} has been moved to "${newStatus}".`,
      time: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [...prev, notif]);
    setSelectedOpp(prev => ({ ...prev, status: newStatus }));
    setNewStatus("");
  };

  const addNote = () => {
    if (!noteText.trim() || !selectedOpp) return;
    const note = { author: currentUser.name, text: noteText, date: new Date().toISOString() };
    setOpportunities(prev => prev.map(o => o.id === selectedOpp.id ? { ...o, notes: [...o.notes, note] } : o));
    setSelectedOpp(prev => ({ ...prev, notes: [...prev.notes, note] }));
    setNoteText("");
  };

  const addUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) return;
    const u = {
      ...newUser,
      id: `u${Date.now()}`,
      avatar: newUser.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    };
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

  const f = (field) => formData[field] || "";
  const s = (field) => (val) => setFormData(prev => ({ ...prev, [field]: val }));

  // ─── Login screen ───────────────────────────────────────────
  if (!currentUser) {
    return (
      <div className="login-wrap">
        <div className="login-box">
          <div className="login-logo">NORTHVEL</div>
          <div className="login-tagline">Exotic &amp; Luxury Automotive</div>
          <div className="login-divider" />
          <div className="field-group">
            <label className="field-label">Email Address</label>
            <input
              className="field-input"
              type="email"
              value={loginEmail}
              onChange={e => setLoginEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && login()}
              placeholder="partner@northvel.com"
            />
          </div>
          <div className="field-group">
            <label className="field-label">Password</label>
            <input
              className="field-input"
              type="password"
              value={loginPassword}
              onChange={e => setLoginPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && login()}
              placeholder="••••••••"
            />
          </div>
          <button className="btn-primary" onClick={login}>Access Portal</button>
          {loginError && <div className="error-msg">{loginError}</div>}
        </div>
        <div className="login-hint">
          admin@northvel.com / admin123<br />
          james@northvel.com / pass123
        </div>
      </div>
    );
  }

  // ─── Nav items ──────────────────────────────────────────────
  const navItems = [
    { key: "dashboard", label: "Dashboard" },
    { key: "submit-opportunity", label: "Submit Opportunity" },
    { key: "my-opportunities", label: currentUser.role === "admin" ? "All Opportunities" : "My Opportunities" },
    { key: "notifications", label: "Notifications", badge: unreadCount },
    ...(currentUser.role === "admin" ? [{ key: "users", label: "Manage Users" }] : []),
  ];

  // ─── Sidebar ────────────────────────────────────────────────
  const Sidebar = () => (
    <div className={`sidebar${mobileNavOpen ? " mobile-open" : ""}`}>
      <div className="sidebar-logo">
        <div className="logo-n">NORTHVEL</div>
        <div className="logo-sub">Exotic &amp; Luxury Automotive</div>
      </div>
      <div className="sidebar-user">
        <div className="avatar">{currentUser.avatar}</div>
        <div className="user-info">
          <div className="user-name">{currentUser.name}</div>
          <div className="user-role">{currentUser.role === "admin" ? "Administrator" : "Sourcing Partner"}</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <div
            key={item.key}
            className={`nav-item${page === item.key ? " active" : ""}`}
            onClick={() => navigate(item.key)}
          >
            <span>{item.label}</span>
            {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
          </div>
        ))}
      </nav>
      <div className="sidebar-logout">
        <button className="logout-btn" onClick={logout}>Sign Out</button>
      </div>
    </div>
  );

  // ─── Pages ──────────────────────────────────────────────────
  const renderDashboard = () => {
    const total = myOpps.length;
    const active = myOpps.filter(o => !["Closed", "Rejected"].includes(o.status)).length;
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
          <div className="table-wrap">
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
                    <td>
                      <span className={`type-badge ${opp.type === "buy" ? "type-buy" : "type-sell"}`}>
                        {opp.type === "buy" ? "Sourcing" : "Consign"}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: 12, color: "#AAA", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {getVehicleDisplay(opp)}
                      </div>
                    </td>
                    {currentUser.role === "admin" && <td className="opp-partner">{opp.submittedByName}</td>}
                    <td>
                      <span className="status-badge" style={{ background: STATUS_BG[opp.status], color: STATUS_COLORS[opp.status] }}>
                        {opp.status}
                      </span>
                    </td>
                    <td className="opp-date">{formatDate(opp.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
        <div className="table-wrap">
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
                  <td>
                    <div className="opp-name">{opp.data.fullName}</div>
                    <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{opp.data.email}</div>
                  </td>
                  <td>
                    <span className={`type-badge ${opp.type === "buy" ? "type-buy" : "type-sell"}`}>
                      {opp.type === "buy" ? "Sourcing" : "Consign"}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: 12, color: "#AAA", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {getVehicleDisplay(opp)}
                    </div>
                  </td>
                  {currentUser.role === "admin" && <td className="opp-partner">{opp.submittedByName}</td>}
                  <td>
                    <span className="status-badge" style={{ background: STATUS_BG[opp.status], color: STATUS_COLORS[opp.status] }}>
                      {opp.status}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: "#666" }}>{opp.notes.length}</td>
                  <td className="opp-date">{formatDate(opp.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderSubmit = () => {
    if (formSuccess) return (
      <div className="success-state">
        <div className="success-icon">✓</div>
        <div className="success-title">Opportunity Submitted</div>
        <div className="success-sub">Redirecting to your opportunities…</div>
      </div>
    );

    if (!formType) return (
      <div>
        <div className="section-label" style={{ marginBottom: 24 }}>Select Opportunity Type</div>
        <div className="form-type-select">
          <div className="type-option" onClick={() => setFormType("buy")}>
            <div className="type-option-title">Vehicle Sourcing</div>
            <div className="type-option-sub">Client seeking a specific exotic or luxury vehicle</div>
          </div>
          <div className="type-option" onClick={() => setFormType("sell")}>
            <div className="type-option-title">Sell / Consign</div>
            <div className="type-option-sub">Client looking to sell or consign a luxury vehicle</div>
          </div>
        </div>
      </div>
    );

    if (formType === "buy") return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <button className="btn-ghost" onClick={() => setFormType(null)} style={{ padding: "6px 12px" }}>← Back</button>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>Vehicle Sourcing Request</div>
        </div>
        <div className="form-section">
          <div className="form-section-title">Client Information</div>
          <div className="form-grid">
            <div className="field-group">
              <label className="field-label">Full Name *</label>
              <input className="field-input" value={f("fullName")} onChange={e => s("fullName")(e.target.value)} placeholder="Harrison Welt" />
            </div>
            <div className="field-group">
              <label className="field-label">Email *</label>
              <input className="field-input" type="email" value={f("email")} onChange={e => s("email")(e.target.value)} placeholder="client@email.com" />
            </div>
            <div className="field-group">
              <label className="field-label">Phone</label>
              <input className="field-input" value={f("phone")} onChange={e => s("phone")(e.target.value)} placeholder="212-555-0100" />
            </div>
          </div>
        </div>
        <div className="form-section">
          <div className="form-section-title">Vehicle Details</div>
          <div className="form-grid">
            <div className="field-group" style={{ gridColumn: "1/-1" }}>
              <label className="field-label">Desired Vehicle *</label>
              <input className="field-input" value={f("desiredVehicle")} onChange={e => s("desiredVehicle")(e.target.value)} placeholder="e.g. 2024 Ferrari SF90 Stradale" />
            </div>
            <div className="field-group" style={{ gridColumn: "1/-1" }}>
              <label className="field-label">Preferred Specs</label>
              <textarea className="field-textarea" value={f("preferredSpecs")} onChange={e => s("preferredSpecs")(e.target.value)} placeholder="Color, interior, options, packages…" />
            </div>
            <div className="field-group">
              <label className="field-label">Budget</label>
              <input className="field-input" value={f("budget")} onChange={e => s("budget")(e.target.value)} placeholder="$500,000" />
            </div>
            <div className="field-group">
              <label className="field-label">Timeline</label>
              <input className="field-input" value={f("timeline")} onChange={e => s("timeline")(e.target.value)} placeholder="60 days, ASAP, etc." />
            </div>
            <div className="field-group">
              <label className="field-label">Payment Method</label>
              <select className="field-select" value={f("paymentType")} onChange={e => s("paymentType")(e.target.value)}>
                <option value="">Select…</option>
                <option>Cash</option>
                <option>Financing</option>
                <option>Undecided</option>
              </select>
            </div>
            <div className="field-group">
              <label className="field-label">Trade-In</label>
              <select className="field-select" value={f("tradeIn")} onChange={e => s("tradeIn")(e.target.value)}>
                <option value="">Select…</option>
                <option>No</option>
                <option>Yes</option>
                <option>Possibly</option>
              </select>
            </div>
            <div className="field-group" style={{ gridColumn: "1/-1" }}>
              <label className="field-label">Additional Notes</label>
              <textarea className="field-textarea" value={f("notes")} onChange={e => s("notes")(e.target.value)} placeholder="Any additional context or preferences…" />
            </div>
          </div>
        </div>
        <button className="btn-primary" style={{ width: "auto", padding: "13px 48px" }} onClick={submitForm} disabled={!f("fullName") || !f("desiredVehicle")}>
          Submit Opportunity
        </button>
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
            <div className="field-group">
              <label className="field-label">Full Name *</label>
              <input className="field-input" value={f("fullName")} onChange={e => s("fullName")(e.target.value)} placeholder="Diana Cross" />
            </div>
            <div className="field-group">
              <label className="field-label">Email *</label>
              <input className="field-input" type="email" value={f("email")} onChange={e => s("email")(e.target.value)} placeholder="client@email.com" />
            </div>
            <div className="field-group">
              <label className="field-label">Phone</label>
              <input className="field-input" value={f("phone")} onChange={e => s("phone")(e.target.value)} placeholder="310-555-0100" />
            </div>
          </div>
        </div>
        <div className="form-section">
          <div className="form-section-title">Vehicle Information</div>
          <div className="form-grid">
            <div className="field-group">
              <label className="field-label">Make *</label>
              <input className="field-input" value={f("make")} onChange={e => s("make")(e.target.value)} placeholder="Lamborghini" />
            </div>
            <div className="field-group">
              <label className="field-label">Model *</label>
              <input className="field-input" value={f("model")} onChange={e => s("model")(e.target.value)} placeholder="Huracán EVO Spyder" />
            </div>
            <div className="field-group">
              <label className="field-label">Year</label>
              <input className="field-input" value={f("year")} onChange={e => s("year")(e.target.value)} placeholder="2022" />
            </div>
            <div className="field-group">
              <label className="field-label">VIN</label>
              <input className="field-input" value={f("vin")} onChange={e => s("vin")(e.target.value)} placeholder="ZHWUD4ZF9NLA12345" />
            </div>
            <div className="field-group">
              <label className="field-label">Mileage</label>
              <input className="field-input" value={f("mileage")} onChange={e => s("mileage")(e.target.value)} placeholder="3,200" />
            </div>
            <div className="field-group">
              <label className="field-label">Exterior Color</label>
              <input className="field-input" value={f("exteriorColor")} onChange={e => s("exteriorColor")(e.target.value)} placeholder="Grigio Lynx" />
            </div>
            <div className="field-group">
              <label className="field-label">Interior Color</label>
              <input className="field-input" value={f("interiorColor")} onChange={e => s("interiorColor")(e.target.value)} placeholder="Nero Ade" />
            </div>
            <div className="field-group">
              <label className="field-label">Asking Price</label>
              <input className="field-input" value={f("askingPrice")} onChange={e => s("askingPrice")(e.target.value)} placeholder="$285,000" />
            </div>
            <div className="field-group">
              <label className="field-label">Vehicle Location</label>
              <input className="field-input" value={f("location")} onChange={e => s("location")(e.target.value)} placeholder="Beverly Hills, CA" />
            </div>
            <div className="field-group">
              <label className="field-label">Loan / Title Status</label>
              <select className="field-select" value={f("loanStatus")} onChange={e => s("loanStatus")(e.target.value)}>
                <option value="">Select…</option>
                <option>Clear Title</option>
                <option>Active Loan</option>
                <option>Lease</option>
                <option>Unknown</option>
              </select>
            </div>
            <div className="field-group" style={{ gridColumn: "1/-1" }}>
              <label className="field-label">Photo Upload or Photo Links</label>
              <input className="field-input" value={f("photoLinks")} onChange={e => s("photoLinks")(e.target.value)} placeholder="drive.google.com/… or dropbox.com/…" />
            </div>
            <div className="field-group" style={{ gridColumn: "1/-1" }}>
              <label className="field-label">Additional Notes</label>
              <textarea className="field-textarea" value={f("notes")} onChange={e => s("notes")(e.target.value)} placeholder="Condition, history, modifications, seller situation…" />
            </div>
          </div>
        </div>
        <button className="btn-primary" style={{ width: "auto", padding: "13px 48px" }} onClick={submitForm} disabled={!f("fullName") || !f("make") || !f("model")}>
          Submit Opportunity
        </button>
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
        <div className="empty-state">
          <div className="empty-icon">◯</div>
          <div className="empty-title">No notifications</div>
          <div className="empty-sub">Status updates will appear here.</div>
        </div>
      ) : myNotifs.slice().reverse().map(n => (
        <div key={n.id} className={`notif-item${!n.read ? " unread" : ""}`}>
          <div className={`notif-dot${n.read ? " read" : ""}`} />
          <div>
            <div className="notif-text">{n.text}</div>
            <div className="notif-time">{formatDate(n.time)}</div>
          </div>
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
            <div className="field-group">
              <label className="field-label">Full Name</label>
              <input className="field-input" value={newUser.name} onChange={e => setNewUser(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="field-group">
              <label className="field-label">Email</label>
              <input className="field-input" type="email" value={newUser.email} onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div className="field-group">
              <label className="field-label">Password</label>
              <input className="field-input" type="text" value={newUser.password} onChange={e => setNewUser(p => ({ ...p, password: e.target.value }))} />
            </div>
            <div className="field-group">
              <label className="field-label">Role</label>
              <select className="field-select" value={newUser.role} onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))}>
                <option value="sourcing_partner">Sourcing Partner</option>
                <option value="admin">Admin</option>
              </select>
            </div>
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
              <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 400, marginBottom: 6 }}>
                {opp.data.fullName}
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <span className={`type-badge ${isBuy ? "type-buy" : "type-sell"}`}>
                  {isBuy ? "Sourcing Request" : "Sell / Consign"}
                </span>
                <span className="status-badge" style={{ background: STATUS_BG[opp.status], color: STATUS_COLORS[opp.status] }}>
                  {opp.status}
                </span>
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
              {currentUser.role === "admin" && (
                <div className="detail-row"><span className="detail-key">Submitted by</span><span className="detail-val">{opp.submittedByName}</span></div>
              )}
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
                  {opp.data.photoLinks && (
                    <div className="detail-row"><span className="detail-key">Photos</span><span className="detail-val" style={{ color: "var(--gold)", wordBreak: "break-all" }}>{opp.data.photoLinks}</span></div>
                  )}
                </>
              )}
              {opp.data.notes && (
                <div className="detail-row" style={{ flexDirection: "column", gap: 6 }}>
                  <span className="detail-key">Notes</span>
                  <span className="detail-val" style={{ textAlign: "left", lineHeight: 1.6 }}>{opp.data.notes}</span>
                </div>
              )}
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
                  <textarea
                    className="note-input"
                    placeholder="Add internal note…"
                    value={noteText}
                    onChange={e => setNoteText(e.target.value)}
                  />
                  <button className="btn-secondary" onClick={addNote} disabled={!noteText.trim()}>Add Note</button>
                </div>
              )}
              {currentUser.role !== "admin" && opp.notes.length === 0 && (
                <div style={{ fontSize: 12, color: "var(--muted2)" }}>No notes yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const pages = {
    dashboard: {
      title: "Dashboard",
      subtitle: currentUser.role === "admin" ? "Full Pipeline Overview" : "Your Opportunity Pipeline",
      render: renderDashboard
    },
    "submit-opportunity": { title: "Submit Opportunity", subtitle: "New Client Intake", render: renderSubmit },
    "my-opportunities": {
      title: currentUser.role === "admin" ? "All Opportunities" : "My Opportunities",
      subtitle: currentUser.role === "admin" ? "Complete Submission Log" : "Your Submitted Opportunities",
      render: renderOpportunities
    },
    notifications: { title: "Notifications", subtitle: "Status Updates & Alerts", render: renderNotifications },
    ...(currentUser.role === "admin" ? { users: { title: "Manage Users", subtitle: "Sourcing Partners & Admins", render: renderUsers } } : {}),
  };

  const currentPage = pages[page] || pages.dashboard;

  return (
    <div className="app">
      {/* Mobile header */}
      <div className="mobile-header">
        <div className="mobile-logo">NORTHVEL</div>
        <button className="hamburger" onClick={() => setMobileNavOpen(o => !o)}>
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileNavOpen && (
        <div className="mobile-overlay" onClick={() => setMobileNavOpen(false)} />
      )}

      <Sidebar />

      <div className="main">
        <div className="topbar">
          <div>
            <div className="page-title">{currentPage.title}</div>
            <div className="page-subtitle">{currentPage.subtitle}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {currentUser.role === "admin" && (
              <div className="admin-chip">Admin</div>
            )}
            <div className="topbar-date">
              {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </div>
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
