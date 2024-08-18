// system roles (user and company_HR)
export const systemRoles = {
  USER: "user",
  ADMIN: "admin",

};

const { USER, ADMIN } = systemRoles;
// Cases of roles
export const roles = {
  USER_ADMIN: [USER, ADMIN],
  USER: [USER],
  ADMIN: [ADMIN],
};
