import create from "zustand";

const zustandStore = create(set => ({
    account: {},
    setAccount: details => set({ account: details }),

    hasAccount: false,
    setHasAccount: hasAcc => set({ hasAccount: hasAcc }),

    finishedLogin: false,
    setFinishedLogin: finishedLogin => set({ finishedLogin: finishedLogin }),

    snoo: null,
    setSnoo: snooInstance => set({ snoo: snooInstance }),

    doLogOut: () => set({ account: {}, hasAccount: false, snoo: null }),

    // ---

    selectedPost: "",
    setSelectedPost: id => set({ selectedPost: id }),
    selectedPostForComment: "",
    setSelectedPostForComment: id => set({ selectedPostForComment: id }),

    visiblePosts: [],
    setVisiblePosts: idArr => set({ visiblePosts: idArr }),

    // ---

    commetsColorPallete: ["#09015F", "#AF0069", "#55B3B1", "#F6C065"],
}));

export default zustandStore;
