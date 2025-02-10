import { CalendarIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const ProfileCard = () => {
  return (
    <div className="flex justify-between space-x-4">
      <Avatar>
        <AvatarImage src="https://cyberkongz.fra1.cdn.digitaloceanspaces.com/genkai/public/19821/19821_public.jpg" />
        <AvatarFallback>{import.meta.env.VITE_PROFILE_NAME}</AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <a
          href={import.meta.env.VITE_X_PROFILE_URL}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-semibold"
        >
          @{import.meta.env.VITE_PROFILE_NAME}
        </a>
        <p className="text-xs">
          Welcome to <span className="text-md text-primary">Tama Zoo</span> – created and maintained by {import.meta.env.VITE_PROFILE_NAME}{' '}
          🦙
        </p>
        <p className="text-xs text-destructive">Issues or suggestions? DM me on X!</p>
        <p className="text-xs text-muted-foreground">
          If you like it, buy me a{' '}
          <a
            href={`https://marketplace.skymavis.com/account/${import.meta.env.VITE_PROFILE_ADDRESS}`}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            coffee
          </a>{' '}
          ☕!
        </p>
        <div className="flex items-center pt-2">
          <CalendarIcon className="mr-2 h-4 w-4 opacity-70" /> <span className="text-xs text-muted-foreground">Joined RON since 2021</span>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard
