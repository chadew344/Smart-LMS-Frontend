import { useState, useEffect } from "react";
import { Filter, Grid, List, SlidersHorizontal } from "lucide-react";
import { CourseCard } from "../components/common/CourseCard";
import { SearchInput } from "../components/common/SearchInput";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { cn } from "../lib/utils";

import { getCourses } from "../store/slices/courseSlice";
import {
  categories,
  CategoryLabels,
  LevelLabels,
  levels,
  type SelectedCategory,
  type SelectedLevel,
} from "../types";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { useLocation } from "react-router-dom";

export const BrowseCourses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<SelectedCategory>("all");
  const [selectedLevel, setSelectedLevel] = useState<SelectedLevel>("all");

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("popular");

  const location = useLocation();
  const dispatch = useAppDispatch();

  const courses = useAppSelector((state) => state.course);
  // const { isLoading, isError, error } = useSelector(
  //   (state: RootState) => state.course
  // );

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(
        getCourses({
          search: searchQuery || undefined,
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          level: selectedLevel === "all" ? undefined : selectedLevel,
        })
      );
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchQuery, selectedCategory, selectedLevel, dispatch]);

  return (
    <div
      className={cn(
        "container mx-auto px-4 space-y-6 animate-fade-in",
        location.pathname === "/courses" && "my-5"
      )}
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
          Browse Courses
        </h1>
        <p className="text-muted-foreground">
          Explore our collection of {100}+ courses
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search courses..."
          className="flex-1"
        />

        <div className="flex flex-wrap gap-3">
          {levels.map((level) => {
            const label = level === "all" ? "All Levels" : LevelLabels[level];
            return (
              <Badge
                key={level}
                variant={selectedLevel === level ? "default" : "outline"}
                className={cn(
                  "cursor-pointer px-4 py-2 text-sm transition-colors",
                  selectedLevel === level
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "hover:bg-secondary"
                )}
                onClick={() => setSelectedLevel(level)}
              >
                {label}
              </Badge>
            );
          })}

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-none h-10",
                viewMode === "grid" && "bg-secondary"
              )}
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-none h-10",
                viewMode === "list" && "bg-secondary"
              )}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const label = category === "all" ? "All" : CategoryLabels[category];

          return (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={cn(
                "cursor-pointer px-4 py-2 text-sm transition-colors",
                selectedCategory === category
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "hover:bg-secondary"
              )}
              onClick={() => setSelectedCategory(category)}
            >
              {label}
            </Badge>
          );
        })}
      </div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {courses.pagination?.total} courses
        </p>
      </div>

      {courses.pagination?.total ? (
        <div
          className={cn(
            viewMode === "grid"
              ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          )}
        >
          {courses.courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              variant={viewMode === "list" ? "horizontal" : "default"}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg font-medium text-foreground mb-2">
            No courses found
          </p>
          <p className="text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
};

export default BrowseCourses;
