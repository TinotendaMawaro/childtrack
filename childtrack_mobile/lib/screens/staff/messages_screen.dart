import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:image_picker/image_picker.dart';
import 'package:go_router/go_router.dart';
import 'package:record/record.dart';
import 'package:path_provider/path_provider.dart';
import 'package:uuid/uuid.dart';
import '../../main.dart' show AppColors, GlassCard;
import 'staff_home_screen.dart' as staff_providers;

class MessagesScreen extends ConsumerStatefulWidget {
  final String? conversationId;
  final String? parentName;
  final String? childName;

  const MessagesScreen({
    super.key,
    this.conversationId,
    this.parentName,
    this.childName,
  });

  @override
  ConsumerState<MessagesScreen> createState() => _MessagesScreenState();
}

class _MessagesScreenState extends ConsumerState<MessagesScreen> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final AudioRecorder _audioRecorder = AudioRecorder();
  final Uuid _uuid = const Uuid();

  bool _isRecording = false;
  bool _isSending = false;
  String? _recordingPath;
  late final String? _currentConversationId;

  @override
  void initState() {
    super.initState();
    if (widget.conversationId != null) {
      _currentConversationId = widget.conversationId;
    }
  }

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    _audioRecorder.dispose();
    super.dispose();
  }

  Future<void> _sendMessage({String? text, String? audioUrl, String? imageUrl}) async {
    if (_isSending) return;
    if (_currentConversationId == null) return;

    final session = Supabase.instance.client.auth.currentSession;
    if (session == null) return;

    final messageText = text ?? _messageController.text.trim();
    if (messageText.isEmpty && imageUrl == null && audioUrl == null) return;

    setState(() => _isSending = true);

    try {
      final messageId = _uuid.v4();
      final now = DateTime.now().toIso8601String();

      final conversation = await Supabase.instance.client
          .from('conversations')
          .select('parent_id')
          .eq('id', _currentConversationId)
          .single();

      final parentId = conversation['parent_id'] as String;

      await Supabase.instance.client.from('messages').insert({
        'id': messageId,
        'conversation_id': _currentConversationId,
        'sender_id': session.user.id,
        'receiver_id': parentId,
        'message': messageText,
        'audio_url': audioUrl,
        'image_url': imageUrl,
        'read': false,
        'created_at': now,
      });

      await Supabase.instance.client
          .from('conversations')
          .update({
            'last_message': messageText.isNotEmpty ? messageText : (imageUrl != null ? '📷 Photo' : '🎤 Voice message'),
            'last_message_time': now,
          })
          .eq('id', _currentConversationId);

      _messageController.clear();

      Future.delayed(const Duration(milliseconds: 100), () {
        if (_scrollController.hasClients) {
          _scrollController.animateTo(
            _scrollController.position.maxScrollExtent,
            duration: const Duration(milliseconds: 300),
            curve: Curves.easeOut,
          );
        }
      });
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to send: $e'), backgroundColor: Colors.red),
        );
      }
    } finally {
      setState(() => _isSending = false);
    }
  }

  Future<void> _pickImage() async {
    try {
      final picker = ImagePicker();
      final pickedFile = await picker.pickImage(
        source: ImageSource.gallery,
        maxWidth: 800,
        maxHeight: 800,
        imageQuality: 70,
      );

      if (pickedFile != null) {
        final session = Supabase.instance.client.auth.currentSession;
        if (session == null) return;

        final file = File(pickedFile.path);
        final fileName = 'msg_${_currentConversationId}_${DateTime.now().millisecondsSinceEpoch}.jpg';

        await Supabase.instance.client.storage
            .from('message-attachments')
            .upload(fileName, file);

        final publicUrl = Supabase.instance.client.storage
            .from('message-attachments')
            .getPublicUrl(fileName);

        await _sendMessage(imageUrl: publicUrl);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Upload failed: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  Future<void> _startRecording() async {
    try {
      final directory = await getApplicationDocumentsDirectory();
      _recordingPath = '${directory.path}/recording_${DateTime.now().millisecondsSinceEpoch}.m4a';

      await _audioRecorder.start(const RecordConfig(
        encoder: AudioEncoder.aacLc,
        bitRate: 128000,
        sampleRate: 44100,
      ), path: _recordingPath!);

      setState(() => _isRecording = true);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Recording failed: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  Future<void> _stopRecording() async {
    try {
      final path = await _audioRecorder.stop();
      setState(() => _isRecording = false);

      if (path != null) {
        final session = Supabase.instance.client.auth.currentSession;
        if (session == null) return;

        final file = File(path);
        final fileName = 'voice_${_currentConversationId}_${DateTime.now().millisecondsSinceEpoch}.m4a';

        await Supabase.instance.client.storage
            .from('message-attachments')
            .upload(fileName, file);

        final publicUrl = Supabase.instance.client.storage
            .from('message-attachments')
            .getPublicUrl(fileName);

        await _sendMessage(audioUrl: publicUrl);
      }
    } catch (e) {
      setState(() => _isRecording = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Recording error: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  void _insertQuickReply(String reply) {
    _messageController.text = reply;
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    if (_currentConversationId == null) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    final messagesAsync = ref.watch(staff_providers.messagesProvider(_currentConversationId!));

    return Scaffold(
      backgroundColor: AppColors.softBackground,
      appBar: AppBar(
        title: Row(
          children: [
            CircleAvatar(
              radius: 20,
              backgroundColor: AppColors.primaryBlue.withOpacity(0.2),
              child: Text(
                widget.childName?.isNotEmpty == true
                    ? widget.childName![0].toUpperCase()
                    : 'C',
                style: const TextStyle(color: AppColors.primaryBlue, fontWeight: FontWeight.bold),
              ),
            ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  widget.parentName ?? 'Parent',
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
                ),
                Text(
                  widget.childName ?? '',
                  style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                ),
              ],
            ),
          ],
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: AppColors.textPrimary),
          onPressed: () => context.pop(),
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: messagesAsync.when(
              data: (messages) {
                if (messages.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.chat_bubble_outline_rounded, size: 80, color: Colors.grey.shade300),
                        const SizedBox(height: 16),
                        Text(
                          'Start the conversation',
                          style: TextStyle(fontSize: 18, color: Colors.grey.shade600),
                        ),
                      ],
                    ),
                  );
                }

                return ListView.builder(
                  controller: _scrollController,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
                  itemCount: messages.length,
                  itemBuilder: (context, index) {
                    final message = messages[index];
                    final isFromStaff = message['sender_id'] == Supabase.instance.client.auth.currentSession?.user?.id;
                    final showAvatar = index == 0 ||
                        messages[index - 1]['sender_id'] != message['sender_id'];

                    return _buildMessageBubble(message, isFromStaff, showAvatar);
                  },
                );
              },
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (err, _) => Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.error_outline, size: 48, color: Colors.red),
                    const SizedBox(height: 8),
                    Text('Error: $err'),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () => ref.refresh(staff_providers.messagesProvider(_currentConversationId!)),
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              ),
            ),
          ),

          _buildQuickReplies(),

          _buildInputArea(),
        ],
      ),
    );
  }

  Widget _buildMessageBubble(Map<String, dynamic> message, bool isFromStaff, bool showAvatar) {
    final time = message['created_at'] as String?;
    final formattedTime = time != null
        ? DateTime.parse(time).toLocal().toString().substring(11, 16)
        : '';

    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        mainAxisAlignment: isFromStaff ? MainAxisAlignment.end : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          if (!isFromStaff && showAvatar) ...[
            CircleAvatar(
              radius: 16,
              backgroundColor: AppColors.primaryCoral.withOpacity(0.2),
              child: Text(
                (widget.childName ?? 'P').substring(0, 1).toUpperCase(),
                style: const TextStyle(fontSize: 12, color: AppColors.primaryCoral, fontWeight: FontWeight.bold),
              ),
            ),
            const SizedBox(width: 8),
          ] else if (!isFromStaff)
            const SizedBox(width: 40),

          Flexible(
            child: Column(
              crossAxisAlignment: isFromStaff ? CrossAxisAlignment.end : CrossAxisAlignment.start,
              children: [
                if (isFromStaff && message['image_url'] != null)
                  _buildImageMessage(message['image_url']),
                if (isFromStaff && message['audio_url'] != null)
                  _buildAudioMessage(message['audio_url']),
                if (message['message'] != null && message['message'].isNotEmpty)
                  AnimatedSlide(
                    offset: isFromStaff ? const Offset(0.1, 0) : const Offset(-0.1, 0),
                    duration: const Duration(milliseconds: 300),
                    curve: Curves.easeOut,
                    child: GlassCard(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      margin: EdgeInsets.zero,
                      child: Text(
                        message['message'],
                        style: const TextStyle(fontSize: 16, color: AppColors.textPrimary),
                      ),
                    ),
                  ),
                const SizedBox(height: 4),
                Text(
                  formattedTime,
                  style: TextStyle(fontSize: 11, color: Colors.grey.shade500),
                ),
              ],
            ),
          ),

          if (isFromStaff && showAvatar) ...[
            const SizedBox(width: 8),
            CircleAvatar(
              radius: 16,
              backgroundColor: AppColors.mintGlow.withOpacity(0.2),
              child: const Icon(Icons.person_rounded, size: 20, color: AppColors.mintGlow),
            ),
          ] else if (isFromStaff)
            const SizedBox(width: 40),
        ],
      ),
    );
  }

  Widget _buildImageMessage(String imageUrl) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: Image.network(
          imageUrl,
          width: 200,
          fit: BoxFit.cover,
          errorBuilder: (_, __, ___) => Container(
            width: 200,
            height: 150,
            color: Colors.grey.shade300,
            child: const Icon(Icons.broken_image_rounded, color: Colors.grey),
          ),
        ),
      ),
    );
  }

  Widget _buildAudioMessage(String audioUrl) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: GlassCard(
        padding: const EdgeInsets.all(12),
        margin: EdgeInsets.zero,
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.play_arrow_rounded, color: AppColors.primaryBlue),
            const SizedBox(width: 8),
            Text('Voice message', style: TextStyle(fontSize: 14, color: Colors.grey.shade700)),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickReplies() {
    final quickReplies = [
      "Your child is doing great today 😊",
      "Please check the school notice",
    ];

    return Container(
      height: 40,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: quickReplies.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          return Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: () => _insertQuickReply(quickReplies[index]),
              borderRadius: BorderRadius.circular(20),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  color: AppColors.white.withOpacity(0.9),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppColors.primaryBlue.withOpacity(0.3), width: 1),
                ),
                child: Center(
                  child: Text(
                    quickReplies[index],
                    style: const TextStyle(fontSize: 12, color: AppColors.primaryBlue, fontWeight: FontWeight.w500),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildInputArea() {
    return Container(
      padding: EdgeInsets.only(
        left: 16,
        right: 16,
        top: 12,
        bottom: MediaQuery.of(context).padding.bottom + 12,
      ),
      decoration: BoxDecoration(
        color: AppColors.white.withOpacity(0.95),
        border: Border(top: BorderSide(color: Colors.grey.shade200, width: 1)),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, -5)),
        ],
      ),
      child: SafeArea(
        child: Row(
          children: [
            IconButton(
              onPressed: _pickImage,
              icon: Icon(Icons.photo_camera_rounded, color: AppColors.primaryBlue),
              tooltip: 'Attach photo',
            ),
            IconButton(
              onPressed: _isRecording ? _stopRecording : _startRecording,
              icon: Icon(
                _isRecording ? Icons.stop_rounded : Icons.mic_rounded,
                color: _isRecording ? Colors.red : AppColors.primaryBlue,
              ),
              tooltip: _isRecording ? 'Stop recording' : 'Voice note',
            ),
            Expanded(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                decoration: BoxDecoration(
                  color: AppColors.white.withOpacity(0.8),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: Colors.grey.shade300, width: 1),
                ),
                child: TextField(
                  controller: _messageController,
                  maxLines: null,
                  decoration: InputDecoration(
                    hintText: 'Type your message...',
                    hintStyle: TextStyle(color: Colors.grey.shade400),
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                  style: const TextStyle(fontSize: 16, color: AppColors.textPrimary),
                  onSubmitted: (_) => _sendMessage(),
                ),
              ),
            ),
            const SizedBox(width: 8),
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(colors: [AppColors.primaryCoral, AppColors.primaryCoral.withOpacity(0.8)]),
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: AppColors.primaryCoral.withOpacity(0.4),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Material(
                color: Colors.transparent,
                child: InkWell(
                  onTap: _isSending ? null : () => _sendMessage(),
                  borderRadius: BorderRadius.circular(28),
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    child: _isSending
                        ? const SizedBox(
                            width: 24,
                            height: 24,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: Colors.white,
                            ),
                          )
                        : const Icon(Icons.send_rounded, color: Colors.white, size: 24),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
