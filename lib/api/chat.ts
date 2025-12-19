// /lib/api/chat.ts
type FetchQuestionsResponse = {
    result?: 'success' | 'fail' | string;
    message?: string;
    data?: {
        name?: string;
        birth_start?: string;
        questions?: unknown[];
        profile?: string;
    };
};

export async function fetchQuestions(): Promise<{ questions: string[] }> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/questions`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
    });

    if (!res.ok) return { questions: [] };

    const json = (await res.json()) as FetchQuestionsResponse;

    if (json?.result && json.result !== 'success') return { questions: [] };

    const d = json?.data ?? {};
    const merged: string[] = [];

    if (typeof d.name === 'string' && d.name.trim()) merged.push(d.name.trim());
    if (typeof d.birth_start === 'string' && d.birth_start.trim()) merged.push(d.birth_start.trim());

    if (Array.isArray(d.questions)) {
        merged.push(
            ...d.questions
                .filter((q): q is string => typeof q === 'string' && q.trim().length > 0)
                .map((q) => q.trim())
        );
    }

    if (typeof d.profile === 'string' && d.profile.trim()) merged.push(d.profile.trim());

    return { questions: merged };
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