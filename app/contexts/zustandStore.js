import create from "zustand";

// Constants
import constants from "../utils/constants";

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

    commentsColorPallete: constants.COMMENTS_COLOR_PALLETES[0],
    setCommentsColorPallete: pallete => set({ commentsColorPallete: pallete }),
}));

export default zustandStore;
