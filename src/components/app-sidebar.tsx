import { Coins } from 'lucide-react'

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
]

export function AppSidebar() {
  const isMobile = useIsMobile()
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup className="h-full">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Tama Zoo</h1>
          <div className="my-1" />
          <small className="ml-auto text-xs text-muted-foreground">ver {import.meta.env.VITE_REACT_APP_VERSION} beta</small>
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
                    <p className="leading-7">
                      Built by{' '}
                      <a
                        href="https://x.com/ofinsNFT"
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary"
                      >
                        ofins.ron
                      </a>{' '}
                      🦙
                    </p>
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
