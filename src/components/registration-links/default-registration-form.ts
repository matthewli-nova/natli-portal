// Default Registration Form HTML Template
// Uses {{mustache}} placeholders for dynamic values
export function getDefaultRegistrationFormHtml(params: {
  eventName: string
  ticketTypeName: string
  ticketTypeColor: string
  allowCompanions?: boolean
  maxCompanions?: number
  companionDetailsLevel?: 'names-only' | 'full-details'
}): string {
  const { eventName, ticketTypeName, ticketTypeColor, allowCompanions = false, maxCompanions = 0, companionDetailsLevel = 'names-only' } = params

  // Generate companion fields HTML based on detail level
  const generateCompanionFields = () => {
    if (companionDetailsLevel === 'full-details') {
      // Full details mode: all fields like main attendee
      return `
          <div id="companionList">
            <div class="companion-row-full">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
                <h4 style="margin: 0; font-size: 14px; font-weight: 600; color: var(--text);">Companion 1</h4>
                <button type="button" class="companion-remove" aria-label="Remove companion">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
                </button>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Salutation <span class="optional">optional</span></label><select class="form-input form-select"><option value="">Select</option><option>Mr</option><option>Mrs</option><option>Ms</option><option>Dr</option><option>Prof</option></select></div>
                <div class="form-group"><label>Title <span class="optional">optional</span></label><input type="text" class="form-input" placeholder="e.g. Director of Marketing"></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>First Name <span class="required">*</span></label><input type="text" class="form-input" placeholder="e.g. Sarah" required></div>
                <div class="form-group"><label>Last Name <span class="required">*</span></label><input type="text" class="form-input" placeholder="e.g. Chen" required></div>
              </div>
              <div class="form-row full">
                <div class="form-group"><label>Email <span class="required">*</span></label><input type="email" class="form-input" placeholder="e.g. sarah.chen@example.com" required></div>
              </div>
              <div class="form-row full">
                <div class="form-group"><label>Organization <span class="optional">optional</span></label><input type="text" class="form-input" placeholder="e.g. Hong Kong Tourism Board"></div>
              </div>
              <div class="form-row full">
                <div class="form-group"><label>Phone Number <span class="optional">optional</span></label>
                  <div class="phone-group"><select class="form-input form-select"><option>+852</option><option>+86</option><option>+60</option><option>+66</option><option>+65</option><option>+81</option><option>+82</option><option>+886</option><option>+44</option><option>+1</option></select><input type="tel" class="form-input" placeholder="e.g. 9123 4567"></div>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>WeChat ID <span class="optional">optional</span></label><input type="text" class="form-input" placeholder="e.g. sarah_wx"></div>
                <div class="form-group"><label>Preferred Language <span class="optional">optional</span></label><select class="form-input form-select"><option value="en">English</option><option value="zh_tw">繁體中文</option><option value="zh_sc">简体中文</option></select></div>
              </div>
            </div>
          </div>`
    } else {
      // Names only mode: just first and last name
      return `
          <div id="companionList">
            <div class="companion-row">
              <div class="form-group" style="margin-bottom:0"><label style="font-size:12px">First Name <span class="required">*</span></label><input type="text" class="form-input" placeholder="First name"></div>
              <div class="form-group" style="margin-bottom:0"><label style="font-size:12px">Last Name <span class="required">*</span></label><input type="text" class="form-input" placeholder="Last name"></div>
              <button type="button" class="companion-remove" aria-label="Remove companion">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
              </button>
            </div>
          </div>`
    }
  }

  // Companion section HTML (conditionally included)
  const companionSectionHtml = allowCompanions && maxCompanions > 0 ? `
    <!-- COMPANIONS -->
    <div class="section">
      <div class="section-header">
        <p class="section-label">Step 3</p>
        <h2 class="section-title">Companions</h2>
        <p class="section-subtitle">Bringing guests along? Each companion receives their own QR code for entry.</p>
      </div>
      <div class="section-body">
        ${generateCompanionFields()}
        <button type="button" class="add-companion-btn" id="addCompanionBtn">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          Add Companion
        </button>
        <p class="companion-counter">0 of ${maxCompanions} companions added</p>
      </div>
    </div>
  ` : ''
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Register — ${eventName || 'Event Registration'}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=DM+Serif+Display&display=swap" rel="stylesheet">
<style>
:root {
  --primary: #107DAC;
  --primary-dark: #0d6390;
  --primary-light: #e8f6fc;
  --primary-glow: rgba(16,125,172,0.15);
  --dark: #0f1729;
  --dark-secondary: #1a2540;
  --text: #1a1a2e;
  --text-secondary: #5a6178;
  --text-muted: #8c93a8;
  --bg: #f3f5f9;
  --card: #ffffff;
  --border: #e2e6ef;
  --border-light: #eef1f6;
  --danger: #e5484d;
  --warning-bg: #fefce8;
  --warning-border: #fde047;
  --warning-text: #854d0e;
  --success: #30a46c;
  --radius: 14px;
  --radius-sm: 10px;
  --radius-xs: 7px;
  --shadow-sm: 0 1px 3px rgba(15,23,41,0.04), 0 1px 2px rgba(15,23,41,0.02);
  --shadow-md: 0 4px 16px rgba(15,23,41,0.06), 0 1px 3px rgba(15,23,41,0.04);
  --shadow-lg: 0 12px 40px rgba(15,23,41,0.08), 0 4px 12px rgba(15,23,41,0.04);
  --shadow-glow: 0 0 0 3px var(--primary-glow), 0 4px 16px rgba(16,125,172,0.12);
  --font: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-display: 'DM Serif Display', Georgia, serif;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { font-family: var(--font); background: var(--bg); color: var(--text); -webkit-font-smoothing: antialiased; min-height: 100vh; }

/* HERO */
.hero { position: relative; background: linear-gradient(135deg, var(--dark) 0%, var(--dark-secondary) 50%, #0a3d3a 100%); overflow: hidden; }
.hero::before { content: ''; position: absolute; top: -40%; right: -20%; width: 70%; height: 180%; background: radial-gradient(ellipse, rgba(16,125,172,0.25) 0%, transparent 70%); pointer-events: none; }
.hero::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 120px; background: linear-gradient(to top, var(--bg), transparent); pointer-events: none; z-index: 1; }
.hero-inner { position: relative; z-index: 2; max-width: 680px; margin: 0 auto; padding: 48px 24px 72px; }
.hero-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(16,125,172,0.15); border: 1px solid rgba(16,125,172,0.25); color: var(--primary); font-size: 11px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; padding: 6px 14px; border-radius: 100px; margin-bottom: 20px; backdrop-filter: blur(8px); }
.hero-badge .dot { width: 6px; height: 6px; background: var(--primary); border-radius: 50%; animation: pulse-dot 2s ease-in-out infinite; }
@keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
.hero h1 { font-family: var(--font-display); font-size: clamp(28px, 5vw, 40px); font-weight: 400; color: #ffffff; line-height: 1.2; margin-bottom: 16px; }
.hero-description { font-size: 15px; line-height: 1.65; color: rgba(255,255,255,0.6); max-width: 520px; margin-bottom: 28px; }
.hero-meta { display: flex; flex-wrap: wrap; gap: 24px; }
.hero-meta-item { display: flex; align-items: center; gap: 10px; color: rgba(255,255,255,0.85); font-size: 14px; font-weight: 500; }
.hero-meta-item svg { flex-shrink: 0; opacity: 0.5; }

/* CONTAINER */
.container { max-width: 680px; margin: -36px auto 0; padding: 0 24px 64px; position: relative; z-index: 3; }

/* SECTIONS */
.section { background: var(--card); border-radius: var(--radius); border: 1px solid var(--border); box-shadow: var(--shadow-sm); margin-bottom: 16px; overflow: hidden; animation: rise 0.5s ease-out both; }
.section:nth-child(2) { animation-delay: 0.06s; }
.section:nth-child(3) { animation-delay: 0.12s; }
.section:nth-child(4) { animation-delay: 0.18s; }
@keyframes rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
.section-header { padding: 24px 28px 0; }
.section-label { font-size: 11px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px; }
.section-title { font-family: var(--font-display); font-size: 22px; color: var(--text); }
.section-subtitle { font-size: 13px; color: var(--text-secondary); margin-top: 4px; line-height: 1.5; }
.section-body { padding: 20px 28px 28px; }

/* TICKETS */
.ticket-group-label { font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; padding-left: 2px; }
.ticket-group-label:not(:first-child) { margin-top: 20px; }
.ticket-card { position: relative; border: 2px solid var(--border); border-radius: var(--radius-sm); padding: 18px 20px; margin-bottom: 10px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: flex-start; gap: 14px; }
.ticket-card:hover { border-color: #c0c6d4; box-shadow: var(--shadow-sm); }
.ticket-card.selected { border-color: var(--primary); background: var(--primary-light); box-shadow: var(--shadow-glow); }
.ticket-card.disabled { opacity: 0.45; cursor: not-allowed; pointer-events: none; }
.ticket-radio, .ticket-check { flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%; border: 2px solid #c8cedb; display: flex; align-items: center; justify-content: center; margin-top: 1px; transition: all 0.2s ease; }
.ticket-check { border-radius: 6px; }
.ticket-card.selected .ticket-radio, .ticket-card.selected .ticket-check { border-color: var(--primary); background: var(--primary); }
.ticket-radio::after, .ticket-check::after { content: ''; display: block; opacity: 0; transition: opacity 0.15s ease; }
.ticket-radio::after { width: 8px; height: 8px; border-radius: 50%; background: #fff; }
.ticket-check::after { width: 12px; height: 12px; background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M2.5 6l2.5 2.5 4.5-5' stroke='white' stroke-width='1.8' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/contain no-repeat; }
.ticket-card.selected .ticket-radio::after, .ticket-card.selected .ticket-check::after { opacity: 1; }
.ticket-info { flex: 1; min-width: 0; }
.ticket-name { font-size: 15px; font-weight: 600; color: var(--text); display: flex; align-items: center; gap: 8px; }
.ticket-colour-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.ticket-desc { font-size: 13px; color: var(--text-secondary); margin-top: 3px; line-height: 1.4; }
.ticket-meta { display: flex; align-items: center; gap: 12px; margin-top: 8px; flex-wrap: wrap; }
.ticket-badge { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 100px; letter-spacing: 0.3px; }
.ticket-badge.free { background: #ecfdf3; color: #166534; }
.ticket-badge.scope { background: #f0f4ff; color: #3451b2; }
.ticket-quota { font-size: 12px; font-weight: 500; color: var(--text-muted); }
.ticket-quota.low { color: #e5484d; font-weight: 600; }
.ticket-quota.sold-out { color: #e5484d; font-weight: 700; }
.sub-events { max-height: 0; overflow: hidden; transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease; opacity: 0; }
.sub-events.visible { max-height: 800px; opacity: 1; }
.sub-event-divider { display: flex; align-items: center; gap: 12px; margin: 20px 0 14px; font-size: 12px; color: var(--text-muted); font-weight: 500; }
.sub-event-divider::after { content: ''; flex: 1; height: 1px; background: var(--border-light); }

/* FORM */
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-row.full { grid-template-columns: 1fr; }
.form-group { margin-bottom: 18px; }
.form-group label { display: block; font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 6px; }
.form-group label .required { color: var(--danger); margin-left: 2px; }
.form-group label .optional { color: var(--text-muted); font-weight: 400; font-size: 12px; margin-left: 4px; }
.form-input, .form-select { width: 100%; height: 46px; padding: 0 16px; font-size: 14px; font-family: var(--font); color: var(--text); background: var(--card); border: 1.5px solid var(--border); border-radius: var(--radius-xs); outline: none; transition: all 0.2s ease; -webkit-appearance: none; }
.form-input::placeholder { color: #b4baca; }
.form-input:hover { border-color: #c0c6d4; }
.form-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-glow); }
.form-input.error { border-color: var(--danger); box-shadow: 0 0 0 3px rgba(229,72,77,0.1); }
.form-select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath d='M4 6l4 4 4-4' stroke='%238c93a8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 40px; cursor: pointer; }
.form-error { font-size: 12px; color: var(--danger); margin-top: 5px; display: none; }
.form-group.has-error .form-error { display: block; }
.form-group.has-error .form-input { border-color: var(--danger); }
.phone-group { display: grid; grid-template-columns: 110px 1fr; gap: 8px; }

/* COMPANIONS */
.companion-row { display: grid; grid-template-columns: 1fr 1fr 40px; gap: 10px; align-items: end; margin-bottom: 10px; animation: rise 0.25s ease-out; }
.companion-row-full { padding: 24px; border: 1.5px solid var(--border); border-radius: var(--radius-sm); margin-bottom: 16px; background: var(--bg); animation: rise 0.25s ease-out; }
.companion-row-full .companion-remove { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: var(--card); border: 1.5px solid var(--border); border-radius: var(--radius-xs); color: var(--text-muted); cursor: pointer; transition: all 0.15s ease; }
.companion-row-full .companion-remove:hover { border-color: var(--danger); color: var(--danger); background: rgba(229,72,77,0.04); }
.companion-remove { width: 40px; height: 46px; display: flex; align-items: center; justify-content: center; background: none; border: 1.5px solid var(--border); border-radius: var(--radius-xs); color: var(--text-muted); cursor: pointer; transition: all 0.15s ease; }
.companion-remove:hover { border-color: var(--danger); color: var(--danger); background: rgba(229,72,77,0.04); }
.add-companion-btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 16px; font-size: 13px; font-weight: 600; font-family: var(--font); color: var(--primary); background: var(--primary-light); border: 1.5px dashed rgba(16,125,172,0.3); border-radius: var(--radius-xs); cursor: pointer; transition: all 0.15s ease; }
.add-companion-btn:hover { background: rgba(16,125,172,0.12); border-color: var(--primary); }
.add-companion-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.companion-counter { font-size: 12px; color: var(--text-muted); margin-top: 8px; }

/* ALERTS & SUBMIT */
.alert { display: flex; align-items: flex-start; gap: 10px; padding: 14px 18px; border-radius: var(--radius-xs); font-size: 13px; line-height: 1.5; margin-bottom: 16px; }
.alert-warning { background: var(--warning-bg); border: 1px solid var(--warning-border); color: var(--warning-text); }
.alert-icon { flex-shrink: 0; font-size: 16px; margin-top: 1px; }
.submit-section { padding: 28px; }
.submit-btn { width: 100%; height: 54px; font-size: 16px; font-weight: 700; font-family: var(--font); color: #ffffff; background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); border: none; border-radius: var(--radius-sm); cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 8px rgba(16,125,172,0.25); letter-spacing: 0.2px; position: relative; overflow: hidden; }
.submit-btn:hover { box-shadow: 0 4px 20px rgba(16,125,172,0.35); transform: translateY(-1px); }
.submit-btn:active { transform: translateY(0); box-shadow: 0 1px 4px rgba(16,125,172,0.2); }
.submit-btn::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 100%); pointer-events: none; }
.submit-note { text-align: center; font-size: 12px; color: var(--text-muted); margin-top: 14px; line-height: 1.5; }
.powered-by { text-align: center; padding: 24px; font-size: 12px; color: var(--text-muted); }
.powered-by a { color: var(--primary); text-decoration: none; font-weight: 600; }

@media (max-width: 600px) {
  .hero-inner { padding: 36px 20px 60px; }
  .hero-meta { gap: 16px; flex-direction: column; }
  .container { padding: 0 16px 48px; margin-top: -28px; }
  .section-header { padding: 20px 20px 0; }
  .section-body { padding: 16px 20px 24px; }
  .form-row { grid-template-columns: 1fr; gap: 0; }
  .phone-group { grid-template-columns: 100px 1fr; }
  .companion-row { grid-template-columns: 1fr 1fr 36px; gap: 6px; }
  .submit-section { padding: 20px; }
}
</style>
</head>
<body>
<header class="hero">
  <div class="hero-inner">
    <div class="hero-badge"><span class="dot"></span>Registration Open</div>
    <h1>{{event_name}}</h1>
    <p class="hero-description">{{event_description}}</p>
    <div class="hero-meta">
      <div class="hero-meta-item">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="3" width="14" height="13" rx="2" stroke="white" stroke-width="1.4"/><path d="M2 7h14M6 1v4M12 1v4" stroke="white" stroke-width="1.4" stroke-linecap="round"/></svg>
        {{event_date}}
      </div>
      <div class="hero-meta-item">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 9.5a2 2 0 100-4 2 2 0 000 4z" stroke="white" stroke-width="1.4"/><path d="M9 16.5s6-4.5 6-9A6 6 0 003 7.5c0 4.5 6 9 6 9z" stroke="white" stroke-width="1.4"/></svg>
        {{venue_name}}
      </div>
    </div>
  </div>
</header>

<main class="container">
  <form id="regForm" novalidate>

    <!-- TICKET SELECTION -->
    <div class="section">
      <div class="section-header">
        <p class="section-label">Step 1</p>
        <h2 class="section-title">Choose Your Ticket</h2>
        <p class="section-subtitle">Select one event ticket to get started.</p>
      </div>
      <div class="section-body">
        <div class="ticket-group-label">Event Admission</div>
        <div class="ticket-card selected" data-type="event">
          <div class="ticket-radio"></div>
          <div class="ticket-info">
            <div class="ticket-name"><span class="ticket-colour-dot" style="background:${ticketTypeColor || '#107DAC'}"></span>${ticketTypeName || 'General Admission'}</div>
            <p class="ticket-desc">Full access to the event grounds and main stage</p>
            <div class="ticket-meta"><span class="ticket-badge free">Free</span><span class="ticket-quota">238 of 500 remaining</span></div>
          </div>
        </div>
        <div class="sub-events visible">
          <div class="sub-event-divider">Add Sessions (optional)</div>
          <div class="ticket-card selected" data-type="sub">
            <div class="ticket-check"></div>
            <div class="ticket-info">
              <div class="ticket-name"><span class="ticket-colour-dot" style="background:#8B0000"></span>Red Wine Tasting Masterclass</div>
              <p class="ticket-desc">Sat 26 Oct &middot; 2:00 - 3:30 PM &middot; Tasting Pavilion A</p>
              <div class="ticket-meta"><span class="ticket-badge free">Free</span><span class="ticket-quota low">8 of 30 remaining</span></div>
            </div>
          </div>
          <div class="ticket-card" data-type="sub">
            <div class="ticket-check"></div>
            <div class="ticket-info">
              <div class="ticket-name"><span class="ticket-colour-dot" style="background:#D4A017"></span>Champagne &amp; Sparkling Workshop</div>
              <p class="ticket-desc">Sun 27 Oct &middot; 11:00 AM - 12:30 PM &middot; VIP Lounge</p>
              <div class="ticket-meta"><span class="ticket-badge free">Free</span><span class="ticket-quota">22 of 40 remaining</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- YOUR DETAILS -->
    <div class="section">
      <div class="section-header">
        <p class="section-label">Step 2</p>
        <h2 class="section-title">Your Details</h2>
      </div>
      <div class="section-body">
        <div class="form-row">
          <div class="form-group"><label>{{label_salutation}} <span class="optional">optional</span></label><select class="form-input form-select"><option value="">Select</option><option>Mr</option><option>Mrs</option><option>Ms</option><option>Dr</option><option>Prof</option></select></div>
          <div class="form-group"><label>{{label_title}} <span class="optional">optional</span></label><input type="text" class="form-input" placeholder="e.g. Director of Marketing"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>{{label_first_name}} <span class="required">*</span></label><input type="text" class="form-input" placeholder="e.g. Sarah" required><p class="form-error">First name is required</p></div>
          <div class="form-group"><label>{{label_last_name}} <span class="required">*</span></label><input type="text" class="form-input" placeholder="e.g. Chen" required><p class="form-error">Last name is required</p></div>
        </div>
        <div class="form-row full">
          <div class="form-group"><label>{{label_email}} <span class="required">*</span></label><input type="email" class="form-input" placeholder="e.g. sarah.chen@example.com" required><p class="form-error">A valid email is required</p></div>
        </div>
        <div class="form-row full">
          <div class="form-group"><label>{{label_organization}} <span class="optional">optional</span></label><input type="text" class="form-input" placeholder="e.g. Hong Kong Tourism Board"></div>
        </div>
        <div class="form-row full">
          <div class="form-group"><label>{{label_phone}} <span class="optional">optional</span></label>
            <div class="phone-group"><select class="form-input form-select"><option>+852</option><option>+86</option><option>+60</option><option>+66</option><option>+65</option><option>+81</option><option>+82</option><option>+886</option><option>+44</option><option>+1</option></select><input type="tel" class="form-input" placeholder="e.g. 9123 4567"></div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>{{label_wechat_id}} <span class="optional">optional</span></label><input type="text" class="form-input" placeholder="e.g. sarah_wx"></div>
          <div class="form-group"><label>{{label_preferred_language}} <span class="optional">optional</span></label><select class="form-input form-select"><option value="en">English</option><option value="zh_tw">繁體中文</option><option value="zh_sc">简体中文</option></select></div>
        </div>
      </div>
    </div>

    ${companionSectionHtml}

    <!-- SUBMIT -->
    <div class="section">
      <div class="submit-section">
        <div class="alert alert-warning">
          <span class="alert-icon">&#9200;</span>
          <span><strong>RSVP Deadline:</strong> Please register before <strong>{{rsvp_deadline}}</strong></span>
        </div>
        <button type="submit" class="submit-btn">Complete Registration</button>
        <p class="submit-note">By registering, you agree to the event's terms and conditions.<br>A confirmation email with your QR code will be sent to your email.</p>
      </div>
    </div>

  </form>
  <div class="powered-by">Powered by <a href="https://www.lepos.ai" target="_blank">Lepos</a> &middot; The One Behind Greatest Events</div>
</main>
</body>
</html>`
}