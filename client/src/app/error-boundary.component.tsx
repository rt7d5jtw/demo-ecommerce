import * as React from 'react';
import toast from '../assets/toast.png';

type Props = {
  children: React.ReactNode;
};

type State = {
  hasErrored: boolean;
};

class ErrorBoundary extends React.Component<Props, State> {
  public state = {
    hasErrored: false,
  };

  static getDerivedStateFromError(): State {
    return { hasErrored: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error(error, info);
  }

  render(): React.ReactNode {
    if (this.state.hasErrored) {
      return (
        <div
          style={{
            display: 'grid',
            background: '#38242c',
            height: '100vh',
            placeItems: 'center',
          }}
        >
          <img src={toast} />
          <p style={{ fontSize: '2rem', color: 'beige' }}>
            Something went wrong!
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
