export default function getSubmissionType(submission) {
    const { is_self, preview, is_video, is_reddit_media_domain } = submission;

    if (is_self) return "selftext";
    if (is_video) return "video";
    if (preview) {
        if (preview.reddit_video_preview && preview.reddit_video_preview.is_gif) return "gif";
        if (preview.images && !is_reddit_media_domain) return "link-with-preview";
        if (preview.images) return "image";
    }

    return "link";
}
