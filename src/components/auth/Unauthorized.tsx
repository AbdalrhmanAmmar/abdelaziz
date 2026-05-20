import { Link } from "react-router-dom";
import { ShieldAlert, Home, Lock, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Unauthorized = () => {
  const [particles, setParticles] = useState<Array<{ x: number; y: number; size: number }>>([]);

  useEffect(() => {
    // إنشاء جزيئات عشوائية للخلفية
    const newParticles = Array.from({ length: 20 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 30 + 10,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
      {/* خلفية متحركة */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full bg-primary/5"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: index * 0.1,
            }}
          />
        ))}

        {/* نماذج هندسية */}
        <div className="absolute top-1/4 left-10 w-64 h-64 border-2 border-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-80 h-80 border-2 border-destructive/10 rounded-full blur-3xl" />
      </div>

      {/* البطاقة الرئيسية */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="relative bg-card/80 backdrop-blur-xl border border-primary/20 rounded-2xl shadow-2xl p-8 md:p-12 text-center max-w-lg w-full z-10"
      >
        {/* تأثير الضوء */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-r from-primary/30 to-destructive/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-l from-primary/30 to-destructive/30 rounded-full blur-3xl" />

        {/* الرمز المتحرك */}
        <div className="relative mb-8">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="w-24 h-24 mx-auto mb-4"
          >
            <div className="relative w-full h-full">
              <ShieldAlert className="w-full h-full text-destructive" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <div className="w-full h-full border-2 border-destructive/30 border-dashed rounded-full" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                <Lock className="w-8 h-8 text-destructive/80" />
              </motion.div>
            </div>
          </motion.div>

          {/* إشعار متحرك */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="absolute -top-2 -right-2"
          >
            <div className="relative">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 bg-primary/20 rounded-full"
              />
            </div>
          </motion.div>
        </div>

        {/* العنوان */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-destructive to-primary bg-clip-text text-transparent"
        >
          وصول غير مصرح به!
        </motion.h1>

        {/* الرسالة التوضيحية */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-4 mb-8"
        >
          <p className="text-lg text-muted-foreground leading-relaxed">
            عذراً، يبدو أنك حاولت الوصول إلى منطقة محظورة. هذه الصفحة تحتاج إلى صلاحيات خاصة.
          </p>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground/80">
            <AlertCircle className="w-4 h-4" />
            <span>يرجى التواصل مع مدير النظام إذا كنت تعتقد أن هذا خطأ</span>
          </div>
        </motion.div>

        {/* الرموز التوضيحية */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex justify-center gap-6 mb-8"
        >
          {["403", "Access", "Denied"].map((text, index) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.2 }}
              className="px-4 py-2 bg-muted/50 rounded-lg border border-border"
            >
              <span className="font-mono text-sm">{text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* زر العودة */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
        >
          <Button
            asChild
            className="group relative overflow-hidden h-12 px-8 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Link to="/" className="flex items-center gap-3">
              <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <Home className="w-5 h-5" />
              </motion.div>
              <span className="font-semibold">العودة إلى لوحة التحكم</span>

              {/* تأثير الضوء عند التمرير */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </Link>
          </Button>
        </motion.div>

        {/* رسالة أسفل الزر */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-xs text-muted-foreground/60 mt-6 pt-4 border-t border-border/30"
        >
          خطأ 403 - محاولة وصول غير مصرح به
        </motion.p>
      </motion.div>

      {/* رسالة تظهر بعد بضع ثواني */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ delay: 3, duration: 3 }}
        className="fixed bottom-8"
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground/70">
          <Sparkles className="w-4 h-4" />
          <span>تأكد من تسجيل الدخول بحساب صحيح</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Unauthorized;
