// /mocks/chat.ts
export const questions = [
    "안녕하세요! 본인의 이름을 알려주세요.",
    "태어난 날짜는 언제인가요?",
    "어린 시절은 어디에서 보내셨나요? 고향을 묘사해 주세요.",
    "웃음을 주는 어린 시절의 기억이 있다면 무엇인가요?",
    "인생에서 가장 큰 영향을 준 사람은 누구인가요?",
    "인생에서 가장 자랑스러운 순간은 언제였나요?",
    "극복했던 가장 힘든 도전은 무엇이었나요?",
    "젊은 세대에게 꼭 전하고 싶은 한 가지 조언은 무엇인가요?",
    "가족이나 친구에게 남기고 싶은 특별한 메시지가 있나요?",
    "마지막으로 프로필 사진을 업로드해주세요."
];

export interface StoredConversation {
    id: string;
    reason?: string;
    messages: Array<{ id: string; text: string; isUser: boolean; timestamp: string }>;
    questions: string[];
    files: Array<{
        field: string;
        originalFilename?: string | null;
        mimetype?: string | null;
        size: number;
        filepath: string; // temp 저장 경로
    }>;
    createdAt: string;
}

export const conversations: StoredConversation[] = [];