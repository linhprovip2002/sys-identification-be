const users = [];

export function userJoin(id, room) {
    const user = { id, room };
    users.push(user);
    return user;
}

export function getCurrentUser(id) {
    const user = users.find(user => user.id === id);
    return user;
}
