export default function getSubmissionType(submission) {
    const { is_self, preview, is_video, is_reddit_media_domain } = submission;

    if (is_self) return "selftext";
    if (is_video) return "video";
    if (preview) {
        const { reddit_video_preview, images } = preview;

        if (reddit_video_preview && reddit_video_preview.is_gif) return "gif";
        if (images) {
            if (!is_reddit_media_domain) return "link-with-preview";

            return "image";
        }
    }

    return "link";
}
