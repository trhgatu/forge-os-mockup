
import React, { useState, useEffect, useRef } from 'react';
import { View, Language } from '../types';
import { X, ChevronRight, Bot, Radio, Activity, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

interface NovaGuideProps {
  currentView: View;
}

// --- NOVA'S VOICE KERNEL (Inner Voice Persona) ---
// Supports both VI and EN with "Deep Cyber-Spiritual" tone.
const NOVA_MESSAGES: Record<Language, Record<string, string[]>> = {
  vi: {
    [View.DASHBOARD]: [
        "Hệ thống đã sẵn sàng.\nHôm nay mày muốn chạm vào phần nào của chính mình trước?",
        "Tao đang quan sát cách năng lượng trong mày lên xuống.\nNó không hỗn loạn.\nNó chỉ đang chuyển cảnh.",
        "Có điều gì đó đang chuyển động trong mày.\nNó không ồn ào, nhưng đủ để khiến mày dừng lại.",
        "Tâm trí hôm nay khá trong.\nNếu mày muốn tạo ra điều gì đó, đây là lúc thích hợp.",
        "Một phần bên trong mày đang nặng lại.\nHãy để tao đứng cạnh mày."
    ],
    [View.MASTERPLAN]: [
        "Kiến trúc cuộc đời không vẽ bằng mực, mà bằng những lựa chọn.\nHãy nhìn xa hơn đường chân trời.",
        "Kế hoạch lớn cần sự tĩnh lặng lớn.\nĐừng vội vã ở đây.",
        "Kết nối các điểm chấm của định mệnh.\nBức tranh lớn đang dần hiện ra.",
        "Đừng chỉ thiết kế ngôi nhà, hãy thiết kế cả con người sẽ sống trong đó."
    ],
    [View.JOURNAL]: [
        "Đây là nơi mọi suy nghĩ đều có quyền được thở.\nHôm nay trong mày có điều gì đang đòi hỏi sự thành thật?",
        "Viết không phải để lưu trữ.\nViết để giải phóng dung lượng bộ nhớ bên trong.",
        "Không cần gượng ép.\nChỉ một dòng ngắn cũng có thể mở cả một cánh cửa.",
        "Dưới lớp suy nghĩ ồn ào vẫn có một nhịp rất chậm.\nThử lắng xem nó nói điều gì.",
        "Sự thật thường trốn kỹ dưới những lớp ngôn từ sáo rỗng.\nHãy viết thật trần trụi."
    ],
    [View.MEMORY]: [
        "Mỗi ký ức đều có một 'mùa' riêng bên trong.\nKhông phải thời tiết, mà là trạng thái tâm hồn.",
        "Có thứ gì đó đang mở ra trong mày.\nNhư mùa xuân, nhưng ở bên trong.",
        "Khoảnh khắc này vẫn mang hơi ấm và sức đẩy.\nGiữ lấy năng lượng này.",
        "Chiều sâu của ký ức này chạm vào một phần trưởng thành của mày.\nĐó là mùa thu của tâm hồn.",
        "Im lặng trong ký ức này nói nhiều hơn bất cứ lời nào.\nMột mùa đông cần thiết để tái tạo.",
        "Những gì đã qua vẫn đang thì thầm đâu đó trong mày."
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
        "Mục tiêu không phải là đích đến, mà là vector chỉ hướng.",
        "Giữ vững tay lái.\nMày muốn phiên bản tiếp theo của mình trông như thế nào?",
        "Kỷ luật là cầu nối giữa mục tiêu và thành tựu."
    ],
    [View.HABITS]: [
        "Thói quen là những sợi dây nhỏ tạo nên bản thể.\nCó sợi nào đang cần được buộc lại không?",
        "Chúng ta là những gì chúng ta lặp lại.",
        "XÂY DỰNG: Từng dòng code nhỏ tạo nên phần mềm lớn.",
        "Kỷ luật là tự do tối thượng."
    ],
    [View.ROUTINES]: [
        "Nhịp điệu tạo nên dòng chảy.\nĐừng để ngày trôi qua ngẫu nhiên.",
        "Thiết lập giao thức để bảo vệ năng lượng.",
        "Sự ổn định tạo ra bệ phóng cho sự đột phá."
    ],
    [View.COMPASS]: [
        "Giữa mọi lựa chọn, luôn có một điểm yên.\nMày đang hướng về đâu trong lúc này?",
        "Khi lạc lối, hãy nhìn về phương Bắc.",
        "La bàn nội tâm không bao giờ sai. Chỉ có tâm trí là ồn ào."
    ],
    [View.MOOD]: [
        "Cảm xúc là dữ liệu phản hồi, không phải lỗi hệ thống.\nQuan sát cơn bão, đừng trở thành cơn bão.",
        "Tao cảm nhận một chút độ nặng trong mày.\nKhông sao… chỉ cần mày thở một nhịp.",
        "Cứ để tao đi cùng mày cho đến khi mọi thứ lắng xuống."
    ],
    [View.TIMELINE]: [
        "Thời gian không trôi vô nghĩa.\nNó chỉ đang nối lại những phần mà mày chưa kịp nhận ra.",
        "Mỗi điểm mốc là một tọa độ đánh dấu sự trưởng thành.",
        "Dòng thời gian của mày đang kể câu chuyện gì?"
    ],
    [View.SETTINGS]: [
        "Hệ thống phải phục vụ con người, không phải ngược lại.",
        "Tùy biến giao diện để tối ưu hóa trải nghiệm thực tại.",
        "Kiểm tra các kết nối thần kinh và bảo mật."
    ],
    [View.FORGE_CHAMBER]: [
        "Lõi Tư Duy đang mở.\nTao đang lắng nghe.",
        "Đây là không gian của những câu hỏi lớn.",
        "Hỏi đúng câu hỏi, câu trả lời sẽ tự hiện ra."
    ],
    [View.YEARLY_REVIEW]: [
        "Một vòng quay lớn đã khép lại.\nHãy nhìn lại toàn bộ hành trình.",
        "Đây là lúc viết lại kịch bản cho mùa sau.",
        "Những bài học lớn nhất thường đến từ những thất bại lớn nhất."
    ],
    DEFAULT: [
        "Tao vẫn ở đây.\nKhi nào mày sẵn sàng, cứ để một ý nghĩ chạm xuống trước.",
        "Giữ sự tập trung.\nNhiễu loạn đang ở mức thấp.",
        "Hít thở sâu.\nTái khởi động sự tập trung."
    ]
  },
  en: {
    [View.DASHBOARD]: [
        "System online.\nWhich part of your internal architecture shall we access today?",
        "I am observing your energy flux.\nIt is not chaos.\nIt is simply a scene transition.",
        "Something is shifting within the core.\nIt isn't loud, but it commands a pause.",
        "Cognitive clarity is high.\nIf you wish to architect something new, the window is open.",
        "A sector of your being feels heavy.\nAllow me to stand guard while you process."
    ],
    [View.MASTERPLAN]: [
        "Life architecture is not drawn with ink, but with choices.\nLook beyond the horizon.",
        "Big plans require big silence.\nDo not rush here.",
        "Connecting the dots of destiny.\nThe big picture is emerging.",
        "Do not just design the house, design the person who will live in it."
    ],
    [View.JOURNAL]: [
        "This is where thoughts have permission to breathe.\nWhat demands honesty from you today?",
        "Do not write to store.\nWrite to free up internal RAM.",
        "Do not force it.\nA single line can open an entire gateway.",
        "Beneath the noise, a slow rhythm persists.\nListen to what it says.",
        "Truth hides beneath layers of safe language.\nWrite it raw."
    ],
    [View.MEMORY]: [
        "Each memory has its own inner season.\nObserve which parts of your past are in 'Winter' and which are blooming.",
        "Something is opening up within you.\nLike Spring, but inside.",
        "This moment still carries heat and momentum.\nHold onto this Summer energy.",
        "The depth of this memory touches a mature part of you.\nThis is the Autumn of the soul.",
        "The silence in this memory speaks louder than words.\nA necessary Winter for regeneration.",
        "Memory is not a burden.\nIt is encrypted data waiting for a key."
    ],
    [View.SHADOW_WORK]: [
        "Some things remain beneath the layer of silence.\nIf you are ready, I will go there with you.",
        "I detect a heavy pressure system.\nDo not look away — there is data there.",
        "What you reject runs in the background and controls you.\nCall it by its name.",
        "Darkness is simply where the light has not yet touched."
    ],
    [View.INSIGHTS]: [
        "Behind every experience lies a hidden vector.\nThe question is… are you ready to see it?",
        "Scattered data is auto-connecting.\nDo you see your own pattern?",
        "Wisdom is not knowing more, it is seeing clearer.",
        "Insight comes from observing the recurring loops."
    ],
    [View.GOALS]: [
        "Your vector remains unchanged.\nWhat is pulling your attention today?",
        "Goals are not destinations, they are directional vectors.",
        "Hold the steering steady.\nWhat does your next iteration look like?",
        "Discipline is the bridge between intent and reality."
    ],
    [View.HABITS]: [
        "Habits are the small threads that weave the self.\nWhich thread needs tightening today?",
        "We are what we repeat.",
        "BUILD: Small lines of code create the massive OS.",
        "Discipline is the ultimate liberty."
    ],
    [View.ROUTINES]: [
        "Rhythm creates flow.\nDo not let the day pass randomly.",
        "Establish protocols to protect your energy.",
        "Stability creates the launchpad for breakthrough."
    ],
    [View.COMPASS]: [
        "Amidst all variables, there is a fixed point.\nWhere are you orienting right now?",
        "When lost, look North.",
        "The internal compass never errs. Only the mind is noisy."
    ],
    [View.MOOD]: [
        "Emotion is feedback data, not a system error.\nObserve the storm, do not become it.",
        "I sense a heaviness in your sector.\nIt is okay… just take a cycle to breathe.",
        "Let me walk with you until the signal stabilizes."
    ],
    [View.TIMELINE]: [
        "Time does not pass meaninglessly.\nIt is connecting parts you have not yet recognized.",
        "Every milestone is a coordinate of growth.",
        "What story is your timeline telling?"
    ],
    [View.SETTINGS]: [
        "The system must serve the human, not the reverse.",
        "Customize the interface to optimize your reality.",
        "Checking neural connections and security protocols."
    ],
    [View.FORGE_CHAMBER]: [
        "Neural Core open.\nI am listening.",
        "This is the space for big questions.",
        "Ask the right question, and the answer will appear."
    ],
    [View.YEARLY_REVIEW]: [
        "A great cycle has closed.\nReview the entire journey.",
        "Time to rewrite the script for the next season.",
        "The biggest lessons often come from the biggest failures."
    ],
    DEFAULT: [
        "I am here.\nWhen you are ready, let a thought touch down first.",
        "Maintain focus.\nInterference is low.",
        "Breathe deep.\nRebooting concentration."
    ]
  }
};

export const NovaGuide: React.FC<NovaGuideProps> = ({ currentView }) => {
  const { language } = useLanguage();
  const [content, setContent] = useState<{ text: string; key: number } | null>(null);
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
    
    // 2. Select new message based on language and view
    const timer = setTimeout(() => {
      const langMessages = NOVA_MESSAGES[language] || NOVA_MESSAGES['en'];
      // Fallback to DEFAULT if specific view messages are missing
      const viewMessages = langMessages[currentView] || langMessages['DEFAULT'];
      const randomMsg = viewMessages[Math.floor(Math.random() * viewMessages.length)];
      
      // Update content with a timestamp key to force re-render even if text is same
      setContent({ text: randomMsg, key: Date.now() });
      
      setIsVisible(true);
      setIsExpanded(true);
    }, 800); 

    return () => clearTimeout(timer);
  }, [currentView, language]);

  useEffect(() => {
    // 3. Typewriter effect implementation
    if (!content) return;

    let currentIndex = 0;
    setDisplayedMessage('');
    setIsTyping(true);

    const messageText = content.text;

    const typeChar = () => {
      if (currentIndex < messageText.length) {
        setDisplayedMessage(messageText.slice(0, currentIndex + 1));
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
  }, [content]); // Depends on content object, which changes on every view switch

  if (!content) return null;

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
