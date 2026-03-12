import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  BookOpen, 
  Play, 
  ArrowRight,
  Sparkles,
  Trophy,
  Clock
} from "lucide-react";

export function LearningQuickAccess() {
  return (
    <Card className="fixed bottom-6 right-6 z-50 w-80 shadow-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/90 dark:to-purple-950/90 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-800 dark:text-blue-200">
              Novo Sistema de Aprendizado
            </h3>
          </div>
          
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Experimente nossa plataforma renovada com IA, progresso visual e exercícios interativos!
          </p>
          
          <div className="flex items-center space-x-4 text-xs text-blue-600 dark:text-blue-400">
            <div className="flex items-center space-x-1">
              <Trophy className="h-3 w-3" />
              <span>XP</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>Progresso</span>
            </div>
            <div className="flex items-center space-x-1">
              <BookOpen className="h-3 w-3" />
              <span>IA</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Link to="/estudar" className="flex-1">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm">
                <Play className="h-4 w-4 mr-2" />
                Começar Agora
              </Button>
            </Link>
            
            <Link to="/learning-demo">
              <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}