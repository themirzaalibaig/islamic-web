import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

function Slider({ className, ...props }: React.ComponentProps<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn("relative flex w-full touch-none select-none items-center", className)}
      {...props}
    >
      <SliderPrimitive.Track className="bg-muted relative h-2 w-full overflow-hidden rounded-full">
        <SliderPrimitive.Range className="bg-primary absolute h-full" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="border-input bg-background text-foreground ring-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] block size-5 rounded-full border shadow-xs outline-none" />
    </SliderPrimitive.Root>
  )
}

export { Slider }

