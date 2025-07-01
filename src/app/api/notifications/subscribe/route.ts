import { NextRequest, NextResponse } from 'next/server';

// Временное хранение подписок (в продакшне используйте базу данных)
const subscriptions = new Set<any>();

export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json();
    
    // Сохраняем подписку
    subscriptions.add(subscription);
    
    console.log('New push subscription:', subscription.endpoint);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Подписка на уведомления создана' 
    });
  } catch (error) {
    console.error('Error saving subscription:', error);
    return NextResponse.json(
      { error: 'Ошибка создания подписки' },
      { status: 500 }
    );
  }
}

// Получить все подписки (для администрирования)
export async function GET() {
  return NextResponse.json({
    count: subscriptions.size,
    subscriptions: Array.from(subscriptions).map(sub => ({
      endpoint: sub.endpoint.substring(0, 50) + '...',
      keys: sub.keys ? Object.keys(sub.keys) : []
    }))
  });
}
