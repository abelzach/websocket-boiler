import {create} from 'zustand';

interface UsersStore {
  users: any;
  updateUsers: (users: any[]) => void;
}

export const useUsersStore = create<UsersStore>((set) => ({
   users: [],
   updateUsers: (users:any) => set({ users: users }),
}));
