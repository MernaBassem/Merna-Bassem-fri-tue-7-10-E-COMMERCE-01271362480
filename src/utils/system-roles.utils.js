// system roles (user and company_HR)
export const systemRoles = {
  USER: "user",
  VENDOR: "vendor",

};

const { USER, VENDOR} = systemRoles;
// Cases of roles
export const roles = {
  USER_VENDOR :  [USER,VENDOR ],
  USER:[USER],
  VENDOR:[VENDOR]
};
