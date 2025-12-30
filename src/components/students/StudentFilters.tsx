import { useState } from 'react';
import { Search, Filter, Calendar, RotateCcw, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useCourses } from '@/contexts/CoursesContext';
import { format } from 'date-fns';

interface StudentFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCourse: string;
  onCourseChange: (value: string) => void;
  dateFilter: string;
  onDateFilterChange: (value: string) => void;
  recordsPerPage: number;
  onRecordsPerPageChange: (value: number) => void;
  onReset: () => void;
  onExport: () => void;
  customDateRange?: { from: Date | undefined; to: Date | undefined };
  onCustomDateRangeChange?: (range: { from: Date | undefined; to: Date | undefined }) => void;
}

export function StudentFilters({
  searchQuery,
  onSearchChange,
  selectedCourse,
  onCourseChange,
  dateFilter,
  onDateFilterChange,
  recordsPerPage,
  onRecordsPerPageChange,
  onReset,
  onExport,
  customDateRange,
  onCustomDateRangeChange,
}: StudentFiltersProps) {
  const { courses } = useCourses();
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  const handleDateFilterChange = (value: string) => {
    onDateFilterChange(value);
    if (value === 'custom') {
      setCalendarOpen(true);
    }
  };

  const handleDateSelect = (range: { from: Date | undefined; to: Date | undefined } | undefined) => {
    if (onCustomDateRangeChange && range) {
      onCustomDateRangeChange(range);
    }
  };

  const getDateFilterLabel = () => {
    if (dateFilter === 'custom' && customDateRange?.from) {
      if (customDateRange.to) {
        return `${format(customDateRange.from, 'dd MMM')} - ${format(customDateRange.to, 'dd MMM')}`;
      }
      return format(customDateRange.from, 'dd MMM yyyy');
    }
    switch (dateFilter) {
      case '7': return 'Last 7 Days';
      case '14': return 'Last 14 Days';
      case '28': return 'Last 28 Days';
      default: return 'All Time';
    }
  };
  
  return (
    <div className="glass-card rounded-2xl p-5 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, phone, or city..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-11 input-glass h-11"
          />
        </div>

        {/* Course Filter */}
        <Select value={selectedCourse} onValueChange={onCourseChange}>
          <SelectTrigger className="w-[180px] input-glass h-11">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="All Courses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {courses.map((course) => (
              <SelectItem key={course} value={course}>
                {course}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Filter */}
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <div>
              <Select value={dateFilter} onValueChange={handleDateFilterChange}>
                <SelectTrigger className="w-[180px] input-glass h-11">
                  <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span className="truncate">{getDateFilterLabel()}</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="7">Last 7 Days</SelectItem>
                  <SelectItem value="14">Last 14 Days</SelectItem>
                  <SelectItem value="28">Last 28 Days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </PopoverTrigger>
          {dateFilter === 'custom' && (
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={customDateRange?.from}
                selected={customDateRange}
                onSelect={handleDateSelect}
                numberOfMonths={2}
              />
              <div className="p-3 border-t border-border flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onCustomDateRangeChange?.({ from: undefined, to: undefined });
                    onDateFilterChange('all');
                    setCalendarOpen(false);
                  }}
                >
                  Clear
                </Button>
                <Button
                  size="sm"
                  onClick={() => setCalendarOpen(false)}
                >
                  Apply
                </Button>
              </div>
            </PopoverContent>
          )}
        </Popover>

        {/* Records Per Page */}
        <Select
          value={String(recordsPerPage)}
          onValueChange={(v) => onRecordsPerPageChange(Number(v))}
        >
          <SelectTrigger className="w-[130px] input-glass h-11">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="20">20 / page</SelectItem>
            <SelectItem value="50">50 / page</SelectItem>
            <SelectItem value="100">100 / page</SelectItem>
          </SelectContent>
        </Select>

        {/* Action Buttons */}
        <Button
          variant="outline"
          size="icon"
          onClick={onReset}
          className="btn-glass h-11 w-11"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>

        <Button
          onClick={onExport}
          className="btn-primary-gradient h-11 px-5"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
}