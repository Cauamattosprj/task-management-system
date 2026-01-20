import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

type UserAvatarProps = {
  username: string;
  userProfilePhoto: string;
  avatarOnly?: boolean;
};

export default function UserAvatar({
  username,
  userProfilePhoto,
  avatarOnly = false,
}: UserAvatarProps) {
  return (
    <div className="flex gap-2 items-center">
      <Avatar>
        <AvatarImage>{userProfilePhoto}</AvatarImage>
        <AvatarFallback>CM</AvatarFallback>
      </Avatar>
      <span className="font-medium text-sm">{username}</span>
    </div>
  );
}
