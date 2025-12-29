'use client';

import { Lock, ArrowLeft, Home } from 'lucide-react';

export default function NotAuthorized() {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    window.location.href = '/hp';
  };



  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-lg w-full">
        {/* Floating Elements */}
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-red-200 rounded-full opacity-60"></div>
          <div className="absolute -top-2 -right-6 w-4 h-4 bg-orange-300 rounded-full opacity-40"></div>
          <div className="absolute -bottom-6 -left-2 w-6 h-6 bg-blue-200 rounded-full opacity-50"></div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 px-8 py-12 text-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 left-4 w-32 h-32 border border-red-300 rounded-full"></div>
              <div className="absolute bottom-4 right-4 w-24 h-24 border border-orange-300 rounded-full"></div>
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-lg mb-6">
                <Lock className="w-10 h-10 text-red-500" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Access Restricted
              </h1>
              
              <p className="text-gray-600 text-lg max-w-sm mx-auto">
                This content requires special permissions
              </p>
            </div>
          </div>

          {/* Body Section */}
          <div className="px-8 py-8">
            <div className="text-center mb-8">
              <p className="text-gray-500 leading-relaxed">
                You don't have the necessary permissions to view this page. 
                Please contact your administrator if you need access.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleGoBack}
                className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 group shadow-lg hover:shadow-xl"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                Go Back
              </button>
              
              <button
                onClick={handleGoHome}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 group border border-gray-200 hover:border-gray-300"
              >
                <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                Return Home
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom Info */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 text-gray-400 text-sm bg-white px-4 py-2 rounded-full shadow-sm">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            Error 403: Forbidden Access
          </div>
        </div>
      </div>
    </div>
  );
}