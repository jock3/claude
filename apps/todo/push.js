/* Web-push opt-in for the todo board.
 *
 * The VAPID public key is public by design (it identifies our push sender to
 * the browser); the private half lives server-side in todo_secrets and only the
 * reminder edge function reads it. Subscriptions are stored per device+profile
 * and owner-scoped by RLS. */
import { supabase } from '../shared/supabase.js';

export const VAPID_PUBLIC = 'BFlOfqyunxcM8gk8yxQ2qIPsp386Cjek0LiPd0xHEE2wLFY_HniOtg-C9cwsVPIW1VZlVDu-Nv3IlQZ9PJI0Z28';
const SW_URL = '/todo-sw.js';
const SW_SCOPE = '/apps/todo/';

function urlB64ToUint8Array(base64) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(b64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export function pushSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

export function registerSW() {
  if (!pushSupported()) return null;
  return navigator.serviceWorker.register(SW_URL, { scope: SW_SCOPE }).catch((e) => {
    console.warn('todo sw register failed', e);
    return null;
  });
}

export async function pushStatus() {
  if (!pushSupported()) return 'unsupported';
  if (Notification.permission === 'denied') return 'denied';
  const reg = await navigator.serviceWorker.getRegistration(SW_SCOPE);
  const sub = reg && (await reg.pushManager.getSubscription());
  return sub ? 'on' : 'off';
}

export async function enablePush(profileId) {
  if (!pushSupported()) throw new Error('Webbnotiser stöds inte i denna webbläsare.');
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') throw new Error('Notiser nekades. Slå på dem i webbläsarens inställningar.');

  const reg = (await navigator.serviceWorker.getRegistration(SW_SCOPE))
    || (await navigator.serviceWorker.register(SW_URL, { scope: SW_SCOPE }));
  await navigator.serviceWorker.ready;

  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlB64ToUint8Array(VAPID_PUBLIC),
    });
  }
  const json = sub.toJSON();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Ingen session.');

  // Delete-then-insert (no UPDATE policy on the table by design): re-subscribing
  // the same endpoint just replaces the row.
  await supabase.from('todo_push_subscriptions').delete().eq('endpoint', json.endpoint);
  const { error } = await supabase.from('todo_push_subscriptions').insert({
    profile_id: profileId, user_id: user.id,
    endpoint: json.endpoint, p256dh: json.keys.p256dh, auth: json.keys.auth,
  });
  if (error) throw error;
  return 'on';
}

export async function disablePush() {
  const reg = await navigator.serviceWorker.getRegistration(SW_SCOPE);
  const sub = reg && (await reg.pushManager.getSubscription());
  if (sub) {
    await supabase.from('todo_push_subscriptions').delete().eq('endpoint', sub.endpoint);
    await sub.unsubscribe();
  }
  return 'off';
}
