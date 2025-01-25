import { CalendarIcon, Coins } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { ModeToggle } from './mode-toggle'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card'

// Menu items.
const items = [
  // {
  //   title: 'Home',
  //   url: '/',
  //   icon: Home,
  // },
  {
    title: 'Tokens',
    url: '/tokens',
    icon: Coins,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup className="h-full">
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent className="h-full">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <div className="fixed bottom-1 flex items-end justify-start gap-3">
                <ModeToggle />
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <p className="leading-7">
                      Built by{' '}
                      <a
                        href="https://x.com/ofinsNFT"
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary"
                      >
                        ofins.ron
                      </a>
                    </p>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="flex justify-between space-x-4">
                      <Avatar>
                        <AvatarImage src="https://cyberkongz.fra1.cdn.digitaloceanspaces.com/genkai/public/19821/19821_public.jpg" />
                        <AvatarFallback>ofins.ron</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <a
                          href="https://x.com/ofinsNFT"
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-semibold"
                        >
                          @ofins.ron
                        </a>
                        <p className="text-xs">
                          Welcome to <span className="text-md text-primary">Tama Zoo</span> – created and maintained by ofins.ron
                        </p>
                        <p className="text-xs text-muted-foreground">
                          If you like it, buy me a{' '}
                          <a
                            href={`https://marketplace.skymavis.com/account/${import.meta.env.VITE_OFINS_RON_ADDRESS}`}
                            target="_blank"
                            rel="noreferrer"
                            className="underline"
                          >
                            coffee
                          </a>{' '}
                          ☕!
                        </p>
                        <div className="flex items-center pt-2">
                          <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{' '}
                          <span className="text-xs text-muted-foreground">Joined RON since 2021</span>
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
