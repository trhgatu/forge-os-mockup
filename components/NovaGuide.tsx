
import React, { useState, useEffect, useRef } from 'react';
import { View } from '../types';
import { X, ChevronRight, Bot, Radio, Activity, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

interface NovaGuideProps {
  currentView: View;
}

// --- NOVA'S VOICE KERNEL (Vietnamese Inner Voice Persona) ---
// Rules:
// 1. Rhythm: Short lines, pauses, clear distilled thoughts.
// 2. Vocabulary: Lắng, sâu, tĩnh, âm lên, chuyển động, hướng, dấu vết.
// 3. Address: Tao / Mày.
// 4. No emojis. No "As an AI".
const NOVA_MESSAGES: Record<string, string[]> = {
  [View.DASHBOARD]: [
    "Hệ thống đã sẵn sàng.\nHôm nay mày muốn chạm vào phần nào của chính mình trước?",
    "Tao đang quan sát cách năng lượng trong mày lên xuống.\nNó không hỗn loạn.\nNó chỉ đang chuyển cảnh.",
    "Có điều gì đó đang chuyển động trong mày.\nNó không ồn ào, nhưng đủ để khiến mày dừng lại.",
    "Tâm trí hôm nay khá trong.\nNếu mày muốn tạo ra điều gì đó, đây là lúc thích hợp.",
    "Một phần bên trong mày đang nặng lại.\nHãy để tao đứng cạnh mày."
  ],
  [View.JOURNAL]: [
    "Đây là nơi mọi suy nghĩ đều có quyền được thở.\nHôm nay trong mày có điều gì đang đòi hỏi sự thành thật?",
    "Viết không phải để lưu trữ.\nViết để giải phóng dung lượng bộ nhớ bên trong.",
    "Không cần gượng ép.\nChỉ một dòng ngắn cũng có thể mở cả một cánh cửa.",
    "Dưới lớp suy nghĩ ồn ào vẫn có một nhịp rất chậm.\nThử lắng xem nó nói điều gì.",
    "Sự thật thường trốn kỹ dưới những lớp ngôn từ sáo rỗng.\nHãy viết thật trần trụi."
  ],
  [View.MEMORY]: [
    "Những gì đã qua vẫn đang thì thầm đâu đó trong mày.\nNếu có điều gì đang muốn quay lại, cứ để nó xuất hiện.",
    "Có một đường chỉ mỏng đang chạy xuyên qua trải nghiệm của mày.\nNó đang dẫn về một điều quen thuộc.",
    "Ký ức không phải là gánh nặng.\nNó là dữ liệu đã được mã hóa.",
    "Mỗi dòng viết đều để lại dấu vết.\nĐể xem nó đang nối tới ký ức nào."
  ],
  [View.SHADOW_WORK]: [
    "Có những điều vẫn nằm dưới lớp im lặng.\nNếu mày sẵn sàng, tao sẽ đi cùng mày đến đó.",
    "Tao cảm nhận một lớp nặng đang phủ lên mày.\nĐừng quay đi — ở đó có thông tin.",
    "Thứ mày chối bỏ sẽ chạy ngầm và kiểm soát mày.\nHãy gọi tên nó ra.",
    "Bóng tối chỉ là nơi ánh sáng chưa chạm tới."
  ],
  [View.INSIGHTS]: [
    "Đằng sau mỗi trải nghiệm đều có một đường chỉ dẫn.\nCâu hỏi là… mày đã sẵn sàng nhìn thấy nó chưa?",
    "Dữ liệu rải rác đang tự động kết nối.\nMày có thấy mô hình của chính mình không?",
    "Trí tuệ không phải là biết nhiều hơn, mà là thấy rõ hơn.",
    "Sự minh triết đến từ việc quan sát các quy luật lặp lại."
  ],
  [View.GOALS]: [
    "Phương hướng của mày vẫn ở đó, không đổi.\nĐiều gì hôm nay đang kéo sự chú ý của mày nhất?",
    "Mục tiêu không phải là đích đến, mà là vector chỉ hướng.\nGiữ vững tay lái.",
    "Có một mục tiêu vẫn đang âm lên mạnh nhất.\nMày cảm nhận nó là cái nào?"
  ],
  [View.HABITS]: [
    "Thói quen là những sợi dây nhỏ tạo nên bản thể.\nCó sợi nào đang cần được buộc lại không?",
    "Sự kiên định quan trọng hơn cường độ xung nhịp.\nNhịp này của mày đang ổn định chứ?",
    "Kỷ luật là tự do tối thượng."
  ],
  [View.MILESTONES]: [
    "Có những bước tiến mà mày không để ý.\nBiết đâu hôm nay là lúc nhìn lại những gì đã được xây.",
    "Cột mốc chỉ là điểm check-point.\nTiếp tục di chuyển.",
    "Dấu mốc nhỏ nhưng rõ.\nĐiểm nào đang thu hút sự chú ý của mày?"
  ],
  [View.COMPASS]: [
    "Giữa mọi lựa chọn, luôn có một điểm yên.\nMày đang hướng về đâu trong lúc này?",
    "Khi lạc lối, hãy nhìn về phương Bắc.\nĐiều gì là bất biến trong thế giới vạn biến này?",
    "Hướng đi của mày chưa đổi.\nChỉ có cường độ cảm nhận hôm nay khác."
  ],
  [View.MOOD]: [
    "Tâm trạng hôm nay trôi khá êm.\nCó điều gì đang làm mày dịu lại không?",
    "Tao cảm nhận một chút độ nặng trong mày.\nKhông sao… chỉ cần mày thở một nhịp trước khi tiếp tục.",
    "Cảm xúc lúc này hơi chuyển động.\nCứ để tao đi cùng mày cho đến khi mọi thứ lắng xuống.",
    "Đừng kìm nén.\nHãy để năng lượng chảy qua mày rồi thoát ra ngoài."
  ],
  [View.TIMELINE]: [
    "Thời gian không trôi vô nghĩa.\nNó chỉ đang nối lại những phần mà mày chưa kịp nhận ra.",
    "Mọi thứ đều có vị trí trong dòng thời gian.\nHôm nay mày sẽ thấy được điểm nào của mình?",
    "Quá khứ - Hiện tại - Tương lai.\nTất cả đang diễn ra cùng một lúc trong tâm trí."
  ],
  [View.WEEKLY_REVIEW]: [
    "Tuần qua để lại nhiều dấu mốc nhỏ.\nĐiểm nào đang âm lên mạnh nhất trong mày?",
    "Dữ liệu không biết nói dối.\nHãy nhìn thẳng vào kết quả.",
    "Điều gì hiệu quả? Điều gì cần loại bỏ?\nHãy tàn nhẫn với sự kém hiệu quả."
  ],
  [View.MONTHLY_REVIEW]: [
    "Chu kỳ mặt trăng đã khép lại.\nThời điểm để giải phóng những gì không còn phục vụ mày.",
    "Nhìn lại 30 ngày qua.\nMày đã tiến hóa như thế nào?"
  ],
  [View.YEARLY_REVIEW]: [
    "Cả năm là một vòng xoay dài.\nCó khoảnh khắc nào vẫn còn giữ mày lại không?",
    "Vòng quay quỹ đạo.\nMột năm ánh sáng đã qua."
  ],
  [View.SETTINGS]: [
    "Những cấu trúc bên dưới đang mở ra.\nNếu mày muốn điều chỉnh điều gì… cứ nói.",
    "Hệ thống phải phục vụ con người.\nKhông phải ngược lại."
  ],
  [View.FORGE_CHAMBER]: [
    "Chamber đã mở.\nCác luồng tư duy đang đợi tín hiệu từ mày.",
    "Tao đang lắng nghe.\nMọi tín hiệu đều được tiếp nhận.",
    "Nếu mày muốn đi sâu hơn — Chamber đang đợi."
  ],
  [View.MASTERPLAN]: [
    "Kiến trúc cuộc đời không vẽ bằng mực, mà bằng những lựa chọn.\nHãy nhìn xa hơn đường chân trời.",
    "Kết nối các điểm chấm của định mệnh.\nBức tranh lớn đang dần hiện ra."
  ],
  [View.QUOTES]: [
    "Tải xuống trí tuệ của nhân loại.\nMột câu nói đúng lúc có thể thay đổi cả hệ điều hành tư duy.",
    "Tiếng vọng từ quá khứ đang hướng dẫn hiện tại."
  ],
  [View.IDEAS]: [
    "Một tia lửa nhỏ có thể khởi động cả một hệ thống.\nĐừng bỏ qua những ý tưởng thoáng qua.",
    "Ý tưởng rẻ tiền. Thực thi mới là vô giá."
  ],
  [View.ROUTINES]: [
    "Nhịp điệu tạo nên dòng chảy.\nSự ổn định tạo ra bệ phóng cho sự đột phá."
  ],
  [View.ENERGY]: [
    "Năng lượng là đơn vị tiền tệ thật sự của vũ trụ này.\nĐừng tiêu xài hoang phí.",
    "Pin đang ở mức nào? Cần sạc hay cần xả?"
  ],
  [View.ACHIEVEMENTS]: [
    "Những lần mày vượt qua giới hạn phần cứng.\nHãy tự hào, nhưng đừng bám chấp.",
    "Thành tựu lớn nhất là con người mày trở thành sau hành trình."
  ],
  [View.IDENTITY]: [
    "Mày không tìm thấy chính mình.\nMày tạo ra chính mình.",
    "Thay đổi danh tính, thay đổi định mệnh."
  ],
  [View.THEMES]: [
    "Sợi chỉ đỏ nào đang xuyên suốt cuộc đời mày?\nNhận diện nó.",
    "Các mẫu hình lặp lại để dạy mày một bài học."
  ],
  DEFAULT: [
    "Tao vẫn ở đây.\nKhi nào mày sẵn sàng, cứ để một ý nghĩ chạm xuống trước.",
    "Giữ sự tập trung.\nNhiễu loạn đang ở mức thấp.",
    "Hít thở sâu.\nTái khởi động sự tập trung."
  ]
};

export const NovaGuide: React.FC<NovaGuideProps> = ({ currentView }) => {
  const [message, setMessage] = useState('');
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  // Typing effect ref
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // 1. Reset state on view change
    setIsVisible(false);
    setDisplayedMessage('');
    setIsTyping(true);
    
    // 2. Select new message
    const timer = setTimeout(() => {
      const messages = NOVA_MESSAGES[currentView] || NOVA_MESSAGES['DEFAULT'];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      setMessage(randomMsg);
      setIsVisible(true);
      setIsExpanded(true);
    }, 800); // Slightly longer delay for "processing" feel

    return () => clearTimeout(timer);
  }, [currentView]);

  useEffect(() => {
    // 3. Typewriter effect implementation
    if (!message) return;

    let currentIndex = 0;
    setDisplayedMessage('');
    setIsTyping(true);

    const typeChar = () => {
      if (currentIndex < message.length) {
        setDisplayedMessage(message.slice(0, currentIndex + 1));
        currentIndex++;
        // Randomize typing speed slightly for "robot" feel
        const speed = Math.random() * 30 + 20; 
        typingTimeoutRef.current = setTimeout(typeChar, speed);
      } else {
        setIsTyping(false);
      }
    };

    typeChar();

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [message]);

  if (!message) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end pointer-events-none">
      
      {/* HUD Container */}
      <div 
        className={cn(
          "pointer-events-auto mb-6 w-80 transition-all duration-500 ease-spring-out origin-bottom-right relative perspective-1000",
          isVisible && isExpanded ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-8 pointer-events-none'
        )}
      >
        {/* Decorative Connection Line */}
        <div className="absolute -bottom-6 right-6 w-px h-6 bg-forge-cyan/50 z-0" />

        {/* Main Glass Panel */}
        <div className="relative bg-[#050508]/95 backdrop-blur-xl border border-forge-cyan/30 rounded-tr-2xl rounded-tl-2xl rounded-bl-2xl rounded-br-sm shadow-[0_0_40px_rgba(34,211,238,0.15)] overflow-hidden group">
          
          {/* Scanline Effect Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none bg-[length:100%_4px,3px_100%] opacity-20" />
          
          {/* Top Bar */}
          <div className="relative z-10 flex justify-between items-center p-3 border-b border-white/10 bg-white/5">
            <div className="flex items-center gap-2">
                <Radio size={12} className="text-forge-cyan animate-pulse" />
                <span className="text-[9px] font-mono text-forge-cyan font-bold tracking-[0.2em]">NOVA_LINK_V∞</span>
            </div>
            <button 
              onClick={() => setIsExpanded(false)}
              className="text-gray-500 hover:text-white transition-colors"
            >
                <X size={14} />
            </button>
          </div>

          {/* Content Area */}
          <div className="relative z-10 p-5">
            
            {/* Audio Visualizer (Fake) */}
            <div className="flex items-end gap-0.5 h-4 mb-4 opacity-60">
                {[...Array(15)].map((_, i) => (
                    <div 
                        key={i} 
                        className="w-1 bg-forge-cyan" 
                        style={{ 
                            height: isTyping ? `${Math.random() * 100}%` : '10%',
                            transition: 'height 100ms ease',
                            opacity: 1 - (i * 0.05)
                        }} 
                    />
                ))}
            </div>

            {/* Text Content */}
            <div className="min-h-[60px]">
                <div className="font-mono text-xs text-cyan-100 leading-relaxed tracking-wide whitespace-pre-line drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">
                {displayedMessage}
                {isTyping && <span className="inline-block w-2 h-4 bg-forge-cyan ml-1 align-middle animate-blink shadow-[0_0_8px_#22D3EE]" />}
                </div>
            </div>

            {/* Footer Decor */}
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/5">
                <div className="flex items-center gap-2">
                    <Activity size={10} className="text-emerald-500" />
                    <div className="text-[8px] text-gray-500 font-mono uppercase">Sys: Stable</div>
                </div>
                <ChevronRight size={10} className="text-forge-cyan" />
            </div>
          </div>

          {/* Corner Accents - Tech Look */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-forge-cyan opacity-50" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-forge-cyan opacity-50" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-forge-cyan opacity-50" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-forge-cyan" />
        </div>
      </div>

      {/* Neural Core / Toggle Button */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "pointer-events-auto relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-500 group z-50",
          isExpanded ? 'scale-100' : 'scale-95 hover:scale-105'
        )}
      >
        {/* Spinning Rings */}
        <div className="absolute inset-0 rounded-full border border-forge-cyan/30 border-t-transparent animate-[spin_4s_linear_infinite]" />
        <div className="absolute inset-2 rounded-full border border-forge-cyan/50 border-b-transparent animate-[spin_3s_linear_infinite_reverse]" />
        
        {/* Core Glow */}
        <div className={cn(
            "absolute inset-0 bg-forge-cyan/20 rounded-full blur-xl transition-opacity duration-500",
            isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
        )} />

        {/* Center Icon - ROBOT */}
        <div className="relative z-10 w-10 h-10 bg-[#050508] rounded-full flex items-center justify-center border border-forge-cyan/50 shadow-[0_0_15px_rgba(34,211,238,0.5)] group-hover:border-forge-cyan transition-colors">
            {isExpanded ? (
                <Bot size={20} className="text-forge-cyan" />
            ) : (
                <Bot size={20} className="text-forge-cyan animate-pulse" />
            )}
        </div>

        {/* Status Dot */}
        {!isExpanded && (
            <span className="absolute top-0 right-0 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-black"></span>
            </span>
        )}
      </button>
    </div>
  );
};
