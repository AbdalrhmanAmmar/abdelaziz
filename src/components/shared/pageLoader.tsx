import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface PageLoaderProps {
  message?: string;
  progress?: number; // لإظهار شريط التقدم إذا كان متاحًا
  showPercentage?: boolean;
  variant?: "spinner" | "dots" | "bars" | "pulse";
  size?: "sm" | "md" | "lg" | "xl";
  fullScreen?: boolean;
  logo?: React.ReactNode; // لإضافة شعار مخصص
  onLoadingComplete?: () => void; // callback عند اكتمال التحميل
}

const PageLoader = ({
  message = "جاري تحميل البيانات...",
  progress,
  showPercentage = false,
  variant = "spinner",
  size = "lg",
  fullScreen = true,
  logo,
  onLoadingComplete,
}: PageLoaderProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        setIsVisible(false);
        onLoadingComplete?.();
      }, 500);
    }
  }, [progress, onLoadingComplete]);

  if (!isVisible) return null;

  const sizeClasses = {
    sm: { container: "w-12 h-12", inner: "w-6 h-6", text: "text-sm" },
    md: { container: "w-16 h-16", inner: "w-8 h-8", text: "text-base" },
    lg: { container: "w-20 h-20", inner: "w-10 h-10", text: "text-lg" },
    xl: { container: "w-24 h-24", inner: "w-12 h-12", text: "text-xl" },
  };

  const renderLoader = () => {
    const { container, inner } = sizeClasses[size];

    switch (variant) {
      case "dots":
        return (
          <div className="flex items-center justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className={`w-3 h-3 bg-primary rounded-full`}
              />
            ))}
          </div>
        );

      case "bars":
        return (
          <div className="flex items-end justify-center space-x-1 h-12">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                animate={{ height: ["20%", "100%", "20%"] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
                className="w-2 bg-primary rounded-t"
              />
            ))}
          </div>
        );

      case "pulse":
        return (
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={`${container} bg-primary/20 rounded-full blur-md`}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              {logo || (
                <motion.div
                  animate={{ scale: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`${inner} bg-primary rounded-full`}
                />
              )}
            </div>
          </div>
        );

      default: // spinner
        return (
          <div className="relative">
            {/* Spinner rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className={`${container} border-4 border-primary/20 rounded-full`}
            >
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-t-4 border-primary rounded-full"
              />
            </motion.div>

            {/* Center content */}
            <div className="absolute inset-0 flex items-center justify-center">
              {logo ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {logo}
                </motion.div>
              ) : (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className={`${inner} bg-primary/30 rounded-full blur-sm`}
                />
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        ${fullScreen ? "fixed inset-0 h-screen w-full" : "w-full h-full"}
        flex flex-col items-center justify-center
        bg-gradient-to-br from-background via-background to-background/95
        backdrop-blur-sm z-50
      `}
    >
      <div className="flex flex-col items-center justify-center space-y-6 px-4">
        {/* Loader */}
        {renderLoader()}

        {/* Progress bar (if progress is provided) */}
        {progress !== undefined && (
          <div className="w-64 max-w-full">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full bg-primary rounded-full"
              />
            </div>
            {showPercentage && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2"
              >
                {progress}%
              </motion.p>
            )}
          </div>
        )}

        {/* Message with typing effect */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="flex items-center gap-2">
            <span
              className={`${sizeClasses[size].text} font-semibold text-gray-700 dark:text-gray-300`}
            >
              {message}
            </span>
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-primary"
            >
              ...
            </motion.div>
          </div>

          {/* Optional subtitle */}
          {progress !== undefined && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {progress < 30 && "جاري تهيئة البيانات..."}
              {progress >= 30 && progress < 70 && "جاري معالجة المحتوى..."}
              {progress >= 70 && progress < 100 && "جاري التحميل النهائي..."}
            </p>
          )}
        </motion.div>

        {/* Keyboard shortcut hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1 }}
          className="text-xs text-gray-400 dark:text-gray-500 mt-8"
        >
          اضغط على Esc للإلغاء
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PageLoader;
