import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Play, 
  Trophy, 
  Clock, 
  ArrowRight,
  Sparkles
} from "lucide-react";

export function LearningSystemCard() {
  return (
    <Card className="relative overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
            <Sparkles className="h-5 w-5" />
            <span>Sistema de Aprendizado</span>
          </CardTitle>
          <Badge className="bg-blue-600 text-white">
            Novo!
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Experimente nossa nova plataforma de aprendizado com IA, progresso visual e exercícios práticos.
        </p>
        
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
            <BookOpen className="h-3 w-3" />
            <span>Trilhas</span>
          </div>
          <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
            <Trophy className="h-3 w-3" />
            <span>XP & Conquistas</span>
          </div>
          <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
            <Clock className="h-3 w-3" />
            <span>Progresso</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Link to="/estudar" className="flex-1">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Play className="h-4 w-4 mr-2" />
              Começar a Estudar
            </Button>
          </Link>
          
          <Link to="/learning-demo">
            <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/30 p-2 rounded-md">
          💡 <strong>Dica:</strong> Use o sistema de IA para obter explicações personalizadas e dicas durante o estudo.
        </div>
      </CardContent>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full -translate-y-10 translate-x-10" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-purple-400/20 to-blue-400/20 rounded-full translate-y-8 -translate-x-8" />
    </Card>
  );
}