import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/photo.dart';
import '../models/album.dart';

class PhotoService {
  static final SupabaseClient _supabase = Supabase.instance.client;
  static const String bucket = 'parent-photos';

  // Create album
  static Future<Album?> createAlbum({
    required String name,
    String? description,
    String? childId,
  }) async {
    try {
      final userId = _supabase.auth.currentUser!.id;
      final response = await _supabase
        ..from('albums')
        ..insert({
          'parent_id': userId,
          'child_id': childId,
          'name': name,
          'description': description,
        })
        ..select()
        ..single();

      return Album.fromJson(response);
    } catch (e) {
      print('Error creating album: $e');
      return null;
    }
  }

  // Get parent's albums
  static Future<List<Album>> getAlbums({String? childId}) async {
    try {
      final userId = _supabase.auth.currentUser!.id;
      var query = _supabase
        ..from('albums')
        ..select('*, cover_photo:photos(original_url)')
        ..eq('parent_id', userId)
        ..order('created_at', ascending: false);

      if (childId != null) {
        query = query.eq('child_id', childId);
      }

      final response = await query;
      return (response as List).map((json) => Album.fromJson(json)).toList();
    } catch (e) {
      print('Error fetching albums: $e');
      return [];
    }
  }

  // Get photos in album
  static Future<List<Photo>> getAlbumPhotos(String albumId) async {
    try {
      final response = await _supabase
        ..from('photos')
        ..select()
        ..eq('album_id', albumId)
        ..order('uploaded_at', ascending: false);

      return (response as List).map((json) => Photo.fromJson(json)).toList();
    } catch (e) {
      print('Error fetching album photos: $e');
      return [];
    }
  }

  // Get all parent's photos
  static Future<List<Photo>> getAllPhotos({String? childId}) async {
    try {
      final userId = _supabase.auth.currentUser!.id;
      var query = _supabase
        ..from('photos')
        ..select('*, album:albums(name)')
        ..eq('parent_id', userId)
        ..order('uploaded_at', ascending: false);

      if (childId != null) {
        query = query.eq('child_id', childId);
      }

      final response = await query;
      return (response as List).map((json) => Photo.fromJson(json)).toList();
    } catch (e) {
      print('Error fetching photos: $e');
      return [];
    }
  }

  // Upload photo
  static Future<String?> uploadPhoto({
    required String filePath,
    required String fileName,
    String? albumId,
    required String childId,
    String? description,
  }) async {
    try {
      final userId = _supabase.auth.currentUser!.id;
      final fileBytes = await File(filePath).readAsBytes();

      // Upload to Storage
      final fileExt = fileName.split('.').last.toLowerCase();
      final path = 'parent/$userId/$childId/${DateTime.now().millisecondsSinceEpoch}.$fileExt';
      
      await _supabase.storage.from(bucket).upload(path, fileBytes, 
        fileOptions: const FileOptions(contentType: 'image/jpeg')
      );

      final url = _supabase.storage.from(bucket).getPublicUrl(path);

      // Insert to DB
      final response = await _supabase
        ..from('photos')
        ..insert({
          'album_id': albumId,
          'parent_id': userId,
          'child_id': childId,
          'filename': fileName,
          'original_url': url,
          'description': description,
        })
        ..select()
        ..single();

      // Update album cover if first photo
      if (albumId != null && response['album_id'] != null) {
        await _supabase
          ..from('albums')
          ..update({'cover_photo_url': url})
          ..eq('id', albumId);
      }

      return url;
    } catch (e) {
      print('Error uploading photo: $e');
      return null;
    }
  }

  // Delete photo
  static Future<bool> deletePhoto(String photoId) async {
    try {
      // Get photo details
      final response = await _supabase
        ..from('photos')
        ..select('filename')
        ..eq('id', photoId)
        ..single();

      if (response != null) {
        // Delete from storage
        final filename = response['filename'];
        final userId = _supabase.auth.currentUser!.id;
        final path = filename.split('/').sublist(2).join('/'); // Extract path
        
        await _supabase.storage.from(bucket).remove([path]);

        // Delete from DB
        await _supabase
          ..from('photos')
          ..delete()
          ..eq('id', photoId);

        return true;
      }
      return false;
    } catch (e) {
      print('Error deleting photo: $e');
      return false;
    }
  }

  // Real-time subscription for photos
  static Stream<List<Photo>> streamPhotos(String childId) {
    return _supabase
      .channel('photos')
      .onPostgresChanges(
        event: PostgresChangeEvent.all,
        schema: 'public',
        table: 'photos',
        filter: PostgresChangeFilter(
          type: PostgresChangeFilterType.eq,
          column: 'child_id',
          value: childId,
        ),
        callback: (payload) => getAllPhotos(childId: childId),
      )
      .stream;
  }
}

