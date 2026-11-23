import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-lg mx-auto bg-white/90 backdrop-blur-xl rounded-3xl border border-rose-200 shadow-xl text-center space-y-4 my-8">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
            <AlertCircle size={32} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800">Halaman Mengalami Kendala</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {this.state.error?.message || 'Terjadi kesalahan saat merender halaman ini.'}
            </p>
          </div>
          <Button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            variant="primary"
            icon={<RefreshCw size={15} />}
          >
            Muat Ulang Halaman
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
