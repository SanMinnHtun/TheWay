export interface CurrentUser {
  name: string;
  email: string;
  avatar: string | null;
}

export const currentUser: CurrentUser = {
  name: "May Pyae Sone Win",
  email: "may@example.com",
  avatar: null
};
