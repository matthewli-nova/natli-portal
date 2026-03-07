import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  label?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error(`[ErrorBoundary:${this.props.label ?? 'unknown'}]`, error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-red-200 bg-red-50/50">
          <span className="text-2xl mb-2">⚠️</span>
          <p className="text-sm font-semibold text-red-700">
            {this.props.label ? `${this.props.label} crashed` : 'Something went wrong'}
          </p>
          <p className="text-xs text-red-500 mt-1 font-mono max-w-sm break-all">
            {this.state.error?.message ?? 'Unknown error'}
          </p>
          <button
            className="mt-3 text-xs text-red-600 underline"
            onClick={() => this.setState({ hasError: false, error: undefined })}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
