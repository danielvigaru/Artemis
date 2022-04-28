import create from "zustand";

const postsStore = create(set => ({
    feedSelectedPostId: "",
    setFeedSelectedPostId: id => set(() => ({ feedSelectedPostId: id })),

    profileSelectedPostId: "",
    setProfileSelectedPostId: id => set(() => ({ profileSelectedPostId: id })),

    visiblePosts: [],
    setVisiblePosts: id => set(() => ({ visiblepost: id })),
}));

export default postsStore;
