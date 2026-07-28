import 'package:json_annotation/json_annotation.dart';

@JsonSerializable(createFactory: false, createToJson: false)
class Listing {
  const Listing({
    required this.id,
    required this.title,
    required this.location,
    required this.images,
    required this.rating,
    required this.reviews,
    required this.price,
    required this.priceUnit,
    required this.dates,
    required this.tags,
    required this.category,
    required this.description,
    required this.amenities,
    required this.hostName,
    required this.hostPhoto,
    this.superhost = false,
  });

  final String id;
  final String title;
  final String location;
  final List<String> images;
  final double rating;
  final int reviews;
  final double price;
  final String priceUnit;
  final String dates;
  final List<String> tags;
  final String category;
  final String description;
  final List<String> amenities;
  final String hostName;
  final String hostPhoto;
  final bool superhost;

  factory Listing.fromJson(Map<String, dynamic> json) {
    final images = json['images'] as List? ?? const [];
    final host = json['host'] as Map<String, dynamic>? ?? const {};
    return Listing(
      id: json['id'].toString(),
      title: json['title'].toString(),
      location: json['location'].toString(),
      images: images
          .map((item) => item is Map ? item['url'].toString() : item.toString())
          .toList(),
      rating: double.tryParse(json['rating'].toString()) ?? 0,
      reviews:
          int.tryParse(
            (json['reviewCount'] ?? json['reviews'] ?? 0).toString(),
          ) ??
          0,
      price: double.tryParse(json['price'].toString()) ?? 0,
      priceUnit: (json['priceUnit'] ?? 'night').toString(),
      dates: (json['datesLabel'] ?? json['dates'] ?? '').toString(),
      tags: (json['tags'] as List? ?? const [])
          .map((item) => item.toString())
          .toList(),
      category: json['category'].toString().toLowerCase(),
      description: json['description'].toString(),
      amenities: (json['amenities'] as List? ?? const [])
          .map((item) => item.toString())
          .toList(),
      hostName: (host['name'] ?? json['hostName'] ?? 'Local host').toString(),
      hostPhoto: (host['avatarUrl'] ?? json['hostPhoto'] ?? '').toString(),
      superhost: (host['isVerified'] ?? json['superhost'] ?? false) == true,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'location': location,
    'images': images.map((url) => {'url': url}).toList(),
    'rating': rating,
    'reviewCount': reviews,
    'price': price,
    'priceUnit': priceUnit,
    'datesLabel': dates,
    'tags': tags,
    'category': category.toUpperCase(),
    'description': description,
    'amenities': amenities,
    'host': {'name': hostName, 'avatarUrl': hostPhoto, 'isVerified': superhost},
  };
}
