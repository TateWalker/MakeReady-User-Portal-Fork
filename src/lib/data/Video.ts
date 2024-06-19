export const getVideoUrl = (videoId: string) => {
  return `https://customer-lpnfgib0i0ua7pmg.cloudflarestream.com/${videoId}manifest/video.m3u8?clientBandwidthHint=1.8`;
};
