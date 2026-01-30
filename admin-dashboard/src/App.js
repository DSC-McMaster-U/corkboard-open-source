import { useEffect, useMemo, useState } from "react";
import { getEvents } from "./corkboardApi";
import EventList from "./components/EventList";
import EventEditor from "./components/EventEditor";

function toDateTimeLocal(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default function App() {
  const [events, setEvents] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    start_time: "",
    cost: "",
    status: "",
    source_url: "",
    artist: "",
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [msg, setMsg] = useState(null);

  const selected = useMemo(
    () => events.find((e) => e.id === selectedId) || null,
    [events, selectedId]
  );

  const dirty = useMemo(() => {
    if (!selected) return false;
    const baseline = {
      title: selected.title || "",
      description: selected.description || "",
      start_time: toDateTimeLocal(selected.start_time),
      cost: selected.cost === null || selected.cost === undefined ? "" : String(selected.cost),
      status: selected.status || "",
      source_url: selected.source_url || "",
      artist: selected.artist || "",
    };
    return Object.keys(baseline).some((k) => baseline[k] !== form[k]);
  }, [selected, form]);

  async function refresh() {
    setLoading(true);
    setErr(null);
    setMsg(null);
    try {
      const list = await getEvents(200);
      setEvents(list);
      if (list.length && !selectedId) setSelectedId(list[0].id);
      setMsg(`Loaded ${list.length} events`);
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (!selected) return;
    setForm({
      title: selected.title || "",
      description: selected.description || "",
      start_time: toDateTimeLocal(selected.start_time),
      cost: selected.cost === null || selected.cost === undefined ? "" : String(selected.cost),
      status: selected.status || "",
      source_url: selected.source_url || "",
      artist: selected.artist || "",
    });
    setErr(null);
    setMsg(null);
  }, [selected]);

  function copyDraftJson() {
    const payload = {
      id: selected?.id,
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      start_time: form.start_time ? new Date(form.start_time).toISOString() : undefined,
      cost: form.cost === "" ? undefined : Number(form.cost),
      status: form.status.trim() || undefined,
      source_url: form.source_url.trim() || undefined,
      artist: form.artist.trim() || undefined,
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setMsg("Copied draft JSON to clipboard.");
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", height: "100vh" }}>
      <div style={{ borderRight: "1px solid #ddd", padding: 12, overflow: "auto" }}>
        <h2 style={{ marginTop: 0 }}>Corkboard Admin (Read-only)</h2>

        <button onClick={refresh} disabled={loading} style={{ marginBottom: 12 }}>
          {loading ? "Refreshing..." : "Refresh events"}
        </button>

        {err && <div style={{ color: "crimson", whiteSpace: "pre-wrap" }}>{err}</div>}
        {msg && <div style={{ color: "green" }}>{msg}</div>}

        <EventList events={events} selectedId={selectedId} onSelect={setSelectedId} />
      </div>

      <div style={{ padding: 16, overflow: "auto" }}>
        <EventEditor
          event={selected}
          form={form}
          setForm={setForm}
          dirty={dirty}
          onCopyDraft={copyDraftJson}
        />
      </div>
    </div>
  );
}
