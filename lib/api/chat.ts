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

    // 순서: name -> birth_start -> questions[] -> profile
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

export async function submitChat(opts: {
    accessToken: string;
    name: string;
    birth_start: string;
    prompts: string; // textarea 답변 합친 문자열
    profile: File;   // 업로드 파일 1개
}) {
    const formData = new FormData();
    formData.append('name', opts.name);
    formData.append('birth_start', opts.birth_start);
    formData.append('prompts', opts.prompts);
    formData.append('profile', opts.profile, opts.profile.name);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/submit`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${opts.accessToken}`,
        },
        body: formData,
    });

    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`submitChat failed: ${res.status} ${text}`);
    }

    return res.json();
}
