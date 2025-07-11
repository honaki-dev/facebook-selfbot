export interface ThreadListResponse {
  o0: { data: { viewer: Viewer } };
}

export interface ThreadResponse {
  o0: { data: { message_threads: MessageThreads } };
}

export interface Viewer {
  message_threads: MessageThreads;
  pending_threads: PendingThreads;
}

export interface ThreadQueueMetadata {
  approval_requests: MessageThreads;
}

export interface MessageThreadsNode {
  id: string;
  thread_key: ThreadKey;
  name: null | string;
  last_message: LastMessage;
  thread_connectivity_data: ThreadConnectivityData | null;
  thread_associated_job_applications: MessageThreads;
  thread_associated_page_admin: null;
  unread_count: number;
  messages_count: number;
  square_image: Image | null;
  image: Image | null;
  updated_time_precise: string;
  mute_until: number | null;
  is_pin_protected: boolean;
  is_pinned: boolean;
  is_viewer_subscribed: boolean;
  is_other_recipient_page: boolean;
  thread_queue_enabled: boolean;
  folder: string;
  has_viewer_archived: boolean;
  is_page_follow_up: boolean;
  is_page_unresponded_thread: null;
  cannot_reply_reason: null | string;
  can_viewer_report: boolean;
  composer_input_disabled: null;
  ephemeral_ttl_mode: number;
  customization_info: CustomizationInfo | null;
  thread_theme: ThreadTheme | null;
  thread_admins: MontageThread[];
  approval_mode: number | null;
  joinable_mode: JoinableMode;
  group_approval_queue: MessageThreads;
  thread_queue_metadata: ThreadQueueMetadata | null;
  event_reminders: MessageThreads;
  montage_thread: MontageThread | null;
  last_read_receipt: DeliveryReceipts;
  related_page_thread: null;
  rtc_call_data: RtcCallData;
  marketplace_thread_data: MarketplaceThreadData | null;
  associated_object: null;
  privacy_mode: number;
  reactions_mute_mode: string;
  mentions_mute_mode: string;
  customization_enabled: boolean;
  thread_type: string;
  group_thread_subtype: null | string;
  participant_add_mode_as_string: null | string;
  is_canonical_neo_user: boolean;
  participants_event_status: any[];
  page_comm_item: null;
  admin_model_status_string: string;
  groups_sync_status_string: null | string;
  groups_sync_metadata: null;
  pinned_messages: any[];
  work_groups_sync_metadata: null;
  saved_messages: any[];
  description: null;
  joinable_link: null;
  is_fuss_red_page: boolean;
  linked_mentorship_programs: MessageThreads;
  thread_unsendability_status: string;
  thread_pin_timestamp: number;
  is_business_page_active: boolean;
  conversion_detection_data: ConversionDetectionData | null;
  all_participants: AllParticipants;
  read_receipts: ReadReceipts;
  delivery_receipts: DeliveryReceipts;
}

export interface MessageThreads {
  nodes: MessageThreadsNode[];
}

export interface AllParticipants {
  edges: Edge[];
}

export interface Edge {
  admin_type: null;
  node: EdgeNode;
}

export interface EdgeNode {
  messaging_actor: MessagingActor;
}

export interface MessagingActor {
  id: string;
  __typename: Typename;
  name: string;
  gender?: Gender;
  url: null | string;
  big_image_src: Image;
  short_name?: string;
  username?: string;
  is_viewer_friend?: boolean;
  is_messenger_user?: boolean;
  is_message_blocked_by_viewer: boolean;
  is_viewer_coworker?: boolean;
  is_employee?: null;
  is_aloha_proxy_confirmed?: boolean;
  is_birthday?: any;
  scim_company_user?: null;
  work_info?: null;
  work_foreign_entity_info?: null;
  is_blocked_by_viewer?: boolean;
}

export enum Typename {
  ReducedMessagingActor = "ReducedMessagingActor",
  UnavailableMessagingActor = "UnavailableMessagingActor",
  User = "User"
}

export interface Image {
  uri: string;
}

export enum Gender {
  Female = "FEMALE",
  Male = "MALE",
  Neuter = "NEUTER"
}

export interface ConversionDetectionData {
  is_eligible: null;
  conversion_type: null;
  currency_code: null;
  currency_amount: null;
  timestamp: null;
  page_reply: null;
  icebreaker_key: null;
  icebreaker_message: null;
  trigger_id: null;
}

export interface CustomizationInfo {
  emoji: string;
  participant_customizations: ParticipantCustomization[];
  outgoing_bubble_color: string;
}

export interface ParticipantCustomization {
  participant_id: string;
  nickname: string;
}

export interface DeliveryReceipts {
  nodes: DeliveryReceiptsNode[];
}

export interface DeliveryReceiptsNode {
  timestamp_precise: string;
}

export interface JoinableMode {
  mode: string;
  link: string;
}

export interface LastMessage {
  nodes: LastMessageNode[];
}

export interface LastMessageNode {
  snippet: string;
  message_sender: MessageSender;
  timestamp_precise: string;
  commerce_message_type: null;
  extensible_attachment?: null;
  sticker?: Sticker | null;
  blob_attachments?: BlobAttachment[];
  platform_xmd_encoded: null;
  message_unsendability_status: string;
  extensible_message_admin_text_type?: string;
  extensible_message_admin_text?: ExtensibleMessageAdminText;
}

export interface BlobAttachment {
  __typename: string;
  attribution_app: null;
  attribution_metadata: null;
  filename: string;
  playable_url: string;
  chat_image: ChatImageClass;
  legacy_attachment_id: string;
  video_type: string;
  original_dimensions: OriginalDimensions;
  playable_duration_in_ms: number;
  large_image: ChatImageClass;
  inbox_image: ChatImageClass;
}

export interface ChatImageClass {
  height: number;
  width: number;
  uri: string;
}

export interface OriginalDimensions {
  x: number;
  y: number;
}

export interface ExtensibleMessageAdminText {}

export interface MessageSender {
  messaging_actor: MontageThread;
}

export interface MontageThread {
  id: string;
}

export interface Sticker {
  id: string;
  pack: MontageThread;
  label: string;
  frame_count: number;
  frame_rate: number;
  frames_per_row: number;
  frames_per_column: number;
  sprite_image_2x: null;
  sprite_image: null;
  padded_sprite_image: null;
  padded_sprite_image_2x: null;
  url: string;
  height: number;
  width: number;
}

export interface MarketplaceThreadData {
  for_sale_item: null;
  rating_state: RatingState | null;
  buyer: MontageThread | null;
  seller: Seller | null;
  eligible_profile_selling_invoice_actions: any[];
}

export interface RatingState {
  is_eligible_to_rate: boolean;
}

export interface Seller {
  id: string;
  marketplace_c2c_shipping_seller: MarketplaceC2CShippingSeller;
}

export interface MarketplaceC2CShippingSeller {
  is_eligible: boolean;
}

export interface ReadReceipts {
  nodes: ReadReceiptsNode[];
}

export interface ReadReceiptsNode {
  watermark: string;
  action: string;
  actor: MontageThread;
}

export interface RtcCallData {
  call_state: string;
  server_info_data: string;
  initiator: MontageThread | null;
}

export interface ThreadConnectivityData {
  connectivity_status: string;
  first_sender_id: null | string;
}

export interface ThreadKey {
  thread_fbid: null | string;
  other_user_id: null | string;
}

export interface ThreadTheme {
  id: string;
  fallback_color: string;
  accessibility_label: string;
  reverse_gradients_for_radial: boolean;
  gradient_colors: string[];
  reaction_pack: null;
}

export interface PendingThreads {
  unseen_count: number;
}
