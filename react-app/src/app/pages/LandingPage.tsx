import { useNavigate } from 'react-router';
import Header from '../components/Header';
import heroImage from "../../assets/576e83bec5288cb17f87584f9092d482364c2e7f.png";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 lg:p-12 mb-8">
            <div className="flex flex-col items-center text-center">
              <img 
                src={heroImage} 
                alt="Three friends making peace signs" 
                className="w-full max-w-md md:max-w-lg lg:max-w-xl rounded-xl mb-6"
              />
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Connect • Learn • Share Skills
              </h1>
              
              <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl">
                Join our community of learners and experts. Discover new skills, share your knowledge, 
                and connect with people who inspire you to grow.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button
                  onClick={() => navigate('/login')}
                  className="bg-white text-cyan-500 border-2 border-cyan-500 px-8 py-3 rounded-lg hover:bg-cyan-50 transition-colors text-lg font-semibold min-w-[200px]"
                >
                  Login
                </button>
                
                <button
                  onClick={() => navigate('/login')}
                  className="bg-cyan-500 text-white px-8 py-3 rounded-lg hover:bg-cyan-600 transition-colors text-lg font-semibold min-w-[200px]"
                >
                  Create an Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
