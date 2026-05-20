@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Karla:wght@300;400;500;600&display=swap');

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --black: #0A0A0A;
  --dark: #111111;
  --dark2: #181818;
  --dark3: #222222;
  --border: rgba(255, 255, 255, 0.08);
  --border2: rgba(255, 255, 255, 0.14);
  --gold: #C9A84C;
  --gold-light: #E2C97E;
  --white: #F5F3EE;
  --muted: #888888;
  --muted2: #555555;
  --font-display: 'Cormorant Garamond', serif;
  --font-body: 'Karla', sans-serif;
}

html, body, #root {
  height: 100%;
}

body {
  background: var(--black);
  color: var(--white);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ─── Layout ─────────────────────────────────────────────── */
.app {
  display: flex;
  min-height: 100vh;
  background: var(--black);
  color: var(--white);
  font-family: var(--font-body);
}

/* ─── Sidebar ─────────────────────────────────────────────── */
.sidebar {
  width: 240px;
  min-height: 100vh;
  background: var(--dark);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
}

.sidebar-logo {
  padding: 28px 24px 20px;
  border-bottom: 1px solid var(--border);
}

.logo-n {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 300;
  color: var(--gold);
  letter-spacing: 0.12em;
}

.logo-sub {
  font-size: 9px;
  letter-spacing: 0.35em;
  color: var(--muted);
  text-transform: uppercase;
  margin-top: 2px;
}

.sidebar-user {
  padding: 16px 24px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--dark3);
  border: 1px solid var(--border2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 500;
  color: var(--gold);
  letter-spacing: 0.05em;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 12px;
  font-weight: 500;
  color: var(--white);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 10px;
  color: var(--muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-top: 1px;
}

.sidebar-nav {
  flex: 1;
  padding: 12px 0;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 24px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.2s;
  border-left: 2px solid transparent;
  user-select: none;
}

.nav-item:hover {
  color: var(--white);
  background: rgba(255, 255, 255, 0.03);
}

.nav-item.active {
  color: var(--gold);
  border-left-color: var(--gold);
  background: rgba(201, 168, 76, 0.05);
}

.nav-badge {
  margin-left: auto;
  background: var(--gold);
  color: var(--black);
  font-size: 9px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.sidebar-logout {
  padding: 16px 24px;
  border-top: 1px solid var(--border);
}

.logout-btn {
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  background: none;
  border: none;
  color: var(--muted);
  transition: color 0.2s;
  font-family: var(--font-body);
  padding: 0;
}

.logout-btn:hover {
  color: var(--white);
}

/* ─── Mobile hamburger ────────────────────────────────────── */
.mobile-header {
  display: none;
  background: var(--dark);
  border-bottom: 1px solid var(--border);
  padding: 14px 20px;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 50;
}

.mobile-logo {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 300;
  color: var(--gold);
  letter-spacing: 0.12em;
}

.hamburger {
  background: none;
  border: none;
  color: var(--muted);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 4px;
}

.hamburger span {
  display: block;
  width: 22px;
  height: 1px;
  background: var(--muted);
  transition: background 0.2s;
}

.hamburger:hover span {
  background: var(--white);
}

.mobile-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 90;
}

.sidebar.mobile-open {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  height: 100vh;
  animation: slideInLeft 0.25s ease;
}

@keyframes slideInLeft {
  from { transform: translateX(-100%); }
  to   { transform: translateX(0); }
}

/* ─── Main content ────────────────────────────────────────── */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 100vh;
}

.topbar {
  background: var(--dark);
  border-bottom: 1px solid var(--border);
  padding: 16px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 40;
}

.page-title {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 400;
  color: var(--white);
  letter-spacing: 0.04em;
}

.page-subtitle {
  font-size: 11px;
  color: var(--muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-top: 2px;
}

.content {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
}

/* ─── Login ───────────────────────────────────────────────── */
.login-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--black);
  flex-direction: column;
  padding: 24px;
}

.login-box {
  background: var(--dark);
  border: 1px solid var(--border);
  padding: 48px 40px;
  width: 100%;
  max-width: 380px;
}

.login-logo {
  font-family: var(--font-display);
  font-size: 42px;
  font-weight: 300;
  color: var(--gold);
  letter-spacing: 0.15em;
  text-align: center;
}

.login-tagline {
  text-align: center;
  font-size: 10px;
  letter-spacing: 0.3em;
  color: var(--muted);
  text-transform: uppercase;
  margin-top: 4px;
  margin-bottom: 36px;
}

.login-divider {
  width: 40px;
  height: 1px;
  background: var(--gold);
  margin: 0 auto 36px;
}

.login-hint {
  margin-top: 20px;
  font-size: 10px;
  color: #3a3a3a;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-align: center;
  line-height: 1.8;
}

/* ─── Form elements ───────────────────────────────────────── */
.field-label {
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 8px;
  display: block;
}

.field-group {
  margin-bottom: 20px;
}

.field-input {
  width: 100%;
  background: var(--dark2);
  border: 1px solid var(--border);
  color: var(--white);
  font-family: var(--font-body);
  font-size: 13px;
  padding: 11px 14px;
  outline: none;
  transition: border-color 0.2s;
  border-radius: 0;
}

.field-input:focus {
  border-color: var(--gold);
}

.field-input::placeholder {
  color: var(--muted2);
}

.field-select {
  width: 100%;
  background: var(--dark2);
  border: 1px solid var(--border);
  color: var(--white);
  font-family: var(--font-body);
  font-size: 13px;
  padding: 11px 14px;
  outline: none;
  transition: border-color 0.2s;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  border-radius: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23555' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 36px;
}

.field-select:focus {
  border-color: var(--gold);
}

.field-select option {
  background: var(--dark2);
  color: var(--white);
}

.field-textarea {
  width: 100%;
  background: var(--dark2);
  border: 1px solid var(--border);
  color: var(--white);
  font-family: var(--font-body);
  font-size: 13px;
  padding: 11px 14px;
  outline: none;
  transition: border-color 0.2s;
  resize: vertical;
  min-height: 80px;
  border-radius: 0;
}

.field-textarea:focus {
  border-color: var(--gold);
}

.field-textarea::placeholder {
  color: var(--muted2);
}

/* ─── Buttons ─────────────────────────────────────────────── */
.btn-primary {
  width: 100%;
  background: var(--gold);
  color: var(--black);
  border: none;
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  padding: 13px;
  cursor: pointer;
  transition: background 0.2s;
  border-radius: 0;
}

.btn-primary:hover {
  background: var(--gold-light);
}

.btn-primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-secondary {
  background: transparent;
  color: var(--gold);
  border: 1px solid var(--gold);
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 0;
}

.btn-secondary:hover {
  background: rgba(201, 168, 76, 0.1);
}

.btn-secondary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-ghost {
  background: transparent;
  color: var(--muted);
  border: 1px solid var(--border);
  font-family: var(--font-body);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 0;
}

.btn-ghost:hover {
  color: var(--white);
  border-color: var(--border2);
}

.error-msg {
  font-size: 12px;
  color: #C04A4A;
  margin-top: 12px;
  text-align: center;
}

/* ─── Dashboard stats ─────────────────────────────────────── */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background: var(--dark);
  border: 1px solid var(--border);
  padding: 20px 24px;
}

.stat-label {
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 10px;
}

.stat-value {
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 300;
  color: var(--white);
  line-height: 1;
}

.stat-sub {
  font-size: 11px;
  color: var(--muted);
  margin-top: 6px;
}

.gold-text { color: var(--gold); }

.section-label {
  font-size: 10px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
}

/* ─── Opportunities table ─────────────────────────────────── */
.table-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.opp-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

.opp-table th {
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
  font-weight: 400;
  text-align: left;
  padding: 10px 16px;
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}

.opp-table td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
  font-size: 13px;
  vertical-align: middle;
}

.opp-table tbody tr {
  cursor: pointer;
  transition: background 0.15s;
}

.opp-table tbody tr:hover td {
  background: rgba(255, 255, 255, 0.02);
}

.type-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 9px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 2px;
  font-weight: 500;
  white-space: nowrap;
}

.type-buy {
  background: rgba(30, 60, 100, 0.4);
  color: #7EB4E8;
  border: 1px solid rgba(126, 180, 232, 0.2);
}

.type-sell {
  background: rgba(80, 50, 10, 0.4);
  color: #E8B87E;
  border: 1px solid rgba(232, 184, 126, 0.2);
}

.status-badge {
  display: inline-block;
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 2px;
  font-weight: 500;
  white-space: nowrap;
}

.opp-name {
  font-weight: 500;
  color: var(--white);
}

.opp-vehicle {
  color: var(--muted);
  font-size: 12px;
  margin-top: 2px;
}

.opp-date {
  font-size: 11px;
  color: var(--muted);
  white-space: nowrap;
}

.opp-partner {
  font-size: 12px;
  color: var(--muted);
}

/* ─── Detail slide panel ──────────────────────────────────── */
.detail-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 100;
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
}

.detail-panel {
  width: 520px;
  max-width: 100vw;
  background: var(--dark);
  border-left: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  animation: slideIn 0.25s ease;
}

@keyframes slideIn {
  from { transform: translateX(40px); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
}

.detail-header {
  padding: 24px 28px;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-shrink: 0;
}

.detail-body {
  padding: 28px;
  flex: 1;
  overflow-y: auto;
}

.close-btn {
  background: none;
  border: none;
  color: var(--muted);
  font-size: 22px;
  cursor: pointer;
  line-height: 1;
  padding: 0 0 0 12px;
  transition: color 0.2s;
  flex-shrink: 0;
}

.close-btn:hover { color: var(--white); }

.detail-section { margin-bottom: 28px; }

.detail-section-title {
  font-size: 10px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 14px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
  gap: 16px;
}

.detail-key {
  font-size: 11px;
  color: var(--muted);
  flex-shrink: 0;
}

.detail-val {
  font-size: 12px;
  color: var(--white);
  text-align: right;
  word-break: break-word;
}

.note-card {
  background: var(--dark2);
  border: 1px solid var(--border);
  padding: 14px 16px;
  margin-bottom: 10px;
  border-left: 2px solid var(--gold);
}

.note-author {
  font-size: 10px;
  color: var(--gold);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.note-date {
  font-size: 10px;
  color: var(--muted);
  float: right;
}

.note-text {
  font-size: 12px;
  color: var(--white);
  margin-top: 6px;
  line-height: 1.6;
  clear: both;
}

.note-input {
  width: 100%;
  background: var(--dark2);
  border: 1px solid var(--border);
  color: var(--white);
  font-family: var(--font-body);
  font-size: 12px;
  padding: 10px 12px;
  resize: none;
  min-height: 70px;
  outline: none;
  margin-bottom: 10px;
  border-radius: 0;
  transition: border-color 0.2s;
}

.note-input:focus { border-color: var(--gold); }
.note-input::placeholder { color: var(--muted2); }

/* ─── Submit forms ────────────────────────────────────────── */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-section { margin-bottom: 32px; }

.form-section-title {
  font-size: 10px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(201, 168, 76, 0.2);
}

.form-type-select {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 32px;
}

.type-option {
  background: var(--dark2);
  border: 1px solid var(--border);
  padding: 28px 24px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  user-select: none;
}

.type-option:hover { border-color: var(--border2); }

.type-option.selected {
  border-color: var(--gold);
  background: rgba(201, 168, 76, 0.05);
}

.type-option-title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 400;
  color: var(--white);
  margin-bottom: 8px;
  letter-spacing: 0.04em;
}

.type-option-sub {
  font-size: 11px;
  color: var(--muted);
  line-height: 1.5;
}

/* ─── Notifications ───────────────────────────────────────── */
.notif-item {
  background: var(--dark);
  border: 1px solid var(--border);
  padding: 16px 20px;
  margin-bottom: 10px;
  display: flex;
  gap: 14px;
  align-items: flex-start;
  border-left: 2px solid transparent;
  transition: border-color 0.2s;
}

.notif-item.unread { border-left-color: var(--gold); }

.notif-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--gold);
  flex-shrink: 0;
  margin-top: 5px;
}

.notif-dot.read { background: var(--muted2); }

.notif-text {
  font-size: 13px;
  color: var(--white);
  line-height: 1.5;
}

.notif-time {
  font-size: 11px;
  color: var(--muted);
  margin-top: 4px;
}

/* ─── Admin user cards ────────────────────────────────────── */
.user-card {
  background: var(--dark);
  border: 1px solid var(--border);
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 10px;
}

.user-card-info { flex: 1; }
.user-card-name { font-size: 14px; font-weight: 500; color: var(--white); }
.user-card-email { font-size: 12px; color: var(--muted); margin-top: 2px; }

.role-chip {
  font-size: 9px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 2px;
  white-space: nowrap;
}

.role-admin {
  background: rgba(201, 168, 76, 0.15);
  color: var(--gold);
  border: 1px solid rgba(201, 168, 76, 0.3);
}

.role-sp {
  background: rgba(255, 255, 255, 0.05);
  color: var(--muted);
  border: 1px solid var(--border);
}

/* ─── Modal ───────────────────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal-box {
  background: var(--dark);
  border: 1px solid var(--border2);
  padding: 36px;
  width: 100%;
  max-width: 420px;
}

.modal-title {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 400;
  color: var(--white);
  margin-bottom: 24px;
  letter-spacing: 0.04em;
}

/* ─── Empty state ─────────────────────────────────────────── */
.empty-state {
  text-align: center;
  padding: 80px 0;
}

.empty-icon {
  font-size: 36px;
  margin-bottom: 16px;
  opacity: 0.15;
  color: var(--gold);
}

.empty-title {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 400;
  color: var(--muted);
  margin-bottom: 8px;
}

.empty-sub {
  font-size: 12px;
  color: var(--muted2);
  letter-spacing: 0.05em;
}

/* ─── Success ─────────────────────────────────────────────── */
.success-state {
  text-align: center;
  padding: 80px 0;
}

.success-icon {
  font-size: 40px;
  color: var(--gold);
  margin-bottom: 16px;
}

.success-title {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 400;
  color: var(--gold);
  margin-bottom: 8px;
  letter-spacing: 0.06em;
}

.success-sub {
  font-size: 12px;
  color: var(--muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* ─── Admin badge in topbar ───────────────────────────────── */
.admin-chip {
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--gold);
  background: rgba(201, 168, 76, 0.08);
  border: 1px solid rgba(201, 168, 76, 0.2);
  padding: 4px 10px;
}

.topbar-date {
  font-size: 12px;
  color: var(--muted);
}

/* ─── Responsive ──────────────────────────────────────────── */
@media (max-width: 900px) {
  .stat-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
    width: 260px;
  }
  .sidebar.mobile-open {
    display: flex;
  }
  .mobile-header { display: flex; }
  .mobile-overlay { display: block; }
  .content { padding: 20px 16px; }
  .topbar { padding: 12px 16px; display: none; }
  .form-grid { grid-template-columns: 1fr; }
  .form-type-select { grid-template-columns: 1fr; }
  .stat-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
  .stat-card { padding: 14px 16px; }
  .stat-value { font-size: 26px; }
  .login-box { padding: 36px 24px; }
  .detail-panel { width: 100vw; }
  .modal-box { padding: 24px; }
}

@media (max-width: 480px) {
  .stat-grid { grid-template-columns: 1fr 1fr; }
}
