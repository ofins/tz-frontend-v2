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
import { ModeToggle } from './mode-toggle'

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
              </div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
