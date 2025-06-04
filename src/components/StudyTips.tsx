
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Lightbulb, Clock, BookOpen } from "lucide-react";

export const StudyTips = () => {
  const tips = [
    {
      icon: BookOpen,
      title: "قبل الامتحان",
      items: [
        "راجع جميع المواد المتعلقة بخدمات بريد الجزائر",
        "تأكد من فهم الخدمات الرقمية وE-CCP",
        "تدرب على حل الأسئلة في الوقت المحدد",
        "احرص على النوم الكافي قبل الامتحان"
      ]
    },
    {
      icon: Clock,
      title: "أثناء الامتحان",
      items: [
        "اقرأ السؤال بعناية قبل الإجابة",
        "ابدأ بالأسئلة السهلة أولاً",
        "راجع إجاباتك قبل التسليم",
        "لا تقضِ وقتاً مفرطاً في سؤال واحد"
      ]
    },
    {
      icon: Target,
      title: "استراتيجيات النجاح",
      items: [
        "حلل الأسئلة السابقة واستخرج الأنماط",
        "ركز على المواضيع الأساسية",
        "تدرب على إدارة الوقت بفعالية",
        "استخدم تقنيات الاستبعاد للإجابات"
      ]
    },
    {
      icon: Lightbulb,
      title: "نصائح إضافية",
      items: [
        "اصنع جدولاً زمنياً للمراجعة",
        "استخدم البطاقات التعليمية للحفظ",
        "تواصل مع زملائك لتبادل المعرفة",
        "احتفظ بملاحظات مرتبة ومنظمة"
      ]
    }
  ];

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-blue-50">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-3 text-gray-800">
          <Target className="w-7 h-7 text-emerald-600" />
          دليل النجاح في الامتحان
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8">
          {tips.map((section, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-emerald-600" />
                </div>
                <h4 className="font-bold text-lg text-gray-800">{section.title}</h4>
              </div>
              <ul className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-3 text-gray-700">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
