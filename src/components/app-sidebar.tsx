import { Coins, Eye } from 'lucide-react'

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
import { useIsMobile } from '@/hooks/use-mobile'
import { APP_VERSION } from '@/utils/common'
import { useNavigation } from '@refinedev/core'
import { ModeToggle } from './mode-toggle'
import ProfileCard from './profile-card'
import { Card } from './ui/card'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card'

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
  {
    title: 'Watchlist',
    url: '/watchlist',
    icon: Eye,
  },
]

export function AppSidebar() {
  const isMobile = useIsMobile()
  const { list } = useNavigation()
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup className="h-full">
          <h1
            className="cursor-pointer scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"
            onClick={() => list('tokens')}
          >
            Tama Zoo
          </h1>
          <div className="my-1" />
          <small className="ml-auto text-xs text-muted-foreground">ver {APP_VERSION} beta</small>
          <SidebarGroupLabel>Applications</SidebarGroupLabel>
          <SidebarGroupContent className="relative h-full">
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
              {isMobile && (
                <Card className="absolute bottom-[7%] w-full p-2">
                  <ProfileCard />
                </Card>
              )}
              <div className="fixed bottom-1 flex items-end justify-start gap-3">
                <ModeToggle />
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <p className="leading-7">Built by {import.meta.env.VITE_PROFILE_NAME} 🦙</p>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <ProfileCard />
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
