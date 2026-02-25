import { useNavigate } from "react-router-dom";
import { Images } from "../assets/Images";
import { useAnalytics } from "../hooks/useAnalytics";

export default function Starting() {
  const navigate = useNavigate();
  const { trackEvent } = useAnalytics();

  const handleSelect = (role: "child" | "parent") => {
    trackEvent("mode_selected", { userRole: role });
    navigate(role === "child" ? "/child" : "/parent");
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-700 text-foreground mb-4 text-balance">
            Let's Get You to the Right Place
          </h1>
          <p className="text-lg text-gray-600">Tell us who you're here for.</p>
        </div>

        {/* Role Selection Cards */}
        <div className="max-w-2xl grid md:grid-cols-2 gap-6 justify-items-center mx-auto">
          {/* Child Card */}
          <button
            onClick={() => handleSelect("child")}
            className="group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg"
          >
            <div className="flex flex-col items-center text-center">
              {/* Image placeholder - using the provided illustration */}
              <div className="mb-6 w-full h-40 bg-purple-200 rounded-xl flex items-center justify-center">
                <img
                  src={Images.Child}
                  alt="Student illustration"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-700">
                I'm a Student
              </h3>
            </div>
          </button>

          {/* Parent Card */}
          <button
            onClick={() => handleSelect("parent")}
            className="group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg"
          >
            <div className="flex flex-col items-center text-center">
              {/* Image placeholder - using the provided illustration */}
              <div className="mb-6 w-full h-40 bg-purple-200 rounded-xl flex items-center justify-center">
                <img
                  src={Images.Parent}
                  alt="Parent illustration"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-700">I'm a Parent</h3>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
