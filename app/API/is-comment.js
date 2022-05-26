const isComment = async id => {
    return fetch(`https://www.reddit.com/${id}.json`) //
        .then(response => response.json())
        .then(json => json.error === 404);
};

export default isComment;
