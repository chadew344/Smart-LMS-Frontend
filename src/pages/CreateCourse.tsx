import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Trash2,
  GripVertical,
  Video,
  FileText,
  HelpCircle,
  Upload,
  Image,
  Clock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Save,
  Eye,
  X,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { cn } from "../lib/utils";
import { createCourse } from "../store/slices/courseSlice";
import uploadService from "../services/uploadService";
import { toast } from "sonner";
import {
  type CreateCourseData,
  type CourseCategory,
  type CourseLevel,
  CategoryLabels,
  type Media,
  COURSE_CATEGORIES,
  COURSE_LEVELS,
} from "../types";
import { useAppDispatch } from "../store/hook";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface LessonItem {
  id: string;
  title: string;
  type: "video" | "reading" | "quiz";
  duration: string;
  video?: Media;
  videoFile?: string;
  content?: string;
  questions?: QuizQuestion[];
}

interface ModuleItem {
  id: string;
  title: string;
  isExpanded: boolean;
  lessons: LessonItem[];
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const CreateCourse = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [activeStep, setActiveStep] = useState(1);

  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [price, setPrice] = useState("");

  const [thumbnailUrl, setThumbnailUrl] = useState<Media>();
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState<
    Record<string, number>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [modules, setModules] = useState<ModuleItem[]>([
    {
      id: generateId(),
      title: "Module 1: Introduction",
      isExpanded: true,
      lessons: [],
    },
  ]);

  const [editingReading, setEditingReading] = useState<{
    moduleId: string;
    lessonId: string;
  } | null>(null);
  const [readingContent, setReadingContent] = useState("");

  const [editingQuiz, setEditingQuiz] = useState<{
    moduleId: string;
    lessonId: string;
  } | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);

  const addModule = () => {
    setModules([
      ...modules,
      {
        id: generateId(),
        title: `Module ${modules.length + 1}: Untitled`,
        isExpanded: true,
        lessons: [],
      },
    ]);
  };

  const removeModule = (moduleId: string) => {
    setModules(modules.filter((m) => m.id !== moduleId));
  };

  const toggleModule = (moduleId: string) => {
    setModules(
      modules.map((m) =>
        m.id === moduleId ? { ...m, isExpanded: !m.isExpanded } : m
      )
    );
  };

  const updateModuleTitle = (moduleId: string, title: string) => {
    setModules(modules.map((m) => (m.id === moduleId ? { ...m, title } : m)));
  };

  const addLesson = (moduleId: string, type: "video" | "reading" | "quiz") => {
    setModules(
      modules.map((m) => {
        if (m.id === moduleId) {
          return {
            ...m,
            lessons: [
              ...m.lessons,
              {
                id: generateId(),
                title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
                type,
                duration:
                  type === "video"
                    ? "0:00"
                    : type === "quiz"
                    ? "10 min"
                    : "5 min read",
                questions: type === "quiz" ? [] : undefined,
              },
            ],
          };
        }
        return m;
      })
    );
  };

  const removeLesson = (_moduleId: string, lessonId: string) => {
    setModules(
      modules.map((m) => ({
        ...m,
        lessons: m.lessons.filter((l) => l.id !== lessonId),
      }))
    );
  };

  const updateLesson = (
    _moduleId: string,
    lessonId: string,
    updates: Partial<LessonItem>
  ) => {
    setModules(
      modules.map((m) => ({
        ...m,
        lessons: m.lessons.map((l) =>
          l.id === lessonId ? { ...l, ...updates } : l
        ),
      }))
    );
  };

  const openReadingEditor = (moduleId: string, lessonId: string) => {
    const module = modules.find((m) => m.id === moduleId);
    const lesson = module?.lessons.find((l) => l.id === lessonId);
    setReadingContent(lesson?.content || "");
    setEditingReading({ moduleId, lessonId });
  };

  const saveReading = () => {
    if (editingReading) {
      updateLesson(editingReading.moduleId, editingReading.lessonId, {
        content: readingContent,
      });
      setEditingReading(null);
      setReadingContent("");
      toast.success("Reading content saved!");
    }
  };

  const openQuizBuilder = (moduleId: string, lessonId: string) => {
    const module = modules.find((m) => m.id === moduleId);
    const lesson = module?.lessons.find((l) => l.id === lessonId);
    setQuizQuestions(lesson?.questions || []);
    setEditingQuiz({ moduleId, lessonId });
  };

  const saveQuiz = () => {
    if (editingQuiz) {
      updateLesson(editingQuiz.moduleId, editingQuiz.lessonId, {
        questions: quizQuestions,
      });
      setEditingQuiz(null);
      setQuizQuestions([]);
    }
  };

  const addQuizQuestion = () => {
    setQuizQuestions([
      ...quizQuestions,
      {
        id: generateId(),
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
      },
    ]);
  };

  const updateQuizQuestion = (
    questionId: string,
    updates: Partial<QuizQuestion>
  ) => {
    setQuizQuestions(
      quizQuestions.map((q) => (q.id === questionId ? { ...q, ...updates } : q))
    );
  };

  const removeQuizQuestion = (questionId: string) => {
    setQuizQuestions(quizQuestions.filter((q) => q.id !== questionId));
  };

  const handleThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingThumbnail(true);

      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result as string);
      };
      reader.readAsDataURL(file);

      const uploadResult = await uploadService.uploadImage(file);
      setThumbnailUrl(uploadResult);

      toast.success("Thumbnail uploaded successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload thumbnail");
      setThumbnail(null);
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const handleVideoUpload = async (
    moduleId: string,
    lessonId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadKey = `${moduleId}-${lessonId}`;

    try {
      setUploadingVideos((prev) => ({ ...prev, [uploadKey]: 0 }));

      const uploadResult: Media = await uploadService.uploadVideo(
        file,
        (progress) => {
          setUploadingVideos((prev) => ({
            ...prev,
            [uploadKey]: progress,
          }));
        }
      );

      updateLesson(moduleId, lessonId, {
        video: {
          url: uploadResult.url,
          publicId: uploadResult.publicId,
          format: uploadResult.format,
          size: uploadResult.size,
          resourceType: uploadResult.resourceType,
        },
        videoFile: file.name,
      });

      toast.success("Video uploaded successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload video");
    } finally {
      setUploadingVideos((prev) => {
        const newState = { ...prev };
        delete newState[uploadKey];
        return newState;
      });
    }
  };

  const parseDuration = (duration: string): number => {
    const match = duration.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const prepareCourseData = (): CreateCourseData => {
    return {
      title: courseTitle.trim(),
      description: courseDescription.trim(),
      category: category as CourseCategory,
      level: level as CourseLevel,
      price: price ? parseFloat(price) : 0,
      thumbnail: thumbnailUrl, // This is now validated
      modules: modules.map((module, moduleIndex) => ({
        title: module.title.trim(),
        description: undefined,
        order: moduleIndex,
        lessons: module.lessons.map((lesson, lessonIndex) => ({
          title: lesson.title.trim(),
          description: undefined,
          type: lesson.type,
          duration: parseDuration(lesson.duration),
          order: lessonIndex,
          video: lesson.type === "video" ? lesson.video : undefined,
          readingContent:
            lesson.type === "reading" ? lesson.content : undefined,
          quizId: undefined,
          resources: [],
        })),
      })),
      requirements: [],
      learningOutcomes: [],
      enableSequentialLearning: false,
    };
  };

  const validateCourseData = (): boolean => {
    // Basic info validation
    if (!courseTitle.trim()) {
      toast.error("Please enter a course title");
      setActiveStep(1);
      return false;
    }

    if (!courseDescription.trim()) {
      toast.error("Please enter a course description");
      setActiveStep(1);
      return false;
    }

    if (!category) {
      toast.error("Please select a category");
      setActiveStep(1);
      return false;
    }

    if (!level) {
      toast.error("Please select a level");
      setActiveStep(1);
      return false;
    }

    if (!Object.values(COURSE_CATEGORIES).includes(category as any)) {
      toast.error("Invalid category selected");
      setActiveStep(1);
      return false;
    }

    if (!Object.values(COURSE_LEVELS).includes(level as any)) {
      toast.error("Invalid level selected");
      setActiveStep(1);
      return false;
    }

    if (price && (isNaN(parseFloat(price)) || parseFloat(price) < 0)) {
      toast.error("Please enter a valid price");
      setActiveStep(1);
      return false;
    }

    if (!thumbnailUrl) {
      toast.error("Please upload a course thumbnail");
      setActiveStep(1);
      return false;
    }

    if (modules.length === 0) {
      toast.error("Please add at least one module");
      setActiveStep(2);
      return false;
    }

    // Check for empty module titles
    const hasEmptyModuleTitle = modules.some((m) => !m.title.trim());
    if (hasEmptyModuleTitle) {
      toast.error("All modules must have titles");
      setActiveStep(2);
      return false;
    }

    // Lesson validation
    const hasLessons = modules.some((m) => m.lessons.length > 0);
    if (!hasLessons) {
      toast.error("Please add at least one lesson");
      setActiveStep(2);
      return false;
    }

    // Check for empty lesson titles
    for (const module of modules) {
      const hasEmptyLessonTitle = module.lessons.some((l) => !l.title.trim());
      if (hasEmptyLessonTitle) {
        toast.error(`Module "${module.title}" has lessons without titles`);
        setActiveStep(2);
        return false;
      }
    }

    // Video validation
    const missingVideos = modules.some((module) =>
      module.lessons.some((lesson) => lesson.type === "video" && !lesson.video)
    );
    if (missingVideos) {
      toast.error("Please upload videos for all video lessons");
      setActiveStep(2);
      return false;
    }

    // Reading content validation
    const missingReadingContent = modules.some((module) =>
      module.lessons.some(
        (lesson) =>
          lesson.type === "reading" &&
          (!lesson.content || !lesson.content.trim())
      )
    );
    if (missingReadingContent) {
      toast.error("Please add content for all reading lessons");
      setActiveStep(2);
      return false;
    }

    // Quiz validation
    const missingQuizQuestions = modules.some((module) =>
      module.lessons.some(
        (lesson) =>
          lesson.type === "quiz" &&
          (!lesson.questions || lesson.questions.length === 0)
      )
    );
    if (missingQuizQuestions) {
      toast.error("Please add questions for all quiz lessons");
      setActiveStep(2);
      return false;
    }

    // Validate quiz questions are complete
    for (const module of modules) {
      for (const lesson of module.lessons) {
        if (lesson.type === "quiz" && lesson.questions) {
          const incompleteQuestions = lesson.questions.some(
            (q) => !q.question.trim() || q.options.some((opt) => !opt.trim())
          );
          if (incompleteQuestions) {
            toast.error(`Quiz in "${lesson.title}" has incomplete questions`);
            setActiveStep(2);
            return false;
          }
        }
      }
    }

    return true;
  };

  const handlePublish = async () => {
    if (!validateCourseData()) {
      return;
    }

    if (uploadingThumbnail || Object.keys(uploadingVideos).length > 0) {
      toast.error("Please wait for uploads to complete");
      return;
    }

    try {
      setIsSubmitting(true);

      const courseData = prepareCourseData();

      const createdCourse = await dispatch(createCourse(courseData)).unwrap();

      toast.success("Course published successfully! 🎉");

      navigate(`/instructor/courses/${createdCourse._id}`);
    } catch (error: any) {
      toast.error(error || "Failed to publish course");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

  const steps = [
    { num: 1, label: "Details" },
    { num: 2, label: "Content" },
    { num: 3, label: "Publish" },
  ];

  return (
    <div className=" mx-auto px-4 pb-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Create New Course
          </h1>
          <p className="text-muted-foreground mt-1">
            Build your course step by step
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          <Button variant="outline" className="gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </Button>
        </div>
      </div>

      <div className="relative">
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-border" />
        <div className="relative flex justify-between">
          {steps.map((step) => (
            <button
              key={step.num}
              onClick={() => setActiveStep(step.num)}
              className={cn(
                "flex flex-col items-center gap-2 relative z-10",
                activeStep >= step.num
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center font-semibold border-2 bg-background transition-colors",
                  activeStep >= step.num
                    ? "bg-primary/20 text-primary border-primary"
                    : "bg-secondary text-muted-foreground border-border"
                )}
              >
                {step.num}
              </div>
              <span className="text-sm font-medium">{step.label}</span>
            </button>
          ))}
        </div>
      </div>

      {activeStep === 1 && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
              <div>
                <Label htmlFor="title" className="text-base font-semibold">
                  Course Title
                </Label>
                <Input
                  id="title"
                  placeholder="e.g. Complete Web Development Bootcamp"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="h-12 text-base mt-2"
                />
              </div>

              <div>
                <Label
                  htmlFor="description"
                  className="text-base font-semibold"
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="What will students learn in this course?"
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  className="min-h-[120px] resize-none mt-2"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-base font-semibold">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="h-12 mt-2">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>

                    <SelectContent>
                      {Object.entries(CategoryLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-base font-semibold">Level</Label>
                  <Select value={level} onValueChange={setLevel}>
                    <SelectTrigger className="h-12 mt-2">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="price" className="text-base font-semibold">
                  Price (USD)
                </Label>
                <div className="relative mt-2">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="h-12 pl-8"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Leave empty for free course
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Image className="h-5 w-5 text-primary" />
                  <Label className="text-base font-semibold">
                    Course Thumbnail
                  </Label>
                </div>
              </div>

              <div className="space-y-3">
                <div className="relative h-48 border-2 border-dashed border-border rounded-xl overflow-hidden">
                  <input
                    id="thumbnail-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                    disabled={uploadingThumbnail}
                  />

                  <label
                    htmlFor="thumbnail-upload"
                    className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/50 transition-colors"
                  >
                    {uploadingThumbnail ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                        <span className="text-sm text-muted-foreground">
                          Uploading...
                        </span>
                      </div>
                    ) : thumbnail ? (
                      <img
                        src={thumbnail}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm font-medium text-foreground">
                          Upload thumbnail
                        </span>
                        <span className="text-xs text-muted-foreground">
                          16:9 ratio recommended (max 5MB)
                        </span>
                      </>
                    )}
                  </label>

                  {thumbnail && !uploadingThumbnail && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={(e) => {
                        e.preventDefault();
                        setThumbnail(null);
                        // setThumbnailUrl();
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeStep === 2 && !editingQuiz && (
        <div className="space-y-6">
          <div className="flex gap-4 p-4 bg-card border border-border rounded-xl">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="font-medium">{modules.length} modules</span>
            </div>
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              <span className="font-medium">{totalLessons} lessons</span>
            </div>
          </div>

          <div className="space-y-4">
            {modules.map((module, _moduleIndex) => (
              <div
                key={module.id}
                className="bg-card border border-border rounded-xl overflow-hidden"
              >
                <div className="flex items-center gap-3 p-4 bg-secondary/30">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                  <Input
                    value={module.title}
                    onChange={(e) =>
                      updateModuleTitle(module.id, e.target.value)
                    }
                    className="flex-1 bg-transparent border-0 p-0 h-auto text-base font-semibold focus-visible:ring-0"
                  />
                  <Badge variant="secondary">
                    {module.lessons.length} lessons
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleModule(module.id)}
                  >
                    {module.isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                  {modules.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeModule(module.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>

                {module.isExpanded && (
                  <div className="p-4 space-y-2">
                    {module.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg"
                      >
                        <div className="shrink-0">
                          {lesson.type === "video" && (
                            <Video className="h-5 w-5 text-primary" />
                          )}
                          {lesson.type === "reading" && (
                            <FileText className="h-5 w-5 text-success" />
                          )}
                          {lesson.type === "quiz" && (
                            <HelpCircle className="h-5 w-5 text-warning" />
                          )}
                        </div>
                        <Input
                          value={lesson.title}
                          onChange={(e) =>
                            updateLesson(module.id, lesson.id, {
                              title: e.target.value,
                            })
                          }
                          className="flex-1 bg-transparent border-0 p-0 h-auto text-sm focus-visible:ring-0"
                        />
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {lesson.duration}
                        </div>

                        {lesson.type === "video" && (
                          <>
                            <input
                              id={`video-${module.id}-${lesson.id}`}
                              type="file"
                              accept="video/*"
                              onChange={(e) =>
                                handleVideoUpload(module.id, lesson.id, e)
                              }
                              className="hidden"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                document
                                  .getElementById(
                                    `video-${module.id}-${lesson.id}`
                                  )
                                  ?.click()
                              }
                              disabled={
                                uploadingVideos[`${module.id}-${lesson.id}`] !==
                                undefined
                              }
                            >
                              {uploadingVideos[`${module.id}-${lesson.id}`] !==
                              undefined ? (
                                <>
                                  <div className="h-4 w-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-2" />
                                  {uploadingVideos[`${module.id}-${lesson.id}`]}
                                  %
                                </>
                              ) : lesson.video ? (
                                <>
                                  <CheckCircle2 className="h-4 w-4 mr-1 text-success" />
                                  Uploaded
                                </>
                              ) : (
                                <>
                                  <Upload className="h-4 w-4 mr-1" />
                                  Upload
                                </>
                              )}
                            </Button>

                            {lesson.videoFile && (
                              <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                                {lesson.videoFile}
                              </span>
                            )}
                          </>
                        )}

                        {lesson.type === "reading" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs group-hover:opacity-100 transition-opacity"
                            onClick={() =>
                              openReadingEditor(module.id, lesson.id)
                            }
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            {lesson.content ? "Edit" : "Add"} Content
                          </Button>
                        )}

                        {lesson.type === "quiz" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              openQuizBuilder(module.id, lesson.id)
                            }
                          >
                            <HelpCircle className="h-4 w-4 mr-1" />
                            {lesson.questions?.length ? "Edit" : "Add"}{" "}
                            Questions
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLesson(module.id, lesson.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addLesson(module.id, "video")}
                      >
                        <Video className="h-4 w-4 mr-1" />
                        Video Lesson
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addLesson(module.id, "reading")}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Reading
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addLesson(module.id, "quiz")}
                      >
                        <HelpCircle className="h-4 w-4 mr-1" />
                        Quiz
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <Button onClick={addModule} className="w-full" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add New Module
          </Button>
        </div>
      )}

      {activeStep === 2 && editingReading && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Reading Content Editor
              </h2>
              <p className="text-sm text-muted-foreground">
                Add text content for this reading lesson
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditingReading(null)}>
                Cancel
              </Button>
              <Button onClick={saveReading}>Save Content</Button>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border/50 p-6">
            <Label className="text-sm font-medium mb-3 block">Content</Label>
            <Textarea
              placeholder="Write your reading content here... You can include text, explanations, code examples, and more."
              value={readingContent}
              onChange={(e) => setReadingContent(e.target.value)}
              className="min-h-[400px] resize-none font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Tip: Use clear formatting and break content into digestible
              sections.
            </p>
          </div>
        </div>
      )}

      {activeStep === 2 && editingQuiz && (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Quiz Builder
              </h2>
              <p className="text-muted-foreground">
                Create questions for your quiz
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditingQuiz(null)}>
                Cancel
              </Button>
              <Button onClick={saveQuiz}>Save Quiz</Button>
            </div>
          </div>

          <div className="space-y-4">
            {quizQuestions.map((q, qIndex) => (
              <div
                key={q.id}
                className="p-4 bg-secondary/20 rounded-xl space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="shrink-0">
                      {qIndex + 1}
                    </Badge>
                    <Input
                      placeholder="Enter your question"
                      value={q.question}
                      onChange={(e) =>
                        updateQuizQuestion(q.id, { question: e.target.value })
                      }
                      className="flex-1 text-base"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQuizQuestion(q.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                <div className="space-y-2 pl-11">
                  {q.options.map((option, optIndex) => (
                    <button
                      key={optIndex}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-colors text-left",
                        q.correctAnswer === optIndex
                          ? "border-success bg-success/5"
                          : "border-border hover:border-primary/50"
                      )}
                      onClick={() =>
                        updateQuizQuestion(q.id, { correctAnswer: optIndex })
                      }
                    >
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                          q.correctAnswer === optIndex
                            ? "border-success bg-success"
                            : "border-muted-foreground"
                        )}
                      >
                        {q.correctAnswer === optIndex && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <Input
                        placeholder={`Option ${optIndex + 1}`}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...q.options];
                          newOptions[optIndex] = e.target.value;
                          updateQuizQuestion(q.id, { options: newOptions });
                        }}
                        className="flex-1 border-0 p-0 h-auto bg-transparent focus-visible:ring-0"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </button>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground pl-11">
                  Click an option to mark it as correct
                </p>
              </div>
            ))}

            <Button
              onClick={addQuizQuestion}
              variant="outline"
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>
        </div>
      )}

      {activeStep === 3 && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="h-8 w-8 text-success" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Ready to Publish!
              </h2>
              <p className="text-muted-foreground mt-2">
                Your course has {modules.length} modules and {totalLessons}{" "}
                lessons. Review everything before publishing.
              </p>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Title</span>
              <span className="font-medium text-foreground">
                {courseTitle || "Untitled"}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Category</span>
              <span className="font-medium text-foreground">
                {CategoryLabels[category as CourseCategory] || "Not set"}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Level</span>
              <span className="font-medium text-foreground">
                {level || "Not set"}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Price</span>
              <span className="font-medium text-foreground">
                {price ? `${price}` : "Free"}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Content</span>
              <span className="font-medium text-foreground">
                {modules.length} modules, {totalLessons} lessons
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => setActiveStep(2)}
            >
              Edit Content
            </Button>
            <Button
              size="lg"
              className="flex-1 gap-2"
              onClick={handlePublish}
              disabled={
                isSubmitting ||
                uploadingThumbnail ||
                Object.keys(uploadingVideos).length > 0
              }
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Publish Course
                </>
              )}
            </Button>
          </div>

          {(uploadingThumbnail || Object.keys(uploadingVideos).length > 0) && (
            <p className="text-sm text-warning text-center">
              ⏳ Uploads in progress. Please wait before publishing.
            </p>
          )}
        </div>
      )}

      <div className="flex justify-between pt-6 border-t border-border">
        <Button
          variant="outline"
          onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
          disabled={activeStep === 1}
        >
          Previous
        </Button>
        <Button
          onClick={() => setActiveStep(Math.min(3, activeStep + 1))}
          disabled={activeStep === 3}
        >
          {activeStep === 2 ? "Review & Publish" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default CreateCourse;
