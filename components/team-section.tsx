"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const teamMembers = [
  {
    name: "Suraj",
    role: "CEO & Founder",
    avatar: "/placeholder.svg?height=40&width=40&text=S",
    initials: "S",
  },
  {
    name: "Aditya",
    role: "CTO",
    avatar: "/placeholder.svg?height=40&width=40&text=A",
    initials: "A",
  },
  {
    name: "Sneha",
    role: "Head of Product",
    avatar: "/placeholder.svg?height=40&width=40&text=Sn",
    initials: "Sn",
  },
]

export function TeamSection() {
  return (
    <div>
      <h3 className="font-semibold mb-4 text-white">Team</h3>
      <TooltipProvider>
        <div className="flex space-x-2">
          {teamMembers.map((member) => (
            <Tooltip key={member.name}>
              <TooltipTrigger asChild>
                <Avatar className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
                  <AvatarImage
                    src={member.avatar || "/placeholder.svg"}
                    alt={`${member.name} - ${member.role}`}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  )
}
