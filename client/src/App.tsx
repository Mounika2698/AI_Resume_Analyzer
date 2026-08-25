import { FormEvent, useEffect, useState } from 'react';

type User = { id: string; name: string; email: string };
type AuthResponse = { success: boolean; message?: string; data?: { user: User; token: string } };
type Resume = {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  name: string | null;
  summary: string | null;
  createdAt: string;
};
type ResumesResponse = { success: boolean; message?: string; data?: { resumes: Resume[] } };
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const TOKEN_KEY = 'resume-analyzer-token';

export default function App() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  async function loadResumes() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    const response = await fetch(`${API_URL}/resumes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = (await response.json()) as ResumesResponse;
    if (response.ok) setResumes(result.data?.resumes ?? []);
  }

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => ({ response, body: await response.json() }))
      .then(({ response, body }) => {
        if (response.ok && body.data?.user) {
          setUser(body.data.user);
          void loadResumes();
        } else localStorage.removeItem(TOKEN_KEY);
      })
      .catch(() => setMessage('Unable to reach the API. Please try again shortly.'));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch(`${API_URL}/auth/${mode === 'login' ? 'login' : 'register'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as AuthResponse;
      if (!response.ok || !result.data)
        return setMessage(result.message || 'Something went wrong. Please try again.');
      localStorage.setItem(TOKEN_KEY, result.data.token);
      setUser(result.data.user);
    } catch {
      setMessage('Unable to reach the API. Please try again shortly.');
    } finally {
      setLoading(false);
    }
  }

  async function uploadResume(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedFile) return setMessage('Choose a PDF, DOCX, or TXT file first.');
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    setLoading(true);
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('resume', selectedFile);
      const response = await fetch(`${API_URL}/resumes`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) return setMessage(result.message || 'Your resume could not be uploaded.');
      setSelectedFile(null);
      event.currentTarget.reset();
      setMessage('Your resume was uploaded and parsed.');
      await loadResumes();
    } catch {
      setMessage('Unable to reach the API. Please try again shortly.');
    } finally {
      setLoading(false);
    }
  }

  async function deleteResume(id: string) {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/resumes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) return setMessage('That resume could not be deleted.');
      setResumes((current) => current.filter((resume) => resume.id !== id));
    } catch {
      setMessage('Unable to reach the API. Please try again shortly.');
    } finally {
      setLoading(false);
    }
  }

  if (user)
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
        <section className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/60 sm:p-12">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
            AI Resume Analyzer
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">Welcome, {user.name}.</h1>
          <p className="mt-3 text-lg text-slate-600">
            Upload a resume to extract and save its details.
          </p>
          <form
            className="mt-8 rounded-2xl border border-dashed border-indigo-300 bg-indigo-50/50 p-6"
            onSubmit={uploadResume}
          >
            <label className="block text-sm font-semibold text-slate-700">
              Resume file
              <input
                required
                type="file"
                accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                className="mt-3 block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-indigo-700"
                onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
              />
            </label>
            <p className="mt-2 text-xs text-slate-500">PDF, DOCX, or TXT. Maximum 10 MB.</p>
            {message && (
              <p role="status" className="mt-4 text-sm text-slate-700">
                {message}
              </p>
            )}
            <button
              disabled={loading}
              className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? 'Uploading…' : 'Upload and parse'}
            </button>
          </form>
          <section className="mt-8">
            <h2 className="text-lg font-bold">Your resumes</h2>
            {resumes.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">No resumes uploaded yet.</p>
            ) : (
              <ul className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-100">
                {resumes.map((resume) => (
                  <li key={resume.id} className="flex items-center justify-between gap-4 p-4">
                    <div>
                      <p className="font-semibold text-slate-800">{resume.fileName}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {resume.name || 'Resume'} · {(resume.fileSize / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      onClick={() => void deleteResume(resume.id)}
                      disabled={loading}
                      className="text-sm font-semibold text-rose-600 hover:text-rose-700 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-6">
            <span className="text-sm text-slate-500">Signed in as {user.email}</span>
            <button
              onClick={() => {
                localStorage.removeItem(TOKEN_KEY);
                setUser(null);
              }}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
            >
              Sign out
            </button>
          </div>
        </section>
      </main>
    );

  const isRegister = mode === 'register';
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 px-5 py-10 sm:py-16">
      <section className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-indigo-100/70 md:grid-cols-[1.05fr_0.95fr]">
        <aside className="bg-indigo-700 p-8 text-white sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-200">
            AI Resume Analyzer
          </p>
          <h1 className="mt-7 text-4xl font-bold leading-tight">
            Build a stronger case for your next role.
          </h1>
          <p className="mt-5 text-indigo-100">
            Securely store your work and get ready for clear, practical resume feedback.
          </p>
          <div className="mt-12 space-y-4 text-sm text-indigo-100">
            <p>✓ Private account access</p>
            <p>✓ Secure password protection</p>
            <p>✓ Your analysis, in one place</p>
          </div>
        </aside>
        <div className="p-8 sm:p-12">
          <div className="mb-8 flex rounded-xl bg-slate-100 p-1">
            {(['login', 'register'] as const).map((option) => (
              <button
                key={option}
                onClick={() => {
                  setMode(option);
                  setMessage('');
                }}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${mode === option ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500'}`}
              >
                {option === 'login' ? 'Sign in' : 'Create account'}
              </button>
            ))}
          </div>
          <h2 className="text-2xl font-bold">
            {isRegister ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {isRegister
              ? 'Start tracking your resume journey.'
              : 'Sign in to continue to your workspace.'}
          </p>
          <form className="mt-8 space-y-5" onSubmit={submit}>
            {isRegister && (
              <label className="block text-sm font-medium text-slate-700">
                Full name
                <input
                  required
                  name="name"
                  minLength={2}
                  maxLength={100}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  placeholder="Avery Morgan"
                />
              </label>
            )}
            <label className="block text-sm font-medium text-slate-700">
              Email address
              <input
                required
                name="email"
                type="email"
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder="you@example.com"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Password
              <input
                required
                name="password"
                type="password"
                minLength={8}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder="At least 8 characters"
              />
            </label>
            {message && (
              <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {message}
              </p>
            )}
            <button
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
