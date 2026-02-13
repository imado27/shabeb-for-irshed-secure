
export const sendTelegramMessageSecure = async (data: any): Promise<{ success: boolean; error?: string }> => {
  try {
    const uid = data.uid || 'guest_' + Math.random().toString(36).substring(7);

    // توليد مفتاح تماثل فريد لهذه المحاولة لضمان عدم التكرار حتى لو انقطع الاتصال
    const idempotencyKey = crypto.randomUUID();

    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey
      },
      body: JSON.stringify({
        data,
        uid
      }),
    });

    const result = await response.json();
    
    // في حال النجاح (حتى لو كان مكرراً تقنياً)، نعتبره نجاحاً للمستخدم
    if (response.ok) {
      return { success: true };
    }

    // إدارة رسائل الخطأ بناءً على كود الحالة
    if (response.status === 429) {
      return { success: false, error: result.error };
    }

    return { success: false, error: result.error || 'فشل في إرسال البيانات' };
  } catch (error) {
    console.error("Submission Error:", error);
    return { success: false, error: 'تعذر الاتصال بالخادم، يرجى التحقق من الإنترنت.' };
  }
};
