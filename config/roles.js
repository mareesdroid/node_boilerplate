const allRoles = {
  user: ['getUsers', 'create_user', 'assetAuth'],
  admin: ['getUsers', 'manageUsers', 'create_user', 'assetAuth'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
