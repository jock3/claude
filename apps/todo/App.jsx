import { useState, useEffect, Fragment } from 'react';
import { Plus, Trash2, X, Check, Calendar, ChevronDown, LogOut } from 'lucide-react';
import * as db from './db.js';

/* ─── Constants ───────────────────────────────────────────── */

const CHECKPOINTS = [
  { key: 'todo',   label: 'Att göra',   color: '#6A6964' },
  { key: 'doing',  label: 'Pågår',      color: '#2E6FD4' },
  { key: 'review', label: 'Granskning', color: '#E0A93B' },
  { key: 'done',   label: 'Klar',       color: '#5BAE6E' },
];

const SESSION_ID_KEY   = 'ailabb_profile_id';
const SESSION_NAME_KEY = 'ailabb_profile_name';

/* ─── Helpers ─────────────────────────────────────────────── */

const getDefaultDeadline = () => {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toISOString().split('T')[0];
};

const formatDate = (iso) => new Date(iso).toLocaleDateString('sv-SE');

const daysUntil = (iso) => {
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const target = new Date(iso); target.setHours(0, 0, 0, 0);
  return Math.round((target - now) / 86400000);
};

/* ─── Logo ────────────────────────────────────────────────── */

const Logo = () => (
  <a href="../../" className="tl-logo" aria-label="Gustav Mattsson — AI Labb">
    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 623.04 583.35" aria-hidden="true">
      <defs>
        <style>{`
          .logo-cls-1 { font-size: 193.17px; }
          .logo-cls-1, .logo-cls-2 {
            font-family: Montserrat-Bold, Montserrat;
            font-weight: 700;
            opacity: .91;
          }
          .logo-cls-2 { font-size: 189.12px; }
        `}</style>
      </defs>
      <path d="M232.17,3c7.02-7.42,19.19.1,15.62,9.67-9.95,26.68-27.78,61.43-58.57,88.15-55.09,47.8-70.9,80.05-80.29,122.79-.83,3.78-4.33,6.37-8.19,6.09l-13.61-.98c-5.61-.4-9.92-5.11-9.82-10.73.52-29.28,13.8-103.04,70.2-141.85C183.44,51.41,212.65,23.65,232.17,3Z"/>
      <path d="M74.3,234.65s-22.36,17.42-24.83,29.76c-1.77,8.84,31.32,11.98,50.2,13.05,6.54.37,11.77-5.35,10.78-11.82-1.08-7.08-2.45-16.17-3.61-24.42-2.35-16.66-32.55-6.56-32.55-6.56Z"/>
      <path d="M51.87,290.51s-38.3,9.33-38.3,64.83,12.33,99.9-13.57,145.54c0,0,96.6-69.22,110.75-161.62,3.8-24.79-9.47-49.48-32.56-59.27-8.67-3.68-14.96,9.96-26.32,10.52Z"/>
      <text className="logo-cls-1" transform="translate(144.86 300.16)"><tspan x="0" y="0">0</tspan><tspan x="130" y="0">100</tspan></text>
      <text className="logo-cls-2" transform="translate(259.2 447.19) scale(1.04 1)"><tspan x="0" y="0">0</tspan><tspan x="127.28" y="0">111</tspan></text>
    </svg>
  </a>
);

/* ─── User Menu ───────────────────────────────────────────── */

function UserMenu({ activeUser, onSwitch }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const id = setTimeout(() => document.addEventListener('click', close), 0);
    return () => { clearTimeout(id); document.removeEventListener('click', close); };
  }, [open]);

  return (
    <div className="tl-user-menu" onClick={(e) => e.stopPropagation()}>
      <button className="tl-user-chip" onClick={() => setOpen(!open)}>
        <span className="tl-avatar">{activeUser[0].toUpperCase()}</span>
        <span className="tl-user-name">{activeUser}</span>
        <ChevronDown size={12} style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 200ms' }} />
      </button>
      {open && (
        <div className="tl-user-dropdown">
          <button onClick={() => { setOpen(false); onSwitch(); }}>
            <LogOut size={14} />
            Byt användare
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Project Card ────────────────────────────────────────── */

function ProjectCard({ project, onUpdate, onDelete }) {
  const [newTodo,      setNewTodo]      = useState('');
  const [subInputs,    setSubInputs]    = useState({});
  const [subSubInputs, setSubSubInputs] = useState({});
  const [openSub,      setOpenSub]      = useState(new Set());
  const [openSubSub,   setOpenSubSub]   = useState(new Set());
  const [editingId,    setEditingId]    = useState(null);
  const [editText,     setEditText]     = useState('');

  const todos = project.todos || [];
  const days  = daysUntil(project.deadline);

  const uid = () => Date.now().toString() + Math.random().toString(36).slice(2, 6);
  const ts  = () => new Date().toISOString();

  /* ── Inline edit ── */
  const startEdit = (key, text) => { setEditingId(key); setEditText(text); };
  const commitEdit = () => {
    if (!editingId) return;
    const trimmed = editText.trim();
    if (!trimmed) { setEditingId(null); return; }
    const parts = editingId.split('/');
    if (parts.length === 1) {
      onUpdate({ todos: todos.map(t => t.id === parts[0] ? { ...t, text: trimmed } : t) });
    } else if (parts.length === 2) {
      const [pid, cid] = parts;
      onUpdate({ todos: todos.map(t => t.id !== pid ? t : {
        ...t, children: (t.children || []).map(c => c.id === cid ? { ...c, text: trimmed } : c)
      })});
    } else {
      const [pid, cid, gid] = parts;
      onUpdate({ todos: todos.map(t => t.id !== pid ? t : {
        ...t, children: (t.children || []).map(c => c.id !== cid ? c : {
          ...c, children: (c.children || []).map(g => g.id === gid ? { ...g, text: trimmed } : g)
        })
      })});
    }
    setEditingId(null);
  };

  /* ── Level 0 ── */
  const addTodo = () => {
    if (!newTodo.trim()) return;
    onUpdate({ todos: [...todos, { id: uid(), text: newTodo.trim(), done: false, createdAt: ts(), children: [] }] });
    setNewTodo('');
  };
  const toggleTodo = (id) =>
    onUpdate({ todos: todos.map(t => t.id === id ? { ...t, done: !t.done } : t) });
  const deleteTodo = (id) => {
    onUpdate({ todos: todos.filter(t => t.id !== id) });
    setOpenSub(s => { const n = new Set(s); n.delete(id); return n; });
  };
  const toggleSubOpen = (id) =>
    setOpenSub(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  /* ── Level 1 ── */
  const addSub = (pid) => {
    const text = (subInputs[pid] || '').trim();
    if (!text) return;
    onUpdate({
      todos: todos.map(t => t.id !== pid ? t : {
        ...t, children: [...(t.children || []), { id: uid(), text, done: false, createdAt: ts(), children: [] }]
      })
    });
    setSubInputs(p => ({ ...p, [pid]: '' }));
  };
  const toggleSub = (pid, cid) =>
    onUpdate({ todos: todos.map(t => t.id !== pid ? t : {
      ...t, children: (t.children || []).map(c => c.id === cid ? { ...c, done: !c.done } : c)
    })});
  const deleteSub = (pid, cid) => {
    onUpdate({ todos: todos.map(t => t.id !== pid ? t : {
      ...t, children: (t.children || []).filter(c => c.id !== cid)
    })});
    setOpenSubSub(s => { const n = new Set(s); n.delete(`${pid}/${cid}`); return n; });
  };
  const toggleSubSubOpen = (pid, cid) => {
    const key = `${pid}/${cid}`;
    setOpenSubSub(s => { const n = new Set(s); n.has(key) ? n.delete(key) : n.add(key); return n; });
  };

  /* ── Level 2 ── */
  const addSubSub = (pid, cid) => {
    const key  = `${pid}/${cid}`;
    const text = (subSubInputs[key] || '').trim();
    if (!text) return;
    onUpdate({ todos: todos.map(t => t.id !== pid ? t : {
      ...t, children: (t.children || []).map(c => c.id !== cid ? c : {
        ...c, children: [...(c.children || []), { id: uid(), text, done: false, createdAt: ts() }]
      })
    })});
    setSubSubInputs(p => ({ ...p, [key]: '' }));
  };
  const toggleSubSub = (pid, cid, gid) =>
    onUpdate({ todos: todos.map(t => t.id !== pid ? t : {
      ...t, children: (t.children || []).map(c => c.id !== cid ? c : {
        ...c, children: (c.children || []).map(g => g.id === gid ? { ...g, done: !g.done } : g)
      })
    })});
  const deleteSubSub = (pid, cid, gid) =>
    onUpdate({ todos: todos.map(t => t.id !== pid ? t : {
      ...t, children: (t.children || []).map(c => c.id !== cid ? c : {
        ...c, children: (c.children || []).filter(g => g.id !== gid)
      })
    })});

  let dlClass = '', dlText = '';
  if (days < 0)        { dlClass = 'overdue'; dlText = `${Math.abs(days)} d försenad`; }
  else if (days === 0) { dlClass = 'urgent';  dlText = 'Idag'; }
  else if (days <= 7)  { dlClass = 'urgent';  dlText = `${days} d kvar`; }
  else                 { dlText = `${days} d kvar`; }

  const EditInput = ({ editKey, placeholder }) => (
    <input
      autoFocus
      className="tl-edit-input"
      value={editText}
      placeholder={placeholder}
      onChange={(e) => setEditText(e.target.value)}
      onBlur={commitEdit}
      onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditingId(null); }}
    />
  );

  return (
    <div className="tl-project">
      <div className="tl-project-header">
        <h3 className="tl-project-name">{project.name}</h3>
        <div className={`tl-deadline-badge ${dlClass}`}>
          <Calendar size={12} />
          {dlText}
        </div>
        <button className="tl-icon-btn" onClick={onDelete} aria-label="Ta bort projekt">
          <Trash2 size={16} />
        </button>
      </div>

      <div className="tl-progress">
        {CHECKPOINTS.map((c, i) => {
          const passed = i <= project.checkpoint;
          return (
            <Fragment key={c.key}>
              <button
                className={`tl-progress-step ${i === project.checkpoint ? 'active' : ''}`}
                onClick={() => onUpdate({ checkpoint: i })}
                aria-label={`Sätt status till ${c.label}`}
              >
                <span className="tl-pdot" style={passed ? { background: c.color, borderColor: c.color } : {}} />
                <span className="tl-plabel">{c.label}</span>
              </button>
              {i < CHECKPOINTS.length - 1 && (
                <span className="tl-progress-line" style={i < project.checkpoint ? { background: c.color } : {}} />
              )}
            </Fragment>
          );
        })}
      </div>

      <div className="tl-todos">
        {todos.length === 0 && <p className="tl-empty-hint">Inga todos ännu.</p>}

        {todos.map((todo) => (
          <div key={todo.id} className="tl-todo-block">
            {/* Level 0 */}
            <div className={`tl-row l0 ${todo.done ? 'done' : ''}`}>
              <button className={`tl-circle-btn ${todo.done ? 'checked' : ''}`} onClick={() => toggleTodo(todo.id)} aria-label="Markera klar">
                {todo.done && <Check size={10} strokeWidth={3} />}
              </button>
              {editingId === todo.id
                ? <EditInput editKey={todo.id} placeholder={todo.text} />
                : <span className="tl-row-text" onClick={() => startEdit(todo.id, todo.text)}>{todo.text}</span>
              }
              <button className={`tl-add-child-btn ${openSub.has(todo.id) ? 'open' : ''}`} onClick={() => toggleSubOpen(todo.id)} title="Lägg till sub-todo">
                <Plus size={11} strokeWidth={2.5} />
              </button>
              <button className="tl-icon-btn" onClick={() => deleteTodo(todo.id)} aria-label="Ta bort"><X size={14} /></button>
            </div>

            {/* Level 1 */}
            {((todo.children || []).length > 0 || openSub.has(todo.id)) && (
              <div className="tl-children">
                {(todo.children || []).map((child) => {
                  const childKey = `${todo.id}/${child.id}`;
                  return (
                    <div key={child.id} className="tl-todo-block">
                      <div className={`tl-row l1 ${child.done ? 'done' : ''}`}>
                        <button className={`tl-circle-btn sm ${child.done ? 'checked' : ''}`} onClick={() => toggleSub(todo.id, child.id)} aria-label="Markera klar">
                          {child.done && <Check size={8} strokeWidth={3} />}
                        </button>
                        {editingId === childKey
                          ? <EditInput editKey={childKey} placeholder={child.text} />
                          : <span className="tl-row-text" onClick={() => startEdit(childKey, child.text)}>{child.text}</span>
                        }
                        <button className={`tl-add-child-btn sm ${openSubSub.has(childKey) ? 'open' : ''}`} onClick={() => toggleSubSubOpen(todo.id, child.id)} title="Lägg till sub-sub-todo">
                          <Plus size={10} strokeWidth={2.5} />
                        </button>
                        <button className="tl-icon-btn" onClick={() => deleteSub(todo.id, child.id)} aria-label="Ta bort"><X size={13} /></button>
                      </div>

                      {/* Level 2 */}
                      {((child.children || []).length > 0 || openSubSub.has(childKey)) && (
                        <div className="tl-children sub">
                          {(child.children || []).map((grand) => {
                            const grandKey = `${todo.id}/${child.id}/${grand.id}`;
                            return (
                              <div key={grand.id} className={`tl-row l2 ${grand.done ? 'done' : ''}`}>
                                <button className={`tl-circle-btn sm ${grand.done ? 'checked' : ''}`} onClick={() => toggleSubSub(todo.id, child.id, grand.id)} aria-label="Markera klar">
                                  {grand.done && <Check size={8} strokeWidth={3} />}
                                </button>
                                {editingId === grandKey
                                  ? <EditInput editKey={grandKey} placeholder={grand.text} />
                                  : <span className="tl-row-text" onClick={() => startEdit(grandKey, grand.text)}>{grand.text}</span>
                                }
                                <button className="tl-icon-btn" onClick={() => deleteSubSub(todo.id, child.id, grand.id)} aria-label="Ta bort"><X size={12} /></button>
                              </div>
                            );
                          })}
                          {openSubSub.has(childKey) && (
                            <div className="tl-inline-add">
                              <input
                                autoFocus
                                type="text"
                                placeholder="Sub-sub-todo…"
                                value={subSubInputs[childKey] || ''}
                                onChange={(e) => setSubSubInputs(p => ({ ...p, [childKey]: e.target.value }))}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter')  addSubSub(todo.id, child.id);
                                  if (e.key === 'Escape') toggleSubSubOpen(todo.id, child.id);
                                }}
                              />
                              <button onClick={() => addSubSub(todo.id, child.id)} disabled={!(subSubInputs[childKey] || '').trim()}>
                                <Plus size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {openSub.has(todo.id) && (
                  <div className="tl-inline-add">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Sub-todo…"
                      value={subInputs[todo.id] || ''}
                      onChange={(e) => setSubInputs(p => ({ ...p, [todo.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter')  addSub(todo.id);
                        if (e.key === 'Escape') toggleSubOpen(todo.id);
                      }}
                    />
                    <button onClick={() => addSub(todo.id)} disabled={!(subInputs[todo.id] || '').trim()}>
                      <Plus size={12} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        <div className="tl-add-note">
          <input
            type="text"
            placeholder="Lägg till todo…"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          />
          <button onClick={addTodo} disabled={!newTodo.trim()}>
            <Plus size={14} strokeWidth={2.5} />
            Lägg till
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main App ────────────────────────────────────────────── */

export default function TodoLabb() {
  const [activeUser, setActiveUser] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [projects, setProjects]   = useState([]);
  const [loading, setLoading]     = useState(true);

  const [showForm,   setShowForm]   = useState(false);
  const [name,       setName]       = useState('');
  const [checkpoint, setCheckpoint] = useState(0);
  const [deadline,   setDeadline]   = useState(getDefaultDeadline());

  /* Restore session on mount — redirect home if not logged in */
  useEffect(() => {
    async function init() {
      let name = null;
      try { name = JSON.parse(localStorage.getItem('ailabb_active_user')); } catch {}

      if (!name) { window.location.replace('../../'); return; }

      setActiveUser(name);

      const cachedId   = localStorage.getItem(SESSION_ID_KEY);
      const cachedName = localStorage.getItem(SESSION_NAME_KEY);

      let pid;
      if (cachedId && cachedName === name) {
        pid = cachedId;
      } else {
        const profile = await db.getOrCreateProfile(name);
        if (!profile) { window.location.replace('../../'); return; }
        pid = profile.id;
        localStorage.setItem(SESSION_ID_KEY, pid);
        localStorage.setItem(SESSION_NAME_KEY, name);
      }

      setProfileId(pid);
      const projs = await db.getProjects(pid);
      setProjects(projs);
      setLoading(false);
    }
    init();
  }, []);

  /* Switch user — log out globally and go home */
  const handleSwitch = () => {
    localStorage.removeItem('ailabb_active_user');
    localStorage.removeItem(SESSION_ID_KEY);
    localStorage.removeItem(SESSION_NAME_KEY);
    window.location.replace('../../');
  };

  const resetForm = () => {
    setName('');
    setCheckpoint(0);
    setDeadline(getDefaultDeadline());
  };

  /* Add project */
  const addProject = async () => {
    if (!name.trim()) return;
    const project = {
      id: Date.now().toString(),
      profile_id: profileId,
      name: name.trim(),
      checkpoint,
      deadline,
      todos: [],
      created_at: new Date().toISOString(),
    };
    setProjects((prev) => [project, ...prev]);
    resetForm();
    setShowForm(false);
    await db.upsertProject(project);
  };

  /* Update project */
  const updateProject = async (id, updates) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    const updated = projects.find((p) => p.id === id);
    if (updated) await db.upsertProject({ ...updated, ...updates, profile_id: profileId });
  };

  /* Delete project */
  const deleteProject = async (id) => {
    if (!window.confirm('Ta bort projektet?')) return;
    setProjects((prev) => prev.filter((p) => p.id !== id));
    await db.deleteProject(id);
  };

  /* ─── Render ─── */

  if (loading) {
    return (
      <>
        <ScopedStyles />
        <div className="tl-fullscreen-loader">Laddar…</div>
      </>
    );
  }

  return (
    <>
      <ScopedStyles />
      <div className="tl-app-root">

        <nav className="tl-top-nav">
          <Logo />
          <div className="tl-nav-right">
            <ul className="tl-menu">
              <li><a href="../../">Hem</a></li>
              <li className="tl-has-dropdown">
                <a href="#" aria-haspopup="true">
                  Appar <span className="tl-chev" aria-hidden="true">▾</span>
                </a>
                <ul className="tl-dropdown" role="menu">
                  <li role="none"><a href="../todo/" role="menuitem" className="active">Todo</a></li>
                  <li role="none"><a href="../kampanj/" role="menuitem">Kampanjplanerare</a></li>
                </ul>
              </li>
            </ul>
            <UserMenu activeUser={activeUser} onSwitch={handleSwitch} />
          </div>
        </nav>

        <section className="tl-hero">
          <h1>Hej {activeUser}, redo att <span className="hand">labba?</span></h1>
          <p>Liten plats för att hålla koll på pågående experiment. Skapa ett projekt, sätt en deadline och samla anteckningar längs vägen.</p>
        </section>

        {!showForm ? (
          <button className="tl-new-btn" onClick={() => setShowForm(true)}>
            <Plus size={18} strokeWidth={2.5} />
            Nytt projekt
          </button>
        ) : (
          <div className="tl-form-card">
            <h2>Nytt projekt</h2>
            <div className="tl-field">
              <label className="tl-field-label">Projektnamn</label>
              <input
                type="text"
                placeholder="t.ex. Bygg AI-labbet"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addProject()}
                autoFocus
              />
            </div>
            <div className="tl-field">
              <label className="tl-field-label">Status</label>
              <div className="tl-checkpoints">
                {CHECKPOINTS.map((cp, i) => (
                  <button
                    key={cp.key}
                    type="button"
                    className={`tl-cp-pill ${checkpoint === i ? 'active' : ''}`}
                    onClick={() => setCheckpoint(i)}
                    style={checkpoint === i ? { borderColor: cp.color, background: `${cp.color}20` } : {}}
                  >
                    <span className="tl-dot" style={{ background: cp.color }} />
                    {cp.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="tl-field">
              <label className="tl-field-label">Deadline</label>
              <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>
            <div className="tl-form-actions">
              <button className="tl-btn-primary" onClick={addProject} disabled={!name.trim()}>
                Skapa projekt
              </button>
              <button className="tl-btn-ghost" onClick={() => { resetForm(); setShowForm(false); }}>
                Avbryt
              </button>
            </div>
          </div>
        )}

        <section style={{ marginTop: 28 }}>
          {projects.length === 0 ? (
            <div className="tl-empty-state">
              <h3>Inga projekt ännu</h3>
              <p>Skapa ditt första projekt för att komma igång.</p>
            </div>
          ) : (
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onUpdate={(u) => updateProject(project.id, u)}
                onDelete={() => deleteProject(project.id)}
              />
            ))
          )}
        </section>

      </div>
    </>
  );
}

/* ─── Scoped Styles ───────────────────────────────────────── */

function ScopedStyles() {
  return (
    <style>{`
      .tl-app-root, .tl-welcome-root {
        min-height: 100vh;
        margin: 0 auto;
        color: var(--color-text);
        font-family: var(--font-body, "Montserrat", sans-serif);
        -webkit-font-smoothing: antialiased;
      }
      .tl-app-root { max-width: 880px; padding: 32px 24px 96px; }
      .tl-welcome-root { max-width: 640px; padding: 32px 24px 96px; display: flex; flex-direction: column; }

      .tl-fullscreen-loader {
        min-height: 100vh; display: flex; align-items: center; justify-content: center;
        color: var(--color-text-faint); font-size: 15px;
        font-family: var(--font-body, "Montserrat", sans-serif);
      }
      .tl-loading { color: var(--color-text-faint); font-size: 13px; margin: 0; }

      .tl-top-nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 56px; gap: 16px; }
      .tl-nav-right { display: flex; align-items: center; gap: 32px; }
      .tl-logo { display: inline-flex; align-items: center; height: 36px; color: var(--color-text); text-decoration: none; transition: opacity 200ms; border: 0; }
      .tl-logo:hover { opacity: 0.85; }
      .tl-logo svg { height: 100%; width: auto; }
      .tl-menu { display: flex; gap: 32px; list-style: none; margin: 0; padding: 0; }
      .tl-menu a { font-size: 14px; font-weight: 500; color: var(--color-text-muted); text-decoration: none; transition: color 200ms; position: relative; border: 0; }
      .tl-menu a:hover, .tl-menu a.active { color: var(--color-text); }
      .tl-menu a.active::after {
        content: ''; position: absolute; left: 0; right: 0; bottom: -6px;
        height: 2px; background: var(--color-red); border-radius: 2px;
      }
      .tl-has-dropdown { position: relative; }
      .tl-has-dropdown > a { display: inline-flex; align-items: center; gap: 6px; }
      .tl-chev { font-size: 9px; line-height: 1; transition: transform 200ms; }
      .tl-has-dropdown:hover .tl-chev,
      .tl-has-dropdown:focus-within .tl-chev { transform: rotate(180deg); }
      .tl-dropdown {
        position: absolute; top: calc(100% + 10px); right: 0; min-width: 180px;
        list-style: none; margin: 0; padding: 6px;
        background: var(--color-surface); border: 1px solid var(--color-border);
        border-radius: 10px; box-shadow: 0 16px 48px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06);
        opacity: 0; visibility: hidden; transform: translateY(-4px);
        transition: opacity 200ms, visibility 200ms, transform 200ms; z-index: 20;
      }
      .tl-dropdown::before { content: ''; position: absolute; top: -10px; left: 0; right: 0; height: 10px; }
      .tl-has-dropdown:hover .tl-dropdown,
      .tl-has-dropdown:focus-within .tl-dropdown { opacity: 1; visibility: visible; transform: translateY(0); }
      .tl-dropdown li { display: block; }
      .tl-dropdown a {
        display: block; padding: 8px 12px; border-radius: 6px;
        font-size: 14px; font-weight: 500; color: var(--color-text-muted); border: 0;
        transition: background 150ms, color 150ms;
      }
      .tl-dropdown a:hover { background: var(--color-surface-2); color: var(--color-text); }
      .tl-dropdown a::after { display: none; }

      .tl-user-menu { position: relative; }
      .tl-user-chip {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 5px 12px 5px 5px; border-radius: 999px;
        border: 1px solid var(--color-border); background: var(--color-surface);
        color: var(--color-text); font-family: inherit;
        font-size: 13px; font-weight: 500; cursor: pointer; transition: all 200ms;
      }
      .tl-user-chip:hover { border-color: var(--color-border-strong); background: var(--color-surface-2); }
      .tl-user-chip .tl-user-name { white-space: nowrap; max-width: 140px; overflow: hidden; text-overflow: ellipsis; }
      .tl-avatar {
        width: 26px; height: 26px; border-radius: 50%;
        background: var(--color-red); color: var(--color-text);
        font-size: 12px; font-weight: 700;
        display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
      }
      .tl-user-chip .tl-avatar { width: 22px; height: 22px; font-size: 11px; }
      .tl-user-dropdown {
        position: absolute; top: calc(100% + 8px); right: 0; min-width: 180px;
        background: var(--color-surface); border: 1px solid var(--color-border);
        border-radius: 10px; padding: 6px;
        box-shadow: 0 16px 40px rgba(0,0,0,0.55); z-index: 20;
      }
      .tl-user-dropdown button {
        display: flex; align-items: center; gap: 10px; width: 100%;
        padding: 9px 12px; background: transparent; border: 0;
        border-radius: 6px; color: var(--color-text-muted);
        font-family: inherit; font-size: 13px; font-weight: 500;
        cursor: pointer; text-align: left; transition: all 200ms;
      }
      .tl-user-dropdown button:hover { background: var(--color-surface-2); color: var(--color-text); }

      .tl-welcome-nav { margin-bottom: 64px; }
      .tl-welcome-card { flex: 1; display: flex; flex-direction: column; justify-content: center; }
      .tl-welcome-card h1 {
        font-size: clamp(40px, 6vw, 64px); font-weight: 700;
        line-height: 1.05; letter-spacing: -0.02em; margin: 0 0 20px;
      }
      .tl-welcome-card h1 .hand {
        font-family: var(--font-hand, "Patrick Hand", cursive);
        color: var(--color-red); font-weight: 400;
        display: inline-block; transform: rotate(-2deg); font-size: 1.1em;
      }
      .tl-welcome-card p { color: var(--color-text-muted); font-size: 17px; line-height: 1.6; margin: 0 0 36px; max-width: 50ch; }
      .tl-welcome-input { display: flex; gap: 12px; margin-bottom: 36px; }
      .tl-welcome-input input { flex: 1; font-size: 17px; padding: 14px 18px; }
      .tl-welcome-input button { padding: 14px 22px; white-space: nowrap; }
      .tl-welcome-users { display: flex; flex-direction: column; gap: 14px; }
      .tl-welcome-label { font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-text-faint); }
      .tl-user-pills { display: flex; flex-wrap: wrap; gap: 8px; }
      .tl-user-pill {
        display: inline-flex; align-items: center; gap: 10px;
        padding: 6px 18px 6px 6px; border-radius: 999px;
        border: 1px solid var(--color-border); background: var(--color-surface);
        color: var(--color-text); font-family: inherit;
        font-size: 14px; font-weight: 500; cursor: pointer; transition: all 200ms;
      }
      .tl-user-pill:hover { border-color: var(--color-border-strong); background: var(--color-surface-2); }
      .tl-user-pill:disabled { opacity: 0.5; cursor: not-allowed; }

      .tl-hero { margin-bottom: 32px; }
      .tl-hero h1 { font-size: clamp(32px, 4.5vw, 48px); font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; margin: 0 0 12px; }
      .tl-hero h1 .hand {
        font-family: var(--font-hand, "Patrick Hand", cursive);
        color: var(--color-red); font-weight: 400;
        display: inline-block; transform: rotate(-2deg);
      }
      .tl-hero p { color: var(--color-text-muted); font-size: 17px; line-height: 1.6; margin: 0; max-width: 60ch; }

      .tl-new-btn, .tl-btn-primary {
        background: var(--color-red); color: var(--color-text); border: 0;
        font-family: inherit; font-weight: 600; font-size: 14px;
        cursor: pointer; transition: background 200ms, transform 100ms;
        display: inline-flex; align-items: center; gap: 8px;
      }
      .tl-new-btn { padding: 12px 20px; border-radius: 10px; }
      .tl-btn-primary { padding: 11px 22px; border-radius: 10px; }
      .tl-new-btn:hover, .tl-btn-primary:hover { background: var(--color-red-hover); }
      .tl-new-btn:active { transform: scale(0.98); }
      .tl-btn-primary:disabled { background: var(--color-surface-3); color: var(--color-text-faint); cursor: not-allowed; }
      .tl-btn-ghost {
        background: transparent; color: var(--color-text-muted); border: 0;
        padding: 11px 14px; border-radius: 10px; font-family: inherit;
        font-weight: 500; font-size: 14px; cursor: pointer; transition: color 200ms;
      }
      .tl-btn-ghost:hover { color: var(--color-text); }

      .tl-form-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 16px; padding: 28px; margin: 8px 0 32px; }
      .tl-form-card h2 { font-size: 20px; font-weight: 600; margin: 0 0 20px; }
      .tl-field { margin-bottom: 20px; }
      .tl-field-label { font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 8px; display: block; }

      .tl-app-root input[type="text"],
      .tl-app-root input[type="date"],
      .tl-welcome-root input[type="text"] {
        background: var(--color-surface-2); border: 1px solid var(--color-border);
        color: var(--color-text); font-family: inherit; font-size: 16px;
        padding: 11px 14px; border-radius: 10px; width: 100%;
        outline: none; transition: border-color 200ms; box-sizing: border-box;
      }
      .tl-app-root input[type="text"]:focus,
      .tl-app-root input[type="date"]:focus,
      .tl-welcome-root input[type="text"]:focus { border-color: var(--color-blue); }
      .tl-app-root input[type="date"] { color-scheme: light; }
      .tl-app-root ::placeholder, .tl-welcome-root ::placeholder { color: var(--color-text-faint); }

      .tl-checkpoints { display: flex; gap: 8px; flex-wrap: wrap; }
      .tl-cp-pill {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 8px 14px; border-radius: 999px;
        border: 1px solid var(--color-border); background: var(--color-surface-2);
        font-family: inherit; font-size: 13px; font-weight: 500;
        color: var(--color-text-muted); cursor: pointer; transition: all 200ms;
      }
      .tl-cp-pill .tl-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
      .tl-cp-pill:hover { color: var(--color-text); border-color: var(--color-border-strong); }
      .tl-cp-pill.active { color: var(--color-text); box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
      .tl-form-actions { display: flex; gap: 12px; align-items: center; margin-top: 8px; }

      .tl-project { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 16px; margin-bottom: 16px; overflow: hidden; }
      .tl-project-header { padding: 20px 24px 12px; display: flex; align-items: center; gap: 12px; }
      .tl-project-name { font-size: 18px; font-weight: 600; margin: 0; flex: 1; word-break: break-word; }
      .tl-deadline-badge {
        display: inline-flex; align-items: center; gap: 6px;
        font-size: 12px; font-weight: 500; color: var(--color-text-muted);
        padding: 5px 10px; border-radius: 999px;
        background: var(--color-surface-2); border: 1px solid var(--color-border); white-space: nowrap;
      }
      .tl-deadline-badge.urgent { color: var(--color-warn); border-color: rgba(224,169,59,0.3); }
      .tl-deadline-badge.overdue { background: rgba(214,59,59,0.12); color: var(--color-red); border-color: rgba(214,59,59,0.4); }

      .tl-icon-btn {
        background: transparent; border: 0; color: var(--color-text-faint);
        padding: 6px; border-radius: 6px; cursor: pointer;
        display: inline-flex; align-items: center; justify-content: center;
        transition: color 200ms, background 200ms;
      }
      .tl-icon-btn:hover { color: var(--color-text); background: var(--color-surface-2); }

      .tl-progress { padding: 4px 24px 20px; display: flex; align-items: center; overflow-x: auto; }
      .tl-progress::-webkit-scrollbar { display: none; }
      .tl-progress-step {
        display: flex; align-items: center; gap: 8px; cursor: pointer; flex-shrink: 0;
        background: transparent; border: 0; padding: 4px 2px; color: inherit; font-family: inherit;
      }
      .tl-pdot {
        width: 12px; height: 12px; border-radius: 50%;
        background: var(--color-surface-3); border: 2px solid var(--color-border-strong);
        transition: all 200ms; flex-shrink: 0;
      }
      .tl-progress-step.active .tl-pdot { transform: scale(1.2); }
      .tl-plabel { font-size: 12px; font-weight: 500; color: var(--color-text-faint); transition: color 200ms; white-space: nowrap; }
      .tl-progress-step.active .tl-plabel { color: var(--color-text); font-weight: 600; }
      .tl-progress-step:hover .tl-plabel { color: var(--color-text); }
      .tl-progress-line { flex: 1; height: 2px; background: var(--color-border); margin: 0 10px; min-width: 16px; transition: background 200ms; }

      /* ── Todos ── */
      .tl-todos { border-top: 1px solid var(--color-border); padding: 14px 24px 18px; background: rgba(0,0,0,0.025); }
      .tl-empty-hint { font-size: 13px; color: var(--color-text-faint); margin: 4px 0 12px; font-style: italic; }

      .tl-todo-block { margin-bottom: 1px; }

      .tl-row { display: flex; align-items: flex-start; gap: 8px; padding: 5px 0; }
      .tl-row.done .tl-row-text { text-decoration: line-through; color: var(--color-text-faint); }
      .tl-row-text {
        flex: 1; word-break: break-word; padding-top: 1px;
        transition: color 200ms; cursor: text; border-radius: 4px;
      }
      .tl-row-text:hover { background: var(--color-surface-2); }
      .tl-row.l0 .tl-row-text { font-size: 15px; color: var(--color-text); }
      .tl-row.l1 .tl-row-text { font-size: 14px; color: var(--color-text); }
      .tl-row.l2 .tl-row-text { font-size: 13px; color: var(--color-text-muted); }

      .tl-circle-btn {
        width: 18px; height: 18px; border-radius: 50%;
        border: 2px solid var(--color-border-strong);
        background: var(--color-surface); cursor: pointer;
        flex-shrink: 0; margin-top: 2px; padding: 0;
        display: inline-flex; align-items: center; justify-content: center;
        transition: all 150ms; color: transparent;
      }
      .tl-circle-btn.sm { width: 15px; height: 15px; margin-top: 3px; }
      .tl-circle-btn:hover { border-color: var(--color-success); background: rgba(31,122,58,0.08); color: var(--color-success); }
      .tl-circle-btn.checked { background: var(--color-success); border-color: var(--color-success); color: white; }

      .tl-edit-input {
        flex: 1; background: var(--color-surface);
        border: 1px solid var(--color-blue); border-radius: 6px;
        color: var(--color-text); font-family: inherit; font-size: inherit;
        padding: 1px 8px; outline: none; min-width: 0;
      }

      .tl-children {
        margin-left: 7px; padding-left: 16px;
        border-left: 2px solid var(--color-border);
        margin-top: 2px; margin-bottom: 4px;
      }
      .tl-children.sub { padding-left: 14px; }

      .tl-add-child-btn {
        background: transparent; border: 0;
        color: var(--color-text-faint); padding: 3px 4px; border-radius: 4px;
        cursor: pointer; display: inline-flex; align-items: center;
        transition: color 150ms, background 150ms; flex-shrink: 0; margin-top: 2px;
      }
      .tl-add-child-btn:hover { color: var(--color-text-muted); background: var(--color-surface-2); }
      .tl-add-child-btn.open { color: var(--color-text); background: var(--color-surface-3); }

      .tl-inline-add { display: flex; gap: 6px; padding: 6px 0 4px; }
      .tl-inline-add input { flex: 1; padding: 6px 10px; font-size: 13px; border-radius: 8px; }
      .tl-inline-add button {
        padding: 6px 10px; background: var(--color-surface-3);
        border: 1px solid var(--color-border-strong); color: var(--color-text);
        border-radius: 8px; font-family: inherit; font-size: 13px;
        cursor: pointer; display: inline-flex; align-items: center;
        transition: all 200ms;
      }
      .tl-inline-add button:hover:not(:disabled) { background: var(--color-border); }
      .tl-inline-add button:disabled { opacity: 0.35; cursor: not-allowed; }

      .tl-add-note { display: flex; gap: 8px; margin-top: 12px; }
      .tl-add-note input { flex: 1; padding: 9px 12px; font-size: 14px; }
      .tl-add-note button {
        padding: 9px 14px; background: var(--color-surface-3);
        border: 1px solid var(--color-border-strong); color: var(--color-text);
        border-radius: 10px; font-family: inherit; font-weight: 500; font-size: 13px;
        cursor: pointer; display: inline-flex; align-items: center; gap: 6px;
        transition: all 200ms; white-space: nowrap;
      }
      .tl-add-note button:hover:not(:disabled) { background: var(--color-border); }
      .tl-add-note button:disabled { opacity: 0.5; cursor: not-allowed; }

      .tl-empty-state {
        text-align: center; padding: 56px 24px; color: var(--color-text-muted);
        border: 1px dashed var(--color-border); border-radius: 16px;
      }
      .tl-empty-state h3 { color: var(--color-text); margin: 0 0 8px; font-weight: 600; }
      .tl-empty-state p { margin: 0; font-size: 14px; }

      @media (max-width: 540px) {
        .tl-top-nav { margin-bottom: 32px; }
        .tl-nav-right { gap: 16px; }
        .tl-menu { gap: 16px; }
        .tl-user-chip .tl-user-name { max-width: 80px; }
        .tl-form-card { padding: 20px; }
        .tl-project-header { padding: 16px 18px 10px; flex-wrap: wrap; }
        .tl-progress { padding: 4px 18px 18px; }
        .tl-plabel { font-size: 11px; }
        .tl-notes { padding: 12px 18px 16px; }
        .tl-welcome-input { flex-direction: column; }
        .tl-welcome-input button { width: 100%; }
      }
    `}</style>
  );
}
