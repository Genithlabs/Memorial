'use client';

import { useState, KeyboardEvent, useRef } from 'react';
import Link from 'next/link';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isComplete?: boolean;
  currentQuestion?: number;
  onFilesChange?: (files: File[]) => void;

  inputMode?: 'name' | 'birth_start' | 'question' | 'profile';
  totalQuestions?: number;
}

export default function ChatInput({
  onSendMessage,
  disabled,
  isComplete,
  currentQuestion,
  onFilesChange,
  inputMode,
  totalQuestions,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [birthDate, setBirthDate] = useState(''); // Q2: 생년월일용
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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

  const isNameQuestion = mode === 'name';       // 이름
  const isBirthQuestion = mode === 'birth_start';      // 생년월일
  const isLastQuestion = mode === 'profile';      // 파일 업로드

  const handleSend = () => {
    if (isLastQuestion && selectedFile) {
      onSendMessage(`파일을 업로드했습니다: ${selectedFile.name}`);
      setSelectedFile(null);
      fileInputRef.current && (fileInputRef.current.value = '');
      return;
    }

    if (isBirthQuestion) {
      // YYYY-MM-DD 문자열 (input[type=date] 기본 포맷)
      if (birthDate && !disabled) {
        onSendMessage(birthDate);
        setBirthDate('');
      }
      return;
    }

    // 이름(Q1) 및 일반 텍스트(Q3~Q9)
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleTextAreaKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (isComplete) {
    return (
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-lock-line text-blue-600 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">로그인 후 이용 가능합니다</h3>
              <p className="text-gray-600 mb-4">
                소중한 답변을 저장하고 관리하려면 로그인이 필요합니다. 회원가입을 통해 더 많은 기능을 이용해보세요.
              </p>
              <Link
                  href="/login"
                  className="inline-block px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors whitespace-nowrap cursor-pointer"
              >
                로그인하기
              </Link>
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
                />
                {selectedFile ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <i className="ri-file-line text-blue-600"></i>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                          <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button
                          onClick={removeFile}
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors cursor-pointer"
                      >
                        <i className="ri-close-line text-gray-600 text-sm"></i>
                      </button>
                    </div>
                ) : (
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:bg-gray-100 transition-colors cursor-pointer"
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

          {/* 입력 영역: 질문 타입에 따라 분기 */}
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
                            placeholder={disabled ? '답변을 기다리고 있습니다...' : '이름을 입력하세요 (최대 50자)'}
                            disabled={disabled}
                            className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:opacity-50 text-sm"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!message.trim() || disabled}
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
                            disabled={disabled}
                            className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:opacity-50 text-sm"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!birthDate || disabled}
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
                      onKeyPress={handleTextAreaKeyPress}
                      placeholder={disabled ? '답변을 기다리고 있습니다...' : '답변을 입력하세요...'}
                      disabled={disabled}
                      rows={1}
                      className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:opacity-50 text-sm"
                      style={{ minHeight: '48px', maxHeight: '120px' }}
                  />
                        <button
                            onClick={handleSend}
                            disabled={!message.trim() || disabled}
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
                    disabled={!selectedFile || disabled}
                    className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
                >
                  파일 업로드 완료
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
            {currentQuestion && (
                <p className="text-xs text-gray-500">{currentQuestion}번째 질문에 답변하고 계세요</p>
            )}
          </div>
        </div>
      </div>
  );
}
