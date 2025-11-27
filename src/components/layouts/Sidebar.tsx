import {
  Sidebar as SidebarUI,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarRail,
  SidebarTrigger,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui'
import { SIDEBAR_MENU } from '@/constants/sidebar'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDownIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
export const Sidebar = () => {
  const location = useLocation()

  const initialOpen = useMemo(() => {
    const activeGroup = SIDEBAR_MENU.find((item) => {
      const hasSub = item.subMenu && item.subMenu.length
      if (!hasSub) return false
      const groupMatch = location.pathname.startsWith(item.href)
      const subMatch = item.subMenu!.some((s) => location.pathname.startsWith(s.href))
      return groupMatch || subMatch
    })
    return activeGroup?.href
  }, [location.pathname])

  const [openValue, setOpenValue] = useState<string | undefined>(initialOpen)

  useEffect(() => {
    setOpenValue(initialOpen)
  }, [initialOpen])

  return (
    <SidebarUI collapsible="offcanvas">
      <SidebarHeader className="h-20 flex flex-row  items-center justify-between border-b">
        <div>
          <Link to="/" className="text-xl font-bold text-primary">
            Islamic Web
          </Link>
        </div>
        <SidebarTrigger className="md:hidden" />
      </SidebarHeader>
      <SidebarContent className="mt-6">
        <SidebarMenu>
          <Accordion type="single" collapsible value={openValue} onValueChange={setOpenValue}>
            {SIDEBAR_MENU.map((item) => {
              const hasSub = item.subMenu && item.subMenu.length
              const isActiveTop =
                !hasSub &&
                (item.href === '/'
                  ? location.pathname === '/'
                  : location.pathname === item.href || location.pathname.startsWith(item.href))
              const isActiveGroup =
                hasSub &&
                (location.pathname.startsWith(item.href) ||
                  item.subMenu!.some((s) => location.pathname.startsWith(s.href)))

              if (hasSub) {
                return (
                  <SidebarMenuItem key={item.href}>
                    <AccordionItem value={item.href}>
                      <AccordionTrigger asChild>
                        <SidebarMenuButton isActive={!!isActiveGroup} className="group">
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                          <ChevronDownIcon className="ml-auto transition-transform group-data-[state=open]:rotate-180" />
                        </SidebarMenuButton>
                      </AccordionTrigger>
                      <AccordionContent>
                        <SidebarMenuSub>
                          {item.subMenu!.map((sub) => {
                            const subActive =
                              location.pathname === sub.href ||
                              location.pathname.startsWith(sub.href)
                            return (
                              <SidebarMenuSubItem key={sub.href}>
                                <SidebarMenuSubButton asChild isActive={subActive}>
                                  <Link to={sub.href} className="flex items-center gap-2">
                                    {sub.icon && <sub.icon />}
                                    <span>{sub.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            )
                          })}
                        </SidebarMenuSub>
                      </AccordionContent>
                    </AccordionItem>
                  </SidebarMenuItem>
                )
              }

              return (
                <SidebarMenuItem key={item.href} className="mb-1">
                  <SidebarMenuButton asChild isActive={!!isActiveTop}>
                    <Link to={item.href} className="flex items-center gap-2">
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </Accordion>
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </SidebarUI>
  )
}
