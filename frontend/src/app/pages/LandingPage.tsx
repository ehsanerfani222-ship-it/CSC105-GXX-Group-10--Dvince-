import { useNavigate } from "react-router";
import PageLayout from "../components/PageLayout";
import greetingImage from "../../assets/greeting.png";
import AnimatedAvatar from "../components/AnimatedAvatar";

const featuredPeople = [
  { name: "Maya Chen", skill: "Makeup" },
  { name: "Omar Rahman", skill: "React" },
  { name: "Lina Morales", skill: "Guitar" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <PageLayout mainClassName="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
      <div className="max-w-5xl mx-auto">
        <section className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] items-center p-6 md:p-8 lg:p-12">
            <div className="text-center lg:text-left">
              <div className="flex justify-center lg:justify-start -space-x-4 mb-6">
                {featuredPeople.map((person, index) => (
                  <div
                    key={person.name}
                    className={`avatar-float ${
                      index === 1
                        ? "avatar-float-delay-1"
                        : index === 2
                        ? "avatar-float-delay-2"
                        : ""
                    }`}
                  >
                    <AnimatedAvatar name={person.name} size="lg" />
                  </div>
                ))}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Connect, Learn, Share Skills
              </h1>

              <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl">
                Discover people with practical skills, start useful conversations,
                and learn through posts, messages, and real collaboration.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button
                  onClick={() => navigate("/login", { state: { tab: "signin" } })}
                  className="bg-white text-cyan-600 border-2 border-cyan-500 px-8 py-3 rounded-lg hover:bg-cyan-50 transition-colors text-lg font-semibold min-w-[200px]"
                >
                  Login
                </button>

                <button
                  onClick={() => navigate("/login", { state: { tab: "register" } })}
                  className="bg-cyan-500 text-white px-8 py-3 rounded-lg hover:bg-cyan-600 transition-colors text-lg font-semibold min-w-[200px]"
                >
                  Create an Account
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-8 text-left">
                {featuredPeople.map((person) => (
                  <div key={person.skill} className="rounded-lg bg-gray-50 p-3">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {person.name}
                    </p>
                    <p className="text-xs text-cyan-600">{person.skill}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <img
                src={greetingImage}
                alt="Three friends making peace signs"
                className="w-full rounded-xl"
              />
              <div className="absolute -bottom-5 left-6 right-6 bg-white/95 backdrop-blur rounded-xl shadow-lg p-4 flex items-center gap-3">
                <AnimatedAvatar name="Dvince Community" size="md" />
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900">Live skill circle</p>
                  <p className="text-sm text-gray-500 truncate">
                    Posts, chats, media, and shared practice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
