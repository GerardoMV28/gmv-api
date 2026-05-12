import { type FormEvent, useEffect, useState } from 'react';
import { ConfirmModal, Modal } from '../components/Modal';
import {
  IconCheck,
  IconClipboard,
  IconInbox,
  IconPencil,
  IconPlus,
  IconSparkles,
  IconTrash,
} from '../components/icons';
import { api, ApiError } from '../lib/api';
import type { Task } from '../types';
import {
  TASK_DESC_MAX,
  TASK_NAME_MAX,
  validateTaskDescription,
  validateTaskTitle,
} from '../lib/validation';

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(false);
  const [pendingCreate, setPendingCreate] = useState(false);
  const [createNameErr, setCreateNameErr] = useState<string | null>(null);
  const [createDescErr, setCreateDescErr] = useState<string | null>(null);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editNameErr, setEditNameErr] = useState<string | null>(null);
  const [editDescErr, setEditDescErr] = useState<string | null>(null);
  const [pendingEdit, setPendingEdit] = useState(false);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState(false);

  async function load() {
    try {
      const data = await api<Task[]>('/tasks');
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error al cargar tareas');
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    const nt = validateTaskTitle(name);
    const dt = validateTaskDescription(description);
    setCreateNameErr(nt);
    setCreateDescErr(dt);
    if (nt || dt) return;

    setPendingCreate(true);
    try {
      await api('/tasks', {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          priority,
        }),
      });
      setName('');
      setDescription('');
      setPriority(false);
      setCreateNameErr(null);
      setCreateDescErr(null);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo crear la tarea');
    } finally {
      setPendingCreate(false);
    }
  }

  async function toggleCompleted(t: Task) {
    try {
      await api(`/tasks/${t.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ completed: !t.completed }),
      });
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo actualizar');
    }
  }

  function openEdit(t: Task) {
    setEditingTask(t);
    setEditName(t.name);
    setEditDescription(t.description);
    setEditPriority(t.priority);
    setEditError(null);
    setEditNameErr(null);
    setEditDescErr(null);
  }

  async function onSaveEdit(e: FormEvent) {
    e.preventDefault();
    if (!editingTask) return;
    const nt = validateTaskTitle(editName);
    const dt = validateTaskDescription(editDescription);
    setEditNameErr(nt);
    setEditDescErr(dt);
    if (nt || dt) return;

    setPendingEdit(true);
    setEditError(null);
    try {
      await api(`/tasks/${editingTask.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: editName.trim(),
          description: editDescription.trim(),
          priority: editPriority,
        }),
      });
      setEditingTask(null);
      await load();
    } catch (err) {
      setEditError(err instanceof ApiError ? err.message : 'No se pudo guardar');
    } finally {
      setPendingEdit(false);
    }
  }

  async function confirmDelete() {
    if (deleteId == null) return;
    setPendingDelete(true);
    try {
      await api(`/tasks/${deleteId}`, { method: 'DELETE' });
      setDeleteId(null);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo eliminar');
      setDeleteId(null);
    } finally {
      setPendingDelete(false);
    }
  }

  return (
    <div className="page page-tasks">
      <div className="form-strip-centered">
        <div className="page-intro">
          <h1 className="page-title-with-icon">
            <IconSparkles motion="orbit" className="page-title-icon" />
            Mis tareas
          </h1>
          <p className="page-lead">
            Crea tareas, márcalas como hechas con la casilla y edita o elimina cuando quieras.
          </p>
        </div>

        {error ? (
          <div className="notice notice-error" role="alert">
            {error}
            <button type="button" className="notice-dismiss" onClick={() => setError(null)}>
              Cerrar
            </button>
          </div>
        ) : null}

        <form className="card card-section inline-form" onSubmit={onCreate} noValidate>
          <div className="card-section-head">
            <h2 className="card-title-row">
              <IconPlus motion="pulse" />
              Nueva tarea
            </h2>
          </div>
          <div className="row">
            <label>
              Nombre
              <input
                value={name}
                onChange={(ev) => {
                  const v = ev.target.value;
                  setName(v);
                  setCreateNameErr(validateTaskTitle(v));
                }}
                maxLength={TASK_NAME_MAX}
                aria-invalid={createNameErr ? true : undefined}
                required
              />
              {createNameErr ? <span className="field-error">{createNameErr}</span> : null}
            </label>
            <label>
              Descripción
              <input
                value={description}
                onChange={(ev) => {
                  const v = ev.target.value;
                  setDescription(v);
                  setCreateDescErr(validateTaskDescription(v));
                }}
                maxLength={TASK_DESC_MAX}
                aria-invalid={createDescErr ? true : undefined}
                required
              />
              {createDescErr ? <span className="field-error">{createDescErr}</span> : null}
            </label>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={priority}
                onChange={(e) => setPriority(e.target.checked)}
              />
              Prioritaria
            </label>
          </div>
          <button type="submit" disabled={pendingCreate} className="btn-with-icon">
            <IconPlus motion={pendingCreate ? 'none' : 'bob'} />
            {pendingCreate ? 'Guardando…' : 'Agregar tarea'}
          </button>
        </form>
      </div>

      <section className="task-section" aria-label="Lista de tareas">
        <h2 className="task-section-title">
          <IconClipboard motion="sway" />
          Tu lista
        </h2>
        <ul className="task-list">
          {tasks.map((t) => (
            <li key={t.id} className="card task-item">
              <div className="task-main">
                <div className="task-title-row">
                  <strong className="task-name">{t.name}</strong>
                  <span className={`badge ${t.priority ? 'high' : ''}`}>
                    {t.priority ? 'Alta' : 'Normal'}
                  </span>
                  {t.completed ? (
                    <span className="badge badge-done">Hecha</span>
                  ) : null}
                </div>
                <p className="task-desc">{t.description}</p>
              </div>
              <div className="task-actions">
                <label className="checkbox task-done-check">
                  <input
                    type="checkbox"
                    checked={Boolean(t.completed)}
                    onChange={() => void toggleCompleted(t)}
                  />
                  <IconCheck motion={t.completed ? 'pulse' : 'float'} />
                  <span>Hecha</span>
                </label>
                <div className="task-buttons">
                  <button
                    type="button"
                    className="btn-secondary btn-with-icon"
                    onClick={() => openEdit(t)}
                  >
                    <IconPencil motion="sway" />
                    Editar
                  </button>
                  <button
                    type="button"
                    className="danger btn-with-icon"
                    onClick={() => setDeleteId(t.id)}
                  >
                    <IconTrash motion="bob" />
                    Eliminar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {tasks.length === 0 ? (
          <div className="task-empty task-empty-illu">
            <IconInbox motion="float" />
            <p className="muted">Aún no hay tareas. Crea la primera arriba.</p>
          </div>
        ) : null}
      </section>

      <Modal
        open={!!editingTask}
        title="Editar tarea"
        onClose={() => {
          setEditingTask(null);
          setEditError(null);
          setEditNameErr(null);
          setEditDescErr(null);
        }}
        closeOnBackdrop={!pendingEdit}
        footer={
          <>
            <button
              type="button"
              className="btn-ghost"
              disabled={pendingEdit}
              onClick={() => {
                setEditingTask(null);
                setEditError(null);
                setEditNameErr(null);
                setEditDescErr(null);
              }}
            >
              Cancelar
            </button>
            <button type="submit" form="form-edit-task" disabled={pendingEdit} className="btn-with-icon">
              <IconCheck motion={pendingEdit ? 'none' : 'pulse'} />
              {pendingEdit ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </>
        }
      >
        <form id="form-edit-task" onSubmit={(e) => void onSaveEdit(e)} noValidate>
          {editError ? <p className="error">{editError}</p> : null}
          <label>
            Nombre
            <input
              value={editName}
              onChange={(ev) => {
                const v = ev.target.value;
                setEditName(v);
                setEditNameErr(validateTaskTitle(v));
              }}
              maxLength={TASK_NAME_MAX}
              aria-invalid={editNameErr ? true : undefined}
              required
            />
            {editNameErr ? <span className="field-error">{editNameErr}</span> : null}
          </label>
          <label>
            Descripción
            <input
              value={editDescription}
              onChange={(ev) => {
                const v = ev.target.value;
                setEditDescription(v);
                setEditDescErr(validateTaskDescription(v));
              }}
              maxLength={TASK_DESC_MAX}
              aria-invalid={editDescErr ? true : undefined}
              required
            />
            {editDescErr ? <span className="field-error">{editDescErr}</span> : null}
          </label>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={editPriority}
              onChange={(e) => setEditPriority(e.target.checked)}
            />
            Prioritaria
          </label>
        </form>
      </Modal>

      <ConfirmModal
        open={deleteId !== null}
        title="¿Eliminar esta tarea?"
        message="Se borrará de forma permanente. Esta acción no se puede deshacer."
        confirmLabel="Sí, eliminar"
        cancelLabel="Cancelar"
        variant="danger"
        pending={pendingDelete}
        onConfirm={() => void confirmDelete()}
        onCancel={() => {
          if (!pendingDelete) setDeleteId(null);
        }}
      />
    </div>
  );
}
