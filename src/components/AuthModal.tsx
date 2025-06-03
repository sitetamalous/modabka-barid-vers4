
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onSuccess: () => void;
  onSwitchMode: (mode: 'login' | 'register') => void;
}

const AuthModal = ({ isOpen, onClose, mode, onSuccess, onSwitchMode }: AuthModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/`
          }
        });

        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              title: "خطأ في التسجيل",
              description: "هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول بدلاً من ذلك.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "خطأ في التسجيل",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "تم إنشاء الحساب بنجاح",
            description: "يرجى تفقد بريدك الإلكتروني لتأكيد الحساب",
          });
          onSuccess();
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: "خطأ في تسجيل الدخول",
              description: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
              variant: "destructive",
            });
          } else {
            toast({
              title: "خطأ في تسجيل الدخول",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "تم تسجيل الدخول بنجاح",
            description: "مرحباً بك في منصة امتحانات بريد الجزائر",
          });
          onSuccess();
        }
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFullName("");
    setShowPassword(false);
  };

  const handleModeSwitch = (newMode: 'login' | 'register') => {
    resetForm();
    onSwitchMode(newMode);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-2">
            {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
          </DialogTitle>
          <p className="text-gray-600 text-center">
            {mode === 'login' 
              ? 'أدخل بياناتك للوصول إلى حسابك' 
              : 'أنشئ حساباً جديداً لبدء رحلة التحضير'
            }
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-right">الاسم الكامل</Label>
              <div className="relative">
                <User className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="أدخل اسمك الكامل"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pr-10 text-right"
                  required={mode === 'register'}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-right">البريد الإلكتروني</Label>
            <div className="relative">
              <Mail className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pr-10 text-right"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-right">كلمة المرور</Label>
            <div className="relative">
              <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10 pl-10 text-right"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 py-6 text-lg"
            disabled={isLoading}
          >
            {isLoading ? 'جاري المعالجة...' : mode === 'login' ? 'تسجيل الدخول' : 'إنشاء الحساب'}
          </Button>

          <div className="text-center">
            <p className="text-gray-600">
              {mode === 'login' ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
              <button
                type="button"
                onClick={() => handleModeSwitch(mode === 'login' ? 'register' : 'login')}
                className="text-emerald-600 hover:text-emerald-700 font-medium mr-2"
              >
                {mode === 'login' ? 'أنشئ حساباً جديداً' : 'سجل دخولك'}
              </button>
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
