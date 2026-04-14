import { type FormEvent, useEffect, useState } from 'react';
import { api, ApiError } from '../lib/api';
import type { Task } from '../types';

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(false);
  const [pending, setPending] = useState(false);

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
    setPending(true);
    try {
      await api('/tasks', {
        method: 'POST',
        body: JSON.stringify({ name, description, priority }),
      });
      setName('');
      setDescription('');
      setPriority(false);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo crear la tarea');
    } finally {
      setPending(false);
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

  async function removeTask(id: number) {
    if (!confirm('¿Eliminar esta tarea?')) return;
    try {
      await api(`/tasks/${id}`, { method: 'DELETE' });
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo eliminar');
    }
  }

  return (
    <div className="page">
      <h1>Mis tareas</h1>
      {error ? <p className="error">{error}</p> : null}
      <form className="card inline-form" onSubmit={onCreate}>
        <h2>Nueva tarea</h2>
        <div className="row">
          <label>
            Nombre
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Descripción
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
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
        <button type="submit" disabled={pending}>
          Agregar
        </button>
      </form>
      <ul className="task-list">
        {tasks.map((t) => (
          <li key={t.id} className="card task-item">
            <div>
              <strong>{t.name}</strong>
              <span className={`badge ${t.priority ? 'high' : ''}`}>
                {t.priority ? 'Alta' : 'Normal'}
              </span>
              <p>{t.description}</p>
            </div>
            <div className="task-actions">
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={Boolean(t.completed)}
                  onChange={() => void toggleCompleted(t)}
                />
                Hecha
              </label>
              <button type="button" className="danger" onClick={() => void removeTask(t.id)}>
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
      {tasks.length === 0 ? <p className="muted">Aún no hay tareas.</p> : null}
    </div>
  );
}
