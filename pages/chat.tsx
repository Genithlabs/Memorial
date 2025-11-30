'use client';

import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import ChatMessage from '../components/chat/ChatMessage';
import ChatInput from '../components/chat/ChatInput';
import { fetchQuestions } from '@/lib/api/chat';

// === [ADD] 쿠키 헬퍼 & 타입 (7일 보존) ===
const COOKIE_NAME = 'chatProgress';
const COOKIE_TTL_DAYS = 7;

function setCookie(name: string, value: string, days: number) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/;SameSite=Lax`;
}
function getCookie(name: string) {
  const key = name + '=';
  const parts = document.cookie.split(';').map(v => v.trim());
  for (const p of parts) if (p.indexOf(key) === 0) return decodeURIComponent(p.substring(key.length));
  return null;
}

type PersistedMessage = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string; // ISO 문자열
};
type PersistedState = {
  messages: PersistedMessage[];
  currentQuestionIndex: number;
  isComplete: boolean;
  savedAt: string;
};
// === [ADD END] ===

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

/** SSR에선 useEffect, CSR에선 useLayoutEffect */
const useIsomorphicLayoutEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/** 겹침 방지 여유(px): 환경 따라 16~32 권장 */
const EXTRA_GAP = 24;

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

  // 스크롤 컨테이너 & 앵커
  const messagesWrapRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // 고정 인풋 실제 높이
  const footerInnerRef = useRef<HTMLDivElement | null>(null);
  const [footerHeight, setFooterHeight] = useState(0);

  // 직전 오프셋 기록(푸터 높이 급증 감지용)
  const lastFooterOffsetRef = useRef(0);

  // [ADD] 쿠키 복원 1회만 수행
  const restoredRef = useRef(false);

  // [ADD] 쿠키가 "있다"는 사실만 먼저 기록해서 첫질문 이펙트를 선제 차단
  const hasCookieRef = useRef(false);  // ★ 추가

  // 현재 푸터 오프셋(높이 + 여유) 계산
  const getFooterOffset = () => {
    const h = footerInnerRef.current?.getBoundingClientRect().height ?? 0;
    return h + EXTRA_GAP;
  };

  // 푸터 높이 추적 (파일 선택/미리보기/키보드 변동 반영)
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
    return () => { mounted = false; };
  }, []);

  // === [ADD] 쿠키 복원 ===
// 질문 로딩이 끝난 후(isLoadingQuestions=false)에 쿠키가 있으면 기존 대화를 복원한다.
  useEffect(() => {
    if (restoredRef.current) return;
    if (isLoadingQuestions) return;

    const raw = typeof window !== 'undefined' ? getCookie(COOKIE_NAME) : null;
    if (!raw) return;

    hasCookieRef.current = true; // ★ 추가: 쿠키가 있다는 사실을 즉시 알림(파싱 전)

    try {
      const parsed: PersistedState = JSON.parse(raw);
      if (!Array.isArray(parsed.messages)) return;

      const restoredMessages = parsed.messages.map((m) => ({
        id: m.id,
        text: m.text,
        isUser: m.isUser,
        timestamp: new Date(m.timestamp),
      })) as Message[];

      restoredRef.current = true;   // 먼저 true
      setMessages(restoredMessages);

      const qLen = Array.isArray(questions) ? questions.length : 0;
      const safeIndex = Math.max(0, Math.min(parsed.currentQuestionIndex ?? 0, Math.max(0, qLen - 1)));
      setCurrentQuestionIndex(safeIndex);
      setIsComplete(!!parsed.isComplete);
    } catch (e) {
      // 파싱 실패면 첫 질문 로직이 동작하도록 다시 허용
      hasCookieRef.current = false; // ★ 추가: 실패 시 해제
      console.error('[chat] cookie parse failed. length=', raw?.length, e);
    }
  }, [isLoadingQuestions, questions]);


  // 첫 질문 표시
  useEffect(() => {
    if (restoredRef.current) return;
    if (hasCookieRef.current) return; // ★ 추가: 쿠키가 '존재'하면 복원 시도 끝날 때까지 대기
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
  }, [isLoadingQuestions, questions, messages.length]);

  // === [ADD] 진행상태 저장 (쿠키 7일) ===
  useEffect(() => {
    // 완전 초기상태는 저장 스킵(원하면 제거 가능)
    if (messages.length === 0 && currentQuestionIndex === 0 && !isComplete) return;

    const payload: PersistedState = {
      messages: messages.map((m) => ({
        id: m.id,
        text: m.text,
        isUser: m.isUser,
        timestamp: (m.timestamp instanceof Date ? m.timestamp : new Date(m.timestamp)).toISOString(),
      })),
      currentQuestionIndex,
      isComplete,
      savedAt: new Date().toISOString(),
    };

    try {
      setCookie(COOKIE_NAME, JSON.stringify(payload), COOKIE_TTL_DAYS);
    } catch {
      // 쿠키 용량/브라우저 제한 등으로 실패하면 조용히 무시
    }
  }, [messages, currentQuestionIndex, isComplete]);


  // 정확한 바닥 스크롤 (푸터 커질 때 rAF 지연 가변)
  const scrollToBottomSmooth = () => {
    const el = messagesWrapRef.current;
    if (!el) return;

    const currentOffset = getFooterOffset();
    const prevOffset = lastFooterOffsetRef.current;
    lastFooterOffsetRef.current = currentOffset;

    // 푸터가 방금 커졌다면 프레임 여유를 더 줌(파일 미리보기/키보드 등장 흡수)
    const delayFrames = currentOffset > prevOffset + 6 ? 3 : 2;

    const doScroll = () => {
      const bottom = Math.max(0, el.scrollHeight - el.clientHeight);
      if ('scrollTo' in el) {
        el.scrollTo({ top: bottom, behavior: 'smooth' });
      } else {
        // TS 안전상황이지만 폴백 유지
        (el as HTMLDivElement).scrollTop = bottom;
      }
      // 브라우저별 소폭 오차 보정
      messagesEndRef.current?.scrollIntoView({ block: 'end' });
    };

    // delayFrames 만큼 rAF 체인
    let i = 0;
    const tick = () => {
      if (++i >= delayFrames) doScroll();
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  // 메시지/푸터 높이 변화 시, 렌더 직후 스크롤 보장
  useIsomorphicLayoutEffect(() => {
    if (messages.length > 0) {
      scrollToBottomSmooth();
    }
  }, [messages.length, footerHeight]);

  // 메시지 전송 핸들러
  const handleSendMessage = async (text: string) => {
    if (isComplete || questions.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const nextIndex = currentQuestionIndex + 1;
      let botMessage: Message;

      if (nextIndex < questions.length) {
        botMessage = {
          id: (Date.now() + 1).toString(),
          text: questions[nextIndex],
          isUser: false,
          timestamp: new Date(),
        };
        setCurrentQuestionIndex(nextIndex);
      } else {
        botMessage = {
          id: (Date.now() + 1).toString(),
          text:
              '모든 질문이 완료되었습니다. 소중한 이야기를 들려주셔서 감사합니다. 여러분의 기억과 추억이 안전하게 보관되었습니다.',
          isUser: false,
          timestamp: new Date(),
        };
        setIsComplete(true);
      }

      setMessages((prev) => [...prev, botMessage]);
      // 즉시 한 번, 그리고 위 useIsomorphicLayoutEffect에서 렌더 후 한 번 더
      scrollToBottomSmooth();
      setIsTyping(false);
    }, 800);
  };

  const total = questions.length || 1;
  const currentStep = Math.min(currentQuestionIndex + 1, total);
  const progress =
      ((currentQuestionIndex + (messages.some((m) => m.isUser) ? 1 : 0)) / total) * 100;

  const footerOffsetNow = getFooterOffset();

  return (
      <div className="min-h-svh bg-gray-50 flex flex-col min-h-0">
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

          {/* 대화 영역: 패딩/scrollPadding + 앵커 margin + 실제 스페이서로 겹침 방지 */}
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

            {/* 실제 여백: fixed 인풋 높이 + 여유 */}
            <div style={{ height: footerOffsetNow }} />
          </div>
        </div>

        {/* 고정 입력창 푸터 */}
        <div
            className="
          fixed bottom-0 inset-x-0 z-50
          bg-transparent border-0
          pb-[env(safe-area-inset-bottom)]
          pointer-events-none
        "
        >
          <div
              ref={footerInnerRef}
              className="
            max-w-4xl mx-auto w-full px-0 md:px-4
            pointer-events-auto
          "
          >
            <div
                className="
              bg-white
              border-t border-gray-200
              md:border md:border-gray-200
              rounded-none md:rounded-b-xl
            "
            >
              <ChatInput
                  onSendMessage={handleSendMessage}
                  disabled={isTyping || isComplete || isLoadingQuestions || questions.length === 0}
                  isComplete={isComplete}
                  currentQuestion={currentStep}
              />
            </div>
          </div>
        </div>
      </div>
  );
}
