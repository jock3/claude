// todo-reminders — scheduled scan of due tasks -> web push.
//
// Runs from pg_cron (daily). Guarded by a shared cron_key held in todo_secrets,
// so it's safe to expose without a JWT. Reads the VAPID keypair from the same
// service-role-only table and sends a per-profile digest of tasks due today or
// overdue to every subscribed device. Expired subscriptions (404/410) are pruned.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

  const { data: secretRows } = await admin.from("todo_secrets").select("key,value");
  const secrets = Object.fromEntries((secretRows || []).map((r) => [r.key, r.value]));

  const key = req.headers.get("x-cron-key");
  if (!secrets.cron_key || key !== secrets.cron_key) {
    return new Response(JSON.stringify({ error: "forbidden" }), { status: 403, headers: { "Content-Type": "application/json" } });
  }

  webpush.setVapidDetails(secrets.vapid_subject, secrets.vapid_public, secrets.vapid_private);

  // "Today" in the user's timezone, so an 08:00 run doesn't count tomorrow.
  const todayKey = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Stockholm" });

  const { data: subs } = await admin.from("todo_push_subscriptions").select("*");
  const byProfile = new Map<string, any[]>();
  for (const s of subs || []) {
    if (!byProfile.has(s.profile_id)) byProfile.set(s.profile_id, []);
    byProfile.get(s.profile_id)!.push(s);
  }

  let sent = 0, pruned = 0, notified = 0;
  for (const [profileId, list] of byProfile) {
    const { data: boardRow } = await admin.from("todo_boards").select("data").eq("profile_id", profileId).maybeSingle();
    const data = boardRow?.data;
    if (!data) continue;

    let dueToday = 0, overdue = 0;
    const names: string[] = [];
    for (const g of data.groups || []) {
      for (const it of g.items || []) {
        if (it.status === "done" || !it.date) continue;
        if (it.date === todayKey) { dueToday++; names.push(it.name); }
        else if (it.date < todayKey) { overdue++; names.push(it.name); }
      }
    }
    if (dueToday + overdue === 0) continue;
    notified++;

    const parts: string[] = [];
    if (dueToday) parts.push(`${dueToday} förfaller idag`);
    if (overdue) parts.push(`${overdue} försenad${overdue > 1 ? "e" : ""}`);
    const body = `${parts.join(" · ")} — ${names.slice(0, 3).join(", ")}${names.length > 3 ? "…" : ""}`;
    const payload = JSON.stringify({ title: "Todo · påminnelse", body, url: "/apps/todo/", tag: "todo-daily" });

    for (const s of list) {
      try {
        await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload);
        sent++;
      } catch (e: any) {
        const code = e?.statusCode;
        if (code === 404 || code === 410) {
          await admin.from("todo_push_subscriptions").delete().eq("endpoint", s.endpoint);
          pruned++;
        }
      }
    }
  }

  return new Response(JSON.stringify({ ok: true, todayKey, notified, sent, pruned }), {
    headers: { "Content-Type": "application/json" },
  });
});
