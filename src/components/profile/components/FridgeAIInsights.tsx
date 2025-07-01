'use client';

import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Bot, AlertTriangle } from 'lucide-react';

interface FridgeAIInsightsProps {
  handleGenerateAIInsights: () => void;
  isLoadingReport: boolean;
  aiReport: any;
}

export default function FridgeAIInsights({
  handleGenerateAIInsights,
  isLoadingReport,
  aiReport
}: FridgeAIInsightsProps) {
  return (
    <div className="text-center py-8">
      <Bot className="h-12 w-12 mx-auto text-blue-500 mb-4" />
      <h3 className="text-lg font-semibold mb-2">ИИ анализ холодильника</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Получите персональные рекомендации на основе содержимого вашего холодильника
      </p>
      <Button
        onClick={handleGenerateAIInsights}
        disabled={isLoadingReport}
        className="bg-blue-500 hover:bg-blue-600 text-white"
      >
        <Bot className="h-4 w-4 mr-2" />
        <span>{isLoadingReport ? 'Анализ...' : 'Начать анализ'}</span>
      </Button>
      
      {aiReport && (
        <Card className="mt-6 text-left">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-blue-500" />
              <span>Результаты анализа</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">{aiReport.summary}</p>
            
            <div>
              <h4 className="font-semibold mb-2">Рекомендации:</h4>
              <ul className="space-y-1">
                {aiReport.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {aiReport.alerts && aiReport.alerts.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Важные уведомления:</h4>
                {aiReport.alerts.map((alert: any, index: number) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded-md">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm text-orange-700 dark:text-orange-400">{alert.message}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
