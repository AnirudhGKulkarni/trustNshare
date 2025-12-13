import React from "react";

type State = { hasError: boolean; error?: Error | null };

export default class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // eslint-disable-next-line no-console
    console.error("Uncaught error in subtree:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 min-h-screen flex items-center justify-center bg-gray-900 text-white">
          <div className="max-w-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-sm mb-4">An unexpected error occurred while rendering this page.</p>
            <pre className="text-xs text-left bg-gray-800 p-3 rounded overflow-auto">{String(this.state.error)}</pre>
          </div>
        </div>
      );
    }
    return this.props.children as React.ReactElement;
  }
}
