import crypto from 'crypto';

const algorithm = 'aes-256-cbc';

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
if (!ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY 환경변수가 설정되지 않았습니다.');
}
if (ENCRYPTION_KEY.length !== 64) {
    throw new Error('ENCRYPTION_KEY는 32바이트(64자리 헥스 문자열)여야 합니다.');
}
const key = Buffer.from(ENCRYPTION_KEY, 'hex');

/**
 * 암호화
 * @param text 암호화할 문자열
 * @returns IV와 암호문을 ':'로 구분하여 반환
 */
export function encrypt(text: string): string {
    const iv = crypto.randomBytes(16); // 16바이트 IV 생성
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    // IV와 암호문을 ':'로 구분해서 반환
    return `${iv.toString('hex')}:${encrypted}`;
}

/**
 * 복호화합니다.
 * @param encryptedText 암호화된 텍스트 (IV:암호문 형식)
 * @returns 복호화된 원본 문자열
 */
export function decrypt(encryptedText: string): string {
    if (encryptedText) {
        const parts = encryptedText.split(':');
        if (parts.length !== 2) {
            throw new Error('잘못된 암호화 텍스트 형식입니다.');
        }
        const [ivHex, encrypted] = parts;
        const iv = Buffer.from(ivHex, 'hex');
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } else {
        return encryptedText;
    }

}
