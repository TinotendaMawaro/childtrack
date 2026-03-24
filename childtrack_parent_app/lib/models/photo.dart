class Photo {
  final String id;
  final String? albumId;
  final String parentId;
  final String childId;
  final String filename;
  final String originalUrl;
  final String? thumbnailUrl;
  final String? description;
  final DateTime uploadedAt;
  final Album? album;

  Photo({
    required this.id,
    this.albumId,
    required this.parentId,
    required this.childId,
    required this.filename,
    required this.originalUrl,
    this.thumbnailUrl,
    this.description,
    required this.uploadedAt,
    this.album,
  });

  factory Photo.fromJson(Map<String, dynamic> json) {
    return Photo(
      id: json['id'],
      albumId: json['album_id'],
      parentId: json['parent_id'],
      childId: json['child_id'],
      filename: json['filename'],
      originalUrl: json['original_url'],
      thumbnailUrl: json['thumbnail_url'],
      description: json['description'],
      uploadedAt: DateTime.parse(json['uploaded_at']),
      album: json['album'] != null ? Album.fromJson(json['album']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'album_id': albumId,
      'parent_id': parentId,
      'child_id': childId,
      'filename': filename,
      'original_url': originalUrl,
      'thumbnail_url': thumbnailUrl,
      'description': description,
      'uploaded_at': uploadedAt.toIso8601String(),
    };
  }
}

class Album {
  final String id;
  final String parentId;
  final String? childId;
  final String name;
  final String? description;
  final String? coverPhotoUrl;
  final DateTime createdAt;
  final DateTime updatedAt;

  Album({
    required this.id,
    required this.parentId,
    this.childId,
    required this.name,
    this.description,
    this.coverPhotoUrl,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Album.fromJson(Map<String, dynamic> json) {
    return Album(
      id: json['id'],
      parentId: json['parent_id'],
      childId: json['child_id'],
      name: json['name'],
      description: json['description'],
      coverPhotoUrl: json['cover_photo_url'],
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }
}

