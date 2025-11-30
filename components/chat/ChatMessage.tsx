'use client';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-xs lg:max-w-md ${message.isUser ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
        {!message.isUser && (
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
            <i className="ri-customer-service-2-line text-gray-600 text-sm"></i>
          </div>
        )}
        
        <div className="flex flex-col">
          <div
            className={`rounded-2xl px-4 py-3 shadow-sm ${
              message.isUser
                ? 'bg-black text-white rounded-br-md'
                : 'bg-white text-gray-900 rounded-bl-md border border-gray-100'
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
          </div>
          
          <div className={`text-xs text-gray-500 mt-1 ${message.isUser ? 'text-right' : 'text-left'}`}>
            {formatTime(message.timestamp)}
          </div>
        </div>
        
        {message.isUser && (
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
            <i className="ri-user-line text-white text-sm"></i>
          </div>
        )}
      </div>
    </div>
  );
}