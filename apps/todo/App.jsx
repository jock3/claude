import { useState, useEffect, useRef, Fragment } from 'react';
import { Plus, Trash2, X, Check, Calendar } from 'lucide-react';
import * as db from './db.js';
import { Sidebar, SidebarStyles } from '../shared/Sidebar.jsx';

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

const countTodos = (todos) => {
  let done = 0, total = 0;
  for (const t of (todos || [])) {
    total++;
    if (t.done) done++;
    for (const c of (t.children || [])) {
      total++;
      if (c.done) done++;
      for (const g of (c.children || [])) {
        total++;
        if (g.done) done++;
      }
    }
  }
  return { done, total };
};

/* ─── EditInput ───────────────────────────────────────────── */

function EditInput({ value, onChange, onBlur, onKeyDown, fontSize, fontWeight }) {
  return (
    <input
      autoFocus
      className="tl-edit-input"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      style={fontSize ? { fontSize, fontWeight } : {}}
    />
  );
}

/* ─── Project Card ────────────────────────────────────────── */

function ProjectCard({ project, onUpdate, onDelete, onArchive, isArchived = false, showToast }) {
  const [newTodo,      setNewTodo]      = useState('');
  const [subInputs,    setSubInputs]    = useState({});
  const [subSubInputs, setSubSubInputs] = useState({});
  const [openSub,      setOpenSub]      = useState(new Set());
  const [openSubSub,   setOpenSubSub]   = useState(new Set());
  const [editingId,    setEditingId]    = useState(null);
  const [editText,     setEditText]     = useState('');
  const [collapsed,    setCollapsed]    = useState(isArchived);
  const [editingDeadline, setEditingDeadline] = useState(false);
  const [editingDesc,  setEditingDesc]  = useState(false);
  const [descText,     setDescText]     = useState(project.description || '');

  const lastDeletedTodos = useRef(null);

  const todos  = project.todos || [];
  const days   = daysUntil(project.deadline);
  const isDone = project.checkpoint === CHECKPOINTS.length - 1;

  const { done: todoDone, total: todoTotal } = countTodos(todos);

  const uid = () => Date.now().toString() + Math.random().toString(36).slice(2, 6);
  const ts  = () => new Date().toISOString();

  /* ── Inline edit ── */
  const startEdit = (key, text) => { setEditingId(key); setEditText(text); };
  const commitEdit = () => {
    if (!editingId) return;
    const trimmed = editText.trim();
    if (!trimmed) { setEditingId(null); return; }
    if (editingId === '__name__') {
      onUpdate({ name: trimmed });
      setEditingId(null);
      return;
    }
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

  /* ── Deadline edit ── */
  const commitDeadline = (val) => {
    setEditingDeadline(false);
    if (val) onUpdate({ deadline: val });
  };

  /* ── Description edit ── */
  const commitDesc = () => {
    setEditingDesc(false);
    onUpdate({ description: descText.trim() });
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
    lastDeletedTodos.current = todos;
    const newTodos = todos.filter(t => t.id !== id);
    onUpdate({ todos: newTodos });
    setOpenSub(s => { const n = new Set(s); n.delete(id); return n; });
    if (showToast) showToast('Todo raderad', () => onUpdate({ todos: lastDeletedTodos.current }));
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
    lastDeletedTodos.current = todos;
    const newTodos = todos.map(t => t.id !== pid ? t : {
      ...t, children: (t.children || []).filter(c => c.id !== cid)
    });
    onUpdate({ todos: newTodos });
    setOpenSubSub(s => { const n = new Set(s); n.delete(`${pid}/${cid}`); return n; });
    if (showToast) showToast('Todo raderad', () => onUpdate({ todos: lastDeletedTodos.current }));
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
  const deleteSubSub = (pid, cid, gid) => {
    lastDeletedTodos.current = todos;
    const newTodos = todos.map(t => t.id !== pid ? t : {
      ...t, children: (t.children || []).map(c => c.id !== cid ? c : {
        ...c, children: (c.children || []).filter(g => g.id !== gid)
      })
    });
    onUpdate({ todos: newTodos });
    if (showToast) showToast('Todo raderad', () => onUpdate({ todos: lastDeletedTodos.current }));
  };

  let dlClass = '', dlText = '';
  if (days < 0)        { dlClass = 'overdue'; dlText = `${Math.abs(days)} d försenad`; }
  else if (days === 0) { dlClass = 'urgent';  dlText = 'Idag'; }
  else if (days <= 7)  { dlClass = 'urgent';  dlText = `${days} d kvar`; }
  else                 { dlText = `${days} d kvar`; }

  const progressPct = todoTotal > 0 ? Math.round((todoDone / todoTotal) * 100) : 0;

  return (
    <div className={`tl-project ${isArchived ? 'archived' : ''}`}>
      <div className="tl-project-header">
        <button className="tl-collapse-btn" onClick={() => setCollapsed((c) => !c)} aria-label={collapsed ? 'Expandera' : 'Minimera'}>
          <ChevronDown size={18} style={{ transform: collapsed ? 'rotate(-90deg)' : 'rotate(0)', transition: 'transform 200ms' }} />
        </button>
        {editingId === '__name__'
          ? <input autoFocus className="tl-project-name-input" value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditingId(null); }}
            />
          : <h3 className="tl-project-name" onClick={() => startEdit('__name__', project.name)}>{project.name}</h3>
        }
        {todoTotal > 0 && (
          <span className="tl-todo-counter">{todoDone}/{todoTotal} klara</span>
        )}
        {isArchived && project.archived_at && (
          <span className="tl-archived-date">Arkiverad {formatDate(project.archived_at)}</span>
        )}
        {!isArchived && (
          editingDeadline
            ? <input
                autoFocus
                type="date"
                className="tl-deadline-input"
                defaultValue={project.deadline}
                onBlur={(e) => commitDeadline(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') commitDeadline(e.target.value); if (e.key === 'Escape') setEditingDeadline(false); }}
              />
            : <div className={`tl-deadline-badge ${dlClass}`} style={{ cursor: 'pointer' }} onClick={() => setEditingDeadline(true)}>
                <Calendar size={12} />
                {dlText}
              </div>
        )}
        {isDone && !isArchived && (
          <button className="tl-archive-btn" onClick={onArchive}>Arkivera</button>
        )}
        <button className="tl-icon-btn" onClick={onDelete} aria-label="Ta bort projekt">
          <Trash2 size={16} />
        </button>
      </div>

      {!collapsed && !isArchived && (
        <div className="tl-project-desc-row">
          {editingDesc
            ? <input
                autoFocus
                className="tl-desc-input"
                value={descText}
                placeholder="Lägg till beskrivning…"
                onChange={(e) => setDescText(e.target.value)}
                onBlur={commitDesc}
                onKeyDown={(e) => { if (e.key === 'Enter') commitDesc(); if (e.key === 'Escape') { setEditingDesc(false); setDescText(project.description || ''); } }}
              />
            : <span
                className={`tl-project-desc ${!(project.description) ? 'empty' : ''}`}
                onClick={() => { setDescText(project.description || ''); setEditingDesc(true); }}
              >
                {project.description || 'Lägg till beskrivning…'}
              </span>
          }
        </div>
      )}

      {todoTotal > 0 && (
        <div className="tl-project-progress-bar">
          <div className="tl-project-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
      )}

      {!collapsed && (<>
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
                ? <EditInput
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditingId(null); }}
                  />
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
                          ? <EditInput
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              onBlur={commitEdit}
                              onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditingId(null); }}
                            />
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
                                  ? <EditInput
                                      value={editText}
                                      onChange={(e) => setEditText(e.target.value)}
                                      onBlur={commitEdit}
                                      onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditingId(null); }}
                                    />
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
      </>)}
    </div>
  );
}

/* ─── Main App ────────────────────────────────────────────── */

export default function TodoLabb() {
  const [activeUser, setActiveUser] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [projects, setProjects]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [toast, setToast]         = useState(null);
  const toastTimerRef             = useRef(null);
  const debounceTimers            = useRef({});

  const [showForm,   setShowForm]   = useState(false);
  const [name,       setName]       = useState('');
  const [checkpoint, setCheckpoint] = useState(0);
  const [deadline,   setDeadline]   = useState(getDefaultDeadline());

  const showToast = (msg, undoFn) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ msg, undoFn: undoFn || null });
    toastTimerRef.current = setTimeout(() => setToast(null), 4000);
  };

  const dismissToast = () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(null);
  };

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
      description: '',
      todos: [],
      created_at: new Date().toISOString(),
    };
    setProjects((prev) => [project, ...prev]);
    resetForm();
    setShowForm(false);
    try {
      await db.upsertProject(project);
    } catch (err) {
      showToast('Kunde inte spara ändringarna');
    }
  };

  /* Update project — immediate state, debounced DB write */
  const updateProject = (id, updates) => {
    const current = projects.find((p) => p.id === id);
    if (!current) return;
    let merged = { ...current, ...updates };
    /* Un-archive if status drops below "Klar" */
    if (updates.checkpoint !== undefined && updates.checkpoint < CHECKPOINTS.length - 1 && merged.archived) {
      merged = { ...merged, archived: false, archived_at: null };
    }
    setProjects((prev) => prev.map((p) => (p.id === id ? merged : p)));

    if (debounceTimers.current[id]) clearTimeout(debounceTimers.current[id]);
    debounceTimers.current[id] = setTimeout(async () => {
      try {
        await db.upsertProject({ ...merged, profile_id: profileId });
      } catch (err) {
        showToast('Kunde inte spara ändringarna');
      }
    }, 800);
  };

  /* Archive project */
  const archiveProject = (id) =>
    updateProject(id, { archived: true, archived_at: new Date().toISOString() });

  /* Delete project */
  const deleteProject = async (id) => {
    if (!window.confirm('Ta bort projektet?')) return;
    setProjects((prev) => prev.filter((p) => p.id !== id));
    await db.deleteProject(id);
  };

  /* ─── Derived lists ─── */

  const allActive = projects.filter((p) => !p.archived);

  // Sort: overdue first, then ≤7 days, then rest
  const overdueProjects  = allActive.filter(p => daysUntil(p.deadline) < 0);
  const urgentProjects   = allActive.filter(p => { const d = daysUntil(p.deadline); return d >= 0 && d <= 7; });
  const normalProjects   = allActive.filter(p => daysUntil(p.deadline) > 7);
  const activeProjects   = [...overdueProjects, ...urgentProjects, ...normalProjects];

  const archivedProjects = projects
    .filter((p) => p.archived)
    .sort((a, b) => new Date(b.archived_at || 0) - new Date(a.archived_at || 0));

  // Summary bar counts
  const overdueCount = overdueProjects.length;
  const todayCount   = urgentProjects.filter(p => daysUntil(p.deadline) === 0).length;
  const ongoingCount = urgentProjects.filter(p => daysUntil(p.deadline) > 0).length + normalProjects.length;

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
      <SidebarStyles />
      <div className="sb-shell">
        <Sidebar activeApp="todo" user={activeUser} onSwitchUser={handleSwitch} />
        <div className="tl-app-root">

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
          {activeProjects.length > 0 && (
            <div className="tl-summary-bar">
              {overdueCount > 0 && <span>{overdueCount} försenade</span>}
              {todayCount > 0 && <span>{todayCount} idag</span>}
              {ongoingCount > 0 && <span>{ongoingCount} pågående</span>}
            </div>
          )}
          {activeProjects.length === 0 && archivedProjects.length === 0 ? (
            <div className="tl-empty-state">
              <h3>Inga projekt ännu</h3>
              <p>Skapa ditt första projekt för att komma igång.</p>
            </div>
          ) : activeProjects.length === 0 ? (
            <div className="tl-empty-state">
              <h3>Inga aktiva projekt</h3>
              <p>Alla projekt är arkiverade. Skapa ett nytt eller återställ ett nedan.</p>
            </div>
          ) : (
            activeProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onUpdate={(u) => updateProject(project.id, u)}
                onDelete={() => deleteProject(project.id)}
                onArchive={() => archiveProject(project.id)}
                showToast={showToast}
              />
            ))
          )}
        </section>

        {archivedProjects.length > 0 && (
          <section className="tl-archive-section">
            <h2 className="tl-archive-heading">Arkiverade projekt</h2>
            {archivedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isArchived
                onUpdate={(u) => updateProject(project.id, u)}
                onDelete={() => deleteProject(project.id)}
                onArchive={() => archiveProject(project.id)}
                showToast={showToast}
              />
            ))}
          </section>
        )}

        </div>
      </div>

      {toast && (
        <div className="tl-toast">
          <span>{toast.msg}</span>
          {toast.undoFn && (
            <button className="tl-toast-undo" onClick={() => { toast.undoFn(); dismissToast(); }}>
              Ångra
            </button>
          )}
        </div>
      )}
    </>
  );
}

/* ─── Scoped Styles ───────────────────────────────────────── */

function ScopedStyles() {
  return (
    <style>{`
      .tl-app-root {
        flex: 1;
        min-width: 0;
        padding: 40px 48px 96px;
        color: var(--color-text);
        font-family: var(--font-body, "Montserrat", sans-serif);
        -webkit-font-smoothing: antialiased;
      }

      .tl-fullscreen-loader {
        min-height: 100vh; display: flex; align-items: center; justify-content: center;
        color: var(--color-text-faint); font-size: 15px;
        font-family: var(--font-body, "Montserrat", sans-serif);
      }
      .tl-loading { color: var(--color-text-faint); font-size: 13px; margin: 0; }

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
        background: var(--color-red); color: var(--color-text-inverse); border: 0;
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
      .tl-app-root input[type="date"] { color-scheme: light dark; }
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

      .tl-summary-bar {
        font-size: 13px; color: var(--color-text-muted); margin-bottom: 12px;
        display: flex; gap: 12px; flex-wrap: wrap;
      }
      .tl-summary-bar span::after { content: ' ·'; }
      .tl-summary-bar span:last-child::after { content: ''; }

      .tl-project { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 16px; margin-bottom: 16px; overflow: hidden; }
      .tl-project.archived { background: var(--color-surface-2); border-color: var(--color-border); }
      .tl-project.archived .tl-project-name { opacity: 0.85; }
      .tl-project-header { padding: 20px 24px 12px; display: flex; align-items: center; gap: 12px; }
      .tl-collapse-btn {
        background: transparent; border: 0; color: var(--color-text-faint);
        padding: 2px; margin-left: -4px; border-radius: 6px; cursor: pointer;
        display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
        transition: color 200ms, background 200ms;
      }
      .tl-collapse-btn:hover { color: var(--color-text); background: var(--color-surface-2); }
      .tl-archive-btn {
        background: transparent; border: 1px solid var(--color-border-strong);
        color: var(--color-text-muted); padding: 6px 14px; border-radius: 999px;
        font-family: inherit; font-size: 12px; font-weight: 600; cursor: pointer;
        white-space: nowrap; transition: all 200ms;
      }
      .tl-archive-btn:hover { background: var(--color-success); border-color: var(--color-success); color: #FFFFFF; }
      .tl-archived-date { font-size: 12px; font-weight: 500; color: var(--color-text-faint); white-space: nowrap; }
      .tl-archive-section { margin-top: 48px; }
      .tl-archive-heading {
        font-size: 13px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
        color: var(--color-text-faint); margin: 0 0 16px; padding-bottom: 12px;
        border-bottom: 1px solid var(--color-border);
      }
      .tl-project-name { font-size: 22px; font-weight: 700; margin: 0; flex: 1; word-break: break-word; cursor: text; border-radius: 6px; padding: 2px 4px; margin-left: -4px; transition: background 150ms; }
      .tl-project-name:hover { background: var(--color-surface-2); }
      .tl-project-name-input { flex: 1; font-size: 22px; font-weight: 700; background: var(--color-surface); border: 1px solid var(--color-blue); border-radius: 8px; padding: 2px 8px; outline: none; margin-left: -4px; color: var(--color-text); font-family: inherit; width: 0; }
      .tl-deadline-badge {
        display: inline-flex; align-items: center; gap: 6px;
        font-size: 12px; font-weight: 500; color: var(--color-text-muted);
        padding: 5px 10px; border-radius: 999px;
        background: var(--color-surface-2); border: 1px solid var(--color-border); white-space: nowrap;
      }
      .tl-deadline-badge.urgent { color: var(--color-warn); border-color: rgba(224,169,59,0.3); }
      .tl-deadline-badge.overdue { background: rgba(214,59,59,0.12); color: var(--color-red); border-color: rgba(214,59,59,0.4); }
      .tl-deadline-input {
        font-size: 12px; font-weight: 500; color: var(--color-text);
        padding: 4px 8px; border-radius: 999px; border: 1px solid var(--color-blue);
        background: var(--color-surface); font-family: inherit; outline: none;
        width: auto; white-space: nowrap; box-sizing: border-box;
      }
      .tl-todo-counter {
        font-size: 12px; font-weight: 500; color: var(--color-text-faint);
        white-space: nowrap; flex-shrink: 0;
      }

      .tl-project-desc-row {
        padding: 0 24px 8px 52px;
      }
      .tl-project-desc {
        font-size: 13px; color: var(--color-text-muted); cursor: text;
        border-radius: 4px; padding: 2px 4px; display: inline-block;
        transition: background 150ms;
      }
      .tl-project-desc.empty {
        color: var(--color-text-faint); opacity: 0; transition: opacity 150ms;
      }
      .tl-project-desc-row:hover .tl-project-desc.empty { opacity: 1; }
      .tl-desc-input {
        font-size: 13px; color: var(--color-text); font-family: inherit;
        background: var(--color-surface); border: 1px solid var(--color-blue);
        border-radius: 6px; padding: 3px 8px; outline: none;
        width: 100%; box-sizing: border-box;
      }

      .tl-project-progress-bar {
        height: 3px; background: var(--color-border); width: 100%;
      }
      .tl-project-progress-fill {
        height: 100%; background: var(--color-success); transition: width 300ms ease;
      }

      .tl-icon-btn {
        background: transparent; border: 0; color: var(--color-text-faint);
        padding: 6px; border-radius: 6px; cursor: pointer;
        display: inline-flex; align-items: center; justify-content: center;
        transition: color 200ms, background 200ms;
      }
      .tl-icon-btn:hover { color: var(--color-text); background: var(--color-surface-2); }

      .tl-theme-toggle {
        background: transparent; border: 0; color: var(--color-text-muted);
        padding: 6px; border-radius: 8px; cursor: pointer;
        display: inline-flex; align-items: center; justify-content: center;
        transition: color 200ms, background 200ms;
      }
      .tl-theme-toggle:hover { color: var(--color-text); background: var(--color-surface-2); }

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
      .tl-todos { border-top: 1px solid var(--color-border); padding: 14px 24px 18px; background: rgba(128,128,128,0.04); }
      .tl-empty-hint { font-size: 13px; color: var(--color-text-faint); margin: 4px 0 12px; font-style: italic; }

      .tl-todo-block { margin-bottom: 1px; }

      .tl-row { display: flex; align-items: flex-start; gap: 8px; padding: 5px 0; }
      .tl-row.done .tl-row-text { text-decoration: line-through; color: var(--color-text-faint); }
      .tl-row-text {
        flex: 1; word-break: break-word; padding-top: 1px;
        transition: color 200ms; cursor: text; border-radius: 4px;
      }
      .tl-row-text:hover { background: var(--color-surface-2); }
      .tl-row.l0 .tl-row-text { font-size: 16px; font-weight: 500; color: var(--color-text); }
      .tl-row.l1 .tl-row-text { font-size: 14px; font-weight: 400; color: var(--color-text); }
      .tl-row.l2 .tl-row-text { font-size: 13px; font-weight: 400; color: var(--color-text-muted); }
      .tl-row.l0 { padding: 6px 0; }
      .tl-row.l1 { padding: 4px 0; }
      .tl-row.l2 { padding: 3px 0; }

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

      .tl-toast {
        position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
        background: var(--color-text); color: var(--color-text-inverse);
        padding: 12px 20px; border-radius: 10px; font-size: 14px; font-weight: 500;
        box-shadow: var(--shadow-lg); z-index: 100; white-space: nowrap;
        display: inline-flex; align-items: center; gap: 12px;
        animation: tl-toast-in 200ms ease;
      }
      .tl-toast-undo {
        background: transparent; border: 0; color: var(--color-text-inverse);
        font-family: inherit; font-size: 14px; font-weight: 700;
        cursor: pointer; padding: 0; text-decoration: underline; opacity: 0.85;
        transition: opacity 150ms;
      }
      .tl-toast-undo:hover { opacity: 1; }
      @keyframes tl-toast-in {
        from { opacity: 0; transform: translateX(-50%) translateY(8px); }
        to   { opacity: 1; transform: translateX(-50%) translateY(0); }
      }

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
