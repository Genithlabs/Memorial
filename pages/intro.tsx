'use client';

import Link from 'next/link';

export default function IntroPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-8">
                단 5분, 몇 가지 질문에<br />
                답해주세요.
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                AI가 당신의 추억과 이야기를 모아<br />
                오늘, 바로 당신만의 인생 기념관을 완성합니다.
              </p>
              
              <div className="space-y-4">
                <Link 
                  href="/chat"
                  className="inline-block bg-black text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-colors font-medium text-lg whitespace-nowrap cursor-pointer"
                >
                  내 인생 기념관 만들기
                </Link>
                
                <div className="flex items-center justify-center lg:justify-start space-x-2 text-sm text-gray-500">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-shield-check-line text-green-600"></i>
                  </div>
                  <span>답변 내용은 본인 동의 없이 외부에 공개되지 않습니다.</span>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="flex justify-center">
              <img 
                src="/99c509e66a66fc3118066689eaebb8d3.jpg"
                alt="따뜻한 추억을 되돌아보는 모습"
                className="w-full max-w-md rounded-2xl shadow-2xl object-cover"
              />
            </div>
          </div>

          {/* Features */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-time-line text-blue-600 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">단 5분이면 충분</h3>
              <p className="text-gray-600 text-sm">간단한 질문에 답변하는 것만으로도<br/>의미있는 기념관이 완성됩니다.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-heart-3-line text-purple-600 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">소중한 추억 보관</h3>
              <p className="text-gray-600 text-sm">당신의 이야기와 추억이 안전하게 영구 보관됩니다.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-shield-check-line text-green-600 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">완전한 프라이버시</h3>
              <p className="text-gray-600 text-sm">개인정보와 답변 내용은 철저히 보호되며<br/>동의 없이 공개되지 않습니다.</p>
            </div>
          </div>
          {/* Memorial Services Section */}
          <div className="mt-32">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">메모리얼에서 준비중인 서비스</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden bg-gray-100">
                  <img
                      src="/img1.png"
                      alt="안전하게 보관하는 추억"
                      className="w-full h-full object-cover object-top"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">안전하게 보관하는 추억</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  가족 또는 사랑하는 사람들과<br/>사진, 영상, 음성 등 모든 기록을<br/>영구적으로 보존해 공유해요
                </p>
              </div>

              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden bg-gray-100">
                  <img
                      src="/img2.png"
                      alt="AI 기반 자서전"
                      className="w-full h-full object-cover object-top"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">AI 기반 자서전</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  음성 녹음만으로도 자신의 생애를<br/>정리해주는 AI 기반 자서전을 개발중이에요
                </p>
              </div>

              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden bg-gray-100">
                  <img
                      src="/img3.png"
                      alt="영원한 연결"
                      className="w-full h-full object-cover object-top"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">영원한 연결</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  돌아가신 후에도 소중한 사람들에게<br/>기념일마다 음성, 및 글 메세지를 전해드려요
                </p>
              </div>

              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden bg-gray-100">
                  <img
                      src="/img4.png"
                      alt="사랑하는 이의 삶을 기념"
                      className="w-full h-full object-cover object-top"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">사랑하는 이의 삶을 기념</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  그리워 질 때 언제든 기념관에서 기억을 꺼내<br/>아름다운 인생을 기념해주세요
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}