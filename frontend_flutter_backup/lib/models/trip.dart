class Trip {
  const Trip({
    required this.id,
    required this.name,
    required this.image,
    required this.date,
    required this.status,
    required this.guide,
  });
  final String id, name, image, date, status, guide;
}

class Conversation {
  const Conversation({
    required this.id,
    required this.guide,
    required this.photo,
    required this.last,
    required this.time,
    this.unread = 0,
  });
  final String id, guide, photo, last, time;
  final int unread;
}

class ChatMessage {
  const ChatMessage({
    required this.id,
    required this.me,
    required this.time,
    this.text,
    this.image,
    this.read = true,
  });
  final String id, time;
  final bool me, read;
  final String? text, image;
  ChatMessage copyWith({bool? read}) => ChatMessage(
    id: id,
    me: me,
    time: time,
    text: text,
    image: image,
    read: read ?? this.read,
  );
}
