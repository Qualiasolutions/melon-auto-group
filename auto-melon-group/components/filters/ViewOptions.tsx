"use client"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Icon } from "@/components/ui/icon"
import { VehicleFilters } from "@/types/vehicle"

type SortOption = NonNullable<VehicleFilters["sortBy"]>
type ViewModeOption = NonNullable<VehicleFilters["viewMode"]>

const SORT_OPTIONS: SortOption[] = [
  "date-desc",
  "price-asc",
  "price-desc",
  "year-desc",
  "year-asc",
  "mileage-asc",
  "mileage-desc",
]

const isSortOption = (value: string): value is SortOption =>
  SORT_OPTIONS.includes(value as SortOption)

interface ViewOptionsProps {
  viewMode: ViewModeOption
  onViewModeChange: (mode: ViewModeOption) => void
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
  resultsCount: number
}

export function ViewOptions({ viewMode, onViewModeChange, sortBy, onSortChange, resultsCount }: ViewOptionsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
      <div className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{resultsCount}</span> {resultsCount === 1 ? "truck" : "trucks"} found
      </div>

      <div className="flex items-center gap-4">
        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
          <Select
            value={sortBy}
            onValueChange={(value) => {
              if (isSortOption(value)) {
                onSortChange(value)
              }
            }}
          >
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="year-desc">Year: Newest First</SelectItem>
              <SelectItem value="year-asc">Year: Oldest First</SelectItem>
              <SelectItem value="mileage-asc">Mileage: Low to High</SelectItem>
              <SelectItem value="mileage-desc">Mileage: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 border rounded-md p-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => onViewModeChange("grid")}
            title="Grid view"
          >
            <Icon name="grid_view" className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => onViewModeChange("list")}
            title="List view"
          >
            <Icon name="view_list" className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
