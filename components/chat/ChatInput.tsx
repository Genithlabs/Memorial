'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, ChangeEvent } from 'react';
import Link from 'next/link';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;

  /** 서버 제출까지 완료된 상태 */
  isComplete?: boolean;
  currentQuestion?: number;

  /** profile 파일 선택 변경(부모에서 저장/복원 처리) */
  onFilesChange?: (files: File[]) => void;
  /** 부모가 들고 있는 파일(IndexedDB 복원 포함) */
  selectedFile?: File | null;

  /** 제출 중(POST /api/chat/submit) */
  isSubmitting?: boolean;

  /** 마지막 단계에서 로그인 필요(로그인 후 자동 제출 대기) */
  showLoginRequired?: boolean;
  loginHref?: string;

  inputMode?: 'name' | 'birth_start' | 'question' | 'profile';
  totalQuestions?: number;
}

export default function ChatInput({
                                    onSendMessage,
                                    disabled,
                                    isComplete,
                                    currentQuestion,
                                    onFilesChange,
                                    selectedFile,
                                    isSubmitting,
                                    showLoginRequired,
                                    loginHref = '/signin',
                                    inputMode,
                                    totalQuestions,
                                  }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [birthDate, setBirthDate] = useState('');

  // 부모가 selectedFile을 안 내려주는 환경도 고려한 내부 상태
  const [internalFile, setInternalFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const mode: NonNullable<ChatInputProps['inputMode']> =
      inputMode ??
      (currentQuestion === 1
          ? 'name'
          : currentQuestion === 2
              ? 'birth_start'
              : totalQuestions && currentQuestion === totalQuestions
                  ? 'profile'
                  : 'question');

  const isNameQuestion = mode === 'name';
  const isBirthQuestion = mode === 'birth_start';
  const isLastQuestion = mode === 'profile';

  const fileForUI = useMemo(() => {
    if (typeof selectedFile !== 'undefined') return selectedFile; // controlled 우선
    return internalFile;
  }, [selectedFile, internalFile]);

  useEffect(() => {
    if (typeof selectedFile === 'undefined') return;
    setInternalFile(selectedFile);

    // input[type=file]은 programmatic set 불가 → state로만 표시
    if (!selectedFile && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [selectedFile]);

  const trulyDisabled = !!disabled || !!isSubmitting;

  const handleSend = () => {
    if (trulyDisabled) return;

    if (isLastQuestion) {
      if (fileForUI) {
        // 파일을 비우지 않음(로그인 후 자동 제출 대비)
        onSendMessage(`파일을 업로드했습니다: ${fileForUI.name}`);
      }
      return;
    }

    if (isBirthQuestion) {
      if (birthDate) {
        onSendMessage(birthDate);
        setBirthDate('');
      }
      return;
    }

    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleTextAreaKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDateInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (!file) {
      setInternalFile(null);
      onFilesChange?.([]);
      return;
    }

    setInternalFile(file);
    onFilesChange?.([file]); // undefined 방지 완료
  };

  const removeFile = () => {
    setInternalFile(null);
    onFilesChange?.([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 로그인 필요 화면 (submitPending 상태일 때)
  if (showLoginRequired) {
    return (
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-lock-line text-blue-600 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">로그인이 필요합니다</h3>
              <p className="text-gray-600 mb-4">
                로그인만 하면, 지금까지 작성한 내용과 선택한 파일로 <b>자동 제출</b>됩니다.
              </p>
              <Link
                  href={loginHref}
                  className="inline-block px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors whitespace-nowrap cursor-pointer"
              >
                로그인하기
              </Link>
            </div>
            <p className="text-xs text-gray-500">로그인 후 이 페이지로 돌아오면 자동으로 제출을 시도합니다.</p>
          </div>
        </div>
    );
  }

  // 제출까지 완료
  if (isComplete) {
    return (
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-check-line text-green-700 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">제출 완료</h3>
              <p className="text-gray-600">소중한 답변이 안전하게 저장되었습니다.</p>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          {/* 파일 선택 영역 (마지막 질문일 때만) */}
          {isLastQuestion && (
              <div className="mb-4">
                <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    accept="image/*,.pdf,.doc,.docx"
                    className="hidden"
                    disabled={trulyDisabled}
                />

                {fileForUI ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <i className="ri-file-line text-blue-600"></i>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{fileForUI.name}</p>
                          <p className="text-xs text-gray-500">{(fileForUI.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button
                          onClick={removeFile}
                          disabled={trulyDisabled}
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <i className="ri-close-line text-gray-600 text-sm"></i>
                      </button>
                    </div>
                ) : (
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={trulyDisabled}
                        className="w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                        <i className="ri-upload-cloud-2-line text-gray-600 text-xl"></i>
                      </div>
                      <p className="text-sm font-medium text-gray-700 mb-1">파일을 선택하거나 드래그해 주세요</p>
                      <p className="text-xs text-gray-500">이미지, PDF, Word 문서 지원</p>
                    </button>
                )}
              </div>
          )}

          {/* 입력 영역 */}
          {!isLastQuestion && (
              <>
                {isNameQuestion && (
                    <div className="flex items-end space-x-3">
                      <div className="flex-1 relative">
                        <input
                            type="text"
                            maxLength={50}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleTextInputKeyDown}
                            placeholder={trulyDisabled ? '답변을 기다리고 있습니다...' : '이름을 입력하세요 (최대 50자)'}
                            disabled={trulyDisabled}
                            className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:opacity-50 text-sm"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!message.trim() || trulyDisabled}
                            className="absolute right-2 top-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors cursor-pointer"
                        >
                          <i className="ri-send-plane-2-fill text-sm"></i>
                        </button>
                      </div>
                    </div>
                )}

                {isBirthQuestion && (
                    <div className="flex items-end space-x-3">
                      <div className="flex-1 relative">
                        <input
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            onKeyDown={handleDateInputKeyDown}
                            placeholder="YYYY-MM-DD"
                            disabled={trulyDisabled}
                            className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:opacity-50 text-sm"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!birthDate || trulyDisabled}
                            className="absolute right-2 top-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors cursor-pointer"
                        >
                          <i className="ri-send-plane-2-fill text-sm"></i>
                        </button>
                      </div>
                    </div>
                )}

                {!isNameQuestion && !isBirthQuestion && (
                    <div className="flex items-end space-x-3">
                      <div className="flex-1 relative">
                  <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleTextAreaKeyDown}
                      placeholder={trulyDisabled ? '답변을 기다리고 있습니다...' : '답변을 입력하세요...'}
                      disabled={trulyDisabled}
                      rows={1}
                      className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:opacity-50 text-sm"
                      style={{ minHeight: '48px', maxHeight: '120px' }}
                  />
                        <button
                            onClick={handleSend}
                            disabled={!message.trim() || trulyDisabled}
                            className="absolute right-2 top-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors cursor-pointer"
                        >
                          <i className="ri-send-plane-2-fill text-sm"></i>
                        </button>
                      </div>
                    </div>
                )}
              </>
          )}

          {/* 마지막 질문 전송 버튼 */}
          {isLastQuestion && (
              <div className="flex justify-end">
                <button
                    onClick={handleSend}
                    disabled={!fileForUI || trulyDisabled}
                    className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
                >
                  {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  제출 중...
                </span>
                  ) : (
                      '파일 업로드 완료'
                  )}
                </button>
              </div>
          )}

          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-500 hidden md:block">
              {isLastQuestion
                  ? '파일을 선택한 후 업로드 버튼을 클릭하세요'
                  : isBirthQuestion
                      ? '날짜를 선택한 후 Enter 또는 전송 버튼을 눌러주세요'
                      : isNameQuestion
                          ? '이름 입력 후 Enter 또는 전송 버튼을 눌러주세요'
                          : 'Enter를 눌러 전송하거나 Shift+Enter로 줄바꿈하세요'}
            </p>
            {currentQuestion && <p className="text-xs text-gray-500">{currentQuestion}번째 질문에 답변하고 계세요</p>}
          </div>
        </div>
      </div>
  );
}
