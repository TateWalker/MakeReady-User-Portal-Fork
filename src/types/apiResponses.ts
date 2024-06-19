export interface ApiTag {
  id: number;
  name: string;
}

export interface ApiSpeaker {
  name: string;
  title: string;
  bio: string;
  ThumbnailUrl: string;
}

export interface ApiVideo {
  id: number;
  title: string;
  description: string;
  ThumbnailFile: string;
  ThumbnailUrl: string;
  createdAt: Date;
  tags: ApiTag[];
  status: string;
  duration: number;
  videoId: string;
  isWatched: boolean;
  videoProgressSeconds: number;
}

export interface ApiVideoWithSeries extends ApiVideo {
  series: ApiSeries[];
}

export interface ApiTrackVideo {
  id: number;
  userId: number;
  videoId: number;
  progressSeconds: number;
}

export interface ApiSeries {
  id: number;
  name: string;
  tagline: string;
  videoCount: number;
  description: string;
  speakers: ApiSpeaker[];
  ThumbnailUrl: string;
  ThumbnailFile: string;
}

export interface ApiSeriesWithVideos extends ApiSeries {
  videos: ApiVideo[];
}

// AUTH

export interface ApiAccountExists {
  exists: boolean;
}

export interface ApiRegisterAccount {
  message: string;
}

export interface ApiLoginAccount {
  message: string;
  access_token: string;
}

export interface ApiVerifyEmail {
  message: string;
}

export interface ApiSendForgotPassword {
  message: string;
}

export interface ApiVerifyForgotPassword {
  message: string;
  token: string;
}

export interface ApiSetForgotPassword {
  message: string;
}

export interface ApiChangePassword {
  message: string;
}

export interface ApiChangeEmail {
  message: string;
}

// PROFILE

export interface ApiProfile {
  id: number;
  email: string;
  name: string;
  zipcode: number;
  emailNotification: boolean;
}

export interface ApiProfileUpdate {
  email?: string;
  name?: string;
  zipcode?: number;
  emailNotification?: boolean;
}

export interface ApiUpdateProfile {
  message: string;
}

export interface ApiChangeNotification {
  message: string;
  emailNotification: boolean;
}

// PLAYLISTS
export interface ApiPlaylist {
  id: number;
  name: string;
  userId: number;
  linkSlug: string;
  videoCount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface ApiGetPlaylist {
  playlist: ApiPlaylist;
  videos: ApiVideo[];
}

export interface ApiMyPlaylists {
  playlists: [ApiPlaylist];
}

export interface ApiCreatePlaylist {
  playlist: ApiPlaylist;
}

export interface ApiAddToPlaylist {
  message?: string;
  playlist?: ApiPlaylist;
  videos?: ApiPlaylistVideo[];
}

export interface ApiPlaylistVideo {
  id: number;
  playlistId: number;
  videoId: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  video: ApiVideo;
}

export interface ApiRemoveFromPlaylist {
  message: string;
}

export interface ApiDeletePlaylist {
  message: string;
}

export interface ApiRenamePlaylist {
  message: string;
}

// SUBSCRIPTIONS

export interface ApiSeriesSubscription {
  id: number;
  userId: number;
  seriesId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface ApiUnsubscribeSubscription {
  message: string;
}

// Share

export interface ApiShare {
  message?: string;
  status?: string;
}

export enum CTA_TYPE {
  SERIES = 1,
  VIDEO = 2,
}

export interface ApiCTA {
  ctaLink: string;
  ctaType: number;
  id: number;
  order: number;
  title: string;
  iconShape?: string;
}

// FEATURED
export interface ApiHero {
  id: number;
  layoutType: number;
  image: string;
  title: string;
  description: string | null;
  order: number;
  ctas: ApiHeroCta[];
}

export interface ApiFeaturedTag {
  id: number;
  name: string;
  videos: ApiVideo[];
}

export interface ApiHeroCta {
  id: number;
  title: string | null;
  ctaType: number;
  ctaLink: string | null;
  order: number;
  iconShape: string | null;
}

// SEARCH
export interface ApiSearch {
  series: ApiSeriesWithVideos[];
  tags: ApiTag[];
  videos: ApiVideo[];
}
