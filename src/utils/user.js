let users = [];

const addUser = ({ username, room, id }) => {
  username = username.trim().toLowerCase();

  room = room.trim().toLowerCase();

  if (!username || !room) {
    return { error: "new user can not be added" };
  }

  const ifExist = users.find((user) => {
    return user.username === username && user.room === room;
  });

  if (ifExist) {
    return { error: "hemen user var" };
  }
  let use = { username, room, id };
  users.push(use);
  return { user: use };
};

const removeUser = (id) => {
  let removed;
  users = users.filter((user, index) => {
    if (user.id === id) {
      removed = user;
      return false;
    }
  });
  return removed;
};

const getUser = (id) => {
  const user = users.find((user) => {
    return user.id === id;
  });

  return user;
};

const getUsersInRoom = (room) => {
  let userArr = [];

  users.forEach((user) => {
    if (user.room === room) {
      userArr.push(user);
    }
  });

  return userArr;
};

module.exports = { getUsersInRoom, getUser, removeUser, addUser };
