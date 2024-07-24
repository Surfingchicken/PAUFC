export default interface AuthContextType {
    user: {
      toUpdateOn: string | number | Date; name: string; role: string,contribution:number;toBlockOn: string | Date;
} | null;
    checkUserRole: () => Promise<void>;
    logout: () => void;
}
  