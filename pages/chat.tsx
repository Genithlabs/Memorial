'use client';

import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import ChatMessage from '../components/chat/ChatMessage';
import ChatInput from '../components/chat/ChatInput';
import { fetchQuestions, submitChat } from '@/lib/api/chat';
import { useRouter } from 'next/router';

/** SSR에선 useEffect, CSR에선 useLayoutEffect */
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
/** 겹침 방지 여유(px) */
const EXTRA_GAP = 24;

/** localStorage 키(쿠키 대신) */
const STORAGE_KEY = 'chatProgressV2';

/** IndexedDB: 파일 저장 */
const FILE_DB_NAME = 'chatProfileFileDB';
const FILE_STORE = 'files';
const FILE_KEY = 'profile';

type PersistedMessage = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string; // ISO
};

type ProfileMeta = {
  name: string;
  type: string;
  size: number;
  lastModified: number;
};

type PersistedState = {
  version: 2;
  messages: PersistedMessage[];
  currentQuestionIndex: number;
  isComplete: boolean;

  name: string;
  birthStart: string;
  promptAnswers: string[];

  submitPending: boolean; // 로그인 후 자동 제출 트리거
  profileMeta: ProfileMeta | null;

  savedAt: string;
};

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

/** ---------- IndexedDB helpers ---------- */
let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(FILE_DB_NAME, 1);

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(FILE_STORE)) {
        db.createObjectStore(FILE_STORE);
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

  return dbPromise;
}

async function idbPutFile(file: File) {
  const db = await getDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(FILE_STORE, 'readwrite');
    const store = tx.objectStore(FILE_STORE);

    const payload = {
      blob: file,
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
      savedAt: Date.now(),
    };

    store.put(payload, FILE_KEY);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function idbGetFile(): Promise<File | null> {
  const db = await getDB();
  return await new Promise<File | null>((resolve, reject) => {
    const tx = db.transaction(FILE_STORE, 'readonly');
    const store = tx.objectStore(FILE_STORE);
    const req = store.get(FILE_KEY);

    req.onsuccess = () => {
      const v = req.result;
      if (!v?.blob) return resolve(null);

      const blob: Blob = v.blob;
      const name: string = v.name ?? 'profile';
      const type: string = v.type ?? blob.type ?? '';
      const lastModified: number = v.lastModified ?? Date.now();

      resolve(new File([blob], name, { type, lastModified }));
    };

    req.onerror = () => reject(req.error);
  });
}

async function idbDeleteFile() {
  const db = await getDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(FILE_STORE, 'readwrite');
    const store = tx.objectStore(FILE_STORE);
    store.delete(FILE_KEY);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/** ---------- localStorage helpers ---------- */
function loadPersisted(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedState;
    if (!parsed || parsed.version !== 2) return null;
    if (!Array.isArray(parsed.messages)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function savePersisted(state: PersistedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // 용량/차단 등 무시
  }
}

function clearPersisted() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [isComplete, setIsComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

  const [name, setName] = useState('');
  const [birthStart, setBirthStart] = useState('');
  const [promptAnswers, setPromptAnswers] = useState<string[]>([]);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profileMeta, setProfileMeta] = useState<ProfileMeta | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitPending, setSubmitPending] = useState(false);

  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;

  // router
  const router = useRouter();

  // 스크롤 컨테이너 & 앵커
  const messagesWrapRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // 고정 인풋 실제 높이
  const footerInnerRef = useRef<HTMLDivElement | null>(null);
  const [footerHeight, setFooterHeight] = useState(0);

  // 직전 오프셋 기록(푸터 높이 급증 감지용)
  const lastFooterOffsetRef = useRef(0);

  // 복원 1회만 수행
  const restoredRef = useRef(false);
  const hasPersistedRef = useRef<boolean | null>(null);

  const showLoginRequired = submitPending && status !== 'authenticated';

  // 기념관 여부 체크
  const checkedMemorialRef = useRef(false);
  const [isCheckingMemorial, setIsCheckingMemorial] = useState(false);

  // 현재 푸터 오프셋(높이 + 여유)
  const getFooterOffset = () => {
    const h = footerInnerRef.current?.getBoundingClientRect().height ?? 0;
    return h + EXTRA_GAP;
  };

  // 푸터 높이 추적
  useEffect(() => {
    const update = () => {
      const h = footerInnerRef.current?.getBoundingClientRect().height ?? 0;
      setFooterHeight(h);
    };
    update();

    const ro = new ResizeObserver(update);
    if (footerInnerRef.current) ro.observe(footerInnerRef.current);

    const vv = (window as any).visualViewport;
    if (vv?.addEventListener) {
      vv.addEventListener('resize', update);
      vv.addEventListener('scroll', update);
    }
    window.addEventListener('resize', update);

    return () => {
      ro.disconnect();
      if (vv?.removeEventListener) {
        vv.removeEventListener('resize', update);
        vv.removeEventListener('scroll', update);
      }
      window.removeEventListener('resize', update);
    };
  }, []);

  // 로그인 상태면 "이미 기념관 존재" 먼저 체크 → 있으면 홈으로
  useEffect(() => {
    if (!router.isReady) return;
    if (status !== 'authenticated') return;
    if (!accessToken) return;
    if (checkedMemorialRef.current) return;

    checkedMemorialRef.current = true;

    (async () => {
      try {
        setIsCheckingMemorial(true);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/memorial/view`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const result = await response.json();

          // 이미 기념관이 있으면 /chat 막고 홈으로
          if (result?.result === 'success' && result?.data) {
            // 진행/파일/대기 상태 정리(재진입시 자동제출 방지)
            setSubmitPending(false);
            setIsSubmitting(false);
            setIsTyping(false);
            setProfileFile(null);
            setProfileMeta(null);
            clearPersisted();
            try {
              await idbDeleteFile();
            } catch {}

            router.replace('/');
            return;
          }
        }
      } catch (e) {
        // 체크 실패면 /chat 계속 진행
        console.error('[chat] memorial view check failed', e);
      } finally {
        setIsCheckingMemorial(false);
      }
    })();
  }, [router.isReady, status, accessToken, router]);

  // 질문 불러오기
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setIsLoadingQuestions(true);
        const { questions: qs } = await fetchQuestions();
        if (!mounted) return;
        setQuestions(qs ?? []);
      } finally {
        if (mounted) setIsLoadingQuestions(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // 진행 복원 (questions 로딩 후)
  useEffect(() => {
    if (restoredRef.current) return;
    if (isLoadingQuestions) return;

    const persisted = loadPersisted();
    hasPersistedRef.current = !!persisted;

    if (!persisted) return;

    try {
      const restoredMessages = persisted.messages.map((m) => ({
        id: m.id,
        text: m.text,
        isUser: m.isUser,
        timestamp: new Date(m.timestamp),
      })) as Message[];

      restoredRef.current = true;
      setMessages(restoredMessages);

      const qLen = questions.length;
      const safeIndex = Math.max(
          0,
          Math.min(persisted.currentQuestionIndex ?? 0, Math.max(0, qLen - 1))
      );
      setCurrentQuestionIndex(safeIndex);

      setIsComplete(!!persisted.isComplete);
      setName(persisted.name ?? '');
      setBirthStart(persisted.birthStart ?? '');
      setPromptAnswers(Array.isArray(persisted.promptAnswers) ? persisted.promptAnswers : []);
      setSubmitPending(!!persisted.submitPending);
      setProfileMeta(persisted.profileMeta ?? null);

      // 파일 복원(IndexedDB)
      if (persisted.profileMeta) {
        void idbGetFile()
            .then((f) => {
              if (f) setProfileFile(f);
            })
            .catch(() => {});
      }
    } catch {
      hasPersistedRef.current = false;
    }
  }, [isLoadingQuestions, questions.length]);

  // 첫 질문 표시(저장 복원 없을 때만)
  useEffect(() => {
    if (restoredRef.current) return;
    if (hasPersistedRef.current === true) return;
    if (!isLoadingQuestions && questions.length > 0 && messages.length === 0) {
      const firstQuestion: Message = {
        id: '1',
        text: questions[0],
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([firstQuestion]);
      setCurrentQuestionIndex(0);
    }
  }, [isLoadingQuestions, questions.length, messages.length]);

  // 진행 저장(localStorage)
  useEffect(() => {
    if (isLoadingQuestions) return;

    const payload: PersistedState = {
      version: 2,
      messages: messages.map((m) => ({
        id: m.id,
        text: m.text,
        isUser: m.isUser,
        timestamp: (m.timestamp instanceof Date ? m.timestamp : new Date(m.timestamp)).toISOString(),
      })),
      currentQuestionIndex,
      isComplete,
      name,
      birthStart,
      promptAnswers,
      submitPending,
      profileMeta,
      savedAt: new Date().toISOString(),
    };

    savePersisted(payload);
  }, [
    isLoadingQuestions,
    messages,
    currentQuestionIndex,
    isComplete,
    name,
    birthStart,
    promptAnswers,
    submitPending,
    profileMeta,
  ]);

  // 스크롤
  const scrollToBottomSmooth = () => {
    const el = messagesWrapRef.current;
    if (!el) return;

    const currentOffset = getFooterOffset();
    const prevOffset = lastFooterOffsetRef.current;
    lastFooterOffsetRef.current = currentOffset;

    const delayFrames = currentOffset > prevOffset + 6 ? 3 : 2;

    const doScroll = () => {
      const bottom = Math.max(0, el.scrollHeight - el.clientHeight);
      el.scrollTo?.({ top: bottom, behavior: 'smooth' });
      messagesEndRef.current?.scrollIntoView({ block: 'end' });
    };

    let i = 0;
    const tick = () => {
      if (++i >= delayFrames) doScroll();
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  useIsomorphicLayoutEffect(() => {
    if (messages.length > 0) scrollToBottomSmooth();
  }, [messages.length, footerHeight]);

  // 파일 선택 변경
  const handleFilesChange = async (files: File[]) => {
    const f = files[0] ?? null;
    setProfileFile(f);

    if (!f) {
      setProfileMeta(null);
      try {
        await idbDeleteFile();
      } catch {}
      return;
    }

    setProfileMeta({
      name: f.name,
      type: f.type,
      size: f.size,
      lastModified: f.lastModified,
    });

    try {
      await idbPutFile(f);
    } catch {}
  };

  const pushBot = (text: string) => {
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text,
      isUser: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMessage]);
  };

  const doSubmit = useCallback(async () => {
    if (isSubmitting || isComplete) return;
    if (isCheckingMemorial) return; // 체크 중 제출 금지

    if (!profileFile) {
      pushBot('파일이 선택되지 않았습니다. 파일을 선택한 뒤 다시 시도해주세요.');
      return;
    }

    if (!accessToken) {
      setSubmitPending(true);
      pushBot('로그인이 필요합니다. 로그인 후 자동으로 제출됩니다.');
      return;
    }

    setIsSubmitting(true);
    setIsTyping(true);

    try {
      const prompts = (promptAnswers ?? []).join('\n\n');

      await submitChat({
        accessToken,
        name,
        birth_start: birthStart,
        prompts,
        profile: profileFile,
      });

      pushBot('제출이 완료되었습니다. 소중한 이야기를 들려주셔서 감사합니다. 여러분의 기억과 추억이 안전하게 보관되었습니다.');
      setIsComplete(true);
      setSubmitPending(false);

      setProfileFile(null);
      setProfileMeta(null);
      try {
        await idbDeleteFile();
      } catch {}
    } catch (err: any) {
      const msg = err?.message ?? 'unknown error';
      pushBot(`제출에 실패했습니다. 다시 시도해주세요.\n(${msg})`);

      if (String(msg).includes('401')) {
        setSubmitPending(true);
      }
    } finally {
      setIsSubmitting(false);
      setIsTyping(false);
      scrollToBottomSmooth();
    }
  }, [isSubmitting, isComplete, isCheckingMemorial, profileFile, accessToken, promptAnswers, name, birthStart]);

  // 로그인 후 자동 제출
  useEffect(() => {
    if (isCheckingMemorial) return; // 체크 중엔 자동 제출 금지
    if (!submitPending) return;
    if (status !== 'authenticated') return;
    if (isComplete) return;
    if (!profileFile) return;

    void doSubmit();
  }, [isCheckingMemorial, submitPending, status, isComplete, profileFile, doSubmit]);

  // 메시지 전송 핸들러
  const handleSendMessage = async (text: string) => {
    if (isCheckingMemorial) return; // 체크 중 입력 무시
    if (isComplete || questions.length === 0) return;
    if (isSubmitting) return;

    const qLen = questions.length;
    const isProfileStep = currentQuestionIndex === qLen - 1;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    if (!isProfileStep) {
      if (currentQuestionIndex === 0) setName(text);
      else if (currentQuestionIndex === 1) setBirthStart(text);
      else setPromptAnswers((prev) => [...prev, text]);
    }

    if (isProfileStep) {
      if (!accessToken) {
        setSubmitPending(true);
        pushBot('로그인이 필요합니다. 로그인 후 자동으로 제출됩니다.');
        return;
      }

      await doSubmit();
      return;
    }

    setIsTyping(true);
    setTimeout(() => {
      const nextIndex = currentQuestionIndex + 1;

      if (nextIndex < questions.length) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: questions[nextIndex],
          isUser: false,
          timestamp: new Date(),
        };
        setCurrentQuestionIndex(nextIndex);
        setMessages((prev) => [...prev, botMessage]);
      } else {
        pushBot('모든 질문이 완료되었습니다. 소중한 이야기를 들려주셔서 감사합니다.');
        setIsComplete(true);
      }

      scrollToBottomSmooth();
      setIsTyping(false);
    }, 800);
  };

  const total = questions.length || 1;
  const currentStep = Math.min(currentQuestionIndex + 1, total);

  const inputMode: 'name' | 'birth_start' | 'question' | 'profile' =
      questions.length > 0
          ? currentQuestionIndex === 0
              ? 'name'
              : currentQuestionIndex === 1
                  ? 'birth_start'
                  : currentQuestionIndex === questions.length - 1
                      ? 'profile'
                      : 'question'
          : 'question';

  const progress =
      ((currentQuestionIndex + (messages.some((m) => m.isUser) ? 1 : 0)) / total) * 100;

  const footerOffsetNow = getFooterOffset();

  const loginHref =
      typeof window !== 'undefined'
          ? `/signin?callbackUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`
          : '/signin';

  // 체크 중이면 오버레이 (질문 로딩/자동제출/입력보다 우선)
  const shouldBlockUI = isCheckingMemorial;

  return (
      <div className="min-h-svh bg-gray-50 flex flex-col min-h-0">
        {/* 기념관 체크 오버레이 */}
        {shouldBlockUI && (
            <div className="fixed inset-0 z-[70] bg-black/30 flex items-center justify-center">
              <div className="bg-white rounded-2xl px-6 py-5 shadow-lg">
                <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="mt-3 text-sm text-gray-700 text-center">확인 중...</p>
              </div>
            </div>
        )}

        {/* 제출 중 오버레이 스피너 */}
        {isSubmitting && (
            <div className="fixed inset-0 z-[60] bg-black/30 flex items-center justify-center">
              <div className="bg-white rounded-2xl px-6 py-5 shadow-lg">
                <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="mt-3 text-sm text-gray-700 text-center">제출 중...</p>
              </div>
            </div>
        )}

        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full my-0 md:my-4 px-0 md:px-4 min-h-0">
          {/* 진행률 */}
          <div className="bg-white border-0 md:border border-gray-200 rounded-none md:rounded-t-xl px-4 py-3 flex-shrink-0">
            <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {isLoadingQuestions ? '질문 로딩중…' : `질문 ${currentStep} / ${total}`}
            </span>

              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                      className="h-2 rounded-full transition-all duration-500 bg-black"
                      style={{ width: `${isLoadingQuestions ? 0 : progress}%` }}
                  />
                </div>
              </div>

              <span className="text-sm text-gray-600">
              {isComplete ? '완료' : isLoadingQuestions ? '로딩중' : '진행중'}
            </span>
            </div>
          </div>

          {/* 대화 영역 */}
          <div
              ref={messagesWrapRef}
              className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 bg-white border-0 md:border-l md:border-r border-gray-200 min-h-0"
              style={{
                overscrollBehavior: 'contain',
                paddingBottom: footerOffsetNow,
                scrollPaddingBottom: footerOffsetNow,
              }}
          >
            <div className="space-y-4">
              {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} style={{ scrollMarginBottom: footerOffsetNow }} />
            </div>

            <div style={{ height: footerOffsetNow }} />
          </div>
        </div>

        {/* 고정 입력창 푸터 */}
        <div className="fixed bottom-0 inset-x-0 z-50 bg-transparent border-0 pb-[env(safe-area-inset-bottom)] pointer-events-none">
          <div ref={footerInnerRef} className="max-w-4xl mx-auto w-full px-0 md:px-4 pointer-events-auto">
            <div className="bg-white border-t border-gray-200 md:border md:border-gray-200 rounded-none md:rounded-b-xl">
              <ChatInput
                  onSendMessage={handleSendMessage}
                  onFilesChange={handleFilesChange}
                  selectedFile={profileFile}
                  isSubmitting={isSubmitting}
                  showLoginRequired={showLoginRequired}
                  loginHref={loginHref}
                  disabled={
                      shouldBlockUI ||
                      isTyping ||
                      isSubmitting ||
                      isComplete ||
                      isLoadingQuestions ||
                      questions.length === 0
                  }
                  isComplete={isComplete}
                  currentQuestion={currentStep}
                  totalQuestions={total}
                  inputMode={inputMode}
              />
            </div>
          </div>
        </div>
      </div>
  );
}
