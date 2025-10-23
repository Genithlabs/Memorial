// /pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import type { Fields, Files, File as FormFile } from 'formidable';
import { questions, conversations } from '@/mocks/chat';

export const config = {
    api: {
        bodyParser: false, // ⬅️ formidable을 위해 off
    },
};

type NextHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void;

const parseForm = (req: NextApiRequest) =>
    new Promise<{ fields: Fields; files: Files }>((resolve, reject) => {
        const form = formidable({
            multiples: true,
            keepExtensions: true,
            uploadDir: '/tmp', // 서버 임시 경로 (환경에 맞게 수정 가능)
        });
        form.parse(req, (err, fields, files) => {
            if (err) return reject(err);
            resolve({ fields, files });
        });
    });

const handler: NextHandler = async (req, res) => {
    const { method } = req;

    if (method === 'GET') {
        const { type } = req.query;

        switch (type) {
            case 'questions':
                return res.status(200).json({ questions });

            case 'conversations':
                return res.status(200).json({ conversations });

            default:
                return res.status(200).json({ questions });
        }
    }

    if (method === 'POST') {
        try {
            const { fields, files } = await parseForm(req);

            // fields
            const reason = Array.isArray(fields.reason) ? fields.reason[0] : (fields.reason as string | undefined);
            const messagesRaw = Array.isArray(fields.messages) ? fields.messages[0] : (fields.messages as string | undefined);
            const questionsRaw = Array.isArray(fields.questions) ? fields.questions[0] : (fields.questions as string | undefined);

            const parsedMessages: Array<{ id: string; text: string; isUser: boolean; timestamp: string }> =
                messagesRaw ? JSON.parse(messagesRaw) : [];
            const parsedQuestions: string[] = questionsRaw ? JSON.parse(questionsRaw) : [];

            // files
            const fileList: Array<{
                field: string;
                originalFilename?: string | null;
                mimetype?: string | null;
                size: number;
                filepath: string;
            }> = [];

            // files['files[]']가 단일/배열 모두 가능
            const filesAny = (files['files[]'] ?? files.files) as FormFile | FormFile[] | undefined;
            const arr = filesAny ? (Array.isArray(filesAny) ? filesAny : [filesAny]) : [];
            for (const f of arr) {
                fileList.push({
                    field: 'files[]',
                    originalFilename: f.originalFilename ?? null,
                    mimetype: f.mimetype ?? null,
                    size: f.size,
                    filepath: f.filepath, // 업로드된 임시 경로
                });
            }

            // 모의 저장 (메모리)
            const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
            conversations.push({
                id,
                reason,
                messages: parsedMessages,
                questions: parsedQuestions,
                files: fileList,
                createdAt: new Date().toISOString(),
            });

            return res.status(200).json({ ok: true, id });
        } catch (e: any) {
            return res.status(500).json({ ok: false, error: e?.message ?? 'parse_failed' });
        }
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
};

export default handler;
