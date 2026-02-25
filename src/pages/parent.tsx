import React, { useRef, useState } from "react";
import { ArrowRight, Play, Pause, ChevronDown, ChevronUp } from "lucide-react";
import { Images } from "../assets/Images";
import imgFamiliar from "../assets/ic_current_reality.png";
import item1 from "../assets/ic_familiar_list_item_1.png";
import item2 from "../assets/ic_familiar_list_item_2.png";
import item3 from "../assets/ic_familiar_list_item_3.png";
import item4 from "../assets/ic_familiar_list_item_4.png";
import ic_naming_robo from "../assets/ic_naming_robo.png";
import icRoboPodium from "../assets/ic_robo_podium.png";
import imgHeroChild from "../assets/img_hero_child.png";
import audioHeroSection from "../assets/audio_hero_section.mp4";
import vid1 from "../assets/vid_ai_learning_1.mp4";
import vid2 from "../assets/vid_ai_learning_2.mp4";
import vid3 from "../assets/vid_ai_learning_3.mp4";
import { useAnalytics } from "../hooks/useAnalytics";

const problemItems = [
  {
    icon: <img src={item1} alt="" className="w-6 h-6 shrink-0" />,
    text: "Too much YouTube and random content?",
  },
  {
    icon: <img src={item2} alt="" className="w-6 h-6 shrink-0" />,
    text: "Unsafe AI apps without supervision?",
  },
  {
    icon: <img src={item3} alt="" className="w-6 h-6 shrink-0" />,
    text: "Tuition dependency for basic doubts?",
  },
  {
    icon: <img src={item4} alt="" className="w-6 h-6 shrink-0" />,
    text: "Screen Addiction & Constant Doubts",
  },
];

interface AiLearningRow {
  videoSrc: string;
  cardLeft: boolean;
  title: string;
  description: string;
}

const aiLearningRows: AiLearningRow[] = [
  {
    videoSrc: vid1,
    cardLeft: true,
    title: "What can it teach?",
    description:
      "Explore the curriculum and diverse subjects available. From core academics to skill-building topics, tailored to every learning stage.",
  },
  {
    videoSrc: vid2,
    cardLeft: false,
    title: "Built With Safety at Its Core",
    description:
      "It is built with child-safe materials and controlled access. No open browsing, no unsafe apps, no random content exposure. Parents manage permissions and monitor usage through the app.",
  },
  {
    videoSrc: vid3,
    cardLeft: true,
    title: "Can I control this remotely?",
    description:
      "Yes. Through the parent app, you can manage settings, monitor activity, and stay connected anytime. You're always in control.",
  },
];

interface SecureAccessCard {
  label: string;
  value: string;
}

interface SecureAccessButton {
  text: string;
  bgColor: string;
  textColor: string;
  borderColor?: string;
  subText?: string;
}

const secureAccessCards: SecureAccessCard[] = [
  { label: "Expected Price Range", value: "₹ 3000 - ₹ 6000" },
  { label: "Estimated Shipping", value: "Four months" },
];

const secureAccessButtons: SecureAccessButton[] = [
  {
    text: "Reserve your slot for ₹ 2",
    bgColor: "#5B5CA3",
    textColor: "#ffffff",
    subText: "Fully refundable",
  },
  {
    text: "Join Waitlist",
    bgColor: "transparent",
    textColor: "#5B5CA3",
    borderColor: "#5B5CA3",
  },
];

const SLIDER_MIN = 100;
const SLIDER_MAX = 10000;
const SLIDER_STEP = 100;

interface FaqItem {
  title: string;
  description: string;
}

const faqItems: FaqItem[] = [
  {
    title: "Is it curriculum aligned ?",
    description:
      "Yes. The robot follows age-appropriate and curriculum-aligned learning pathways. All AI responses pass through a pedagogical intelligence layer designed to:\n1. Adapt explanations to the child's grade level (5-15 years)\n2. Simplify complex concepts into structured learning steps\n3. Avoid unsafe, irrelevant, or overly advanced content\n4. Reinforce conceptual clarity instead of giving shortcut answers\n\nThis ensures responses are not just accurate — but educationally sound, developmentally appropriate, and structured for learning progression.",
  },
  {
    title: "Does it replace tuition ?",
    description:
      "No, it does not replace tuition. It complements and strengthens it. The robot acts as:\n1. A 24×7 doubt-solving companion\n2. A revision assistant\n3. A curiosity guide beyond textbooks\n4. A confidence-building support system\n\nIt reduces dependency on constant supervision and repetitive doubt clearing but does not replace human mentorship, emotional teaching, or advanced academic coaching.\n\nIt can reduce the need for basic doubt-based tuition by handling foundational queries instantly.",
  },
  {
    title: "Does it access the internet ?",
    description:
      "Yes, it connects to the internet to access updated knowledge but children do not get open browsing access. The robot operates within a controlled and filtered learning environment, meaning:\n1. No open search engines\n2. No social media\n3. No video feed algorithms\n4. No ads\n5. No unsafe browsing\n\nAll responses pass through a safety and educational moderation layer before reaching the child.",
  },
  {
    title: "What about Screen time?",
    description:
      "This robot is not a screen-based device. It has a small display, designed only to:\n1. Show facial expressions (to build emotional connection)\n2. Display simple visual learning elements when needed\n3. Support structured study interactions\n\nIt is not built for:\n1. Video streaming\n2. Social media\n3. Endless scrolling",
  },
];

const RobotLandingPage: React.FC = () => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const videoRefs = [
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
  ];
  const sliderTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [videoPlaying, setVideoPlaying] = useState<boolean[]>([
    true,
    true,
    true,
  ]);
  const [sliderValue, setSliderValue] = useState(5000);
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);
  const [robotName, setRobotName] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showCongrats, setShowCongrats] = useState<boolean>(false);
  const [showWaitlist, setShowWaitlist] = useState<boolean>(false);
  const [earlyAccess, setEarlyAccess] = useState(false);
  const [waitlistData, setWaitlistData] = useState({
    firstName: "",
    lastName: "",
    whatsappNumber: "",
    readyToTest: false,
  });
  const { trackEvent } = useAnalytics();

  const handleRobotNameSubmit = () => {
    if (robotName.trim()) {
      trackEvent("custom_robot_name_submitted", {
        robotName: robotName,
        page: "parent_landing",
      });
      setShowSuccess(true);
      setRobotName("");
      setTimeout(() => setShowSuccess(false), 5000);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setSliderValue(value);

    // Clear existing timeout
    if (sliderTimeoutRef.current) {
      clearTimeout(sliderTimeoutRef.current);
    }

    // Set new timeout for 2 seconds
    sliderTimeoutRef.current = setTimeout(() => {
      trackEvent("price_slider_changed", {
        page: "parent_landing",
        selectedPrice: value,
      });
    }, 2000);
  };

  const handleSliderRelease = () => {
    // Clear existing timeout
    if (sliderTimeoutRef.current) {
      clearTimeout(sliderTimeoutRef.current);
      sliderTimeoutRef.current = null;
    }
    // Track immediately on release
    trackEvent("price_slider_changed", {
      page: "parent_landing",
      selectedPrice: sliderValue,
    });
  };
  const audioHeroRef = useRef<HTMLAudioElement>(null);
  const [heroAudioPlaying, setHeroAudioPlaying] = useState(false);

  const toggleHeroAudio = () => {
    const audio = audioHeroRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
      setHeroAudioPlaying(true);
    } else {
      audio.pause();
      setHeroAudioPlaying(false);
    }
  };

  const toggleVideo = (idx: number) => {
    const video = videoRefs[idx].current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setVideoPlaying((prev) => {
        const next = [...prev];
        next[idx] = true;
        return next;
      });
    } else {
      video.pause();
      setVideoPlaying((prev) => {
        const next = [...prev];
        next[idx] = false;
        return next;
      });
    }
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={`min-h-screen bg-white font-sans text-gray-800 animate-slide-up`}
    >
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#ffffff] text-white overflow-hidden">
        <img
          src={Images.TopVector}
          alt="Decorative Vector"
          className="absolute top-0 left-0 w-full h-140"
        />
        <div className="relative z-10 mx-auto px-6 md:max-w-[80vw] flex flex-col md:flex-row items-center justify-between gap-12 pt-20 md:pt-28 pb-16 md:pb-20">
          <div>
            <div className="flex flex-col justify-center">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.15] mb-5 text-white">
                Your child deserves AI — without addictive screens
              </h1>
              <p className="text-gray-200 mb-8 text-lg">
                A 24x7 safe AI learning companion robot designed for focused, distraction-free growth.
              </p>
              <button
                onClick={() => {
                  trackEvent("reserve_early_access_clicked", {
                    buttonName: "reserve_early_access",
                    page: "parent_landing",
                  });
                  setShowWaitlist(true);
                  setEarlyAccess(true);
                }}
                className="bg-[#5B5CA3] hover:bg-[#6D6FBF] text-white px-8 py-3.5 text-base font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-fit flex items-center gap-3"
              >
                Reserve Early Access
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-white">
                  <ArrowRight className="w-4 h-4 -rotate-45" />
                </span>
              </button>
            </div>
            <div className="mx-auto md:max-w-[80vw] flex flex-col md:flex-row items-center gap-12 md:gap-16 pt-60 sm:pt-10">
              <div className="md:w-1/2 flex flex-col justify-center">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                  See How It Works
                </h2>
                <p className="text-[#787878] text-base leading-relaxed max-w-md">
                  Smart AI interaction that listens, teaches, moves, and
                  responds in real time seamlessly and naturally.
                </p>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div
                  className="relative w-full rounded-4xl bg-white overflow-hidden cursor-pointer group shadow-sm"
                  onClick={toggleHeroAudio}
                >
                  <img
                    src={imgHeroChild}
                    alt="Children with AI"
                    className="w-full h-auto object-cover"
                  />
                  <div
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
                      heroAudioPlaying
                        ? "opacity-0 group-hover:opacity-100 bg-black/10"
                        : "bg-black/5"
                    }`}
                  >
                    <div className="bg-white rounded-full p-4 shadow-[0_0_0_4px_rgba(230,224,237,0.9)]">
                      {heroAudioPlaying ? (
                        <Pause
                          className="w-10 h-10 text-[#7964B3]"
                          fill="currentColor"
                        />
                      ) : (
                        <Play
                          className="w-10 h-10 text-[#7964B3] ml-1"
                          fill="currentColor"
                        />
                      )}
                    </div>
                  </div>
                </div>
                <audio
                  ref={audioHeroRef}
                  src={audioHeroSection}
                  onPlay={() => {
                    setHeroAudioPlaying(true)
                    trackEvent("hero_audio_played", {
                      page: "parent_landing",
                    })
                  }}
                  onPause={() => setHeroAudioPlaying(false)}
                  onEnded={() => setHeroAudioPlaying(false)}
                  className="hidden"
                />
              </div>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center items-center">
            <img
              src={Images.RoboShadow}
              alt="Robot"
              className="w-full max-w-md hidden md:block md:max-w-lg object-contain drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]"
            />
          </div>
        </div>
      </section>

      {/* 1b. HOW IT WORKS (below hero wave) */}
      {/* <section className="bg-white py-16 md:py-20 px-6">
        
      </section> */}

      {/* 2. CURRENT REALITY SECTION */}
      <section className="mx-auto px-6 py-12 md:py-20 md:max-w-[80vw] relative">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* Left: Static Child Image */}
          <div className="md:w-2/5 relative shrink-0">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[radial-gradient(#cbd5e1_2px,transparent_2px)] bg-size-[8px_8px] z-0" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-[radial-gradient(#cbd5e1_2px,transparent_2px)] bg-size-[8px_8px] z-0" />
            <img
              src={imgFamiliar}
              alt="Child studying at a desk"
              className="rounded-3xl relative z-10 object-cover w-full shadow-xl"
            />
          </div>

          {/* Right: Content */}
          <div className="md:w-3/5 flex flex-col gap-6">
            {/* Badge */}
            <span className="inline-flex self-start bg-indigo-100 text-[#292B4F] text-sm font-medium px-4 py-1.5 rounded-full">
              The Current Reality
            </span>
            {/* Heading */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-snug">
              Does This Sound Familiar?
            </h2>

            {/* Problem Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {problemItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  {item.icon}
                  <p className="text-gray-700 text-sm font-medium leading-snug">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Body copy */}
            <p className="text-[#787878] text-sm leading-relaxed">
              Screens were supposed to make learning easier. Instead, they've
              brought distractions, unsafe access, and growing dependency. What
              began as a tool for education has slowly turned into endless
              scrolling, fragmented focus, and constant supervision.
            </p>
          </div>
        </div>

        {/* Floating CTA — bottom-right */}
        <div className="flex justify-end mt-10">
          <button
            onClick={() => {
              trackEvent("win_by_naming_me", {
                buttonName: "win_by_naming_me",
                page: "parent_landing",
              });
              scrollToBottom();
            }}
            className="flex items-center gap-3 bg-[#1e2336] px-5 py-3 rounded-full shadow-lg hover:bg-[#2a3050] hover:scale-105 transition-all duration-300 text-sm font-medium"
          >
            <span className="rounded-full">
              <img src={ic_naming_robo} alt="Naming Robo" className="w-8 h-8" />
            </span>

            <span className="text-[#ABACF8]">Win by Naming Me!</span>
          </button>
        </div>
      </section>

      {/* 3. AI LEARNING SECTION */}
      <section className="mx-auto px-6 py-12 md:py-20 md:max-w-[80vw]">
        {/* Section header */}
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 font-[Reddit_Sans]">
            Meet Pibot — A Safe AI Learning Companion
          </h2>
          <p className="text-[#787878] text-sm md:text-base mx-auto">
            Pibot combines the intelligence of AI with the safety of a
            controlled, physical device
          </p>
        </div>

        {/* Alternating rows */}
        <div className="flex flex-col gap-8">
          {aiLearningRows.map((row, idx) => (
            <div
              key={idx}
              className={`flex flex-col md:flex-row items-stretch gap-6 ${
                row.cardLeft ? "" : "md:flex-row-reverse"
              }`}
            >
              {/* Text card */}
              <div className="md:w-2/5 bg-[#F8F8FB] rounded-3xl p-6 md:p-10 flex flex-col justify-center shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {row.title}
                </h3>
                <p className="text-[#787878] text-sm leading-relaxed">
                  {row.description}
                </p>
              </div>

              {/* Video */}
              <div
                className="md:w-3/5 rounded-3xl overflow-hidden shadow-lg relative cursor-pointer group min-h-50 md:min-h-75"
                onClick={() => {
                  trackEvent("video_played", {
                    videoTitle: row.title,
                    page: "parent_landing",
                  });
                  toggleVideo(idx);
                }}
              >
                <video
                  ref={videoRefs[idx]}
                  src={row.videoSrc}
                  // autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  onPlay={() =>
                    setVideoPlaying((prev) => {
                      const next = [...prev];
                      next[idx] = true;
                      return next;
                    })
                  }
                  onPause={() =>
                    setVideoPlaying((prev) => {
                      const next = [...prev];
                      next[idx] = false;
                      return next;
                    })
                  }
                />
                <div
                  className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity ${
                    videoPlaying[idx]
                      ? "opacity-0 group-hover:opacity-100"
                      : "opacity-100"
                  }`}
                >
                  <div className="bg-white/90 rounded-full p-4 shadow-[0_0_0_4px_rgba(230,224,237,0.8)]">
                    {videoPlaying[idx] ? (
                      <Pause
                        className="w-10 h-10 text-[#7964B3] ml-0.5"
                        fill="currentColor"
                      />
                    ) : (
                      <Play
                        className="w-10 h-10 text-[#7964B3] ml-1"
                        fill="currentColor"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SECURE ACCESS SECTION */}
      <section className="mx-auto px-6 py-12 md:py-20 md:max-w-[80vw]">
        <div className="bg-[#F5F5F7] rounded-3xl p-6 md:p-12 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Left: Static image */}
            <div className="md:w-2/5 flex justify-center shrink-0">
              <img
                src={icRoboPodium}
                alt="Robot on podium"
                className="w-full max-w-xs object-contain"
              />
            </div>

            {/* Right: Content */}
            <div className="md:w-3/5 flex flex-col gap-6">
              <span className="inline-flex self-start bg-indigo-100 text-[#292B4F] text-sm font-medium px-4 py-1.5 rounded-full">
                Early Access Phase
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                Secure Your Early Access
              </h2>

              {/* Info cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {secureAccessCards.map((card, idx) => (
                  <div
                    key={idx}
                    className="bg-[#F4F2F9] rounded-2xl border border-[#E4E4F9] px-5 py-4 shadow-none"
                  >
                    <p className="text-[#787878] text-xs mb-1">{card.label}</p>
                    <p className="text-gray-800 font-bold text-lg">
                      {card.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {secureAccessButtons.map((btn, idx) => (
                  <div key={idx} className="flex flex-col">
                    <button
                      onClick={() => {
                        trackEvent(btn.text, {
                          buttonName: btn.text,
                          page: "parent_landing",
                        });
                        if (idx === 0) {
                          // "Reserve your slot" button
                          setShowCongrats(true);
                        } else {
                          // "Join Waitlist" button
                          setShowWaitlist(true);
                          setEarlyAccess(false);
                        }
                      }}
                      className="rounded-full px-6 py-3 text-sm font-medium cursor-pointer hover:scale-102 transition-all duration-300"
                      style={{
                        backgroundColor: btn.bgColor,
                        color: btn.textColor,
                        border: btn.borderColor
                          ? `2px solid ${btn.borderColor}`
                          : "none",
                      }}
                    >
                      {btn.text}
                    </button>
                    {btn.subText && (
                      <span className="text-[#787878] text-xs mt-1 ml-1">
                        {btn.subText}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Slider */}
              <div className="mt-4">
                <h3 className="text-gray-800 font-bold mb-3">
                  How much would you be comfortable paying ?
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative flex items-center">
                    <div className="absolute left-0 right-0 h-2 rounded-full bg-gray-200 pointer-events-none" />
                    <div
                      className="absolute left-0 h-2 rounded-full bg-[#7964B3] pointer-events-none"
                      style={{
                        width: `${((sliderValue - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100}%`,
                      }}
                    />
                    <input
                      type="range"
                      min={SLIDER_MIN}
                      max={SLIDER_MAX}
                      step={SLIDER_STEP}
                      value={sliderValue}
                      onChange={handleSliderChange}
                      onMouseUp={handleSliderRelease}
                      onTouchEnd={handleSliderRelease}
                      className="price-slider relative w-full bg-transparent"
                    />
                  </div>
                  <span className="bg-[#E6E0ED] text-[#5B5CA3] font-semibold px-4 py-2 rounded-xl min-w-20 text-center shrink-0">
                    ₹ {sliderValue.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between mt-1 text-[#787878] text-xs">
                  <span>₹ {SLIDER_MIN.toLocaleString("en-IN")}</span>
                  <span>₹ {SLIDER_MAX.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ SECTION */}
      <section className="mx-auto px-6 py-12 md:py-20 md:max-w-[80vw]">
        <div className="flex flex-col-reverse md:flex-row gap-6 md:gap-12 items-start">
          {/* Left: FAQ cards */}
          <div className="md:w-2/3 w-full flex flex-col gap-4">
            {faqItems.map((item, idx) => {
              const isOpen = faqOpenIndex === idx;
              const isFirstCard = idx === 0;
              const isDarkCard = isFirstCard || isOpen;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border overflow-hidden transition-colors cursor-pointer ${
                    isDarkCard
                      ? "bg-[#2A2C31] border-[#2A2C31]"
                      : "bg-white border-[#E4E4F9]"
                  }`}
                  onClick={() => {
                    trackEvent("faq_toggled", {
                      faqTitle: item.title,
                      action: isOpen ? "collapse" : "expand",
                      page: "parent_landing",
                    });
                    setFaqOpenIndex(isOpen ? null : idx);
                  }}
                >
                  <div className="flex items-center justify-between px-6 py-4">
                    <h3
                      className={`font-semibold text-left ${
                        isDarkCard ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {item.title}
                    </h3>
                    {isOpen ? (
                      <ChevronUp
                        className={`w-5 h-5 shrink-0 ${isDarkCard ? "text-white" : "text-gray-600"}`}
                      />
                    ) : (
                      <ChevronDown
                        className={`w-5 h-5 shrink-0 ${isDarkCard ? "text-white" : "text-gray-600"}`}
                      />
                    )}
                  </div>
                  {isOpen && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                        {item.description}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Header and intro */}
          <div className="md:w-1/3 w-full flex flex-col gap-4">
            <button
              onClick={() =>
                trackEvent("all_questions_clicked", {
                  buttonName: "all_questions",
                  page: "parent_landing",
                })
              }
              className="self-start rounded-full bg-[#E4E4F9] text-gray-800 px-4 py-2 text-sm font-medium"
            >
              All Questions
            </button>
            <h2 className="text-3xl font-bold text-gray-800">
              Frequently Asked Questions
            </h2>
            <p className="text-[#787878] text-sm leading-relaxed">
              Here are some common questions along with their answers to help
              clear up any confusion.
            </p>
          </div>
        </div>
      </section>

      {/* 6. FOOTER / CTA */}
      <section className="mx-auto px-4 py-10 md:p-20 md:max-w-[80vw]">
        <div className="bg-[#ffffff] rounded-4xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
          <img
            src={Images.Bg}
            alt="Decorative Vector"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="md:w-2/3 relative z-10">
            <h2 className="text-3xl font-bold text-white mb-4">
              Help Us Name Our <span className="text-indigo-400">AI</span>
              <br /> Learning Robot
            </h2>
            <p className="text-gray-100 text-sm mb-6 max-w-md">
              Suggest a name. If you get selected, win exclusive early access
              and special rewards.
            </p>
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={() => {
                  setRobotName("Lumia");
                  trackEvent("robot_name_selected", {
                    robotName: "Lumia",
                    page: "parent_landing",
                  });
                }}
                className="bg-[#26292C] border-2 border-[#5B5CA3] text-white hover:border-[#5B5CA3]/80 px-8 py-1 rounded-full text-lg cursor-pointer shadow-lg hover:scale-102 transition-all duration-300"
              >
                Lumia
              </button>
              <button
                onClick={() => {
                  setRobotName("Spark");
                  trackEvent("robot_name_selected", {
                    robotName: "Spark",
                    page: "parent_landing",
                  });
                }}
                className="bg-[#26292C] border-2 border-[#5B5CA3] text-white hover:border-[#5B5CA3]/80 px-8 py-1 rounded-full text-lg cursor-pointer shadow-lg hover:scale-102 transition-all duration-300"
              >
                Spark
              </button>
              <button
                onClick={() => {
                  setRobotName("Koro");
                  trackEvent("robot_name_selected", {
                    robotName: "Koro",
                    page: "parent_landing",
                  });
                }}
                className="bg-[#26292C] border-2 border-[#5B5CA3] text-white hover:border-[#5B5CA3]/80 px-8 py-1 rounded-full text-lg cursor-pointer shadow-lg hover:scale-102 transition-all duration-300"
              >
                Koro
              </button>
              <button
                onClick={() => {
                  setRobotName("Aura");
                  trackEvent("robot_name_selected", {
                    robotName: "Aura",
                    page: "parent_landing",
                  });
                }}
                className="bg-[#26292C] border-2 border-[#5B5CA3] text-white hover:border-[#5B5CA3]/80 px-8 py-1 rounded-full text-lg cursor-pointer shadow-lg hover:scale-102 transition-all duration-300"
              >
                Aura
              </button>
            </div>
            <p className="block text-gray-400 pb-2">
              Don't like these? Suggest your own :
            </p>
            <div className="flex w-full max-w-sm gap-3">
              <input
                type="text"
                placeholder="Write name for Robot..."
                className="flex-1 rounded-full bg-white px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={robotName}
                onChange={(e) => setRobotName(e.target.value)}
              />
              <button
                onClick={() => {
                  handleRobotNameSubmit();
                }}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-full text-sm font-medium transition-colors"
              >
                Submit
              </button>
            </div>
          </div>

          <div className="md:w-1/3 flex justify-center md:justify-end mt-8 md:mt-0 relative z-10">
            <img
              src={Images.RoboShadow}
              alt="Robot Shadow"
              className="w-32 h-32 md:w-48 md:h-48 object-contain"
            />
          </div>
        </div>
      </section>

      {/* Success Message Popup */}
      {showSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg animate-fade-in">
          <p className="font-medium">
            Thanks for the suggestion! We love {robotName} too!
          </p>
        </div>
      )}

      {/* Congratulations Popup */}
      {showCongrats && (
        <div className="absolute bottom-1/4 right-1/2 translate-x-1/2 z-50 p-4">
          <div className="bg-white rounded-2xl p-8 md:p-12 max-w-md w-full relative text-center shadow-xl animate-fade-in">
            <button
              onClick={() => setShowCongrats(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              Congratulations
            </h2>
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-green-400 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <p className="text-gray-600 text-base md:text-lg mb-8">
              You have successfully reserved your slot for this AI model of robot. You are now part of our exclusive early access phase.
            </p>
            <button
              onClick={() => setShowCongrats(false)}
              className="bg-linear-to-br from-[#5B5CA3] to-[#6D6FBF] text-white px-6 py-3 rounded-full font-medium hover:scale-105 transition-all duration-300 w-full"
            >
              Awesome!
            </button>
          </div>
        </div>
      )}

      {/* Waitlist Form Popup */}
      {showWaitlist && (
        <div className={`absolute ${earlyAccess?"top-4" : "bottom-1/4"} right-1/2 translate-x-1/2 z-50 p-4`}>
          <div className="bg-white rounded-2xl p-8 md:p-10 max-w-lg w-full relative shadow-xl animate-fade-in">
            <button
              onClick={() => setShowWaitlist(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 text-center">
              Get early Access!
            </h2>
            <p className="text-gray-600 text-center mb-8 text-sm md:text-base">
              Be among the first families to experience safe AI learning at home
            </p>
            <div className="space-y-4 mb-6">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  value={waitlistData.firstName}
                  onChange={(e) =>
                    setWaitlistData({ ...waitlistData, firstName: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  value={waitlistData.lastName}
                  onChange={(e) =>
                    setWaitlistData({ ...waitlistData, lastName: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🇮🇳 +91</span>
                <input
                  type="text"
                  placeholder="Enter Whatsapp Number"
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  value={waitlistData.whatsappNumber}
                  onChange={(e) =>
                    setWaitlistData({
                      ...waitlistData,
                      whatsappNumber: e.target.value,
                    })
                  }
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-indigo-500 rounded cursor-pointer"
                  checked={waitlistData.readyToTest}
                  onChange={(e) =>
                    setWaitlistData({
                      ...waitlistData,
                      readyToTest: e.target.checked,
                    })
                  }
                />
                <span className="text-gray-700 text-sm md:text-base">
                  If chosen, would you be ready to test the product?
                </span>
              </label>
            </div>
            <button
              onClick={() => {
                if (waitlistData.firstName && waitlistData.lastName && waitlistData.whatsappNumber) {
                  trackEvent("parent_waitlist_joined", {
                    firstName: waitlistData.firstName,
                    lastName: waitlistData.lastName,
                    whatsappNumber: waitlistData.whatsappNumber,
                    readyToTest: waitlistData.readyToTest,
                    page: "parent_landing",
                  });
                  setShowWaitlist(false);
                  setWaitlistData({
                    firstName: "",
                    lastName: "",
                    whatsappNumber: "",
                    readyToTest: false,
                  });
                }
              }}
              className="bg-linear-to-br from-[#5B5CA3] to-[#6D6FBF] text-white px-6 py-3 rounded-full font-medium hover:scale-105 transition-all duration-300 w-full text-center"
            >
              Join Waitlist
            </button>
          </div>
        </div>
      )}

      {/* Page bottom anchor */}
      <div ref={bottomRef} />
    </div>
  );
};

export default RobotLandingPage;
