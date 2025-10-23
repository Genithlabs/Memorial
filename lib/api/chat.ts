// /lib/api/chat.ts
export async function fetchQuestions() {
    const res = await fetch('/api/chat?type=questions', { cache: 'no-store' });
    if (!res.ok) throw new Error('failed to fetch questions');
    return res.json() as Promise<{ questions: string[] }>;
}

export type MessageDTO = {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: string; // ISO (클라이언트 Date → .toISOString())
};

export async function postChat(opts: {
    messages: MessageDTO[];
    questions: string[];
    files?: File[];
    reason?: string;
}) {
    const form = new FormData();
    if (opts.reason) form.append('reason', opts.reason);
    form.append('messages', JSON.stringify(opts.messages));
    form.append('questions', JSON.stringify(opts.questions));
    (opts.files ?? []).forEach((f, i) => form.append('files[]', f, f.name || `upload_${i}`));

    const res = await fetch('/api/chat', {
        method: 'POST',
        body: form,
        credentials: 'include',
    });

    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`POST /api/chat failed: ${res.status} ${text}`);
    }
    return res.json() as Promise<{ ok: true; id: string }>;
}