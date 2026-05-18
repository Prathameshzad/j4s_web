"use client"

import * as React from "react"
import {
  Command,
  Settings2,
  User,
  LogOut,
  ChevronRight,
  MoreHorizontal,
  GraduationCap,
  Briefcase,
  Users,
  Check,
  ChevronsUpDown,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton as OriginalSidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  useSidebar,
} from "@/component/ui/CustomUI"
import { useAuth } from "@/app/context/AuthContext"

const SidebarMenuButton = OriginalSidebarMenuButton as any;
import { useRouter, usePathname } from "next/navigation"
import { NAV_ITEMS } from "@/utils/navigation"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout, selectedRole, selectedProfile, switchProfile, displayName } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { open, isMobile, isHovered } = useSidebar()
  const showLabel = isMobile || open || isHovered

  const roleIcons: Record<string, any> = {
    STUDENT: GraduationCap,
    STAFF: Briefcase,
    PARENT: Users,
  }

  const ActiveRoleIcon = roleIcons[selectedRole] || GraduationCap

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  if (!user) return null;

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-sidebar-border/50 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger 
                render={
                  <SidebarMenuButton 
                    size="lg" 
                    className="bg-primary/5 hover:bg-primary/10 transition-all duration-300 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <div className={`flex aspect-square size-10 items-center justify-center rounded-xl bg-primary text-white shadow-xl shadow-primary/20 transition-transform group-hover:scale-105 shrink-0`}>
                      <ActiveRoleIcon className="size-5" />
                    </div>
                    {showLabel && (
                      <div className="grid flex-1 text-left text-sm leading-tight ml-2 animate-in fade-in duration-300">
                        <span className="truncate font-black text-primary uppercase tracking-tighter text-base">
                          {selectedRole || 'Select Role'}
                        </span>
                        <span className="truncate text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-70">
                          Active Portal
                        </span>
                      </div>
                    )}
                    {showLabel && <ChevronsUpDown className="ml-auto size-4 text-primary/40 animate-in fade-in duration-300" />}
                  </SidebarMenuButton>
                }
              />
              <DropdownMenuContent
                className="absolute left-0 top-full mt-2 w-full min-w-64 rounded-2xl border-none shadow-2xl p-2 bg-background/95 backdrop-blur-xl z-50"
                align="start"
                sideOffset={10}
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                    Switch Portal
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-muted/50 mb-2" />
                  {user.availableProfiles?.map((profile: any, index: number) => {
                    const RoleIcon = roleIcons[profile.role] || GraduationCap;
                    const isActive = selectedProfile?.role === profile.role && selectedProfile?.instituteId === profile.instituteId && selectedProfile?.userId === profile.userId;
                    
                    return (
                      <DropdownMenuItem
                        key={`${profile.role}-${profile.instituteId}-${index}`}
                        onClick={() => switchProfile(profile)}
                        className={`flex flex-col items-start gap-1 rounded-xl px-3 py-3 transition-all duration-200 mb-1 cursor-pointer ${
                          isActive 
                            ? "bg-primary text-white shadow-lg shadow-primary/20" 
                            : "hover:bg-primary/5 text-muted-foreground hover:text-primary"
                        }`}
                      >
                        <div className="flex w-full items-center gap-3">
                          <div className={`flex size-8 items-center justify-center rounded-lg ${
                            isActive ? "bg-white/20" : "bg-primary/10"
                          }`}>
                            <RoleIcon className={`size-4 ${isActive ? "text-white" : "text-primary"}`} />
                          </div>
                          <div className="flex flex-col flex-1">
                            <span className="text-sm font-bold tracking-tight">{profile.role}</span>
                            <span className={`text-[10px] font-medium opacity-70 ${isActive ? "text-white" : ""}`}>
                              {profile.instituteName || "Default Institute"}
                            </span>
                          </div>
                          {isActive && <Check className="ml-auto size-4 text-white" />}
                        </div>
                        {profile.name && profile.name !== user.name && (
                           <span className={`text-[10px] font-semibold opacity-80 pl-11 ${isActive ? "text-white" : ""}`}>
                             As: {profile.name}
                           </span>
                        )}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.filter(item => item.roles.includes(selectedRole)).map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    render={<a href={item.href} />}
                    tooltip={item.label} 
                    isActive={pathname === item.href}
                    className="group/menu-btn h-10 transition-all duration-200 hover:bg-primary/5 active:scale-95 data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={`size-5 transition-transform duration-200 group-hover/menu-btn:scale-110 shrink-0 ${pathname === item.href ? 'text-primary' : 'text-muted-foreground'}`} />
                      {showLabel && <span className="font-bold tracking-tight animate-in fade-in duration-300">{item.label}</span>}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Personal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => router.push("/dashboard/myprofile")}
                  tooltip="Profile" 
                  className="h-10 hover:bg-primary/5 active:scale-95 transition-all"
                  isActive={pathname === "/dashboard/myprofile"}
                >
                  <div className="flex items-center gap-3">
                    <User className={`size-5 shrink-0 ${pathname === "/dashboard/myprofile" ? 'text-primary' : 'text-muted-foreground'}`} />
                    {showLabel && <span className="font-bold tracking-tight animate-in fade-in duration-300">My Profile</span>}
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => router.push("/dashboard/settings")}
                  tooltip="Settings" 
                  className="h-10 hover:bg-primary/5 active:scale-95 transition-all"
                  isActive={pathname === "/dashboard/settings"}
                >
                  <div className="flex items-center gap-3">
                    <Settings2 className={`size-5 shrink-0 ${pathname === "/dashboard/settings" ? 'text-primary' : 'text-muted-foreground'}`} />
                    {showLabel && <span className="font-bold tracking-tight animate-in fade-in duration-300">Settings</span>}
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg border-2 border-primary/20 shrink-0">
                      <AvatarImage src={user.avatar} alt={displayName} />
                      <AvatarFallback className="bg-primary text-white font-black uppercase">{displayName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {showLabel && (
                      <div className="grid flex-1 text-left text-sm leading-tight animate-in fade-in duration-300">
                        <span className="truncate font-bold tracking-tight">{displayName}</span>
                        <span className="truncate text-xs text-muted-foreground uppercase font-black tracking-tighter">
                          {selectedRole === 'STAFF' && user.staffRoles?.length > 0 
                            ? user.staffRoles.join(', ') 
                            : selectedRole}
                        </span>
                      </div>
                    )}
                    {showLabel && <MoreHorizontal className="ml-auto size-4 text-muted-foreground animate-in fade-in duration-300" />}
                  </SidebarMenuButton>
                }
              />
              <DropdownMenuContent
                className="absolute left-0 bottom-full mb-2 w-full min-w-56 rounded-xl border-none shadow-2xl z-50"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={user.avatar} alt={displayName} />
                        <AvatarFallback className="bg-primary text-white font-black">{displayName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{displayName}</span>
                        <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-muted/50" />
                  <DropdownMenuItem 
                    onClick={() => router.push("/dashboard/myprofile")}
                    className="rounded-lg py-2 font-medium focus:bg-primary/5 focus:text-primary cursor-pointer"
                  >
                    <User className="mr-2 size-4" />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg py-2 font-medium focus:bg-primary/5 focus:text-primary">
                    <Settings2 className="mr-2 size-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-muted/50" />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="rounded-lg py-2 font-bold text-destructive focus:bg-destructive/10 focus:text-destructive"
                  >
                    <LogOut className="mr-2 size-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
