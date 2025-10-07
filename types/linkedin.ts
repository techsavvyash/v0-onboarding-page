export interface LinkedInApiResponse {
  fullname: string;
  headline: string;
  profile_picture_url?: string;
  background_picture_url?: string;
  location_full: string;
  follower_count: number;
  is_premium: boolean;
  is_influencer: boolean;
  user_persona: string;
  topPosts: Array<{
    id: string;
    urn: string;
    full_urn: string;
    posted_at: {
      date: string;
      relative: string;
      timestamp: number;
    };
    text: string;
    url: string;
    post_type: string;
    author_first_name: string;
    author_last_name: string;
    author_headline: string;
    author_username: string;
    author_profile_url: string;
    author_profile_picture: string;
    total_reactions: number;
    like_count: number;
    support_count: number;
    love_count: number;
    insight_count: number;
    celebrate_count: number;
    funny_count: number;
    comments_count: number;
    reposts_count: number;
    author: {
      headline: string;
      username: string;
      last_name: string;
      first_name: string;
      profile_url: string;
      profile_picture: string;
    };
    stats: {
      like: number;
      love: number;
      funny: number;
      insight: number;
      reposts: number;
      support: number;
      comments: number;
      celebrate: number;
      total_reactions: number;
    };
    media?: {
      url: string;
      type: string;
      images: Array<{
        url: string;
        width: number;
        height: number;
      }>;
    };
    pagination_token: string;
    username: string;
    created_at: string;
    updated_at: string;
  }>;
  cumulativeReactions: {
    total_likes: number;
    total_support: number;
    total_love: number;
    total_insight: number;
    total_celebrate: number;
    total_funny: number;
    total_all_reactions: number;
    total_comments: number;
    total_reposts: number;
  };
}
