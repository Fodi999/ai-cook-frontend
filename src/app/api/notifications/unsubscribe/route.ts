import { NextRequest, NextResponse } from 'next/server';

// Импортируем подписки (в продакшне это будет из базы данных)
const subscriptions = new Set<any>();

export async function POST(request: NextRequest) {
  try {
    const { endpoint } = await request.json();
    
    // Найдем и удалим подписку
    for (const subscription of subscriptions) {
      if (subscription.endpoint === endpoint) {
        subscriptions.delete(subscription);
        break;
      }
    }
    
    console.log('Removed push subscription:', endpoint);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Подписка отменена' 
    });
  } catch (error) {
    console.error('Error removing subscription:', error);
    return NextResponse.json(
      { error: 'Ошибка отмены подписки' },
      { status: 500 }
    );
  }
}
