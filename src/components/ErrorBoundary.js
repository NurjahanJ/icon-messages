import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console with more details
    console.error("React Error Boundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
    
    // Log additional environment information
    console.log("Environment variables available:", {
      REACT_APP_CONVEX_URL: process.env.REACT_APP_CONVEX_URL ? "✅ Set" : "❌ Missing",
      NODE_ENV: process.env.NODE_ENV
    });
  }

  render() {
    if (this.state.hasError) {
      // Enhanced error UI with more details
      return (
        <div className="error-boundary p-4 m-4 border border-red-500 rounded bg-red-50">
          <h2 className="text-xl font-bold text-red-700 mb-2">React Error Detected</h2>
          
          <div className="mb-4">
            <h3 className="font-bold text-red-600">Possible Causes:</h3>
            <ul className="list-disc pl-5 text-red-800">
              <li>Missing environment variables (check .env file)</li>
              <li>Convex connection issues</li>
              <li>Component rendering error</li>
            </ul>
          </div>
          
          <details className="whitespace-pre-wrap mb-4" open>
            <summary className="text-red-600 cursor-pointer mb-2 font-bold">Error Message</summary>
            <p className="text-red-800 mb-2 p-2 bg-red-50 border border-red-200 rounded">
              {this.state.error ? this.state.error.toString() : "Unknown error"}
            </p>
          </details>
          
          <details className="whitespace-pre-wrap">
            <summary className="text-red-600 cursor-pointer mb-2 font-bold">Component Stack Trace</summary>
            <div className="bg-gray-100 p-2 rounded text-sm overflow-auto max-h-96">
              <pre>{this.state.errorInfo ? this.state.errorInfo.componentStack : "No stack trace available"}</pre>
            </div>
          </details>
          
          <div className="mt-6 flex space-x-4">
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
            <button 
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              onClick={() => console.log("Environment check:", {
                REACT_APP_CONVEX_URL: process.env.REACT_APP_CONVEX_URL,
                NODE_ENV: process.env.NODE_ENV
              })}
            >
              Log Env Info
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
