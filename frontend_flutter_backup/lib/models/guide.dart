import 'package:json_annotation/json_annotation.dart';

@JsonSerializable(createFactory: false, createToJson: false)
class GuidePackage {
  const GuidePackage(this.id, this.title, this.days, this.price);
  final String id, title;
  final int days;
  final double price;
}

@JsonSerializable(createFactory: false, createToJson: false)
class Guide {
  const Guide({
    required this.id,
    required this.name,
    required this.photo,
    required this.rating,
    required this.reviews,
    required this.languages,
    required this.specialties,
    required this.price,
    required this.experience,
    required this.availableToday,
    required this.bio,
    required this.location,
    required this.packages,
    this.verified = true,
  });
  final String id, name, photo, bio, location;
  final double rating, price;
  final int reviews, experience;
  final bool availableToday, verified;
  final List<String> languages, specialties;
  final List<GuidePackage> packages;
}
