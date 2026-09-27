const messages = {
  en: {
    BOOKING_TIME_UNAVAILABLE: 'Selected time is no longer available. Please choose another time.',
    SELF_BOOKING_NOT_ALLOWED: 'You cannot book your own listing or guide profile.',
    SESSION_EXPIRED: 'Session expired, please sign in again.',
    BOOKING_TRANSITION_INVALID: 'This booking has changed. Refresh it before trying again.',
    NETWORK_UNAVAILABLE: 'Unable to connect. Check your connection and try again.',
    UNKNOWN_ERROR: 'Something went wrong. Please try again.',
  },
  mn: {
    BOOKING_TIME_UNAVAILABLE: 'Сонгосон цаг захиалагдсан байна. Өөр цаг сонгоно уу.',
    SELF_BOOKING_NOT_ALLOWED: 'Өөрийн зар эсвэл хөтчийн профайлд захиалга хийх боломжгүй.',
    SESSION_EXPIRED: 'Нэвтрэх хугацаа дууссан. Дахин нэвтэрнэ үү.',
    BOOKING_TRANSITION_INVALID: 'Захиалгын төлөв өөрчлөгдсөн. Шинэчлээд дахин оролдоно уу.',
    NETWORK_UNAVAILABLE: 'Холбогдож чадсангүй. Интернэт холболтоо шалгаад дахин оролдоно уу.',
    UNKNOWN_ERROR: 'Алдаа гарлаа. Дахин оролдоно уу.',
  },
  ru: {
    BOOKING_TIME_UNAVAILABLE: 'Выбранное время больше недоступно. Выберите другое время.',
    SELF_BOOKING_NOT_ALLOWED: 'Нельзя забронировать собственное объявление или профиль гида.',
    SESSION_EXPIRED: 'Сеанс истёк. Войдите снова.',
    BOOKING_TRANSITION_INVALID: 'Бронирование изменилось. Обновите данные и повторите попытку.',
    NETWORK_UNAVAILABLE: 'Нет соединения. Проверьте подключение и повторите попытку.',
    UNKNOWN_ERROR: 'Произошла ошибка. Повторите попытку.',
  },
  zh: {
    BOOKING_TIME_UNAVAILABLE: '所选时间已不可用，请选择其他时间。',
    SELF_BOOKING_NOT_ALLOWED: '不能预订自己的房源或向导服务。',
    SESSION_EXPIRED: '登录已过期，请重新登录。',
    BOOKING_TRANSITION_INVALID: '预订状态已更改，请刷新后重试。',
    NETWORK_UNAVAILABLE: '无法连接，请检查网络后重试。',
    UNKNOWN_ERROR: '出现错误，请重试。',
  },
  ko: {
    BOOKING_TIME_UNAVAILABLE: '선택한 시간은 더 이상 예약할 수 없습니다. 다른 시간을 선택하세요.',
    SELF_BOOKING_NOT_ALLOWED: '본인의 숙소나 가이드 프로필은 예약할 수 없습니다.',
    SESSION_EXPIRED: '세션이 만료되었습니다. 다시 로그인하세요.',
    BOOKING_TRANSITION_INVALID: '예약 상태가 변경되었습니다. 새로고침 후 다시 시도하세요.',
    NETWORK_UNAVAILABLE: '연결할 수 없습니다. 인터넷 연결을 확인하고 다시 시도하세요.',
    UNKNOWN_ERROR: '오류가 발생했습니다. 다시 시도하세요.',
  },
  ja: {
    BOOKING_TIME_UNAVAILABLE: '選択した時間は予約できなくなりました。別の時間を選択してください。',
    SELF_BOOKING_NOT_ALLOWED: '自分の宿泊施設やガイドサービスは予約できません。',
    SESSION_EXPIRED: 'セッションの有効期限が切れました。再度ログインしてください。',
    BOOKING_TRANSITION_INVALID: '予約状況が変更されました。更新してから再試行してください。',
    NETWORK_UNAVAILABLE: '接続できません。通信環境を確認して再試行してください。',
    UNKNOWN_ERROR: 'エラーが発生しました。再試行してください。',
  },
};

export function domainErrorMessage(code, language = 'en') {
  return messages[language]?.[code] || messages.en[code] || null;
}
