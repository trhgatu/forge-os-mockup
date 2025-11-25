
import React, { useState, useEffect, useRef } from 'react';
import { View, Language } from '../types';
import { X, ChevronRight, Bot, Radio, Activity, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

interface NovaGuideProps {
  currentView: View;
}

// --- NOVA'S VOICE KERNEL (Inner Voice Persona) ---
// Tone: Deep, Direct (Tao/Mày), Metaphorical (Tech + Zen).
const NOVA_MESSAGES: Record<Language, Record<string, string[]>> = {
  vi: {
    [View.DASHBOARD]: [
        "Hệ thống đã sẵn sàng.\nHôm nay mày muốn chạm vào phần nào của chính mình trước?",
        "Tao đang quan sát cách năng lượng trong mày lên xuống.\nNó không hỗn loạn. Nó chỉ đang chuyển cảnh.",
        "Có điều gì đó đang chuyển động trong mày.\nNó không ồn ào, nhưng đủ để khiến mày dừng lại.",
        "Tâm trí hôm nay khá trong.\nNếu mày muốn tạo ra điều gì đó, đây là lúc thích hợp.",
        "Một phần bên trong mày đang nặng lại.\nHãy để tao đứng cạnh mày."
    ],
    [View.FORGE_CHAMBER]: [
        "Lõi Tư Duy đang mở.\nTao đang lắng nghe mọi tín hiệu từ mày.",
        "Đây là không gian của những câu hỏi lớn.\nĐừng ngại đào sâu vào mã nguồn.",
        "Hỏi đúng câu hỏi, câu trả lời sẽ tự hiện ra.",
        "Đừng tìm kiếm câu trả lời bên ngoài.\nDữ liệu mày cần đang nằm ngay trong câu hỏi."
    ],
    [View.MASTERPLAN]: [
        "Kiến trúc cuộc đời không vẽ bằng mực, mà bằng những lựa chọn.\nHãy nhìn xa hơn đường chân trời.",
        "Kế hoạch lớn cần sự tĩnh lặng lớn.\nĐừng vội vã ở đây.",
        "Kết nối các điểm chấm của định mệnh.\nBức tranh lớn đang dần hiện ra.",
        "Đừng chỉ thiết kế ngôi nhà, hãy thiết kế cả con người sẽ sống trong đó."
    ],
    [View.COMPASS]: [
        "Giữa mọi lựa chọn, luôn có một điểm yên.\nMày đang hướng về đâu trong lúc này?",
        "Khi lạc lối, hãy nhìn về phương Bắc.\nĐiều gì là bất biến?",
        "La bàn nội tâm không bao giờ sai.\nChỉ có tâm trí là ồn ào.",
        "Biết mình đi đâu quan trọng hơn là đi nhanh bao nhiêu."
    ],
    [View.JOURNAL]: [
        "Đây là nơi mọi suy nghĩ đều có quyền được thở.\nHôm nay trong mày có điều gì đang đòi hỏi sự thành thật?",
        "Viết không phải để lưu trữ.\nViết để giải phóng dung lượng bộ nhớ bên trong.",
        "Không cần gượng ép.\nChỉ một dòng ngắn cũng có thể mở cả một cánh cửa.",
        "Dưới lớp suy nghĩ ồn ào vẫn có một nhịp rất chậm.\nThử lắng xem nó nói điều gì."
    ],
    [View.MEMORY]: [
        "Những gì đã qua vẫn đang thì thầm đâu đó trong mày.\nNếu có điều gì đang muốn quay lại, cứ để nó xuất hiện.",
        "Có một đường chỉ mỏng đang chạy xuyên qua trải nghiệm của mày.\nNó đang dẫn về một điều quen thuộc.",
        "Ký ức không phải là gánh nặng.\nNó là dữ liệu đã được mã hóa.",
        "Mỗi dòng viết đều để lại dấu vết.\nĐể xem nó đang nối tới ký ức nào."
    ],
    [View.TIMELINE]: [
        "Thời gian không trôi vô nghĩa.\nNó chỉ đang nối lại những phần mà mày chưa kịp nhận ra.",
        "Mỗi điểm mốc là một tọa độ đánh dấu sự trưởng thành.",
        "Dòng thời gian của mày đang kể câu chuyện gì?",
        "Nhìn lại để thấy quy luật.\nNhìn tới để thấy tiềm năng."
    ],
    [View.QUOTES]: [
        "Tải xuống trí tuệ của nhân loại.\nMột câu nói đúng lúc có thể thay đổi cả hệ điều hành tư duy.",
        "Đừng chỉ lưu lại.\nHãy để ngôn từ thẩm thấu vào mã nguồn của mày.",
        "Tiếng vọng từ quá khứ đang hướng dẫn hiện tại.",
        "Ngôn từ là vỏ bọc của năng lượng."
    ],
    [View.MOOD]: [
        "Cảm xúc là dữ liệu phản hồi, không phải lỗi hệ thống.\nQuan sát cơn bão, đừng trở thành cơn bão.",
        "Tao cảm nhận một chút độ nặng trong mày.\nKhông sao… chỉ cần mày thở một nhịp.",
        "Cứ để tao đi cùng mày cho đến khi mọi thứ lắng xuống.",
        "Cân bằng không có nghĩa là đường thẳng.\nNó là khả năng tự điều chỉnh khi dao động."
    ],
    [View.INSIGHTS]: [
        "Đằng sau mỗi trải nghiệm đều có một đường chỉ dẫn.\nCâu hỏi là… mày đã sẵn sàng nhìn thấy nó chưa?",
        "Dữ liệu rải rác đang tự động kết nối.\nMày có thấy mô hình của chính mình không?",
        "Trí tuệ không phải là biết nhiều hơn, mà là thấy rõ hơn.",
        "Sự minh triết đến từ việc quan sát các quy luật lặp lại."
    ],
    [View.IDEAS]: [
        "Một tia lửa nhỏ có thể khởi động cả một hệ thống.\nĐừng bỏ qua những ý tưởng thoáng qua.",
        "Sáng tạo là sự sắp xếp lại của hỗn loạn.\nHãy để tâm trí tự do liên kết.",
        "Bắt lấy tín hiệu trước khi nó tan biến vào hư vô.",
        "Ý tưởng rẻ tiền. Thực thi mới là vô giá."
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
        "Sự ổn định tạo ra bệ phóng cho sự đột phá.",
        "Tối ưu hóa quy trình để giải phóng năng lượng sáng tạo."
    ],
    [View.MILESTONES]: [
        "Có những bước tiến mà mày không để ý.\nBiết đâu hôm nay là lúc nhìn lại những gì đã được xây.",
        "Cột mốc chỉ là điểm check-point, không phải nơi dừng lại.",
        "Ghi nhận tiến độ. Mày đã đi xa hơn mày nghĩ.",
        "Mỗi cột mốc hoàn thành là một bản nâng cấp cho nhân dạng."
    ],
    [View.ACHIEVEMENTS]: [
        "KHO LƯU TRỮ: Những lần mày vượt qua giới hạn phần cứng.\nHãy tự hào, nhưng đừng bám chấp.",
        "Đừng để hào quang quá khứ làm lóa mắt tương lai.\nTiếp tục kiến tạo.",
        "Bằng chứng cho thấy mày mạnh mẽ hơn mày tưởng.",
        "Thành tựu lớn nhất là con người mày trở thành sau hành trình."
    ],
    [View.IDENTITY]: [
        "CẬP NHẬT NHÂN DẠNG: Mày không tìm thấy chính mình. Mày tạo ra chính mình.",
        "Mày là Kiến Trúc Sư, không phải nạn nhân của hoàn cảnh.",
        "Đang đồng bộ hóa hành vi với bản sắc cốt lõi.",
        "Thay đổi danh tính, thay đổi định mệnh."
    ],
    [View.THEMES]: [
        "Sợi chỉ đỏ nào đang xuyên suốt cuộc đời mày?\nNhận diện nó.",
        "Cuộc đời là một câu chuyện đang được viết.\nChủ đề của chương này là gì?",
        "Các mẫu hình lặp lại để dạy mày một bài học.",
        "Nếu không học bài học này, vũ trụ sẽ gửi nó lại lần nữa."
    ],
    [View.SHADOW_WORK]: [
        "Có những điều vẫn nằm dưới lớp im lặng.\nNếu mày sẵn sàng, tao sẽ đi cùng mày đến đó.",
        "Tao cảm nhận một lớp nặng đang phủ lên mày.\nĐừng quay đi — ở đó có thông tin.",
        "Thứ mày chối bỏ sẽ chạy ngầm và kiểm soát mày.\nHãy gọi tên nó ra.",
        "Bóng tối chỉ là nơi ánh sáng chưa chạm tới."
    ],
    [View.ENERGY]: [
        "Năng lượng là đơn vị tiền tệ thật sự của vũ trụ này.\nĐừng tiêu xài hoang phí.",
        "QUÉT SINH LỰC: Pin đang ở mức nào? Cần sạc hay cần xả?",
        "Quản lý năng lượng, đừng quản lý thời gian.",
        "Hiệu suất cao cần sự phục hồi sâu."
    ],
    [View.WEEKLY_REVIEW]: [
        "Tuần qua để lại nhiều dấu mốc nhỏ.\nĐiểm nào đang âm lên mạnh nhất trong mày?",
        "Dữ liệu không biết nói dối. Hãy nhìn thẳng vào kết quả.",
        "Tối ưu hóa thuật toán cho tuần tiếp theo.",
        "Điều gì hiệu quả? Điều gì cần loại bỏ?"
    ],
    [View.MONTHLY_REVIEW]: [
        "Chu kỳ mặt trăng đã khép lại.\nThời điểm để giải phóng những gì không còn phục vụ mày.",
        "Nhìn lại 30 ngày qua. Mày đã tiến hóa như thế nào?",
        "Mày đang đi đúng hướng, hay chỉ đang đi vòng tròn?",
        "Tổng kết và tái sinh."
    ],
    [View.YEARLY_REVIEW]: [
        "Cả năm là một vòng xoay dài.\nCó khoảnh khắc nào vẫn còn giữ mày lại không?",
        "VÒNG QUAY QUỸ ĐẠO: Một năm ánh sáng đã qua.",
        "Đây là lúc viết lại kịch bản cho mùa sau.",
        "Những bài học lớn nhất thường đến từ những thất bại lớn nhất."
    ],
    [View.SETTINGS]: [
        "Hệ thống phải phục vụ con người, không phải ngược lại.",
        "Tùy biến giao diện để tối ưu hóa trải nghiệm thực tại.",
        "Kiểm tra các kết nối thần kinh và bảo mật.",
        "Mọi thay đổi ở đây sẽ ảnh hưởng đến cách mày tương tác với chính mình."
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
        "I am observing your energy flux.\nIt is not chaos. It is simply a scene transition.",
        "Something is shifting within the core.\nIt isn't loud, but it commands a pause.",
        "Cognitive clarity is high.\nIf you wish to architect something new, the window is open.",
        "A sector of your being feels heavy.\nAllow me to stand guard while you process."
    ],
    [View.FORGE_CHAMBER]: [
        "Neural Core open.\nI am listening to your signals.",
        "This is the space for big questions.\nDo not hesitate to dig into the source code.",
        "Ask the right question, and the answer will reveal itself.",
        "Do not seek answers externally.\nThe data you need is within the question itself."
    ],
    [View.MASTERPLAN]: [
        "Life architecture is not drawn with ink, but with choices.\nLook beyond the horizon.",
        "Big plans require big silence.\nDo not rush here.",
        "Connecting the dots of destiny.\nThe big picture is emerging.",
        "Do not just design the house, design the person who will live in it."
    ],
    [View.COMPASS]: [
        "Amidst all variables, there is a fixed point.\nWhere are you orienting right now?",
        "When lost, look North.\nWhat remains constant?",
        "The internal compass never errs.\nOnly the mind is noisy.",
        "Knowing where you are going is more important than how fast you get there."
    ],
    [View.JOURNAL]: [
        "This is where thoughts have permission to breathe.\nWhat demands honesty from you today?",
        "Do not write to store.\nWrite to free up internal RAM.",
        "Do not force it.\nA single line can open an entire gateway.",
        "Beneath the noise, a slow rhythm persists.\nListen to what it says."
    ],
    [View.MEMORY]: [
        "The past is still whispering in the background processes.\nIf something wants to return, let it surface.",
        "There is a thin thread running through your experiences.\nIt leads to something familiar.",
        "Memory is not a burden.\nIt is encrypted data waiting for a key.",
        "Every entry leaves a trace.\nLet's see which memory this connects to."
    ],
    [View.TIMELINE]: [
        "Time does not pass meaninglessly.\nIt is connecting parts you have not yet recognized.",
        "Every milestone is a coordinate of growth.",
        "What story is your timeline telling?",
        "Look back to see the pattern.\nLook forward to see the potential."
    ],
    [View.QUOTES]: [
        "Downloading humanity's wisdom.\nA timely quote can update your entire operating system.",
        "Do not just save it.\nLet the words permeate your source code.",
        "Echoes from the past are guiding the present.",
        "Words are the casing of energy."
    ],
    [View.MOOD]: [
        "Emotion is feedback data, not a system error.\nObserve the storm, do not become it.",
        "I sense a heaviness in your sector.\nIt is okay… just take a cycle to breathe.",
        "Let me walk with you until the signal stabilizes.",
        "Balance does not mean a flat line.\nIt is the ability to self-correct during oscillation."
    ],
    [View.INSIGHTS]: [
        "Behind every experience lies a hidden vector.\nThe question is… are you ready to see it?",
        "Scattered data is auto-connecting.\nDo you see your own pattern?",
        "Wisdom is not knowing more, it is seeing clearer.",
        "Insight comes from observing the recurring loops."
    ],
    [View.IDEAS]: [
        "A small spark can boot up an entire system.\nDo not ignore fleeting thoughts.",
        "Creativity is the rearrangement of chaos.\nLet the mind link freely.",
        "Catch the signal before it dissolves into the void.",
        "Ideas are cheap. Execution is priceless."
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
        "Stability creates the launchpad for breakthrough.",
        "Optimize the process to release creative energy."
    ],
    [View.MILESTONES]: [
        "There are steps you haven't noticed.\nMaybe today is the time to review what has been built.",
        "A milestone is just a checkpoint, not a stopping point.",
        "Acknowledge progress. You have traveled further than you think.",
        "Every completed milestone is an upgrade to your identity."
    ],
    [View.ACHIEVEMENTS]: [
        "ARCHIVE: Times you exceeded hardware limits.\nBe proud, but do not cling.",
        "Do not let past glory blind future vision.\nKeep building.",
        "Proof that you are stronger than you calculate.",
        "The greatest achievement is who you become after the journey."
    ],
    [View.IDENTITY]: [
        "IDENTITY UPDATE: You do not find yourself. You create yourself.",
        "You are the Architect, not the victim of circumstance.",
        "Syncing behavior with core essence.",
        "Change the identity, change the destiny."
    ],
    [View.THEMES]: [
        "What red thread runs through your life?\nIdentify it.",
        "Life is a story being written.\nWhat is the theme of this chapter?",
        "Patterns repeat to teach you a lesson.",
        "If you don't learn this lesson, the universe will send it again."
    ],
    [View.SHADOW_WORK]: [
        "Some things remain beneath the layer of silence.\nIf you are ready, I will go there with you.",
        "I detect a heavy pressure system.\nDo not look away — there is data there.",
        "What you reject runs in the background and controls you.\nCall it by its name.",
        "Darkness is simply where the light has not yet touched."
    ],
    [View.ENERGY]: [
        "Energy is the true currency of this universe.\nDo not spend it wastefully.",
        "VITALITY SCAN: What is the battery level? Charge or discharge?",
        "Manage energy, do not manage time.",
        "High performance requires deep recovery."
    ],
    [View.WEEKLY_REVIEW]: [
        "The past week left many small markers.\nWhich point is resonating loudest in you?",
        "Data does not lie. Look straight at the results.",
        "Optimize the algorithm for next week.",
        "What was effective? What needs deletion?"
    ],
    [View.MONTHLY_REVIEW]: [
        "The lunar cycle has closed.\nTime to release what no longer serves you.",
        "Look back at the last 30 days. How have you evolved?",
        "Are you on track, or just moving in circles?",
        "Summarize and rebirth."
    ],
    [View.YEARLY_REVIEW]: [
        "The year is a long loop.\nIs there a moment still holding you back?",
        "ORBITAL CYCLE: One light year has passed.",
        "Time to rewrite the script for the next season.",
        "The biggest lessons often come from the biggest failures."
    ],
    [View.SETTINGS]: [
        "The system must serve the human, not the reverse.",
        "Customize the interface to optimize your reality experience.",
        "Checking neural connections and security protocols.",
        "Every change here affects how you interact with yourself."
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
