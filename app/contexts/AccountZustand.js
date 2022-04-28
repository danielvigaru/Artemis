import create from "zustand";

const accountStore = create(set => ({
    account: {},
    setAccount: details => set(() => ({ account: details })),

    hasAccount: false,
    setHasAccount: hasAcc => set(() => ({ hasAccount: hasAcc })),

    finishedLogin: false,
    setFinishedLogin: finishedLogin => set(() => ({ finishedLogin: finishedLogin })),

    snoo: null,
    setSnoo: snooInstance => set(() => ({ snoo: snooInstance })),

    doLogOut: () => set(() => ({ account: {}, hasAccount: false, snoo: null })),
}));

export default accountStore;
