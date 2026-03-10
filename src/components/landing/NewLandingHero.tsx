import { useState } from "react";
import { ArrowRight, Sparkles, Zap, Brain } from "lucide-react";
import { useCustomI18n as useI18n } from "@/i18n";

export function NewLandingHero() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'exam' | 'certification' | 'vestibular'>('exam');

  const scrollToAuth = () => {
    const el = document.getElementById("auth-section");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const useCases = {
    exam: {
      title: t("newHero.exam"),
      subjects: [
        { name: t("newHero.exam.subject1"), progress: 87 },
        { name: t("newHero.exam.subject2"), progress: 72 },
        { name: t("newHero.exam.subject3"), progress: 94 }
      ],
      recommendation: t("newHero.exam.recommendation")
    },
    certification: {
      title: t("newHero.certification"),
      subjects: [
        { name: t("newHero.certification.subject1"), progress: 78 },
        { name: t("newHero.certification.subject2"), progress: 85 },
        { name: t("newHero.certification.subject3"), progress: 91 }
      ],
      recommendation: t("newHero.certification.recommendation")
    },
    vestibular: {
      title: t("newHero.vestibular"),
      subjects: [
        { name: t("newHero.vestibular.subject1"), progress: 85 },
        { name: t("newHero.vestibular.subject2"), progress: 92 },
        { name: t("newHero.vestibular.subject3"), progress: 88 }
      ],
      recommendation: t("newHero.vestibular.recommendation")
    }
  };

  return (
    <section className="relative bg-white pt-20 pb-32 overflow-hidden min-h-[90vh] flex items-center">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 -right-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -left-48 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="mb-10 inline-flex items-center gap-3 px-5 py-3 bg-blue-50 border border-blue-100 rounded-full">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">
                {t("newHero.poweredByAI")}
              </span>
            </div>

            {/* Headline - MASSIVE */}
            <h1 className="text-[4rem] md:text-[5.5rem] lg:text-[6.5rem] font-bold text-gray-900 leading-[0.95] tracking-tight mb-8">
              {t("newHero.headline1")}
              <br />
              <span className="text-blue-600">{t("newHero.headline2")}</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-8 max-w-xl">
              {t("newHero.subheadline")}
            </p>

            {/* Use Case Tabs */}
            <div className="mb-12">
              <p className="text-sm font-medium text-gray-500 mb-4">{t("newHero.studyingFor")}</p>
              
              {/* Tabs */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <button
                  onClick={() => setActiveTab('exam')}
                  className={`px-6 py-4 rounded-xl font-medium transition-all ${
                    activeTab === 'exam'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {useCases.exam.title}
                </button>
                <button
                  onClick={() => setActiveTab('certification')}
                  className={`px-6 py-4 rounded-xl font-medium transition-all ${
                    activeTab === 'certification'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {useCases.certification.title}
                </button>
                <button
                  onClick={() => setActiveTab('vestibular')}
                  className={`px-6 py-4 rounded-xl font-medium transition-all ${
                    activeTab === 'vestibular'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {useCases.vestibular.title}
                </button>
              </div>

            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 items-start mb-16">
              <button
                onClick={scrollToAuth}
                className="group inline-flex items-center gap-3 px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                {t("newHero.ctaButton")}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex flex-col justify-center px-2">
                <span className="text-sm text-gray-500">{t("newHero.freeForever")}</span>
                <span className="text-sm text-gray-500">{t("newHero.setup60s")}</span>
              </div>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-6 pt-8 border-t border-gray-200">
              <div>
                <div className="text-3xl font-bold text-gray-900">10k+</div>
                <div className="text-sm text-gray-600">{t("newHero.activeStudents")}</div>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div>
                <div className="text-3xl font-bold text-gray-900">95%</div>
                <div className="text-sm text-gray-600">{t("newHero.completionRate")}</div>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div>
                <div className="text-3xl font-bold text-gray-900">4.9/5</div>
                <div className="text-sm text-gray-600">{t("newHero.avgRating")}</div>
              </div>
            </div>
          </div>

          {/* Right: Visual Demo */}
          <div className="relative lg:block hidden">
            {/* Main card - AI in action */}
            <div className="relative">
              {/* Floating elements */}
              <div className="absolute -top-8 -left-8 w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center animate-bounce" style={{ animationDuration: '3s' }}>
                <Brain className="w-10 h-10 text-blue-600" />
              </div>
              
              <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.5s' }}>
                <Zap className="w-10 h-10 text-white" />
              </div>

              {/* Main visual */}
              <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 shadow-2xl">
                {/* Simulated AI interface */}
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-sm font-semibold text-gray-700">{t("newHero.aiAnalyzing")}</span>
                    </div>
                    <div className="text-xs text-gray-500">{t("newHero.realTime")}</div>
                  </div>

                  {/* Progress bars - Dynamic based on selected tab */}
                  <div className="space-y-4">
                    {useCases[activeTab].subjects.map((subject, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">{subject.name}</span>
                          <span className="text-sm font-bold text-blue-600">{subject.progress}%</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500" 
                            style={{ width: `${subject.progress}%` }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* AI Recommendation - Dynamic based on selected tab */}
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mt-6">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900 mb-1">{t("newHero.aiRecommendation")}</div>
                        <div className="text-sm text-gray-600">{useCases[activeTab].recommendation}</div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">12</div>
                      <div className="text-xs text-gray-600">{t("newHero.daysStreak")}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">3.2h</div>
                      <div className="text-xs text-gray-600">{t("newHero.today")}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">89%</div>
                      <div className="text-xs text-gray-600">{t("newHero.accuracy")}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
