import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "../ui/button";
import DashboardLayout from "../layout/DashboardLayout";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("خطأ في المكون:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-destructive">حدث خطأ غير متوقع</h1>
            <p className="text-muted-foreground">
              {this.state.error?.message || "يرجى إعادة تحميل الصفحة"}
            </p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              إعادة تحميل الصفحة
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
