import React, { useRef, useState, useEffect } from "react";
import {
  BookOpen,
  Lightbulb,
  Gamepad2,
  MessageSquare,
  Trophy,
  ArrowRight,
} from "lucide-react";
import { Images } from "../assets/Images";
import { useAnalytics } from "../hooks/useAnalytics";
import ic_naming_robo from "../assets/ic_naming_robo.png";
import Confetti from "react-confetti";

const ChildLandingPage: React.FC = () => {
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);
  const [robotName, setRobotName] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showCongrats, setShowCongrats] = useState<boolean>(false);
  const [showWaitlist, setShowWaitlist] = useState<boolean>(false);
  const [waitlistData, setWaitlistData] = useState({
    firstName: "",
    lastName: "",
    whatsappNumber: "",
    readyToTest: false,
  });
  const [selectedUseCases, setSelectedUseCases] = useState<number[]>([]);
  const { trackEvent } = useAnalytics();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(120); // seconds
  const [askUsed, setAskUsed] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // read persisted usage from localStorage (one-time use)
    try {
      const used = localStorage.getItem("ask_anything_used");
      if (used === "true") setAskUsed(true);
    } catch (e) {
      // ignore storage errors
    }

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const updateDimensions = () => {
      setWindowDimensions({
        width: 480,
        height: 450,
      });
    };
    if (showCongrats) {
      updateDimensions();
    }

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [showCongrats]);

  useEffect(() => {
    if (!timerActive) return;
    // decrement every second
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // stop timer
          if (timerRef.current) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timerActive]);

  const startAskTimer = () => {
    if (askUsed) return; // one-time only
    // mark used immediately so user can't restart once started
    try {
      localStorage.setItem("ask_anything_used", "true");
    } catch (e) {}
    setAskUsed(true);
    setTimeLeft(120);
    setTimerActive(true);
    trackEvent("ask_me_anything_started", {
      duration_seconds: 120,
      page: "child_landing",
    });
  };

  const handleRobotNameSubmit = () => {
    if (robotName.trim()) {
      trackEvent("custom_robot_name_submitted", {
        robotName: robotName,
        page: "child_landing",
      });
      setShowSuccess(true);
      setRobotName("");
      setTimeout(() => setShowSuccess(false), 5000);
    }
  };

  const features = [
    {
      title: "Can I Play Games?",
      shortText: "Of course you can!",
      expandedText:
        "Of course you can! I've got quick quizzes, brain challenges, and fun mini games ready for you. Let's play and make your brain stronger at the same time.",
      image: Images.Img1,
    },
    {
      title: "Can You Help With Homework?",
      shortText: "Of course I can!",
      expandedText:
        "Of course I can. Show me your question and we'll solve it step by step. I'll explain it in a way that makes sense to you.",
      image: Images.Img2,
    },
    {
      title: "Can You Tell Stories?",
      shortText: "Absolutely!",
      expandedText:
        "Of course I can.I can tell fun, exciting, and even bedtime stories. Just tell me what kind you'd like to hear.",
      image: Images.Img3,
    },
    {
      title: "Can You Talk Like a Friend?",
      shortText: "Definitely!",
      expandedText:
        "Of course I can. Tell me about your day — I love listening and chatting. You can talk to me about anything on your mind.",
      image: Images.Img4,
    },
  ];

  const toggleFeature = (index: number) => {
    setExpandedFeature(expandedFeature === index ? null : index);
    trackEvent("feature_toggled", { featureName: features[index]?.title });
  };
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={`min-h-screen bg-white font-sans text-gray-800 animate-slide-up`}
    >
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#ffffff] text-white pt-10 md:pt-24 flex justify-between">
        <img
          src={Images.TopVector}
          alt="Decorative Vector"
          className="absolute top-0 left-0 w-full h-140"
        />
        <div className="mx-auto flex flex-col md:flex-row items-center px-4 md:px-0">
          <div className="md:w-1/2 w-full z-10 pl-4 md:pl-12">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
              Meet Your New AI Robot Friend
            </h1>
            <p className="text-gray-200 mb-8 text-lg">
              I'm a smart companion that helps with homework, plays games, and
              tells fun stories.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
              <button
                onClick={() => {
                  trackEvent("button_clicked", {
                    buttonName: "ask_me_anything",
                    page: "child_landing",
                  });
                  startAskTimer();
                }}
                disabled={askUsed}
                className={`bg-linear-to-br from-[#5B5CA3] to-[#6D6FBF] text-white hover:bg-indigo-700 px-6 py-3 text-lg rounded-full shadow-lg transition-all duration-300 flex items-center justify-center w-full md:w-auto ${askUsed ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-102"}`}
              >
                Ask me Anything
                <img
                  src={Images.Audio}
                  alt="Audio Icon"
                  className="w-10 h-10 ml-4 inline"
                />
              </button>

              {/* Timer display */}
              {/* {(timerActive) && ( */}
              <div className="ml-0 sm:ml-2 mt-3 sm:mt-0 text-sm text-white px-3 py-2 rounded-full flex items-center gap-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 7V12L15 14"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-bold">
                  {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
                  {String(timeLeft % 60).padStart(2, "0")}
                </span>
              </div>
              {/* )} */}
            </div>
          </div>

          {/* Glowing Robot Placeholder */}
          <div className="md:w-1/2 w-full flex justify-center relative z-10">
            <img
              src={Images.RoboShadow}
              alt="Robot Shadow"
              className="max-w-full w-56 md:w-72 h-auto"
            />
          </div>
        </div>
      </section>

      {/* 2. INTRO SECTION */}
      <section className="mx-auto px-6 py-12 md:p-20 relative md:max-w-[80vw] md:mt-40">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left: Image with dotted pattern */}
          <div className="md:w-1/4 relative">
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-[radial-gradient(#cbd5e1_2px,transparent_2px)] bg-size-[8px_8px]"></div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-[radial-gradient(#cbd5e1_2px,transparent_2px)] bg-size-[8px_8px]"></div>
            <img
              src={Images.child1}
              alt="Child interacting with hologram"
              className="rounded-3xl relative z-10 object-cover w-full shadow-lg"
            />
          </div>

          {/* Right: Text & Buttons */}
          <div className="md:w-3/4">
            <h2 className="text-3xl font-bold mb-4 text-gray-700">
              Should I Come Live at Your Home?
            </h2>
            <p className="text-gray-500 mb-8 leading-relaxed text-lg">
              I love to make every day an adventure! I can answer your
              questions, tell you stories, play fun games, and help you learn
              new things. Plus, I'm always here to listen. Do you think we could
              be best friends?
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full">
              <button
                onClick={() => {
                  trackEvent("button_clicked", {
                    buttonName: "yes_please",
                    page: "child_landing",
                  });
                  setShowCongrats(true);
                }}
                className="bg-linear-to-br from-[#5B5CA3] to-[#6D6FBF] text-white hover:bg-indigo-700 px-6 py-3 text-lg cursor-pointer rounded-full shadow-lg hover:scale-102 transition-all duration-300 w-full sm:w-auto text-center"
              >
                Yes, please
              </button>
              <button
                onClick={() => {
                  trackEvent("button_clicked", {
                    buttonName: "tell_parents",
                    page: "child_landing",
                  });
                  setShowWaitlist(true);
                }}
                className="bg-white border-2 border-[#5B5CA3] text-[#5B5CA3] hover:border-[#5B5CA3]/80 px-6 py-3 rounded-full text-lg cursor-pointer shadow-lg hover:scale-102 transition-all duration-300 w-full sm:w-auto text-center"
              >
                Tell my parents
              </button>
            </div>
          </div>
        </div>

        {/* Floating Gameplay Button */}
        {/* <div className="flex justify-end mt-8">
          <button className="bg-[#1e2336] text-white px-5 py-2.5 rounded-full flex items-center text-sm font-medium hover:bg-gray-800 transition-colors shadow-lg">
            <PlayCircle className="w-5 h-5 text-indigo-400 mr-2" />
            Gameplay <span className="text-gray-400 mx-2">|</span> Watch video
          </button>
        </div> */}

        {/* Floating CTA — bottom-right */}
        <div className="flex justify-center md:justify-end mt-10">
          <button
            onClick={() => {
              trackEvent("button_clicked", {
                buttonName: "win_by_naming_me",
                page: "student_landing",
              });
              scrollToBottom();
            }}
            className="flex items-center gap-3 bg-[#1e2336] px-5 py-3 rounded-full shadow-lg hover:bg-[#2a3050] hover:scale-105 transition-all duration-300 text-sm font-medium w-full md:w-auto justify-center max-w-sm"
          >
            <span className="rounded-full">
              <img src={ic_naming_robo} alt="Naming Robo" className="w-8 h-8" />
            </span>

            <span className="text-[#ABACF8]">Win by Naming Me!</span>
          </button>
        </div>
      </section>

      {/* 3. FEATURES GRID */}
      <section className="mx-auto px-6 py-12 md:p-20 md:max-w-[80vw]">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-700 mb-2">
            Explore What I Can Do
          </h2>
          <p className="text-gray-500 text-lg">
            Have a look around — there's a lot for us to explore together.
          </p>
        </div>

        <div className="flex flex-col gap-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } gap-10`}
            >
              {/* Text Card */}
              <div className="w-full md:w-5/12">
                <div
                  onClick={() => toggleFeature(index)}
                  className="bg-[#fafafa] rounded-3xl p-8 md:p-16 flex flex-col border border-gray-100 relative cursor-pointer hover:shadow-lg transition-all duration-300 h-full"
                >
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>

                  {/* Expandable Text */}
                  <div className="overflow-hidden transition-all duration-500 ease-out flex-1">
                    {expandedFeature === index ? (
                      <div className="animate-in fade-in duration-500">
                        <p className="text-gray-500 text-md leading-relaxed">
                          {feature.expandedText}
                        </p>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start">
                        <p className="text-gray-500 text-md">
                          {feature.shortText}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* See More Button */}
                  <p className="text-indigo-500 text-sm font-medium cursor-pointer hover:underline flex items-center gap-1 mt-6 transition-all duration-300">
                    {expandedFeature === index ? "Show less" : "See more"}{" "}
                    <ArrowRight
                      className={`w-3 h-3 transition-transform duration-300 ${
                        expandedFeature === index ? "-rotate-90" : ""
                      }`}
                    />
                  </p>

                  {/* Corner Image */}
                  {expandedFeature === index && (
                    <img
                      src={feature.image}
                      alt="Feature icon"
                      className="w-28 h-28 md:w-40 md:h-40 absolute bottom-0 right-0 opacity-40"
                    />
                  )}
                </div>
              </div>

              {/* Image */}
              <div className="w-full md:w-7/12">
                <img
                  src={
                    index === 0
                      ? Images.child2
                      : index === 1
                        ? Images.child3
                        : index === 2
                          ? Images.child4
                          : Images.child5
                  }
                  alt={feature.title}
                  className="w-full object-cover rounded-3xl"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. USE CASES SECTION */}
      <section className="mx-auto px-6 py-12 md:p-20 md:max-w-[80vw]">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-700 mb-2">
            What will you ask me first when I come home?
          </h2>
          <p className="text-gray-500 text-lg">
            Let me give you a hint to get started right now
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Card 1 */}
          <div
            onClick={() => {
              const newSelected = selectedUseCases.includes(0)
                ? selectedUseCases.filter((i) => i !== 0)
                : [...selectedUseCases, 0];
              setSelectedUseCases(newSelected);
              trackEvent("use_case_clicked", {
                useCase: "homework_help",
                isSelected: !selectedUseCases.includes(0),
                page: "child_landing",
              });
            }}
            className={`rounded-3xl p-16 text-center border cursor-pointer transition-all duration-300 ${
              selectedUseCases.includes(0)
                ? "bg-indigo-50 border-indigo-300 shadow-lg scale-105"
                : "bg-[#fafafa] border-gray-50 hover:shadow-md"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-indigo-100 w-10 h-10 rounded-lg flex items-center justify-center text-indigo-500">
                <BookOpen className="w-5 h-5" />
              </div>
              {selectedUseCases.includes(0) && (
                <div className="bg-indigo-500 rounded-full p-1">
                  <svg
                    className="w-4 h-4 text-white"
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
              )}
            </div>
            <h3 className="font-bold mb-2">Help me with homework</h3>
            <p className="text-xs text-gray-500">
              Let me clear your doubts and help you finish your tasks early.
            </p>
          </div>
          {/* Card 2 */}
          <div
            onClick={() => {
              const newSelected = selectedUseCases.includes(1)
                ? selectedUseCases.filter((i) => i !== 1)
                : [...selectedUseCases, 1];
              setSelectedUseCases(newSelected);
              trackEvent("use_case_clicked", {
                useCase: "solve_doubts",
                isSelected: !selectedUseCases.includes(1),
                page: "child_landing",
              });
            }}
            className={`rounded-3xl p-16 text-center border cursor-pointer transition-all duration-300 ${
              selectedUseCases.includes(1)
                ? "bg-orange-50 border-orange-300 shadow-lg scale-105"
                : "bg-[#fafafa] border-gray-50 hover:shadow-md"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-orange-100 w-10 h-10 rounded-lg flex items-center justify-center text-orange-500">
                <Lightbulb className="w-5 h-5" />
              </div>
              {selectedUseCases.includes(1) && (
                <div className="bg-orange-500 rounded-full p-1">
                  <svg
                    className="w-4 h-4 text-white"
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
              )}
            </div>
            <h3 className="font-bold mb-2">Solve my Doubts</h3>
            <p className="text-xs text-gray-500">
              Stuck on a problem? Let's solve it together step-by-step.
            </p>
          </div>
          {/* Card 3 */}
          <div
            onClick={() => {
              const newSelected = selectedUseCases.includes(2)
                ? selectedUseCases.filter((i) => i !== 2)
                : [...selectedUseCases, 2];
              setSelectedUseCases(newSelected);
              trackEvent("use_case_clicked", {
                useCase: "play_games",
                isSelected: !selectedUseCases.includes(2),
                page: "child_landing",
              });
            }}
            className={`rounded-3xl p-16 text-center border cursor-pointer transition-all duration-300 ${
              selectedUseCases.includes(2)
                ? "bg-pink-50 border-pink-300 shadow-lg scale-105"
                : "bg-[#fafafa] border-gray-50 hover:shadow-md"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-pink-100 w-10 h-10 rounded-lg flex items-center justify-center text-pink-500">
                <Gamepad2 className="w-5 h-5" />
              </div>
              {selectedUseCases.includes(2) && (
                <div className="bg-pink-500 rounded-full p-1">
                  <svg
                    className="w-4 h-4 text-white"
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
              )}
            </div>
            <h3 className="font-bold mb-2">Play something fun</h3>
            <p className="text-xs text-gray-500">
              I know puzzles, words games, and fun challenges just for you.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-3xl mx-auto">
          {/* Card 4 */}
          <div
            onClick={() => {
              const newSelected = selectedUseCases.includes(3)
                ? selectedUseCases.filter((i) => i !== 3)
                : [...selectedUseCases, 3];
              setSelectedUseCases(newSelected);
              trackEvent("use_case_clicked", {
                useCase: "talk_conversation",
                isSelected: !selectedUseCases.includes(3),
                page: "child_landing",
              });
            }}
            className={`rounded-3xl p-16 text-center border cursor-pointer transition-all duration-300 ${
              selectedUseCases.includes(3)
                ? "bg-blue-50 border-blue-300 shadow-lg scale-105"
                : "bg-[#fafafa] border-gray-50 hover:shadow-md"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center text-blue-500">
                <MessageSquare className="w-5 h-5" />
              </div>
              {selectedUseCases.includes(3) && (
                <div className="bg-blue-500 rounded-full p-1">
                  <svg
                    className="w-4 h-4 text-white"
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
              )}
            </div>
            <h3 className="font-bold mb-2">Just talk to me</h3>
            <p className="text-xs text-gray-500">
              Tell me about your day, your ideas, or anything on your mind.
            </p>
          </div>
          {/* Card 5 */}
          <div
            onClick={() => {
              const newSelected = selectedUseCases.includes(4)
                ? selectedUseCases.filter((i) => i !== 4)
                : [...selectedUseCases, 4];
              setSelectedUseCases(newSelected);
              trackEvent("use_case_clicked", {
                useCase: "competition_ready",
                isSelected: !selectedUseCases.includes(4),
                page: "child_landing",
              });
            }}
            className={`rounded-3xl p-16 text-center border cursor-pointer transition-all duration-300 ${
              selectedUseCases.includes(4)
                ? "bg-emerald-50 border-emerald-300 shadow-lg scale-105"
                : "bg-[#fafafa] border-gray-50 hover:shadow-md"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-emerald-100 w-10 h-10 rounded-lg flex items-center justify-center text-emerald-500">
                <Trophy className="w-5 h-5" />
              </div>
              {selectedUseCases.includes(4) && (
                <div className="bg-emerald-500 rounded-full p-1">
                  <svg
                    className="w-4 h-4 text-white"
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
              )}
            </div>
            <h3 className="font-bold mb-2">Get Competition Ready</h3>
            <p className="text-xs text-gray-500">
              Practice tests, mock quizzes to get ready for big matches.
            </p>
          </div>
        </div>
      </section>

      {/* 5. FOOTER / CTA */}
      <section className="mx-auto md:px-6 md:p-20 md:max-w-[80vw]">
        <div className="bg-[#ffffff] md:rounded-4xl p-10 flex flex-col lg:flex-row items-center justify-between relative overflow-hidden">
          <img
            src={Images.Bg}
            alt="Decorative Vector"
            className="absolute object-cover top-0 left-0 w-full h-full lg:h-100"
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
            <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full">
              <button
                onClick={() => {
                  setRobotName("Lumia");
                  trackEvent("robot_name_selected", {
                    robotName: "Lumia",
                    page: "child_landing",
                  });
                }}
                className="bg-[#26292C] border-2 border-[#5B5CA3] text-white hover:border-[#5B5CA3]/80 px-6 py-2 rounded-full text-lg cursor-pointer shadow-lg hover:scale-102 transition-all duration-300 w-full sm:w-auto text-center"
              >
                Lumia
              </button>
              <button
                onClick={() => {
                  setRobotName("Spark");
                  trackEvent("robot_name_selected", {
                    robotName: "Spark",
                    page: "child_landing",
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
                    page: "child_landing",
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
                    page: "child_landing",
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
            <div className="flex flex-col sm:flex-row w-full max-w-sm gap-3">
              <input
                type="text"
                placeholder="Write name for Robot..."
                className="flex-1 w-full rounded-full bg-white px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={robotName}
                onChange={(e) => setRobotName(e.target.value)}
              />
              <button
                onClick={handleRobotNameSubmit}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-full text-sm font-medium transition-colors w-full sm:w-auto mt-2 sm:mt-0"
              >
                Submit
              </button>
            </div>
          </div>

          <div className="md:w-1/3 flex justify-end mt-8 md:mt-0 relative z-10">
            <img
              src={Images.RoboShadow}
              alt="Robot Shadow"
              className="w-40 h-40 md:w-48 md:h-48 object-cover"
            />
          </div>
        </div>
      </section>
      <div ref={bottomRef} />

      {/* Success Message Popup */}
      {showSuccess && (
        <div className="fixed w-90 bottom-4 right-1/2 translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg animate-fade-in z-50">
          <p className="font-medium">
            Thanks for the suggestion! We love {robotName} too!
          </p>
        </div>
      )}

      {/* Congratulations Popup */}
      {showCongrats && (
        <div className="absolute top-80 right-1/2 translate-x-1/2 z-50 p-4">
          <div className="fixed inset-0 pointer-events-none z-50">
            <Confetti
              width={windowDimensions.width}
              height={windowDimensions.height}
              recycle={false} // Set to true if you want it to fall continuously
              numberOfPieces={400}
              gravity={0.15}
            />
          </div>
          <div className="bg-white rounded-2xl p-8 md:p-12 max-w-md w-full relative text-center shadow-xl animate-fade-in">
            <button
              onClick={() => setShowCongrats(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              Yay! I'd love to come home with you
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
              I'm getting ready to launch soon. Hang tight — I'll let you know
              as soon as I'm ready!
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
        <div className="absolute top-80 right-1/2 translate-x-1/2 z-50 p-4">
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
                    setWaitlistData({
                      ...waitlistData,
                      firstName: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  value={waitlistData.lastName}
                  onChange={(e) =>
                    setWaitlistData({
                      ...waitlistData,
                      lastName: e.target.value,
                    })
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
                if (
                  waitlistData.firstName &&
                  waitlistData.lastName &&
                  waitlistData.whatsappNumber
                ) {
                  trackEvent("student_waitlist_joined", {
                    firstName: waitlistData.firstName,
                    lastName: waitlistData.lastName,
                    number: waitlistData.whatsappNumber,
                    readyToTest: waitlistData.readyToTest,
                    page: "child_landing",
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
    </div>
  );
};

export default ChildLandingPage;
