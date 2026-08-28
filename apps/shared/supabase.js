import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dgpugcaffoguppzvbqlj.supabase.co';
const ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRncHVnY2FmZm9ndXBwenZicWxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNTQ4MjQsImV4cCI6MjA5MzczMDgyNH0.oSjQ5jy9oA3mt7uP4pUDWC3FsMnM6CAL0EWpfMoS7Ls';

export const supabase = createClient(SUPABASE_URL, ANON_KEY);

/* Auth for the hub apps.
 *
 * Identity is a name + 4-digit PIN. Supabase has no native username login, so
 * the hub-login edge function is the real auth boundary: it turns (name, pin)
 * into a session and joins that session's uid to the person's profile via
 * profile_members. The row-level policies on todo_boards / projects /
 * track3r_* all resolve ownership through that membership.
 *
 * The session persists in localStorage under the supabase client's own key, and
 * every hub app is same-origin, so a session established here on the hub is the
 * session the apps read — that is what makes one login cover all of them. */
const FUNCTIONS_URL = `${SUPABASE_URL}/functions/v1`;

export async function hubLogin(name, pin) {
  const res = await fetch(`${FUNCTIONS_URL}/hub-login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify({ name, pin }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // The function returns { error: 'wrong_pin' | 'invalid_pin' | ... }. Surface
    // the code so the caller can show the right message.
    const err = new Error(data.error || `login_failed_${res.status}`);
    err.code = data.error || `http_${res.status}`;
    throw err;
  }

  // Writes the session to the client's storage, so every same-origin app sees it.
  const { error } = await supabase.auth.setSession({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
  });
  if (error) throw error;

  return { uid: data.uid, profileId: data.profile_id, name: data.name };
}

export async function currentSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function hubLogout() {
  await supabase.auth.signOut();
}
